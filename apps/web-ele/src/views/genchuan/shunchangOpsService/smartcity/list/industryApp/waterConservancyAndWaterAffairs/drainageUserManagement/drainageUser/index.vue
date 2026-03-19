<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { confirm } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions, getDictLabel } from '@vben/hooks';
import { DrainageUserApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/waterConservancyAndWaterAffairs/drainageUserManagement/drainageUser';
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
  ElSelect,
  ElOption,
  ElPagination,
  ElSpace,
  ElTag,
} from 'element-plus';
import { Icon } from '@iconify/vue';

import DrainageUserForm from './DrainageUserForm.vue';

/** 排水户信息 列表 */
defineOptions({ name: 'DrainageUser' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  creditCode: undefined,
  userName: undefined,
  industryType: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 字典选项 - 使用计算属性实时获取
const industryTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_INDUSTRY_CATEGORY, 'string'),
);
const userTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_DRAINAGE_USER, 'string'),
);

// 获取字典标签方法
const getIndustryTypeLabel = (value: string) => {
  return getDictLabel(DICT_TYPE.SM_INDUSTRY_CATEGORY, value) || value;
};

const getUserTypeLabel = (value: string) => {
  return getDictLabel(DICT_TYPE.SM_DRAINAGE_USER, value) || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DrainageUserApi.getDrainageUserPage(queryParams);
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
    await confirm('是否确认删除该排水户信息数据？', '系统提示');
    // 发起删除
    await DrainageUserApi.deleteDrainageUser(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有排水户信息数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await DrainageUserApi.exportDrainageUser(queryParams);
    download.excel(data, '排水户信息.xls');
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
        label-width="150px"
      >
        <ElFormItem label="统一社会信用代码" prop="creditCode">
          <ElInput
            v-model="queryParams.creditCode"
            placeholder="请输入统一社会信用代码"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="排水户名称" prop="userName">
          <ElInput
            v-model="queryParams.userName"
            placeholder="请输入排水户名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="行业类别" prop="industryType">
          <ElSelect
            v-model="queryParams.industryType"
            placeholder="请选择行业类别"
            clearable
            style="width: 240px"
          >
            <ElOption
              v-for="dict in industryTypeOptions"
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
        <ElTableColumn label="ID" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="统一社会信用代码"
          align="center"
          prop="creditCode"
          min-width="180"
        />
        <ElTableColumn
          label="排水户名称"
          align="center"
          prop="userName"
          min-width="150"
        />
        <ElTableColumn
          label="行业类别"
          align="center"
          prop="industryType"
          min-width="120"
        >
          <template #default="scope">
            <ElTag v-if="scope.row.industryType" type="primary" size="small">
              {{ getIndustryTypeLabel(scope.row.industryType) }}
            </ElTag>
            <span v-else>-</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="排水户分类"
          align="center"
          prop="userType"
          min-width="120"
        >
          <template #default="scope">
            <ElTag v-if="scope.row.userType" type="success" size="small">
              {{ getUserTypeLabel(scope.row.userType) }}
            </ElTag>
            <span v-else>-</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="月均用水量（吨）"
          align="center"
          prop="waterUsage"
          min-width="130"
        />
        <ElTableColumn
          label="排水管网接入点坐标"
          align="center"
          prop="drainagePoint"
          min-width="150"
        />
        <ElTableColumn
          label="预处理设施清单"
          align="center"
          prop="preTreatment"
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
    <DrainageUserForm ref="formRef" @success="getList" />
  </div>
</template>
