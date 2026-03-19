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

import { LawEnforcementVehicleApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawenforcementvehicle';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import LawEnforcementVehicleForm from './LawEnforcementVehicleForm.vue';

/** 执法车辆管理 列表 */
defineOptions({ name: 'LawEnforcementVehicle' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  licensePlateNumber: undefined,
  vehicleBrand: undefined,
  model: undefined,
  vehicleColor: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 获取车辆状态标签
const getVehicleStatusLabel = (value: string) => {
  const statusMap: Record<string, string> = {
    standby: '执法待命',
    onDuty: '执行任务中',
    refueling: '加油/充电中',
    maintenance: '维修中',
    service: '定期保养',
    impounded: '暂扣/封存',
    outOfService: '停用报废',
  };
  return statusMap[value] || value;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await LawEnforcementVehicleApi.getLawEnforcementVehiclePage(queryParams);
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
    await confirm('是否确认删除该执法车辆管理数据？', '系统提示');
    // 发起删除
    await LawEnforcementVehicleApi.deleteLawEnforcementVehicle(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有执法车辆管理数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await LawEnforcementVehicleApi.exportLawEnforcementVehicle(queryParams);
    download.excel(data, '执法车辆管理.xls');
  } catch {} finally {
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
        <ElFormItem label="车牌号" prop="licensePlateNumber">
          <ElInput
            v-model="queryParams.licensePlateNumber"
            placeholder="请输入车牌号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="车辆品牌" prop="vehicleBrand">
          <ElInput
            v-model="queryParams.vehicleBrand"
            placeholder="请输入车辆品牌"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="车辆型号" prop="model">
          <ElInput
            v-model="queryParams.model"
            placeholder="请输入车辆型号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="车辆颜色" prop="vehicleColor">
          <ElInput
            v-model="queryParams.vehicleColor"
            placeholder="请输入车辆颜色"
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
          label="车牌号"
          align="center"
          prop="licensePlateNumber"
          min-width="120"
        />
        <ElTableColumn
          label="车辆品牌"
          align="center"
          prop="vehicleBrand"
          min-width="120"
        />
        <ElTableColumn
          label="车辆型号"
          align="center"
          prop="model"
          min-width="120"
        />
        <ElTableColumn
          label="车辆颜色"
          align="center"
          prop="vehicleColor"
          min-width="100"
        />
        <ElTableColumn
          label="车架号"
          align="center"
          prop="vin"
          min-width="150"
        />
        <ElTableColumn
          label="发动机号"
          align="center"
          prop="engineNo"
          min-width="120"
        />
        <ElTableColumn
          label="购置时间"
          align="center"
          prop="purchaseTime"
          min-width="120"
        />
        <ElTableColumn
          label="登记注册日期"
          align="center"
          prop="registrationDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="所属执法部门"
          align="center"
          prop="belongingDepartment"
          min-width="150"
        />
        <ElTableColumn
          label="使用性质"
          align="center"
          prop="natureOfUse"
          min-width="100"
        />
        <ElTableColumn
          label="车辆用途"
          align="center"
          prop="vehicleUsage"
          min-width="100"
        />
        <ElTableColumn
          label="车辆状态"
          align="center"
          prop="vehicleStatus"
          min-width="120"
        >
          <template #default="scope">
            {{ getVehicleStatusLabel(scope.row.vehicleStatus) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="年检到期日期"
          align="center"
          prop="annualInspectionDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="保险截止日期"
          align="center"
          prop="insuranceDeadline"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="保险类型"
          align="center"
          prop="typesOfInsurance"
          min-width="120"
        />
        <ElTableColumn
          label="驾驶员姓名"
          align="center"
          prop="driverName"
          min-width="100"
        />
        <ElTableColumn
          label="驾驶员联系方式"
          align="center"
          prop="driverContactInformation"
          min-width="120"
        />
        <ElTableColumn
          label="行驶里程"
          align="center"
          prop="mileage"
          min-width="100"
        />
        <ElTableColumn
          label="维修记录"
          align="center"
          prop="maintenanceRecord"
          min-width="150"
        />
        <ElTableColumn
          label="保养记录"
          align="center"
          prop="maintenanceRecords"
          min-width="150"
        />
        <ElTableColumn
          label="加油记录"
          align="center"
          prop="refuelingRecord"
          min-width="150"
        />
        <ElTableColumn
          label="违章记录"
          align="center"
          prop="violationRecords"
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
    <LawEnforcementVehicleForm ref="formRef" @success="getList" />
  </div>
</template>
