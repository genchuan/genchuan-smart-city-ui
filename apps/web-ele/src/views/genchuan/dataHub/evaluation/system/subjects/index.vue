<script setup>
import { ref } from 'vue';

import carchart from './subjectschart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

// 图表组件 ref
const chartRef = ref(null);

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '评价主体管理',
    components: Table,
    showSecondary: true,
    secondShow: true,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('评价主体管理');
const secondShow = ref(true);

// 刷新图表数据（由表格组件触发）
const handleRefreshChart = () => {
  if (chartRef.value) {
    chartRef.value.refreshOverview();
  }
};
</script>

<template>
  <div class="common-index">
    <!-- 给图表组件添加 ref -->
    <carchart ref="chartRef" v-if="tabArray[0].arrowShow" />
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
          @refresh-chart="handleRefreshChart"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
