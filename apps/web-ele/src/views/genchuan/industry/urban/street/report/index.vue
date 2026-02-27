<script setup>
import { ref } from 'vue';

import CustomizeTable from './customize/index.vue';
import Daytable from './day/index.vue';
import Halftable from './half/index.vue';
import Montlytable from './montly/index.vue';
import Seasontable from './season/index.vue';
import Weektable from './week/index.vue';
import Yeartable from './year/index.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const activeName = ref('日报');

const tabsData = ref([
  { label: '日报', component: Daytable },
  { label: '周报', component: Weektable },
  { label: '月报', component: Montlytable },
  { label: '季报', component: Seasontable },
  { label: '半年报', component: Halftable },
  { label: '年报', component: Yeartable },
  { label: '自定义报表', component: CustomizeTable },
]);
const handleClick = (item) => {
  const nowObj = tabsData.value.find((v) => v.label === item);
  isComponent.value.now = nowObj.component;
};
const isComponent = ref({
  now: Daytable,
});
</script>
<template>
  <div class="monitor-index">
    <div class="tabel-tabs">
      <el-tabs
        v-if="props.secondShow"
        v-model="activeName"
        class="demo-tabs"
        @tab-change="handleClick"
      >
        <el-tab-pane
          v-for="item in tabsData"
          :key="item.label"
          :label="item.label"
          :name="item.label"
        />
      </el-tabs>
    </div>
    <component
      :second-show="props.secondShow"
      :arrow-show="props.arrowShow"
      @arrow-change="arrowChange"
      :is="isComponent.now"
      :class="props.secondShow ? 'second-show-table' : 'second-table'"
    />
  </div>
</template>
<style lang="scss">
.monitor-index {
  margin-top: 35px;

  .tabel-tabs {
    height: 40px;
  }

  .second-table {
    margin-top: -75px;
  }

  .second-show-table {
    margin-top: -75px;

    .vxe-grid--table-container {
      margin-top: 40px;
    }
  }
}
</style>
