<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import {
  EventAnalysisApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/eventanalysis';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';
import { ElMessage, ElCard, ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination, ElSpace, ElSelect, ElOption } from 'element-plus';
import { Icon } from '@iconify/vue';

import EventAnalysisForm from './EventAnalysisForm.vue';

/** 事件关联分析 列表 */
defineOptions({ name: 'EventAnalysis' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  analysisNumber: undefined,
  mainEventNumber: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 获取关联类型标签
const getAssociationTypeLabel = (value: string) => {
  const typeMap: Record<string, string> = {
    direct_causal: '直接因果',
    indirect_causal: '间接因果',
    same_period: '同期发生',
    time_dependent: '时序依赖',
    same_component: '同部件关联',
    upstream_downstream: '上下游关联',
    same_system: '同系统关联',
    derivative: '衍生关联',
    coupling: '耦合关联',
  };
  return typeMap[value] || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await EventAnalysisApi.getEventAnalysisPage(
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
    await confirm('是否确认删除该事件关联分析数据？', '系统提示');
    // 发起删除
    await EventAnalysisApi.deleteEventAnalysis(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有事件关联分析数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await EventAnalysisApi.exportEventAnalysis(
        queryParams,
      );
    download.excel(data, '事件关联分析.xls');
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
        <ElFormItem label="关联分析编号" prop="analysisNumber">
          <ElInput
            v-model="queryParams.analysisNumber"
            placeholder="请输入关联分析编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="主事件编号" prop="mainEventNumber">
          <ElInput
            v-model="queryParams.mainEventNumber"
            placeholder="请输入主事件编号"
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
          label="关联分析编号"
          align="center"
          prop="analysisNumber"
          min-width="150"
        />
        <ElTableColumn label="主事件编号" align="center" prop="mainEventNumber" min-width="150" />
        <ElTableColumn label="主事件名称" align="center" prop="mainEventName" min-width="150" />
        <ElTableColumn label="关联事件编号" align="center" prop="relatedEventNumber" min-width="150" />
        <ElTableColumn label="关联事件名称" align="center" prop="relatedEventName" min-width="150" />
        <ElTableColumn label="关联类型" align="center" prop="associationType" min-width="120">
          <template #default="scope">
            {{ getAssociationTypeLabel(scope.row.associationType) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="关联强度" align="center" prop="associationStrength" min-width="100" />
        <ElTableColumn
          label="分析时间"
          align="center"
          prop="analysisTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn label="分析人员" align="center" prop="analysts" min-width="100" />
        <ElTableColumn label="分析结论" align="center" prop="conclusion" min-width="200" />
        <ElTableColumn label="关联证据" align="center" prop="relatedEvidence" min-width="200" />
        <ElTableColumn label="建议措施" align="center" prop="recommendedMeasure" min-width="200" />
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
    <EventAnalysisForm ref="formRef" @success="getList" />
  </div>
</template>
