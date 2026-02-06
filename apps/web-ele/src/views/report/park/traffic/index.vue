<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import EntryReport from './entry/index.vue';
import EntryChart from './entry/entrychart.vue';
// 新增出场车流组件引入
import ExitReport from './exit/index.vue';
import ExitChart from './exit/exitchart.vue';
// 其他报表组件...

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
    label: '入场车流报表',
    components: EntryReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '出场车流报表',
    components: ExitReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  // 其他报表配置...
]);
const tabChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = false;
  });
};
const activeName = ref('入场车流报表');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <EntryChart v-if="tabArray[0].arrowShow" />
    <ExitChart v-if="tabArray[1].arrowShow" />
    <!-- 其他图表... -->
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
