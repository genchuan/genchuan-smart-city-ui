<script setup>
import { ref, computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import {
  activateExchangeCategory,
  disableExchangeCategory,
  enableExchangeCategory,
} from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeCategory';

const emit = defineEmits(['success']);

const record = ref({});
const actionType = ref(''); // 'activate', 'disable', 'enable'
const loading = ref(false);

const [Modal, modalApi] = useVbenModal({
  title: computed(() => {
    const titles = {
      activate: '生效确认',
      disable: '禁用确认',
      enable: '启用确认',
    };
    return titles[actionType.value] || '操作确认';
  }),
  width: 400,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

// 打开弹窗
const open = (row, type) => {
  record.value = row;
  actionType.value = type;
  modalApi.open();
};

// 获取确认消息
const getConfirmMessage = () => {
  const messages = {
    activate: `确定要将类目 "${record.value.name}" 生效吗？`,
    disable: `确定要将类目 "${record.value.name}" 禁用吗？`,
    enable: `确定要将类目 "${record.value.name}" 启用吗？`,
  };
  return messages[actionType.value] || '确定要执行此操作吗？';
};

// 获取提示信息
const getTipMessage = () => {
  const tips = {
    activate: '生效后该类目将变为"已生效"状态，可正常使用',
    disable: '禁用后该类目将变为"已禁用"状态，不可使用',
    enable: '启用后该类目将恢复为"已生效"状态',
  };
  return tips[actionType.value] || '';
};

// 处理确认
const handleConfirm = async () => {
  try {
    loading.value = true;

    let response;
    switch (actionType.value) {
      case 'activate':
        response = await activateExchangeCategory({ id: record.value.id });
        break;
      case 'disable':
        response = await disableExchangeCategory({ id: record.value.id });
        break;
      case 'enable':
        response = await enableExchangeCategory({ id: record.value.id });
        break;
      default:
        throw new Error('未知的操作类型');
    }

    // 判断响应是否成功（根据接口返回格式 {code: 0, msg: "成功", data: true}）
    if (response && (response.code === 0 || response.code === undefined)) {
      const successMessages = {
        activate: '生效成功',
        disable: '禁用成功',
        enable: '启用成功',
      };
      ElMessage.success(successMessages[actionType.value]);
      modalApi.close();
      emit('success');
    } else {
      ElMessage.error(response?.msg || response?.message || '操作失败');
    }
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error(error?.message || '操作失败');
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
    <div class="status-confirm-content">
      <p class="confirm-message">{{ getConfirmMessage() }}</p>
      <p class="tip">{{ getTipMessage() }}</p>
    </div>
    <template #footer>
      <ElButton @click="modalApi.close()">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">
        确认
      </ElButton>
    </template>
  </Modal>
</template>

<style scoped>
.status-confirm-content {
  padding: 20px 0;
  text-align: center;
}

.confirm-message {
  font-size: 14px;
  color: #303133;
  margin-bottom: 10px;
}

.tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}
</style>
