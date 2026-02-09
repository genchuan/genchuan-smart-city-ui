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
const arrowChange = (index) => {
  tabArray.value[index].arrowShow = !tabArray.value[index].arrowShow;
};
const tabArray = ref([
  {
    label: '日运营数据报表',
    components: DailyReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '月运营数据报表',
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
const tabChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = false;
  });
};
const activeName = ref('日运营数据报表');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <DailyChart v-if="tabArray[0].arrowShow" />
    <MonthlyChart v-if="tabArray[1].arrowShow" />
    <TrendChart v-if="tabArray[2].arrowShow" />
    <WashCardChart v-if="tabArray[3].arrowShow" />
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
