<script setup>
import { ref } from 'vue';
import SpacePushTable from './table/index.vue';
import SpacePushChart from './table/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '空位推送',
    components: SpacePushTable,
    chartComponent: SpacePushChart,
    secondShow: false,
  },
]);

const activeName = ref('空位推送');
const secondShow = ref(false);

const tabChange = () => {};

const handleChartRefresh = (filters, activeTab) => {
  const eventMap = {
    '空位推送': 'space-push-chart-refresh',
  };
  const eventName = eventMap[activeTab];
  if (eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: filters }));
  }
};
</script>

<template>
  <div class="common-index">
    <component
      :is="tabArray.find(item => item.label === activeName)?.chartComponent"
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
        <component :is="item.components" :second-show="item.secondShow" :key="item.label" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
