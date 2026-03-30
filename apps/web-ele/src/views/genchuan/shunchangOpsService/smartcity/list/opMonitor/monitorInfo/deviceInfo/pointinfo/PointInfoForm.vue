<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

import { PointInfoApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/opMonitor/monitorInfo/deviceInfo/pointinfo';

/** 监测点位 表单 */
defineOptions({ name: 'PointInfoForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  pointNumber: undefined,
  pointName: undefined,
  pointType: undefined,
  belongingArea: undefined,
  latitudeLongitudeCoordinate: undefined,
  altitude: undefined,
  deviceInfo: undefined,
});
const formRules = reactive({
  pointNumber: [
    { required: true, message: '点位编号不能为空', trigger: 'blur' },
  ],
  pointName: [{ required: true, message: '点位名称不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增监测点位' : '编辑监测点位';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await PointInfoApi.getPointInfo(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await PointInfoApi.createPointInfo(data);
      ElMessage.success('新增成功');
    } else {
      await PointInfoApi.updatePointInfo(data);
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
    pointNumber: undefined,
    pointName: undefined,
    pointType: undefined,
    belongingArea: undefined,
    latitudeLongitudeCoordinate: undefined,
    altitude: undefined,
    deviceInfo: undefined,
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
      <ElFormItem label="点位编号" prop="pointNumber">
        <ElInput v-model="formData.pointNumber" placeholder="请输入点位编号" />
      </ElFormItem>
      <ElFormItem label="点位名称" prop="pointName">
        <ElInput v-model="formData.pointName" placeholder="请输入点位名称" />
      </ElFormItem>
      <ElFormItem label="点位类型" prop="pointType">
        <ElInput v-model="formData.pointType" placeholder="请输入点位类型" />
      </ElFormItem>
      <ElFormItem label="所属区域" prop="belongingArea">
        <ElInput
          v-model="formData.belongingArea"
          placeholder="请输入所属区域"
        />
      </ElFormItem>
      <ElFormItem label="经纬度坐标" prop="latitudeLongitudeCoordinate">
        <ElInput
          v-model="formData.latitudeLongitudeCoordinate"
          placeholder="请输入经纬度坐标"
        />
      </ElFormItem>
      <ElFormItem label="海拔高度" prop="altitude">
        <ElInput v-model="formData.altitude" placeholder="请输入海拔高度" />
      </ElFormItem>
      <ElFormItem label="设备信息" prop="deviceInfo">
        <ElInput v-model="formData.deviceInfo" placeholder="请输入设备信息" />
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
