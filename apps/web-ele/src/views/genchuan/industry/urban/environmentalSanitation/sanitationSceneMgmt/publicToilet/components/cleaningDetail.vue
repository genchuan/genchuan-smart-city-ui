<script setup>
import {computed, defineProps, toRefs} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {ElImage} from 'element-plus';

const props = defineProps({
  detailObj: {type: Object, required: true, default: () => ({})},
  title: {type: String, default: ''},
});

const {detailObj, title} = toRefs(props);

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

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});

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
    } catch {
    }
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
      <div class="detail-card-row">
        <div class="detail-row-left">任务编号：</div>
        <div class="detail-row-right">{{ detailObj.taskNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">公厕名称：</div>
        <div class="detail-row-right">{{ detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
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
        <div class="detail-row-left">保洁内容：</div>
        <div class="detail-row-right">{{ detailObj.cleaningContent || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">保洁人员：</div>
        <div class="detail-row-right">{{ detailObj.cleanerNames || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">保洁标准：</div>
        <div class="detail-row-right">{{ detailObj.cleaningStandard || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">任务状态：</div>
        <div class="detail-row-right">{{ detailObj.planStatusName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">完成率：</div>
        <div class="detail-row-right">{{ detailObj.completionRate ?? '-' }}%</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">是否异常：</div>
        <div class="detail-row-right">{{ detailObj.isAbnormal === 1 ? '是' : '否' }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.abnormalDesc">
        <div class="detail-row-left">异常描述：</div>
        <div class="detail-row-right">{{ detailObj.abnormalDesc }}</div>
      </div>
      <div class="detail-card-row" v-if="proofList.length">
        <div class="detail-row-left">佐证材料：</div>
        <div class="detail-row-right">
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
      </div>
      <div class="detail-card-row" v-if="detailObj.reviewDesc">
        <div class="detail-row-left">复盘意见：</div>
        <div class="detail-row-right">{{ detailObj.reviewDesc }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
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

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
