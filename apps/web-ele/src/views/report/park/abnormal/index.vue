<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import EscapeReport from './escape/index.vue';
import EscapeChart from './escape/escapechart.vue';
import DeviceReport from './device/index.vue';
import DeviceChart from './device/devicechart.vue';
import ChargeReport from './charge/index.vue';
import ChargeChart from './charge/chargechart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
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
  {
    label: '收费异常报表',
    components: ChargeReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);

const activeName = ref('逃费数据报表');
const secondShow = ref(false);

// 全局图表显示状态
const showStats = ref(false);
const toggleStats = () => {
  showStats.value = !showStats.value;
};
</script>
<template>
  <div class="common-index">
    <EscapeChart v-if="showStats && activeName === '逃费数据报表'"/>
    <DeviceChart v-if="showStats && activeName === '设备异常数据报表'" />
    <ChargeChart v-if="showStats && activeName === '收费异常报表'" />
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
          :arrow-show="item.showStats"
          @arrow-change="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
