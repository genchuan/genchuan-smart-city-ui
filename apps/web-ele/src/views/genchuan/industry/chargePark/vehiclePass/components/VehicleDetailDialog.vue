<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ElMessage } from 'element-plus';

const router = useRouter();
const dialogVisible = ref(false);
const vehicleData = ref({});
const loading = ref(false);

// 模拟车辆详情数据
const vehicleInfo = computed(() => {
  return {
    plateNo: vehicleData.value.plateNo || '-',
    plateColor: vehicleData.value.plateColor || '-',
    vehicleType: '小型汽车',
    owner: '张三',
    phone: '138****8888',
    registrationDate: '2020-05-15',
    lastEnterTime:
      vehicleData.value.enterTime || vehicleData.value.createTime || '-',
    totalEnterCount: 156,
    totalParkTime: '328小时',
    isWhitelist: true,
    status: '正常',
  };
});

const open = async (plateNo, additionalData = {}) => {
  if (!plateNo) {
    ElMessage.warning('车牌号不能为空');
    return;
  }

  vehicleData.value = { plateNo, ...additionalData };
  dialogVisible.value = true;
  loading.value = true;

  // TODO: 调用真实API获取车辆详情
  // try {
  //   const res = await getVehicleDetail(plateNo);
  //   vehicleData.value = res;
  // } catch (error) {
  //   ElMessage.error('获取车辆详情失败');
  // } finally {
  //   loading.value = false;
  // }

  // 模拟API调用
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const close = () => {
  dialogVisible.value = false;
  vehicleData.value = {};
};

// 跳转到车辆管理页面
const goToVehicleManagement = () => {
  // TODO: 根据实际路由配置修改路径
  const vehicleManagementRoute =
    '/genchuan/industry/chargePark/vehiclePass/vehicleMgmt';

  try {
    router.push({
      path: vehicleManagementRoute,
      query: {
        plateNo: vehicleInfo.value.plateNo,
      },
    });
    close();
  } catch (error) {
    ElMessage.error('跳转失败，车辆管理页面路由未配置');
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
          {{ vehicleInfo.vehicleType }}
        </el-descriptions-item>
        <el-descriptions-item label="车主姓名">
          {{ vehicleInfo.owner }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ vehicleInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="注册日期">
          {{ vehicleInfo.registrationDate }}
        </el-descriptions-item>
        <el-descriptions-item label="最近入场时间" :span="2">
          {{ vehicleInfo.lastEnterTime }}
        </el-descriptions-item>
        <el-descriptions-item label="累计入场次数">
          <el-tag type="success">{{ vehicleInfo.totalEnterCount }}次</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="累计停车时长">
          <el-tag type="warning">{{ vehicleInfo.totalParkTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="白名单状态">
          <el-tag :type="vehicleInfo.isWhitelist ? 'success' : 'info'">
            {{ vehicleInfo.isWhitelist ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="车辆状态">
          <el-tag :type="vehicleInfo.status === '正常' ? 'success' : 'danger'">
            {{ vehicleInfo.status }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-skeleton>

    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="goToVehicleManagement">
        跳转到车辆管理页面
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-descriptions__label) {
  width: 120px;
}
</style>
