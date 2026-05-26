<template>
  <el-card class="message-trend-card h-full" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">消息量统计</span>
        <div class="card-header-actions">
          <div class="filter-item">
            <span class="filter-label">时间范围</span>
            <ShortcutDateRangePicker @change="handleDateRangeChange" />
          </div>
          <div class="filter-item">
            <span class="filter-label">时间间隔</span>
            <el-select
              v-model="queryParams.interval"
              :options="intervalOptions"
              placeholder="间隔类型"
              :style="{ width: '80px' }"
              @change="handleIntervalChange"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- 加载中状态 -->
    <div v-if="loading && !hasData" class="chart-placeholder">
      <el-empty description="加载中..." :image-size="80" />
    </div>
    <!-- 无数据状态 -->
    <div v-else-if="!loading && !hasData" class="chart-placeholder">
      <el-empty description="暂无数据" :image-size="80" />
    </div>
    <!-- 图表容器 -->
    <div v-else class="chart-container">
      <EchartsUI ref="messageChartRef" class="echarts-wrapper" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs';
import type { IotStatisticsApi } from '#/api/iot/statistics';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { ElCard, ElEmpty, ElSelect } from 'element-plus';
import dayjs from 'dayjs';
import { getDeviceMessageSummaryByDate } from '#/api/iot/statistics';
import ShortcutDateRangePicker from '#/components/shortcut-date-range-picker/shortcut-date-range-picker.vue';
import { getMessageTrendChartOptions } from '../chart-options';

defineOptions({ name: 'MessageTrendCard' });

const messageChartRef = ref();
const { renderEcharts } = useEcharts(messageChartRef);

const loading = ref(false);
const messageData = ref<IotStatisticsApi.DeviceMessageSummaryByDateRespVO[]>(
  [],
);

/** 时间范围（仅日期，不包含时分秒） */
const dateRange = ref<[string, string]>([
  dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD'),
]);

/** 将日期范围转换为带时分秒的格式 */
function formatDateRangeWithTime(dates: [string, string]): [string, string] {
  return [`${dates[0]} 00:00:00`, `${dates[1]} 23:59:59`];
}

/** 查询参数 */
const queryParams = reactive<IotStatisticsApi.DeviceMessageReqVO>({
  interval: 1,
  times: formatDateRangeWithTime(dateRange.value),
});

/** 是否有数据 */
const hasData = computed(() => {
  return messageData.value && messageData.value.length > 0;
});

/** 时间间隔字典选项 */
const intervalOptions = computed(() =>
  getDictOptions(DICT_TYPE.DATE_INTERVAL, 'number').map((item) => ({
    label: item.label,
    value: item.value as number,
  })),
);

/** 处理查询操作 */
function handleQuery() {
  fetchMessageData();
}

/** 处理时间范围变化 */
function handleDateRangeChange(times?: [Dayjs, Dayjs]) {
  if (!times || times.length !== 2) {
    return;
  }
  dateRange.value = [
    dayjs(times[0]).format('YYYY-MM-DD'),
    dayjs(times[1]).format('YYYY-MM-DD'),
  ];
  queryParams.times = formatDateRangeWithTime(dateRange.value);
  handleQuery();
}

/** 处理时间间隔变化 */
function handleIntervalChange() {
  handleQuery();
}

/** 获取消息统计数据 */
async function fetchMessageData() {
  if (!queryParams.times || queryParams.times.length !== 2) {
    return;
  }

  loading.value = true;
  try {
    messageData.value = await getDeviceMessageSummaryByDate(queryParams);
  } finally {
    loading.value = false;
    await renderChartWhenReady();
  }
}

/** 初始化图表 */
function initChart() {
  if (!hasData.value) {
    return;
  }

  const times = messageData.value.map((item) => item.time);
  const upstreamData = messageData.value.map((item) => item.upstreamCount);
  const downstreamData = messageData.value.map((item) => item.downstreamCount);
  renderEcharts(
    getMessageTrendChartOptions(times, upstreamData, downstreamData),
  );
}

/** 确保图表容器已经可见后再渲染 */
async function renderChartWhenReady() {
  if (!hasData.value) {
    return;
  }
  await nextTick();
  await nextTick();
  initChart();
}

/** 组件挂载时查询数据 */
onMounted(() => {
  fetchMessageData();
});
</script>

<style scoped>
.message-trend-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 100%;
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #4b5563;
}

.card-header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.chart-container {
  width: 100%;
  height: auto;
}

.echarts-wrapper {
  height: 300px;
  width: 100%;
}

/* 确保卡片内容区域样式正确 */
:deep(.el-card__body) {
  padding: 20px;
}
</style>
