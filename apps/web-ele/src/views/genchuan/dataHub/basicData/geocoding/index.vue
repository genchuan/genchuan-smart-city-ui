<script setup>
import { computed, ref } from 'vue';

import StatsVisualization from '#/components/stats/StatsVisualization.vue';

import Table from './table/index.vue';
import { getGeocodingStatsData, dataList } from './table/data.js';

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
    label: '地理编码管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    showStats: showStats,
    toggleStats: toggleStats
  },
]);
const activeName = ref('地理编码管理');
const secondShow = ref(false);

// 获取地理编码统计数据
const statsData = computed(() => {
  return getGeocodingStatsData();
});

// 获取地理编码地图数据
const mapData = computed(() => {
  return dataList();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <StatsVisualization 
      v-if="showStats" 
      :data="statsData" 
      :show-map-toggle="true" 
      :map-data="mapData"
    />
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
