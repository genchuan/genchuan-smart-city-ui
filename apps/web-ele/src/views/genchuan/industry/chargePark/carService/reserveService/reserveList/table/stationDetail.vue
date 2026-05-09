<template>
  <DetailDrawer title="场站详情">
    <div class="detail-card">
      <div v-if="stationData" class="detail-card-content">
        <div class="detail-card-row"><div class="detail-row-left">场站ID：</div><div class="detail-row-right">{{ stationData.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">场站名称：</div><div class="detail-row-right">{{ stationData.name || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">场站地址：</div><div class="detail-row-right">{{ stationData.address || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">联系电话：</div><div class="detail-row-right">{{ stationData.phone || stationData.contactPhone || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">车位总数：</div><div class="detail-row-right">{{ stationData.spaceTotal ?? stationData.totalSpaceCount ?? '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">空闲车位：</div><div class="detail-row-right">{{ stationData.emptySpace ?? stationData.freeSpaceCount ?? '-' }}</div></div>
        <div class="detail-card-row">
          <div class="detail-row-left">场站状态：</div>
          <div class="detail-row-right">
            <el-tag v-if="stationData.status" :type="statusTag(stationData.status)">{{ stationData.status }}</el-tag>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row"><div class="detail-row-left">所属片区：</div><div class="detail-row-right">{{ stationData.areaName || stationData.areaId || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ stationData.remark || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ fmtTime(stationData.createTime) }}</div></div>
      </div>
      <el-empty v-else description="暂无场站数据" />
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
  if (/正常|启用|开放/.test(s)) return 'success';
  if (/禁用|关闭/.test(s)) return 'danger';
  if (/维护|待/.test(s)) return 'warning';
  return 'info';
};

const stationData = ref(null);
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
const open = (data) => { stationData.value = data; detailDrawerApi.open(); };
const close = () => { detailDrawerApi.close(); stationData.value = null; };
defineExpose({ open, close });
</script>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; min-height: 450px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #f0f0f0; &:last-child { border-bottom: none; } }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; font-size: 14px; }
.detail-row-right { flex: 1; color: #303133; font-size: 14px; word-break: break-all; }
</style>
