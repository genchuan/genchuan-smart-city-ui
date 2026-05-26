<!-- header.vue - 产品详情头部组件 -->
<script setup>
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { ProductStatusEnum } from '@vben/constants';

import { ElButton, ElCard, ElDescriptions, ElMessage, ElMessageBox } from 'element-plus';

import { updateProductStatus } from '#/api/iot/product/product';

import Form from '../../modules/form.vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['refresh']);

const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 复制到剪贴板 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('复制成功');
  } catch {
    ElMessage.error('复制失败');
  }
}

/** 跳转到设备管理 */
function goToDeviceList(productId) {
  router.push({
    path: '/iot/device/device',
    query: { productId: String(productId) },
  });
}

/** 打开编辑表单 */
function openEditForm(row) {
  formModalApi.setData(row).open();
}

/** 发布产品 */
function handlePublish(product) {
  ElMessageBox.confirm(
    `确认要发布产品「${product.name}」吗？`,
    '确认发布',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(async () => {
    await updateProductStatus(product.id, ProductStatusEnum.PUBLISHED);
    ElMessage.success('发布成功');
    emit('refresh');
  }).catch(() => {});
}

/** 撤销发布 */
function handleUnpublish(product) {
  ElMessageBox.confirm(
    `确认要撤销发布产品「${product.name}」吗？`,
    '确认撤销发布',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    await updateProductStatus(product.id, ProductStatusEnum.UNPUBLISHED);
    ElMessage.success('撤销发布成功');
    emit('refresh');
  }).catch(() => {});
}
</script>

<template>
  <div class="mb-4">
    <FormModal @success="emit('refresh')" />

    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold">{{ product.name }}</h2>
      </div>
      <div class="space-x-2">
        <el-button
          :disabled="product.status === ProductStatusEnum.PUBLISHED"
          @click="openEditForm(product)"
        >
          编辑
        </el-button>
        <el-button
          v-if="product.status === ProductStatusEnum.UNPUBLISHED"
          type="primary"
          @click="handlePublish(product)"
        >
          发布
        </el-button>
        <el-button
          v-if="product.status === ProductStatusEnum.PUBLISHED"
          type="danger"
          @click="handleUnpublish(product)"
        >
          撤销发布
        </el-button>
      </div>
    </div>

    <el-card class="mt-4">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ProductKey">
          {{ product.productKey }}
          <el-button class="ml-2" size="small" @click="copyToClipboard(product.productKey || '')">
            复制
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="设备总数">
          <span class="ml-5 mr-2">
            {{ product.deviceCount ?? '加载中...' }}
          </span>
          <el-button size="small" @click="goToDeviceList(product.id)">
            前往管理
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
.mt-4 {
  margin-top: 1rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.ml-5 {
  margin-left: 1.25rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.flex {
  display: flex;
}
.items-start {
  align-items: flex-start;
}
.justify-between {
  justify-content: space-between;
}
.space-x-2 > :not(:last-child) {
  margin-right: 0.5rem;
}
.text-xl {
  font-size: 1.25rem;
}
.font-bold {
  font-weight: 700;
}
</style>
