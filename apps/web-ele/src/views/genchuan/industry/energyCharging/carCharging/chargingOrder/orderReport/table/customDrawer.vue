<template>
  <DetailDrawer title="自定义报表生成" width="700px">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
      <el-form-item label="报表名称" prop="reportName">
        <el-input v-model="form.reportName" placeholder="请输入报表名称" />
      </el-form-item>
      <el-form-item label="报表类型" prop="reportType">
        <el-select v-model="form.reportType" placeholder="请选择">
          <el-option v-for="(label, key) in reportTypeMap" :key="key" :label="label" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间尺度" prop="timeScale">
        <el-select v-model="form.timeScale" placeholder="请选择">
          <el-option v-for="(label, key) in timeScaleMap" :key="key" :label="label" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="统计周期" prop="dateRange" required>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="所属场站" prop="stationId">
        <el-select v-model="form.stationId" placeholder="请选择场站" clearable filterable>
          <el-option v-for="station in stationList" :key="station.id" :label="station.name" :value="station.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="form.orderStatus" placeholder="请选择" clearable>
          <el-option label="已完成" value="completed" />
          <el-option label="充电中" value="charging" />
          <el-option label="待支付" value="pending" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </el-form-item>
      <el-form-item label="异常类型" prop="abnormalType">
        <el-select v-model="form.abnormalType" placeholder="请选择" clearable>
          <el-option label="超时未支付" value="timeout" />
          <el-option label="充电中断" value="interrupt" />
          <el-option label="计费异常" value="billing" />
        </el-select>
      </el-form-item>
      <el-form-item label="退款状态" prop="refundStatus">
        <el-select v-model="form.refundStatus" placeholder="请选择" clearable>
          <el-option label="退款中" value="processing" />
          <el-option label="已退款" value="completed" />
          <el-option label="退款失败" value="failed" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="drawer-actions">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">生成报表</el-button>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { customCreateReport } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderReport/index.js';
import { reportTypeMap, timeScaleMap } from './data.js';

const emit = defineEmits(['success']);

const formRef = ref(null);
const submitting = ref(false);
const dateRange = ref([]);

const form = ref({
  reportName: '',
  reportType: 'comprehensive',
  timeScale: 'month',
  stationId: null,
  orderStatus: null,
  abnormalType: null,
  refundStatus: null,
});

const rules = {
  reportName: [{ required: true, message: '请输入报表名称', trigger: 'blur' }],
  reportType: [{ required: true, message: '请选择报表类型', trigger: 'change' }],
  timeScale: [{ required: true, message: '请选择时间尺度', trigger: 'change' }],
};

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel: () => detailDrawerApi.close(),
});

const open = () => {
  form.value = {
    reportName: '',
    reportType: 'comprehensive',
    timeScale: 'month',
    stationId: null,
    orderStatus: null,
    abnormalType: null,
    refundStatus: null,
  };
  dateRange.value = [];
  detailDrawerApi.open();
};

const handleClose = () => {
  detailDrawerApi.close();
};

const submit = async () => {
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.warning('请选择统计周期');
    return;
  }
  submitting.value = true;
  try {
    await customCreateReport({
      ...form.value,
      startTime: `${dateRange.value[0]} 00:00:00`,
      endTime: `${dateRange.value[1]} 23:59:59`,
    });
    ElMessage.success('自定义报表生成任务已提交，稍后刷新列表查看');
    detailDrawerApi.close();
    emit('success');
  } catch (error) {
    ElMessage.error(error.message || '生成失败');
  } finally {
    submitting.value = false;
  }
};

// 模拟场站列表（实际应从接口获取）
const stationList = ref([
  { id: 1, name: '丰泽站' },
  { id: 2, name: '洛江站' },
  { id: 3, name: '鲤城站' },
]);

defineExpose({ open });
</script>

<style scoped>
.drawer-actions {
  margin-top: 30px;
  text-align: right;
}
</style>
