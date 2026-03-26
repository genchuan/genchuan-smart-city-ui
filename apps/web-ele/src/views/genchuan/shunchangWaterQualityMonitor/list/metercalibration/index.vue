<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { MeterCalibrationApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/metercalibration';
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

import MeterCalibrationForm from './MeterCalibrationForm.vue';

/** 监测仪表校准管理 列表 */
defineOptions({ name: 'MeterCalibration' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  meterId: undefined,
  meterType: undefined,
  calibrationCycle: undefined,
  lastCalibrationDate: [],
  currentCalibrationDate: [],
  standardSolutionConc: undefined,
  beforeCalibrationValue: undefined,
  afterCalibrationValue: undefined,
  operatorId: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await MeterCalibrationApi.getMeterCalibrationPage(queryParams);
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
    await confirm('是否确认删除该监测仪表校准数据？', '系统提示');
    // 发起删除
    await MeterCalibrationApi.deleteMeterCalibration(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有监测仪表校准数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await MeterCalibrationApi.exportMeterCalibration(queryParams);
    download.excel(data, '监测仪表校准管理.xls');
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
        <ElFormItem label="仪表ID" prop="meterId">
          <ElInput
            v-model="queryParams.meterId"
            placeholder="请输入仪表ID"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="仪表类型" prop="meterType">
          <ElInput
            v-model="queryParams.meterType"
            placeholder="请输入仪表类型"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="校准周期(天)" prop="calibrationCycle">
          <ElInput
            v-model="queryParams.calibrationCycle"
            placeholder="请输入校准周期(天)"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="上次校准日期" prop="lastCalibrationDate">
          <ElDatePicker
            v-model="queryParams.lastCalibrationDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="本次校准日期" prop="currentCalibrationDate">
          <ElDatePicker
            v-model="queryParams.currentCalibrationDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="标准溶液浓度" prop="standardSolutionConc">
          <ElInput
            v-model="queryParams.standardSolutionConc"
            placeholder="请输入标准溶液浓度"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="校准前示值" prop="beforeCalibrationValue">
          <ElInput
            v-model="queryParams.beforeCalibrationValue"
            placeholder="请输入校准前示值"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="校准后示值" prop="afterCalibrationValue">
          <ElInput
            v-model="queryParams.afterCalibrationValue"
            placeholder="请输入校准后示值"
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
          label="仪表ID"
          align="center"
          prop="meterId"
          min-width="100"
        />
        <ElTableColumn
          label="仪表类型"
          align="center"
          prop="meterType"
          min-width="120"
        />
        <ElTableColumn
          label="校准周期(天)"
          align="center"
          prop="calibrationCycle"
          min-width="120"
        />
        <ElTableColumn
          label="上次校准日期"
          align="center"
          prop="lastCalibrationDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="本次校准日期"
          align="center"
          prop="currentCalibrationDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="标准溶液浓度"
          align="center"
          prop="standardSolutionConc"
          min-width="120"
        />
        <ElTableColumn
          label="校准前示值"
          align="center"
          prop="beforeCalibrationValue"
          min-width="120"
        />
        <ElTableColumn
          label="校准后示值"
          align="center"
          prop="afterCalibrationValue"
          min-width="120"
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
    <MeterCalibrationForm ref="formRef" @success="getList" />
  </div>
</template>
