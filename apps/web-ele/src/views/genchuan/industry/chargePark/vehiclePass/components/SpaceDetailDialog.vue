<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ElMessage } from 'element-plus';

const router = useRouter();
const dialogVisible = ref(false);
const spaceData = ref({});
const loading = ref(false);

// 模拟车位详情数据
const spaceInfo = computed(() => {
  return {
    spaceNo: spaceData.value.spaceNo || spaceData.value.spaceName || '-',
    stationName: spaceData.value.stationName || '充电站1',
    spaceType: '充电车位',
    status: '占用中',
    currentVehicle: spaceData.value.plateNo || spaceData.value.carNo || '-',
    enterTime: spaceData.value.enterTime || spaceData.value.inTime || '-',
    chargingPower: '7kW',
    location: 'A区1层',
    totalUseCount: 328,
    totalUseTime: '1256小时',
    lastMaintenanceDate: '2025-03-15',
  };
});

const open = async (spaceNo, additionalData = {}) => {
  if (!spaceNo) {
    ElMessage.warning('车位编号不能为空');
    return;
  }

  spaceData.value = { spaceNo, ...additionalData };
  dialogVisible.value = true;
  loading.value = true;

  // TODO: 调用真实API获取车位详情
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const close = () => {
  dialogVisible.value = false;
  spaceData.value = {};
};

// 跳转到车位管理页面
const goToSpaceManagement = () => {
  // TODO: 根据实际路由配置修改路径
  const spaceManagementRoute =
    '/genchuan/industry/chargePark/vehiclePass/spaceMgmt';

  try {
    router.push({
      path: spaceManagementRoute,
      query: {
        spaceNo: spaceInfo.value.spaceNo,
      },
    });
    close();
  } catch (error) {
    ElMessage.error('跳转失败，车位管理页面路由未配置');
    console.error('路由跳转失败:', error);
  }
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`车位详情 - ${spaceInfo.spaceNo}`"
    width="700px"
    append-to-body
  >
    <el-skeleton :loading="loading" :rows="8" animated>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="车位编号">
          <el-tag type="primary" size="large">{{ spaceInfo.spaceNo }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属场站">
          {{ spaceInfo.stationName }}
        </el-descriptions-item>
        <el-descriptions-item label="车位类型">
          {{ spaceInfo.spaceType }}
        </el-descriptions-item>
        <el-descriptions-item label="车位状态">
          <el-tag :type="spaceInfo.status === '占用中' ? 'danger' : 'success'">
            {{ spaceInfo.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前车辆" :span="2">
          <el-tag v-if="spaceInfo.currentVehicle !== '-'" type="warning">
            {{ spaceInfo.currentVehicle }}
          </el-tag>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="入场时间" :span="2">
          {{ spaceInfo.enterTime }}
        </el-descriptions-item>
        <el-descriptions-item label="充电功率">
          {{ spaceInfo.chargingPower }}
        </el-descriptions-item>
        <el-descriptions-item label="位置">
          {{ spaceInfo.location }}
        </el-descriptions-item>
        <el-descriptions-item label="累计使用次数">
          <el-tag type="success">{{ spaceInfo.totalUseCount }}次</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="累计使用时长">
          <el-tag type="warning">{{ spaceInfo.totalUseTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最近维护日期" :span="2">
          {{ spaceInfo.lastMaintenanceDate }}
        </el-descriptions-item>
      </el-descriptions>
    </el-skeleton>

    <template #footer>
      <el-button @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-descriptions__label) {
  width: 120px;
}
</style>
