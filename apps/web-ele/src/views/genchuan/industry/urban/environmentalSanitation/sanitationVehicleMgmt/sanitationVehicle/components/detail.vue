<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.toiletName || '车辆';
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
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（所有状态共享） -->
      <div class="detail-section">🚛 车辆基础信息</div>
      <div class="detail-row"><span class="label">车辆牌照：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">车辆类型：</span>{{ detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属部门：</span>{{ detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">车辆型号：</span>{{ detailObj.openHours || '-' }}</div>
      <div class="detail-row"><span class="label">作业路线：</span>{{ detailObj.stallCount || '-' }}</div>
      <div class="detail-row"><span class="label">驾驶员：</span>{{ detailObj.manager || '-' }}</div>
      <div class="detail-row"><span class="label">车辆状态：</span>{{ detailObj.status || '-' }}</div>
      <div class="detail-row"><span class="label">最近维护时间：</span>{{ detailObj.lastSupplyTime || '-' }}</div>
      <div class="detail-row"><span class="label">累计作业时长：</span>{{ detailObj.cleaningRate ?? '-' }}小时</div>
      <div class="detail-row"><span class="label">违规告警次数：</span>{{ detailObj.complaintRate ?? '-' }}</div>
      <div class="detail-row"><span class="label">车辆完好率：</span>{{ detailObj.warningCount ?? '-' }}%</div>
      <div class="detail-row"><span class="label">未完成任务数：</span>{{ detailObj.facilityRate ?? '-' }}</div>
      <div class="detail-row"><span class="label">平均作业效率：</span>{{ detailObj.cleaningFrequency ?? '-' }}吨/小时</div>

      <!-- 动态显示各状态特有信息 -->
      <template v-if="detailObj.status === '车辆待作业'">
        <div class="detail-section">📋 作业计划信息</div>
        <div class="detail-row"><span class="label">作业路线：</span>{{ detailObj.stallCount || '-' }}</div>
        <div class="detail-row"><span class="label">路线长度：</span>{{ detailObj.threshold ?? '-' }}公里</div>
        <div class="detail-row"><span class="label">作业频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
        <div class="detail-row"><span class="label">作业时段：</span>{{ detailObj.cleaningTime || '-' }}</div>
        <div class="detail-row"><span class="label">驾驶员：</span>{{ detailObj.manager || '-' }}</div>
        <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.warningStatus || '-' }}</div>
        <div class="detail-row"><span class="label">计划完成率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">预计作业量：</span>{{ detailObj.complaintRate ?? '-' }}吨</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
        <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
        <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
        <div class="detail-row"><span class="label">是否生效：</span>{{ detailObj.isEffective ? '是' : '否' }}</div>
      </template>

      <template v-else-if="detailObj.status === '作业进行中'">
        <div class="detail-section">📍 实时监控信息</div>
        <div class="detail-row"><span class="label">作业状态：</span>{{ detailObj.dispatchStatus || '-' }}</div>
        <div class="detail-row"><span class="label">当前位置：</span>{{ detailObj.facilityLocation || '-' }}</div>
        <div class="detail-row"><span class="label">行驶速度：</span>{{ detailObj.currentStock ?? '-' }}km/h</div>
        <div class="detail-row"><span class="label">已作业量：</span>{{ detailObj.cleaningRate ?? '-' }}吨</div>
        <div class="detail-row"><span class="label">作业进度：</span>{{ detailObj.gap || '-' }}</div>
        <div class="detail-row"><span class="label">启动作业时间：</span>{{ detailObj.reportTime || '-' }}</div>
        <div class="detail-row"><span class="label">预计完成时间：</span>{{ detailObj.expectedCompleteTime || '-' }}</div>
        <div class="detail-row"><span class="label">轨迹合规性：</span>{{ detailObj.warningStatus || '-' }}</div>
        <div class="detail-row"><span class="label">实时告警数：</span>{{ detailObj.complaintRate ?? '-' }}</div>
      </template>

      <template v-else-if="detailObj.status === '违规待处理'">
        <div class="detail-section">⚠️ 违规信息</div>
        <div class="detail-row"><span class="label">违规编号：</span>{{ detailObj.complaintId || '-' }}</div>
        <div class="detail-row"><span class="label">违规类型：</span>{{ detailObj.complaintType || '-' }}</div>
        <div class="detail-row"><span class="label">违规时间：</span>{{ detailObj.complaintTime || '-' }}</div>
        <div class="detail-row"><span class="label">违规地点：</span>{{ detailObj.facilityLocation || '-' }}</div>
        <div class="detail-row"><span class="label">违规详情：</span>{{ detailObj.complaintContent || '-' }}</div>
        <div class="detail-row"><span class="label">驾驶员：</span>{{ detailObj.manager || '-' }}</div>
        <div class="detail-row"><span class="label">佐证材料：</span>
          <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">责任部门：</span>{{ detailObj.area || '-' }}</div>
        <div class="detail-row"><span class="label">整改责任人：</span>{{ detailObj.handler || '-' }}</div>
        <div class="detail-row"><span class="label">派单时间：</span>{{ detailObj.dispatchTime || '-' }}</div>
        <div class="detail-row"><span class="label">整改期限：</span>{{ detailObj.expectedCompleteTime || '-' }}</div>
        <div class="detail-row"><span class="label">整改完成率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">违规状态：</span>{{ detailObj.handleStatus || '-' }}</div>
      </template>

      <template v-else-if="detailObj.status === '车辆待维护'">
        <div class="detail-section">🔧 维护信息</div>
        <div class="detail-row"><span class="label">维护编号：</span>{{ detailObj.repairId || '-' }}</div>
        <div class="detail-row"><span class="label">维护类型：</span>{{ detailObj.facilityType || '-' }}</div>
        <div class="detail-row"><span class="label">维护周期：</span>{{ detailObj.threshold ?? '-' }}天</div>
        <div class="detail-row"><span class="label">上次维护时间：</span>{{ detailObj.lastSupplyTime || '-' }}</div>
        <div class="detail-row"><span class="label">车辆状态：</span>{{ detailObj.status || '-' }}</div>
        <div class="detail-row"><span class="label">维护责任人：</span>{{ detailObj.repairBy || '-' }}</div>
        <div class="detail-row"><span class="label">故障描述：</span>{{ detailObj.damageDesc || '-' }}</div>
        <div class="detail-row"><span class="label">维护提醒时间：</span>{{ detailObj.cleaningTime || '-' }}</div>
        <div class="detail-row"><span class="label">预计维护时长：</span>{{ detailObj.currentStock ?? '-' }}小时</div>
        <div class="detail-row"><span class="label">维护状态：</span>{{ detailObj.repairStatus || '-' }}</div>
        <div class="detail-row"><span class="label">设备完好率：</span>{{ detailObj.warningCount ?? '-' }}%</div>
        <div class="detail-row"><span class="label">维护完成率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
      </template>

      <template v-else-if="detailObj.status === '已完成'">
        <div class="detail-section">✅ 已完成任务信息</div>
        <div class="detail-row"><span class="label">任务类型：</span>{{ detailObj.taskType || '-' }}</div>
        <div class="detail-row"><span class="label">完成时间：</span>{{ detailObj.completeTime || '-' }}</div>
        <div class="detail-row"><span class="label">处置人员：</span>{{ detailObj.handler || '-' }}</div>
        <div class="detail-row"><span class="label">处置结果：</span>{{ detailObj.handleResult || '-' }}</div>
        <div class="detail-row"><span class="label">佐证材料：</span>
          <a v-if="detailObj.proofUrl" :href="detailObj.proofUrl" target="_blank">查看</a>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">作业覆盖率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">车辆完好率：</span>{{ detailObj.warningCount ?? '-' }}%</div>
        <div class="detail-row"><span class="label">违规整改率：</span>{{ detailObj.complaintRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">统计周期：</span>{{ detailObj.statPeriod || '-' }}</div>
        <div class="detail-row"><span class="label">运营评分：</span>{{ detailObj.satisfaction ?? '-' }}</div>
      </template>

      <!-- 时间信息（通用） -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}
.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  .label {
    width: 130px;
    flex-shrink: 0;
    font-weight: 500;
    color: #606266;
  }
  &:hover {
    background: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    margin-left: -8px;
  }
}
</style>
