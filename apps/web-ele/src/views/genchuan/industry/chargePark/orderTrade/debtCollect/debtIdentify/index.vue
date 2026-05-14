<script setup>
import { ref, reactive } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const filterParams = reactive({
  identifyTimeStart: null,
  identifyTimeEnd: null,
  status: null,
});

const handleFilterChange = (params) => {
  filterParams.identifyTimeStart = null;
  filterParams.identifyTimeEnd = null;
  filterParams.status = null;
  Object.assign(filterParams, params);
};

const statusMap = {
  pending: '待识别',
  identified: '已识别',
  marked: '已标记（非逃费）',
};

const getStatusLabel = (status) => {
  return statusMap[status] || status || '-';
};

const hasActiveFilters = () => {
  return filterParams.identifyTimeStart || filterParams.status;
};

const clearDateFilter = () => {
  filterParams.identifyTimeStart = null;
  filterParams.identifyTimeEnd = null;
  filterParams.status = null;
};

const clearStatusFilter = () => {
  filterParams.identifyTimeStart = null;
  filterParams.identifyTimeEnd = null;
  filterParams.status = null;
};

const tabArray = ref([
  {
    label: '逃费识别',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    filterParams,
  },
]);
const activeName = ref('逃费识别');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" />
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.status"
        closable
        @close="clearStatusFilter"
      >
        状态: {{ getStatusLabel(filterParams.status) }}
      </el-tag>
      <el-tag
        v-else-if="filterParams.identifyTimeStart"
        closable
        @close="clearDateFilter"
      >
        日期: {{ filterParams.identifyTimeStart.split(' ')[0] }}
      </el-tag>
    </div>
    <div class="icon-change">
      <el-icon
        class="tabel-tab-icon"
        v-if="secondShow"
        @click="changeArrowStatus"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        class="tabel-tab-icon"
        v-if="!secondShow"
        @click="changeArrowStatus"
      >
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
      @tab-change="tabChange"
    >
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
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          :filter-params="item.filterParams"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>