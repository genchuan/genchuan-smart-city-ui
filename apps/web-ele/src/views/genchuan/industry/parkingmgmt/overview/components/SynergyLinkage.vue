<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import {Filter, ArrowLeft, FullScreen, Operation} from '@element-plus/icons-vue';
import { ElMessage, ElTable, ElTableColumn, ElTag, ElButton, ElDialog } from 'element-plus';
import screenFull from 'screenfull';
// 引入所有接口：原有所有 + 新增6个协同统计分析 + TOP10 + 新增6个协同效率评估 + 新增5个区域协同接口
import { fetchGovEnterpriseCoopList, fetchGovEnterpriseCoopIndicators, fetchGovDeptCoopCount, fetchEnterpriseTypeCoopCount, fetchCoopItemTypeRatio, fetchSatisfactionLevelRatio, fetchSpecialCoopList, fetchSpecialCoopIndicators, fetchSpecialCoopSceneCount, fetchSpecialCoopDeptCount, fetchSpecialCoopSceneRatio, fetchSpecialCoopStatusRatio, fetchHighFrequencyCoopTop10, fetchCoopCoreIndicators, fetchCoopTypeCount, fetchCoopAreaCount, fetchCoopIndustryRatio, fetchCoopAreaRatio, fetchCoopTrendData, fetchCoopEfficiencyList, fetchCoopEfficiencyIndicators, fetchCoopEfficiencyTypeCount, fetchCoopEfficiencyAreaCount, fetchCoopEfficiencyRecurrenceRatio, fetchCoopEfficiencyTrendData, fetchCrossRegionCoopList, fetchCrossRegionCoopIndicators, fetchCrossRegionAreaCount, fetchCrossRegionTaskTypeCount, fetchCrossRegionRateTrendData } from '#/api/genchuan/industry/parkingmgmt/overview/SynergyLinkage.ts';
// 导入图表组件：柱状图+饼图组件 (复用原有 无需新增)
import HorizontalBar1 from '#/views/genchuan/industry/templatesstatchart/HorizontalBar1.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie4 from '#/views/genchuan/industry/templatesstatchart/ChartPie4.vue';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';

// 左上Tabs绑定变量 - 和参考代码写法完全一致
const topLeftActiveTab = ref('tab1');

// ========== 【区域协同视图】所有变量 - 前缀crossRegionCoop 全新新增 无冲突 样式同协同统计分析 ==========
const crossRegionCoopPanelRef = ref<HTMLElement | null>(null);
const crossRegionCoopCurrentFullscreenPanel = ref<HTMLElement | null>(null);
const crossRegionCoopList = ref<any[]>([]);
const crossRegionCoopIndicators = ref({ totalCount: 0, completeRate: 0, avgCoopDuration: 0 });
const crossRegionCoopAreaData = ref({ xAxis: [], series: [] });
const crossRegionCoopTaskTypeData = ref({ xAxis: [], series: [] });
const crossRegionCoopTrendData = ref({ xAxis: [], series: [] });
const crossRegionCoopBaseFontScale = ref(1);
const crossRegionCoopActiveIndices = ref([]);
const crossRegionCoopChartRefreshKey = ref(0);
const activeCrossRegionCoopView = ref('列表');
const crossRegionCoopViewBtnList = ref(['卡片', '柱状图', '折线图', '列表']);

// ========== 【协同统计分析】专属独立变量 - 前缀coopAnalysis 彻底无冲突 新增核心 ==========
const coopAnalysisPanelRef = ref<HTMLElement | null>(null);
const coopAnalysisCurrentFullscreenPanel = ref<HTMLElement | null>(null);
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

// ========== 【政企协同视图】所有变量 - 前缀govCoop 彻底无冲突 原有保留 ==========
const pageContainerRef = ref<HTMLElement | null>(null);
const govCoopPanelRef = ref<HTMLElement | null>(null);
const govCoopCurrentFullscreenPanel = ref<HTMLElement | null>(null);
const router = useRouter();
const govCoopList = ref<any[]>([]);
const govCoopIndicators = ref({ totalCount: 0, responseRate: 0, satisfactionRate: 0 });
const govCoopDeptData = ref({ xAxis: [], series: [] });
const govCoopEntTypeData = ref({ xAxis: [], series: [] });
const govCoopItemRatioData = ref({ legend: [], series: [] });
const govCoopSatisfactionRatioData = ref({ legend: [], series: [] });
const govCoopBaseFontScale = ref(1);
const govCoopActiveIndices = ref([]);
const govCoopChartRefreshKey = ref(0);
const activeGovCoopView = ref('卡片');
const govCoopViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const govCoopDetailDialogVisible = ref(false);
const govCoopSelectedRow = ref<any>({});

// ========== 【专属协同视图】所有变量 - 前缀specialCoop 全新新增 与政企无任何冲突 原有保留 ==========
const specialCoopPanelRef = ref<HTMLElement | null>(null);
const specialCoopCurrentFullscreenPanel = ref<HTMLElement | null>(null);
const specialCoopList = ref<any[]>([]);
const specialCoopIndicators = ref({ totalCount: 0, completeRate: 0, averageCycle: 0 });
const specialCoopSceneData = ref({ xAxis: [], series: [] });
const specialCoopDeptData = ref({ xAxis: [], series: [] });
const specialCoopSceneRatioData = ref({ legend: [], series: [] });
const specialCoopStatusRatioData = ref({ legend: [], series: [] });
const specialCoopBaseFontScale = ref(1);
const specialCoopActiveIndices = ref([]);
const specialCoopChartRefreshKey = ref(0);
const activeSpecialCoopView = ref('列表');
const specialCoopViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);

// ========== 【协同效率评估】专属独立变量 - 前缀coopEfficiency 彻底无冲突 全新新增核心 ==========
const coopEfficiencyPanelRef = ref<HTMLElement | null>(null);
const coopEfficiencyCurrentFullscreenPanel = ref<HTMLElement | null>(null);
const coopEfficiencyList = ref<any[]>([]);
const coopEfficiencyIndicators = ref({ avgResponseDuration: 0, avgDisposalDuration: 0, avgEffectAchievementRate: 0 });
const coopEfficiencyTypeData = ref({ xAxis: [], series: [] });
const coopEfficiencyAreaData = ref({ xAxis: [], series: [] });
const coopEfficiencyRecurrenceRatioData = ref({ legend: [], series: [] });
const coopEfficiencyTrendData = ref({ xAxis: [], series: [] });
const coopEfficiencyBaseFontScale = ref(1);
const coopEfficiencyActiveIndices = ref([]);
const coopEfficiencyChartRefreshKey = ref(0);
const activeCoopEfficiencyView = ref('列表');
const coopEfficiencyViewBtnList = ref(['卡片', '柱状图', '饼图', '折线图', '列表']);

// ========== 【区域协同】新增视图切换方法 - 完全复用协同统计分析逻辑 无修改 ==========
const changeCrossRegionCoopView = (viewName: string) => {
  activeCrossRegionCoopView.value = viewName;
  if(viewName === '卡片'){
    nextTick(() => initCrossRegionCoopNumberAnimations());
  }
  if(viewName === '柱状图' || viewName === '折线图'){
    nextTick(() => {
      crossRegionCoopChartRefreshKey.value +=1;
      setTimeout(()=>window.dispatchEvent(new Event('resize')),100);
    });
  }
};

// ========== 【协同统计分析】新增视图切换方法 - 完全复用政企逻辑 核心新增 ==========
const changeCoopAnalysisView = (viewName: string) => {
  activeCoopAnalysisView.value = viewName;
  if(viewName === '卡片'){
    nextTick(() => initCoopAnalysisNumberAnimations());
  }
  if(viewName === '柱状图' || viewName === '饼图' || viewName === '折线图'){
    nextTick(() => {
      coopAnalysisChartRefreshKey.value +=1;
      setTimeout(()=>window.dispatchEvent(new Event('resize')),100);
    });
  }
};

// ========== 【政企协同视图】切换视图方法 ==========
const changeGovCoopView = (viewName: string) => {
  activeGovCoopView.value = viewName;
  if(viewName === '卡片'){
    nextTick(() => initGovCoopNumberAnimations());
  }
  if(viewName === '柱状图' || viewName === '饼图'){
    nextTick(() => {
      govCoopChartRefreshKey.value +=1;
      setTimeout(()=>window.dispatchEvent(new Event('resize')),100);
    });
  }
};

// ========== 【专属协同视图】切换视图方法 ==========
const changeSpecialCoopView = (viewName: string) => {
  activeSpecialCoopView.value = viewName;
  if(viewName === '卡片'){
    nextTick(() => initSpecialCoopNumberAnimations());
  }
  if(viewName === '柱状图' || viewName === '饼图'){
    nextTick(() => {
      specialCoopChartRefreshKey.value +=1;
      setTimeout(()=>window.dispatchEvent(new Event('resize')),100);
    });
  }
};

// ========== 【协同效率评估】新增视图切换方法 - 完全复用协同统计分析逻辑 核心新增 ==========
const changeCoopEfficiencyView = (viewName: string) => {
  activeCoopEfficiencyView.value = viewName;
  if(viewName === '卡片'){
    nextTick(() => initCoopEfficiencyNumberAnimations());
  }
  if(viewName === '柱状图' || viewName === '饼图' || viewName === '折线图'){
    nextTick(() => {
      coopEfficiencyChartRefreshKey.value +=1;
      setTimeout(()=>window.dispatchEvent(new Event('resize')),100);
    });
  }
};

// ========== 【区域协同】新增全屏事件方法 - 完全复用协同统计分析逻辑 无修改 ==========
const handleCrossRegionCoopFullscreenChange = () => {
  if (!screenFull.isFullscreen && crossRegionCoopCurrentFullscreenPanel.value) {
    crossRegionCoopCurrentFullscreenPanel.value.style.width = '';
    crossRegionCoopCurrentFullscreenPanel.value.style.maxWidth = '';
    crossRegionCoopCurrentFullscreenPanel.value.style.overflow = 'hidden';
    screenFull.off('change', handleCrossRegionCoopFullscreenChange);
    nextTick(() => {
      setTimeout(() => {
        crossRegionCoopChartRefreshKey.value += 1;
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
    crossRegionCoopCurrentFullscreenPanel.value = null;
  }
};
const toggleCrossRegionCoopPanelFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = crossRegionCoopPanelRef.value;
  if (!panel) return;
  if (crossRegionCoopCurrentFullscreenPanel.value) screenFull.off('change', handleCrossRegionCoopFullscreenChange);
  crossRegionCoopCurrentFullscreenPanel.value = panel;
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.on('change', handleCrossRegionCoopFullscreenChange);
    screenFull.request(panel).catch((error) => {
      ElMessage.error(`全屏失败：${error.message}`);
    });
  }
};

// ========== 【协同统计分析】新增全屏事件方法 - 完全复用政企逻辑 核心新增 ==========
const handleCoopAnalysisFullscreenChange = () => {
  if (!screenFull.isFullscreen && coopAnalysisCurrentFullscreenPanel.value) {
    coopAnalysisCurrentFullscreenPanel.value.style.width = '';
    coopAnalysisCurrentFullscreenPanel.value.style.maxWidth = '';
    coopAnalysisCurrentFullscreenPanel.value.style.overflow = 'hidden';
    screenFull.off('change', handleCoopAnalysisFullscreenChange);
    nextTick(() => {
      setTimeout(() => {
        coopAnalysisChartRefreshKey.value += 1;
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
    coopAnalysisCurrentFullscreenPanel.value = null;
  }
};
const toggleCoopAnalysisPanelFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = coopAnalysisPanelRef.value;
  if (!panel) return;
  if (coopAnalysisCurrentFullscreenPanel.value) screenFull.off('change', handleCoopAnalysisFullscreenChange);
  coopAnalysisCurrentFullscreenPanel.value = panel;
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.on('change', handleCoopAnalysisFullscreenChange);
    screenFull.request(panel).catch((error) => {
      ElMessage.error(`全屏失败：${error.message}`);
    });
  }
};

// ========== 【协同效率评估】新增全屏事件方法 - 完全复用协同统计分析逻辑 核心新增 ==========
const handleCoopEfficiencyFullscreenChange = () => {
  if (!screenFull.isFullscreen && coopEfficiencyCurrentFullscreenPanel.value) {
    coopEfficiencyCurrentFullscreenPanel.value.style.width = '';
    coopEfficiencyCurrentFullscreenPanel.value.style.maxWidth = '';
    coopEfficiencyCurrentFullscreenPanel.value.style.overflow = 'hidden';
    screenFull.off('change', handleCoopEfficiencyFullscreenChange);
    nextTick(() => {
      setTimeout(() => {
        coopEfficiencyChartRefreshKey.value += 1;
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
    coopEfficiencyCurrentFullscreenPanel.value = null;
  }
};
const toggleCoopEfficiencyPanelFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = coopEfficiencyPanelRef.value;
  if (!panel) return;
  if (coopEfficiencyCurrentFullscreenPanel.value) screenFull.off('change', handleCoopEfficiencyFullscreenChange);
  coopEfficiencyCurrentFullscreenPanel.value = panel;
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.on('change', handleCoopEfficiencyFullscreenChange);
    screenFull.request(panel).catch((error) => {
      ElMessage.error(`全屏失败：${error.message}`);
    });
  }
};

// ========== 【区域协同】所有请求方法 完整新增 核心 ==========
const getCrossRegionCoopListData = async () => {
  try {
    const res = await fetchCrossRegionCoopList();
    crossRegionCoopList.value = res;
  } catch (err) {
    ElMessage.error('跨区域协同数据加载失败');
    crossRegionCoopList.value = [];
  }
};
const getCrossRegionCoopIndicatorData = async () => {
  try {
    const res = await fetchCrossRegionCoopIndicators();
    crossRegionCoopIndicators.value = res;
    nextTick(() => initCrossRegionCoopNumberAnimations());
  } catch (err) {
    console.warn('区域协同核心指标接口异常，使用兜底数据');
    crossRegionCoopIndicators.value = { totalCount: 0, completeRate: 0, avgCoopDuration: 0 };
  }
};
const getCrossRegionCoopAreaCountData = async () => {
  try {
    const res = await fetchCrossRegionAreaCount();
    crossRegionCoopAreaData.value = res;
  } catch (err) {
    console.warn('区域协同数对比接口异常，使用兜底数据');
    crossRegionCoopAreaData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCrossRegionCoopTaskTypeCountData = async () => {
  try {
    const res = await fetchCrossRegionTaskTypeCount();
    crossRegionCoopTaskTypeData.value = res;
  } catch (err) {
    console.warn('任务类型协同数对比接口异常，使用兜底数据');
    crossRegionCoopTaskTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCrossRegionCoopTrendData = async () => {
  try {
    const res = await fetchCrossRegionRateTrendData();
    crossRegionCoopTrendData.value = res;
  } catch (err) {
    console.warn('协同完成率趋势折线图接口异常，使用兜底数据');
    crossRegionCoopTrendData.value = { xAxis: [], series: [{ name: '协同完成率(%)', data: [] }] };
  }
};

// ========== 【协同统计分析】所有请求方法 + 原有TOP10方法 完整保留 核心新增 ==========
const getHighFreqCoopTop10Data = async () => {
  try {
    const res = await fetchHighFrequencyCoopTop10();
    highFreqCoopTop10List.value = res;
  } catch (err) {
    ElMessage.error('高频协同事项TOP10数据加载失败');
    highFreqCoopTop10List.value = [];
  }
};
const getCoopAnalysisIndicatorData = async () => {
  try {
    const res = await fetchCoopCoreIndicators();
    coopAnalysisIndicators.value = res;
    nextTick(() => initCoopAnalysisNumberAnimations());
  } catch (err) {
    console.warn('协同核心统计指标接口异常，使用兜底数据');
    coopAnalysisIndicators.value = { totalCoopCount: 0, avgHandleCycle: 0, finishRate: 0, highPriorityRate: 0 };
  }
};
const getCoopAnalysisTypeCountData = async () => {
  try {
    const res = await fetchCoopTypeCount();
    coopAnalysisTypeData.value = res;
  } catch (err) {
    console.warn('类型协同数对比接口异常，使用兜底数据');
    coopAnalysisTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCoopAnalysisAreaCountData = async () => {
  try {
    const res = await fetchCoopAreaCount();
    coopAnalysisAreaData.value = res;
  } catch (err) {
    console.warn('区域协同数对比接口异常，使用兜底数据');
    coopAnalysisAreaData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCoopAnalysisIndustryRatioData = async () => {
  try {
    const res = await fetchCoopIndustryRatio();
    coopAnalysisIndustryRatioData.value = res;
  } catch (err) {
    console.warn('行业协同占比饼图接口异常，使用兜底数据');
    coopAnalysisIndustryRatioData.value = { legend: [], series: [{ name: '行业协同占比', data: [] }] };
  }
};
const getCoopAnalysisAreaRatioData = async () => {
  try {
    const res = await fetchCoopAreaRatio();
    coopAnalysisAreaRatioData.value = res;
  } catch (err) {
    console.warn('区域协同占比饼图接口异常，使用兜底数据');
    coopAnalysisAreaRatioData.value = { legend: [], series: [{ name: '区域协同占比', data: [] }] };
  }
};
const getCoopAnalysisTrendData = async () => {
  try {
    const res = await fetchCoopTrendData();
    coopAnalysisTrendData.value = res;
  } catch (err) {
    console.warn('协同趋势折线图接口异常，使用兜底数据');
    coopAnalysisTrendData.value = { xAxis: [], series: [{ name: '协同事件数', data: [] }] };
  }
};

// ========== 【协同效率评估】所有请求方法 完整新增 核心 ==========
const getCoopEfficiencyListData = async () => {
  try {
    const res = await fetchCoopEfficiencyList();
    coopEfficiencyList.value = res;
  } catch (err) {
    ElMessage.error('协同效率评估数据加载失败');
    coopEfficiencyList.value = [];
  }
};
const getCoopEfficiencyIndicatorData = async () => {
  try {
    const res = await fetchCoopEfficiencyIndicators();
    coopEfficiencyIndicators.value = res;
    nextTick(() => initCoopEfficiencyNumberAnimations());
  } catch (err) {
    console.warn('协同效率评估指标接口异常，使用兜底数据');
    coopEfficiencyIndicators.value = { avgResponseDuration: 0, avgDisposalDuration: 0, avgEffectAchievementRate: 0 };
  }
};
const getCoopEfficiencyTypeCountData = async () => {
  try {
    const res = await fetchCoopEfficiencyTypeCount();
    coopEfficiencyTypeData.value = res;
  } catch (err) {
    console.warn('类型协同效率对比接口异常，使用兜底数据');
    coopEfficiencyTypeData.value = { xAxis: [], series: [{ name: '平均处置时长(小时)', data: [] }] };
  }
};
const getCoopEfficiencyAreaCountData = async () => {
  try {
    const res = await fetchCoopEfficiencyAreaCount();
    coopEfficiencyAreaData.value = res;
  } catch (err) {
    console.warn('区域协同效率对比接口异常，使用兜底数据');
    coopEfficiencyAreaData.value = { xAxis: [], series: [{ name: '平均响应时长(小时)', data: [] }] };
  }
};
const getCoopEfficiencyRecurrenceRatioData = async () => {
  try {
    const res = await fetchCoopEfficiencyRecurrenceRatio();
    coopEfficiencyRecurrenceRatioData.value = res;
  } catch (err) {
    console.warn('问题复发率占比饼图接口异常，使用兜底数据');
    coopEfficiencyRecurrenceRatioData.value = { legend: [], series: [{ name: '问题复发率占比', data: [] }] };
  }
};
const getCoopEfficiencyTrendData = async () => {
  try {
    const res = await fetchCoopEfficiencyTrendData();
    coopEfficiencyTrendData.value = res;
  } catch (err) {
    console.warn('协同效率趋势折线图接口异常，使用兜底数据');
    coopEfficiencyTrendData.value = { xAxis: [], series: [{ name: '综合效率评分', data: [] }] };
  }
};

// ========== 原有工具方法 完整保留 + 新增区域协同完成率格式化 ==========
const getCoopTypeTagType = (val: string) => {
  switch(val) {
    case 'high': return 'danger';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return '';
  }
};
const getCoopTypeName = (val: string) => {
  switch(val) {
    case 'high': return '高优先级';
    case 'medium': return '中优先级';
    case 'low': return '低优先级';
    default: return '未知类型';
  }
};
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
// 区域协同-完成率格式化
const formatCompleteRate = (rate: number) => {
  return `${rate.toFixed(0)}%`;
};

// ========== 【政企协同视图】所有请求方法 ==========
const getGovCoopListData = async () => {
  try {
    const res = await fetchGovEnterpriseCoopList();
    govCoopList.value = res;
  } catch (err) {
    ElMessage.error('政企协同数据加载失败');
    govCoopList.value = [];
  }
};
const getGovCoopIndicatorData = async () => {
  try {
    const res = await fetchGovEnterpriseCoopIndicators();
    govCoopIndicators.value = res;
    nextTick(() => initGovCoopNumberAnimations());
  } catch (err) {
    console.warn('政企协同指标接口异常，使用兜底数据');
    govCoopIndicators.value = { totalCount: 0, responseRate: 0, satisfactionRate: 0 };
  }
};
const getGovCoopDeptCountData = async () => {
  try {
    const res = await fetchGovDeptCoopCount();
    govCoopDeptData.value = res;
  } catch (err) {
    console.warn('政府部门协同数接口异常，使用兜底数据');
    govCoopDeptData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getGovCoopEntTypeCountData = async () => {
  try {
    const res = await fetchEnterpriseTypeCoopCount();
    govCoopEntTypeData.value = res;
  } catch (err) {
    console.warn('企业类型协同数接口异常，使用兜底数据');
    govCoopEntTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getGovCoopItemRatioData = async () => {
  try {
    const res = await fetchCoopItemTypeRatio();
    govCoopItemRatioData.value = res;
  } catch (err) {
    console.warn('协同事项占比饼图接口异常，使用兜底数据');
    govCoopItemRatioData.value = { legend: [], series: [{ name: '协同事项占比', data: [] }] };
  }
};
const getGovCoopSatisfactionRatioData = async () => {
  try {
    const res = await fetchSatisfactionLevelRatio();
    govCoopSatisfactionRatioData.value = res;
  } catch (err) {
    console.warn('满意度占比饼图接口异常，使用兜底数据');
    govCoopSatisfactionRatioData.value = { legend: [], series: [{ name: '满意度占比', data: [] }] };
  }
};

// ========== 【专属协同视图】所有请求方法 - 全新新增 ==========
const getSpecialCoopListData = async () => {
  try {
    const res = await fetchSpecialCoopList();
    specialCoopList.value = res;
  } catch (err) {
    ElMessage.error('专属协同数据加载失败');
    specialCoopList.value = [];
  }
};
const getSpecialCoopIndicatorData = async () => {
  try {
    const res = await fetchSpecialCoopIndicators();
    specialCoopIndicators.value = res;
    nextTick(() => initSpecialCoopNumberAnimations());
  } catch (err) {
    console.warn('专属协同指标接口异常，使用兜底数据');
    specialCoopIndicators.value = { totalCount: 0, completeRate: 0, averageCycle: 0 };
  }
};
const getSpecialCoopSceneCountData = async () => {
  try {
    const res = await fetchSpecialCoopSceneCount();
    specialCoopSceneData.value = res;
  } catch (err) {
    console.warn('场景协同数对比接口异常，使用兜底数据');
    specialCoopSceneData.value = { xAxis: [], series: [{ name: '协同完成数', data: [] }] };
  }
};
const getSpecialCoopDeptCountData = async () => {
  try {
    const res = await fetchSpecialCoopDeptCount();
    specialCoopDeptData.value = res;
  } catch (err) {
    console.warn('责任单位协同数对比接口异常，使用兜底数据');
    specialCoopDeptData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getSpecialCoopSceneRatioData = async () => {
  try {
    const res = await fetchSpecialCoopSceneRatio();
    specialCoopSceneRatioData.value = res;
  } catch (err) {
    console.warn('协同场景占比饼图接口异常，使用兜底数据');
    specialCoopSceneRatioData.value = { legend: [], series: [{ name: '协同场景占比', data: [] }] };
  }
};
const getSpecialCoopStatusRatioData = async () => {
  try {
    const res = await fetchSpecialCoopStatusRatio();
    specialCoopStatusRatioData.value = res;
  } catch (err) {
    console.warn('协同状态占比饼图接口异常，使用兜底数据');
    specialCoopStatusRatioData.value = { legend: [], series: [{ name: '协同状态占比', data: [] }] };
  }
};

// ========== 公共方法 + 政企协同事件方法 ==========
const formatGovCoopTimeStamp = (timeStamp: any) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const getGovCoopSatisfactionTagType = (val: string) => {
  switch(val) {
    case '非常满意': return 'success';
    case '满意': return 'info';
    case '基本满意': return 'warning';
    case '一般': return 'danger';
    default: return '';
  }
};
const handleGovCoopRowClick = (row: any) => {
  govCoopSelectedRow.value = JSON.parse(JSON.stringify(row));
  govCoopDetailDialogVisible.value = true;
};
const handleGovCoopFullscreenChange = () => {
  if (!screenFull.isFullscreen && govCoopCurrentFullscreenPanel.value) {
    govCoopCurrentFullscreenPanel.value.style.width = '';
    govCoopCurrentFullscreenPanel.value.style.maxWidth = '';
    govCoopCurrentFullscreenPanel.value.style.overflow = 'hidden';
    screenFull.off('change', handleGovCoopFullscreenChange);
    nextTick(() => {
      setTimeout(() => {
        govCoopChartRefreshKey.value += 1;
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
    govCoopCurrentFullscreenPanel.value = null;
  }
};
const toggleGovCoopPanelFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = govCoopPanelRef.value;
  if (!panel) return;
  if (govCoopCurrentFullscreenPanel.value) screenFull.off('change', handleGovCoopFullscreenChange);
  govCoopCurrentFullscreenPanel.value = panel;
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.on('change', handleGovCoopFullscreenChange);
    screenFull.request(panel).catch((error) => {
      ElMessage.error(`全屏失败：${error.message}`);
    });
  }
};

// ========== 专属协同事件方法 - 全新新增 ==========
const formatSpecialCoopTimeStamp = (timeStamp: any) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const handleSpecialCoopFullscreenChange = () => {
  if (!screenFull.isFullscreen && specialCoopCurrentFullscreenPanel.value) {
    specialCoopCurrentFullscreenPanel.value.style.width = '';
    specialCoopCurrentFullscreenPanel.value.style.maxWidth = '';
    specialCoopCurrentFullscreenPanel.value.style.overflow = 'hidden';
    screenFull.off('change', handleSpecialCoopFullscreenChange);
    nextTick(() => {
      setTimeout(() => {
        specialCoopChartRefreshKey.value += 1;
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
    specialCoopCurrentFullscreenPanel.value = null;
  }
};
const toggleSpecialCoopPanelFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = specialCoopPanelRef.value;
  if (!panel) return;
  if (specialCoopCurrentFullscreenPanel.value) screenFull.off('change', handleSpecialCoopFullscreenChange);
  specialCoopCurrentFullscreenPanel.value = panel;
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.on('change', handleSpecialCoopFullscreenChange);
    screenFull.request(panel).catch((error) => {
      ElMessage.error(`全屏失败：${error.message}`);
    });
  }
};

// ========== 数字增长动画公共方法 + 五视图初始化 ==========
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
// 区域协同 数字动画初始化 新增核心
const initCrossRegionCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.cross-region-coop-number-animate');
  elements.forEach(el => {
    const value = parseFloat(el.getAttribute('data-value'));
    animateValue(el, 0, value, 1500);
  });
};
const initGovCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.gov-coop-number-animate');
  elements.forEach(el => {
    const value = parseFloat(el.getAttribute('data-value'));
    animateValue(el, 0, value, 1500);
  });
};
const initSpecialCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.special-coop-number-animate');
  elements.forEach(el => {
    const value = parseFloat(el.getAttribute('data-value'));
    animateValue(el, 0, value, 1500);
  });
};
const initCoopAnalysisNumberAnimations = () => {
  const elements = document.querySelectorAll('.coop-analysis-number-animate');
  elements.forEach(el => {
    const value = parseFloat(el.getAttribute('data-value'));
    animateValue(el, 0, value, 1500);
  });
};
const initCoopEfficiencyNumberAnimations = () => {
  const elements = document.querySelectorAll('.coop-efficiency-number-animate');
  elements.forEach(el => {
    const value = parseFloat(el.getAttribute('data-value'));
    animateValue(el, 0, value, 1500);
  });
};

// ========== 返回上级公共方法 ==========
const handleGovCoopBack = () => {
  router.push('/');
};

// ========== 生命周期 - 调用所有接口 (区域协同+协同统计分析+政企+专属+效率评估+TOP10) ==========
onMounted(() => {
  // 区域协同 核心接口 新增调用
  getCrossRegionCoopListData();
  getCrossRegionCoopIndicatorData();
  getCrossRegionCoopAreaCountData();
  getCrossRegionCoopTaskTypeCountData();
  getCrossRegionCoopTrendData();
  // 协同统计分析 核心接口
  getCoopAnalysisIndicatorData();
  getCoopAnalysisTypeCountData();
  getCoopAnalysisAreaCountData();
  getCoopAnalysisIndustryRatioData();
  getCoopAnalysisAreaRatioData();
  getCoopAnalysisTrendData();
  getHighFreqCoopTop10Data();
  // 政企协同接口
  getGovCoopListData();
  getGovCoopIndicatorData();
  getGovCoopDeptCountData();
  getGovCoopEntTypeCountData();
  getGovCoopItemRatioData();
  getGovCoopSatisfactionRatioData();
  // 专属协同接口
  getSpecialCoopListData();
  getSpecialCoopIndicatorData();
  getSpecialCoopSceneCountData();
  getSpecialCoopDeptCountData();
  getSpecialCoopSceneRatioData();
  getSpecialCoopStatusRatioData();
  // 协同效率评估 新增接口调用
  getCoopEfficiencyListData();
  getCoopEfficiencyIndicatorData();
  getCoopEfficiencyTypeCountData();
  getCoopEfficiencyAreaCountData();
  getCoopEfficiencyRecurrenceRatioData();
  getCoopEfficiencyTrendData();
});
onUnmounted(() => {
  if (crossRegionCoopCurrentFullscreenPanel.value) screenFull.off('change', handleCrossRegionCoopFullscreenChange);
  if (govCoopCurrentFullscreenPanel.value) screenFull.off('change', handleGovCoopFullscreenChange);
  if (specialCoopCurrentFullscreenPanel.value) screenFull.off('change', handleSpecialCoopFullscreenChange);
  if (coopAnalysisCurrentFullscreenPanel.value) screenFull.off('change', handleCoopAnalysisFullscreenChange);
  if (coopEfficiencyCurrentFullscreenPanel.value) screenFull.off('change', handleCoopEfficiencyFullscreenChange);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="crossRegionCoopPanelRef">
          <el-tabs v-model="topLeftActiveTab" class="custom-tabs top-left-tabs">
            <el-tab-pane label="区域协同" name="tab1">
              <div class="header-actions">
                <div class="actions-left">
                </div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <el-button
                      v-for="item in crossRegionCoopViewBtnList"
                      :key="item"
                      :type="activeCrossRegionCoopView === item ? 'primary' : ''"
                      plain
                      @click="changeCrossRegionCoopView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </el-button>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="toggleCrossRegionCoopPanelFullscreen">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 区域协同 - 卡片视图 (总数、完成率、平均协同时长) 样式完全同协同统计分析 -->
              <div v-if="activeCrossRegionCoopView === '卡片'" class="view-content">
                <div class="indicator-cards">
                  <div class="indicator-card normal total-card" style="cursor: default;">
                    <div class="indicator-title">跨区域协同总数</div>
                    <div class="indicator-value">
                      <span :data-value="crossRegionCoopIndicators.totalCount" class="cross-region-coop-number-animate">
                        {{ crossRegionCoopIndicators.totalCount }}
                      </span>
                    </div>
                    <div class="indicator-trends"><span class="trend-item">累计协同事项</span></div>
                  </div>
                  <div class="indicator-card normal rate-card" style="cursor: default;">
                    <div class="indicator-title">协同完成率</div>
                    <div class="indicator-value">
                      <span :data-value="crossRegionCoopIndicators.completeRate*100" class="cross-region-coop-number-animate">
                        {{ (crossRegionCoopIndicators.completeRate*100).toFixed(1) }}%
                      </span>
                    </div>
                    <div class="indicator-trends"><span class="trend-item up">完成率高</span></div>
                  </div>
                  <div class="indicator-card normal satisfaction-card" style="cursor: default;">
                    <div class="indicator-title">平均协同时长</div>
                    <div class="indicator-value">
                      <span :data-value="crossRegionCoopIndicators.avgCoopDuration" class="cross-region-coop-number-animate">
                        {{ crossRegionCoopIndicators.avgCoopDuration }}小时
                      </span>
                    </div>
                    <div class="indicator-trends"><span class="trend-item up">效率提升</span></div>
                  </div>
                </div>
              </div>
              <!-- 区域协同 - 柱状图视图 (区域协同数对比、任务类型协同数对比) 组件完全同协同统计分析 -->
              <div v-if="activeCrossRegionCoopView === '柱状图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
                <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="crossRegionCoopChartRefreshKey">
                  <VerticalBar1 :xAxis="crossRegionCoopAreaData.xAxis" :series="crossRegionCoopAreaData.series" unit="件" title="区域协同数对比" :baseFontScale="crossRegionCoopBaseFontScale" :activeIndices="crossRegionCoopActiveIndices"/>
                </div>
                <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="crossRegionCoopChartRefreshKey">
                  <VerticalBar2 :xAxis="crossRegionCoopTaskTypeData.xAxis" :series="crossRegionCoopTaskTypeData.series" unit="件" title="任务类型协同数对比" :baseFontScale="crossRegionCoopBaseFontScale" :activeIndices="crossRegionCoopActiveIndices"/>
                </div>
              </div>
              <!-- 区域协同 - 折线图视图 (协同完成率趋势) 组件完全同协同统计分析 -->
              <div v-if="activeCrossRegionCoopView === '折线图'" class="view-content" :key="crossRegionCoopChartRefreshKey" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
                <ChartLine1
                  :data="crossRegionCoopTrendData"
                  title="协同完成率趋势"
                  yAxisName="协同完成率(%)"
                  :baseFontScale="crossRegionCoopBaseFontScale"
                />
              </div>
              <!-- 区域协同 - 列表视图 样式+结构完全同政企协同视图 -->
              <div v-if="activeCrossRegionCoopView === '列表'" class="view-content">
                <div class="gov-enterprise-table-box">
                  <el-table class="gov-enterprise-coop-table" :data="crossRegionCoopList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                    <el-table-column prop="crossRegionCoopId" label="跨区域协同ID" align="center" />
                    <el-table-column prop="coopTask" label="协同任务" align="center" min-width="120px"/>
                    <el-table-column prop="launchAreaCode" label="发起区域" align="center" min-width="100px"/>
                    <el-table-column prop="cooperateAreaCode" label="配合区域" align="center" min-width="100px"/>
                    <el-table-column prop="progressNode" label="进度节点" align="center" min-width="180px" />
                    <el-table-column label="协同完成率" align="center" min-width="100px">
                      <template #default="scope">
                        {{ formatCompleteRate(scope.row.coopCompleteRate) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="部门协同" name="tab2"></el-tab-pane>
            <el-tab-pane label="行业协同" name="tab3"></el-tab-pane>
            <el-tab-pane label="层级协同" name="tab4"></el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right" ref="coopAnalysisPanelRef">
          <div class="header-actions">
            <div class="actions-left">
              <p>协同统计分析</p>
            </div>
            <div class="actions-right">
              <div class="view-btn-group">
                <el-button
                  v-for="item in coopAnalysisViewBtnList"
                  :key="item"
                  :type="activeCoopAnalysisView === item ? 'primary' : ''"
                  plain
                  @click="changeCoopAnalysisView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </el-button>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="toggleCoopAnalysisPanelFullscreen">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>

          <!-- 协同统计分析 - 卡片视图 (核心统计指标) -->
          <div v-if="activeCoopAnalysisView === '卡片'" class="view-content">
            <div class="indicator-cards">
              <div class="indicator-card normal total-card" style="cursor: default;">
                <div class="indicator-title">协同事项总数</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.totalCoopCount" class="coop-analysis-number-animate">
                    {{ coopAnalysisIndicators.totalCoopCount }}
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item">累计协同事项</span></div>
              </div>
              <div class="indicator-card normal rate-card" style="cursor: default;">
                <div class="indicator-title">平均处理周期</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.avgHandleCycle" class="coop-analysis-number-animate">
                    {{ coopAnalysisIndicators.avgHandleCycle }}天
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">效率提升</span></div>
              </div>
              <div class="indicator-card normal rate-card" style="cursor: default;">
                <div class="indicator-title">协同完成率</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.finishRate*100" class="coop-analysis-number-animate">
                    {{ (coopAnalysisIndicators.finishRate*100).toFixed(1) }}%
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">完成率高</span></div>
              </div>
              <div class="indicator-card normal satisfaction-card" style="cursor: default;">
                <div class="indicator-title">高优协同占比</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.highPriorityRate*100" class="coop-analysis-number-animate">
                    {{ (coopAnalysisIndicators.highPriorityRate*100).toFixed(1) }}%
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">重点关注</span></div>
              </div>
            </div>
          </div>

          <!-- 协同统计分析 - 柱状图视图 (类型协同数对比、区域协同数对比) -->
          <div v-if="activeCoopAnalysisView === '柱状图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="coopAnalysisChartRefreshKey">
              <VerticalBar1 :xAxis="coopAnalysisTypeData.xAxis" :series="coopAnalysisTypeData.series" unit="件" title="类型协同数对比" :baseFontScale="coopAnalysisBaseFontScale" :activeIndices="coopAnalysisActiveIndices"/>
            </div>
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="coopAnalysisChartRefreshKey">
              <VerticalBar2 :xAxis="coopAnalysisAreaData.xAxis" :series="coopAnalysisAreaData.series" unit="件" title="区域协同数对比" :baseFontScale="coopAnalysisBaseFontScale" :activeIndices="coopAnalysisActiveIndices"/>
            </div>
          </div>

          <!-- 协同统计分析 - 饼图视图 (行业协同占比、区域协同占比) -->
          <div v-if="activeCoopAnalysisView === '饼图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="coopAnalysisChartRefreshKey">
              <ChartPie2 :data="coopAnalysisIndustryRatioData" title="行业协同占比" :baseFontScale="coopAnalysisBaseFontScale" :activeIndices="coopAnalysisActiveIndices"/>
            </div>
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="coopAnalysisChartRefreshKey">
              <ChartPie4 :data="coopAnalysisAreaRatioData" title="区域协同占比" :baseFontScale="coopAnalysisBaseFontScale" :activeIndices="coopAnalysisActiveIndices"/>
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '折线图'" class="view-content" :key="coopAnalysisChartRefreshKey" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <ChartLine1
              :data="coopAnalysisTrendData"
              title="协同事件近周期趋势"
              yAxisName="协同事件数"
              :baseFontScale="coopAnalysisBaseFontScale"
            />
          </div>
          <!-- 协同统计分析 - 列表视图 (原有TOP10列表完整移入，无修改) -->
          <div v-if="activeCoopAnalysisView === '列表'" class="view-content">
            <div class="high-frequency-coop-top10-box">
              <el-table
                :data="highFreqCoopTop10List"
                border
                size="small"
                style="width: 100%; height: 100%"
                row-class-name="highfreq-top10-row"
              >
                <el-table-column prop="rank" label="排名" width="80" align="center">
                  <template #default="scope">
                    <div class="highfreq-top10-rank-tag">{{ scope.row.rank }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="coopStatId" label="协同统计ID" />
                <el-table-column prop="coopType" label="协同类型">
                  <template #default="scope">
                    <el-tag :type="getCoopTypeTagType(scope.row.coopType)">
                      {{ getCoopTypeName(scope.row.coopType) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="coopCount" label="协同事件数量">
                  <template #default="scope">
                    {{ formatNumber(scope.row.coopCount) }}
                  </template>
                </el-table-column>
                <el-table-column prop="top10CoopItem" label="协同事项" min-width="150"/>
              </el-table>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <!-- ========== 原有 政企协同视图面板 完整保留 无任何修改 ========== -->
        <div class="panel bottom-left" ref="govCoopPanelRef">
          <div class="header-actions">
            <div class="actions-left">
              <p>政企协同视图</p>
            </div>
            <div class="actions-right">
              <div class="view-btn-group">
                <el-button
                  v-for="item in govCoopViewBtnList"
                  :key="item"
                  :type="activeGovCoopView === item ? 'primary' : ''"
                  plain
                  @click="changeGovCoopView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </el-button>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="toggleGovCoopPanelFullscreen">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeGovCoopView === '卡片'" class="view-content">
            <div class="indicator-cards">
              <div class="indicator-card normal total-card" style="cursor: default;">
                <div class="indicator-title">政企协同总数</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.totalCount" class="gov-coop-number-animate">
                    {{ govCoopIndicators.totalCount }}
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item">累计协同事项</span></div>
              </div>
              <div class="indicator-card normal rate-card" style="cursor: default;">
                <div class="indicator-title">政企响应率</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.responseRate*100" class="gov-coop-number-animate">
                    {{ (govCoopIndicators.responseRate*100).toFixed(1) }}%
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">响应及时</span></div>
              </div>
              <div class="indicator-card normal satisfaction-card" style="cursor: default;">
                <div class="indicator-title">政企满意度</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.satisfactionRate" class="gov-coop-number-animate">
                    {{ govCoopIndicators.satisfactionRate.toFixed(1) }}%
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">综合评分</span></div>
              </div>
            </div>
          </div>
          <div v-if="activeGovCoopView === '柱状图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="govCoopChartRefreshKey">
              <VerticalBar2 :xAxis="govCoopDeptData.xAxis" :series="govCoopDeptData.series" unit="件" title="政府部门协同数对比" :baseFontScale="govCoopBaseFontScale" :activeIndices="govCoopActiveIndices"/>
            </div>
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="govCoopChartRefreshKey">
              <VerticalBar1 :xAxis="govCoopEntTypeData.xAxis" :series="govCoopEntTypeData.series" unit="件" title="企业类型协同数对比" :baseFontScale="govCoopBaseFontScale" :activeIndices="govCoopActiveIndices"/>
            </div>
          </div>
          <div v-if="activeGovCoopView === '饼图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="govCoopChartRefreshKey">
              <ChartPie1 :data="govCoopItemRatioData" title="协同事项类型占比" :baseFontScale="govCoopBaseFontScale" :activeIndices="govCoopActiveIndices"/>
            </div>
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="govCoopChartRefreshKey">
              <ChartPie2 :data="govCoopSatisfactionRatioData" title="满意度评价占比" :baseFontScale="govCoopBaseFontScale" :activeIndices="govCoopActiveIndices"/>
            </div>
          </div>
          <div v-if="activeGovCoopView === '列表'" class="view-content">
            <div class="gov-enterprise-table-box">
              <el-table class="gov-enterprise-coop-table" :data="govCoopList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row @row-click="handleGovCoopRowClick">
                <el-table-column prop="govEnterpriseCoopId" label="政企协同ID" align="center" />
                <el-table-column prop="coopItem" label="协同事项" align="center" min-width="120px"/>
                <el-table-column prop="govDepartment" label="政府部门" align="center" min-width="100px"/>
                <el-table-column prop="merchantId" label="企业ID" align="center" />
                <el-table-column prop="progressFeedback" label="进度反馈" align="center" min-width="180px" />
                <el-table-column label="满意度评价" align="center" min-width="100px">
                  <template #default="scope">
                    <el-tag :type="getGovCoopSatisfactionTagType(scope.row.satisfactionEvaluation)">{{ scope.row.satisfactionEvaluation }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- ========== 新增 专属协同视图面板 完整实现 样式与政企完全一致 无任何修改 ========== -->
        <div class="panel bottom-middle" ref="specialCoopPanelRef">
          <div class="header-actions">
            <div class="actions-left">
              <p>专属协同视图</p>
            </div>
            <div class="actions-right">
              <div class="view-btn-group">
                <el-button
                  v-for="item in specialCoopViewBtnList"
                  :key="item"
                  :type="activeSpecialCoopView === item ? 'primary' : ''"
                  plain
                  @click="changeSpecialCoopView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </el-button>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="toggleSpecialCoopPanelFullscreen">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <!-- 专属协同-卡片视图 (总数、完成率、平均协同周期) -->
          <div v-if="activeSpecialCoopView === '卡片'" class="view-content">
            <div class="indicator-cards">
              <div class="indicator-card normal total-card" style="cursor: default;">
                <div class="indicator-title">专属协同总数</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.totalCount" class="special-coop-number-animate">
                    {{ specialCoopIndicators.totalCount }}
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item">累计协同事项</span></div>
              </div>
              <div class="indicator-card normal rate-card" style="cursor: default;">
                <div class="indicator-title">协同完成率</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.completeRate*100" class="special-coop-number-animate">
                    {{ (specialCoopIndicators.completeRate*100).toFixed(1) }}%
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">高效完成</span></div>
              </div>
              <div class="indicator-card normal satisfaction-card" style="cursor: default;">
                <div class="indicator-title">平均协同周期</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.averageCycle" class="special-coop-number-animate">
                    {{ specialCoopIndicators.averageCycle }}天
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">周期缩短</span></div>
              </div>
            </div>
          </div>
          <!-- 专属协同-柱状图视图 (场景协同数对比、责任单位协同数对比) -->
          <div v-if="activeSpecialCoopView === '柱状图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="specialCoopChartRefreshKey">
              <VerticalBar1 :xAxis="specialCoopSceneData.xAxis" :series="specialCoopSceneData.series" unit="件" title="场景协同数对比" :baseFontScale="specialCoopBaseFontScale" :activeIndices="specialCoopActiveIndices"/>
            </div>
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="specialCoopChartRefreshKey">
              <VerticalBar2 :xAxis="specialCoopDeptData.xAxis" :series="specialCoopDeptData.series" unit="件" title="责任单位协同数对比" :baseFontScale="specialCoopBaseFontScale" :activeIndices="specialCoopActiveIndices"/>
            </div>
          </div>
          <!-- 专属协同-饼图视图 (协同场景占比、协同状态占比) -->
          <div v-if="activeSpecialCoopView === '饼图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="specialCoopChartRefreshKey">
              <ChartPie1 :data="specialCoopSceneRatioData" title="协同场景占比" :baseFontScale="specialCoopBaseFontScale" :activeIndices="specialCoopActiveIndices"/>
            </div>
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="specialCoopChartRefreshKey">
              <ChartPie2 :data="specialCoopStatusRatioData" title="协同状态占比" :baseFontScale="specialCoopBaseFontScale" :activeIndices="specialCoopActiveIndices"/>
            </div>
          </div>
          <!-- 专属协同-列表视图 -->
          <div v-if="activeSpecialCoopView === '列表'" class="view-content">
            <div class="gov-enterprise-table-box">
              <el-table class="gov-enterprise-coop-table" :data="specialCoopList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="specialCoopId" label="专属协同ID" align="center" />
                <el-table-column prop="coopScene" label="协同场景" align="center" min-width="160px"/>
                <el-table-column prop="coopRule" label="协同规则" align="center" min-width="180px"/>
                <el-table-column prop="responsibilityDivision" label="责任分工" align="center" min-width="200px"/>
                <el-table-column prop="coopResult" label="协同结果" align="center" min-width="180px"/>
                <el-table-column prop="completeTime" label="完成时间" align="center" min-width="120px">
                  <template #default="scope">{{ formatSpecialCoopTimeStamp(scope.row.completeTime) }}</template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>

        <!-- ========== 完整重构：协同效率评估面板 核心新增 样式同统计分析、列表同政企协同 ========== -->
        <div class="panel bottom-right" ref="coopEfficiencyPanelRef">
          <div class="header-actions">
            <div class="actions-left">
              <p>协同效率评估</p>
            </div>
            <div class="actions-right">
              <div class="view-btn-group">
                <el-button
                  v-for="item in coopEfficiencyViewBtnList"
                  :key="item"
                  :type="activeCoopEfficiencyView === item ? 'primary' : ''"
                  plain
                  @click="changeCoopEfficiencyView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </el-button>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="toggleCoopEfficiencyPanelFullscreen">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>

          <!-- 协同效率评估 - 卡片视图 (平均响应时长、平均处置时长、成效达标率) -->
          <div v-if="activeCoopEfficiencyView === '卡片'" class="view-content">
            <div class="indicator-cards">
              <div class="indicator-card normal total-card" style="cursor: default;">
                <div class="indicator-title">平均响应时长</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgResponseDuration" class="coop-efficiency-number-animate">
                    {{ coopEfficiencyIndicators.avgResponseDuration }}小时
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item">极速响应</span></div>
              </div>
              <div class="indicator-card normal rate-card" style="cursor: default;">
                <div class="indicator-title">平均处置时长</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgDisposalDuration" class="coop-efficiency-number-animate">
                    {{ coopEfficiencyIndicators.avgDisposalDuration }}小时
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">处置高效</span></div>
              </div>
              <div class="indicator-card normal satisfaction-card" style="cursor: default;">
                <div class="indicator-title">平均成效达标率</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgEffectAchievementRate*100" class="coop-efficiency-number-animate">
                    {{ (coopEfficiencyIndicators.avgEffectAchievementRate*100).toFixed(1) }}%
                  </span>
                </div>
                <div class="indicator-trends"><span class="trend-item up">达标率高</span></div>
              </div>
            </div>
          </div>

          <!-- 协同效率评估 - 柱状图视图 (类型协同效率对比、区域协同效率对比) -->
          <div v-if="activeCoopEfficiencyView === '柱状图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="coopEfficiencyChartRefreshKey">
              <VerticalBar1 :xAxis="coopEfficiencyTypeData.xAxis" :series="coopEfficiencyTypeData.series" unit="小时" title="类型协同效率对比" :baseFontScale="coopEfficiencyBaseFontScale" :activeIndices="coopEfficiencyActiveIndices"/>
            </div>
            <div style="width:49%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;border-left:0.3vh solid #02a6b5;padding-left:0.3vw;" :key="coopEfficiencyChartRefreshKey">
              <VerticalBar2 :xAxis="coopEfficiencyAreaData.xAxis" :series="coopEfficiencyAreaData.series" unit="小时" title="区域协同效率对比" :baseFontScale="coopEfficiencyBaseFontScale" :activeIndices="coopEfficiencyActiveIndices"/>
            </div>
          </div>

          <!-- 协同效率评估 - 饼图视图 (问题复发率占比) -->
          <div v-if="activeCoopEfficiencyView === '饼图'" class="view-content" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <div style="width:100%;height:100%;display:inline-block;vertical-align:top;box-sizing:border-box;" :key="coopEfficiencyChartRefreshKey">
              <ChartPie2 :data="coopEfficiencyRecurrenceRatioData" title="问题复发率占比" :baseFontScale="coopEfficiencyBaseFontScale" :activeIndices="coopEfficiencyActiveIndices"/>
            </div>
          </div>

          <!-- 协同效率评估 - 折线图视图 (协同效率趋势) -->
          <div v-if="activeCoopEfficiencyView === '折线图'" class="view-content" :key="coopEfficiencyChartRefreshKey" style="width:100%;height:100%;padding:0 0.2vw;box-sizing:border-box;">
            <ChartLine1
              :data="coopEfficiencyTrendData"
              title="协同效率趋势"
              yAxisName="综合效率评分"
              :baseFontScale="coopEfficiencyBaseFontScale"
            />
          </div>

          <!-- 协同效率评估 - 列表视图 (效率瓶颈及优化建议) 样式结构完全同政企协同视图 -->
          <div v-if="activeCoopEfficiencyView === '列表'" class="view-content">
            <div class="gov-enterprise-table-box">
              <el-table class="gov-enterprise-coop-table" :data="coopEfficiencyList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="coopEfficiencyId" label="协同效率评估ID" align="center" />
                <el-table-column prop="coopType" label="协同类型" align="center">
                  <template #default="scope">
                    <el-tag :type="getCoopTypeTagType(scope.row.coopType)">
                      {{ getCoopTypeName(scope.row.coopType) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="responseDuration" label="响应时长(小时)" align="center" min-width="100px">
                  <template #default="scope">{{ scope.row.responseDuration.toFixed(1) }}</template>
                </el-table-column>
                <el-table-column prop="disposalDuration" label="处置时长(小时)" align="center" min-width="100px">
                  <template #default="scope">{{ scope.row.disposalDuration.toFixed(1) }}</template>
                </el-table-column>
                <el-table-column prop="collaborationCost" label="协同成本" align="center" min-width="100px">
                  <template #default="scope">{{ formatNumber(scope.row.collaborationCost) }}</template>
                </el-table-column>
                <el-table-column prop="effectAchievementRate" label="成效达标率" align="center" min-width="100px">
                  <template #default="scope">{{ (scope.row.effectAchievementRate*100).toFixed(1) }}%</template>
                </el-table-column>
                <el-table-column prop="problemRecurrenceRate" label="问题复发率" align="center" min-width="100px">
                  <template #default="scope">{{ (scope.row.problemRecurrenceRate*100).toFixed(1) }}%</template>
                </el-table-column>
              </el-table>
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
@import '../../../templatesstyle/table2_top10';

// 最外层容器 - 保留原有，表格零溢出核心配置已生效
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
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
  overflow: hidden !important;
}

// 新增：面板头部样式 完全照搬参考代码
.panel-header {
  padding: 1vh 1.2vw;
  border-bottom: 1px solid rgba(0, 204, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
    font-size: 1.1vw;
    color: #ffb800;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
}
// 新增：面板主体样式 完全照搬参考代码
.panel-body {
  flex: 1;
  padding: 1.2vw;
  overflow: hidden;
  height: calc(100% - 6vh);
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

.top {
  display: flex;
  gap: 0.6vw;
  height: 50%;
  overflow: hidden !important;
}
.top-left { flex: 1; }
.top-right { flex: 1; }

.bottom {
  display: flex;
  gap: 0.6vw;
  height: 46%;
  overflow: hidden !important;
}
.bottom-left { flex: 1; }
.bottom-middle { flex: 1; }
.bottom-right { flex: 1; }

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.6vw;
  padding: 0 0.2vw;

  .actions-left p {
    font-size: 0.9vw;
    font-weight: 500;
    color: #00ffd0;
    margin: 0;
  }

  .view-btn-group { display: flex; margin-right: 0.5vw; }
  :deep(.view-btn) {
    font-size: 0.6vw;
    padding: 0 0.4vw;
    background-color: transparent;
    border-color: rgb(25 186 139 / 60%);
    color: #fff;
    &:hover { border-color: #00ffd0; color: #00ffd0; }
    &.el-button--primary {
      background-color: rgb(0 204 255 / 20%);
      border-color: rgb(25 186 139 / 60%);
      color: #afc2ff;
    }
  }
  .panel-fullscreen-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    margin-right: 0.5vw;
  }
}

// 核心零溢出样式 - 四视图共用，表格永不撑大面板
.view-content {
  width: 100% !important;
  max-width: 100% !important;
  height: calc(100% - 2vh) !important;
  flex: 1;
  box-sizing: border-box !important;
  overflow: hidden !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1vw;
  color: #00ffd0;
}

// 完整卡片样式 - 四视图共用，保留所有动画和配色
.indicator-cards {
  display: flex;
  gap: 0.8vw;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.indicator-card {
  flex: 0 0 8vw;
  padding: 6vh 0;
  background: rgba(0, 30, 60, 0.6);
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 0.1vw solid transparent;
  &:hover { transform: translateY(-5px); }
  .indicator-title {
    font-size: 1vw;
    text-align: center;
    font-weight: bold;
    letter-spacing: 0.2vw;
    margin-top: 0.1vh;
  }
  .indicator-value {
    font-size: 1.8vw;
    text-align: center;
    font-weight: bold;
    margin: 0.5vw 0;
    transition: all 0.3s;
    margin-bottom: 1vh;
  }
  .indicator-trends {
    display: flex;
    justify-content: center;
    font-size: 0.7vw;
    margin-top: 5px;
    .trend-item { padding: 2px 5px; border-radius: 3px; }
  }
}

.indicator-card.total-card {
  border-color: #00ccff;
  box-shadow: 0 5px 15px rgba(0, 204, 255, 0.3);
  .indicator-title { color: #66e0ff; }
  .indicator-value { color: #00ccff; }
  .indicator-trends .trend-item { color: #00ccff; background: rgba(0, 204, 255, 0.1); }
  &:hover { box-shadow: 0 5px 20px rgba(0, 204, 255, 0.5); }
}
.indicator-card.rate-card {
  border-color: #13ce66;
  box-shadow: 0 5px 15px rgba(19, 206, 102, 0.3);
  .indicator-title { color: #70f59c; }
  .indicator-value { color: #13ce66; }
  .indicator-trends .up { color: #13ce66; background: rgba(19, 206, 102, 0.1); }
  &:hover { box-shadow: 0 5px 20px rgba(19, 206, 102, 0.5); }
}
.indicator-card.satisfaction-card {
  border-color: #ffc107;
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
  .indicator-title { color: #ffe066; }
  .indicator-value { color: #ffc107; }
  .indicator-trends .up { color: #ffc107; background: rgba(255, 193, 7, 0.1); }
  &:hover { box-shadow: 0 5px 20px rgba(255, 193, 7, 0.5); }
}

// 动画定义
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.blink-animation { animation: blink 1.5s infinite; }

:deep(.top-left-tabs) {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
  // 标签头部 无边距 紧凑
  .el-tabs__header {
    margin: 0 !important;
    padding: 0 0.2vw !important;
    border-bottom: 1px solid rgba(25, 186, 139, 0.3) !important;
  }
  // 标签文字-核心：默认纯白色
  .el-tabs__item {
    color: #b6e1ad !important;
    font-size: 0.85vw !important;
    margin: 0 0.1vw !important; // 标签之间间距缩小
  }
  // 选中的标签 蓝色高亮 不变
  .el-tabs__item.is-active {
    color: #00ccff !important;
    font-weight: 600;
  }
  // 选中的下划线 细一点 更精致
  .el-tabs__active-bar {
    height: 0.15vw !important;
    background: #00ccff !important;
  }
  .el-tab-pane {
    width: 100%;
    height: 100%;
    padding: 0 !important;
  }
}
</style>
