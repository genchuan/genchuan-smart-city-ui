<script setup>
import { ref, reactive, computed } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const filterParams = reactive({
  collectTimeStart: null,
  collectTimeEnd: null,
  collectMethod: null,
  status: null,
});

const methodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

const statusMap = {
  pending: { label: '待追缴', type: 'warning' },
  collecting: { label: '追缴中', type: 'primary' },
  completed: { label: '已完成', type: 'success' },
};

const hasActiveFilters = computed(() => {
  return filterParams.collectTimeStart || filterParams.collectMethod || filterParams.status;
});

const handleFilterChange = (params) => {
  filterParams.collectTimeStart = params.collectTimeStart || null;
  filterParams.collectTimeEnd = params.collectTimeEnd || null;
  filterParams.collectMethod = params.collectMethod || null;
  filterParams.status = params.status || null;
};

const handleClearFilters = () => {
  filterParams.collectTimeStart = null;
  filterParams.collectTimeEnd = null;
  filterParams.collectMethod = null;
  filterParams.status = null;
};

const clearFilter = () => {
  filterParams.collectTimeStart = null;
  filterParams.collectTimeEnd = null;
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
    label: '追缴跟踪',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    filterParams,
  },
]);
const activeName = ref('追缴跟踪');
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
        v-else-if="filterParams.status"
        closable
        @close="clearFilter"
        type="warning"
      >
        状态: {{ statusMap[filterParams.status]?.label || filterParams.status }}
      </el-tag>
      <el-tag
        v-else-if="filterParams.collectTimeStart"
        closable
        @close="clearFilter"
        type="info"
      >
        追缴时间: {{ filterParams.collectTimeStart?.split(' ')[0] }}
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