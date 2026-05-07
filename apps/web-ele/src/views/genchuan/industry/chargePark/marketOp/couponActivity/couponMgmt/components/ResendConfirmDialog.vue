<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElDatePicker, ElMessage } from 'element-plus';

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
const newValidTime = ref(null);

// 打开弹窗
const open = (row) => {
  rowData.value = row;
  // 默认设置为当前时间+30天
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  newValidTime.value = defaultDate;
  modalApi.open();
};

// 确认重新发放
const handleConfirm = async () => {
  if (!rowData.value) return;

  if (!newValidTime.value) {
    ElMessage.warning('请选择新有效期');
    return;
  }

  loading.value = true;
  try {
    // 将日期转换为时间戳
    const validTimeStamp = new Date(newValidTime.value).getTime();

    await resendCouponMgmt({
      id: rowData.value.id,
      receiverId: rowData.value.receiverId,
      newValidTime: validTimeStamp,
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
            <span class="info-value highlight">
              <ElDatePicker
                v-model="newValidTime"
                type="datetime"
                placeholder="请选择新有效期"
                style="width: 200px"
              />
            </span>
          </div>
        </div>
        <p class="confirm-tip">
          重新发放后，该优惠券状态将更新为未领取，重新开放领取
        </p>
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
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  flex-shrink: 0;
  width: 80px;
  color: var(--el-text-color-secondary);
}

.info-value {
  flex: 1;
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
