<!-- module-alarm/table/repairDrawer.vue -->
<template>
  <DetailDrawer :title="`修复告警 - ${alarmCode}`">
    <el-form :model="form" label-width="100px">
      <el-form-item label="修复凭证" required>
        <el-upload
          ref="uploadRef"
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept="image/*,application/pdf"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">支持 jpg/png/pdf，不超过10MB</div>
          </template>
        </el-upload>
        <div v-if="form.repairVoucherUrl" class="voucher-preview">
          <el-link type="primary" @click="previewVoucher(form.repairVoucherUrl)">查看已上传凭证</el-link>
        </div>
      </el-form-item>
    </el-form>
    <div class="debug-actions">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitRepair">确认修复</el-button>
    </div>
  </DetailDrawer>

  <el-dialog v-model="previewVisible" title="修复凭证预览" width="600px" center>
    <div style="text-align: center">
      <iframe v-if="isPdf(previewUrl)" :src="previewUrl" width="100%" height="500px" />
      <img v-else :src="previewUrl" style="max-width: 100%" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { repairAlarm, uploadRepairVoucher } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/moduleAlarm/index.js';

const emit = defineEmits(['success']);

const alarmId = ref(null);
const alarmCode = ref('');
const form = ref({ repairVoucherUrl: '' });
const loading = ref(false);
const previewVisible = ref(false);
const previewUrl = ref('');

const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 600,
  onCancel: () => detailDrawerApi.close(),
});

const open = (id, code = '') => {
  alarmId.value = id;
  alarmCode.value = code;
  form.value.repairVoucherUrl = '';
  detailDrawerApi.open();
};

const handleClose = () => {
  detailDrawerApi.close();
};

const handleFileChange = async (file) => {
  const formData = new FormData();
  formData.append('file', file.raw);
  try {
    const url = await uploadRepairVoucher(formData);
    form.value.repairVoucherUrl = url;
    ElMessage.success('凭证上传成功');
  } catch (error) {
    ElMessage.error('凭证上传失败');
  }
};

const previewVoucher = (url) => {
  previewUrl.value = url;
  previewVisible.value = true;
};

const submitRepair = async () => {
  if (!form.value.repairVoucherUrl) {
    ElMessage.warning('请上传修复凭证');
    return;
  }
  loading.value = true;
  try {
    await repairAlarm({ id: alarmId.value, repairVoucher: form.value.repairVoucherUrl });
    ElMessage.success('修复成功，告警状态已更新为“修复中”');
    detailDrawerApi.close();
    emit('success');
  } catch (error) {
    ElMessage.error(error.message || '修复失败');
  } finally {
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<style scoped>
.debug-actions {
  margin-top: 30px;
  text-align: right;
}
.voucher-preview {
  margin-top: 8px;
}
</style>
