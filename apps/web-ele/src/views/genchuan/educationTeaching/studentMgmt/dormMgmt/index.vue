<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import bedMgmt from './bedMgmt/index.vue';
import bedMgmtChart from './bedMgmt/components/chart.vue';
import dormCompare from './dormCompare/index.vue';
import dormCompareChart from './dormCompare/components/chart.vue';
import dormCheck from './dormCheck/index.vue';
import dormCheckChart from './dormCheck/components/chart.vue';
import accessApply from './accessApply/index.vue';
import accessApplyChart from './accessApply/components/chart.vue';
import repairMgmt from './repairMgmt/index.vue';
import repairMgmtChart from './repairMgmt/components/chart.vue';
import stayMgmt from './stayMgmt/index.vue';
import stayMgmtChart from './stayMgmt/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '床位管理',
    components: bedMgmt,
    chartComponent: bedMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '宿舍评比',
    components: dormCompare,
    chartComponent: dormCompareChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '宿舍考勤',
    components: dormCheck,
    chartComponent: dormCheckChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '出入申请',
    components: accessApply,
    chartComponent: accessApplyChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '报修管理',
    components: repairMgmt,
    chartComponent: repairMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '留宿管理',
    components: stayMgmt,
    chartComponent: stayMgmtChart,
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

const activeName = ref('床位管理');
const secondShow = ref(false);

// 床位管理组件引用
const bedMgmtRef = ref(null);
const setBedMgmtRef = (el) => {
  if (el) bedMgmtRef.value = el;
};

// 宿舍评比组件引用
const dormCompareRef = ref(null);
const setDormCompareRef = (el) => {
  if (el) dormCompareRef.value = el;
};

// 宿舍考勤组件引用
const dormCheckRef = ref(null);
const setDormCheckRef = (el) => {
  if (el) dormCheckRef.value = el;
};

// 出入申请组件引用
const accessApplyRef = ref(null);
const setAccessApplyRef = (el) => {
  if (el) accessApplyRef.value = el;
};

// 报修管理组件引用
const repairMgmtRef = ref(null);
const setRepairMgmtRef = (el) => {
  if (el) repairMgmtRef.value = el;
};

// 留宿管理组件引用
const stayMgmtRef = ref(null);
const setStayMgmtRef = (el) => {
  if (el) stayMgmtRef.value = el;
};

// ========== 床位管理图表事件 ==========
const onBedCardSelect = async (status) => {
  await nextTick();
  if (!bedMgmtRef.value) {
    ElMessage.warning('床位管理列表组件未就绪');
    return;
  }
  bedMgmtRef.value.clearFilters();
  if (status === 'used') {
    bedMgmtRef.value.handleFilterTagClick('status', '已分配');
  } else if (status === 'unused') {
    bedMgmtRef.value.handleFilterTagClick('status', '未分配');
  }
};

const onBedPieSelect = async ({field, value}) => {
  await nextTick();
  if (!bedMgmtRef.value) {
    ElMessage.warning('床位管理列表组件未就绪');
    return;
  }
  bedMgmtRef.value.handleFilterTagClick('building', value);
};

const onBedLineSelect = async ({field, value}) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选操作记录`);
};

// ========== 宿舍评比图表事件 ==========
const onDormCardSelect = async (status) => {
  await nextTick();
  if (!dormCompareRef.value) {
    ElMessage.warning('宿舍评比列表组件未就绪');
    return;
  }
};

const onDormBarSelect = async ({field, value}) => {
  await nextTick();
  if (!dormCompareRef.value) {
    ElMessage.warning('宿舍评比列表组件未就绪');
    return;
  }
  dormCompareRef.value.handleFilterTagClick(field, value);
};

// ========== 宿舍考勤图表事件 ==========
const onDormCheckCardSelect = async (status) => {
  await nextTick();
  if (!dormCheckRef.value) {
    ElMessage.warning('宿舍考勤列表组件未就绪');
    return;
  }
  dormCheckRef.value.clearFilters();
  if (status === 'abnormal') {
    dormCheckRef.value.handleFilterTagClick('status', '异常');
  } else if (status === 'normal') {
    dormCheckRef.value.handleFilterTagClick('status', '正常');
  } else if (status === 'warning') {
    dormCheckRef.value.handleFilterTagClick('abnormalType', ['晚归', '未归']);
  }
};

const onDormCheckBarSelect = async ({field, value}) => {
  await nextTick();
  if (!dormCheckRef.value) {
    ElMessage.warning('宿舍考勤列表组件未就绪');
    return;
  }
  dormCheckRef.value.handleFilterTagClick('className', value);
};

// ========== 出入申请图表事件 ==========
const onAccessCardSelect = async (status) => {
  await nextTick();
  if (!accessApplyRef.value) {
    ElMessage.warning('出入申请列表组件未就绪');
    return;
  }
  accessApplyRef.value.clearFilters();
  if (status === 'pending') {
    accessApplyRef.value.handleFilterTagClick('status', '待审核');
  } else if (status === 'passed') {
    accessApplyRef.value.handleFilterTagClick('status', '已通过');
  }
};

const onAccessBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!accessApplyRef.value) {
    ElMessage.warning('出入申请列表组件未就绪');
    return;
  }
  accessApplyRef.value.handleFilterTagClick(field, value);
};

const onAccessLineSelect = async ({ field, value }) => {
  // 折线图点击日期筛选（可选实现）
  ElMessage.info(`点击日期：${value}，可按日期筛选申请记录`);
};

// ========== 报修管理图表事件 ==========
const onRepairCardSelect = async (status) => {
  await nextTick();
  if (!repairMgmtRef.value) {
    ElMessage.warning('报修管理列表组件未就绪');
    return;
  }
  repairMgmtRef.value.clearFilters();
  if (status === 'pending') {
    repairMgmtRef.value.handleFilterTagClick('status', '待派单');
  } else if (status === 'repairing') {
    repairMgmtRef.value.handleFilterTagClick('status', '维修中');
  } else if (status === 'repaired') {
    repairMgmtRef.value.handleFilterTagClick('status', '已维修');
  } else if (status === 'accepted') {
    // 已验收筛选验收状态
    repairMgmtRef.value.handleFilterTagClick('checkStatus', '已验收');
  }
};

const onRepairPieSelect = async ({ field, value }) => {
  await nextTick();
  if (!repairMgmtRef.value) {
    ElMessage.warning('报修管理列表组件未就绪');
    return;
  }
  if (field === 'repairType') {
    repairMgmtRef.value.handleFilterTagClick('repairType', value);
  }
};

const onRepairLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选报修记录`);
};

// ========== 留宿管理图表事件 ==========
const onStayCardSelect = async (status) => {
  await nextTick();
  if (!stayMgmtRef.value) {
    ElMessage.warning('留宿管理列表组件未就绪');
    return;
  }
  stayMgmtRef.value.clearFilters();
  if (status === 'pendingConfirm') {
    stayMgmtRef.value.handleFilterTagClick('status', '待确认');
  } else if (status === 'pendingAudit') {
    stayMgmtRef.value.handleFilterTagClick('status', '待审核');
  } else if (status === 'passed') {
    stayMgmtRef.value.handleFilterTagClick('status', '已通过');
  }
};

const onStayPieSelect = async ({ field, value }) => {
  await nextTick();
  if (!stayMgmtRef.value) {
    ElMessage.warning('留宿管理列表组件未就绪');
    return;
  }
  stayMgmtRef.value.handleFilterTagClick('status', value);
};

const onStayBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!stayMgmtRef.value) {
    ElMessage.warning('留宿管理列表组件未就绪');
    return;
  }
  stayMgmtRef.value.handleFilterTagClick('className', value);
};

const onStayLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选留宿记录`);
};

const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <component
      v-if="currentArrowShow && activeName === '床位管理'"
      :is="currentChartComponent"
      @cardSelect="onBedCardSelect"
      @pieSelect="onBedPieSelect"
      @lineSelect="onBedLineSelect"
    />
    <component
      v-if="currentArrowShow && activeName === '宿舍评比'"
      :is="currentChartComponent"
      @cardSelect="onDormCardSelect"
      @barSelect="onDormBarSelect"
    />
    <component
      v-if="currentArrowShow && activeName === '宿舍考勤'"
      :is="currentChartComponent"
      @cardSelect="onDormCheckCardSelect"
      @barSelect="onDormCheckBarSelect"
    />
    <component
      v-if="currentArrowShow && activeName === '出入申请'"
      :is="currentChartComponent"
      @cardSelect="onAccessCardSelect"
      @barSelect="onAccessBarSelect"
      @lineSelect="onAccessLineSelect"
    />
    <component
      v-if="currentArrowShow && activeName === '报修管理'"
      :is="currentChartComponent"
      @cardSelect="onRepairCardSelect"
      @pieSelect="onRepairPieSelect"
      @lineSelect="onRepairLineSelect"
    />
    <component
      v-if="currentArrowShow && activeName === '留宿管理'"
      :is="currentChartComponent"
      @cardSelect="onStayCardSelect"
      @pieSelect="onStayPieSelect"
      @barSelect="onStayBarSelect"
      @lineSelect="onStayLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          v-if="item.label === '床位管理'"
          :is="item.components"
          :ref="setBedMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '宿舍评比'"
          :is="item.components"
          :ref="setDormCompareRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '宿舍考勤'"
          :is="item.components"
          :ref="setDormCheckRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '出入管理'"
          :is="item.components"
          :ref="setAccessApplyRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else-if="item.label === '报修管理'"
          :is="item.components"
          :ref="setRepairMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <component
          v-else
          :is="item.components"
          :ref="setStayMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
