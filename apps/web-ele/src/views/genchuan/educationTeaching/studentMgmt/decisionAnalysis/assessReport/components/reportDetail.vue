<script setup>
import { computed, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElTable, ElTableColumn, ElTabs, ElTabPane, ElCard, ElRow, ElCol } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChart.vue';
import {
  getAssessReportChart,
  getAssessReportDimensionScore,
  getAssessReportCycleTrend,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const emit = defineEmits(['refresh']);

// 抽屉API
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1100,
  onCancel: () => detailDrawerApi.close(),
});

// 数据状态
const loading = ref(false);
const chartData = ref({});           // 看板数据
const dimensionData = ref([]);       // 班级维度得分明细
const trendData = ref([]);           // 周期趋势数据

// 时间戳格式化（列表传来的时间戳可能是数字）
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 将时间戳转换为接口需要的 YYYY-MM-DD HH:mm:ss 格式
const formatToDateTimeStr = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 抽屉标题
const drawerTitle = computed(() => {
  const name = props.detailObj?.reportType || `${props.detailObj?.timeScale}考评报表`;
  return props.title || name;
});

// ---------- 全维度统计相关 ----------
// 卡片列表（来自 chart 接口）
const cardList = computed(() => {
  const total = chartData.value.totalAssessCount || 0;
  const avg = chartData.value.avgScore || 0;
  const published = chartData.value.publishedCount || 0;
  const unpublished = chartData.value.unPublishedCount || 0;
  return [
    {title: '总考评记录数', value: total, color: '#409EFF', status: 'total'},
    {title: '平均考评得分', value: avg, color: '#67C23A', suffix: '分', status: 'avg'},
    {title: '已发布记录数', value: published, color: '#E6A23C', status: 'published'},
    {title: '未发布记录数', value: unpublished, color: '#F56C6C', status: 'unpublished'},
  ];
});

// 计算各维度平均分（基于班级明细数据）
const dimensionAvgMap = computed(() => {
  if (!dimensionData.value.length) return [];
  // 累加各维度总分
  let classroomSum = 0, morningSum = 0, civilizedSum = 0, blackboardSum = 0;
  dimensionData.value.forEach(item => {
    classroomSum += item.classRoomScore || 0;
    morningSum += item.morningExerciseScore || 0;
    civilizedSum += item.civilizedClassScore || 0;
    blackboardSum += item.blackboardScore || 0;
  });
  const count = dimensionData.value.length;
  return [
    {name: '教室卫生', avg: classroomSum / count, max: 100, min: 0},
    {name: '早操', avg: morningSum / count, max: 100, min: 0},
    {name: '文明班级', avg: civilizedSum / count, max: 100, min: 0},
    {name: '黑板报', avg: blackboardSum / count, max: 100, min: 0},
  ];
});

// 雷达图指标
const radarIndicator = computed(() => {
  return dimensionAvgMap.value.map(d => ({name: d.name, max: 100}));
});

// 雷达图系列数据（各维度平均分）
const radarSeries = computed(() => {
  const values = dimensionAvgMap.value.map(d => d.avg);
  return [{name: '维度平均得分', value: values}];
});

// ---------- 同比环比分析相关 ----------
const compareCards = computed(() => {
  const yoy = props.detailObj.yoyGrowth;
  const qoq = props.detailObj.qoqGrowth;
  return [
    {
      label: '同比增长率',
      value: yoy !== undefined && yoy !== null ? yoy : '-',
      suffix: '%',
      color: '#67C23A'
    },
    {
      label: '环比增长率',
      value: qoq !== undefined && qoq !== null ? qoq : '-',
      suffix: '%',
      color: '#409EFF'
    },
  ];
});

// 折线图数据
const lineXAxis = computed(() => (trendData.value || []).map(item => item.cycleDate));
const lineSeries = computed(() => [{
  name: '平均得分',
  data: (trendData.value || []).map(item => item.avgScore)
}]);

// ---------- 明细表格 ----------
const detailColumns = [
  {prop: 'className', label: '班级名称', minWidth: 120},
  {prop: 'classRoomScore', label: '教室卫生', minWidth: 100},
  {prop: 'morningExerciseScore', label: '早操', minWidth: 100},
  {prop: 'civilizedClassScore', label: '文明班级', minWidth: 100},
  {prop: 'blackboardScore', label: '黑板报', minWidth: 100},
  {prop: 'totalScore', label: '总分', minWidth: 100},
];

// ---------- 数据加载 ----------
async function loadFullDetail() {
  const {timeScale, statStartTime, statEndTime} = props.detailObj;
  if (!timeScale || !statStartTime || !statEndTime) {
    ElMessage.warning('报表缺少统计周期信息，无法加载详细数据');
    return;
  }

  // 转换为接口需要的字符串格式
  const startStr = formatToDateTimeStr(statStartTime);
  const endStr = formatToDateTimeStr(statEndTime);
  const params = {
    timeScale,
    statStartTime: startStr,
    statEndTime: endStr,
  };

  loading.value = true;
  try {
    // 并发请求三个图表接口
    const [chartRes, dimRes, trendRes] = await Promise.allSettled([
      getAssessReportChart(params),
      getAssessReportDimensionScore(params),
      getAssessReportCycleTrend({...params, className: undefined}), // 不传班级，统计全部平均
    ]);

    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('看板接口失败', chartRes.reason);
      chartData.value = {};
    }

    if (dimRes.status === 'fulfilled') {
      dimensionData.value = dimRes.value;
    } else {
      console.warn('维度得分接口失败', dimRes.reason);
      dimensionData.value = [];
    }

    if (trendRes.status === 'fulfilled') {
      trendData.value = trendRes.value;
    } else {
      console.warn('周期趋势接口失败', trendRes.reason);
      trendData.value = [];
    }
  } catch (error) {
    console.error('加载报表详情失败', error);
    ElMessage.error('加载报表详情失败');
  } finally {
    loading.value = false;
  }
}

// 监听抽屉打开和 detailObj 变化，重新加载数据
watch(
  () => props.detailObj,
  (newVal) => {
    if (newVal?.id && detailDrawerApi.isOpen?.value) {
      loadFullDetail();
    }
  },
  {deep: true, immediate: true}
);

// 暴露 open/close 方法
defineExpose({
  open: () => {
    detailDrawerApi.open();
    loadFullDetail();
  },
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle" v-loading="loading" class="genchuan-detail-drawer">
    <div class="report-full-detail">
      <!-- 基础信息卡片 -->
      <el-card class="base-info-card" shadow="never">
        <template #header>
          <span class="card-header-title">📋 报表基础信息</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="8"><span
            class="info-label">报表时间尺度：</span>{{ detailObj.timeScale || '-' }}
          </el-col>
          <el-col :span="8"><span
            class="info-label">统计开始时间：</span>{{ formatTimestamp(detailObj.statStartTime) }}
          </el-col>
          <el-col :span="8"><span
            class="info-label">统计结束时间：</span>{{ formatTimestamp(detailObj.statEndTime) }}
          </el-col>
          <el-col :span="8"><span
            class="info-label">统计完成时间：</span>{{ formatTimestamp(detailObj.statFinishTime) }}
          </el-col>
          <el-col :span="8"><span class="info-label">报表类型：</span>{{
              detailObj.reportType || '-'
            }}
          </el-col>
          <el-col :span="8"><span class="info-label">生成人：</span>{{ detailObj.creator || '-' }}
          </el-col>
        </el-row>
      </el-card>

      <!-- 图表/数据切换区 -->
      <el-tabs v-model="activeTab" class="data-tabs" type="border-card">
        <!-- 全维度统计 -->
        <el-tab-pane label="全维度统计" name="dimension">
          <div class="dimension-stats">
            <!-- 指标卡片 -->
            <div class="card-group">
              <Indicator
                v-for="item in cardList"
                :key="item.title"
                :title="item.title"
                :value="item.value"
                :color="item.color"
                :suffix="item.suffix"
                :status="item.status"
                class="stat-card"
              />
            </div>
            <!-- 雷达图展示各维度平均得分 -->
            <Radar
              v-if="radarIndicator.length"
              title-text="各维度平均得分雷达图"
              :indicator="radarIndicator"
              :series="radarSeries"
              style="height: 400px; margin-top: 20px;"
            />
            <el-empty v-else description="暂无维度数据"/>
          </div>
        </el-tab-pane>

        <!-- 同比环比分析 -->
        <el-tab-pane label="同比环比分析" name="compare">
          <div class="compare-analysis">
            <div class="card-group">
              <el-card v-for="card in compareCards" :key="card.label" class="compare-card"
                       shadow="hover">
                <div class="compare-label">{{ card.label }}</div>
                <div class="compare-value">
                  {{ card.value !== '-' ? card.value : '-' }}<span class="suffix">{{
                    card.suffix
                  }}</span>
                </div>
              </el-card>
            </div>
            <!-- 周期趋势折线图 -->
            <lineChart
              v-if="lineXAxis.length"
              title="考评得分周期趋势"
              :x-data="lineXAxis"
              :series-data="lineSeries"
              y-name="平均得分"
              style="height: 400px; margin-top: 20px;"
            />
            <el-empty v-else description="暂无趋势数据"/>
          </div>
        </el-tab-pane>

        <!-- 明细数据 -->
        <el-tab-pane label="明细数据" name="detail">
          <div class="detail-table-wrapper">
            <el-table :data="dimensionData" border stripe style="width: 100%">
              <el-table-column
                v-for="col in detailColumns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :min-width="col.minWidth"
                align="center"
              />
            </el-table>
            <el-empty v-if="!dimensionData.length" description="暂无明细数据"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.report-full-detail {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 70vh;

  .base-info-card {
    margin-bottom: 20px;

    .card-header-title {
      font-weight: 600;
      font-size: 16px;
      color: #2c3e50;
    }

    .info-label {
      font-weight: 500;
      color: #606266;
      margin-right: 8px;
    }
  }

  .data-tabs {
    background: white;
    border-radius: 8px;
  }

  .card-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;

    .stat-card {
      flex: 1;
      min-width: 180px;
    }

    .compare-card {
      flex: 1;
      text-align: center;

      .compare-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 12px;
      }

      .compare-value {
        font-size: 28px;
        font-weight: bold;
        color: #303133;

        .suffix {
          font-size: 14px;
          margin-left: 4px;
        }
      }
    }
  }

  .detail-table-wrapper {
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>
