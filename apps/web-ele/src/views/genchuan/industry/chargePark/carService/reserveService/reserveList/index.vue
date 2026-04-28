<script setup>
import { ref } from 'vue';
import ReserveTable from './table/index.vue';
import '#/components/page/index.scss';
import ReserveChart from './table/chart.vue';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '预约服务',
    components: ReserveTable,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,          // 新增：控制图表显隐
  },
]);

const activeName = ref('预约服务');
const secondShow = ref(false);

const tabChange = () => {};

// 新增：切换图表显隐
const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const handleChartRefresh = (filters) => {
  window.dispatchEvent(new CustomEvent('reserve-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <!-- 新增：通过 arrowShow 控制图表显隐 -->
    <ReserveChart v-if="tabArray[0].arrowShow" @refresh="handleChartRefresh" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus"><ArrowDown /></el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus"><ArrowUp /></el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 新增：传递 arrowShow 并监听 arrow-change 事件 -->
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
