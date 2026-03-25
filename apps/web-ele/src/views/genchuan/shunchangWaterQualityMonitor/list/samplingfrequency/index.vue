<template>
  <ElCard>
    <!-- 搜索工作栏 -->
    <ElForm
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <ElFormItem label="采样点编号" prop="pointCode">
        <ElInput
          v-model="queryParams.pointCode"
          placeholder="请输入采样点编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="指标名称" prop="indicatorName">
        <ElInput
          v-model="queryParams.indicatorName"
          placeholder="请输入指标名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="采样频率" label-width="auto" prop="frequency">
        <ElInput
          v-model="queryParams.frequency"
          placeholder="请输入采样频率(次/月/季)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="执行周期" prop="executionCycle">
        <ElInput
          v-model="queryParams.executionCycle"
          placeholder="请输入执行周期"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="特殊时段调整规则" label-width="auto" prop="specialPeriodRule">
        <ElInput
          v-model="queryParams.specialPeriodRule"
          placeholder="请输入特殊时段(如汛期)调整规则"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="创建时间" prop="createTime">
        <ElDatePicker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </ElFormItem>
      <ElFormItem>
        <ElSpace>
          <ElButton @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" />
            搜索
          </ElButton>
          <ElButton @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />
            重置
          </ElButton>
          <ElButton
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['waterdetection:sampling-frequency:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" />
            新增
          </ElButton>
          <ElButton
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['waterdetection:sampling-frequency:export']"
          >
            <Icon icon="ep:download" class="mr-5px" />
            导出
          </ElButton>
        </ElSpace>
      </ElFormItem>
    </ElForm>
  </ElCard>

  <!-- 列表 -->
  <ElCard class="mt-16px">
    <ElTable v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <ElTableColumn label="序号" align="center" prop="id" min-width="80" />
      <ElTableColumn label="采样点编号" align="center" prop="pointCode" min-width="120" />
      <ElTableColumn label="指标名称" align="center" prop="indicatorName" min-width="120" />
      <ElTableColumn label="采样频率(次/月/季)" align="center" prop="frequency" min-width="150" />
      <ElTableColumn label="执行周期" align="center" prop="executionCycle" min-width="120" />
      <ElTableColumn label="特殊时段调整规则" align="center" prop="specialPeriodRule" min-width="180" />
      <ElTableColumn
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        min-width="180"
      />
      <ElTableColumn label="操作" align="center" min-width="120px" fixed="right">
        <template #default="scope">
          <ElButton
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['waterdetection:sampling-frequency:update']"
          >
            编辑
          </ElButton>
          <ElButton
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['waterdetection:sampling-frequency:delete']"
          >
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <!-- 分页 -->
    <ElPagination
      class="mt-16px justify-end"
      :total="total"
      v-model:current-page="queryParams.pageNo"
      v-model:page-size="queryParams.pageSize"
      @change="getList"
    />
  </ElCard>

  <!-- 表单弹窗：添加/修改 -->
  <SamplingFrequencyForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { confirm, downloadFile } from '@vben/common-ui';
import { Icon } from '@iconify/vue';
import {
  ElButton,
  ElCard,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElPagination,
  ElSpace,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { dateFormatter } from '#/utils/formatTime';

import {
  SamplingFrequencyApi,
  SamplingFrequencyVO,
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/samplingfrequency';

import SamplingFrequencyForm from './SamplingFrequencyForm.vue';

/** 采样频率设置 列表 */
defineOptions({ name: 'SamplingFrequency' });

const loading = ref(true); // 列表的加载中
const list = ref<SamplingFrequencyVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  pointCode: undefined,
  indicatorName: undefined,
  frequency: undefined,
  executionCycle: undefined,
  specialPeriodRule: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await SamplingFrequencyApi.getSamplingFrequencyPage(queryParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await confirm('是否删除该数据？');
    // 发起删除
    await SamplingFrequencyApi.deleteSamplingFrequency(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否导出数据？');
    // 发起导出
    exportLoading.value = true;
    const data = await SamplingFrequencyApi.exportSamplingFrequency(queryParams);
    downloadFile(data, '采样频率设置.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});
</script>
