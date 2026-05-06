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

const hasCards = computed(() => props.cards.length > 0);
const isTwoCardLayout = computed(() => props.cards.length === 2);
const hasPie = computed(
  () => props.chartConfig.pie && props.pieData.length > 0,
);
const hasBar = computed(
  () => props.chartConfig.bar && props.barXData.length > 0,
);
const hasLine = computed(
  () => props.chartConfig.line && props.lineXData.length > 0,
);

const chartCount = computed(() => {
  let count = 0;
  if (hasPie.value) count++;
  if (hasBar.value) count++;
  if (hasLine.value) count++;
  return count;
});

const chartFlex = computed(() => {
  if (chartCount.value === 0) return '0';
  if (chartCount.value === 1) return '3.5 !important'; // 鍗曚釜鍥捐〃鍗犳弧鍓╀綑绌洪棿
  if (chartCount.value === 2) return '1.75 !important'; // 涓や釜鍥捐〃骞冲垎
  return '1.17 !important'; // 涓変釜鍥捐〃骞冲垎
});
</script>

<template>
  <div class="park-chart-box">
    <!-- 鍗＄墖鍖猴細鍥哄畾flex: 1 -->
    <div
      v-if="hasCards"
      class="chart-box-left"
      :class="[{ 'is-two-card-layout': isTwoCardLayout }]"
      style="flex: 1 !important"
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

    <!-- 楗煎浘锛氬姩鎬乫lex -->
    <div v-if="hasPie" class="chart-wrapper" :style="{ flex: chartFlex }">
      <PieClick
        class="chart-panel-inner"
        :data="props.pieData"
        :title-text="`${props.title}缁熻`"
        @pie-click="emit('pieClick', $event)"
      />
    </div>

    <!-- 鏌辩姸鍥撅細鍔ㄦ€乫lex -->
    <div v-if="hasBar" class="chart-wrapper" :style="{ flex: chartFlex }">
      <BarClick
        class="chart-panel-inner"
        :title="`${props.title}鍒嗗竷`"
        :x-data="props.barXData"
        :series-data="props.barSeriesData"
        y-name="鏁伴噺"
        @bar-click="emit('barClick', $event)"
      />
    </div>

    <!-- 鎶樼嚎鍥撅細鍔ㄦ€乫lex -->
    <div v-if="hasLine" class="chart-wrapper" :style="{ flex: chartFlex }">
      <LineChartClick
        class="chart-panel-inner"
        :title="`${props.title}瓒嬪娍`"
        :x-data="props.lineXData"
        :series-data="props.lineSeriesData"
        y-name="鏁伴噺"
        @line-click="emit('lineClick', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;

  .chart-box-left {
    display: grid !important;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: none;

    &.is-two-card-layout {
      grid-template-rows: repeat(2, minmax(0, 1fr));
      grid-template-columns: 1fr;
      width: 100%;
      max-width: none;
    }

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
