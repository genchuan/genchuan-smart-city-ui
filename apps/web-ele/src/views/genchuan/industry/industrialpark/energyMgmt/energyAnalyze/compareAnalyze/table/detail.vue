<!-- detail.vue - 对比详情弹窗（展示完整对比信息、差值、趋势、定位） -->
<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils'; // 导入时间戳格式化工具

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `对比详情`);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 700,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: () => detailDrawerApi.open() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">对比ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">对比名称：</div><div class="detail-row-right">{{ detailObj.compareName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">对比维度：</div><div class="detail-row-right">{{ detailObj.compareDim || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">对比时间：</div><div class="detail-row-right">{{ detailObj.compareTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">能耗差值(kWh)：</div><div class="detail-row-right">{{ detailObj.energyDiff || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">变化率(%)：</div><div class="detail-row-right">{{ detailObj.changeRate || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">趋势预测：</div><div class="detail-row-right">{{ detailObj.forecast || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">问题定位：</div><div class="detail-row-right">{{ detailObj.problem || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">优化方案：</div><div class="detail-row-right">{{ detailObj.plan || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime ? formatTimestamp(detailObj.updateTime) : '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>
