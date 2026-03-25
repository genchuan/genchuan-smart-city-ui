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
      <ElFormItem label="户表编号" prop="meterCode">
        <ElInput
          v-model="queryParams.meterCode"
          placeholder="请输入户表编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="原用户编号" label-width="auto" prop="oldUserCode">
        <ElInput
          v-model="queryParams.oldUserCode"
          placeholder="请输入原用户编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="新用户编号" label-width="auto" prop="newUserCode">
        <ElInput
          v-model="queryParams.newUserCode"
          placeholder="请输入新用户编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="变更原因" prop="changeReason">
        <ElInput
          v-model="queryParams.changeReason"
          placeholder="请输入变更原因"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="变更时间" prop="changeTime">
        <ElDatePicker
          v-model="queryParams.changeTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </ElFormItem>
      <ElFormItem label="经办人" prop="operator">
        <ElInput
          v-model="queryParams.operator"
          placeholder="请输入经办人"
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
            v-hasPermi="['waterdetection:meter-user-relation:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" />
            新增
          </ElButton>
          <ElButton
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['waterdetection:meter-user-relation:export']"
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
    <ElTable
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <ElTableColumn label="序号" align="center" prop="id" min-width="80" />
      <ElTableColumn
        label="户表编号"
        align="center"
        prop="meterCode"
        min-width="120"
      />
      <ElTableColumn
        label="原用户编号"
        align="center"
        prop="oldUserCode"
        min-width="120"
      />
      <ElTableColumn
        label="新用户编号"
        align="center"
        prop="newUserCode"
        min-width="120"
      />
      <ElTableColumn
        label="变更原因"
        align="center"
        prop="changeReason"
        min-width="150"
      />
      <ElTableColumn
        label="变更时间"
        align="center"
        prop="changeTime"
        :formatter="dateFormatter"
        min-width="180"
      />
      <ElTableColumn
        label="经办人"
        align="center"
        prop="operator"
        min-width="100"
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
        min-width="120px"
        fixed="right"
      >
        <template #default="scope">
          <ElButton
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['waterdetection:meter-user-relation:update']"
          >
            编辑
          </ElButton>
          <ElButton
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['waterdetection:meter-user-relation:delete']"
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
  <MeterUserRelationForm ref="formRef" @success="getList" />
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
  MeterUserRelationApi,
  MeterUserRelationVO,
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/meteruserrelation';

import MeterUserRelationForm from './MeterUserRelationForm.vue';

/** 户表关联及变更管理 列表 */
defineOptions({ name: 'MeterUserRelation' });

const loading = ref(true); // 列表的加载中
const list = ref<MeterUserRelationVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  meterCode: undefined,
  oldUserCode: undefined,
  newUserCode: undefined,
  changeReason: undefined,
  changeTime: [],
  operator: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await MeterUserRelationApi.getMeterUserRelationPage(queryParams);
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
    await MeterUserRelationApi.deleteMeterUserRelation(id);
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
    const data =
      await MeterUserRelationApi.exportMeterUserRelation(queryParams);
    downloadFile(data, '户表关联及变更管理.xls');
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
