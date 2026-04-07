<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">设备编号：</div><div class="detail-row-right">{{ detailObj.pileCode || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">型号：</div><div class="detail-row-right">{{ detailObj.model || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">功率(kW)：</div><div class="detail-row-right">{{ detailObj.power || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">生产厂家：</div><div class="detail-row-right">{{ detailObj.manufacturer || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">所属场站：</div><div class="detail-row-right">{{ detailObj.stationName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">绑定车位：</div><div class="detail-row-right">{{ detailObj.lotName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">充电模式：</div><div class="detail-row-right">{{ detailObj.chargeModeName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">设备状态：</div><div class="detail-row-right">{{ detailObj.pileStatusName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">故障标记：</div><div class="detail-row-right">{{ detailObj.faultFlag ? '有故障' : '无故障' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">运行时长(小时)：</div><div class="detail-row-right">{{ detailObj.runTime || 0 }}</div></div>
      <div class="detail-card-row">
        <div class="detail-row-left">充电枪二维码：</div>
        <div class="detail-row-right">
          <div v-if="qrcodeLoading" class="qrcode-loading">加载中...</div>
          <img
            v-else-if="qrcodeImgUrl"
            :src="qrcodeImgUrl"
            class="qrcode-img"
            referrerpolicy="no-referrer"
            @click="previewQrcode"
            @error="handleImageError"
          />
          <span v-else>暂无二维码</span>
        </div>
      </div>
      <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ detailObj.remark || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建人：</div><div class="detail-row-right">{{ detailObj.creator || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新人：</div><div class="detail-row-right">{{ detailObj.updater || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div></div>
    </div>
  </DetailDrawer>

  <!-- 二维码预览弹窗 -->
  <el-dialog v-model="qrcodePreviewVisible" title="二维码预览" width="400px" center>
    <div style="text-align: center">
      <img :src="qrcodeImgUrl" style="width: 100%" referrerpolicy="no-referrer" />
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, defineProps, toRefs, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { getQrcode } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);
const qrcodePreviewVisible = ref(false);
const qrcodeImgUrl = ref('');
const qrcodeLoading = ref(false);

const drawerTitle = computed(() => {
  const objName = detailObj.value?.pileCode || '充电桩';
  return title.value || `${objName}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() { detailDrawerApi.close(); },
});

// 处理图片加载失败
const handleImageError = () => {
  console.warn('二维码加载失败', qrcodeImgUrl.value);
  qrcodeImgUrl.value = '';
  qrcodeLoading.value = false;
  ElMessage.warning(`充电桩 ${detailObj.value.pileCode} 二维码加载失败`);
};

// 监听 detailObj.id 变化，自动加载二维码
watch(() => detailObj.value.id, async (newId) => {
  if (!newId) return;
  qrcodeLoading.value = true;
  try {
    const url = await getQrcode(newId);
    // 添加时间戳避免缓存
    const finalUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    qrcodeImgUrl.value = finalUrl;
  } catch (error) {
    console.error('获取二维码失败', error);
    qrcodeImgUrl.value = '';
  } finally {
    qrcodeLoading.value = false;
  }
}, { immediate: true });

const previewQrcode = () => {
  if (qrcodeImgUrl.value) qrcodePreviewVisible.value = true;
};

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
@media (max-width: 768px) {
  .detail-row-left { width: 120px; }
  .detail-card { padding: 15px; max-height: 60vh; }
}
.detail-card::-webkit-scrollbar { width: 6px; }
.detail-card::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.detail-card::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
.detail-card::-webkit-scrollbar-thumb:hover { background: #c0c4cc; }
.qrcode-loading {
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 4px;
}
.qrcode-img {
  width: 60px;
  height: 60px;
  cursor: pointer;
  object-fit: contain;
}
</style>
