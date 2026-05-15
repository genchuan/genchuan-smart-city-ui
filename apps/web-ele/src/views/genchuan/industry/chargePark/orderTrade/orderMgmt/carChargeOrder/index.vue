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
  createOrderTimeStart: null,
  createOrderTimeEnd: null,
  stationName: null,
});

const handleFilterChange = (params) => {
  filterParams.createOrderTimeStart = null;
  filterParams.createOrderTimeEnd = null;
  filterParams.stationName = null;
  Object.assign(filterParams, params);
};

const hasActiveFilters = () => {
  return filterParams.createOrderTimeStart || filterParams.stationName;
};

const clearDateFilter = () => {
  filterParams.createOrderTimeStart = null;
  filterParams.createOrderTimeEnd = null;
};

const clearStationFilter = () => {
  filterParams.stationName = null;
};

const tabArray = ref([
  {
    label: '汽车充电订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    filterParams,
  },
]);
const activeName = ref('汽车充电订单');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" v-if="tabArray[0].arrowShow"/>
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.stationName"
        closable
        @close="clearStationFilter"
      >
        场站: {{ filterParams.stationName }}
      </el-tag>
      <el-tag
        v-else-if="filterParams.createOrderTimeStart"
        closable
        @close="clearDateFilter"
      >
        日期: {{ filterParams.createOrderTimeStart.split(' ')[0] }}
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

<style scoped lang="scss">
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
  margin: 0;
  min-height: 0;
  height: auto;

  .el-tag {
    margin: 12px 8px 12px 16px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
