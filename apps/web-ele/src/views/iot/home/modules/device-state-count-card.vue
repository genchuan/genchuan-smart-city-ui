<template>
  <el-card class="device-state-card h-full" :loading="loading" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>设备状态统计</span>
      </div>
    </template>

    <div v-if="loading && !hasData" class="chart-placeholder">
      <el-empty description="加载中..." :image-size="80" />
    </div>
    <div v-else-if="!hasData" class="chart-placeholder">
      <el-empty description="暂无数据" :image-size="80" />
    </div>
    <el-row v-else class="chart-row" :gutter="16">
      <el-col :span="8" class="chart-col">
        <EchartsUI ref="deviceOnlineChartRef" class="echarts-gauge" />
      </el-col>
      <el-col :span="8" class="chart-col">
        <EchartsUI ref="deviceOfflineChartRef" class="echarts-gauge" />
      </el-col>
      <el-col :span="8" class="chart-col">
        <EchartsUI ref="deviceInactiveChartRef" class="echarts-gauge" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import type { IotStatisticsApi } from '#/api/iot/statistics';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { ElCard, ElEmpty, ElRow, ElCol } from 'element-plus';
import { getDeviceStateGaugeChartOptions } from '../chart-options';

defineOptions({ name: 'DeviceStateCountCard' });

const props = defineProps<{
  loading?: boolean;
  statsData: IotStatisticsApi.StatisticsSummaryRespVO;
}>();

const deviceOnlineChartRef = ref();
const deviceOfflineChartRef = ref();
const deviceInactiveChartRef = ref();

const { renderEcharts: renderOnlineChart } = useEcharts(deviceOnlineChartRef);
const { renderEcharts: renderOfflineChart } = useEcharts(deviceOfflineChartRef);
const { renderEcharts: renderInactiveChart } = useEcharts(
  deviceInactiveChartRef,
);

/** 是否有数据 */
const hasData = computed(() => {
  if (!props.statsData) return false;
  return props.statsData.deviceCount !== 0;
});

/** 初始化图表 */
async function initCharts() {
  if (!hasData.value) {
    return;
  }

  await nextTick();
  const max = props.statsData.deviceCount || 100;
  // 在线设备
  await renderOnlineChart(
    getDeviceStateGaugeChartOptions(
      props.statsData.deviceOnlineCount,
      max,
      '#52c41a',
      '在线设备',
    ),
  );
  // 离线设备
  await renderOfflineChart(
    getDeviceStateGaugeChartOptions(
      props.statsData.deviceOfflineCount,
      max,
      '#ff4d4f',
      '离线设备',
    ),
  );
  // 待激活设备
  await renderInactiveChart(
    getDeviceStateGaugeChartOptions(
      props.statsData.deviceInactiveCount,
      max,
      '#1890ff',
      '待激活设备',
    ),
  );
}

/** 监听数据变化 */
watch(
  () => props.statsData,
  () => {
    initCharts();
  },
  { deep: true },
);

/** 组件挂载时初始化图表 */
onMounted(() => {
  initCharts();
});
</script>

<style scoped>
.device-state-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.chart-row {
  height: 280px;
  margin: 0 -8px;
}

.chart-col {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.echarts-gauge {
  height: 250px;
  width: 100%;
}

/* 确保卡片内容区域样式正确 */
:deep(.el-card__body) {
  padding: 20px;
  height: auto;
}

/* 当有图表时，确保内容区域高度正确 */
:deep(.el-card__body:has(.chart-row)) {
  padding: 20px;
  height: auto;
  min-height: 300px;
}
</style>
