<script setup>
import { ref, reactive } from 'vue';

import Table from './table/index.vue';
import Chart from './table/chart.vue'
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
  orderType: null,
});

const handleFilterChange = (params) => {
  filterParams.createOrderTimeStart = null;
  filterParams.createOrderTimeEnd = null;
  filterParams.orderType = null;
  Object.assign(filterParams, params);
};

// 订单类型映射
const orderTypeMap = {
  temp_park: '临时停车',
  offtime_park: '错时停车',
  car_charge: '汽车充电',
  bike_charge: '两轮充电',
  share_charge: '共享充电',
};

// 获取订单类型标签
const getOrderTypeLabel = (orderType) => {
  return orderTypeMap[orderType] || orderType || '-';
};

// 是否有激活的过滤器
const hasActiveFilters = () => {
  return filterParams.createOrderTimeStart || filterParams.orderType;
};

// 清除日期筛选
const clearDateFilter = () => {
  filterParams.createOrderTimeStart = null;
  filterParams.createOrderTimeEnd = null;
};

// 清除订单类型筛选
const clearOrderTypeFilter = () => {
  filterParams.orderType = null;
};

// 清除所有筛选
const clearAllFilters = () => {
  filterParams.createOrderTimeStart = null;
  filterParams.createOrderTimeEnd = null;
  filterParams.orderType = null;
};

const tabArray = ref([
  {
    label: '全部订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    filterParams,
  },
]);
const activeName = ref('全部订单');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" v-if="tabArray[0].arrowShow"/>
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.createOrderTimeStart"
        closable
        @close="clearDateFilter"
      >
        日期: {{ filterParams.createOrderTimeStart.split(' ')[0] }}
      </el-tag>
      <el-tag
        v-else-if="filterParams.orderType"
        closable
        @close="clearOrderTypeFilter"
      >
        订单类型: {{ getOrderTypeLabel(filterParams.orderType) }}
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

