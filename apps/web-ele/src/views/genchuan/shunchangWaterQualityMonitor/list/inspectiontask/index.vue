<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { InspectionTaskApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/inspectiontask';
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

import InspectionTaskForm from './InspectionTaskForm.vue';

/** 巡检任务派发与执行 列表 */
defineOptions({ name: 'InspectionTask' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskId: undefined,
  inspectorId: undefined,
  taskContent: undefined,
  dispatchTime: [],
  receiveTime: [],
  checkinTime: [],
  inspectionResult: undefined,
  photoUrl: undefined,
  locationInfo: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await InspectionTaskApi.getInspectionTaskPage(queryParams);
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
    await confirm('是否确认删除该巡检任务派发与执行数据？', '系统提示');
    // 发起删除
    await InspectionTaskApi.deleteInspectionTask(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有巡检任务派发与执行数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await InspectionTaskApi.exportInspectionTask(queryParams);
    download.excel(data, '巡检任务派发与执行.xls');
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
        label-width="120px"
      >
        <ElFormItem label="任务ID" prop="taskId">
          <ElInput
            v-model="queryParams.taskId"
            placeholder="请输入任务ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡检人员ID" prop="inspectorId">
          <ElInput
            v-model="queryParams.inspectorId"
            placeholder="请输入巡检人员ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="派发时间" prop="dispatchTime">
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
        <ElFormItem label="接收时间" prop="receiveTime">
          <ElDatePicker
            v-model="queryParams.receiveTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="签到时间" prop="checkinTime">
          <ElDatePicker
            v-model="queryParams.checkinTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="检查项结果" prop="inspectionResult">
          <ElInput
            v-model="queryParams.inspectionResult"
            placeholder="请输入检查项结果(正常/异常)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="现场照片URL" prop="photoUrl">
          <ElInput
            v-model="queryParams.photoUrl"
            placeholder="请输入现场照片URL"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="定位信息" prop="locationInfo">
          <ElInput
            v-model="queryParams.locationInfo"
            placeholder="请输入定位信息"
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
        <ElTableColumn label="序号" align="center" prop="id" min-width="80" />
        <ElTableColumn
          label="任务ID"
          align="center"
          prop="taskId"
          min-width="100"
        />
        <ElTableColumn
          label="巡检人员ID"
          align="center"
          prop="inspectorId"
          min-width="120"
        />
        <ElTableColumn
          label="任务内容"
          align="center"
          prop="taskContent"
          min-width="120"
        />
        <ElTableColumn
          label="派发时间"
          align="center"
          prop="dispatchTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="接收时间"
          align="center"
          prop="receiveTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="签到时间"
          align="center"
          prop="checkinTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="检查项结果(正常/异常)"
          align="center"
          prop="inspectionResult"
          min-width="180"
        />
        <ElTableColumn
          label="现场照片URL"
          align="center"
          prop="photoUrl"
          min-width="120"
        />
        <ElTableColumn
          label="定位信息"
          align="center"
          prop="locationInfo"
          min-width="120"
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
    <InspectionTaskForm ref="formRef" @success="getList" />
  </div>
</template>
