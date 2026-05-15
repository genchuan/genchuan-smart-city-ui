<script setup>
import { computed, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getVehicleDetailByPlate } from '#/api/genchuan/industry/chargePark/vehiclePass/shared';

const dialogVisible = ref(false);
const vehicleData = ref({});
const loading = ref(false);

// 车辆详情数据
const vehicleInfo = computed(() => {
  return {
    plateNo: vehicleData.value.plateNo || '-',
    plateColor: vehicleData.value.plateColor || '-',
    carType: vehicleData.value.carType || '-',
    bindTime: vehicleData.value.bindTime || '-',
    status: vehicleData.value.status || '-',
    auditorId: vehicleData.value.auditorId || '-',
    auditTime: vehicleData.value.auditTime || '-',
    auditRemark: vehicleData.value.auditRemark || '-',
    remark: vehicleData.value.remark || '-',
    createTime: vehicleData.value.createTime || '-',
    updateTime: vehicleData.value.updateTime || '-',
  };
});

const open = async (plateNo) => {
  if (!plateNo) {
    ElMessage.warning('车牌号不能为空');
    return;
  }

  loading.value = true;
  vehicleData.value = {};

  try {
    const res = await getVehicleDetailByPlate(plateNo);
    vehicleData.value = res;
    // 只有在成功获取数据后才打开对话框
    dialogVisible.value = true;
  } catch (error) {
    // 只显示消息提示，不打开对话框
    const errorMsg = error?.message || error?.msg || '获取车辆详情失败';
    // ElMessage.warning(errorMsg);
    console.error('获取车辆详情失败:', error);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  dialogVisible.value = false;
  vehicleData.value = {};
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`车辆详情 - ${vehicleInfo.plateNo}`"
    width="700px"
    append-to-body
  >
    <el-skeleton :loading="loading" :rows="8" animated>
      <div class="detail-form">
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">车牌号：</span>
            <el-tag type="primary" size="large">
              {{ vehicleInfo.plateNo }}
            </el-tag>
          </div>
          <div class="detail-item">
            <span class="detail-label">车牌颜色：</span>
            <el-tag>{{ vehicleInfo.plateColor }}</el-tag>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">车辆类型：</span>
            <span class="detail-value">{{ vehicleInfo.carType }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">绑定状态：</span>
            <el-tag
              :type="
                vehicleInfo.status === '已绑定'
                  ? 'success'
                  : vehicleInfo.status === '待审核'
                    ? 'warning'
                    : 'info'
              "
            >
              {{ vehicleInfo.status }}
            </el-tag>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">绑定时间：</span>
            <span class="detail-value">{{ vehicleInfo.bindTime }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">审核时间：</span>
            <span class="detail-value">{{ vehicleInfo.auditTime }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">审核备注：</span>
            <span class="detail-value">{{ vehicleInfo.auditRemark }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">备注：</span>
            <span class="detail-value">{{ vehicleInfo.remark }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ vehicleInfo.createTime }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">更新时间：</span>
            <span class="detail-value">{{ vehicleInfo.updateTime }}</span>
          </div>
        </div>
      </div>
    </el-skeleton>

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
