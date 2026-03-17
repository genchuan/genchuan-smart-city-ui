<script setup>
import { computed, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  // 通过 ref 暴露 open 方法接收数据
});

const detailData = ref({});

const drawerTitle = computed(() => {
  return `问题详情 - ${detailData.value.problemId || ''}`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
});

// 暴露打开方法
defineExpose({
  open(data) {
    detailData.value = data || {};
    detailDrawerApi.open();
  },
  close() {
    detailDrawerApi.close();
  },
});

// 辅助函数：格式化数组/对象
const formatValue = (val) => {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'object') return JSON.stringify(val);
  return val;
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">📋 基本信息</div>
      <div class="detail-row"><span class="label">问题编号：</span>{{ detailData.problemId || '-' }}</div>
      <div class="detail-row"><span class="label">关联计划：</span>{{ detailData.planId || '-' }}</div>
      <div class="detail-row"><span class="label">问题类型：</span>{{ detailData.problemTypeName || '-' }}</div>
      <div class="detail-row"><span class="label">问题位置：</span>{{ detailData.location || '-' }}</div>
      <div class="detail-row"><span class="label">上报人员：</span>{{ detailData.reportName || '-' }}</div>
      <div class="detail-row"><span class="label">上报时间：</span>{{ detailData.reportTime || '-' }}</div>
      <div class="detail-row"><span class="label">问题描述：</span>{{ detailData.problemDesc || '-' }}</div>

      <div class="detail-section">⚙️ 处置信息</div>
      <div class="detail-row"><span class="label">处置组：</span>{{ detailData.teamName || '-' }}</div>
      <div class="detail-row"><span class="label">处置状态：</span>{{ detailData.handleStatus || '-' }}</div>
      <div class="detail-row"><span class="label">超时提醒：</span>{{ detailData.isTimeout === '是' ? '超时' : '正常' }}</div>
      <div class="detail-row"><span class="label">处置结果：</span>{{ detailData.handleResult || '-' }}</div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailData.createTime || '-' }}</div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailData.updateTime || '-' }}</div>
      <div class="detail-row"><span class="label">创建人：</span>{{ detailData.creator || '-' }}</div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  .label {
    width: 130px;
    flex-shrink: 0;
    font-weight: 500;
  }
}
</style>
