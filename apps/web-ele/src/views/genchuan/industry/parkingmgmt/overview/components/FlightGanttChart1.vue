<script setup>
import { defineProps, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

import { fetchEventHandleGanttData } from '#/api/genchuan/industry/parkingmgmt/overview/RiskWarning.ts';

const props = defineProps({
  title: {
    type: String,
    default: '预警事件处置全流程时间轴',
  },
  baseFontScale: {
    type: Number,
    default: 1,
  },
  refreshKey: {
    type: Number,
    default: 0,
  },
});

const chartRef = ref(null);
const myChart = ref(null);
const chartData = ref({
  event: { dimensions: [], data: [] },
  eventCate: { dimensions: [], data: [] },
});
const _rawData = ref(null);
const HEIGHT_RATIO = 0.6;
const DIM_CATEGORY_INDEX = 0;
const DIM_TIME_START = 1;
const DIM_TIME_END = 2;
const DIM_ALARM_INFO = 3;
const DIM_DISPOSE_STATUS = 4;
const DATA_ZOOM_AUTO_MOVE_THROTTLE = 30;
const DATA_ZOOM_X_INSIDE_INDEX = 1;
const DATA_ZOOM_Y_INSIDE_INDEX = 3;
const DATA_ZOOM_AUTO_MOVE_SPEED = 0.2;
const DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH = 30;

const _draggable = true;
let _draggingEl = null;
let _dropShadow = null;
let _draggingCursorOffset = [0, 0];
let _draggingTimeLength = 0;
let _draggingRecord = null;
let _dropRecord = null;
const _cartesianXBounds = [];
const _cartesianYBounds = [];
let _autoDataZoomAnimator = null;

const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

const makeOption = () => {
  return {
    tooltip: {
      formatter: (params) => {
        const [cateIndex, startTime, endTime, alarmInfo, disposeStatus] =
          params.data;
        const workorderNo =
          chartData.value.eventCate.data[params.dataIndex]?.[0] || '暂无工单号';
        const formatTime = (time) =>
          time ? new Date(time).toLocaleString() : '暂无数据';
        return `预警信息：${alarmInfo}<br/>关联工单号：${workorderNo}<br/>开始处置：${formatTime(startTime)}<br/>处置完成：${formatTime(endTime)}<br/>处置状态：${disposeStatus ? '处置中' : '已完成'}`;
      },
    },
    animation: false,
    title: {
      text: props.title,
      left: 'center',
      textStyle: { fontSize: vwToPx(0.7), color: '#929ABA' },
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'weakFilter',
        height: 20,
        bottom: 0,
        start: 0,
        end: 20,
        handleIcon:
          'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        showDetail: false,
      },
      {
        type: 'inside',
        id: 'insideX',
        xAxisIndex: 0,
        filterMode: 'weakFilter',
        start: 0,
        end: 20,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        zoomLock: true,
        width: 10,
        right: 10,
        top: 70,
        bottom: 20,
        start: 70,
        end: 100,
        handleSize: 0,
        showDetail: false,
      },
      {
        type: 'inside',
        id: 'insideY',
        yAxisIndex: 0,
        start: 70,
        end: 100,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
      },
    ],
    grid: {
      show: true,
      top: 70,
      bottom: 20,
      left: 100,
      right: 20,
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    xAxis: {
      type: 'time',
      position: 'top',
      splitLine: { lineStyle: { color: ['#E9EDFF'] } },
      axisLine: { show: false },
      axisTick: { lineStyle: { color: '#929ABA' } },
      axisLabel: { color: '#929ABA', fontSize: vwToPx(0.7) - 2 },
    },
    yAxis: {
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
      min: 0,
      max: chartData.value.eventCate.data.length,
    },
    series: [
      {
        id: 'flightData',
        type: 'custom',
        renderItem: renderGanttItem,
        dimensions: chartData.value.event.dimensions,
        encode: {
          x: [DIM_TIME_START, DIM_TIME_END],
          y: DIM_CATEGORY_INDEX,
          tooltip: [0, 1, 2, 3, 4],
        },
        data: chartData.value.event.data,
      },
      {
        type: 'custom',
        renderItem: renderAxisLabelItem,
        dimensions: chartData.value.eventCate.dimensions,
        encode: { x: -1, y: 0 },
        data: chartData.value.eventCate.data.map((item, index) =>
          [index].concat(item),
        ),
      },
    ],
  };
};

function renderGanttItem(params, api) {
  const categoryIndex = api.value(DIM_CATEGORY_INDEX);
  const timeStart = api.coord([api.value(DIM_TIME_START), categoryIndex]);
  const timeEnd = api.coord([api.value(DIM_TIME_END), categoryIndex]);
  const coordSys = params.coordSys;
  _cartesianXBounds[0] = coordSys.x;
  _cartesianXBounds[1] = coordSys.x + coordSys.width;
  _cartesianYBounds[0] = coordSys.y;
  _cartesianYBounds[1] = coordSys.y + coordSys.height;

  let barLength = timeEnd[0] - timeStart[0];
  barLength = Math.max(barLength, 2);
  const barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
  const x = timeStart[0];
  const y = timeStart[1] - barHeight;
  const alarmInfo = `${api.value(DIM_ALARM_INFO)}`;
  const disposeStatus = api.value(DIM_DISPOSE_STATUS);
  const text =
    barLength > echarts.format.getTextRect(alarmInfo).width + 40
      ? alarmInfo
      : '';
  const blockColor = disposeStatus ? '#c0950f' : '#196a87';

  const rectNormal = clipRectByRect(params, {
    x,
    y,
    width: barLength,
    height: barHeight,
  });
  const rectText = clipRectByRect(params, {
    x,
    y,
    width: barLength,
    height: barHeight,
  });

  return {
    type: 'group',
    children: [
      {
        type: 'rect',
        ignore: !rectNormal,
        shape: rectNormal,
        style: { fill: blockColor, opacity: 1 },
      },
      {
        type: 'rect',
        ignore: !rectText,
        shape: rectText,
        style: {
          fill: 'transparent',
          text,
          textFill: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
    ],
  };
}

function renderAxisLabelItem(params, api) {
  const y = api.coord([0, api.value(0)])[1];
  const coordSys = params.coordSys;
  const viewTop = coordSys.y;
  const viewBottom = coordSys.y + coordSys.height;
  const labelRealTop = y - 20;
  const labelRealBottom = y;

  if (labelRealBottom < viewTop || labelRealTop > viewBottom) return;

  return {
    type: 'group',
    position: [30, y],
    clipShape: {
      type: 'rect',
      x: 0,
      y: viewTop,
      width: 100,
      height: viewBottom - viewTop,
    },
    children: [
      {
        type: 'path',
        shape: {
          d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
          layout: 'cover',
        },
        style: { fill: '#20c997' },
      },
      {
        type: 'text',
        style: {
          x: 12,
          y: -1,
          text: api.value(1),
          textFill: '#fff',
          textAlign: 'center',
        },
      },
    ],
  };
}

function clipRectByRect(params, rect) {
  return echarts.graphic.clipRectByRect(rect, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height,
  });
}

function initDrag() {
  _autoDataZoomAnimator = makeAnimator(dispatchDataZoom);
  myChart.value.on('mousedown', (param) => {
    if (!_draggable || !param || param.seriesIndex == null) return;
    _draggingRecord = {
      dataIndex: param.dataIndex,
      categoryIndex: param.value[DIM_CATEGORY_INDEX],
      timeStart: param.value[DIM_TIME_START],
      timeEnd: param.value[DIM_TIME_END],
    };
    const style = {
      lineWidth: 2,
      fill: 'rgba(255,0,0,0.1)',
      stroke: 'rgba(255,0,0,0.8)',
      lineDash: [6, 3],
    };
    _draggingEl = addOrUpdateBar(_draggingEl, _draggingRecord, style, 100);
    _draggingCursorOffset = [
      _draggingEl.position[0] - param.event.offsetX,
      _draggingEl.position[1] - param.event.offsetY,
    ];
    _draggingTimeLength = _draggingRecord.timeEnd - _draggingRecord.timeStart;
  });

  myChart.value.getZr().on('mousemove', (event) => {
    if (!_draggingEl) return;
    const cursorX = event.offsetX;
    const cursorY = event.offsetY;
    _draggingEl.attr('position', [
      _draggingCursorOffset[0] + cursorX,
      _draggingCursorOffset[1] + cursorY,
    ]);
    prepareDrop();
    autoDataZoomWhenDraggingOutside(cursorX, cursorY);
  });

  myChart.value.getZr().on('mouseup', () => {
    if (_draggingEl && _dropRecord) {
      updateRawData() &&
        myChart.value.setOption({
          series: { id: 'flightData', data: chartData.value.event.data },
        });
    }
    dragRelease();
  });
  myChart.value.getZr().on('globalout', dragRelease);

  function dragRelease() {
    _autoDataZoomAnimator.stop();
    _draggingEl && myChart.value.getZr().remove(_draggingEl);
    _dropShadow && myChart.value.getZr().remove(_dropShadow);
    _draggingEl = _dropShadow = _dropRecord = _draggingRecord = null;
  }

  function addOrUpdateBar(el, itemData, style, z) {
    const pointStart = myChart.value.convertToPixel('grid', [
      itemData.timeStart,
      itemData.categoryIndex,
    ]);
    const pointEnd = myChart.value.convertToPixel('grid', [
      itemData.timeEnd,
      itemData.categoryIndex,
    ]);
    const barLength = pointEnd[0] - pointStart[0];
    const barHeight =
      Math.abs(
        myChart.value.convertToPixel('grid', [0, 0])[1] -
          myChart.value.convertToPixel('grid', [0, 1])[1],
      ) * HEIGHT_RATIO;
    if (!el) {
      el = new echarts.graphic.Rect({
        shape: { x: 0, y: 0, width: 0, height: 0 },
        style,
        z,
      });
      myChart.value.getZr().add(el);
    }
    el.attr({
      shape: { width: barLength, height: barHeight },
      position: [pointStart[0], pointStart[1] - barHeight],
    });
    return el;
  }

  function prepareDrop() {
    const xPixel = _draggingEl.shape.x + _draggingEl.position[0];
    const yPixel = _draggingEl.shape.y + _draggingEl.position[1];
    const cursorData = myChart.value.convertFromPixel('grid', [xPixel, yPixel]);
    if (cursorData) {
      _dropRecord = {
        categoryIndex: Math.floor(cursorData[1]),
        timeStart: cursorData[0],
        timeEnd: cursorData[0] + _draggingTimeLength,
      };
      const style = { fill: 'rgba(0,0,0,0.4)' };
      _dropShadow = addOrUpdateBar(_dropShadow, _dropRecord, style, 99);
    }
  }

  function updateRawData() {
    const flightData = chartData.value.event.data;
    const movingItem = flightData[_draggingRecord.dataIndex];
    movingItem[DIM_CATEGORY_INDEX] = _dropRecord.categoryIndex;
    movingItem[DIM_TIME_START] = _dropRecord.timeStart;
    movingItem[DIM_TIME_END] = _dropRecord.timeEnd;
    return true;
  }

  function autoDataZoomWhenDraggingOutside(cursorX, cursorY) {
    const cursorDistX = getCursorCartesianDist(cursorX, _cartesianXBounds);
    const cursorDistY = getCursorCartesianDist(cursorY, _cartesianYBounds);
    cursorDistX !== 0 || cursorDistY !== 0
      ? _autoDataZoomAnimator.start({ cursorDistX, cursorDistY })
      : _autoDataZoomAnimator.stop();
  }

  function dispatchDataZoom(params) {
    const option = myChart.value.getOption();
    const optionInsideX = option.dataZoom[DATA_ZOOM_X_INSIDE_INDEX];
    const optionInsideY = option.dataZoom[DATA_ZOOM_Y_INSIDE_INDEX];
    const batch = [];
    prepareBatch(
      batch,
      'insideX',
      optionInsideX.start,
      optionInsideX.end,
      params.cursorDistX,
    );
    prepareBatch(
      batch,
      'insideY',
      optionInsideY.start,
      optionInsideY.end,
      -params.cursorDistY,
    );
    batch.length && myChart.value.dispatchAction({ type: 'dataZoom', batch });

    function prepareBatch(batch, id, start, end, cursorDist) {
      if (cursorDist === 0) return;
      const sign = cursorDist / Math.abs(cursorDist);
      const size = end - start;
      const delta = DATA_ZOOM_AUTO_MOVE_SPEED * sign;
      start += delta;
      end += delta;
      if (end > 100) {
        end = 100;
        start = end - size;
      }
      if (start < 0) {
        start = 0;
        end = start + size;
      }
      batch.push({ dataZoomId: id, start, end });
    }
  }

  function getCursorCartesianDist(cursorXY, bounds) {
    const dist0 =
      cursorXY - (bounds[0] + DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
    const dist1 =
      cursorXY - (bounds[1] - DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
    return dist0 * dist1 <= 0 ? 0 : dist0 < 0 ? dist0 : dist1;
  }

  function makeAnimator(callback) {
    let requestId;
    let callbackParams;
    callback = echarts.throttle(callback, DATA_ZOOM_AUTO_MOVE_THROTTLE);
    function onFrame() {
      callback(callbackParams);
      requestId = requestAnimationFrame(onFrame);
    }
    return {
      start: (params) => {
        callbackParams = params;
        !requestId && onFrame();
      },
      stop: () => {
        requestId && cancelAnimationFrame(requestId);
        requestId = callbackParams = null;
      },
    };
  }
}

const getChartData = async () => {
  try {
    const res = await fetchEventHandleGanttData({});
    chartData.value = res;
    _rawData.value = res;
    myChart.value = echarts.init(chartRef.value);
    myChart.value.setOption(makeOption());
    initDrag();
    myChart.value.on('datazoom', () => {
      myChart.value.setOption({ series: myChart.value.getOption().series });
    });
  } catch (error) {
    console.error('预警处置甘特图数据请求失败:', error);
  }
};

const handleResize = () => {
  nextTick(() => {
    myChart.value && myChart.value.resize();
  });
};

watch(
  [() => chartData.value, () => props.title, () => props.refreshKey],
  () => {
    if (
      chartData.value.event.data.length > 0 &&
      chartData.value.eventCate.data.length > 0 &&
      myChart.value
    ) {
      myChart.value.setOption(makeOption());
    }
  },
  { deep: true },
);

onMounted(() => {
  getChartData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  myChart.value && myChart.value.dispose();
});
</script>

<template>
  <div
    class="chart-container"
    ref="chartRef"
    style="width: 100%; height: 100%"
  ></div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: transparent;
}
</style>
