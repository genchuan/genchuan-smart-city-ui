<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="分区ID" prop="partitionId">
        <el-input
          v-model="queryParams.partitionId"
          placeholder="请输入分区ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="统计周期" prop="statisticsPeriod">
        <el-input
          v-model="queryParams.statisticsPeriod"
          placeholder="请输入统计周期(日/月/年)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="统计日期" prop="statisticsDate">
        <el-date-picker
          v-model="queryParams.statisticsDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="供水量(立方米)" prop="supplyVolume">
        <el-input
          v-model="queryParams.supplyVolume"
          placeholder="请输入供水量(立方米)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="售水量(立方米)" prop="salesVolume">
        <el-input
          v-model="queryParams.salesVolume"
          placeholder="请输入售水量(立方米)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合理损耗量(立方米)" label-width="auto" prop="reasonableLoss">
        <el-input
          v-model="queryParams.reasonableLoss"
          placeholder="请输入合理损耗量(立方米)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="漏损量(立方米)" prop="leakageVolume">
        <el-input
          v-model="queryParams.leakageVolume"
          placeholder="请输入漏损量(立方米)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="漏损率(%)" prop="leakageRate">
        <el-input
          v-model="queryParams.leakageRate"
          placeholder="请输入漏损率(%)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="是否超标" prop="isExceeded">
        <el-input
          v-model="queryParams.isExceeded"
          placeholder="请输入是否超标(0否1是)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['waterdetection:water-balance:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['waterdetection:water-balance:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="分区ID" align="center" prop="partitionId" />
      <el-table-column label="统计周期(日/月/年)" align="center" prop="statisticsPeriod" />
      <el-table-column
        label="统计日期"
        align="center"
        prop="statisticsDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="供水量(立方米)" align="center" prop="supplyVolume" />
      <el-table-column label="售水量(立方米)" align="center" prop="salesVolume" />
      <el-table-column label="合理损耗量(立方米)" align="center" prop="reasonableLoss" />
      <el-table-column label="漏损量(立方米)" align="center" prop="leakageVolume" />
      <el-table-column label="漏损率(%)" align="center" prop="leakageRate" />
      <el-table-column label="是否超标(0否1是)" align="center" prop="isExceeded" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['waterdetection:water-balance:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['waterdetection:water-balance:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <WaterBalanceForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { WaterBalanceApi, WaterBalanceVO } from '@/api/waterdetection/waterbalance'
import WaterBalanceForm from './WaterBalanceForm.vue'

/** 水量平衡与漏损分析 列表 */
defineOptions({ name: 'WaterBalance' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<WaterBalanceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  partitionId: undefined,
  statisticsPeriod: undefined,
  statisticsDate: [],
  supplyVolume: undefined,
  salesVolume: undefined,
  reasonableLoss: undefined,
  leakageVolume: undefined,
  leakageRate: undefined,
  isExceeded: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WaterBalanceApi.getWaterBalancePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await WaterBalanceApi.deleteWaterBalance(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await WaterBalanceApi.exportWaterBalance(queryParams)
    download.excel(data, '水量平衡与漏损分析.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
