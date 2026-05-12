<!-- 外层 index.vue（包含图表和tabs入口） -->
<script setup>
import { ref } from 'vue';
import EnergyCollectTable from './table/index.vue';
import '#/components/page/index.scss';
import EnergyChart from './table/chart.vue';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '数据采集',
    components: EnergyCollectTable,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
  },
]);

const activeName = ref('数据采集');
const secondShow = ref(false);

const tabChange = () => {};

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const handleChartRefresh = (filters) => {
  window.dispatchEvent(new CustomEvent('energy-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <EnergyChart v-if="tabArray[0].arrowShow" @refresh="handleChartRefresh" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus"><ArrowDown /></el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus"><ArrowUp /></el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.common-index {
  :deep(.stats-four-visualization) {
    margin-bottom: 8px;
  }
  .icon-change {
    margin: 8px 0 16px 0;
  }
  .el-tabs {
    margin-top: 0;
  }
}
</style>
