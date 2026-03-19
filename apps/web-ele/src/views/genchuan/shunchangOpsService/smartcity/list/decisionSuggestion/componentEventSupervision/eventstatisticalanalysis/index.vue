<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import {
  EventStatisticalAnalysisApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/eventstatisticalanalysis';
import download from '#/utils/genchuan/download';
import { ElMessage, ElCard, ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination, ElSpace, ElSelect, ElOption } from 'element-plus';
import { Icon } from '@iconify/vue';

import EventStatisticalAnalysisForm from './EventStatisticalAnalysisForm.vue';

/** 事件统计分析 列表 */
defineOptions({ name: 'EventStatisticalAnalysis' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  statisticalCycle: undefined,
  eventType: undefined,
  place: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 获取事件类型标签
const getEventTypeLabel = (value: string) => {
  const typeMap: Record<string, string> = {
    fault: '故障事件',
    maintenance: '维护事件',
    abnormal_operation: '异常运行事件',
    early_warning: '预警事件',
    replacement: '更换事件',
    inspection_found: '巡检发现事件',
    scrap: '报废事件',
    other: '其他事件',
  };
  return typeMap[value] || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await EventStatisticalAnalysisApi.getEventStatisticalAnalysisPage(
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
    await confirm('是否确认删除该事件统计分析数据？', '系统提示');
    // 发起删除
    await EventStatisticalAnalysisApi.deleteEventStatisticalAnalysis(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有事件统计分析数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await EventStatisticalAnalysisApi.exportEventStatisticalAnalysis(
        queryParams,
      );
    download.excel(data, '事件统计分析.xls');
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
        <ElFormItem label="统计周期" prop="statisticalCycle">
          <ElInput
            v-model="queryParams.statisticalCycle"
            placeholder="请输入统计周期"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="事件类型" prop="eventType">
          <ElSelect
            v-model="queryParams.eventType"
            placeholder="请选择事件类型"
            clearable
            style="width: 240px"
          >
            <ElOption label="故障事件" value="fault" />
            <ElOption label="维护事件" value="maintenance" />
            <ElOption label="异常运行事件" value="abnormal_operation" />
            <ElOption label="预警事件" value="early_warning" />
            <ElOption label="更换事件" value="replacement" />
            <ElOption label="巡检发现事件" value="inspection_found" />
            <ElOption label="报废事件" value="scrap" />
            <ElOption label="其他事件" value="other" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="发生地点" prop="place">
          <ElInput
            v-model="queryParams.place"
            placeholder="请输入发生地点"
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
          label="统计周期"
          align="center"
          prop="statisticalCycle"
          min-width="120"
        />
        <ElTableColumn label="事件类型" align="center" prop="eventType" min-width="120">
          <template #default="scope">
            {{ getEventTypeLabel(scope.row.eventType) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="事件数量" align="center" prop="numberOfEvents" min-width="100" />
        <ElTableColumn label="发生地点" align="center" prop="place" min-width="150" />
        <ElTableColumn label="高发时段" align="center" prop="highIncidencePeriod" min-width="100" />
        <ElTableColumn label="平均处理时长" align="center" prop="aht" min-width="100" />
        <ElTableColumn label="处理成功率" align="center" prop="processingSuccessRate" min-width="100" />
        <ElTableColumn label="严重程度分布" align="center" prop="severityDistribution" min-width="120" />
        <ElTableColumn label="涉及部门" align="center" prop="involvedDepartments" min-width="120" />
        <ElTableColumn label="责任主体" align="center" prop="responsibleParty" min-width="120" />
        <ElTableColumn label="处理方式占比" align="center" prop="proportionOfProcessing" min-width="120" />
        <ElTableColumn label="资源消耗统计" align="center" prop="resourceConsumption" min-width="120" />
        <ElTableColumn label="不同渠道上报占比" align="center" prop="proportionOfReporting" min-width="130" />
        <ElTableColumn label="重复事件数量" align="center" prop="numberOfRepeatedEvents" min-width="120" />
        <ElTableColumn label="时间序列趋势" align="center" prop="timeSeriesTrend" min-width="120" />
        <ElTableColumn label="关联部件故障次数" align="center" prop="numberOfRelated" min-width="130" />
        <ElTableColumn label="公众反馈满意度评分" align="center" prop="publicFeedbackSatisfaction" min-width="140" />
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
    <EventStatisticalAnalysisForm ref="formRef" @success="getList" />
  </div>
</template>
