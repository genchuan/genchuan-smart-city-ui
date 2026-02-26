<template>
  <div class="map-container">
    <div ref="mapRef" class="map-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { loadTMap } from '#/utils/useTMap.ts'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const mapRef = ref(null)
let map = null
let markerLayers = {}
let infoWindow = null
let TMapInstance = null

const initMap = async () => {
  if (!mapRef.value) return

  try {
    const TMap = await loadTMap()
    TMapInstance = TMap

    // 初始化地图
    map = new TMap.Map(mapRef.value, {
      center: new TMap.LatLng(24.5123, 117.6589),
      zoom: 12
    })

    // 初始化 infoWindow，初始关闭
    infoWindow = new TMap.InfoWindow({
      map,
      position: new TMap.LatLng(0, 0),
      offset: { x: 0, y: -32 } // 偏移使信息窗口在标记上方
    })
    infoWindow.close()

    initMarkerLayer()
    renderMarkers()

  } catch (err) {
    console.error('地图初始化失败:', err)
  }
}

// 初始化状态图层，每个状态一个 MultiMarker
const initMarkerLayer = () => {
  const createLayer = (id, src) => {
    const layer = new TMapInstance.MultiMarker({
      id,
      map,
      enableCollision: false,
      styles: {
        normal: new TMapInstance.MarkerStyle({
          width: 25,
          height: 35,
          anchor: { x: 12.5, y: 35 },
          src
        })
      },
      geometries: []
    })
    // 绑定点击事件
    layer.on('click', onMarkerClick)
    return layer
  }

  markerLayers = {
    green: createLayer('green-layer', '/static/imgs/dataHub/map/marker-green.png'),
    orange: createLayer('orange-layer', '../../../public/static/imgs/dataHub/map/marker-orange.png'),
    red: createLayer('red-layer', '../../../public/static/imgs/dataHub/map/marker-red.png'),
    blue: createLayer('blue-layer', '../../../public/static/imgs/dataHub/map/marker-blue.png'),
    gray: createLayer('gray-layer', '../../../public/static/imgs/dataHub/map/marker-gray.png')
  }
}

// 点击标记弹出 infoWindow
const onMarkerClick = (evt) => {
  const { position, properties } = evt.geometry
  if (!infoWindow || !properties) return

  infoWindow.setPosition(position)
  infoWindow.setContent(`
    <div style="padding:10px;min-width:220px;">
      <h3 style="margin:0 0 8px;font-size:15px;">${properties.locationName}</h3>
      <p>地理编码：${properties.geoCode}</p>
      <p>状态：<b>${properties.statusName}</b></p>
      <p>区域：${properties.areaName}</p>
      <p>图层类型：${properties.layerTypeName}</p>
      <p>行政区划：${properties.adminCode}</p>
      <p>校验结果：${properties.checkResultName}</p>
    </div>
  `)
  infoWindow.open()
}

// 渲染标记
const renderMarkers = () => {
  if (!map || !props.data?.length || !TMapInstance) return

  const buckets = {
    green: [],
    orange: [],
    red: [],
    blue: [],
    gray: []
  }

  const bounds = new TMapInstance.LatLngBounds()

  props.data.forEach(item => {
    if (!item.coordinateInfo) return

    const [lng, lat] = item.coordinateInfo.split(',').map(Number)
    if (isNaN(lng) || isNaN(lat)) return

    const position = new TMapInstance.LatLng(lat, lng)
    bounds.extend(position)

    let key = 'blue'
    if (item.checkResultName === '未通过') key = 'red'
    else {
      switch ((item.statusName || '').trim()) {
        case '正常': key = 'green'; break
        case '维护中': key = 'orange'; break
        case '停用': key = 'red'; break
        case '建设中': key = 'gray'; break
      }
    }

    buckets[key].push({
      id: item.geoCode,
      styleId: 'normal', // 必须和 layer styles key 对应
      position,
      properties: item
    })
  })

  Object.keys(markerLayers).forEach(k => {
    markerLayers[k].setGeometries(buckets[k])
  })

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 100 })
  }
}

const handleResize = () => {
  if (map) map.resize()
}

watch(() => props.data, renderMarkers, { deep: true })

onMounted(() => {
  initMap()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  Object.values(markerLayers).forEach(layer => layer.destroy && layer.destroy())
  if (infoWindow) infoWindow.destroy && infoWindow.destroy()
  if (map && map.destroy) map.destroy()
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
}

.map-content {
  width: 100%;
  height: 100%;
}
</style>
