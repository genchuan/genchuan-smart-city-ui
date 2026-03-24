<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { confirm } from '@vben/common-ui';

import { Icon } from '@iconify/vue';
import {
  ElButton,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElPagination,
  ElSpace,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { OfLawEnforcementPersonnelApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/oflawenforcementpersonnel';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import OfLawEnforcementPersonnelForm from './OfLawEnforcementPersonnelForm.vue';

/** 执法人员管理 列表 */
defineOptions({ name: 'OfLawEnforcementPersonnel' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  fullName: undefined,
  gender: undefined,
  idNumber: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await OfLawEnforcementPersonnelApi.getOfLawEnforcementPersonnelPage(
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
    await confirm('是否确认删除该执法人员管理数据？', '系统提示');
    // 发起删除
    await OfLawEnforcementPersonnelApi.deleteOfLawEnforcementPersonnel(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有执法人员管理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await OfLawEnforcementPersonnelApi.exportOfLawEnforcementPersonnel(
        queryParams,
      );
    download.excel(data, '执法人员管理.xls');
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
        <ElFormItem label="姓名" prop="fullName">
          <ElInput
            v-model="queryParams.fullName"
            placeholder="请输入姓名"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="性别" prop="gender">
          <ElInput
            v-model="queryParams.gender"
            placeholder="请输入性别"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="身份证号" prop="idNumber">
          <ElInput
            v-model="queryParams.idNumber"
            placeholder="请输入身份证号"
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
          label="姓名"
          align="center"
          prop="fullName"
          min-width="100"
        />
        <ElTableColumn
          label="性别"
          align="center"
          prop="gender"
          min-width="80"
        />
        <ElTableColumn
          label="身份证号"
          align="center"
          prop="idNumber"
          min-width="150"
        />
        <ElTableColumn
          label="联系方式"
          align="center"
          prop="contactInformation"
          min-width="120"
        />
        <ElTableColumn
          label="所属执法部门"
          align="center"
          prop="belongingLawDepartment"
          min-width="150"
        />
        <ElTableColumn
          label="职务"
          align="center"
          prop="position"
          min-width="100"
        />
        <ElTableColumn
          label="执法证编号"
          align="center"
          prop="lawEnforcementNumber"
          min-width="120"
        />
        <ElTableColumn
          label="执法证有效期"
          align="center"
          prop="validityCertificate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="入职时间"
          align="center"
          prop="entryTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="学历"
          align="center"
          prop="educationalBackground"
          min-width="100"
        />
        <ElTableColumn
          label="专业"
          align="center"
          prop="major"
          min-width="100"
        />
        <ElTableColumn
          label="培训经历"
          align="center"
          prop="trainingExperience"
          min-width="150"
        />
        <ElTableColumn
          label="考核成绩"
          align="center"
          prop="resultOfExamination"
          min-width="100"
        />
        <ElTableColumn
          label="奖惩记录"
          align="center"
          prop="rewardsRecord"
          min-width="150"
        />
        <ElTableColumn
          label="违规违纪情况"
          align="center"
          prop="violationRegulations"
          min-width="150"
        />
        <ElTableColumn
          label="负责区域"
          align="center"
          prop="responsibleArea"
          min-width="120"
        />
        <ElTableColumn
          label="紧急联系人姓名"
          align="center"
          prop="emergencyContactName"
          min-width="120"
        />
        <ElTableColumn
          label="紧急联系人电话"
          align="center"
          prop="emergencyContactPhone"
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
    <OfLawEnforcementPersonnelForm ref="formRef" @success="getList" />
  </div>
</template>
