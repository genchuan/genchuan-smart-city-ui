<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElRadio,
  ElRadioGroup,
} from 'element-plus';

import { LawEnforcementVehicleApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawenforcementvehicle';

/** 执法车辆管理 表单 */
defineOptions({ name: 'LawEnforcementVehicleForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  licensePlateNumber: undefined,
  vehicleBrand: undefined,
  model: undefined,
  vehicleColor: undefined,
  vin: undefined,
  engineNo: undefined,
  purchaseTime: undefined,
  registrationDate: undefined,
  belongingDepartment: undefined,
  natureOfUse: undefined,
  vehicleUsage: undefined,
  vehicleStatus: undefined,
  annualInspectionDate: undefined,
  insuranceDeadline: undefined,
  typesOfInsurance: undefined,
  driverName: undefined,
  driverContactInformation: undefined,
  mileage: undefined,
  maintenanceRecord: undefined,
  maintenanceRecords: undefined,
  refuelingRecord: undefined,
  violationRecords: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增执法车辆管理' : '编辑执法车辆管理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      const res = await LawEnforcementVehicleApi.getLawEnforcementVehicle(id);
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        purchaseTime: res.purchaseTime ? Number(res.purchaseTime) : undefined,
        registrationDate: res.registrationDate
          ? Number(res.registrationDate)
          : undefined,
        annualInspectionDate: res.annualInspectionDate
          ? Number(res.annualInspectionDate)
          : undefined,
        insuranceDeadline: res.insuranceDeadline
          ? Number(res.insuranceDeadline)
          : undefined,
      };
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
      await LawEnforcementVehicleApi.createLawEnforcementVehicle(data);
      ElMessage.success('新增成功');
    } else {
      await LawEnforcementVehicleApi.updateLawEnforcementVehicle(data);
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
    licensePlateNumber: undefined,
    vehicleBrand: undefined,
    model: undefined,
    vehicleColor: undefined,
    vin: undefined,
    engineNo: undefined,
    purchaseTime: undefined,
    registrationDate: undefined,
    belongingDepartment: undefined,
    natureOfUse: undefined,
    vehicleUsage: undefined,
    vehicleStatus: undefined,
    annualInspectionDate: undefined,
    insuranceDeadline: undefined,
    typesOfInsurance: undefined,
    driverName: undefined,
    driverContactInformation: undefined,
    mileage: undefined,
    maintenanceRecord: undefined,
    maintenanceRecords: undefined,
    refuelingRecord: undefined,
    violationRecords: undefined,
  };
  formRef.value?.resetFields();
};
</script>
<template>
  <ElDialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <ElFormItem label="车牌号" prop="licensePlateNumber">
        <ElInput
          v-model="formData.licensePlateNumber"
          placeholder="请输入车牌号"
        />
      </ElFormItem>
      <ElFormItem label="车辆品牌" prop="vehicleBrand">
        <ElInput v-model="formData.vehicleBrand" placeholder="请输入车辆品牌" />
      </ElFormItem>
      <ElFormItem label="车辆型号" prop="model">
        <ElInput v-model="formData.model" placeholder="请输入车辆型号" />
      </ElFormItem>
      <ElFormItem label="车辆颜色" prop="vehicleColor">
        <ElInput v-model="formData.vehicleColor" placeholder="请输入车辆颜色" />
      </ElFormItem>
      <ElFormItem label="车架号" prop="vin">
        <ElInput v-model="formData.vin" placeholder="请输入车架号" />
      </ElFormItem>
      <ElFormItem label="发动机号" prop="engineNo">
        <ElInput v-model="formData.engineNo" placeholder="请输入发动机号" />
      </ElFormItem>
      <ElFormItem label="购置时间" prop="purchaseTime">
        <ElDatePicker
          v-model="formData.purchaseTime"
          type="date"
          value-format="x"
          placeholder="选择购置时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="登记注册日期" prop="registrationDate">
        <ElDatePicker
          v-model="formData.registrationDate"
          type="date"
          value-format="x"
          placeholder="选择登记注册日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="所属执法部门" prop="belongingDepartment">
        <ElInput
          v-model="formData.belongingDepartment"
          placeholder="请输入所属执法部门"
        />
      </ElFormItem>
      <ElFormItem label="使用性质" prop="natureOfUse">
        <ElInput v-model="formData.natureOfUse" placeholder="请输入使用性质" />
      </ElFormItem>
      <ElFormItem label="车辆用途" prop="vehicleUsage">
        <ElInput v-model="formData.vehicleUsage" placeholder="请输入车辆用途" />
      </ElFormItem>
      <ElFormItem label="车辆状态" prop="vehicleStatus">
        <ElRadioGroup v-model="formData.vehicleStatus">
          <ElRadio label="onDuty">执行任务中</ElRadio>
          <ElRadio label="standby">执法待命</ElRadio>
          <ElRadio label="maintenance">维修中</ElRadio>
          <ElRadio label="service">定期保养</ElRadio>
          <ElRadio label="impounded">暂扣/封存</ElRadio>
          <ElRadio label="outOfService">停用报废</ElRadio>
          <ElRadio label="refueling">加油/充电中</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="年检到期日期" prop="annualInspectionDate">
        <ElDatePicker
          v-model="formData.annualInspectionDate"
          type="date"
          value-format="x"
          placeholder="选择年检到期日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="保险截止日期" prop="insuranceDeadline">
        <ElDatePicker
          v-model="formData.insuranceDeadline"
          type="date"
          value-format="x"
          placeholder="选择保险截止日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="保险类型" prop="typesOfInsurance">
        <ElInput
          v-model="formData.typesOfInsurance"
          placeholder="请输入保险类型"
        />
      </ElFormItem>
      <ElFormItem label="驾驶员姓名" prop="driverName">
        <ElInput v-model="formData.driverName" placeholder="请输入驾驶员姓名" />
      </ElFormItem>
      <ElFormItem label="驾驶员联系方式" prop="driverContactInformation">
        <ElInput
          v-model="formData.driverContactInformation"
          placeholder="请输入驾驶员联系方式"
        />
      </ElFormItem>
      <ElFormItem label="行驶里程" prop="mileage">
        <ElInput v-model="formData.mileage" placeholder="请输入行驶里程" />
      </ElFormItem>
      <ElFormItem label="维修记录" prop="maintenanceRecord">
        <ElInput
          v-model="formData.maintenanceRecord"
          placeholder="请输入维修记录"
        />
      </ElFormItem>
      <ElFormItem label="保养记录" prop="maintenanceRecords">
        <ElInput
          v-model="formData.maintenanceRecords"
          placeholder="请输入保养记录"
        />
      </ElFormItem>
      <ElFormItem label="加油记录" prop="refuelingRecord">
        <ElInput
          v-model="formData.refuelingRecord"
          placeholder="请输入加油记录"
        />
      </ElFormItem>
      <ElFormItem label="违章记录" prop="violationRecords">
        <ElInput
          v-model="formData.violationRecords"
          placeholder="请输入违章记录"
        />
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
