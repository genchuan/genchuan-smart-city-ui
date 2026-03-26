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
      <div class="detail-card-row">
        <div class="detail-row-left">异常编号：</div>
        <div class="detail-row-right">{{ detailObj.abnormalId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常类型：</div>
        <div class="detail-row-right">{{ detailObj.abnormalType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常描述：</div>
        <div class="detail-row-right">{{ detailObj.abnormalDesc || '-' }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.abnormalPhotoUrl">
        <div class="detail-row-left">异常照片：</div>
        <div class="detail-row-right">
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
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">发生区域：</div>
        <div class="detail-row-right">{{ detailObj.areaCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报人：</div>
        <div class="detail-row-right">{{ detailObj.reportName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报时间：</div>
        <div class="detail-row-right">
          {{
            detailObj.reportTime
              ? new Date(detailObj.reportTime).toLocaleString()
              : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">优先级：</div>
        <div class="detail-row-right">{{ detailObj.priority || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时状态：</div>
        <div class="detail-row-right">
          {{ detailObj.isTimeout === '是' ? '超时' : '正常' }}
        </div>
      </div>

      <!-- 处置记录区块：不在“异常待处置”时显示 -->
      <template v-if="currentTab !== '异常待处置'">
        <div class="detail-section">🔧 处置记录</div>
        <div class="detail-card-row">
          <div class="detail-row-left">责任人：</div>
          <div class="detail-row-right">{{ detailObj.handlerId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置状态：</div>
          <div class="detail-row-right">{{ detailObj.handleStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">整改说明：</div>
          <div class="detail-row-right">{{ detailObj.handleDesc || '-' }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.handlePhotoUrl">
          <div class="detail-row-left">整改照片：</div>
          <div class="detail-row-right">
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
        </div>
      </template>

      <!-- 复核信息区块：仅在非“异常待处置”且非“处置待复核”时显示 -->
      <template v-if="currentTab !== '异常待处置' && currentTab !== '处置待复核'">
        <div class="detail-section">✅ 复核信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核状态：</div>
          <div class="detail-row-right">{{ detailObj.reviewStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核人：</div>
          <div class="detail-row-right">{{ detailObj.reviewBy || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">复核时间：</div>
          <div class="detail-row-right">
            {{
              detailObj.reviewTime
                ? new Date(detailObj.reviewTime).toLocaleString()
                : '-'
            }}
          </div>
        </div>
      </template>

      <!-- 系统信息（始终显示） -->
      <div class="detail-section">📅 系统信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">
          {{
            detailObj.createTime
              ? new Date(detailObj.createTime).toLocaleString()
              : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">
          {{
            detailObj.updateTime
              ? new Date(detailObj.updateTime).toLocaleString()
              : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人：</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
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
