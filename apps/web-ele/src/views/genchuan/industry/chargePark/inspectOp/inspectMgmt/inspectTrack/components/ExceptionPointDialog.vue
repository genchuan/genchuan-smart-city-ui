<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElEmpty, ElTable, ElTableColumn, ElTag } from 'element-plus';

import { formatTrackTime } from '../table/data';

const rowData = shallowRef({});

const exceptionPoints = computed(() => {
  let list = [];
  if (
    Array.isArray(rowData.value.exceptionPoints) &&
    rowData.value.exceptionPoints.length > 0
  ) {
    list = rowData.value.exceptionPoints;
  }
  if (
    list.length === 0 &&
    rowData.value.exceptionCount > 0 &&
    rowData.value.trackPointList?.length > 0
  ) {
    list = rowData.value.trackPointList.slice(0, rowData.value.exceptionCount);
  }
  return list.map((point, index) => ({
    ...point,
    type: point.type || '轨迹异常',
    lon: point.lon ?? point.lng ?? point.longitude,
    lat: point.lat ?? point.latitude,
    desc: point.desc || point.remark || rowData.value.exceptionSummary,
    name: point.name || `异常点 ${index + 1}`,
  }));
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  title: '异常点详情',
  width: 720,
  onOpenChange(isOpen) {
    if (!isOpen) return;
    rowData.value = modalApi.getData() || {};
  },
});

function open(row) {
  modalApi.setData(row || {}).open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="exception-summary">
      <ElTag type="danger" effect="plain">
        {{ rowData.exceptionText || '异常点' }}
      </ElTag>
      <span>轨迹ID：{{ rowData.id || '-' }}</span>
      <span>巡检人员：{{ rowData.userName || '-' }}</span>
      <span>所属片区：{{ rowData.area || '-' }}</span>
    </div>

    <ElTable v-if="exceptionPoints.length > 0" :data="exceptionPoints" border>
      <ElTableColumn label="序号" type="index" width="70" />
      <ElTableColumn label="异常类型" min-width="120">
        <template #default="{ row }">
          {{ row.type || '轨迹异常' }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="经度" min-width="130">
        <template #default="{ row }">{{ row.lon || row.lng || '-' }}</template>
      </ElTableColumn>
      <ElTableColumn label="纬度" min-width="130">
        <template #default="{ row }">{{ row.lat || '-' }}</template>
      </ElTableColumn>
      <ElTableColumn label="上报时间" min-width="170">
        <template #default="{ row }">
          {{ row.time ? formatTrackTime(row.time) : '-' }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="说明" min-width="220">
        <template #default="{ row }">
          {{ row.desc || row.remark || rowData.exceptionSummary || '-' }}
        </template>
      </ElTableColumn>
    </ElTable>
    <ElEmpty v-else description="暂无异常点明细" />
  </Modal>
</template>

<style scoped>
.exception-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}
</style>
