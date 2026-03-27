<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="人员编号" prop="staffNo">
        <el-input v-model="formData.staffNo" placeholder="请输入人员编号" />
      </el-form-item>
      <el-form-item label="姓名" prop="staffName">
        <el-input v-model="formData.staffName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="职称" prop="position">
        <el-input v-model="formData.position" placeholder="请输入职称" />
      </el-form-item>
      <el-form-item label="资格证书编号" prop="certificateNo">
        <el-input v-model="formData.certificateNo" placeholder="请输入资格证书编号" />
      </el-form-item>
      <el-form-item label="培训记录" prop="trainingRecord">
        <el-input v-model="formData.trainingRecord" placeholder="请输入培训记录" />
      </el-form-item>
      <el-form-item label="所属机构编号" prop="agencyCode">
        <el-input v-model="formData.agencyCode" placeholder="请输入所属机构编号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TestingPersonnelApi, TestingPersonnelVO } from '@/api/waterdetection/testingpersonnel'

/** 检测人员信息管理 表单 */
defineOptions({ name: 'TestingPersonnelForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  staffNo: undefined,
  staffName: undefined,
  position: undefined,
  certificateNo: undefined,
  trainingRecord: undefined,
  agencyCode: undefined,
})
const formRules = reactive({
  staffNo: [{ required: true, message: '人员编号不能为空', trigger: 'blur' }],
  staffName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  agencyCode: [{ required: true, message: '所属机构编号不能为空', trigger: 'blur' }],
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
      formData.value = await TestingPersonnelApi.getTestingPersonnel(id)
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
    const data = formData.value as unknown as TestingPersonnelVO
    if (formType.value === 'create') {
      await TestingPersonnelApi.createTestingPersonnel(data)
      message.success(t('common.createSuccess'))
    } else {
      await TestingPersonnelApi.updateTestingPersonnel(data)
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
    staffNo: undefined,
    staffName: undefined,
    position: undefined,
    certificateNo: undefined,
    trainingRecord: undefined,
    agencyCode: undefined,
  }
  formRef.value?.resetFields()
}
</script>
