<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import {
  DevelopmentInspectionTaskApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/specialProject/illegalConstructionInspection/developmentinspectiontask';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';
import { ElMessage, ElCard, ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination, ElSpace } from 'element-plus';
import { Icon } from '@iconify/vue';

import DevelopmentInspectionTaskForm from './DevelopmentInspectionTaskForm.vue';

/** 巡查任务管理 列表 */
defineOptions({ name: 'DevelopmentInspectionTask' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  plan: undefined,
  task: undefined,
  record: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await DevelopmentInspectionTaskApi.getDevelopmentInspectionTaskPage(
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
    await confirm('是否确认删除该巡查任务管理数据？', '系统提示');
    // 发起删除
    await DevelopmentInspectionTaskApi.deleteDevelopmentInspectionTask(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有巡查任务管理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await DevelopmentInspectionTaskApi.exportDevelopmentInspectionTask(
        queryParams,
      );
    download.excel(data, '巡查任务管理.xls');
  } catch {} finally {
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
        label-width="80px"
      >
        <ElFormItem label="巡查计划" prop="plan">
          <ElInput
            v-model="queryParams.plan"
            placeholder="请输入巡查计划"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡查任务" prop="task">
          <ElInput
            v-model="queryParams.task"
            placeholder="请输入巡查任务"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡查记录" prop="record">
          <ElInput
            v-model="queryParams.record"
            placeholder="请输入巡查记录"
            clearable
            @keyup.enter="handleQuery"
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
            <ElButton
              type="success"
              @click="openForm('create')"
            >
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
        <ElTableColumn label="主键" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="巡查计划"
          align="center"
          prop="plan"
          min-width="200"
        />
        <ElTableColumn label="巡查任务" align="center" prop="task" min-width="150" />
        <ElTableColumn label="巡查记录" align="center" prop="record" min-width="200" />
        <ElTableColumn
          label="巡查时间"
          align="center"
          prop="patrolTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn label="区域" align="center" prop="region" min-width="100" />
        <ElTableColumn label="人员" align="center" prop="staff" min-width="100" />
        <ElTableColumn label="发现的问题" align="center" prop="foundProblems" min-width="200" />
        <ElTableColumn
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn label="操作" align="center" fixed="right" min-width="150">
          <template #default="scope">
            <ElSpace>
              <ElButton
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
              >
                编辑
              </ElButton>
              <ElButton
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
              >
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
    <DevelopmentInspectionTaskForm ref="formRef" @success="getList" />
  </div>
</template>
