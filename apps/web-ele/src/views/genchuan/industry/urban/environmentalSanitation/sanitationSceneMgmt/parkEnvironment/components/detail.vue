<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '公园';
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

// 辅助函数：解析 JSON 字符串
const parseJSON = (str) => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch {
    return str.split(',').map(s => s.trim());
  }
};

// 判断是否为接口数据（通过是否存在 name 字段）
const isApiData = computed(() => detailObj.value.name !== undefined);
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（兼容两种数据源） -->
      <div class="detail-section">🏞️ 公园基础信息</div>
      <div class="detail-row"><span class="label">公园名称：</span>{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">公园地址：</span>{{ detailObj.address || detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.areaName || detailObj.area || '-' }}</div>
<!--      <div class="detail-row"><span class="label">开放时段：</span>{{ detailObj.openHours || '-' }}</div>-->
<!--      <div class="detail-row"><span class="label">设施数量：</span>{{ detailObj.stallCount ?? '-' }}</div>-->
      <div class="detail-row"><span class="label">运营状态：</span>{{ detailObj.operationStatusName || detailObj.status || '-' }}</div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.managerName || detailObj.manager || '-' }}</div>

      <!-- 接口数据特有字段 -->
      <template v-if="isApiData">
        <div class="detail-row"><span class="label">保洁达标率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">绿化存活率：</span>{{ detailObj.greenSurvivalRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">设施完好率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">环境达标率：</span>{{ detailObj.environmentRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">清运完成率：</span>{{ detailObj.wasteTransferCompleteRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">保洁频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
        <div class="detail-row"><span class="label">绿化养护周期：</span>{{ detailObj.greenMaintenanceCycle || '-' }}</div>
        <div class="detail-row"><span class="label">保洁区域：</span>{{ detailObj.cleaningArea || '-' }}</div>
        <div class="detail-row"><span class="label">保洁标准：</span>{{ detailObj.cleaningStandard || '-' }}</div>

        <!-- 【修改】负责人员：优先显示转换后的 staffLabels -->
        <div class="detail-row"><span class="label">负责人员：</span>
          <span v-if="detailObj.staffLabels && detailObj.staffLabels.length">{{ detailObj.staffLabels.join('、') }}</span>
          <span v-else-if="detailObj.staffsName && detailObj.staffsName.length">{{ detailObj.staffsName.join('、') }}</span>
          <span v-else-if="detailObj.staffIds && detailObj.staffIds.length">{{ detailObj.staffIds.join(', ') }}</span>
          <span v-else>-</span>
        </div>

        <!-- 【修改】绿化品类：优先显示转换后的 greenTypeLabels -->
        <div class="detail-row"><span class="label">绿化品类：</span>
          <span v-if="detailObj.greenTypeLabels && detailObj.greenTypeLabels.length">{{ detailObj.greenTypeLabels.join('、') }}</span>
          <span v-else-if="detailObj.greenTypesName && detailObj.greenTypesName.length">{{ detailObj.greenTypesName.join('、') }}</span>
          <span v-else-if="detailObj.greenTypeIds && detailObj.greenTypeIds.length">{{ detailObj.greenTypeIds.join(', ') }}</span>
          <span v-else>-</span>
        </div>

        <div class="detail-row"><span class="label">养护区域：</span>{{ detailObj.greenArea || '-' }}</div>
        <div class="detail-row"><span class="label">养护内容：</span>{{ detailObj.greenMaintenanceContent || '-' }}</div>

        <!-- 【修改】养护人员：优先显示转换后的 greenStaffLabels -->
        <div class="detail-row"><span class="label">养护人员：</span>
          <span v-if="detailObj.greenStaffLabels && detailObj.greenStaffLabels.length">{{ detailObj.greenStaffLabels.join('、') }}</span>
          <span v-else-if="detailObj.greenStaffsName && detailObj.greenStaffsName.length">{{ detailObj.greenStaffsName.join('、') }}</span>
          <span v-else-if="detailObj.greenStaffIds && detailObj.greenStaffIds.length">{{ detailObj.greenStaffIds.join(', ') }}</span>
          <span v-else>-</span>
        </div>

        <div class="detail-row"><span class="label">垃圾收集点位：</span>{{ detailObj.wasteCollectionPoints ?? '-' }}</div>
        <div class="detail-row"><span class="label">清运频次：</span>{{ detailObj.wasteTransferFrequency || '-' }}</div>
        <div class="detail-row"><span class="label">清运时段：</span>{{ detailObj.wasteTransferTime || '-' }}</div>
        <div class="detail-row"><span class="label">负责车辆：</span>{{ detailObj.vehicleName || detailObj.vehicleId || '-' }}</div>
        <div class="detail-row"><span class="label">垃圾清运量：</span>{{ detailObj.wasteVolume ?? '-' }}吨</div>

        <!-- 【修改】设施类型：优先显示转换后的 facilityLabels -->
        <div class="detail-row"><span class="label">设施类型：</span>
          <span v-if="detailObj.facilityLabels && detailObj.facilityLabels.length">{{ detailObj.facilityLabels.join('、') }}</span>
          <span v-else-if="detailObj.facilitysName && detailObj.facilitysName.length">{{ detailObj.facilitysName.join('、') }}</span>
          <span v-else-if="detailObj.facilityIds && detailObj.facilityIds.length">{{ detailObj.facilityIds.join(', ') }}</span>
          <span v-else>-</span>
        </div>

        <div class="detail-row"><span class="label">设施位置：</span>{{ detailObj.facilityLocation || '-' }}</div>
        <div class="detail-row"><span class="label">损坏描述：</span>{{ detailObj.facilityDamageDesc || '-' }}</div>
        <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.reportName || detailObj.reportBy || '-' }}</div>
        <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.reportTime || '-' }}</div>
        <div class="detail-row"><span class="label">上报照片：</span>
          <span v-if="detailObj.facilityPhotoUrl">
            <a v-for="(url, idx) in (Array.isArray(detailObj.facilityPhotoUrl) ? detailObj.facilityPhotoUrl : parseJSON(detailObj.facilityPhotoUrl))" :key="idx" :href="url" target="_blank">照片{{ idx+1 }} </a>
          </span>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatusName || '-' }}</div>
        <div class="detail-row"><span class="label">任务类型：</span>{{ detailObj.taskTypeName || '-' }}</div>
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 保洁待执行 -->
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

        <!-- 绿化待养护 -->
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

        <!-- 设施待维护 -->
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

        <!-- 清运待执行 -->
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

        <!-- 已完成 -->
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
