<!-- 文件: DeviceDetail.vue -->
<template>
  <div class="device-detail" v-if="detail">
    <!-- 故障信息 -->
    <el-descriptions title="故障基本信息" :column="2" border>
      <el-descriptions-item label="故障ID">
        {{ detail.faultId }}
      </el-descriptions-item>
      <el-descriptions-item label="设备编码">
        {{ detail.deviceCode }}
      </el-descriptions-item>
      <el-descriptions-item label="设备类型">
        {{ detail.deviceType }}
      </el-descriptions-item>
      <el-descriptions-item label="区域名称">
        {{ detail.regionName }}
      </el-descriptions-item>
      <el-descriptions-item label="故障时间">
        {{ formatDateTime(detail.faultTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="故障类型">
        <span :style="{ color: getFaultTypeColor(detail.faultType) }">
          {{ detail.faultType }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="故障描述">
        {{ detail.faultDescription }}
      </el-descriptions-item>
      <el-descriptions-item label="处置状态">
        <span :style="{ color: getDisposalStatusColor(detail.disposalStatus) }">
          {{ detail.disposalStatus }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="处置时间">
        {{ formatDateTime(detail.disposalTime) || '暂无' }}
      </el-descriptions-item>
      <el-descriptions-item label="处理人">
        {{ detail.operator || '暂无' }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 设备运行日志 -->
    <div class="detail-section" v-if="deviceLogs && deviceLogs.length > 0">
      <h4>设备运行日志</h4>
      <el-table :data="deviceLogs" size="small" border>
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="event" label="事件" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <span :style="{
              color: row.status === '正常' ? '#52c41a' : '#f5222d',
              fontWeight: row.status === '异常' ? 'bold' : 'normal'
            }">
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </div>

    <!-- 处置流程 -->
    <div class="detail-section" v-if="disposalProcess && disposalProcess.length > 0">
      <h4>处置流程</h4>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in disposalProcess"
          :key="index"
          :timestamp="formatDateTime(item.time)"
          placement="top"
          :color="getTimelineItemColor(item.step)"
        >
          <el-card>
            <h4>{{ item.action }}</h4>
            <p><strong>操作人:</strong> {{ item.operator }}</p>
            <p><strong>结果:</strong> {{ item.result }}</p>
            <p><strong>备注:</strong> {{ item.remark || '无' }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 空状态 -->
    <div v-else class="detail-empty">
      <el-empty description="暂无故障数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getDeviceAbnormalDetail } from '#/api/reports/park/deviceAbnormalApi';

const props = defineProps({
  faultId: {
    type: String,
    required: true
  }
});

const detail = ref(null);
const deviceLogs = ref([]);
const disposalProcess = ref([]);

// 监听faultId变化
watch(() => props.faultId, async (newId) => {
  if (newId) {
    await loadDetail(newId);
  }
}, { immediate: true });

// 加载详情
const loadDetail = async (faultId) => {
  try {
    const result = await getDeviceAbnormalDetail(faultId);
    detail.value = result.detail;
    deviceLogs.value = result.deviceLogs || [];
    disposalProcess.value = result.disposalProcess || [];
  } catch (error) {
    console.error('加载设备异常详情失败:', error);
  }
};

// 工具函数
const formatDateTime = (datetime) => {
  if (!datetime) return '';
  return datetime.replace(' ', '  ');
};

const getFaultTypeColor = (faultType) => {
  const colors = {
    '硬件故障': '#f5222d',
    '软件故障': '#1890ff',
    '网络故障': '#722ed1',
    '电源故障': '#fa8c16',
    '环境故障': '#52c41a',
    '维护故障': '#8c8c8c'
  };
  return colors[faultType] || '#8c8c8c';
};

const getDisposalStatusColor = (status) => {
  const colors = {
    '待处置': '#f5222d',
    '处置中': '#fa8c16',
    '已处理': '#52c41a',
    '处置失败': '#8c8c8c',
    '已关闭': '#722ed1'
  };
  return colors[status] || '#8c8c8c';
};

const getTimelineItemColor = (step) => {
  const colors = {
    1: '#f5222d',
    2: '#fa8c16',
    3: '#1890ff',
    4: '#52c41a'
  };
  return colors[step] || '#8c8c8c';
};
</script>

<style scoped>
.device-detail {
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
