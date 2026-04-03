<!-- module-alarm/debugDrawer.vue -->
<template>
  <DetailDrawer :title="`排查告警 - ${alarmCode}`">
    <el-form :model="form" label-width="100px">
      <el-form-item label="排查原因" required>
        <el-input v-model="form.checkReason" type="textarea" rows="4" placeholder="请输入异常排查原因" />
      </el-form-item>
    </el-form>
    <div class="debug-actions">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitCheck">确认排查</el-button>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { checkAlarm } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/moduleAlarm/index.js';

const emit = defineEmits(['success']);

const alarmId = ref(null);
const alarmCode = ref('');
const form = ref({ checkReason: '' });
const loading = ref(false);

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
  form.value.checkReason = '';
  detailDrawerApi.open();
};

const handleClose = () => {
  detailDrawerApi.close();
};

const submitCheck = async () => {
  if (!form.value.checkReason.trim()) {
    ElMessage.warning('请输入排查原因');
    return;
  }
  loading.value = true;
  try {
    await checkAlarm({ id: alarmId.value, checkReason: form.value.checkReason });
    ElMessage.success('排查成功，告警状态已更新为“已排查”');
    detailDrawerApi.close();
    emit('success');
  } catch (error) {
    ElMessage.error(error.message || '排查失败');
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
</style>
