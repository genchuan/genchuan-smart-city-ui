<script setup>
import { computed, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElImage } from 'element-plus';

const props = defineProps({});

const detailData = ref({});

const drawerTitle = computed(() => {
  return `问题详情 - ${detailData.value.problemId || ''}`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open(data) {
    detailData.value = data || {};
    detailDrawerApi.open();
  },
  close() {
    detailDrawerApi.close();
  },
});

// 解析照片列表（来自 localePhotoUrl）
const parsePhotoList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // 忽略
    }
    if (value.includes(',')) {
      return value.split(',').map(url => url.trim());
    }
    return [value];
  }
  return [];
};

const photoList = computed(() => {
  // 优先使用主表格已解析的 photoUrlList
  if (detailData.value.photoUrlList) return detailData.value.photoUrlList;
  return parsePhotoList(detailData.value.localePhotoUrl);
});

const formatValue = (val) => {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'object') return JSON.stringify(val);
  return val;
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">📋 基本信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">问题编号：</div>
        <div class="detail-row-right">{{ detailData.problemId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联计划：</div>
        <div class="detail-row-right">{{ detailData.planId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">问题类型：</div>
        <div class="detail-row-right">{{ detailData.problemTypeName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">问题位置：</div>
        <div class="detail-row-right">{{ detailData.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报人员：</div>
        <div class="detail-row-right">{{ detailData.reportName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报时间：</div>
        <div class="detail-row-right">{{ detailData.reportTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">问题描述：</div>
        <div class="detail-row-right">{{ detailData.problemDesc || '-' }}</div>
      </div>

      <!-- 现场照片 -->
      <div class="detail-card-row" v-if="photoList.length">
        <div class="detail-row-left">现场照片：</div>
        <div class="detail-row-right">
          <div class="photo-list">
            <el-image
              v-for="(url, idx) in photoList"
              :key="idx"
              :src="url"
              :preview-src-list="photoList"
              fit="cover"
              style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer;"
              :preview-teleported="true"
            />
          </div>
        </div>
      </div>

      <div class="detail-section">⚙️ 处置信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置组：</div>
        <div class="detail-row-right">{{ detailData.teamName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置状态：</div>
        <div class="detail-row-right">{{ detailData.handleStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时提醒：</div>
        <div class="detail-row-right">{{ detailData.isTimeout === '是' ? '超时' : '正常' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置结果：</div>
        <div class="detail-row-right">{{ detailData.handleResult || '-' }}</div>
      </div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailData.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ detailData.updateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人：</div>
        <div class="detail-row-right">{{ detailData.creator || '-' }}</div>
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
