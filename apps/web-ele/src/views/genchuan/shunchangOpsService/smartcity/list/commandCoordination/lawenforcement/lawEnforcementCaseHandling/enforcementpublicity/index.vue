<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { EnforcementPublicityApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawEnforcementCaseHandling/enforcementpublicity';
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

import EnforcementPublicityForm from './EnforcementPublicityForm.vue';

/** 执法公示 列表 */
defineOptions({ name: 'EnforcementPublicity' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  publicityNumber: undefined,
  publicityTitle: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 获取公示类型标签
const getPublicityTypeLabel = (value: string) => {
  const typeMap: Record<string, string> = {
    administrative_penalty: '行政处罚公示',
    administrative_permit: '行政许可公示',
    administrative_enforcement: '行政强制公示',
    law_enforcement_basis: '执法依据公示',
    law_enforcement_process: '执法流程公示',
    law_enforcement_supervision: '执法监督公示',
  };
  return typeMap[value] || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await EnforcementPublicityApi.getEnforcementPublicityPage(queryParams);
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
    await confirm('是否确认删除该执法公示数据？', '系统提示');
    // 发起删除
    await EnforcementPublicityApi.deleteEnforcementPublicity(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有执法公示数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await EnforcementPublicityApi.exportEnforcementPublicity(queryParams);
    download.excel(data, '执法公示.xls');
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
        <ElFormItem label="执法公示编号" prop="publicityNumber">
          <ElInput
            v-model="queryParams.publicityNumber"
            placeholder="请输入执法公示编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="公示标题" prop="publicityTitle">
          <ElInput
            v-model="queryParams.publicityTitle"
            placeholder="请输入公示标题"
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
        <ElTableColumn label="主键" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="执法公示编号"
          align="center"
          prop="publicityNumber"
          min-width="150"
        />
        <ElTableColumn
          label="公示标题"
          align="center"
          prop="publicityTitle"
          min-width="200"
        />
        <ElTableColumn
          label="公示内容"
          align="center"
          prop="publicityContent"
          min-width="200"
        />
        <ElTableColumn
          label="公示类型"
          align="center"
          prop="publicityType"
          min-width="120"
        >
          <template #default="scope">
            {{ getPublicityTypeLabel(scope.row.publicityType) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="执法部门"
          align="center"
          prop="enforcement"
          min-width="120"
        />
        <ElTableColumn
          label="执法地点"
          align="center"
          prop="enforcementLocation"
          min-width="120"
        />
        <ElTableColumn
          label="执法依据"
          align="center"
          prop="enforcementBasis"
          min-width="150"
        />
        <ElTableColumn
          label="执法结果"
          align="center"
          prop="enforcementResults"
          min-width="150"
        />
        <ElTableColumn
          label="公示开始时间"
          align="center"
          prop="announcementStartTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="公示截止时间"
          align="center"
          prop="announcementDeadline"
          :formatter="dateFormatter"
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
    <EnforcementPublicityForm ref="formRef" @success="getList" />
  </div>
</template>
