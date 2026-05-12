<!-- detail.vue - 采集设备详情弹窗（完整信息 + 采集历史 + 异常记录） -->
<script setup>
import { computed, toRefs, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `设备${detailObj.value?.deviceName || ''}详情`);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });

// 历史采集数据（模拟，实际可从接口获取）
const historyList = ref([]);
const exceptionList = ref([]);
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">设备名称：</div><div class="detail-row-right">{{ detailObj.deviceName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">设备类型：</div><div class="detail-row-right">{{ detailObj.deviceType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">能耗类型：</div><div class="detail-row-right">{{ detailObj.energyType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">采集时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.collectTime) || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">采集状态：</div><div class="detail-row-right">{{ detailObj.collectStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">能耗数值：</div><div class="detail-row-right">{{ detailObj.energyValue }} kWh</div></div>
      <div class="detail-card-row"><div class="detail-row-left">采集频率：</div><div class="detail-row-right">{{ detailObj.collectFreq }} 分钟</div></div>
      <div class="detail-card-row"><div class="detail-row-left">异常次数：</div><div class="detail-row-right">{{ detailObj.exceptionCount }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.createTime) || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.updateTime) || '-' }}</div></div>
    </div>
    <div class="history-section">
      <h4>采集历史数据</h4>
      <el-table :data="historyList" border size="small" style="width: 100%">
        <el-table-column prop="collectTime" label="采集时间" />
        <el-table-column prop="energyValue" label="能耗值(kWh)" />
      </el-table>
      <h4>异常记录</h4>
      <el-table :data="exceptionList" border size="small" style="width: 100%">
        <el-table-column prop="exceptionTime" label="异常时间" />
        <el-table-column prop="reason" label="异常原因" />
      </el-table>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
.history-section { margin-top: 20px; }
</style>
