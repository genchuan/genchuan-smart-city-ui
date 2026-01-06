<script setup>
import Table from './table.vue';
</script>
<template>
  <div class="park-lot-index">
    <el-card>
      <el-tabs type="border-card">
        <el-tab-pane label="车辆信息管理"><Table /></el-tab-pane>
        <el-tab-pane label="车辆信息报表">Config</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<style lang="scss">
.park-lot-index {
  height: 100%;
  padding: 1rem;
  background-color: #fff;
  .el-tabs__content {
    padding: 0px;
    .p-4 {
      padding: 0px;
      .vxe-grid {
        padding-top: 0px;
      }
    }
  }
}
</style>
