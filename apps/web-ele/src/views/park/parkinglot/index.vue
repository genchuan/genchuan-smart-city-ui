<script setup>
import { ref } from 'vue';

import Table from './table.vue';

const chartRef = ref(null);
const activeName = ref('车辆信息管理');
const handleClick = (tab, event) => {
  chartRef.value.init();
};
</script>
<template>
  <div class="park-lot-index">
    <el-card>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-change="handleClick"
      >
        <el-tab-pane label="车辆信息管理" name="车辆信息管理">
          <Table />
        </el-tab-pane>
        <el-tab-pane label="车辆信息报表" name="车辆信息报表">
          <Chart ref="chartRef" />
        </el-tab-pane>
      </el-tabs>
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
