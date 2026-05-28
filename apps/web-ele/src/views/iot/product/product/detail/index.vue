<!-- detail/index.vue - 产品详情页面 -->
<script setup>
import { onMounted, provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { ElMessage, ElTabs, ElTabPane } from 'element-plus';

import { getDeviceCount } from '#/api/iot/device/device';
import { getProduct } from '#/api/iot/product/product';
import IoTProductThingModel from '#/views/iot/thingmodel/index.vue';

import ProductDetailsHeader from './modules/header.vue';
import ProductDetailsInfo from './modules/info.vue';

defineOptions({ name: 'IoTProductDetail' });

const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);
const loading = ref(true);
const product = ref({});
const activeTab = ref('info');

provide('product', product);

/** 获取产品详情 */
async function getProductData(productId) {
  loading.value = true;
  try {
    product.value = await getProduct(productId);
  } catch {
    ElMessage.error('获取产品详情失败');
  } finally {
    loading.value = false;
  }
}

/** 查询设备数量 */
async function getDeviceCountData(productId) {
  try {
    return await getDeviceCount(productId);
  } catch {
    ElMessage.error('获取设备数量失败');
    return 0;
  }
}

/** 初始化 */
onMounted(async () => {
  if (!id) {
    ElMessage.warning('参数错误，产品不能为空！');
    router.back();
    return;
  }
  await getProductData(id);

  // 处理 tab 参数
  const { tab } = route.query;
  if (tab) {
    activeTab.value = tab;
  }
  // 查询设备数量
  if (product.value.id) {
    product.value.deviceCount = await getDeviceCountData(product.value.id);
  }
});
</script>

<template>
  <Page>
    <ProductDetailsHeader
      :loading="loading"
      :product="product"
      @refresh="() => getProductData(id)"
    />
    <el-tabs v-model="activeTab" class="mt-4">
      <el-tab-pane label="产品信息" name="info">
        <ProductDetailsInfo v-if="activeTab === 'info'" :product="product" />
      </el-tab-pane>
      <el-tab-pane label="物模型（功能定义）" name="thingModel">
        <IoTProductThingModel
          v-if="activeTab === 'thingModel'"
          :product-id="id"
        />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}
</style>
