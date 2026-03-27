<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <el-form-item label="模型名称"  prop="modelName">
        <el-input v-model="formData.modelName" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="校验时间段" prop="validationPeriod">
        <el-input v-model="formData.validationPeriod" placeholder="请输入校验时间段" />
      </el-form-item>
      <el-form-item label="预警次数" prop="warningCount">
        <el-input v-model="formData.warningCount" placeholder="请输入预警次数" />
      </el-form-item>
      <el-form-item label="准确预警次数" prop="accurateWarningCount">
        <el-input v-model="formData.accurateWarningCount" placeholder="请输入准确预警次数" />
      </el-form-item>
      <el-form-item label="误报次数" prop="falseAlarmCount">
        <el-input v-model="formData.falseAlarmCount" placeholder="请输入误报次数" />
      </el-form-item>
      <el-form-item label="准确率(%)" prop="accuracyRate">
        <el-input v-model="formData.accuracyRate" placeholder="请输入准确率(%)" />
      </el-form-item>
      <el-form-item label="调整建议" prop="adjustmentSuggestion">
        <el-input v-model="formData.adjustmentSuggestion" placeholder="请输入调整建议" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WarningModelValidationApi, WarningModelValidationVO } from '@/api/waterdetection/warningmodelvalidation'

/** 预警模型校验 表单 */
defineOptions({ name: 'WarningModelValidationForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  modelName: undefined,
  validationPeriod: undefined,
  warningCount: undefined,
  accurateWarningCount: undefined,
  falseAlarmCount: undefined,
  accuracyRate: undefined,
  adjustmentSuggestion: undefined,
})
const formRules = reactive({
  modelName: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }],
  validationPeriod: [{ required: true, message: '校验时间段不能为空', trigger: 'blur' }],
  warningCount: [{ required: true, message: '预警次数不能为空', trigger: 'blur' }],
  accurateWarningCount: [{ required: true, message: '准确预警次数不能为空', trigger: 'blur' }],
  falseAlarmCount: [{ required: true, message: '误报次数不能为空', trigger: 'blur' }],
  accuracyRate: [{ required: true, message: '准确率(%)不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await WarningModelValidationApi.getWarningModelValidation(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as WarningModelValidationVO
    if (formType.value === 'create') {
      await WarningModelValidationApi.createWarningModelValidation(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarningModelValidationApi.updateWarningModelValidation(data)
      message.success(t('common.updateSuccess'))
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
    modelName: undefined,
    validationPeriod: undefined,
    warningCount: undefined,
    accurateWarningCount: undefined,
    falseAlarmCount: undefined,
    accuracyRate: undefined,
    adjustmentSuggestion: undefined,
  }
  formRef.value?.resetFields()
}
</script>
