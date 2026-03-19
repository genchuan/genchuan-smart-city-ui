<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from 'element-plus';

import {
  DevelopmentInspectionTaskApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/specialProject/illegalConstructionInspection/developmentinspectiontask';

/** 巡查任务管理 表单 */
defineOptions({ name: 'DevelopmentInspectionTaskForm' })

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success'])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  plan: undefined,
  task: undefined,
  record: undefined,
  patrolTime: undefined,
  region: undefined,
  staff: undefined,
  foundProblems: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增巡查任务管理' : '编辑巡查任务管理'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DevelopmentInspectionTaskApi.getDevelopmentInspectionTask(id)
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
      await DevelopmentInspectionTaskApi.createDevelopmentInspectionTask(data)
      ElMessage.success('新增成功')
    } else {
      await DevelopmentInspectionTaskApi.updateDevelopmentInspectionTask(data)
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
    plan: undefined,
    task: undefined,
    record: undefined,
    patrolTime: undefined,
    region: undefined,
    staff: undefined,
    foundProblems: undefined
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
      <ElFormItem label="巡查计划" prop="plan">
        <ElInput v-model="formData.plan" placeholder="请输入巡查计划" />
      </ElFormItem>
      <ElFormItem label="巡查任务" prop="task">
        <ElInput v-model="formData.task" placeholder="请输入巡查任务" />
      </ElFormItem>
      <ElFormItem label="巡查记录" prop="record">
        <ElInput v-model="formData.record" placeholder="请输入巡查记录" />
      </ElFormItem>
      <ElFormItem label="巡查时间" prop="patrolTime">
        <ElDatePicker
          v-model="formData.patrolTime"
          type="datetime"
          value-format="x"
          placeholder="选择巡查时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="区域" prop="region">
        <ElInput v-model="formData.region" placeholder="请输入区域" />
      </ElFormItem>
      <ElFormItem label="人员" prop="staff">
        <ElInput v-model="formData.staff" placeholder="请输入人员" />
      </ElFormItem>
      <ElFormItem label="发现的问题" prop="foundProblems">
        <ElInput v-model="formData.foundProblems" placeholder="请输入发现的问题" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">确 定</ElButton>
    </template>
  </ElDialog>
</template>
