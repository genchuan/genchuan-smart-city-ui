<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { PolicyAndRegulationInputApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/policyandregulationinput';
import { ClassificationOfPoliciesAndRegulationsApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/policiesRegulations/classificationofpoliciesandregulations';
import download from '#/utils/genchuan/download';
import { dateFormatter, dateFormatter2 } from '#/utils/genchuan/formatTime';
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
import { $t } from '#/locales';

import PolicyAndRegulationInputForm from './PolicyAndRegulationInputForm.vue';

/** 政策法规录入 列表 */
defineOptions({ name: 'PolicyAndRegulationInput' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  developingAgencies: undefined,
  nameOfPolicyAndRegulation: undefined,
  documentNumber: undefined,
  mainContent: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const regulatoryCategoryOptions = ref([]); // 法规分类

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await PolicyAndRegulationInputApi.getPolicyAndRegulationInputPage(
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
    await confirm('是否确认删除该政策法规录入数据？', '系统提示');
    // 发起删除
    await PolicyAndRegulationInputApi.deletePolicyAndRegulationInput(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有政策法规录入数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await PolicyAndRegulationInputApi.exportPolicyAndRegulationInput(
        queryParams,
      );
    download.excel(data, '政策法规录入.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化法规分类数据 */
const initData = async () => {
  const queryParams = {
    pageNo: 1,
    pageSize: 100,
  };
  const data =
    await ClassificationOfPoliciesAndRegulationsApi.getClassificationOfPoliciesAndRegulationsPage(
      queryParams,
    );
  regulatoryCategoryOptions.value = data.list.map((item) => ({
    label: item.regulatoryCategory,
    value: item.id,
  }));
};

/** 初始化 */
onMounted(() => {
  getList();
  initData();
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
        <ElFormItem label="制定机关" prop="developingAgencies">
          <ElInput
            v-model="queryParams.developingAgencies"
            placeholder="请输入制定机关"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="政策法规名称" prop="nameOfPolicyAndRegulation">
          <ElInput
            v-model="queryParams.nameOfPolicyAndRegulation"
            placeholder="请输入政策法规名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="文号" prop="documentNumber">
          <ElInput
            v-model="queryParams.documentNumber"
            placeholder="请输入文号"
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
        <ElTableColumn label="主键" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="制定机关"
          align="center"
          prop="developingAgencies"
          min-width="120"
        />
        <ElTableColumn
          label="政策法规名称"
          align="center"
          prop="nameOfPolicyAndRegulation"
          min-width="150"
        />
        <ElTableColumn
          label="文号"
          align="center"
          prop="documentNumber"
          min-width="120"
        />
        <ElTableColumn
          label="发布日期"
          align="center"
          prop="releaseDate"
          :formatter="dateFormatter2"
          min-width="120"
        />
        <ElTableColumn
          label="生效日期"
          align="center"
          prop="effectiveDate"
          :formatter="dateFormatter2"
          min-width="120"
        />
        <ElTableColumn
          label="失效日期"
          align="center"
          prop="expiringDate"
          :formatter="dateFormatter2"
          min-width="120"
        />
        <ElTableColumn
          label="法规类别"
          align="center"
          prop="regulatoryCategory"
          min-width="120"
        >
          <template #default="scope">
            <span v-for="(item, key) in regulatoryCategoryOptions" :key="key">
              <span v-if="scope.row.regulatoryCategory == item.value">
                {{ item.label }}
              </span>
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="所属领域"
          align="center"
          prop="isArea"
          min-width="120"
        />
        <ElTableColumn
          label="适用范围"
          align="center"
          prop="scopeOfApplication"
          min-width="120"
        />
        <ElTableColumn
          label="正文内容"
          align="center"
          prop="mainContent"
          min-width="150"
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
          fixed="right"
          min-width="120"
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
    <PolicyAndRegulationInputForm ref="formRef" @success="getList" />
  </div>
</template>
