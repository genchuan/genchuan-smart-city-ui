<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { InspectionRouteApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/inspectionroute';
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

import InspectionRouteForm from './InspectionRouteForm.vue';

/** 巡检路线规划与优化 列表 */
defineOptions({ name: 'InspectionRoute' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  routeId: undefined,
  inspectionPointId: undefined,
  pointType: undefined,
  longitude: undefined,
  latitude: undefined,
  estimatedArrivalTime: [],
  actualArrivalTime: [],
  routeAdjustReason: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await InspectionRouteApi.getInspectionRoutePage(
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
    await confirm('是否确认删除该巡检路线规划与优化数据？', '系统提示');
    // 发起删除
    await InspectionRouteApi.deleteInspectionRoute(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有巡检路线规划与优化数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await InspectionRouteApi.exportInspectionRoute(
      queryParams,
    );
    download.excel(data, '巡检路线规划与优化.xls');
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
        <ElFormItem label="路线ID" prop="routeId">
          <ElInput
            v-model="queryParams.routeId"
            placeholder="请输入路线ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡检点ID" prop="inspectionPointId">
          <ElInput
            v-model="queryParams.inspectionPointId"
            placeholder="请输入巡检点ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="巡检点类型" prop="pointType">
          <ElInput
            v-model="queryParams.pointType"
            placeholder="请输入巡检点类型(水源地/水厂/管网节点)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 280px"
          />
        </ElFormItem>
        <ElFormItem label="经度" prop="longitude">
          <ElInput
            v-model="queryParams.longitude"
            placeholder="请输入经度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="纬度" prop="latitude">
          <ElInput
            v-model="queryParams.latitude"
            placeholder="请输入纬度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="预计到达时间" prop="estimatedArrivalTime">
          <ElDatePicker
            v-model="queryParams.estimatedArrivalTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="实际到达时间" prop="actualArrivalTime">
          <ElDatePicker
            v-model="queryParams.actualArrivalTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="路线调整原因" prop="routeAdjustReason">
          <ElInput
            v-model="queryParams.routeAdjustReason"
            placeholder="请输入路线调整原因"
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
          label="路线ID"
          align="center"
          prop="routeId"
          min-width="100"
        />
        <ElTableColumn
          label="巡检点ID"
          align="center"
          prop="inspectionPointId"
          min-width="100"
        />
        <ElTableColumn
          label="巡检点类型(水源地/水厂/管网节点)"
          align="center"
          prop="pointType"
          min-width="220"
        />
        <ElTableColumn
          label="经度"
          align="center"
          prop="longitude"
          min-width="100"
        />
        <ElTableColumn
          label="纬度"
          align="center"
          prop="latitude"
          min-width="100"
        />
        <ElTableColumn
          label="预计到达时间"
          align="center"
          prop="estimatedArrivalTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="实际到达时间"
          align="center"
          prop="actualArrivalTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="路线调整原因"
          align="center"
          prop="routeAdjustReason"
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
    <InspectionRouteForm ref="formRef" @success="getList" />
  </div>
</template>
