<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import {
  PatrolTaskManagementApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingInspectionManag/patroltaskmanagement';
import download from '#/utils/genchuan/download';
import { dateFormatter, dateFormatter2 } from '#/utils/genchuan/formatTime';
import { ElMessage, ElCard, ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination, ElSpace } from 'element-plus';
import { Icon } from '@iconify/vue';

import PatrolTaskManagementForm from './PatrolTaskManagementForm.vue';

/** 巡査任务管理 列表 */
defineOptions({ name: 'PatrolTaskManagement' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  task: undefined,
  belongingPlan: undefined,
  executive: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await PatrolTaskManagementApi.getPatrolTaskManagementPage(queryParams);
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
    await confirm('是否确认删除该巡査任务管理数据？', '系统提示');
    // 发起删除
    await PatrolTaskManagementApi.deletePatrolTaskManagement(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有巡査任务管理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await PatrolTaskManagementApi.exportPatrolTaskManagement(queryParams);
    download.excel(data, '巡査任务管理.xls');
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
        label-width="100px"
      >
        <ElFormItem label="任务名称" prop="task">
          <ElInput
            v-model="queryParams.task"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="所属计划" prop="belongingPlan">
          <ElInput
            v-model="queryParams.belongingPlan"
            placeholder="请输入所属计划"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="执行人员" prop="executive">
          <ElInput
            v-model="queryParams.executive"
            placeholder="请输入执行人员"
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
        <ElTableColumn label="任务名称" align="center" prop="task" min-width="120" />
        <ElTableColumn label="巡查区域" align="center" prop="patrolArea" min-width="120" />
        <ElTableColumn
          label="巡查时间"
          align="center"
          prop="patrolTime"
          :formatter="dateFormatter2"
          min-width="120"
        />
        <ElTableColumn label="执行人员" align="center" prop="executive" min-width="100" />
        <ElTableColumn label="预计时长" align="center" prop="expectedDuration" min-width="100" />
        <ElTableColumn label="任务描述" align="center" prop="taskDescription" min-width="150" />
        <ElTableColumn label="巡查重点" align="center" prop="keyInspectionPoints" min-width="150" />
        <ElTableColumn label="携带设备清单" align="center" prop="listOfCarryingEquipment" min-width="150" />
        <ElTableColumn label="完成情况说明" align="center" prop="completionStatusDescription" min-width="150" />
        <ElTableColumn label="异常情况记录" align="center" prop="abnormalSituationRecord" min-width="150" />
        <ElTableColumn label="处理措施" align="center" prop="handlingMeasures" min-width="150" />
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
    <PatrolTaskManagementForm ref="formRef" @success="getList" />
  </div>
</template>
