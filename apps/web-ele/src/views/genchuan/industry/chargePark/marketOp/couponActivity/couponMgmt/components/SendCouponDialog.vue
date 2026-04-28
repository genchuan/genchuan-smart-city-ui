<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { sendCouponMgmt } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: '发放优惠券',
  width: 400,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleSend();
  },
});

const rowData = ref(null);
const receiverId = ref(null);
const receiverName = ref('');
const loading = ref(false);

// 模拟用户列表（实际应从用户接口获取）
const userOptions = [
  { label: '张三', value: 1001 },
  { label: '李四', value: 1002 },
  { label: '王五', value: 1003 },
  { label: '赵六', value: 1004 },
  { label: '孙七', value: 1005 },
];

// 打开弹窗
const open = (row) => {
  rowData.value = row;
  receiverId.value = null;
  receiverName.value = '';
  modalApi.open();
};

// 确认发放
const handleSend = async () => {
  if (!receiverId.value) {
    ElMessage.warning('请选择发放对象');
    return;
  }

  if (!rowData.value) {
    ElMessage.error('优惠券信息不存在');
    return;
  }

  loading.value = true;
  try {
    await sendCouponMgmt({
      id: rowData.value.id,
      receiverId: receiverId.value,
    });
    ElMessage.success('发放成功');
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error(error);
    ElMessage.error('发放失败');
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
    <div class="send-container">
      <div class="coupon-info">
        <div class="info-item">
          <span class="info-label">券名称：</span>
          <span class="info-value">{{ rowData?.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">券类型：</span>
          <span class="info-value">{{ rowData?.typeName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">面额：</span>
          <span class="info-value">
            <template v-if="rowData?.type === '1'">
              {{ (rowData?.amount * 10).toFixed(1) }}折
            </template>
            <template v-else-if="rowData?.type === '2'">
              {{ rowData?.amount }}小时
            </template>
            <template v-else>
              ¥{{ rowData?.amount }}
            </template>
          </span>
        </div>
      </div>

      <div class="receiver-section">
        <div class="section-title">选择发放对象</div>
        <el-select
          v-model="receiverId"
          placeholder="请选择用户"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="user in userOptions"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          />
        </el-select>
      </div>

      <div class="tip-section">
        <el-alert
          title="发放后优惠券状态将更新为已领取，用户将收到领取通知"
          type="info"
          :closable="false"
        />
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.send-container {
  padding: 20px;
}

.coupon-info {
  padding: 16px;
  margin-bottom: 20px;
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

.receiver-section {
  margin-bottom: 20px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.tip-section {
  margin-top: 20px;
}
</style>
