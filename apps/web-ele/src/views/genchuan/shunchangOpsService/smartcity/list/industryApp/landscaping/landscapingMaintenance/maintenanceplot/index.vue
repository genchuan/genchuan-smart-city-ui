<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { confirm } from '@vben/common-ui';

import { Icon } from '@iconify/vue';
import {
  ElButton,
  ElCard,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElSelect,
  ElSpace,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { MaintenancePlotApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingMaintenance/maintenanceplot';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import MaintenancePlotForm from './MaintenancePlotForm.vue';

/** 养护地块 列表 */
defineOptions({ name: 'MaintenancePlot' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  plotName: undefined,
  greeningType: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

// 字典选项 - 使用计算属性实时获取
// const greeningTypeOptions = computed(() => getDictOptions(DICT_TYPE.SM_GREENING_TYPE, 'string'));

// 获取字典标签方法
// const getGreeningTypeLabel = (value: string) => {
//   return getDictLabel(DICT_TYPE.SM_GREENING_TYPE, value) || value;
// };

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await MaintenancePlotApi.getMaintenancePlotPage(queryParams);
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
    await confirm('是否确认删除该养护地块数据？', '系统提示');
    // 发起删除
    await MaintenancePlotApi.deleteMaintenancePlot(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有养护地块数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data = await MaintenancePlotApi.exportMaintenancePlot(queryParams);
    download.excel(data, '养护地块.xls');
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
        <ElFormItem label="地块名称" prop="plotName">
          <ElInput
            v-model="queryParams.plotName"
            placeholder="请输入地块名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="绿化类型" prop="greeningType">
          <ElSelect
            v-model="queryParams.greeningType"
            placeholder="请选择绿化类型"
            clearable
            style="width: 240px"
          >
            <!--            <ElOption-->
            <!--              v-for="dict in greeningTypeOptions"-->
            <!--              :key="dict.value"-->
            <!--              :label="dict.label"-->
            <!--              :value="dict.value"-->
            <!--            />-->
            <ElOption label="纯乔木绿化" value="pureArbor" />
            <ElOption label="纯灌木绿化" value="pureShrub" />
            <ElOption label="纯地被/草坪绿化" value="pureGroundcover" />
            <ElOption label="乔灌混合绿化" value="arborShrubMixed" />
            <ElOption label="乔灌草混合绿化" value="arborShrubGrassMixed" />
            <ElOption label="水生绿化" value="aquatic" />
          </ElSelect>
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
        <ElTableColumn label="主键" align="center" prop="id" min-width="50" />
        <ElTableColumn
          label="地块名称"
          align="center"
          prop="plotName"
          min-width="120"
        />
        <ElTableColumn
          label="地块描述"
          align="center"
          prop="plotDescription"
          min-width="150"
        />
        <ElTableColumn
          label="归属信息"
          align="center"
          prop="ownership"
          min-width="120"
        />
        <ElTableColumn
          label="地块面积"
          align="center"
          prop="acreage"
          min-width="100"
        />
        <ElTableColumn
          label="绿化类型"
          align="center"
          prop="greeningType"
          min-width="120"
        >
          <!--          <template #default="scope">-->
          <!--            <ElTag v-if="scope.row.greeningType" type="success" size="small">-->
          <!--              {{ getGreeningTypeLabel(scope.row.greeningType) }}-->
          <!--            </ElTag>-->
          <!--            <span v-else>-</span>-->
          <!--          </template>-->
          <template #default="scope">
            <template v-if="scope.row.greeningType === 'pureArbor'">
              纯乔木绿化
            </template>
            <template v-else-if="scope.row.greeningType === 'pureShrub'">
              纯灌木绿化
            </template>
            <template v-else-if="scope.row.greeningType === 'pureGroundcover'">
              纯地被/草坪绿化
            </template>
            <template v-else-if="scope.row.greeningType === 'arborShrubMixed'">
              乔灌混合绿化
            </template>
            <template
              v-else-if="scope.row.greeningType === 'arborShrubGrassMixed'"
            >
              乔灌草混合绿化
            </template>
            <template v-else-if="scope.row.greeningType === 'aquatic'">
              水生绿化
            </template>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="上次养护的日期"
          align="center"
          prop="lastMaintenanceDate"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="下次养护的计划日期"
          align="center"
          prop="nextMaintenanceDate"
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
    <MaintenancePlotForm ref="formRef" @success="getList" />
  </div>
</template>
