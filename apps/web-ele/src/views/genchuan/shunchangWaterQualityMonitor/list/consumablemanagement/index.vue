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

import { ConsumableManagementApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/consumablemanagement';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import ConsumableManagementForm from './ConsumableManagementForm.vue';

/** 耗材库存与更换管理 列表 */
defineOptions({ name: 'ConsumableManagement' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  consumableId: undefined,
  consumableType: undefined,
  stockQuantity: undefined,
  warningThreshold: undefined,
  lastReplacementDate: [],
  nextReplacementDate: [],
  replacementQuantity: undefined,
  relatedEquipmentId: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await ConsumableManagementApi.getConsumableManagementPage(
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
    await confirm('是否确认删除该耗材库存与更换管理数据？', '系统提示');
    // 发起删除
    await ConsumableManagementApi.deleteConsumableManagement(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有耗材库存与更换管理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await ConsumableManagementApi.exportConsumableManagement(
        queryParams,
      );
    download.excel(data, '耗材库存与更换管理.xls');
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
        label-width="130px"
      >
        <ElFormItem label="耗材ID" prop="consumableId">
          <ElInput
            v-model="queryParams.consumableId"
            placeholder="请输入耗材ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="耗材类型" prop="consumableType">
          <ElInput
            v-model="queryParams.consumableType"
            placeholder="请输入耗材类型"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="库存余量" prop="stockQuantity">
          <ElInput
            v-model="queryParams.stockQuantity"
            placeholder="请输入库存余量"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="预警阈值" prop="warningThreshold">
          <ElInput
            v-model="queryParams.warningThreshold"
            placeholder="请输入预警阈值"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="上次更换日期" prop="lastReplacementDate">
          <ElDatePicker
            v-model="queryParams.lastReplacementDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="预计下次更换日期" prop="nextReplacementDate">
          <ElDatePicker
            v-model="queryParams.nextReplacementDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="更换数量" prop="replacementQuantity">
          <ElInput
            v-model="queryParams.replacementQuantity"
            placeholder="请输入更换数量"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="关联设备ID" prop="relatedEquipmentId">
          <ElInput
            v-model="queryParams.relatedEquipmentId"
            placeholder="请输入关联设备ID"
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
          label="耗材ID"
          align="center"
          prop="consumableId"
          min-width="120"
        />
        <ElTableColumn
          label="耗材类型"
          align="center"
          prop="consumableType"
          min-width="120"
        />
        <ElTableColumn
          label="库存余量"
          align="center"
          prop="stockQuantity"
          min-width="100"
        />
        <ElTableColumn
          label="预警阈值"
          align="center"
          prop="warningThreshold"
          min-width="100"
        />
        <ElTableColumn
          label="上次更换日期"
          align="center"
          prop="lastReplacementDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="预计下次更换日期"
          align="center"
          prop="nextReplacementDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="更换数量"
          align="center"
          prop="replacementQuantity"
          min-width="100"
        />
        <ElTableColumn
          label="关联设备ID"
          align="center"
          prop="relatedEquipmentId"
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
    <ConsumableManagementForm ref="formRef" @success="getList" />
  </div>
</template>
