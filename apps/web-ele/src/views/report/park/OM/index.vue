<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import EfficiencyChart from './efficiency/efficiencychart.vue';
import EfficiencyReport from './efficiency/index.vue';
import EquipmentChart from './equipment/equipmentchart.vue';
import EquipmentReport from './equipment/index.vue';
import FaultChart from './fault/faultchart.vue';
import FaultReport from './fault/index.vue';
import StaffReport from './staff/index.vue';
import StaffChart from './staff/staffchart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '设备运行报表',
    components: EquipmentReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '故障统计报表',
    components: FaultReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '运维效率报表',
    components: EfficiencyReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '运维人员绩效考核报表',
    components: StaffReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);

const activeName = ref('设备运行报表');
const secondShow = ref(false);

// 全局图表显示状态
const showStats = ref(false);
const toggleStats = () => {
  showStats.value = !showStats.value;
};
</script>
<template>
  <div class="common-index">
    <EquipmentChart v-if="showStats && activeName === '设备运行报表'" />
    <FaultChart v-if="showStats && activeName === '故障统计报表'" />
    <EfficiencyChart v-if="showStats && activeName === '运维效率报表'" />
    <StaffChart v-if="showStats && activeName === '运维人员绩效考核报表'" />
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
