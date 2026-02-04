<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-circle legend-circle-yellow"></div>
          <span>应急事件现场</span>
        </div>
        <div class="legend-item">
          <div class="legend-circle legend-circle-red"></div>
          <span>关键区域</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineExpose,
  defineProps,
  onMounted,
  onUnmounted,
  ref
} from 'vue';

import {
  fetchDotAnimationData
} from '#/api/genchuan/industry/parkingmgmt/overview/EmergencyResponse.ts';

const props = defineProps({
  idName: {
    type: String,
    default: 'dotAnimationMap',
  },
  mapConfig: {
    type: Object,
    default: () => ({
      center: {lat: 22.638653, lng: 114.083183},
      zoom: 11.5,
    }),
  },
});

const mapInstance = ref(null);
const staticDotLayer = ref(null);
const animationDotLayer = ref(null);
const isUnmounted = ref(false);
const dotData = ref([]);

const loadDotData = async () => {
  console.log('开始加载散点标注数据...');
  try {
    const data = await fetchDotAnimationData({});
    console.log('散点数据加载成功，数据量:', data.length);
    dotData.value = data.map(item => ({
      lat: item.lat,
      lng: item.lng,
      styleId: item.styleId,
    }));
    return data;
  } catch (error) {
    console.error('加载散点数据失败:', error);
    dotData.value = [];
    return [];
  }
};

const createStaticDotLayer = (map) => {
  if (!map || isUnmounted.value || typeof TMap === 'undefined') {
    console.warn('无效的地图实例，无法创建静态散点图层');
    return;
  }

  if (staticDotLayer.value) {
    try {
      staticDotLayer.value.remove();
    } catch (e) {
      console.warn('销毁静态散点图层失败:', e);
    }
  }

  const staticDot = new TMap.visualization.Dot({
    faceTo: "map",
    styles: {
      style1: {
        fillColor: "#FFCA1F",
        radius: 1,
      },
      style2: {
        fillColor: "#C72A18",
        radius: 2,
      },
    },
    enableBloom: true,
  }).addTo(map);

  staticDot.setData(dotData.value);
  staticDotLayer.value = staticDot;
  console.log('静态散点图层创建完成');
};

const createAnimationDotLayer = (map) => {
  if (!map || isUnmounted.value || typeof TMap === 'undefined') {
    console.warn('无效的地图实例，无法创建动画散点图层');
    return;
  }

  if (animationDotLayer.value) {
    try {
      animationDotLayer.value.remove();
    } catch (e) {
      console.warn('销毁动画散点图层失败:', e);
    }
  }

  const animationDot = new TMap.visualization.Dot({
    faceTo: "map",
    styles: {
      style1: {
        type: "circle",
        fillColor: "rgba(255,202,31,0.3)",
        radius: 3,
      },
      style2: {
        type: "circle",
        fillColor: "rgba(204,42,24,0.3)",
        radius: 10,
      },
    },
    processAnimation: {
      animationType: "radiated",
    },
    enableBloom: true,
  }).addTo(map);

  animationDot.setData(dotData.value);
  animationDotLayer.value = animationDot;
  console.log('辐射动画散点图层创建完成');
};

const initMap = () => {
  const callbackName = `initMap_${props.idName}`;
  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=5L5BZ-XCN6L-GVKPS-MYOXE-5SYY6-QIFWV&libraries=visualization&callback=${callbackName}`;
  script.async = true;

  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };

  document.head.append(script);
};

const mapCallback = async () => {
  const mapContainer = document.querySelector(`#${props.idName}`);
  if (!mapContainer) {
    console.error(`地图容器不存在：${props.idName}`);
    return;
  }

  try {
    if (typeof TMap === 'undefined' || !TMap.Map) {
      console.error('TMap API 未加载完成');
      return;
    }

    const map = new TMap.Map(mapContainer, {
      center: new TMap.LatLng(props.mapConfig.center.lat, props.mapConfig.center.lng),
      zoom: props.mapConfig.zoom,
      mapStyleId: 'style1',
      baseMap: {
        type: "vector",
        features: ["base", "building3d"],
      },
      renderOptions: {
        enableBloom: true,
      },
      showControl: false,
    });

    mapInstance.value = map;
    console.log('地图实例创建完成，黑色背景已生效');

    await loadDotData();
    createStaticDotLayer(map);
    createAnimationDotLayer(map);

  } catch (error) {
    console.error('地图实例创建或散点图层初始化失败:', error);
  }
};

const reloadDotLayer = async () => {
  console.log('重新加载散点标注...');
  if (mapInstance.value) {
    await loadDotData();
    createStaticDotLayer(mapInstance.value);
    createAnimationDotLayer(mapInstance.value);
  }
};

const destroyDotLayers = () => {
  if (isUnmounted.value) return;

  if (staticDotLayer.value) {
    try {
      staticDotLayer.value.remove();
      staticDotLayer.value = null;
    } catch (e) {
      console.warn('销毁静态散点图层失败（非致命）:', e);
    }
  }

  if (animationDotLayer.value) {
    try {
      animationDotLayer.value.remove();
      animationDotLayer.value = null;
    } catch (e) {
      console.warn('销毁动画散点图层失败（非致命）:', e);
    }
  }
};

onMounted(() => {
  console.log('散点动画标注组件挂载完成');
  initMap();
});

onUnmounted(() => {
  console.log('散点动画标注组件卸载，清理资源');
  isUnmounted.value = true;

  destroyDotLayers();

  if (mapInstance.value) {
    try {
      mapInstance.value.destroy();
    } catch (error) {
      console.warn('销毁地图实例失败（非致命错误）:', error);
    }
    mapInstance.value = null;
  }

  dotData.value = [];
});

defineExpose({
  mapInstance,
  reloadDotLayer,
  loadDotData
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-common-css {
  width: 100%;
  height: 98%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
  background-color: #000000;
}

.legend {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: end;
}

.legend-items {
  display: flex;
  gap: 20px;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 16px;
  border-radius: 4px;
}

.legend-item {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: #ffffff;
}

/* CSS绘制圆形图例 */
.legend-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-circle-yellow {
  background-color: #FFCA1F;
  /* 对应应急事件现场黄色 */
}

.legend-circle-red {
  background-color: #C72A18;
  /* 对应关键区域红色 */
}
</style>
