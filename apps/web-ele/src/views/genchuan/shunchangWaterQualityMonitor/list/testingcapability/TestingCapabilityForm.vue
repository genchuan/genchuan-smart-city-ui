<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="机构编号" prop="agencyCode">
        <el-input v-model="formData.agencyCode" placeholder="请输入机构编号" />
      </el-form-item>
      <el-form-item label="可检测指标" prop="testableIndicators">
        <el-input v-model="formData.testableIndicators" placeholder="请输入可检测指标" />
      </el-form-item>
      <el-form-item label="设备型号" prop="equipmentModel">
        <el-input v-model="formData.equipmentModel" placeholder="请输入设备型号" />
      </el-form-item>
      <el-form-item label="设备编号" prop="equipmentNo">
        <el-input v-model="formData.equipmentNo" placeholder="请输入设备编号" />
      </el-form-item>
      <el-form-item label="校准记录" prop="calibrationRecord">
        <el-input v-model="formData.calibrationRecord" placeholder="请输入校准记录" />
      </el-form-item>
      <el-form-item label="设备状态(正常/维修中/停用)" prop="equipmentStatus">
        <el-input v-model="formData.equipmentStatus" placeholder="请输入设备状态(正常/维修中/停用)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TestingCapabilityApi, TestingCapabilityVO } from '@/api/waterdetection/testingcapability'

/** 检测能力及设备管理 表单 */
defineOptions({ name: 'TestingCapabilityForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  agencyCode: undefined,
  testableIndicators: undefined,
  equipmentModel: undefined,
  equipmentNo: undefined,
  calibrationRecord: undefined,
  equipmentStatus: undefined,
})
const formRules = reactive({
  agencyCode: [{ required: true, message: '机构编号不能为空', trigger: 'blur' }],
  equipmentNo: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
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
      formData.value = await TestingCapabilityApi.getTestingCapability(id)
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
    const data = formData.value as unknown as TestingCapabilityVO
    if (formType.value === 'create') {
      await TestingCapabilityApi.createTestingCapability(data)
      message.success(t('common.createSuccess'))
    } else {
      await TestingCapabilityApi.updateTestingCapability(data)
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
    agencyCode: undefined,
    testableIndicators: undefined,
    equipmentModel: undefined,
    equipmentNo: undefined,
    calibrationRecord: undefined,
    equipmentStatus: undefined,
  }
  formRef.value?.resetFields()
}
</script>
