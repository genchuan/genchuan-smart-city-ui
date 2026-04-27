<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { decisionAnalysisPage, decisionAnalysisExportReport, decisionAnalysisCreate } from '#/api/genchuan/industry/chargePark/orderTrade/decisionAnalysis/index.js';
import { formatTimestamp } from '#/utils';
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
});

const emit = defineEmits(['arrow-change']);

// 搜索表单数据
const searchFormData = reactive({
  orderNo: '',
  payType: '',
});
const searchFormRef = ref(null);

// 创建表单数据
const createFormData = reactive({
  reportCycle: '',
  statStartTime: '',
  statEndTime: '',
  remark: '',
});
const createFormRef = ref(null);

// 报表周期选项
const reportCycleOptions = [
  { label: '日报', value: 'daily' },
  { label: '周报', value: 'weekly' },
  { label: '月报', value: 'monthly' },
  { label: '季报', value: 'quarterly' },
  { label: '半年报', value: 'half_yearly' },
  { label: '年报', value: 'yearly' },
  { label: '自定义报表', value: 'custom' },
];

// 创建抽屉
const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: true,
  cancelText: '取消',
  confirmText: '创建',
  width: 600,
  onCancel() {
    resetCreateForm();
    createDrawerApi.close();
  },
  onConfirm() {
    handleCreate();
  },
});

/** 重置创建表单 */
function resetCreateForm() {
  createFormData.reportCycle = '';
  createFormData.statStartTime = '';
  createFormData.statEndTime = '';
  createFormData.remark = '';
}

/** 获取报表周期中文值 */
function getReportCycleLabel(value) {
  const opt = reportCycleOptions.find((item) => item.value === value);
  return opt ? opt.label : value;
}

/** 创建报表 */
async function handleCreate() {
  const params = {
    reportCycle: getReportCycleLabel(createFormData.reportCycle),
    statStartTime: createFormData.statStartTime ? new Date(createFormData.statStartTime).getTime() : null,
    statEndTime: createFormData.statEndTime ? new Date(createFormData.statEndTime).getTime() : null,
    remark: createFormData.remark,
  };
  try {
    await decisionAnalysisCreate(params);
    ElMessage.success('创建成功');
    resetCreateForm();
    createDrawerApi.close();
    handleRefresh();
  } catch (error) {
    console.error('创建失败:', error);
    ElMessage.error('创建失败');
  }
}

/** 打开创建抽屉 */
function handleOpenCreate() {
  resetCreateForm();
  createDrawerApi.open();
}

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
  const data = await decisionAnalysisExportReport(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '交易运营报表.xls', source: data });
}

/** 查看详情 */
async function handleView(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  enDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
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
  };
  try {
    dataObj.loading = true;
    const res = await decisionAnalysisPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list 
    return dataObj;
  } catch (error) {
    console.error('获取交易运营报表数据失败:', error);
    ElMessage.error('获取交易运营报表数据失败');
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
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <CreateDrawer title="创建交易运营报表">
      <ElForm
        ref="createFormRef"
        :model="createFormData"
        label-width="120px"
        class="create-form"
      >
        <ElFormItem label="报表周期" required>
          <ElSelect v-model="createFormData.reportCycle" placeholder="请选择报表周期">
            <ElOption v-for="opt in reportCycleOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="统计开始时间" required>
          <ElInput v-model="createFormData.statStartTime" type="datetime-local" placeholder="请选择统计开始时间" />
        </ElFormItem>
        <ElFormItem label="统计结束时间" required>
          <ElInput v-model="createFormData.statEndTime" type="datetime-local" placeholder="请选择统计结束时间" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="createFormData.remark" type="textarea" placeholder="请输入备注" :rows="3" />
        </ElFormItem>
      </ElForm>
    </CreateDrawer>
    <Drawer title="搜索">
      <ElForm
        ref="searchFormRef"
        :model="searchFormData"
        label-width="100px"
        class="query-form"
      >
        <ElFormItem label="订单号">
          <ElInput v-model="searchFormData.orderNo" placeholder="请输入订单号" />
        </ElFormItem>
        <ElFormItem label="支付类型">
          <ElInput v-model="searchFormData.payType" placeholder="请输入支付类型" />
        </ElFormItem>
      </ElForm>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools"> 
          <IconButton content="新增" icon-name="Plus" @click="handleOpenCreate" />
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
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
