<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import EscapeReport from './escape/index.vue';
import EscapeChart from './escape/escapechart.vue';
import DeviceReport from './device/index.vue';
import DeviceChart from './device/devicechart.vue';
// import ChargeReport from './charge/index.vue';
// import ChargeChart from './charge/chargechart.vue';

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
  {
    label: '逃费数据报表',
    components: EscapeReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '设备异常数据报表',
    components: DeviceReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  // {
  //   label: '收费异常报表',
  //   components: ChargeReport,
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
const activeName = ref('逃费数据报表');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <EscapeChart v-if="tabArray[0].arrowShow" />
    <DeviceChart v-if="tabArray[1].arrowShow" />
<!--    <ChargeChart v-if="tabArray[2].arrowShow" />-->
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
