<script setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { ElMessage } from 'element-plus';

import { sendCouponMgmt, getSendObject } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';

const emit = defineEmits(['success']);

// 获取优惠券类型标签
const getCouponTypeLabel = computed(() => {
  if (!rowData.value?.type) return '';
  const dict = getDictObj(
    DICT_TYPE.COUPON_MGMT_TYPE,
    String(rowData.value.type),
  );
  return dict ? dict.label : rowData.value.type;
});

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

// 用户列表（从接口获取）
const userOptions = ref([]);
// 远程搜索加载状态
const userLoading = ref(false);

/** 获取用户列表（支持 name 模糊查询） */
const fetchUserList = async (query = '') => {
  try {
    userLoading.value = true;
    const response = await getSendObject({ name: query });
    // eslint-disable-next-line unicorn/prefer-ternary
    if (response.length > 0) {
      // 将接口返回数据转换为 el-option 需要的格式
      userOptions.value = response.map((user) => ({
        label: user.name,
        value: user.id,
      }));
    } else {
      userOptions.value = [];
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    userOptions.value = [];
  } finally {
    userLoading.value = false;
  }
};

/** 远程搜索方法 */
const handleUserRemoteMethod = (query) => {
  if (query !== '') {
    fetchUserList(query);
  } else {
    fetchUserList();
  }
};

// 打开弹窗
const open = (row) => {
  rowData.value = row;
  receiverId.value = null;
  receiverName.value = '';
  // 加载用户列表（不带搜索条件，获取全部数据）
  fetchUserList();
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
          <span class="info-value">{{ getCouponTypeLabel }}</span>
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
            <template v-else> ¥{{ rowData?.amount }} </template>
          </span>
        </div>
      </div>

      <div class="receiver-section">
        <div class="section-title">选择发放对象</div>
        <el-select
          v-model="receiverId"
          placeholder="请选择发放用户"
          style="width: 100%"
          filterable
          clearable
          remote
          :remote-method="handleUserRemoteMethod"
          :loading="userLoading"
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
