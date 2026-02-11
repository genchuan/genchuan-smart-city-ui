<script setup>
import { computed, ref } from 'vue';

import StatsVisualization from '#/components/stats/StatsVisualization.vue';
import Table from './table/index.vue';
import { dataList, getStatsData } from './table/data';

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
    label: '终端设备信息',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('终端设备信息');
const secondShow = ref(false);

// 统计数据
const statsData = computed(() => {
  // 根据当前标签页筛选数据
  let filteredData = dataList();
  if (activeName.value !== '终端设备信息') {
    // 这里可以根据实际标签页逻辑进行筛选
    // 例如：如果标签页是状态筛选，可以根据deviceStatusName筛选
  }
  return getStatsData(filteredData);
});

const tabChange = (tabName) => {
  activeName.value = tabName;
  // 标签页切换时，统计数据会自动更新
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
          :show-stats="showStats"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
