<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import Approve from './approve/index.vue';
import ApproveChart from './approvechart.vue';
import TaskTable from './table/index.vue';
import Taskechart from './taskechart.vue';
import Work from './work/index.vue';
import Workechart from './workechart.vue';
// import Alarm from './alarm/index.vue';

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
    label: '我的任务',
    components: TaskTable,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '审批',
    components: Approve,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '工单',
    components: Work,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  // {
  //   label: '预警',
  //   components: Alarm,
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
const activeName = ref('我的任务');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
    <Taskechart v-if="tabArray[0].arrowShow" />
    <ApproveChart v-if="tabArray[1].arrowShow" />
    <Workechart v-if="tabArray[2].arrowShow" />
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
