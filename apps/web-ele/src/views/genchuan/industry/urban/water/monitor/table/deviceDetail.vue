<script setup>
import { ref, defineProps, defineEmits, toRefs, watch } from 'vue';
import { ElDrawer, ElDescriptions, ElDescriptionsItem } from 'element-plus';

const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    default: () => ({}),
  },
});

const { detailObj } = toRefs(props);

// 定义事件
const emit = defineEmits(['close']);

// 抽屉可见性
const drawerVisible = ref(false);

// 打开抽屉
function open() {
  drawerVisible.value = true;
}

// 关闭抽屉
function close() {
  drawerVisible.value = false;
  emit('close');
}

// 监听detailObj变化，当有数据时自动打开抽屉
watch(
  () => detailObj.value,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      open();
    }
  },
  { deep: true }
);

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open,
  close,
});
</script>

<template>
  <ElDrawer
    v-model="drawerVisible"
    title="设备详情"
    :width="600"
    :append-to-body="true"
    @close="close"
  >
    <div class="device-detail-container">
      <ElDescriptions :column="1" border>
        <ElDescriptionsItem label="设备编号">{{ detailObj.deviceCode }}</ElDescriptionsItem>
        <ElDescriptionsItem label="设备状态">{{ detailObj.deviceStatus }}</ElDescriptionsItem>
        <ElDescriptionsItem label="管网分区">{{ detailObj.pipeArea }}</ElDescriptionsItem>
        <ElDescriptionsItem label="管网压力">{{ detailObj.pipePressure }}MPa</ElDescriptionsItem>
        <ElDescriptionsItem label="管网流量">{{ detailObj.pipeFlow }}m³/h</ElDescriptionsItem>
        <ElDescriptionsItem label="泄漏状态">{{ detailObj.leakStatus }}</ElDescriptionsItem>
        <ElDescriptionsItem label="负责维修员">{{ detailObj.staffName }}</ElDescriptionsItem>
        <ElDescriptionsItem label="数据采集频率">{{ detailObj.collectFrequency }}</ElDescriptionsItem>
        <ElDescriptionsItem label="监测状态">{{ detailObj.monitorStatus }}</ElDescriptionsItem>
        <ElDescriptionsItem label="数据同步时长">{{ detailObj.syncDuration }}秒</ElDescriptionsItem>
        <ElDescriptionsItem label="最近更新时间">{{ detailObj.updateTime }}</ElDescriptionsItem>
      </ElDescriptions>
    </div>
  </ElDrawer>
</template>

<style scoped>
.device-detail-container {
  padding: 20px;
}
</style>