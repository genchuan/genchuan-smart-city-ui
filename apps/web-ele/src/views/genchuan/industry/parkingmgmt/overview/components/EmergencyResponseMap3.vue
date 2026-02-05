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

// ✅ 停车场专项应急专属图标 (严格匹配你指定的3种应急场景，替换你的项目图标路径)
import emergencyEvacuate from '../../images/emergency_evacuate.png'; // 停车场应急疏散
import emergencyTraffic from '../../images/emergency_traffic.png'; // 停车场车辆拥堵应急
import emergencyRepair from '../../images/emergency_repair.png'; // 停车场设备故障应急抢修
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
      zoom: 18,
      loop: true,
    }),
  },
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const specialMarkerLayer = ref(null);
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

// ✅ 严格匹配你指定的【3种停车场专项应急场景】映射表 无任何新增
const emergencySceneMap = {
  '停车场应急疏散': { icon: emergencyEvacuate, text: '应急疏散', color: '#ef4444', size: { w: 40, h: 40 }, styleId: 'evacuate' },
  '车辆拥堵应急': { icon: emergencyTraffic, text: '车辆拥堵', color: '#f97316', size: { w: 40, h: 40 }, styleId: 'traffic' },
  '设备故障应急抢修': { icon: emergencyRepair, text: '设备抢修', color: '#10b981', size: { w: 40, h: 40 }, styleId: 'repair' },
  '': { icon: markerUnknown, text: '未知场景', color: '#999', size: { w: 40, h: 40 }, styleId: 'unknown' },
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

// ✅ 核心渲染：停车场专项应急标注 字段100%匹配接口 fetchSpecialEmergencyViewMap
const createAllMarkers = (map) => {
  // 销毁原有图层
  if (specialMarkerLayer.value) {
    try { specialMarkerLayer.value.off('click', handleMarkerClick); specialMarkerLayer.value.destroy(); } catch (error) { console.warn('销毁停车场专项应急标注层失败:', error); }
    specialMarkerLayer.value = null;
  }

  if (!Array.isArray(props.geometriesArray) || props.geometriesArray.length === 0) return;

  const specialData = [];
  const specialIdSet = new Set(); // 专项应急ID去重

  // 提取数据-严格匹配停车场专项应急字段
  props.geometriesArray.forEach((item) => {
    const { specialEmergencyId, longitude, latitude, emergencyScene } = item;
    if (!item || !specialEmergencyId || typeof longitude !== 'number' || typeof latitude !== 'number') return;
    if (!specialIdSet.has(specialEmergencyId)) {
      specialIdSet.add(specialEmergencyId);
      const styleInfo = emergencySceneMap[emergencyScene || ''];
      // 停车场专项应急点位数据
      specialData.push({
        id: `special-${specialEmergencyId}`,
        styleId: `special-${styleInfo.styleId}`,
        position: new TMap.LatLng(latitude, longitude),
        properties: { ...item, markerType: 'parkSpecialEmergency' },
      });
    }
  });

  // 创建停车场专项应急标注层
  if (specialData.length > 0) {
    specialMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'special-evacuate': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyEvacuate }),
        'special-traffic': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyTraffic }),
        'special-repair': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: emergencyRepair }),
        'special-unknown': new TMap.MarkerStyle({ width:40, height:40, anchor:{x:20,y:34}, src: markerUnknown }),
      },
      geometries: specialData,
    });
    specialMarkerLayer.value.on('click', handleMarkerClick);
  }
};

// ✅ 信息窗：停车场专项应急详情 字段100%匹配接口 停车业务专属文案
const getTooltipContent = (properties) => {
  const labelStyle = 'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle = 'margin-bottom: 6px; font-weight: bold; color: #ef4444; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  if (properties.markerType === 'parkSpecialEmergency') {
    const sceneText = emergencySceneMap[properties.emergencyScene]?.text || '未知场景';
    return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:380px;border-radius:4px;"><div style="${titleStyle}">停车场专项应急详情</div>
      <div style="${rowStyle}"><span style="${labelStyle}">专项应急ID：</span><span style="${valueStyle}">${properties.specialEmergencyId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">应急场景：</span><span style="${valueStyle};font-weight:bold;">${sceneText}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">疏散通道：</span><span style="${valueStyle}">${properties.evacuationRoute || '无'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">安全出口：</span><span style="${valueStyle}">${properties.address || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">受困车辆数：</span><span style="${valueStyle};color:#ef4444;font-weight:bold;">${properties.trappedVehicleCount || 0} 辆</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">疏散进度：</span><span style="${valueStyle};color:#10b981;font-weight:bold;">${properties.evacuationProgress || 0} %</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">抢修进度：</span><span style="${valueStyle};color:#10b981;font-weight:bold;">${properties.repairProgress || 0} %</span></div>
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
  if (specialMarkerLayer.value) { specialMarkerLayer.value.off('click', handleMarkerClick); specialMarkerLayer.value.destroy(); }
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
    <!-- 停车场专项应急专属图例 -->
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item"><img :src="emergencyEvacuate" class="legend-icon" alt="疏散" />应急疏散</div>
        <div class="legend-item"><img :src="emergencyTraffic" class="legend-icon" alt="拥堵" />车辆拥堵</div>
        <div class="legend-item"><img :src="emergencyRepair" class="legend-icon" alt="抢修" />设备抢修</div>
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
