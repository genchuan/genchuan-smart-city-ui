<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElImage } from 'element-plus'; // 新增导入

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.consumableName || '物资待补充';
  return title.value || `${name}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 700,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });

// 格式化时间戳
const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString();
};

// 解析补充照片列表（兼容多种格式）
const photoList = computed(() => {
  const obj = detailObj.value;
  // 如果主表格已预解析出 photoUrlList，直接使用
  if (obj?.photoUrlList) return obj.photoUrlList;
  const photoStr = obj?.photoUrls; // 根据实际字段名调整（可能为 photoUrl、supplyPhoto 等）
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
      return photoStr.split(',').map((url) => url.trim());
    }
    return [photoStr];
  }
  return [];
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">📋 物资待补充信息</div>
      <div class="detail-row">
        <span class="label">公厕名称：</span>{{ detailObj.toiletName || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">所属区域：</span>{{ detailObj.areaName || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">物资名称：</span>{{ detailObj.consumableName || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">当前库存：</span>{{ detailObj.consumableStock ?? '-' }}
      </div>
      <div class="detail-row">
        <span class="label">预警阈值：</span>{{ detailObj.consumableThreshold ?? '-' }}
      </div>
      <div class="detail-row">
        <span class="label">缺口数量：</span>{{ detailObj.consumableGap ?? '-' }}
      </div>
      <div class="detail-row">
        <span class="label">负责人：</span>{{ detailObj.managerName || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">预警状态：</span>
        <el-tag
          :type="
            detailObj.consumableWarning === '严重预警'
              ? 'danger'
              : detailObj.consumableWarning === '预警'
                ? 'warning'
                : 'success'
          "
          size="small"
        >
          {{ detailObj.consumableWarning || '-' }}
        </el-tag>
      </div>
      <div class="detail-row">
        <span class="label">上次补充时间：</span>{{ formatDateTime(detailObj.lastSupplyTime) }}
      </div>
      <div class="detail-row">
        <span class="label">补充周期（天）：</span>{{ detailObj.supplyCycle ?? '-' }}
      </div>

      <div class="detail-row" v-if="photoList.length">
        <span class="label">物资照片：</span>
        <div class="photo-list">
          <el-image
            v-for="(url, index) in photoList"
            :key="index"
            :src="url"
            :preview-src-list="photoList"
            fit="cover"
            style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer;"
            :preview-teleported="true"
          />
        </div>
      </div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-row">
        <span class="label">创建时间：</span>{{ formatDateTime(detailObj.createTime) }}
      </div>
      <div class="detail-row">
        <span class="label">更新时间：</span>{{ formatDateTime(detailObj.updateTime) }}
      </div>
      <div class="detail-row">
        <span class="label">创建人：</span>{{ detailObj.creator || '-' }}
      </div>
      <div class="detail-row">
        <span class="label">更新人：</span>{{ detailObj.updater || '-' }}
      </div>
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
    color: #6e7e91;
  }

  &:hover {
    background: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    margin-left: -8px;
  }
}

/* 新增照片列表样式 */
.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
