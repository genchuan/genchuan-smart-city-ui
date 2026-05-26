<script lang="ts" setup>
import type { IotDeviceApi } from '#/api/iot/device/device';
import type { IotProductApi } from '#/api/iot/product/product';
import type { ThingModelData } from '#/api/iot/thingmodel';

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { DeviceTypeEnum } from '@vben/constants';

import { ElMessage, ElTabs, ElTabPane } from 'element-plus';

import { getDevice } from '#/api/iot/device/device';
import { getProduct } from '#/api/iot/product/product';
import { getThingModelListByProductId } from '#/api/iot/thingmodel';

import DeviceDetailConfig from './modules/config.vue';
import DeviceDetailsHeader from './modules/header.vue';
import DeviceDetailsInfo from './modules/info.vue';
import DeviceDetailsMessage from './modules/message.vue';
import DeviceDetailsSimulator from './modules/simulator.vue';
import DeviceDetailsSubDevice from './modules/sub-device.vue';
import DeviceDetailsThingModel from './modules/thing-model.vue';

defineOptions({ name: 'IoTDeviceDetail' });

const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);
const loading = ref(true);
const product = ref<IotProductApi.Product>({} as IotProductApi.Product);
const device = ref<IotDeviceApi.Device>({} as IotDeviceApi.Device);
const activeTab = ref('info');
const thingModelList = ref<ThingModelData[]>([]);

/** 获取设备详情 */
async function getDeviceData(deviceId: number) {
  loading.value = true;
  try {
    device.value = await getDevice(deviceId);
    await getProductData(device.value.productId);
    await getThingModelList(device.value.productId);
  } catch {
    ElMessage.error('获取设备详情失败');
  } finally {
    loading.value = false;
  }
}

/** 获取产品详情 */
async function getProductData(productId: number) {
  try {
    product.value = await getProduct(productId);
  } catch {
    ElMessage.error('获取产品详情失败');
  }
}

/** 获取物模型列表 */
async function getThingModelList(productId: number) {
  try {
    const data = await getThingModelListByProductId(productId);
    thingModelList.value = data || [];
  } catch {
    ElMessage.error('获取物模型列表失败');
    thingModelList.value = [];
  }
}

/** 初始化 */
onMounted(async () => {
  if (!id) {
    ElMessage.warning('参数错误，设备不能为空！');
    router.back();
    return;
  }

  await getDeviceData(id);

  // 处理 tab 参数
  const { tab } = route.query;
  if (tab) {
    activeTab.value = tab as string;
  }
});
</script>

<template>
  <Page>
    <DeviceDetailsHeader
      :device="device"
      :loading="loading"
      :product="product"
      @refresh="() => getDeviceData(id)"
    />

    <el-tabs v-model="activeTab" class="device-tabs">
      <el-tab-pane label="设备信息" name="info">
        <DeviceDetailsInfo
          v-if="activeTab === 'info'"
          :device="device"
          :product="product"
        />
      </el-tab-pane>
      <el-tab-pane label="物模型数据" name="model">
        <DeviceDetailsThingModel
          v-if="activeTab === 'model' && device.id"
          :device-id="device.id"
          :thing-model-list="thingModelList"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="product.deviceType === DeviceTypeEnum.GATEWAY"
        label="子设备管理"
        name="sub-device"
      >
        <DeviceDetailsSubDevice
          v-if="activeTab === 'sub-device' && device.id"
          :device-id="device.id"
        />
      </el-tab-pane>
      <el-tab-pane label="设备消息" name="log">
        <DeviceDetailsMessage
          v-if="activeTab === 'log' && device.id"
          :device-id="device.id"
        />
      </el-tab-pane>
      <el-tab-pane label="模拟设备" name="simulator">
        <DeviceDetailsSimulator
          v-if="activeTab === 'simulator'"
          :device="device"
          :product="product"
          :thing-model-list="thingModelList"
        />
      </el-tab-pane>
      <el-tab-pane label="设备配置" name="config">
        <DeviceDetailConfig
          v-if="activeTab === 'config'"
          :device="device"
          @success="() => getDeviceData(id)"
        />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<style scoped>
.device-tabs {
  margin-top: 16px;
}

:deep(.el-tabs__header) {
  margin-bottom: 16px;
}
</style>
