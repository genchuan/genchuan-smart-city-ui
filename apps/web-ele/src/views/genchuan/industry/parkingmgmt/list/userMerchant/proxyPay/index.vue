<script setup>
import { computed, ref } from 'vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import StatsVisualization from '#/components/stats/StatsVisualization.vue';
import Table from './table/index.vue';

import { getStatsDataByTabName } from './table/data.js';

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
    label: '代付规则',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabName: 'proxyRule',
  },
  {
    label: '代付订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabName: 'proxyOrder',
  },
  {
    label: '代付记录',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabName: 'proxyRecord',
  },
]);
const activeName = ref('代付规则');
const secondShow = ref(false);

// 当前选中的标签页名称
const currentTabName = computed(() => {
  const tab = tabArray.value.find((item) => item.label === activeName.value);
  return tab ? tab.tabName : 'proxyRule';
});

// 获取当前标签页的统计数据
const statsData = computed(() => {
  return getStatsDataByTabName(currentTabName.value);
});

// 标签页切换事件处理
const tabChange = (tabName) => {
  activeName.value = tabName;
};
</script>
<template>
  <div class="proxy-pay-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <StatsVisualization v-if="showStats" :data="statsData" />
    <div class="common-index">
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
            :tab-name="item.tabName"
            :show-stats="showStats"
            :toggle-stats="toggleStats"
            :key="item.label"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.proxy-pay-index {
  height: 88vh;
  overflow: auto;
}
</style>
