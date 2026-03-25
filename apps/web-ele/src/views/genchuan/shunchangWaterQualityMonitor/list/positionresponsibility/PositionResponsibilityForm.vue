<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="岗位名称" prop="positionName">
        <el-input v-model="formData.positionName" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位职责描述" prop="responsibilityDesc">
        <el-input v-model="formData.responsibilityDesc" placeholder="请输入岗位职责描述" />
      </el-form-item>
      <el-form-item label="任职要求" prop="qualificationReq">
        <el-input v-model="formData.qualificationReq" placeholder="请输入任职要求" />
      </el-form-item>
      <el-form-item label="所属单位" prop="belongUnit">
        <el-input v-model="formData.belongUnit" placeholder="请输入所属单位" />
      </el-form-item>
      <el-form-item label="负责人" prop="manager">
        <el-input v-model="formData.manager" placeholder="请输入负责人" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PositionResponsibilityApi, PositionResponsibilityVO } from '@/api/waterdetection/positionresponsibility'

/** 岗位职责划分管理 表单 */
defineOptions({ name: 'PositionResponsibilityForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  positionName: undefined,
  responsibilityDesc: undefined,
  qualificationReq: undefined,
  belongUnit: undefined,
  manager: undefined,
})
const formRules = reactive({
  positionName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  belongUnit: [{ required: true, message: '所属单位不能为空', trigger: 'blur' }],
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
      formData.value = await PositionResponsibilityApi.getPositionResponsibility(id)
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
    const data = formData.value as unknown as PositionResponsibilityVO
    if (formType.value === 'create') {
      await PositionResponsibilityApi.createPositionResponsibility(data)
      message.success(t('common.createSuccess'))
    } else {
      await PositionResponsibilityApi.updatePositionResponsibility(data)
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
    positionName: undefined,
    responsibilityDesc: undefined,
    qualificationReq: undefined,
    belongUnit: undefined,
    manager: undefined,
  }
  formRef.value?.resetFields()
}
</script>
