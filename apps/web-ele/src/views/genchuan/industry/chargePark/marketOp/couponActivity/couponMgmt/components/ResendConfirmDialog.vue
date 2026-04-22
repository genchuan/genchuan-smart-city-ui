<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { resendCouponMgmt } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: '重新发放确认',
  width: 400,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

const rowData = ref(null);
const loading = ref(false);

// 打开弹窗
const open = (row) => {
  rowData.value = row;
  modalApi.open();
};

// 确认重新发放
const handleConfirm = async () => {
  if (!rowData.value) return;

  loading.value = true;
  try {
    // 计算新的有效期（当前时间+30天）
    const newValidTime = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await resendCouponMgmt({
      id: rowData.value.id,
      receiverId: rowData.value.receiverId,
      newValidTime: newValidTime,
    });
    ElMessage.success('重新发放成功');
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error(error);
    ElMessage.error('重新发放失败');
  } finally {
    loading.value = false;
  }
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="confirm-container">
      <div class="confirm-icon">
        <el-icon :size="48" color="#67C23A">
          <RefreshLeft />
        </el-icon>
      </div>
      <div class="confirm-title">确认重新发放该优惠券？</div>
      <div class="confirm-content">
        <div class="coupon-info">
          <div class="info-item">
            <span class="info-label">券名称：</span>
            <span class="info-value">{{ rowData?.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">原有效期：</span>
            <span class="info-value">{{ rowData?.validTimeStr }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">新有效期：</span>
            <span class="info-value highlight">{{ new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString() }}</span>
          </div>
        </div>
        <p class="confirm-tip">重新发放后，该优惠券状态将更新为未领取，重新开放领取</p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.confirm-container {
  padding: 20px;
  text-align: center;
}

.confirm-icon {
  margin-bottom: 16px;
}

.confirm-title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.confirm-content {
  text-align: left;
}

.coupon-info {
  padding: 12px;
  margin-bottom: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.info-item {
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: var(--el-text-color-secondary);
}

.info-value {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.info-value.highlight {
  color: var(--el-color-success);
}

.confirm-tip {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>
