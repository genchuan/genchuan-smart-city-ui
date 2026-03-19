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

import { InspectionAnalysisApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingInspectionManag/inspectionanalysis';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import InspectionAnalysisForm from './InspectionAnalysisForm.vue';

/** 巡查分析 列表 */
defineOptions({ name: 'InspectionAnalysis' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  inspector: undefined,
  cycleStartTime: undefined,
  cycleEndTime: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await InspectionAnalysisApi.getInspectionAnalysisPage(queryParams);
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
    await confirm('是否确认删除该巡查分析数据？', '系统提示');
    // 发起删除
    await InspectionAnalysisApi.deleteInspectionAnalysis(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有巡查分析数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await InspectionAnalysisApi.exportInspectionAnalysis(queryParams);
    download.excel(data, '巡查分析统计.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
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
        label-width="120px"
      >
        <ElFormItem label="巡查人员" prop="inspector">
          <ElInput
            v-model="queryParams.inspector"
            placeholder="请输入巡查人员"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡查开始时间" prop="cycleStartTime">
          <ElDatePicker
            v-model="queryParams.cycleStartTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择巡查开始时间"
            clearable
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡查结束时间" prop="cycleEndTime">
          <ElDatePicker
            v-model="queryParams.cycleEndTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择巡查结束时间"
            clearable
            style="width: 240px"
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
        <ElTableColumn label="ID" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="巡查人员"
          align="center"
          prop="inspector"
          min-width="120"
        />
        <ElTableColumn
          label="巡查开始时间"
          align="center"
          prop="cycleStartTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="巡查结束时间"
          align="center"
          prop="cycleEndTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="完成巡查任务数"
          align="center"
          prop="completedTaskCount"
          min-width="120"
        />
        <ElTableColumn
          label="巡查总里程（km）"
          align="center"
          prop="totalMileageKm"
          min-width="130"
        />
        <ElTableColumn
          label="巡查总时长（h）"
          align="center"
          prop="totalDurationH"
          min-width="130"
        />
        <ElTableColumn
          label="发现问题总数"
          align="center"
          prop="foundProblemCount"
          min-width="120"
        />
        <ElTableColumn
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="操作"
          align="center"
          fixed="right"
          min-width="150"
        >
          <template #default="scope">
            <ElSpace>
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
    <InspectionAnalysisForm ref="formRef" @success="getList" />
  </div>
</template>
