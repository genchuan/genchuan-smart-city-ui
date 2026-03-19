<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from 'element-plus';

import {
  CaseInvestigationApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/caseinvestigation';

/** 案件调查 表单 */
defineOptions({ name: 'CaseInvestigationForm' })

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success'])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  caseId: undefined,
  investigationLeader: undefined,
  investigationTeam: undefined,
  investigationStartTime: undefined,
  investigationEndTime: undefined,
  investigationDesc: undefined,
  evidenceDesc: undefined,
  testimonyDesc: undefined,
  investigationResult: undefined,
  treatmentSuggestion: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增案件调查' : '编辑案件调查'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const res = await CaseInvestigationApi.getCaseInvestigation(id)
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        investigationStartTime: res.investigationStartTime ? Number(res.investigationStartTime) : undefined,
        investigationEndTime: res.investigationEndTime ? Number(res.investigationEndTime) : undefined
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
      await CaseInvestigationApi.createCaseInvestigation(data)
      ElMessage.success('新增成功')
    } else {
      await CaseInvestigationApi.updateCaseInvestigation(data)
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
    caseId: undefined,
    investigationLeader: undefined,
    investigationTeam: undefined,
    investigationStartTime: undefined,
    investigationEndTime: undefined,
    investigationDesc: undefined,
    evidenceDesc: undefined,
    testimonyDesc: undefined,
    investigationResult: undefined,
    treatmentSuggestion: undefined
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
      <ElFormItem label="案件 ID" prop="caseId">
        <ElInput v-model="formData.caseId" placeholder="请输入案件 ID" />
      </ElFormItem>
      <ElFormItem label="调查负责人" prop="investigationLeader">
        <ElInput v-model="formData.investigationLeader" placeholder="请输入调查负责人" />
      </ElFormItem>
      <ElFormItem label="调查组成员" prop="investigationTeam">
        <ElInput v-model="formData.investigationTeam" placeholder="请输入调查组成员" />
      </ElFormItem>
      <ElFormItem label="调查开始时间" prop="investigationStartTime">
        <ElDatePicker
          v-model="formData.investigationStartTime"
          type="datetime"
          value-format="x"
          placeholder="选择调查开始时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="调查结束时间" prop="investigationEndTime">
        <ElDatePicker
          v-model="formData.investigationEndTime"
          type="datetime"
          value-format="x"
          placeholder="选择调查结束时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="现场勘查情况" prop="investigationDesc">
        <ElInput v-model="formData.investigationDesc" placeholder="请输入现场勘查情况" />
      </ElFormItem>
      <ElFormItem label="证据情况描述" prop="evidenceDesc">
        <ElInput v-model="formData.evidenceDesc" placeholder="请输入证据情况描述" />
      </ElFormItem>
      <ElFormItem label="证人证言描述" prop="testimonyDesc">
        <ElInput v-model="formData.testimonyDesc" placeholder="请输入证人证言描述" />
      </ElFormItem>
      <ElFormItem label="调查结果" prop="investigationResult">
        <ElInput v-model="formData.investigationResult" placeholder="请输入调查结果" />
      </ElFormItem>
      <ElFormItem label="处理建议" prop="treatmentSuggestion">
        <ElInput v-model="formData.treatmentSuggestion" placeholder="请输入处理建议" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">确 定</ElButton>
    </template>
  </ElDialog>
</template>