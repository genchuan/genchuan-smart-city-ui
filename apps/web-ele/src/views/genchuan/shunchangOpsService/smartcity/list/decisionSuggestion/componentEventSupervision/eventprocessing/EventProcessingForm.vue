<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from 'element-plus';

import {
  EventProcessingApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/eventprocessing';

/** 事件处理 表单 */
defineOptions({ name: 'EventProcessingForm' })

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success'])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  eventHandlingNumber: undefined,
  relatedEventReportingId: undefined,
  processingDepartment: undefined,
  processingPersonnel: undefined,
  receptionTime: undefined,
  handlingMeasures: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增事件处理' : '编辑事件处理'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const res = await EventProcessingApi.getEventProcessing(id)
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        receptionTime: res.receptionTime ? Number(res.receptionTime) : undefined
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    if (formType.value === 'create') {
      await EventProcessingApi.createEventProcessing(data)
      ElMessage.success('新增成功')
    } else {
      await EventProcessingApi.updateEventProcessing(data)
      ElMessage.success('修改成功')
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    eventHandlingNumber: undefined,
    relatedEventReportingId: undefined,
    processingDepartment: undefined,
    processingPersonnel: undefined,
    receptionTime: undefined,
    handlingMeasures: undefined
  }
  formRef.value?.resetFields()
}
</script>
<template>
  <ElDialog :title="dialogTitle" v-model="dialogVisible" width="600px" append-to-body>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <ElFormItem label="事件处理编号" prop="eventHandlingNumber">
        <ElInput v-model="formData.eventHandlingNumber" placeholder="请输入事件处理编号" />
      </ElFormItem>
      <ElFormItem label="处理人员" prop="processingPersonnel">
        <ElInput v-model="formData.processingPersonnel" placeholder="请输入处理人员" />
      </ElFormItem>
      <ElFormItem label="接收时间" prop="receptionTime">
        <ElDatePicker
          v-model="formData.receptionTime"
          type="datetime"
          value-format="x"
          placeholder="选择接收时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="处理措施" prop="handlingMeasures">
        <ElInput v-model="formData.handlingMeasures" placeholder="请输入处理措施" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">确 定</ElButton>
    </template>
  </ElDialog>
</template>