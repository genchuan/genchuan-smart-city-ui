<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { confirm } from '@vben/common-ui';

import { Icon } from '@iconify/vue';
import {
  ElButton,
  ElCard,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElPagination,
  ElSpace,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { DmaPartitionApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/dmapartition';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import DmaPartitionForm from './DmaPartitionForm.vue';

/** DMA分区划分与调整 列表 */
defineOptions({ name: 'DmaPartition' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  partitionId: undefined,
  partitionName: undefined,
  coveredVillages: undefined,
  boundaryCoordinates: undefined,
  monitorPointIds: undefined,
  divisionDate: [],
  adjustmentRecords: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DmaPartitionApi.getDmaPartitionPage(queryParams);
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
    await confirm('是否确认删除该DMA分区划分与调整数据？', '系统提示');
    // 发起删除
    await DmaPartitionApi.deleteDmaPartition(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有DMA分区划分与调整数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await DmaPartitionApi.exportDmaPartition(queryParams);
    download.excel(data, 'DMA分区划分与调整.xls');
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
        <ElFormItem label="分区ID" prop="partitionId">
          <ElInput
            v-model="queryParams.partitionId"
            placeholder="请输入分区ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="分区名称" prop="partitionName">
          <ElInput
            v-model="queryParams.partitionName"
            placeholder="请输入分区名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="覆盖行政村" prop="coveredVillages">
          <ElInput
            v-model="queryParams.coveredVillages"
            placeholder="请输入覆盖行政村"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="边界坐标" prop="boundaryCoordinates">
          <ElInput
            v-model="queryParams.boundaryCoordinates"
            placeholder="请输入边界坐标"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="包含监测点ID" prop="monitorPointIds">
          <ElInput
            v-model="queryParams.monitorPointIds"
            placeholder="请输入包含监测点ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="划分日期" prop="divisionDate">
          <ElDatePicker
            v-model="queryParams.divisionDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="调整记录" prop="adjustmentRecords">
          <ElInput
            v-model="queryParams.adjustmentRecords"
            placeholder="请输入调整记录"
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
          label="分区ID"
          align="center"
          prop="partitionId"
          min-width="100"
        />
        <ElTableColumn
          label="分区名称"
          align="center"
          prop="partitionName"
          min-width="120"
        />
        <ElTableColumn
          label="覆盖行政村"
          align="center"
          prop="coveredVillages"
          min-width="120"
        />
        <ElTableColumn
          label="边界坐标"
          align="center"
          prop="boundaryCoordinates"
          min-width="120"
        />
        <ElTableColumn
          label="包含监测点ID"
          align="center"
          prop="monitorPointIds"
          min-width="120"
        />
        <ElTableColumn
          label="划分日期"
          align="center"
          prop="divisionDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="调整记录"
          align="center"
          prop="adjustmentRecords"
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
    <DmaPartitionForm ref="formRef" @success="getList" />
  </div>
</template>
