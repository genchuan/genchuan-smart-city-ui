<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import inspectTaskChart from './inspectTaskChart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const tabArray = ref([
  {
    label: '稽查任务',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};
const activeName = ref('稽查任务');

// 下钻筛选参数
const drillDownFilter = ref(null);
const tableRef = ref(null);

// 监听图表下钻事件
const handleFilterByStatus = (event) => {
  const { status, taskType, date } = event.detail;

  // 设置筛选条件（不收起图表）
  drillDownFilter.value = { filterKey: status, taskType, date };

  // 滚动到表格区域
  setTimeout(() => {
    const tableElement = document.querySelector('.common-tabs');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

onMounted(() => {
  window.addEventListener('filterByStatus', handleFilterByStatus);
});

onUnmounted(() => {
  window.removeEventListener('filterByStatus', handleFilterByStatus);
});
</script>

<template>
  <div class="common-index">
    <inspectTaskChart v-if="tabArray[0].arrowShow" />
    <el-tabs v-model="activeName" class="common-tabs mark-tabs" type="card">
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
          ref="tableRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          :drill-down-filter="drillDownFilter"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.common-index {
  .common-tabs {
    :deep(.el-tabs__nav) {
      margin-left: 0 !important;
    }

    :deep(.el-tabs__item) {
      padding-right: 5px !important;
    }
  }
}
</style>
