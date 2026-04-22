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
  },
]);

const activeName = ref('预约服务');
const secondShow = ref(false);

const tabChange = () => {};

const handleChartRefresh = (filters) => {
  window.dispatchEvent(new CustomEvent('reserve-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <ReserveChart @refresh="handleChartRefresh" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus"><ArrowDown /></el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus"><ArrowUp /></el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component :is="item.components" :second-show="item.secondShow" :key="item.label" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
