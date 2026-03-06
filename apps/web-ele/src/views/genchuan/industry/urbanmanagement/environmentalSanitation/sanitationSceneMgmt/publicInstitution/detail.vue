<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.toiletName || '机构';
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
      <div class="detail-section">🏢 机构基础信息</div>
      <div class="detail-row"><span class="label">机构名称：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">机构类型：</span>{{ detailObj.institutionType || '-' }}</div>
      <div class="detail-row"><span class="label">机构地址：</span>{{ detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.manager || '-' }}</div>
      <div class="detail-row"><span class="label">运营状态：</span>{{ detailObj.status || '-' }}</div>
      <div class="detail-row"><span class="label">保洁达标率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">问题办结率：</span>{{ detailObj.problemRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">垃圾清运量：</span>{{ detailObj.wasteVolume ?? '-' }}kg</div>
      <div class="detail-row"><span class="label">核查通过率：</span>{{ detailObj.inspectionPassRate ?? '-' }}%</div>

      <!-- 动态显示各状态特有信息 -->
      <template v-if="detailObj.status === '保洁待执行'">
        <div class="detail-section">🧹 保洁计划信息</div>
        <div class="detail-row"><span class="label">保洁标准：</span>{{ detailObj.cleaningStandard || '-' }}</div>
        <div class="detail-row"><span class="label">保洁频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
        <div class="detail-row"><span class="label">保洁时段：</span>{{ detailObj.cleaningTime || '-' }}</div>
        <div class="detail-row"><span class="label">保洁内容：</span>{{ detailObj.cleaningContent || '-' }}</div>
        <div class="detail-row"><span class="label">保洁人员：</span>{{ detailObj.cleaner || '-' }}</div>
        <div class="detail-row"><span class="label">责任区域：</span>{{ detailObj.responsibilityArea || '-' }}</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
        <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
        <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
        <div class="detail-row"><span class="label">是否生效：</span>{{ detailObj.isEffective ? '是' : '否' }}</div>
      </template>

      <template v-else-if="detailObj.status === '问题待处置'">
        <div class="detail-section">⚠️ 问题信息</div>
        <div class="detail-row"><span class="label">问题编号：</span>{{ detailObj.complaintId || '-' }}</div>
        <div class="detail-row"><span class="label">问题类型：</span>{{ detailObj.complaintType || '-' }}</div>
        <div class="detail-row"><span class="label">问题位置：</span>{{ detailObj.problemLocation || '-' }}</div>
        <div class="detail-row"><span class="label">问题描述：</span>{{ detailObj.complaintContent || '-' }}</div>
        <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.complaintName || '-' }}</div>
        <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.complaintTime || '-' }}</div>
        <div class="detail-row"><span class="label">联系电话：</span>{{ detailObj.phone || '-' }}</div>
        <div class="detail-row"><span class="label">派单状态：</span>{{ detailObj.dispatchStatus || '-' }}</div>
        <div class="detail-row"><span class="label">责任人：</span>{{ detailObj.handler || '-' }}</div>
        <div class="detail-row"><span class="label">超时提醒：</span>{{ detailObj.isTimeout ? '是' : '否' }}</div>
      </template>

      <template v-else-if="detailObj.status === '核查待验收'">
        <div class="detail-section">🔍 核查信息</div>
        <div class="detail-row"><span class="label">核查编号：</span>{{ detailObj.repairId || '-' }}</div>
        <div class="detail-row"><span class="label">关联任务：</span>{{ detailObj.taskId || '-' }}</div>
        <div class="detail-row"><span class="label">任务类型：</span>{{ detailObj.facilityType || '-' }}</div>
        <div class="detail-row"><span class="label">任务描述：</span>{{ detailObj.damageDesc || '-' }}</div>
        <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.reportBy || '-' }}</div>
        <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.reportTime || '-' }}</div>
        <div class="detail-row"><span class="label">上报结果：</span>{{ detailObj.reportResult || '-' }}</div>
        <div class="detail-row"><span class="label">现场照片：</span>
          <a v-if="detailObj.photoUrl" :href="detailObj.photoUrl" target="_blank">查看</a>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">核查人员：</span>{{ detailObj.repairBy || '-' }}</div>
        <div class="detail-row"><span class="label">核查状态：</span>{{ detailObj.repairStatus || '-' }}</div>
        <div class="detail-row"><span class="label">预计完成时间：</span>{{ detailObj.expectedCompleteTime || '-' }}</div>
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
        <div class="detail-row"><span class="label">任务耗时：</span>{{ detailObj.handleDuration || '-' }}</div>
        <div class="detail-row"><span class="label">保洁达标率：</span>{{ detailObj.cleaningQualifiedRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">问题办结率：</span>{{ detailObj.problemCompleteRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">核查通过率：</span>{{ detailObj.inspectionPassRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">统计周期：</span>{{ detailObj.statPeriod || '-' }}</div>
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
