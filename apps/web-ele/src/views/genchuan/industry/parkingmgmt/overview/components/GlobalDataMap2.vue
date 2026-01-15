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

// 泊位状态图标
import markerFault from '../../images/berth_fault.png';
import markerForbid from '../../images/berth_forbid.png';
import markerIdle from '../../images/berth_idle.png';
import markerOccupy from '../../images/berth_occupy.png';
// 设备状态图标
import deviceFault from '../../images/device_fault.png';
import deviceMaintain from '../../images/device_maintain.png';
import deviceOffline from '../../images/device_offline.png';
import deviceOnline from '../../images/device_online.png';
// 停车场状态图标
import parkMaintain from '../../images/park_maintain.png';
import parkNormal from '../../images/park_normal.png';
import parkPause from '../../images/park_pause.png';
// 公共未知图标
import markerUnknown from '../../images/unknown.png';
// ======== 新增：运维人员精简图标(仅3个，满足需求且最少) ========
import maintainOnDuty from '../../images/maintain_on_duty.png'; // 在岗
import maintainTask from '../../images/maintain_task.png';     // 任务中
import maintainOffDuty from '../../images/maintain_off.png';   // 离岗

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
      center: {lat: 24.58, lng: 117.65},
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
// ======== 新增：运维人员标注层 ========
const maintainMarkerLayer = ref(null);
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
  {deep: true, immediate: true},
);

// 状态映射表
const lotStatusMap = {
  正常: {
    color: '#39b20d',
    icon: parkNormal,
    text: '正常',
    size: {w: 50, h: 50},
    styleId: 'normal',
  },
  暂停运营: {
    color: '#FF4500',
    icon: parkPause,
    text: '暂停运营',
    size: {w: 50, h: 50},
    styleId: 'pause',
  },
  维护: {
    color: '#FFA500',
    icon: parkMaintain,
    text: '维护',
    size: {w: 50, h: 50},
    styleId: 'maintain',
  },
};
const roadsideStatusMap = {
  空闲: {color: '#FFA500', icon: markerIdle, text: '空闲', size: {w: 30, h: 30}, styleId: 'idle'},
  占用: {color: 'blue', icon: markerOccupy, text: '占用', size: {w: 30, h: 30}, styleId: 'occupy'},
  故障: {color: '#FF4500', icon: markerFault, text: '故障', size: {w: 30, h: 30}, styleId: 'fault'},
  禁用: {
    color: '#5b5757',
    icon: markerForbid,
    text: '禁用',
    size: {w: 30, h: 30},
    styleId: 'forbid'
  },
};
const deviceStatusStyleMap = {
  在线: {
    color: '#39b20d',
    icon: deviceOnline,
    text: '在线',
    size: {w: 20, h: 20},
    styleId: 'device-online'
  },
  离线: {
    color: '#5b5757',
    icon: deviceOffline,
    text: '离线',
    size: {w: 20, h: 20},
    styleId: 'device-offline'
  },
  故障: {
    color: '#FF4500',
    icon: deviceFault,
    text: '故障',
    size: {w: 20, h: 20},
    styleId: 'device-fault'
  },
  '': {
    color: '#999999',
    icon: markerUnknown,
    text: '状态未知',
    size: {w: 20, h: 20},
    styleId: 'device-unknown'
  },
};
// ======== 新增：运维人员状态映射表(极简3种状态，匹配需求) ========
const maintainStatusMap = {
  在岗: {
    color: '#39b20d',
    icon: maintainOnDuty,
    text: '在岗',
    size: {w: 36, h: 36},
    styleId: 'onDuty'
  },
  任务中: {
    color: '#1E90FF',
    icon: maintainTask,
    text: '任务中',
    size: {w: 36, h: 36},
    styleId: 'tasking'
  },
  离岗: {
    color: '#5b5757',
    icon: maintainOffDuty,
    text: '离岗',
    size: {w: 36, h: 36},
    styleId: 'offDuty'
  },
  '': {
    color: '#999',
    icon: markerUnknown,
    text: '状态未知',
    size: {w: 36, h: 36},
    styleId: 'unknown'
  },
};
const deviceTypeMap = {
  道闸: '道闸',
  摄像头: '摄像头',
  计费桩: '计费桩',
  充电桩: '充电桩',
  传感器: '传感器',
  边缘网关: '边缘网关',
  '': '未知设备'
};
const alertLevelMap = {
  高: {text: '高', color: '#8f0000'},
  中: {text: '中', color: '#c72d2d'},
  低: {text: '低', color: '#ea7373'},
  '': {text: '未知预警', color: '#999999'}
};

// 点击标注展示信息窗口
const handleMarkerClick = (e) => {
  const {properties, position} = e.geometry;
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

// 核心修改：适配拆分后的经纬度字段 + 新增运维人员标注渲染
const createAllMarkers = (map) => {
  // 销毁原有所有标注层
  [parkMarkerLayer.value, berthMarkerLayer.value, deviceMarkerLayer.value, maintainMarkerLayer.value].forEach(layer => {
    if (layer) {
      try {
        layer.off('click', handleMarkerClick);
        layer.destroy();
      } catch (error) {
        console.warn('销毁标注层失败:', error);
      }
    }
  });
  parkMarkerLayer.value = null;
  berthMarkerLayer.value = null;
  deviceMarkerLayer.value = null;
  maintainMarkerLayer.value = null;

  if (!Array.isArray(props.geometriesArray) || props.geometriesArray.length === 0) return;

  const parkData = [];
  const berthData = [];
  const deviceData = [];
  const maintainData = [];
  const parkIdSet = new Set();
  // ======== 新增：运维人员ID去重 ========
  const maintainIdSet = new Set();

  // 1. 停车场数据
  props.geometriesArray.forEach((item) => {
    const {lotId, lotLongitude, lotLatitude, lotStatus} = item;
    if (!item || !lotId || typeof lotLongitude !== 'number' || typeof lotLatitude !== 'number') return;
    if (!parkIdSet.has(lotId)) {
      parkIdSet.add(lotId);
      const styleId = lotStatusMap[lotStatus || '']?.styleId || 'default';
      parkData.push({
        id: `park-${lotId}`,
        styleId: `park-${styleId}`,
        position: new TMap.LatLng(lotLatitude, lotLongitude),
        properties: {...item, markerType: 'parkLot'}
      });
    }
  });

  // 2. 泊位+设备数据
  props.geometriesArray.forEach((item, index) => {
    const {
      berthLongitude,
      berthLatitude,
      roadsideStatus,
      deviceId,
      deviceStatus,
      deviceLongitude,
      deviceLatitude
    } = item;
    if (!item || typeof berthLongitude !== 'number' || typeof berthLatitude !== 'number') return;
    // 泊位标注
    const styleId = roadsideStatusMap[roadsideStatus || '']?.styleId || 'default';
    berthData.push({
      id: `berth-${index}`,
      styleId: `berth-${styleId}`,
      position: new TMap.LatLng(berthLatitude, berthLongitude),
      properties: {...item, markerType: 'berth'}
    });
    // 设备标注
    if (deviceId) {
      const devStyleId = deviceStatusStyleMap[deviceStatus || '']?.styleId || 'device-unknown';
      const finalDeviceLat = deviceLatitude || berthLatitude + 0.0001;
      const finalDeviceLng = deviceLongitude || berthLongitude + 0.0001;
      deviceData.push({
        id: `device-${deviceId}`,
        styleId: devStyleId,
        position: new TMap.LatLng(finalDeviceLat, finalDeviceLng),
        properties: {...item, markerType: 'device'}
      });
    }
  });

  // ======== 新增：运维人员数据提取(核心，按ID去重，独立经纬度) ========
  props.geometriesArray.forEach((item) => {
    const {maintainUserId, maintainLatitude, maintainLongitude, onDutyStatus} = item;
    if (!item || !maintainUserId || typeof maintainLatitude !== 'number' || typeof maintainLongitude !== 'number') return;
    if (!maintainIdSet.has(maintainUserId)) {
      maintainIdSet.add(maintainUserId);
      const styleId = maintainStatusMap[onDutyStatus || '']?.styleId || 'unknown';
      maintainData.push({
        id: `maintain-${maintainUserId}`,
        styleId: `maintain-${styleId}`,
        position: new TMap.LatLng(maintainLatitude, maintainLongitude),
        properties: {...item, markerType: 'maintainStaff'}
      });
    }
  });

  // 创建停车场标注层
  if (parkData.length > 0) {
    parkMarkerLayer.value = new TMap.MultiMarker({
      map, styles: {
        'park-normal': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: {x: 20, y: 35},
          src: parkNormal
        }),
        'park-pause': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: {x: 20, y: 35},
          src: parkPause
        }),
        'park-maintain': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: {x: 20, y: 35},
          src: parkMaintain
        }),
        'park-default': new TMap.MarkerStyle({
          width: 50,
          height: 50,
          anchor: {x: 20, y: 35},
          src: markerUnknown
        })
      }, geometries: parkData
    });
    parkMarkerLayer.value.on('click', handleMarkerClick);
  }

  // 创建泊位标注层
  if (berthData.length > 0) {
    berthMarkerLayer.value = new TMap.MultiMarker({
      map, styles: {
        'berth-idle': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: {x: 15, y: 25},
          src: markerIdle
        }),
        'berth-occupy': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: {x: 15, y: 25},
          src: markerOccupy
        }),
        'berth-fault': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: {x: 15, y: 25},
          src: markerFault
        }),
        'berth-forbid': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: {x: 15, y: 25},
          src: markerForbid
        }),
        'berth-default': new TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: {x: 15, y: 25},
          src: markerUnknown
        })
      }, geometries: berthData
    });
    berthMarkerLayer.value.on('click', handleMarkerClick);
  }

  // 创建设备标注层
  if (deviceData.length > 0) {
    deviceMarkerLayer.value = new TMap.MultiMarker({
      map, styles: {
        'device-online': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: {x: 10, y: 10},
          src: deviceOnline
        }),
        'device-offline': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: {x: 10, y: 10},
          src: deviceOffline
        }),
        'device-fault': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: {x: 10, y: 10},
          src: deviceFault
        }),
        'device-maintain': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: {x: 10, y: 10},
          src: deviceMaintain
        }),
        'device-unknown': new TMap.MarkerStyle({
          width: 20,
          height: 20,
          anchor: {x: 10, y: 10},
          src: markerUnknown
        })
      }, geometries: deviceData
    });
    deviceMarkerLayer.value.on('click', handleMarkerClick);
  }

  // ======== 新增：创建运维人员标注层(极简样式，3种状态) ========
  if (maintainData.length > 0) {
    maintainMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'maintain-onDuty': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: {x: 18, y: 30},
          src: maintainOnDuty
        }),
        'maintain-tasking': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: {x: 18, y: 30},
          src: maintainTask
        }),
        'maintain-offDuty': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: {x: 18, y: 30},
          src: maintainOffDuty
        }),
        'maintain-unknown': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: {x: 18, y: 30},
          src: markerUnknown
        })
      },
      geometries: maintainData
    });
    maintainMarkerLayer.value.on('click', handleMarkerClick);
  }
};

// 信息窗口内容生成：新增运维人员详情弹窗 + 所有字段完整展示
const getTooltipContent = (properties) => {
  const labelStyle = 'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle = 'margin-bottom: 6px; font-weight: bold; color: #1E90FF; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  const formatTime = (timeStamp) => {
    if (!timeStamp) return '未知';
    const date = new Date(timeStamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  switch (properties.markerType) {
    case 'berth':
      const roadsideStatusText = roadsideStatusMap[properties.roadsideStatus]?.text || '未知状态';
      const alertLevelInfo = alertLevelMap[properties.alertLevel] || alertLevelMap[''];
      return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:380px;border-radius:4px;"><div style="${titleStyle}">泊位详情</div><div style="${rowStyle}"><span style="${labelStyle}">所属停车场ID：</span><span style="${valueStyle}">${properties.lotId || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">路侧泊位ID：</span><span style="${valueStyle}">${properties.roadsideId || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">泊位编号：</span><span style="${valueStyle}">${properties.berthNumber || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">泊位状态：</span><span style="${valueStyle};color:${roadsideStatusMap[properties.roadsideStatus]?.color || '#999'};">${roadsideStatusText}</span></div><div style="${rowStyle}"><span style="${labelStyle}">预警等级：</span><span style="${valueStyle};color:${alertLevelInfo.color || '#999'};">${alertLevelInfo.text}</span></div><div style="${rowStyle}"><span style="${labelStyle}">纬度, 经度：</span><span style="${valueStyle}">${properties.berthLatitude || '未知'}, ${properties.berthLongitude || '未知'}</span></div></div>`;
    case 'device':
      const deviceStatusInfo = deviceStatusStyleMap[properties.deviceStatus] || deviceStatusStyleMap[''];
      const alertLevelInfo2 = alertLevelMap[properties.alertLevel] || alertLevelMap[''];
      return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:300px;border-radius:4px;"><div style="${titleStyle}">设备详情</div><div style="${rowStyle}"><span style="${labelStyle}">设备ID：</span><span style="${valueStyle}">${properties.deviceId || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">设备类型：</span><span style="${valueStyle}">${deviceTypeMap[properties.deviceType] || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">设备状态：</span><span style="${valueStyle};color:${deviceStatusInfo.color};">${deviceStatusInfo.text}</span></div><div style="${rowStyle}"><span style="${labelStyle}">所属泊位：</span><span style="${valueStyle}">${properties.berthNumber || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">纬度, 经度：</span><span style="${valueStyle}">${properties.deviceLatitude || '未知'}, ${properties.deviceLongitude || '未知'}</span></div></div>`;
    case 'parkLot':
      const lotStatusText = lotStatusMap[properties.lotStatus]?.text || '未知状态';
      const occupyRate = properties.roadside ? `${(((properties.roadside - properties.availableRoadside) / properties.roadside) * 100).toFixed(1)}%` : '0%';
      const alertLevelInfo3 = alertLevelMap[properties.alertLevel] || alertLevelMap[''];
      return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:380px;border-radius:4px;"><div style="${titleStyle}">停车场详情</div><div style="${rowStyle}"><span style="${labelStyle}">停车场ID：</span><span style="${valueStyle}">${properties.lotId || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">停车场名称：</span><span style="${valueStyle}">${properties.lotName || '未知'}</span></div><div style="${rowStyle}"><span style="${labelStyle}">停车场状态：</span><span style="${valueStyle};color:${lotStatusMap[properties.lotStatus]?.color || '#999'};">${lotStatusText}</span></div><div style="${rowStyle}"><span style="${labelStyle}">泊位占用率：</span><span style="${valueStyle}">${occupyRate}</span></div><div style="${rowStyle}"><span style="${labelStyle}">纬度, 经度：</span><span style="${valueStyle}">${properties.lotLatitude || '未知'}, ${properties.lotLongitude || '未知'}</span></div></div>`;
    // ======== 新增：运维人员详情信息窗(完整匹配接口所有字段) ========
    case 'maintainStaff':
      const maintainStatusText = maintainStatusMap[properties.onDutyStatus]?.text || '未知状态';
      return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:380px;border-radius:4px;"><div style="${titleStyle}">运维人员详情</div>
        <div style="${rowStyle}"><span style="${labelStyle}">运维人员ID：</span><span style="${valueStyle}">${properties.maintainUserId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">姓名：</span><span style="${valueStyle}">${properties.userName || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">所属部门：</span><span style="${valueStyle}">${properties.department || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">负责区域：</span><span style="${valueStyle}">${properties.responsibleArea || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">在岗状态：</span><span style="${valueStyle};color:${maintainStatusMap[properties.onDutyStatus]?.color || '#999'};">${maintainStatusText}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">排班ID：</span><span style="${valueStyle}">${properties.scheduleId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">班次类型：</span><span style="${valueStyle}">${properties.shiftType || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">工作时段：</span><span style="${valueStyle}">${properties.workTime || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">联系电话：</span><span style="${valueStyle}">${properties.contactPhone || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">当前任务：</span><span style="${valueStyle}">${properties.currentTask || '无任务'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">纬度, 经度：</span><span style="${valueStyle}">${properties.maintainLatitude || '未知'}, ${properties.maintainLongitude || '未知'}</span></div>
      </div>`;
  }
};

const mapCallback = () => {
  const mapContainer = document.querySelector(`#${props.idName}`);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }

  const {center, zoom, pitch} = props.orbitConfig;
  const map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(center.lat, center.lng),
    zoom,
    mapStyleId: 'style1',
    enablePitch: true,
    enableRotate: true,
    pitch,
    rotation: 0
  });
  mapInstance.value = map;
  mapInitialized.value = true;

  infoWindow.value = new TMap.InfoWindow({
    map,
    position: new TMap.LatLng(0, 0),
    content: '',
    offset: {x: 0, y: -40},
    visible: false
  });
  infoWindow.value.on('close', handleInfoWindowClose);

  createAllMarkers(map);
  startOrbitAnimation();
};

// 监听数据变化重新渲染标注
watch(
  () => props.geometriesArray,
  (newVal) => {
    if (mapInitialized.value && Array.isArray(newVal)) createAllMarkers(mapInstance.value);
  },
  {deep: true}
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  stopOrbitAnimation();
  // 销毁所有标注层+信息窗+地图
  [parkMarkerLayer.value, berthMarkerLayer.value, deviceMarkerLayer.value, maintainMarkerLayer.value].forEach(layer => {
    if (layer) {
      try {
        layer.off('click', handleMarkerClick);
        layer.destroy();
      } catch (error) {
        console.warn('销毁标注层失败:', error);
      }
    }
  });
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

  orbitStatus.value = {playing: false, currentRotation: 0, animationFrameId: null, isInited: false};
  mapInitialized.value = false;
});

defineExpose({toggleOrbitAnimation, orbitStatus, startOrbitAnimation, stopOrbitAnimation});
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>

    <div class="legend">
      <div class="legend-items">
        <div class="legend-item"><img :src="maintainOnDuty" class="legend-icon" alt="在岗"/></div>
        <div class="legend-item"><img :src="maintainTask" class="legend-icon" alt="任务中"/></div>
        <div class="legend-item"><img :src="maintainOffDuty" class="legend-icon" alt="离岗"/></div>
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
