<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { LeakageControlPlanApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/leakagecontrolplan';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';
import {
  ElMessage,
  ElCard,
  ElTable,
  ElTableColumn,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
  ElPagination,
  ElSpace,
} from 'element-plus';
import { Icon } from '@iconify/vue';

import LeakageControlPlanForm from './LeakageControlPlanForm.vue';

/** 漏损控制方案建议 列表 */
defineOptions({ name: 'LeakageControlPlan' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  partitionId: undefined,
  exceededLeakageRate: undefined,
  pressureData: undefined,
  pipeAvgAge: undefined,
  suggestedPlan: undefined,
  planImplementTime: [],
  postImplementRate: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await LeakageControlPlanApi.getLeakageControlPlanPage(queryParams);
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
    await confirm('是否确认删除该漏损控制方案建议数据？', '系统提示');
    // 发起删除
    await LeakageControlPlanApi.deleteLeakageControlPlan(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有漏损控制方案建议数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await LeakageControlPlanApi.exportLeakageControlPlan(queryParams);
    download.excel(data, '漏损控制方案建议.xls');
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
        label-width="130px"
      >
        <ElFormItem label="分区ID" prop="partitionId">
          <ElInput
            v-model="queryParams.partitionId"
            placeholder="请输入分区ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="超标漏损率(%)" prop="exceededLeakageRate">
          <ElInput
            v-model="queryParams.exceededLeakageRate"
            placeholder="请输入超标漏损率(%)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="压力数据" prop="pressureData">
          <ElInput
            v-model="queryParams.pressureData"
            placeholder="请输入压力数据"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="管道平均使用年限" prop="pipeAvgAge">
          <ElInput
            v-model="queryParams.pipeAvgAge"
            placeholder="请输入管道平均使用年限(年)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="建议方案" prop="suggestedPlan">
          <ElInput
            v-model="queryParams.suggestedPlan"
            placeholder="请输入建议方案"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="方案实施时间" prop="planImplementTime">
          <ElDatePicker
            v-model="queryParams.planImplementTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="实施后漏损率(%)" prop="postImplementRate">
          <ElInput
            v-model="queryParams.postImplementRate"
            placeholder="请输入实施后漏损率(%)"
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
        <ElTableColumn label="序号" align="center" prop="id" min-width="80" />
        <ElTableColumn
          label="分区ID"
          align="center"
          prop="partitionId"
          min-width="100"
        />
        <ElTableColumn
          label="超标漏损率(%)"
          align="center"
          prop="exceededLeakageRate"
          min-width="140"
        />
        <ElTableColumn
          label="压力数据"
          align="center"
          prop="pressureData"
          min-width="100"
        />
        <ElTableColumn
          label="管道平均使用年限(年)"
          align="center"
          prop="pipeAvgAge"
          min-width="180"
        />
        <ElTableColumn
          label="建议方案"
          align="center"
          prop="suggestedPlan"
          min-width="120"
        />
        <ElTableColumn
          label="方案实施时间"
          align="center"
          prop="planImplementTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="实施后漏损率(%)"
          align="center"
          prop="postImplementRate"
          min-width="150"
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
    <LeakageControlPlanForm ref="formRef" @success="getList" />
  </div>
</template>
