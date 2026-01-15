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

import markerFault from '../../images/berth_fault.png';
import markerForbid from '../../images/berth_forbid.png';
// 泊位状态图标
import markerIdle from '../../images/berth_idle.png';
import markerOccupy from '../../images/berth_occupy.png';
import deviceFault from '../../images/device_fault.png';
import deviceMaintain from '../../images/device_maintain.png';
import deviceOffline from '../../images/device_offline.png';
// 设备状态图标
import deviceOnline from '../../images/device_online.png';
import parkMaintain from '../../images/park_maintain.png';
// 停车场状态图标
import parkNormal from '../../images/park_normal.png';
import parkPause from '../../images/park_pause.png';
import markerUnknown from '../../images/unknown.png';

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
      rotateSpeed: 0.2,
      pitch: 40,
      zoom: 10,
      loop: true,
    }),
  },
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const parkMarkerLayer = ref(null);
const berthMarkerLayer = ref(null);
const deviceMarkerLayer = ref(null);
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

// 状态映射表
const lotStatusMap = {
  正常: {
    color: '#39b20d',
    icon: parkNormal,
    text: '正常',
    size: { w: 50, h: 50 },
    styleId: 'normal',
  },
  暂停运营: {
    color: '#FF4500',
    icon: parkPause,
    text: '暂停运营',
    size: { w: 50, h: 50 },
    styleId: 'pause',
  },
  维护: {
    color: '#FFA500',
    icon: parkMaintain,
    text: '维护',
    size: { w: 50, h: 50 },
    styleId: 'maintain',
  },
};
const roadsideStatusMap = {
  空闲: {
    color: '#FFA500',
    icon: markerIdle,
    text: '空闲',
    size: { w: 30, h: 30 },
    styleId: 'idle',
  },
  占用: {
    color: 'blue',
    icon: markerOccupy,
    text: '占用',
    size: { w: 30, h: 30 },
    styleId: 'occupy',
  },
  故障: {
    color: '#FF4500',
    icon: markerFault,
    text: '故障',
    size: { w: 30, h: 30 },
    styleId: 'fault',
  },
  禁用: {
    color: '#5b5757',
    icon: markerForbid,
    text: '禁用',
    size: { w: 30, h: 30 },
    styleId: 'forbid',
  },
};
const deviceStatusStyleMap = {
  在线: {
    color: '#39b20d',
    icon: deviceOnline,
    text: '在线',
    size: { w: 20, h: 20 },
    styleId: 'device-online',
  },
  离线: {
    color: '#5b5757',
    icon: deviceOffline,
    text: '离线',
    size: { w: 20, h: 20 },
    styleId: 'device-offline',
  },
  故障: {
    color: '#FF4500',
    icon: deviceFault,
    text: '故障',
    size: { w: 20, h: 20 },
    styleId: 'device-fault',
  },
  '': {
    color: '#999999',
    icon: markerUnknown,
    text: '状态未知',
    size: { w: 20, h: 20 },
    styleId: 'device-unknown',
  },
};
const deviceTypeMap = {
  道闸: '道闸',
  摄像头: '摄像头',
  计费桩: '计费桩',
  充电桩: '充电桩',
  传感器: '传感器',
  边缘网关: '边缘网关',
  '': '未知设备',
};
const alertLevelMap = {
  高: { text: '高', color: '#8f0000' },
  中: { text: '中', color: '#c72d2d' },
  低: { text: '低', color: '#ea7373' },
  '': { text: '未知预警', color: '#999999' },
};

// 点击标注展示信息窗口
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

// 核心修改：适配拆分后的经纬度字段（停车场/泊位/设备独立坐标）
const createAllMarkers = (map) => {
  // 销毁原有标注层
  if (parkMarkerLayer.value) {
    try {
      parkMarkerLayer.value.off('click', handleMarkerClick);
      parkMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁停车场标注层失败:', error);
    }
    parkMarkerLayer.value = null;
  }
  if (berthMarkerLayer.value) {
    try {
      berthMarkerLayer.value.off('click', handleMarkerClick);
      berthMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁泊位标注层失败:', error);
    }
    berthMarkerLayer.value = null;
  }
  if (deviceMarkerLayer.value) {
    try {
      deviceMarkerLayer.value.off('click', handleMarkerClick);
      deviceMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁设备标注层失败:', error);
    }
    deviceMarkerLayer.value = null;
  }

  if (
    !Array.isArray(props.geometriesArray) ||
    props.geometriesArray.length === 0
  )
    return;

  const parkData = [];
  const berthData = [];
  const deviceData = [];
  // 用于去重的停车场ID集合
  const parkIdSet = new Set();

  // 第一步：提取唯一的停车场数据（按lotId去重），使用停车场专属经纬度
  props.geometriesArray.forEach((item) => {
    const { lotId, lotLongitude, lotLatitude, lotStatus } = item;
    if (
      !item ||
      !lotId ||
      typeof lotLongitude !== 'number' ||
      typeof lotLatitude !== 'number'
    )
      return;

    // 只保留唯一的停车场数据
    if (!parkIdSet.has(lotId)) {
      parkIdSet.add(lotId);
      const styleId = lotStatusMap[lotStatus || '']?.styleId || 'default';
      parkData.push({
        id: `park-${lotId}`,
        styleId: `park-${styleId}`,
        position: new TMap.LatLng(lotLatitude, lotLongitude), // 读取停车场专属纬度/经度
        properties: { ...item, markerType: 'parkLot' },
      });
    }
  });

  // 第二步：处理泊位数据，使用泊位专属经纬度
  props.geometriesArray.forEach((item, index) => {
    const {
      berthLongitude,
      berthLatitude,
      roadsideStatus,
      deviceId,
      deviceStatus,
      deviceLongitude,
      deviceLatitude,
    } = item;
    if (
      !item ||
      typeof berthLongitude !== 'number' ||
      typeof berthLatitude !== 'number'
    )
      return;

    // 泊位标注（使用泊位专属坐标）
    const styleId =
      roadsideStatusMap[roadsideStatus || '']?.styleId || 'default';
    berthData.push({
      id: `berth-${index}`,
      styleId: `berth-${styleId}`,
      position: new TMap.LatLng(berthLatitude, berthLongitude), // 读取泊位专属纬度/经度
      properties: { ...item, markerType: 'berth' },
    });

    // 设备标注（使用设备专属坐标，无则基于泊位偏移）
    if (deviceId) {
      const devStyleId =
        deviceStatusStyleMap[deviceStatus || '']?.styleId || 'device-unknown';
      // 优先使用设备专属坐标，无则用泊位坐标+偏移
      const finalDeviceLat = deviceLatitude || berthLatitude + 0.0001;
      const finalDeviceLng = deviceLongitude || berthLongitude + 0.0001;

      deviceData.push({
        id: `device-${deviceId}`,
        styleId: devStyleId,
        position: new TMap.LatLng(finalDeviceLat, finalDeviceLng), // 读取设备专属纬度/经度
        properties: { ...item, markerType: 'device' },
      });
    }
  });

  // 创建停车场标注层
  if (parkData.length > 0) {
    parkMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'park-normal': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: { x: 20, y: 35 },
          src: parkNormal,
        }),
        'park-pause': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: { x: 20, y: 35 },
          src: parkPause,
        }),
        'park-maintain': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: { x: 20, y: 35 },
          src: parkMaintain,
        }),
        'park-default': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: { x: 20, y: 35 },
          src: markerUnknown,
        }),
      },
      geometries: parkData,
    });
    parkMarkerLayer.value.on('click', handleMarkerClick);
  }

  // 创建泊位标注层
  if (berthData.length > 0) {
    berthMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'berth-idle': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 },
          src: markerIdle,
        }),
        'berth-occupy': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 },
          src: markerOccupy,
        }),
        'berth-fault': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 },
          src: markerFault,
        }),
        'berth-forbid': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 },
          src: markerForbid,
        }),
        'berth-default': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 25 },
          src: markerUnknown,
        }),
      },
      geometries: berthData,
    });
    berthMarkerLayer.value.on('click', handleMarkerClick);
  }

  // 创建设备标注层
  if (deviceData.length > 0) {
    deviceMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'device-online': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: { x: 10, y: 10 },
          src: deviceOnline,
        }),
        'device-offline': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: { x: 10, y: 10 },
          src: deviceOffline,
        }),
        'device-fault': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: { x: 10, y: 10 },
          src: deviceFault,
        }),
        'device-maintain': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: { x: 10, y: 10 },
          src: deviceMaintain,
        }),
        'device-unknown': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: { x: 10, y: 10 },
          src: markerUnknown,
        }),
      },
      geometries: deviceData,
    });
    deviceMarkerLayer.value.on('click', handleMarkerClick);
  }
};

// 信息窗口内容生成（补充展示各层级经纬度）
const getTooltipContent = (properties) => {
  const labelStyle =
    'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle =
    'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle =
    'margin-bottom: 6px; font-weight: bold; color: #1E90FF; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  // 时间格式化
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

  // 设备状态文本和颜色获取
  const getDeviceStatusInfo = (status) => {
    const statusObj = deviceStatusStyleMap[status] || deviceStatusStyleMap[''];
    return { text: statusObj.text, color: statusObj.color };
  };

  // 停车场信息窗口（展示停车场经纬度）
  switch (properties.markerType) {
    case 'berth': {
      const roadsideStatusText =
        roadsideStatusMap[properties.roadsideStatus]?.text || '未知状态';
      const alertLevelInfo =
        alertLevelMap[properties.alertLevel] || alertLevelMap[''];

      return `
      <div style="padding: 10px 12px; color: #333; background: white; border: 1px solid #ccc; min-width: 380px; border-radius: 4px;">
        <div style="${titleStyle}">泊位详情</div>
        <div style="${rowStyle}"><span style="${labelStyle}">所属停车场ID：</span><span style="${valueStyle}">${properties.lotId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">路侧泊位ID：</span><span style="${valueStyle}">${properties.roadsideId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">泊位编号：</span><span style="${valueStyle}">${properties.berthNumber || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">泊位状态：</span><span style="${valueStyle}; color: ${roadsideStatusMap[properties.roadsideStatus]?.color || '#999'};">${roadsideStatusText}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警ID：</span><span style="${valueStyle}">${properties.alertId || '无'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警类型：</span><span style="${valueStyle}">${properties.alertType || '无'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警等级：</span><span style="${valueStyle}; color: ${alertLevelInfo.color || '#999'};">${alertLevelInfo.text || '未知预警'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警时间：</span><span style="${valueStyle}">${formatTime(properties.createTime)}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">纬度, 经度：</span><span style="${valueStyle}">${properties.berthLatitude || '未知'}, ${properties.berthLongitude || '未知'}</span></div>
      </div>
    `;
    }
    case 'device': {
      const deviceStatusInfo = getDeviceStatusInfo(properties.deviceStatus);
      const alertLevelInfo =
        alertLevelMap[properties.alertLevel] || alertLevelMap[''];

      return `
      <div style="padding: 10px 12px; color: #333; background: white; border: 1px solid #ccc; min-width: 300px; border-radius: 4px;">
        <div style="${titleStyle}">设备详情</div>
        <div style="${rowStyle}"><span style="${labelStyle}">设备ID：</span><span style="${valueStyle}">${properties.deviceId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">设备类型：</span><span style="${valueStyle}">${deviceTypeMap[properties.deviceType] || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">设备状态：</span><span style="${valueStyle}; color: ${deviceStatusInfo.color};">${deviceStatusInfo.text}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">所属泊位：</span><span style="${valueStyle}">${properties.berthNumber || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">所属停车场：</span><span style="${valueStyle}">${properties.lotName || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警类型：</span><span style="${valueStyle}">${properties.alertType || '无'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警等级：</span><span style="${valueStyle}; color: ${alertLevelInfo.color || '#999'};">${alertLevelInfo.text || '未知预警'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警时间：</span><span style="${valueStyle}">${formatTime(properties.createTime)}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">纬度, 经度：</span><span style="${valueStyle}">${properties.deviceLatitude || '未知'}, ${properties.deviceLongitude || '未知'}</span></div>
      </div>
    `;
    }
    case 'parkLot': {
      const lotStatusText =
        lotStatusMap[properties.lotStatus]?.text || '未知状态';
      const occupyRate = properties.roadside
        ? `${(((properties.roadside - properties.availableRoadside) / properties.roadside) * 100).toFixed(1)}%`
        : '0%';
      const alertLevelInfo =
        alertLevelMap[properties.alertLevel] || alertLevelMap[''];

      return `
      <div style="padding: 10px 12px; color: #333; background: white; border: 1px solid #ccc; min-width: 380px; border-radius: 4px;">
        <div style="${titleStyle}">停车场详情</div>
        <div style="${rowStyle}"><span style="${labelStyle}">停车场ID：</span><span style="${valueStyle}">${properties.lotId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">停车场名称：</span><span style="${valueStyle}">${properties.lotName || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">行政区域编码：</span><span style="${valueStyle}">${properties.areaCode || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">停车场状态：</span><span style="${valueStyle}; color: ${lotStatusMap[properties.lotStatus]?.color || '#999'};">${lotStatusText}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">路侧泊位数：</span><span style="${valueStyle}">${properties.roadside || 0}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">可用路侧泊位数：</span><span style="${valueStyle}">${properties.availableRoadside || 0}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">泊位占用率：</span><span style="${valueStyle}">${occupyRate}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警等级：</span><span style="${valueStyle}; color: ${alertLevelInfo.color || '#999'};">${alertLevelInfo.text || '未知预警'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">预警时间：</span><span style="${valueStyle}">${formatTime(properties.createTime)}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">纬度, 经度：</span><span style="${valueStyle}">${properties.lotLatitude || '未知'}, ${properties.lotLongitude || '未知'}</span></div>
      </div>
    `;
    }
    // No default
  }
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

  infoWindow.value = new TMap.InfoWindow({
    map,
    position: new TMap.LatLng(0, 0),
    content: '',
    offset: { x: 0, y: -40 },
    visible: false,
  });
  infoWindow.value.on('close', handleInfoWindowClose);

  createAllMarkers(map);
  startOrbitAnimation();
};

// 监听数据变化重新渲染标注
watch(
  () => props.geometriesArray,
  (newVal) => {
    if (mapInitialized.value && Array.isArray(newVal)) {
      createAllMarkers(mapInstance.value);
    }
  },
  { deep: true },
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  stopOrbitAnimation();

  // 销毁所有标注层
  [
    parkMarkerLayer.value,
    berthMarkerLayer.value,
    deviceMarkerLayer.value,
  ].forEach((layer) => {
    if (layer) {
      try {
        layer.off('click', handleMarkerClick);
        layer.destroy();
      } catch (error) {
        console.warn('销毁标注层失败:', error);
      }
    }
  });

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

    <div class="legend">
      <div class="legend-items">
        <div class="legend-divider">
          <p>停车场:</p>
        </div>
        <div class="legend-item">
          <img :src="parkNormal" class="legend-icon" alt="正常" />
        </div>
        <div class="legend-item">
          <img :src="parkMaintain" class="legend-icon" alt="维护" />
        </div>
        <div class="legend-item">
          <img :src="parkPause" class="legend-icon" alt="暂停运营" />
        </div>
        <div class="legend-divider">
          <p>泊位:</p>
        </div>
        <div class="legend-item">
          <img :src="markerFault" class="legend-icon" alt="故障" />
        </div>
        <div class="legend-item">
          <img :src="markerIdle" class="legend-icon" alt="空闲" />
        </div>
        <div class="legend-item">
          <img :src="markerOccupy" class="legend-icon" alt="占用" />
        </div>
        <div class="legend-item">
          <img :src="markerForbid" class="legend-icon" alt="禁用" />
        </div>
        <div class="legend-divider">
          <p>设备:</p>
        </div>
        <div class="legend-item">
          <img :src="deviceFault" class="legend-icon" alt="设备故障" />
        </div>
        <div class="legend-item">
          <img :src="deviceOnline" class="legend-icon" alt="设备在线" />
        </div>
        <div class="legend-item">
          <img :src="deviceOffline" class="legend-icon" alt="设备离线" />
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
  gap: 1vw;
  align-items: center;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
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
