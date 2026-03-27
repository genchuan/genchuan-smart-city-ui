<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="样本编号" prop="sampleCode">
        <el-input v-model="formData.sampleCode" placeholder="请输入样本编号" />
      </el-form-item>
      <el-form-item label="检测指标" prop="testIndicator">
        <el-input v-model="formData.testIndicator" placeholder="请输入检测指标" />
      </el-form-item>
      <el-form-item label="检测值" prop="testValue">
        <el-input v-model="formData.testValue" placeholder="请输入检测值" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="formData.unit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="检测方法" prop="testMethod">
        <el-input v-model="formData.testMethod" placeholder="请输入检测方法" />
      </el-form-item>
      <el-form-item label="检测人员" prop="testOperator">
        <el-input v-model="formData.testOperator" placeholder="请输入检测人员" />
      </el-form-item>
      <el-form-item label="检测时间" prop="testTime">
        <el-date-picker
          v-model="formData.testTime"
          type="date"
          value-format="x"
          placeholder="选择检测时间"
        />
      </el-form-item>
      <el-form-item label="设备编号" prop="equipmentCode">
        <el-input v-model="formData.equipmentCode" placeholder="请输入设备编号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TestResultApi, TestResultVO } from '@/api/waterdetection/testresult'

/** 检测结果录入 表单 */
defineOptions({ name: 'TestResultForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  sampleCode: undefined,
  testIndicator: undefined,
  testValue: undefined,
  unit: undefined,
  testMethod: undefined,
  testOperator: undefined,
  testTime: undefined,
  equipmentCode: undefined,
})
const formRules = reactive({
  sampleCode: [{ required: true, message: '样本编号不能为空', trigger: 'blur' }],
  testIndicator: [{ required: true, message: '检测指标不能为空', trigger: 'blur' }],
  testValue: [{ required: true, message: '检测值不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
  testOperator: [{ required: true, message: '检测人员不能为空', trigger: 'blur' }],
  testTime: [{ required: true, message: '检测时间不能为空', trigger: 'blur' }],
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
      formData.value = await TestResultApi.getTestResult(id)
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
    const data = formData.value as unknown as TestResultVO
    if (formType.value === 'create') {
      await TestResultApi.createTestResult(data)
      message.success(t('common.createSuccess'))
    } else {
      await TestResultApi.updateTestResult(data)
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
    sampleCode: undefined,
    testIndicator: undefined,
    testValue: undefined,
    unit: undefined,
    testMethod: undefined,
    testOperator: undefined,
    testTime: undefined,
    equipmentCode: undefined,
  }
  formRef.value?.resetFields()
}
</script>
