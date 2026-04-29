<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue';

const props = defineProps({
  lon: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  spaceName: {
    type: String,
    default: '',
  },
  areaName: {
    type: String,
    default: '',
  },
});

const mapInstance = ref(null);
const markerLayer = ref(null);
const infoWindow = ref(null);
const mapInitialized = ref(false);

// 初始化地图
const initMap = () => {
  const callbackName = `initSpaceMap_${Date.now()}`;
  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&callback=${callbackName}`;
  script.async = true;

  window[callbackName] = () => {
    mapCallback();
    delete window[callbackName];
  };

  document.head.appendChild(script);
};

// 地图回调
const mapCallback = () => {
  const mapContainer = document.getElementById('spaceLocationMap');
  if (!mapContainer) {
    console.error('地图容器不存在');
    return;
  }

  const center = new TMap.LatLng(props.lat, props.lon);
  const map = new TMap.Map(mapContainer, {
    center: center,
    zoom: 16,
    mapStyleId: 'style1',
  });
  mapInstance.value = map;
  mapInitialized.value = true;

  // 创建标记
  createMarker(map);

  // 初始化信息窗
  infoWindow.value = new TMap.InfoWindow({
    map: map,
    position: center,
    content: getInfoWindowContent(),
    offset: { x: 0, y: -40 },
    visible: true,
  });
};

// 创建标记
const createMarker = (map) => {
  if (markerLayer.value) {
    try {
      markerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁标记层失败：', error);
    }
    markerLayer.value = null;
  }

  const center = new TMap.LatLng(props.lat, props.lon);
  markerLayer.value = new TMap.MultiMarker({
    map: map,
    styles: {
      default: new TMap.MarkerStyle({
        width: 40,
        height: 40,
        anchor: { x: 20, y: 40 },
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIOWkhOmDqOmYtOW9sSAtLT4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjE1IiByPSIxMiIgZmlsbD0iIzQwOUVGRiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8IS0tIOW6lemDqOmYtOW9sSAtLT4KICA8cGF0aCBkPSJNIDIwIDE1IEwgMjAgMzUiIHN0cm9rZT0iIzQwOUVGRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiAgPCEtLSDlnIblvaLlm77moIcgLS0+CiAgPHBhdGggZD0iTSAxMiAxMiBMIDEyIDE4IEwgMjggMTggTCAyOCAxMiBaIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz4KICA8IS0tIOi9puS9jeagh+ivhiAtLT4KICA8dGV4dCB4PSIyMCIgeT0iMTciIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM0MDlFRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5QPC90ZXh0Pgo8L3N2Zz4=',
      }),
    },
    geometries: [
      {
        id: 'space-marker',
        styleId: 'default',
        position: center,
        properties: {
          spaceName: props.spaceName,
          areaName: props.areaName,
        },
      },
    ],
  });
};

// 信息窗内容
const getInfoWindowContent = () => {
  return `
    <div style="padding: 12px; font-size: 14px; color: #333; background: white; border-radius: 4px; min-width: 200px;">
      <div style="margin-bottom: 8px; font-weight: bold; color: #409EFF; border-bottom: 1px solid #eee; padding-bottom: 6px;">
        ${props.spaceName}
      </div>
      <div style="margin: 6px 0;">
        <span style="font-weight: bold;">所属片区：</span>
        <span>${props.areaName}</span>
      </div>
      <div style="margin: 6px 0;">
        <span style="font-weight: bold;">经度：</span>
        <span>${props.lon}</span>
      </div>
      <div style="margin: 6px 0;">
        <span style="font-weight: bold;">纬度：</span>
        <span>${props.lat}</span>
      </div>
    </div>
  `;
};

// 更新地图中心和标记
const updateMap = () => {
  if (mapInitialized.value && mapInstance.value) {
    const center = new TMap.LatLng(props.lat, props.lon);
    mapInstance.value.setCenter(center);
    createMarker(mapInstance.value);
    if (infoWindow.value) {
      infoWindow.value.setPosition(center);
      infoWindow.value.setContent(getInfoWindowContent());
      infoWindow.value.open();
    }
  }
};

// 监听坐标变化
watch(
  () => [props.lon, props.lat, props.spaceName, props.areaName],
  () => {
    updateMap();
  },
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (markerLayer.value) {
    try {
      markerLayer.value.destroy();
    } catch (error) {
      console.warn('卸载时销毁标记层失败：', error);
    }
  }
  if (infoWindow.value) {
    try {
      infoWindow.value.destroy();
    } catch (error) {
      console.warn('卸载时销毁信息窗失败：', error);
    }
  }
  if (mapInstance.value) {
    mapInstance.value.destroy();
  }
  mapInitialized.value = false;
});
</script>

<template>
  <div class="space-map-container">
    <div id="spaceLocationMap" class="space-map"></div>
  </div>
</template>

<style scoped lang="scss">
.space-map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;

  .space-map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
  }
}
</style>
