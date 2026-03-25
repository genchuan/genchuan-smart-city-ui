<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { IssueTrackingApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/issuetracking';
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

import IssueTrackingForm from './IssueTrackingForm.vue';

/** 问题上报与闭环跟踪 列表 */
defineOptions({ name: 'IssueTracking' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  issueId: undefined,
  issueType: undefined,
  reportTime: [],
  dispatchTime: [],
  repairStaffId: undefined,
  repairTime: [],
  inspectionResult: undefined,
  closureStatus: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await IssueTrackingApi.getIssueTrackingPage(
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
    await confirm('是否确认删除该问题上报与闭环跟踪数据？', '系统提示');
    // 发起删除
    await IssueTrackingApi.deleteIssueTracking(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有问题上报与闭环跟踪数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await IssueTrackingApi.exportIssueTracking(
      queryParams,
    );
    download.excel(data, '问题上报与闭环跟踪.xls');
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
        <ElFormItem label="问题ID" prop="issueId">
          <ElInput
            v-model="queryParams.issueId"
            placeholder="请输入问题ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="问题类型" prop="issueType">
          <ElInput
            v-model="queryParams.issueType"
            placeholder="请输入问题类型(漏点/设备故障/标识牌损坏)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 280px"
          />
        </ElFormItem>
        <ElFormItem label="上报时间" prop="reportTime">
          <ElDatePicker
            v-model="queryParams.reportTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="派单时间" prop="dispatchTime">
          <ElDatePicker
            v-model="queryParams.dispatchTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="维修人员ID" prop="repairStaffId">
          <ElInput
            v-model="queryParams.repairStaffId"
            placeholder="请输入维修人员ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="修复时间" prop="repairTime">
          <ElDatePicker
            v-model="queryParams.repairTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="验收结果" prop="inspectionResult">
          <ElInput
            v-model="queryParams.inspectionResult"
            placeholder="请输入验收结果"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="闭环状态" prop="closureStatus">
          <ElInput
            v-model="queryParams.closureStatus"
            placeholder="请输入闭环状态"
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
        <ElTableColumn
          label="序号"
          align="center"
          prop="id"
          min-width="80"
        />
        <ElTableColumn
          label="问题ID"
          align="center"
          prop="issueId"
          min-width="100"
        />
        <ElTableColumn
          label="问题类型(漏点/设备故障/标识牌损坏)"
          align="center"
          prop="issueType"
          min-width="240"
        />
        <ElTableColumn
          label="上报时间"
          align="center"
          prop="reportTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="派单时间"
          align="center"
          prop="dispatchTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="维修人员ID"
          align="center"
          prop="repairStaffId"
          min-width="120"
        />
        <ElTableColumn
          label="修复时间"
          align="center"
          prop="repairTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="验收结果"
          align="center"
          prop="inspectionResult"
          min-width="100"
        />
        <ElTableColumn
          label="闭环状态"
          align="center"
          prop="closureStatus"
          min-width="100"
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
    <IssueTrackingForm ref="formRef" @success="getList" />
  </div>
</template>
