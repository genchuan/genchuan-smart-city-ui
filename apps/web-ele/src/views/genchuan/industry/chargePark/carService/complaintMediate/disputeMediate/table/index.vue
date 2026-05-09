<template>
  <div class="park-lot-table-new">
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-for="filter in activeFilters" :key="filter.field" type="primary" closable @close="handleClearField(filter.field)">
            {{ filter.label }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出 Excel" icon-name="download" @click="handleExport" />
          <IconButton content="导出 PDF" icon-name="document" @click="handleExportPdf" />
          <IconButton content="搜索" icon-name="search" @click="handleSearchShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #user_name="{ row }">
        <el-text @click="showUserDetail(row.userId)" type="primary" style="cursor: pointer">
          {{ getUserName(row.userId) }}
        </el-text>
      </template>
      <template #merchant_name="{ row }">
        <el-text v-if="row.merchantId" @click="showMerchantDetail(row.merchantId)" type="primary" style="cursor: pointer">
          {{ getMerchantName(row.merchantId) }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #content="{ row }">
        <el-tooltip content="点击筛选同类型纠纷记录" placement="top">
          <el-text @click="filterByContent(row.content)" type="primary" style="cursor: pointer">
            {{ row.content }}
          </el-text>
        </el-tooltip>
      </template>
      <template #status="{ row }">
        <el-tag :type="{ 待调解: 'warning', 调解中: 'primary', 已完成: 'success', 已关闭: 'info' }[row.status]"
                @click="filterByStatus(row.status)" style="cursor: pointer">
          {{ row.status }}
        </el-tag>
      </template>
      <template #mediate_user_name="{ row }">
        <el-text v-if="row.mediateUserId" @click="showUserDetail(row.mediateUserId)" type="primary" style="cursor: pointer">
          {{ row.mediateUserName || getUserName(row.mediateUserId) }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #progress="{ row }">
        <el-tooltip v-if="row.progress" content="点击筛选同进度的调解记录" placement="top">
          <el-text @click="filterByProgress(row.progress)" type="primary" style="cursor: pointer">
            {{ row.progress }}
          </el-text>
        </el-tooltip>
        <span v-else>-</span>
      </template>
      <template #confirmResult="{ row }">
        <el-tooltip v-if="row.confirmResult" content="点击筛选同确认结果的调解记录" placement="top">
          <el-text @click="filterByConfirmResult(row.confirmResult)" type="primary" style="cursor: pointer">
            {{ row.confirmResult }}
          </el-text>
        </el-tooltip>
        <span v-else>-</span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.status === '待调解'">
            <IconButton content="调解" icon-name="check" @click="handleMediate(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '调解中'">
            <IconButton content="更新进度" icon-name="Edit" @click="openUpdateProgress(row)" />
            <IconButton content="确认" icon-name="Finished" @click="openConfirm(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else>
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <DisputeMediateDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="纠纷调解详情" />

    <ProgressDrawer>
      <el-form :model="progressForm" label-width="100px">
        <el-form-item label="调解进度" required>
          <el-input v-model="progressForm.progress" type="textarea" rows="3" placeholder="请输入调解进度描述" />
        </el-form-item>
      </el-form>
    </ProgressDrawer>

    <ConfirmDrawer>
      <el-form :model="confirmForm" label-width="100px">
        <el-form-item label="调解结果" required>
          <el-input v-model="confirmForm.confirmResult" type="textarea" rows="3" placeholder="请填写调解结果" />
        </el-form-item>
      </el-form>
    </ConfirmDrawer>

    <UserDetailDrawer ref="userDetailDrawerRef" />

    <MerchantDetailDrawer ref="merchantDetailDrawerRef" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getDisputeMediatePage,
  exportDisputeMediate,
  exportDisputeMediatePdf,
  getDisputeMediateDetail,
  mediateDispute,
  updateDisputeProgress,
  confirmDispute,
  getUserList,
  getUserDetail,
  getMerchantList,
  getMerchantDetail,
} from '#/api/genchuan/industry/chargePark/carService/complaintMediate/disputeMediate/index.js';
import { useFormSchema, useGridColumns } from './data';
import DisputeMediateDetailDrawer from './detail.vue';
import UserDetailDrawer from './userDetail.vue';
import MerchantDetailDrawer from './merchantDetail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'refresh-chart']);

const arrowChange = () => {
  emit('arrow-change');
};

const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

const userMap = ref(new Map());
async function fetchUserMap() {
  try {
    const users = await getUserList();
    users.forEach(user => userMap.value.set(String(user.userId), user.userName));
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
}
function getUserName(id) {
  if (id == null) return '-';
  return userMap.value.get(String(id)) || String(id);
}

const merchantMap = ref(new Map());
async function fetchMerchantMap() {
  try {
    const merchants = await getMerchantList();
    merchants.forEach(merchant => merchantMap.value.set(String(merchant.merchantId), merchant.merchantName));
  } catch (error) {
    console.error('获取商户列表失败', error);
  }
}
function getMerchantName(id) {
  if (id == null) return '-';
  return merchantMap.value.get(String(id)) || String(id);
}

const padDateTime = (s, isEnd) => {
  if (!s) return s;
  const v = String(s).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v)) return v;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v)) return `${v}:${isEnd ? '59' : '00'}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${v} ${isEnd ? '23:59:59' : '00:00:00'}`;
  return v;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const userNameFilter = String(dataObj.searchObj.userName || '').trim().toLowerCase();
  const merchantNameFilter = String(dataObj.searchObj.merchantName || '').trim().toLowerCase();
  const hasClientFilter = !!userNameFilter || !!merchantNameFilter;

  const params = {
    pageNo: hasClientFilter ? 1 : page.currentPage,
    pageSize: hasClientFilter ? 200 : page.pageSize,
    ...dataObj.searchObj,
  };
  delete params.userName;
  delete params.merchantName;
  if (dataObj.searchObj.submitTime && Array.isArray(dataObj.searchObj.submitTime) && dataObj.searchObj.submitTime.length === 2) {
    params.submitTime = [
      padDateTime(dataObj.searchObj.submitTime[0], false),
      padDateTime(dataObj.searchObj.submitTime[1], true),
    ];
  }

  const res = await getDisputeMediatePage(params);
  let list = res.list || [];
  let total = res.total;

  if (hasClientFilter) {
    list = list.filter(item => {
      const uname = String(item.userName || getUserName(item.userId) || item.userId || '').toLowerCase();
      const mname = String(item.merchantName || getMerchantName(item.merchantId) || item.merchantId || '').toLowerCase();
      if (userNameFilter && !uname.includes(userNameFilter)) return false;
      if (merchantNameFilter && !mname.includes(merchantNameFilter)) return false;
      return true;
    });
    total = list.length;
    const pStart = (page.currentPage - 1) * page.pageSize;
    list = list.slice(pStart, pStart + page.pageSize);
  }

  dataObj.total = total;
  dataObj.list = list.map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    submitTime: formatTimestamp(v.submitTime),
    confirmTime: formatTimestamp(v.confirmTime),
  }));
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().filter(v => v.isSearch).map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      QueryFormApi.resetForm();
      QueryFormApi.submitForm();
    }
  },
});

const resetAllFilters = async () => {
  dataObj.searchObj = {};
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
};

async function onSubmit(values, isReset = false) {
  if (isReset) await resetAllFilters();
  else { dataObj.searchObj = { ...values }; dataObj.currentPage = 1; gridApi.query(); }
}

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchObj };
  delete next[fieldName];
  dataObj.searchObj = next;
  dataObj.currentPage = 1;
  gridApi.query();
  // Drawer 表单可能未挂载，setValues 仅做软同步，失败不影响列表刷新
  Promise.resolve(QueryFormApi.setValues?.({ [fieldName]: null }, false)).catch(() => {});
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.userId) filters.push({ label: `用户：${getUserName(obj.userId)}`, field: 'userId' });
  if (obj.userName) filters.push({ label: `用户名称：${obj.userName}`, field: 'userName' });
  if (obj.merchantId) filters.push({ label: `商户：${getMerchantName(obj.merchantId)}`, field: 'merchantId' });
  if (obj.merchantName) filters.push({ label: `商户名称：${obj.merchantName}`, field: 'merchantName' });
  if (obj.content) filters.push({ label: `纠纷内容：${obj.content}`, field: 'content' });
  if (obj.progress) filters.push({ label: `调解进度：${obj.progress}`, field: 'progress' });
  if (obj.confirmResult) filters.push({ label: `确认结果：${obj.confirmResult}`, field: 'confirmResult' });
  if (obj.status) filters.push({ label: `状态：${obj.status}`, field: 'status' });
  if (obj.submitTime && obj.submitTime.length === 2) {
    filters.push({ label: `发起时间：${obj.submitTime[0]} 至 ${obj.submitTime[1]}`, field: 'submitTime' });
  }
  return filters;
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, getMerchantName }),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  showSearchForm: false,
});

function handleRefresh() { gridApi.query(); }
async function handleExport() {
  const data = await exportDisputeMediate(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '纠纷调解记录.xls', source: data });
  ElMessage.success('导出成功');
}

async function handleExportPdf() {
  const data = await exportDisputeMediatePdf(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '纠纷调解记录.pdf', source: data });
  ElMessage.success('导出成功');
}

const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getDisputeMediateDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

const handleMediate = async (row) => {
  await mediateDispute({ id: row.id });
  ElMessage.success('认领成功，状态更新为调解中');
  handleRefresh();
  emit('refresh-chart');
};

const progressForm = reactive({ progress: '' });
let currentProgressRow = null;
const [ProgressDrawer, progressDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '更新调解进度',
  onCancel: () => progressDrawerApi.close(),
  onConfirm: async () => {
    if (!progressForm.progress) return ElMessage.warning('请填写调解进度');
    await updateDisputeProgress({ id: currentProgressRow.id, progress: progressForm.progress });
    ElMessage.success('进度更新成功');
    progressDrawerApi.close();
    handleRefresh();
    emit('refresh-chart');
  },
});
const openUpdateProgress = (row) => {
  currentProgressRow = row;
  progressForm.progress = row.progress || '';
  progressDrawerApi.open();
};

const confirmForm = reactive({ confirmResult: '' });
let currentConfirmRow = null;
const [ConfirmDrawer, confirmDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '确认调解结果',
  onCancel: () => confirmDrawerApi.close(),
  onConfirm: async () => {
    if (!confirmForm.confirmResult) return ElMessage.warning('请填写调解结果');
    await confirmDispute({ id: currentConfirmRow.id, confirmResult: confirmForm.confirmResult });
    ElMessage.success('调解完成，状态已变更为已完成');
    confirmDrawerApi.close();
    handleRefresh();
    emit('refresh-chart');
  },
});
const openConfirm = (row) => {
  currentConfirmRow = row;
  confirmForm.confirmResult = '';
  confirmDrawerApi.open();
};

const filterByStatus = (status) => {
  dataObj.searchObj.status = status;
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByContent = (content) => {
  dataObj.searchObj = { ...dataObj.searchObj, content };
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByProgress = (progress) => {
  dataObj.searchObj = { ...dataObj.searchObj, progress };
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByConfirmResult = (confirmResult) => {
  dataObj.searchObj = { ...dataObj.searchObj, confirmResult };
  dataObj.currentPage = 1;
  gridApi.query();
};

const userDetailDrawerRef = ref(null);
const showUserDetail = async (userId) => {
  if (!userId) return ElMessage.warning('用户ID不存在');
  try {
    const userDetail = await getUserDetail(userId);
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) {
    console.error('获取用户详情失败', error);
    ElMessage.error('获取用户详情失败');
  }
};

const merchantDetailDrawerRef = ref(null);
const showMerchantDetail = async (merchantId) => {
  if (!merchantId) return ElMessage.warning('商户ID不存在');
  try {
    const merchantDetail = await getMerchantDetail(merchantId);
    merchantDetailDrawerRef.value?.open(merchantDetail);
  } catch (error) {
    console.error('获取商户详情失败', error);
    ElMessage.error('获取商户详情失败');
  }
};

const handleChartRefresh = (event) => {
  const filters = event.detail;
  const newSearchObj = { ...dataObj.searchObj };
  if (filters?.date) {
    newSearchObj.submitTime = [filters.date, filters.date];
    delete newSearchObj.status;
  } else if (filters?.statusList) {
    newSearchObj.status = filters.statusList[0];
    delete newSearchObj.submitTime;
  }
  dataObj.searchObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});
const handleSearchShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

onMounted(() => {
  fetchUserMap();
  fetchMerchantMap();
  window.addEventListener('dispute-mediate-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('dispute-mediate-chart-refresh', handleChartRefresh);
});
</script>
