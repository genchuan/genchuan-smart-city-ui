<script setup lang="ts">
interface Props {
  visitor: any;
}

const _props = defineProps<Props>();

const _emit = defineEmits(['close']);

// 导出记录
const handleExport = () => {
  console.log('导出记录功能待实现');
};

// 关闭抽屉
const handleClose = () => {
  _emit('close');
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
  align-items: center;
  justify-content: space-between;
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
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 0;
}

.search-area {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  max-width: 300px;
}

.export-btn {
  display: flex;
  gap: 4px;
  align-items: center;
}

.record-table {
  width: 100%;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
}
</style>
