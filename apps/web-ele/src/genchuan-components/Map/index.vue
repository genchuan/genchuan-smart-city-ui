<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { loadTMap } from '#/utils/genchuan/useTMap.ts';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  markerIcons: {
    type: Object,
    default: () => ({
      normal: '/static/imgs/dataHub/map/marker-blue.png',
    }),
  },
  statusIconMap: {
    type: Object,
    default: () => ({
      green: 'normal',
      orange: 'normal',
      red: 'normal',
      blue: 'normal',
      gray: 'normal',
    }),
  },
  statusKeyMap: {
    type: Object,
    default: () => ({
      正常: 'green',
      异常: 'red',
      离线: 'red',
      维护中: 'orange',
      停用: 'red',
      建设中: 'gray',
    }),
  },
  infoWindowConfig: {
    type: Object,
    default: () => ({
      title: 'locationName',
      fields: [
        { key: 'geoCode', label: '地理编码' },
        { key: 'statusName', label: '状态', bold: true },
        { key: 'areaName', label: '区域' },
        { key: 'layerTypeName', label: '图层类型' },
        { key: 'adminCode', label: '行政区划' },
        { key: 'checkResultName', label: '校验结果' },
      ],
    }),
  },
  /** 非 0 时优先缩放到 data[0]（用于表格「定位」与看板首条目标点一致） */
  locateFocusKey: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['markerClick']);

const mapRef = ref(null);
let map = null;
let markerLayers = {};
let polygonLayer = null;
let polylineLayer = null;
let infoWindow = null;
let TMapInstance = null;

const initMap = async () => {
  if (!mapRef.value) return;

  try {
    const TMap = await loadTMap();
    TMapInstance = TMap;

    map = new TMap.Map(mapRef.value, {
      center: new TMap.LatLng(24.5123, 117.6589),
      zoom: 12,
    });

    infoWindow = new TMap.InfoWindow({
      map,
      position: new TMap.LatLng(0, 0),
      offset: { x: 0, y: -32 },
    });
    infoWindow.close();

    initMarkerLayer();
    initAreaLayer();
    renderMarkers();
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

const initMarkerLayer = () => {
  const createLayer = (id, src) => {
    const layer = new TMapInstance.MultiMarker({
      id,
      map,
      enableCollision: false,
      styles: {
        normal: new TMapInstance.MarkerStyle({
          width: 25,
          height: 35,
          anchor: { x: 12.5, y: 35 },
          src,
        }),
      },
      geometries: [],
    });
    layer.on('click', onMarkerClick);
    return layer;
  };

  const layers = {};
  Object.keys(props.statusIconMap).forEach((key) => {
    const iconKey = props.statusIconMap[key];
    const src = props.markerIcons[iconKey] || props.markerIcons.normal;
    layers[key] = createLayer(`${key}-layer`, src);
  });

  markerLayers = layers;
};

const initAreaLayer = () => {
  if (!TMapInstance || !map) return;

  if (TMapInstance.MultiPolygon && TMapInstance.PolygonStyle) {
    polygonLayer = new TMapInstance.MultiPolygon({
      id: 'area-layer',
      map,
      styles: {
        area: new TMapInstance.PolygonStyle({
          color: 'rgba(64, 158, 255, 0.16)',
          borderColor: 'rgba(64, 158, 255, 0.9)',
          borderWidth: 2,
          borderDashArray: [],
          showBorder: true,
        }),
      },
      geometries: [],
    });
  }

  if (TMapInstance.MultiPolyline && TMapInstance.PolylineStyle) {
    polylineLayer = new TMapInstance.MultiPolyline({
      id: 'area-line-layer',
      map,
      styles: {
        line: new TMapInstance.PolylineStyle({
          color: 'rgba(64, 158, 255, 0.95)',
          width: 2,
          borderWidth: 0,
          lineCap: 'round',
          lineJoin: 'round',
        }),
      },
      geometries: [],
    });
  }
};

const generateInfoWindowContent = (properties) => {
  const config = props.infoWindowConfig;
  const title = properties[config.title] || '未知';

  let fieldsHtml = '';
  if (config.fields) {
    config.fields.forEach((field) => {
      const value = properties[field.key] ?? '--';
      const style = field.bold ? 'font-weight:bold;' : '';
      fieldsHtml += `
        <tr>
          <td style="width:96px;padding:3px 10px 3px 0;text-align:right;color:#606266;white-space:nowrap;vertical-align:top;">${field.label}：</td>
          <td style="${style}padding:3px 0;color:#303133;word-break:break-all;white-space:normal;vertical-align:top;">${value}</td>
        </tr>
      `;
    });
  }

  return `
    <div style="box-sizing:border-box;max-width:420px;min-width:300px;padding:12px 14px;">
      <h3 style="margin:0 0 10px;font-size:15px;line-height:20px;color:#303133;word-break:break-all;">${title}</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${fieldsHtml}
      </table>
    </div>
  `;
};

const onMarkerClick = (evt) => {
  const { position, properties } = evt.geometry;
  if (!infoWindow || !properties) return;


  infoWindow.setPosition(position);
  infoWindow.setContent(generateInfoWindowContent(properties));
  infoWindow.open();
  emit('markerClick', properties);
};

const renderMarkers = () => {
  if (!map || !TMapInstance) return;
  if (!props.data?.length) {
    Object.keys(markerLayers).forEach((k) => {
      if (markerLayers[k]) {
        markerLayers[k].setGeometries([]);
      }
    });
    polygonLayer?.setGeometries?.([]);
    polylineLayer?.setGeometries?.([]);
    return;
  }

  const buckets = {};
  Object.keys(props.statusIconMap).forEach((key) => {
    buckets[key] = [];
  });
  const areaPolygons = [];
  const areaLines = [];

  const bounds = new TMapInstance.LatLngBounds();

  props.data.forEach((item) => {
    const areaPoints = Array.isArray(item.areaPoints) ? item.areaPoints : [];
    if (areaPoints.length >= 3) {
      const path = areaPoints
        .map((point) => {
          const lng = Number(point.lng ?? point.lon ?? point.longitude);
          const lat = Number(point.lat ?? point.latitude);
          if (Number.isNaN(lng) || Number.isNaN(lat)) return null;
          const pointLatLng = new TMapInstance.LatLng(lat, lng);
          bounds.extend(pointLatLng);
          return pointLatLng;
        })
        .filter(Boolean);

      if (path.length >= 3) {
        if (polygonLayer) {
          areaPolygons.push({
            id: `polygon-${item.id}`,
            styleId: 'area',
            paths: [path],
            properties: item,
          });
        }
        if (polylineLayer) {
          const closedPath = path.length > 2 ? [...path, path[0]] : [...path];
          areaLines.push({
            id: `polyline-${item.id}`,
            styleId: 'line',
            paths: closedPath,
            properties: item,
          });
        }
      }
    }

    if (!item.coordinate) return;

    const [lng, lat] = item.coordinate.split(',').map(Number);
    if (Number.isNaN(lng) || Number.isNaN(lat)) return;

    const position = new TMapInstance.LatLng(lat, lng);
    bounds.extend(position);

    let key = 'blue';
    const statusName = (item.statusName || '').trim();

    // 优先根据运行状态确定图标颜色
    if (props.statusKeyMap[statusName]) {
      key = props.statusKeyMap[statusName];
    } else if (item.checkResultName === '未通过') {
      key = 'red';
    }

    if (buckets[key]) {
      buckets[key].push({
        id: item.geoCode || item.id,
        styleId: 'normal',
        position,
        properties: item,
      });
    }
  });

  Object.keys(markerLayers).forEach((k) => {
    if (markerLayers[k]) {
      markerLayers[k].setGeometries(buckets[k] || []);
    }
  });
  if (polygonLayer) {
    polygonLayer.setGeometries(areaPolygons);
  }
  if (polylineLayer) {
    polylineLayer.setGeometries(areaLines);
  }

  const focusFirst = props.locateFocusKey && props.data[0]?.coordinate;
  if (focusFirst) {
    const [lng, lat] = props.data[0].coordinate.split(',').map(Number);
    if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
      const position = new TMapInstance.LatLng(lat, lng);
      map.setCenter(position);
      map.setZoom(16);
      if (infoWindow) {
        infoWindow.setPosition(position);
        infoWindow.setContent(generateInfoWindowContent(props.data[0]));
        infoWindow.open();
      }
      return;
    }
  }

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 100 });
  } else if (props.data.length > 0) {
    const firstItem = props.data[0];
    if (firstItem.coordinate) {
      const [lng, lat] = firstItem.coordinate.split(',').map(Number);
      if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
        const position = new TMapInstance.LatLng(lat, lng);
        map.setCenter(position);
        map.setZoom(15);
      }
    }
  }
};

const handleResize = () => {
  if (map) map.resize();
};

watch(() => props.data, renderMarkers, { deep: true });
watch(() => props.locateFocusKey, renderMarkers);

onMounted(() => {
  initMap();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(markerLayers).forEach(
    (layer) => layer.destroy && layer.destroy(),
  );
  if (polygonLayer?.destroy) polygonLayer.destroy();
  if (polylineLayer?.destroy) polylineLayer.destroy();
  if (infoWindow) infoWindow.destroy && infoWindow.destroy();
  if (map && map.destroy) map.destroy();
});
</script>

<template>
  <div class="map-container">
    <div ref="mapRef" class="map-content"></div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.map-content {
  width: 100%;
  height: 100%;
}
</style>
