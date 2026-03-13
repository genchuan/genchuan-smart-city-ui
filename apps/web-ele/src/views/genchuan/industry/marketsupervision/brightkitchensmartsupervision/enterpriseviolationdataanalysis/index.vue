<script setup>
import { ref } from 'vue';

import customize from './customize/index.vue';
import customizechart from './customize/table/chart.vue';
import monitor from './day/index.vue';
import monitorchart from './day/table/chart.vue';
import half from './half/index.vue';
import halfchart from './half/table/chart.vue';
import month from './month/index.vue';
import monthchart from './month/table/chart.vue';
import season from './season/index.vue';
import seasonchart from './season/table/chart.vue';
import week from './week/index.vue';
import weekchart from './week/table/chart.vue';
import year from './year/index.vue';
import yearchart from './year/table/chart.vue';

import '#/components/page/index.scss';

const tabArray = ref([
  {
    label: '日报',
    components: monitor,
    showSecondary: false,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    chartComponet: monitorchart,
  },
  {
    label: '周报',
    components: week,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
    chartComponet: weekchart,
  },
  {
    label: '月报',
    components: month,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
    chartComponet: monthchart,
  },
  {
    label: '季报',
    components: season,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
    chartComponet: seasonchart,
  },
  {
    label: '半年报',
    components: half,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
    chartComponet: halfchart,
  },
  {
    label: '年报',
    components: year,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
    chartComponet: yearchart,
  },
  {
    label: '自定义报表',
    components: customize,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
    chartComponet: customizechart,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};
const activeName = ref('月报');
const tabChange = (item) => {
  tabArray.value.forEach((v) => {
    v.showSecondary = false;
    v.secondShow = false;
    v.arrowShow = false;
    v.arrowState = false;
  });
  const nowObj = tabArray.value.find((v) => v.label === item);
  nowObj.arrowShow = true;
  nowObj.arrowState = true;
  nowObj.secondShow = true;
  chartComponet.value.components = nowObj.chartComponet;
};
const chartComponet = ref({
  components: monitorchart,
});
</script>
<template>
  <div class="common-index">
    <component :is="chartComponet.components" />
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
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped lang="scss">
.common-index {
  .common-tabs {
    :deep(.el-tabs__nav) {
      margin-left: 0px !important;
    }
    :deep(.el-tabs__item) {
      padding-right: 5px !important;
    }
    :deep(.el-tabs__item:nth-child(2)) {
      padding-left: 5px !important;
    }
  }
}
</style>
