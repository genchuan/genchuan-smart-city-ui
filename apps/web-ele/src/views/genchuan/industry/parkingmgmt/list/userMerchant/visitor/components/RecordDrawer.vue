<script setup lang="ts">
interface Props {
  visitor: any;
}

const props = defineProps<Props>();

const emit = defineEmits(['close']);

// 导出记录
const handleExport = () => {
  console.log('导出记录功能待实现');
};

// 关闭抽屉
const handleClose = () => {
  emit('close');
};
</script>
<template>
  <div class="record-drawer">
    <div class="drawer-content">
      <div class="empty-content">
        <el-empty description="记录管理功能待实现" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.record-drawer {
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

.search-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.search-input {
  max-width: 300px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.record-table {
  width: 100%;
}

.drawer-footer {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
}
</style>
