<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import AidWorkDetailDrawer from './components/aidWorkDetail.vue';
import {
  getAidWorkPage,
  createAidWork,
  updateAidWork,
  auditAidWork,
  followAidWork,
  exportAidWork,
  getAidWorkDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/aidWork/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
  useFollowFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/aidWork/form.js';

// 辅助函数
const getStatusType = (status) => {
  const map = { '待审核': 'warning', '已通过': 'primary', '已完成': 'success' };
  return map[status] || 'info';
};
const getProcessStatusType = (status) => {
  const map = { '跟进中': 'warning', '已完成': 'success' };
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
const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return `¥${parseFloat(amount).toFixed(2)}`;
};

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

// ---------- 抽屉等 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
});
const [FollowDrawer, followDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => followDrawerApi.close()
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

const activeName = ref('全部');
const gridColumns = ref(getColumnsByStatus(activeName.value));
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);
const currentFollowRow = ref(null);

// 直接使用原始 schema，不再注入 options（学号字段已为 Input）
const createFormSchema = useCreateFormSchema();

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      ...tagFilters.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const res = await getAidWorkPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取奖助勤贷列表失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

// ========== 表格实例（提前定义，确保 gridApi 可用） ==========
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

// ========== 核心修复：强制重置分页到第一页并刷新 ==========
function resetPageAndQuery() {
  if (gridApi.commitProxy) {
    gridApi.commitProxy('reload');
  } else if (gridApi.reload) {
    gridApi.reload();
  } else {
    dataObj.currentPage = 1;
    gridApi.query();
  }
  dataObj.currentPage = 1; // 确保界面分页显示第一页
}

function handleRefresh() {
  gridApi.query(); // 手动刷新保持当前页码
}

function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  resetPageAndQuery();
}

async function handleExport() {
  const loading = ElLoading.service({text: '正在导出...'});
  try {
    const data = await exportAidWork(searchParams.value);
    downloadFileFromBlobPart({fileName: '奖助勤贷列表.xls', source: data});
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
}

// ---------- 单个审核 ----------
async function handleAudit(row) {
  if (row.status !== '待审核') {
    ElMessage.warning('只有待审核状态的奖助申请可以审核');
    return;
  }
  try {
    await ElMessageBox.confirm('确定要通过该奖助申请吗？', '审核确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({text: '审核中...'});
    try {
      const res = await auditAidWork({
        ids: [row.id],
        auditResult: '2',
        remark: '',
      });
      if (res && res !== false) {
        ElMessage.success('审核成功');
        handleRefresh();
      } else {
        ElMessage.error('审核失败');
      }
    } finally {
      loading.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('审核失败', error);
      ElMessage.error('审核失败');
    }
  }
}

// ---------- 批量审核 ----------
async function handleBatchAudit() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条奖助申请');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待审核');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待审核】的奖助申请');
    return;
  }
  if (selectedRows.length < checkedRows.value.length) {
    ElMessage.warning(`已自动过滤非待审核条目，将对 ${selectedRows.length} 条待审核申请进行批量通过`);
  }
  try {
    await ElMessageBox.confirm(`确定要通过选中的 ${selectedRows.length} 条奖助申请吗？`, '批量审核确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({text: '批量审核中...'});
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await auditAidWork({
        ids: ids,
        auditResult: '已通过',
        remark: '',
      });
      if (res && res !== false) {
        ElMessage.success('批量审核成功');
        checkedIds.value = [];
        checkedRows.value = [];
        handleRefresh();
      } else {
        ElMessage.error('批量审核失败');
      }
    } finally {
      loading.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量审核失败', error);
      ElMessage.error('批量审核失败');
    }
  }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open();
}

function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open();
}

function handleFollow(row) {
  if (row.status !== '已通过' && row.status !== '已完成') return ElMessage.warning('只有已通过或已完成状态的申请可以跟进');
  currentFollowRow.value = row;
  followFormApi.resetForm();
  followFormApi.setValues({processStatus: row.processStatus, remark: ''});
  followDrawerApi.open();
}

const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '申报中...'});
    try {
      let res;
      if (isEditMode.value) {
        res = await updateAidWork({...values, id: currentEditId.value});
      } else {
        res = await createAidWork({...values, status: values.status || '待审核'});
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '申报成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '申报失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: createFormSchema,
  showCollapseButton: false,
  submitButtonOptions: {content: computed(() => isEditMode.value ? '保存' : '申报')},
});

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      await createFormApi.resetForm();
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getAidWorkDetail({id: currentEditId.value});
          await createFormApi.setValues({
            studentId: detail.studentId,
            aidType: detail.aidType,
            applyAmount: detail.applyAmount,
            applyTime: detail.applyTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.setValues({status: '待审核'});
      }
    }
  },
});

const [FollowForm, followFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '提交跟进中...'});
    try {
      const res = await followAidWork({
        id: currentFollowRow.value.id,
        processStatus: values.processStatus,
        remark: values.remark
      });
      if (res && res !== false) {
        ElMessage.success('跟进成功');
        followDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('跟进失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useFollowFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交跟进'},
});

const aidWorkDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  aidWorkDetailDrawerRef.value.open();
}

// 高级查询表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: (values) => {
    searchParams.value = {...values};
    drawerApi.close();
    resetPageAndQuery(); // 查询时重置页码
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

// 筛选标签相关函数（使用 resetPageAndQuery）
function getFieldLabel(field) {
  const map = {aidType: '资助类型', status: '状态', creator: '创建人', createTime: '创建时间'};
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

function handleFilterTagClick(field, value) {
  if (!field) return;
  if (value === '' || value === null || value === undefined) {
    if (tagFilters.value[field] !== undefined) {
      delete tagFilters.value[field];
    }
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
  resetPageAndQuery(); // 筛选时重置页码
}

function clearFilters() {
  tagFilters.value = {};
  resetPageAndQuery();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  resetPageAndQuery();
}

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

defineExpose({handleFilterTagClick, clearFilters});

// ========== 监听图表自定义事件 ==========
const handleChartFilter = (event) => {
  const {type, value} = event.detail;
  if (type === 'status') {
    handleFilterTagClick('status', value);
  } else if (type === 'aidType') {
    handleFilterTagClick('aidType', value);
  }
};

// 切换选项卡时也需要重置页码
watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({columns: gridColumns.value});
  resetPageAndQuery(); // 原为 gridApi.query()，改为重置页码
});

onMounted(() => {
  window.addEventListener('aidwork-chart-filter', handleChartFilter);
});

onUnmounted(() => {
  window.removeEventListener('aidwork-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="tools-table-new">
    <AidWorkDetailDrawer ref="aidWorkDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? '编辑奖助申请' : '奖助申报'">
      <CreateForm/>
    </CreateDrawer>
    <FollowDrawer title="流程跟进">
      <FollowForm/>
    </FollowDrawer>

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
          <IconButton content="申报" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="审核" icon-name="Check" @click="handleBatchAudit"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #studentId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.studentId }}
        </el-text>
      </template>
      <template #aidType="{ row }">
        <el-text @click="handleFilterTagClick('aidType', row.aidType)" type="primary"
                 style="cursor: pointer;">{{ row.aidType }}
        </el-text>
      </template>
      <template #applyAmount="{ row }">
        <el-text>{{ formatMoney(row.applyAmount) }}</el-text>
      </template>
      <template #applyTime="{ row }">
        <el-text>{{ formatTimestamp(row.applyTime) }}</el-text>
      </template>
      <template #auditTime="{ row }">
        <el-text>{{ formatTimestamp(row.auditTime) }}</el-text>
      </template>
      <template #processStatus="{ row }">
        <el-tag :type="getProcessStatusType(row.processStatus)">{{ row.processStatus }}</el-tag>
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
        <el-text>{{ formatTimestamp(row.createTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待审核'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待审核'" content="审核" icon-name="Check"
                      @click="handleAudit(row)"/>
          <IconButton v-if="row.status === '已通过' || row.processStatus  === '跟进中'"
                      content="跟进" icon-name="EditPen" @click="handleFollow(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
