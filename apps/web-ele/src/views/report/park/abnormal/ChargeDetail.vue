<!-- 文件: ChargeDetail.vue -->
<template>
  <div class="charge-detail" v-if="detail">
    <!-- 异常信息 -->
    <el-descriptions title="收费异常基本信息" :column="2" border>
      <el-descriptions-item label="异常ID">
        {{ detail.abnormalId }}
      </el-descriptions-item>
      <el-descriptions-item label="订单编号">
        {{ detail.orderNo }}
      </el-descriptions-item>
      <el-descriptions-item label="车牌号码">
        {{ detail.carNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="车场名称">
        {{ detail.parkingName }}
      </el-descriptions-item>
      <el-descriptions-item label="行政区域">
        {{ detail.regionName }}
      </el-descriptions-item>
      <el-descriptions-item label="异常时间">
        {{ formatDateTime(detail.abnormalTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="异常类型">
        <span :style="{ color: getAbnormalTypeColor(detail.abnormalType) }">
          {{ detail.abnormalType }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="异常原因">
        {{ detail.abnormalReason }}
      </el-descriptions-item>
      <el-descriptions-item label="异常金额">
        {{ formatCurrency(detail.abnormalAmount) }}
      </el-descriptions-item>
      <el-descriptions-item label="实际金额">
        {{ formatCurrency(detail.actualAmount) }}
      </el-descriptions-item>
      <el-descriptions-item label="处置状态">
        <span :style="{ color: getDisposalStatusColor(detail.disposalStatus) }">
          {{ detail.disposalStatus }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="处理结果">
        {{ detail.disposalResult || '暂无' }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 订单明细 -->
    <div class="detail-section" v-if="orderDetail">
      <h4>订单明细</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="入场时间">
          {{ orderDetail.enterTime }}
        </el-descriptions-item>
        <el-descriptions-item label="出场时间">
          {{ orderDetail.exitTime }}
        </el-descriptions-item>
        <el-descriptions-item label="停车时长">
          {{ orderDetail.duration }}
        </el-descriptions-item>
        <el-descriptions-item label="基础费用">
          {{ formatCurrency(orderDetail.basicAmount) }}
        </el-descriptions-item>
        <el-descriptions-item label="优惠金额">
          {{ formatCurrency(orderDetail.discountAmount) }}
        </el-descriptions-item>
        <el-descriptions-item label="实付金额">
          {{ formatCurrency(orderDetail.paidAmount) }}
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">
          {{ orderDetail.paymentType }}
        </el-descriptions-item>
        <el-descriptions-item label="支付时间">
          {{ orderDetail.paymentTime }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 纠错记录 -->
    <div class="detail-section" v-if="correctionRecords && correctionRecords.length > 0">
      <h4>纠错记录</h4>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in correctionRecords"
          :key="index"
          :timestamp="formatDateTime(item.time)"
          placement="top"
        >
          <el-card>
            <h4>{{ item.action }}</h4>
            <p><strong>操作人:</strong> {{ item.operator }}</p>
            <p><strong>描述:</strong> {{ item.description }}</p>
            <p><strong>结果:</strong> {{ item.result }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 空状态 -->
    <div v-else class="detail-empty">
      <el-empty description="暂无收费异常数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getChargeAbnormalDetail } from '#/api/reports/park/chargeAbnormalApi';
import { formatCurrency } from '#/views/report/park/component/ReportUtils';

const props = defineProps({
  abnormalId: {
    type: String,
    required: true
  }
});

const detail = ref(null);
const orderDetail = ref(null);
const correctionRecords = ref([]);

// 监听abnormalId变化
watch(() => props.abnormalId, async (newId) => {
  if (newId) {
    await loadDetail(newId);
  }
}, { immediate: true });

// 加载详情
const loadDetail = async (abnormalId) => {
  try {
    const result = await getChargeAbnormalDetail(abnormalId);
    detail.value = result.detail;
    orderDetail.value = result.orderDetail || null;
    correctionRecords.value = result.correctionRecords || [];
  } catch (error) {
    console.error('加载收费异常详情失败:', error);
  }
};

// 工具函数
const formatDateTime = (datetime) => {
  if (!datetime) return '';
  return datetime.replace(' ', '  ');
};

const getAbnormalTypeColor = (abnormalType) => {
  const colors = {
    '多收费': '#f5222d',
    '少收费': '#1890ff',
    '重复收费': '#fa8c16',
    '系统错误': '#722ed1',
    '人工操作错误': '#52c41a',
    '超时计费': '#13c2c2'
  };
  return colors[abnormalType] || '#8c8c8c';
};

const getDisposalStatusColor = (status) => {
  const colors = {
    '待处理': '#f5222d',
    '处理中': '#fa8c16',
    '已处理': '#52c41a',
    '已关闭': '#8c8c8c',
    '已驳回': '#722ed1'
  };
  return colors[status] || '#8c8c8c';
};
</script>

<style scoped>
.charge-detail {
  padding: 20px;
}

.detail-section {
  margin-top: 24px;
}

.detail-section h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}
</style>
