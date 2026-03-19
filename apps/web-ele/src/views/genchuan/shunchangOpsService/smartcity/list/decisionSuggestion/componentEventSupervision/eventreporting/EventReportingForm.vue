<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from 'element-plus';

import {
  EventReportingApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/eventreporting';

/** 事件上报 表单 */
defineOptions({ name: 'EventReportingForm' })

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success'])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  eventNumber: undefined,
  eventName: undefined,
  eventType: undefined,
  eventDescription: undefined,
  occurrenceTime: undefined,
  place: undefined,
  latitudeLongitude: undefined,
  reportperson: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增事件上报' : '编辑事件上报'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await EventReportingApi.getEventReporting(id)
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
      await EventReportingApi.createEventReporting(data)
      ElMessage.success('新增成功')
    } else {
      await EventReportingApi.updateEventReporting(data)
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
    eventNumber: undefined,
    eventName: undefined,
    eventType: undefined,
    eventDescription: undefined,
    occurrenceTime: undefined,
    place: undefined,
    latitudeLongitude: undefined,
    reportperson: undefined
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
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="事件编号" prop="eventNumber">
        <ElInput v-model="formData.eventNumber" placeholder="请输入事件编号" />
      </ElFormItem>
      <ElFormItem label="事件名称" prop="eventName">
        <ElInput v-model="formData.eventName" placeholder="请输入事件名称" />
      </ElFormItem>
      <ElFormItem label="事件类型" prop="eventType">
        <ElInput v-model="formData.eventType" placeholder="请输入事件类型" />
      </ElFormItem>
      <ElFormItem label="事件描述" prop="eventDescription">
        <ElInput v-model="formData.eventDescription" type="textarea" placeholder="请输入事件描述" />
      </ElFormItem>
      <ElFormItem label="发生时间" prop="occurrenceTime">
        <ElDatePicker
          v-model="formData.occurrenceTime"
          type="date"
          value-format="x"
          placeholder="选择发生时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="发生地点" prop="place">
        <ElInput v-model="formData.place" placeholder="请输入发生地点" />
      </ElFormItem>
      <ElFormItem label="经纬度坐标" prop="latitudeLongitude">
        <ElInput v-model="formData.latitudeLongitude" placeholder="请输入经纬度坐标" />
      </ElFormItem>
      <ElFormItem label="上报人" prop="reportperson">
        <ElInput v-model="formData.reportperson" placeholder="请输入上报人" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">确 定</ElButton>
    </template>
  </ElDialog>
</template>