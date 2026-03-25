<template>
  <ElCard>
    <!-- 搜索工作栏 -->
    <ElForm
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <ElFormItem label="岗位名称" prop="positionName">
        <ElInput
          v-model="queryParams.positionName"
          placeholder="请输入岗位名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="岗位职责描述" label-width="auto" prop="responsibilityDesc">
        <ElInput
          v-model="queryParams.responsibilityDesc"
          placeholder="请输入岗位职责描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="任职要求" prop="qualificationReq">
        <ElInput
          v-model="queryParams.qualificationReq"
          placeholder="请输入任职要求"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="所属单位" prop="belongUnit">
        <ElInput
          v-model="queryParams.belongUnit"
          placeholder="请输入所属单位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="负责人" prop="manager">
        <ElInput
          v-model="queryParams.manager"
          placeholder="请输入负责人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
          class="!w-220px"
        />
      </ElFormItem>
      <ElFormItem>
        <ElSpace>
          <ElButton @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" />
            搜索
          </ElButton>
          <ElButton @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />
            重置
          </ElButton>
          <ElButton
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['waterdetection:position-responsibility:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" />
            新增
          </ElButton>
          <ElButton
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['waterdetection:position-responsibility:export']"
          >
            <Icon icon="ep:download" class="mr-5px" />
            导出
          </ElButton>
        </ElSpace>
      </ElFormItem>
    </ElForm>
  </ElCard>

  <!-- 列表 -->
  <ElCard class="mt-16px">
    <ElTable v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <ElTableColumn label="序号" align="center" prop="id" min-width="80" />
      <ElTableColumn label="岗位名称" align="center" prop="positionName" min-width="120" />
      <ElTableColumn label="岗位职责描述" align="center" prop="responsibilityDesc" min-width="150" />
      <ElTableColumn label="任职要求" align="center" prop="qualificationReq" min-width="150" />
      <ElTableColumn label="所属单位" align="center" prop="belongUnit" min-width="120" />
      <ElTableColumn label="负责人" align="center" prop="manager" min-width="100" />
      <ElTableColumn
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        min-width="180"
      />
      <ElTableColumn label="操作" align="center" min-width="120px" fixed="right">
        <template #default="scope">
          <ElButton
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['waterdetection:position-responsibility:update']"
          >
            编辑
          </ElButton>
          <ElButton
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['waterdetection:position-responsibility:delete']"
          >
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <!-- 分页 -->
    <ElPagination
      class="mt-16px justify-end"
      :total="total"
      v-model:current-page="queryParams.pageNo"
      v-model:page-size="queryParams.pageSize"
      @change="getList"
    />
  </ElCard>

  <!-- 表单弹窗：添加/修改 -->
  <PositionResponsibilityForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { confirm, downloadFile } from '@vben/common-ui';
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

import { dateFormatter } from '#/utils/formatTime';

import {
  PositionResponsibilityApi,
  PositionResponsibilityVO,
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/positionresponsibility';

import PositionResponsibilityForm from './PositionResponsibilityForm.vue';

/** 岗位职责划分管理 列表 */
defineOptions({ name: 'PositionResponsibility' });

const loading = ref(true); // 列表的加载中
const list = ref<PositionResponsibilityVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  positionName: undefined,
  responsibilityDesc: undefined,
  qualificationReq: undefined,
  belongUnit: undefined,
  manager: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await PositionResponsibilityApi.getPositionResponsibilityPage(queryParams);
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
    await confirm('是否删除该数据？');
    // 发起删除
    await PositionResponsibilityApi.deletePositionResponsibility(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否导出数据？');
    // 发起导出
    exportLoading.value = true;
    const data = await PositionResponsibilityApi.exportPositionResponsibility(queryParams);
    downloadFile(data, '岗位职责划分管理.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});
</script>