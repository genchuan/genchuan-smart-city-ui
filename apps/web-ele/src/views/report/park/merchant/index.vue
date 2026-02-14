<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import DailyReport from './daily/index.vue';
import DailyChart from './daily/dailychart.vue';
import MonthlyReport from './monthly/index.vue';
import MonthlyChart from './monthly/monthlychart.vue';
import RevenueReport from './revenue/index.vue';
import RevenueChart from './revenue/revenuechart.vue';

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
    label: '商户营收报表',
    components: RevenueReport,
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
    <!-- 图表区域：根据全局状态和当前激活标签显示对应图表 -->
    <DailyChart v-if="showStats && activeName === '日运营报表'" />
    <MonthlyChart v-if="showStats && activeName === '月运营报表'" />
    <RevenueChart v-if="showStats && activeName === '商户营收报表'" />

    <!-- 原有二级显示控制按钮 -->
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
    >
      <el-tab-pane
        v-for="(item) in tabArray"
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
