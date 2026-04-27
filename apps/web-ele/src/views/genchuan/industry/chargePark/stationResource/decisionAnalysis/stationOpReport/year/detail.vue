<script setup>
import { computed, ref } from 'vue';

import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import { detailFields, pageConfig } from './data.js';
import { formatDateTime } from '../table/data.js';

const props = defineProps({
  detailObj: {
    type: Object,
    default: () => ({}),
  },
});

const drawerRef = ref(null);
const drawerTitle = computed(() => pageConfig.title + '详情');
const detailData = computed(() => ({
  ...props.detailObj,
  generateTime: formatDateTime(props.detailObj.generateTime),
  statPeriod: [
    formatDateTime(props.detailObj.reportStartTime),
    formatDateTime(props.detailObj.reportEndTime),
  ]
    .filter((item) => item !== '--')
    .join(' - '),
}));

function open() {
  drawerRef.value?.open();
}

function close() {
  drawerRef.value?.close();
}

defineExpose({
  open,
  close,
});
</script>

<template>
  <DetailDrawer
    ref="drawerRef"
    :title="drawerTitle"
    :data="detailData"
    :fields="detailFields"
    width="42%"
  />
</template>
