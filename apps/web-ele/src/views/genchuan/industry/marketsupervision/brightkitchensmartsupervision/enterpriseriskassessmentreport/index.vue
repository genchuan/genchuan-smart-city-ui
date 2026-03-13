<script setup>
import { ref } from 'vue';

import monitor from './monitor/index.vue';
import report from './report/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '月报',
    components: monitor,
    showSecondary: false,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '自定义报表',
    components: report,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};
const activeName = ref('月报');
const secondShow = ref(false);
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
};
const chartComponet = ref({
  components: '',
});
const getComponent = (echart) => {
  chartComponet.value.components = echart;
};
</script>
<template>
  <div class="common-index">
    <component :is="chartComponet.components" v-if="tabArray[0].arrowShow" />

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
          @get-component="getComponent"
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
  }
}
</style>
