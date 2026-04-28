<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';

import {
  detailMetricFields,
  formatRate,
  getReportStatusTagType,
  getReportTypeTagType,
} from '../table/data';

const emit = defineEmits(['export']);
const detailData = shallowRef({});
const drawerTitle = computed(
  () => `${detailData.value.reportType || '运维运营报表'}详情`,
);
const isYearReport = computed(
  () =>
    detailData.value.reportType === '年报' ||
    detailData.value.timeScale === '年报',
);
const [DrawerComponent, drawerApi] = useVbenDrawer({
  width: '58%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: drawerTitle,
  showCancelButton: false,
  showConfirmButton: false,
});
function displayMetric(field) {
  const value = detailData.value[field.key];
  if (field.type === 'rate') return formatRate(value);
  return value ?? '-';
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
function escapeHtml(value) {
  return String(value ?? '-')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function handlePrint() {
  if (!isYearReport.value) {
    ElMessage.warning('仅年报支持打印');
    return;
  }
  const loading = ElLoading.service({ text: '正在准备打印内容...' });
  try {
    const metricRows = detailMetricFields
      .map(
        (field) =>
          `<tr><th>${escapeHtml(field.label)}</th><td>${escapeHtml(
            displayMetric(field),
          )}</td></tr>`,
      )
      .join('');
    const printContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(
      drawerTitle.value,
    )}</title><style>body{font-family:Microsoft YaHei,Arial,sans-serif;padding:24px;color:#222}h1{text-align:center}.section{margin:20px 0}.section-title{font-size:18px;font-weight:700;border-left:4px solid #2f80ed;padding-left:10px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f7fa;width:180px}</style></head><body><h1>${escapeHtml(
      drawerTitle.value,
    )}</h1><div class="section"><div class="section-title">基础信息</div><table><tr><th>报表ID</th><td>${escapeHtml(
      detailData.value.id,
    )}</td><th>报表类型</th><td>${escapeHtml(
      detailData.value.reportType,
    )}</td></tr><tr><th>统计周期</th><td>${escapeHtml(
      detailData.value.reportTimeStr,
    )}</td><th>生成时间</th><td>${escapeHtml(
      detailData.value.createTimeStr,
    )}</td></tr></table></div><div class="section"><div class="section-title">核心指标</div><table>${
      metricRows
    }</table></div><div class="section"><div class="section-title">同比环比分析</div><p>${escapeHtml(
      detailData.value.analysisSummary,
    )}</p></div></body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(printContent);
    win.document.close();
    win.focus();
    win.print();
  } catch (error) {
    console.error('打印失败，请稍后重试', error);
    ElMessage.error('打印失败，请稍后重试');
  } finally {
    loading.close();
  }
}
defineExpose({ open, close, handlePrint });
</script>

<template>
  <DrawerComponent>
    <div class="report-detail-drawer">
      <div class="drawer-actions">
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button v-if="isYearReport" type="success" @click="handlePrint">
          打印
        </el-button>
        <el-button @click="close">关闭</el-button>
      </div>
      <section class="detail-section">
        <div class="section-title">基础信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span>报表ID</span>
            <strong>{{ detailData.id || '-' }}</strong>
          </div>
          <div class="info-item">
            <span>报表类型</span>
            <el-tag :type="getReportTypeTagType(detailData.reportType)">
              {{ detailData.reportType || '-' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span>时间尺度</span>
            <strong>{{ detailData.timeScale || '-' }}</strong>
          </div>
          <div class="info-item">
            <span>统计周期</span>
            <strong>{{ detailData.reportTimeStr || '-' }}</strong>
          </div>
          <div class="info-item">
            <span>生成时间</span>
            <strong>{{ detailData.createTimeStr || '-' }}</strong>
          </div>
          <div class="info-item">
            <span>报表状态</span>
            <el-tag :type="getReportStatusTagType(detailData.reportStatus)">
              {{ detailData.reportStatus || '-' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span>创建者</span>
            <strong>{{ detailData.creator || '-' }}</strong>
          </div>
        </div>
      </section>
      <section class="detail-section">
        <div class="section-title">核心指标</div>
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
      <section class="detail-section">
        <div class="section-title">同比环比分析</div>
        <p class="analysis-text">{{ detailData.analysisSummary || '-' }}</p>
      </section>
      <section class="detail-section">
        <div class="section-title">全字段明细数据</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务类型">
            {{ detailData.taskType || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="任务数">
            {{ detailData.taskCount || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="上报数">
            {{ detailData.reportCount || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="告警数">
            {{ detailData.alarmCount || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="巡检里程">
            {{ detailData.inspectMileage || 0 }} km
          </el-descriptions-item>
        </el-descriptions>
      </section>
    </div>
  </DrawerComponent>
</template>

<style scoped>
.report-detail-drawer {
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
.analysis-text {
  margin: 0;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}
</style>
