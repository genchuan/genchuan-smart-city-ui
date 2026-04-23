<!-- module-alarm/table/detail.vue -->
<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">告警编号：</div><div class="detail-row-right">{{ detailObj.alarmCode || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">模块名称：</div><div class="detail-row-right">{{ detailObj.moduleName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">异常类型：</div><div class="detail-row-right">{{ detailObj.abnormalName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">告警等级：</div><div class="detail-row-right">{{ detailObj.alarmLevelName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">告警时间：</div><div class="detail-row-right">{{ detailObj.alarmTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">服务器信息：</div><div class="detail-row-right">{{ detailObj.serverInfo || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">告警状态：</div><div class="detail-row-right">{{ detailObj.alarmStatusName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">排查原因：</div><div class="detail-row-right">{{ detailObj.checkReason || '-' }}</div></div>
      <div class="detail-card-row">
        <div class="detail-row-left">修复凭证：</div>
        <div class="detail-row-right">
          <el-button v-if="detailObj.repairVoucher" link type="primary" @click="previewVoucher(detailObj.repairVoucher)">预览凭证</el-button>
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row"><div class="detail-row-left">修复时间：</div><div class="detail-row-right">{{ detailObj.repairTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ detailObj.updaterName || detailObj.updater || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ detailObj.remark || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div></div>
    </div>
  </DetailDrawer>

  <el-dialog v-model="voucherPreviewVisible" title="修复凭证预览" width="600px" center>
    <div style="text-align: center">
      <iframe v-if="isPdf(voucherPreviewUrl)" :src="voucherPreviewUrl" width="100%" height="500px" />
      <img v-else :src="voucherPreviewUrl" style="max-width: 100%" />
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
});

const drawerTitle = computed(() => {
  const code = props.detailObj.alarmCode || '告警';
  return `${code} 详情`;
});

const voucherPreviewVisible = ref(false);
const voucherPreviewUrl = ref('');

const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');

const previewVoucher = (url) => {
  voucherPreviewUrl.value = url;
  voucherPreviewVisible.value = true;
};

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() { detailDrawerApi.close(); },
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}
.detail-row-left {
  width: 140px !important;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}
</style>
