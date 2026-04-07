<template>
  <DetailDrawer :title="`调试充电桩 - ${deviceInfo.pileCode || ''}`">
    <div class="debug-container">
      <el-form :model="debugForm" label-width="100px">
        <el-form-item label="设备编号">
          <el-input :value="deviceInfo.pileCode" disabled />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="debugForm.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="功率(kW)">
          <el-input-number v-model="debugForm.power" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="debugForm.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="调试结果">
          <el-input v-model="debugForm.debugResult" type="textarea" rows="3" placeholder="请输入调试结果（如功能检测通过）" />
        </el-form-item>
        <el-form-item label="充电枪二维码" v-if="qrcodeUrl">
          <div class="qrcode-display">
            <img
              :src="qrcodeUrl"
              class="qrcode-img"
              referrerpolicy="no-referrer"
              @click="previewQrcode"
              @error="handleImageError"
            />
            <el-button link type="primary" @click="downloadQrcode">下载二维码</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="debug-actions">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="debugLoading" @click="submitDebug">开始调试</el-button>
      </div>
    </div>
  </DetailDrawer>

  <!-- 二维码预览弹窗 -->
  <el-dialog v-model="previewVisible" title="二维码预览" width="400px" center>
    <div style="text-align: center">
      <img :src="qrcodeUrl" style="width: 100%" referrerpolicy="no-referrer" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { debugPile, updatePile, getQrcode } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

const emit = defineEmits(['success']);

const deviceInfo = ref({});
const debugLoading = ref(false);
const qrcodeUrl = ref('');
const previewVisible = ref(false);

const debugForm = reactive({
  model: '',
  power: null,
  manufacturer: '',
  debugResult: '',
});

// 使用 VbenDrawer 统一样式
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 600,
  onCancel: () => detailDrawerApi.close(),
});

const open = (row) => {
  deviceInfo.value = row;
  debugForm.model = row.model;
  debugForm.power = row.power;
  debugForm.manufacturer = row.manufacturer;
  debugForm.debugResult = '';
  qrcodeUrl.value = '';
  detailDrawerApi.open();
};

const handleClose = () => {
  detailDrawerApi.close();
  emit('success'); // 刷新父组件列表
};

// 处理图片加载失败
const handleImageError = () => {
  console.warn('二维码加载失败', qrcodeUrl.value);
  qrcodeUrl.value = '';
  ElMessage.warning(`充电桩 ${deviceInfo.value.pileCode} 二维码加载失败`);
};

const submitDebug = async () => {
  if (!debugForm.debugResult.trim()) {
    ElMessage.warning('请输入调试结果');
    return;
  }
  debugLoading.value = true;
  try {
    // 更新设备信息
    if (debugForm.model !== deviceInfo.value.model ||
      debugForm.power !== deviceInfo.value.power ||
      debugForm.manufacturer !== deviceInfo.value.manufacturer) {
      await updatePile({
        id: deviceInfo.value.id,
        model: debugForm.model,
        power: debugForm.power,
        manufacturer: debugForm.manufacturer,
      });
    }
    // 调用调试接口
    await debugPile({ id: deviceInfo.value.id, debugResult: debugForm.debugResult });
    // 获取二维码 URL（直接返回图片地址）
    const url = await getQrcode(deviceInfo.value.id);
    // 添加时间戳避免缓存
    const finalUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    qrcodeUrl.value = finalUrl;
    ElMessage.success('调试成功，已生成充电枪二维码');
  } catch (error) {
    ElMessage.error(error.message || '调试失败');
  } finally {
    debugLoading.value = false;
  }
};

const previewQrcode = () => {
  if (qrcodeUrl.value) previewVisible.value = true;
};

const downloadQrcode = async () => {
  if (!qrcodeUrl.value) return;
  // 通过 fetch 下载图片
  try {
    const response = await fetch(qrcodeUrl.value);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `qrcode_${deviceInfo.value.pileCode}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    // 降级：直接打开图片链接
    window.open(qrcodeUrl.value, '_blank');
  }
};

defineExpose({ open });
</script>

<style scoped lang="scss">
.debug-container {
  padding: 20px;
}
.debug-actions {
  margin-top: 30px;
  text-align: right;
}
.qrcode-display {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.qrcode-img {
  width: 100px;
  height: 100px;
  cursor: pointer;
  object-fit: contain;
}
</style>
