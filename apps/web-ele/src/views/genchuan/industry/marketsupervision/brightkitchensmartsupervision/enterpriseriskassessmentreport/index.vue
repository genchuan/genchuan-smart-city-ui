<script setup>
import { ref } from 'vue';

import monitor from './monitor/index.vue';
import monitorchart from './monitor/table/chart.vue';
import reportchart from './report/customize/chart.vue';
import report from './report/index.vue';

import '#/components/page/index.scss';

const tabArray = ref([
  {
    label: '月报',
    components: monitor,
    showSecondary: false,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
    chartComponet: monitorchart,
  },
  {
    label: '自定义报表',
    components: report,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
    chartComponet: reportchart,
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
    <!-- <component :is="chartComponet.components" /> -->
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
      padding-right: 10px !important;
    }
    :deep(.el-tabs__item:nth-child(2)) {
      padding-left: 10px !important;
    }
  }
}
</style>
