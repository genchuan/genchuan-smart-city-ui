<script setup>
import { defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的name）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="title || `${detailObj.name}关联表`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">停车场ID:</div>
        <div class="detail-row-right">{{ detailObj.id }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">收费标准:</div>
        <div class="detail-row-right">{{ detailObj.pricing }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">详细地址:</div>
        <div class="detail-row-right">{{ detailObj.address }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区划代码:</div>
        <div class="detail-row-right">{{ detailObj.grid }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系电话:</div>
        <div class="detail-row-right">{{ detailObj.phone }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">状态:</div>
        <div class="detail-row-right">{{ detailObj.status }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">泊位总数:</div>
        <div class="detail-row-right">{{ detailObj.parkTotal }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>
