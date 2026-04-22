<script setup>
import { computed, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElTable, ElTableColumn, ElTabs, ElTabPane, ElCard, ElRow, ElCol } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import {
  getDormCompareReportChart,
  getDormCompareReportScoreRank,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCompareReport/data.js';

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
const rankData = ref([]);            // 宿舍得分排名数据

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
  const name = props.detailObj?.reportType || `${props.detailObj?.timeScale}宿舍评比报表`;
  return props.title || name;
});

// ---------- 全维度统计相关 ----------
// 卡片列表（6个卡片）
const cardList = computed(() => {
  const total = chartData.value.totalCompareCount || 0;
  const avg = chartData.value.avgScore || 0;
  const max = chartData.value.maxScore || 0;
  const min = chartData.value.minScore || 0;
  const civilized = chartData.value.civilizedDormCount || 0;
  const normal = chartData.value.normalDormCount || 0;
  return [
    { title: '总宿舍评比记录数', value: total, color: '#409EFF', status: 'total' },
    { title: '平均宿舍评比得分', value: avg, color: '#67C23A', suffix: '分', status: 'avg' },
    { title: '最高宿舍评比得分', value: max, color: '#E6A23C', suffix: '分', status: 'max' },
    { title: '最低宿舍评比得分', value: min, color: '#F56C6C', suffix: '分', status: 'min' },
    { title: '文明宿舍数量', value: civilized, color: '#909399', status: 'civilized' },
    { title: '普通宿舍数量', value: normal, color: '#909399', status: 'normal' },
  ];
});

// 柱状图数据（宿舍得分排名）
const barData = computed(() => {
  return {
    xData: rankData.value.map(item => item.dormNum),
    seriesData: [{ name: '评比得分', data: rankData.value.map(item => item.score) }],
  };
});

// 同比环比分析卡片
const compareCards = computed(() => {
  const yoy = props.detailObj.yoyGrowth;
  const qoq = props.detailObj.qoqGrowth;
  return [
    { label: '同比增长率', value: yoy !== undefined && yoy !== null ? yoy : '-', suffix: '%', color: '#67C23A' },
    { label: '环比增长率', value: qoq !== undefined && qoq !== null ? qoq : '-', suffix: '%', color: '#409EFF' },
  ];
});

// 明细表格列（宿舍得分排名）
const detailColumns = [
  { prop: 'dormNum', label: '宿舍号', minWidth: 120 },
  { prop: 'score', label: '评比得分', minWidth: 100 },
  { prop: 'rank', label: '排名', minWidth: 80 },
];

// ---------- 数据加载 ----------
async function loadFullDetail() {
  const { timeScale, statStartTime, statEndTime } = props.detailObj;
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
    const [chartRes, rankRes] = await Promise.allSettled([
      getDormCompareReportChart(params),
      getDormCompareReportScoreRank(params),
    ]);

    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('看板接口失败', chartRes.reason);
      chartData.value = {};
    }

    if (rankRes.status === 'fulfilled') {
      rankData.value = rankRes.value;
    } else {
      console.warn('得分排名接口失败', rankRes.reason);
      rankData.value = [];
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
  { deep: true, immediate: true }
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
          <el-col :span="8"><span class="info-label">报表时间尺度：</span>{{ detailObj.timeScale || '-' }}</el-col>
          <el-col :span="8"><span class="info-label">统计开始时间：</span>{{ formatTimestamp(detailObj.statStartTime) }}</el-col>
          <el-col :span="8"><span class="info-label">统计结束时间：</span>{{ formatTimestamp(detailObj.statEndTime) }}</el-col>
          <el-col :span="8"><span class="info-label">统计完成时间：</span>{{ formatTimestamp(detailObj.statFinishTime) }}</el-col>
          <el-col :span="8"><span class="info-label">报表类型：</span>{{ detailObj.reportType || '-' }}</el-col>
          <el-col :span="8"><span class="info-label">生成人：</span>{{ detailObj.creator || '-' }}</el-col>
        </el-row>
      </el-card>

      <!-- 图表/数据切换区 -->
      <el-tabs v-model="activeTab" class="data-tabs" type="border-card">
        <!-- 全维度统计 -->
        <el-tab-pane label="全维度统计" name="dimension">
          <div class="dimension-stats">
            <!-- 指标卡片（6个） -->
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
            <!-- 柱状图：宿舍得分排名 -->
            <Bar
              v-if="barData.xData.length"
              title="宿舍得分排名"
              :x-data="barData.xData"
              :series-data="barData.seriesData"
              y-name="评比得分"
              style="height: 400px; margin-top: 20px;"
            />
            <el-empty v-else description="暂无排名数据"/>
          </div>
        </el-tab-pane>

        <!-- 同比环比分析 -->
        <el-tab-pane label="同比环比分析" name="compare">
          <div class="compare-analysis">
            <div class="card-group">
              <el-card v-for="card in compareCards" :key="card.label" class="compare-card" shadow="hover">
                <div class="compare-label">{{ card.label }}</div>
                <div class="compare-value">{{ card.value !== '-' ? card.value : '-' }}<span class="suffix">{{ card.suffix }}</span></div>
              </el-card>
            </div>
            <el-empty description="同比环比数据" />
          </div>
        </el-tab-pane>

        <!-- 明细数据 -->
        <el-tab-pane label="明细数据" name="detail">
          <div class="detail-table-wrapper">
            <el-table :data="rankData" border stripe style="width: 100%">
              <el-table-column
                v-for="col in detailColumns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :min-width="col.minWidth"
                align="center"
              />
            </el-table>
            <el-empty v-if="!rankData.length" description="暂无明细数据"/>
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
