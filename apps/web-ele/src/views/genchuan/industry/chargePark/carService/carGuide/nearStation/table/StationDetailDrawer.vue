<template>
  <el-drawer v-model="visible" title="场站详情" size="40%" @close="close">
    <div class="station-detail-content" v-loading="loading">
      <el-descriptions :column="1" border v-if="stationData">
        <el-descriptions-item label="场站ID">{{ stationData.id }}</el-descriptions-item>
        <el-descriptions-item label="场站名称">{{ stationData.deviceName || stationData.stationName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="坐标">{{ stationData.coordinate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="空位状态">
          <el-tag :type="stationData.statusName === '有空位' ? 'success' : 'danger'">
            {{ stationData.statusName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="总桩位数">{{ stationData.stationCount || '-' }}</el-descriptions-item>
        <el-descriptions-item label="空位数">{{ stationData.emptyStationCount || '-' }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ stationData.address || '暂无' }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="暂无场站数据" />
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  station: {
    type: Object,
    default: null,
  },
});
const visible = ref(false);
const stationData = ref(null);
const loading = ref(false);

watch(
  () => props.station,
  (val) => {
    if (val) {
      stationData.value = val;
    }
  },
  { immediate: true, deep: true }
);

const open = () => {
  if (!stationData.value) {
    ElMessage.warning('场站数据为空');
    return;
  }
  visible.value = true;
};
const close = () => {
  visible.value = false;
};

defineExpose({ open, close });
</script>

<style scoped>
.station-detail-content {
  padding: 16px;
}
</style>
