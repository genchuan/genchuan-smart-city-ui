<script setup>
import { ref, computed } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import StatsVisualization from '#/components/stats/StatsVisualization.vue';

import Table from './table/index.vue';

import '#/components/page/index.scss';

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
};

// 当前选中的标签页名称
const activeTabName = ref('充值订单');

// 监听标签页切换，更新当前标签页名称
const tabChange = (tabName) => {
  activeTabName.value = tabName;
};

// 导入获取统计数据的函数
import { getStatsDataByTabName } from './table/data';

// 根据当前标签页获取统计数据
const statsData = computed(() => {
  return getStatsDataByTabName(activeTabName.value);
});

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '充值订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '充值记录',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '充值优惠管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '储值卡管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('充值订单');
const secondShow = ref(false);
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
          :tab-name="item.label"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
