<template>
  <div class="map-container">
    <!-- 地图容器 -->
    <div :id="idName" class="map-common-css" style="width: 100%; height: 100%;"></div>

    <!-- 左侧地区切换按钮 -->
    <div class="buttons-overlay">
      <div
        v-for="district in districtList"
        :key="district.id"
        class="district-button"
        :class="{ active: currentDistrict === district.name }"
        @click="switchDistrict(district)"
      >
        <div class="button-content">
          <div class="button-title">{{ district.name }}</div>
          <div class="button-hint">点击切换</div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <!-- 环卫车辆图例组 -->
      <div class="legend-group">
        <div class="legend-items">
          <div class="legend-item">
            <img :src="vehicleIcon" class="legend-icon" alt="环卫车辆" />
            <span>环卫车辆</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  defineProps,
  ref,
  onUnmounted,
  watch,
  defineExpose,
  defineEmits,
  computed
} from 'vue';
// 导入环卫车辆图标
import vehicleIcon from '../images/vehicle.png';

const props = defineProps({
  idName: {
    type: String,
    default: 'satelliteDistrictMap',
  },
  // 环卫车辆数据属性
  vehicleList: {
    type: Array,
    default: () => []
  }
});

// 地区列表数据 - 坐标修正为河源市源城区真实地理位置
const districtList = ref([
  {id: 1, name: '东埔街道', center: {lat: 23.737, lng: 114.701}, adcode: '441602001'},
  {id: 2, name: '源西街道', center: {lat: 23.730, lng: 114.690}, adcode: '441602002'},
  {id: 3, name: '上城街道', center: {lat: 23.740, lng: 114.710}, adcode: '441602003'},
  {id: 4, name: '新江街道', center: {lat: 23.720, lng: 114.715}, adcode: '441602004'},
  {id: 5, name: '源南镇', center: {lat: 23.715, lng: 114.680}, adcode: '441602100'},
  {id: 6, name: '高埔岗街道', center: {lat: 23.755, lng: 114.695}, adcode: '441602005'},
  {id: 7, name: '埔前镇', center: {lat: 23.765, lng: 114.725}, adcode: '441602101'},
  {id: 8, name: '转运站', center: {lat: 23.710, lng: 114.705}, adcode: '441602999'},
]);

// 修正后的模拟环卫车辆数据 - 坐标调整为广东省河源市源城区真实地理位置
const mockVehicleData = [
  {
    id: 1,
    vehicle_id: 'HV001',
    plate_number: '粤P12345',
    vehicle_type: '垃圾清运车',
    status: '正常',
    speed: 35,
    lat: 23.738,
    lng: 114.702,
    district: '东埔街道',
    driver: '张三',
    contact_phone: '13800138001'
  },
  {
    id: 2,
    vehicle_id: 'HV002',
    plate_number: '粤P23456',
    vehicle_type: '扫地车',
    status: '正常',
    speed: 20,
    lat: 23.731,
    lng: 114.691,
    district: '源西街道',
    driver: '李四',
    contact_phone: '13800138002'
  },
  {
    id: 3,
    vehicle_id: 'HV003',
    plate_number: '粤P34567',
    vehicle_type: '洒水车',
    status: '预警',
    speed: 15,
    lat: 23.741,
    lng: 114.711,
    district: '上城街道',
    driver: '王五',
    contact_phone: '13800138003'
  },
  {
    id: 4,
    vehicle_id: 'HV004',
    plate_number: '粤P45678',
    vehicle_type: '垃圾清运车',
    status: '正常',
    speed: 40,
    lat: 23.721,
    lng: 114.716,
    district: '新江街道',
    driver: '赵六',
    contact_phone: '13800138004'
  },
  {
    id: 5,
    vehicle_id: 'HV005',
    plate_number: '粤P56789',
    vehicle_type: '扫地车',
    status: '离线',
    speed: 0,
    lat: 23.716,
    lng: 114.681,
    district: '源南镇',
    driver: '钱七',
    contact_phone: '13800138005'
  },
  {
    id: 6,
    vehicle_id: 'HV006',
    plate_number: '粤P67890',
    vehicle_type: '洒水车',
    status: '正常',
    speed: 25,
    lat: 23.756,
    lng: 114.696,
    district: '高埔岗街道',
    driver: '孙八',
    contact_phone: '13800138006'
  },
  {
    id: 7,
    vehicle_id: 'HV007',
    plate_number: '粤P78901',
    vehicle_type: '垃圾清运车',
    status: '预警',
    speed: 30,
    lat: 23.766,
    lng: 114.726,
    district: '埔前镇',
    driver: '周九',
    contact_phone: '13800138007'
  },
  {
    id: 8,
    vehicle_id: 'HV008',
    plate_number: '粤P89012',
    vehicle_type: '扫地车',
    status: '正常',
    speed: 18,
    lat: 23.711,
    lng: 114.706,
    district: '转运站',
    driver: '吴十',
    contact_phone: '13800138008'
  },
  {
    id: 9,
    vehicle_id: 'HV009',
    plate_number: '粤P90123',
    vehicle_type: '洒水车',
    status: '正常',
    speed: 22,
    lat: 23.737,
    lng: 114.703,
    district: '东埔街道',
    driver: '郑十一',
    contact_phone: '13800138009'
  },
  {
    id: 10,
    vehicle_id: 'HV010',
    plate_number: '粤P01234',
    vehicle_type: '垃圾清运车',
    status: '正常',
    speed: 28,
    lat: 23.729,
    lng: 114.692,
    district: '源西街道',
    driver: '王十二',
    contact_phone: '13800138010'
  },
  {
    id: 11,
    vehicle_id: 'HV011',
    plate_number: '粤P11234',
    vehicle_type: '洒水车',
    status: '正常',
    speed: 20,
    lat: 23.739,
    lng: 114.712,
    district: '上城街道',
    driver: '李十三',
    contact_phone: '13800138011'
  },
  {
    id: 12,
    vehicle_id: 'HV012',
    plate_number: '粤P21234',
    vehicle_type: '扫地车',
    status: '正常',
    speed: 15,
    lat: 23.719,
    lng: 114.714,
    district: '新江街道',
    driver: '张十四',
    contact_phone: '13800138012'
  },
  {
    id: 13,
    vehicle_id: 'HV013',
    plate_number: '粤P31234',
    vehicle_type: '垃圾清运车',
    status: '正常',
    speed: 32,
    lat: 23.714,
    lng: 114.682,
    district: '源南镇',
    driver: '刘十五',
    contact_phone: '13800138013'
  },
  {
    id: 14,
    vehicle_id: 'HV014',
    plate_number: '粤P41234',
    vehicle_type: '洒水车',
    status: '预警',
    speed: 12,
    lat: 23.757,
    lng: 114.697,
    district: '高埔岗街道',
    driver: '陈十六',
    contact_phone: '13800138014'
  },
  {
    id: 15,
    vehicle_id: 'HV015',
    plate_number: '粤P51234',
    vehicle_type: '扫地车',
    status: '正常',
    speed: 16,
    lat: 23.764,
    lng: 114.724,
    district: '埔前镇',
    driver: '杨十七',
    contact_phone: '13800138015'
  },
  {
    id: 16,
    vehicle_id: 'HV016',
    plate_number: '粤P61234',
    vehicle_type: '垃圾清运车',
    status: '正常',
    speed: 38,
    lat: 23.712,
    lng: 114.707,
    district: '转运站',
    driver: '黄十八',
    contact_phone: '13800138016'
  }
];

// 计算属性
const displayVehicleList = computed(() => {
  return props.vehicleList && props.vehicleList.length > 0 ? props.vehicleList : mockVehicleData;
});

// 过滤后的车辆列表
const filteredVehicleList = computed(() => {
  if (!currentDistrict.value) {
    return displayVehicleList.value;
  }
  return displayVehicleList.value.filter(vehicle => vehicle.district === currentDistrict.value);
});

// 地区配置
const districtConfig = ref({
  name: '东埔街道',
  adcode: '441602001',
  drawBorder: true,
  borderColor: '#ff0000',
  borderWidth: 2,
  center: {lat: 23.737, lng: 114.701},
});

// 图层实例管理
const layers = ref({
  vehicle: null,
  district: null
});

// 响应式变量
const mapInstance = ref(null);
const infoWindow = ref(null);
const districtBoundaryLine = ref(null);
const mapInitialized = ref(false);
const boundaryLoading = ref(false);
const currentDistrict = ref('东埔街道');
const isInfoWindowOpen = ref(false);

// 自定义事件
const emit = defineEmits(['vehicleClick']);

// 安全关闭信息窗
const safeCloseInfoWindow = () => {
  if (infoWindow.value && isInfoWindowOpen.value) {
    try {
      infoWindow.value.close();
      isInfoWindowOpen.value = false;
    } catch (error) {
      console.warn('关闭信息窗时出错:', error);
      isInfoWindowOpen.value = false;
    }
  }
};

// 安全打开信息窗
const safeOpenInfoWindow = (content, position) => {
  if (!infoWindow.value || !mapInstance.value) {
    console.warn('信息窗或地图未初始化');
    return false;
  }

  try {
    // 先关闭已打开的信息窗
    safeCloseInfoWindow();

    // 设置内容和位置
    infoWindow.value.setContent(content);
    infoWindow.value.setPosition(position);

    // 打开信息窗
    infoWindow.value.open();
    isInfoWindowOpen.value = true;
    return true;
  } catch (error) {
    console.error('打开信息窗失败:', error);
    isInfoWindowOpen.value = false;
    return false;
  }
};

// 环卫车辆点击事件处理
const handleVehicleClick = (e) => {
  console.log('环卫车辆被点击', e);
  const {properties} = e.geometry;
  if (properties) {
    console.log('显示车辆信息窗', properties);
    const content = getVehicleTooltip(properties);
    const success = safeOpenInfoWindow(content, e.geometry.position);
    if (success) {
      emit('vehicleClick', properties);
    }
  } else {
    console.warn('无法获取车辆属性', e);
  }
};

// 获取面的中心坐标
const getPolygonCenter = (coords) => {
  if (!Array.isArray(coords) || coords.length === 0) {
    return districtConfig.value.center;
  }

  let latSum = 0, lngSum = 0, count = 0;
  coords.forEach(coord => {
    let lng, lat;
    if (Array.isArray(coord)) {
      lng = coord[0];
      lat = coord[1];
    } else if (coord.x && coord.y) {
      lng = coord.x;
      lat = coord.y;
    } else if (coord instanceof TMap.LatLng) {
      lng = coord.getLng();
      lat = coord.getLat();
    }

    if (typeof lng === 'number' && typeof lat === 'number') {
      lngSum += lng;
      latSum += lat;
      count++;
    }
  });

  return {
    lat: count > 0 ? latSum / count : districtConfig.value.center.lat,
    lng: count > 0 ? lngSum / count : districtConfig.value.center.lng
  };
};

// 重置图层
const resetLayers = () => {
  Object.values(layers.value).forEach(layer => {
    if (layer) {
      try {
        layer.destroy();
      } catch (error) {
        console.warn('销毁图层实例失败：', error);
      }
    }
  });

  layers.value = {
    vehicle: null,
    district: null
  };

  safeCloseInfoWindow();
};

// 生成确定性的模拟多边形边界
const generateDeterministicPolygon = (center, adcode) => {
  const idNum = parseInt(adcode.slice(-3)) || 1;
  const lat = center.lat;
  const lng = center.lng;
  const paths = [];

  // 使用地区ID和adcode生成固定的种子，确保每次生成相同的边界
  const seed = idNum + parseInt(adcode || '0');

  // 基础半径，基于种子确定
  const baseRadius = 0.008 + (seed % 5) * 0.002;

  // 固定点数量
  const pointCount = 12;

  for (let i = 0; i < pointCount; i++) {
    const angle = (i * 2 * Math.PI) / pointCount;

    // 使用确定性的三角函数计算偏移，确保每次结果相同
    const variation1 = Math.sin(seed * 0.3 + i * 0.5) * 0.3;
    const variation2 = Math.cos(seed * 0.2 + i * 0.7) * 0.2;
    const variation3 = Math.sin(seed * 0.4 + i * 0.9) * 0.25;

    // 计算每个点的半径
    const radiusVariation = 1 + variation1 + variation2 + variation3;
    const currentRadius = baseRadius * radiusVariation;

    // 添加固定的角度偏移
    const angleOffset = seed * 0.05;

    const pointLat = lat + currentRadius * Math.cos(angle + angleOffset);
    const pointLng = lng + currentRadius * Math.sin(angle + angleOffset);
    paths.push(new TMap.LatLng(pointLat, pointLng));
  }

  // 闭合多边形
  if (paths.length > 0) {
    paths.push(paths[0]);
  }

  return paths;
};

// 缓存已生成的边界，避免重复生成
const boundaryCache = new Map();

// 加载行政区划边界
const loadDistrictBoundary = (map, config) => {
  if (districtBoundaryLine.value) {
    try {
      districtBoundaryLine.value.destroy();
    } catch (error) {
      console.warn('清除边界线失败:', error);
    }
    districtBoundaryLine.value = null;
  }

  if (!config.drawBorder) return;

  boundaryLoading.value = true;

  // 尝试使用腾讯地图District服务
  if (window.TMap && window.TMap.service && window.TMap.service.District) {
    try {
      const districtService = new TMap.service.District({
        polygon: 2,
      });

      console.log(`正在通过TMap.service.District加载${config.name}的边界...`);

      districtService.search({
        keyword: config.adcode || config.name
      }).then((result) => {
        if (result && result.result && result.result.length > 0) {
          const paths = result.result[0][0].polygon;
          if (paths && paths.length > 0) {
            drawBoundaryLine(map, paths, config);
            console.log(`${config.name}边界通过TMap.service.District加载成功`);
            boundaryLoading.value = false;
            return;
          } else {
            console.log(`${config.name}边界路径为空，使用模拟边界`);
            useDeterministicBoundary(map, config);
          }
        } else {
          console.log(`${config.name}未找到边界数据，使用模拟边界`);
          useDeterministicBoundary(map, config);
        }
      }).catch(error => {
        console.error('加载行政区划边界失败，使用模拟边界:', error);
        useDeterministicBoundary(map, config);
      });
    } catch (error) {
      console.error('初始化District服务失败，使用模拟边界:', error);
      useDeterministicBoundary(map, config);
    }
  } else {
    console.log('TMap.service.District服务不可用，使用模拟边界');
    useDeterministicBoundary(map, config);
  }
};

// 使用确定性边界数据
const useDeterministicBoundary = (map, config) => {
  console.log(`使用确定性边界数据: ${config.name}`);

  const currentDistrictData = districtList.value.find(d => d.name === config.name);
  if (!currentDistrictData) {
    console.warn('未找到地区数据，使用默认中心点');
    drawBoundaryLine(map, generateDeterministicPolygon(config.center, config.adcode), config);
    boundaryLoading.value = false;
    return;
  }

  // 检查边界缓存
  const cacheKey = `${config.adcode}-${config.name}`;
  if (boundaryCache.has(cacheKey)) {
    console.log(`从缓存加载边界: ${cacheKey}`);
    drawBoundaryLine(map, boundaryCache.get(cacheKey), config);
  } else {
    // 生成并缓存边界
    const simulatedBoundary = generateDeterministicPolygon(currentDistrictData.center, currentDistrictData.adcode);
    boundaryCache.set(cacheKey, simulatedBoundary);
    drawBoundaryLine(map, simulatedBoundary, config);
  }

  boundaryLoading.value = false;
};

// 绘制边界线
const drawBoundaryLine = (map, paths, config) => {
  if (districtBoundaryLine.value) {
    try {
      districtBoundaryLine.value.destroy();
    } catch (error) {
      console.warn('绘制边界线-销毁旧边界线失败:', error);
    }
    districtBoundaryLine.value = null;
  }

  try {
    districtBoundaryLine.value = new TMap.MultiPolyline({
      map: map,
      styles: {
        boundary: new TMap.PolylineStyle({
          color: config.borderColor || '#ff0000',
          width: config.borderWidth || 2,
          lineCap: 'round',
          enableBloom: false,
        }),
      },
      geometries: [
        {
          id: 'district-boundary',
          styleId: 'boundary',
          paths: paths,
          properties: {
            name: config.name,
            adcode: config.adcode,
            type: 'district'
          },
        },
      ],
    });

    layers.value.district = districtBoundaryLine.value;

  } catch (error) {
    console.error('绘制边界线失败:', error);
  }
};

// 切换到指定地区
const switchDistrict = (district) => {
  if (!mapInstance.value) return;

  currentDistrict.value = district.name;
  districtConfig.value = {
    ...districtConfig.value,
    name: district.name,
    adcode: district.adcode,
    center: district.center,
  };

  mapInstance.value.setCenter(new TMap.LatLng(district.center.lat, district.center.lng));
  mapInstance.value.setZoom(13);

  loadDistrictBoundary(mapInstance.value, districtConfig.value);

  refreshVehicleMarkers();

  safeCloseInfoWindow();
};

// 刷新车辆标记
const refreshVehicleMarkers = () => {
  if (mapInitialized.value && mapInstance.value) {
    if (layers.value.vehicle) {
      try {
        layers.value.vehicle.destroy();
      } catch (error) {
        console.warn('销毁车辆图层失败：', error);
      }
      layers.value.vehicle = null;
    }

    createVehicleMarkers(mapInstance.value);
  }
};

// 初始化地图
const initMap = () => {
  const callbackName = `initMap_${props.idName}`;
  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&libraries=service&callback=${callbackName}`;
  script.async = true;

  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };

  document.head.appendChild(script);
};

// 地图初始化回调
const mapCallback = () => {
  const mapContainer = document.getElementById(props.idName);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }

  // 创建地图实例
  const map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(districtConfig.value.center.lat, districtConfig.value.center.lng),
    zoom: 13,
    // 使用卫星地图
    baseMap: {
      type: 'satellite'
    },
    enablePitch: true,
    enableRotate: true,
    pitch: 0,
    rotation: 0,
  });
  mapInstance.value = map;
  mapInitialized.value = true;

  // 关键修改：不立即创建信息窗
  // 只在需要时才创建信息窗
  infoWindow.value = null;
  isInfoWindowOpen.value = false;

  // 初始创建图层
  resetLayers();

  // 加载默认地区的行政区划边界
  loadDistrictBoundary(map, districtConfig.value);

  // 创建环卫车辆标记
  createVehicleMarkers(map);

  // 延迟创建信息窗，确保地图完全加载
  setTimeout(() => {
    if (!infoWindow.value && mapInstance.value) {
      // 创建信息窗但确保不显示
      infoWindow.value = new TMap.InfoWindow({
        map: mapInstance.value,
        position: new TMap.LatLng(0, 0), // 设置在不可见的位置
        content: '',
        offset: {x: 0, y: -30},
        visible: false
      });

      // 立即关闭
      try {
        infoWindow.value.close();
      } catch (error) {
        console.warn('初始化时关闭信息窗失败:', error);
      }
    }
  }, 1000);
};

// 确保信息窗存在的方法
const ensureInfoWindowExists = () => {
  if (!infoWindow.value && mapInstance.value) {
    infoWindow.value = new TMap.InfoWindow({
      map: mapInstance.value,
      position: new TMap.LatLng(0, 0),
      content: '',
      offset: {x: 0, y: -30},
      visible: false
    });
  }
  return !!infoWindow.value;
};

// 创建环卫车辆标记
const createVehicleMarkers = (map) => {
  const markerData = [];
  const vehicles = filteredVehicleList.value;

  if (Array.isArray(vehicles)) {
    vehicles.forEach((item, index) => {
      const lat = item.coord_x || item.lat;
      const lng = item.coord_y || item.lng;

      if (item && typeof lng === 'number' && typeof lat === 'number') {
        markerData.push({
          id: `vehicle-${item.vehicle_id || item.id || index}`,
          styleId: 'default',
          position: new TMap.LatLng(lat, lng),
          properties: {
            ...item,
            type: 'vehicle'
          }
        });
      } else {
        console.warn(`第${index}条环卫车辆数据坐标无效`, item);
      }
    });
  }

  if (markerData.length > 0) {
    try {
      layers.value.vehicle = new TMap.MultiMarker({
        id: 'vehicle-layer',
        map: map,
        styles: getVehicleStyles(),
        geometries: markerData
      });

      if (layers.value.vehicle) {
        layers.value.vehicle.on('click', handleVehicleClick);
      }

      console.log('环卫车辆标记生成成功，数量：', markerData.length, '当前地区：', currentDistrict.value);
    } catch (error) {
      console.error('创建车辆标记失败:', error);
    }
  } else {
    console.warn('无有效环卫车辆标记数据');
  }
};

// 环卫车辆信息窗内容
const getVehicleTooltip = (properties) => {
  const labelStyle = 'width: 100px; text-align: right; font-weight: bold; margin-right: 6px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 8px 0;';

  const statusColor = properties.status === '正常'
    ? 'green'
    : properties.status === '预警'
      ? 'orange'
      : properties.status === '离线'
        ? 'red'
        : 'gray';

  return `
    <div style="padding: 12px; font-size: 14px; color: #333; background: white; border: 1px solid #ccc; min-width: 320px; border-radius: 4px;">
      <div style="margin-bottom: 12px; font-weight: bold; color: #00c6ff; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">环卫车辆信息</div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">车辆ID：</span>
        <span style="${valueStyle}">${properties.vehicle_id || properties.id || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">车牌号：</span>
        <span style="${valueStyle}">${properties.plate_number || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">车辆类型：</span>
        <span style="${valueStyle}">${properties.vehicle_type || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">状态：</span>
        <span style="${valueStyle}; color: ${statusColor}; font-weight: 500;">
          ${properties.status || '未知'}
        </span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">速度：</span>
        <span style="${valueStyle}">${properties.speed || 0} km/h</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">所在区域：</span>
        <span style="${valueStyle}">${properties.district || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">司机：</span>
        <span style="${valueStyle}">${properties.driver || '未知'}</span>
      </div>
      <div style="${rowStyle}">
        <span style="${labelStyle}">联系电话：</span>
        <span style="${valueStyle}">${properties.contact_phone || '未知'}</span>
      </div>
    </div>
  `;
};

// 环卫车辆标记样式
const getVehicleStyles = () => {
  return {
    'default': new TMap.MarkerStyle({
      width: 40,
      height: 40,
      anchor: {x: 20, y: 40},
      src: vehicleIcon
    })
  };
};

// 刷新地图
const refreshMap = () => {
  if (mapInitialized.value && mapInstance.value) {
    resetLayers();
    loadDistrictBoundary(mapInstance.value, districtConfig.value);
    createVehicleMarkers(mapInstance.value);
  } else {
    initMap();
  }
};

// 监听车辆数据变化
watch(
  () => filteredVehicleList.value,
  (newVehicleList) => {
    console.log('过滤后的车辆数据更新，数量：', newVehicleList.length, '当前地区：', currentDistrict.value);
    if (mapInitialized.value && mapInstance.value) {
      if (layers.value.vehicle) {
        try {
          layers.value.vehicle.destroy();
        } catch (error) {
          console.warn('销毁车辆图层失败：', error);
        }
        layers.value.vehicle = null;
      }
      createVehicleMarkers(mapInstance.value);
    }
  },
  {deep: true}
);

// 生命周期
onMounted(() => {
  initMap();
});

onUnmounted(() => {
  safeCloseInfoWindow();

  resetLayers();

  if (infoWindow.value) {
    try {
      infoWindow.value.destroy();
    } catch (error) {
      console.warn('卸载时销毁信息窗失败：', error);
    }
  }

  if (districtBoundaryLine.value) {
    try {
      districtBoundaryLine.value.destroy();
    } catch (error) {
      console.warn('销毁边界线失败：', error);
    }
  }

  if (mapInstance.value) {
    try {
      mapInstance.value.destroy();
    } catch (error) {
      console.warn('卸载时销毁地图失败：', error);
    }
  }
  mapInitialized.value = false;
});

// 暴露方法给父组件
defineExpose({
  refreshMap,
  switchDistrict,
  getCurrentDistrict: () => currentDistrict.value,
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-common-css {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

/* 左侧按钮样式 */
.buttons-overlay {
  position: absolute;
  top: 4vh;
  left: 0.2vw;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5vw;
  width: 120px;
}

.district-button {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5vw;
  cursor: pointer;
  background: rgb(0 30 60 / 85%);
  border: 1px solid rgb(0 204 255 / 30%);
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 60px;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.district-button:hover {
  background: rgb(0 30 60 / 90%);
  border-color: rgb(0 204 255 / 60%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 204, 255, 0.3);
}

.district-button.active {
  background: rgb(0 30 60 / 95%);
  border-color: rgb(0 204 255);
  box-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
}

.button-content {
  flex: 1;
  overflow: hidden;
}

.button-title {
  padding-bottom: 0.5vh;
  font-size: 0.7vw;
  color: rgb(255 255 255 / 70%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button-hint {
  font-size: 0.6vw;
  color: rgb(0 204 255 / 80%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 图例样式 */
.legend {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  width: 100%;
  height: auto;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: right;
  gap: 2vw;
  padding: 0.5vw;
  flex-wrap: wrap;
}

.legend-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.legend-items {
  display: flex;
  flex-direction: row;
  gap: 1vw;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.8vw;
  color: #fff;
}

/* 图例图标 */
.legend-icon {
  width: 1.2vw;
  height: 2vh;
  margin-right: 0.2vw;
  object-fit: contain;
}
</style>
