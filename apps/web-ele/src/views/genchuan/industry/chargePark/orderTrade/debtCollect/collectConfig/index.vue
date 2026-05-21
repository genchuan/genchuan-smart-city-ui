<script setup>
import { ref, reactive, computed } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const filterParams = reactive({
  createTimeStart: null,
  createTimeEnd: null,
  collectMethod: null,
  status: null,
});

const methodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

const hasActiveFilters = computed(() => {
  return filterParams.createTimeStart || filterParams.collectMethod || filterParams.status;
});

const handleFilterChange = (params) => {
  filterParams.createTimeStart = params.createTimeStart || null;
  filterParams.createTimeEnd = params.createTimeEnd || null;
  filterParams.collectMethod = params.collectMethod || null;
  filterParams.status = params.status || null;
};

const clearFilter = () => {
  filterParams.createTimeStart = null;
  filterParams.createTimeEnd = null;
  filterParams.collectMethod = null;
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
    label: '追缴配置',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);
const activeName = ref('追缴配置');
const secondShow = ref(false);
</script>

<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange"  v-if="tabArray[0].arrowShow"/>
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.collectMethod"
        closable
        @close="clearFilter"
        type="primary"
      >
        追缴方式: {{ methodMap[filterParams.collectMethod]?.label || filterParams.collectMethod }}
      </el-tag>
      <el-tag
        v-else-if="filterParams.createTimeStart"
        closable
        @close="clearFilter"
        type="info"
      >
        日期: {{ filterParams.createTimeStart?.split(' ')[0] }}
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

<style scoped lang="scss">
.filter-tags {
  padding: 0;
  margin: 0;
  min-height: 0;
  height: auto;
}
</style>