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
  abnormalType: null,
  status: null,
});

const handleFilterChange = (params) => {
  filterParams.identifyTimeStart = null;
  filterParams.identifyTimeEnd = null;
  filterParams.abnormalType = null;
  filterParams.status = null;
  Object.assign(filterParams, params);
};

const handleClearFilters = () => {
  filterParams.identifyTimeStart = null;
  filterParams.identifyTimeEnd = null;
  filterParams.abnormalType = null;
  filterParams.status = null;
};

// 异常类型映射
const abnormalTypeMap = {
  payment_error: '支付异常',
  billing_error: '计费异常',
  status_error: '状态异常',
};

// 获取异常类型标签
const getAbnormalTypeLabel = (abnormalType) => {
  return abnormalTypeMap[abnormalType] || abnormalType || '-';
};

// 是否有激活的过滤器
const hasActiveFilters = () => {
  return filterParams.identifyTimeStart || filterParams.abnormalType || filterParams.status;
};

// 清除日期筛选
const clearDateFilter = () => {
  filterParams.identifyTimeStart = null;
  filterParams.identifyTimeEnd = null;
};

// 清除异常类型筛选
const clearAbnormalTypeFilter = () => {
  filterParams.abnormalType = null;
};

// 清除状态筛选
const clearStatusFilter = () => {
  filterParams.status = null;
};

const tabArray = ref([
  {
    label: '异常订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    filterParams,
  },
]);
const activeName = ref('异常订单');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" v-if="tabArray[0].arrowShow"/>
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.identifyTimeStart"
        closable
        @close="clearDateFilter"
      >
        日期: {{ filterParams.identifyTimeStart.split(' ')[0] }}
      </el-tag>
      <el-tag
        v-if="filterParams.abnormalType"
        closable
        @close="clearAbnormalTypeFilter"
      >
        异常类型: {{ getAbnormalTypeLabel(filterParams.abnormalType) }}
      </el-tag>
      <el-tag
        v-if="filterParams.status === 'unhandled'"
        closable
        @close="clearStatusFilter"
      >
        状态: 未处理
      </el-tag>
      <el-tag
        v-if="filterParams.status === 'closed'"
        closable
        @close="clearStatusFilter"
      >
        状态: 已关闭
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
          @clear-filters="handleClearFilters"
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
  padding: 12px 16px;
  margin: 0 16px; 
  border-radius: 8px;
  .el-tag {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
