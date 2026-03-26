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
  const id = detailObj.value?.complaintId || '投诉';
  return title.value || `${id}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});

// 计算整改照片列表（兼容多种存储格式）
const photoList = computed(() => {
  const obj = detailObj.value;
  // 如果主表格已解析好列表，直接使用
  if (obj?.reformPhotoList) return obj.reformPhotoList;
  const photoStr = obj?.reformPhoto;
  if (!photoStr) return [];

  // 兼容 JSON 数组、逗号分隔字符串或单张图片
  if (Array.isArray(photoStr)) return photoStr;
  if (typeof photoStr === 'string') {
    try {
      const parsed = JSON.parse(photoStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // 忽略解析错误，继续尝试逗号分隔
    }
    if (photoStr.includes(',')) {
      return photoStr.split(',').map(url => url.trim());
    }
    return [photoStr];
  }
  return [];
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">📋 投诉信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">投诉编号：</div>
        <div class="detail-row-right">{{ detailObj.complaintId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联公厕：</div>
        <div class="detail-row-right">{{ detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">投诉类型：</div>
        <div class="detail-row-right">{{ detailObj.complaintTypeName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">投诉内容：</div>
        <div class="detail-row-right">{{ detailObj.content || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">投诉人：</div>
        <div class="detail-row-right">{{ detailObj.complaintName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系电话：</div>
        <div class="detail-row-right">{{ detailObj.phone || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">投诉时间：</div>
        <div class="detail-row-right">{{ detailObj.complaintTime || '-' }}</div>
      </div>

      <div class="detail-section">🔧 处置信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">派单状态：</div>
        <div class="detail-row-right">{{ detailObj.dispatchStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">责任人：</div>
        <div class="detail-row-right">{{ detailObj.handlerName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">是否超时：</div>
        <div class="detail-row-right">{{ detailObj.isTimeout === '是' ? '是' : '否' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置措施：</div>
        <div class="detail-row-right">{{ detailObj.handleMeasure || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置结果：</div>
        <div class="detail-row-right">{{ detailObj.handleResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">反馈内容：</div>
        <div class="detail-row-right">{{ detailObj.feedbackContent || '-' }}</div>
      </div>

      <div class="detail-card-row" v-if="photoList.length">
        <div class="detail-row-left">整改照片：</div>
        <div class="detail-row-right">
          <div class="photo-list">
            <el-image
              v-for="(url, index) in photoList"
              :key="index"
              :src="url"
              :preview-src-list="photoList"
              fit="cover"
              style="width: 80px; height: 80px; margin-right: 8px; border-radius: 4px; cursor: pointer;"
              :preview-teleported="true"
            />
          </div>
        </div>
      </div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
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
