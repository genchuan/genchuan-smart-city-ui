<template>
  <DetailDrawer title="车位详情">
    <div class="detail-card">
      <div v-if="spaceData" class="detail-card-content">
        <div class="detail-card-row"><div class="detail-row-left">车位ID：</div><div class="detail-row-right">{{ spaceData.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">车位编号：</div><div class="detail-row-right">{{ spaceData.spaceNo || spaceData.no || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">所属场站：</div><div class="detail-row-right">{{ spaceData.stationName || spaceData.stationId || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">车位类型：</div><div class="detail-row-right">{{ spaceData.spaceType || spaceData.type || '-' }}</div></div>
        <div class="detail-card-row">
          <div class="detail-row-left">车位状态：</div>
          <div class="detail-row-right">
            <el-tag v-if="spaceData.status" :type="statusTag(spaceData.status)">{{ spaceData.status }}</el-tag>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row"><div class="detail-row-left">所在楼层：</div><div class="detail-row-right">{{ spaceData.floor ?? '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">所在区域：</div><div class="detail-row-right">{{ spaceData.zone || spaceData.area || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ spaceData.remark || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ fmtTime(spaceData.createTime) }}</div></div>
      </div>
      <el-empty v-else description="暂无车位数据" />
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElEmpty, ElTag } from 'element-plus';

const fmtTime = (t) => {
  if (!t) return '-';
  const d = new Date(t);
  if (isNaN(d.getTime())) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const statusTag = (s) => {
  if (/空闲|可用/.test(s)) return 'success';
  if (/占用|已用/.test(s)) return 'warning';
  if (/禁用|维护|关闭/.test(s)) return 'danger';
  return 'info';
};

const spaceData = ref(null);
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
const open = (data) => { spaceData.value = data; detailDrawerApi.open(); };
const close = () => { detailDrawerApi.close(); spaceData.value = null; };
defineExpose({ open, close });
</script>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; min-height: 450px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #f0f0f0; &:last-child { border-bottom: none; } }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; font-size: 14px; }
.detail-row-right { flex: 1; color: #303133; font-size: 14px; word-break: break-all; }
</style>
