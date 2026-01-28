<script setup>
import {
  defineExpose,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import { mapOrbitAnimation } from '#/api/genchuan/industry/mapOrbitAnimation.js';

// 仅保留车辆支付状态相关图标
import carPaid from '../../images/car-paid.png'; // 已支付车辆图标
import carUnpaid from '../../images/car-unpaid.png'; // 未支付车辆图标
import carUnknown from '../../images/unknown.png'; // 未知状态兜底图标

const props = defineProps({
  idName: {
    type: String,
    default: 'chinaEcharts',
  },
  geometriesArray: {
    type: Array,
    default: () => [],
  },
  orbitConfig: {
    type: Object,
    default: () => ({
      center: { lat: 24.58, lng: 117.65 },
      rotateSpeed: 0.1,
      pitch: 40,
      zoom: 10,
      loop: true,
    }),
  },
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const vehicleMarkerLayer = ref(null); // 车辆标注层（替换原有三层）
const mapInitialized = ref(false);

const {
  orbitStatus,
  startOrbitAnimation,
  stopOrbitAnimation,
  toggleOrbitAnimation,
  orbitConfig,
} = mapOrbitAnimation(mapInstance, props.orbitConfig);

watch(
  () => props.orbitConfig,
  (newConfig) => {
    Object.assign(orbitConfig.value, newConfig);
  },
  { deep: true, immediate: true },
);

// 支付状态映射表（核心：已支付/未支付）
const payStatusMap = {
  '已支付': {
    color: '#39b20d', // 绿色
    icon: carPaid,
    text: '已支付',
    size: { w: 30, h: 30 },
    styleId: 'paid',
  },
  '未支付': {
    color: '#FF4500', // 橙红色
    icon: carUnpaid,
    text: '未支付',
    size: { w: 30, h: 30 },
    styleId: 'unpaid',
  },
  '': {
    color: '#999999', // 灰色
    icon: carUnknown,
    text: '状态未知',
    size: { w: 30, h: 30 },
    styleId: 'unknown',
  },
};

// 点击车辆标注展示信息窗口
const handleMarkerClick = (e) => {
  const { properties, position } = e.geometry;
  if (properties && position && infoWindow.value) {
    infoWindow.value.setContent(getTooltipContent(properties));
    infoWindow.value.setPosition(position);
    infoWindow.value.open();
  }
};

const handleInfoWindowClose = () => {
  if (infoWindow.value) infoWindow.value.close();
};

const initMap = () => {
  const callbackName = `initMap_${props.idName}`;
  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&callback=${callbackName}`;
  script.async = true;
  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };
  document.head.append(script);
};

// 核心：创建车辆标注层（按支付状态区分图标）
const createVehicleMarkers = (map) => {
  // 销毁原有车辆标注层
  if (vehicleMarkerLayer.value) {
    try {
      vehicleMarkerLayer.value.off('click', handleMarkerClick);
      vehicleMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁车辆标注层失败:', error);
    }
    vehicleMarkerLayer.value = null;
  }

  if (!Array.isArray(props.geometriesArray) || props.geometriesArray.length === 0)
    return;

  const vehicleData = [];

  // 处理车辆数据（提取核心字段）
  props.geometriesArray.forEach((item, index) => {
    const {
      tbVehicleLicensePlate,
      sysPayStatusName,
      vehicleLongitude,
      vehicleLatitude
    } = item;

    // 校验必要字段
    if (
      !item ||
      !tbVehicleLicensePlate ||
      typeof vehicleLongitude !== 'number' ||
      typeof vehicleLatitude !== 'number'
    ) return;

    // 支付状态样式匹配
    const styleId = payStatusMap[sysPayStatusName || '']?.styleId || 'unknown';

    vehicleData.push({
      id: `vehicle-${index}-${tbVehicleLicensePlate}`, // 唯一ID（车牌+索引）
      styleId: styleId,
      position: new TMap.LatLng(vehicleLatitude, vehicleLongitude), // 车辆经纬度
      properties: { ...item, markerType: 'vehicle' },
    });
  });

  // 创建车辆标注层
  if (vehicleData.length > 0) {
    vehicleMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'paid': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 }, // 图标锚点（居中底部）
          src: carPaid,
        }),
        'unpaid': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 },
          src: carUnpaid,
        }),
        'unknown': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 },
          src: carUnknown,
        }),
      },
      geometries: vehicleData,
    });
    vehicleMarkerLayer.value.on('click', handleMarkerClick);
  }
};

// 信息窗口内容（车辆支付状态详情）
const getTooltipContent = (properties) => {
  const labelStyle = 'width: 100px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle = 'margin-bottom: 6px; font-weight: bold; color: #1E90FF; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  // 时间格式化工具函数
  const formatTime = (timeStamp) => {
    if (!timeStamp) return '未知';
    const date = new Date(timeStamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 车辆支付状态文本和颜色
  const payStatusInfo = payStatusMap[properties.sysPayStatusName] || payStatusMap[''];

  // 车辆信息窗口
  return `
    <div style="padding: 10px 12px; color: #333; background: white; border: 1px solid #ccc; min-width: 300px; border-radius: 4px;">
      <div style="${titleStyle}">车辆停车详情</div>
      <div style="${rowStyle}"><span style="${labelStyle}">车牌号码：</span><span style="${valueStyle}">${properties.tbVehicleLicensePlate || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">支付状态：</span><span style="${valueStyle}; color: ${payStatusInfo.color};">${payStatusInfo.text}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">入场时间：</span><span style="${valueStyle}">${formatTime(properties.tbParkingRecordEntryTime)}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">预计离场：</span><span style="${valueStyle}">${formatTime(properties.tbParkingRecordExpectedExitTime)}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">所属停车场：</span><span style="${valueStyle}">${properties.lotName || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">车辆位置：</span><span style="${valueStyle}">${properties.vehicleLatitude || '未知'}, ${properties.vehicleLongitude || '未知'}</span></div>
    </div>
  `;
};

const mapCallback = () => {
  const mapContainer = document.querySelector(`#${props.idName}`);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }

  const { center, zoom, pitch } = props.orbitConfig;
  const map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(center.lat, center.lng),
    zoom,
    mapStyleId: 'style1',
    enablePitch: true,
    enableRotate: true,
    pitch,
    rotation: 0,
  });
  mapInstance.value = map;
  mapInitialized.value = true;

  // 初始化信息窗口
  infoWindow.value = new TMap.InfoWindow({
    map,
    position: new TMap.LatLng(0, 0),
    content: '',
    offset: { x: 0, y: -40 },
    visible: false,
  });
  infoWindow.value.on('close', handleInfoWindowClose);

  // 创建车辆标注
  createVehicleMarkers(map);
  startOrbitAnimation();
};

// 监听车辆数据变化重新渲染标注
watch(
  () => props.geometriesArray,
  (newVal) => {
    if (mapInitialized.value && Array.isArray(newVal)) {
      createVehicleMarkers(mapInstance.value);
    }
  },
  { deep: true },
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  stopOrbitAnimation();

  // 销毁车辆标注层
  if (vehicleMarkerLayer.value) {
    try {
      vehicleMarkerLayer.value.off('click', handleMarkerClick);
      vehicleMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁车辆标注层失败:', error);
    }
  }

  // 销毁信息窗口和地图实例
  if (infoWindow.value) {
    try {
      infoWindow.value.off('close', handleInfoWindowClose);
      infoWindow.value.destroy();
    } catch (error) {
      console.warn('销毁信息窗口失败:', error);
    }
  }
  if (mapInstance.value) {
    try {
      mapInstance.value.destroy();
    } catch (error) {
      console.warn('销毁地图实例失败:', error);
    }
  }

  // 重置轨道动画状态
  orbitStatus.value = {
    playing: false,
    currentRotation: 0,
    animationFrameId: null,
    isInited: false,
  };
  mapInitialized.value = false;
});

defineExpose({
  toggleOrbitAnimation,
  orbitStatus,
  startOrbitAnimation,
  stopOrbitAnimation,
});
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>

    <!-- 车辆支付状态图例 -->
    <div class="legend">
      <div class="legend-items">
        <div class="legend-divider">
          <p>车辆支付状态:</p>
        </div>
        <div class="legend-item">
          <img :src="carPaid" class="legend-icon" alt="已支付" />
          <span>已支付</span>
        </div>
        <div class="legend-item">
          <img :src="carUnpaid" class="legend-icon" alt="未支付" />
          <span>未支付</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-common-css {
  width: 100%;
  height: 99.2%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
}

.legend {
  position: absolute;
  bottom: 0.1vh;
  left: 0;
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-end;
  width: 100%;
  height: auto;
  padding: 0.5vw;
  background: rgb(0 0 0 / 50%);
}

.legend-items {
  display: flex;
  flex-direction: row;
  gap: 1.5vw;
  align-items: center;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5vw;
  font-size: 0.8vw;
  color: #fff;
}

.legend-icon {
  width: 1vw;
  height: 2vh;
  object-fit: contain;
}

.legend-divider {
  font-size: 0.8vw;
  color: #fff;
}
</style>
