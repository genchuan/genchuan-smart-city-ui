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

const activeName = ref('泊位占用报表');
const secondShow = ref(false);

// 全局图表显示状态
const showStats = ref(false);
const toggleStats = () => {
  showStats.value = !showStats.value;
};
</script>
<template>
  <div class="common-index">
        <OccupancyChart v-if="showStats && activeName === '泊位占用报表'" />
        <VacancyChart v-if="showStats && activeName === '泊位空置报表'" />
        <UsagerateChart v-if="showStats && activeName === '泊位利用率报表'" />
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
          :arrow-show="showStats"
          @arrow-change="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
