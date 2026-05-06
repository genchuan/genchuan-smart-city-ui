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
    ElMessage.warning(errorMsg);
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
      <el-descriptions :column="2" border>
        <el-descriptions-item label="车牌号">
          <el-tag type="primary" size="large">{{ vehicleInfo.plateNo }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="车牌颜色">
          <el-tag>{{ vehicleInfo.plateColor }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="车辆类型">
          {{ vehicleInfo.carType }}
        </el-descriptions-item>
        <el-descriptions-item label="绑定状态">
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
        </el-descriptions-item>
        <el-descriptions-item label="绑定时间" :span="2">
          {{ vehicleInfo.bindTime }}
        </el-descriptions-item>
        <el-descriptions-item label="审核时间" :span="2">
          {{ vehicleInfo.auditTime }}
        </el-descriptions-item>
        <el-descriptions-item label="审核备注" :span="2">
          {{ vehicleInfo.auditRemark }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ vehicleInfo.remark }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">
          {{ vehicleInfo.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">
          {{ vehicleInfo.updateTime }}
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
