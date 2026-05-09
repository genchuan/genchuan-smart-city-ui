<script setup>
import { ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { ElMessage, ElLoading } from 'element-plus';

const currentRow = ref({});

const detailData = ref({
  className: '',
  totalMoralScore: 0,
  goodDeedScore: 0,
  civilizedBehaviorScore: 0,
  assessRank: 0,
  civilizedClassTitle: '',
});

// 获取德育明细（模拟数据，预留真实接口）
const fetchDetail = async (row) => {
  // TODO: 替换为真实API
  // return requestClient.get('/studentmgmt/moral-report/class-detail', { params: { id: row.id } });
  console.log('请求班级德育明细:', row);
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    className: row.className,
    totalMoralScore: row.totalMoralScore || 0,
    goodDeedScore: row.goodDeedScore || 0,
    civilizedBehaviorScore: row.civilizedBehaviorScore || 0,
    assessRank: row.assessRank || 0,
    civilizedClassTitle: row.civilizedClassTitle || '',
  };
};

const [Modal, modal] = useVbenModal({
  title: '班级德育明细',
  width: 600,
  onCancel: () => modal.close(),
  onConfirm: () => modal.close(),
});

const open = async (row) => {
  if (!row) {
    console.warn('open 方法未接收到 row 参数');
    return;
  }
  currentRow.value = row;
  const loadingInstance = ElLoading.service({ text: '加载中...' });
  try {
    const data = await fetchDetail(row);
    detailData.value = data;
    modal.open();
  } catch (error) {
    console.error('加载班级德育明细失败:', error);
    ElMessage.error('加载失败');
  } finally {
    loadingInstance.close();
  }
};

defineExpose({ open });
</script>

<template>
  <Modal>
    <div class="moral-detail">
      <div class="detail-item">
        <span class="label">班级：</span>
        <span class="value">{{ detailData.className }}</span>
      </div>
      <div class="detail-item">
        <span class="label">德育总分：</span>
        <span class="value">{{ detailData.totalMoralScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">好人好事得分：</span>
        <span class="value">{{ detailData.goodDeedScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">文明行为得分：</span>
        <span class="value">{{ detailData.civilizedBehaviorScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">评比排名：</span>
        <span class="value">{{ detailData.assessRank }}</span>
      </div>
      <div class="detail-item">
        <span class="label">文明班级称号：</span>
        <span class="value">{{ detailData.civilizedClassTitle || '-' }}</span>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.moral-detail {
  padding: 20px;
}
.detail-item {
  margin-bottom: 16px;
  font-size: 14px;
}
.label {
  display: inline-block;
  width: 110px;
  color: #606266;
}
.value {
  color: #303133;
  font-weight: 500;
}
</style>
