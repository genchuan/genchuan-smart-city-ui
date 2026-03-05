<script setup>
import {ref, computed} from 'vue';

import GarbageCollection from '../sanitationSceneMgmt/garbageCollection/index.vue';
import GarbageCollectionChart from '../sanitationSceneMgmt/garbageCollection/chart.vue';
import PublicToilet from '../sanitationSceneMgmt/publicToilet/index.vue';
import PublicToiletChart from '../sanitationSceneMgmt/publicToilet/chart.vue';
import RoadCleaning from '../sanitationSceneMgmt/roadCleaning/index.vue';
import RoadCleaningChart from '../sanitationSceneMgmt/roadCleaning/chart.vue';
import garbageTransfer from '../sanitationSceneMgmt/garbageTransfer/index.vue';
import garbageTransferChart from '../sanitationSceneMgmt/garbageTransfer/chart.vue';
import publicInstitution from '../sanitationSceneMgmt/publicInstitution/index.vue';
import publicInstitutionChart from '../sanitationSceneMgmt/publicInstitution/chart.vue';
import commercialStreet from '../sanitationSceneMgmt/commercialStreet/index.vue';
import commercialStreetChart from '../sanitationSceneMgmt/commercialStreet/chart.vue';
import parkEnvironment from '../sanitationSceneMgmt/parkEnvironment/index.vue';
import parkEnvironmentChart from '../sanitationSceneMgmt/parkEnvironment/chart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '垃圾收运管理',
    components: GarbageCollection,
    chartComponent: GarbageCollectionChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '公厕运营管理',
    components: PublicToilet,
    chartComponent: PublicToiletChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '道路清扫管理',
    components: RoadCleaning,
    chartComponent: RoadCleaningChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '垃圾转运站管理',
    components: garbageTransfer,
    chartComponent: garbageTransferChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '公共机构环境管理',
    components: publicInstitution,
    chartComponent: publicInstitutionChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '商业街环境管理',
    components: commercialStreet,
    chartComponent: commercialStreetChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '公园环境管理',
    components: parkEnvironment,
    chartComponent: parkEnvironmentChart,
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

const activeName = ref('垃圾收运管理');
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

    <div class="icon-change">
      <el-icon
        class="tabel-tab-icon"
        v-if="secondShow"
        @click="changeArrowStatus"
      >
        <ArrowDown/>
      </el-icon>
      <el-icon
        class="tabel-tab-icon"
        v-if="!secondShow"
        @click="changeArrowStatus"
      >
        <ArrowUp/>
      </el-icon>
    </div>

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
