<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.licensePlate || detailObj.value?.toiletName || '车辆';
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

// 判断是否为接口数据（通过是否存在 licensePlate 字段）
const isApiData = computed(() => detailObj.value.licensePlate !== undefined);
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（兼容两种数据源） -->
      <div class="detail-section">🚛 车辆基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">车辆牌照：</div>
        <div class="detail-row-right">{{ detailObj.licensePlate || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车辆类型：</div>
        <div class="detail-row-right">{{ detailObj.vehicleTypeName || detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属部门：</div>
        <div class="detail-row-right">{{ detailObj.deptName || detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车辆型号：</div>
        <div class="detail-row-right">{{ detailObj.model || detailObj.openHours || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">作业路线：</div>
        <div class="detail-row-right">{{ detailObj.routeName || detailObj.stallCount || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">驾驶员：</div>
        <div class="detail-row-right">{{ detailObj.driverName || detailObj.manager || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车辆状态：</div>
        <div class="detail-row-right">{{ detailObj.vehicleStatusName || detailObj.status || '-' }}</div>
      </div>

      <!-- 接口数据特有字段 -->
      <template v-if="isApiData">
        <div class="detail-card-row">
          <div class="detail-row-left">最近维护时间：</div>
          <div class="detail-row-right">{{ detailObj.lastMaintenanceTime ? new Date(detailObj.lastMaintenanceTime).toLocaleString() : '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">累计作业时长：</div>
          <div class="detail-row-right">{{ detailObj.totalWorkHours ?? '-' }}小时</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">违规告警次数：</div>
          <div class="detail-row-right">{{ detailObj.alarmCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">车辆完好率：</div>
          <div class="detail-row-right">{{ detailObj.intactRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">未完成任务数：</div>
          <div class="detail-row-right">{{ detailObj.unfinishedTaskCount ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">平均作业效率：</div>
          <div class="detail-row-right">{{ detailObj.averageEfficiency ?? '-' }}吨/小时</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">维护周期：</div>
          <div class="detail-row-right">{{ detailObj.maintenanceCycle ?? '-' }}天</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">计划状态：</div>
          <div class="detail-row-right">{{ detailObj.planStatusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">作业状态：</div>
          <div class="detail-row-right">{{ detailObj.workStatusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">违规类型：</div>
          <div class="detail-row-right">{{ detailObj.violationTypeName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">违规状态：</div>
          <div class="detail-row-right">{{ detailObj.violationStatusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">维护类型：</div>
          <div class="detail-row-right">{{ detailObj.maintenanceTypeName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">任务类型：</div>
          <div class="detail-row-right">{{ detailObj.taskTypeName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">车辆照片：</div>
          <div class="detail-row-right">
            <a v-if="detailObj.vehiclePhotoUrl" :href="detailObj.vehiclePhotoUrl" target="_blank">查看</a>
            <span v-else>-</span>
          </div>
        </div>
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 车辆待作业 -->
        <template v-if="detailObj.status === '车辆待作业'">
          <div class="detail-section">📋 作业计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">作业路线：</div>
            <div class="detail-row-right">{{ detailObj.stallCount || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">路线长度：</div>
            <div class="detail-row-right">{{ detailObj.threshold ?? '-' }}公里</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">作业频次：</div>
            <div class="detail-row-right">{{ detailObj.cleaningFrequency || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">作业时段：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">驾驶员：</div>
            <div class="detail-row-right">{{ detailObj.manager || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划状态：</div>
            <div class="detail-row-right">{{ detailObj.warningStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划完成率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预计作业量：</div>
            <div class="detail-row-right">{{ detailObj.complaintRate ?? '-' }}吨</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">创建人：</div>
            <div class="detail-row-right">{{ detailObj.createBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">创建时间：</div>
            <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">更新时间：</div>
            <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">是否生效：</div>
            <div class="detail-row-right">{{ detailObj.isEffective ? '是' : '否' }}</div>
          </div>
        </template>

        <!-- 作业进行中 -->
        <template v-else-if="detailObj.status === '作业进行中'">
          <div class="detail-section">📍 实时监控信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">作业状态：</div>
            <div class="detail-row-right">{{ detailObj.dispatchStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">当前位置：</div>
            <div class="detail-row-right">{{ detailObj.facilityLocation || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">行驶速度：</div>
            <div class="detail-row-right">{{ detailObj.currentStock ?? '-' }}km/h</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">已作业量：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}吨</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">作业进度：</div>
            <div class="detail-row-right">{{ detailObj.gap || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">启动作业时间：</div>
            <div class="detail-row-right">{{ detailObj.reportTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预计完成时间：</div>
            <div class="detail-row-right">{{ detailObj.expectedCompleteTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">轨迹合规性：</div>
            <div class="detail-row-right">{{ detailObj.warningStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">实时告警数：</div>
            <div class="detail-row-right">{{ detailObj.complaintRate ?? '-' }}</div>
          </div>
        </template>

        <!-- 违规待处理 -->
        <template v-else-if="detailObj.status === '违规待处理'">
          <div class="detail-section">⚠️ 违规信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">违规编号：</div>
            <div class="detail-row-right">{{ detailObj.complaintId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">违规类型：</div>
            <div class="detail-row-right">{{ detailObj.complaintType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">违规时间：</div>
            <div class="detail-row-right">{{ detailObj.complaintTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">违规地点：</div>
            <div class="detail-row-right">{{ detailObj.facilityLocation || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">违规详情：</div>
            <div class="detail-row-right">{{ detailObj.complaintContent || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">驾驶员：</div>
            <div class="detail-row-right">{{ detailObj.manager || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">佐证材料：</div>
            <div class="detail-row-right">
              <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
              <span v-else>-</span>
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">责任部门：</div>
            <div class="detail-row-right">{{ detailObj.area || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">整改责任人：</div>
            <div class="detail-row-right">{{ detailObj.handler || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">派单时间：</div>
            <div class="detail-row-right">{{ detailObj.dispatchTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">整改期限：</div>
            <div class="detail-row-right">{{ detailObj.expectedCompleteTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">整改完成率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">违规状态：</div>
            <div class="detail-row-right">{{ detailObj.handleStatus || '-' }}</div>
          </div>
        </template>

        <!-- 车辆待维护 -->
        <template v-else-if="detailObj.status === '车辆待维护'">
          <div class="detail-section">🔧 维护信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护编号：</div>
            <div class="detail-row-right">{{ detailObj.repairId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护类型：</div>
            <div class="detail-row-right">{{ detailObj.facilityType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护周期：</div>
            <div class="detail-row-right">{{ detailObj.threshold ?? '-' }}天</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上次维护时间：</div>
            <div class="detail-row-right">{{ detailObj.lastSupplyTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">车辆状态：</div>
            <div class="detail-row-right">{{ detailObj.status || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护责任人：</div>
            <div class="detail-row-right">{{ detailObj.repairBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">故障描述：</div>
            <div class="detail-row-right">{{ detailObj.damageDesc || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护提醒时间：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预计维护时长：</div>
            <div class="detail-row-right">{{ detailObj.currentStock ?? '-' }}小时</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护状态：</div>
            <div class="detail-row-right">{{ detailObj.repairStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">设备完好率：</div>
            <div class="detail-row-right">{{ detailObj.warningCount ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护完成率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
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
            <div class="detail-row-left">作业覆盖率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">车辆完好率：</div>
            <div class="detail-row-right">{{ detailObj.warningCount ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">违规整改率：</div>
            <div class="detail-row-right">{{ detailObj.complaintRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">统计周期：</div>
            <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">运营评分：</div>
            <div class="detail-row-right">{{ detailObj.satisfaction ?? '-' }}</div>
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
</style>
