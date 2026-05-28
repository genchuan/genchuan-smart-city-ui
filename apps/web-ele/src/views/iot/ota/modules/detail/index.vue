<script setup lang="ts">
import type { IoTOtaFirmware } from '#/api/iot/ota/firmware';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { formatDate } from '@vben/utils';

import { ElCard, ElCol, ElDescriptions, ElDescriptionsItem, ElRow } from 'element-plus';

import { getOtaFirmware } from '#/api/iot/ota/firmware';
import { getOtaTaskRecordStatusStatistics } from '#/api/iot/ota/task/record';
import { IoTOtaTaskRecordStatusEnum } from '#/views/iot/utils/constants';

import OtaTaskList from '../task/ota-task-list.vue';

/** IoT OTA 固件详情 */
defineOptions({ name: 'IoTOtaFirmwareDetail' });

const route = useRoute();

const firmwareId = ref(Number(route.params.id));
const firmwareLoading = ref(false);
const firmware = ref<IoTOtaFirmware>({} as IoTOtaFirmware);

const firmwareStatisticsLoading = ref(false);
const firmwareStatistics = ref<Record<string, number>>({});

/** 获取固件信息 */
async function getFirmwareInfo() {
  firmwareLoading.value = true;
  try {
    firmware.value = await getOtaFirmware(firmwareId.value);
  } finally {
    firmwareLoading.value = false;
  }
}

/** 获取升级统计 */
async function getStatistics() {
  firmwareStatisticsLoading.value = true;
  try {
    firmwareStatistics.value = await getOtaTaskRecordStatusStatistics(
      firmwareId.value,
    );
  } finally {
    firmwareStatisticsLoading.value = false;
  }
}

/** 初始化 */
onMounted(() => {
  getFirmwareInfo();
  getStatistics();
});
</script>

<template>
  <div class="firmware-detail-container">
    <!-- 固件信息 -->
    <el-card class="info-card" shadow="never" :loading="firmwareLoading">
      <template #header>
        <span class="card-title">固件信息</span>
      </template>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="固件名称">
          {{ firmware?.name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="所属产品">
          {{ firmware?.productName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="固件版本">
          {{ firmware?.version || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{
            firmware?.createTime
              ? formatDate(firmware.createTime, 'YYYY-MM-DD HH:mm:ss')
              : '-'
          }}
        </el-descriptions-item>
        <el-descriptions-item label="固件描述" :span="2">
          {{ firmware?.description || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 升级设备统计 -->
    <el-card class="stats-card" shadow="never" :loading="firmwareStatisticsLoading">
      <template #header>
        <span class="card-title">升级设备统计</span>
      </template>
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <div class="stat-item stat-total">
            <div class="stat-value">
              {{
                Object.values(firmwareStatistics).reduce(
                  (sum: number, count) => sum + (count || 0),
                  0,
                ) || 0
              }}
            </div>
            <div class="stat-label">升级设备总数</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-item stat-pending">
            <div class="stat-value">
              {{
                firmwareStatistics[IoTOtaTaskRecordStatusEnum.PENDING.value] ||
                0
              }}
            </div>
            <div class="stat-label">待推送</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-item stat-pushed">
            <div class="stat-value">
              {{
                firmwareStatistics[IoTOtaTaskRecordStatusEnum.PUSHED.value] || 0
              }}
            </div>
            <div class="stat-label">已推送</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-item stat-upgrading">
            <div class="stat-value">
              {{
                firmwareStatistics[
                  IoTOtaTaskRecordStatusEnum.UPGRADING.value
                  ] || 0
              }}
            </div>
            <div class="stat-label">正在升级</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-item stat-success">
            <div class="stat-value">
              {{
                firmwareStatistics[IoTOtaTaskRecordStatusEnum.SUCCESS.value] ||
                0
              }}
            </div>
            <div class="stat-label">升级成功</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-item stat-failure">
            <div class="stat-value">
              {{
                firmwareStatistics[IoTOtaTaskRecordStatusEnum.FAILURE.value] ||
                0
              }}
            </div>
            <div class="stat-label">升级失败</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-item stat-canceled">
            <div class="stat-value">
              {{
                firmwareStatistics[IoTOtaTaskRecordStatusEnum.CANCELED.value] ||
                0
              }}
            </div>
            <div class="stat-label">升级取消</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 任务管理 -->
    <OtaTaskList
      v-if="firmware?.productId"
      :firmware-id="firmwareId"
      :product-id="firmware.productId"
      @success="getStatistics"
    />
  </div>
</template>

<style scoped>
.firmware-detail-container {
  padding: 16px;
}

.info-card,
.stats-card {
  margin-bottom: 12px;
  border-radius: 8px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
}

.stats-row {
  padding: 12px 0;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background-color: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.stat-value {
  margin-bottom: 4px;
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-total .stat-value {
  color: #409eff;
}

.stat-pending .stat-value {
  color: #909399;
}

.stat-pushed .stat-value {
  color: #409eff;
}

.stat-upgrading .stat-value {
  color: #e6a23c;
}

.stat-success .stat-value {
  color: #67c23a;
}

.stat-failure .stat-value {
  color: #f56c6c;
}

.stat-canceled .stat-value {
  color: #909399;
}

/* 描述列表样式调整 */
:deep(.el-descriptions__label) {
  width: 100px;
  font-weight: 500;
}

:deep(.el-descriptions__cell) {
  padding: 8px 12px;
}
</style>
