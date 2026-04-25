<script setup>
import { ref } from 'vue';

import PassRecordChart from './passRecordChart.vue';
import PassRecordTable from './table/index.vue';

const chartVisible = ref(true);

const toggleChart = () => {
  chartVisible.value = !chartVisible.value;
};
</script>

<template>
  <div class="pass-record-container">
    <PassRecordChart v-if="chartVisible" @toggle="toggleChart" />
    <PassRecordTable :chart-visible="chartVisible" @toggle-chart="toggleChart" />
  </div>
</template>

<style scoped lang="scss">
.pass-record-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
