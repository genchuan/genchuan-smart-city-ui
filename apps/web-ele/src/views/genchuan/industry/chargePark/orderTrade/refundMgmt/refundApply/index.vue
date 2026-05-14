<script setup>
import { ref, reactive, computed } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const filterParams = reactive({
  applyTimeStart: null,
  applyTimeEnd: null,
  status: null,
});

const statusMap = {
  pending_audit: { label: '待审核', type: 'warning' },
  pending_exec: { label: '待执行', type: 'primary' },
  rejected: { label: '已拒绝', type: 'danger' },
  completed: { label: '已完成', type: 'success' },
};

const hasActiveFilters = computed(() => {
  return filterParams.applyTimeStart || filterParams.status;
});

const handleFilterChange = (params) => {
  filterParams.applyTimeStart = params.applyTimeStart || null;
  filterParams.applyTimeEnd = params.applyTimeEnd || null;
  filterParams.status = params.status || null;
};

const clearFilter = () => {
  filterParams.applyTimeStart = null;
  filterParams.applyTimeEnd = null;
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
    label: '退款申请',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);
const activeName = ref('退款申请');
const secondShow = ref(false);
</script>

<template>
  <div class="common-index">
    <Chart @filter-change="handleFilterChange" />
    <div v-if="hasActiveFilters" class="filter-tags">
      <el-tag
        v-if="filterParams.status"
        closable
        @close="clearFilter"
        type="warning"
      >
        状态: {{ statusMap[filterParams.status]?.label || filterParams.status }}
      </el-tag>
      <el-tag
        v-else-if="filterParams.applyTimeStart"
        closable
        @close="clearFilter"
        type="info"
      >
        日期: {{ filterParams.applyTimeStart?.split(' ')[0] }}
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