<template>
  <el-card class="device-count-card h-full" :loading="loading" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>设备数量统计</span>
      </div>
    </template>

    <div v-if="loading && !hasData" class="chart-loading-placeholder">
      <el-empty description="加载中..." :image-size="80" />
    </div>
    <div v-else-if="!hasData" class="chart-empty-placeholder">
      <el-empty description="暂无数据" :image-size="80" />
    </div>
    <div v-else class="chart-container">
      <EchartsUI ref="deviceCountChartRef" class="echarts-wrapper" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { IotStatisticsApi } from '#/api/iot/statistics';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { ElCard, ElEmpty } from 'element-plus';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { getDeviceCountPieChartOptions } from '../chart-options';

defineOptions({ name: 'DeviceCountCard' });

const props = defineProps<{
  loading?: boolean;
  statsData: IotStatisticsApi.StatisticsSummaryRespVO;
}>();

const deviceCountChartRef = ref();
const { renderEcharts } = useEcharts(deviceCountChartRef);

/** 是否有数据 */
const hasData = computed(() => {
  if (!props.statsData) return false;
  const categories = Object.entries(
    props.statsData.productCategoryDeviceCounts || {},
  );
  return categories.length > 0 && props.statsData.deviceCount !== 0;
});

/** 初始化图表 */
async function initChart() {
  if (!hasData.value) {
    return;
  }

  await nextTick();
  const data = Object.entries(props.statsData.productCategoryDeviceCounts).map(
    ([name, value]) => ({ name, value }),
  );
  await renderEcharts(getDeviceCountPieChartOptions(data));
}

/** 监听数据变化 */
watch(
  () => props.statsData,
  () => {
    initChart();
  },
  { deep: true },
);

/** 组件挂载时初始化图表 */
onMounted(() => {
  initChart();
});
</script>

<style scoped>
.device-count-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 16px;
}

.chart-loading-placeholder,
.chart-empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.echarts-wrapper {
  height: 400px;
  width: 100%;
}

/* 确保卡片内容区域占满高度 */
:deep(.el-card__body) {
  padding: 0;
  height: auto;
  min-height: 300px;
}

/* 当有图表时，body需要正常显示内边距 */
:deep(.el-card__body:has(.chart-container)) {
  padding: 20px;
}
</style>
