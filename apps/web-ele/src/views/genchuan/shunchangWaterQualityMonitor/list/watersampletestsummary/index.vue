<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { confirm } from '@vben/common-ui';

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

import { WaterSampleTestSummaryApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import WaterSampleTestSummaryForm from './WaterSampleTestSummaryForm.vue';
import WaterSampleTestSummaryImport from './WaterSampleTestSummaryImport.vue';
import WaterSampleTestDetailDrawer from './WaterSampleTestDetailDrawer.vue';

/** 外检统计水质检测结果汇总 列表 */
defineOptions({ name: 'WaterSampleTestSummary' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  sampleNo: undefined,
  receiveDate: [],
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await WaterSampleTestSummaryApi.getWaterSampleTestSummaryPage(
        queryParams,
      );
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
    await confirm('是否确认删除该外检统计水质检测结果汇总数据？', '系统提示');
    // 发起删除
    await WaterSampleTestSummaryApi.deleteWaterSampleTestSummary(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有外检统计水质检测结果汇总数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await WaterSampleTestSummaryApi.exportWaterSampleTestSummary(
        queryParams,
      );
    download.excel(data, '外检统计水质检测结果汇总.xls');
  } catch {} finally {
    exportLoading.value = false;
  }
};

/** 详情抽屉操作 */
const detailDrawerRef = ref();
const openDetailDrawer = (id: number) => {
  detailDrawerRef.value.open(id);
};

/** 导入操作 */
const importRef = ref();
const openImport = () => {
  importRef.value.open();
};

/** 初始化 */
onMounted(() => {
  getList();
});
</script>

<template>
  <div class="p-4">
    <!-- 搜索工作栏 -->
    <ElCard class="mb-4" shadow="never">
      <ElForm
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <ElFormItem label="样品编号" prop="sampleNo">
          <ElInput
            v-model="queryParams.sampleNo"
            placeholder="请输入样品编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="收样日期" prop="receiveDate">
          <ElDatePicker
            v-model="queryParams.receiveDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="检测日期" prop="createTime">
          <ElDatePicker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem>
          <ElSpace>
            <ElButton type="primary" @click="handleQuery">
              <Icon icon="ep:search" style="margin-right: 4px" /> 搜索
            </ElButton>
            <ElButton @click="resetQuery">
              <Icon icon="ep:refresh" style="margin-right: 4px" /> 重置
            </ElButton>
            <ElButton type="success" @click="openForm('create')">
              <Icon icon="ep:plus" style="margin-right: 4px" /> 新增
            </ElButton>
            <ElButton type="info" @click="openImport">
              <Icon icon="ep:upload" style="margin-right: 4px" /> 导入
            </ElButton>
            <ElButton
              type="warning"
              @click="handleExport"
              :loading="exportLoading"
            >
              <Icon icon="ep:download" style="margin-right: 4px" /> 导出
            </ElButton>
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 列表 -->
    <ElCard shadow="never">
      <ElTable
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        style="width: 100%"
      >
        <ElTableColumn
          label="序号"
          align="center"
          prop="id"
          min-width="80"
        />
        <ElTableColumn
          label="委托单位"
          align="center"
          prop="clientName"
          min-width="120"
        />
        <ElTableColumn
          label="收样日期"
          align="center"
          prop="receiveDate"
          :formatter="dateFormatter"
          min-width="120"
        />
        <ElTableColumn
          label="样品编号"
          align="center"
          prop="sampleNo"
          min-width="120"
        />
        <ElTableColumn
          label="样品名称"
          align="center"
          prop="sampleName"
          min-width="120"
        />
        <ElTableColumn
          label="采样地点"
          align="center"
          prop="samplingLocation"
          min-width="120"
        />
        <ElTableColumn
          label="pH值"
          align="center"
          prop="phValue"
          min-width="80"
        />
        <ElTableColumn
          label="检测日期"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="操作"
          align="center"
          fixed="right"
          min-width="200"
        >
          <template #default="scope">
            <ElSpace>
              <ElButton
                link
                type="primary"
                @click="openDetailDrawer(scope.row.id)"
              >
                详情
              </ElButton>
              <ElButton
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
              >
                编辑
              </ElButton>
              <ElButton link type="danger" @click="handleDelete(scope.row.id)">
                删除
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <ElPagination
          :total="total"
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </ElCard>

    <!-- 表单弹窗：添加/修改 -->
    <WaterSampleTestSummaryForm ref="formRef" @success="getList" />
    <!-- 导入弹窗 -->
    <WaterSampleTestSummaryImport ref="importRef" @success="getList" />
    <!-- 详情抽屉 -->
    <WaterSampleTestDetailDrawer ref="detailDrawerRef" />
  </div>
</template>
