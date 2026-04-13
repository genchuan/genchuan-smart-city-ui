<script setup>
import { reactive, ref } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import LineChart from '#/genchuan-components/stats/lineChart.vue';

// 卡片数据（四个核心指标）
const state = reactive({
  cardList: [
    { title: '所选核心指标汇总值', value: '92.5%', color: '#4A90E2' },
    { title: '数据记录数', value: 1560, color: '#50E3C2' },
    { title: '达标指标数', value: 8, color: '#FF9F40' },
    { title: '异常指标数', value: 2, color: '#FF6B8B' },
  ],
});

// 圆环图选项：标题与数据
const pieOptions = [
  {
    title: '所选指标数据分布占比',
    data: [
      { name: '保洁达标率', value: 94 },
      { name: '问题处置率', value: 88 },
      { name: '收运完成率', value: 96 },
      { name: '设施完好率', value: 92 },
      { name: '绿化存活率', value: 90 },
    ],
  },
  {
    title: '业务模块数据占比',
    data: [
      { name: '公厕管理', value: 35 },
      { name: '转运站管理', value: 28 },
      { name: '公园管理', value: 22 },
      { name: '商业街管理', value: 15 },
    ],
  },
];

// 当前选中的圆环图索引和数据
const activePieIndex = ref(0);
const currentPieData = ref(pieOptions[0]);

// 切换圆环图
const handlePieChange = (index) => {
  activePieIndex.value = index;
  currentPieData.value = pieOptions[index];
};

// 图表切换数据（两个柱状图 + 一个折线图）
const chartOptions = [
  {
    type: 'bar',
    title: '不同区域所选指标数据对比',
    xData: ['龙文区', '龙海区', '芗城区', '长泰区', '漳浦县'],
    seriesData: [{ name: '保洁达标率(%)', data: [96, 92, 94, 90, 88] }],
  },
  {
    type: 'bar',
    title: '各业务模块所选指标数据对比',
    xData: ['公厕管理', '转运站管理', '公园管理', '商业街管理'],
    seriesData: [{ name: '综合得分', data: [92, 88, 94, 86] }],
  },
  {
    type: 'line',
    title: '所选指标在统计时间范围内的变化趋势',
    xData: ['1月', '2月', '3月', '4月', '5月', '6月'],
    seriesData: [{ name: '达标率', data: [85, 88, 90, 92, 94, 95] }],
    yName: '%',
    smooth: true,
  },
];

const activeChartIndex = ref(0);
const currentChart = ref(chartOptions[0]);

// 切换图表
const handleChartChange = (index) => {
  activeChartIndex.value = index;
  currentChart.value = chartOptions[index];
};
</script>

<template>
  <div class="chart-box">
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        v-for="(card, index) in state.cardList"
        :key="index"
        class="left-card"
        :title="card.title"
        :value="card.value"
        :color="card.color"
      />
    </div>

    <div class="pie-chart-area">
      <!-- 圆环图下拉切换器 -->
      <div class="pie-select-wrapper">
        <el-select
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <!-- 动态圆环图 -->
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieData.title"
        :data="currentPieData.data"
      />
    </div>

    <div class="bar-line-chart-area">
      <!-- 下拉切换器 -->
      <div class="chart-select-wrapper">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
        >
          <el-option
            v-for="(opt, idx) in chartOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>

      <!-- 根据当前图表类型渲染对应组件 -->
      <Bar
        style="flex: 1 !important;"
        v-if="currentChart.type === 'bar'"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
      />
      <LineChart
        style="flex: 1 !important;"
        v-else
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
        :smooth="currentChart.smooth"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}

/* 圆环图区域样式 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  height: 100%;
  margin-top: 10px;
}

.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

.bar-line-chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px;
  height: 100%;
  margin-top: 10px;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
