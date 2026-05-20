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
    <div class="detail-form">
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">车位编号：</span>
          <el-tag type="primary" size="large">{{ spaceInfo.spaceNo }}</el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">所属场站：</span>
          <span class="detail-value">{{ spaceInfo.stationName }}</span>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">车位类型：</span>
          <span class="detail-value">{{ spaceInfo.spaceType }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">车位状态：</span>
          <el-tag :type="spaceInfo.status === '占用中' ? 'danger' : 'success'">
            {{ spaceInfo.status }}
          </el-tag>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">当前车辆：</span>
          <el-tag v-if="spaceInfo.currentVehicle !== '-'" type="warning">
            {{ spaceInfo.currentVehicle }}
          </el-tag>
          <span v-else class="detail-value">-</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">入场时间：</span>
          <span class="detail-value">{{ spaceInfo.enterTime }}</span>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">充电功率：</span>
          <span class="detail-value">{{ spaceInfo.chargingPower }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">位置：</span>
          <span class="detail-value">{{ spaceInfo.location }}</span>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">累计使用次数：</span>
          <el-tag type="success">{{ spaceInfo.totalUseCount }}次</el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">累计使用时长：</span>
          <el-tag type="warning">{{ spaceInfo.totalUseTime }}</el-tag>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">最近维护日期：</span>
          <span class="detail-value">{{ spaceInfo.lastMaintenanceDate }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.detail-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-item {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.detail-label {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.detail-value {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
}
</style>
