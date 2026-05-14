<script setup>
import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  getReconcileBillListPage, 
  exportReconcileBill, 
  batchReconcileBill,
  confirmReconcileBill,
  fixReconcileBill,
  reconcileBill
} from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import { formatTimestamp } from '#/utils';
import { confirm } from '@vben/common-ui';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';

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
      billDateStart: null,
      billDateEnd: null,
    }),
  },
});

const emit = defineEmits(['arrow-change']);

// 搜索表单数据
const searchFormData = reactive({
  merchantName: '',
  billNo: '',
  status: '',
});
const searchFormRef = ref(null);

// 对账单状态映射 - ReconcileBillStatusEnum
const statusMap = {
  pending: { label: '待对账', type: 'warning' },
  reconciled: { label: '已对账', type: 'success' },
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

// 备注弹窗表单
const remarkForm = reactive({
  remark: '',
});
const remarkDrawerRef = ref(null);
const currentRow = ref(null);
const currentAction = ref('');

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

// 备注弹窗配置
const [RemarkDrawer, remarkDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: true,
  footer: true,
  cancelText: '取消',
  confirmText: '确定',
  onCancel() {
    remarkForm.remark = '';
  },
  onConfirm() {
    handleRemarkConfirm();
  },
});

/** 搜索 */
function handleSearch() {
  dataObj.searchObj = {
    ...searchFormData,
  };
  dataObj.currentPage = 1;
  gridApi.query();
  drawerApi.close();
}

/** 重置搜索 */
function resetSearch() {
  for (const key in searchFormData) {
    searchFormData[key] = '';
  }
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
  const data = await exportReconcileBill(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '对账单报表.xls', source: data });
}

/** 批量对账 */
async function handleBatchReconcile() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要对账的记录');
    return;
  }
  await confirm('确定批量对账选中的记录吗？');
  try {
    await batchReconcileBill(checkedIds.value );
    ElMessage.success('批量对账成功');
    handleRefresh();
  } catch (error) {
    console.error('批量对账失败:', error);
    ElMessage.error('批量对账失败');
  }
}

/** 对账操作 */
async function handleReconcile(row) {
  currentRow.value = row;
  currentAction.value = 'reconcile';
  remarkForm.remark = '';
  remarkDrawerApi.open();
}

/** 确认操作 */
async function handleConfirm(row) {
  currentRow.value = row;
  currentAction.value = 'confirm';
  remarkForm.remark = '';
  remarkDrawerApi.open();
}

/** 修复操作 */
async function handleFix(row) {
  currentRow.value = row;
  currentAction.value = 'fix';
  remarkForm.remark = '';
  remarkDrawerApi.open();
}

/** 处理备注确认 */
async function handleRemarkConfirm() {
  if (!currentRow.value) return;
  
  const params = {
    id: currentRow.value.id,
    remark: remarkForm.remark,
  };
  
  try {
    switch (currentAction.value) {
      case 'reconcile':
        await reconcileBill(params);
        ElMessage.success('对账成功');
        break;
      case 'confirm':
        await confirmReconcileBill(params);
        ElMessage.success('确认成功');
        break;
      case 'fix':
        await fixReconcileBill(params);
        ElMessage.success('修复成功');
        break;
    }
    handleRefresh();
  } catch (error) {
    console.error(`${currentAction.value}失败:`, error);
    ElMessage.error(`${currentAction.value}失败`);
  } finally {
    remarkDrawerApi.close();
    remarkForm.remark = '';
    currentRow.value = null;
    currentAction.value = '';
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
  searchObj: {},
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
    ...props.filterParams,
  };
  try {
    dataObj.loading = true;
    const res = await getReconcileBillListPage(params);
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
  } catch (error) {
    console.error('获取对账单数据失败:', error);
    ElMessage.error('获取对账单数据失败');
    return dataObj;
  } finally {
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

const arrowChange = () => {
  emit('arrow-change');
};

watch(
  () => props.filterParams,
  () => {
    dataObj.currentPage = 1;
    gridApi.query();
  },
  { deep: true }
);
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    
    <!-- 备注弹窗 -->
    <RemarkDrawer :title="currentAction === 'reconcile' ? '对账' : currentAction === 'confirm' ? '确认' : '修复'" ref="remarkDrawerRef">
      <ElForm :model="remarkForm" label-width="100px" class="query-form">
        <ElFormItem label="备注">
          <ElInput v-model="remarkForm.remark" type="textarea" placeholder="请输入备注（可选）" :rows="4" />
        </ElFormItem>
      </ElForm>
    </RemarkDrawer>
    
    <Drawer title="搜索">
      <ElForm
        ref="searchFormRef"
        :model="searchFormData"
        label-width="100px"
        class="query-form"
      >
        <ElFormItem label="商户名称">
          <ElInput v-model="searchFormData.merchantName" placeholder="请输入商户名称" />
        </ElFormItem>
        <ElFormItem label="对账单号">
          <ElInput v-model="searchFormData.billNo" placeholder="请输入对账单号" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="searchFormData.status" placeholder="请选择状态">
            <ElOption label="待对账" value="pending" />
            <ElOption label="已对账" value="reconciled" />
            <ElOption label="异常" value="abnormal" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools"> 
          <IconButton content="批量对账" icon-name="Check" @click="handleBatchReconcile" /> 
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #billNo="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ row.billNo }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton v-if="row.status === 'pending'" content="对账" icon-name="Check" @click="handleReconcile(row)" />
          <IconButton v-if="row.status === 'reconciled'" content="确认" icon-name="right" @click="handleConfirm(row)" />
          <IconButton  content="修复" icon-name="top" @click="handleFix(row)" />
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
          <span> 全部统计：{{ dataObj.total }}条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
