<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '商业街';
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

// 判断是否为接口数据（通过是否存在 name 字段）
const isApiData = computed(() => detailObj.value.name !== undefined);
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（兼容两种数据源） -->
      <div class="detail-section">🏢 商业街基础信息</div>
      <div class="detail-row"><span class="label">商业街名称：</span>{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">商业街地址：</span>{{ detailObj.address || detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.areaName || detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">保洁频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
      <div class="detail-row"><span class="label">垃圾清运间隔：</span>{{ detailObj.transferInterval || '-' }}</div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.managerName || detailObj.manager || '-' }}</div>
      <div class="detail-row"><span class="label">运营状态：</span>{{ detailObj.operationStatusName || detailObj.status || '-' }}</div>

      <!-- 接口数据特有字段 -->
      <template v-if="isApiData">
        <div class="detail-row"><span class="label">保洁覆盖率：</span>{{ detailObj.cleaningCoverage ?? '-' }}%</div>
        <div class="detail-row"><span class="label">设施完好率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">问题平均处置时长：</span>{{ detailObj.disposalDuration ?? '-' }}小时</div>
        <div class="detail-row"><span class="label">收运完成率：</span>{{ detailObj.collectionCompleteRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">巡回保洁间隔：</span>{{ detailObj.patrolInterval || '-' }}</div>
        <div class="detail-row"><span class="label">保洁时段：</span>{{ detailObj.cleaningTime || '-' }}</div>

        <!-- 保洁人员：优先显示映射后的标签，降级显示后端返回的名称或ID -->
        <div class="detail-row"><span class="label">保洁人员：</span>
          <span v-if="detailObj.cleanerLabels && detailObj.cleanerLabels.length">{{ detailObj.cleanerLabels.join('、') }}</span>
          <span v-else-if="detailObj.cleanersName && detailObj.cleanersName.length">{{ detailObj.cleanersName.join('、') }}</span>
          <span v-else-if="detailObj.cleanerIds && detailObj.cleanerIds.length">{{ detailObj.cleanerIds.join(', ') }}</span>
          <span v-else>-</span>
        </div>

        <div class="detail-row"><span class="label">责任区域：</span>{{ detailObj.responsibilityArea || '-' }}</div>
        <div class="detail-row"><span class="label">垃圾收集点位数量：</span>{{ detailObj.collectionPoints ?? '-' }}</div>
        <div class="detail-row"><span class="label">异常记录数：</span>{{ detailObj.abnormalCount ?? '-' }}</div>

        <!-- 设施类型：优先显示映射后的标签 -->
        <div class="detail-row"><span class="label">设施类型：</span>
          <span v-if="detailObj.facilityLabels && detailObj.facilityLabels.length">{{ detailObj.facilityLabels.join('、') }}</span>
          <span v-else-if="detailObj.facilitysName && detailObj.facilitysName.length">{{ detailObj.facilitysName.join('、') }}</span>
          <span v-else-if="detailObj.facilityIds && detailObj.facilityIds.length">{{ detailObj.facilityIds.join(', ') }}</span>
          <span v-else>-</span>
        </div>

        <div class="detail-row"><span class="label">设施位置：</span>{{ detailObj.facilityLocation || '-' }}</div>
        <div class="detail-row"><span class="label">损坏描述：</span>{{ detailObj.damageDesc || '-' }}</div>
        <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.reportName || detailObj.reportBy || '-' }}</div>
        <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.reportTime ? new Date(detailObj.reportTime).toLocaleString() : '-' }}</div>
        <div class="detail-row"><span class="label">上报照片：</span>
          <span v-if="detailObj.problemPhotoUrl">
            <a v-for="(url, idx) in JSON.parse(detailObj.problemPhotoUrl)" :key="idx" :href="url" target="_blank">照片{{ idx+1 }}</a>
          </span>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">处置责任人：</span>{{ detailObj.handleName || detailObj.handleBy || '-' }}</div>
        <div class="detail-row"><span class="label">派单时间：</span>{{ detailObj.dispatchTime ? new Date(detailObj.dispatchTime).toLocaleString() : '-' }}</div>
        <div class="detail-row"><span class="label">维护状态：</span>{{ detailObj.maintainStatusName || '-' }}</div>
        <div class="detail-row"><span class="label">预计完成时间：</span>{{ detailObj.expectedCompleteTime ? new Date(detailObj.expectedCompleteTime).toLocaleString() : '-' }}</div>
        <div class="detail-row"><span class="label">问题类型：</span>{{ detailObj.problemTypeName || '-' }}</div>
        <div class="detail-row"><span class="label">问题位置：</span>{{ detailObj.problemLocation || '-' }}</div>
        <div class="detail-row"><span class="label">问题描述：</span>{{ detailObj.problemDesc || '-' }}</div>
        <div class="detail-row"><span class="label">处置状态：</span>{{ detailObj.handleStatusName || '-' }}</div>
        <div class="detail-row"><span class="label">处置结果：</span>{{ detailObj.handleResult || '-' }}</div>
        <div class="detail-row"><span class="label">负责车辆：</span>{{ detailObj.vehicleName || detailObj.vehicleId || '-' }}</div>

        <!-- 负责人员：优先显示映射后的标签 -->
        <div class="detail-row"><span class="label">负责人员：</span>
          <span v-if="detailObj.staffLabels && detailObj.staffLabels.length">{{ detailObj.staffLabels.join('、') }}</span>
          <span v-else-if="detailObj.staffsName && detailObj.staffsName.length">{{ detailObj.staffsName.join('、') }}</span>
          <span v-else-if="detailObj.staffIds && detailObj.staffIds.length">{{ detailObj.staffIds.join(', ') }}</span>
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
          <div class="detail-row"><span class="label">保洁频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
          <div class="detail-row"><span class="label">巡回保洁间隔：</span>{{ detailObj.patrolInterval ? detailObj.patrolInterval + '分钟' : '-' }}</div>
          <div class="detail-row"><span class="label">保洁时段：</span>{{ detailObj.cleaningTime || '-' }}</div>
          <div class="detail-row"><span class="label">保洁人员：</span>{{ detailObj.cleaner || '-' }}</div>
          <div class="detail-row"><span class="label">责任区域：</span>{{ detailObj.responsibilityArea || '-' }}</div>
          <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
          <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
          <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
          <div class="detail-row"><span class="label">是否生效：</span>{{ detailObj.isEffective ? '是' : '否' }}</div>
        </template>

        <!-- 收运待执行 -->
        <template v-else-if="detailObj.status === '收运待执行'">
          <div class="detail-section">🚛 收运计划信息</div>
          <div class="detail-row"><span class="label">垃圾收集点位：</span>{{ detailObj.collectionPoints ?? '-' }}</div>
          <div class="detail-row"><span class="label">垃圾清运间隔：</span>{{ detailObj.transferInterval ? detailObj.transferInterval + '小时' : '-' }}</div>
          <div class="detail-row"><span class="label">收运时段：</span>{{ detailObj.collectionTime || '-' }}</div>
          <div class="detail-row"><span class="label">负责车辆：</span>{{ detailObj.vehicle || '-' }}</div>
          <div class="detail-row"><span class="label">负责人员：</span>{{ detailObj.staff || '-' }}</div>
          <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatus || '-' }}</div>
          <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
          <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
          <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
          <div class="detail-row"><span class="label">收运完成率：</span>{{ detailObj.collectionCompleteRate ?? '-' }}%</div>
          <div class="detail-row"><span class="label">异常记录数：</span>{{ detailObj.abnormalCount ?? '-' }}</div>
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
        </template>

        <!-- 问题待处置 -->
        <template v-else-if="detailObj.status === '问题待处置'">
          <div class="detail-section">⚠️ 问题处置信息</div>
          <div class="detail-row"><span class="label">问题编号：</span>{{ detailObj.complaintId || '-' }}</div>
          <div class="detail-row"><span class="label">问题类型：</span>{{ detailObj.complaintType || '-' }}</div>
          <div class="detail-row"><span class="label">问题位置：</span>{{ detailObj.problemLocation || '-' }}</div>
          <div class="detail-row"><span class="label">问题描述：</span>{{ detailObj.complaintContent || '-' }}</div>
          <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.complaintName || '-' }}</div>
          <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.complaintTime || '-' }}</div>
          <div class="detail-row"><span class="label">联系电话：</span>{{ detailObj.phone || '-' }}</div>
          <div class="detail-row"><span class="label">现场照片：</span>
            <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
            <span v-else>-</span>
          </div>
          <div class="detail-row"><span class="label">处置责任人：</span>{{ detailObj.handler || '-' }}</div>
          <div class="detail-row"><span class="label">派单时间：</span>{{ detailObj.dispatchTime || '-' }}</div>
          <div class="detail-row"><span class="label">处置状态：</span>{{ detailObj.handleStatus || '-' }}</div>
          <div class="detail-row"><span class="label">处置时长：</span>{{ detailObj.disposalDuration ? detailObj.disposalDuration + '分钟' : '-' }}</div>
          <div class="detail-row"><span class="label">处置结果：</span>{{ detailObj.handleResult || '-' }}</div>
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
          <div class="detail-row"><span class="label">保洁覆盖率：</span>{{ detailObj.cleaningCoverage ?? '-' }}%</div>
          <div class="detail-row"><span class="label">设施完好率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>
          <div class="detail-row"><span class="label">收运完成率：</span>{{ detailObj.collectionCompleteRate ?? '-' }}%</div>
          <div class="detail-row"><span class="label">统计周期：</span>{{ detailObj.statPeriod || '-' }}</div>
          <div class="detail-row"><span class="label">综合管理评分：</span>{{ detailObj.manageScore ?? '-' }}</div>
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
