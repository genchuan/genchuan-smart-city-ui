<script setup>import { reactive, ref, computed, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElDialog } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSplitRateStatusPage, exportSplitRateStatusExcel, createSplitRateStatus, updateSplitRateStatus, deleteSplitRateStatus, checkSplitRateStatus, getSettleBillPage } from '#/api/genchuan/industry/chargePark/orderTrade/splitSettle/index.js';
import { formatTimestamp } from '#/utils';
import { confirm } from '@vben/common-ui';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import SettleBillDetailDrawer from '#/views/genchuan/industry/chargePark/orderTrade/splitSettle/settleBill/table/detail.vue';
const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
  filterParams: {
    type: Object,
    default: () => ({
      status: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);
// 搜索表单数据
const searchFormData = reactive({
  billId: '',
  status: '',
});
const searchFormRef = ref(null);
// 表单数据
const formData = reactive({
  id: 0,
  billId: 0,
  status: '',
  errorReason: '',
  remark: '',
  reserve1: '',
  reserve2: '',
});
// 表单规则
const rules = {
  billId: [
    { required: true, message: '单据ID不能为空', trigger: 'blur' },
    { type: 'number', min: 0, message: '单据ID必须为非负整数', trigger: 'blur' },
  ],
};
const formRef = ref(null);
// 表单抽屉标题
const formTitle = computed(() => {
  return formData.id ? '编辑结算状态' : '新增结算状态';
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: true,
  cancelText: '取消',
  confirmText: '保存',
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    handleSubmitForm();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = formDrawerApi.getData();
      if (data?.id) {
        // 编辑模式
        formData.id = data.id;
        formData.billId = data.billId || 0;
        formData.status = data.status || '';
        formData.errorReason = data.errorReason || '';
        formData.remark = data.remark || '';
        formData.reserve1 = data.reserve1 || '';
        formData.reserve2 = data.reserve2 || '';
      }
      else {
        // 新增模式 - 重置表单
        resetForm();
      }
    }
  },
});
// 重置表单
function resetForm() {
  formData.id = 0;
  formData.billId = 0;
  formData.status = '';
  formData.errorReason = '';
  formData.remark = '';
  formData.reserve1 = '';
  formData.reserve2 = '';
  formRef.value?.resetFields();
}
/** 创建结算状态 */
function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}
/** 编辑结算状态 */
function handleEdit(row) {
  formDrawerApi.setData({
    title: '编辑',
    ...row,
  }).open();
}
/** 提交表单 */
async function handleSubmitForm() {
  if (!formRef.value)
    return;
  formRef.value.validate(async (valid) => {
    if (!valid)
      return;
    // 强制转换为指定的数据格式
    const submitData = {
      id: formData.id || 0,
      billId: Number(formData.billId) || 0,
      status: formData.status || '',
      errorReason: formData.errorReason || '',
      remark: formData.remark || '',
      reserve1: formData.reserve1 || '',
      reserve2: formData.reserve2 || '',
    };
    try {
      if (submitData.id) {
        await updateSplitRateStatus(submitData);
        ElMessage.success('更新成功');
      }
      else {
        delete submitData.id
        await createSplitRateStatus(submitData);
        ElMessage.success('创建成功');
      }
      formDrawerApi.close();
      handleRefresh();
    }
    catch (error) {
      console.error('提交失败:', error);
      ElMessage.error('提交失败');
    }
  });
}
/** 删除结算状态 */
async function handleDelete(row) {
 await confirm('确定删除该结算状态吗？');
 try {
 await deleteSplitRateStatus({ id: row.id });
 ElMessage.success('删除成功');
 handleRefresh();
 }
 catch (error) {
 console.error('删除失败:', error);
 ElMessage.error('删除失败');
 }
}
/** 审核结算状态 */
async function handleCheck(row) {
 await confirm('确定审核该结算状态吗？');
 try {
 await checkSplitRateStatus({ id: row.id, remark: '' });
 ElMessage.success('审核成功');
 handleRefresh();
 }
 catch (error) {
 console.error('审核失败:', error);
 ElMessage.error('审核失败');
 }
}
// 结算状态映射 - SettleStatusEnum
const statusMap = {
  normal: { label: '正常', type: 'success' },
  abnormal: { label: '异常', type: 'danger' },
};
// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};
// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};
const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: true,
  cancelText: '重置',
  confirmText: '查询',
  onCancel() {
    resetSearch();
  },
  onConfirm() {
    handleSearch();
  },
});
/** 搜索 */
function handleSearch() {
  dataObj.searchObj = {
    billId: searchFormData.billId ? Number(searchFormData.billId) : undefined,
    status: searchFormData.status || undefined,
  };
  dataObj.currentPage = 1;
  gridApi.query();
  drawerApi.close();
}
/** 重置搜索 */
function resetSearch() {
  searchFormData.billId = '';
  searchFormData.status = '';
  dataObj.searchObj = {};
  dataObj.currentPage = 1;
  gridApi.query();
}
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}
// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportSplitRateStatusExcel();
  downloadFileFromBlobPart({ fileName: '结算状态报表.xls', source: data });
}
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  enDetailObj: {},
  settleBillDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  loading: false,
  searchObj: {},
  filterParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchObj,
    ...dataObj.filterParams,
  };
  try {
    dataObj.loading = true;
    const res = await getSplitRateStatusPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      const result = { ...v };
      for (const key in result) {
        if (key.includes('Time') && result[key]) {
          result[key] = formatTimestamp(result[key]);
        }
      }
      return result;
    });
    return dataObj;
  }
  catch (error) {
    console.error('获取结算状态数据失败:', error);
    ElMessage.error('获取结算状态数据失败');
    return dataObj;
  }
  finally {
    dataObj.loading = false;
  }
};
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};
const parkDetailDrawerRef = ref(null);
const settleBillDetailDrawerRef = ref(null);
const arrowChange = () => {
  emit('arrow-change');
};

// 点击关联单据跳转结算单据详情弹窗
async function handleOpenSettleBillDetail(row) {
  try {
    const res = await getSettleBillPage({ id: row.billId, pageNo: 1, pageSize: 1 });
    if (res.list && res.list.length > 0) {
      const firstBill = res.list[0];
      dataObj.settleBillDetailObj = {
        ...firstBill,
        auditTime: formatTimestamp(firstBill.auditTime),
        settleTime: formatTimestamp(firstBill.settleTime),
        createTime: formatTimestamp(firstBill.createTime),
        updateTime: formatTimestamp(firstBill.updateTime),
      };
      settleBillDetailDrawerRef.value?.open();
    } else {
      ElMessage.info('未找到相关结算单据信息');
    }
  } catch (error) {
    console.error('获取结算单据详情失败:', error);
    ElMessage.error('获取结算单据详情失败');
  }
}

// 点击状态筛选
function handleFilterStatus(status) {
  if (!status) return;
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击核查人筛选
function handleFilterChecker(checkerName) {
  if (!checkerName) return;
  dataObj.searchObj = { ...dataObj.searchObj, checkerName: checkerName };
  dataObj.currentPage = 1;
  gridApi.query();
}

watch(
  () => props.filterParams,
  () => {
    dataObj.currentPage = 1;
    dataObj.searchObj = {};
    dataObj.filterParams = props.filterParams;
    gridApi.query();
  },
  { deep: true }
);
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <!-- 表单抽屉 -->
    <FormDrawer :title="formTitle">
      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px" class="common-form">
        <ElFormItem label="单据ID" prop="billId">
          <ElInputNumber v-model="formData.billId" :min="0" class="w-full" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="formData.status" placeholder="请选择状态" class="w-full">
            <ElOption label="正常" value="normal" />
            <ElOption label="异常" value="abnormal" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="错误原因">
          <ElInput v-model="formData.errorReason" type="textarea" :rows="3" placeholder="请输入错误原因" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </ElFormItem>
      </ElForm>
    </FormDrawer>

    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    
    <!-- 结算单据详情弹窗 -->
    <SettleBillDetailDrawer ref="settleBillDetailDrawerRef" :detail-obj="dataObj.settleBillDetailObj" />
    
    <Drawer title="搜索">
      <ElForm
        ref="searchFormRef"
        :model="searchFormData"
        label-width="100px"
        class="query-form"
      >
        <ElFormItem label="单据ID">
          <ElInputNumber v-model="searchFormData.billId" :min="0" placeholder="请输入单据ID" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="searchFormData.status" placeholder="请选择状态">
            <ElOption label="正常" value="normal" />
            <ElOption label="异常" value="abnormal" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- <IconButton content="新增" icon-name="Plus" @click="handleCreate" /> -->
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #id="{ row }">
        <span
          @click="handleOpenDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.id }}
        </span>
      </template>
      <template #billNo="{ row }">
        <span
          @click="handleOpenSettleBillDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.billNo }}
        </span>
      </template>
      <template #status="{ row }">
        <el-tag 
          :type="getStatusType(row.status)"
          class="cursor-pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #checkerName="{ row }">
        <span
          @click="handleFilterChecker(row.checkerName)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.checkerName || '-' }}
        </span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="审核" icon-name="Check" v-if="row.status !== 'normal'" @click="handleCheck(row)" />
          <!-- <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)" /> 
          <IconButton content="删除" icon-name="Delete" @click="handleDelete(row)" /> -->
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 全部统计：10条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
