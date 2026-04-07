<!-- module-alarm/remarkDrawer.vue -->
<template>
  <DetailDrawer :title="`备注告警 - ${alarmCode}`">
    <el-form :model="form" label-width="100px">
      <el-form-item label="备注内容">
        <el-input v-model="form.remark" type="textarea" rows="4" placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <div class="debug-actions">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitRemark">保存备注</el-button>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { remarkAlarm } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/moduleAlarm/index.js';

const emit = defineEmits(['success']);

const alarmId = ref(null);
const alarmCode = ref('');
const form = ref({ remark: '' });
const loading = ref(false);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 600,
  onCancel: () => detailDrawerApi.close(),
});

const open = (id, code = '', existingRemark = '') => {
  alarmId.value = id;
  alarmCode.value = code;
  form.value.remark = existingRemark || '';
  detailDrawerApi.open();
};

const handleClose = () => {
  detailDrawerApi.close();
};

const submitRemark = async () => {
  loading.value = true;
  try {
    await remarkAlarm({ id: alarmId.value, remark: form.value.remark });
    ElMessage.success('备注保存成功');
    detailDrawerApi.close();
    emit('success');
  } catch (error) {
    ElMessage.error(error.message || '保存备注失败');
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
