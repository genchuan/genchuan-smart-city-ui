<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { CaseAcceptanceApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/caseacceptance';
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

import CaseAcceptanceForm from './CaseAcceptanceForm.vue';

/** 案件受理 列表 */
defineOptions({ name: 'CaseAcceptance' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  caseCode: undefined,
  caseName: undefined,
  caseTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 获取案件来源标签
const getCaseSourceLabel = (value: string) => {
  const sourceMap: Record<string, string> = {
    telephone: '电话举报',
    network: '网络举报',
    wechat: '微信举报',
    citizen_photo: '市民随手拍',
    online_monitor: '在线监测系统自动上报',
    on_site_inspection: '现场巡查发现',
    other_department: '其他部门移交',
    letter_report: '来信举报',
  };
  return sourceMap[value] || value;
};

// 获取案件状态标签
const getCaseStatusLabel = (value: string) => {
  const statusMap: Record<string, string> = {
    pending_filing: '待立案',
    filed: '已立案',
    rejected_filing: '不予立案',
    rejected_review: '驳回重审',
  };
  return statusMap[value] || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await CaseAcceptanceApi.getCaseAcceptancePage(queryParams);
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
    await confirm('是否确认删除该案件受理数据？', '系统提示');
    // 发起删除
    await CaseAcceptanceApi.deleteCaseAcceptance(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有案件受理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await CaseAcceptanceApi.exportCaseAcceptance(queryParams);
    download.excel(data, '案件受理.xls');
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
        label-width="80px"
      >
        <ElFormItem label="案件编号" prop="caseCode">
          <ElInput
            v-model="queryParams.caseCode"
            placeholder="请输入案件编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="案件名称" prop="caseName">
          <ElInput
            v-model="queryParams.caseName"
            placeholder="请输入案件名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="案件时间" prop="caseTime">
          <ElDatePicker
            v-model="queryParams.caseTime"
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
        <ElTableColumn label="ID" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="案件编号"
          align="center"
          prop="caseCode"
          min-width="120"
        />
        <ElTableColumn
          label="案件名称"
          align="center"
          prop="caseName"
          min-width="150"
        />
        <ElTableColumn
          label="案件类型"
          align="center"
          prop="caseType"
          min-width="100"
        />
        <ElTableColumn
          label="案件来源"
          align="center"
          prop="caseSource"
          min-width="150"
        >
          <template #default="scope">
            {{ getCaseSourceLabel(scope.row.caseSource) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="案件时间"
          align="center"
          prop="caseTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="案件地点"
          align="center"
          prop="caseLocation"
          min-width="150"
        />
        <ElTableColumn
          label="报案单位"
          align="center"
          prop="reportUnit"
          min-width="120"
        />
        <ElTableColumn
          label="当事人信息"
          align="center"
          prop="reportPerson"
          min-width="100"
        />
        <ElTableColumn
          label="联系电话"
          align="center"
          prop="reportPhone"
          min-width="120"
        />
        <ElTableColumn
          label="案件描述"
          align="center"
          prop="caseDesc"
          min-width="200"
        />
        <ElTableColumn
          label="立案状态"
          align="center"
          prop="caseStatus"
          min-width="100"
        >
          <template #default="scope">
            {{ getCaseStatusLabel(scope.row.caseStatus) }}
          </template>
        </ElTableColumn>
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
    <CaseAcceptanceForm ref="formRef" @success="getList" />
  </div>
</template>
