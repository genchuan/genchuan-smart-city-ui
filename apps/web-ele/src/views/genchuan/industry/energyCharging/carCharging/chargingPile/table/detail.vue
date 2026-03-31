<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const code = detailObj.value?.pileCode || '充电桩';
  return title.value || `${code}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 800,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">设备编号：</div><div class="detail-row-right">{{ detailObj.pileCode || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">型号：</div><div class="detail-row-right">{{ detailObj.model || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">功率(kW)：</div><div class="detail-row-right">{{ detailObj.power || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">生产厂家：</div><div class="detail-row-right">{{ detailObj.manufacturer || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">所属场站：</div><div class="detail-row-right">{{ detailObj.stationName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">绑定车位：</div><div class="detail-row-right">{{ detailObj.lotCode || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">充电模式：</div><div class="detail-row-right">{{ detailObj.chargeMode || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">设备状态：</div><div class="detail-row-right">{{ detailObj.pileStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">故障标记：</div><div class="detail-row-right">{{ detailObj.faultFlag ? '有故障' : '无故障' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">运行时长(h)：</div><div class="detail-row-right">{{ detailObj.runTime || 0 }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">充电枪二维码：</div><div class="detail-row-right"><img v-if="detailObj.qrcode" :src="detailObj.qrcode" style="width:100px;height:100px;" /></div></div>
      <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ detailObj.remark || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建者：</div><div class="detail-row-right">{{ detailObj.creator || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新者：</div><div class="detail-row-right">{{ detailObj.updater || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 450px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.detail-card-row:last-child {
  border-bottom: none;
}
.detail-card-row:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: -8px;
  margin-right: -8px;
  transition: all 0.2s ease;
}
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}
@media (max-width: 768px) {
  .detail-row-left { width: 100px; }
  .detail-card { padding: 15px; max-height: 60vh; }
}
.detail-card::-webkit-scrollbar { width: 6px; }
.detail-card::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.detail-card::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
.detail-card::-webkit-scrollbar-thumb:hover { background: #c0c4cc; }
</style>
