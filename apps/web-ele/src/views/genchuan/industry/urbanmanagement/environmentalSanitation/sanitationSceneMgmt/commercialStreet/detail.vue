<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.toiletName || '商业街';
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
      <div class="detail-section">🏢 商业街基础信息</div>
      <div class="detail-row"><span class="label">商业街名称：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">商业街地址：</span>{{ detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">保洁频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
      <div class="detail-row"><span class="label">垃圾清运间隔：</span>{{ detailObj.transferInterval ? detailObj.transferInterval + '小时' : '-' }}</div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.manager || '-' }}</div>
      <div class="detail-row"><span class="label">运营状态：</span>{{ detailObj.status || '-' }}</div>
      <div class="detail-row"><span class="label">保洁覆盖率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">设施完好率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">问题平均处置时长：</span>{{ detailObj.disposalDuration ? detailObj.disposalDuration + '分钟' : '-' }}</div>
      <div class="detail-row"><span class="label">收运完成率：</span>{{ detailObj.collectionCompleteRate ?? '-' }}%</div>

      <!-- 动态显示各状态特有信息 -->
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
