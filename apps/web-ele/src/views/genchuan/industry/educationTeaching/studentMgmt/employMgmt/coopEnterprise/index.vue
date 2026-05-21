<script setup>
import {computed, reactive, ref, watch, nextTick, onMounted, onUnmounted} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import EnterpriseDetailDrawer from './components/enterpriseDetail.vue';
import {
  getCoopEnterprisePage,
  createCoopEnterprise,
  maintainCoopEnterprise,
  updateCoopEnterprise,
  exportCoopEnterprise,
  getCoopEnterpriseDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/employMgmt/coopEnterprise/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCreateFormSchema,
  useMaintainFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/employMgmt/coopEnterprise/form.js';

const getStatusType = (status) => {
  const map = {'合作中': 'success', '已结束': 'info'};
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

// 前端写死的系部选项
const deptOptions = ref([
  {value: 2001, label: '计算机系'},
  {value: 2002, label: '机电系'},
  {value: 2003, label: '经贸系'},
  {value: 2004, label: '其他'},
]);

const getDeptNameById = (deptId) => {
  if (!deptId) return '-';
  const found = deptOptions.value.find(opt => opt.value === deptId);
  return found ? found.label : String(deptId);
};

// 标签筛选
const tagFilters = ref({});

// ---------- 抽屉 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
});
const [MaintainDrawer, maintainDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => maintainDrawerApi.close()
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
const maintainId = ref(null);

const getTableData = async ({page}) => {
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
    const res = await getCoopEnterprisePage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取合作企业列表失败，请检查网络或联系管理员');
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
    const data = await exportCoopEnterprise(searchParams.value);
    downloadFileFromBlobPart({fileName: `${textObj.excelName}.xls`, source: data});
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
}

// 批量维护（仅支持单选）
async function handleBatchMaintain() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个合作企业');
    return;
  }
  if (checkedIds.value.length > 1) {
    ElMessage.warning('维护操作仅支持选择一个企业，请取消多选后重试');
    return;
  }
  const selectedRow = checkedRows.value[0];
  if (selectedRow.status !== '合作中') {
    ElMessage.warning('只有合作中的企业可以维护');
    return;
  }
  maintainId.value = selectedRow.id;
  maintainFormApi.resetForm();
  maintainDrawerApi.open();
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

// 行内维护
async function handleMaintain(row) {
  if (row.status !== '合作中') {
    ElMessage.warning('只有合作中的企业可以维护');
    return;
  }
  maintainId.value = row.id;
  maintainFormApi.resetForm();
  maintainDrawerApi.open();
}

// 建档/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '建档中...'});
    try {
      let res;
      if (isEditMode.value) res = await updateCoopEnterprise({...values, id: currentEditId.value});
      else res = await createCoopEnterprise({...values, status: values.status || '合作中'});
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '建档成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '建档失败');
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
          const detail = await getCoopEnterpriseDetail({id: currentEditId.value});
          await createFormApi.setValues({
            enterpriseName: detail.enterpriseName,
            enterpriseType: detail.enterpriseType,
            deptId: detail.deptId,
            contactUser: detail.contactUser,
            contactPhone: detail.contactPhone,
            coopStartTime: detail.coopStartTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.setValues({status: '合作中'});
      }
    }
  },
});

const [MaintainForm, maintainFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '维护中...' });
    try {
      let coopStartTime = null;
      let coopEndTime = null;
      if (values.timeRange && Array.isArray(values.timeRange) && values.timeRange.length === 2) {
        const [startStr, endStr] = values.timeRange;
        coopStartTime = new Date(startStr).getTime();
        coopEndTime = new Date(endStr).getTime();
        if (isNaN(coopStartTime) || isNaN(coopEndTime)) {
          ElMessage.error('合作时间范围格式无效');
          loading.close();
          return;
        }
      } else {
        ElMessage.error('请选择完整的合作时间范围');
        loading.close();
        return;
      }

      const params = {
        id: maintainId.value,
        coopStartTime,
        coopEndTime,
        remark: values.remark || '',
      };
      const res = await maintainCoopEnterprise(params);
      if (res && res !== false) {
        ElMessage.success('维护成功');
        maintainDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('维护失败');
      }
    } catch (error) {
      console.error('维护失败', error);
      ElMessage.error('维护失败');
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useMaintainFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

const enterpriseDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  enterpriseDetailDrawerRef.value.open();
}

// 高级查询表单
const [QueryForm, queryFormApi] = useVbenForm({
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
    enterpriseType: '企业类型',
    deptId: '负责系部',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    enterpriseName: '企业名称',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  if (field === 'deptId') return getDeptNameById(value);
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

// 监听图表自定义事件
const handleChartFilter = (event) => {
  const {type, value} = event.detail;
  if (type === 'enterpriseType') {
    handleFilterTagClick('enterpriseType', value);
  } else if (type === 'deptId') {
    handleFilterTagClick('deptId', value);
  } else if (type === 'status') {
    handleFilterTagClick('status', value);
  } else if (type === 'createTime') {
    handleFilterTagClick('createTime', value);
  }
};

onMounted(() => {
  window.addEventListener('coop-enterprise-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('coop-enterprise-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <EnterpriseDetailDrawer
      ref="enterpriseDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      :dept-options="deptOptions"
      @refresh="handleRefresh"
    />
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? textObj.editText : textObj.createText">
      <CreateForm/>
    </CreateDrawer>
    <MaintainDrawer :title="textObj.maintainText">
      <MaintainForm/>
    </MaintainDrawer>
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
          <IconButton content="建档" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="维护" icon-name="EditPen" @click="handleBatchMaintain"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #enterpriseName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.enterpriseName }}
        </el-text>
      </template>
      <template #enterpriseType="{ row }">
        <el-text @click="handleFilterTagClick('enterpriseType', row.enterpriseType)" type="primary"
                 style="cursor: pointer;">{{ row.enterpriseType }}
        </el-text>
      </template>
      <template #deptId="{ row }">
        <el-text @click="handleFilterTagClick('deptId', row.deptId)" type="primary"
                 style="cursor: pointer;">{{ getDeptNameById(row.deptId) }}
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
      <template #coopStartTime="{ row }">
        <el-text>{{ formatTimestamp(row.coopStartTime) }}</el-text>
      </template>
      <template #coopEndTime="{ row }">
        <el-text>{{ formatTimestamp(row.coopEndTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '合作中'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '合作中'" content="维护" icon-name="EditPen"
                      @click="handleMaintain(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
