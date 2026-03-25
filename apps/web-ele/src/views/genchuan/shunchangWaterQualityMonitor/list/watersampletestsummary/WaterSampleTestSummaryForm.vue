<script setup lang="ts">
import type { WaterSampleTestSummaryVO } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary'

import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

import {
  WaterSampleTestSummaryApi
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';
/** 外检统计水质检测结果汇总 表单 */
defineOptions({ name: 'WaterSampleTestSummaryForm' });

const emit = defineEmits(['success']);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const formLoading = ref(false);
const formType = ref('');
const formData = ref({
  id: undefined,
  clientName: undefined,
  receiveDate: undefined,
  sampleNo: undefined,
  sampleName: undefined,
  samplingLocation: undefined,
  phValue: undefined,
  ammoniaN: undefined,
  odourTaste: undefined,
  escherichiaColi: undefined,
  dichlorobromomethane: undefined,
  dichloroaceticAcid: undefined,
  chlorineDioxide: undefined,
  fluoride: undefined,
  permanganateIndex: undefined,
  cadmium: undefined,
  chromium: undefined,
  mercury: undefined,
  turbidity: undefined,
  totalBacteriaCount: undefined,
  sulfate: undefined,
  aluminum: undefined,
  chloride: undefined,
  chlorate: undefined,
  manganese: undefined,
  lead: undefined,
  cyanide: undefined,
  dissolvedSolids: undefined,
  visibleObject: undefined,
  trihalomethanes: undefined,
  chloroform: undefined,
  trichloroaceticAcid: undefined,
  bromoform: undefined,
  colorDegree: undefined,
  arsenic: undefined,
  iron: undefined,
  copper: undefined,
  nitrateN: undefined,
  zinc: undefined,
  chlorite: undefined,
  dibromochloromethane: undefined,
  totalAlphaRadioactivity: undefined,
  totalBetaRadioactivity: undefined,
  totalColiform: undefined,
  totalHardness: undefined,
});
const formRules = reactive({
  clientName: [{ required: true, message: '委托单位不能为空', trigger: 'blur' }],
  receiveDate: [{ required: true, message: '收样日期不能为空', trigger: 'blur' }],
  sampleNo: [{ required: true, message: '样品编号不能为空', trigger: 'blur' }],
  sampleName: [{ required: true, message: '样品名称不能为空', trigger: 'blur' }],
  samplingLocation: [{ required: true, message: '采样地点不能为空', trigger: 'blur' }],
});
const formRef = ref();

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增外检统计水质检测结果汇总' : '编辑外检统计水质检测结果汇总';
  formType.value = type;
  resetForm();
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WaterSampleTestSummaryApi.getWaterSampleTestSummary(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open });

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate();
  formLoading.value = true;
  try {
    const data = formData.value as unknown as WaterSampleTestSummaryVO;
    if (formType.value === 'create') {
      await WaterSampleTestSummaryApi.createWaterSampleTestSummary(data);
      ElMessage.success('新增成功');
    } else {
      await WaterSampleTestSummaryApi.updateWaterSampleTestSummary(data);
      ElMessage.success('修改成功');
    }
    dialogVisible.value = false;
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    clientName: undefined,
    receiveDate: undefined,
    sampleNo: undefined,
    sampleName: undefined,
    samplingLocation: undefined,
    phValue: undefined,
    ammoniaN: undefined,
    odourTaste: undefined,
    escherichiaColi: undefined,
    dichlorobromomethane: undefined,
    dichloroaceticAcid: undefined,
    chlorineDioxide: undefined,
    fluoride: undefined,
    permanganateIndex: undefined,
    cadmium: undefined,
    chromium: undefined,
    mercury: undefined,
    turbidity: undefined,
    totalBacteriaCount: undefined,
    sulfate: undefined,
    aluminum: undefined,
    chloride: undefined,
    chlorate: undefined,
    manganese: undefined,
    lead: undefined,
    cyanide: undefined,
    dissolvedSolids: undefined,
    visibleObject: undefined,
    trihalomethanes: undefined,
    chloroform: undefined,
    trichloroaceticAcid: undefined,
    bromoform: undefined,
    colorDegree: undefined,
    arsenic: undefined,
    iron: undefined,
    copper: undefined,
    nitrateN: undefined,
    zinc: undefined,
    chlorite: undefined,
    dibromochloromethane: undefined,
    totalAlphaRadioactivity: undefined,
    totalBetaRadioactivity: undefined,
    totalColiform: undefined,
    totalHardness: undefined,
  };
  formRef.value?.resetFields();
};
</script>
<template>
  <ElDialog :title="dialogTitle" v-model="dialogVisible" width="800px" append-to-body>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >
      <ElFormItem label="委托单位" prop="clientName">
        <ElInput v-model="formData.clientName" placeholder="请输入委托单位" />
      </ElFormItem>
      <ElFormItem label="收样日期" prop="receiveDate">
        <ElDatePicker
          v-model="formData.receiveDate"
          type="date"
          value-format="x"
          placeholder="选择收样日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="样品编号" prop="sampleNo">
        <ElInput v-model="formData.sampleNo" placeholder="请输入样品编号" />
      </ElFormItem>
      <ElFormItem label="样品名称" prop="sampleName">
        <ElInput v-model="formData.sampleName" placeholder="请输入样品名称" />
      </ElFormItem>
      <ElFormItem label="采样地点" prop="samplingLocation">
        <ElInput v-model="formData.samplingLocation" placeholder="请输入采样地点" />
      </ElFormItem>
      <ElFormItem label="pH值" prop="phValue">
        <ElInput v-model="formData.phValue" placeholder="请输入pH值" />
      </ElFormItem>
      <ElFormItem label="氨(以N计)(mg/L)" prop="ammoniaN">
        <ElInput v-model="formData.ammoniaN" placeholder="请输入氨(以N计)(mg/L)" />
      </ElFormItem>
      <ElFormItem label="臭和味" prop="odourTaste">
        <ElInput v-model="formData.odourTaste" placeholder="请输入臭和味" />
      </ElFormItem>
      <ElFormItem label="大肠埃希氏菌(CFU/100mL)" prop="escherichiaColi">
        <ElInput v-model="formData.escherichiaColi" placeholder="请输入大肠埃希氏菌(CFU/100mL)" />
      </ElFormItem>
      <ElFormItem label="二氯一溴甲烷(mg/L)" prop="dichlorobromomethane">
        <ElInput v-model="formData.dichlorobromomethane" placeholder="请输入二氯一溴甲烷(mg/L)" />
      </ElFormItem>
      <ElFormItem label="二氯乙酸(mg/L)" prop="dichloroaceticAcid">
        <ElInput v-model="formData.dichloroaceticAcid" placeholder="请输入二氯乙酸(mg/L)" />
      </ElFormItem>
      <ElFormItem label="二氧化氯(mg/L)" prop="chlorineDioxide">
        <ElInput v-model="formData.chlorineDioxide" placeholder="请输入二氧化氯(mg/L)" />
      </ElFormItem>
      <ElFormItem label="氟化物(mg/L)" prop="fluoride">
        <ElInput v-model="formData.fluoride" placeholder="请输入氟化物(mg/L)" />
      </ElFormItem>
      <ElFormItem label="高锰酸盐指数(以O2计)(mg/L)" prop="permanganateIndex">
        <ElInput v-model="formData.permanganateIndex" placeholder="请输入高锰酸盐指数(以O2计)(mg/L)" />
      </ElFormItem>
      <ElFormItem label="镉(mg/L)" prop="cadmium">
        <ElInput v-model="formData.cadmium" placeholder="请输入镉(mg/L)" />
      </ElFormItem>
      <ElFormItem label="铬(六价)(mg/L)" prop="chromium">
        <ElInput v-model="formData.chromium" placeholder="请输入铬(六价)(mg/L)" />
      </ElFormItem>
      <ElFormItem label="汞(mg/L)" prop="mercury">
        <ElInput v-model="formData.mercury" placeholder="请输入汞(mg/L)" />
      </ElFormItem>
      <ElFormItem label="浑浊度(NTU)" prop="turbidity">
        <ElInput v-model="formData.turbidity" placeholder="请输入浑浊度(NTU)" />
      </ElFormItem>
      <ElFormItem label="菌落总数(CFU/mL)" prop="totalBacteriaCount">
        <ElInput v-model="formData.totalBacteriaCount" placeholder="请输入菌落总数(CFU/mL)" />
      </ElFormItem>
      <ElFormItem label="硫酸盐(mg/L)" prop="sulfate">
        <ElInput v-model="formData.sulfate" placeholder="请输入硫酸盐(mg/L)" />
      </ElFormItem>
      <ElFormItem label="铝(mg/L)" prop="aluminum">
        <ElInput v-model="formData.aluminum" placeholder="请输入铝(mg/L)" />
      </ElFormItem>
      <ElFormItem label="氯化物(mg/L)" prop="chloride">
        <ElInput v-model="formData.chloride" placeholder="请输入氯化物(mg/L)" />
      </ElFormItem>
      <ElFormItem label="氯酸盐(mg/L)" prop="chlorate">
        <ElInput v-model="formData.chlorate" placeholder="请输入氯酸盐(mg/L)" />
      </ElFormItem>
      <ElFormItem label="锰(mg/L)" prop="manganese">
        <ElInput v-model="formData.manganese" placeholder="请输入锰(mg/L)" />
      </ElFormItem>
      <ElFormItem label="铅(mg/L)" prop="lead">
        <ElInput v-model="formData.lead" placeholder="请输入铅(mg/L)" />
      </ElFormItem>
      <ElFormItem label="氰化物(mg/L)" prop="cyanide">
        <ElInput v-model="formData.cyanide" placeholder="请输入氰化物(mg/L)" />
      </ElFormItem>
      <ElFormItem label="溶解性总固体(mg/L)" prop="dissolvedSolids">
        <ElInput v-model="formData.dissolvedSolids" placeholder="请输入溶解性总固体(mg/L)" />
      </ElFormItem>
      <ElFormItem label="肉眼可见物" prop="visibleObject">
        <ElInput v-model="formData.visibleObject" placeholder="请输入肉眼可见物" />
      </ElFormItem>
      <ElFormItem label="三卤甲烷" prop="trihalomethanes">
        <ElInput v-model="formData.trihalomethanes" placeholder="请输入三卤甲烷" />
      </ElFormItem>
      <ElFormItem label="三氯甲烷(mg/L)" prop="chloroform">
        <ElInput v-model="formData.chloroform" placeholder="请输入三氯甲烷(mg/L)" />
      </ElFormItem>
      <ElFormItem label="三氯乙酸(mg/L)" prop="trichloroaceticAcid">
        <ElInput v-model="formData.trichloroaceticAcid" placeholder="请输入三氯乙酸(mg/L)" />
      </ElFormItem>
      <ElFormItem label="三溴甲烷(mg/L)" prop="bromoform">
        <ElInput v-model="formData.bromoform" placeholder="请输入三溴甲烷(mg/L)" />
      </ElFormItem>
      <ElFormItem label="色度(度)" prop="colorDegree">
        <ElInput v-model="formData.colorDegree" placeholder="请输入色度(度)" />
      </ElFormItem>
      <ElFormItem label="砷(mg/L)" prop="arsenic">
        <ElInput v-model="formData.arsenic" placeholder="请输入砷(mg/L)" />
      </ElFormItem>
      <ElFormItem label="铁(mg/L)" prop="iron">
        <ElInput v-model="formData.iron" placeholder="请输入铁(mg/L)" />
      </ElFormItem>
      <ElFormItem label="铜(mg/L)" prop="copper">
        <ElInput v-model="formData.copper" placeholder="请输入铜(mg/L)" />
      </ElFormItem>
      <ElFormItem label="硝酸盐(以N计)(mg/L)" prop="nitrateN">
        <ElInput v-model="formData.nitrateN" placeholder="请输入硝酸盐(以N计)(mg/L)" />
      </ElFormItem>
      <ElFormItem label="锌(mg/L)" prop="zinc">
        <ElInput v-model="formData.zinc" placeholder="请输入锌(mg/L)" />
      </ElFormItem>
      <ElFormItem label="亚氯酸盐(mg/L)" prop="chlorite">
        <ElInput v-model="formData.chlorite" placeholder="请输入亚氯酸盐(mg/L)" />
      </ElFormItem>
      <ElFormItem label="一氯二溴甲烷(mg/L)" prop="dibromochloromethane">
        <ElInput v-model="formData.dibromochloromethane" placeholder="请输入一氯二溴甲烷(mg/L)" />
      </ElFormItem>
      <ElFormItem label="总α放射性(Bq/L)" prop="totalAlphaRadioactivity">
        <ElInput v-model="formData.totalAlphaRadioactivity" placeholder="请输入总α放射性(Bq/L)" />
      </ElFormItem>
      <ElFormItem label="总β放射性(Bq/L)" prop="totalBetaRadioactivity">
        <ElInput v-model="formData.totalBetaRadioactivity" placeholder="请输入总β放射性(Bq/L)" />
      </ElFormItem>
      <ElFormItem label="总大肠菌群(CFU/100mL)" prop="totalColiform">
        <ElInput v-model="formData.totalColiform" placeholder="请输入总大肠菌群(CFU/100mL)" />
      </ElFormItem>
      <ElFormItem label="总硬度(以CaCO3计)(mg/L)" prop="totalHardness">
        <ElInput v-model="formData.totalHardness" placeholder="请输入总硬度(以CaCO3计)(mg/L)" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>
