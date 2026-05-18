<script setup>
import { reactive, ref, computed } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const matchResultMap = {
  matched: { label: '已匹配', type: 'success' },
  unmatched: { label: '未匹配', type: 'danger' },
  partial: { label: '部分匹配', type: 'warning' },
};

const filterParams = reactive({
  matchResult: null,
  createTimeStart: null,
  createTimeEnd: null,
});

const hasActiveFilters = computed(() => {
  return filterParams.matchResult !== null || filterParams.createTimeStart !== null;
});

const handleFilterChange = (params) => {
  filterParams.matchResult = null;
  filterParams.createTimeStart = null;
  filterParams.createTimeEnd = null;
  Object.assign(filterParams, params);
};

const clearFilter = () => {
  filterParams.matchResult = null;
  filterParams.createTimeStart = null;
  filterParams.createTimeEnd = null;
};

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
const tabArray = ref([
  {
    label: '对账记录',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);
const activeName = ref('对账记录');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" v-if="tabArray[0].arrowShow"/>
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag v-if="filterParams.matchResult" closable @close="clearFilter" type="warning">
        对账结果: {{ matchResultMap[filterParams.matchResult]?.label || filterParams.matchResult }}
      </el-tag>
      <el-tag v-else-if="filterParams.createTimeStart" closable @close="clearFilter" type="primary">
        创建日期: {{ filterParams.createTimeStart.split(' ')[0] }}
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
          :filter-params="filterParams"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
