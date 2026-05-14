<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
// 校企合作组件
import coopEnterprise from './coopEnterprise/index.vue';
import coopEnterpriseChart from './coopEnterprise/components/chart.vue';
// 升学管理组件
import studyUp from './studyUp/index.vue';
import studyUpChart from './studyUp/components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（校企合作 + 升学管理）
const tabArray = ref([
  {
    label: '校企合作',
    components: coopEnterprise,
    chartComponent: coopEnterpriseChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '升学管理',
    components: studyUp,
    chartComponent: studyUpChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

// 箭头折叠切换（控制图表区域显隐）
const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('校企合作');
const secondShow = ref(false);

// 校企合作组件引用
const coopEnterpriseRef = ref(null);
const setCoopEnterpriseRef = (el) => {
  if (el) coopEnterpriseRef.value = el;
};

// 升学管理组件引用
const studyUpRef = ref(null);
const setStudyUpRef = (el) => {
  if (el) studyUpRef.value = el;
};

// ========== 校企合作图表事件 ==========
const onCoopCardSelect = async (status) => {
  await nextTick();
  if (!coopEnterpriseRef.value) {
    ElMessage.warning('校企合作列表组件未就绪');
    return;
  }
  coopEnterpriseRef.value.clearFilters();
  if (status === 'cooperating') {
    coopEnterpriseRef.value.handleFilterTagClick('status', '合作中');
  } else if (status === 'finished') {
    coopEnterpriseRef.value.handleFilterTagClick('status', '已结束');
  }
};

const onCoopPieSelect = async ({ field, value }) => {
  await nextTick();
  if (!coopEnterpriseRef.value) {
    ElMessage.warning('校企合作列表组件未就绪');
    return;
  }
  coopEnterpriseRef.value.handleFilterTagClick('enterpriseType', value);
};

const onCoopBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!coopEnterpriseRef.value) {
    ElMessage.warning('校企合作列表组件未就绪');
    return;
  }
  coopEnterpriseRef.value.handleFilterTagClick('deptName', value);
};

const onCoopLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选合作记录`);
};

// ========== 升学管理图表事件 ==========
const onStudyCardSelect = async (statusType) => {
  await nextTick();
  if (!studyUpRef.value) {
    ElMessage.warning('升学管理列表组件未就绪');
    return;
  }
  studyUpRef.value.clearFilters();
  if (statusType === 'wait') {
    studyUpRef.value.handleFilterTagClick('status', '待规划');
  } else if (statusType === 'planned') {
    studyUpRef.value.handleFilterTagClick('status', '已规划');
  }
};

const onStudyBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!studyUpRef.value) {
    ElMessage.warning('升学管理列表组件未就绪');
    return;
  }
  studyUpRef.value.handleFilterTagClick('schoolName', value);
};

const onStudyPieSelect = async ({ field, value }) => {
  await nextTick();
  if (!studyUpRef.value) {
    ElMessage.warning('升学管理列表组件未就绪');
    return;
  }
  if (field === 'intention') {
    // 升学意向饼图点击，可根据需要筛选意向专业（这里暂时只提示）
    ElMessage.info(`点击意向：${value}，可按意向筛选升学记录（功能待扩展）`);
  } else if (field === 'schoolType') {
    studyUpRef.value.handleFilterTagClick('schoolType', value);
  }
};

const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 校企合作图表 -->
    <component
      v-if="currentArrowShow && activeName === '校企合作'"
      :is="currentChartComponent"
      @cardSelect="onCoopCardSelect"
      @pieSelect="onCoopPieSelect"
      @barSelect="onCoopBarSelect"
      @lineSelect="onCoopLineSelect"
    />
    <!-- 升学管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '升学管理'"
      :is="currentChartComponent"
      @cardSelect="onStudyCardSelect"
      @barSelect="onStudyBarSelect"
      @pieSelect="onStudyPieSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 校企合作组件 -->
        <component
          v-if="item.label === '校企合作'"
          :is="item.components"
          :ref="setCoopEnterpriseRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 升学管理组件 -->
        <component
          v-else
          :is="item.components"
          :ref="setStudyUpRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
