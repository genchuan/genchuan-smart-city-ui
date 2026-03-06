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

// ✅ 停车场应急资源专属图标 (严格匹配你指定的5种资源类型，替换你的项目图标路径)
import resourceTool from '../../images/resource_tool.png'; // 维修工具(车场专用)
import resourceDevice from '../../images/resource_device.png'; // 备用设备(道闸/充电桩/摄像头)
import resourceFire from '../../images/resource_fire.png'; // 消防器材(车场消防栓/灭火器)
import resourceTeam from '../../images/resource_team.png'; // 救援队伍(车场运维/安保)
import resourceCar from '../../images/resource_car.png'; // 抢修车辆(车场工程车/救援车)
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
      rotateSpeed: 0.05,
      pitch: 40,
      zoom: 18,
      loop: true,
    }),
  },
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const resourceMarkerLayer = ref(null);
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

// ✅ 严格匹配你指定的【5种停车场应急资源类型】下划线字段专属映射表
const resourceTypeMap = {
  '维修工具': { icon: resourceTool, text: '维修工具', color: '#16a34a', size: { w: 38, h: 38 }, styleId: 'tool' },
  '备用设备': { icon: resourceDevice, text: '备用设备', color: '#ca8a04', size: { w: 38, h: 38 }, styleId: 'device' },
  '消防器材': { icon: resourceFire, text: '消防器材', color: '#dc2626', size: { w: 38, h: 38 }, styleId: 'fire' },
  '救援队伍': { icon: resourceTeam, text: '救援队伍', color: '#2563eb', size: { w: 38, h: 38 }, styleId: 'team' },
  '抢修车辆': { icon: resourceCar, text: '抢修车辆', color: '#9333ea', size: { w: 38, h: 38 }, styleId: 'car' },
  '': { icon: markerUnknown, text: '未知资源', color: '#999', size: { w: 38, h: 38 }, styleId: 'unknown' },
};
// 停车场资源状态配色
const resourceStatusColor = { 正常可用: '#16a34a', 调度中: '#2563eb', 闲置: '#94a3b8', 故障: '#dc2626', '': '#999' };

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

// ✅ 核心渲染：停车场应急资源标注 【全部保留下划线字段】100%匹配接口 fetchEmergencyResourceDistributionMap
const createAllMarkers = (map) => {
  // 销毁原有图层
  if (resourceMarkerLayer.value) {
    try { resourceMarkerLayer.value.off('click', handleMarkerClick); resourceMarkerLayer.value.destroy(); } catch (error) { console.warn('销毁停车场资源标注层失败:', error); }
    resourceMarkerLayer.value = null;
  }

  if (!Array.isArray(props.geometriesArray) || props.geometriesArray.length === 0) return;

  const resourceData = [];
  const resourceIdSet = new Set(); // 资源ID去重

  // 提取数据-✅严格保留所有下划线字段 无任何修改
  props.geometriesArray.forEach((item) => {
    const { resource_id, longitude, latitude, resource_type } = item;
    if (!item || !resource_id || typeof longitude !== 'number' || typeof latitude !== 'number') return;
    if (!resourceIdSet.has(resource_id)) {
      resourceIdSet.add(resource_id);
      const styleInfo = resourceTypeMap[resource_type || ''];
      // 停车场应急资源点位数据
      resourceData.push({
        id: `resource-${resource_id}`,
        styleId: `resource-${styleInfo.styleId}`,
        position: new TMap.LatLng(latitude, longitude),
        properties: { ...item, markerType: 'parkEmergencyResource' },
      });
    }
  });

  // 创建停车场应急资源标注层
  if (resourceData.length > 0) {
    resourceMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'resource-tool': new TMap.MarkerStyle({ width:38, height:38, anchor:{x:19,y:32}, src: resourceTool }),
        'resource-device': new TMap.MarkerStyle({ width:38, height:38, anchor:{x:19,y:32}, src: resourceDevice }),
        'resource-fire': new TMap.MarkerStyle({ width:38, height:38, anchor:{x:19,y:32}, src: resourceFire }),
        'resource-team': new TMap.MarkerStyle({ width:38, height:38, anchor:{x:19,y:32}, src: resourceTeam }),
        'resource-car': new TMap.MarkerStyle({ width:38, height:38, anchor:{x:19,y:32}, src: resourceCar }),
        'resource-unknown': new TMap.MarkerStyle({ width:38, height:38, anchor:{x:19,y:32}, src: markerUnknown }),
      },
      geometries: resourceData,
    });
    resourceMarkerLayer.value.on('click', handleMarkerClick);
  }
};

// ✅ 信息窗：停车场应急资源详情 【全部保留下划线字段】无任何修改 停车业务专属文案
const getTooltipContent = (properties) => {
  const labelStyle = 'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle = 'margin-bottom: 6px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  if (properties.markerType === 'parkEmergencyResource') {
    const statusColor = resourceStatusColor[properties.resource_status] || '#999';
    return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:380px;border-radius:4px;"><div style="${titleStyle}">停车场应急资源详情</div>
      <div style="${rowStyle}"><span style="${labelStyle}">资源ID：</span><span style="${valueStyle}">${properties.resource_id || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">资源类型：</span><span style="${valueStyle}">${properties.resource_type || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">资源位置：</span><span style="${valueStyle}">${properties.address || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">经纬度：</span><span style="${valueStyle}">${properties.longitude || '未知'}, ${properties.latitude || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">资源状态：</span><span style="${valueStyle};color:${statusColor};font-weight:bold;">${properties.resource_status || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">所属部门：</span><span style="${valueStyle}">${properties.belong_department || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">距应急事件：</span><span style="${valueStyle};color:#f97316;font-weight:bold;">${properties.emergencyEventDistance || 0} KM</span></div>
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
  if (resourceMarkerLayer.value) { resourceMarkerLayer.value.off('click', handleMarkerClick); resourceMarkerLayer.value.destroy(); }
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
    <!-- 停车场应急资源专属图例 -->
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item"><img :src="resourceTool" class="legend-icon" alt="工具" />维修工具</div>
        <div class="legend-item"><img :src="resourceDevice" class="legend-icon" alt="设备" />备用设备</div>
        <div class="legend-item"><img :src="resourceFire" class="legend-icon" alt="消防" />消防器材</div>
        <div class="legend-item"><img :src="resourceTeam" class="legend-icon" alt="队伍" />救援队伍</div>
        <div class="legend-item"><img :src="resourceCar" class="legend-icon" alt="车辆" />抢修车辆</div>
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
