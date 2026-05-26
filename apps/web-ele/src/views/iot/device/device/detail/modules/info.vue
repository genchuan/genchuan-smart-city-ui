<script lang="ts" setup>
import type { IotDeviceApi } from '#/api/iot/device/device';
import type { IotProductApi } from '#/api/iot/product/product';

import { computed, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';
import { formatDateTime } from '@vben/utils';

import {
  ElButton,
  ElCard,
  ElCol,
  ElDescriptions,
  ElForm,
  ElInput,
  ElMessage,
  ElRow,
  ElDialog,
} from 'element-plus';

import { getDeviceAuthInfo } from '#/api/iot/device/device';
import { DictTag } from '#/components/dict-tag';

interface Props {
  device: IotDeviceApi.Device;
  product: IotProductApi.Product;
}

const props = defineProps<Props>();

const authDialogVisible = ref(false);
const authPasswordVisible = ref(false);
const authInfo = ref<IotDeviceApi.DeviceAuthInfo>(
  {} as IotDeviceApi.DeviceAuthInfo,
);

/** 控制地图显示的标志 */
const showMap = computed(() => {
  return !!(props.device.longitude && props.device.latitude);
});

/** 复制到剪贴板 */
async function copyToClipboard(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('复制成功');
  } catch {
    ElMessage.error('复制失败');
  }
}

/** 打开设备认证信息弹框 */
async function handleAuthInfoDialogOpen() {
  if (!props.device.id) return;
  try {
    authInfo.value = await getDeviceAuthInfo(props.device.id);
    authDialogVisible.value = true;
  } catch {
    ElMessage.error('获取设备认证信息失败，请检查网络连接或联系管理员');
  }
}

/** 关闭设备认证信息弹框 */
function handleAuthInfoDialogClose() {
  authDialogVisible.value = false;
}
</script>

<template>
  <div>
    <el-row :gutter="16">
      <!-- 左侧设备信息 -->
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <IconifyIcon class="header-icon" icon="ep:info-filled" />
              <span>设备信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="产品名称">
              {{ props.product.name }}
            </el-descriptions-item>
            <el-descriptions-item label="ProductKey">
              {{ props.product.productKey }}
            </el-descriptions-item>
            <el-descriptions-item label="设备类型">
              <DictTag
                :type="DICT_TYPE.IOT_PRODUCT_DEVICE_TYPE"
                :value="props.product.deviceType"
              />
            </el-descriptions-item>
            <el-descriptions-item label="定位类型">
              <DictTag
                :type="DICT_TYPE.IOT_LOCATION_TYPE"
                :value="props.product.locationType"
              />
            </el-descriptions-item>
            <el-descriptions-item label="DeviceName">
              {{ props.device.deviceName }}
            </el-descriptions-item>
            <el-descriptions-item label="备注名称">
              {{ props.device.nickname || '--' }}
            </el-descriptions-item>
            <el-descriptions-item label="当前状态">
              <DictTag
                :type="DICT_TYPE.IOT_DEVICE_STATE"
                :value="props.device.state"
              />
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDateTime(props.device.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="激活时间">
              {{ formatDateTime(props.device.activeTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后上线时间">
              {{ formatDateTime(props.device.onlineTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后离线时间">
              {{ formatDateTime(props.device.offlineTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="MQTT 连接参数">
              <el-button size="small" link type="primary" @click="handleAuthInfoDialogOpen">
                查看
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 右侧地图 -->
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="map-header">
              <div class="card-header">
                <IconifyIcon class="header-icon" icon="ep:location" />
                <span>设备位置</span>
              </div>
              <div class="last-online-time">
                最后上线：{{ formatDateTime(props.device.onlineTime) || '--' }}
              </div>
            </div>
          </template>
          <div class="map-container">
            <div
              v-if="showMap"
              class="map-placeholder"
            >
              <span class="placeholder-text">地图组件</span>
            </div>
            <div
              v-else
              class="map-empty"
            >
              <IconifyIcon class="empty-icon" icon="ep:warning" />
              <span>暂无位置信息</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 认证信息弹框 -->
    <el-dialog
      v-model="authDialogVisible"
      title="MQTT 连接参数"
      width="640px"
      :close-on-click-modal="false"
      @close="handleAuthInfoDialogClose"
    >
      <el-form :label-width="80">
        <el-form-item label="clientId">
          <div class="input-with-button">
            <el-input
              v-model="authInfo.clientId"
              readonly
              class="flex-1"
            />
            <el-button type="primary" @click="copyToClipboard(authInfo.clientId)">
              <IconifyIcon icon="lucide:copy" />
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="username">
          <div class="input-with-button">
            <el-input
              v-model="authInfo.username"
              readonly
              class="flex-1"
            />
            <el-button type="primary" @click="copyToClipboard(authInfo.username)">
              <IconifyIcon icon="lucide:copy" />
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="password">
          <div class="input-with-button">
            <el-input
              v-model="authInfo.password"
              :type="authPasswordVisible ? 'text' : 'password'"
              readonly
              class="flex-1"
            />
            <el-button type="primary" @click="authPasswordVisible = !authPasswordVisible">
              <IconifyIcon :icon="authPasswordVisible ? 'lucide:eye-off' : 'lucide:eye'" />
            </el-button>
            <el-button type="primary" @click="copyToClipboard(authInfo.password)">
              <IconifyIcon icon="lucide:copy" />
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleAuthInfoDialogClose">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.info-card {
  height: 100%;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
}

.header-icon {
  margin-right: 8px;
  color: #409eff;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.last-online-time {
  font-size: 12px;
  color: #909399;
}

.map-container {
  height: 500px;
  width: 100%;
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.placeholder-text {
  color: #909399;
}

.map-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  color: #c0c4cc;
}

.empty-icon {
  margin-right: 8px;
}

.input-with-button {
  display: flex;
  width: 100%;
  gap: 8px;
}

.flex-1 {
  flex: 1;
}

/* 描述列表样式调整 */
:deep(.el-descriptions__label) {
  width: 140px;
  font-weight: 500;
}

:deep(.el-descriptions__cell) {
  padding: 10px 12px;
}

/* 对话框样式 */
:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>
