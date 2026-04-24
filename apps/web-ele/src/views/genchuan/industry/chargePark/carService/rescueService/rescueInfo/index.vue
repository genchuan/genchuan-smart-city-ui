<script setup>
import { ref } from 'vue';
import Table from './table/index.vue';
import '#/components/page/index.scss';
import RescueChart from './table/chart.vue';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '救援服务',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,          // 控制图表显隐
  },
]);

const activeName = ref('救援服务');
const secondShow = ref(false);

const tabChange = () => {};

// 切换图表显隐
const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const handleChartRefresh = (filters) => {
  window.dispatchEvent(new CustomEvent('rescue-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <RescueChart v-if="tabArray[0].arrowShow" @refresh="handleChartRefresh" />
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
