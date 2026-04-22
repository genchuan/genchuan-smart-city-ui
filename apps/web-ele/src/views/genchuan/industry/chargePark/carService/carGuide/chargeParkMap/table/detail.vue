<template>
  <el-drawer v-model="visible" title="充停地图查询详情" size="40%" @close="close">
    <div class="detail-content">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="查询ID">{{ data.id }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ data.userName }}</el-descriptions-item>
        <el-descriptions-item label="查询位置">{{ data.queryLocation }}</el-descriptions-item>
        <el-descriptions-item label="查询时间">{{ data.queryTime }}</el-descriptions-item>
        <el-descriptions-item label="查询结果数">{{ data.resultCount }}</el-descriptions-item>
        <el-descriptions-item label="响应时长">{{ data.responseDuration }} ms</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ data.createTime }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ detailData: Object });
const visible = ref(false);
const data = ref({});

watch(
  () => props.detailData,
  (val) => {
    if (val) data.value = val;
  },
  { immediate: true, deep: true }
);

const open = () => (visible.value = true);
const close = () => (visible.value = false);

defineExpose({ open, close });
</script>
