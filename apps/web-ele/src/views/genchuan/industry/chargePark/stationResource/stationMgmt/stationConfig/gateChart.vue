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

const emit = defineEmits(['cardClick', 'barClick', 'lineClick', 'pieClick']);

const hasCards = computed(() => props.cards?.length > 0);
const isMarketCardLayout = computed(() => props.cards.length > 4);
const hasPie = computed(() => props.chartConfig.pie);
const hasBar = computed(() => props.chartConfig.bar);
const hasLine = computed(() => props.chartConfig.line);

const chartCount = computed(() => {
  let count = 0;
  if (hasPie.value) count++;
  if (hasBar.value) count++;
  if (hasLine.value) count++;
  return count;
});

const chartFlex = computed(() => {
  if (chartCount.value === 0) return 0;
  return 3.5 / chartCount.value;
});

const compactCardStyle = computed(() => {
  if (isMarketCardLayout.value) return {};
  return {
    gridTemplateRows: `repeat(${Math.max(props.cards.length, 1)}, minmax(0, 1fr))`,
  };
});
</script>

<template>
  <div
    class="park-chart-box"
    :class="{ 'has-market-card-layout': isMarketCardLayout }"
  >
    <div
      v-if="hasCards"
      class="chart-box-left"
      :class="{
        'is-compact-card-layout': !isMarketCardLayout,
        'is-market-card-layout': isMarketCardLayout,
      }"
      :style="compactCardStyle"
    >
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
        :title-text="`${props.title}占比`"
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
  align-items: stretch;
  width: 100%;

  .chart-box-left {
    min-width: 280px;
  }

  .is-compact-card-layout {
    display: grid;
    flex: 1;
    grid-template-columns: 1fr;
    gap: 12px;
    height: 340px;

    :deep(.stat-card) {
      height: 100% !important;
      min-height: 0 !important;
      padding: 8px 12px;
    }

    :deep(.card-header) {
      margin-bottom: 4px;
    }

    :deep(.card-title) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :deep(.card-value) {
      font-size: 24px;
      line-height: 1.15;
    }
  }

  .is-market-card-layout {
    box-sizing: border-box;
    display: flex;
    flex: 0 0 480px;
    flex-flow: row wrap;
    gap: 4px;
    align-content: stretch;
    width: 480px;
    min-width: 480px;
    max-width: 480px;
    height: 280px;
    padding: 4px;
    overflow: hidden;

    :deep(.stat-card) {
      box-sizing: border-box;
      display: flex;
      flex: 1 1 calc(33.333% - 3px);
      flex-direction: column;
      justify-content: center;
      min-height: 0 !important;
      padding: 4px 8px;
      border-radius: 4px;
    }

    :deep(.card-header) {
      margin-bottom: 4px;
    }

    :deep(.card-title) {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 16px;
      white-space: nowrap;
    }

    :deep(.card-indicator) {
      flex: 0 0 6px;
      width: 6px;
      height: 6px;
    }

    :deep(.card-value) {
      margin-bottom: 2px;
      font-size: 20px;
      line-height: 1.1;
    }

    :deep(.card-desc) {
      font-size: 11px;
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

  &.has-market-card-layout {
    min-height: 280px;
    overflow: hidden;

    .chart-wrapper {
      height: 280px;
      min-height: 280px;
    }

    :deep(.chart-panel-inner) {
      height: 280px !important;
      min-height: 280px !important;
    }
  }
}
</style>
