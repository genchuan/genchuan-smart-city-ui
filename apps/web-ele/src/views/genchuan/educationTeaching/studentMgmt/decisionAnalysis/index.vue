<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import assessReport from './assessReport/index.vue';
import assessReportChart from './assessReport/components/chart.vue';
import moralReport from './moralReport/index.vue';
import moralReportChart from './moralReport/components/chart.vue';
import dormCompareReport from './dormCompareReport/index.vue';
import dormCompareReportChart from './dormCompareReport/components/chart.vue';
import dormCheckReport from './dormCheckReport/index.vue';
import dormCheckReportChart from './dormCheckReport/components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（四个tab）
const tabArray = ref([
  {
    label: '考评统计报表',
    components: assessReport,
    chartComponent: assessReportChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '德育评比报表',
    components: moralReport,
    chartComponent: moralReportChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '宿舍评比报表',
    components: dormCompareReport,
    chartComponent: dormCompareReportChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '宿舍考勤报表',
    components: dormCheckReport,
    chartComponent: dormCheckReportChart,
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

const activeName = ref('考评统计报表');
const secondShow = ref(false);

// 各组件引用
const assessReportRef = ref(null);
const setAssessReportRef = (el) => {
  if (el) assessReportRef.value = el;
};

const moralReportRef = ref(null);
const setMoralReportRef = (el) => {
  if (el) moralReportRef.value = el;
};

const dormCompareReportRef = ref(null);
const setDormCompareReportRef = (el) => {
  if (el) dormCompareReportRef.value = el;
};

const dormCheckReportRef = ref(null);
const setDormCheckReportRef = (el) => {
  if (el) dormCheckReportRef.value = el;
};

// 当前激活的Tab
const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 考评统计报表图表 -->
    <component
      v-if="currentArrowShow && activeName === '考评统计报表'"
      :is="currentChartComponent"
    />
    <!-- 德育评比报表图表 -->
    <component
      v-if="currentArrowShow && activeName === '德育评比报表'"
      :is="currentChartComponent"
    />
    <!-- 宿舍评比报表图表 -->
    <component
      v-if="currentArrowShow && activeName === '宿舍评比报表'"
      :is="currentChartComponent"
    />
    <!-- 宿舍考勤报表图表 -->
    <component
      v-if="currentArrowShow && activeName === '宿舍考勤报表'"
      :is="currentChartComponent"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 考评统计报表组件 -->
        <component
          v-if="item.label === '考评统计报表'"
          :is="item.components"
          :ref="setAssessReportRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 德育评比报表组件 -->
        <component
          v-else-if="item.label === '德育评比报表'"
          :is="item.components"
          :ref="setMoralReportRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 宿舍评比报表组件 -->
        <component
          v-else-if="item.label === '宿舍评比报表'"
          :is="item.components"
          :ref="setDormCompareReportRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 宿舍考勤报表组件 -->
        <component
          v-else
          :is="item.components"
          :ref="setDormCheckReportRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
