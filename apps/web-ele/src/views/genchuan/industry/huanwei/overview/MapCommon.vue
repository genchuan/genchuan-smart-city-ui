<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>

    <!-- 左侧地区切换按钮 -->
    <div class="buttons-overlay">
      <div v-for="district in districtList" :key="district.id"
           class="district-button" :class="{ active: currentDistrict === district.name }"
           @click="switchDistrict(district)">
        <div class="button-content">
          <div class="button-title">{{ district.name }}</div>
          <div class="button-hint">点击切换</div>
        </div>
      </div>
    </div>

    <!-- 图例：设备统计信息（纯文字） -->
    <div class="legend">
      <div class="legend-group">
        <div class="legend-items">
          <div v-for="item in legendItems" :key="item.label" class="legend-item">
            <span>{{ item.label }}: {{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, ref, onUnmounted, watch, defineExpose, defineEmits, computed } from 'vue'
import vehicleIcon from '../images/vehicle.png' // 车辆图标
// 导入模拟数据
import { districtList as importedDistrictList, mockVehicleData as importedMockVehicleData } from './mockData'  // 根据实际路径调整

const props = defineProps({
  idName: { type: String, default: 'satelliteDistrictMap' },
  vehicleList: { type: Array, default: () => [] },
  deviceStats: { type: Object, default: () => ({ total:0, online:0, offline:0, fault:0 }) }
})

// 地区列表（使用导入的数据包装为 ref）
const districtList = ref(importedDistrictList)

// 模拟车辆数据（直接使用导入的数组）
const mockVehicleData = importedMockVehicleData

// 图例项（纯文字）
const legendItems = computed(() => [
  { label: '设备总数', value: props.deviceStats.total },
  { label: '在线数', value: props.deviceStats.online },
  { label: '离线数', value: props.deviceStats.offline },
  { label: '故障数', value: props.deviceStats.fault }
])

// 地图相关变量
const mapInstance = ref(null)
const infoWindow = ref(null)
const districtBoundaryLine = ref(null)
const mapInitialized = ref(false)
const boundaryLoading = ref(false)
const currentDistrict = ref('东埔街道')
const isInfoWindowOpen = ref(false)
const layers = ref({ vehicle: null, district: null })
const emit = defineEmits(['vehicleClick'])

// 计算当前显示的车辆（根据所选地区过滤）
const displayVehicleList = computed(() => props.vehicleList.length ? props.vehicleList : mockVehicleData)
const filteredVehicleList = computed(() => displayVehicleList.value.filter(v => v.district === currentDistrict.value))

// 地区配置
const districtConfig = ref({
  name: '东埔街道',
  adcode: '441602001',
  drawBorder: true,
  borderColor: '#ff0000', // 红色边界
  borderWidth: 2,
  center: {lat: 23.737, lng: 114.701}
})

// 边界缓存
const boundaryCache = new Map()

// ---------- 工具函数 ----------
const safeCloseInfoWindow = () => {
  if (infoWindow.value && isInfoWindowOpen.value) {
    try { infoWindow.value.close(); isInfoWindowOpen.value = false } catch (e) { console.warn(e); isInfoWindowOpen.value = false }
  }
}

const safeOpenInfoWindow = (content, position) => {
  if (!infoWindow.value || !mapInstance.value) return false
  try {
    safeCloseInfoWindow()
    infoWindow.value.setContent(content)
    infoWindow.value.setPosition(position)
    infoWindow.value.open()
    isInfoWindowOpen.value = true
    return true
  } catch (e) { console.error(e); isInfoWindowOpen.value = false; return false }
}

const resetLayers = () => {
  Object.values(layers.value).forEach(l => { if (l) try { l.destroy() } catch (e) { console.warn(e) } })
  layers.value = { vehicle: null, district: null }
  safeCloseInfoWindow()
}

// ---------- 生成确定性多边形（模拟边界） ----------
const generateDeterministicPolygon = (center, adcode) => {
  const idNum = parseInt(adcode.slice(-3)) || 1
  const lat = center.lat
  const lng = center.lng
  const paths = []
  const seed = idNum + parseInt(adcode || '0')
  const baseRadius = 0.008 + (seed % 5) * 0.002
  const pointCount = 12
  for (let i = 0; i < pointCount; i++) {
    const angle = (i * 2 * Math.PI) / pointCount
    const variation1 = Math.sin(seed * 0.3 + i * 0.5) * 0.3
    const variation2 = Math.cos(seed * 0.2 + i * 0.7) * 0.2
    const variation3 = Math.sin(seed * 0.4 + i * 0.9) * 0.25
    const radiusVariation = 1 + variation1 + variation2 + variation3
    const currentRadius = baseRadius * radiusVariation
    const angleOffset = seed * 0.05
    const pointLat = lat + currentRadius * Math.cos(angle + angleOffset)
    const pointLng = lng + currentRadius * Math.sin(angle + angleOffset)
    paths.push(new TMap.LatLng(pointLat, pointLng))
  }
  if (paths.length > 0) paths.push(paths[0])
  return paths
}

// ---------- 绘制边界线 ----------
const drawBoundaryLine = (map, paths, config) => {
  if (districtBoundaryLine.value) {
    try { districtBoundaryLine.value.destroy() } catch (e) { console.warn('销毁旧边界线失败:', e) }
    districtBoundaryLine.value = null
  }
  try {
    districtBoundaryLine.value = new TMap.MultiPolyline({
      map: map,
      styles: {
        boundary: new TMap.PolylineStyle({
          color: config.borderColor || '#ff0000',
          width: config.borderWidth || 2,
          lineCap: 'round',
          enableBloom: false
        })
      },
      geometries: [{
        id: 'district-boundary',
        styleId: 'boundary',
        paths: paths,
        properties: { name: config.name, adcode: config.adcode, type: 'district' }
      }]
    })
    layers.value.district = districtBoundaryLine.value
  } catch (error) {
    console.error('绘制边界线失败:', error)
  }
}

// ---------- 使用模拟边界 ----------
const useDeterministicBoundary = (map, config) => {
  console.log(`使用模拟边界: ${config.name}`)
  const currentDistrictData = districtList.value.find(d => d.name === config.name)
  if (!currentDistrictData) {
    drawBoundaryLine(map, generateDeterministicPolygon(config.center, config.adcode), config)
    boundaryLoading.value = false
    return
  }
  const cacheKey = `${config.adcode}-${config.name}`
  if (boundaryCache.has(cacheKey)) {
    drawBoundaryLine(map, boundaryCache.get(cacheKey), config)
  } else {
    const simulatedBoundary = generateDeterministicPolygon(currentDistrictData.center, currentDistrictData.adcode)
    boundaryCache.set(cacheKey, simulatedBoundary)
    drawBoundaryLine(map, simulatedBoundary, config)
  }
  boundaryLoading.value = false
}

// ---------- 加载行政区划边界 ----------
const loadDistrictBoundary = (map, config) => {
  if (districtBoundaryLine.value) {
    try { districtBoundaryLine.value.destroy() } catch (e) { console.warn('清除边界线失败:', e) }
    districtBoundaryLine.value = null
  }
  if (!config.drawBorder) return
  boundaryLoading.value = true

  // 尝试使用腾讯地图 District 服务
  if (window.TMap && window.TMap.service && window.TMap.service.District) {
    try {
      const districtService = new TMap.service.District({ polygon: 2 })
      districtService.search({ keyword: config.adcode || config.name })
        .then((result) => {
          if (result && result.result && result.result.length > 0) {
            const paths = result.result[0][0].polygon
            if (paths && paths.length > 0) {
              drawBoundaryLine(map, paths, config)
              boundaryLoading.value = false
              return
            } else {
              useDeterministicBoundary(map, config)
            }
          } else {
            useDeterministicBoundary(map, config)
          }
        }).catch(() => useDeterministicBoundary(map, config))
    } catch (error) {
      useDeterministicBoundary(map, config)
    }
  } else {
    useDeterministicBoundary(map, config)
  }
}

// ---------- 车辆标记相关 ----------
const getVehicleStyles = () => ({
  default: new TMap.MarkerStyle({
    width: 40, height: 40,
    anchor: { x: 20, y: 40 },
    src: vehicleIcon
  })
})

const getVehicleTooltip = (properties) => {
  const labelStyle = 'width:100px;text-align:right;font-weight:bold;margin-right:6px;flex-shrink:0;'
  const valueStyle = 'flex:1;text-align:left;word-break:break-all;'
  const rowStyle = 'display:flex;align-items:center;margin:8px 0;'
  const statusColor = properties.status === '正常' ? 'green' : properties.status === '预警' ? 'orange' : properties.status === '离线' ? 'red' : 'gray'
  return `
    <div style="padding:12px;font-size:14px;color:#333;background:white;border:1px solid #ccc;min-width:320px;border-radius:4px;">
      <div style="margin-bottom:12px;font-weight:bold;color:#00c6ff;text-align:center;border-bottom:1px solid #eee;padding-bottom:8px;">环卫车辆信息</div>
      <div style="${rowStyle}"><span style="${labelStyle}">车辆ID：</span><span style="${valueStyle}">${properties.vehicle_id || properties.id || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">车牌号：</span><span style="${valueStyle}">${properties.plate_number || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">车辆类型：</span><span style="${valueStyle}">${properties.vehicle_type || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">状态：</span><span style="${valueStyle};color:${statusColor};font-weight:500;">${properties.status || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">速度：</span><span style="${valueStyle}">${properties.speed || 0} km/h</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">所在区域：</span><span style="${valueStyle}">${properties.district || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">司机：</span><span style="${valueStyle}">${properties.driver || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">联系电话：</span><span style="${valueStyle}">${properties.contact_phone || '未知'}</span></div>
    </div>
  `
}

const handleVehicleClick = (e) => {
  const props = e.geometry.properties
  if (props) {
    const content = getVehicleTooltip(props)
    safeOpenInfoWindow(content, e.geometry.position)
    emit('vehicleClick', props)
  }
}

const createVehicleMarkers = (map) => {
  const markerData = []
  filteredVehicleList.value.forEach((item, idx) => {
    const lat = item.lat, lng = item.lng
    if (item && typeof lng === 'number' && typeof lat === 'number') {
      markerData.push({
        id: `vehicle-${item.vehicle_id || item.id || idx}`,
        styleId: 'default',
        position: new TMap.LatLng(lat, lng),
        properties: { ...item, type: 'vehicle' }
      })
    }
  })
  if (markerData.length) {
    try {
      layers.value.vehicle = new TMap.MultiMarker({
        id: 'vehicle-layer',
        map: map,
        styles: getVehicleStyles(),
        geometries: markerData
      })
      layers.value.vehicle.on('click', handleVehicleClick)
      console.log('车辆标记生成，数量：', markerData.length)
    } catch (e) { console.error('创建车辆标记失败:', e) }
  }
}

const refreshVehicleMarkers = () => {
  if (mapInitialized.value && mapInstance.value) {
    if (layers.value.vehicle) {
      try { layers.value.vehicle.destroy() } catch (e) { console.warn(e) }
      layers.value.vehicle = null
    }
    createVehicleMarkers(mapInstance.value)
  }
}

// ---------- 切换地区 ----------
const switchDistrict = (district) => {
  if (!mapInstance.value) return
  currentDistrict.value = district.name
  districtConfig.value = { ...districtConfig.value, name: district.name, adcode: district.adcode, center: district.center }
  mapInstance.value.setCenter(new TMap.LatLng(district.center.lat, district.center.lng))
  mapInstance.value.setZoom(13)
  loadDistrictBoundary(mapInstance.value, districtConfig.value)
  refreshVehicleMarkers()
  safeCloseInfoWindow()
}

// ---------- 地图初始化 ----------
const initMap = () => {
  const callbackName = `initMap_${props.idName}`
  const script = document.createElement('script')
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&libraries=service&callback=${callbackName}`
  script.async = true
  window[callbackName] = () => {
    mapCallback()
    delete window[callbackName]
  }
  document.head.appendChild(script)
}

const mapCallback = () => {
  const container = document.getElementById(props.idName)
  if (!container) return console.error('地图容器不存在')
  const map = new TMap.Map(container, {
    center: new TMap.LatLng(districtConfig.value.center.lat, districtConfig.value.center.lng),
    zoom: 13,
    baseMap: { type: 'satellite' },
    enablePitch: true, enableRotate: true, pitch: 0, rotation: 0
  })
  mapInstance.value = map
  mapInitialized.value = true
  infoWindow.value = null
  isInfoWindowOpen.value = false
  resetLayers()
  loadDistrictBoundary(map, districtConfig.value)
  createVehicleMarkers(map)
  // 延迟创建信息窗
  setTimeout(() => {
    if (!infoWindow.value && mapInstance.value) {
      infoWindow.value = new TMap.InfoWindow({
        map: mapInstance.value,
        position: new TMap.LatLng(0, 0),
        content: '',
        offset: { x: 0, y: -30 },
        visible: false
      })
      try { infoWindow.value.close() } catch (e) { console.warn(e) }
    }
  }, 1000)
}

// 刷新地图
const refreshMap = () => {
  if (mapInitialized.value && mapInstance.value) {
    resetLayers()
    loadDistrictBoundary(mapInstance.value, districtConfig.value)
    createVehicleMarkers(mapInstance.value)
  } else initMap()
}

// 监听车辆数据变化
watch(() => filteredVehicleList.value, () => refreshVehicleMarkers(), { deep: true })

// 生命周期
onMounted(() => initMap())
onUnmounted(() => {
  safeCloseInfoWindow()
  resetLayers()
  if (infoWindow.value) try { infoWindow.value.destroy() } catch (e) { console.warn(e) }
  if (districtBoundaryLine.value) try { districtBoundaryLine.value.destroy() } catch (e) { console.warn(e) }
  if (mapInstance.value) try { mapInstance.value.destroy() } catch (e) { console.warn(e) }
  mapInitialized.value = false
})

// 暴露方法
defineExpose({ refreshMap, switchDistrict, getCurrentDistrict: () => currentDistrict.value })
</script>

<style scoped>
.map-container { position: relative; width: 100%; height: 100%; }
.map-common-css { width: 100%; height: 100%; border-radius: 8px; overflow: hidden; }
.buttons-overlay {
  position: absolute; top: 4vh; left: 0.2vw; z-index: 1000;
  display: flex; flex-direction: column; gap: 0.5vw; width: 120px;
}
.district-button {
  box-sizing: border-box; display: flex; align-items: center; width: 100%; padding: 0.5vw;
  cursor: pointer; background: rgb(0 30 60 / 85%); border: 1px solid rgb(0 204 255 / 30%);
  border-radius: 8px; transition: all 0.3s ease; height: 60px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.district-button:hover {
  background: rgb(0 30 60 / 90%); border-color: rgb(0 204 255 / 60%); transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,204,255,0.3);
}
.district-button.active {
  background: rgb(0 30 60 / 95%); border-color: rgb(0 204 255); box-shadow: 0 0 10px rgba(0,204,255,0.5);
}
.button-content { flex: 1; overflow: hidden; }
.button-title { padding-bottom: 0.5vh; font-size: 0.7vw; color: rgb(255 255 255 / 70%); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.button-hint { font-size: 0.6vw; color: rgb(0 204 255 / 80%); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 图例样式（纯文字） */
.legend {
  position: absolute; background: rgba(0, 0, 0, 0.5); box-sizing: border-box; width: 100%;
  bottom: 0; left: 0; display: flex; justify-content: right; gap: 2vw; padding: 0.5vw; flex-wrap: wrap;
}
.legend-group { display: flex; flex-direction: column; align-items: center; }
.legend-items { display: flex; flex-direction: row; gap: 1vw; align-items: center; }
.legend-item {
  font-size: 0.8vw; color: #fff; background: rgba(0, 0, 0, 0.3);
  padding: 0.2vw 0.5vw; border-radius: 4px;
}
</style>
