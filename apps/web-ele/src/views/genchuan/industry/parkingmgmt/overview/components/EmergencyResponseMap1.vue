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

// ✅ 停车应急事件专属图标 (停车场场景匹配，替换你的项目图标路径即可)
import emergencyFire from '../../images/emergency_fire.png'; // 停车场火灾
import emergencyDevice from '../../images/emergency_device.png'; // 停车场设备大规模故障
import emergencyTraffic from '../../images/emergency_traffic.png'; // 停车场车辆拥堵
import emergencyWeather from '../../images/emergency_weather.png'; // 停车场极端天气影响
import emergencyControl from '../../images/emergency_control.png'; // 停车场突发管制
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
      zoom: 16,
      loop: true,
    }),
  },
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const emergencyMarkerLayer = ref(null);
const emergencyCircleLayer = ref(null); // 停车场应急事件 影响范围缓冲区图层
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

// ✅ 严格匹配你指定的【5种停车场应急类型】+ 应急等级 停车专属映射表
const emergencyTypeMap = {
  '停车场火灾': { icon: emergencyFire, text: '停车场火灾', color: '#e53e3e', size: { w: 40, h: 40 }, styleId: 'fire' },
  '设备大规模故障': { icon: emergencyDevice, text: '车场设备故障', color: '#d69e2e', size: { w: 40, h: 40 }, styleId: 'device' },
  '车辆拥堵': { icon: emergencyTraffic, text: '车场车辆拥堵', color: '#2b6cb0', size: { w: 40, h: 40 }, styleId: 'traffic' },
  '极端天气影响': { icon: emergencyWeather, text: '车场天气影响', color: '#3182ce', size: { w: 40, h: 40 }, styleId: 'weather' },
  '突发管制': { icon: emergencyControl, text: '车场突发管制', color: '#805ad5', size: { w: 40, h: 40 }, styleId: 'control' },
  '': { icon: markerUnknown, text: '未知类型', color: '#999', size: { w: 40, h: 40 }, styleId: 'unknown' },
};
// 停车场应急等级配色
const emergencyLevelColor = { 一级: '#ff0000', 二级: '#ff7d00', 三级: '#ffbb00', 四级: '#34d399', '': '#999' };

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

// ✅ 核心渲染：停车场应急事件标注 + 影响范围缓冲区 字段100%匹配接口 fetchEmergencySituationMap
const createAllMarkers = (map) => {
  // 销毁原有图层
  if (emergencyMarkerLayer.value) {
    try { emergencyMarkerLayer.value.off('click', handleMarkerClick); emergencyMarkerLayer.value.destroy(); } catch (error) { console.warn('销毁停车场应急事件标注层失败:', error); }
    emergencyMarkerLayer.value = null;
  }
  if (emergencyCircleLayer.value) {
    try { emergencyCircleLayer.value.destroy(); } catch (error) { console.warn('销毁停车场影响范围缓冲区失败:', error); }
    emergencyCircleLayer.value = null;
  }

  if (!Array.isArray(props.geometriesArray) || props.geometriesArray.length === 0) return;

  const emergencyData = [];
  const emergencyCircleData = [];
  const emergencyIdSet = new Set(); // 停车应急事件ID去重

  // 提取数据-严格匹配接口返回的停车应急事件字段
  props.geometriesArray.forEach((item) => {
    const { emergencyId, longitude, latitude, emergencyType, influenceRange } = item;
    if (!item || !emergencyId || typeof longitude !== 'number' || typeof latitude !== 'number') return;
    if (!emergencyIdSet.has(emergencyId)) {
      emergencyIdSet.add(emergencyId);
      const styleInfo = emergencyTypeMap[emergencyType || ''];
      // 停车场应急事件点位数据
      emergencyData.push({
        id: `emergency-${emergencyId}`,
        styleId: `emergency-${styleInfo.styleId}`,
        position: new TMap.LatLng(latitude, longitude),
        properties: { ...item, markerType: 'parkEmergencyEvent' },
      });
      // 停车场应急事件 影响范围圆形缓冲区 (单位：米)
      if (influenceRange && typeof influenceRange === 'number' && influenceRange > 0) {
        emergencyCircleData.push({
          id: `circle-${emergencyId}`,
          styleId: 'emergencyCircle',
          center: new TMap.LatLng(latitude, longitude),
          radius: influenceRange,
          properties: { emergencyId }
        });
      }
    }
  });

  // 创建停车场应急事件标注层
  if (emergencyData.length > 0) {
    emergencyMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'emergency-fire': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyFire }),
        'emergency-device': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyDevice }),
        'emergency-traffic': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyTraffic }),
        'emergency-weather': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyWeather }),
        'emergency-control': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyControl }),
        'emergency-unknown': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: markerUnknown }),
      },
      geometries: emergencyData,
    });
    emergencyMarkerLayer.value.on('click', handleMarkerClick);
  }

  // 创建停车场应急影响范围缓冲区
  if (emergencyCircleData.length > 0) {
    emergencyCircleLayer.value = new TMap.MultiCircle({
      map,
      styles: {
        emergencyCircle: new TMap.CircleStyle({
          color: 'rgba(236, 72, 153, 0.2)',
          showBorder: true,
          borderColor: 'rgba(236, 72, 153, 0.8)',
          borderWidth: 2
        })
      },
      geometries: emergencyCircleData
    });
  }
};

// ✅ 信息窗：停车场应急事件详情 字段100%匹配接口 全停车业务文案
const getTooltipContent = (properties) => {
  const labelStyle = 'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle = 'margin-bottom: 6px; font-weight: bold; color: #e53e3e; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  if (properties.markerType === 'parkEmergencyEvent') {
    const levelColor = emergencyLevelColor[properties.emergencyLevel] || '#999';
    return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:380px;border-radius:4px;"><div style="${titleStyle}">停车场应急事件详情</div>
      <div style="${rowStyle}"><span style="${labelStyle}">应急事件ID：</span><span style="${valueStyle}">${properties.emergencyId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">应急等级：</span><span style="${valueStyle};color:${levelColor};font-weight:bold;">${properties.emergencyLevel || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">应急类型：</span><span style="${valueStyle}">${properties.emergencyType || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">车场位置：</span><span style="${valueStyle}">${properties.address || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">经纬度：</span><span style="${valueStyle}">${properties.longitude || '未知'}, ${properties.latitude || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">影响范围：</span><span style="${valueStyle}">${properties.influenceRange || 0} 米</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">受影响车辆数：</span><span style="${valueStyle}">${properties.affectedVehicleCount || 0} 辆</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">救援进度：</span><span style="${valueStyle};color:#22c55e;font-weight:bold;">${properties.rescueProgress || 0} %</span></div>
    </div>`;
  }
  return '';
};

const mapCallback = () => {
  const mapContainer = document.querySelector(`#${props.idName}`);
  if (!mapContainer) { console.error(`地图容器不存在：${props.idName}`); return; }

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

  infoWindow.value = new TMap.InfoWindow({ map, position: new TMap.LatLng(0,0), content: '', offset:{x:0,y:-40}, visible: false });
  infoWindow.value.on('close', handleInfoWindowClose);

  createAllMarkers(map);
  startOrbitAnimation();
};

// 监听数据变化重新渲染标注
watch(() => props.geometriesArray, (newVal) => {
  if (mapInitialized.value && Array.isArray(newVal)) createAllMarkers(mapInstance.value);
}, { deep: true });

onMounted(() => { initMap(); });

onUnmounted(() => {
  stopOrbitAnimation();
  if (emergencyMarkerLayer.value) { emergencyMarkerLayer.value.off('click', handleMarkerClick); emergencyMarkerLayer.value.destroy(); }
  if (emergencyCircleLayer.value) emergencyCircleLayer.value.destroy();
  if (infoWindow.value) { infoWindow.value.off('close', handleInfoWindowClose); infoWindow.value.destroy(); }
  if (mapInstance.value) mapInstance.value.destroy();

  orbitStatus.value = { playing: false, currentRotation:0, animationFrameId:null, isInited:false };
  mapInitialized.value = false;
});

defineExpose({ toggleOrbitAnimation, orbitStatus, startOrbitAnimation, stopOrbitAnimation });
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>
    <!-- 停车场应急事件专属图例 -->
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item"><img :src="emergencyFire" class="legend-icon" alt="火灾" />停车场火灾</div>
        <div class="legend-item"><img :src="emergencyDevice" class="legend-icon" alt="故障" />设备故障</div>
        <div class="legend-item"><img :src="emergencyTraffic" class="legend-icon" alt="拥堵" />车辆拥堵</div>
        <div class="legend-item"><img :src="emergencyWeather" class="legend-icon" alt="天气" />极端天气</div>
        <div class="legend-item"><img :src="emergencyControl" class="legend-icon" alt="管制" />突发管制</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container { position: relative; width: 100%; height: 100%; }
.map-common-css { width: 100%; height: 99%; margin: 0 auto; overflow: hidden; border-radius: 8px; }
.legend { position: absolute; bottom: 0.1vh; left: 0; box-sizing: border-box; display: flex; flex-flow: column wrap; align-items: flex-end; width: 100%; height: auto; padding: 0.5vw; background: rgb(0 0 0 / 50%); }
.legend-items { display: flex; flex-direction: row; gap: 1vw; align-items: center; justify-content: center; }
.legend-item { display: flex; gap: 0.1vw; align-items: center; font-size: 0.7vw; color: #fff; }
.legend-icon { width: 1vw; height: 1.5vh; object-fit: contain; }
</style>
