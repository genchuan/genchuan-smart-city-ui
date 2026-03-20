<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
} from 'element-plus';

import { WaterSampleTestSummaryApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';

/** 外检统计水质检测结果汇总 表单 */
defineOptions({ name: 'WaterSampleTestSummaryForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
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
  sampleNo: [{ required: true, message: '样品编号不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增外检统计水质检测结果汇总' : '编辑外检统计水质检测结果汇总';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WaterSampleTestSummaryApi.getWaterSampleTestSummary(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await WaterSampleTestSummaryApi.createWaterSampleTestSummary(data);
      ElMessage.success('新增成功');
    } else {
      await WaterSampleTestSummaryApi.updateWaterSampleTestSummary(data);
      ElMessage.success('修改成功');
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
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
        <ElInputNumber v-model="formData.phValue" :precision="2" placeholder="请输入pH值" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="氨(以N计)(mg/L)" prop="ammoniaN">
        <ElInput v-model="formData.ammoniaN" placeholder="请输入氨(以N计)" />
      </ElFormItem>
      <ElFormItem label="臭和味" prop="odourTaste">
        <ElInput v-model="formData.odourTaste" placeholder="请输入臭和味" />
      </ElFormItem>
      <ElFormItem label="大肠埃希氏菌(CFU/100mL)" prop="escherichiaColi">
        <ElInput v-model="formData.escherichiaColi" placeholder="请输入大肠埃希氏菌" />
      </ElFormItem>
      <ElFormItem label="二氯一溴甲烷(mg/L)" prop="dichlorobromomethane">
        <ElInput v-model="formData.dichlorobromomethane" placeholder="请输入二氯一溴甲烷" />
      </ElFormItem>
      <ElFormItem label="二氯乙酸(mg/L)" prop="dichloroaceticAcid">
        <ElInput v-model="formData.dichloroaceticAcid" placeholder="请输入二氯乙酸" />
      </ElFormItem>
      <ElFormItem label="二氧化氯(mg/L)" prop="chlorineDioxide">
        <ElInput v-model="formData.chlorineDioxide" placeholder="请输入二氧化氯" />
      </ElFormItem>
      <ElFormItem label="氟化物(mg/L)" prop="fluoride">
        <ElInput v-model="formData.fluoride" placeholder="请输入氟化物" />
      </ElFormItem>
      <ElFormItem label="高锰酸盐指数(以O2计)(mg/L)" prop="permanganateIndex">
        <ElInputNumber v-model="formData.permanganateIndex" :precision="2" placeholder="请输入高锰酸盐指数" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="镉(mg/L)" prop="cadmium">
        <ElInput v-model="formData.cadmium" placeholder="请输入镉" />
      </ElFormItem>
      <ElFormItem label="铬(六价)(mg/L)" prop="chromium">
        <ElInput v-model="formData.chromium" placeholder="请输入铬(六价)" />
      </ElFormItem>
      <ElFormItem label="汞(mg/L)" prop="mercury">
        <ElInputNumber v-model="formData.mercury" :precision="4" placeholder="请输入汞" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="浑浊度(NTU)" prop="turbidity">
        <ElInputNumber v-model="formData.turbidity" :precision="1" placeholder="请输入浑浊度" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="菌落总数(CFU/mL)" prop="totalBacteriaCount">
        <ElInputNumber v-model="formData.totalBacteriaCount" :precision="0" placeholder="请输入菌落总数" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="硫酸盐(mg/L)" prop="sulfate">
        <ElInput v-model="formData.sulfate" placeholder="请输入硫酸盐" />
      </ElFormItem>
      <ElFormItem label="铝(mg/L)" prop="aluminum">
        <ElInputNumber v-model="formData.aluminum" :precision="3" placeholder="请输入铝" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="氯化物(mg/L)" prop="chloride">
        <ElInput v-model="formData.chloride" placeholder="请输入氯化物" />
      </ElFormItem>
      <ElFormItem label="氯酸盐(mg/L)" prop="chlorate">
        <ElInput v-model="formData.chlorate" placeholder="请输入氯酸盐" />
      </ElFormItem>
      <ElFormItem label="锰(mg/L)" prop="manganese">
        <ElInputNumber v-model="formData.manganese" :precision="3" placeholder="请输入锰" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="铅(mg/L)" prop="lead">
        <ElInput v-model="formData.lead" placeholder="请输入铅" />
      </ElFormItem>
      <ElFormItem label="氰化物(mg/L)" prop="cyanide">
        <ElInput v-model="formData.cyanide" placeholder="请输入氰化物" />
      </ElFormItem>
      <ElFormItem label="溶解性总固体(mg/L)" prop="dissolvedSolids">
        <ElInputNumber v-model="formData.dissolvedSolids" :precision="0" placeholder="请输入溶解性总固体" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="肉眼可见物" prop="visibleObject">
        <ElInput v-model="formData.visibleObject" placeholder="请输入肉眼可见物" />
      </ElFormItem>
      <ElFormItem label="三卤甲烷" prop="trihalomethanes">
        <ElInput v-model="formData.trihalomethanes" placeholder="请输入三卤甲烷" />
      </ElFormItem>
      <ElFormItem label="三氯甲烷(mg/L)" prop="chloroform">
        <ElInput v-model="formData.chloroform" placeholder="请输入三氯甲烷" />
      </ElFormItem>
      <ElFormItem label="三氯乙酸(mg/L)" prop="trichloroaceticAcid">
        <ElInput v-model="formData.trichloroaceticAcid" placeholder="请输入三氯乙酸" />
      </ElFormItem>
      <ElFormItem label="三溴甲烷(mg/L)" prop="bromoform">
        <ElInput v-model="formData.bromoform" placeholder="请输入三溴甲烷" />
      </ElFormItem>
      <ElFormItem label="色度(度)" prop="colorDegree">
        <ElInputNumber v-model="formData.colorDegree" :precision="0" placeholder="请输入色度" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="砷(mg/L)" prop="arsenic">
        <ElInput v-model="formData.arsenic" placeholder="请输入砷" />
      </ElFormItem>
      <ElFormItem label="铁(mg/L)" prop="iron">
        <ElInputNumber v-model="formData.iron" :precision="2" placeholder="请输入铁" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="铜(mg/L)" prop="copper">
        <ElInput v-model="formData.copper" placeholder="请输入铜" />
      </ElFormItem>
      <ElFormItem label="硝酸盐(以N计)(mg/L)" prop="nitrateN">
        <ElInput v-model="formData.nitrateN" placeholder="请输入硝酸盐" />
      </ElFormItem>
      <ElFormItem label="锌(mg/L)" prop="zinc">
        <ElInputNumber v-model="formData.zinc" :precision="2" placeholder="请输入锌" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="亚氯酸盐(mg/L)" prop="chlorite">
        <ElInput v-model="formData.chlorite" placeholder="请输入亚氯酸盐" />
      </ElFormItem>
      <ElFormItem label="一氯二溴甲烷(mg/L)" prop="dibromochloromethane">
        <ElInput v-model="formData.dibromochloromethane" placeholder="请输入一氯二溴甲烷" />
      </ElFormItem>
      <ElFormItem label="总α放射性(Bq/L)" prop="totalAlphaRadioactivity">
        <ElInput v-model="formData.totalAlphaRadioactivity" placeholder="请输入总α放射性" />
      </ElFormItem>
      <ElFormItem label="总β放射性(Bq/L)" prop="totalBetaRadioactivity">
        <ElInput v-model="formData.totalBetaRadioactivity" placeholder="请输入总β放射性" />
      </ElFormItem>
      <ElFormItem label="总大肠菌群(CFU/100mL)" prop="totalColiform">
        <ElInput v-model="formData.totalColiform" placeholder="请输入总大肠菌群" />
      </ElFormItem>
      <ElFormItem label="总硬度(以CaCO3计)(mg/L)" prop="totalHardness">
        <ElInputNumber v-model="formData.totalHardness" :precision="1" placeholder="请输入总硬度" style="width: 100%" />
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
