<script setup>
import {ref, computed} from 'vue';

import chargingStation from './chargingStation/index.vue';
import chargingStationChart from './chargingStation/components/chart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '充电场站管理',
    components: chargingStation,
    chartComponent: chargingStationChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('充电场站管理');
const secondShow = ref(false);

// 计算当前激活的tab对象
const currentTab = computed(() => {
  return tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0];
});

// 计算当前chart组件
const currentChartComponent = computed(() => {
  return currentTab.value.chartComponent;
});

// 计算当前arrowShow状态
const currentArrowShow = computed(() => {
  return currentTab.value.arrowShow;
});
</script>

<template>
  <div class="common-index">
    <!-- 动态显示当前tab对应的chart组件 -->
    <component
      v-if="currentArrowShow"
      :is="currentChartComponent"
    />

<!--    <div class="icon-change">-->
<!--      <el-icon-->
<!--        class="tabel-tab-icon"-->
<!--        v-if="secondShow"-->
<!--        @click="changeArrowStatus"-->
<!--      >-->
<!--        <ArrowDown/>-->
<!--      </el-icon>-->
<!--      <el-icon-->
<!--        class="tabel-tab-icon"-->
<!--        v-if="!secondShow"-->
<!--        @click="changeArrowStatus"-->
<!--      >-->
<!--        <ArrowUp/>-->
<!--      </el-icon>-->
<!--    </div>-->

    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
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
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
