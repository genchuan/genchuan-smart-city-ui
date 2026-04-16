<script setup>
import { shallowRef } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

const activeName = shallowRef('资产信息');
const secondShow = shallowRef(false);
const chartFilter = shallowRef(null);

const tabArray = shallowRef([
  {
    label: '资产信息',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);

function changeArrowStatus() {
  secondShow.value = !secondShow.value;
  tabArray.value = tabArray.value.map((item) => ({
    ...item,
    secondShow: secondShow.value,
  }));
}

function handleStatusFilter(status) {
  chartFilter.value = {
    type: 'status',
    value: status,
    filterKey: Date.now(),
  };
}

function handleTypeFilter(type) {
  chartFilter.value = {
    type: 'type',
    value: type,
    filterKey: Date.now(),
  };
}
</script>

<template>
  <div class="common-index">
    <Chart
      @status-filter="handleStatusFilter"
      @type-filter="handleTypeFilter"
    />
    <div class="icon-change">
      <el-icon
        v-if="secondShow"
        class="tabel-tab-icon"
        @click="changeArrowStatus"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        v-if="!secondShow"
        class="tabel-tab-icon"
        @click="changeArrowStatus"
      >
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.components"
          :key="item.label"
          :chart-filter="chartFilter"
          :second-show="item.secondShow"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
