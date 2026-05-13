<script setup>
import {computed, reactive, ref, watch, nextTick, onMounted, onUnmounted} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import MentalDetailDrawer from './components/mentalDetail.vue';
import {
  getMentalMgmtPage,
  createMentalMgmt,
  updateMentalMgmt,
  consultMentalMgmt,
  interveneMentalMgmt,
  updateStatusMentalMgmt,
  exportMentalMgmt,
  getMentalMgmtDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/mentalMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/mentalMgmt/form.js';

// 辅助函数
const getStatusType = (status) => {
  const map = {'待评估': 'warning', '咨询中': 'primary', '已干预': 'success'};
  return map[status] || 'info';
};
const getMentalStatusType = (status) => {
  const map = {'正常': 'success', '关注': 'warning', '高危': 'danger'};
  return map[status] || 'info';
};
const getRiskLevelType = (level) => {
  const map = {'低': 'success', '中': 'warning', '高': 'danger'};
  return map[level] || 'info';
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
    studentId: '学号',
    mentalStatus: '心理状态',
    riskLevel: '风险等级',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 原有变量 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
});
const [InterveneDrawer, interveneDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => interveneDrawerApi.close()
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

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      studentId: tagFilters.value.studentId,
      mentalStatus: tagFilters.value.mentalStatus,
      riskLevel: tagFilters.value.riskLevel,
      status: tagFilters.value.status,
      creator: tagFilters.value.creator,
      createTimeStart: Array.isArray(tagFilters.value.createTime) ? tagFilters.value.createTime[0] : null,
      createTimeEnd: Array.isArray(tagFilters.value.createTime) ? tagFilters.value.createTime[1] : null,
    };
    // 删除无效参数
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const res = await getMentalMgmtPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取心理档案列表失败，请检查网络或联系管理员');
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
    const data = await exportMentalMgmt(searchParams.value);
    downloadFileFromBlobPart({fileName: '心理管理列表.xls', source: data});
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open();
}

function handleEdit(row) {
  if (row.status !== '待评估') return ElMessage.warning('只有待评估状态的档案可以编辑');
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open();
}

async function handleConsult(row) {
  if (row.status !== '待评估') return ElMessage.warning('只有待评估状态的档案可以预约咨询');
  try {
    const {value: consultTime} = await ElMessageBox.prompt('请选择咨询预约时间', '预约', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputType: 'datetime-local',
      inputPlaceholder: '请选择时间',
    });
    if (consultTime) {
      const timestamp = new Date(consultTime).getTime();
      const loading = ElLoading.service({text: '预约中...'});
      try {
        const res = await consultMentalMgmt({id: row.id, consultTime: timestamp});
        if (res && res !== false) {
          ElMessage.success('预约成功');
          handleRefresh();
        } else {
          ElMessage.error('预约失败');
        }
      } finally {
        loading.close();
      }
    }
  } catch {
  }
}

const currentInterveneRow = ref(null);
const interveneForm = reactive({interveneTime: '', interveneContent: ''});

function handleOpenIntervene(row) {
  if (row.status !== '咨询中') return ElMessage.warning('只有咨询中状态的档案可以进行干预跟进');
  currentInterveneRow.value = row;
  interveneForm.interveneTime = formatTimestamp(Date.now());
  interveneForm.interveneContent = '';
  interveneDrawerApi.open();
}

async function handleSubmitIntervene() {
  if (!interveneForm.interveneContent) return ElMessage.warning('请填写干预内容');
  const loading = ElLoading.service({text: '提交中...'});
  try {
    const res = await interveneMentalMgmt({
      id: currentInterveneRow.value.id,
      interveneTime: new Date(interveneForm.interveneTime).getTime(),
      interveneContent: interveneForm.interveneContent,
    });
    if (res && res !== false) {
      ElMessage.success('干预跟进成功');
      interveneDrawerApi.close();
      handleRefresh();
    } else {
      ElMessage.error('操作失败');
    }
  } finally {
    loading.close();
  }
}

const updateStatusDialogVisible = ref(false);
const currentUpdateRow = ref(null);
const newMentalStatus = ref('');
const newRiskLevel = ref('');

function openUpdateStatusDialog(row) {
  currentUpdateRow.value = row;
  newMentalStatus.value = row.mentalStatus;
  newRiskLevel.value = row.riskLevel;
  updateStatusDialogVisible.value = true;
}

async function confirmUpdateStatus() {
  if (!newMentalStatus.value || !newRiskLevel.value) return ElMessage.warning('请完整填写心理状态和风险等级');
  const loading = ElLoading.service({text: '更新中...'});
  try {
    const res = await updateStatusMentalMgmt({
      id: currentUpdateRow.value.id,
      mentalStatus: newMentalStatus.value,
      riskLevel: newRiskLevel.value
    });
    if (res && res !== false) {
      ElMessage.success('状态更新成功');
      updateStatusDialogVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('更新失败');
    }
  } finally {
    loading.close();
  }
}

// 建档/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '建档中...'});
    try {
      let res;
      if (isEditMode.value) {
        res = await updateMentalMgmt({...values, id: currentEditId.value});
      } else {
        res = await createMentalMgmt({...values, status: values.status || '待评估'});
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '建档成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '建档失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(),
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
          const detail = await getMentalMgmtDetail({id: currentEditId.value});
          await createFormApi.setValues({
            studentId: detail.studentId,
            mentalStatus: detail.mentalStatus,
            riskLevel: detail.riskLevel,
            evaluateTime: detail.evaluateTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.setValues({status: '待评估'});
      }
    }
  },
});

const mentalDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  mentalDetailDrawerRef.value.open();
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

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({columns: gridColumns.value});
  gridApi.query();
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
  if (type === 'mentalStatus') {
    handleFilterTagClick('mentalStatus', value);
  } else if (type === 'riskLevel') {
    handleFilterTagClick('riskLevel', value);
  } else if (type === 'status') {
    handleFilterTagClick('status', value);
  } else if (type === 'createTime') {
    handleFilterTagClick('createTime', value);
  }
};

onMounted(() => {
  window.addEventListener('mental-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('mental-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="tools-table-new">
    <MentalDetailDrawer ref="mentalDetailDrawerRef" :detail-obj="dataObj.detailObj"
                        @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? '编辑心理档案' : '建档'">
      <CreateForm/>
    </CreateDrawer>
    <InterveneDrawer title="干预跟进">
      <div style="padding: 20px;">
        <el-form :model="interveneForm" label-width="100px">
          <el-form-item label="干预时间" required>
            <el-date-picker v-model="interveneForm.interveneTime" type="datetime"
                            placeholder="请选择干预时间" value-format="YYYY-MM-DD HH:mm:ss"
                            style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="干预内容" required>
            <el-input v-model="interveneForm.interveneContent" type="textarea" :rows="4"
                      placeholder="请输入干预内容"/>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin-top: 20px;">
          <el-button @click="interveneDrawerApi.close()">取消</el-button>
          <el-button type="primary" @click="handleSubmitIntervene">确认</el-button>
        </div>
      </div>
    </InterveneDrawer>
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
      <template #mentalStatus="{ row }">
        <el-tag :type="getMentalStatusType(row.mentalStatus)"
                @click="handleFilterTagClick('mentalStatus', row.mentalStatus)"
                style="cursor: pointer;">{{ row.mentalStatus }}
        </el-tag>
      </template>
      <template #riskLevel="{ row }">
        <el-tag :type="getRiskLevelType(row.riskLevel)"
                @click="handleFilterTagClick('riskLevel', row.riskLevel)"
                style="cursor: pointer;">{{ row.riskLevel }}
        </el-tag>
      </template>
      <template #evaluateTime="{ row }">
        <el-text>{{ formatTimestamp(row.evaluateTime) }}</el-text>
      </template>
      <template #consultTime="{ row }">
        <el-text>{{ formatTimestamp(row.consultTime) }}</el-text>
      </template>
      <template #interveneTime="{ row }">
        <el-text>{{ formatTimestamp(row.interveneTime) }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)"
                style="cursor: pointer;">{{ row.status }}
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
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待评估'" content="预约" icon-name="Calendar"
                      @click="handleConsult(row)"/>
          <IconButton v-if="row.status === '待评估'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '咨询中'" content="跟进" icon-name="EditPen"
                      @click="handleOpenIntervene(row)"/>
          <IconButton v-if="row.status === '已干预'" content="更新状态" icon-name="Refresh"
                      @click="openUpdateStatusDialog(row)"/>
        </div>
      </template>
    </Grid>

    <el-dialog title="更新状态" v-model="updateStatusDialogVisible" width="400px">
      <el-form label-width="100px">
        <el-form-item label="心理状态">
          <el-select v-model="newMentalStatus" placeholder="请选择心理状态" style="width: 100%;">
            <el-option label="正常" value="正常"/>
            <el-option label="关注" value="关注"/>
            <el-option label="高危" value="高危"/>
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="newRiskLevel" placeholder="请选择风险等级" style="width: 100%;">
            <el-option label="低" value="低"/>
            <el-option label="中" value="中"/>
            <el-option label="高" value="高"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateStatusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateStatus">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
