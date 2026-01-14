<script setup lang="ts">
import { ElMessage } from 'element-plus';

interface Props {
  visitor: any;
}

const props = defineProps<Props>();

const emit = defineEmits(['close']);

// 保存权限
const handleSave = () => {
  ElMessage.success('权限保存成功');
  emit('close');
};

// 关闭抽屉
const handleClose = () => {
  emit('close');
};
</script>
<template>
  <div class="permission-drawer">
    <div class="drawer-content">
      <div class="empty-content">
        <el-empty description="权限管理功能待实现" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.permission-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 16px;
  border-bottom: 1px solid #ebeef5;
}

.drawer-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.drawer-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.empty-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px 0;
}

.permission-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.permission-name {
  font-weight: 500;
}

.permission-desc {
  font-size: 12px;
  color: #909399;
}

.drawer-footer {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
