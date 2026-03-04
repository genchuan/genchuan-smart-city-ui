<script setup>
const props = defineProps({
  category: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'confirm']);

const handleConfirm = () => {
  emit('confirm');
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="submit-audit-dialog">
    <div class="dialog-content">
      <p>
        确定要提交分类
        <span class="category-name">{{ category.categoryName }}</span>
        进行审核吗？
      </p>
      <p class="tip">提交后，审核状态将变为「待审核」，请等待管理员审核。</p>
    </div>
    <div class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认提交</el-button>
    </div>
  </div>
</template>

<style scoped>
.submit-audit-dialog {
  padding: 20px;
}

.dialog-header {
  margin-bottom: 20px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.dialog-content {
  margin-bottom: 20px;
}

.category-name {
  font-weight: 500;
  color: #409eff;
}

.tip {
  margin-top: 10px;
  font-size: 14px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
