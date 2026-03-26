<script setup>
import { computed, ref } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { getStatsDataByTab } from './table/data.js';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
};

const tabArray = ref([
  {
    label: '发票申请',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '发票生成',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '发票查询',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('发票申请');
const secondShow = ref(false);

// 当前选中的标签页名称
const currentTab = ref('发票申请');

// 获取当前标签页的统计数据
const statsData = computed(() => {
  return getStatsDataByTab(currentTab.value);
});

// 监听标签页切换，更新当前标签页名称
const tabChange = (tabName) => {
  activeName.value = tabName;
  currentTab.value = tabName;
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
          :active-tab="activeName"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
          :key="activeName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
