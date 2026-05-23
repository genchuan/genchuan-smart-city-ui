<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
}>();

const tabName = computed(() => props.title);
</script>

<template>
  <el-tabs
    :model-value="tabName"
    class="common-tabs user-merchant-page-tabs"
    type="card"
  >
    <el-tab-pane :name="tabName">
      <template #label>
        <div class="table-first">
          <span>{{ title }}</span>
        </div>
      </template>
      <slot></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss">
.user-merchant-page-tabs {
  .el-tabs__content {
    overflow: visible;
  }

  .el-tabs__header {
    z-index: 3;
  }

  .user-merchant-table-grid .vxe-grid--toolbar-wrapper {
    margin-top: 0 !important;
  }

  .user-merchant-table-grid .vxe-buttons--wrapper {
    padding-top: 0 !important;
  }

  .user-merchant-table-grid .tabel-tabs {
    max-width: calc(100% - 120px) !important;
    margin-left: 120px !important;
  }

  .user-merchant-table-grid .tabel-tabs:empty {
    display: none !important;
  }

  .user-merchant-table-grid .vxe-tools--wrapper {
    position: static !important;
    z-index: 4;
  }

  .user-merchant-table-grid .vxe-tools--operate {
    position: static !important;
    z-index: 4;
  }
}
</style>
