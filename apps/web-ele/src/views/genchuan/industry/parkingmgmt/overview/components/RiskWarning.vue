<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Filter, FullScreen, Close, UploadFilled } from '@element-plus/icons-vue';
import { ElButton, ElForm, ElFormItem, ElMessage, ElTable, ElTableColumn, ElTag, ElDrawer, ElUpload, ElImage, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import screenFull from 'screenfull';
import FlightGanttChart1 from "#/views/genchuan/industry/parkingmgmt/overview/components/FlightGanttChart1.vue";
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import { fetchParkAlarmList, fetchParkAlarmIndicators, fetchParkAlarmLevelRatio, fetchParkAlarmTypeRatio, fetchParkAlarmStatusRatio, fetchParkAlarmAreaCount, fetchParkAlarmTypeCount, fetchParkAlarmDetail, submitParkAlarmDisposal, fetchParkAlarmTrackInfo } from '#/api/genchuan/industry/parkingmgmt/overview/RiskWarning.ts';

interface ParkAlarmDisposalLog {
  time: number | string;
  content: string;
}

interface ParkAlarmRow {
  parkAlarmAlarmId: string;
  sysAlarmLevelName: string;
  sysAlarmTypeName: string;
  parkAlarmAlarmTime: number | string;
  tbAssetExtendName: string;
  tbAssetExtendAddress: string;
  sysDisposalStatusName: string;
  sysResponsibleUnitName: string;
  parkAlarmReceiveTime: number | string;
  parkAlarmDisposalDuration: number;
  parkMaintainWorkorderWorkorderNo: string;
  parkAlarmEvidence: string[];
  parkAlarmDisposalLog: ParkAlarmDisposalLog[];
  parkAlarmProgress: string;
}

interface ParkAlarmIndicators {
  totalCount: number;
  urgentCount: number;
  highCount: number;
  midCount: number;
  lowCount: number;
  undisposedCount: number;
}

interface ChartRatioData {
  legend: string[];
  series: { name: string; data: number[] }[];
}

interface ChartBarData {
  xAxis: string[];
  series: { name: string; data: number[] }[];
}

interface DisposeForm {
  disposalMeasure: string;
  disposeFileList: any[];
}

interface SubmitDisposeParams {
  parkAlarmAlarmId: string;
  disposalMeasure: string;
  disposalEvidence: string[];
}

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const parkAlarmPanelRef = ref<HTMLElement | null>(null);
const parkAlarmCurrentFullscreenPanel = ref<HTMLElement | null>(null);
const eventDisposalTrackingRef = ref<HTMLElement | null>(null);
const eventDisposalTrackingCurrentFullscreen = ref<HTMLElement | null>(null);

const parkAlarmList = ref<ParkAlarmRow[]>([]);
const parkAlarmIndicators = ref<ParkAlarmIndicators>({ totalCount: 0, urgentCount:0, highCount:0, midCount:0, lowCount:0, undisposedCount:0 });
const parkAlarmLevelRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmTypeRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmStatusRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAlarmTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAlarmBaseFontScale = ref(1);
const parkAlarmActiveIndices = ref<number[]>([]);
const parkAlarmChartRefreshKey = ref(0);
const activeParkAlarmView = ref('卡片');
const parkAlarmViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);

const parkAlarmDrawerVisible = ref(false);
const parkAlarmDrawerType = ref('');
const parkAlarmSelectedRow = ref<ParkAlarmRow>({
  parkAlarmAlarmId: '',
  sysAlarmLevelName: '',
  sysAlarmTypeName: '',
  parkAlarmAlarmTime: 0,
  tbAssetExtendName: '',
  tbAssetExtendAddress: '',
  sysDisposalStatusName: '',
  sysResponsibleUnitName: '',
  parkAlarmReceiveTime: 0,
  parkAlarmDisposalDuration: 0,
  parkMaintainWorkorderWorkorderNo: '',
  parkAlarmEvidence: [],
  parkAlarmDisposalLog: [],
  parkAlarmProgress: ''
});

const disposeFormRef = ref<any>(null);
const disposeForm = reactive<DisposeForm>({ disposalMeasure: '', disposeFileList: [] });
const disposeRules = reactive({
  disposalMeasure: [
    { required: true, message: '处置措施为必填项', trigger: ['blur','change'], whitespace: true },
    { max:500, message:'处置措施最多输入500字', trigger:'blur'}
  ]
});

const uploadAction = ref('');
const uploadHeaders = ref({});

const changeParkAlarmView = (viewName: string) => {
  activeParkAlarmView.value = viewName;
  if (viewName === '卡片') {
    nextTick(() => { setTimeout(() => initParkAlarmNumberAnimations(), 300); });
  }
  if (viewName === '柱状图' || viewName === '饼图') {
    nextTick(() => { parkAlarmChartRefreshKey.value++; });
  }
};

const handleParkAlarmFullscreenChange = () => {
  if (!screenFull.isFullscreen && parkAlarmCurrentFullscreenPanel.value) {
    parkAlarmCurrentFullscreenPanel.value.style.width = '';
    parkAlarmCurrentFullscreenPanel.value.style.maxWidth = '';
    parkAlarmCurrentFullscreenPanel.value.style.overflow = 'hidden';
    screenFull.off('change', handleParkAlarmFullscreenChange);
    nextTick(() => { setTimeout(() => { parkAlarmChartRefreshKey.value++; }, 200); });
    parkAlarmCurrentFullscreenPanel.value = null;
  }
};

const toggleParkAlarmPanelFullscreen = () => {
  if (!screenFull.isEnabled) { ElMessage.warning('当前浏览器不支持全屏功能'); return; }
  if (parkAlarmPanelRef.value) {
    screenFull.toggle(parkAlarmPanelRef.value);
    parkAlarmCurrentFullscreenPanel.value = parkAlarmPanelRef.value;
    screenFull.on('change', handleParkAlarmFullscreenChange);
  }
};

const handleEventFullscreenChange = () => {
  if (!screenFull.isFullscreen && eventDisposalTrackingCurrentFullscreen.value) {
    eventDisposalTrackingCurrentFullscreen.value.style.width = '';
    eventDisposalTrackingCurrentFullscreen.value.style.maxWidth = '';
    eventDisposalTrackingCurrentFullscreen.value.style.overflow = 'hidden';
    screenFull.off('change', handleEventFullscreenChange);
    eventDisposalTrackingCurrentFullscreen.value = null;
  }
};

const toggleEventPanelFullscreen = () => {
  if (!screenFull.isEnabled) { ElMessage.warning('当前浏览器不支持全屏功能'); return; }
  if (eventDisposalTrackingRef.value) {
    screenFull.toggle(eventDisposalTrackingRef.value);
    eventDisposalTrackingCurrentFullscreen.value = eventDisposalTrackingRef.value;
    screenFull.on('change', handleEventFullscreenChange);
  }
};

const formatNumber = (num: number) => num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');

const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
  if (!element) return;
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = formatNumber(value);
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};

const initParkAlarmNumberAnimations = () => {
  const elements = document.querySelectorAll('.park-alarm-number-animate');
  elements.forEach(el => {
    const target = el as HTMLElement;
    const value = Number(target.textContent || 0);
    if (value > 0) animateValue(target, 0, value, 1500);
  });
};

const getParkAlarmListData = async () => {
  try { const res = await fetchParkAlarmList(); parkAlarmList.value = res as ParkAlarmRow[]; }
  catch (error: any) { ElMessage.error(`数据加载失败：${error.message}`); parkAlarmList.value = []; }
};

const getParkAlarmIndicatorData = async () => {
  try { const res = await fetchParkAlarmIndicators(); parkAlarmIndicators.value = res as ParkAlarmIndicators; }
  catch (error: any) { ElMessage.error(`指标加载失败：${error.message}`); parkAlarmIndicators.value = { totalCount: 0, urgentCount:0, highCount:0, midCount:0, lowCount:0, undisposedCount:0 }; }
};

const getParkAlarmLevelRatioData = async () => {
  try { const res = await fetchParkAlarmLevelRatio(); parkAlarmLevelRatioData.value = res as ChartRatioData; }
  catch (error: any) { ElMessage.error(`等级占比加载失败：${error.message}`); parkAlarmLevelRatioData.value = { legend: [], series: [] }; }
};

const getParkAlarmTypeRatioData = async () => {
  try { const res = await fetchParkAlarmTypeRatio(); parkAlarmTypeRatioData.value = res as ChartRatioData; }
  catch (error: any) { ElMessage.error(`类型占比加载失败：${error.message}`); parkAlarmTypeRatioData.value = { legend: [], series: [] }; }
};

const getParkAlarmStatusRatioData = async () => {
  try { const res = await fetchParkAlarmStatusRatio(); parkAlarmStatusRatioData.value = res as ChartRatioData; }
  catch (error: any) { ElMessage.error(`状态占比加载失败：${error.message}`); parkAlarmStatusRatioData.value = { legend: [], series: [] }; }
};

const getParkAlarmAreaData = async () => {
  try { const res = await fetchParkAlarmAreaCount(); parkAlarmAreaData.value = res as ChartBarData; }
  catch (error: any) { ElMessage.error(`区域数据加载失败：${error.message}`); parkAlarmAreaData.value = { xAxis: [], series: [] }; }
};

const getParkAlarmTypeData = async () => {
  try { const res = await fetchParkAlarmTypeCount(); parkAlarmTypeData.value = res as ChartBarData; }
  catch (error: any) { ElMessage.error(`类型数据加载失败：${error.message}`); parkAlarmTypeData.value = { xAxis: [], series: [] }; }
};

const getParkAlarmDetailData = async (alarmId: string) => {
  try { const res = await fetchParkAlarmDetail(alarmId); parkAlarmSelectedRow.value = { ...parkAlarmSelectedRow.value, ...res }; }
  catch (error: any) { ElMessage.warning(`详情加载失败，展示本地数据：${error.message}`); }
};

const getParkAlarmTrackInfoData = async (alarmId: string) => {
  try { const res = await fetchParkAlarmTrackInfo(alarmId); parkAlarmSelectedRow.value = { ...parkAlarmSelectedRow.value, ...res }; }
  catch (error: any) { ElMessage.warning(`跟踪数据加载失败，展示本地数据：${error.message}`); }
};

const getAlarmLevelTagType = (val?: string) => {
  if (!val) return '';
  switch (val) {
    case '紧急': return 'danger';
    case '高危': return 'warning';
    case '中危': return 'info';
    case '低危': return 'success';
    default: return '';
  }
};

const getDisposeStatusTagType = (val?: string) => {
  if (!val) return '';
  switch (val) {
    case '未处置': return 'danger';
    case '处理中': return 'warning';
    case '已完成': return 'success';
    case '已驳回': return 'info';
    default: return '';
  }
};

const formatTimeStamp = (timeStamp?: number | string) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const openParkAlarmDrawer = async (row: ParkAlarmRow, type:string) => {
  parkAlarmSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkAlarmRow;
  parkAlarmDrawerType.value = type;
  if(type === 'dispose'){
    disposeForm.disposalMeasure = '';
    disposeForm.disposeFileList = [];
  }
  if(type === 'detail') await getParkAlarmDetailData(row.parkAlarmAlarmId);
  if(type === 'track') await getParkAlarmTrackInfoData(row.parkAlarmAlarmId);
  parkAlarmDrawerVisible.value = true;
};

const closeParkAlarmDrawer = () => {
  parkAlarmDrawerVisible.value = false;
  parkAlarmSelectedRow.value = {
    parkAlarmAlarmId: '',
    sysAlarmLevelName: '',
    sysAlarmTypeName: '',
    parkAlarmAlarmTime: 0,
    tbAssetExtendName: '',
    tbAssetExtendAddress: '',
    sysDisposalStatusName: '',
    sysResponsibleUnitName: '',
    parkAlarmReceiveTime: 0,
    parkAlarmDisposalDuration: 0,
    parkMaintainWorkorderWorkorderNo: '',
    parkAlarmEvidence: [],
    parkAlarmDisposalLog: [],
    parkAlarmProgress: ''
  };
};

const submitDisposeForm = async () => {
  if (!disposeFormRef.value) return;
  disposeFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const submitParams: SubmitDisposeParams = {
        parkAlarmAlarmId: parkAlarmSelectedRow.value.parkAlarmAlarmId,
        disposalMeasure: disposeForm.disposalMeasure ? disposeForm.disposalMeasure.trim() : '',
        disposalEvidence: disposeForm.disposeFileList.map(item => item.url || item.response?.data?.url || '')
      };
      try {
        const res = await submitParkAlarmDisposal(submitParams);
        if(res && res.success){
          ElMessage.success(res.msg || '处置内容提交成功，运维工单已生成');

          // ============ 下面是修改的代码 ============
          // ✅ 核心修复：重新生成数组，强制触发Vue响应式更新，精准修改对应行，不会影响其他行
          parkAlarmList.value = parkAlarmList.value.map(item => {
            if(item.parkAlarmAlarmId === submitParams.parkAlarmAlarmId) {
              return {
                ...item,
                sysDisposalStatusName: '处理中',
                parkMaintainWorkorderWorkorderNo: res.parkMaintainWorkorderWorkorderNo || `W${new Date().getTime()}`,
                parkAlarmProgress: '处理中'
              }
            }
            return item;
          });
          // ============ 修改结束 ============

          closeParkAlarmDrawer();
        }
      } catch (error: any) {
        ElMessage.error(`提交失败：${error.message || '处置提交失败，请稍后重试'}`);
      }
    }
  });
};

onMounted(async () => {
  await Promise.all([
    getParkAlarmListData(),
    getParkAlarmIndicatorData(),
    getParkAlarmLevelRatioData(),
    getParkAlarmTypeRatioData(),
    getParkAlarmStatusRatioData(),
    getParkAlarmAreaData(),
    getParkAlarmTypeData()
  ]);
  setTimeout(() => { parkAlarmChartRefreshKey.value++; }, 200);
});

onUnmounted(() => {
  screenFull.off('change', handleParkAlarmFullscreenChange);
  screenFull.off('change', handleEventFullscreenChange);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="parkAlarmPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>预警事件概览</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton v-for="item in parkAlarmViewBtnList" :key="item" :type="activeParkAlarmView === item ? 'primary' : ''" plain @click="changeParkAlarmView(item)" class="view-btn">{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="toggleParkAlarmPanelFullscreen">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeParkAlarmView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">预警事件总数</div>
                <div class="indicator-value">
                  <span :data-value="parkAlarmIndicators.totalCount" class="park-alarm-number-animate">{{ parkAlarmIndicators.totalCount }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">未处置预警数</div>
                <div class="indicator-value">
                  <span :data-value="parkAlarmIndicators.undisposedCount" class="park-alarm-number-animate">{{ parkAlarmIndicators.undisposedCount }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">高危预警数</div>
                <div class="indicator-value">
                  <span :data-value="parkAlarmIndicators.highCount" class="park-alarm-number-animate">{{ parkAlarmIndicators.highCount }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
            </div>
          </div>
          <div v-if="activeParkAlarmView === '柱状图'" class="view-content">
            <div style="width: 49%;height: 100%;display: inline-block;vertical-align: top;">
              <VerticalBar2 :x-axis="parkAlarmAreaData.xAxis" :series="parkAlarmAreaData.series" unit="件" title="不同区域预警数对比" :base-font-scale="parkAlarmBaseFontScale" :active-indices="parkAlarmActiveIndices" style="width:100%;height:100%;" />
            </div>
            <div style="width: 49%;height: 100%;display: inline-block;vertical-align: top;padding-left: 0.3vw;border-left: 0.3vh solid #02a6b5;">
              <VerticalBar1 :x-axis="parkAlarmTypeData.xAxis" :series="parkAlarmTypeData.series" unit="件" title="不同类型预警数对比" :base-font-scale="parkAlarmBaseFontScale" :active-indices="parkAlarmActiveIndices" style="width:100%;height:100%;" />
            </div>
          </div>
          <div v-if="activeParkAlarmView === '饼图'" class="view-content">
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;">
              <ChartPie1 :data="parkAlarmLevelRatioData" title="预警等级占比" :base-font-scale="parkAlarmBaseFontScale" :active-indices="parkAlarmActiveIndices" style="width:100%;height:100%;" />
            </div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;">
              <ChartPie2 :data="parkAlarmTypeRatioData" title="预警类型占比" :base-font-scale="parkAlarmBaseFontScale" :active-indices="parkAlarmActiveIndices" style="width:100%;height:100%;" />
            </div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;">
              <ChartPie2 :data="parkAlarmStatusRatioData" title="处置状态占比" :base-font-scale="parkAlarmBaseFontScale" :active-indices="parkAlarmActiveIndices" style="width:100%;height:100%;" />
            </div>
          </div>
          <div v-if="activeParkAlarmView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="parkAlarmList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
              >
                <ElTableColumn prop="parkAlarmAlarmId" label="预警ID" align="center" width="120" />
                <ElTableColumn prop="sysAlarmLevelName" label="预警等级" align="center" width="100">
                  <template #default="scope">
                    <ElTag :type="getAlarmLevelTagType(scope.row.sysAlarmLevelName)">{{ scope.row.sysAlarmLevelName || '-' }}</ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="sysAlarmTypeName" label="预警类型" align="center" width="120" />
                <ElTableColumn prop="parkAlarmAlarmTime" label="预警时间" align="center" width="160">
                  <template #default="scope">{{ formatTimeStamp(scope.row.parkAlarmAlarmTime) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="tbAssetExtendAddress" label="预警地址" align="center" min-width="180" />
                <ElTableColumn prop="sysDisposalStatusName" label="处置状态" align="center" width="120">
                  <template #default="scope">
                    <ElTag :type="getDisposeStatusTagType(scope.row.sysDisposalStatusName)">{{ scope.row.sysDisposalStatusName || '-' }}</ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn label="操作" align="center" width="200" fixed="right" cell-class-name="op-col">
                  <template #default="scope">
                    <ElButton type="primary" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAlarmDrawer(scope.row, 'detail')">详情</ElButton>
                    <template v-if="scope.row.sysDisposalStatusName === '未处置'">
                      <ElButton type="warning" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAlarmDrawer(scope.row, 'dispose')">处置</ElButton>
                    </template>
                    <template v-else>
                      <span style="display:inline-block;width:40px;"></span> <!-- 空白占位，宽度和按钮+间距一致，纯空格效果 -->
                    </template>
                    <ElButton type="success" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAlarmDrawer(scope.row, 'track')">跟踪</ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
        <div class="panel top-middle"><p>隐患预警视图</p></div>
        <div class="panel top-right"><p>异常预警视图</p></div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="eventDisposalTrackingRef">
          <div class="header-actions">
            <div class="actions-left"><p>事件处置跟踪</p></div>
            <div class="actions-right">
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="toggleEventPanelFullscreen">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <FlightGanttChart1 title="各预警事件处置全流程时间轴" :baseFontScale="1" />
        </div>
        <div class="panel bottom-middle"><p>故障预警视图</p></div>
        <div class="panel bottom-right"><p>合规预警视图</p></div>
      </div>
    </div>
  </div>

  <ElDrawer v-model="parkAlarmDrawerVisible" direction="rtl" size="30%" :close-on-click-modal="false" class="park-alarm-drawer">
    <template #title>
      <span v-if="parkAlarmDrawerType === 'detail'">预警事件详情</span>
      <span v-if="parkAlarmDrawerType === 'dispose'">预警事件处置</span>
      <span v-if="parkAlarmDrawerType === 'track'">预警事件跟踪</span>
    </template>

    <div v-if="parkAlarmDrawerType === 'detail'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="预警ID">{{ parkAlarmSelectedRow.parkAlarmAlarmId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预警等级">
          <ElTag :type="getAlarmLevelTagType(parkAlarmSelectedRow.sysAlarmLevelName)">{{ parkAlarmSelectedRow.sysAlarmLevelName || '-' }}</ElTag>
        </el-descriptions-item>
        <el-descriptions-item label="预警类型">{{ parkAlarmSelectedRow.sysAlarmTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预警时间">{{ formatTimeStamp(parkAlarmSelectedRow.parkAlarmAlarmTime) }}</el-descriptions-item>
        <el-descriptions-item label="责任单位">{{ parkAlarmSelectedRow.sysResponsibleUnitName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="接收时间">{{ formatTimeStamp(parkAlarmSelectedRow.parkAlarmReceiveTime) }}</el-descriptions-item>
        <el-descriptions-item label="处置时长">{{ parkAlarmSelectedRow.parkAlarmDisposalDuration || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="关联资产">{{ parkAlarmSelectedRow.tbAssetExtendName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预警地址">{{ parkAlarmSelectedRow.tbAssetExtendAddress || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联工单号">{{ parkAlarmSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="关联证据">
          <div class="evidence-list">
            <ElImage v-for="(url,idx) in parkAlarmSelectedRow.parkAlarmEvidence" :key="idx" :src="url" fit="cover" :preview-list="parkAlarmSelectedRow.parkAlarmEvidence" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="处置日志">
          <div class="log-list" v-if="parkAlarmSelectedRow.parkAlarmDisposalLog.length">
            <div class="log-item" v-for="(log,idx) in parkAlarmSelectedRow.parkAlarmDisposalLog" :key="idx">
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span>
              <span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无处置日志</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div v-if="parkAlarmDrawerType === 'dispose'">
      <ElForm :model="disposeForm" :rules="disposeRules" label-width="100px" class="dispose-form" ref="disposeFormRef">
        <ElFormItem label="处置措施" prop="disposalMeasure" class="form-item-required">
          <el-input v-model="disposeForm.disposalMeasure" :rows="6" type="textarea" placeholder="请输入处置措施" maxlength="500" show-word-limit clearable autofocus style="width:100%;" />
        </ElFormItem>
        <ElFormItem label="处置凭证">
          <ElUpload v-model:file-list="disposeForm.disposeFileList" :action="uploadAction" list-type="picture-card" :limit="3" :auto-upload="false" accept="image/*">
            <div><el-icon><UploadFilled /></el-icon></div>
          </ElUpload>
          <div class="upload-tips">最多上传3张图片，支持jpg/png格式</div>
        </ElFormItem>
        <div>
          <ElButton type="primary" @click="submitDisposeForm">确认提交</ElButton>
          <ElButton plain @click="closeParkAlarmDrawer">取消</ElButton>
        </div>
      </ElForm>
    </div>

    <div v-if="parkAlarmDrawerType === 'track'">
      <el-descriptions bordered :column="1" class="desc-track">
        <el-descriptions-item label="预警ID">{{ parkAlarmSelectedRow.parkAlarmAlarmId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处置状态">
          <ElTag :type="getDisposeStatusTagType(parkAlarmSelectedRow.sysDisposalStatusName)">{{ parkAlarmSelectedRow.sysDisposalStatusName || '-' }}</ElTag>
        </el-descriptions-item>
        <el-descriptions-item label="处置进度">{{ parkAlarmSelectedRow.parkAlarmProgress || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联工单号">{{ parkAlarmSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="处置时长">{{ parkAlarmSelectedRow.parkAlarmDisposalDuration || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="最新处置记录">
          <div class="feedback-content">
            {{ parkAlarmSelectedRow.parkAlarmDisposalLog.length ? parkAlarmSelectedRow.parkAlarmDisposalLog[parkAlarmSelectedRow.parkAlarmDisposalLog.length-1].content : '暂无处置记录' }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </ElDrawer>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table4';
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
  overflow: hidden;
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
  overflow: hidden;
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
  overflow: hidden;
}

.top { display: flex; gap: 0.6vw; height: 60%; overflow: hidden; }
.top-left { flex: 1; }
.top-middle { flex: 1; }
.top-right { flex: 1; }
.bottom { display: flex; gap: 0.6vw;	height: 36%; overflow: hidden; }
.bottom-left { flex: 1; }
.bottom-middle { flex: 1; }
.bottom-right { flex: 1; }

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 0.2vw;
  margin-bottom: 0.5vw;
  .actions-left p {
    margin: 0;
    font-size: 0.9vw;
    font-weight: 500;
    color: #00ffd0;
  }
  .actions-right { display: flex; align-items: center; gap: 0.8vw; }
  .view-btn-group { display: flex; margin-right: 0.5vw; }
  .panel-fullscreen-btn {
    background: transparent; border: none; padding: 0; cursor: pointer;
    color: #00ccff; margin-right: 0.5vw;
  }
}

.view-content {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;
  > div { width: 100%; height: 100%; }
}

.table-box1, .table-box3, .rank-box {
  width: 100%;
  height: 100%;
  overflow: auto !important;
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

:deep(.el-table) {
  width: 100% !important;
  table-layout: fixed !important;
  height: 100% !important;
  :deep(table) {
    width: 100% !important;
    table-layout: fixed !important;
  }
  :deep(.el-table__body-wrapper) {
    width: 100% !important;
    overflow-x: auto !important;
  }
}

:deep(.el-tag) {
  font-size: 0.7vw;
  &.el-tag--success { color: #2eb861; background: rgb(46 184 97 / 20%); border-color: rgb(46 184 97 / 50%); }
  &.el-tag--warning { color: #fad514; background: rgb(250 173 20 / 20%); border-color: rgb(250 173 20 / 50%); }
  &.el-tag--danger { color: #eb5757; background: rgb(235 87 87 / 20%); border-color: rgb(235 87 87 / 50%); }
  &.el-tag--info { color: #4299e1; background: rgb(66 153 225 / 20%); border-color: rgb(66 153 225 / 50%); }
}

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
}

:deep(.panel) {
  .el-tab-pane { display: flex; flex-direction: column; width: 100% !important; height: 100% !important; }
  .view-content { flex: 1; width: 100% !important; height: 100% !important; min-height: 300px !important; }
}

:deep(.top-left) {
  &>>>.echarts {
    height: 100% !important;
    .ec-grid { bottom: 25px !important; left: 10px !important; right: 10px !important; top: 30px !important; }
  }
  &>>>.el-tab-pane { height: 95% !important; padding-bottom: 2vh !important; }
  &>>>.view-content { padding: 0.2vw !important; box-sizing: border-box !important; }
}

:deep(.park-alarm-drawer) {
  --el-drawer-bg-color: #ffffff !important;
  --el-text-color-primary: #000000 !important;
  background: var(--el-drawer-bg-color) !important;
  color: var(--el-text-color-primary) !important;
  border-left: 0.2vh solid rgb(0 198 255 / 30%) !important;

  .el-drawer__header {
    border-bottom: 1px solid rgb(0 198 255 / 30%);
    padding: 0.5vw 0.8vw;
    .el-drawer__title { font-size: 0.9vw; font-weight: 500; color: #000; }
    .el-drawer__close-btn { color: #000; &:hover { color: rgb(0 122 255 / 70%); } }
  }

  .el-drawer__body {
    padding: 0.8vw;
    height: auto;
    overflow: auto;
    max-height: 90vh;
  }

  .el-descriptions {
    width: 100%;
    font-size: 0.7vw;
    .el-descriptions__label { color: #000; font-weight: 500; width: 4vw; }
    .el-descriptions__content { color: #000; }
    .el-descriptions-item__content { padding: 0.3vw 0.5vw; }
  }

  .evidence-list { display:flex; gap:0.5vw; flex-wrap:wrap; margin-top:0.5vw; }
  .evidence-list :deep(.el-image) { width:6vw; height:4.5vh; border-radius:0.2vw; }

  .log-list { margin-top:0.5vw; border:1px solid rgb(0 204 255 / 15%); border-radius:0.2vw; padding:0.5vw; }
  .log-item { display:flex; flex-direction:column; margin-bottom:0.5vh; padding-bottom:0.5vh; border-bottom:1px dashed rgb(0 204 255 / 15%); }
  .log-time { font-weight:500; color: rgb(0 82 103 / 80%); font-size:0.7vw; }
  .log-content { color:#000; font-size:0.7vw; }
  .empty-log { padding:0.5vw; text-align:center; color: rgb(0 0 0 / 60%); font-size:0.7vw; }

  .feedback-content {
    padding:0.5vw;
    border:1px solid rgb(0 204 255 / 15%);
    border-radius:0.2vw;
    min-height:8vh;
    color:#000;
    font-size:0.7vw;
    background: rgb(255 255 255 / 90%);
  }

  .dispose-form {
    width: 100%;
    padding: 10px 0;
    .el-form-item { margin-bottom: 1vh; }
    .el-form-item__label { font-size:0.7vw; color:#000; font-weight:500; }
    .el-input { width: 100%; }
    .el-input__wrapper { border-radius: 4px; }
  }

  .form-item-required label::after { content:'*'; color:#eb5757; margin-left:0.2vw; }
  .upload-tips { font-size:0.6vw; marginTop:0.5vw; color:#666; }
}
</style>
