<script setup>
import {computed, reactive, ref, watch, nextTick, onMounted, onUnmounted} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import TargetDetailDrawer from './components/targetDetail.vue';
import {
  getTargetMgmtPage,
  createTargetMgmt,
  updateTargetMgmt,
  configTargetMgmt,
  enableTargetMgmt,
  disableTargetMgmt,
  exportTargetMgmt,
  getTargetMgmtDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/targetMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCreateFormSchema,
  useConfigFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/targetMgmt/form.js';

const getStatusType = (status) => {
  const map = {'未启用': 'warning', '已启用': 'success'};
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

// ---------- 抽屉 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
});
const [ConfigDrawer, configDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => configDrawerApi.close()
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
const isConfigMode = ref(false);
const configIds = ref([]);

const getTableData = async ({ page }) => {
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
    const res = await getTargetMgmtPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取指标列表失败，请检查网络或联系管理员');
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
    const data = await exportTargetMgmt(searchParams.value);
    downloadFileFromBlobPart({fileName: `${textObj.excelName}.xls`, source: data});
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
}

async function handleBatchConfig() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个指标');
  isConfigMode.value = true;
  configIds.value = [...checkedIds.value];
  configFormApi.resetForm();
  configDrawerApi.open();
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

async function handleEnable(row) {
  if (row.status !== '未启用') return ElMessage.warning('只有未启用状态的指标可以启用');
  try {
    await ElMessageBox.confirm(`确认启用指标"${row.targetName}"？启用后指标将生效。`, '启用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '启用中...'});
    try {
      const res = await enableTargetMgmt([row.id]);
      if (res && res !== false) {
        ElMessage.success('启用成功');
        handleRefresh();
      } else {
        ElMessage.error('启用失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

async function handleDisable(row) {
  if (row.status !== '已启用') return ElMessage.warning('只有已启用状态的指标可以停用');
  try {
    await ElMessageBox.confirm(`确认停用指标"${row.targetName}"？停用后指标将不再使用。`, '停用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '停用中...'});
    try {
      const res = await disableTargetMgmt([row.id]);
      if (res && res !== false) {
        ElMessage.success('停用成功');
        handleRefresh();
      } else {
        ElMessage.error('停用失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 新增/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '保存中...'});
    try {
      let res;
      if (isEditMode.value) res = await updateTargetMgmt({...values, id: currentEditId.value});
      else res = await createTargetMgmt({...values, status: values.status || '未启用'});
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '新增成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '新增失败');
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
          const detail = await getTargetMgmtDetail({id: currentEditId.value});
          await createFormApi.setValues({
            targetName: detail.targetName,
            totalScore: detail.totalScore,
            warnThreshold: detail.warnThreshold,
            evaluatorType: detail.evaluatorType,
            scoreType: detail.scoreType,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.setValues({status: '未启用'});
      }
    }
  },
});

// 配置表单
const [ConfigForm, configFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '配置中...'});
    try {
      const res = await configTargetMgmt({ids: configIds.value, ...values});
      if (res && res !== false) {
        ElMessage.success('配置成功');
        configDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('配置失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useConfigFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

const targetDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  targetDetailDrawerRef.value.open();
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
    evaluatorType: '评价人类型',
    scoreType: '计分方式',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    targetName: '指标名称',
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
  if (type === 'evaluatorType') {
    let label = '';
    if (value === 'teacher') label = '教职工';
    else if (value === 'parent') label = '家长';
    else if (value === 'leader') label = '领导';
    else label = value;
    handleFilterTagClick('evaluatorType', label);
  } else if (type === 'scoreType') {
    handleFilterTagClick('scoreType', value);
  } else if (type === 'status') {
    handleFilterTagClick('status', value);
  }
};

onMounted(() => {
  window.addEventListener('target-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('target-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <TargetDetailDrawer ref="targetDetailDrawerRef" :detail-obj="dataObj.detailObj"
                        @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? textObj.editText : textObj.addText">
      <CreateForm/>
    </CreateDrawer>
    <ConfigDrawer :title="textObj.configText">
      <ConfigForm/>
    </ConfigDrawer>
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
          <IconButton content="配置" icon-name="Setting" @click="handleBatchConfig"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #targetName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.targetName }}
        </el-text>
      </template>
      <template #evaluatorType="{ row }">
        <el-text @click="handleFilterTagClick('evaluatorType', row.evaluatorType)" type="primary"
                 style="cursor: pointer;">{{ row.evaluatorType }}
        </el-text>
      </template>
      <template #scoreType="{ row }">
        <el-text @click="handleFilterTagClick('scoreType', row.scoreType)" type="primary"
                 style="cursor: pointer;">{{ row.scoreType }}
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
      <template #enableTime="{ row }">
        <el-text>{{ formatTimestamp(row.enableTime) }}</el-text>
      </template>
      <template #disableTime="{ row }">
        <el-text>{{ formatTimestamp(row.disableTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未启用'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未启用'" content="启用" icon-name="Check"
                      @click="handleEnable(row)"/>
          <IconButton v-if="row.status === '已启用'" content="停用" icon-name="CircleClose"
                      @click="handleDisable(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
