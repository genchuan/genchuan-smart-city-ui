<script setup>
import { shallowRef } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

const activeName = shallowRef('两轮充电监测');
const secondShow = shallowRef(false);
const locatedDevice = shallowRef(null);
const chartFilter = shallowRef(null);

const tabArray = shallowRef([
  {
    label: '两轮充电监测',
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

function handleLocateDevice(payload) {
  locatedDevice.value = {
    ...payload,
    locateKey: Date.now(),
  };
}

function handleStatusFilter(status) {
  chartFilter.value = {
    type: 'monitorStatus',
    value: status,
    filterKey: Date.now(),
  };
}

function handleTrendFilter(time) {
  chartFilter.value = {
    type: 'trendTime',
    value: time,
    filterKey: Date.now(),
  };
}
</script>

<template>
  <div class="common-index">
    <Chart
      :located-device="locatedDevice"
      @status-filter="handleStatusFilter"
      @trend-filter="handleTrendFilter"
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
          @locate-device="handleLocateDevice"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
