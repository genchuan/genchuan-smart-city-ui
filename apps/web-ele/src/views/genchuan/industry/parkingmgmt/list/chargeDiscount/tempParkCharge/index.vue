<script setup>
import { computed, ref } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import StatsVisualization from '#/components/stats/StatsVisualization.vue';

import { getStatsDataByTabType } from './table/data.js';
import Table from './table/index.vue';

import '#/components/page/index.scss';

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
};

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '收费规则管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabType: 'chargeRule',
  },
  {
    label: '费用核算管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabType: 'feeCalculation',
  },
  {
    label: '优惠抵扣管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabType: 'discountManagement',
  },
]);
const activeName = ref('收费规则管理');
const secondShow = ref(false);

// 当前选中的标签类型
const currentTabType = ref('chargeRule');

// 获取当前标签类型的统计数据
const statsData = computed(() => {
  return getStatsDataByTabType(currentTabType.value);
});

// 监听标签页切换，更新当前标签类型
const tabChange = (tabName) => {
  activeName.value = tabName;
  // 根据标签页名称更新当前标签类型
  const tab = tabArray.value.find((item) => item.label === tabName);
  if (tab) {
    currentTabType.value = tab.tabType;
  }
};
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <StatsVisualization v-if="showStats" :data="statsData" />
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
          :tab-type="item.tabType"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
