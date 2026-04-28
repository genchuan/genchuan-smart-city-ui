<script setup>
import { shallowRef } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

const activeName = shallowRef('排班查看');
const secondShow = shallowRef(false);
const chartFilter = shallowRef(null);

const tabArray = shallowRef([
  {
    label: '排班查看',
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

function handleDateFilter(date) {
  chartFilter.value = {
    type: 'scheduleDate',
    value: date,
    filterKey: Date.now(),
  };
}

function handleUserFilter(userName) {
  chartFilter.value = {
    type: 'userName',
    value: userName,
    filterKey: Date.now(),
  };
}
</script>

<template>
  <div class="common-index">
    <Chart
      @date-filter="handleDateFilter"
      @status-filter="handleStatusFilter"
      @user-filter="handleUserFilter"
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
