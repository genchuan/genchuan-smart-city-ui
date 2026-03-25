<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { InvalidDataApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/invaliddata';
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

import InvalidDataForm from './InvalidDataForm.vue';

/** 不合格数据处理 列表 */
defineOptions({ name: 'InvalidData' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  dataId: undefined,
  instrumentId: undefined,
  monitorValue: undefined,
  collectionTime: [],
  dataStatus: undefined,
  invalidReason: undefined,
  isExcluded: undefined,
  processorId: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await InvalidDataApi.getInvalidDataPage(
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
    await confirm('是否确认删除该不合格数据处理数据？', '系统提示');
    // 发起删除
    await InvalidDataApi.deleteInvalidData(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有不合格数据处理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await InvalidDataApi.exportInvalidData(
      queryParams,
    );
    download.excel(data, '不合格数据处理.xls');
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
        <ElFormItem label="数据ID" prop="dataId">
          <ElInput
            v-model="queryParams.dataId"
            placeholder="请输入数据ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="仪器ID" prop="instrumentId">
          <ElInput
            v-model="queryParams.instrumentId"
            placeholder="请输入仪器ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="监测值" prop="monitorValue">
          <ElInput
            v-model="queryParams.monitorValue"
            placeholder="请输入监测值"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="采集时间" prop="collectionTime">
          <ElDatePicker
            v-model="queryParams.collectionTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="数据状态" prop="dataStatus">
          <ElInput
            v-model="queryParams.dataStatus"
            placeholder="请输入数据状态(有效/无效)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="无效原因" prop="invalidReason">
          <ElInput
            v-model="queryParams.invalidReason"
            placeholder="请输入无效原因"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="剔除标记" prop="isExcluded">
          <ElInput
            v-model="queryParams.isExcluded"
            placeholder="请输入剔除标记(0未剔除1已剔除)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="处理人员ID" prop="processorId">
          <ElInput
            v-model="queryParams.processorId"
            placeholder="请输入处理人员ID"
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
          label="数据ID"
          align="center"
          prop="dataId"
          min-width="100"
        />
        <ElTableColumn
          label="仪器ID"
          align="center"
          prop="instrumentId"
          min-width="100"
        />
        <ElTableColumn
          label="监测值"
          align="center"
          prop="monitorValue"
          min-width="100"
        />
        <ElTableColumn
          label="采集时间"
          align="center"
          prop="collectionTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="数据状态(有效/无效)"
          align="center"
          prop="dataStatus"
          min-width="160"
        />
        <ElTableColumn
          label="无效原因"
          align="center"
          prop="invalidReason"
          min-width="120"
        />
        <ElTableColumn
          label="剔除标记(0未剔除1已剔除)"
          align="center"
          prop="isExcluded"
          min-width="180"
        />
        <ElTableColumn
          label="处理人员ID"
          align="center"
          prop="processorId"
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
    <InvalidDataForm ref="formRef" @success="getList" />
  </div>
</template>
