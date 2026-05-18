<script setup>
import { ref, reactive, computed } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const agentTypeMap = {
  merchant: '商户代付',
  enterprise: '企业代付',
  public: '公益代付',
};

const filterParams = reactive({
  agentType: null,
  status: null,
});

const hasActiveFilters = computed(() => {
  return filterParams.agentType;
});

const handleFilterChange = (params) => {
  filterParams.agentType = params.agentType || null;
  filterParams.status = params.status || null;
};

const clearFilter = () => {
  filterParams.agentType = null;
  filterParams.status = null;
};

const handleClearFilters = () => {
  filterParams.agentType = null;
  filterParams.status = null;
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
    label: '代付规则',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    filterParams,
  },
]);
const activeName = ref('代付规则');
const secondShow = ref(false);
</script>

<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" v-if="tabArray[0].arrowShow"/>
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.agentType"
        closable
        @close="clearFilter"
        type="primary"
      >
        代付类型: {{ agentTypeMap[filterParams.agentType] || filterParams.agentType }}
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
  padding: 0;
  margin: 0;
  min-height: 0;
  height: auto;
}
</style>