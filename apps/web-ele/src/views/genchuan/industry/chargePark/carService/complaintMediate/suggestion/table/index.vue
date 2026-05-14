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
      <template #content="{ row }">
        <el-tooltip content="点击筛选同类型意见记录" placement="top">
          <el-text @click="filterByContent(row.content)" type="primary" style="cursor: pointer">
            {{ row.content }}
          </el-text>
        </el-tooltip>
      </template>
      <template #status="{ row }">
        <el-tooltip content="点击筛选同状态意见记录" placement="top">
          <el-tag :type="{ 待处理: 'warning', 处理中: 'primary', 已完成: 'success', 已关闭: 'info' }[row.status]"
                  @click="filterByStatus(row.status)" style="cursor: pointer">
            {{ row.status }}
          </el-tag>
        </el-tooltip>
      </template>
      <template #handle_user_name="{ row }">
        <el-text v-if="row.handleUserId" @click="showUserDetail(row.handleUserId)" type="primary" style="cursor: pointer">
          {{ getUserName(row.handleUserId) }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #handleTime="{ row }">
        <span>{{ row.handleTime || '-' }}</span>
      </template>
      <template #progress="{ row }">
        <span>{{ row.progress || '-' }}</span>
      </template>
      <template #feedback_content="{ row }">
        <span>{{ row.feedbackContent || '-' }}</span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.status === '待处理'">
            <IconButton content="处理" icon-name="check" @click="handleProcess(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '处理中'">
            <IconButton content="更新进度" icon-name="edit" @click="openUpdateProgress(row)" />
            <IconButton content="反馈" icon-name="Star" @click="openFeedback(row)" />
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

    <SuggestionDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="意见建议详情" />

    <ProgressDrawer>
      <el-form :model="progressForm" label-width="100px">
        <el-form-item label="处理进度" required>
          <el-input v-model="progressForm.progress" type="textarea" rows="3" placeholder="请填写当前处理进度" />
        </el-form-item>
      </el-form>
    </ProgressDrawer>

    <FeedbackDrawer>
      <el-form :model="feedbackForm" label-width="100px">
        <el-form-item label="反馈内容" required>
          <el-input v-model="feedbackForm.feedbackContent" type="textarea" rows="3" placeholder="请填写反馈内容，完成后状态将变为已完成" />
        </el-form-item>
      </el-form>
    </FeedbackDrawer>

    <UserDetailDrawer ref="userDetailDrawerRef" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getSuggestionPage,
  exportSuggestionExcel,
  exportSuggestionPdf,
  getSuggestionDetail,
  handleSuggestion,
  updateProgress,
  feedbackSuggestion,
  getUserList,
  getUserDetail,
} from '#/api/genchuan/industry/chargePark/carService/complaintMediate/suggestion/index.js';
import { useFormSchema, useGridColumns } from './data';
import SuggestionDetailDrawer from './detail.vue';
import UserDetailDrawer from './userDetail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'refresh-chart']);
const arrowChange = () => emit('arrow-change');

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
  const hasClientFilter = !!userNameFilter;

  const params = {
    pageNo: hasClientFilter ? 1 : page.currentPage,
    pageSize: hasClientFilter ? 200 : page.pageSize,
    ...dataObj.searchObj,
  };
  delete params.userName;
  if (dataObj.searchObj.submitTime && Array.isArray(dataObj.searchObj.submitTime) && dataObj.searchObj.submitTime.length === 2) {
    params.submitTime = [
      padDateTime(dataObj.searchObj.submitTime[0], false),
      padDateTime(dataObj.searchObj.submitTime[1], true),
    ];
  }
  if (dataObj.searchObj.statusList && Array.isArray(dataObj.searchObj.statusList)) {
    params.status = dataObj.searchObj.statusList.join(',');
    delete params.statusList;
  }

  const res = await getSuggestionPage(params);
  let list = res.list || [];
  let total = res.total;

  // 客户端过滤：用户名(取行上 userName 或 userMap 中 userId 对应的昵称)
  if (hasClientFilter) {
    list = list.filter(item => {
      const uname = String(item.userName || getUserName(item.userId) || item.userId || '').toLowerCase();
      return uname.includes(userNameFilter);
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
    feedbackTime: formatTimestamp(v.feedbackTime),
    handleTime: formatTimestamp(v.handleTime),
    feedbackContent: v.feedbackContent
      ? (typeof v.feedbackContent === 'object' ? JSON.stringify(v.feedbackContent) : v.feedbackContent)
      : null,
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
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj[fieldName];
  dataObj.searchObj = newSearchObj;
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
  if (obj.content) filters.push({ label: `意见内容：${obj.content}`, field: 'content' });
  if (obj.status) filters.push({ label: `状态：${obj.status}`, field: 'status' });
  if (obj.statusList && obj.statusList.length) {
    filters.push({ label: `状态：${obj.statusList.join('、')}`, field: 'statusList' });
  }
  if (obj.submitTime && obj.submitTime.length === 2) {
    filters.push({ label: `提交时间：${obj.submitTime[0]} 至 ${obj.submitTime[1]}`, field: 'submitTime' });
  }
  return filters;
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName }),
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
  const data = await exportSuggestionExcel(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '意见建议记录.xls', source: data });
  ElMessage.success('导出成功');
}

async function handleExportPdf() {
  const data = await exportSuggestionPdf(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '意见建议记录.pdf', source: data });
  ElMessage.success('导出成功');
}

const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getSuggestionDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

const handleProcess = async (row) => {
  await confirm('确认认领该意见建议吗？认领后状态将变为“处理中”。');
  await handleSuggestion({ id: row.id });
  ElMessage.success('已认领，状态更新为处理中');
  handleRefresh();
  emit('refresh-chart');
};

const progressForm = reactive({ progress: '' });
let currentProgressRow = null;
const [ProgressDrawer, progressDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '更新处理进度',
  onCancel: () => progressDrawerApi.close(),
  onConfirm: async () => {
    if (!progressForm.progress) return ElMessage.warning('请填写处理进度');
    await updateProgress({ id: currentProgressRow.id, progress: progressForm.progress });
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

const feedbackForm = reactive({ feedbackContent: '' });
let currentFeedbackRow = null;
const [FeedbackDrawer, feedbackDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '反馈处理结果',
  onCancel: () => feedbackDrawerApi.close(),
  onConfirm: async () => {
    if (!feedbackForm.feedbackContent) return ElMessage.warning('请填写反馈内容');
    await feedbackSuggestion({ id: currentFeedbackRow.id, feedbackContent: feedbackForm.feedbackContent });
    ElMessage.success('反馈成功，状态已变更为已关闭');
    feedbackDrawerApi.close();
    handleRefresh();
    emit('refresh-chart');
  },
});
const openFeedback = (row) => {
  currentFeedbackRow = row;
  feedbackForm.feedbackContent = '';
  feedbackDrawerApi.open();
};

const filterByStatus = (status) => {
  dataObj.searchObj = { ...dataObj.searchObj, status };
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByContent = (content) => {
  dataObj.searchObj = { ...dataObj.searchObj, content };
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

const handleChartRefresh = (event) => {
  const filters = event.detail;
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj.status;
  delete newSearchObj.statusList;
  if (filters?.date) {
    newSearchObj.submitTime = [filters.date, filters.date];
  } else if (filters?.statusList) {
    newSearchObj.statusList = filters.statusList;
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
  window.addEventListener('suggestion-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('suggestion-chart-refresh', handleChartRefresh);
});
</script>
