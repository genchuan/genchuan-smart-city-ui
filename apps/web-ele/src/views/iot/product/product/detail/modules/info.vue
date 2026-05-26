<!-- info.vue - 产品信息组件 -->
<script setup>
import { DeviceTypeEnum, DICT_TYPE } from '@vben/constants';

import { ElCard, ElDescriptions } from 'element-plus';

import { DictTag } from '#/components/dict-tag';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

/** 格式化日期 */
function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN');
}
</script>

<template>
  <el-card class="product-info-card">
    <template #header>
      <span>产品信息</span>
    </template>
    <el-descriptions :column="3" border size="small">
      <el-descriptions-item label="产品名称">
        {{ product.name }}
      </el-descriptions-item>
      <el-descriptions-item label="所属分类">
        {{ product.categoryName || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="设备类型">
        <DictTag
          :type="DICT_TYPE.IOT_PRODUCT_DEVICE_TYPE"
          :value="product.deviceType"
        />
      </el-descriptions-item>
      <el-descriptions-item label="定位类型">
        {{ product.locationType ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ formatDate(product.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="数据格式">
        {{ product.codecType || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="产品状态">
        <DictTag :type="DICT_TYPE.IOT_PRODUCT_STATUS" :value="product.status" />
      </el-descriptions-item>
      <el-descriptions-item
        v-if="
          [DeviceTypeEnum.DEVICE, DeviceTypeEnum.GATEWAY].includes(
            product.deviceType,
          )
        "
        label="联网方式"
      >
        <DictTag :type="DICT_TYPE.IOT_NET_TYPE" :value="product.netType" />
      </el-descriptions-item>
      <el-descriptions-item :span="3" label="产品描述">
        {{ product.description || '-' }}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<style scoped>
.product-info-card {
  margin-top: 0;
}
</style>
