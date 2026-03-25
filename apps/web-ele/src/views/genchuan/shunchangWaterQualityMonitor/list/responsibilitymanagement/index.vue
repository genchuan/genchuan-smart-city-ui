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
      <ElFormItem label="责任类型" label-width="auto" prop="responsibilityType">
        <ElInput
          v-model="queryParams.responsibilityType"
          placeholder="请输入责任类型(主体责任/监管责任/运行管理责任)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="责任单位" prop="responsibleUnit">
        <ElInput
          v-model="queryParams.responsibleUnit"
          placeholder="请输入责任单位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="责任人姓名" label-width="auto" prop="responsiblePerson">
        <ElInput
          v-model="queryParams.responsiblePerson"
          placeholder="请输入责任人姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="职务" prop="position">
        <ElInput
          v-model="queryParams.position"
          placeholder="请输入职务"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="联系方式" prop="contactInfo">
        <ElInput
          v-model="queryParams.contactInfo"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </ElFormItem>
      <ElFormItem label="责任范围" prop="responsibilityScope">
        <ElInput
          v-model="queryParams.responsibilityScope"
          placeholder="请输入责任范围"
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
            v-hasPermi="['waterdetection:responsibility-management:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" />
            新增
          </ElButton>
          <ElButton
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['waterdetection:responsibility-management:export']"
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
      <ElTableColumn label="责任类型" align="center" prop="responsibilityType" min-width="200" />
      <ElTableColumn label="责任单位" align="center" prop="responsibleUnit" min-width="120" />
      <ElTableColumn label="责任人姓名" align="center" prop="responsiblePerson" min-width="120" />
      <ElTableColumn label="职务" align="center" prop="position" min-width="100" />
      <ElTableColumn label="联系方式" align="center" prop="contactInfo" min-width="120" />
      <ElTableColumn label="责任范围" align="center" prop="responsibilityScope" min-width="150" />
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
            v-hasPermi="['waterdetection:responsibility-management:update']"
          >
            编辑
          </ElButton>
          <ElButton
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['waterdetection:responsibility-management:delete']"
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
  <ResponsibilityManagementForm ref="formRef" @success="getList" />
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
  ResponsibilityManagementApi,
  ResponsibilityManagementVO,
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/responsibilitymanagement';

import ResponsibilityManagementForm from './ResponsibilityManagementForm.vue';

/** 责任单位及责任人管理 列表 */
defineOptions({ name: 'ResponsibilityManagement' });

const loading = ref(true); // 列表的加载中
const list = ref<ResponsibilityManagementVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  responsibilityType: undefined,
  responsibleUnit: undefined,
  responsiblePerson: undefined,
  position: undefined,
  contactInfo: undefined,
  responsibilityScope: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ResponsibilityManagementApi.getResponsibilityManagementPage(queryParams);
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
    await ResponsibilityManagementApi.deleteResponsibilityManagement(id);
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
    const data = await ResponsibilityManagementApi.exportResponsibilityManagement(queryParams);
    downloadFile(data, '责任单位及责任人管理.xls');
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
