<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import DailyReport from './daily/index.vue';
import DailyChart from './daily/dailychart.vue';
import MonthlyReport from './monthly/index.vue';
import MonthlyChart from './monthly/monthlychart.vue';
import TrendReport from './trend/index.vue';
import TrendChart from './trend/trendchart.vue';
import WashCardReport from './washcard/index.vue';
import WashCardChart from './washcard/washcardchart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '日运营报表',
    components: DailyReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '月运营报表',
    components: MonthlyReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '运营趋势报表',
    components: TrendReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '洗车卡运营报表',
    components: WashCardReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);

const activeName = ref('日运营报表');
const secondShow = ref(false);

// 全局图表显示状态
const showStats = ref(false);
const toggleStats = () => {
  showStats.value = !showStats.value;
};
</script>
<template>
  <div class="common-index">
    <DailyChart v-if="showStats && activeName === '日运营报表'" />
    <MonthlyChart v-if="showStats && activeName === '月运营报表'" />
    <TrendChart v-if="showStats && activeName === '运营趋势报表'" />
    <WashCardChart v-if="showStats && activeName === '洗车卡运营报表'" />
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
