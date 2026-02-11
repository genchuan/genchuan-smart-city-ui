<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

// import EquipmentReport from './equipment/index.vue';
// import EquipmentChart from './equipment/equipmentchart.vue';
// import FaultReport from './fault/index.vue';
// import FaultChart from './fault/faultchart.vue';
// import EfficiencyReport from './efficiency/index.vue';
// import EfficiencyChart from './efficiency/efficiencychart.vue';
// import StaffReport from './staff/index.vue';
// import StaffChart from './staff/Staffchart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const arrowChange = (index) => {
  tabArray.value[index].arrowShow = !tabArray.value[index].arrowShow;
};
const tabArray = ref([
  // {
  //   label: '设备运行报表',
  //   components: EquipmentReport,
  //   showSecondary: true,
  //   secondShow: false,
  //   arrowShow: false,
  //   arrowState: false,
  // },
  // {
  //   label: '故障统计报表',
  //   components: FaultReport,
  //   showSecondary: true,
  //   secondShow: false,
  //   arrowShow: false,
  //   arrowState: false,
  // },
  // {
  //   label: '运维效率报表',
  //   components: EfficiencyReport,
  //   showSecondary: true,
  //   secondShow: false,
  //   arrowShow: false,
  //   arrowState: false,
  // },
  // {
  //   label: '运维人员绩效考核报表',
  //   components: StaffReport,
  //   showSecondary: true,
  //   secondShow: false,
  //   arrowShow: false,
  //   arrowState: false,
  // },
]);
const tabChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = false;
  });
};
const activeName = ref('设备运行报表');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
<!--    <EquipmentChart v-if="tabArray[0].arrowShow" />-->
<!--    <FaultChart v-if="tabArray[1].arrowShow" />-->
<!--    <EfficiencyChart v-if="tabArray[2].arrowShow" />-->
<!--    <StaffChart v-if="tabArray[3].arrowShow"/>-->
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
        v-for="(item, index) in tabArray"
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
          @arrow-change="arrowChange(index)"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
