<script setup>
import { ref, reactive, computed } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const statusMap = {
  pending: { label: '未生效', type: 'warning' },
  enabled: { label: '已生效', type: 'success' },
  disabled: { label: '已禁用', type: 'danger' },
};

const filterParams = reactive({
  status: null,
  category: null,
  taxBody: null,
});

const hasActiveFilters = computed(() => {
  return filterParams.status || filterParams.category || filterParams.taxBody;
});

const handleFilterChange = (params) => {
  filterParams.status = params.status !== undefined ? params.status : null;
  filterParams.category = params.category !== undefined ? params.category : null;
  filterParams.taxBody = params.taxBody !== undefined ? params.taxBody : null;
};

const clearCategoryFilter = () => {
  filterParams.category = null;
};

const clearTaxBodyFilter = () => {
  filterParams.taxBody = null;
};

const clearStatusFilter = () => {
  filterParams.status = null;
};

const clearFilter = () => {
  filterParams.status = null;
  filterParams.category = null;
  filterParams.taxBody = null;
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
    label: '发票配置',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);
const activeName = ref('发票配置');
const secondShow = ref(false);
</script>

<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" v-if="tabArray[0].arrowShow"/>
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.category"
        closable
        @close="clearCategoryFilter"
        type="primary"
      >
        开票类目: {{ filterParams.category }}
      </el-tag>
      <el-tag
        v-if="filterParams.taxBody"
        closable
        @close="clearTaxBodyFilter"
        type="success"
      >
        开票主体: {{ filterParams.taxBody }}
      </el-tag>
      <el-tag
        v-if="filterParams.status"
        closable
        @close="clearStatusFilter"
        type="warning"
      >
        状态: {{ statusMap[filterParams.status]?.label || filterParams.status }}
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
          @clear-filters="clearFilter"
          @filter-change="handleFilterChange"
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
