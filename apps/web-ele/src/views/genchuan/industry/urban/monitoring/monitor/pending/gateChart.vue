<script setup>
import { reactive, ref } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import Line from '#/components/stats/line.vue';
import MapComponent from '#/genchuan-components/Map/index.vue';

// 饼图切换状态
const firstChartIndex = ref(0);
const secondChartIndex = ref(0);

// 图表切换状态
const chartIndex = ref(0);

const state = reactive({
  cardList: [
    { title: '待处置预警总数', value: 5, color: '#13ce66' },
    { title: '高风险预警数', value: 1, color: '#F56C6C' },
    { title: '中风险预警数', value: 2, color: '#E6A23C' },
    { title: '低风险预警数', value: 2, color: '#67C23A' },
    { title: '超时预警数', value: 0, color: '#F56C6C' },
    { title: '未派单预警数', value: 3, color: '#E6A23C' },
  ],
  mapData: [
    {
      id: 1,
      locationName: '福州路段预警1',
      coordinateInfo: '119.2965,26.0753',
      statusName: '异常',
      riskLevel: '高风险',
    },
    {
      id: 2,
      locationName: '泉州路段预警1',
      coordinateInfo: '118.6880,24.8740',
      statusName: '异常',
      riskLevel: '中风险',
    },
    {
      id: 3,
      locationName: '莆田路段预警1',
      coordinateInfo: '119.0094,25.4311',
      statusName: '异常',
      riskLevel: '中风险',
    },
    {
      id: 4,
      locationName: '龙岩路段预警1',
      coordinateInfo: '116.9139,25.1054',
      statusName: '异常',
      riskLevel: '低风险',
    },
    {
      id: 5,
      locationName: '南平路段预警1',
      coordinateInfo: '118.1755,26.6327',
      statusName: '异常',
      riskLevel: '低风险',
    },
  ],
  mapConfig: {
    markerIcons: {
      normal: '/static/imgs/dataHub/map/marker-blue.png',
      yellow: '/static/imgs/dataHub/map/marker-yellow.png',
      red: '/static/imgs/dataHub/map/marker-red.png',
    },
    statusIconMap: {
      green: 'normal',
      orange: 'yellow',
      red: 'red',
      blue: 'normal',
      gray: 'normal',
    },
    statusKeyMap: {
      正常: 'green',
      异常: 'red',
      离线: 'red',
      维护中: 'orange',
      停用: 'red',
      建设中: 'gray',
    },
    infoWindowConfig: {
      title: 'locationName',
      fields: [
        { key: 'id', label: '预警编号' },
        { key: 'statusName', label: '状态', bold: true },
        { key: 'riskLevel', label: '风险等级' },
      ],
    },
  },
});

// 第一个饼图的数据
const firstChartData = [
  {
    title: '安全风险等级占比',
    data: [
      { name: '低风险', value: 2 },
      { name: '中风险', value: 2 },
      { name: '高风险', value: 1 },
    ],
    colors: ['#67C23A', '#E6A23C', '#F56C6C'],
  },
  {
    title: '异常类型分布占比',
    data: [
      { name: '倾斜角度异常', value: 1 },
      { name: '振动异常', value: 1 },
      { name: '设备离线', value: 1 },
      { name: '设备异常', value: 1 },
      { name: '轻微倾斜', value: 1 },
    ],
    colors: ['#F56C6C', '#E6A23C', '#4ECDC4', '#13ce66', '#67C23A'],
  },
];

// 第二个饼图的数据
const secondChartData = [
  {
    title: '派单状态占比',
    data: [
      { name: '未派单', value: 3 },
      { name: '已派单', value: 2 },
    ],
    colors: ['#E6A23C', '#67C23A'],
  },
  {
    title: '开合状态预警占比',
    data: [
      { name: '关闭', value: 3 },
      { name: '开启', value: 2 },
    ],
    colors: ['#67C23A', '#F56C6C'],
  },
];

// 所有折线图和柱状图的数据
const allChartsData = [
  // 柱状图
  {
    type: 'columnar',
    title: '不同路段预警次数对比',
    xData: [
      '福州',
      '厦门',
      '泉州',
      '莆田',
      '宁德',
      '龙岩',
      '三明',
      '南平',
      '平潭',
    ],
    seriesData: [{ name: '', data: [1, 0, 1, 1, 0, 1, 0, 1, 0] }],
    height: '330px',
  },
  {
    type: 'columnar',
    title: '不同异常类型预警数对比',
    xData: ['倾斜角度异常', '振动异常', '设备离线', '设备异常', '轻微倾斜'],
    seriesData: [{ name: '', data: [1, 1, 1, 1, 1] }],
    height: '330px',
  },
  {
    type: 'columnar',
    title: '近7天预警触发趋势',
    xData: ['1日', '2日', '3日', '4日', '5日', '6日', '7日'],
    seriesData: [{ name: '', data: [0, 1, 1, 0, 2, 0, 1] }],
    height: '330px',
  },
  // 折线图
  {
    type: 'line',
    title: '近24小时预警触发/派单/处置时效趋势',
    xData: [
      '00:00',
      '03:00',
      '06:00',
      '09:00',
      '12:00',
      '15:00',
      '18:00',
      '21:00',
    ],
    seriesData: [
      { name: '预警触发', data: [0, 1, 0, 1, 1, 0, 1, 1], color: '#4a90e2' },
      { name: '已派单', data: [0, 0, 1, 1, 0, 1, 0, 1], color: '#06D6A0' },
      { name: '已处置', data: [0, 0, 0, 1, 0, 0, 1, 0], color: '#FFD166' },
    ],
    yName: '数量',
    height: '330px',
  },
  {
    type: 'line',
    title: '高风险预警处置时长趋势',
    xData: ['1日', '2日', '3日', '4日', '5日', '6日', '7日'],
    seriesData: [
      { name: '处置时长', data: [2, 3, 2.5, 1.5, 2, 3, 2], color: '#FF6B6B' },
    ],
    yName: '小时',
    height: '330px',
  },
];

// 切换第一个饼图
const toggleFirstChart = () => {
  firstChartIndex.value = (firstChartIndex.value + 1) % firstChartData.length;
};

// 切换第二个饼图
const toggleSecondChart = () => {
  secondChartIndex.value =
    (secondChartIndex.value + 1) % secondChartData.length;
};

// 切换图表
const toggleChart = () => {
  chartIndex.value = (chartIndex.value + 1) % allChartsData.length;
};

// 地图显示状态
const mapVisible = ref(true);

// 切换地图显示/隐藏
const toggleMap = () => {
  mapVisible.value = !mapVisible.value;
};
</script>

<template>
  <div class="park-chart-box">
    <div
      class="chart-box-left"
      style="
        display: grid;
        grid-template-rows: repeat(3, 100px);
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        width: 100%;
        margin-bottom: 5px;
      "
    >
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        :style="{ height: '100%' }"
      />
    </div>
    <!-- 饼图和动态图表布局 -->
    <div
      style="
        display: flex;
        gap: 5px;
        min-width: 1485px;
        height: 330px;
        margin-bottom: 5px;
      "
    >
      <!-- 饼图容器 -->
      <div style="display: flex; flex-shrink: 0; gap: 5px">
        <!-- 第一个饼图，带切换按钮 -->
        <div style="position: relative; width: 380px; height: 100%">
          <Circle
            :title-text="firstChartData[firstChartIndex].title"
            :data="firstChartData[firstChartIndex].data"
            :colors="firstChartData[firstChartIndex].colors"
          />
          <!-- 切换按钮 -->
          <div class="corner-button" @click="toggleFirstChart" title="切换图表">
            <span>→</span>
          </div>
        </div>

        <!-- 第二个饼图，带切换按钮 -->
        <div style="position: relative; width: 380px; height: 100%">
          <Circle
            :title-text="secondChartData[secondChartIndex].title"
            :data="secondChartData[secondChartIndex].data"
            :colors="secondChartData[secondChartIndex].colors"
          />
          <!-- 切换按钮 -->
          <div
            class="corner-button"
            @click="toggleSecondChart"
            title="切换图表"
          >
            <span>→</span>
          </div>
        </div>
      </div>

      <!-- 动态图表，带切换按钮 -->
      <div style="position: relative; width: 715px; height: 100%">
        <!-- 展开/隐藏地图按钮 -->
        <button
          style="
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 20;
            padding: 6px 12px;
            font-size: 12px;
            color: white;
            cursor: pointer;
            background-color: #4a90e2;
            border: none;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          "
          @click="toggleMap"
          :style="{ backgroundColor: mapVisible ? '#4a90e2' : '#6c757d' }"
        >
          {{ mapVisible ? '隐藏地图' : '展开地图' }}
        </button>
        <!-- 折线图 -->
        <div
          v-if="allChartsData[chartIndex].type === 'line'"
          style="width: 100%; height: 100%"
        >
          <Line
            :title="allChartsData[chartIndex].title"
            :x-data="allChartsData[chartIndex].xData"
            :series-data="allChartsData[chartIndex].seriesData"
            :y-name="allChartsData[chartIndex].yName"
          />
        </div>
        <!-- 柱状图 -->
        <div
          v-else-if="allChartsData[chartIndex].type === 'columnar'"
          style="width: 100%; height: 100%"
        >
          <Columnar
            :title="allChartsData[chartIndex].title"
            :x-data="allChartsData[chartIndex].xData"
            :series-data="allChartsData[chartIndex].seriesData"
          />
        </div>
        <!-- 切换按钮 -->
        <div class="corner-button" @click="toggleChart" title="切换图表">
          <span>→</span>
        </div>
      </div>
    </div>
    <!-- 地图容器 -->
    <div
      v-if="mapVisible"
      class="map-container"
      style="width: 100%; height: 320px; margin-top: 0"
    >
      <MapComponent
        :data="state.mapData"
        :marker-icons="state.mapConfig.markerIcons"
        :status-icon-map="state.mapConfig.statusIconMap"
        :status-key-map="state.mapConfig.statusKeyMap"
        :info-window-config="state.mapConfig.infoWindowConfig"
      />
    </div>
  </div>
</template>

<style scoped>
/* 图表容器样式 */
.chart-container {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transition: height 0.3s ease;
}

/* 切换按钮样式 */
.corner-button {
  position: absolute;
  right: 12px;
  bottom: 35px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: white;
  cursor: pointer;
  user-select: none;
  background: rgb(20 30 40 / 75%);
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.corner-button:hover {
  background: rgb(35 50 65 / 90%);
  border-color: white;
  box-shadow: 0 6px 16px rgb(0 0 0 / 40%);
  transform: scale(1.1);
}

.corner-button:active {
  background: rgb(10 20 30 / 90%);
  transform: scale(0.95);
}

/* 按钮中的箭头 */
.corner-button span {
  display: inline-block;
  transform: translateY(-1px); /* 微调视觉 */
}

/* 图表组件样式 */
.park-type-chart,
.simple-bar-chart {
  width: 100%;
  height: 100%;
}
</style>
