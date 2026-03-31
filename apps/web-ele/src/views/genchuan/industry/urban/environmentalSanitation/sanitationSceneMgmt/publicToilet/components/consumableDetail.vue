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

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});

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
      <div class="detail-card-row">
        <div class="detail-row-left">公厕名称：</div>
        <div class="detail-row-right">{{ detailObj.toiletName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">物资名称：</div>
        <div class="detail-row-right">{{ detailObj.consumableName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前库存：</div>
        <div class="detail-row-right">{{ detailObj.consumableStock ?? '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警阈值：</div>
        <div class="detail-row-right">{{ detailObj.consumableThreshold ?? '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">缺口数量：</div>
        <div class="detail-row-right">{{ detailObj.consumableGap ?? '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人：</div>
        <div class="detail-row-right">{{ detailObj.managerName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警状态：</div>
        <div class="detail-row-right">
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
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上次补充时间：</div>
        <div class="detail-row-right">{{ formatDateTime(detailObj.lastSupplyTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">补充周期（天）：</div>
        <div class="detail-row-right">{{ detailObj.supplyCycle ?? '-' }}</div>
      </div>

      <div class="detail-card-row" v-if="photoList.length">
        <div class="detail-row-left">物资照片：</div>
        <div class="detail-row-right">
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
      </div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ formatDateTime(detailObj.createTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ formatDateTime(detailObj.updateTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人：</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新人：</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
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
