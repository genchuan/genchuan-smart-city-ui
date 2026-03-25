<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="180px"
      v-loading="formLoading"
    >
      <el-form-item label="采样点编号" prop="pointCode">
        <el-input v-model="formData.pointCode" placeholder="请输入采样点编号" />
      </el-form-item>
      <el-form-item label="指标名称" prop="indicatorName">
        <el-input v-model="formData.indicatorName" placeholder="请输入指标名称" />
      </el-form-item>
      <el-form-item label="采样频率" prop="frequency">
        <el-input v-model="formData.frequency" placeholder="请输入采样频率(次/月/季)" />
      </el-form-item>
      <el-form-item label="执行周期" prop="executionCycle">
        <el-input v-model="formData.executionCycle" placeholder="请输入执行周期" />
      </el-form-item>
      <el-form-item label="特殊时段(如汛期)调整规则" prop="specialPeriodRule">
        <el-input v-model="formData.specialPeriodRule" placeholder="请输入特殊时段(如汛期)调整规则" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { SamplingFrequencyApi, SamplingFrequencyVO } from '@/api/waterdetection/samplingfrequency'

/** 采样频率设置 表单 */
defineOptions({ name: 'SamplingFrequencyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  pointCode: undefined,
  indicatorName: undefined,
  frequency: undefined,
  executionCycle: undefined,
  specialPeriodRule: undefined,
})
const formRules = reactive({
  pointCode: [{ required: true, message: '采样点编号不能为空', trigger: 'blur' }],
  indicatorName: [{ required: true, message: '指标名称不能为空', trigger: 'blur' }],
  frequency: [{ required: true, message: '采样频率(次/月/季)不能为空', trigger: 'blur' }],
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
      formData.value = await SamplingFrequencyApi.getSamplingFrequency(id)
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
    const data = formData.value as unknown as SamplingFrequencyVO
    if (formType.value === 'create') {
      await SamplingFrequencyApi.createSamplingFrequency(data)
      message.success(t('common.createSuccess'))
    } else {
      await SamplingFrequencyApi.updateSamplingFrequency(data)
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
    pointCode: undefined,
    indicatorName: undefined,
    frequency: undefined,
    executionCycle: undefined,
    specialPeriodRule: undefined,
  }
  formRef.value?.resetFields()
}
</script>
