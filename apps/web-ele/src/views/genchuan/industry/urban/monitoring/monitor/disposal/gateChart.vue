<script setup>
import { reactive, ref } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import Line from '#/components/stats/line.vue';

// 饼图切换状态
const firstChartIndex = ref(0);
const secondChartIndex = ref(0);

// 图表切换状态
const chartIndex = ref(0);

const state = reactive({
  cardList: [
    { title: '处置中工单总数', value: 5, color: '#13ce66' },
    { title: '高风险工单数', value: 2, color: '#F56C6C' },
    { title: '超时工单数', value: 1, color: '#F56C6C' },
    { title: '待处置工单数', value: 1, color: '#E6A23C' },
    { title: '现场处置工单数', value: 2, color: '#4ECDC4' },
    { title: '运维员人均负荷', value: '2.5', color: '#909399' },
  ],
});

// 第一个饼图的数据
const firstChartData = [
  {
    title: '工单进度占比',
    data: [
      { name: '待处置', value: 1 },
      { name: '现场处置', value: 2 },
      { name: '处置中', value: 2 },
    ],
    colors: ['#E6A23C', '#4ECDC4', '#67C23A']
  },
  {
    title: '异常类型分布占比',
    data: [
      { name: '倾斜角度异常', value: 2 },
      { name: '振动异常', value: 2 },
      { name: '设备离线', value: 1 },
    ],
    colors: ['#F56C6C', '#E6A23C', '#4ECDC4']
  }
];

// 第二个饼图的数据
const secondChartData = [
  {
    title: '安全风险等级占比',
    data: [
      { name: '低风险', value: 1 },
      { name: '中风险', value: 2 },
      { name: '高风险', value: 2 },
    ],
    colors: ['#67C23A', '#E6A23C', '#F56C6C']
  },
  {
    title: '路段工单分布占比',
    data: [
      { name: '福州市', value: 1 },
      { name: '厦门市', value: 1 },
      { name: '泉州市', value: 1 },
      { name: '漳州市', value: 1 },
      { name: '莆田市', value: 1 },
    ],
    colors: ['#4ECDC4', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  }
];

// 所有折线图和柱状图的数据
const allChartsData = [
  // 柱状图
  {
    type: 'columnar',
    title: '不同运维员处置工单数对比',
    xData: ['陈铭', '林晓婷', '王志远', '黄丽萍', '郑建明'],
    seriesData: [{ name: '工单数', data: [1, 1, 1, 1, 1] }],
    height: '330px'
  },
  {
    type: 'columnar',
    title: '不同路段工单处置时长对比',
    xData: ['福州', '厦门', '泉州', '漳州', '莆田'],
    seriesData: [{ name: '时长(小时)', data: [19, 29, 8, 8, 14] }],
    height: '330px'
  },
  {
    type: 'columnar',
    title: '各异常类型工单数量对比',
    xData: ['倾斜角度异常', '振动异常', '设备离线'],
    seriesData: [{ name: '工单数', data: [2, 2, 1] }],
    height: '330px'
  },
  // 折线图
  {
    type: 'line',
    title: '近7天工单创建/完成趋势',
    xData: ['6/9', '6/10', '6/11', '6/12', '6/13', '6/14', '6/15'],
    seriesData: [
      { name: '创建工单', data: [0, 1, 0, 1, 1, 1, 1], color: '#4a90e2' },
      { name: '完成工单', data: [0, 0, 0, 1, 0, 1, 0], color: '#06D6A0' }
    ],
    yName: '数量',
    height: '330px'
  },
  {
    type: 'line',
    title: '近24小时进度更新频次趋势',
    xData: ['0时', '4时', '8时', '12时', '16时', '20时'],
    seriesData: [{ name: '更新频次', data: [0, 0, 2, 1, 2, 0], color: '#FF6B6B' }],
    yName: '频次',
    height: '330px'
  },
  {
    type: 'line',
    title: '高风险工单处置时效趋势',
    xData: ['6/10', '6/11', '6/12', '6/13', '6/14', '6/15'],
    seriesData: [{ name: '处置时长(小时)', data: [18, 16, 19, 17, 15, 8], color: '#FFD166' }],
    yName: '小时',
    height: '330px'
  }
];

// 切换第一个饼图
const toggleFirstChart = () => {
  firstChartIndex.value = (firstChartIndex.value + 1) % firstChartData.length;
};

// 切换第二个饼图
const toggleSecondChart = () => {
  secondChartIndex.value = (secondChartIndex.value + 1) % secondChartData.length;
};

// 切换图表
const toggleChart = () => {
  chartIndex.value = (chartIndex.value + 1) % allChartsData.length;
};
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left" style="display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(3, 100px); gap: 15px; width: 100%; margin-bottom: 5px;">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        :style="{ height: '100%' }"
      />
    </div>
    <!-- 饼图和动态图表布局 -->
    <div style="display: flex; gap: 5px; margin-bottom: 5px; min-width: 1485px; height: 330px;">
      <!-- 饼图容器 -->
      <div style="display: flex; gap: 5px; flex-shrink: 0;">
        <!-- 第一个饼图，带切换按钮 -->
        <div style="position: relative; width: 380px; height: 100%;">
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
        <div style="position: relative; width: 380px; height: 100%;">
          <Circle
              :title-text="secondChartData[secondChartIndex].title"
              :data="secondChartData[secondChartIndex].data"
              :colors="secondChartData[secondChartIndex].colors"
            />
          <!-- 切换按钮 -->
          <div class="corner-button" @click="toggleSecondChart" title="切换图表">
            <span>→</span>
          </div>
        </div>
      </div>
      
      <!-- 动态图表，带切换按钮 -->
      <div style="position: relative; width: 715px; height: 100%;">
        <!-- 折线图 -->
        <div v-if="allChartsData[chartIndex].type === 'line'" style="width: 100%; height: 100%;">
          <Line
            :title="allChartsData[chartIndex].title"
            :x-data="allChartsData[chartIndex].xData"
            :series-data="allChartsData[chartIndex].seriesData"
            :y-name="allChartsData[chartIndex].yName"
          />
        </div>
        <!-- 柱状图 -->
        <div v-else-if="allChartsData[chartIndex].type === 'columnar'" style="width: 100%; height: 100%;">
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
  bottom: 35px;
  right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(20, 30, 40, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  user-select: none;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.corner-button:hover {
  background: rgba(35, 50, 65, 0.9);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  border-color: white;
}

.corner-button:active {
  transform: scale(0.95);
  background: rgba(10, 20, 30, 0.9);
}

/* 按钮中的箭头 */
.corner-button span {
  transform: translateY(-1px); /* 微调视觉 */
  display: inline-block;
}

/* 图表组件样式 */
.park-type-chart,
.simple-bar-chart {
  width: 100%;
  height: 100%;
}
</style>
