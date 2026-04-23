<script setup>
import { computed, reactive, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { WarningFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';

import {
  disableAssetInfo,
  scrapAssetInfo,
} from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetInfo';

const emit = defineEmits(['success']);

const actionType = shallowRef('');
const rowData = shallowRef({});
const scrapFormRef = shallowRef(null);
const scrapForm = reactive({
  scrapRemark: '',
});

const scrapRules = {
  scrapRemark: [
    { required: true, message: '请输入报废理由', trigger: 'blur' },
    { max: 255, message: '报废理由不能超过255个字符', trigger: 'blur' },
  ],
};

const actionConfig = {
  disable: {
    title: '确认禁用',
    message: (name) =>
      `确定要禁用资产“${name}”吗？禁用后该资产无法继续领用使用。`,
    successMessage: '资产禁用成功',
    loadingMessage: '正在禁用资产...',
  },
  scrap: {
    title: '确认报废',
    message: (name) => `确定要报废资产“${name}”吗？报废后资产将进入报废状态。`,
    successMessage: '资产报废成功',
    loadingMessage: '正在报废资产...',
  },
};

const currentAction = computed(() => actionConfig[actionType.value] || {});

const [Modal, modalApi] = useVbenModal({
  title: computed(() => currentAction.value.title || '确认操作'),
  width: 460,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await handleConfirm();
  },
});

async function validateScrapForm() {
  if (actionType.value !== 'scrap') return true;
  try {
    await scrapFormRef.value?.validate?.();
    return true;
  } catch {
    return false;
  }
}

async function handleConfirm() {
  if (!actionType.value || !rowData.value?.id) {
    ElMessage.warning('操作参数错误');
    return;
  }

  const valid = await validateScrapForm();
  if (!valid) return;

  const loadingInstance = ElLoading.service({
    text: currentAction.value.loadingMessage,
  });

  try {
    if (actionType.value === 'disable') {
      await disableAssetInfo({ id: rowData.value.id });
    }
    if (actionType.value === 'scrap') {
      await scrapAssetInfo({
        id: rowData.value.id,
        scrapRemark: scrapForm.scrapRemark,
      });
    }
    ElMessage.success(currentAction.value.successMessage);
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('资产状态操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
}

function open(type, row) {
  actionType.value = type;
  rowData.value = row || {};
  scrapForm.scrapRemark = '';
  scrapFormRef.value?.clearValidate?.();
  modalApi.open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="confirm-container">
      <div class="confirm-icon">
        <el-icon><WarningFilled /></el-icon>
      </div>
      <div class="confirm-message">
        {{ currentAction.message ? currentAction.message(rowData.name) : '' }}
      </div>
      <el-form
        v-if="actionType === 'scrap'"
        ref="scrapFormRef"
        class="scrap-form"
        label-position="top"
        :model="scrapForm"
        :rules="scrapRules"
      >
        <el-form-item label="报废理由" prop="scrapRemark">
          <el-input
            v-model="scrapForm.scrapRemark"
            maxlength="255"
            placeholder="请输入报废理由"
            :rows="4"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div class="confirm-tip">确认后将刷新资产信息列表。</div>
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
  font-size: 44px;
  color: var(--el-color-warning);
}

.confirm-message {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
}

.scrap-form {
  margin: 12px 0;
  text-align: left;
}

.confirm-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
