<!-- 文件: EscapeDetail.vue -->
<template>
  <div class="escape-detail" v-if="detail">
    <!-- 基本信息 -->
    <el-descriptions title="逃费基本信息" :column="2" border>
      <el-descriptions-item label="逃费ID">
        {{ detail.escapeId }}
      </el-descriptions-item>
      <el-descriptions-item label="车牌号码">
        {{ detail.carNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="行政区域">
        {{ detail.regionName }}
      </el-descriptions-item>
      <el-descriptions-item label="车场名称">
        {{ detail.parkingName }}
      </el-descriptions-item>
      <el-descriptions-item label="逃费时间">
        {{ formatDateTime(detail.escapeTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="逃费金额">
        {{ formatCurrency(detail.escapeAmount) }}
      </el-descriptions-item>
      <el-descriptions-item label="逃费等级">
        <span :style="{ color: getEscapeLevelColor(detail.escapeLevel) }">
          {{ detail.escapeLevel }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="追缴状态">
        <span :style="{ color: getTraceStatusColor(detail.traceStatus) }">
          {{ detail.traceStatus }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="上次追缴时间">
        {{ formatDateTime(detail.lastTraceTime) || '暂无' }}
      </el-descriptions-item>
      <el-descriptions-item label="车辆类型">
        {{ detail.vehicleType || '小型车' }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 车辆通行记录 -->
    <div class="detail-section" v-if="vehicleRecords && vehicleRecords.length > 0">
      <h4>车辆通行记录</h4>
      <el-table :data="vehicleRecords" size="small" border>
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="action" label="操作" width="80" />
        <el-table-column prop="plateNumber" label="车牌" width="120" />
        <el-table-column prop="parkingName" label="车场" width="180" />
        <el-table-column prop="operator" label="识别方式" width="100" />
        <el-table-column prop="lane" label="车道" width="80" />
      </el-table>
    </div>

    <!-- 追缴历史 -->
    <div class="detail-section" v-if="traceHistory && traceHistory.length > 0">
      <h4>追缴历史</h4>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in traceHistory"
          :key="index"
          :timestamp="formatDateTime(item.time)"
          placement="top"
        >
          <el-card>
            <h4>{{ item.action }}</h4>
            <p><strong>操作人:</strong> {{ item.operator }}</p>
            <p><strong>结果:</strong> {{ item.result }}</p>
            <p><strong>联系方式:</strong> {{ item.contact || '无' }}</p>
            <p><strong>备注:</strong> {{ item.remark || '无' }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 车主信息 -->
    <div class="detail-section" v-if="ownerInfo">
      <h4>车主信息</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="车主姓名">
          {{ ownerInfo.name || '未登记' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ ownerInfo.phone || '未登记' }}
        </el-descriptions-item>
        <el-descriptions-item label="车牌号码">
          {{ ownerInfo.plateNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="车辆类型">
          {{ ownerInfo.vehicleType }}
        </el-descriptions-item>
        <el-descriptions-item label="注册日期">
          {{ ownerInfo.registrationDate }}
        </el-descriptions-item>
        <el-descriptions-item label="信用评分">
          {{ ownerInfo.creditScore }}分
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 空状态 -->
    <div v-else class="detail-empty">
      <el-empty description="暂无逃费数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getEscapeDetail } from '#/api/reports/park/escapeDataApi';
import { formatCurrency } from '#/views/report/park/component/ReportUtils';

const props = defineProps({
  escapeId: {
    type: String,
    required: true
  }
});

const detail = ref(null);
const vehicleRecords = ref([]);
const traceHistory = ref([]);
const ownerInfo = ref(null);

// 监听escapeId变化
watch(() => props.escapeId, async (newId) => {
  if (newId) {
    await loadDetail(newId);
  }
}, { immediate: true });

// 加载详情
const loadDetail = async (escapeId) => {
  try {
    const result = await getEscapeDetail(escapeId);
    detail.value = result.detail;
    vehicleRecords.value = result.vehicleRecords || [];
    traceHistory.value = result.traceHistory || [];
    ownerInfo.value = result.ownerInfo || null;
  } catch (error) {
    console.error('加载逃费详情失败:', error);
  }
};

// 工具函数
const formatDateTime = (datetime) => {
  if (!datetime) return '';
  return datetime.replace(' ', '  ');
};

const getEscapeLevelColor = (level) => {
  const colors = {
    '一级逃费': '#f5222d',
    '二级逃费': '#fa8c16',
    '三级逃费': '#1890ff',
    '四级逃费': '#52c41a'
  };
  return colors[level] || '#8c8c8c';
};

const getTraceStatusColor = (status) => {
  const colors = {
    '待追缴': '#f5222d',
    '追缴中': '#fa8c16',
    '已追缴': '#52c41a',
    '追缴失败': '#8c8c8c',
    '已豁免': '#722ed1'
  };
  return colors[status] || '#8c8c8c';
};
</script>

<style scoped>
.escape-detail {
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
