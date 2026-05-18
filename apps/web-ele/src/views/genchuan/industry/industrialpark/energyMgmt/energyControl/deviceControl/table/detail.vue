<!-- ==================== detail.vue（设备详情抽屉，修复时间显示）==================== -->
<script setup>
import { ref, computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils'; // 复用已有的时间格式化函数

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { title } = toRefs(props);
const drawerTitle = computed(() => title.value || `设备详情`);

// 内部维护详情数据，避免直接修改 prop
const localDetailObj = ref({});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open: (data) => {
    localDetailObj.value = data;
    detailDrawerApi.open();
  },
  close: () => detailDrawerApi.close(),
});

// 辅助函数：安全格式化时间
const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  // 兼容数字或字符串，处理可能的小数点（如 1777642240548.0676）
  let ts = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;
  if (isNaN(ts)) return '-';
  // 判断是秒还是毫秒（简单启发：若小于 10^12 则视为秒）
  const isSeconds = ts < 1000000000000;
  const ms = isSeconds ? ts * 1000 : ts;
  return formatTimestamp(ms);
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">设备ID：</div>
        <div class="detail-row-right">{{ localDetailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备名称：</div>
        <div class="detail-row-right">{{ localDetailObj.deviceName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备类型：</div>
        <div class="detail-row-right">{{ localDetailObj.deviceType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联策略：</div>
        <div class="detail-row-right">{{ localDetailObj.strategyName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管控规则：</div>
        <div class="detail-row-right">{{ localDetailObj.controlRule || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管控状态：</div>
        <div class="detail-row-right">{{ localDetailObj.controlStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管控前能耗：</div>
        <div class="detail-row-right">{{ localDetailObj.beforeEnergy ? `${localDetailObj.beforeEnergy} kWh` : '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管控后能耗：</div>
        <div class="detail-row-right">{{ localDetailObj.afterEnergy ? `${localDetailObj.afterEnergy} kWh` : '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">能耗下降值：</div>
        <div class="detail-row-right">{{ localDetailObj.downEnergy ? `${localDetailObj.downEnergy} kWh` : '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人：</div>
        <div class="detail-row-right">{{ localDetailObj.handleUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ formatDate(localDetailObj.createTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ formatDate(localDetailObj.updateTime) }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}
</style>
