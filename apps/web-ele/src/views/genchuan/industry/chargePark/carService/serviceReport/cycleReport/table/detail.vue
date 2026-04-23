<!-- table/detail.vue -->
<template>
  <DetailDrawer :title="`周期报表详情 (ID: ${detailData?.id || ''})`">
    <div v-if="detailData" class="detail-container">
      <!-- 卡片式信息区（仿纠纷调解样式） -->
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
        <div class="detail-card-row">
          <div class="detail-row-left">同比增长率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.yearOnYearGrowthRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">环比增长率：</div>
          <div class="detail-row-right">{{ formatPercent(detailData.monthOnMonthGrowthRate) }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">服务状态占比：</div>
          <div class="detail-row-right">{{ detailData.serviceStatusRatio || '-' }}</div>
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

// 格式化百分比（保留一位小数，自动处理数字或字符串）
const formatPercent = (value) => {
  if (value === undefined || value === null) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  return `${num.toFixed(1)}%`;
};

// 时间戳格式化（复用工具函数）
const formatTimestampValue = (timestamp) => {
  if (!timestamp) return '-';
  return formatTimestamp(timestamp);
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

.detail-collapse {
  :deep(.el-collapse-item__header) {
    font-weight: 500;
    background-color: #f5f7fa;
  }
}
</style>
