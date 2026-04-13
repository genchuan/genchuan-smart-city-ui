<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.toiletName || '充电场站';
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

const coopModeMap = {
  self: '自营',
  joint: '联营',
  franchise: '加盟',
};
const getCoopModeLabel = (value) => coopModeMap[value] || value;
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息 -->
      <div class="detail-section">⚡ 充电场站基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">场站编号：</div>
        <div class="detail-row-right">{{ detailObj.stationCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">场站名称：</div>
        <div class="detail-row-right">{{ detailObj.stationName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">场站地址：</div>
        <div class="detail-row-right">{{ detailObj.address || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">合作模式：</div>
        <div class="detail-row-right">{{ getCoopModeLabel(detailObj.coopMode) || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">开放时间：</div>
        <div class="detail-row-right">{{ detailObj.openTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">电价服务费：</div>
        <div class="detail-row-right">{{ detailObj.priceService ?? '-' }}元/度</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人：</div>
        <div class="detail-row-right">{{ detailObj.manager || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">场站状态：</div>
        <div class="detail-row-right">{{ detailObj.stationStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">停用原因：</div>
        <div class="detail-row-right">{{ detailObj.stopReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">备注：</div>
        <div class="detail-row-right">{{ detailObj.remark || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">经度：</div>
        <div class="detail-row-right">{{ detailObj.lon ?? '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">纬度：</div>
        <div class="detail-row-right">{{ detailObj.lat ?? '-' }}</div>
      </div>
      <!-- 时间信息（通用） -->
      <div class="detail-section">📅 时间信息</div>
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
</style>
