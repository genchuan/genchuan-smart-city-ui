<script setup>
import { ref } from 'vue';
import ChargeParkMapTable from './table/index.vue';
import ChargeParkMapChart from './table/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '充停地图',
    components: ChargeParkMapTable,
    chartComponent: ChargeParkMapChart,
    secondShow: false,
  },
]);

const activeName = ref('充停地图');
const secondShow = ref(false);
const chartRef = ref(null);

const tabChange = () => {};

const handleChartRefresh = (filters, activeTab) => {
  const eventMap = { '充停地图': 'charge-park-map-chart-refresh' };
  const eventName = eventMap[activeTab];
  if (eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: filters }));
  }
};

const refreshChart = () => {
  chartRef.value?.refresh();
};
</script>

<template>
  <div class="common-index">
    <component
      :is="tabArray.find(item => item.label === activeName)?.chartComponent"
      ref="chartRef"
      @refresh="(filters) => handleChartRefresh(filters, activeName)"
    />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus">
        <ArrowDown />
      </el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus">
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :key="item.label"
          @refreshChart="refreshChart"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
