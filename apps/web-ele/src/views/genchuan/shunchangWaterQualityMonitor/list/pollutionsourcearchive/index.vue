<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { PollutionSourceArchiveApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/pollutionsourcearchive';
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

import PollutionSourceArchiveForm from './PollutionSourceArchiveForm.vue';

/** 周边污染源档案管理 列表 */
defineOptions({ name: 'PollutionSourceArchive' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  pollutionNo: undefined,
  pollutionType: undefined,
  longitude: undefined,
  latitude: undefined,
  pollutionLevel: undefined,
  treatmentMeasures: undefined,
  treatmentStatus: undefined,
  inspectionTime: [],
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await PollutionSourceArchiveApi.getPollutionSourceArchivePage(
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
    await confirm('是否确认删除该周边污染源档案数据？', '系统提示');
    // 发起删除
    await PollutionSourceArchiveApi.deletePollutionSourceArchive(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有周边污染源档案数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await PollutionSourceArchiveApi.exportPollutionSourceArchive(
      queryParams,
    );
    download.excel(data, '周边污染源档案管理.xls');
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
        <ElFormItem label="污染源编号" prop="pollutionNo">
          <ElInput
            v-model="queryParams.pollutionNo"
            placeholder="请输入污染源编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="污染源类型" prop="pollutionType">
          <ElInput
            v-model="queryParams.pollutionType"
            placeholder="请输入污染源类型"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="经度" prop="longitude">
          <ElInput
            v-model="queryParams.longitude"
            placeholder="请输入经度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="纬度" prop="latitude">
          <ElInput
            v-model="queryParams.latitude"
            placeholder="请输入纬度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="污染程度" prop="pollutionLevel">
          <ElInput
            v-model="queryParams.pollutionLevel"
            placeholder="请输入污染程度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="治理措施" prop="treatmentMeasures">
          <ElInput
            v-model="queryParams.treatmentMeasures"
            placeholder="请输入治理措施"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="治理状态" prop="treatmentStatus">
          <ElInput
            v-model="queryParams.treatmentStatus"
            placeholder="请输入治理状态"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="排查时间" prop="inspectionTime">
          <ElDatePicker
            v-model="queryParams.inspectionTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
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
        <ElTableColumn
          label="序号"
          align="center"
          prop="id"
          min-width="80"
        />
        <ElTableColumn
          label="污染源编号"
          align="center"
          prop="pollutionNo"
          min-width="120"
        />
        <ElTableColumn
          label="污染源类型"
          align="center"
          prop="pollutionType"
          min-width="120"
        />
        <ElTableColumn
          label="经度"
          align="center"
          prop="longitude"
          min-width="100"
        />
        <ElTableColumn
          label="纬度"
          align="center"
          prop="latitude"
          min-width="100"
        />
        <ElTableColumn
          label="污染程度"
          align="center"
          prop="pollutionLevel"
          min-width="100"
        />
        <ElTableColumn
          label="治理措施"
          align="center"
          prop="treatmentMeasures"
          min-width="120"
        />
        <ElTableColumn
          label="治理状态"
          align="center"
          prop="treatmentStatus"
          min-width="100"
        />
        <ElTableColumn
          label="排查时间"
          align="center"
          prop="inspectionTime"
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
    <PollutionSourceArchiveForm ref="formRef" @success="getList" />
  </div>
</template>
