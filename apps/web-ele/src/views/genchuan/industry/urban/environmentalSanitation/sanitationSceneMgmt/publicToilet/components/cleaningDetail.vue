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
  const name = detailObj.value?.toiletName || '保洁任务';
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

// 如果 detailObj 中已有 proofUrlList，直接使用；否则解析 proofUrl/proofUrls 字段
const proofList = computed(() => {
  const obj = detailObj.value;
  if (obj?.proofUrlList) return obj.proofUrlList;

  const proofSource = obj?.proofUrl || obj?.proofUrls;
  if (!proofSource) return [];

  if (Array.isArray(proofSource)) return proofSource;
  if (typeof proofSource === 'string') {
    try {
      const parsed = JSON.parse(proofSource);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    if (proofSource.includes(',')) {
      return proofSource.split(',').map(url => url.trim());
    }
    return [proofSource];
  }
  return [];
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 保洁任务信息 -->
      <div class="detail-section">🧹 保洁任务信息</div>
      <div class="detail-row"><span class="label">任务编号：</span>{{ detailObj.taskNo || '-' }}</div>
      <div class="detail-row"><span class="label">公厕名称：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.areaName || '-' }}</div>
      <div class="detail-row"><span class="label">保洁频次：</span>{{ detailObj.cleaningFrequency || '-' }}</div>
      <div class="detail-row"><span class="label">保洁时段：</span>{{ detailObj.cleaningTime || '-' }}</div>
      <div class="detail-row"><span class="label">保洁内容：</span>{{ detailObj.cleaningContent || '-' }}</div>
      <div class="detail-row"><span class="label">保洁人员：</span>{{ detailObj.cleanerNames || '-' }}</div>
      <div class="detail-row"><span class="label">保洁标准：</span>{{ detailObj.cleaningStandard || '-' }}</div>
      <div class="detail-row"><span class="label">任务状态：</span>{{ detailObj.planStatusName || '-' }}</div>
      <div class="detail-row"><span class="label">完成率：</span>{{ detailObj.completionRate ?? '-' }}%</div>
      <div class="detail-row"><span class="label">是否异常：</span>{{ detailObj.isAbnormal === 1 ? '是' : '否' }}</div>
      <div class="detail-row" v-if="detailObj.abnormalDesc"><span class="label">异常描述：</span>{{ detailObj.abnormalDesc }}</div>

      <div class="detail-section" v-if="proofList.length">📎 佐证材料</div>
      <div class="detail-row" v-if="proofList.length">
        <span class="label">佐证材料：</span>
        <div class="photo-list">
          <el-image
            v-for="(url, index) in proofList"
            :key="index"
            :src="url"
            :preview-src-list="proofList"
            fit="cover"
            style="width: 80px; height: 80px; margin-right: 8px; border-radius: 4px; cursor: pointer;"
            :preview-teleported="true"
          />
        </div>
      </div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
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
}
</style>
