<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';

import { exportMarketOpReport } from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';

const emit = defineEmits(['success']);

const reportData = ref({});
const exportFormat = ref('excel');

const [Modal, modalApi] = useVbenModal({
  title: '导出报表',
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await handleExport();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      reportData.value = modalApi.getData() || {};
      exportFormat.value = 'excel';
    }
  },
});

/** 处理导出 */
const handleExport = async () => {
  const loadingInstance = ElLoading.service({
    text: '正在导出报表数据...',
  });

  try {
    // 调用导出API
    await exportMarketOpReport();
    ElMessage.success(`导出成功，格式：${exportFormat.value === 'excel' ? 'Excel' : 'PDF'}`);
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
};

/** 选择导出格式 */
const selectFormat = (format) => {
  exportFormat.value = format;
};
</script>

<template>
  <Modal>
    <div class="export-report-dialog">
      <div class="report-info">
        <h4>报表信息</h4>
        <p><strong>报表名称：</strong>{{ reportData.name || '-' }}</p>
        <p><strong>报表类型：</strong>{{ reportData.typeName || '-' }}</p>
        <p><strong>统计周期：</strong>{{ reportData.period || '-' }}</p>
        <p><strong>统计人：</strong>{{ reportData.statisticianName || '-' }}</p>
      </div>

      <div class="export-format">
        <h4>选择导出格式</h4>
        <div class="format-options">
          <div
            class="format-item"
            :class="{ active: exportFormat === 'excel' }"
            @click="selectFormat('excel')"
          >
            <div class="format-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 13H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 17H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="format-name">Excel</div>
            <div class="format-desc">导出为Excel格式，包含所有明细数据</div>
          </div>

          <div
            class="format-item"
            :class="{ active: exportFormat === 'pdf' }"
            @click="selectFormat('pdf')"
          >
            <div class="format-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 18V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 15L12 12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="format-name">PDF</div>
            <div class="format-desc">导出为PDF格式，适合打印和分享</div>
          </div>
        </div>
      </div>

      <div class="export-note">
        <p><strong>说明：</strong>导出文件将包含报表的所有明细数据和分析数据。</p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.export-report-dialog {
  padding: 16px;
}

.report-info {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.report-info h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.report-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.export-format {
  margin-bottom: 24px;
}

.export-format h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.format-options {
  display: flex;
  gap: 16px;
}

.format-item {
  flex: 1;
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.format-item:hover {
  border-color: #409eff;
}

.format-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.format-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  color: #606266;
}

.format-item.active .format-icon {
  color: #409eff;
}

.format-icon svg {
  width: 100%;
  height: 100%;
}

.format-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.format-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.export-note {
  padding: 12px 16px;
  background-color: #fdf6ec;
  border-left: 4px solid #e6a23c;
  border-radius: 4px;
}

.export-note p {
  margin: 0;
  font-size: 13px;
  color: #606266;
}
</style>
