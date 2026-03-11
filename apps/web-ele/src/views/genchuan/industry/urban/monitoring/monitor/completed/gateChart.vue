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
    { title: '累计归档工单数', value: 25, color: '#13ce66' },
    { title: '核查通过率', value: '88%', color: '#13ce66' },
    { title: '平均处置时长', value: '2.5小时', color: '#4ECDC4' },
    { title: '异常处置及时率', value: '92%', color: '#13ce66' },
    { title: '窨井盖安全达标率', value: '95%', color: '#13ce66' },
    { title: '各区域归档数', value: '5', color: '#909399' },
  ],
});

// 第一个饼图的数据
const firstChartData = [
  {
    title: '核查结果占比',
    data: [
      { name: '通过', value: 22 },
      { name: '不通过', value: 3 },
    ],
    colors: ['#13ce66', '#F56C6C']
  },
  {
    title: '异常类型归档占比',
    data: [
      { name: '倾斜角度异常', value: 10 },
      { name: '振动异常', value: 8 },
      { name: '设备离线', value: 7 },
    ],
    colors: ['#F56C6C', '#E6A23C', '#4ECDC4']
  }
];

// 第二个饼图的数据
const secondChartData = [
  {
    title: '路段归档分布占比',
    data: [
      { name: '福州市', value: 10 },
      { name: '厦门市', value: 5 },
      { name: '泉州市', value: 3 },
      { name: '漳州市', value: 4 },
      { name: '莆田市', value: 3 },
    ],
    colors: ['#4ECDC4', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  },
  {
    title: '风险消除状态占比',
    data: [
      { name: '已消除', value: 20 },
      { name: '部分消除', value: 3 },
      { name: '未消除', value: 2 },
    ],
    colors: ['#67C23A', '#E6A23C', '#F56C6C']
  }
];

// 所有折线图和柱状图的数据
const allChartsData = [
  // 柱状图
  {
    type: 'columnar',
    title: '不同路段归档工单数对比',
    xData: ['福州', '厦门', '泉州', '漳州', '莆田'],
    seriesData: [{ name: '工单数', data: [10, 5, 3, 4, 3] }],
    height: '330px'
  },
  {
    type: 'columnar',
    title: '不同运维员处置完成数对比',
    xData: ['张明', '李丽', '王强', '陈杰', '赵伟'],
    seriesData: [{ name: '完成数', data: [5, 5, 5, 5, 5] }],
    height: '330px'
  },
  {
    type: 'columnar',
    title: '各月份归档趋势',
    xData: ['1月', '2月', '3月', '4月', '5月', '6月'],
    seriesData: [{ name: '归档数', data: [2, 3, 4, 5, 6, 5] }],
    height: '330px'
  },
  // 折线图
  {
    type: 'line',
    title: '近30天平均处置时长变化趋势',
    xData: ['5/16', '5/20', '5/24', '5/28', '6/1', '6/5', '6/9', '6/13'],
    seriesData: [
      { name: '平均时长(小时)', data: [3.2, 3.0, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3], color: '#4a90e2' }
    ],
    yName: '小时',
    height: '330px'
  },
  {
    type: 'line',
    title: '异常处置及时率趋势',
    xData: ['5/16', '5/20', '5/24', '5/28', '6/1', '6/5', '6/9', '6/13'],
    seriesData: [
      { name: '及时率', data: [85, 87, 88, 90, 91, 92, 93, 94], color: '#06D6A0' }
    ],
    yName: '%',
    height: '330px'
  },
  {
    type: 'line',
    title: '窨井盖安全达标率趋势',
    xData: ['5/16', '5/20', '5/24', '5/28', '6/1', '6/5', '6/9', '6/13'],
    seriesData: [
      { name: '达标率', data: [90, 91, 92, 93, 94, 95, 96, 97], color: '#FFD166' }
    ],
    yName: '%',
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
