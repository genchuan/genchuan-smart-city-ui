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

// ✅ 精简图标导入：只保留核心必要图标，数量最少化
import markerFault from '../../images/berth_fault.png';
import markerIdle from '../../images/berth_idle.png';
import markerOccupy from '../../images/berth_occupy.png';
import parkNormal from '../../images/park_normal.png';
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

// ✅ 核心精简：状态映射表极简配置，匹配接口字段（接口返回泊位状态为status），删除冗余状态
const lotStatusMap = {
  正常: {
    color: '#39b20d',
    icon: parkNormal,
    text: '正常',
    size: { w: 50, h: 50 },
    styleId: 'normal',
  },
};
// 接口字段匹配：原roadsideStatus → 改为接口的status字段，只保留3个核心状态
const berthStatusMap = {
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
};

// ✅ 点击标注展示信息窗口
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

// ✅ 核心修改：1.适配接口统一经纬度字段(longitude/latitude) 2.删除冗余设备层 3.匹配接口所有返回字段 4.精简标注逻辑
const createAllMarkers = (map) => {
  // 销毁原有标注层
  if (parkMarkerLayer.value) {
    try { parkMarkerLayer.value.off('click', handleMarkerClick); parkMarkerLayer.value.destroy(); } catch (e) { console.warn('销毁停车场标注层失败:', e); }
    parkMarkerLayer.value = null;
  }
  if (berthMarkerLayer.value) {
    try { berthMarkerLayer.value.off('click', handleMarkerClick); berthMarkerLayer.value.destroy(); } catch (e) { console.warn('销毁泊位标注层失败:', e); }
    berthMarkerLayer.value = null;
  }

  if (!Array.isArray(props.geometriesArray) || props.geometriesArray.length === 0) return;

  const parkData = [];
  const berthData = [];
  const parkIdSet = new Set();

  // 提取唯一停车场数据 + 泊位数据
  props.geometriesArray.forEach((item) => {
    const { lotId, lotName, longitude, latitude, parkType, totalSpace, availableSpace, roadsideId, status, berthNumber } = item;
    if (!item || !lotId || typeof longitude !== 'number' || typeof latitude !== 'number') return;

    // 停车场标注：按lotId去重，使用接口统一经纬度
    if (!parkIdSet.has(lotId)) {
      parkIdSet.add(lotId);
      parkData.push({
        id: `park-${lotId}`,
        styleId: `park-normal`,
        position: new TMap.LatLng(latitude, longitude),
        properties: { ...item, markerType: 'parkLot' },
      });
    }

    // 泊位标注：存在roadsideId即为泊位，匹配接口status字段
    if (roadsideId && status) {
      const styleId = berthStatusMap[status]?.styleId || 'default';
      berthData.push({
        id: `berth-${roadsideId}`,
        styleId: `berth-${styleId}`,
        position: new TMap.LatLng(latitude, longitude),
        properties: { ...item, markerType: 'berth' },
      });
    }
  });

  // 创建停车场标注层
  if (parkData.length > 0) {
    parkMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'park-normal': new TMap.MarkerStyle({ width: 50, height: 50, anchor: { x: 20, y: 35 }, src: parkNormal }),
        'park-default': new TMap.MarkerStyle({ width: 50, height: 50, anchor: { x: 20, y: 35 }, src: markerUnknown }),
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
        'berth-idle': new TMap.MarkerStyle({ width: 30, height: 30, anchor: { x: 15, y: 25 }, src: markerIdle }),
        'berth-occupy': new TMap.MarkerStyle({ width: 30, height: 30, anchor: { x: 15, y: 25 }, src: markerOccupy }),
        'berth-fault': new TMap.MarkerStyle({ width: 30, height: 30, anchor: { x: 15, y: 25 }, src: markerFault }),
        'berth-default': new TMap.MarkerStyle({ width: 30, height: 30, anchor: { x: 15, y: 25 }, src: markerUnknown }),
      },
      geometries: berthData,
    });
    berthMarkerLayer.value.on('click', handleMarkerClick);
  }
};

// ✅ 核心修改：信息窗口内容完全匹配接口返回字段，字段100%对应需求，样式精简
const getTooltipContent = (properties) => {
  const labelStyle = 'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle = 'margin-bottom: 6px; font-weight: bold; color: #1E90FF; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  // 时间格式化
  const formatTime = (timeStamp) => {
    if (!timeStamp) return '未知';
    const date = new Date(timeStamp);
    return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // 停车场详情：匹配接口字段（lotId/name/parkType/totalSpace/availableSpace/garageId/floorCount等）
  if (properties.markerType === 'parkLot') {
    const occupyRate = properties.totalSpace ? `${(((properties.totalSpace - properties.availableSpace) / properties.totalSpace) * 100).toFixed(1)}%` : '0%';
    return `
      <div style="padding: 10px 12px; color: #333; background: white; border: 1px solid #ccc; min-width: 360px; border-radius: 4px;">
        <div style="${titleStyle}">停车场详情</div>
        <div style="${rowStyle}"><span style="${labelStyle}">车场ID：</span><span style="${valueStyle}">${properties.lotId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">车场名称：</span><span style="${valueStyle}">${properties.lotName || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">车场类型：</span><span style="${valueStyle}">${properties.parkType==='public'?'公共车场':properties.parkType==='business'?'商业车场':'园区车场'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">总车位数：</span><span style="${valueStyle}">${properties.totalSpace || 0}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">可用车位数：</span><span style="${valueStyle}">${properties.availableSpace || 0}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">车位占用率：</span><span style="${valueStyle}">${occupyRate}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">车库ID：</span><span style="${valueStyle}">${properties.garageId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">车库楼层数：</span><span style="${valueStyle}">${properties.floorCount || 0} 层</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">台账编号：</span><span style="${valueStyle}">${properties.accountId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">台账更新时间：</span><span style="${valueStyle}">${formatTime(properties.updateTime)}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">经纬度：</span><span style="${valueStyle}">${properties.latitude}, ${properties.longitude}</span></div>
      </div>
    `;
  }

  // 泊位详情：匹配接口字段（roadsideId/berthNumber/status/spaceId/spaceType等）
  if (properties.markerType === 'berth') {
    const statusText = berthStatusMap[properties.status]?.text || '未知状态';
    const statusColor = berthStatusMap[properties.status]?.color || '#999';
    return `
      <div style="padding: 10px 12px; color: #333; background: white; border: 1px solid #ccc; min-width: 340px; border-radius: 4px;">
        <div style="${titleStyle}">泊位详情</div>
        <div style="${rowStyle}"><span style="${labelStyle}">所属车场：</span><span style="${valueStyle}">${properties.lotName || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">路侧泊位ID：</span><span style="${valueStyle}">${properties.roadsideId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">泊位编号：</span><span style="${valueStyle}">${properties.berthNumber || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">泊位状态：</span><span style="${valueStyle}; color:${statusColor}">${statusText}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">车位ID：</span><span style="${valueStyle}">${properties.spaceId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">车位类型：</span><span style="${valueStyle}">${properties.spaceType || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">出入口ID：</span><span style="${valueStyle}">${properties.entryExitId || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">出入口方向：</span><span style="${valueStyle}">${properties.direction || '未知'}</span></div>
        <div style="${rowStyle}"><span style="${labelStyle}">经纬度：</span><span style="${valueStyle}">${properties.latitude}, ${properties.longitude}</span></div>
      </div>
    `;
  }
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

  infoWindow.value = new TMap.InfoWindow({ map, position: new TMap.LatLng(0, 0), content: '', offset: { x: 0, y: -40 }, visible: false });
  infoWindow.value.on('close', handleInfoWindowClose);

  createAllMarkers(map);
  startOrbitAnimation();
};

// 监听数据变化重新渲染标注
watch(
  () => props.geometriesArray,
  (newVal) => { if (mapInitialized.value && Array.isArray(newVal)) createAllMarkers(mapInstance.value); },
  { deep: true },
);

onMounted(() => { initMap(); });

onUnmounted(() => {
  stopOrbitAnimation();
  // 销毁标注层+地图+信息窗
  [parkMarkerLayer.value, berthMarkerLayer.value].forEach((layer) => {
    if (layer) { try { layer.off('click', handleMarkerClick); layer.destroy(); } catch (e) { console.warn('销毁标注层失败:', e); } }
  });
  if (infoWindow.value) { try { infoWindow.value.off('close', handleInfoWindowClose); infoWindow.value.destroy(); } catch (e) { console.warn('销毁信息窗口失败:', e); } }
  if (mapInstance.value) { try { mapInstance.value.destroy(); } catch (e) { console.warn('销毁地图实例失败:', e); } }
  orbitStatus.value = { playing: false, currentRotation: 0, animationFrameId: null, isInited: false };
  mapInitialized.value = false;
});

defineExpose({ toggleOrbitAnimation, orbitStatus, startOrbitAnimation, stopOrbitAnimation });
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>
    <div class="legend">
      <div class="legend-items">
        <div class="legend-divider"><p>停车场:</p></div>
        <div class="legend-item"><img :src="parkNormal" class="legend-icon" alt="正常" /></div>
        <div class="legend-divider"><p>泊位:</p></div>
        <div class="legend-item"><img :src="markerFault" class="legend-icon" alt="故障" /></div>
        <div class="legend-item"><img :src="markerIdle" class="legend-icon" alt="空闲" /></div>
        <div class="legend-item"><img :src="markerOccupy" class="legend-icon" alt="占用" /></div>
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
