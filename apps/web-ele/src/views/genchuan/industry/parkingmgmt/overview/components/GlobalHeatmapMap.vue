<script setup>
import {
  defineExpose,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  nextTick
} from 'vue';

import {
  fetchHeatmapData,
  fetchParkingLotData
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalOverview.ts';
import parkingIcon from '../../images/parking.png';

const props = defineProps({
  idName: {
    type: String,
    default: 'gridHeatmapMap',
  },
  mapConfig: {
    type: Object,
    default: () => ({
      center: {lat: 24.58, lng: 117.65},
      zoom: 13,
    }),
  },
  heatmapConfig: {
    type: Object,
    default: () => ({
      gridConfig: {
        latSpan: 0.005,
        lngSpan: 0.005,
        minDataThreshold: 1,
        maxGridCount: 1000,
        minOpacityAtLowZoom: 0.3,
        minVisibleSize: 4
      },
      colorGradient: {
        1: 'rgba(255, 240, 240, 0.8)',
        2: 'rgba(255, 200, 200, 0.85)',
        3: 'rgba(255, 150, 150, 0.9)',
        4: 'rgba(255, 100, 100, 0.95)',
        5: 'rgba(255, 50, 50, 1.0)',
        6: 'rgba(255, 0, 0, 1.0)'
      },
      prismHeightConfig: {
        baseHeight: 10,
        heightMultiplier: 5,
        maxHeight: 50,
        zoomHeightScale: {
          8: 0.3,
          10: 0.5,
          12: 0.7,
          14: 0.9,
          16: 1.0
        }
      },
      borderConfig: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.2)',
        width: 1
      },
      displayConfig: {
        showGridLines: false,
        showLabels: false,
        animationDuration: 300,
        simplifyAtLowZoom: true,
        simplifyZoomThreshold: 10
      }
    }),
  },
});

const mapInstance = ref(null);
const gridLayers = ref([]);
const mapInitialized = ref(false);
const currentZoom = ref(props.mapConfig.zoom);
const heatmapData = ref([]);
const aggregatedGrids = ref([]);
const hoveredGrid = ref(null);
const tooltipStyle = ref({});
const gridStats = ref(null);
const isUnmounted = ref(false);
const parkMarkerLayer = ref(null);
const parkingLotData = ref([]);

const getHeatLevel = (count, maxCount) => {
  if (maxCount === 0) return 1;

  const normalized = count / maxCount;
  if (normalized >= 0.9) return 6;
  if (normalized >= 0.7) return 5;
  if (normalized >= 0.5) return 4;
  if (normalized >= 0.3) return 3;
  if (normalized >= 0.1) return 2;
  return 1;
};

const getHeightForZoom = (baseHeight, zoom) => {
  const {zoomHeightScale} = props.heatmapConfig.prismHeightConfig;

  if (!zoomHeightScale || Object.keys(zoomHeightScale).length === 0) {
    return baseHeight;
  }

  const zoomLevels = Object.keys(zoomHeightScale).map(Number).sort((a, b) => a - b);

  if (zoom <= zoomLevels[0]) {
    return baseHeight * zoomHeightScale[zoomLevels[0]];
  }

  if (zoom >= zoomLevels[zoomLevels.length - 1]) {
    return baseHeight * zoomHeightScale[zoomLevels[zoomLevels.length - 1]];
  }

  for (let i = 0; i < zoomLevels.length - 1; i++) {
    if (zoom >= zoomLevels[i] && zoom <= zoomLevels[i + 1]) {
      const lowerZoom = zoomLevels[i];
      const upperZoom = zoomLevels[i + 1];
      const lowerScale = zoomHeightScale[lowerZoom];
      const upperScale = zoomHeightScale[upperZoom];

      const zoomRatio = (zoom - lowerZoom) / (upperZoom - lowerZoom);
      const scale = lowerScale + (upperScale - lowerScale) * zoomRatio;

      return baseHeight * scale;
    }
  }

  return baseHeight;
};

const aggregateDataToGrids = (data) => {
  const {latSpan, lngSpan, minDataThreshold, maxGridCount} = props.heatmapConfig.gridConfig;
  const gridMap = new Map();

  data.forEach(item => {
    const [latitude, longitude, pointCount = 1] = item;
    const intensity = pointCount;

    const latIndex = Math.floor(latitude / latSpan);
    const lngIndex = Math.floor(longitude / lngSpan);
    const gridKey = `${latIndex}_${lngIndex}`;

    if (!gridMap.has(gridKey)) {
      const minLat = latIndex * latSpan;
      const maxLat = minLat + latSpan;
      const minLng = lngIndex * lngSpan;
      const maxLng = minLng + lngSpan;

      gridMap.set(gridKey, {
        key: gridKey,
        latIndex,
        lngIndex,
        latRange: [minLat, maxLat],
        lngRange: [minLng, maxLng],
        points: [],
        count: 0,
        totalIntensity: 0,
        minLat,
        maxLat,
        minLng,
        maxLng
      });
    }

    const grid = gridMap.get(gridKey);
    grid.points.push({latitude, longitude, intensity});
    grid.count += pointCount;
    grid.totalIntensity += intensity;
  });

  let grids = Array.from(gridMap.values()).map(grid => {
    grid.averageIntensity = grid.count > 0 ? grid.totalIntensity / grid.count : 0;
    return grid;
  });

  if (minDataThreshold > 0) {
    grids = grids.filter(grid => grid.count >= minDataThreshold);
  }

  let maxCount = 0;
  grids.forEach(grid => {
    if (grid.count > maxCount) {
      maxCount = grid.count;
    }
  });

  grids.forEach(grid => {
    grid.level = getHeatLevel(grid.count, maxCount);
  });

  if (maxGridCount > 0 && grids.length > maxGridCount) {
    console.warn(`网格数量(${grids.length})超过限制(${maxGridCount})，将进行采样`);
    grids.sort((a, b) => b.count - a.count);
    grids = grids.slice(0, maxGridCount);
  }

  grids.forEach(grid => {
    grid.centerLat = (grid.latRange[0] + grid.latRange[1]) / 2;
    grid.centerLng = (grid.lngRange[0] + grid.lngRange[1]) / 2;
  });

  gridStats.value = {
    totalGrids: grids.length,
    totalPoints: data.length,
    maxCount,
    latSpan,
    lngSpan
  };

  return grids;
};

const loadParkingLotData = async () => {
  try {
    const data = await fetchParkingLotData({});
    parkingLotData.value = data;
    return data;
  } catch (error) {
    console.error('加载停车场点位数据失败:', error);
    parkingLotData.value = [];
    return [];
  }
};

const createParkingMarkers = (map) => {
  if (!map || !Array.isArray(parkingLotData.value) || parkingLotData.value.length === 0) {
    return;
  }

  if (parkMarkerLayer.value) {
    try {
      parkMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁停车场标注层失败:', error);
    }
    parkMarkerLayer.value = null;
  }

  const parkData = parkingLotData.value.filter(item =>
    item.lotId && typeof item.longitude === 'number' && typeof item.latitude === 'number'
  ).map(item => ({
    id: `park-${item.lotId}`,
    styleId: 'park-normal',
    position: new TMap.LatLng(item.latitude, item.longitude),
    properties: {...item, markerType: 'parkLot'}
  }));

  if (parkData.length === 0) return;

  parkMarkerLayer.value = new TMap.MultiMarker({
    map,
    styles: {
      'park-normal': new TMap.MarkerStyle({
        width: 50,
        height: 50,
        anchor: {x: 20, y: 35},
        src: parkingIcon
      })
    },
    geometries: parkData,
    zIndex: 20
  });

  parkMarkerLayer.value.on('click', (e) => {
    const {properties} = e.geometry;
    console.log('点击停车场:', properties.lotName || properties.lotId);
  });
};

const initMap = () => {
  const timestamp = new Date().getTime();
  const callbackName = `initMap_${props.idName}_${timestamp}`;

  const scriptTags = document.querySelectorAll('script[src*="map.qq.com/api/gljs"]');
  scriptTags.forEach(tag => {
    if (tag.src.includes(`callback=`)) {
      tag.remove();
    }
  });

  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=5L5BZ-XCN6L-GVKPS-MYOXE-5SYY6-QIFWV&callback=${callbackName}`;
  script.async = true;

  window[callbackName] = () => {
    if (isUnmounted.value) return;
    mapCallback();
    delete window[callbackName];
  };

  document.head.append(script);
};

const loadHeatmapData = async () => {
  try {
    const data = await fetchHeatmapData({});
    heatmapData.value = data;
    aggregatedGrids.value = aggregateDataToGrids(data);
    return data;
  } catch (error) {
    console.error('加载热力图数据失败:', error);
    heatmapData.value = [];
    aggregatedGrids.value = [];
    return [];
  }
};

const createHeatmapGrids = (map) => {
  if (!map || !mapInstance.value || typeof map.getZoom !== 'function') {
    console.warn('无效的地图实例，无法创建热力图');
    return;
  }

  destroyGridLayers();

  if (!Array.isArray(aggregatedGrids.value) || aggregatedGrids.value.length === 0) {
    console.warn('聚合网格数据为空，无法创建热力图');
    return;
  }

  const {simplifyAtLowZoom, simplifyZoomThreshold} = props.heatmapConfig.displayConfig;
  const shouldSimplify = simplifyAtLowZoom && currentZoom.value <= simplifyZoomThreshold;
  const prismGeometries = [];

  aggregatedGrids.value.forEach((grid, index) => {
    const {latRange, lngRange, level, count} = grid;
    const {colorGradient, prismHeightConfig} = props.heatmapConfig;

    let basePrismHeight = prismHeightConfig.baseHeight + (level - 1) * prismHeightConfig.heightMultiplier;
    basePrismHeight = Math.min(basePrismHeight, prismHeightConfig.maxHeight);
    const prismHeight = getHeightForZoom(basePrismHeight, currentZoom.value);

    let color = colorGradient[level] || colorGradient[1];

    if (currentZoom.value <= 10) {
      const {minOpacityAtLowZoom} = props.heatmapConfig.gridConfig;
      const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (rgbaMatch) {
        const opacity = Math.max(parseFloat(rgbaMatch[4]), minOpacityAtLowZoom || 0.3);
        color = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
      }
    }

    if (shouldSimplify && count === 0) {
      return;
    }

    if (typeof TMap === 'undefined' || !TMap.LatLng) {
      console.error('TMap对象未加载完成');
      return;
    }

    const vertices = [
      new TMap.LatLng(latRange[0], lngRange[0]),
      new TMap.LatLng(latRange[0], lngRange[1]),
      new TMap.LatLng(latRange[1], lngRange[1]),
      new TMap.LatLng(latRange[1], lngRange[0]),
    ];

    prismGeometries.push({
      id: `grid-${index}`,
      styleId: `grid-style-${level}`,
      paths: vertices,
      properties: {
        ...grid,
        level,
        count,
        color,
        height: prismHeight
      }
    });
  });

  const styles = {};
  for (let level = 1; level <= 6; level++) {
    let color = props.heatmapConfig.colorGradient[level] || props.heatmapConfig.colorGradient[1];

    if (currentZoom.value <= 10) {
      const {minOpacityAtLowZoom} = props.heatmapConfig.gridConfig;
      const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (rgbaMatch) {
        const opacity = Math.max(parseFloat(rgbaMatch[4]), minOpacityAtLowZoom || 0.3);
        color = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
      }
    }

    styles[`grid-style-${level}`] = new TMap.PolygonStyle({
      color: color,
      showBorder: props.heatmapConfig.borderConfig.enabled && currentZoom.value > 10,
      borderColor: props.heatmapConfig.borderConfig.color,
      borderWidth: props.heatmapConfig.borderConfig.width
    });
  }

  try {
    const polygonLayer = new TMap.MultiPolygon({
      map,
      styles,
      geometries: prismGeometries,
      zIndex: 10
    });

    polygonLayer.on('click', (evt) => {
      const {geometry} = evt;
      console.log('网格被点击:', geometry.properties);
    });

    polygonLayer.on('mouseover', (evt) => {
      if (currentZoom.value <= 8) return;
      const {geometry, latLng} = evt;
      hoveredGrid.value = geometry.properties;
      updateTooltipPosition(latLng);
    });

    polygonLayer.on('mouseout', () => {
      hoveredGrid.value = null;
    });

    gridLayers.value.push(polygonLayer);
  } catch (error) {
    console.error('创建网格图层失败:', error);
  }

  if (props.heatmapConfig.displayConfig.showGridLines && currentZoom.value > 10) {
    createGridLines(map);
  }
};

const createGridLines = (map) => {
  if (!map || typeof TMap === 'undefined') return;

  const lineGeometries = [];
  const {latSpan, lngSpan} = props.heatmapConfig.gridConfig;

  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  heatmapData.value.forEach(item => {
    const [latitude, longitude] = item;
    if (latitude < minLat) minLat = latitude;
    if (latitude > maxLat) maxLat = latitude;
    if (longitude < minLng) minLng = longitude;
    if (longitude > maxLng) maxLng = longitude;
  });

  minLat = Math.floor(minLat / latSpan) * latSpan;
  maxLat = Math.ceil(maxLat / latSpan) * latSpan;
  minLng = Math.floor(minLng / lngSpan) * lngSpan;
  maxLng = Math.ceil(maxLng / lngSpan) * lngSpan;

  for (let lat = minLat; lat <= maxLat; lat += latSpan) {
    lineGeometries.push({
      id: `lat-line-${lat}`,
      styleId: 'grid-line',
      paths: [
        new TMap.LatLng(lat, minLng),
        new TMap.LatLng(lat, maxLng)
      ]
    });
  }

  for (let lng = minLng; lng <= maxLng; lng += lngSpan) {
    lineGeometries.push({
      id: `lng-line-${lng}`,
      styleId: 'grid-line',
      paths: [
        new TMap.LatLng(minLat, lng),
        new TMap.LatLng(maxLat, lng)
      ]
    });
  }

  try {
    const lineLayer = new TMap.MultiPolyline({
      map,
      styles: {
        'grid-line': new TMap.PolylineStyle({
          color: 'rgba(100, 100, 100, 0.3)',
          width: 1,
          lineCap: 'round'
        })
      },
      geometries: lineGeometries,
      zIndex: 5
    });

    gridLayers.value.push(lineLayer);
  } catch (error) {
    console.error('创建网格线失败:', error);
  }
};

const updateTooltipPosition = (latLng) => {
  if (!mapInstance.value) return;

  const mapContainer = document.querySelector(`#${props.idName}`);
  if (!mapContainer) return;

  const projection = mapInstance.value.project(latLng);
  tooltipStyle.value = {
    left: `${projection.x + 10}px`,
    top: `${projection.y + 10}px`,
    display: 'block'
  };
};

const mapCallback = async () => {
  if (isUnmounted.value) return;

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
      pitch: 0,
      rotation: 0,
      showControl: false,
    });

    mapInstance.value = map;
    mapInitialized.value = true;
    currentZoom.value = map.getZoom();

    let zoomTimer = null;
    map.on('zoom', () => {
      if (isUnmounted.value) return;

      clearTimeout(zoomTimer);
      zoomTimer = setTimeout(() => {
        if (!mapInstance.value || typeof mapInstance.value.getZoom !== 'function') {
          console.warn('地图实例已失效，跳过缩放处理');
          return;
        }

        const newZoom = mapInstance.value.getZoom();
        currentZoom.value = newZoom;
        createHeatmapGrids(mapInstance.value);
        createParkingMarkers(mapInstance.value);
      }, 200);
    });

    await Promise.all([
      loadHeatmapData(),
      loadParkingLotData()
    ]);
    createHeatmapGrids(map);
    createParkingMarkers(map);

  } catch (error) {
    console.error('地图实例创建失败:', error);
  }
};

const destroyGridLayers = () => {
  if (isUnmounted.value) return;

  if (!Array.isArray(gridLayers.value) || gridLayers.value.length === 0) {
    return;
  }

  gridLayers.value.forEach((layer, index) => {
    try {
      if (layer && typeof layer === 'object') {
        if (layer.setMap && mapInstance.value) {
          try {
            layer.setMap(null);
          } catch (e) {
            console.warn(`图层${index}移除地图关联失败:`, e);
          }
        }
        if (layer.destroy && typeof layer.destroy === 'function') {
          try {
            layer.destroy();
          } catch (e) {
            console.warn(`图层${index}销毁失败:`, e);
          }
        }
      }
    } catch (error) {
      console.warn(`销毁图层${index}失败:`, error);
    }
  });

  gridLayers.value = [];
};

const reloadHeatmap = async () => {
  if (mapInstance.value && typeof mapInstance.value.getZoom === 'function') {
    await Promise.all([
      loadHeatmapData(),
      loadParkingLotData()
    ]);
    createHeatmapGrids(mapInstance.value);
    createParkingMarkers(mapInstance.value);
  }
};

onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

onUnmounted(() => {
  isUnmounted.value = true;

  hoveredGrid.value = null;
  destroyGridLayers();

  if (parkMarkerLayer.value) {
    try {
      parkMarkerLayer.value.destroy();
    } catch (error) {
      console.warn('销毁停车场标注层失败:', error);
    }
    parkMarkerLayer.value = null;
  }

  if (mapInstance.value) {
    try {
      mapInstance.value.destroy();
    } catch (error) {
      console.warn('销毁地图实例失败:', error);
    }
    mapInstance.value = null;
  }

  mapInitialized.value = false;
  currentZoom.value = props.mapConfig.zoom;
  heatmapData.value = [];
  aggregatedGrids.value = [];
  parkingLotData.value = [];
});

defineExpose({
  mapInstance,
  reloadHeatmap,
  loadHeatmapData,
  loadParkingLotData,
  getGridStats: () => gridStats.value
});
</script>

<template>
  <div class="map-container">
    <div :id="idName" class="map-common-css"></div>
    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <div class="density-gradient">
            <div v-for="(color, level) in heatmapConfig.colorGradient" :key="level"
                 class="gradient-item" :style="{ backgroundColor: color }"></div>
          </div>
          资源密度
        </div>
        <div class="legend-item" style="margin-right: 1vw !important;">
          <img :src="parkingIcon" class="legend-icon" alt="停车场" />
          停车场
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
  min-height: 400px;
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
  z-index: 100;
}

/* 资源密度梯度条样式 */
.density-gradient {
  display: flex;
  width: 6vw; /* 梯度条总宽度 */
  height: 1.5vh; /* 和停车场图标高度一致 */
  border-radius: 2px;
  overflow: hidden;
}

.gradient-item {
  flex: 1; /* 6个等级的颜色块等分宽度 */
  height: 100%;
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
  white-space: nowrap;
}

.legend-icon {
  width: 1vw;
  height: 2vh;
  object-fit: contain;
}
</style>
