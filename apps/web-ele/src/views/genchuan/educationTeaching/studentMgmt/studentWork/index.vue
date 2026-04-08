<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import studentInfo from './studentInfo/index.vue';
import studentInfoChart from './studentInfo/components/chart.vue';
import honorMgmt from './honorMgmt/index.vue';
import honorMgmtChart from './honorMgmt/components/chart.vue';
import assessMgmt from './assessMgmt/index.vue';
import assessMgmtChart from './assessMgmt/components/chart.vue';
import violateMgmt from './violateMgmt/index.vue';
import violateMgmtChart from './violateMgmt/components/chart.vue';
import mentalMgmt from './mentalMgmt/index.vue';
import mentalMgmtChart from './mentalMgmt/components/chart.vue';
import behaviorMgmt from './behaviorMgmt/index.vue';
import behaviorMgmtChart from './behaviorMgmt/components/chart.vue';
import fundSystem from './fundSystem/index.vue';
import fundSystemChart from './fundSystem/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '学生信息',
    components: studentInfo,
    chartComponent: studentInfoChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '荣誉管理',
    components: honorMgmt,
    chartComponent: honorMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '考评管理',
    components: assessMgmt,
    chartComponent: assessMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '违纪管理',
    components: violateMgmt,
    chartComponent: violateMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '心理管理',
    components: mentalMgmt,
    chartComponent: mentalMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '行为管理',
    components: behaviorMgmt,
    chartComponent: behaviorMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '资助系统',
    components: fundSystem,
    chartComponent: fundSystemChart,
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

const activeName = ref('学生信息');
const secondShow = ref(false);

// 各模块组件引用
const studentInfoRef = ref(null);
const setStudentInfoRef = (el) => {
  if (el) studentInfoRef.value = el;
};

const honorMgmtRef = ref(null);
const setHonorMgmtRef = (el) => {
  if (el) honorMgmtRef.value = el;
};

const assessMgmtRef = ref(null);
const setAssessMgmtRef = (el) => {
  if (el) assessMgmtRef.value = el;
};

const violateMgmtRef = ref(null);
const setViolateMgmtRef = (el) => {
  if (el) violateMgmtRef.value = el;
};

const mentalMgmtRef = ref(null);
const setMentalMgmtRef = (el) => {
  if (el) mentalMgmtRef.value = el;
};

const behaviorMgmtRef = ref(null);
const setBehaviorMgmtRef = (el) => {
  if (el) behaviorMgmtRef.value = el;
};

const fundSystemRef = ref(null);
const setFundSystemRef = (el) => {
  if (el) fundSystemRef.value = el;
};

// ==================== 学生信息图表事件 ====================
const onStudentPieSelect = async ({ field, value }) => {
  await nextTick();
  if (!studentInfoRef.value) {
    ElMessage.warning('学生信息列表组件未就绪');
    return;
  }
  if (field === 'grade') ElMessage.info('年级筛选暂未实现');
  else if (field === 'major') studentInfoRef.value.handleFilterTagClick('major', value);
  else if (field === 'className') studentInfoRef.value.handleFilterTagClick('className', value);
};
const onStudentBarSelect = async (date) => {
  await nextTick();
  if (!studentInfoRef.value) {
    ElMessage.warning('学生信息列表组件未就绪');
    return;
  }
  studentInfoRef.value.handleFilterTagClick('createTime', date);
};
const onStudentCardSelect = async (status) => {
  await nextTick();
  if (!studentInfoRef.value) {
    ElMessage.warning('学生信息列表组件未就绪');
    return;
  }
  studentInfoRef.value.clearFilters();
  switch (status) {
    case 'total':
      break;
    case 'inSchool':
      studentInfoRef.value.handleFilterTagClick('status', '在籍');
      break;
    case 'abnormal':
      studentInfoRef.value.handleFilterTagClick('status', ['休学', '异动']);
      break;
    default:
      break;
  }
};

// ==================== 荣誉管理图表事件 ====================
const onHonorBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!honorMgmtRef.value) {
    ElMessage.warning('荣誉管理列表组件未就绪');
    return;
  }
  honorMgmtRef.value.handleFilterTagClick(field, value);
};
const onHonorCardSelect = async (status) => {
  await nextTick();
  if (!honorMgmtRef.value) {
    ElMessage.warning('荣誉管理列表组件未就绪');
    return;
  }
  honorMgmtRef.value.clearFilters();
  switch (status) {
    case 'total':
      break;
    case 'pending':
      honorMgmtRef.value.handleFilterTagClick('status', '待审核');
      break;
    case 'pushed':
      honorMgmtRef.value.handleFilterTagClick('status', '已推送');
      break;
    case 'monthNew':
      ElMessage.info('本月新增筛选暂未实现');
      break;
    default:
      break;
  }
};

// ==================== 考评管理图表事件 ====================
const onAssessRadarClick = async ({ className }) => {
  await nextTick();
  if (!assessMgmtRef.value) {
    ElMessage.warning('考评管理列表组件未就绪');
    return;
  }
  assessMgmtRef.value.handleFilterTagClick('className', className);
};
const onAssessLineClick = async ({ cycleName }) => {
  await nextTick();
  if (!assessMgmtRef.value) {
    ElMessage.warning('考评管理列表组件未就绪');
    return;
  }
  ElMessage.info(`周期"${cycleName}"筛选暂未实现，可通过发布时间段筛选`);
};
const onAssessCardSelect = async (status) => {
  await nextTick();
  if (!assessMgmtRef.value) {
    ElMessage.warning('考评管理列表组件未就绪');
    return;
  }
  assessMgmtRef.value.clearFilters();
  switch (status) {
    case 'total':
      break;
    case 'avgScore':
      break;
    case 'topRank':
      break;
    case 'published':
      assessMgmtRef.value.handleFilterTagClick('status', '已发布');
      break;
    default:
      break;
  }
};

// ==================== 违纪管理图表事件 ====================
const onViolateBarClick = async ({ type, value }) => {
  await nextTick();
  if (!violateMgmtRef.value) {
    ElMessage.warning('违纪管理列表组件未就绪');
    return;
  }
  if (type === 'class') {
    violateMgmtRef.value.handleFilterTagClick('className', value);
  }
};
const onViolatePieClick = async ({ type, value }) => {
  await nextTick();
  if (!violateMgmtRef.value) {
    ElMessage.warning('违纪管理列表组件未就绪');
    return;
  }
  if (type === 'violateType') {
    violateMgmtRef.value.handleFilterTagClick('violateType', value);
  }
};
const onViolateCardSelect = async (status) => {
  await nextTick();
  if (!violateMgmtRef.value) {
    ElMessage.warning('违纪管理列表组件未就绪');
    return;
  }
  violateMgmtRef.value.clearFilters();
  switch (status) {
    case 'total':
      break;
    case 'pending':
      violateMgmtRef.value.handleFilterTagClick('status', '待审批');
      break;
    case 'warn':
      violateMgmtRef.value.handleFilterTagClick('status', '已预警');
      break;
    case 'highRisk':
      break;
    default:
      break;
  }
};

// ==================== 心理管理图表事件 ====================
const onMentalPieSelect = async ({ type, value }) => {
  await nextTick();
  if (!mentalMgmtRef.value) {
    ElMessage.warning('心理管理列表组件未就绪');
    return;
  }
  if (type === 'mentalStatus') {
    mentalMgmtRef.value.handleFilterTagClick('mentalStatus', value);
  } else if (type === 'riskLevel') {
    mentalMgmtRef.value.handleFilterTagClick('riskLevel', value);
  }
};

// ==================== 行为管理图表事件 ====================
const onBehaviorBarClick = async ({ className }) => {
  await nextTick();
  if (!behaviorMgmtRef.value) {
    ElMessage.warning('行为管理列表组件未就绪');
    return;
  }
  behaviorMgmtRef.value.handleFilterTagClick('className', className);
};
const onBehaviorCardSelect = async (status) => {
  await nextTick();
  if (!behaviorMgmtRef.value) {
    ElMessage.warning('行为管理列表组件未就绪');
    return;
  }
  behaviorMgmtRef.value.clearFilters();
  switch (status) {
    case 'totalLeave':
      break;
    case 'pending':
      behaviorMgmtRef.value.handleFilterTagClick('status', '待审批');
      break;
    case 'abnormal':
      behaviorMgmtRef.value.handleFilterTagClick('attendanceSync', '未同步');
      break;
    case 'synced':
      behaviorMgmtRef.value.handleFilterTagClick('attendanceSync', '已同步');
      break;
    default:
      break;
  }
};
const onBehaviorPieClick = async ({ type, value }) => {
  await nextTick();
  if (!behaviorMgmtRef.value) {
    ElMessage.warning('行为管理列表组件未就绪');
    return;
  }
  if (type === 'leaveType') {
    behaviorMgmtRef.value.handleFilterTagClick('leaveType', value);
  }
};
const onBehaviorLineClick = async ({ date }) => {
  await nextTick();
  if (!behaviorMgmtRef.value) {
    ElMessage.warning('行为管理列表组件未就绪');
    return;
  }
  const currentYear = new Date().getFullYear();
  const fullDate = `${currentYear}-${date}`;
  behaviorMgmtRef.value.handleFilterTagClick('createTime', fullDate);
};

// ==================== 资助系统图表事件 ====================
// 柱状图点击筛选（年级）
const onFundBarClick = async ({ type, value }) => {
  await nextTick();
  if (!fundSystemRef.value) {
    ElMessage.warning('资助系统列表组件未就绪');
    return;
  }
  if (type === 'grade' && value) {
    fundSystemRef.value.handleFilterTagClick('grade', value);
  } else {
    console.warn('无效的柱状图点击参数', { type, value });
  }
};

// 卡片点击筛选
const onFundCardSelect = async (status) => {
  await nextTick();
  if (!fundSystemRef.value) {
    ElMessage.warning('资助系统列表组件未就绪');
    return;
  }
  fundSystemRef.value.clearFilters();
  switch (status) {
    case 'pending':
      fundSystemRef.value.handleFilterTagClick('status', '待审核');
      break;
    case 'approved':
      fundSystemRef.value.handleFilterTagClick('status', '已汇总');
      break;
    default:
      // total 或 amount 不筛选
      break;
  }
};

const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 学生信息图表 -->
    <component
      v-if="currentArrowShow && activeName === '学生信息'"
      :is="currentChartComponent"
      @pieSelect="onStudentPieSelect"
      @barSelect="onStudentBarSelect"
      @cardSelect="onStudentCardSelect"
    />
    <!-- 荣誉管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '荣誉管理'"
      :is="currentChartComponent"
      @barSelect="onHonorBarSelect"
      @cardSelect="onHonorCardSelect"
    />
    <!-- 考评管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '考评管理'"
      :is="currentChartComponent"
      @radarClick="onAssessRadarClick"
      @lineClick="onAssessLineClick"
      @cardSelect="onAssessCardSelect"
    />
    <!-- 违纪管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '违纪管理'"
      :is="currentChartComponent"
      @barClick="onViolateBarClick"
      @pieClick="onViolatePieClick"
      @cardSelect="onViolateCardSelect"
    />
    <!-- 心理管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '心理管理'"
      :is="currentChartComponent"
      @pieSelect="onMentalPieSelect"
    />
    <!-- 行为管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '行为管理'"
      :is="currentChartComponent"
      @barClick="onBehaviorBarClick"
      @cardClick="onBehaviorCardSelect"
      @pieClick="onBehaviorPieClick"
      @lineClick="onBehaviorLineClick"
    />
    <!-- 资助系统图表 -->
    <component
      v-if="currentArrowShow && activeName === '资助系统'"
      :is="currentChartComponent"
      @barClick="onFundBarClick"
      @cardSelect="onFundCardSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 各模块组件渲染 -->
        <component
          v-if="item.label === '学生信息'"
          :is="item.components"
          :ref="setStudentInfoRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '荣誉管理'"
          :is="item.components"
          :ref="setHonorMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '考评管理'"
          :is="item.components"
          :ref="setAssessMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '违纪管理'"
          :is="item.components"
          :ref="setViolateMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '心理管理'"
          :is="item.components"
          :ref="setMentalMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '行为管理'"
          :is="item.components"
          :ref="setBehaviorMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '资助系统'"
          :is="item.components"
          :ref="setFundSystemRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
