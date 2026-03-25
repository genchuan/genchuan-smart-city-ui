<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElImage } from 'element-plus';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.planNo || '清扫计划';
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

// 辅助函数：格式化数组
const formatArray = (arr) => {
  if (Array.isArray(arr)) return arr.join(', ');
  return arr || '-';
};

// 解析照片字段（JSON 数组或逗号分隔）
const parsePhotoList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // 忽略解析错误
    }
    if (value.includes(',')) {
      return value.split(',').map(url => url.trim());
    }
    return [value];
  }
  return [];
};

// 上报照片列表（来自 checkPhotoUrl）
const reportPhotoList = computed(() => {
  return detailObj.value?.photoUrlList || parsePhotoList(detailObj.value?.checkPhotoUrl);
});

// 核查照片列表（来自 reviewPhotoUrl）
const reviewPhotoList = computed(() => {
  return parsePhotoList(detailObj.value?.reviewPhotoUrl);
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（始终显示） -->
      <div class="detail-section">📋 清扫计划基础信息</div>
      <div class="detail-row"><span class="label">清扫计划编号：</span>{{ detailObj.planNo || '-' }}</div>
      <div class="detail-row"><span class="label">清扫路段：</span>{{ detailObj.roadName || '-' }}</div>
      <div class="detail-row"><span class="label">责任区域：</span>{{ detailObj.areaName || '-' }}</div>
      <div class="detail-row"><span class="label">清扫频次：</span>{{ detailObj.frequency || '-' }}</div>
      <div class="detail-row"><span class="label">清扫时段：</span>{{ detailObj.timePeriod || '-' }}</div>
      <div class="detail-row"><span class="label">负责人员：</span>{{ formatArray(detailObj.staffsName) }}</div>
      <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatusName || '-' }}</div>
      <div class="detail-row"><span class="label">清扫工具：</span>{{ formatArray(detailObj.toolsName) }}</div>
      <div class="detail-row"><span class="label">清扫标准：</span>{{ detailObj.standard || '-' }}</div>
      <div class="detail-row"><span class="label">质量达标率：</span>{{ detailObj.qualityRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">问题处置数：</span>{{ detailObj.problemCount ?? '-' }}</div>
      <div class="detail-row"><span class="label">考勤全勤率：</span>{{ detailObj.attendanceRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">是否生效：</span>{{ detailObj.isEffective === '是' ? '是' : '否' }}</div>

      <!-- 清扫待执行特有信息 -->
      <template v-if="detailObj.planStatusName === '未开始' || detailObj.planStatusName === '清扫待执行'">
        <div class="detail-section">🧹 清扫计划详情</div>
        <div class="detail-row"><span class="label">创建人：</span>{{ detailObj.creator || '-' }}</div>
        <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
        <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
      </template>

      <!-- 作业进行中特有信息 -->
      <template v-else-if="detailObj.planStatusName === '进行中' || detailObj.planStatusName === '作业进行中'">
        <div class="detail-section">🚜 作业实时信息</div>
        <div class="detail-row"><span class="label">到岗时间：</span>{{ detailObj.checkinTime || '-' }}</div>
        <div class="detail-row"><span class="label">当前进度：</span>{{ detailObj.progress ?? '-' }}%</div>
        <div class="detail-row"><span class="label">作业状态：</span>{{ detailObj.operationStatus || '-' }}</div>
        <div class="detail-row"><span class="label">轨迹覆盖：</span>{{ detailObj.trackCoverage || '-' }}</div>
        <div class="detail-row"><span class="label">最新上报时间：</span>{{ detailObj.lastReportTime || '-' }}</div>
        <div class="detail-row"><span class="label">是否异常：</span>{{ detailObj.isAbnormal === '是' ? '是' : '否' }}</div>
      </template>

      <!-- 质量待核查信息（根据 reviewStatus 判断） -->
      <template v-if="detailObj.reviewStatus === '待核查' || detailObj.reviewStatus === '不达标'">
        <div class="detail-section">🔍 质量核查信息</div>
        <div class="detail-row"><span class="label">作业完成时间：</span>{{ detailObj.completeTime || '-' }}</div>
        <div class="detail-row">
          <span class="label">上报照片：</span>
          <div v-if="reportPhotoList.length" class="photo-list">
            <el-image
              v-for="(url, idx) in reportPhotoList"
              :key="idx"
              :src="url"
              :preview-src-list="reportPhotoList"
              fit="cover"
              style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer;"
              :preview-teleported="true"
            />
          </div>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">清扫工具：</span>{{ formatArray(detailObj.toolsName) }}</div>
        <div class="detail-row">
          <span class="label">核查照片：</span>
          <div v-if="reviewPhotoList.length" class="photo-list">
            <el-image
              v-for="(url, idx) in reviewPhotoList"
              :key="idx"
              :src="url"
              :preview-src-list="reviewPhotoList"
              fit="cover"
              style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer;"
              :preview-teleported="true"
            />
          </div>
          <span v-else>-</span>
        </div>
        <div class="detail-row"><span class="label">核查状态：</span>{{ detailObj.reviewStatus || '-' }}</div>
        <div class="detail-row"><span class="label">核查人员：</span>{{ detailObj.reviewByName || detailObj.reviewBy || '-' }}</div>
        <div class="detail-row"><span class="label">核查时间：</span>{{ detailObj.reviewTime || '-' }}</div>
        <div class="detail-row"><span class="label">整改要求：</span>{{ detailObj.reformRequire || '-' }}</div>
      </template>

      <!-- 已完成信息（当计划状态为已完成且没有质量核查信息时显示） -->
      <template v-else-if="detailObj.planStatusName === '已完成'">
        <div class="detail-section">✅ 已完成任务信息</div>
        <div class="detail-row"><span class="label">完成时间：</span>{{ detailObj.completeTime || '-' }}</div>
        <div class="detail-row"><span class="label">质量核查结果：</span>{{ detailObj.reviewStatus || '-' }}</div>
        <div class="detail-row"><span class="label">问题处置情况：</span>{{ detailObj.problemHandleDesc || '-' }}</div>
        <div class="detail-row"><span class="label">清扫完成率：</span>{{ detailObj.completionRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">质量达标率：</span>{{ detailObj.qualityRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">问题处置及时率：</span>{{ detailObj.problemHandleRate ?? '-' }}%</div>
        <div class="detail-row"><span class="label">统计周期：</span>{{ detailObj.statPeriod || '-' }}</div>
        <div class="detail-row"><span class="label">复盘意见：</span>{{ detailObj.reviewDesc || '-' }}</div>
      </template>
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

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
