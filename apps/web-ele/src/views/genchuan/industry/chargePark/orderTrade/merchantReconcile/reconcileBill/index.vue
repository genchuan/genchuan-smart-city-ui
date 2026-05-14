<script setup>
import { reactive, ref, computed } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const statusMap = {
  pending: { label: '待对账', type: 'warning' },
  reconciled: { label: '已对账', type: 'success' },
  abnormal: { label: '异常', type: 'danger' },
};

const filterParams = reactive({
  status: null,
  billDateStart: null,
  billDateEnd: null,
});

const hasActiveFilters = computed(() => {
  return filterParams.status !== null || filterParams.billDateStart !== null;
});

const handleFilterChange = (params) => {
  filterParams.status = null;
  filterParams.billDateStart = null;
  filterParams.billDateEnd = null;
  Object.assign(filterParams, params);
};

const clearFilter = () => {
  filterParams.status = null;
  filterParams.billDateStart = null;
  filterParams.billDateEnd = null;
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
    label: '对账单据',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);
const activeName = ref('对账单据');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" />
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag v-if="filterParams.status" closable @close="clearFilter" type="warning">
        状态: {{ statusMap[filterParams.status]?.label || filterParams.status }}
      </el-tag>
      <el-tag v-else-if="filterParams.billDateStart" closable @close="clearFilter" type="primary">
        对账日期: {{ filterParams.billDateStart.split(' ')[0] }}
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
