<template>
  <DetailDrawer :title="`报表详情 - ${reportName}`" width="950px">
    <div class="detail-container" v-loading="loading">
      <!-- 基础信息卡片（网格布局） -->
      <div class="detail-card info-card">
        <div class="card-header">
          <span class="card-title">基础信息</span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">报表ID</div>
            <div class="info-value">{{ detail.id || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">报表编号</div>
            <div class="info-value">{{ detail.reportCode || '-' }}</div>
          </div>
          <div class="info-item full-width">
            <div class="info-label">报表名称</div>
            <div class="info-value">{{ detail.reportName || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">报表类型</div>
            <div class="info-value">{{ reportTypeMap[detail.reportType] || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">时间尺度</div>
            <div class="info-value">{{ timeScaleMap[detail.timeScale] || '-' }}</div>
          </div>
          <div class="info-item full-width">
            <div class="info-label">统计周期</div>
            <div class="info-value">{{ formatStatPeriod(detail.startTime, detail.endTime) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">生成时间</div>
            <div class="info-value">{{ formatTimestamp(detail.createTime) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">流程状态</div>
            <div class="info-value">
              <el-tag :type="reportStatusTagType(detail.reportStatus)" size="small">
                {{ reportStatusMap[detail.reportStatus] || '-' }}
              </el-tag>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">操作人</div>
            <div class="info-value">{{ detail.createUser || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- 统计数据卡片（指标卡片） -->
      <div class="detail-card" v-if="statistics">
        <div class="card-header">
          <span class="card-title">核心指标</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-title">订单总量</div>
            <div class="metric-value">{{ statistics.totalOrderCount || 0 }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">交易金额</div>
            <div class="metric-value">
              ¥{{ statistics.totalTradeAmount ? (statistics.totalTradeAmount / 100).toFixed(2) : '0.00' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-title">充电总量</div>
            <div class="metric-value">{{ statistics.totalChargeAmount || 0 }} kWh</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">退款次数</div>
            <div class="metric-value">{{ statistics.refundCount || 0 }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">异常订单数</div>
            <div class="metric-value">{{ statistics.abnormalOrderCount || 0 }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">异常订单率</div>
            <div class="metric-value">{{ statistics.abnormalRate || '0%' }}</div>
          </div>
        </div>
      </div>

      <!-- 支付方式占比卡片 -->
      <div class="detail-card" v-if="paymentDistribution.length">
        <div class="card-header">
          <span class="card-title">支付方式占比</span>
        </div>
        <div class="pie-wrapper">
          <div ref="pieChartRef" style="height: 320px; width: 100%"></div>
        </div>
      </div>

      <!-- 场站收益排名卡片 -->
      <div class="detail-card" v-if="stationRanking.length">
        <div class="card-header">
          <span class="card-title">场站收益排名</span>
        </div>
        <el-table :data="stationRanking" border stripe size="small" style="width: 100%">
          <el-table-column prop="stationName" label="场站名称" />
          <el-table-column prop="income" label="收益金额" sortable>
            <template #default="{ row }">
              ¥{{ row.income?.toFixed(2) || row.income }}
            </template>
          </el-table-column>
          <el-table-column prop="orderCount" label="订单数" sortable />
        </el-table>
      </div>

      <!-- 同比环比分析卡片 -->
      <div class="detail-card" v-if="comparison">
        <div class="card-header">
          <span class="card-title">同比环比分析</span>
        </div>
        <div class="comparison-grid">
          <div class="comp-item">
            <span class="comp-label">订单量环比</span>
            <span class="comp-value" :class="getTrendClass(comparison.orderCountMom)">{{ comparison.orderCountMom || '-' }}</span>
          </div>
          <div class="comp-item">
            <span class="comp-label">订单量同比</span>
            <span class="comp-value" :class="getTrendClass(comparison.orderCountYoy)">{{ comparison.orderCountYoy || '-' }}</span>
          </div>
          <div class="comp-item">
            <span class="comp-label">交易额环比</span>
            <span class="comp-value" :class="getTrendClass(comparison.tradeAmountMom)">{{ comparison.tradeAmountMom || '-' }}</span>
          </div>
          <div class="comp-item">
            <span class="comp-label">交易额同比</span>
            <span class="comp-value" :class="getTrendClass(comparison.tradeAmountYoy)">{{ comparison.tradeAmountYoy || '-' }}</span>
          </div>
          <div class="comp-item">
            <span class="comp-label">异常订单率环比</span>
            <span class="comp-value" :class="getTrendClass(comparison.abnormalRateMom, true)">{{ comparison.abnormalRateMom || '-' }}</span>
          </div>
          <div class="comp-item">
            <span class="comp-label">异常订单率同比</span>
            <span class="comp-value" :class="getTrendClass(comparison.abnormalRateYoy, true)">{{ comparison.abnormalRateYoy || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';
import { getReportDetail } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderReport/index.js';
import { reportTypeMap, timeScaleMap, reportStatusMap, reportStatusTagType, formatStatPeriod, formatTimestamp } from './data.js';

const detail = ref({});
const statistics = ref(null);
const paymentDistribution = ref([]);
const stationRanking = ref([]);
const comparison = ref(null);
const reportName = ref('');
const loading = ref(false);
const pieChartRef = ref(null);
let pieChartInstance = null;

// 判断趋势正负，返回样式类
const getTrendClass = (value, reverse = false) => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  if (num > 0) return reverse ? 'trend-down' : 'trend-up';
  if (num < 0) return reverse ? 'trend-up' : 'trend-down';
  return '';
};

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel: () => detailDrawerApi.close(),
});

const open = async (id) => {
  detailDrawerApi.open();
  loading.value = true;
  try {
    const res = await getReportDetail(id);
    detail.value = res;
    reportName.value = res.reportName;
    statistics.value = res.statistics;
    paymentDistribution.value = res.paymentDistribution || [];
    stationRanking.value = res.stationRanking || [];
    comparison.value = res.comparison;
    await nextTick();
    initPieChart();
  } catch (error) {
    console.error('获取详情失败', error);
  } finally {
    loading.value = false;
  }
};

const initPieChart = () => {
  if (!pieChartRef.value || !paymentDistribution.value.length) return;
  if (!pieChartInstance) {
    pieChartInstance = echarts.init(pieChartRef.value);
  }
  const total = paymentDistribution.value.reduce((sum, item) => sum + item.amount, 0);
  pieChartInstance.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {d}% ({c})' },
    legend: { orient: 'vertical', left: 'left', data: paymentDistribution.value.map(item => item.payType) },
    series: [{
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: paymentDistribution.value.map(item => ({ name: item.payType, value: item.amount })),
      label: { show: true, formatter: '{b}: {d}%', position: 'outside' },
      emphasis: { scale: true },
    }],
  });
  pieChartInstance.resize();
};

// 监听抽屉关闭时销毁图表实例（可选）
watch(() => detailDrawerApi.isOpen, (open) => {
  if (!open && pieChartInstance) {
    pieChartInstance.dispose();
    pieChartInstance = null;
  }
});

defineExpose({ open });
</script>

<style scoped lang="scss">
.detail-container {
  padding: 20px;
  max-height: 75vh;
  overflow-y: auto;
  background: #f0f2f6;
}

.detail-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  padding: 20px 24px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    margin-bottom: 20px;
    border-left: 4px solid #4A90E2;
    padding-left: 12px;

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      letter-spacing: 0.3px;
    }
  }
}

/* 基础信息网格布局 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px 24px;
}
.info-item {
  display: flex;
  align-items: baseline;
  &.full-width {
    grid-column: 1 / -1;
  }
  .info-label {
    width: 90px;
    flex-shrink: 0;
    font-size: 14px;
    color: #5b6e8c;
    font-weight: 500;
  }
  .info-value {
    flex: 1;
    font-size: 14px;
    color: #1e293b;
    word-break: break-all;
  }
}

/* 指标卡片网格 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
.metric-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .metric-title {
    font-size: 13px;
    color: #5b6e8c;
    margin-bottom: 8px;
  }
  .metric-value {
    font-size: 26px;
    font-weight: 700;
    color: #1e293b;
  }
}

/* 同比环比网格 */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.comp-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .comp-label {
    font-size: 13px;
    color: #5b6e8c;
  }
  .comp-value {
    font-size: 16px;
    font-weight: 600;
    &.trend-up { color: #10b981; }
    &.trend-down { color: #ef4444; }
  }
}

/* 饼图容器 */
.pie-wrapper {
  width: 100%;
  min-height: 320px;
}

/* 滚动条 */
.detail-container::-webkit-scrollbar {
  width: 6px;
}
.detail-container::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 4px;
}
.detail-container::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}
.detail-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
