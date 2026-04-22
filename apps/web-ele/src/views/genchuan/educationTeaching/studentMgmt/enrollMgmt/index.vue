<!-- 文件6: src/views/genchuan/educationTeaching/studentMgmt/enrollMgmt/index.vue -->
<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
// 报名管理组件
import registerMgmt from './registerMgmt/index.vue';
import registerMgmtChart from './registerMgmt/components/chart.vue';
// 分班管理组件
import classAssignMgmt from './classAssign/index.vue';
import classAssignChart from './classAssign/components/chart.vue';
// 报到管理组件
import checkInMgmt from './checkIn/index.vue';
import checkInChart from './checkIn/components/chart.vue';
// 宿舍分配组件
import dormAssignMgmt from './dormAssign/index.vue';
import dormAssignChart from './dormAssign/components/chart.vue';
// 宣传管理组件
import promoteMgmt from './promoteMgmt/index.vue';
import promoteMgmtChart from './promoteMgmt/components/chart.vue';
// 迎新推送组件
import newPushMgmt from './newPush/index.vue';
import newPushChart from './newPush/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '报名管理',
    components: registerMgmt,
    chartComponent: registerMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '分班管理',
    components: classAssignMgmt,
    chartComponent: classAssignChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '报到管理',
    components: checkInMgmt,
    chartComponent: checkInChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '宿舍分配',
    components: dormAssignMgmt,
    chartComponent: dormAssignChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '宣传管理',
    components: promoteMgmt,
    chartComponent: promoteMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '迎新推送',
    components: newPushMgmt,
    chartComponent: newPushChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('报名管理');
const secondShow = ref(false);

// 报名管理组件引用
const registerMgmtRef = ref(null);
const setRegisterMgmtRef = (el) => {
  if (el) registerMgmtRef.value = el;
};

// 分班管理组件引用
const classAssignMgmtRef = ref(null);
const setClassAssignMgmtRef = (el) => {
  if (el) classAssignMgmtRef.value = el;
};

// 报到管理组件引用
const checkInMgmtRef = ref(null);
const setCheckInMgmtRef = (el) => {
  if (el) checkInMgmtRef.value = el;
};

// 宿舍分配组件引用
const dormAssignMgmtRef = ref(null);
const setDormAssignMgmtRef = (el) => {
  if (el) dormAssignMgmtRef.value = el;
};

// 宣传管理组件引用
const promoteMgmtRef = ref(null);
const setPromoteMgmtRef = (el) => {
  if (el) promoteMgmtRef.value = el;
};

// 迎新推送组件引用
const newPushMgmtRef = ref(null);
const setNewPushMgmtRef = (el) => {
  if (el) newPushMgmtRef.value = el;
};

// ========== 报名管理图表事件 ==========
const onRegisterCardSelect = async (status) => {
  await nextTick();
  if (!registerMgmtRef.value) {
    ElMessage.warning('报名管理列表组件未就绪');
    return;
  }
  registerMgmtRef.value.clearFilters();
  if (status === 'pending') {
    registerMgmtRef.value.handleFilterTagClick('status', '待审核');
  } else if (status === 'admitted') {
    registerMgmtRef.value.handleFilterTagClick('status', '已录取');
  }
};

const onRegisterBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!registerMgmtRef.value) {
    ElMessage.warning('报名管理列表组件未就绪');
    return;
  }
  registerMgmtRef.value.handleFilterTagClick('major', value);
};

const onRegisterLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选报名记录`);
};

// ========== 分班管理图表事件 ==========
const onClassAssignCardSelect = async (statusType) => {
  await nextTick();
  if (!classAssignMgmtRef.value) {
    ElMessage.warning('分班管理列表组件未就绪');
    return;
  }
  classAssignMgmtRef.value.clearFilters();
  if (statusType === 'unassigned') {
    classAssignMgmtRef.value.handleFilterTagClick('status', '未分班');
  } else if (statusType === 'assigned') {
    classAssignMgmtRef.value.handleFilterTagClick('status', '已分班');
  }
};

const onClassAssignPieSelect = async ({ name, type }) => {
  await nextTick();
  if (!classAssignMgmtRef.value) {
    ElMessage.warning('分班管理列表组件未就绪');
    return;
  }
  if (type === 'class') {
    classAssignMgmtRef.value.handleFilterTagClick('className', name);
  } else if (type === 'major') {
    classAssignMgmtRef.value.handleFilterTagClick('ruleContent', name);
  }
};

const onClassAssignLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选分班记录`);
};

// ========== 报到管理图表事件 ==========
const onCheckInCardSelect = async (statusType) => {
  await nextTick();
  if (!checkInMgmtRef.value) {
    ElMessage.warning('报到管理列表组件未就绪');
    return;
  }
  checkInMgmtRef.value.clearFilters();
  if (statusType === 'wait') {
    checkInMgmtRef.value.handleFilterTagClick('status', '待确认');
  } else if (statusType === 'total') {
    checkInMgmtRef.value.handleFilterTagClick('status', '已报到');
  }
};

const onCheckInLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选报到记录`);
};

// ========== 宿舍分配图表事件 ==========
const onDormAssignCardSelect = async (statusType) => {
  await nextTick();
  if (!dormAssignMgmtRef.value) {
    ElMessage.warning('宿舍分配列表组件未就绪');
    return;
  }
  dormAssignMgmtRef.value.clearFilters();
  if (statusType === 'assigned') {
    dormAssignMgmtRef.value.handleFilterTagClick('status', '已分配');
  } else if (statusType === 'empty') {
    dormAssignMgmtRef.value.handleFilterTagClick('status', '未分配');
  }
};

const onDormAssignBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!dormAssignMgmtRef.value) {
    ElMessage.warning('宿舍分配列表组件未就绪');
    return;
  }
  dormAssignMgmtRef.value.handleFilterTagClick('dormNum', value);
};

// ========== 宣传管理图表事件 ==========
const onPromoteCardSelect = async (statusType) => {
  await nextTick();
  if (!promoteMgmtRef.value) {
    ElMessage.warning('宣传管理列表组件未就绪');
    return;
  }
  promoteMgmtRef.value.clearFilters();
  if (statusType === 'wait') {
    promoteMgmtRef.value.handleFilterTagClick('status', '未执行');
  } else if (statusType === 'finished') {
    promoteMgmtRef.value.handleFilterTagClick('status', '已执行');
  }
};

const onPromoteBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!promoteMgmtRef.value) {
    ElMessage.warning('宣传管理列表组件未就绪');
    return;
  }
  promoteMgmtRef.value.handleFilterTagClick('site', value);
};

const onPromoteLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选宣传记录`);
};

// ========== 迎新推送图表事件 ==========
const onNewPushCardSelect = async (statusType) => {
  await nextTick();
  if (!newPushMgmtRef.value) {
    ElMessage.warning('迎新推送列表组件未就绪');
    return;
  }
  newPushMgmtRef.value.clearFilters();
  if (statusType === 'finished') {
    newPushMgmtRef.value.handleFilterTagClick('status', '已推送');
  } else if (statusType === 'total') {
    // 总任务数不清空，或者可以不做筛选
  }
  // 推送完成率不跳转
};

const onNewPushLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选推送记录`);
};

const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 报名管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '报名管理'"
      :is="currentChartComponent"
      @cardSelect="onRegisterCardSelect"
      @barSelect="onRegisterBarSelect"
      @lineSelect="onRegisterLineSelect"
    />
    <!-- 分班管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '分班管理'"
      :is="currentChartComponent"
      @cardSelect="onClassAssignCardSelect"
      @pieSelect="onClassAssignPieSelect"
      @lineSelect="onClassAssignLineSelect"
    />
    <!-- 报到管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '报到管理'"
      :is="currentChartComponent"
      @cardSelect="onCheckInCardSelect"
      @lineSelect="onCheckInLineSelect"
    />
    <!-- 宿舍分配图表 -->
    <component
      v-if="currentArrowShow && activeName === '宿舍分配'"
      :is="currentChartComponent"
      @cardSelect="onDormAssignCardSelect"
      @barSelect="onDormAssignBarSelect"
    />
    <!-- 宣传管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '宣传管理'"
      :is="currentChartComponent"
      @cardSelect="onPromoteCardSelect"
      @barSelect="onPromoteBarSelect"
      @lineSelect="onPromoteLineSelect"
    />
    <!-- 迎新推送图表 -->
    <component
      v-if="currentArrowShow && activeName === '迎新推送'"
      :is="currentChartComponent"
      @cardSelect="onNewPushCardSelect"
      @lineSelect="onNewPushLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 报名管理组件 -->
        <component
          v-if="item.label === '报名管理'"
          :is="item.components"
          :ref="setRegisterMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 分班管理组件 -->
        <component
          v-else-if="item.label === '分班管理'"
          :is="item.components"
          :ref="setClassAssignMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 报到管理组件 -->
        <component
          v-else-if="item.label === '报到管理'"
          :is="item.components"
          :ref="setCheckInMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 宿舍分配组件 -->
        <component
          v-else-if="item.label === '宿舍分配'"
          :is="item.components"
          :ref="setDormAssignMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 宣传管理组件 -->
        <component
          v-else-if="item.label === '宣传管理'"
          :is="item.components"
          :ref="setPromoteMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 迎新推送组件 -->
        <component
          v-else
          :is="item.components"
          :ref="setNewPushMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
