<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import Approve from './approve/table/index.vue';
import ApproveChart from './approve/approvechart.vue';
import TaskTable from '#/views/dashboard/todo/task/table/index.vue';
import Taskechart from '#/views/dashboard/todo/task/taskechart.vue';
import Work from './work/table/index.vue';
import Workechart from './work/workechart.vue';
import Alarm from './alarm/table/index.vue';
import Alarmechart from './alarm/alarmechart.vue';
import Inspection from './inspection/table/index.vue';
import Inspectionechart from './inspection/inspectionechart.vue';
import Schedule from './schedule/table/index.vue';
import Scheduleechart from './schedule/scheduleechart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
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
  {
    label: '预警',
    components: Alarm,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '巡检',
    components: Inspection,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '排班',
    components: Schedule,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);

const activeName = ref('我的任务');
const secondShow = ref(false);

// 全局图表显示状态
const showStats = ref(false);
const toggleStats = () => {
  showStats.value = !showStats.value;
};
</script>
<template>
  <div class="common-index">
    <Taskechart v-if="showStats && activeName === '我的任务'" />
    <ApproveChart v-if="showStats && activeName === '审批'" />
    <Workechart v-if="showStats && activeName === '工单'" />
    <Alarmechart v-if="showStats && activeName === '预警'"/>
    <Inspectionechart v-if="showStats && activeName === '巡检'"/>
    <Scheduleechart v-if="showStats && activeName === '排班'" />
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
