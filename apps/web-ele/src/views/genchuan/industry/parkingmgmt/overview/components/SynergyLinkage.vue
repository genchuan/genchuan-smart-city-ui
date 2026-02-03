<script setup lang="ts">
import {getCurrentInstance, nextTick, onMounted, onUnmounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {Filter, FullScreen} from '@element-plus/icons-vue';
import {ElButton, ElMessage, ElTable, ElTableColumn, ElTag} from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchCoopAreaCount,
  fetchCoopAreaRatio,
  fetchCoopCoreIndicators,
  fetchCoopEfficiencyAreaCount,
  fetchCoopEfficiencyIndicators,
  fetchCoopEfficiencyList,
  fetchCoopEfficiencyRecurrenceRatio,
  fetchCoopEfficiencyTrendData,
  fetchCoopEfficiencyTypeCount,
  fetchCoopIndustryRatio,
  fetchCoopItemTypeRatio,
  fetchCoopTrendData,
  fetchCoopTypeCount,
  fetchCrossRegionAreaCount,
  fetchCrossRegionCoopIndicators,
  fetchCrossRegionCoopList,
  fetchCrossRegionRateTrendData,
  fetchCrossRegionTaskTypeCount,
  fetchEnterpriseTypeCoopCount,
  fetchGovDeptCoopCount,
  fetchGovEnterpriseCoopIndicators,
  fetchGovEnterpriseCoopList,
  fetchHighFrequencyCoopTop10,
  fetchSatisfactionLevelRatio,
  fetchSpecialCoopDeptCount,
  fetchSpecialCoopIndicators,
  fetchSpecialCoopList,
  fetchSpecialCoopSceneCount,
  fetchSpecialCoopSceneRatio,
  fetchSpecialCoopStatusRatio
} from '#/api/genchuan/industry/parkingmgmt/overview/SynergyLinkage.ts';

import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie4 from '#/views/genchuan/industry/templatesstatchart/ChartPie4.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// 标签页激活状态
const topLeftActiveTab = ref('tab1');

// 数字滚动动画方法
const animateValue = (element, start, end, duration) => {
  let startTimestamp = null;
  const isInteger = Number.isInteger(end);
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = progress * (end - start) + start;
    element.textContent = isInteger ? currentValue.toFixed(0) : currentValue.toFixed(1);
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};
const initCrossRegionCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.cross-region-coop-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initGovCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.gov-coop-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initSpecialCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.special-coop-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initCoopAnalysisNumberAnimations = () => {
  const elements = document.querySelectorAll('.coop-analysis-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initCoopEfficiencyNumberAnimations = () => {
  const elements = document.querySelectorAll('.coop-efficiency-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};

// 时间戳格式化方法
const formatNumber = (num: number) => {
  return num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const formatCompleteRate = (rate: number) => {
  return `${(rate * 100).toFixed(1)}%`;
};
const formatSpecialCoopTimeStamp = (timeStamp: any) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 全屏方法
const togglePanelFullscreen = (panelRefName: string) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = instance?.refs[panelRefName];
  if (!panel) {
    ElMessage.error('未找到面板元素');
    return;
  }
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.request(panel);
  }
  currentFullscreenPanel.value = panel as HTMLElement;
};
const handleFullscreenChange = () => {
  if (!currentFullscreenPanel.value) return;
  if (screenFull.isFullscreen) {
    setTimeout(() => {
      crossRegionCoopChartRefreshKey.value++;
      coopAnalysisChartRefreshKey.value++;
      govCoopChartRefreshKey.value++;
      specialCoopChartRefreshKey.value++;
      coopEfficiencyChartRefreshKey.value++;
    }, 300);
  }
  else {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      crossRegionCoopChartRefreshKey.value++;
      coopAnalysisChartRefreshKey.value++;
      govCoopChartRefreshKey.value++;
      specialCoopChartRefreshKey.value++;
      coopEfficiencyChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

const crossRegionCoopList = ref<any[]>([]);
const crossRegionCoopIndicators = ref({ totalCount: 0, completeRate: 0, avgCoopDuration: 0 });
const crossRegionCoopAreaData = ref({ xAxis: [], series: [] });
const crossRegionCoopTaskTypeData = ref({ xAxis: [], series: [] });
const crossRegionCoopTrendData = ref({ xAxis: [], series: [] });
const crossRegionCoopBaseFontScale = ref(1);
const crossRegionCoopActiveIndices = ref([]);
const crossRegionCoopChartRefreshKey = ref(0);
const activeCrossRegionCoopView = ref('柱状图');
const crossRegionCoopViewBtnList = ref(['卡片', '柱状图', '折线图', '列表']);

const highFreqCoopTop10List = ref<any[]>([]);
const coopAnalysisIndicators = ref({ totalCoopCount: 0, avgHandleCycle: 0, finishRate: 0, highPriorityRate: 0 });
const coopAnalysisTypeData = ref({ xAxis: [], series: [] });
const coopAnalysisAreaData = ref({ xAxis: [], series: [] });
const coopAnalysisIndustryRatioData = ref({ legend: [], series: [] });
const coopAnalysisAreaRatioData = ref({ legend: [], series: [] });
const coopAnalysisTrendData = ref({ xAxis: [], series: [] });
const coopAnalysisBaseFontScale = ref(1);
const coopAnalysisActiveIndices = ref([]);
const coopAnalysisChartRefreshKey = ref(0);
const activeCoopAnalysisView = ref('列表');
const coopAnalysisViewBtnList = ref(['卡片', '柱状图', '饼图', '折线图', '列表']);

const govCoopList = ref<any[]>([]);
const govCoopIndicators = ref({ totalCount: 0, responseRate: 0, satisfactionRate: 0 });
const govCoopDeptData = ref({ xAxis: [], series: [] });
const govCoopEntTypeData = ref({ xAxis: [], series: [] });
const govCoopItemRatioData = ref({ legend: [], series: [] });
const govCoopSatisfactionRatioData = ref({ legend: [], series: [] });
const govCoopBaseFontScale = ref(1);
const govCoopActiveIndices = ref([]);
const govCoopChartRefreshKey = ref(0);
const activeGovCoopView = ref('饼图');
const govCoopViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const govCoopDetailDialogVisible = ref(false);
const govCoopSelectedRow = ref<any>({});

const specialCoopList = ref<any[]>([]);
const specialCoopIndicators = ref({ totalCount: 0, completeRate: 0, averageCycle: 0 });
const specialCoopSceneData = ref({ xAxis: [], series: [] });
const specialCoopDeptData = ref({ xAxis: [], series: [] });
const specialCoopSceneRatioData = ref({ legend: [], series: [] });
const specialCoopStatusRatioData = ref({ legend: [], series: [] });
const specialCoopBaseFontScale = ref(1);
const specialCoopActiveIndices = ref([]);
const specialCoopChartRefreshKey = ref(0);
const activeSpecialCoopView = ref('卡片');
const specialCoopViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);

const coopEfficiencyList = ref<any[]>([]);
const coopEfficiencyIndicators = ref({ avgResponseDuration: 0, avgDisposalDuration: 0, avgEffectAchievementRate: 0 });
const coopEfficiencyTypeData = ref({ xAxis: [], series: [] });
const coopEfficiencyAreaData = ref({ xAxis: [], series: [] });
const coopEfficiencyRecurrenceRatioData = ref({ legend: [], series: [] });
const coopEfficiencyTrendData = ref({ xAxis: [], series: [] });
const coopEfficiencyBaseFontScale = ref(1);
const coopEfficiencyActiveIndices = ref([]);
const coopEfficiencyChartRefreshKey = ref(0);
const activeCoopEfficiencyView = ref('折线图');
const coopEfficiencyViewBtnList = ref(['卡片', '柱状图', '饼图', '折线图', '列表']);


// 区域协同接口请求方法
const getCrossRegionCoopListData = async () => {
  try {
    crossRegionCoopList.value = await fetchCrossRegionCoopList();
  } catch {
    ElMessage.error('跨区域协同数据加载失败');
    crossRegionCoopList.value = [];
  }
};
const getCrossRegionCoopIndicatorData = async () => {
  try {
    crossRegionCoopIndicators.value = await fetchCrossRegionCoopIndicators();
    nextTick(() => initCrossRegionCoopNumberAnimations());
  } catch {
    crossRegionCoopIndicators.value = { totalCount: 0, completeRate: 0, avgCoopDuration: 0 };
  }
};
const getCrossRegionCoopAreaCountData = async () => {
  try {
    crossRegionCoopAreaData.value = await fetchCrossRegionAreaCount();
  } catch {
    crossRegionCoopAreaData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCrossRegionCoopTaskTypeCountData = async () => {
  try {
    crossRegionCoopTaskTypeData.value = await fetchCrossRegionTaskTypeCount();
  } catch {
    crossRegionCoopTaskTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCrossRegionCoopTrendData = async () => {
  try {
    crossRegionCoopTrendData.value = await fetchCrossRegionRateTrendData();
  } catch {
    crossRegionCoopTrendData.value = { xAxis: [], series: [{ name: '协同完成率(%)', data: [] }] };
  }
};

// 协同统计分析接口请求方法
const getHighFreqCoopTop10Data = async () => {
  try {
    highFreqCoopTop10List.value = await fetchHighFrequencyCoopTop10();
  } catch {
    ElMessage.error('高频协同事项TOP10数据加载失败');
    highFreqCoopTop10List.value = [];
  }
};
const getCoopAnalysisIndicatorData = async () => {
  try {
    coopAnalysisIndicators.value = await fetchCoopCoreIndicators();
    nextTick(() => initCoopAnalysisNumberAnimations());
  } catch {
    coopAnalysisIndicators.value = { totalCoopCount: 0, avgHandleCycle: 0, finishRate: 0, highPriorityRate: 0 };
  }
};
const getCoopAnalysisTypeCountData = async () => {
  try {
    coopAnalysisTypeData.value = await fetchCoopTypeCount();
  } catch {
    coopAnalysisTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCoopAnalysisAreaCountData = async () => {
  try {
    coopAnalysisAreaData.value = await fetchCoopAreaCount();
  } catch {
    coopAnalysisAreaData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCoopAnalysisIndustryRatioData = async () => {
  try {
    coopAnalysisIndustryRatioData.value = await fetchCoopIndustryRatio();
  } catch {
    coopAnalysisIndustryRatioData.value = { legend: [], series: [{ name: '行业协同占比', data: [] }] };
  }
};
const getCoopAnalysisAreaRatioData = async () => {
  try {
    coopAnalysisAreaRatioData.value = await fetchCoopAreaRatio();
  } catch {
    coopAnalysisAreaRatioData.value = { legend: [], series: [{ name: '区域协同占比', data: [] }] };
  }
};
const getCoopAnalysisTrendData = async () => {
  try {
    coopAnalysisTrendData.value = await fetchCoopTrendData();
  } catch {
    coopAnalysisTrendData.value = { xAxis: [], series: [{ name: '协同事件数', data: [] }] };
  }
};

// 协同效率评估接口请求方法
const getCoopEfficiencyListData = async () => {
  try {
    coopEfficiencyList.value = await fetchCoopEfficiencyList();
  } catch {
    ElMessage.error('协同效率评估数据加载失败');
    coopEfficiencyList.value = [];
  }
};
const getCoopEfficiencyIndicatorData = async () => {
  try {
    coopEfficiencyIndicators.value = await fetchCoopEfficiencyIndicators();
    nextTick(() => initCoopEfficiencyNumberAnimations());
  } catch {
    coopEfficiencyIndicators.value = { avgResponseDuration: 0, avgDisposalDuration: 0, avgEffectAchievementRate: 0 };
  }
};
const getCoopEfficiencyTypeCountData = async () => {
  try {
    coopEfficiencyTypeData.value = await fetchCoopEfficiencyTypeCount();
  } catch {
    coopEfficiencyTypeData.value = { xAxis: [], series: [{ name: '平均处置时长(小时)', data: [] }] };
  }
};
const getCoopEfficiencyAreaCountData = async () => {
  try {
    coopEfficiencyAreaData.value = await fetchCoopEfficiencyAreaCount();
  } catch {
    coopEfficiencyAreaData.value = { xAxis: [], series: [{ name: '平均响应时长(小时)', data: [] }] };
  }
};
const getCoopEfficiencyRecurrenceRatioData = async () => {
  try {
    coopEfficiencyRecurrenceRatioData.value = await fetchCoopEfficiencyRecurrenceRatio();
  } catch {
    coopEfficiencyRecurrenceRatioData.value = { legend: [], series: [{ name: '问题复发率占比', data: [] }] };
  }
};
const getCoopEfficiencyTrendData = async () => {
  try {
    coopEfficiencyTrendData.value = await fetchCoopEfficiencyTrendData();
  } catch {
    coopEfficiencyTrendData.value = { xAxis: [], series: [{ name: '综合效率评分', data: [] }] };
  }
};
const getCoopTypeTagType = (val: string) => {
  switch (val) {
    case 'high': return 'danger';
    case 'low': return 'success';
    case 'medium': return 'warning';
    default: return '';
  }
};
const getCoopTypeName = (val: string) => {
  switch (val) {
    case 'high': return '高优先级';
    case 'low': return '低优先级';
    case 'medium': return '中优先级';
    default: return '未知类型';
  }
};

// 政企协同视图接口请求方法
const getGovCoopListData = async () => {
  try {
    govCoopList.value = await fetchGovEnterpriseCoopList();
  } catch {
    ElMessage.error('政企协同数据加载失败');
    govCoopList.value = [];
  }
};
const getGovCoopIndicatorData = async () => {
  try {
    govCoopIndicators.value = await fetchGovEnterpriseCoopIndicators();
    nextTick(() => initGovCoopNumberAnimations());
  } catch {
    govCoopIndicators.value = { totalCount: 0, responseRate: 0, satisfactionRate: 0 };
  }
};
const getGovCoopDeptCountData = async () => {
  try {
    govCoopDeptData.value = await fetchGovDeptCoopCount();
  } catch {
    govCoopDeptData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getGovCoopEntTypeCountData = async () => {
  try {
    govCoopEntTypeData.value = await fetchEnterpriseTypeCoopCount();
  } catch {
    govCoopEntTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getGovCoopItemRatioData = async () => {
  try {
    govCoopItemRatioData.value = await fetchCoopItemTypeRatio();
  } catch {
    govCoopItemRatioData.value = { legend: [], series: [{ name: '协同事项占比', data: [] }] };
  }
};
const getGovCoopSatisfactionRatioData = async () => {
  try {
    govCoopSatisfactionRatioData.value = await fetchSatisfactionLevelRatio();
  } catch {
    govCoopSatisfactionRatioData.value = { legend: [], series: [{ name: '满意度占比', data: [] }] };
  }
};
const getGovCoopSatisfactionTagType = (val: string) => {
  switch (val) {
    case '一般': return 'danger';
    case '基本满意': return 'warning';
    case '满意': return 'info';
    case '非常满意': return 'success';
    default: return '';
  }
};
const handleGovCoopRowClick = (row: any) => {
  govCoopSelectedRow.value = JSON.parse(JSON.stringify(row));
  govCoopDetailDialogVisible.value = true;
};

// 专属协同视图接口请求方法
const getSpecialCoopListData = async () => {
  try {
    specialCoopList.value = await fetchSpecialCoopList();
  } catch {
    ElMessage.error('专属协同数据加载失败');
    specialCoopList.value = [];
  }
};
const getSpecialCoopIndicatorData = async () => {
  try {
    specialCoopIndicators.value = await fetchSpecialCoopIndicators();
    nextTick(() => initSpecialCoopNumberAnimations());
  } catch {
    specialCoopIndicators.value = { totalCount: 0, completeRate: 0, averageCycle: 0 };
  }
};
const getSpecialCoopSceneCountData = async () => {
  try {
    specialCoopSceneData.value = await fetchSpecialCoopSceneCount();
  } catch {
    specialCoopSceneData.value = { xAxis: [], series: [{ name: '协同完成数', data: [] }] };
  }
};
const getSpecialCoopDeptCountData = async () => {
  try {
    specialCoopDeptData.value = await fetchSpecialCoopDeptCount();
  } catch {
    specialCoopDeptData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getSpecialCoopSceneRatioData = async () => {
  try {
    specialCoopSceneRatioData.value = await fetchSpecialCoopSceneRatio();
  } catch {
    specialCoopSceneRatioData.value = { legend: [], series: [{ name: '协同场景占比', data: [] }] };
  }
};
const getSpecialCoopStatusRatioData = async () => {
  try {
    specialCoopStatusRatioData.value = await fetchSpecialCoopStatusRatio();
  } catch {
    specialCoopStatusRatioData.value = { legend: [], series: [{ name: '协同状态占比', data: [] }] };
  }
};


// 区域协同视图切换方法
const changeCrossRegionCoopView = (viewName: string) => {
  activeCrossRegionCoopView.value = viewName;
  if (viewName === '卡片') nextTick(() => initCrossRegionCoopNumberAnimations());
  if (viewName === '柱状图' || viewName === '折线图') {
    nextTick(() => {
      crossRegionCoopChartRefreshKey.value += 1;
    });
  }
};

// 协同统计分析视图切换方法
const changeCoopAnalysisView = (viewName: string) => {
  activeCoopAnalysisView.value = viewName;
  if (viewName === '卡片') nextTick(() => initCoopAnalysisNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图' || viewName === '折线图') {
    nextTick(() => {
      coopAnalysisChartRefreshKey.value += 1;
    });
  }
};

// 协同效率评估视图切换方法
const changeCoopEfficiencyView = (viewName: string) => {
  activeCoopEfficiencyView.value = viewName;
  if (viewName === '卡片') nextTick(() => initCoopEfficiencyNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图' || viewName === '折线图') {
    nextTick(() => {
      coopEfficiencyChartRefreshKey.value += 1;
    });
  }
};

// 政企协同视图视图切换方法
const changeGovCoopView = (viewName: string) => {
  activeGovCoopView.value = viewName;
  if (viewName === '卡片') nextTick(() => initGovCoopNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图') {
    nextTick(() => {
      govCoopChartRefreshKey.value += 1;
    });
  }
};

// 专属协同视图视图切换方法
const changeSpecialCoopView = (viewName: string) => {
  activeSpecialCoopView.value = viewName;
  if (viewName === '卡片') nextTick(() => initSpecialCoopNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图') {
    nextTick(() => {
      specialCoopChartRefreshKey.value += 1;
    });
  }
};


onMounted(async () => {
  await Promise.all([
    getCrossRegionCoopListData(),
    getCrossRegionCoopIndicatorData(),
    getCrossRegionCoopAreaCountData(),
    getCrossRegionCoopTaskTypeCountData(),
    getCrossRegionCoopTrendData(),
    getCoopAnalysisIndicatorData(),
    getCoopAnalysisTypeCountData(),
    getCoopAnalysisAreaCountData(),
    getCoopAnalysisIndustryRatioData(),
    getCoopAnalysisAreaRatioData(),
    getCoopAnalysisTrendData(),
    getHighFreqCoopTop10Data(),
    getGovCoopListData(),
    getGovCoopIndicatorData(),
    getGovCoopDeptCountData(),
    getGovCoopEntTypeCountData(),
    getGovCoopItemRatioData(),
    getGovCoopSatisfactionRatioData(),
    getSpecialCoopListData(),
    getSpecialCoopIndicatorData(),
    getSpecialCoopSceneCountData(),
    getSpecialCoopDeptCountData(),
    getSpecialCoopSceneRatioData(),
    getSpecialCoopStatusRatioData(),
    getCoopEfficiencyListData(),
    getCoopEfficiencyIndicatorData(),
    getCoopEfficiencyTypeCountData(),
    getCoopEfficiencyAreaCountData(),
    getCoopEfficiencyRecurrenceRatioData(),
    getCoopEfficiencyTrendData(),
  ]);
  setTimeout(() => {
    crossRegionCoopChartRefreshKey.value += 1;
    coopAnalysisChartRefreshKey.value += 1;
    govCoopChartRefreshKey.value += 1;
    specialCoopChartRefreshKey.value += 1;
    coopEfficiencyChartRefreshKey.value += 1;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
});

onUnmounted(() => {
  screenFull.off('change', handleFullscreenChange);
  currentFullscreenPanel.value = null;
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="topLeftPanel">
          <el-tabs v-model="topLeftActiveTab" class="custom-tabs top-left-tabs">
            <el-tab-pane label="区域协同" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in crossRegionCoopViewBtnList"
                      :key="item"
                      :type="activeCrossRegionCoopView === item ? 'primary' : ''"
                      plain
                      @click="changeCrossRegionCoopView(item)"
                      class="view-btn"
                    >{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topLeftPanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeCrossRegionCoopView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1" style="cursor: default">
                    <div class="indicator-title">跨区域协同总数</div>
                    <div class="indicator-value">
                      <span :data-value="crossRegionCoopIndicators.totalCount" class="cross-region-coop-number-animate">
                        {{ crossRegionCoopIndicators.totalCount }}
                      </span>
                    </div>
                    <div class="indicator-unit">件</div>
                  </div>
                  <div class="indicator-card1 card2" style="cursor: default">
                    <div class="indicator-title">协同完成率</div>
                    <div class="indicator-value">
                      <span :data-value="crossRegionCoopIndicators.completeRate * 100" class="cross-region-coop-number-animate">
                        {{ (crossRegionCoopIndicators.completeRate * 100).toFixed(1) }}
                      </span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card1 card3" style="cursor: default">
                    <div class="indicator-title">平均协同时长</div>
                    <div class="indicator-value">
                      <span :data-value="crossRegionCoopIndicators.avgCoopDuration" class="cross-region-coop-number-animate">
                        {{ crossRegionCoopIndicators.avgCoopDuration }}
                      </span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                </div>
              </div>
              <div v-if="activeCrossRegionCoopView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 1.2vw 0.2vw;">
                <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="crossRegionCoopChartRefreshKey">
                  <VerticalBar1
                    :x-axis="crossRegionCoopAreaData.xAxis"
                    :series="crossRegionCoopAreaData.series"
                    unit="件"
                    title="区域协同数对比"
                    :base-font-scale="crossRegionCoopBaseFontScale"
                    :active-indices="crossRegionCoopActiveIndices"
                    style="width:100%;height:100%;"
                  />
                </div>
                <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="crossRegionCoopChartRefreshKey">
                  <VerticalBar2
                    :x-axis="crossRegionCoopTaskTypeData.xAxis"
                    :series="crossRegionCoopTaskTypeData.series"
                    unit="件"
                    title="任务类型协同数对比"
                    :base-font-scale="crossRegionCoopBaseFontScale"
                    :active-indices="crossRegionCoopActiveIndices"
                    style="width:100%;height:100%;"
                  />
                </div>
              </div>
              <div v-if="activeCrossRegionCoopView === '折线图'" class="view-content" style="box-sizing: border-box;width:100%;height:100%;padding:0.3vw 0.2vw 1.2vw 0.2vw;" :key="crossRegionCoopChartRefreshKey">
                <ChartLine1
                  :data="crossRegionCoopTrendData"
                  title="协同完成率趋势"
                  y-axis-name="协同完成率(%)"
                  :base-font-scale="crossRegionCoopBaseFontScale"
                  style="width:100%;height:100%;"
                />
              </div>
              <div v-if="activeCrossRegionCoopView === '列表'" class="view-content">
                <div class="table-box3">
                  <ElTable
                    class="table3"
                    :data="crossRegionCoopList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                  >
                    <ElTableColumn prop="crossRegionCoopId" label="跨区域协同ID" align="center" />
                    <ElTableColumn prop="coopTask" label="协同任务" align="center" min-width="120px" />
                    <ElTableColumn prop="launchAreaCode" label="发起区域" align="center" min-width="200px" />
                    <ElTableColumn prop="cooperateAreaCode" label="配合区域" align="center" min-width="200px" />
                    <ElTableColumn prop="progressNode" label="进度节点" align="center" min-width="280px" />
                    <ElTableColumn label="协同完成率" align="center" min-width="100px">
                      <template #default="scope">{{ formatCompleteRate(scope.row.coopCompleteRate) }}</template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="部门协同" name="tab2" />
            <el-tab-pane label="行业协同" name="tab3" />
            <el-tab-pane label="层级协同" name="tab4" />
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right" ref="topRightPanel">
          <div class="header-actions">
            <div class="actions-left"><p>协同统计分析</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in coopAnalysisViewBtnList"
                  :key="item"
                  :type="activeCoopAnalysisView === item ? 'primary' : ''"
                  plain
                  @click="changeCoopAnalysisView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topRightPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">协同事项总数</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.totalCoopCount" class="coop-analysis-number-animate">
                    {{ coopAnalysisIndicators.totalCoopCount }}
                  </span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">平均处理周期</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.avgHandleCycle" class="coop-analysis-number-animate">
                    {{ coopAnalysisIndicators.avgHandleCycle }}
                  </span>
                </div>
                <div class="indicator-unit">天</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">协同完成率</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.finishRate * 100" class="coop-analysis-number-animate">
                    {{ (coopAnalysisIndicators.finishRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card1 card4" style="cursor: default">
                <div class="indicator-title">高优协同占比</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.highPriorityRate * 100" class="coop-analysis-number-animate">
                    {{ (coopAnalysisIndicators.highPriorityRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="coopAnalysisChartRefreshKey">
              <VerticalBar1
                :x-axis="coopAnalysisTypeData.xAxis"
                :series="coopAnalysisTypeData.series"
                unit="件"
                title="类型协同数对比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="coopAnalysisChartRefreshKey">
              <VerticalBar2
                :x-axis="coopAnalysisAreaData.xAxis"
                :series="coopAnalysisAreaData.series"
                unit="件"
                title="区域协同数对比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="coopAnalysisChartRefreshKey">
              <ChartPie2
                :data="coopAnalysisIndustryRatioData"
                title="行业协同占比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="coopAnalysisChartRefreshKey">
              <ChartPie4
                :data="coopAnalysisAreaRatioData"
                title="区域协同占比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '折线图'" class="view-content" style="box-sizing: border-box;width:100%;height:100%;padding:0.3vw;" :key="coopAnalysisChartRefreshKey">
            <ChartLine1
              :data="coopAnalysisTrendData"
              title="协同事件近周期趋势"
              y-axis-name="协同事件数"
              :base-font-scale="coopAnalysisBaseFontScale"
              style="width:100%;height:100%;"
            />
          </div>
          <div v-if="activeCoopAnalysisView === '列表'" class="view-content">
            <div class="rank-box">
              <ElTable
                :data="highFreqCoopTop10List"
                border
                size="small"
                style="width: 100%; height: 100%"
                row-class-name="rank-row"
              >
                <ElTableColumn prop="rank" label="排名" width="80" align="center">
                  <template #default="scope"><div class="rank-tag">{{ scope.row.rank }}</div></template>
                </ElTableColumn>
                <ElTableColumn prop="coopStatId" label="协同统计ID" />
                <ElTableColumn prop="coopType" label="协同类型">
                  <template #default="scope"><ElTag :type="getCoopTypeTagType(scope.row.coopType)">{{ getCoopTypeName(scope.row.coopType) }}</ElTag></template>
                </ElTableColumn>
                <ElTableColumn prop="coopCount" label="协同事件数量">
                  <template #default="scope">{{ formatNumber(scope.row.coopCount) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="top10CoopItem" label="协同事项" min-width="150" />
              </ElTable>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="bottomLeftPanel">
          <div class="header-actions">
            <div class="actions-left"><p>政企协同视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in govCoopViewBtnList"
                  :key="item"
                  :type="activeGovCoopView === item ? 'primary' : ''"
                  plain
                  @click="changeGovCoopView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomLeftPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeGovCoopView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">政企协同总数</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.totalCount" class="gov-coop-number-animate">
                    {{ govCoopIndicators.totalCount }}
                  </span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">政企响应率</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.responseRate * 100" class="gov-coop-number-animate">
                    {{ (govCoopIndicators.responseRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">政企满意度</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.satisfactionRate" class="gov-coop-number-animate">
                    {{ govCoopIndicators.satisfactionRate.toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <div v-if="activeGovCoopView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="govCoopChartRefreshKey">
              <VerticalBar2
                :x-axis="govCoopDeptData.xAxis"
                :series="govCoopDeptData.series"
                unit="件"
                title="政府部门协同数对比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="govCoopChartRefreshKey">
              <VerticalBar1
                :x-axis="govCoopEntTypeData.xAxis"
                :series="govCoopEntTypeData.series"
                unit="件"
                title="企业类型协同数对比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeGovCoopView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="govCoopChartRefreshKey">
              <ChartPie1
                :data="govCoopItemRatioData"
                title="协同事项类型占比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="govCoopChartRefreshKey">
              <ChartPie2
                :data="govCoopSatisfactionRatioData"
                title="满意度评价占比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeGovCoopView === '列表'" class="view-content">
            <div class="table-box1">
              <ElTable
                class="table1"
                :data="govCoopList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="handleGovCoopRowClick"
              >
                <ElTableColumn prop="govEnterpriseCoopId" label="政企协同ID" align="center" />
                <ElTableColumn prop="coopItem" label="协同事项" align="center" min-width="120px" />
                <ElTableColumn prop="govDepartment" label="政府部门" align="center" min-width="100px" />
                <ElTableColumn prop="merchantId" label="企业ID" align="center" />
                <ElTableColumn prop="progressFeedback" label="进度反馈" align="center" min-width="180px" />
                <ElTableColumn label="满意度评价" align="center" min-width="100px">
                  <template #default="scope"><ElTag :type="getGovCoopSatisfactionTagType(scope.row.satisfactionEvaluation)">{{ scope.row.satisfactionEvaluation }}</ElTag></template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="bottomMiddlePanel">
          <div class="header-actions">
            <div class="actions-left"><p>专属协同视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in specialCoopViewBtnList"
                  :key="item"
                  :type="activeSpecialCoopView === item ? 'primary' : ''"
                  plain
                  @click="changeSpecialCoopView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomMiddlePanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">专属协同总数</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.totalCount" class="special-coop-number-animate">
                    {{ specialCoopIndicators.totalCount }}
                  </span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">协同完成率</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.completeRate * 100" class="special-coop-number-animate">
                    {{ (specialCoopIndicators.completeRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">平均协同周期</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.averageCycle" class="special-coop-number-animate">
                    {{ specialCoopIndicators.averageCycle }}
                  </span>
                </div>
                <div class="indicator-unit">天</div>
              </div>
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="specialCoopChartRefreshKey">
              <VerticalBar1
                :x-axis="specialCoopSceneData.xAxis"
                :series="specialCoopSceneData.series"
                unit="件"
                title="场景协同数对比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="specialCoopChartRefreshKey">
              <VerticalBar2
                :x-axis="specialCoopDeptData.xAxis"
                :series="specialCoopDeptData.series"
                unit="件"
                title="责任单位协同数对比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="specialCoopChartRefreshKey">
              <ChartPie1
                :data="specialCoopSceneRatioData"
                title="协同场景占比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="specialCoopChartRefreshKey">
              <ChartPie2
                :data="specialCoopStatusRatioData"
                title="协同状态占比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '列表'" class="view-content">
            <div class="table-box1">
              <ElTable
                class="table1"
                :data="specialCoopList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
              >
                <ElTableColumn prop="specialCoopId" label="专属协同ID" align="center" />
                <ElTableColumn prop="coopScene" label="协同场景" align="center" min-width="160px" />
                <ElTableColumn prop="coopRule" label="协同规则" align="center" min-width="180px" />
                <ElTableColumn prop="responsibilityDivision" label="责任分工" align="center" min-width="200px" />
                <ElTableColumn prop="coopResult" label="协同结果" align="center" min-width="180px" />
                <ElTableColumn prop="completeTime" label="完成时间" align="center" min-width="120px">
                  <template #default="scope">{{ formatSpecialCoopTimeStamp(scope.row.completeTime) }}</template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right" ref="bottomRightPanel">
          <div class="header-actions">
            <div class="actions-left"><p>协同效率评估</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in coopEfficiencyViewBtnList"
                  :key="item"
                  :type="activeCoopEfficiencyView === item ? 'primary' : ''"
                  plain
                  @click="changeCoopEfficiencyView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomRightPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">平均响应时长</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgResponseDuration" class="coop-efficiency-number-animate">
                    {{ coopEfficiencyIndicators.avgResponseDuration }}
                  </span>
                </div>
                <div class="indicator-unit">小时</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">平均处置时长</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgDisposalDuration" class="coop-efficiency-number-animate">
                    {{ coopEfficiencyIndicators.avgDisposalDuration }}
                  </span>
                </div>
                <div class="indicator-unit">小时</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">平均成效达标率</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgEffectAchievementRate * 100" class="coop-efficiency-number-animate">
                    {{ (coopEfficiencyIndicators.avgEffectAchievementRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="coopEfficiencyChartRefreshKey">
              <VerticalBar1
                :x-axis="coopEfficiencyTypeData.xAxis"
                :series="coopEfficiencyTypeData.series"
                unit="小时"
                title="类型协同效率对比"
                :base-font-scale="coopEfficiencyBaseFontScale"
                :active-indices="coopEfficiencyActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="coopEfficiencyChartRefreshKey">
              <VerticalBar2
                :x-axis="coopEfficiencyAreaData.xAxis"
                :series="coopEfficiencyAreaData.series"
                unit="小时"
                title="区域协同效率对比"
                :base-font-scale="coopEfficiencyBaseFontScale"
                :active-indices="coopEfficiencyActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 100%;height: 100%;vertical-align: top;" :key="coopEfficiencyChartRefreshKey">
              <ChartPie2
                :data="coopEfficiencyRecurrenceRatioData"
                title="问题复发率占比"
                :base-font-scale="coopEfficiencyBaseFontScale"
                :active-indices="coopEfficiencyActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '折线图'" class="view-content" style="box-sizing: border-box;width:100%;height:100%;padding:0.3vw;" :key="coopEfficiencyChartRefreshKey">
            <ChartLine1
              :data="coopEfficiencyTrendData"
              title="协同效率趋势"
              y-axis-name="综合效率评分"
              :base-font-scale="coopEfficiencyBaseFontScale"
              style="width:100%;height:100%;"
            />
          </div>
          <div v-if="activeCoopEfficiencyView === '列表'" class="view-content">
            <div class="table-box1">
              <ElTable
                class="table1"
                :data="coopEfficiencyList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
              >
                <ElTableColumn prop="coopEfficiencyId" label="协同效率评估ID" align="center" />
                <ElTableColumn prop="coopType" label="协同类型" align="center">
                  <template #default="scope"><ElTag :type="getCoopTypeTagType(scope.row.coopType)">{{ getCoopTypeName(scope.row.coopType) }}</ElTag></template>
                </ElTableColumn>
                <ElTableColumn prop="responseDuration" label="响应时长(小时)" align="center" min-width="100px">
                  <template #default="scope">{{ scope.row.responseDuration.toFixed(1) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="disposalDuration" label="处置时长(小时)" align="center" min-width="100px">
                  <template #default="scope">{{ scope.row.disposalDuration.toFixed(1) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="collaborationCost" label="协同成本" align="center" min-width="100px">
                  <template #default="scope">{{ formatNumber(scope.row.collaborationCost) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="effectAchievementRate" label="成效达标率" align="center" min-width="100px">
                  <template #default="scope">{{ (scope.row.effectAchievementRate * 100).toFixed(1) }}%</template>
                </ElTableColumn>
                <ElTableColumn prop="problemRecurrenceRate" label="问题复发率" align="center" min-width="100px">
                  <template #default="scope">{{ (scope.row.problemRecurrenceRate * 100).toFixed(1) }}%</template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/table2-rank';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/indicator-cards1';

@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 20px;
  overflow: hidden !important;
  color: #fff;
  background: url('../../images/bg.jpg');
  background-size: 100% 100%;
}

.header-box {
  position: relative;
  width: 100%;
  height: 10vh;
  font-size: 2.1vw;
  font-weight: bold;
  color: #0cf;
  background: url('../../images/head_bg.png') no-repeat;
  background-size: 100% 100%;
  .head-name {
    position: absolute;
    left: 50%;
    display: inline-block;
    line-height: 9vh;
    white-space: nowrap;
    transform: translateX(-50%);
  }
}

.panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0.5vw;
  overflow: hidden !important;
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1vh 1.2vw;
  border-bottom: 1px solid rgb(0 204 255 / 10%);
  h2 {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 1.1vw;
    font-weight: 600;
    color: #ffb800;
  }
}

.panel-body {
  flex: 1;
  height: calc(100% - 6vh);
  padding: 1.2vw;
  overflow: hidden;
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  height: 91vh;
  margin: 0 auto;
  overflow: hidden !important;
}

.top { display: flex; gap: 0.6vw; height: 50%; overflow: hidden !important; }
.top-left { flex: 1; }
.top-right { flex: 1; }
.bottom { display: flex; gap: 0.6vw; height: 46%; overflow: hidden !important; }
.bottom-left { flex: 1; }
.bottom-middle { flex: 1; }
.bottom-right { flex: 1; }

.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.2vw;
  .actions-left p {
    margin: 0;
    font-size: 0.9vw;
    font-weight: 500;
    color: #00ffd0;
  }
  .view-btn-group { display: flex; margin-right: 0.5vw; }
  :deep(.view-btn) {
    padding: 0 0.4vw;
    font-size: 0.6vw;
    color: #fff;
    background-color: transparent;
    border-color: rgb(25 186 139 / 60%);
    &:hover { color: #00ffd0; border-color: #00ffd0; }
    &.el-button--primary {
      color: #afc2ff;
      background-color: rgb(0 204 255 / 20%);
      border-color: rgb(25 186 139 / 60%);
    }
  }
  .panel-fullscreen-btn { margin-right: 0.5vw; cursor: pointer; background: transparent; border: none; }
}

.view-content {
  box-sizing: border-box !important;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
}

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1vw;
  color: #00ffd0;
}

.blink-animation { animation: blink 1.5s infinite; }

:deep(.panel) {
  .el-tab-pane { display: flex; flex-direction: column; width: 100% !important; height: 100% !important; }
  .view-content { flex: 1; width: 100% !important; height: 100% !important; min-height: 300px !important; }
  .view-content > div { width: 100% !important; height: 100% !important; }
}

:deep(.top-left .view-content) { padding: 0.2vw !important; box-sizing: border-box !important; }

:deep(.top-left-tabs) {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
  .el-tabs__item {
    margin: 0 0.1vw !important;
    font-size: 0.85vw !important;
    color: #b6e1ad !important;
  }
  .el-tabs__item.is-active { font-weight: 600; color: #0cf !important; }
  .el-tabs__active-bar { height: 0.15vw !important; background: #0cf !important; }
  .el-tab-pane { width: 100%; height: 100%; padding: 0 !important; }

  /* 调整 Tabs 与内容的间距 */
  .el-tabs__nav-wrap::after {
    content: none !important;
  }

  .el-tabs__nav-wrap.is-scrollable::after {
    content: none !important;
  }

  .el-tabs__header {
    margin-bottom: 0 !important;
  }

  .el-tabs__content {
    padding-top: 0 !important;
  }
}
</style>
