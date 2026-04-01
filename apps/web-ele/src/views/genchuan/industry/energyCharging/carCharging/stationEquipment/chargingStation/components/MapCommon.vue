<script setup>
import { onMounted, defineProps, ref, onUnmounted, watch, defineExpose } from 'vue';

import markerEnabled from '#/views/genchuan/industry/energyCharging/images/marker-enabled.png';   // 已启用图标
import markerDisabled from '#/views/genchuan/industry/energyCharging/images/marker-disabled.png'; // 已停用图标
import markerWait from '#/views/genchuan/industry/energyCharging/images/marker-wait.png';         // 未启用图标

// Props 定义（只保留两个必需的）
const props = defineProps({
  idName: {
    type: String,
    default: 'chargingStationMap',
  },
  geometriesArray: {
    type: Array,
    default: () => [],
  },
});

// 响应式变量
let mapInstance = null;
let infoWindow = null;
let markerLayer = null;
let mapInitialized = false;

// 标记点击事件
const emit = defineEmits(['markerClick']);
const handleMarkerClick = (e) => {
  const { properties } = e.geometry;
  if (properties && infoWindow) {
    infoWindow.setContent(getTooltipContent(properties));
    infoWindow.setPosition(e.geometry.position);
    infoWindow.open();
    emit('markerClick', properties);
  }
};

const handleInfoWindowClose = () => {
  if (infoWindow) infoWindow.close();
};

// 初始化地图
const initMap = () => {
  const callbackName = `initMap_${props.idName}`;
  if (window[callbackName]) delete window[callbackName];

  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&callback=${callbackName}`;
  script.async = true;

  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };

  document.head.appendChild(script);
};

// 创建地图标记
const createMarkers = (map) => {
  if (markerLayer) {
    try {
      markerLayer.off('click', handleMarkerClick);
      markerLayer.destroy();
    } catch (error) {
      console.warn('销毁标记层失败：', error);
    }
    markerLayer = null;
  }

  const geometriesData = [];
  if (Array.isArray(props.geometriesArray)) {
    props.geometriesArray.forEach((item) => {
      const { lon, lat, status, id, stationName, address } = item;
      if (typeof lon === 'number' && typeof lat === 'number') {
        let styleId = 'default';
        if (status === 'enabled') styleId = 'enabled';
        else if (status === 'disabled') styleId = 'disabled';
        else if (status === 'wait') styleId = 'wait';

        geometriesData.push({
          id: `marker-${id}`,
          styleId: styleId,
          position: new TMap.LatLng(lat, lon),
          properties: { id, stationName, address, status, statusName: item.statusName },
        });
      } else {
        console.warn('坐标无效', item);
      }
    });
  }

  if (geometriesData.length > 0) {
    markerLayer = new TMap.MultiMarker({
      map: map,
      styles: getMarkerStyles(),
      geometries: geometriesData,
    });
    markerLayer.on('click', handleMarkerClick);
    console.log('地图标记生成成功，数量：', geometriesData.length);
  } else {
    console.warn('无有效标记数据');
  }
};

// 信息窗内容（充电场站专用）
const getTooltipContent = (properties) => {
  const { stationName, address, statusName, id } = properties;
  const statusColor =
    statusName === '已启用'
      ? 'green'
      : statusName === '已停用'
        ? 'red'
        : 'orange';

  return `
    <div style="padding: 12px; font-size: 14px; color: #333; background: white; border: 1px solid #ddd; border-radius: 6px; min-width: 240px;">
      <div style="margin-bottom: 8px; font-weight: bold; color: #409EFF; border-bottom: 1px solid #eee; padding-bottom: 4px;">充电场站信息</div>
      <div style="margin: 6px 0; display: flex;">
        <span style="font-weight: bold; width: 80px; text-align: right; margin-right: 8px;">场站名称：</span>
        <span style="flex: 1;">${stationName || '未知'}</span>
      </div>
      <div style="margin: 6px 0; display: flex;">
        <span style="font-weight: bold; width: 80px; text-align: right; margin-right: 8px;">场站ID：</span>
        <span style="flex: 1;">${id || '未知'}</span>
      </div>
      <div style="margin: 6px 0; display: flex;">
        <span style="font-weight: bold; width: 80px; text-align: right; margin-right: 8px;">场站地址：</span>
        <span style="flex: 1;">${address || '暂无地址'}</span>
      </div>
      <div style="margin: 6px 0; display: flex;">
        <span style="font-weight: bold; width: 80px; text-align: right; margin-right: 8px;">运行状态：</span>
        <span style="flex: 1; color: ${statusColor};">${statusName || '未知'}</span>
      </div>
    </div>
  `;
};

// 标记样式定义（充电场站专用）
const getMarkerStyles = () => {
  return {
    enabled: new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: { x: 15, y: 30 },
      src: markerEnabled,
    }),
    disabled: new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: { x: 15, y: 30 },
      src: markerDisabled,
    }),
    wait: new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: { x: 15, y: 30 },
      src: markerWait,
    }),
    default: new TMap.MarkerStyle({
      width: 34,
      height: 34,
      anchor: { x: 15, y: 30 },
      src: markerWait,
    }),
  };
};

// 地图初始化回调
const mapCallback = () => {
  const mapContainer = document.getElementById(props.idName);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }

  // 使用泉州中心坐标（与参考代码一致）
  const map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(26.0753, 119.3062),
    zoom: 12,
    pitch: 40,
    mapStyleId: 'style1',
  });
  mapInstance = map;
  mapInitialized = true;

  infoWindow = new TMap.InfoWindow({
    map: map,
    position: new TMap.LatLng(0, 0),
    content: '',
    offset: { x: 0, y: -40 },
    visible: false,
  });
  infoWindow.on('close', handleInfoWindowClose);

  if (props.geometriesArray.length > 0) {
    createMarkers(map);
  }
};

// 刷新地图
const refreshMap = () => {
  if (mapInitialized && mapInstance) {
    createMarkers(mapInstance);
  } else {
    initMap();
  }
};

// 监听数据变化更新标记
watch(
  () => props.geometriesArray,
  (newVal) => {
    console.log('地图数据更新，长度：', newVal?.length);
    if (mapInitialized && mapInstance && Array.isArray(newVal)) {
      createMarkers(mapInstance);
    }
  },
  { deep: true }
);

// 生命周期
onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (markerLayer) {
    try {
      markerLayer.off('click', handleMarkerClick);
      markerLayer.destroy();
    } catch (error) {
      console.warn('卸载时销毁标记层失败：', error);
    }
  }
  if (infoWindow) {
    try {
      infoWindow.off('close', handleInfoWindowClose);
      infoWindow.destroy();
    } catch (error) {
      console.warn('卸载时销毁信息窗失败：', error);
    }
  }
  if (mapInstance) {
    mapInstance.destroy();
  }
  mapInitialized = false;
});

// 暴露方法给父组件
defineExpose({ refreshMap });
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>
    <!-- 图例（充电场站专用） -->
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <img :src="markerEnabled" class="legend-icon" alt="已启用" />
          <span>已启用</span>
        </div>
        <div class="legend-item">
          <img :src="markerDisabled" class="legend-icon" alt="已停用" />
          <span>已停用</span>
        </div>
        <div class="legend-item">
          <img :src="markerWait" class="legend-icon" alt="未启用" />
          <span>未启用</span>
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
  border-radius: 8px;
  overflow: hidden;
}

.legend {
  position: absolute;
  bottom: 10px;
  right: 10px;      /* 改为右对齐 */
  left: auto;       /* 清除左定位 */
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 12px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.legend-items {
  display: flex;
  gap: 16px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #fff;
  gap: 4px;
}

.legend-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>
