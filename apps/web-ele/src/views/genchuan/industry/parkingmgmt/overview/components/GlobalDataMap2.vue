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

import maintainOffDuty from '../../images/maintain_off.png'; // 离岗
import maintainOnDuty from '../../images/maintain_on_duty.png'; // 在岗
import maintainTask from '../../images/maintain_task.png'; // 任务中
// ✅ 仅保留接口存在的【运维人员图标】，删除所有停车场/泊位/设备图标，无冗余
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

// ✅ 仅保留接口存在的【运维人员标注层】，删除停车场/泊位/设备层ref，无冗余
const mapInstance = ref(null);
const infoWindow = ref(null);
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
  { deep: true, immediate: true },
);

// ✅ 仅保留接口存在的【运维人员状态映射表】，删除所有停车场/泊位/设备映射表
const maintainStatusMap = {
  在岗: {
    color: '#39b20d',
    icon: maintainOnDuty,
    text: '在岗',
    size: { w: 36, h: 36 },
    styleId: 'onDuty',
  },
  任务中: {
    color: '#1E90FF',
    icon: maintainTask,
    text: '任务中',
    size: { w: 36, h: 36 },
    styleId: 'tasking',
  },
  离岗: {
    color: '#5b5757',
    icon: maintainOffDuty,
    text: '离岗',
    size: { w: 36, h: 36 },
    styleId: 'offDuty',
  },
  '': {
    color: '#999',
    icon: markerUnknown,
    text: '状态未知',
    size: { w: 36, h: 36 },
    styleId: 'unknown',
  },
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

// ✅ 核心重构：仅渲染【运维人员标注层】，匹配接口字段maintainLatitude/maintainLongitude，无其他冗余逻辑
const createAllMarkers = (map) => {
  // 销毁原有运维人员标注层
  if (maintainMarkerLayer.value) {
    try {
      maintainMarkerLayer.value.off('click', handleMarkerClick);
      maintainMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁运维人员标注层失败:', error);
    }
    maintainMarkerLayer.value = null;
  }

  if (
    !Array.isArray(props.geometriesArray) ||
    props.geometriesArray.length === 0
  )
    return;

  const maintainData = [];
  const maintainIdSet = new Set(); // 运维人员ID去重

  // 仅提取运维人员数据，完全匹配文件1接口返回字段
  props.geometriesArray.forEach((item) => {
    const {
      maintainUserId,
      maintainLatitude,
      maintainLongitude,
      onDutyStatus,
    } = item;
    if (
      !item ||
      !maintainUserId ||
      typeof maintainLatitude !== 'number' ||
      typeof maintainLongitude !== 'number'
    )
      return;
    if (!maintainIdSet.has(maintainUserId)) {
      maintainIdSet.add(maintainUserId);
      const styleId =
        maintainStatusMap[onDutyStatus || '']?.styleId || 'unknown';
      maintainData.push({
        id: `maintain-${maintainUserId}`,
        styleId: `maintain-${styleId}`,
        position: new TMap.LatLng(maintainLatitude, maintainLongitude),
        properties: { ...item, markerType: 'maintainStaff' },
      });
    }
  });

  // 仅创建运维人员标注层
  if (maintainData.length > 0) {
    maintainMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'maintain-onDuty': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: { x: 18, y: 30 },
          src: maintainOnDuty,
        }),
        'maintain-tasking': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: { x: 18, y: 30 },
          src: maintainTask,
        }),
        'maintain-offDuty': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: { x: 18, y: 30 },
          src: maintainOffDuty,
        }),
        'maintain-unknown': new TMap.MarkerStyle({
          width: 36,
          height: 36,
          anchor: { x: 18, y: 30 },
          src: markerUnknown,
        }),
      },
      geometries: maintainData,
    });
    maintainMarkerLayer.value.on('click', handleMarkerClick);
  }
};

// ✅ 信息窗：仅保留【运维人员详情】，字段100%匹配文件1接口返回，无任何多余字段
const getTooltipContent = (properties) => {
  const labelStyle =
    'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle =
    'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle =
    'margin-bottom: 6px; font-weight: bold; color: #1E90FF; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  if (properties.markerType === 'maintainStaff') {
    const maintainStatusText =
      maintainStatusMap[properties.onDutyStatus]?.text || '未知状态';
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
  return '';
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
    if (mapInitialized.value && Array.isArray(newVal))
      createAllMarkers(mapInstance.value);
  },
  { deep: true },
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  stopOrbitAnimation();
  // 仅销毁运维人员标注层
  if (maintainMarkerLayer.value) {
    try {
      maintainMarkerLayer.value.off('click', handleMarkerClick);
      maintainMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁标注层失败:', error);
    }
  }
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
    <!-- ✅ 仅保留运维人员图例，无其他冗余图例 -->
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <img :src="maintainOnDuty" class="legend-icon" alt="在岗" />在岗
        </div>
        <div class="legend-item">
          <img :src="maintainTask" class="legend-icon" alt="任务中" />任务中
        </div>
        <div class="legend-item">
          <img :src="maintainOffDuty" class="legend-icon" alt="离岗" />离岗
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
  height: 100%;
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
  gap: 0.1vw;
  align-items: center;
  font-size: 0.7vw;
  color: #fff;
}

.legend-icon {
  width: 1vw;
  height: 1.5vh;
  object-fit: contain;
}
</style>
