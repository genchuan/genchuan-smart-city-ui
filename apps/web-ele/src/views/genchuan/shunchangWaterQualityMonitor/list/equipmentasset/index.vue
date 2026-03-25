<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import { EquipmentAssetApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/equipmentasset';
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

import EquipmentAssetForm from './EquipmentAssetForm.vue';

/** 设备资产台账管理 列表 */
defineOptions({ name: 'EquipmentAsset' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentCode: undefined,
  equipmentName: undefined,
  model: undefined,
  specification: undefined,
  installLocation: undefined,
  installDate: [],
  manufacturer: undefined,
  maintenanceRecord: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await EquipmentAssetApi.getEquipmentAssetPage(queryParams);
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
    await confirm('是否确认删除该设备资产台账数据？', '系统提示');
    // 发起删除
    await EquipmentAssetApi.deleteEquipmentAsset(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有设备资产台账数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await EquipmentAssetApi.exportEquipmentAsset(queryParams);
    download.excel(data, '设备资产台账管理.xls');
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
        <ElFormItem label="设备编号" prop="equipmentCode">
          <ElInput
            v-model="queryParams.equipmentCode"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="设备名称" prop="equipmentName">
          <ElInput
            v-model="queryParams.equipmentName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="型号" prop="model">
          <ElInput
            v-model="queryParams.model"
            placeholder="请输入型号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="规格" prop="specification">
          <ElInput
            v-model="queryParams.specification"
            placeholder="请输入规格"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="安装位置" prop="installLocation">
          <ElInput
            v-model="queryParams.installLocation"
            placeholder="请输入安装位置"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="安装日期" prop="installDate">
          <ElDatePicker
            v-model="queryParams.installDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="生产厂家" prop="manufacturer">
          <ElInput
            v-model="queryParams.manufacturer"
            placeholder="请输入生产厂家"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="维护记录" prop="maintenanceRecord">
          <ElInput
            v-model="queryParams.maintenanceRecord"
            placeholder="请输入维护记录"
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
          label="设备编号"
          align="center"
          prop="equipmentCode"
          min-width="120"
        />
        <ElTableColumn
          label="设备名称"
          align="center"
          prop="equipmentName"
          min-width="120"
        />
        <ElTableColumn
          label="型号"
          align="center"
          prop="model"
          min-width="100"
        />
        <ElTableColumn
          label="规格"
          align="center"
          prop="specification"
          min-width="100"
        />
        <ElTableColumn
          label="安装位置"
          align="center"
          prop="installLocation"
          min-width="120"
        />
        <ElTableColumn
          label="安装日期"
          align="center"
          prop="installDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="生产厂家"
          align="center"
          prop="manufacturer"
          min-width="120"
        />
        <ElTableColumn
          label="维护记录"
          align="center"
          prop="maintenanceRecord"
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
    <EquipmentAssetForm ref="formRef" @success="getList" />
  </div>
</template>
