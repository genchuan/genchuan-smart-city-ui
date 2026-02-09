<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import OccupancyReport from './occupancy/index.vue';
import OccupancyChart from './occupancy/occupancychart.vue';
import VacancyReport from './vacancy/index.vue';
import VacancyChart from './vacancy/vacancychart.vue';
import UsagerateReport from './usagerate/index.vue';
import UsagerateChart from './usagerate/usageratechart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const arrowChange = (index) => {
  tabArray.value[index].arrowShow = !tabArray.value[index].arrowShow;
};
const tabArray = ref([
  {
    label: '泊位占用报表',
    components: OccupancyReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '泊位空置报表',
    components: VacancyReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '泊位利用率报表',
    components: UsagerateReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);
const tabChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = false;
  });
};
const activeName = ref('泊位占用报表');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <OccupancyChart v-if="tabArray[0].arrowShow" />
    <VacancyChart v-if="tabArray[1].arrowShow" />
    <UsagerateChart v-if="tabArray[2].arrowShow" />
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
        v-for="(item, index) in tabArray"
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
          @arrow-change="arrowChange(index)"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
