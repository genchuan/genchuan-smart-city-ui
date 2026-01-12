<template>
  <div class="report-toolbar">
    <div class="toolbar-left">
      <slot name="left"></slot>
    </div>
    <div class="toolbar-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped>
.report-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
</style>
