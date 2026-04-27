<script setup>
import { computed } from 'vue';

import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';
import PieClick from '#/genchuan-components/stats/pieClick.vue';

const props = defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
  chartConfig: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
  pieData: {
    type: Array,
    default: () => [],
  },
  barXData: {
    type: Array,
    default: () => [],
  },
  barSeriesData: {
    type: Array,
    default: () => [],
  },
  lineXData: {
    type: Array,
    default: () => [],
  },
  lineSeriesData: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'cardClick',
  'barClick',
  'lineClick',
  'pieClick',
]);

// 动态计算是否显示各个图表
const hasCards = computed(() => props.cards && props.cards.length > 0);
const hasPie = computed(() => props.chartConfig.pie);
const hasBar = computed(() => props.chartConfig.bar);
const hasLine = computed(() => props.chartConfig.line);

// 计算图表数量
const chartCount = computed(() => {
  let count = 0;
  if (hasPie.value) count++;
  if (hasBar.value) count++;
  if (hasLine.value) count++;
  return count;
});

// 动态计算每个图表的flex值
const chartFlex = computed(() => {
  if (chartCount.value === 0) return 0;
  return 3.5 / chartCount.value;
});
</script>

<template>
  <div class="park-chart-box">
    <div v-if="hasCards" class="chart-box-left">
      <IndicatorClick
        v-for="item in props.cards"
        :key="item.key"
        :title="item.title"
        :value="item.value"
        :color="item.color"
        :status="item.status"
        @click="emit('cardClick', item)"
      />
    </div>
    <div v-if="hasPie" class="chart-wrapper" :style="{ flex: chartFlex }">
      <PieClick
        class="chart-panel-inner"
        :data="props.pieData"
        :title-text="`${props.title}统计`"
        @pie-click="emit('pieClick', $event)"
      />
    </div>
    <div v-if="hasBar" class="chart-wrapper" :style="{ flex: chartFlex }">
      <BarClick
        class="chart-panel-inner"
        :title="`${props.title}分布`"
        :x-data="props.barXData"
        :series-data="props.barSeriesData"
        y-name="数量"
        @bar-click="emit('barClick', $event)"
      />
    </div>
    <div v-if="hasLine" class="chart-wrapper" :style="{ flex: chartFlex }">
      <LineChartClick
        class="chart-panel-inner"
        :title="`${props.title}趋势`"
        :x-data="props.lineXData"
        :series-data="props.lineSeriesData"
        y-name="数量"
        @line-click="emit('lineClick', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  gap: 12px;
  width: 100%;

  .chart-box-left {
    display: grid;
    flex: 1;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    :deep(.stat-card) {
      height: 100% !important;
      min-height: 150px;
    }
  }

  .chart-wrapper {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    height: 340px;
    min-height: 340px;
  }

  :deep(.chart-panel-inner) {
    flex: 1 1 auto;
    width: 100%;
    height: 340px !important;
    min-height: 340px !important;
  }
}
</style>
