<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.toiletName || '公园';
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
      <!-- 基础信息 -->
      <div class="detail-section">🏞️ 公园基础信息</div>
      <div class="detail-row"><span class="label">公园名称：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">公园地址：</span>{{ detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">开放时段：</span>{{ detailObj.openHours || '-' }}</div>
      <div class="detail-row"><span class="label">设施数量：</span>{{ detailObj.stallCount ?? '-' }}</div>
      <div class="detail-row"><span class="label">运营状态：</span>{{ detailObj.status || '-' }}</div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.manager || '-' }}</div>
      <div class="detail-row"><span class="label">保洁达标率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">绿化存活率：</span>{{ detailObj.greenSurvivalRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">设施完好率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">环境达标率：</span>{{ detailObj.environmentRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">清运完成率：</span>{{ detailObj.wasteTransferCompleteRate ?? '-' }}%</div>

      <!-- 动态显示各状态特有信息 -->
      <template v-if="detailObj.status === '保洁待执行'">
        <div class="detail-section">🧹 保洁计划信息</div>
        <div class="detail-row"><span class="label">保洁区域：</span>{{ detailObj.cleaningArea || '-' }}</div>
        <div class="detail-row"><span class="label">保洁频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
        <div class="detail-row"><span class="label">保洁时段：</span>{{ detailObj.cleaningTime || '-' }}</div>
        <div class="detail-row"><span class="label">保洁标准：</span>{{ detailObj.cleaningStandard || '-' }}</div>
        <div class="detail-row"><span class="label">负责人员：</span>{{ detailObj.staff || '-' }}</div>
        <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatus || '-' }}</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
        <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
        <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
        <div class="detail-row"><span class="label">计划完成率：</span>{{ detailObj.cleaningPlanCompleteRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">考勤全勤率：</span>{{ detailObj.attendanceRate ?? '-' }}%</div>
      </template>

      <template v-else-if="detailObj.status === '绿化待养护'">
        <div class="detail-section">🌳 绿化养护信息</div>
        <div class="detail-row"><span class="label">养护编号：</span>{{ detailObj.repairId || '-' }}</div>
        <div class="detail-row"><span class="label">绿化品类：</span>{{ detailObj.facilityType || '-' }}</div>
        <div class="detail-row"><span class="label">养护区域：</span>{{ detailObj.greenArea || '-' }}</div>
        <div class="detail-row"><span class="label">养护周期：</span>{{ detailObj.greenMaintenanceCycle ? detailObj.greenMaintenanceCycle + '天' : '-' }}</div>
        <div class="detail-row"><span class="label">养护内容：</span>{{ detailObj.maintenanceContent || '-' }}</div>
        <div class="detail-row"><span class="label">负责人员：</span>{{ detailObj.greenStaff || '-' }}</div>
        <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatus || '-' }}</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
        <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
        <div class="detail-row"><span class="label">养护执行时间：</span>{{ detailObj.greenExecuteTime || '-' }}</div>
        <div class="detail-row"><span class="label">绿化存活率：</span>{{ detailObj.greenSurvivalRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">病虫害处置记录：</span>{{ detailObj.pestHandleRecord || '-' }}</div>
        <div class="detail-row"><span class="label">养护完成率：</span>{{ detailObj.greenMaintenanceCompleteRate ?? '-' }}%</div>
      </template>

      <template v-else-if="detailObj.status === '设施待维护'">
        <div class="detail-section">🔧 设施维护信息</div>
        <div class="detail-row"><span class="label">维护编号：</span>{{ detailObj.repairId || '-' }}</div>
        <div class="detail-row"><span class="label">设施类型：</span>{{ detailObj.facilityType || '-' }}</div>
        <div class="detail-row"><span class="label">设施位置：</span>{{ detailObj.facilityLocation || '-' }}</div>
        <div class="detail-row"><span class="label">损坏描述：</span>{{ detailObj.damageDesc || '-' }}</div>
        <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.reportBy || '-' }}</div>
        <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.reportTime || '-' }}</div>
        <div class="detail-row"><span class="label">上报照片：</span>
          <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">维护责任人：</span>{{ detailObj.repairBy || '-' }}</div>
        <div class="detail-row"><span class="label">派单时间：</span>{{ detailObj.dispatchTime || '-' }}</div>
        <div class="detail-row"><span class="label">维护状态：</span>{{ detailObj.repairStatus || '-' }}</div>
        <div class="detail-row"><span class="label">预计完成时间：</span>{{ detailObj.expectedCompleteTime || '-' }}</div>
        <div class="detail-row"><span class="label">设施完好率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">维护结果：</span>{{ detailObj.maintainResult || '-' }}</div>
      </template>

      <template v-else-if="detailObj.status === '清运待执行'">
        <div class="detail-section">🚛 垃圾清运信息</div>
        <div class="detail-row"><span class="label">垃圾收集点位：</span>{{ detailObj.wasteCollectionPoints ?? '-' }}</div>
        <div class="detail-row"><span class="label">清运频次：</span>{{ detailObj.wasteTransferFrequency || '-' }}</div>
        <div class="detail-row"><span class="label">清运时段：</span>{{ detailObj.wasteTransferTime || '-' }}</div>
        <div class="detail-row"><span class="label">负责车辆：</span>{{ detailObj.vehicle || '-' }}</div>
        <div class="detail-row"><span class="label">负责人员：</span>{{ detailObj.staff || '-' }}</div>
        <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatus || '-' }}</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
        <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
        <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
        <div class="detail-row"><span class="label">清运完成率：</span>{{ detailObj.wasteTransferCompleteRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">垃圾清运量：</span>{{ detailObj.wasteVolume ?? '-' }}吨</div>
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
        <div class="detail-row"><span class="label">保洁达标率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">绿化存活率：</span>{{ detailObj.greenSurvivalRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">设施完好率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">环境达标率：</span>{{ detailObj.environmentRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">统计周期：</span>{{ detailObj.statPeriod || '-' }}</div>
        <div class="detail-row"><span class="label">垃圾清运总量：</span>{{ detailObj.totalWasteVolume ?? '-' }}吨</div>
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
  }
}
</style>
