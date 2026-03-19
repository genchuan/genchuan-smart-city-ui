<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { confirm } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions, getDictLabel } from '@vben/hooks';
import { DrainageLicenseApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/waterConservancyAndWaterAffairs/drainageUserManagement/drainageLicense';
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
  ElSelect,
  ElOption,
  ElPagination,
  ElSpace,
  ElTag,
} from 'element-plus';
import { Icon } from '@iconify/vue';

import DrainageLicenseForm from './DrainageLicenseForm.vue';

/** 排水电子许可证信息 列表 */
defineOptions({ name: 'DrainageLicense' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  licenseNo: undefined,
  drainageType: undefined,
  approvalUnit: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 字典选项 - 使用计算属性实时获取
const drainageTypeOptions = computed(() =>
  getDictOptions(DICT_TYPE.SM_DRAINAGE_TYPE, 'string'),
);
const licenseStatusOptions = computed(() =>
  getDictOptions(DICT_TYPE.CRM_AUDIT_STATUS, 'string'),
);

// 获取字典标签方法
const getDrainageTypeLabel = (value: string) => {
  return getDictLabel(DICT_TYPE.SM_DRAINAGE_TYPE, value) || value;
};

const getLicenseStatusLabel = (value: string) => {
  return getDictLabel(DICT_TYPE.CRM_AUDIT_STATUS, value) || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DrainageLicenseApi.getDrainageLicensePage(queryParams);
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
    await confirm('是否确认删除该排水电子许可证信息数据？', '系统提示');
    // 发起删除
    await DrainageLicenseApi.deleteDrainageLicense(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有排水电子许可证信息数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await DrainageLicenseApi.exportDrainageLicense(queryParams);
    download.excel(data, '排水电子许可证信息.xls');
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
        <ElFormItem label="许可证编号" prop="licenseNo">
          <ElInput
            v-model="queryParams.licenseNo"
            placeholder="请输入许可证编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="许可排水类型" prop="drainageType">
          <ElSelect
            v-model="queryParams.drainageType"
            placeholder="请选择许可排水类型"
            clearable
            style="width: 240px"
          >
            <ElOption
              v-for="dict in drainageTypeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="审批单位" prop="approvalUnit">
          <ElInput
            v-model="queryParams.approvalUnit"
            placeholder="请输入审批单位"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem>
          <ElSpace>
            <ElButton type="primary" @click="handleQuery" plain>
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
          label="许可证编号"
          align="center"
          prop="licenseNo"
          min-width="180"
        />
        <ElTableColumn
          label="有效期开始日期"
          align="center"
          prop="startDate"
          :formatter="dateFormatter2"
          min-width="150"
        />
        <ElTableColumn
          label="有效期结束日期"
          align="center"
          prop="endDate"
          :formatter="dateFormatter2"
          min-width="150"
        />
        <ElTableColumn
          label="许可排水类型"
          align="center"
          prop="drainageType"
          min-width="120"
        >
          <template #default="scope">
            <ElTag v-if="scope.row.drainageType" type="primary" size="small">
              {{ getDrainageTypeLabel(scope.row.drainageType) }}
            </ElTag>
            <span v-else>-</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="审批单位"
          align="center"
          prop="approvalUnit"
          min-width="150"
        />
        <ElTableColumn
          label="状态"
          align="center"
          prop="licenseStatus"
          min-width="100"
        >
          <template #default="scope">
            <ElTag
              v-if="scope.row.licenseStatus"
              :type="scope.row.licenseStatus === '20' ? 'success' : 'info'"
              size="small"
            >
              {{ getLicenseStatusLabel(scope.row.licenseStatus) }}
            </ElTag>
            <span v-else>-</span>
          </template>
        </ElTableColumn>
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
    <DrainageLicenseForm ref="formRef" @success="getList" />
  </div>
</template>
