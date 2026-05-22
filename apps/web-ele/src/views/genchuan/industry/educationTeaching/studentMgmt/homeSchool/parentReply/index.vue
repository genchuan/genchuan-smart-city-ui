<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'; // 增加 onMounted, onUnmounted
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import ParentReplyDetailDrawer from './components/parentReplyDetail.vue';
import {
  getMockList,
  getParentReplyPage,
  readParentReply,
  replyParentReply,
  exportParentReply,
  getParentReplyDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/parentReply/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useReplyFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/parentReply/form.js';

// 辅助函数：状态标签类型
const getReadStatusType = (status) => {
  const map = {
    '未读': 'danger',
    '已读': 'success',
  };
  return map[status] || 'info';
};

const getReplyStatusType = (status) => {
  const map = {
    '未回复': 'warning',
    '已回复': 'success',
  };
  return map[status] || 'info';
};

// 时间戳格式化
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 提取日期部分（用于筛选）
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] !== undefined) {
    const existing = tagFilters.value[field];
    if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) {
      delete tagFilters.value[field];
    } else if (!Array.isArray(existing) && existing === value) {
      delete tagFilters.value[field];
    } else {
      tagFilters.value[field] = value;
    }
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

function clearFilters() {
  tagFilters.value = {};
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    studentName: '学生姓名',
    parentName: '家长姓名',
    readStatus: '阅读状态',
    replyStatus: '回复状态',
    creator: '创建人',
    createTime: '创建时间',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 抽屉组件 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [ReplyDrawer, replyDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => replyDrawerApi.close(),
});

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const replyId = ref(null);       // 待回复的ID

const getTableData = async ({ page }) => {
  dataObj.loading = true;

  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    let sourceList = [];

    try {
      const res = await getParentReplyPage(params);
      sourceList = res?.list || [];
    } catch (apiError) {
      console.warn('接口异常，使用 mock 数据兜底', apiError);
      sourceList = getMockList();
    }

    // 前端标签筛选（统一入口）
    let filtered = sourceList;

    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;

        switch (field) {
          case 'studentName':
            itemValue = item.studentName;
            break;
          case 'parentName':
            itemValue = item.parentName;
            break;
          case 'readStatus':
            itemValue = item.readStatus;
            break;
          case 'replyStatus':
            itemValue = item.replyStatus;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            itemValue = item.createTime
              ? getDateFromTimestamp(item.createTime)
              : '';
            break;
          default:
            itemValue = item[field];
        }

        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        }
        return String(itemValue) === String(filterValue);
      });
    });

    // ✅ 关键修复点（核心）
    dataObj.total = filtered.length;
    dataObj.list = filtered;

    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);

    dataObj.total = 0;
    dataObj.list = [];

    ElMessage.error('获取家长回复列表失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

function handleRefresh() {
  gridApi.reload();
}

function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  gridApi.reload();
}

async function handleExport() {
  try {
    const loading = ElLoading.service({ text: '正在导出...' });
    try {
      const data = await exportParentReply(searchParams.value);
      downloadFileFromBlobPart({ fileName: `${textObj.excelName}.xls`, source: data });
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 批量标记已读
async function handleBatchRead() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个回复记录');
    return;
  }
  const unreadRows = checkedRows.value.filter(row => row.readStatus === '未读');
  if (unreadRows.length === 0) {
    ElMessage.warning('请选择状态为【未读】的记录进行标记');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认标记选中的 ${unreadRows.length} 条回复为已读？`, '批量标记已读', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({ text: '标记中...' });
    try {
      const ids = unreadRows.map(row => row.id);
      const res = await readParentReply(ids);
      if (res === true) {
        ElMessage.success('标记成功');
        handleRefresh();
      } else {
        ElMessage.error('标记失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 单行标记已读
async function handleMarkRead(row) {
  if (row.readStatus !== '未读') {
    ElMessage.warning('只有未读状态的记录可以标记已读');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认标记学生"${row.studentName}"的回复为已读？`, '标记已读', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({ text: '标记中...' });
    try {
      const res = await readParentReply([row.id]);
      if (res === true) {
        ElMessage.success('标记成功');
        handleRefresh();
      } else {
        ElMessage.error('标记失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 单行回复
async function handleReply(row) {
  replyId.value = row.id;
  replyFormApi.resetForm();
  replyDrawerApi.open();
}

// 回复表单
const [ReplyForm, replyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '回复中...' });
    try {
      const res = await replyParentReply({
        id: replyId.value,
        teacherReplyContent: values.teacherReplyContent,
        teacherReplyTime: Date.now(),
      });
      if (res === true) {
        ElMessage.success('回复成功');
        replyDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('回复失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useReplyFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 详情抽屉
const parentReplyDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  parentReplyDetailDrawerRef.value.open();
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: { checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange },
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// ==================== 定时轮询自动刷新（每30秒） ====================
let refreshTimer = null;

onMounted(() => {
  refreshTimer = setInterval(() => {
    // 仅在页面可见时刷新，避免不必要的请求
    if (document.visibilityState === 'visible') {
      gridApi.reload();
    }
  }, 30000); // 30秒，可根据需要调整间隔
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
});

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <ParentReplyDetailDrawer ref="parentReplyDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="搜索">
      <QueryForm />
    </Drawer>
    <ReplyDrawer :title="textObj.replyText">
      <ReplyForm />
    </ReplyDrawer>
    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleSerachShow" />
          <IconButton content="标记已读" icon-name="Check" @click="handleBatchRead" />
          <IconButton content="回复" icon-name="ChatLineSquare" @click="handleBatchRead" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #communicateTitle="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.communicateTitle }}
        </el-text>
      </template>
      <template #studentName="{ row }">
        <el-text @click="handleFilterTagClick('studentName', row.studentName)" type="primary" style="cursor: pointer;">
          {{ row.studentName }}
        </el-text>
      </template>

      <template #readStatus="{ row }">
        <el-tag :type="getReadStatusType(row.readStatus)" @click="handleFilterTagClick('readStatus', row.readStatus)" style="cursor: pointer;">
          {{ row.readStatus }}
        </el-tag>
      </template>
      <template #replyStatus="{ row }">
        <el-tag :type="getReplyStatusType(row.replyStatus)" @click="handleFilterTagClick('replyStatus', row.replyStatus)" style="cursor: pointer;">
          {{ row.replyStatus }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text>
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #parentReplyTime="{ row }">
        <el-text>{{ formatTimestamp(row.parentReplyTime) }}</el-text>
      </template>
      <template #teacherReplyTime="{ row }">
        <el-text>{{ formatTimestamp(row.teacherReplyTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton v-if="row.readStatus === '未读'" content="标记已读" icon-name="Check" @click="handleMarkRead(row)" />
          <IconButton v-if="row.replyStatus !== '已回复'" content="回复" icon-name="ChatLineSquare" @click="handleReply(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
