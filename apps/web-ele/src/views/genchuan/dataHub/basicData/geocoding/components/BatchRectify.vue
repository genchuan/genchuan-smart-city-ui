<script setup>
import { ref } from 'vue';

const props = defineProps({
  selectedCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close', 'confirm']);

const rectifyType = ref('');
const loading = ref(false);
const result = ref({
  show: false,
  success: false,
  successCount: 0,
  failCount: 0,
  message: '',
});

const handleConfirm = () => {
  if (!rectifyType.value) {
    return;
  }

  loading.value = true;

  // 模拟处理过程
  setTimeout(() => {
    loading.value = false;
    // 模拟处理结果
    result.value = {
      show: true,
      success: true,
      successCount: props.selectedCount,
      failCount: 0,
    };
    emit('confirm', {
      rectifyType: rectifyType.value,
      successCount: result.value.successCount,
    });
  }, 2000);
};

const handleCancel = () => {
  emit('close');
};
</script>

<template>
  <div class="batch-rectify">
    <div class="content">
      <div class="selected-count">已选择 {{ selectedCount }} 条数据</div>
      <div class="rectify-type">
        <el-form-item label="整改类型">
          <el-radio-group v-model="rectifyType">
            <el-radio label="coordinate">坐标修正</el-radio>
            <el-radio label="code">编码重生成</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="rectify-info" v-if="rectifyType === 'coordinate'">
        <p>坐标修正：系统将根据最新地图数据自动修正坐标信息</p>
      </div>
      <div class="rectify-info" v-else-if="rectifyType === 'code'">
        <p>编码重生成：系统将根据最新编码规则重新生成地理编码</p>
      </div>
      <div class="loading-container" v-if="loading">
        <el-loading v-loading="loading" element-loading-text="正在处理...">
          <div style="height: 200px"></div>
        </el-loading>
      </div>
      <div class="result-info" v-if="result.show">
        <el-alert
          :title="result.success ? '处理成功' : '处理失败'"
          :type="result.success ? 'success' : 'error'"
          :closable="false"
          show-icon
        />
        <div v-if="result.success" class="success-info">
          <p>成功处理 {{ result.successCount }} 条数据</p>
          <p>处理失败 {{ result.failCount }} 条数据</p>
        </div>
        <div v-else class="error-info">
          <p>{{ result.message }}</p>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :loading="loading"
        :disabled="!rectifyType"
      >
        {{ loading ? '处理中...' : '确认' }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.batch-rectify {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title {
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid var(--el-border-color);
}

.content {
  flex: 1;
  padding: 10px 0;
}

.selected-count {
  padding: 10px;
  margin-bottom: 20px;
  background-color: var(--el-bg-color-secondary);
  border-radius: 4px;
}

.rectify-type {
  margin-bottom: 20px;
}

.rectify-info {
  padding: 10px;
  margin: 20px 0;
  background-color: var(--el-color-primary-light-9);
  border-left: 4px solid var(--el-color-primary);
  border-radius: 4px;
}

.loading-container {
  margin: 20px 0;
}

.result-info {
  margin: 20px 0;
}

.success-info {
  padding: 10px;
  margin-top: 10px;
  background-color: var(--el-color-success-light-9);
  border-radius: 4px;
}

.error-info {
  padding: 10px;
  margin-top: 10px;
  background-color: var(--el-color-danger-light-9);
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 10px;
  margin-top: 20px;
  border-top: 1px solid var(--el-border-color);
}
</style>
