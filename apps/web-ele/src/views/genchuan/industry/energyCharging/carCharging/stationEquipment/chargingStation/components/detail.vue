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

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息 -->
      <div class="detail-section">⚡ 充电场站基础信息</div>
      <div class="detail-row"><span class="label">场站编号：</span>{{ detailObj.station_code || '-' }}</div>
      <div class="detail-row"><span class="label">场站名称：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">场站地址：</span>{{ detailObj.location || '-' }}</div>
      <div class="detail-row"><span class="label">合作模式：</span>{{ detailObj.area || '-' }}</div>
      <div class="detail-row"><span class="label">开放时间：</span>{{ detailObj.openHours || '-' }}</div>
      <div class="detail-row"><span class="label">电价服务费：</span>{{ detailObj.stallCount ?? '-' }}元/度</div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.manager || '-' }}</div>
      <div class="detail-row"><span class="label">场站状态：</span>{{ detailObj.status || '-' }}</div>
      <div class="detail-row"><span class="label">停用原因：</span>{{ detailObj.cleaner || '-' }}</div>
      <div class="detail-row"><span class="label">备注：</span>{{ detailObj.cleaningContent || '-' }}</div>
      <div class="detail-row"><span class="label">经度：</span>{{ detailObj.lon ?? '-' }}</div>
      <div class="detail-row"><span class="label">纬度：</span>{{ detailObj.lat ?? '-' }}</div>

      <!-- 关联设备数量（模拟数据） -->
      <div class="detail-section">🔌 关联设备信息</div>
      <div class="detail-row"><span class="label">充电桩数量：</span>{{ detailObj.stallCount ? Math.floor(Math.random() * 30) + 5 : '-' }}个</div>
      <div class="detail-row"><span class="label">车位数量：</span>{{ detailObj.stallCount ? Math.floor(Math.random() * 50) + 20 : '-' }}个</div>

      <!-- 操作审计日志（模拟） -->
      <div class="detail-section">📝 操作审计日志</div>
      <div class="detail-row">
        <span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}
        <span style="margin-left: 20px;">创建人：{{ detailObj.createBy || '-' }}</span>
      </div>
      <div class="detail-row">
        <span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}
        <span style="margin-left: 20px;">更新人：{{ detailObj.updater || '-' }}</span>
      </div>

      <!-- 时间信息（通用） -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
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
    color: #606266;
  }
  &:hover {
    background: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    margin-left: -8px;
  }
}
</style>
