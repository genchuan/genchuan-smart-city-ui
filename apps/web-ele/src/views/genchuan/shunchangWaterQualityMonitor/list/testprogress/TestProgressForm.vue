<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="任务编号" prop="taskCode">
        <el-input v-model="formData.taskCode" placeholder="请输入任务编号" />
      </el-form-item>
      <el-form-item label="当前进度" prop="progressPercent">
        <el-input v-model="formData.progressPercent" placeholder="请输入当前进度(%)" />
      </el-form-item>
      <el-form-item label="已完成指标" prop="completedIndicators">
        <el-input v-model="formData.completedIndicators" placeholder="请输入已完成指标" />
      </el-form-item>
      <el-form-item label="未完成指标" prop="pendingIndicators">
        <el-input v-model="formData.pendingIndicators" placeholder="请输入未完成指标" />
      </el-form-item>
      <el-form-item label="预计完成时间" prop="estimatedCompletion">
        <el-date-picker
          v-model="formData.estimatedCompletion"
          type="date"
          value-format="x"
          placeholder="选择预计完成时间"
        />
      </el-form-item>
      <el-form-item label="延迟原因" prop="delayReason">
        <el-input v-model="formData.delayReason" placeholder="请输入延迟原因(如有)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TestProgressApi, TestProgressVO } from '@/api/waterdetection/testprogress'

/** 检测进度跟踪 表单 */
defineOptions({ name: 'TestProgressForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskCode: undefined,
  progressPercent: undefined,
  completedIndicators: undefined,
  pendingIndicators: undefined,
  estimatedCompletion: undefined,
  delayReason: undefined,
})
const formRules = reactive({
  taskCode: [{ required: true, message: '任务编号不能为空', trigger: 'blur' }],
  progressPercent: [{ required: true, message: '当前进度(%)不能为空', trigger: 'blur' }],
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
      formData.value = await TestProgressApi.getTestProgress(id)
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
    const data = formData.value as unknown as TestProgressVO
    if (formType.value === 'create') {
      await TestProgressApi.createTestProgress(data)
      message.success(t('common.createSuccess'))
    } else {
      await TestProgressApi.updateTestProgress(data)
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
    taskCode: undefined,
    progressPercent: undefined,
    completedIndicators: undefined,
    pendingIndicators: undefined,
    estimatedCompletion: undefined,
    delayReason: undefined,
  }
  formRef.value?.resetFields()
}
</script>
