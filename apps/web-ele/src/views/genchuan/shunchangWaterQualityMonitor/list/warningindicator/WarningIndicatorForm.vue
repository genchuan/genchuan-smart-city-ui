<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="预警指标名称" label-width="130" prop="indicatorName">
        <el-input v-model="formData.indicatorName" placeholder="请输入预警指标名称" />
      </el-form-item>
      <el-form-item label="指标类型" label-width="130" prop="indicatorType">
        <el-input v-model="formData.indicatorType" placeholder="请输入指标类型(水质/设备)" />
      </el-form-item>
      <el-form-item label="关联监测点类型" label-width="130" prop="relatedPointType">
        <el-input v-model="formData.relatedPointType" placeholder="请输入关联监测点类型(水源/水厂/管网)" />
      </el-form-item>
      <el-form-item label="数据来源" label-width="130" prop="dataSource">
        <el-input v-model="formData.dataSource" placeholder="请输入数据来源(在线监测/人工检测)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WarningIndicatorApi, WarningIndicatorVO } from '@/api/waterdetection/warningindicator'

/** 预警指标配置 表单 */
defineOptions({ name: 'WarningIndicatorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  indicatorName: undefined,
  indicatorType: undefined,
  relatedPointType: undefined,
  dataSource: undefined,
})
const formRules = reactive({
  indicatorName: [{ required: true, message: '预警指标名称不能为空', trigger: 'blur' }],
  indicatorType: [{ required: true, message: '指标类型(水质/设备)不能为空', trigger: 'blur' }],
  relatedPointType: [{ required: true, message: '关联监测点类型(水源/水厂/管网)不能为空', trigger: 'blur' }],
  dataSource: [{ required: true, message: '数据来源(在线监测/人工检测)不能为空', trigger: 'blur' }],
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
      formData.value = await WarningIndicatorApi.getWarningIndicator(id)
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
    const data = formData.value as unknown as WarningIndicatorVO
    if (formType.value === 'create') {
      await WarningIndicatorApi.createWarningIndicator(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarningIndicatorApi.updateWarningIndicator(data)
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
    indicatorName: undefined,
    indicatorType: undefined,
    relatedPointType: undefined,
    dataSource: undefined,
  }
  formRef.value?.resetFields()
}
</script>
