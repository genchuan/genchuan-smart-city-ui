<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { ElCard, ElEmpty } from 'element-plus';

// TODO @haohao：这里要实现一把么？

interface Props {
  deviceId: number;
}

defineProps<Props>();

const loading = ref(false);
const subDevices = ref<any[]>([]);

/** 获取子设备列表 */
async function getSubDeviceList() {
  loading.value = true;
  try {
    // TODO: 实现获取子设备列表的API调用
    // const data = await getSubDevicesByGatewayId(deviceId);
    // subDevices.value = data || [];
    subDevices.value = [];
  } catch (error) {
    console.error('获取子设备列表失败:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getSubDeviceList();
});
</script>

<template>
  <el-card class="sub-device-card" :loading="loading" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>子设备管理</span>
      </div>
    </template>
    <el-empty
      :image-size="100"
      description="暂无子设备数据，此功能待实现"
    />
    <!-- TODO: 实现子设备列表展示和管理功能 -->
  </el-card>
</template>

<style scoped>
.sub-device-card {
  border-radius: 8px;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
}

:deep(.el-card__body) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
