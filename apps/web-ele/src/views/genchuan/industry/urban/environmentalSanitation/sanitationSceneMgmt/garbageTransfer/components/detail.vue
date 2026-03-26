<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

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

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});

// 环境数据字段中文映射
const envLabelMap = {
  odor_value: '臭气浓度',
  noise_value: '噪声值(dB)',
  sewage_standard: '污水标准',
  temperature: '温度(℃)',
  humidity: '湿度(%)',
  odor: '臭气浓度', // 模拟数据中可能用 odor
  // 可根据实际补充更多映射
};

// 格式化环境数据，返回 { label, value } 数组
const formattedEnvData = computed(() => {
  const obj = detailObj.value;
  if (!obj) return [];

  // 优先使用已解析的 environmentDataObj（接口数据）
  if (obj.environmentDataObj && typeof obj.environmentDataObj === 'object') {
    return Object.entries(obj.environmentDataObj).map(([key, value]) => ({
      label: envLabelMap[key] || key, // 若无映射则显示原键名
      value: value !== null && value !== undefined ? value : '-',
    }));
  }

  // 如果是字符串（模拟数据或未解析的接口数据），尝试解析
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
      // 解析失败，返回原始字符串
      return [{label: '环境数据', value: obj.environmentData}];
    }
  }

  // 如果是对象（可能模拟数据中直接是对象）
  if (obj.environmentData && typeof obj.environmentData === 'object') {
    return Object.entries(obj.environmentData).map(([key, value]) => ({
      label: envLabelMap[key] || key,
      value: value !== null && value !== undefined ? value : '-',
    }));
  }

  return [];
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（兼容接口数据和模拟数据） -->
      <div class="detail-section">🏭 转运站基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">转运站名称：</div>
        <div class="detail-row-right">{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">转运站位置：</div>
        <div class="detail-row-right">{{ detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">运营状态：</div>
        <div class="detail-row-right">{{
            detailObj.operationStatusName || detailObj.status || '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人：</div>
        <div class="detail-row-right">{{ detailObj.managerName || detailObj.manager || '-' }}</div>
      </div>

      <!-- 接口特有字段 -->
      <template v-if="detailObj.name !== undefined">
        <div class="detail-card-row">
          <div class="detail-row-left">日转运量：</div>
          <div class="detail-row-right">{{ detailObj.dailyTransferVolume ?? '-' }}吨</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">设备正常运行率：</div>
          <div class="detail-row-right">{{ detailObj.equipmentRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">环境达标率：</div>
          <div class="detail-row-right">{{ detailObj.environmentRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警未处理数：</div>
          <div class="detail-row-right">{{ detailObj.unhandledAlarmCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">设备待维护数：</div>
          <div class="detail-row-right">{{ detailObj.pendingMaintenanceCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">核心设备：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.equipmentsName && detailObj.equipmentsName.length">
              {{ detailObj.equipmentsName.join('、') }}
            </span>
            <span v-else>-</span>
          </div>
        </div>

        <!-- 环境数据显示为中文键值对 -->
        <div class="detail-card-row" v-if="formattedEnvData.length > 0">
          <div class="detail-row-left">环境数据：</div>
          <div class="detail-row-right env-data">
            <div v-for="(item, index) in formattedEnvData" :key="index">
              {{ item.label }}: {{ item.value }}
            </div>
          </div>
        </div>
        <div class="detail-card-row" v-else>
          <div class="detail-row-left">环境数据：</div>
          <div class="detail-row-right">-</div>
        </div>
      </template>

      <!-- 模拟数据特有字段（车辆待进站等） -->
      <template v-else>
        <!-- 车辆待进站 -->
        <template v-if="detailObj.status === '车辆待进站'">
          <div class="detail-section">🚛 车辆预约信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">预约编号：</div>
            <div class="detail-row-right">{{ detailObj.reserveId || '-' }}</div>
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
            <div class="detail-row-left">预计进站时间：</div>
            <div class="detail-row-right">{{ detailObj.expectedTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">垃圾重量：</div>
            <div class="detail-row-right">{{ detailObj.garbageWeight ?? '-' }}吨</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预约状态：</div>
            <div class="detail-row-right">{{ detailObj.reserveStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">排序序号：</div>
            <div class="detail-row-right">{{ detailObj.sortNo ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">创建时间：</div>
            <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处理人员：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
          </div>
        </template>

        <!-- 作业进行中 -->
        <template v-else-if="detailObj.status === '作业进行中'">
          <div class="detail-section">⚙️ 作业进行中信息</div>
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
            <div class="detail-row-right">{{ detailObj.equipmentStatus || '-' }}</div>
          </div>

          <!-- 作业进行中的环境数据（也是 JSON 字符串，同样格式化） -->
          <div class="detail-card-row" v-if="formattedEnvData.length > 0">
            <div class="detail-row-left">实时环境数据：</div>
            <div class="detail-row-right env-data">
              <div v-for="(item, index) in formattedEnvData" :key="index">
                {{ item.label }}: {{ item.value }}
              </div>
            </div>
          </div>
          <div class="detail-card-row" v-else>
            <div class="detail-row-left">实时环境数据：</div>
            <div class="detail-row-right">-</div>
          </div>

          <div class="detail-card-row">
            <div class="detail-row-left">作业进度：</div>
            <div class="detail-row-right">{{ detailObj.progress ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">转运去向：</div>
            <div class="detail-row-right">{{ detailObj.destination || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">异常标记：</div>
            <div class="detail-row-right">{{ detailObj.isAbnormal ? '是' : '否' }}</div>
          </div>
        </template>

        <!-- 预警待处理 -->
        <template v-else-if="detailObj.status === '预警待处理'">
          <div class="detail-section">⚠️ 预警信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">预警编号：</div>
            <div class="detail-row-right">{{ detailObj.alarmId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">关联转运站：</div>
            <div class="detail-row-right">{{ detailObj.transferName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预警类型：</div>
            <div class="detail-row-right">{{ detailObj.alarmType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">发生时间：</div>
            <div class="detail-row-right">{{ detailObj.alarmTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预警内容：</div>
            <div class="detail-row-right">{{ detailObj.alarmContent || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">关联设备/区域：</div>
            <div class="detail-row-right">{{ detailObj.relevantInfo || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置状态：</div>
            <div class="detail-row-right">{{ detailObj.handleStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">责任人：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">超时提醒：</div>
            <div class="detail-row-right">{{ detailObj.isTimeout ? '是' : '否' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置进度：</div>
            <div class="detail-row-right">{{ detailObj.handleProgress ?? '-' }}%</div>
          </div>
        </template>

        <!-- 设备待维护 -->
        <template v-else-if="detailObj.status === '设备待维护'">
          <div class="detail-section">🔧 设备维护信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护编号：</div>
            <div class="detail-row-right">{{ detailObj.maintenanceId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">关联转运站：</div>
            <div class="detail-row-right">{{ detailObj.transferName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">设备名称：</div>
            <div class="detail-row-right">{{ detailObj.equipmentName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护周期：</div>
            <div class="detail-row-right">{{ detailObj.maintenanceCycle || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上次维护时间：</div>
            <div class="detail-row-right">{{ detailObj.lastMaintenanceTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护内容：</div>
            <div class="detail-row-right">{{ detailObj.maintenanceContent || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">责任人：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护状态：</div>
            <div class="detail-row-right">{{ detailObj.maintenanceStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预计完成时间：</div>
            <div class="detail-row-right">{{ detailObj.expectedCompleteTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">超时提醒：</div>
            <div class="detail-row-right">{{ detailObj.isTimeout ? '是' : '否' }}</div>
          </div>
        </template>

        <!-- 已完成 -->
        <template v-else-if="detailObj.status === '已完成'">
          <div class="detail-section">✅ 已完成任务信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">任务类型：</div>
            <div class="detail-row-right">{{ detailObj.taskType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">关联转运站：</div>
            <div class="detail-row-right">{{ detailObj.transferName || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">完成时间：</div>
            <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">处置人员：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
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
</style>
