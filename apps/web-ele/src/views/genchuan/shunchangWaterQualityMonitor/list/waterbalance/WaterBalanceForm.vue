<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="分区ID" prop="partitionId">
        <el-input v-model="formData.partitionId" placeholder="请输入分区ID" />
      </el-form-item>
      <el-form-item label="统计周期(日/月/年)" prop="statisticsPeriod">
        <el-input v-model="formData.statisticsPeriod" placeholder="请输入统计周期(日/月/年)" />
      </el-form-item>
      <el-form-item label="统计日期" prop="statisticsDate">
        <el-date-picker
          v-model="formData.statisticsDate"
          type="date"
          value-format="x"
          placeholder="选择统计日期"
        />
      </el-form-item>
      <el-form-item label="供水量(立方米)" prop="supplyVolume">
        <el-input v-model="formData.supplyVolume" placeholder="请输入供水量(立方米)" />
      </el-form-item>
      <el-form-item label="售水量(立方米)" prop="salesVolume">
        <el-input v-model="formData.salesVolume" placeholder="请输入售水量(立方米)" />
      </el-form-item>
      <el-form-item label="合理损耗量(立方米)" prop="reasonableLoss">
        <el-input v-model="formData.reasonableLoss" placeholder="请输入合理损耗量(立方米)" />
      </el-form-item>
      <el-form-item label="漏损量(立方米)" prop="leakageVolume">
        <el-input v-model="formData.leakageVolume" placeholder="请输入漏损量(立方米)" />
      </el-form-item>
      <el-form-item label="漏损率(%)" prop="leakageRate">
        <el-input v-model="formData.leakageRate" placeholder="请输入漏损率(%)" />
      </el-form-item>
      <el-form-item label="是否超标(0否1是)" prop="isExceeded">
        <el-input v-model="formData.isExceeded" placeholder="请输入是否超标(0否1是)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WaterBalanceApi, WaterBalanceVO } from '@/api/waterdetection/waterbalance'

/** 水量平衡与漏损分析 表单 */
defineOptions({ name: 'WaterBalanceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  partitionId: undefined,
  statisticsPeriod: undefined,
  statisticsDate: undefined,
  supplyVolume: undefined,
  salesVolume: undefined,
  reasonableLoss: undefined,
  leakageVolume: undefined,
  leakageRate: undefined,
  isExceeded: undefined,
})
const formRules = reactive({
  partitionId: [{ required: true, message: '分区ID不能为空', trigger: 'blur' }],
  statisticsPeriod: [{ required: true, message: '统计周期(日/月/年)不能为空', trigger: 'blur' }],
  statisticsDate: [{ required: true, message: '统计日期不能为空', trigger: 'blur' }],
  supplyVolume: [{ required: true, message: '供水量(立方米)不能为空', trigger: 'blur' }],
  salesVolume: [{ required: true, message: '售水量(立方米)不能为空', trigger: 'blur' }],
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
      formData.value = await WaterBalanceApi.getWaterBalance(id)
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
    const data = formData.value as unknown as WaterBalanceVO
    if (formType.value === 'create') {
      await WaterBalanceApi.createWaterBalance(data)
      message.success(t('common.createSuccess'))
    } else {
      await WaterBalanceApi.updateWaterBalance(data)
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
    partitionId: undefined,
    statisticsPeriod: undefined,
    statisticsDate: undefined,
    supplyVolume: undefined,
    salesVolume: undefined,
    reasonableLoss: undefined,
    leakageVolume: undefined,
    leakageRate: undefined,
    isExceeded: undefined,
  }
  formRef.value?.resetFields()
}
</script>
