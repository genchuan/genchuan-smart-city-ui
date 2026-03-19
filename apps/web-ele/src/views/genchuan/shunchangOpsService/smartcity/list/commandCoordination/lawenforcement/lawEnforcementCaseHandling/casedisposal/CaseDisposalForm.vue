<script setup lang="ts">
import { reactive, ref } from 'vue';

import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker, ElSelect, ElOption } from 'element-plus';

import {
  CaseDisposalApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/casedisposal';

/** 案件处理 表单 */
defineOptions({ name: 'CaseDisposalForm' })

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
  disposalType: undefined,
  disposalDepartment: undefined,
  disposalPerson: undefined,
  disposalStartTime: undefined,
  disposalEndTime: undefined,
  disposalBasis: undefined,
  disposalContent: undefined,
  disposalResult: undefined,
  penaltyAmount: undefined,
  penaltyType: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增案件处理' : '编辑案件处理'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const res = await CaseDisposalApi.getCaseDisposal(id)
      formData.value = {
        ...res,
        // 将字符串时间戳转为数字
        disposalStartTime: res.disposalStartTime ? Number(res.disposalStartTime) : undefined,
        disposalEndTime: res.disposalEndTime ? Number(res.disposalEndTime) : undefined
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
      await CaseDisposalApi.createCaseDisposal(data)
      ElMessage.success('新增成功')
    } else {
      await CaseDisposalApi.updateCaseDisposal(data)
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
    disposalType: undefined,
    disposalDepartment: undefined,
    disposalPerson: undefined,
    disposalStartTime: undefined,
    disposalEndTime: undefined,
    disposalBasis: undefined,
    disposalContent: undefined,
    disposalResult: undefined,
    penaltyAmount: undefined,
    penaltyType: undefined
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
      <ElFormItem label="处理类型" prop="disposalType">
        <ElSelect v-model="formData.disposalType" placeholder="请选择处理类型">
          <ElOption label="行政处罚" value="administrative_penalty" />
          <ElOption label="整改通知" value="rectification_notice" />
          <ElOption label="不予处罚" value="no_penalty" />
          <ElOption label="其他处理" value="other_disposal" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="处理部门" prop="disposalDepartment">
        <ElInput v-model="formData.disposalDepartment" placeholder="请输入处理部门" />
      </ElFormItem>
      <ElFormItem label="处理人" prop="disposalPerson">
        <ElInput v-model="formData.disposalPerson" placeholder="请输入处理人" />
      </ElFormItem>
      <ElFormItem label="处理开始时间" prop="disposalStartTime">
        <ElDatePicker
          v-model="formData.disposalStartTime"
          type="datetime"
          value-format="x"
          placeholder="选择处理开始时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="处理结束时间" prop="disposalEndTime">
        <ElDatePicker
          v-model="formData.disposalEndTime"
          type="datetime"
          value-format="x"
          placeholder="选择处理结束时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="处理依据" prop="disposalBasis">
        <ElInput v-model="formData.disposalBasis" placeholder="请输入处理依据" />
      </ElFormItem>
      <ElFormItem label="处理内容" prop="disposalContent">
        <ElInput v-model="formData.disposalContent" type="textarea" placeholder="请输入处理内容" />
      </ElFormItem>
      <ElFormItem label="处理结果" prop="disposalResult">
        <ElInput v-model="formData.disposalResult" placeholder="请输入处理结果" />
      </ElFormItem>
      <ElFormItem label="处罚金额" prop="penaltyAmount">
        <ElInput v-model="formData.penaltyAmount" placeholder="请输入处罚金额" />
      </ElFormItem>
      <ElFormItem label="处罚类型" prop="penaltyType">
        <ElInput v-model="formData.penaltyType" placeholder="请输入处罚类型" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">确 定</ElButton>
    </template>
  </ElDialog>
</template>