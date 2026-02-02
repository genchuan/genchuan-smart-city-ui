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

// ✅ 调度路径专属图标 (替换你的项目实际图标路径即可)
import dispatchStart from '../../images/dispatch_start.png'; // 调度起点（调出位置）
import dispatchEnd from '../../images/dispatch_end.png'; // 调度终点（调入位置）
import dispatchResourceDefault from '../../images/dispatch_resource_default.png'; // 默认资源图标
import markerUnknown from '../../images/unknown.png';

const props = defineProps({
  idName: {
    type: String,
    default: 'chinaEcharts',
  },
  geometriesArray: {
    type: Array,
    default: () => [], // 接收调度数据数组，每条数据包含起点/终点经纬度及调度相关字段
  },
  orbitConfig: {
    type: Object,
    default: () => ({
      center: { lat: 24.58, lng: 117.65 },
      rotateSpeed: 0.1,
      pitch: 40,
      zoom: 16,
      loop: true,
    }),
  },
});

const mapInstance = ref(null);
const infoWindow = ref(null);
const dispatchMarkerLayer = ref(null); // 调度起点/终点标注图层
const dispatchPolylineLayer = ref(null); // 调度路径线图层
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

// ✅ 调度相关配置映射表
// 1. 调度状态配色（区分不同调度进度）
const dispatchStatusColor = {
  '待调度': '#999999',
  '调度中': '#3182ce',
  '已到达': '#22c55e',
  '已取消': '#e53e3e',
  '': '#999999'
};

// 2. 调度标注类型（起点/终点）映射
const dispatchMarkerTypeMap = {
  start: { icon: dispatchStart, text: '调出位置', size: { w: 40, h: 40 }, anchor: { x: 20, y: 34 } },
  end: { icon: dispatchEnd, text: '调入位置', size: { w: 40, h: 40 }, anchor: { x: 20, y: 34 } },
  unknown: { icon: markerUnknown, text: '未知位置', size: { w: 40, h: 40 }, anchor: { x: 20, y: 34 } }
};

// 3. 资源类型图标映射（可根据实际资源类型扩展）
const resourceTypeMap = {
  '救援设备': dispatchResourceDefault,
  '救援人员': dispatchResourceDefault,
  '应急物资': dispatchResourceDefault,
  '': dispatchResourceDefault
};

// 点击调度标注展示信息窗口
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

// ✅ 核心渲染：调度路径（起点/终点标注 + 调度路径线），匹配指定调度字段
const createDispatchPathAndMarkers = (map) => {
  // 销毁原有调度相关图层
  if (dispatchMarkerLayer.value) {
    try {
      dispatchMarkerLayer.value.off('click', handleMarkerClick);
      dispatchMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁调度标注层失败:', error);
    }
    dispatchMarkerLayer.value = null;
  }
  if (dispatchPolylineLayer.value) {
    try {
      dispatchPolylineLayer.value.destroy();
    } catch (error) {
      console.warn('销毁调度路径层失败:', error);
    }
    dispatchPolylineLayer.value = null;
  }

  if (!Array.isArray(props.geometriesArray) || props.geometriesArray.length === 0) return;

  const dispatchMarkerData = []; // 调度起点/终点标注数据
  const dispatchPolylineData = []; // 调度路径线数据
  const dispatchIdSet = new Set(); // 调度记录ID去重

  // 提取调度数据 - 匹配指定调度字段
  props.geometriesArray.forEach((item) => {
    const {
      taskResourceDispatchDispatchRecordId, // 调度记录ID
      startLongitude, startLatitude, // 调出位置经纬度（需确保接口返回该字段，或替换为实际字段名）
      endLongitude, endLatitude, // 调入位置经纬度（需确保接口返回该字段，或替换为实际字段名）
      sysDispatchStatusName // 调度状态
    } = item;

    // 校验必要字段（调度记录ID + 起点/终点经纬度）
    if (
      !item ||
      !taskResourceDispatchDispatchRecordId ||
      (typeof startLongitude !== 'number' || typeof startLatitude !== 'number') ||
      (typeof endLongitude !== 'number' || typeof endLatitude !== 'number')
    ) return;

    // 去重：避免相同调度记录重复渲染
    if (!dispatchIdSet.has(taskResourceDispatchDispatchRecordId)) {
      dispatchIdSet.add(taskResourceDispatchDispatchRecordId);
      const dispatchStatus = sysDispatchStatusName || '';
      const pathColor = dispatchStatusColor[dispatchStatus];
      const resourceIcon = resourceTypeMap[item.sysResourceTypeName || ''];

      // 1. 添加起点标注
      dispatchMarkerData.push({
        id: `dispatch-start-${taskResourceDispatchDispatchRecordId}`,
        styleId: 'dispatch-start',
        position: new TMap.LatLng(startLatitude, startLongitude),
        properties: { ...item, markerType: 'dispatchStart', dispatchPositionType: 'start' }
      });

      // 2. 添加终点标注
      dispatchMarkerData.push({
        id: `dispatch-end-${taskResourceDispatchDispatchRecordId}`,
        styleId: 'dispatch-end',
        position: new TMap.LatLng(endLatitude, endLongitude),
        properties: { ...item, markerType: 'dispatchEnd', dispatchPositionType: 'end' }
      });

      // 3. 添加调度路径线（起点 → 终点）
      dispatchPolylineData.push({
        id: `dispatch-line-${taskResourceDispatchDispatchRecordId}`,
        styleId: 'dispatch-polyline',
        paths: [
          new TMap.LatLng(startLatitude, startLongitude),
          new TMap.LatLng(endLatitude, endLongitude)
        ],
        properties: {
          taskResourceDispatchDispatchRecordId,
          sysDispatchStatusName
        }
      });
    }
  });

  // 创建调度标注图层（起点/终点）
  if (dispatchMarkerData.length > 0) {
    dispatchMarkerLayer.value = new TMap.MultiMarker({
      map,
      styles: {
        'dispatch-start': new TMap.MarkerStyle({
          width: 40,
          height: 40,
          anchor: dispatchMarkerTypeMap.start.anchor,
          src: dispatchMarkerTypeMap.start.icon
        }),
        'dispatch-end': new TMap.MarkerStyle({
          width: 40,
          height: 40,
          anchor: dispatchMarkerTypeMap.end.anchor,
          src: dispatchMarkerTypeMap.end.icon
        }),
        'dispatch-unknown': new TMap.MarkerStyle({
          width: 40,
          height: 40,
          anchor: dispatchMarkerTypeMap.unknown.anchor,
          src: dispatchMarkerTypeMap.unknown.icon
        })
      },
      geometries: dispatchMarkerData
    });
    dispatchMarkerLayer.value.on('click', handleMarkerClick);
  }

  // 创建调度路径线图层
  if (dispatchPolylineData.length > 0) {
    dispatchPolylineLayer.value = new TMap.MultiPolyline({
      map,
      styles: {
        'dispatch-polyline': new TMap.PolylineStyle({
          color: '#3182ce', // 默认路径颜色，如需按每条记录状态配色，可改为动态配置
          width: 4,
          lineCap: 'round',
          lineJoin: 'round',
          opacity: 0.8
        })
      },
      geometries: dispatchPolylineData
    });
  }
};

// ✅ 信息窗：调度记录详情，匹配所有指定调度字段
const getTooltipContent = (properties) => {
  const labelStyle = 'width: 120px; text-align: right; font-weight: bold; margin-right: 8px; flex-shrink: 0;';
  const valueStyle = 'flex: 1; text-align: left; word-break: break-all;';
  const rowStyle = 'display: flex; align-items: center; margin: 4px 0; font-size: 13px;';
  const titleStyle = 'margin-bottom: 6px; font-weight: bold; color: #2b6cb0; border-bottom: 1px solid #eee; padding-bottom: 4px; text-align: center; font-size: 14px;';

  // 匹配调度标注类型
  if (['dispatchStart', 'dispatchEnd'].includes(properties.markerType)) {
    const dispatchStatus = properties.sysDispatchStatusName || '';
    const statusColor = dispatchStatusColor[dispatchStatus];
    const positionText = properties.dispatchPositionType === 'start' ? '调出位置' : '调入位置';

    return `<div style="padding:10px 12px;color:#333;background:white;border:1px solid #ccc;min-width:420px;border-radius:4px;">
      <div style="${titleStyle}">调度记录详情（${positionText}）</div>
      <div style="${rowStyle}"><span style="${labelStyle}">调度记录ID：</span><span style="${valueStyle}">${properties.taskResourceDispatchDispatchRecordId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">资源ID：</span><span style="${valueStyle}">${properties.taskEmergencyResourceResourceId || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">资源类型：</span><span style="${valueStyle}">${properties.sysResourceTypeName || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">调配数量：</span><span style="${valueStyle}">${properties.taskResourceDispatchDispatchQuantity || 0}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">调出位置：</span><span style="${valueStyle}">${properties.tbAssetExtendAddress || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">调入位置：</span><span style="${valueStyle}">${properties.tbAssetExtendAddress || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">调度状态：</span><span style="${valueStyle};color:${statusColor};font-weight:bold;">${dispatchStatus || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">预计到达时间：</span><span style="${valueStyle}">${properties.taskResourceDispatchEstimatedArrivalTime || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">实际到达时间：</span><span style="${valueStyle}">${properties.taskResourceDispatchActualArrivalTime || '未知'}</span></div>
      <div style="${rowStyle}"><span style="${labelStyle}">接收人：</span><span style="${valueStyle}">${properties.sysUserUserName || '未知'}</span></div>
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

  infoWindow.value = new TMap.InfoWindow({
    map,
    position: new TMap.LatLng(0,0),
    content: '',
    offset:{x:0,y:-40},
    visible: false
  });
  infoWindow.value.on('close', handleInfoWindowClose);

  // 渲染调度路径和标注
  createDispatchPathAndMarkers(map);
  startOrbitAnimation();
};

// 监听调度数据变化，重新渲染路径和标注
watch(() => props.geometriesArray, (newVal) => {
  if (mapInitialized.value && Array.isArray(newVal)) createDispatchPathAndMarkers(mapInstance.value);
}, { deep: true });

onMounted(() => { initMap(); });

onUnmounted(() => {
  stopOrbitAnimation();
  // 销毁调度相关图层
  if (dispatchMarkerLayer.value) {
    dispatchMarkerLayer.value.off('click', handleMarkerClick);
    dispatchMarkerLayer.value.destroy();
  }
  if (dispatchPolylineLayer.value) dispatchPolylineLayer.value.destroy();
  // 销毁信息窗和地图实例
  if (infoWindow.value) {
    infoWindow.value.off('close', handleInfoWindowClose);
    infoWindow.value.destroy();
  }
  if (mapInstance.value) mapInstance.value.destroy();

  // 重置轨道动画状态
  orbitStatus.value = { playing: false, currentRotation:0, animationFrameId:null, isInited:false };
  mapInitialized.value = false;
});

defineExpose({ toggleOrbitAnimation, orbitStatus, startOrbitAnimation, stopOrbitAnimation });
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>
    <!-- 调度路径专属图例 -->
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item"><img :src="dispatchStart" class="legend-icon" alt="调出位置" />调出位置</div>
        <div class="legend-item"><img :src="dispatchEnd" class="legend-icon" alt="调入位置" />调入位置</div>
        <div class="legend-item">
          <div class="legend-line" style="background: #3182ce;"></div>
          调度路径
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container { position: relative; width: 100%; height: 100%; }
.map-common-css { width: 100%; height: 100%; margin: 0 auto; overflow: hidden; border-radius: 8px; }
.legend { position: absolute; bottom: 0.1vh; left: 0; box-sizing: border-box; display: flex; flex-flow: column wrap; align-items: flex-end; width: 100%; height: auto; padding: 0.5vw; background: rgb(0 0 0 / 50%); }
.legend-items { display: flex; flex-direction: row; gap: 1vw; align-items: center; justify-content: center; }
.legend-item { display: flex; gap: 0.1vw; align-items: center; font-size: 0.7vw; color: #fff; }
.legend-icon { width: 1vw; height: 1.5vh; object-fit: contain; }
/* 调度路径线图例样式 */
.legend-line { width: 1vw; height: 2px; border-radius: 1px; }
</style>
