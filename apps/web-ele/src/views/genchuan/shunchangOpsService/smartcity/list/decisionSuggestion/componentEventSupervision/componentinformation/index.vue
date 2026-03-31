<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { getDictOptions, getDictLabel } from '@vben/hooks';
import { DICT_TYPE } from '@vben/constants';
import { ComponentInformationApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/decisionSuggestion/componentEventSupervision/componentinformation';
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
  ElSelect,
  ElOption,
} from 'element-plus';
import { Icon } from '@iconify/vue';

import ComponentInformationForm from './ComponentInformationForm.vue';

/** 部件信息 列表 */
defineOptions({ name: 'ComponentInformation' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  partNumber: undefined,
  componentName: undefined,
  partType: undefined,
  belongingRegion: undefined,
  componentStatus: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 字典选项
const partTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_PART_TYPE, 'string'),
);
const componentStatusOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_STATE, 'string'),
);

// 获取字典标签
const getPartTypeLabel = (value: string) =>
  getDictLabel(DICT_TYPE.SM_PART_TYPE, value) || value;
const getComponentStatusLabel = (value: string) =>
  getDictLabel(DICT_TYPE.SM_STATE, value) || value;

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await ComponentInformationApi.getComponentInformationPage(queryParams);
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
    await confirm('是否确认删除该部件信息数据？', '系统提示');
    // 发起删除
    await ComponentInformationApi.deleteComponentInformation(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有部件信息数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await ComponentInformationApi.exportComponentInformation(queryParams);
    download.excel(data, '部件信息.xls');
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
        label-width="80px"
      >
        <ElFormItem label="部件编号" prop="partNumber">
          <ElInput
            v-model="queryParams.partNumber"
            placeholder="请输入部件编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="部件名称" prop="componentName">
          <ElInput
            v-model="queryParams.componentName"
            placeholder="请输入部件名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="部件类型" prop="partType">
          <ElSelect
            v-model="queryParams.partType"
            placeholder="请选择部件类型"
            clearable
            style="width: 240px"
          >
            <ElOption
              v-for="dict in partTypeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="所属区域" prop="belongingRegion">
          <ElInput
            v-model="queryParams.belongingRegion"
            placeholder="请输入所属区域"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="部件状态" prop="componentStatus">
          <ElSelect
            v-model="queryParams.componentStatus"
            placeholder="请选择部件状态"
            clearable
            style="width: 240px"
          >
            <ElOption
              v-for="dict in componentStatusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </ElSelect>
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
          label="部件编号"
          align="center"
          prop="partNumber"
          min-width="150"
        />
        <ElTableColumn
          label="部件名称"
          align="center"
          prop="componentName"
          min-width="120"
        />
        <ElTableColumn
          label="部件类型"
          align="center"
          prop="partType"
          min-width="100"
        >
          <template #default="scope">
            {{ getPartTypeLabel(scope.row.partType) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="所属区域"
          align="center"
          prop="belongingRegion"
          min-width="100"
        />
        <ElTableColumn
          label="安装位置"
          align="center"
          prop="installationPosition"
          min-width="150"
        />
        <ElTableColumn
          label="经纬度坐标"
          align="center"
          prop="latitudeLongitude"
          min-width="120"
        />
        <ElTableColumn
          label="建设日期"
          align="center"
          prop="constructionDate"
          :formatter="dateFormatter"
          min-width="120"
        />
        <ElTableColumn
          label="管理部门"
          align="center"
          prop="administrativeDepartment"
          min-width="120"
        />
        <ElTableColumn
          label="维护单位"
          align="center"
          prop="maintenanceUnit"
          min-width="120"
        />
        <ElTableColumn
          label="联系电话"
          align="center"
          prop="contactNumber"
          min-width="120"
        />
        <ElTableColumn
          label="部件状态"
          align="center"
          prop="componentStatus"
          min-width="100"
        >
          <template #default="scope">
            {{ getComponentStatusLabel(scope.row.componentStatus) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="使用寿命"
          align="center"
          prop="serviceLife"
          min-width="100"
        />
        <ElTableColumn
          label="关联事件记录"
          align="center"
          prop="relatedEventRecords"
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
    <ComponentInformationForm ref="formRef" @success="getList" />
  </div>
</template>
