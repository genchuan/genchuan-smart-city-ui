<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

import Table from './table/index.vue';
import unplateEnterChart from './unplateEnterChart.vue';

import '#/components/page/index.scss';

const tabArray = ref([
  {
    label: '无牌入场',
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
const activeName = ref('无牌入场');

const tableRef = ref(null);

// 处理图表下钻事件
const handleFilterByStatus = (params) => {
  // 滚动到表格区域
  nextTick(() => {
    const tableElement = document.querySelector('.park-lot-table-new');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // 传递筛选参数到表格组件
  tableRef.value?.handleDrillDown?.(params);
};

onMounted(() => {
  // 监听图表下钻事件
  window.addEventListener('unplateEnterDrillDown', handleFilterByStatus);
});

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('unplateEnterDrillDown', handleFilterByStatus);
});
</script>

<template>
  <div class="common-index">
    <unplateEnterChart v-if="tabArray[0].arrowShow" />
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
