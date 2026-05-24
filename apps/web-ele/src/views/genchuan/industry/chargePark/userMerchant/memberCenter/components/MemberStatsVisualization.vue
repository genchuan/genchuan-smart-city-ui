<script setup lang="ts">
import { computed } from 'vue';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

const props = defineProps<{
  data?: {
    cards?: any[];
    charts?: any[];
  };
}>();

const emit = defineEmits<{
  barClick: [payload: any];
  cardClick: [payload: any];
  chartClick: [payload: any];
  lineClick: [payload: any];
  pieClick: [payload: any];
}>();

const chartCount = computed(() => props.data?.charts?.length ?? 0);
</script>

<template>
  <div
    class="member-stats-visualization"
    :class="{
      'member-stats-single-chart': chartCount === 1,
      'member-stats-multi-chart': chartCount > 1,
    }"
  >
    <StatsVisualization
      :data="data"
      @bar-click="(payload) => emit('barClick', payload)"
      @card-click="(payload) => emit('cardClick', payload)"
      @chart-click="(payload) => emit('chartClick', payload)"
      @line-click="(payload) => emit('lineClick', payload)"
      @pie-click="(payload) => emit('pieClick', payload)"
    />
  </div>
</template>

<style scoped lang="scss">
.member-stats-visualization :deep(.park-chart-box) {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  align-items: stretch;
  height: 300px;
}

.member-stats-visualization :deep(.park-chart-box .chart-box-left) {
  flex: 0 0 280px;
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  height: 100%;
}

.member-stats-visualization :deep(.park-chart-box .stat-card) {
  flex: 1 1 0;
  min-height: 0;
}

.member-stats-visualization :deep(.park-chart-box .charts-wrapper) {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
}

.member-stats-visualization :deep(.park-chart-box .map-wrapper),
.member-stats-visualization :deep(.park-chart-box .park-type-chart),
.member-stats-visualization :deep(.park-chart-box .simple-bar-chart) {
  height: 100%;
}

.member-stats-single-chart :deep(.park-chart-box .charts-wrapper) {
  flex: 1 1 auto;
  width: 100%;
}

.member-stats-single-chart :deep(.park-chart-box .park-type-chart),
.member-stats-single-chart :deep(.park-chart-box .simple-bar-chart) {
  flex: 1 1 auto !important;
  width: 100%;
  min-width: 0 !important;
  max-width: none !important;
  margin-left: 0 !important;
}

.member-stats-multi-chart :deep(.park-chart-box .charts-wrapper) {
  gap: 20px;
}
</style>
