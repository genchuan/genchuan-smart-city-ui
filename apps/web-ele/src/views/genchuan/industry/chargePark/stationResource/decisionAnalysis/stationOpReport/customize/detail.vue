<script setup>
import { computed, ref } from 'vue';

import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import { formatDateTime, formatStatPeriod } from '../table/data.js';
import { detailFields, pageConfig } from './data.js';

const props = defineProps({
  detailObj: {
    type: Object,
    default: () => ({}),
  },
});

const drawerRef = ref(null);
const drawerTitle = computed(() => `${pageConfig.title}详情`);
const detailData = computed(() => ({
  ...props.detailObj,
  generateTime: formatDateTime(props.detailObj.generateTime),
  statPeriod: formatStatPeriod(props.detailObj),
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
