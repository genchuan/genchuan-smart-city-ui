<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { CaseDisposalApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/casedisposal';
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
  ElSelect,
  ElOption,
  ElPagination,
  ElSpace,
} from 'element-plus';
import { Icon } from '@iconify/vue';

import CaseDisposalForm from './CaseDisposalForm.vue';

/** 案件处理 列表 */
defineOptions({ name: 'CaseDisposal' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  caseId: undefined,
  disposalType: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 获取处理类型标签
const getDisposalTypeLabel = (value: string) => {
  const typeMap: Record<string, string> = {
    administrative_penalty: '行政处罚',
    rectification_notice: '整改通知',
    no_penalty: '不予处罚',
    other_disposal: '其他处理',
  };
  return typeMap[value] || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await CaseDisposalApi.getCaseDisposalPage(queryParams);
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
    await confirm('是否确认删除该案件处理数据？', '系统提示');
    // 发起删除
    await CaseDisposalApi.deleteCaseDisposal(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有案件处理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await CaseDisposalApi.exportCaseDisposal(queryParams);
    download.excel(data, '案件处理.xls');
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
        label-width="100px"
      >
        <ElFormItem label="案件 ID" prop="caseId">
          <ElInput
            v-model="queryParams.caseId"
            placeholder="请输入案件 ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="处理类型" prop="disposalType">
          <ElSelect
            v-model="queryParams.disposalType"
            placeholder="请选择处理类型"
            clearable
            style="width: 240px"
          >
            <ElOption label="行政处罚" value="administrative_penalty" />
            <ElOption label="整改通知" value="rectification_notice" />
            <ElOption label="不予处罚" value="no_penalty" />
            <ElOption label="其他处理" value="other_disposal" />
          </ElSelect>
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
          label="案件 ID"
          align="center"
          prop="caseId"
          min-width="120"
        />
        <ElTableColumn
          label="处理类型"
          align="center"
          prop="disposalType"
          min-width="120"
        >
          <template #default="scope">
            {{ getDisposalTypeLabel(scope.row.disposalType) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="处理部门"
          align="center"
          prop="disposalDepartment"
          min-width="120"
        />
        <ElTableColumn
          label="处理人"
          align="center"
          prop="disposalPerson"
          min-width="100"
        />
        <ElTableColumn
          label="处理开始时间"
          align="center"
          prop="disposalStartTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="处理结束时间"
          align="center"
          prop="disposalEndTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="处理依据"
          align="center"
          prop="disposalBasis"
          min-width="150"
        />
        <ElTableColumn
          label="处理内容"
          align="center"
          prop="disposalContent"
          min-width="200"
        />
        <ElTableColumn
          label="处理结果"
          align="center"
          prop="disposalResult"
          min-width="150"
        />
        <ElTableColumn
          label="处罚金额"
          align="center"
          prop="penaltyAmount"
          min-width="100"
        />
        <ElTableColumn
          label="处罚类型"
          align="center"
          prop="penaltyType"
          min-width="120"
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
    <CaseDisposalForm ref="formRef" @success="getList" />
  </div>
</template>
