<script setup>
import {computed, reactive, ref, watch, nextTick, onMounted, onUnmounted} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import CommunicateDetailDrawer from './components/communicateDetail.vue';
import {
  getCommunicateMgmtPage,
  createCommunicateMgmt,
  publishCommunicateMgmt,
  feedbackCommunicateMgmt,
  replyCommunicateMgmt,
  updateCommunicateMgmt,
  exportCommunicateMgmt,
  getCommunicateMgmtDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/communicateMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  usePublishFormSchema,
  useReplyFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/communicateMgmt/form.js';

const getStatusType = (status) => {
  const map = {'未发布': 'warning', '已发布': 'success'};
  return map[status] || 'info';
};
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
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

// 核心修改：支持空值清除筛选，使用 gridApi.query()
function handleFilterTagClick(field, value) {
  if (!field) return;
  if (value === '' || value === null || value === undefined) {
    if (tagFilters.value[field] !== undefined) delete tagFilters.value[field];
  } else {
    const existing = tagFilters.value[field];
    if (existing !== undefined) {
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
  }
  gridApi.query(); // 改为 query()
}

function clearFilters() {
  tagFilters.value = {};
  gridApi.query();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.query();
}

function getFieldLabel(field) {
  const map = {
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    title: '消息标题',
    msgType: '消息类型',
    className: '班级',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 抽屉 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
});
const [ReplyDrawer, replyDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => replyDrawerApi.close()
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

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);
const publishIds = ref([]);
const replyId = ref(null);

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      status: tagFilters.value.status,
      creator: tagFilters.value.creator,
      title: tagFilters.value.title,
      msgType: tagFilters.value.msgType,
      className: tagFilters.value.className,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const res = await getCommunicateMgmtPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取消息列表失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

function handleRefresh() {
  gridApi.query();
}

function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  gridApi.query();
}

async function handleExport() {
  const loading = ElLoading.service({text: '正在导出...'});
  try {
    const data = await exportCommunicateMgmt(searchParams.value);
    downloadFileFromBlobPart({fileName: `${textObj.excelName}.xls`, source: data});
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
}

async function handleBatchPublish() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个消息');
  const unpublishedRows = checkedRows.value.filter(row => row.status === '未发布');
  if (unpublishedRows.length === 0) return ElMessage.warning('请选择状态为【未发布】的消息进行发布');
  try {
    await ElMessageBox.confirm(`确认发布选中的 ${unpublishedRows.length} 条消息？发布后状态将变为“已发布”。`, '批量发布确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '发布中...'});
    try {
      const ids = unpublishedRows.map(row => row.id);
      const res = await publishCommunicateMgmt({ids, sendTime: Date.now()});
      if (res && res !== false) {
        ElMessage.success('批量发布成功');
        handleRefresh();
      } else {
        ElMessage.error('批量发布失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

async function handleBatchFeedback() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个消息');
  const publishedRows = checkedRows.value.filter(row => row.status === '已发布');
  if (publishedRows.length === 0) return ElMessage.warning('请选择状态为【已发布】的消息进行反馈');
  try {
    const {value} = await ElMessageBox.prompt('请输入家长反馈内容', '家长反馈', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputType: 'textarea',
    });
    if (value !== null) {
      const loading = ElLoading.service({text: '提交反馈...'});
      try {
        const ids = publishedRows.map(row => row.id);
        const res = await feedbackCommunicateMgmt({
          ids,
          replyContent: value,
          replyTime: Date.now()
        });
        if (res && res !== false) {
          ElMessage.success('反馈成功');
          handleRefresh();
        } else {
          ElMessage.error('反馈失败');
        }
      } finally {
        loading.close();
      }
    }
  } catch {
  }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  publishDrawerApi.open();
}

function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  publishDrawerApi.open();
}

async function handlePublish(row) {
  if (row.status !== '未发布') return ElMessage.warning('只有未发布的消息可以发布');
  try {
    await ElMessageBox.confirm(`确认发布消息"${row.title}"？发布后状态将变为“已发布”。`, '发布确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '发布中...'});
    try {
      const res = await publishCommunicateMgmt({ids: [row.id], sendTime: Date.now()});
      if (res && res !== false) {
        ElMessage.success('发布成功');
        handleRefresh();
      } else {
        ElMessage.error('发布失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

async function handleReply(row) {
  if (row.status !== '已发布') return ElMessage.warning('只有已发布的消息可以回复');
  replyId.value = row.id;
  replyFormApi.resetForm();
  replyDrawerApi.open();
}

// 新增/编辑表单
const [PublishForm, publishFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '新增中...'});
    try {
      let res;
      if (isEditMode.value) res = await updateCommunicateMgmt({...values, id: currentEditId.value});
      else res = await createCommunicateMgmt(values);
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
        publishDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '新增失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: usePublishFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

const [PublishDrawer, publishDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => publishDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      await publishFormApi.resetForm();
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getCommunicateMgmtDetail({id: currentEditId.value});
          await publishFormApi.setValues({
            title: detail.title,
            content: detail.content,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          publishDrawerApi.close();
        }
      } else {
        await publishFormApi.setValues({status: '未发布'});
      }
    }
  },
});

// 回复表单
const [ReplyForm, replyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '回复中...'});
    try {
      const res = await replyCommunicateMgmt({
        id: replyId.value,
        replyContent: values.replyContent,
        replyTime: Date.now()
      });
      if (res && res !== false) {
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
  submitButtonOptions: {content: '保存'},
});

const communicateDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  communicateDetailDrawerRef.value.open();
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: (values) => {
    searchParams.value = {...values};
    drawerApi.close();
    gridApi.query();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {ajax: {query: getTableData}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
    showOverflow: true,
  },
  gridEvents: {checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange},
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};
defineExpose({handleFilterTagClick, clearFilters});

// ========== 监听图表自定义事件 ==========
const handleChartFilter = (event) => {
  const {type, value} = event.detail;
  if (type === 'msgType') {
    handleFilterTagClick('msgType', value);
  } else if (type === 'className') {
    handleFilterTagClick('className', value);
  }
};

onMounted(() => {
  window.addEventListener('communicate-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('communicate-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <CommunicateDetailDrawer ref="communicateDetailDrawerRef" :detail-obj="dataObj.detailObj"
                             @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <PublishDrawer :title="isEditMode ? textObj.editText : textObj.createText">
      <PublishForm/>
    </PublishDrawer>
    <ReplyDrawer :title="textObj.replyText">
      <ReplyForm/>
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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="批量发布" icon-name="Upload" @click="handleBatchPublish"/>
          <IconButton content="反馈" icon-name="ChatLineSquare" @click="handleBatchFeedback"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #title="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{
            row.title
          }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">
          {{ row.status }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor: pointer;">{{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>
      <template #sendTime="{ row }">
        <el-text>{{ formatTimestamp(row.sendTime) }}</el-text>
      </template>
      <template #replyTime="{ row }">
        <el-text>{{ formatTimestamp(row.replyTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未发布'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未发布'" content="发布" icon-name="Upload"
                      @click="handlePublish(row)"/>
          <IconButton v-if="row.status === '已发布'" content="回复" icon-name="ChatLineSquare"
                      @click="handleReply(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
