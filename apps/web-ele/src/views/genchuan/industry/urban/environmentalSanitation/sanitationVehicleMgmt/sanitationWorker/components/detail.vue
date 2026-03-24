<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.toiletName || '人员';
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
      <div class="detail-section">👤 人员基础信息</div>
      <div class="detail-row"><span class="label">人员姓名：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">岗位类型：</span>{{ detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">入职时间：</span>{{ detailObj.openHours || '-' }}</div>
      <div class="detail-row"><span class="label">累计考勤天数：</span>{{ detailObj.stallCount ?? '-' }}</div>
      <div class="detail-row"><span class="label">人员状态：</span>{{ detailObj.status || '-' }}</div>
      <div class="detail-row"><span class="label">联系方式：</span>{{ detailObj.phone || '-' }}</div>
      <div class="detail-row"><span class="label">平均考核得分：</span>{{ detailObj.cleaningRate ?? '-' }}分</div>
      <div class="detail-row"><span class="label">作业完成率：</span>{{ detailObj.complaintRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">未完成任务数：</span>{{ detailObj.warningCount ?? '-' }}</div>
      <div class="detail-row"><span class="label">全勤率：</span>{{ detailObj.facilityRate ?? '-' }}%</div>

      <!-- 动态显示各状态特有信息 -->
      <template v-if="detailObj.status === '待排班'">
        <div class="detail-section">📅 排班计划信息</div>
        <div class="detail-row"><span class="label">所属班组：</span>{{ detailObj.openHours || '-' }}</div>
        <div class="detail-row"><span class="label">负责区域：</span>{{ detailObj.area || '-' }}</div>
        <div class="detail-row"><span class="label">排班周期：</span>{{ detailObj.stallCount || '-' }}</div>
        <div class="detail-row"><span class="label">作业时段：</span>{{ detailObj.cleaningTime || '-' }}</div>
        <div class="detail-row"><span class="label">排班状态：</span>{{ detailObj.dispatchStatus || '-' }}</div>
        <div class="detail-row"><span class="label">换班申请状态：</span>{{ detailObj.handler || '-' }}</div>
        <div class="detail-row"><span class="label">换班申请数：</span>{{ detailObj.swapApplyCount ?? '-' }}</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
        <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
        <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
        <div class="detail-row"><span class="label">是否生效：</span>{{ detailObj.isEffective ? '是' : '否' }}</div>
      </template>

      <template v-else-if="detailObj.status === '待考勤'">
        <div class="detail-section">⏰ 考勤记录</div>
        <div class="detail-row"><span class="label">所属班组：</span>{{ detailObj.openHours || '-' }}</div>
        <div class="detail-row"><span class="label">打卡日期：</span>{{ detailObj.stallCount || '-' }}</div>
        <div class="detail-row"><span class="label">到岗打卡时间：</span>{{ detailObj.cleaningTime || '-' }}</div>
        <div class="detail-row"><span class="label">离岗打卡时间：</span>{{ detailObj.cleaningContent || '-' }}</div>
        <div class="detail-row"><span class="label">打卡状态：</span>{{ detailObj.cleaner || '-' }}</div>
        <div class="detail-row"><span class="label">打卡位置：</span>{{ detailObj.photoUrl || '-' }}</div>
        <div class="detail-row"><span class="label">考勤时长：</span>{{ detailObj.cleaningRate ?? '-' }}小时</div>
        <div class="detail-row"><span class="label">异常类型：</span>{{ detailObj.repairBy || '-' }}</div>
        <div class="detail-row"><span class="label">异常说明：</span>{{ detailObj.warningCount || '-' }}</div>
        <div class="detail-row"><span class="label">审核状态：</span>{{ detailObj.repairStatus || '-' }}</div>
      </template>

      <template v-else-if="detailObj.status === '考核待审核'">
        <div class="detail-section">📊 考核信息</div>
        <div class="detail-row"><span class="label">所属班组：</span>{{ detailObj.openHours || '-' }}</div>
        <div class="detail-row"><span class="label">负责区域：</span>{{ detailObj.area || '-' }}</div>
        <div class="detail-row"><span class="label">考核周期：</span>{{ detailObj.stallCount || '-' }}</div>
        <div class="detail-row"><span class="label">考勤得分：</span>{{ detailObj.cleaningRate ?? '-' }}</div>
        <div class="detail-row"><span class="label">作业质量得分：</span>{{ detailObj.complaintRate ?? '-' }}</div>
        <div class="detail-row"><span class="label">问题处置得分：</span>{{ detailObj.warningCount ?? '-' }}</div>
        <div class="detail-row"><span class="label">初始总分：</span>{{ detailObj.facilityRate ?? '-' }}</div>
        <div class="detail-row"><span class="label">佐证材料：</span>
          <a v-if="detailObj.proofUrl" :href="detailObj.proofUrl" target="_blank">查看</a>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">考核人员：</span>{{ detailObj.repairBy || '-' }}</div>
        <div class="detail-row"><span class="label">审核时间：</span>{{ detailObj.reportTime || '-' }}</div>
        <div class="detail-row"><span class="label">最终总分：</span>{{ detailObj.repairStatus || '-' }}</div>
        <div class="detail-row"><span class="label">考核等级：</span>{{ detailObj.expectedCompleteTime || '-' }}</div>
        <div class="detail-row"><span class="label">考核意见：</span>{{ detailObj.damageDesc || '-' }}</div>
        <div class="detail-row"><span class="label">班组考核通过率：</span>{{ detailObj.teamPassRate ?? '-' }}%</div>
      </template>

      <template v-else-if="detailObj.status === '已完成'">
        <div class="detail-section">✅ 已完成任务信息</div>
        <div class="detail-row"><span class="label">任务类型：</span>{{ detailObj.taskType || '-' }}</div>
        <div class="detail-row"><span class="label">所属班组：</span>{{ detailObj.openHours || '-' }}</div>
        <div class="detail-row"><span class="label">负责区域：</span>{{ detailObj.area || '-' }}</div>
        <div class="detail-row"><span class="label">完成时间：</span>{{ detailObj.completeTime || '-' }}</div>
        <div class="detail-row"><span class="label">处置人员：</span>{{ detailObj.handler || '-' }}</div>
        <div class="detail-row"><span class="label">处置结果：</span>{{ detailObj.handleResult || '-' }}</div>
        <div class="detail-row"><span class="label">佐证材料：</span>
          <a v-if="detailObj.proofUrl" :href="detailObj.proofUrl" target="_blank">查看</a>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">班组考勤率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">平均考核分：</span>{{ detailObj.complaintRate ?? '-' }}</div>
        <div class="detail-row"><span class="label">优秀人员占比：</span>{{ detailObj.warningCount ?? '-' }}%</div>
        <div class="detail-row"><span class="label">统计周期：</span>{{ detailObj.statPeriod || '-' }}</div>
        <div class="detail-row"><span class="label">综合管理评分：</span>{{ detailObj.satisfaction ?? '-' }}</div>
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
