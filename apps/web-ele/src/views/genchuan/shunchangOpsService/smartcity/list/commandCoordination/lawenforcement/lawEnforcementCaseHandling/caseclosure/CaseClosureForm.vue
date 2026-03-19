<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from 'element-plus';

import {
  CaseClosureApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/caseclosure';

/** 案件结案 表单 */
defineOptions({ name: 'CaseClosureForm' })

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
  closureReason: undefined,
  closureDepartment: undefined,
  closurePerson: undefined,
  closureTime: undefined,
  approvalPerson: undefined,
  approvalTime: undefined,
  approvalOpinion: undefined,
  archiveNumber: undefined,
  archiveLocation: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增案件结案' : '编辑案件结案'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const res = await CaseClosureApi.getCaseClosure(id)
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        closureTime: res.closureTime ? Number(res.closureTime) : undefined,
        approvalTime: res.approvalTime ? Number(res.approvalTime) : undefined
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
      await CaseClosureApi.createCaseClosure(data)
      ElMessage.success('新增成功')
    } else {
      await CaseClosureApi.updateCaseClosure(data)
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
    closureReason: undefined,
    closureDepartment: undefined,
    closurePerson: undefined,
    closureTime: undefined,
    approvalPerson: undefined,
    approvalTime: undefined,
    approvalOpinion: undefined,
    archiveNumber: undefined,
    archiveLocation: undefined
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
      <ElFormItem label="案件 ID" prop="caseId">
        <ElInput v-model="formData.caseId" placeholder="请输入案件 ID" />
      </ElFormItem>
      <ElFormItem label="结案原因" prop="closureReason">
        <ElInput v-model="formData.closureReason" placeholder="请输入结案原因" />
      </ElFormItem>
      <ElFormItem label="结案部门" prop="closureDepartment">
        <ElInput v-model="formData.closureDepartment" placeholder="请输入结案部门" />
      </ElFormItem>
      <ElFormItem label="结案人" prop="closurePerson">
        <ElInput v-model="formData.closurePerson" placeholder="请输入结案人" />
      </ElFormItem>
      <ElFormItem label="结案时间" prop="closureTime">
        <ElDatePicker
          v-model="formData.closureTime"
          type="date"
          value-format="x"
          placeholder="选择结案时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="审批人" prop="approvalPerson">
        <ElInput v-model="formData.approvalPerson" placeholder="请输入审批人" />
      </ElFormItem>
      <ElFormItem label="审批时间" prop="approvalTime">
        <ElDatePicker
          v-model="formData.approvalTime"
          type="date"
          value-format="x"
          placeholder="选择审批时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="审批意见" prop="approvalOpinion">
        <ElInput v-model="formData.approvalOpinion" placeholder="请输入审批意见" />
      </ElFormItem>
      <ElFormItem label="归档编号" prop="archiveNumber">
        <ElInput v-model="formData.archiveNumber" placeholder="请输入归档编号" />
      </ElFormItem>
      <ElFormItem label="归档位置" prop="archiveLocation">
        <ElInput v-model="formData.archiveLocation" placeholder="请输入归档位置" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">确 定</ElButton>
    </template>
  </ElDialog>
</template>