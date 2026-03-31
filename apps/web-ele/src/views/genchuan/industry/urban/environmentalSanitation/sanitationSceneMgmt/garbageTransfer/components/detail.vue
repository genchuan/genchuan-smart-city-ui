<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  alarmList: { type: Array, default: () => [] },
  reserveList: { type: Array, default: () => [] },
  maintenanceList: { type: Array, default: () => [] },
  title: { type: String, default: '' },
});

const { detailObj, title, alarmList, reserveList, maintenanceList } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '转运站';
  return title.value || `${name}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });

// 环境数据字段中文映射
const envLabelMap = {
  odor_value: '臭气浓度',
  noise_value: '噪声值(dB)',
  sewage_standard: '污水标准',
  temperature: '温度(℃)',
  humidity: '湿度(%)',
  odor: '臭气浓度',
};

// 格式化环境数据
const formattedEnvData = computed(() => {
  const obj = detailObj.value;
  if (!obj) return [];

  if (obj.environmentDataObj && typeof obj.environmentDataObj === 'object') {
    return Object.entries(obj.environmentDataObj).map(([key, value]) => ({
      label: envLabelMap[key] || key,
      value: value !== null && value !== undefined ? value : '-',
    }));
  }

  if (obj.environmentData && typeof obj.environmentData === 'string') {
    try {
      const parsed = JSON.parse(obj.environmentData);
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.entries(parsed).map(([key, value]) => ({
          label: envLabelMap[key] || key,
          value: value !== null && value !== undefined ? value : '-',
        }));
      }
    } catch {
      return [{ label: '环境数据', value: obj.environmentData }];
    }
  }

  if (obj.environmentData && typeof obj.environmentData === 'object') {
    return Object.entries(obj.environmentData).map(([key, value]) => ({
      label: envLabelMap[key] || key,
      value: value !== null && value !== undefined ? value : '-',
    }));
  }

  return [];
});

// 获取进度状态（优先使用 progressStatus，兼容旧 status）
const currentProgressStatus = computed(() => detailObj.value?.progressStatus || detailObj.value?.status);
</script>

<template>
  <DetailDrawer :title="drawerTitle" class="genchuan-detail-drawer">
    <div class="detail-card">
      <!-- 车辆待进站 -->
      <template v-if="currentProgressStatus === '车辆待进站'">
        <div class="detail-section">🚛 预约信息列表</div>
        <el-table :data="reserveList" border stripe style="width: 100%">
          <el-table-column prop="reserveId" label="预约编号" min-width="150" />
          <el-table-column prop="vehicleName" label="车辆牌照" min-width="120" />
          <el-table-column prop="garbageTypeName" label="垃圾品类" min-width="120" />
          <el-table-column prop="expectedTime" label="预计进站时间" min-width="180">
            <template #default="{ row }">
              {{ row.expectedTime ? new Date(row.expectedTime).toLocaleString() : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="garbageWeight" label="垃圾重量(吨)" min-width="120" />
          <el-table-column prop="reserveStatus" label="预约状态" min-width="100" />
          <el-table-column prop="sortNo" label="排序序号" min-width="100" />
          <el-table-column prop="handleName" label="处理人员" min-width="120" />
        </el-table>
        <div v-if="!reserveList || reserveList.length === 0" class="empty-tip">
          暂无预约信息
        </div>
      </template>

      <!-- 作业进行中 / 已完成 / 已归档 共用作业信息模板 -->
      <template v-else-if="['作业进行中', '已完成', '已归档'].includes(currentProgressStatus)">
        <div class="detail-section">⚙️ 作业信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">作业状态：</div>
          <div class="detail-row-right">{{ detailObj.operationStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">进站编号：</div>
          <div class="detail-row-right">{{ detailObj.operationId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">车辆牌照：</div>
          <div class="detail-row-right">{{ detailObj.licensePlate || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">垃圾品类：</div>
          <div class="detail-row-right">{{ detailObj.garbageType || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">进站时间：</div>
          <div class="detail-row-right">{{ detailObj.entryTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">垃圾重量：</div>
          <div class="detail-row-right">{{ detailObj.garbageWeight ?? '-' }}吨</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联点位：</div>
          <div class="detail-row-right">{{ detailObj.relatedPoints || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核心设备状态：</div>
          <div class="detail-row-right">
            <div v-if="typeof detailObj.equipmentStatus === 'object'">
              <div v-for="(status, device) in detailObj.equipmentStatus" :key="device">
                {{ device }}： {{ status }}
              </div>
            </div>
            <span v-else>{{ detailObj.equipmentStatus || '-' }}</span>
          </div>
        </div>
        <!-- 环境数据（作业进行中可能包含实时环境数据） -->
        <div class="detail-card-row" v-if="formattedEnvData.length > 0">
          <div class="detail-row-left">实时环境数据：</div>
          <div class="detail-row-right env-data">
            <div v-for="(item, index) in formattedEnvData" :key="index">
              {{ item.label }}: {{ item.value }}
            </div>
          </div>
        </div>
        <div class="detail-card-row" v-else-if="detailObj.environmentData">
          <div class="detail-row-left">实时环境数据：</div>
          <div class="detail-row-right">{{ detailObj.environmentData }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">作业进度：</div>
          <div class="detail-row-right">{{ detailObj.progress ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">转运去向：</div>
          <div class="detail-row-right">{{ detailObj.destination || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">异常标记：</div>
          <div class="detail-row-right">{{ detailObj.isAbnormal ? '是' : '否' }}</div>
        </div>
        <!-- 已完成任务额外信息 -->
        <template v-if="currentProgressStatus === '已完成'">
          <div class="detail-section">✅ 完成任务详情</div>
          <div class="detail-card-row">
            <div class="detail-row-left">任务类型：</div>
            <div class="detail-row-right">{{ detailObj.taskType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">完成时间：</div>
            <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置结果：</div>
            <div class="detail-row-right">{{ detailObj.handleResult || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">佐证材料：</div>
            <div class="detail-row-right">
              <a v-if="detailObj.proofUrl" :href="detailObj.proofUrl" target="_blank">查看</a>
              <span v-else>-</span>
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">任务耗时：</div>
            <div class="detail-row-right">{{ detailObj.handleDuration || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">进站总量：</div>
            <div class="detail-row-right">{{ detailObj.totalEntryVolume ?? '-' }}吨</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">设备完好率：</div>
            <div class="detail-row-right">{{ detailObj.equipmentIntactRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">环境达标率：</div>
            <div class="detail-row-right">{{ detailObj.environmentQualifiedRate ?? '-' }}%</div>
          </div>
        </template>
      </template>

      <!-- 预警待处理 - 展示多条预警列表 -->
      <template v-else-if="currentProgressStatus === '预警待处理'">
        <div class="detail-section">⚠️ 预警信息列表</div>
        <el-table :data="alarmList" border stripe style="width: 100%">
          <el-table-column prop="alarmId" label="预警编号" min-width="150" />
          <el-table-column prop="alarmTypeName" label="预警类型" min-width="120" />
          <el-table-column prop="alarmContent" label="预警内容" min-width="200" />
          <el-table-column prop="alarmTime" label="发生时间" min-width="180">
            <template #default="{ row }">
              {{ row.alarmTime ? new Date(row.alarmTime).toLocaleString() : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="relevantInfo" label="关联设备/区域" min-width="150" />
          <el-table-column prop="handleStatus" label="处置状态" min-width="100" />
          <el-table-column prop="handleName" label="责任人" min-width="120" />
        </el-table>
        <div v-if="!alarmList || alarmList.length === 0" class="empty-tip">
          暂无预警信息
        </div>
      </template>

      <!-- 设备待维护 -->
      <template v-else-if="currentProgressStatus === '设备待维护'">
        <div class="detail-section">🔧 设备信息列表</div>
        <el-table :data="maintenanceList" border stripe style="width: 100%">
          <el-table-column prop="maintenanceId" label="维护编号" min-width="150" />
          <el-table-column prop="equipmentName" label="设备名称" min-width="120" />
          <el-table-column prop="maintenanceContent" label="维护内容" min-width="200" />
          <el-table-column prop="maintenanceStatus" label="维护状态" min-width="100" />
          <el-table-column prop="handleName" label="责任人" min-width="120" />
        </el-table>
        <div v-if="!maintenanceList || maintenanceList.length === 0" class="empty-tip">
          暂无设备维护信息
        </div>
      </template>

      <!-- 时间信息（通用） -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 750px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}

.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 200px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
  color: #6E7E91;

  &:first-child {
    margin-top: 0;
  }
}

.detail-card::-webkit-scrollbar {
  width: 6px;
}

.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

.env-data {
  flex: 1;

  div {
    margin-bottom: 2px;
  }
}

.empty-tip {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}
</style>
