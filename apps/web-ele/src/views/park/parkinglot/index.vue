<script setup>
import { ref } from 'vue';

import Table from './table.vue';

const handleClick = () => {};
const topName = ref('车辆信息管理');
const activeName = ref('车辆信息管理');
const tabsData = ref([{ label: '全部' }, { label: '启用' }, { label: '禁用' }]);
</script>
<template>
  <div class="park-lot-index">
    <el-card>
      <Table />
    </el-card>
  </div>
</template>
<style lang="scss">
.park-lot-index {
  height: 100%;
  padding: 0.5rem;
  background-color: #fff;
  .el-card__body {
    padding: 0px;
    .el-tabs__content {
      padding: 0px;
      .p-4 {
        padding: 0px;
        .vxe-grid {
          padding-top: 0px;
        }
      }
      .pb-8 {
        padding-top: 5px;
        padding-bottom: 20px;
      }
      .pb-4 {
        padding-bottom: 0.5rem;
      }
      .vxe-grid {
        padding-top: 0px;
        padding-left: 0px;
        padding-right: 0px;
        .vxe-button--item-wrapper {
          padding-left: 5px;
        }
        .vxe-buttons--wrapper {
          padding: 0px;
        }
      }
      .vxe-pager .vxe-pager--sizes {
        margin-right: 5px;
      }
    }
  }
}
</style>
