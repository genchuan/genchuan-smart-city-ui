<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  detailMetricFields,
  formatRate,
  getGenerateStatusTagType,
  getReportCycleTagType,
} from '../table/data';

const emit = defineEmits(['export']);

const detailData = shallowRef({});

const drawerTitle = computed(
  () => `${detailData.value.reportCycle || '周期报表'}详情`,
);

const [DrawerComponent, drawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: false,
  mask: false,
  modal: false,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  position: 'right',
  title: drawerTitle,
  showCancelButton: false,
  showConfirmButton: false,
  /** 详情无内嵌表格，宽度略小于 75vw；与营销报表抽屉一致无遮罩、不超出视区 */
  class: 'cycle-report-detail-drawer-panel w-[min(62vw,960px)]',
});

function displayMetric(field) {
  const value = detailData.value[field.key];
  if (field.type === 'rate') {
    return formatRate(value);
  }
  return value ?? 0;
}

function open(data) {
  detailData.value = data || {};
  drawerApi.open();
}

function close() {
  drawerApi.close();
}

function handleExport() {
  emit('export', detailData.value);
}

defineExpose({ close, open });
</script>

<template>
  <DrawerComponent>
    <div class="cycle-report-detail-drawer drawer-body-bounded">
      <!-- <div class="drawer-actions">
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button @click="close">关闭</el-button>
      </div> -->

      <section class="detail-section">
        <div class="section-title">基础信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span>报表ID</span>
            <strong>{{ detailData.id || '-' }}</strong>
          </div>
          <div class="info-item">
            <span>报表周期</span>
            <el-tag :type="getReportCycleTagType(detailData.reportCycle)">
              {{ detailData.reportCycle || '-' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span>报表类型</span>
            <strong>{{ detailData.reportType || '-' }}</strong>
          </div>
          <El-Tooltip :content="detailData.stationName">
            <div class="info-item">
            <span>所属场站</span>
            <strong>{{ detailData.stationName || '-' }}</strong>
          </div>
          </El-Tooltip>
          <El-Tooltip :content="detailData.statTime">
            <div class="info-item">
            <span>统计时段</span>
            <strong>{{ detailData.statTime || '-' }}</strong>
          </div>
          </El-Tooltip>
          <div class="info-item">
            <span>生成状态</span>
            <el-tag :type="getGenerateStatusTagType(detailData.generateStatus)">
              {{ detailData.generateStatus || '-' }}
            </el-tag>
          </div>
          <El-Tooltip :content="detailData.generateTimeStr">
            <div class="info-item">
            <span>生成时间</span>
            <strong>{{ detailData.generateTimeStr || '-' }}</strong>
          </div>
          </El-Tooltip>
          <div class="info-item">
            <span>操作人</span>
            <strong>{{ detailData.operator || '-' }}</strong>
          </div>
          <div class="info-item">
            <span>导出次数</span>
            <strong>{{ detailData.exportCount ?? 0 }}</strong>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-title">统计指标</div>
        <div class="metric-grid">
          <div
            v-for="field in detailMetricFields"
            :key="field.key"
            class="metric-card"
          >
            <span>{{ field.label }}</span>
            <strong>{{ displayMetric(field) }}</strong>
          </div>
        </div>
      </section>

      <!-- <section class="detail-section">
        <div class="section-title">对比分析</div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="同比数据">
            {{ detailData.yearOnYearData || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="环比数据">
            {{ detailData.chainRatioData || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ detailData.createTimeStr || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ detailData.updateTimeStr || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </section> -->
    </div>
  </DrawerComponent>
</template>

<style scoped>
.drawer-body-bounded {
  box-sizing: border-box;
  max-height: calc(100vh - 56px - 24px);
  overflow-x: hidden;
  overflow-y: auto;
}

.cycle-report-detail-drawer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.detail-section {
  padding: 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
}

.section-title {
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.info-item span {
  flex: 0 0 96px;
  color: var(--el-text-color-secondary);
  text-align: right;
}

.info-item strong {
  min-width: 0;
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.metric-card span {
  color: var(--el-text-color-secondary);
}

.metric-card strong {
  font-size: 20px;
  color: var(--el-color-primary);
}
</style>
