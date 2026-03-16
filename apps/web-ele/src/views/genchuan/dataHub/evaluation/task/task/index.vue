<script setup>
import { ref } from 'vue';

// import Table from './table/index.vue';
// import Chart from './chart.vue';

import '#/components/page/index.scss';

const chartDataFromTable = ref(null);

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '评价任务管理',
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
const activeName = ref('评价任务管理');
const secondShow = ref(false);

const updateChartData = (data) => {
  chartDataFromTable.value = data;
};

</script>

<template>
  <div class="common-index">
    <Chart v-if="tabArray[0].arrowShow" v-bind="chartDataFromTable" />
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
          @arrow-change="arrowChange"
          @update-chart="updateChartData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
