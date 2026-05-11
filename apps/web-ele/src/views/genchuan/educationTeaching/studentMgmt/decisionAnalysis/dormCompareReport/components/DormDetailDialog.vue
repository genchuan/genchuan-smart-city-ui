<script setup>
import { ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { ElMessage, ElLoading } from 'element-plus';
import { getDormCompareDetail } from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCompareReport/data.js';

const currentRow = ref({});

const detailData = ref({
  dormNo: '',
  buildingName: '',
  floor: '',
  className: '',
  totalAssessScore: 0,
  healthScore: 0,
  disciplineScore: 0,
  civilizedDormTitle: '',
  assessRank: 0,
});

const [Modal, modal] = useVbenModal({
  title: '宿舍评比明细',
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
    // 调用文件1中的接口，根据报表ID获取明细
    const res = await getDormCompareDetail({ id: row.id });
    if (res.code === 200) {
      detailData.value = res.data;
      modal.open();
    } else {
      ElMessage.error(res.msg || '获取明细失败');
    }
  } catch (error) {
    console.error('加载宿舍评比明细失败:', error);
    ElMessage.error('加载失败');
  } finally {
    loadingInstance.close();
  }
};

defineExpose({ open });
</script>

<template>
  <Modal>
    <div class="dorm-detail">
      <div class="detail-item">
        <span class="label">宿舍号：</span>
        <span class="value">{{ detailData.dormNo }}</span>
      </div>
      <div class="detail-item">
        <span class="label">楼栋名称：</span>
        <span class="value">{{ detailData.buildingName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">楼层：</span>
        <span class="value">{{ detailData.floor }}</span>
      </div>
      <div class="detail-item">
        <span class="label">班级：</span>
        <span class="value">{{ detailData.className }}</span>
      </div>
      <div class="detail-item">
        <span class="label">评比总分：</span>
        <span class="value">{{ detailData.totalAssessScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">卫生得分：</span>
        <span class="value">{{ detailData.healthScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">纪律得分：</span>
        <span class="value">{{ detailData.disciplineScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">文明宿舍称号：</span>
        <span class="value">{{ detailData.civilizedDormTitle || '-' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">评比排名：</span>
        <span class="value">{{ detailData.assessRank }}</span>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.dorm-detail {
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
