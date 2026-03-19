<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import {
  ProblemInputApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/operationGuide/probleminput';
import download from '#/utils/genchuan/download';
import { dateFormatter, dateFormatter2 } from '#/utils/genchuan/formatTime';
import { ElMessage, ElCard, ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker, ElPagination, ElSpace } from 'element-plus';
import { Icon } from '@iconify/vue';

import ProblemInputForm from './ProblemInputForm.vue';

/** 问题录入 列表 */
defineOptions({ name: 'ProblemInput' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  questionTitle: undefined,
  problemDescription: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await ProblemInputApi.getProblemInputPage(
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
    await confirm('是否确认删除该问题录入数据？', '系统提示');
    // 发起删除
    await ProblemInputApi.deleteProblemInput(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出问题录入数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await ProblemInputApi.exportProblemInput(
        queryParams,
      );
    download.excel(data, '问题录入.xls');
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
        <ElFormItem label="问题标题" prop="questionTitle">
          <ElInput
            v-model="queryParams.questionTitle"
            placeholder="请输入问题标题"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="问题描述" prop="problemDescription">
          <ElInput
            v-model="queryParams.problemDescription"
            placeholder="请输入问题描述"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
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
        <ElTableColumn label="主键" align="center" prop="id" min-width="80" />
        <ElTableColumn label="问题标题" align="center" prop="questionTitle" min-width="120" />
        <ElTableColumn label="问题描述" align="center" prop="problemDescription" min-width="120" />
        <ElTableColumn
          label="提问时间"
          align="center"
          prop="questionTime"
          :formatter="dateFormatter2"
          min-width="120"
        />
        <ElTableColumn label="提问人" align="center" prop="questioner" min-width="100" />
        <ElTableColumn label="所属领域" align="center" prop="isArea" min-width="120" />
        <ElTableColumn label="紧急程度" align="center" prop="urgency" min-width="100" />
        <ElTableColumn label="问题类型" align="center" min-width="120">
          <template #default="scope">
            <template v-if="scope.row.questionType === 'systemOperation'">系统操作类</template>
            <template v-else-if="scope.row.questionType === 'onSiteOperation'">现场实操类</template>
            <template v-else-if="scope.row.questionType === 'processManagement'">流程管理类</template>
            <template v-else-if="scope.row.questionType === 'resourceRequirement'">资源需求类</template>
            <template v-else-if="scope.row.questionType === 'policyConsultation'">政策咨询类</template>
            <template v-else-if="scope.row.questionType === 'other'">其他问题</template>
            <template v-else>未分类</template>
          </template>
        </ElTableColumn>
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
    <ProblemInputForm ref="formRef" @success="getList" />
  </div>
</template>
