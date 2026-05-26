<script lang="ts" setup>
import type { IotDeviceApi } from '#/api/iot/device/device';
import type { IotProductApi } from '#/api/iot/product/product';

import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElCard, ElDescriptions, ElMessage } from 'element-plus';

import DeviceForm from '../../modules/form.vue';

interface Props {
  product: IotProductApi.Product;
  device: IotDeviceApi.Device;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  refresh: [];
}>();

const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DeviceForm,
  destroyOnClose: true,
});

/** 复制到剪贴板 */
async function copyToClipboard(text: string | undefined) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('复制成功');
  } catch {
    ElMessage.error('复制失败');
  }
}

/** 跳转到产品详情页面 */
function goToProductDetail(productId: number | undefined) {
  if (productId) {
    router.push({ name: 'IoTProductDetail', params: { id: productId } });
  }
}

/** 打开编辑表单 */
function openEditForm(row: IotDeviceApi.Device) {
  formModalApi.setData(row).open();
}
</script>

<template>
  <div class="device-header">
    <FormModal @success="emit('refresh')" />

    <div class="header-top">
      <div>
        <h2 class="device-title">{{ device.deviceName }}</h2>
      </div>
      <div class="header-actions">
        <el-button
          v-if="product.status === 0"
          v-access:code="['iot:device:update']"
          type="primary"
          @click="openEditForm(device)"
        >
          编辑
        </el-button>
      </div>
    </div>

    <el-card class="info-card" shadow="hover">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="产品">
          <a class="product-link" @click="goToProductDetail(product.id)">
            {{ product.name }}
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="ProductKey">
          {{ product.productKey }}
          <el-button
            class="copy-btn"
            size="small"
            text
            @click="copyToClipboard(product.productKey)"
          >
            复制
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.device-header {
  margin-bottom: 16px;
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.device-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.info-card {
  margin-top: 16px;
  border-radius: 8px;
}

.product-link {
  cursor: pointer;
  color: #409eff;
  text-decoration: none;
}

.product-link:hover {
  text-decoration: underline;
}

.copy-btn {
  margin-left: 8px;
}

/* 描述列表样式调整 */
:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: 500;
}

:deep(.el-descriptions__cell) {
  padding: 12px 16px;
}
</style>
