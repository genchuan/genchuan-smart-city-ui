<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || detailObj.value?.toiletName || '城中村';
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
      <div class="detail-section">🏘️ 城中村基础信息</div>
      <div class="detail-row"><span class="label">城中村名称：</span>{{ detailObj.name || detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">城中村地址：</span>{{ detailObj.address || detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.areaName || detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">责任区域数：</span>{{ detailObj.responsibilityAreas ?? detailObj.stallCount ?? '-' }}</div>
      <div class="detail-row"><span class="label">道路保洁频次：</span>{{ detailObj.roadCleaningFrequency || '-' }}</div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.managerName || detailObj.manager || '-' }}</div>
      <div class="detail-row"><span class="label">运营状态：</span>{{ detailObj.operationStatusName || detailObj.status || '-' }}</div>

      <!-- 接口数据特有字段 -->
      <template v-if="isApiData">
        <div class="detail-row"><span class="label">保洁达标率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">问题处置完成率：</span>{{ detailObj.problemRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">复核通过率：</span>{{ detailObj.reviewPassRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">考核得分：</span>{{ detailObj.assessmentScore ?? '-' }}</div>
        <div class="detail-row"><span class="label">责任区域名称：</span>{{ detailObj.responsibilityAreaName || '-' }}</div>
        <div class="detail-row"><span class="label">保洁标准：</span>{{ detailObj.cleaningStandard || '-' }}</div>
        <div class="detail-row"><span class="label">负责人员：</span>
          <span v-if="detailObj.staffLabels && detailObj.staffLabels.length">{{ detailObj.staffLabels.join('、') }}</span>
          <span v-else-if="detailObj.staffsName && detailObj.staffsName.length">{{ detailObj.staffsName.join('、') }}</span>
          <span v-else-if="detailObj.staffIds && detailObj.staffIds.length">{{ detailObj.staffIds.join(', ') }}</span>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">问题位置：</span>{{ detailObj.problemLocation || '-' }}</div>
        <div class="detail-row"><span class="label">问题描述：</span>{{ detailObj.problemDesc || '-' }}</div>
        <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.reportName || detailObj.reportBy || '-' }}</div>
        <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.reportTime || '-' }}</div>
        <div class="detail-row"><span class="label">现场照片：</span>
          <span v-if="detailObj.problemPhotoUrl">
            <a v-for="(url, idx) in (Array.isArray(detailObj.problemPhotoUrl) ? detailObj.problemPhotoUrl : parseJSON(detailObj.problemPhotoUrl))" :key="idx" :href="url" target="_blank">照片{{ idx+1 }} </a>
          </span>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">责任部门：</span>{{ detailObj.deptName || detailObj.deptId || '-' }}</div>
        <div class="detail-row"><span class="label">处置责任人：</span>{{ detailObj.handleName || detailObj.handleBy || '-' }}</div>
        <div class="detail-row"><span class="label">派单时间：</span>{{ detailObj.dispatchTime || '-' }}</div>
        <div class="detail-row"><span class="label">处置状态：</span>{{ detailObj.handleStatusName || '-' }}</div>
        <div class="detail-row"><span class="label">超时提醒：</span>{{ detailObj.isTimeout || '-' }}</div>
        <div class="detail-row"><span class="label">处置说明：</span>{{ detailObj.handleDesc || '-' }}</div>
        <div class="detail-row"><span class="label">整改照片：</span>
          <span v-if="detailObj.reformPhotoUrl">
            <a v-for="(url, idx) in (Array.isArray(detailObj.reformPhotoUrl) ? detailObj.reformPhotoUrl : parseJSON(detailObj.reformPhotoUrl))" :key="idx" :href="url" target="_blank">照片{{ idx+1 }} </a>
          </span>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">复核人员：</span>{{ detailObj.reviewName || detailObj.reviewBy || '-' }}</div>
        <div class="detail-row"><span class="label">复核时间：</span>{{ detailObj.reviewTime || '-' }}</div>
        <div class="detail-row"><span class="label">复核结果：</span>{{ detailObj.reviewResultName || '-' }}</div>
        <div class="detail-row"><span class="label">复核意见：</span>{{ detailObj.reviewOpinion || '-' }}</div>
      </template>

      <!-- 模拟数据特有字段（各状态信息） -->
      <template v-else>
        <!-- 保洁待执行 -->
        <template v-if="detailObj.status === '保洁待执行'">
          <div class="detail-section">🧹 保洁计划信息</div>
          <div class="detail-row"><span class="label">责任区域：</span>{{ detailObj.responsibilityArea || '-' }}</div>
          <div class="detail-row"><span class="label">道路保洁频次：</span>{{ detailObj.roadCleaningFrequency || '-' }}</div>
          <div class="detail-row"><span class="label">保洁时段：</span>{{ detailObj.cleaningTime || '-' }}</div>
          <div class="detail-row"><span class="label">保洁标准：</span>{{ detailObj.cleaningStandard || '-' }}</div>
          <div class="detail-row"><span class="label">负责人员：</span>{{ detailObj.staff || '-' }}</div>
          <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatus || '-' }}</div>
          <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.createBy || '-' }}</div>
          <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
          <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
          <div class="detail-row"><span class="label">计划完成率：</span>{{ detailObj.cleaningPlanCompleteRate ?? '-' }}%</div>
          <div class="detail-row"><span class="label">保洁达标率：</span>{{ detailObj.cleaningRate ?? '-' }}%</div>
        </template>

        <!-- 问题待处置 -->
        <template v-else-if="detailObj.status === '问题待处置'">
          <div class="detail-section">⚠️ 问题信息</div>
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
          <div class="detail-row"><span class="label">责任部门：</span>{{ detailObj.dept || '-' }}</div>
          <div class="detail-row"><span class="label">处置责任人：</span>{{ detailObj.handler || '-' }}</div>
          <div class="detail-row"><span class="label">派单时间：</span>{{ detailObj.dispatchTime || '-' }}</div>
          <div class="detail-row"><span class="label">处置状态：</span>{{ detailObj.handleStatus || '-' }}</div>
          <div class="detail-row"><span class="label">超时提醒：</span>{{ detailObj.isTimeout ? '是' : '否' }}</div>
        </template>

        <!-- 处置待复核 -->
        <template v-else-if="detailObj.status === '处置待复核'">
          <div class="detail-section">🔍 复核信息</div>
          <div class="detail-row"><span class="label">复核编号：</span>{{ detailObj.repairId || '-' }}</div>
          <div class="detail-row"><span class="label">问题类型：</span>{{ detailObj.complaintType || '-' }}</div>
          <div class="detail-row"><span class="label">问题位置：</span>{{ detailObj.problemLocation || '-' }}</div>
          <div class="detail-row"><span class="label">处置责任人：</span>{{ detailObj.handleBy || '-' }}</div>
          <div class="detail-row"><span class="label">处置时间：</span>{{ detailObj.handleTime || '-' }}</div>
          <div class="detail-row"><span class="label">处置说明：</span>{{ detailObj.handleDesc || '-' }}</div>
          <div class="detail-row"><span class="label">整改照片：</span>
            <a v-if="detailObj.reformPhotoUrl" :href="detailObj.reformPhotoUrl" target="_blank">查看</a>
            <span v-else>-</span>
          </div>
          <div class="detail-row"><span class="label">复核人员：</span>{{ detailObj.reviewBy || '-' }}</div>
          <div class="detail-row"><span class="label">复核时间：</span>{{ detailObj.reviewTime || '-' }}</div>
          <div class="detail-row"><span class="label">复核结果：</span>{{ detailObj.reviewResult || '-' }}</div>
          <div class="detail-row"><span class="label">复核意见：</span>{{ detailObj.reviewOpinion || '-' }}</div>
          <div class="detail-row"><span class="label">复核通过率：</span>{{ detailObj.reviewPassRate ?? '-' }}%</div>
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
          <div class="detail-row"><span class="label">问题办结率：</span>{{ detailObj.problemRate ?? '-' }}%</div>
          <div class="detail-row"><span class="label">复核通过率：</span>{{ detailObj.reviewPassRate ?? '-' }}%</div>
          <div class="detail-row"><span class="label">统计周期：</span>{{ detailObj.statPeriod || '-' }}</div>
          <div class="detail-row"><span class="label">考核得分：</span>{{ detailObj.assessmentScore ?? '-' }}</div>
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
