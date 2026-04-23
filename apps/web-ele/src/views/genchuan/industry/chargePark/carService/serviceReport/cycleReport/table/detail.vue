<template>
  <DetailDrawer :title="`周期报表详情 (ID: ${detailData?.id || ''})`">
    <div v-if="detailData" class="detail-container">
      <!-- 卡片式信息区 -->
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">报表周期：</div>
          <div class="detail-row-right">{{ detailData.reportCycle || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">统计时段：</div>
          <div class="detail-row-right">{{ detailData.statTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">救援完成率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.rescueCompleteRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预约成功率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.reserveSuccessRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">投诉处理率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.complaintHandleRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">寻车定位成功率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.findCarSuccessRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">空位推送成功率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.spacePushSuccessRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">生效话术数：</div>
          <div class="detail-row-right">{{ detailData.effectiveWordingCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">救援总量：</div>
          <div class="detail-row-right">{{ detailData.rescueTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预约总量：</div>
          <div class="detail-row-right">{{ detailData.reserveTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">投诉总量：</div>
          <div class="detail-row-right">{{ detailData.complaintTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">空位推送总量：</div>
          <div class="detail-row-right">{{ detailData.spacePushTotal ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">生成状态：</div>
          <div class="detail-row-right">{{ detailData.generateStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">报表生成时间：</div>
          <div class="detail-row-right">{{ formatTimestamp(detailData.generateTime) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">操作人：</div>
          <div class="detail-row-right">{{ detailData.operator || '-' }}</div>
        </div>

        <!-- 指标卡片区域：同比增长率、环比增长率、服务状态占比（样式与chart.vue中的stat-card一致） -->
        <div class="indicator-cards">
          <!-- 同比增长率卡片 -->
          <div class="indicator-card" :style="{ borderLeftColor: getGrowthColor(detailData.yearOnYearGrowthRate) }">
            <div class="card-header">
              <span class="card-title">同比增长率</span>
              <div class="card-indicator" :style="{ backgroundColor: getGrowthColor(detailData.yearOnYearGrowthRate) }"></div>
            </div>
            <div class="card-body">
              <div class="card-value" :style="{ color: getGrowthColor(detailData.yearOnYearGrowthRate) }">
                {{ formatPercent(detailData.yearOnYearGrowthRate) }}
              </div>
            </div>
          </div>

          <!-- 环比增长率卡片 -->
          <div class="indicator-card" :style="{ borderLeftColor: getGrowthColor(detailData.monthOnMonthGrowthRate) }">
            <div class="card-header">
              <span class="card-title">环比增长率</span>
              <div class="card-indicator" :style="{ backgroundColor: getGrowthColor(detailData.monthOnMonthGrowthRate) }"></div>
            </div>
            <div class="card-body">
              <div class="card-value" :style="{ color: getGrowthColor(detailData.monthOnMonthGrowthRate) }">
                {{ formatPercent(detailData.monthOnMonthGrowthRate) }}
              </div>
            </div>
          </div>

          <!-- 服务状态占比卡片（包含进度条） -->
          <div class="indicator-card" style="border-left-color: #409EFF">
            <div class="card-header">
              <span class="card-title">服务状态占比</span>
              <div class="card-indicator" style="background-color: #409EFF"></div>
            </div>
            <div class="card-body status-ratio-body">
              <div class="status-ratio-content">
                <div v-if="detailData.serviceStatusRatio" class="status-ratio-bars">
                  <div v-for="item in parseStatusRatio(detailData.serviceStatusRatio)" :key="item.name" class="ratio-bar-item">
                    <span class="ratio-label">{{ item.name }}</span>
                    <el-progress :percentage="item.value" :stroke-width="8" :show-text="false" />
                    <span class="ratio-percent">{{ item.value }}%</span>
                  </div>
                </div>
                <span v-else class="card-value">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 各维度明细折叠面板 -->
      <el-collapse v-model="activeCollapse" class="detail-collapse">
        <el-collapse-item title="救援明细" name="rescue">
          <el-table :data="detailData.detailData?.rescueDetail || []" size="small" border>
            <el-table-column prop="userId" label="用户ID" />
            <el-table-column prop="rescueType" label="救援类型" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="createTime" label="发起时间" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="预约明细" name="reserve">
          <el-table :data="detailData.detailData?.reserveDetail || []" size="small" border>
            <el-table-column prop="userId" label="用户ID" />
            <el-table-column prop="reserveType" label="预约类型" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="createTime" label="预约时间" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="投诉明细" name="complaint">
          <el-table :data="detailData.detailData?.complaintDetail || []" size="small" border>
            <el-table-column prop="userId" label="用户ID" />
            <el-table-column prop="complaintType" label="投诉类型" />
            <el-table-column prop="status" label="处理状态" />
            <el-table-column prop="createTime" label="投诉时间" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="寻车明细" name="findCar">
          <el-table :data="detailData.detailData?.findCarDetail || []" size="small" border>
            <el-table-column prop="userId" label="用户ID" />
            <el-table-column prop="plateNo" label="车牌号" />
            <el-table-column prop="locationResult" label="定位结果" />
            <el-table-column prop="createTime" label="查询时间" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="空位推送明细" name="spacePush">
          <el-table :data="detailData.detailData?.spacePushDetail || []" size="small" border>
            <el-table-column prop="userId" label="用户ID" />
            <el-table-column prop="stationName" label="场站名称" />
            <el-table-column prop="pushResult" label="推送结果" />
            <el-table-column prop="createTime" label="推送时间" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="话术明细" name="wording">
          <el-table :data="detailData.detailData?.wordingDetail || []" size="small" border>
            <el-table-column prop="name" label="话术名称" />
            <el-table-column prop="type" label="话术类型" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="createTime" label="生效时间" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-empty v-else description="暂无数据" />
  </DetailDrawer>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';

const props = defineProps({
  detailData: { type: Object, default: null },
});
const { detailData } = toRefs(props);

const activeCollapse = ref([]);

const formatPercent = (value) => {
  if (value === undefined || value === null) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  return `${num.toFixed(1)}%`;
};

// 根据增长率正负返回颜色（正：绿色，负：红色，零/无：灰色）
const getGrowthColor = (value) => {
  if (value === undefined || value === null) return '#909399';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (num > 0) return '#67C23A';
  if (num < 0) return '#F56C6C';
  return '#909399';
};

// 解析服务状态占比字符串 "已完成:31%, 处理中:25%, 待认领:31%, 待派发:13%"
const parseStatusRatio = (str) => {
  if (!str) return [];
  const items = str.split(',').map(item => item.trim());
  return items.map(item => {
    const [name, val] = item.split(':');
    const percent = parseFloat(val);
    return { name: name.trim(), value: isNaN(percent) ? 0 : percent };
  });
};

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<style scoped lang="scss">
.detail-container {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.detail-card {
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 0 16px;
}

.detail-card-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

/* 指标卡片区域 - 样式与 chart.vue 中的 stat-card 完全一致 */
.indicator-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.indicator-card {
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #f9fafb;
  transition: all 0.3s;
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
}

.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  flex: 1;
  display: flex;
  align-items: center;
}

.card-value {
  font-size: 22px;
  font-weight: 700;
}

/* 服务状态占比卡片内部布局 */
.status-ratio-body {
  width: 100%;
  padding: 4px 0;
}

.status-ratio-content {
  width: 100%;
}

.status-ratio-bars {
  width: 100%;
}

.ratio-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ratio-label {
  width: 55px;
  font-size: 12px;
  color: #606266;
}

.ratio-percent {
  width: 36px;
  font-size: 12px;
  color: #606266;
  text-align: right;
}

:deep(.el-progress-bar__outer) {
  background-color: #edf2fc;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}

.detail-collapse {
  :deep(.el-collapse-item__header) {
    font-weight: 500;
    background-color: #f5f7fa;
  }
}
</style>
