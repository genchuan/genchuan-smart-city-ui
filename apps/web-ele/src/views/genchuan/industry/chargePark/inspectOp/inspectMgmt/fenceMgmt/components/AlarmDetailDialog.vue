<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElEmpty, ElTable, ElTableColumn, ElTag } from 'element-plus';

const rowData = shallowRef({});

const alarmList = computed(() =>
  Array.isArray(rowData.value.alarmDetails) ? rowData.value.alarmDetails : [],
);

const [Modal, modalApi] = useVbenModal({
  footer: false,
  title: '围栏告警明细',
  width: 760,
  onOpenChange(isOpen) {
    if (!isOpen) return;
    rowData.value = modalApi.getData() || {};
  },
});

function open(row) {
  rowData.value = row || {};
  modalApi.setData(row || {}).open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="alarm-summary">
      <ElTag type="danger" effect="plain">
        告警 {{ rowData.alarmCount || 0 }} 次
      </ElTag>
      <span>围栏：{{ rowData.name || '-' }}</span>
      <span>关联人员：{{ rowData.userName || '-' }}</span>
      <span>状态：{{ rowData.status || '-' }}</span>
    </div>

    <ElTable v-if="alarmList.length > 0" :data="alarmList" border>
      <ElTableColumn label="序号" type="index" width="70" />
      <ElTableColumn label="告警时间" prop="alarmTimeStr" min-width="180" />
      <ElTableColumn label="巡检人员" prop="userName" min-width="120" />
      <ElTableColumn label="告警内容" prop="content" min-width="260" />
    </ElTable>
    <ElEmpty v-else description="暂无围栏告警明细" />
  </Modal>
</template>

<style scoped>
.alarm-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}
</style>
