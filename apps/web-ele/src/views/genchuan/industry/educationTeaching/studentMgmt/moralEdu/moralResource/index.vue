<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import MoralResourceDetailDrawer from './components/moralResourceDetail.vue';
import {
  getMoralResourcePage,
  createMoralResource,
  updateMoralResource,
  onlineMoralResource,
  offlineMoralResource,
  exportMoralResource,
  getMoralResourceDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/moralResource/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCreateFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/moralResource/form.js';

const getStatusType = (status) => {
  const map = { '未上架': 'warning', '已上架': 'success' };
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

// ---------- 抽屉组件 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
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

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const merged = {
      ...searchParams.value,
      ...tagFilters.value,
    };
    const params = {
      ...merged,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    if (params.createTime && Array.isArray(params.createTime) && params.createTime.length === 2) {
      params.createTimeStart = params.createTime[0];
      params.createTimeEnd = params.createTime[1];
      delete params.createTime;
    } else if (params.createTime && typeof params.createTime === 'string') {
      params.createTimeStart = params.createTime;
      params.createTimeEnd = params.createTime;
      delete params.createTime;
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const res = await getMoralResourcePage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取资源列表失败，请检查网络或联系管理员');
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
    const data = await exportMoralResource(searchParams.value);
    downloadFileFromBlobPart({fileName: `${textObj.excelName}.xls`, source: data});
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
}

async function handleBatchOnline() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个资源');
  const offlineRows = checkedRows.value.filter(row => row.status === '未上架');
  if (offlineRows.length === 0) return ElMessage.warning('请选择状态为【未上架】的资源进行上架');
  try {
    await ElMessageBox.confirm(`确认上架选中的 ${offlineRows.length} 个资源？上架后学生可见。`, '批量上架确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '上架中...'});
    try {
      const ids = offlineRows.map(row => row.id);
      const res = await onlineMoralResource(ids);
      if (res && res !== false) {
        ElMessage.success('批量上架成功');
        handleRefresh();
      } else {
        ElMessage.error('批量上架失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

async function handleBatchOffline() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个资源');
  const onlineRows = checkedRows.value.filter(row => row.status === '已上架');
  if (onlineRows.length === 0) return ElMessage.warning('请选择状态为【已上架】的资源进行下架');
  try {
    await ElMessageBox.confirm(`确认下架选中的 ${onlineRows.length} 个资源？下架后学生不可见。`, '批量下架确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '下架中...'});
    try {
      const ids = onlineRows.map(row => row.id);
      const res = await offlineMoralResource(ids);
      if (res && res !== false) {
        ElMessage.success('批量下架成功');
        handleRefresh();
      } else {
        ElMessage.error('批量下架失败');
      }
    } finally {
      loading.close();
    }
  } catch {
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

async function handleOnline(row) {
  if (row.status !== '未上架') return ElMessage.warning('只有未上架的资源可以上架');
  try {
    await ElMessageBox.confirm(`确认上架资源"${row.resourceName}"？上架后学生可见。`, '上架确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '上架中...'});
    try {
      const res = await onlineMoralResource([row.id]);
      if (res && res !== false) {
        ElMessage.success('上架成功');
        handleRefresh();
      } else {
        ElMessage.error('上架失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

async function handleOffline(row) {
  if (row.status !== '已上架') return ElMessage.warning('只有已上架的资源可以下架');
  try {
    await ElMessageBox.confirm(`确认下架资源"${row.resourceName}"？下架后学生不可见。`, '下架确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '下架中...'});
    try {
      const res = await offlineMoralResource([row.id]);
      if (res && res !== false) {
        ElMessage.success('下架成功');
        handleRefresh();
      } else {
        ElMessage.error('下架失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 上传/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '上传中...'});
    try {
      let res;
      if (isEditMode.value) res = await updateMoralResource({...values, id: currentEditId.value});
      else res = await createMoralResource({...values, status: values.status || '未上架'});
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '上传成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '上传失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
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
          const detail = await getMoralResourceDetail({id: currentEditId.value});
          await createFormApi.setValues({
            resourceName: detail.resourceName,
            resourceType: detail.resourceType,
            resourceUrl: detail.resourceUrl,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.setValues({status: '未上架'});
      }
    }
  },
});

const moralResourceDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  moralResourceDetailDrawerRef.value.open();
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
  const map = {
    resourceType: '资源类型',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    resourceName: '资源名称',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

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
const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};
defineExpose({handleFilterTagClick, clearFilters});

// ========== 监听图表自定义事件 ==========
const handleChartFilter = (event) => {
  const {type, value} = event.detail;
  if (type === 'resourceType') {
    handleFilterTagClick('resourceType', value);
  } else if (type === 'status') {
    handleFilterTagClick('status', value);
  } else if (type === 'createTime') {
    handleFilterTagClick('createTime', value);
  }
};

onMounted(() => {
  window.addEventListener('moral-resource-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('moral-resource-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <MoralResourceDetailDrawer ref="moralResourceDetailDrawerRef" :detail-obj="dataObj.detailObj"
                               @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? textObj.editText : textObj.addText">
      <CreateForm/>
    </CreateDrawer>
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
          <IconButton content="上传" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="上架" icon-name="Top" @click="handleBatchOnline"/>
          <IconButton content="下架" icon-name="Bottom" @click="handleBatchOffline"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #resourceName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.resourceName }}
        </el-text>
      </template>
      <template #resourceType="{ row }">
        <el-text @click="handleFilterTagClick('resourceType', row.resourceType)" type="primary"
                 style="cursor: pointer;">{{ row.resourceType }}
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
        <el-text>
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>
      <template #publishTime="{ row }">
        <el-text>{{ formatTimestamp(row.publishTime) }}</el-text>
      </template>
      <template #offTime="{ row }">
        <el-text>{{ formatTimestamp(row.offTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未上架'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未上架'" content="上架" icon-name="Top"
                      @click="handleOnline(row)"/>
          <IconButton v-if="row.status === '已上架'" content="下架" icon-name="Bottom"
                      @click="handleOffline(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
