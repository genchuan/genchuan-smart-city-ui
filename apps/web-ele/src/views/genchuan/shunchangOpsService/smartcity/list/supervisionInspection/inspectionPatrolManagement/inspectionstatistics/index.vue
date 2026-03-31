<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { InspectionStatisticsApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/supervisionInspection/inspectionPatrolManagement/inspectionstatistics';
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
import { $t } from '#/locales';

import InspectionStatisticsForm from './InspectionStatisticsForm.vue';

/** 巡查分析统计 列表 */
defineOptions({ name: 'InspectionStatistics' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  patrolArea: undefined,
  patrolPersonnel: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await InspectionStatisticsApi.getInspectionStatisticsPage(queryParams);
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
    await confirm('是否确认删除该巡查分析统计数据？', '系统提示');
    // 发起删除
    await InspectionStatisticsApi.deleteInspectionStatistics(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有巡查分析统计数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await InspectionStatisticsApi.exportInspectionStatistics(queryParams);
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
        label-width="100px"
      >
        <ElFormItem label="巡查区域" prop="patrolArea">
          <ElInput
            v-model="queryParams.patrolArea"
            placeholder="请输入巡查区域"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡查人员" prop="patrolPersonnel">
          <ElInput
            v-model="queryParams.patrolPersonnel"
            placeholder="请输入巡查人员"
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
        <ElTableColumn label="主键" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="巡查区域"
          align="center"
          prop="patrolArea"
          min-width="120"
        />
        <ElTableColumn
          label="巡查人员"
          align="center"
          prop="patrolPersonnel"
          min-width="100"
        />
        <ElTableColumn
          label="巡查任务完成率"
          align="center"
          prop="completionInspectionTasks"
          min-width="125"
        />
        <ElTableColumn
          label="平均巡查时长"
          align="center"
          prop="averagePatrolDuration"
          min-width="120"
        />
        <ElTableColumn
          label="问题发现数量"
          align="center"
          prop="numberProblemDiscoveries"
          min-width="120"
        />
        <ElTableColumn
          label="不同类型问题分布"
          align="center"
          prop="distributionProblems"
          min-width="140"
        />
        <ElTableColumn
          label="问题解决率"
          align="center"
          prop="problemSolvingRate"
          min-width="120"
        />
        <ElTableColumn
          label="重复问题发生率"
          align="center"
          prop="repetitiveProblemRate"
          min-width="125"
        />
        <ElTableColumn
          label="风险等级评估"
          align="center"
          prop="riskLevelAssessment"
          min-width="120"
        />
        <ElTableColumn
          label="建议与改进措施"
          align="center"
          prop="suggestionsMeasures"
          min-width="140"
        />
        <ElTableColumn
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          min-width="180"
        />
        <ElTableColumn
          label="操作"
          align="center"
          fixed="right"
          min-width="120"
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
    <InspectionStatisticsForm ref="formRef" @success="getList" />
  </div>
</template>
