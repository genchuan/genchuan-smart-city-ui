<script setup>
import { computed, ref } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { getStatsDataByRateType } from './table/data';
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
    label: '基础费率管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    rateType: 'base',
  },
  {
    label: '时段费率管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    rateType: 'time',
  },
  {
    label: '区域费率管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    rateType: 'area',
  },
]);

const activeName = ref('基础费率管理');
const secondShow = ref(false);
const currentRateType = ref('base');

// 获取当前费率类型的统计数据
const statsData = computed(() => {
  return getStatsDataByRateType(currentRateType.value);
});

// 标签页切换事件
const tabChange = (tabName) => {
  activeName.value = tabName;
  // 根据标签页名称更新当前费率类型
  const tab = tabArray.value.find((item) => item.label === tabName);
  if (tab) {
    currentRateType.value = tab.rateType;
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
          :rate-type="item.rateType"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
