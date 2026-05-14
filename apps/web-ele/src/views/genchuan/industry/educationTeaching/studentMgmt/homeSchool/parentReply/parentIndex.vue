<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
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
  submitParentReply,
  exportParentReply,
  getParentReplyDetail,
  getCommunicateList,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/parentReply/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useSubmitFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/parentReply/form.js';

// 辅助函数：状态标签类型
const getReadStatusType = (status) => {
  const map = {
    '未读': 'warning',
    '已读': 'success',
  };
  return map[status] || 'info';
};

const getReplyStatusType = (status) => {
  const map = {
    '未回复': 'danger',
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
    readStatus: '阅读状态',
    replyStatus: '回复状态',
    communicateTitle: '消息标题',
    studentName: '学生姓名',
    parentReplyTime: '回复时间',
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

const [SubmitDrawer, submitDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => submitDrawerApi.close(),
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

const getTableData = async ({ page }) => {
  dataObj.loading = true;

  try {
    let sourceList = [];

    try {
      const params = {
        ...searchParams.value,
        pageNo: page.currentPage,
        pageSize: page.pageSize,
      };

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
          case 'readStatus':
            itemValue = item.readStatus;
            break;
          case 'replyStatus':
            itemValue = item.replyStatus;
            break;
          case 'communicateTitle':
            itemValue = item.communicateTitle;
            break;
          case 'studentName':
            itemValue = item.studentName;
            break;
          case 'parentReplyTime':
            itemValue = item.parentReplyTime
              ? getDateFromTimestamp(item.parentReplyTime)
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

    // ✅ 核心修复点
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

// 提交回复
function handleSubmit() {
  // 加载未回复的沟通消息列表（实际应调用接口获取可回复的消息）
  loadCommunicateOptions();
  submitFormApi.resetForm();
  submitDrawerApi.open();
}

// 加载沟通消息选项
const communicateOptions = ref([]);
const loadCommunicateOptions = async () => {
  const res = await getCommunicateList({ status: '已发布' }); // 只获取已发布的消息
  communicateOptions.value = res;
};

// 详情抽屉
const parentReplyDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  parentReplyDetailDrawerRef.value.open();
}

// 提交回复表单
const [SubmitForm, submitFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '提交中...' });
    try {
      const res = await submitParentReply({
        communicateId: values.communicateId,
        studentId: 1, // 实际应从登录信息获取当前学生的ID
        parentReplyContent: values.parentReplyContent,
        parentReplyTime: Date.now(),
      });
      if (res === true) {
        ElMessage.success('回复成功');
        submitDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('回复失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useSubmitFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '提交' },
});

// 动态注入沟通消息选项
watch(submitFormApi, (api) => {
  if (api && communicateOptions.value.length) {
    const schema = api.getSchema();
    const communicateField = schema.find(f => f.fieldName === 'communicateId');
    if (communicateField) {
      communicateField.componentProps.options = communicateOptions.value;
    }
  }
}, { immediate: true });

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

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <ParentReplyDetailDrawer ref="parentReplyDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="搜索">
      <QueryForm />
    </Drawer>
    <SubmitDrawer :title="textObj.submitText">
      <SubmitForm />
    </SubmitDrawer>
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
          <IconButton content="提交回复" icon-name="EditPen" @click="handleSubmit" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
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
      <template #parentReplyTime="{ row }">
        <el-text @click="handleFilterTagClick('parentReplyTime', getDateFromTimestamp(row.parentReplyTime))" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.parentReplyTime) }}
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
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #teacherReplyTime="{ row }">
        <el-text>{{ formatTimestamp(row.teacherReplyTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮（家长端无标记已读和回复，只有详情） -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
