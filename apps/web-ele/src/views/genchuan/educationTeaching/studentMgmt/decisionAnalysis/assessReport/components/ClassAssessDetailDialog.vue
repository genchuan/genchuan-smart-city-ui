<script setup>
import { ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { ElMessage, ElLoading } from 'element-plus';
import { getClassAssessDetail } from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';

const currentRow = ref({});

const detailData = ref({
  className: '',
  healthScore: 0,
  morningExerciseScore: 0,
  civilizedClassScore: 0,
  blackboardNewsScore: 0,
  totalScore: 0,
});

const [Modal, modal] = useVbenModal({
  title: '班级考评明细',
  width: 650,
  onCancel: () => modal.close(),
  onConfirm: () => modal.close(),
});

const open = async (row) => {
  if (!row) {
    console.warn('open 方法未接收到 row 参数');
    return;
  }
  currentRow.value = row;
  const loadingInstance = ElLoading.service({text: '加载中...'});
  try {
    // 调用文件1中的接口，根据班级名称获取明细
    const res = await getClassAssessDetail({className: row.className});
    if (res.code === 200) {
      detailData.value = res.data;
      modal.open();
    } else {
      ElMessage.error(res.msg || '获取明细失败');
    }
  } catch (error) {
    console.error('加载班级考评明细失败:', error);
    ElMessage.error('加载失败');
  } finally {
    loadingInstance.close();
  }
};

defineExpose({open});
</script>

<template>
  <Modal>
    <div class="class-detail">
      <div class="detail-item">
        <span class="label">班级：</span>
        <span class="value">{{ detailData.className }}</span>
      </div>
      <div class="detail-item">
        <span class="label">卫生得分：</span>
        <span class="value">{{ detailData.healthScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">早操得分：</span>
        <span class="value">{{ detailData.morningExerciseScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">文明班级得分：</span>
        <span class="value">{{ detailData.civilizedClassScore }}</span>
      </div>
      <div class="detail-item">
        <span class="label">黑板报得分：</span>
        <span class="value">{{ detailData.blackboardNewsScore }}</span>
      </div>
      <div class="detail-item total">
        <span class="label">总分：</span>
        <span class="value">{{ detailData.totalScore }}</span>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.class-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 16px;
  font-size: 14px;
}

.label {
  display: inline-block;
  width: 100px;
  color: #606266;
}

.value {
  color: #303133;
  font-weight: 500;
}

.total {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
</style>
