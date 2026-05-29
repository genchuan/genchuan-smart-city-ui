<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import workHome from './workHome/index.vue';
import workHomeChart from './workHome/components/chart.vue';
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
import clubMgmt from './clubMgmt/index.vue';
import clubMgmtChart from './clubMgmt/components/chart.vue';
import aidWork from './aidWork/index.vue';
import aidWorkChart from './aidWork/components/chart.vue';
import dutyMgmt from './dutyMgmt/index.vue';
import dutyMgmtChart from './dutyMgmt/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '学工首页',
    components: workHome,
    chartComponent: workHomeChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '学生信息',
    components: studentInfo,
    chartComponent: studentInfoChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '荣誉管理',
    components: honorMgmt,
    chartComponent: honorMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '考评管理',
    components: assessMgmt,
    chartComponent: assessMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '违纪管理',
    components: violateMgmt,
    chartComponent: violateMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '心理管理',
    components: mentalMgmt,
    chartComponent: mentalMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '行为管理',
    components: behaviorMgmt,
    chartComponent: behaviorMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '资助系统',
    components: fundSystem,
    chartComponent: fundSystemChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '社团管理',
    components: clubMgmt,
    chartComponent: clubMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '奖助勤贷',
    components: aidWork,
    chartComponent: aidWorkChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
  {
    label: '值班管理',
    components: dutyMgmt,
    chartComponent: dutyMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('学工首页');
const secondShow = ref(false);

// ==================== 各模块组件引用 ====================
const workHomeRef = ref(null);
const setWorkHomeRef = (el) => {
  if (el) workHomeRef.value = el;
};
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
const clubMgmtRef = ref(null);
const setClubMgmtRef = (el) => {
  if (el) clubMgmtRef.value = el;
};
const aidWorkRef = ref(null);
const setAidWorkRef = (el) => {
  if (el) aidWorkRef.value = el;
};
const dutyMgmtRef = ref(null);
const setDutyMgmtRef = (el) => {
  if (el) dutyMgmtRef.value = el;
};

// ==================== 学工首页图表事件 ====================
const onWorkHomeCardClick = async (status) => {
  await nextTick();
  if (!workHomeRef.value) {
    ElMessage.warning('学工首页列表组件未就绪');
    return;
  }
  switch (status) {
    case 'totalStudent':
      activeName.value = '学生信息';
      return;
    case 'totalHonor':
      activeName.value = '荣誉管理';
      return;
    case 'totalAssess':
      activeName.value = '考评管理';
      return;
    case 'totalViolate':
      activeName.value = '违纪管理';
      return;
    case 'totalMental':
      activeName.value = '心理管理';
      return;
    case 'totalFund':
      activeName.value = '资助系统';
      return;
    case 'unhandledViolate':
      // 只跳转到违纪管理标签页，筛选由自定义事件完成
      activeName.value = '违纪管理';
      return;
    case 'unhandledWarn':
      activeName.value = '违纪管理';
      return;
    default:
      break;
  }
};

const onWorkHomePieClick = async ({dimension}) => {
  await nextTick();
  if (!workHomeRef.value) {
    ElMessage.warning('学工首页列表组件未就绪');
    return;
  }
  workHomeRef.value.setExternalFilters({type: dimension});
};

const onWorkHomeRadarClick = async ({className}) => {
  await nextTick();
  if (!workHomeRef.value) {
    ElMessage.warning('学工首页列表组件未就绪');
    return;
  }
  workHomeRef.value.setExternalFilters({className});
};

const onWorkHomeLineClick = async ({date}) => {
  await nextTick();
  if (!workHomeRef.value) {
    ElMessage.warning('学工首页列表组件未就绪');
    return;
  }
  workHomeRef.value.setExternalFilters({
    startTime: `${date} 00:00:00`,
    endTime: `${date} 23:59:59`
  });
};

// ==================== 学生信息图表事件 ====================
const onStudentPieSelect = async ({field, value}) => {
  await nextTick();
  if (!studentInfoRef.value) {
    ElMessage.warning('学生信息列表组件未就绪');
    return;
  }
  if (field === 'major') studentInfoRef.value.handleFilterTagClick('major', value);
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
const onHonorBarSelect = async ({field, value}) => {
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
    default:
      break;
  }
};

// ==================== 考评管理图表事件 ====================
const onAssessRadarClick = async ({className}) => {
  await nextTick();
  if (!assessMgmtRef.value) {
    ElMessage.warning('考评管理列表组件未就绪');
    return;
  }
  assessMgmtRef.value.handleFilterTagClick('className', className);
};
const onAssessLineClick = async ({cycleName}) => {
  await nextTick();
  if (!assessMgmtRef.value) {
    ElMessage.warning('考评管理列表组件未就绪');
    return;
  }
  // 周期筛选不支持
};
const onAssessCardSelect = async (status) => {
  await nextTick();
  if (!assessMgmtRef.value) {
    ElMessage.warning('考评管理列表组件未就绪');
    return;
  }
  assessMgmtRef.value.clearFilters();
  switch (status) {
    case 'published':
      assessMgmtRef.value.handleFilterTagClick('status', '已发布');
      break;
    default:
      break;
  }
};

// ==================== 违纪管理图表事件 ====================
const onViolateBarClick = async ({type, value}) => {
  await nextTick();
  if (!violateMgmtRef.value) {
    ElMessage.warning('违纪管理列表组件未就绪');
    return;
  }
  if (type === 'class') violateMgmtRef.value.handleFilterTagClick('className', value);
};
const onViolatePieClick = async ({type, value}) => {
  await nextTick();
  if (!violateMgmtRef.value) {
    ElMessage.warning('违纪管理列表组件未就绪');
    return;
  }
  if (type === 'violateType') violateMgmtRef.value.handleFilterTagClick('violateType', value);
};
const onViolateCardSelect = async (status) => {
  await nextTick();
  if (!violateMgmtRef.value) {
    ElMessage.warning('违纪管理列表组件未就绪');
    return;
  }
  violateMgmtRef.value.clearFilters();
  switch (status) {
    case 'pending':
      violateMgmtRef.value.handleFilterTagClick('status', '待审批');
      break;
    case 'warned':
      violateMgmtRef.value.handleFilterTagClick('status', '已预警');
      break;
    default:
      break;
  }
};

// ==================== 心理管理图表事件 ====================
const onMentalPieSelect = async ({type, value}) => {
  await nextTick();
  if (!mentalMgmtRef.value) {
    ElMessage.warning('心理管理列表组件未就绪');
    return;
  }
  if (type === 'mentalStatus') mentalMgmtRef.value.handleFilterTagClick('mentalStatus', value);
  else if (type === 'riskLevel') mentalMgmtRef.value.handleFilterTagClick('riskLevel', value);
};

// ==================== 行为管理图表事件 ====================
const onBehaviorBarClick = async ({className}) => {
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
const onBehaviorPieClick = async ({type, value}) => {
  await nextTick();
  if (!behaviorMgmtRef.value) {
    ElMessage.warning('行为管理列表组件未就绪');
    return;
  }
  if (type === 'leaveType') behaviorMgmtRef.value.handleFilterTagClick('leaveType', value);
};
const onBehaviorLineClick = async ({date}) => {
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
const onFundBarClick = async ({type, value}) => {
  await nextTick();
  if (!fundSystemRef.value) {
    ElMessage.warning('资助系统列表组件未就绪');
    return;
  }
  // 年级筛选不支持
};
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
      break;
  }
};

// ==================== 社团管理图表事件 ====================
const onClubPieSelect = async ({type, value}) => {
  await nextTick();
  if (!clubMgmtRef.value) {
    ElMessage.warning('社团管理列表组件未就绪');
    return;
  }
  if (type === 'clubName') clubMgmtRef.value.handleFilterTagClick('clubName', value);
  else if (type === 'clubType') clubMgmtRef.value.handleFilterTagClick('clubType', value);
};

// ==================== 奖助勤贷图表事件 ====================
const onAidWorkCardClick = async (status) => {
  await nextTick();
  if (!aidWorkRef.value) {
    ElMessage.warning('奖助勤贷列表组件未就绪');
    return;
  }
  aidWorkRef.value.clearFilters();
  switch (status) {
    case 'passed':
      aidWorkRef.value.handleFilterTagClick('status', '已通过');
      break;
    default:
      break;
  }
};
const onAidWorkPieClick = async ({type, value}) => {
  await nextTick();
  if (!aidWorkRef.value) {
    ElMessage.warning('奖助勤贷列表组件未就绪');
    return;
  }
  if (type === 'status') aidWorkRef.value.handleFilterTagClick('status', value);
  else if (type === 'aidType') aidWorkRef.value.handleFilterTagClick('aidType', value);
};
const onAidWorkBarClick = async ({type, value}) => {
  await nextTick();
  if (!aidWorkRef.value) {
    ElMessage.warning('奖助勤贷列表组件未就绪');
    return;
  }
  if (type === 'aidType') aidWorkRef.value.handleFilterTagClick('aidType', value);
};

// ==================== 值班管理图表事件 ====================
const onDutyLineClick = async ({month}) => {
  await nextTick();
  if (!dutyMgmtRef.value) {
    ElMessage.warning('值班管理列表组件未就绪');
    return;
  }
  // 实际筛选由文件3的全局事件处理，这里可留空
};

const onDutyCardClick = async (cardInfo) => {
  await nextTick();
  if (!dutyMgmtRef.value) {
    ElMessage.warning('值班管理列表组件未就绪');
    return;
  }
  const {status} = cardInfo;
  switch (status) {
    case 'shiftApplyCount':
      dutyMgmtRef.value.handleFilterTagClick('transferStatus', '待审批');
      break;
    case 'vehicleApplyCount':
      dutyMgmtRef.value.handleFilterTagClick('carStatus', '待审批');
      break;
    case 'checkInRate':
      dutyMgmtRef.value.handleFilterTagClick('checkInStatus', '已打卡');
      break;
    default:
      break;
  }
};

// ==================== 当前激活的 Tab 相关 ====================
const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 学工首页图表 -->
    <component
      v-if="currentArrowShow && activeName === '学工首页'"
      :is="currentChartComponent"
      @cardClick="onWorkHomeCardClick"
      @pieClick="onWorkHomePieClick"
      @radarClick="onWorkHomeRadarClick"
      @lineClick="onWorkHomeLineClick"
    />
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
      @cardSelect="onBehaviorCardSelect"
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
    <!-- 社团管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '社团管理'"
      :is="currentChartComponent"
      @pieClick="onClubPieSelect"
    />
    <!-- 奖助勤贷图表 -->
    <component
      v-if="currentArrowShow && activeName === '奖助勤贷'"
      :is="currentChartComponent"
      @cardClick="onAidWorkCardClick"
      @pieClick="onAidWorkPieClick"
      @barClick="onAidWorkBarClick"
    />
    <!-- 值班管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '值班管理'"
      :is="currentChartComponent"
      @lineClick="onDutyLineClick"
      @cardClick="onDutyCardClick"
    />

    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 学工首页组件 -->
        <component
          v-if="item.label === '学工首页'"
          :is="item.components"
          :ref="setWorkHomeRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 学生信息组件 -->
        <component
          v-else-if="item.label === '学生信息'"
          :is="item.components"
          :ref="setStudentInfoRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 荣誉管理组件 -->
        <component
          v-else-if="item.label === '荣誉管理'"
          :is="item.components"
          :ref="setHonorMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 考评管理组件 -->
        <component
          v-else-if="item.label === '考评管理'"
          :is="item.components"
          :ref="setAssessMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 违纪管理组件 -->
        <component
          v-else-if="item.label === '违纪管理'"
          :is="item.components"
          :ref="setViolateMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 心理管理组件 -->
        <component
          v-else-if="item.label === '心理管理'"
          :is="item.components"
          :ref="setMentalMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 行为管理组件 -->
        <component
          v-else-if="item.label === '行为管理'"
          :is="item.components"
          :ref="setBehaviorMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 资助系统组件 -->
        <component
          v-else-if="item.label === '资助系统'"
          :is="item.components"
          :ref="setFundSystemRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 社团管理组件 -->
        <component
          v-else-if="item.label === '社团管理'"
          :is="item.components"
          :ref="setClubMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 奖助勤贷组件 -->
        <component
          v-else-if="item.label === '奖助勤贷'"
          :is="item.components"
          :ref="setAidWorkRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 值班管理组件 -->
        <component
          v-else-if="item.label === '值班管理'"
          :is="item.components"
          :ref="setDutyMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
