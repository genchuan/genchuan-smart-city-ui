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
      <div class="detail-card-row">
        <div class="detail-row-left">公园名称：</div>
        <div class="detail-row-right">{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">公园地址：</div>
        <div class="detail-row-right">{{ detailObj.address || detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">运营状态：</div>
        <div class="detail-row-right">{{ detailObj.operationStatusName || detailObj.status || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人：</div>
        <div class="detail-row-right">{{ detailObj.managerName || detailObj.manager || '-' }}</div>
      </div>

      <!-- 接口数据特有字段 -->
      <template v-if="isApiData">
        <div class="detail-card-row">
          <div class="detail-row-left">保洁达标率：</div>
          <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">绿化存活率：</div>
          <div class="detail-row-right">{{ detailObj.greenSurvivalRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">设施完好率：</div>
          <div class="detail-row-right">{{ detailObj.facilityRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">环境达标率：</div>
          <div class="detail-row-right">{{ detailObj.environmentRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">清运完成率：</div>
          <div class="detail-row-right">{{ detailObj.wasteTransferCompleteRate ?? '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁频次：</div>
          <div class="detail-row-right">{{ detailObj.cleaningFrequency || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">绿化养护周期：</div>
          <div class="detail-row-right">{{ detailObj.greenMaintenanceCycle || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁区域：</div>
          <div class="detail-row-right">{{ detailObj.cleaningArea || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">保洁标准：</div>
          <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
        </div>

        <!-- 负责人员：优先显示转换后的 staffLabels -->
        <div class="detail-card-row">
          <div class="detail-row-left">负责人员：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.staffLabels && detailObj.staffLabels.length">{{ detailObj.staffLabels.join('、') }}</span>
            <span v-else-if="detailObj.staffsName && detailObj.staffsName.length">{{ detailObj.staffsName.join('、') }}</span>
            <span v-else-if="detailObj.staffIds && detailObj.staffIds.length">{{ detailObj.staffIds.join(', ') }}</span>
            <span v-else>-</span>
          </div>
        </div>

        <!-- 绿化品类：优先显示转换后的 greenTypeLabels -->
        <div class="detail-card-row">
          <div class="detail-row-left">绿化品类：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.greenTypeLabels && detailObj.greenTypeLabels.length">{{ detailObj.greenTypeLabels.join('、') }}</span>
            <span v-else-if="detailObj.greenTypesName && detailObj.greenTypesName.length">{{ detailObj.greenTypesName.join('、') }}</span>
            <span v-else-if="detailObj.greenTypeIds && detailObj.greenTypeIds.length">{{ detailObj.greenTypeIds.join(', ') }}</span>
            <span v-else>-</span>
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">养护区域：</div>
          <div class="detail-row-right">{{ detailObj.greenArea || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">养护内容：</div>
          <div class="detail-row-right">{{ detailObj.greenMaintenanceContent || '-' }}</div>
        </div>

        <!-- 养护人员：优先显示转换后的 greenStaffLabels -->
        <div class="detail-card-row">
          <div class="detail-row-left">养护人员：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.greenStaffLabels && detailObj.greenStaffLabels.length">{{ detailObj.greenStaffLabels.join('、') }}</span>
            <span v-else-if="detailObj.greenStaffsName && detailObj.greenStaffsName.length">{{ detailObj.greenStaffsName.join('、') }}</span>
            <span v-else-if="detailObj.greenStaffIds && detailObj.greenStaffIds.length">{{ detailObj.greenStaffIds.join(', ') }}</span>
            <span v-else>-</span>
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">垃圾收集点位：</div>
          <div class="detail-row-right">{{ detailObj.wasteCollectionPoints ?? '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">清运频次：</div>
          <div class="detail-row-right">{{ detailObj.wasteTransferFrequency || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">清运时段：</div>
          <div class="detail-row-right">{{ detailObj.wasteTransferTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">负责车辆：</div>
          <div class="detail-row-right">{{ detailObj.vehicleName || detailObj.vehicleId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">垃圾清运量：</div>
          <div class="detail-row-right">{{ detailObj.wasteVolume ?? '-' }}吨</div>
        </div>

        <!-- 设施类型：优先显示转换后的 facilityLabels -->
        <div class="detail-card-row">
          <div class="detail-row-left">设施类型：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.facilityLabels && detailObj.facilityLabels.length">{{ detailObj.facilityLabels.join('、') }}</span>
            <span v-else-if="detailObj.facilitysName && detailObj.facilitysName.length">{{ detailObj.facilitysName.join('、') }}</span>
            <span v-else-if="detailObj.facilityIds && detailObj.facilityIds.length">{{ detailObj.facilityIds.join(', ') }}</span>
            <span v-else>-</span>
          </div>
        </div>

        <div class="detail-card-row">
          <div class="detail-row-left">设施位置：</div>
          <div class="detail-row-right">{{ detailObj.facilityLocation || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">损坏描述：</div>
          <div class="detail-row-right">{{ detailObj.facilityDamageDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报人员：</div>
          <div class="detail-row-right">{{ detailObj.reportName || detailObj.reportBy || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报时间：</div>
          <div class="detail-row-right">{{ detailObj.reportTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报照片：</div>
          <div class="detail-row-right">
            <span v-if="detailObj.facilityPhotoUrl">
              <a v-for="(url, idx) in (Array.isArray(detailObj.facilityPhotoUrl) ? detailObj.facilityPhotoUrl : parseJSON(detailObj.facilityPhotoUrl))" :key="idx" :href="url" target="_blank">照片{{ idx+1 }} </a>
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">计划状态：</div>
          <div class="detail-row-right">{{ detailObj.planStatusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">任务类型：</div>
          <div class="detail-row-right">{{ detailObj.taskTypeName || '-' }}</div>
        </div>
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 保洁待执行 -->
        <template v-if="detailObj.status === '保洁待执行'">
          <div class="detail-section">🧹 保洁计划信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁区域：</div>
            <div class="detail-row-right">{{ detailObj.cleaningArea || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁频次：</div>
            <div class="detail-row-right">{{ detailObj.cleaningFrequency || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁时段：</div>
            <div class="detail-row-right">{{ detailObj.cleaningTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">保洁标准：</div>
            <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.staff || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划状态：</div>
            <div class="detail-row-right">{{ detailObj.planStatus || '-' }}</div>
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
            <div class="detail-row-left">计划完成率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningPlanCompleteRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">考勤全勤率：</div>
            <div class="detail-row-right">{{ detailObj.attendanceRate ?? '-' }}%</div>
          </div>
        </template>

        <!-- 绿化待养护 -->
        <template v-else-if="detailObj.status === '绿化待养护'">
          <div class="detail-section">🌳 绿化养护信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">养护编号：</div>
            <div class="detail-row-right">{{ detailObj.repairId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">绿化品类：</div>
            <div class="detail-row-right">{{ detailObj.facilityType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">养护区域：</div>
            <div class="detail-row-right">{{ detailObj.greenArea || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">养护周期：</div>
            <div class="detail-row-right">{{ detailObj.greenMaintenanceCycle ? detailObj.greenMaintenanceCycle + '天' : '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">养护内容：</div>
            <div class="detail-row-right">{{ detailObj.maintenanceContent || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.greenStaff || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划状态：</div>
            <div class="detail-row-right">{{ detailObj.planStatus || '-' }}</div>
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
            <div class="detail-row-left">养护执行时间：</div>
            <div class="detail-row-right">{{ detailObj.greenExecuteTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">绿化存活率：</div>
            <div class="detail-row-right">{{ detailObj.greenSurvivalRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">病虫害处置记录：</div>
            <div class="detail-row-right">{{ detailObj.pestHandleRecord || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">养护完成率：</div>
            <div class="detail-row-right">{{ detailObj.greenMaintenanceCompleteRate ?? '-' }}%</div>
          </div>
        </template>

        <!-- 设施待维护 -->
        <template v-else-if="detailObj.status === '设施待维护'">
          <div class="detail-section">🔧 设施维护信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护编号：</div>
            <div class="detail-row-right">{{ detailObj.repairId || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">设施类型：</div>
            <div class="detail-row-right">{{ detailObj.facilityType || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">设施位置：</div>
            <div class="detail-row-right">{{ detailObj.facilityLocation || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">损坏描述：</div>
            <div class="detail-row-right">{{ detailObj.damageDesc || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上报人员：</div>
            <div class="detail-row-right">{{ detailObj.reportBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上报时间：</div>
            <div class="detail-row-right">{{ detailObj.reportTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">上报照片：</div>
            <div class="detail-row-right">
              <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
              <span v-else>-</span>
            </div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护责任人：</div>
            <div class="detail-row-right">{{ detailObj.repairBy || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">派单时间：</div>
            <div class="detail-row-right">{{ detailObj.dispatchTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护状态：</div>
            <div class="detail-row-right">{{ detailObj.repairStatus || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">预计完成时间：</div>
            <div class="detail-row-right">{{ detailObj.expectedCompleteTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">设施完好率：</div>
            <div class="detail-row-right">{{ detailObj.facilityRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">维护结果：</div>
            <div class="detail-row-right">{{ detailObj.maintainResult || '-' }}</div>
          </div>
        </template>

        <!-- 清运待执行 -->
        <template v-else-if="detailObj.status === '清运待执行'">
          <div class="detail-section">🚛 垃圾清运信息</div>
          <div class="detail-card-row">
            <div class="detail-row-left">垃圾收集点位：</div>
            <div class="detail-row-right">{{ detailObj.wasteCollectionPoints ?? '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">清运频次：</div>
            <div class="detail-row-right">{{ detailObj.wasteTransferFrequency || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">清运时段：</div>
            <div class="detail-row-right">{{ detailObj.wasteTransferTime || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责车辆：</div>
            <div class="detail-row-right">{{ detailObj.vehicle || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">负责人员：</div>
            <div class="detail-row-right">{{ detailObj.staff || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">计划状态：</div>
            <div class="detail-row-right">{{ detailObj.planStatus || '-' }}</div>
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
            <div class="detail-row-left">清运完成率：</div>
            <div class="detail-row-right">{{ detailObj.wasteTransferCompleteRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">垃圾清运量：</div>
            <div class="detail-row-right">{{ detailObj.wasteVolume ?? '-' }}吨</div>
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
            <div class="detail-row-left">保洁达标率：</div>
            <div class="detail-row-right">{{ detailObj.cleaningRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">绿化存活率：</div>
            <div class="detail-row-right">{{ detailObj.greenSurvivalRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">设施完好率：</div>
            <div class="detail-row-right">{{ detailObj.facilityRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">环境达标率：</div>
            <div class="detail-row-right">{{ detailObj.environmentRate ?? '-' }}%</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">统计周期：</div>
            <div class="detail-row-right">{{ detailObj.statPeriod || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">垃圾清运总量：</div>
            <div class="detail-row-right">{{ detailObj.totalWasteVolume ?? '-' }}吨</div>
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
