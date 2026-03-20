<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElImage } from 'element-plus';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
  currentTab: { type: String, default: '' },
});

const { detailObj, title, currentTab } = toRefs(props);

const drawerTitle = computed(() => {
  const abnormalId = detailObj.value?.abnormalId || '异常';
  return title.value || `${abnormalId}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});

// 格式化照片字段（兼容 JSON 字符串）
const formatPhotos = (photoStr) => {
  if (!photoStr) return [];
  try {
    return JSON.parse(photoStr);
  } catch {
    return [];
  }
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息（始终显示） -->
      <div class="detail-section">⚠️ 异常信息</div>
      <div class="detail-row">
        <span class="label">异常编号：</span>{{ detailObj.abnormalId || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">异常类型：</span>{{ detailObj.abnormalType || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">异常描述：</span>{{ detailObj.abnormalDesc || '-' }}
      </div>
      <div class="detail-row" v-if="detailObj.abnormalPhotoUrl">
        <span class="label">异常照片：</span>
        <div class="photo-list">
          <el-image
            v-for="(url, index) in formatPhotos(detailObj.abnormalPhotoUrl)"
            :key="index"
            :src="url"
            :preview-src-list="formatPhotos(detailObj.abnormalPhotoUrl)"
            fit="cover"
            style="width: 80px; height: 80px; margin-right: 8px; border-radius: 4px; cursor: pointer;"
            :preview-teleported="true"
          />
        </div>
      </div>
      <div class="detail-row">
        <span class="label">发生区域：</span>{{ detailObj.areaCode || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">上报人：</span>{{ detailObj.reportName || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">上报时间：</span>
        {{
          detailObj.reportTime
            ? new Date(detailObj.reportTime).toLocaleString()
            : '-'
        }}
      </div>
      <div class="detail-row">
        <span class="label">优先级：</span>{{ detailObj.priority || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">超时状态：</span>
        {{ detailObj.isTimeout === '是' ? '超时' : '正常' }}
      </div>

      <!-- 处置记录区块：不在“异常待处置”时显示 -->
      <template v-if="currentTab !== '异常待处置'">
        <div class="detail-section">🔧 处置记录</div>
        <div class="detail-row">
          <span class="label">责任人：</span>{{ detailObj.handlerId || '-' }}
        </div>
        <div class="detail-row">
          <span class="label">处置状态：</span>{{ detailObj.handleStatus || '-' }}
        </div>
        <div class="detail-row">
          <span class="label">整改说明：</span>{{ detailObj.handleDesc || '-' }}
        </div>
        <div class="detail-row" v-if="detailObj.handlePhotoUrl">
          <span class="label">整改照片：</span>
          <div class="photo-list">
            <el-image
              v-for="(url, index) in formatPhotos(detailObj.handlePhotoUrl)"
              :key="index"
              :src="url"
              :preview-src-list="formatPhotos(detailObj.handlePhotoUrl)"
              fit="cover"
              style="width: 80px; height: 80px; margin-right: 8px; border-radius: 4px; cursor: pointer;"
              :preview-teleported="true"
            />
          </div>
        </div>
      </template>

      <!-- 复核信息区块：仅在非“异常待处置”且非“处置待复核”时显示 -->
      <template v-if="currentTab !== '异常待处置' && currentTab !== '处置待复核'">
        <div class="detail-section">✅ 复核信息</div>
        <div class="detail-row">
          <span class="label">复核状态：</span>{{ detailObj.reviewStatus || '-' }}
        </div>
        <div class="detail-row">
          <span class="label">复核人：</span>{{ detailObj.reviewBy || '-' }}
        </div>
        <div class="detail-row">
          <span class="label">复核时间：</span>
          {{
            detailObj.reviewTime
              ? new Date(detailObj.reviewTime).toLocaleString()
              : '-'
          }}
        </div>
      </template>

      <!-- 系统信息（始终显示） -->
      <div class="detail-section">📅 系统信息</div>
      <div class="detail-row">
        <span class="label">创建时间：</span>
        {{
          detailObj.createTime
            ? new Date(detailObj.createTime).toLocaleString()
            : '-'
        }}
      </div>
      <div class="detail-row">
        <span class="label">更新时间：</span>
        {{
          detailObj.updateTime
            ? new Date(detailObj.updateTime).toLocaleString()
            : '-'
        }}
      </div>
      <div class="detail-row">
        <span class="label">创建人：</span>{{ detailObj.creator || '-' }}
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  max-height: 70vh;
  padding: 20px;
  overflow-y: auto;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-section {
  padding-bottom: 4px;
  margin: 16px 0 8px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  .label {
    flex-shrink: 0;
    width: 130px;
    font-weight: 500;
    color: #6e7e91;
  }

  &:hover {
    background: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    margin-left: -8px;
  }
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
