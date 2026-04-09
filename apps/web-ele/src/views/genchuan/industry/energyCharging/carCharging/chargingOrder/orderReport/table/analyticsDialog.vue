<template>
  <el-dialog v-model="visible" title="同比环比分析" width="850px" class="analytics-dialog">
    <div v-loading="loading" class="analytics-container">
      <!-- 同比环比指标卡片网格 -->
      <div class="metrics-section">
        <div class="section-title">核心指标对比</div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">订单量环比</div>
            <div class="metric-value" :class="getTrendClass(data.orderCountMom)">
              {{ data.orderCountMom || '-' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">订单量同比</div>
            <div class="metric-value" :class="getTrendClass(data.orderCountYoy)">
              {{ data.orderCountYoy || '-' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">交易额环比</div>
            <div class="metric-value" :class="getTrendClass(data.tradeAmountMom)">
              {{ data.tradeAmountMom || '-' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">交易额同比</div>
            <div class="metric-value" :class="getTrendClass(data.tradeAmountYoy)">
              {{ data.tradeAmountYoy || '-' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">异常订单率环比</div>
            <div class="metric-value" :class="getTrendClass(data.abnormalRateMom, true)">
              {{ data.abnormalRateMom || '-' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">异常订单率同比</div>
            <div class="metric-value" :class="getTrendClass(data.abnormalRateYoy, true)">
              {{ data.abnormalRateYoy || '-' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">退款率环比</div>
            <div class="metric-value" :class="getTrendClass(data.refundRateMom, true)">
              {{ data.refundRateMom || '-' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">退款率同比</div>
            <div class="metric-value" :class="getTrendClass(data.refundRateYoy, true)">
              {{ data.refundRateYoy || '-' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势对比图表 -->
      <div v-if="trendData.length" class="trend-section">
        <div class="section-title">趋势对比</div>
        <div ref="trendChartRef" class="trend-chart"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import * as echarts from 'echarts';
import { getReportDetail } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderReport/index.js';

const visible = ref(false);
const loading = ref(false);
const data = ref({});
const trendData = ref([]);
const trendChartRef = ref(null);
let trendChartInstance = null;

// 判断数值正负，返回样式类（reverse 用于异常率/退款率，上升为负面）
const getTrendClass = (value, reverse = false) => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  if (num > 0) return reverse ? 'trend-down' : 'trend-up';
  if (num < 0) return reverse ? 'trend-up' : 'trend-down';
  return '';
};

const open = async (id) => {
  visible.value = true;
  loading.value = true;
  try {
    const res = await getReportDetail(id);
    data.value = res.comparison || {};
    trendData.value = res.trendData || [];
    await nextTick();
    if (trendChartRef.value && trendData.value.length) {
      if (!trendChartInstance) {
        trendChartInstance = echarts.init(trendChartRef.value);
      }
      const xAxisData = trendData.value.map(item => item.period);
      const currentData = trendData.value.map(item => item.current);
      const previousData = trendData.value.map(item => item.previous);
      trendChartInstance.setOption({
        backgroundColor: 'transparent',
        title: {
          text: '订单量趋势对比',
          left: 'center',
          top: 0,
          textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
        },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['当前周期', '上周期'], bottom: 0, left: 'center', icon: 'circle' },
        grid: { left: '8%', right: '5%', top: '15%', bottom: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: { color: '#9AA8B7', fontSize: 12, rotate: xAxisData.length > 5 ? 15 : 0 },
          axisLine: { lineStyle: { color: '#E8F4FD' } },
        },
        yAxis: {
          type: 'value',
          name: '订单量',
          nameTextStyle: { color: '#9AA8B7', fontSize: 12 },
          axisLabel: { color: '#9AA8B7' },
          splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
        },
        series: [
          {
            name: '当前周期',
            type: 'line',
            data: currentData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 3, color: '#4A90E2' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
                { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
              ]),
            },
            itemStyle: { color: '#4A90E2' },
            emphasis: { focus: 'series' },
          },
          {
            name: '上周期',
            type: 'line',
            data: previousData,
            smooth: true,
            symbol: 'diamond',
            symbolSize: 8,
            lineStyle: { width: 2, color: '#F5A623', type: 'dashed' },
            areaStyle: { opacity: 0 },
            itemStyle: { color: '#F5A623' },
            emphasis: { focus: 'series' },
          },
        ],
      });
      trendChartInstance.resize();
    }
  } catch (error) {
    console.error('获取分析数据失败', error);
  } finally {
    loading.value = false;
  }
};

// 监听弹窗关闭，销毁图表实例释放内存
watch(visible, (newVal) => {
  if (!newVal && trendChartInstance) {
    trendChartInstance.dispose();
    trendChartInstance = null;
  }
});

defineExpose({ open });
</script>

<style scoped lang="scss">
.analytics-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
  }
  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #eef2f6;
  }
  :deep(.el-dialog__title) {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.analytics-container {
  padding: 20px 24px 24px;
  background: #ffffff;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 4px solid #4A90E2;
}

.metrics-section {
  margin-bottom: 24px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 700px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .metric-label {
    font-size: 13px;
    color: #5b6e8c;
    margin-bottom: 8px;
    white-space: nowrap;
  }
  .metric-value {
    font-size: 20px;
    font-weight: 700;
    &.trend-up {
      color: #10b981;
      &::before {
        content: "▲ ";
        font-size: 14px;
      }
    }
    &.trend-down {
      color: #ef4444;
      &::before {
        content: "▼ ";
        font-size: 14px;
      }
    }
  }
}

.trend-section {
  margin-top: 8px;
}

.trend-chart {
  height: 340px;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  margin-top: 8px;
}
</style>
