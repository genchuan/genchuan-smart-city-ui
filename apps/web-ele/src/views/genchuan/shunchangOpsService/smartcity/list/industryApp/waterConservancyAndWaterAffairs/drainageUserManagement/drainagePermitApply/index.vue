<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { confirm } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions, getDictLabel } from '@vben/hooks';
import { DrainagePermitApplyApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/waterConservancyAndWaterAffairs/drainageUserManagement/drainagePermitApply';
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
  ElLink,
} from 'element-plus';
import { Icon } from '@iconify/vue';

import DrainagePermitApplyForm from './DrainagePermitApplyForm.vue';

/** 排水许可证申请 列表 */
defineOptions({ name: 'DrainagePermitApply' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  applyNo: undefined,
  userName: undefined,
  applyStatus: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 字典选项 - 使用计算属性实时获取
const applyStatusOptions = computed(() =>
  getDictOptions(DICT_TYPE.CRM_AUDIT_STATUS, 'string'),
);

// 获取字典标签方法
const getApplyStatusLabel = (value: string) => {
  return getDictLabel(DICT_TYPE.CRM_AUDIT_STATUS, value) || value;
};

// 获取状态标签类型
const getStatusTagType = (value: string) => {
  switch (value) {
    case '20':
      return 'success'; // 审核通过
    case '10':
      return 'warning'; // 待审核
    case '30':
      return 'danger'; // 审核不通过
    default:
      return 'info';
  }
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await DrainagePermitApplyApi.getDrainagePermitApplyPage(queryParams);
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
    await confirm('是否确认删除该排水许可证申请数据？', '系统提示');
    // 发起删除
    await DrainagePermitApplyApi.deleteDrainagePermitApply(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有排水许可证申请数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await DrainagePermitApplyApi.exportDrainagePermitApply(queryParams);
    download.excel(data, '排水许可证申请.xls');
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
        <ElFormItem label="申请编号" prop="applyNo">
          <ElInput
            v-model="queryParams.applyNo"
            placeholder="请输入申请编号"
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
        <ElFormItem label="申请状态" prop="applyStatus">
          <ElSelect
            v-model="queryParams.applyStatus"
            placeholder="请选择申请状态"
            clearable
            style="width: 240px"
          >
            <ElOption
              v-for="dict in applyStatusOptions"
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
          label="申请编号"
          align="center"
          prop="applyNo"
          min-width="150"
        />
        <ElTableColumn
          label="排水户名称"
          align="center"
          prop="userName"
          min-width="150"
        />
        <ElTableColumn
          label="排水水质检测报告文件"
          align="center"
          prop="waterQualityReport"
          min-width="180"
        >
          <template #default="scope">
            <ElLink
              v-if="scope.row.waterQualityReport"
              :href="scope.row.waterQualityReport"
              target="_blank"
              type="primary"
            >
              查看文件
            </ElLink>
            <span v-else>-</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="日均排水量（吨）"
          align="center"
          prop="dailyDrainage"
          min-width="120"
        />
        <ElTableColumn
          label="重点排污单位证明文件路径"
          align="center"
          prop="pollutionProof"
          min-width="180"
        >
          <template #default="scope">
            <ElLink
              v-if="scope.row.pollutionProof"
              :href="scope.row.pollutionProof"
              target="_blank"
              type="primary"
            >
              查看文件
            </ElLink>
            <span v-else>-</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="历史违规记录"
          align="center"
          prop="violationHistory"
          min-width="150"
        />
        <ElTableColumn
          label="申请状态"
          align="center"
          prop="applyStatus"
          min-width="100"
        >
          <template #default="scope">
            <ElTag
              v-if="scope.row.applyStatus"
              :type="getStatusTagType(scope.row.applyStatus)"
              size="small"
            >
              {{ getApplyStatusLabel(scope.row.applyStatus) }}
            </ElTag>
            <span v-else>-</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="审核人"
          align="center"
          prop="approver"
          min-width="100"
        />
        <ElTableColumn
          label="审核时间"
          align="center"
          prop="approveTime"
          :formatter="dateFormatter2"
          min-width="120"
        />
        <ElTableColumn
          label="审核意见"
          align="center"
          prop="approveComment"
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
    <DrainagePermitApplyForm ref="formRef" @success="getList" />
  </div>
</template>
