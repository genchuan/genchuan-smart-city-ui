<script setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const props = defineProps({
  title: {
    type: String,
    default: '确认操作',
  },
  content: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: '确认',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmButtonType: {
    type: String,
    default: 'primary',
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const rowData = ref({});
const actionType = ref(''); // 'activate' 或 'disable'

const [Modal, modalApi] = useVbenModal({
  title: computed(() => {
    if (actionType.value === 'activate') {
      return '确认生效';
    } else if (actionType.value === 'disable') {
      return '确认禁用';
    }
    return props.title;
  }),
  confirmButtonOptions: {
    content: computed(() => {
      return actionType.value === 'activate' ? '确认生效' : '确认禁用';
    }),
    type: computed(() => {
      return actionType.value === 'activate' ? 'primary' : 'danger';
    }),
  },
  cancelButtonOptions: {
    content: '取消',
  },
  onConfirm() {
    emit('confirm', { row: rowData.value, actionType: actionType.value });
    modalApi.close();
  },
  onCancel() {
    emit('cancel');
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      rowData.value = data?.row || {};
      actionType.value = data?.actionType || '';
    }
  },
});

// 打开弹窗方法
const open = (data) => {
  modalApi.setData(data).open();
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="confirm-container">
      <div class="confirm-icon">
        <el-icon
          :size="48"
          :color="actionType === 'activate' ? '#67C23A' : '#F56C6C'"
        >
          <WarningFilled />
        </el-icon>
      </div>
      <div class="confirm-content">
        <p class="confirm-title">
          {{ actionType === 'activate' ? '确认要生效该规则配置吗？' : '确认要禁用该规则配置吗？'
          }}
        </p>
        <p class="confirm-desc">
          {{ actionType === 'activate' ? '生效后将启用该积分规则，是否继续？' : '禁用后将停用该积分规则，是否继续？'
          }}
        </p>
        <p v-if="rowData.name" class="confirm-target">
          规则名称：{{ rowData.name }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.confirm-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.confirm-icon {
  margin-bottom: 16px;
}

.confirm-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.confirm-desc {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.confirm-target {
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
}
</style>
