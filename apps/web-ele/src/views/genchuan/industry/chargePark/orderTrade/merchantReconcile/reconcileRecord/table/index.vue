<script setup>import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDialog, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getReconcileRecordListPage, exportReconcileRecord, checkReconcileRecord } from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import { getMerchantInfoPage } from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import { getReconcileBillListPage } from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import { formatTimestamp } from '#/utils';
import { confirm } from '@vben/common-ui';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import EditDrawer from './edit.vue';
import ReconcileBillDetailDrawer from '../reconcileBill/table/detail.vue';
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
      matchResult: null,
      createTimeStart: null,
      createTimeEnd: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);
// 搜索表单数据
const searchFormData = reactive({
  billNo: '',
  merchantName: '',
});
const searchFormRef = ref(null);
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
  const data = await exportReconcileRecord();
  downloadFileFromBlobPart({ fileName: '对账记录报表.xls', source: data });
}

/** 检查对账记录 */
async function handleCheck(row) {
  await confirm('确定检查此对账记录吗？');
  try {
    await checkReconcileRecord({ id: row.id });
    ElMessage.success('检查成功');
    handleRefresh();
  } catch (error) {
    console.error('检查失败:', error);
    ElMessage.error('检查失败');
  }
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  enDetailObj: {},
  merchantDetailObj: {},
  reconcileBillDetailObj: {},
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
    const res = await getReconcileRecordListPage(params);
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
    console.error('获取对账记录数据失败:', error);
    ElMessage.error('获取对账记录数据失败');
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

// 商户详情弹窗
const merchantDialogVisible = ref(false);

// 对账单据详情抽屉
const reconcileBillDetailDrawerRef = ref(null);

// 点击关联单据跳转对账单据详情弹窗
async function handleOpenReconcileBillDetail(row) {
  try {
    const res = await getReconcileBillListPage({ billNo: row.billNo, pageNo: 1, pageSize: 1 });
    if (res.list && res.list.length > 0) {
      const firstBill = res.list[0];
      dataObj.reconcileBillDetailObj = {
        ...firstBill,
        confirmTime: formatTimestamp(firstBill.confirmTime),
        createTime: formatTimestamp(firstBill.createTime),
      };
      reconcileBillDetailDrawerRef.value?.open();
    } else {
      ElMessage.info('未找到相关对账单据信息');
    }
  } catch (error) {
    console.error('获取对账单据详情失败:', error);
    ElMessage.error('获取对账单据详情失败');
  }
}

// 点击所属商户跳转商户详情弹窗
async function handleOpenMerchantDetail(row) {
  try {
    const res = await getMerchantInfoPage({ merchantName: row.merchantName });
    if (res.list && res.list.length > 0) {
      const firstMerchant = res.list[0];
      dataObj.merchantDetailObj = {
        ...firstMerchant,
        registerTime: formatTimestamp(firstMerchant.registerTime),
        createTime: formatTimestamp(firstMerchant.createTime),
        updateTime: formatTimestamp(firstMerchant.updateTime),
        auditTime: firstMerchant.auditTime ? formatTimestamp(firstMerchant.auditTime) : null,
      };
      merchantDialogVisible.value = true;
    } else {
      ElMessage.info('未找到相关商户信息');
    }
  } catch (error) {
    console.error('获取商户详情失败:', error);
    ElMessage.error('获取商户详情失败');
  }
}

// 点击核查人筛选
function handleFilterChecker(checkerName) {
  if (!checkerName) return;
  dataObj.searchObj = { ...dataObj.searchObj, checkerName: checkerName };
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击记录状态筛选
function handleFilterStatus(status) {
  if (!status) return;
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  dataObj.currentPage = 1;
  gridApi.query();
}

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
    
    <!-- 商户详情弹窗 -->
    <ElDialog v-model="merchantDialogVisible" title="商户详情" width="600px">
      <ElDescriptions v-if="dataObj.merchantDetailObj" :column="1" border>
        <ElDescriptionsItem label="商户名称">
          {{ dataObj.merchantDetailObj.name || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ dataObj.merchantDetailObj.contact || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">
          {{ dataObj.merchantDetailObj.phone || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户类型">
          {{ dataObj.merchantDetailObj.merchantType || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="地址">
          {{ dataObj.merchantDetailObj.address || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="钱包余额">
          {{ dataObj.merchantDetailObj.walletBalance !== undefined ? `¥${dataObj.merchantDetailObj.walletBalance.toFixed(2)}` : '¥0.00' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="注册时间">
          {{ dataObj.merchantDetailObj.registerTime || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="审核状态">
          <el-tag :type="dataObj.merchantDetailObj.status === 'approved' ? 'success' : dataObj.merchantDetailObj.status === 'pending' ? 'warning' : 'info'">
            {{ dataObj.merchantDetailObj.status === 'approved' ? '已通过' : dataObj.merchantDetailObj.status === 'pending' ? '待审核' : dataObj.merchantDetailObj.status || '-' }}
          </el-tag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ dataObj.merchantDetailObj.remark || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
    
    <!-- 对账单据详情弹窗 -->
    <ReconcileBillDetailDrawer ref="reconcileBillDetailDrawerRef" :detail-obj="dataObj.reconcileBillDetailObj" />
    
    <Drawer title="搜索">
      <ElForm
        ref="searchFormRef"
        :model="searchFormData"
        label-width="100px"
        class="query-form"
      >
        <ElFormItem label="对账单号">
          <ElInput v-model="searchFormData.billNo" placeholder="请输入对账单号" />
        </ElFormItem>
        <ElFormItem label="商户名称">
          <ElInput v-model="searchFormData.merchantName" placeholder="请输入商户名称" />
        </ElFormItem>
      </ElForm>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools"> 
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
          @click="handleOpenReconcileBillDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.billNo }}
        </span>
      </template>
      <template #merchantName="{ row }">
        <span
          @click="handleOpenMerchantDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.merchantName }}
        </span>
      </template>
      <template #checkerName="{ row }">
        <span
          @click="handleFilterChecker(row.checkerName)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.checkerName || '-' }}
        </span>
      </template>
      <template #status="{ row }">
        <el-tag 
          :type="row.status === 'normal' ? 'success' : row.status === 'abnormal' ? 'danger' : 'info'"
          class="cursor-pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ row.status === 'normal' ? '正常' : row.status === 'abnormal' ? '异常' : row.status || '-' }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="检查" icon-name="Check" @click="handleCheck(row)" />
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
