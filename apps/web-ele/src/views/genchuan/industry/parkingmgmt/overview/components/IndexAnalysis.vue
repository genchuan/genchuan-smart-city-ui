<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import screenFull from 'screenfull';
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag,
  ElImage,
  ElMessage,
} from 'element-plus';
import { Filter, FullScreen, Refresh } from '@element-plus/icons-vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';

// 导入资源运行API
import {
  fetchParkResourceRunList,
  fetchParkResourceRunIndicators,
  fetchParkResourceRunUtilizationTrend,
  fetchParkResourceRunTurnoverTrend,
  fetchParkResourceRunRegionRatio,
  fetchParkResourceRunTimeRatio,
  fetchParkResourceRunDetail,
  fetchParkResourceRunTurnoverTimeTrend,
} from '#/api/genchuan/industry/parkingmgmt/overview/IndexAnalysis.ts';

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// TS类型定义
interface ParkResourceRunRow {
  tbParkingName: string;
  tbRegionName: string;
  tbParkingSpaceTotalCount: number;
  tbParkingOperationDailyUtilizationRate: number;
  tbParkingOperationTurnoverRate: number;
  tbParkingOperationPeakUtilizationRate: number;
  tbParkingParkingId: string;
}

interface ParkResourceRunIndicators {
  totalSpaceCount: number;
  averageUtilizationRate: number;
  averageTurnoverRate: number;
  peakAverageUtilizationRate: number;
}

interface ChartRatioData {
  legend: string[];
  series: { data: number[]; name: string }[];
}

interface ChartLineData {
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

interface ParkResourceRunDetail {
  tbParkingParkingId: string;
  tbParkingName: string;
  tbRegionName: string;
  tbParkingOperationChainUtilizationChange: number;
  tbParkingOperationMonthlyMaxUtilization: number;
  tbParkingOperationPeakHour: string;
  runDetail: {
    tbParkingSpaceTotalCount: number;
    tbParkingOperationDailyUtilizationRate: number;
    tbParkingOperationTurnoverRate: number;
    tbParkingOperationPeakUtilizationRate: number;
  };
  timeDistribution: ChartLineData;
  abnormalRecords: {
    time: number | string;
    content: string;
    handleStatus: string;
  }[];
}

interface ParkResourceRunTurnoverTimeTrend {
  tbParkingParkingId: string;
  tbParkingName: string;
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

// 响应式数据
const parkResourceRunList = ref<ParkResourceRunRow[]>([]);
const parkResourceRunIndicators = ref<ParkResourceRunIndicators>({
  totalSpaceCount: 0,
  averageUtilizationRate: 0,
  averageTurnoverRate: 0,
  peakAverageUtilizationRate: 0,
});
const parkResourceRunUtilizationTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '全域使用率(%)', data: [] }],
});
const parkResourceRunTurnoverTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '重点停车场周转率', data: [] }],
});
const parkResourceRunRegionRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域使用率占比(%)', data: [] }],
});
const parkResourceRunTimeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '时段使用率分布(%)', data: [] }],
});

// 视图切换相关
const resourceRunChartRefreshKey = ref(0);
const activeResourceRunView = ref('列表');
const resourceRunViewBtnList = ref(['卡片', '饼图', '折线图', '列表']);

// 弹窗相关
const resourceRunDetailDialogVisible = ref(false);
const resourceRunTurnoverDialogVisible = ref(false);
const activeResourceRunDetailView = ref('明细');
const resourceRunDetailViewBtnList = ref(['明细', '趋势', '异常']);
const parkResourceRunDetailSelectedRow = ref<ParkResourceRunDetail>({
  tbParkingParkingId: '',
  tbParkingName: '',
  tbRegionName: '',
  tbParkingOperationChainUtilizationChange: 0,
  tbParkingOperationMonthlyMaxUtilization: 0,
  tbParkingOperationPeakHour: '',
  runDetail: {
    tbParkingSpaceTotalCount: 0,
    tbParkingOperationDailyUtilizationRate: 0,
    tbParkingOperationTurnoverRate: 0,
    tbParkingOperationPeakUtilizationRate: 0,
  },
  timeDistribution: {
    xAxis: [],
    series: [{ name: '时段使用率(%)', data: [] }],
  },
  abnormalRecords: [],
});
const parkResourceRunTurnoverSelectedRow = ref<ParkResourceRunTurnoverTimeTrend>({
  tbParkingParkingId: '',
  tbParkingName: '',
  xAxis: [],
  series: [{ name: '时段周转率', data: [] }],
});

// 其他标签页激活状态（保留原有）
const topLeftActiveTab = ref('tab1');
const topMiddleActiveTab = ref('tab1');
const topRightActiveTab = ref('tab1');
const bottomLeftActiveTab = ref('tab1');
const bottomMiddleActiveTab = ref('tab1');
const bottomRightActiveTab = ref('tab1');

// 公共工具方法（参考文件2）
const formatNumber = (num: number) =>
  num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDecimal = (num: number) => num.toFixed(1);
const formatTimeStamp = (timeStamp?: number | string) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const animateValue = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number,
) => {
  if (!element) return;
  let startTimestamp: null | number = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = formatNumber(
      Math.floor(progress * (end - start) + start),
    );
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};

const initResourceRunNumberAnimations = () => {
  document
    .querySelectorAll('.resource-run-number-animate')
    .forEach((el) =>
      animateValue(
        el as HTMLElement,
        0,
        Number((el as HTMLElement).textContent || 0),
        1500,
      ),
    );
};

// 全屏方法（参考文件2）
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
  if (screenFull.isFullscreen && currentFullscreenPanel.value) {
    setTimeout(() => {
      resourceRunChartRefreshKey.value++;
    }, 300);
  } else if (currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      resourceRunChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

// 视图切换方法
const changeResourceRunView = (viewName: string) => {
  activeResourceRunView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initResourceRunNumberAnimations, 300));
  (viewName === '饼图' || viewName === '折线图') &&
  nextTick(() => resourceRunChartRefreshKey.value++);
};

// 详情视图切换
const changeResourceRunDetailView = (viewName: string) => {
  activeResourceRunDetailView.value = viewName;
};

// 接口请求方法
const getParkResourceRunListData = async () => {
  try {
    parkResourceRunList.value = (await fetchParkResourceRunList()) as ParkResourceRunRow[];
  } catch (error: any) {
    ElMessage.error(`资源运行列表加载失败：${error.message}`);
    parkResourceRunList.value = [];
  }
};

const getParkResourceRunIndicatorsData = async () => {
  try {
    parkResourceRunIndicators.value =
      (await fetchParkResourceRunIndicators()) as ParkResourceRunIndicators;
  } catch (error: any) {
    ElMessage.error(`核心指标加载失败：${error.message}`);
  }
};

const getParkResourceRunUtilizationTrendData = async () => {
  try {
    parkResourceRunUtilizationTrend.value =
      (await fetchParkResourceRunUtilizationTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`使用率趋势加载失败：${error.message}`);
  }
};

const getParkResourceRunTurnoverTrendData = async () => {
  try {
    parkResourceRunTurnoverTrend.value =
      (await fetchParkResourceRunTurnoverTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`周转率趋势加载失败：${error.message}`);
  }
};

const getParkResourceRunRegionRatioData = async () => {
  try {
    parkResourceRunRegionRatio.value =
      (await fetchParkResourceRunRegionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`区域使用率占比加载失败：${error.message}`);
  }
};

const getParkResourceRunTimeRatioData = async () => {
  try {
    parkResourceRunTimeRatio.value =
      (await fetchParkResourceRunTimeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`时段使用率分布加载失败：${error.message}`);
  }
};

const getParkResourceRunDetailData = async (parkingId: string) => {
  try {
    parkResourceRunDetailSelectedRow.value = {
      ...parkResourceRunDetailSelectedRow.value,
      ...(await fetchParkResourceRunDetail(parkingId)),
    };
  } catch (error: any) {
    ElMessage.warning(`资源运行详情加载失败：${error.message}`);
  }
};

const getParkResourceRunTurnoverTimeTrendData = async (parkingId: string) => {
  try {
    parkResourceRunTurnoverSelectedRow.value = {
      ...parkResourceRunTurnoverSelectedRow.value,
      ...(await fetchParkResourceRunTurnoverTimeTrend(parkingId)),
    };
  } catch (error: any) {
    ElMessage.warning(`周转率时段趋势加载失败：${error.message}`);
  }
};

// 弹窗方法
const openResourceRunDetailDialog = async (row: ParkResourceRunRow) => {
  await getParkResourceRunDetailData(row.tbParkingParkingId);
  resourceRunDetailDialogVisible.value = true;
};

const closeResourceRunDetailDialog = () => {
  resourceRunDetailDialogVisible.value = false;
  parkResourceRunDetailSelectedRow.value = {
    tbParkingParkingId: '',
    tbParkingName: '',
    tbRegionName: '',
    tbParkingOperationChainUtilizationChange: 0,
    tbParkingOperationMonthlyMaxUtilization: 0,
    tbParkingOperationPeakHour: '',
    runDetail: {
      tbParkingSpaceTotalCount: 0,
      tbParkingOperationDailyUtilizationRate: 0,
      tbParkingOperationTurnoverRate: 0,
      tbParkingOperationPeakUtilizationRate: 0,
    },
    timeDistribution: {
      xAxis: [],
      series: [{ name: '时段使用率(%)', data: [] }],
    },
    abnormalRecords: [],
  };
  activeResourceRunDetailView.value = '明细';
};

const openResourceRunTurnoverDialog = async (row: ParkResourceRunRow) => {
  await getParkResourceRunTurnoverTimeTrendData(row.tbParkingParkingId);
  resourceRunTurnoverDialogVisible.value = true;
};

const closeResourceRunTurnoverDialog = () => {
  resourceRunTurnoverDialogVisible.value = false;
  parkResourceRunTurnoverSelectedRow.value = {
    tbParkingParkingId: '',
    tbParkingName: '',
    xAxis: [],
    series: [{ name: '时段周转率', data: [] }],
  };
};

// 刷新数据
const refreshResourceRunData = async () => {
  await Promise.all([
    getParkResourceRunListData(),
    getParkResourceRunIndicatorsData(),
    getParkResourceRunUtilizationTrendData(),
    getParkResourceRunTurnoverTrendData(),
    getParkResourceRunRegionRatioData(),
    getParkResourceRunTimeRatioData(),
  ]);
  resourceRunChartRefreshKey.value++;
  ElMessage.success('数据刷新成功');
};

// 生命周期
onMounted(async () => {
  await Promise.all([
    getParkResourceRunListData(),
    getParkResourceRunIndicatorsData(),
    getParkResourceRunUtilizationTrendData(),
    getParkResourceRunTurnoverTrendData(),
    getParkResourceRunRegionRatioData(),
    getParkResourceRunTimeRatioData(),
  ]);
  setTimeout(() => {
    resourceRunChartRefreshKey.value++;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
});

onUnmounted(() => {
  screenFull.off('change', handleFullscreenChange);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="resourceRunPanelRef">
          <el-tabs v-model="topLeftActiveTab" class="common-tabs">
            <el-tab-pane label="资源运行" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in resourceRunViewBtnList"
                      :key="item"
                      :type="activeResourceRunView === item ? 'primary' : ''"
                      plain
                      @click="changeResourceRunView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshResourceRunData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('resourceRunPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeResourceRunView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">全域泊位数</div>
                    <div class="indicator-value">
                      <span class="resource-run-number-animate">{{ parkResourceRunIndicators.totalSpaceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">平均使用率</div>
                    <div class="indicator-value">
                      {{ formatDecimal(parkResourceRunIndicators.averageUtilizationRate) }}
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">平均周转率</div>
                    <div class="indicator-value">
                      {{ formatDecimal(parkResourceRunIndicators.averageTurnoverRate) }}
                    </div>
                    <div class="indicator-unit">次/天</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">高峰时段平均使用率</div>
                    <div class="indicator-value">
                      {{ formatDecimal(parkResourceRunIndicators.peakAverageUtilizationRate) }}
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeResourceRunView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="parkResourceRunRegionRatio"
                    title="各区域使用率占比"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="parkResourceRunTimeRatio"
                    title="各时段使用率分布"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeResourceRunView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="parkResourceRunUtilizationTrend"
                    title="近30天全域使用率趋势"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="parkResourceRunTurnoverTrend"
                    title="重点停车场周转率趋势"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeResourceRunView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="parkResourceRunList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openResourceRunDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbParkingName"
                      label="停车场名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbRegionName"
                      label="区域归属"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceTotalCount"
                      label="总泊位数"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingOperationDailyUtilizationRate"
                      label="日均使用率(%)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbParkingOperationDailyUtilizationRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingOperationTurnoverRate"
                      label="周转率"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <span @click.stop="openResourceRunTurnoverDialog(scope.row)" style="color:#409eff;cursor:pointer;">
                          {{ formatDecimal(scope.row.tbParkingOperationTurnoverRate) }}
                          <i class="el-icon-arrow-right" style="font-size:12px;"></i>
                        </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingOperationPeakUtilizationRate"
                      label="高峰时段使用率(%)"
                      align="center"
                      width="140"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbParkingOperationPeakUtilizationRate) }}
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备运行" name="tab2">
              <div class="view-content"><div class="content-placeholder">设备运行</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-middle">
          <el-tabs v-model="topMiddleActiveTab" class="common-tabs">
            <el-tab-pane label="停车资源" name="tab1">
              <div class="view-content"><div class="content-placeholder">停车资源</div></div>
            </el-tab-pane>
            <el-tab-pane label="支撑资源" name="tab2">
              <div class="view-content"><div class="content-placeholder">支撑资源</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right">
          <el-tabs v-model="topRightActiveTab" class="common-tabs">
            <el-tab-pane label="基础服务" name="tab1">
              <div class="view-content"><div class="content-placeholder">基础服务</div></div>
            </el-tab-pane>
            <el-tab-pane label="投诉处理" name="tab2">
              <div class="view-content"><div class="content-placeholder">投诉处理</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left">
          <el-tabs v-model="bottomLeftActiveTab" class="common-tabs">
            <el-tab-pane label="业务流转效率" name="tab1">
              <div class="view-content"><div class="content-placeholder">业务流转效率</div></div>
            </el-tab-pane>
            <el-tab-pane label="运维处置效率" name="tab2">
              <div class="view-content"><div class="content-placeholder">运维处置效率</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle">
          <el-tabs v-model="bottomMiddleActiveTab" class="common-tabs">
            <el-tab-pane label="业务质量" name="tab1">
              <div class="view-content"><div class="content-placeholder">业务质量</div></div>
            </el-tab-pane>
            <el-tab-pane label="合规整改" name="tab2">
              <div class="view-content"><div class="content-placeholder">合规整改</div></div>
            </el-tab-pane>
            <el-tab-pane label="设备安全" name="tab3">
              <div class="view-content"><div class="content-placeholder">设备安全</div></div>
            </el-tab-pane>
            <el-tab-pane label="运营风险" name="tab4">
              <div class="view-content"><div class="content-placeholder">运营风险</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right">
          <el-tabs v-model="bottomRightActiveTab" class="common-tabs">
            <el-tab-pane label="资源发展" name="tab1">
              <div class="view-content"><div class="content-placeholder">资源发展</div></div>
            </el-tab-pane>
            <el-tab-pane label="服务发展" name="tab2">
              <div class="view-content"><div class="content-placeholder">服务发展</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>

    <!-- 资源运行详情弹窗 -->
    <ElDialog
      v-model="resourceRunDetailDialogVisible"
      width="800px"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-alarm-dialog"
      center
      destroy-on-close
      title="停车场运行详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in resourceRunDetailViewBtnList"
              :key="item"
              :type="activeResourceRunDetailView === item ? 'primary' : ''"
              plain
              @click="changeResourceRunDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>

      <!-- 明细视图 -->
      <div v-if="activeResourceRunDetailView === '明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="资源ID" span="2">
            {{ parkResourceRunDetailSelectedRow.tbParkingParkingId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="停车场名称">
            {{ parkResourceRunDetailSelectedRow.tbParkingName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="区域归属">
            {{ parkResourceRunDetailSelectedRow.tbRegionName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="环比使用率变化(%)">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.tbParkingOperationChainUtilizationChange) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="本月最高使用率(%)">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.tbParkingOperationMonthlyMaxUtilization) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="高峰时段">
            {{ parkResourceRunDetailSelectedRow.tbParkingOperationPeakHour || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="总泊位数" span="2">
            {{ parkResourceRunDetailSelectedRow.runDetail.tbParkingSpaceTotalCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="日均使用率(%)" span="2">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.runDetail.tbParkingOperationDailyUtilizationRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="周转率" span="2">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.runDetail.tbParkingOperationTurnoverRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="高峰时段使用率(%)" span="2">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.runDetail.tbParkingOperationPeakUtilizationRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 趋势视图 -->
      <div v-if="activeResourceRunDetailView === '趋势'" class="view-content" style="padding:0; background-color: rgb(75, 121, 169)">
        <ChartLine1
          :data="parkResourceRunDetailSelectedRow.timeDistribution"
          title="时段使用率分布趋势"
          :key="resourceRunChartRefreshKey"
        />
      </div>

      <!-- 异常视图 -->
      <div v-if="activeResourceRunDetailView === '异常'" class="view-content" style="padding:0; background-color: rgb(75, 121, 169)">
        <div class="table-box4" style="height:400px;">
          <ElTable
            class="table4"
            :data="parkResourceRunDetailSelectedRow.abnormalRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="异常时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="content"
              label="异常内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="handleStatus"
              label="处理状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.handleStatus === '已处理' ? 'success' : 'warning'">
                  {{ scope.row.handleStatus || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>

      <template #footer>
        <ElButton plain @click="closeResourceRunDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>

    <!-- 周转率时段级趋势弹窗 -->
    <ElDialog
      v-model="resourceRunTurnoverDialogVisible"
      width="700px"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-alarm-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ parkResourceRunTurnoverSelectedRow.tbParkingName }} - 时段周转率趋势</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ChartLine1
          :data="parkResourceRunTurnoverSelectedRow"
          title="时段周转率趋势"
          :key="resourceRunChartRefreshKey"
        />
      </div>
      <template #footer>
        <ElButton plain @click="closeResourceRunTurnoverDialog">关闭</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/table2-rank';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards3';

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
.top-middle { flex: 1; }
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
  .panel-fullscreen-btn {
    margin-right: 0.5vw;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
  }
}

.view-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  padding: 0.2vw !important;
  box-sizing: border-box !important;
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

// 弹窗样式（和文件2保持一致）
:deep(.park-alarm-dialog) {
  --el-dialog-bg-color: #fff !important;
  --el-text-color-primary: #000 !important;
  // 新增：全局覆盖所有子元素的文字颜色为黑色
  --el-text-color-regular: #000 !important;
  --el-text-color-secondary: #000 !important;
  --el-button-text-color: #000 !important;

  color: #000 !important;
  background: var(--el-dialog-bg-color) !important;
  border-radius: 8px !important;
  box-shadow: 0 5px 20px rgb(0 0 0 / 10%) !important;

  .el-dialog__header {
    padding: 12px 20px;
    border-bottom: 1px solid rgb(0 198 255 / 30%);
  }

  .el-dialog__title {
    font-size: 0.9vw;
    font-weight: 500;
    color: #000 !important; // 强化
  }

  .el-dialog__headerbtn {
    top: 12px;
    right: 20px;
  }

  .el-dialog__close {
    font-size: 18px;
    color: #000 !important; // 强化

    &:hover {
      color: rgb(0 122 255 / 70%) !important; // 保留hover效果，如需纯黑可改为#000
    }
  }

  .el-dialog__body {
    max-height: 70vh;
    padding: 20px;
    overflow-y: auto;
  }

  .el-descriptions {
    width: 100%;
    font-size: 0.7vw;

    .el-descriptions__label {
      width: 4vw;
      font-weight: 500;
      color: #000 !important; // 强化
    }
  }

  // 新增：覆盖按钮文字颜色（包括默认/hover/active状态）
  .el-button {
    --el-button-text-color: #000 !important;
    --el-button-hover-text-color: #000 !important;
    --el-button-active-text-color: #000 !important;
    color: #000 !important;
  }

  // 新增：覆盖输入框、下拉框等表单元素文字颜色
  .el-input, .el-select, .el-input__inner, .el-select__input {
    color: #000 !important;
  }
}
</style>
