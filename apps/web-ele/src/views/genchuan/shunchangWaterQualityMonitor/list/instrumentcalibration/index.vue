<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { InstrumentCalibrationApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/instrumentcalibration';
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

import InstrumentCalibrationForm from './InstrumentCalibrationForm.vue';

/** 仪器零点/量程漂移校验 列表 */
defineOptions({ name: 'InstrumentCalibration' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  instrumentId: undefined,
  calibrationDate: [],
  zeroPointConc: undefined,
  zeroDrift: undefined,
  spanConc: undefined,
  spanDrift: undefined,
  calibrationResult: undefined,
  operatorId: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await InstrumentCalibrationApi.getInstrumentCalibrationPage(queryParams);
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
    await confirm('是否确认删除该仪器零点/量程漂移校验数据？', '系统提示');
    // 发起删除
    await InstrumentCalibrationApi.deleteInstrumentCalibration(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有仪器零点/量程漂移校验数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await InstrumentCalibrationApi.exportInstrumentCalibration(queryParams);
    download.excel(data, '仪器零点/量程漂移校验.xls');
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
        <ElFormItem label="仪器ID" prop="instrumentId">
          <ElInput
            v-model="queryParams.instrumentId"
            placeholder="请输入仪器ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="校验日期" prop="calibrationDate">
          <ElDatePicker
            v-model="queryParams.calibrationDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="零点校正液浓度" prop="zeroPointConc">
          <ElInput
            v-model="queryParams.zeroPointConc"
            placeholder="请输入零点校正液浓度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="零点漂移值" prop="zeroDrift">
          <ElInput
            v-model="queryParams.zeroDrift"
            placeholder="请输入零点漂移值"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="量程校正液浓度" prop="spanConc">
          <ElInput
            v-model="queryParams.spanConc"
            placeholder="请输入量程校正液浓度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="量程漂移值" prop="spanDrift">
          <ElInput
            v-model="queryParams.spanDrift"
            placeholder="请输入量程漂移值"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="校验结果" prop="calibrationResult">
          <ElInput
            v-model="queryParams.calibrationResult"
            placeholder="请输入校验结果"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="操作人员ID" prop="operatorId">
          <ElInput
            v-model="queryParams.operatorId"
            placeholder="请输入操作人员ID"
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
        <ElTableColumn label="序号" align="center" prop="id" min-width="80" />
        <ElTableColumn
          label="仪器ID"
          align="center"
          prop="instrumentId"
          min-width="100"
        />
        <ElTableColumn
          label="校验日期"
          align="center"
          prop="calibrationDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="零点校正液浓度"
          align="center"
          prop="zeroPointConc"
          min-width="140"
        />
        <ElTableColumn
          label="零点漂移值"
          align="center"
          prop="zeroDrift"
          min-width="120"
        />
        <ElTableColumn
          label="量程校正液浓度"
          align="center"
          prop="spanConc"
          min-width="140"
        />
        <ElTableColumn
          label="量程漂移值"
          align="center"
          prop="spanDrift"
          min-width="120"
        />
        <ElTableColumn
          label="校验结果"
          align="center"
          prop="calibrationResult"
          min-width="100"
        />
        <ElTableColumn
          label="操作人员ID"
          align="center"
          prop="operatorId"
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
    <InstrumentCalibrationForm ref="formRef" @success="getList" />
  </div>
</template>
