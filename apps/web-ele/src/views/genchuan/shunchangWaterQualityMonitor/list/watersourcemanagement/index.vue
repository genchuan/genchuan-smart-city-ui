<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { WaterSourceManagementApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersourcemanagement';
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
  ElPagination,
  ElSpace,
} from 'element-plus';
import { Icon } from '@iconify/vue';

import WaterSourceManagementForm from './WaterSourceManagementForm.vue';

/** 水源类型及属性管理 列表 */
defineOptions({ name: 'WaterSourceManagement' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  sourceCode: undefined,
  sourceName: undefined,
  sourceType: undefined,
  longitude: undefined,
  latitude: undefined,
  administrativeRegion: undefined,
  sourceDescription: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await WaterSourceManagementApi.getWaterSourceManagementPage(queryParams);
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
    await confirm('是否确认删除该水源类型及属性数据？', '系统提示');
    // 发起删除
    await WaterSourceManagementApi.deleteWaterSourceManagement(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有水源类型及属性数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await WaterSourceManagementApi.exportWaterSourceManagement(queryParams);
    download.excel(data, '水源类型及属性管理.xls');
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
        <ElFormItem label="水源编码" prop="sourceCode">
          <ElInput
            v-model="queryParams.sourceCode"
            placeholder="请输入水源编码"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="水源名称" prop="sourceName">
          <ElInput
            v-model="queryParams.sourceName"
            placeholder="请输入水源名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="水源类型" prop="sourceType">
          <ElInput
            v-model="queryParams.sourceType"
            placeholder="请输入水源类型"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="所属行政区" prop="administrativeRegion">
          <ElInput
            v-model="queryParams.administrativeRegion"
            placeholder="请输入所属行政区"
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
        <ElTableColumn label="序号" align="center" prop="id" min-width="80" />
        <ElTableColumn
          label="水源编码"
          align="center"
          prop="sourceCode"
          min-width="120"
        />
        <ElTableColumn
          label="水源名称"
          align="center"
          prop="sourceName"
          min-width="120"
        />
        <ElTableColumn
          label="水源类型"
          align="center"
          prop="sourceType"
          min-width="100"
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
          label="所属行政区"
          align="center"
          prop="administrativeRegion"
          min-width="120"
        />
        <ElTableColumn
          label="水源描述"
          align="center"
          prop="sourceDescription"
          min-width="150"
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
    <WaterSourceManagementForm ref="formRef" @success="getList" />
  </div>
</template>
