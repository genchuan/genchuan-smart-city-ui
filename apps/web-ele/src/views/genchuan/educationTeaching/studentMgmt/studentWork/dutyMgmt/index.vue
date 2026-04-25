<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import DutyDetailDrawer from './components/dutyDetail.vue';
import {
  getDutyMgmtPage,
  scheduleDutyMgmt,
  checkinDutyMgmt,
  shiftApplyDutyMgmt,
  vehicleApplyDutyMgmt,
  shiftAuditDutyMgmt,
  vehicleAuditDutyMgmt,
  uploadRecordDutyMgmt,
  exportDutyMgmt,
  getDutyMgmtDetail,
  updateDutyMgmt,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/dutyMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useScheduleFormSchema,
  useShiftApplyFormSchema,
  useVehicleApplyFormSchema,
  useUploadRecordFormSchema,
  useEditFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/dutyMgmt/form.js';

// 辅助函数：将日期范围字符串数组 ['start', 'end'] 展开为每一天的日期字符串数组
function getDateRangeArray(dateRange) {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) return [];
  const [start, end] = dateRange;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const result = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }
  return result;
}

const getStatusType = (status) => {
  const map = {
    '待打卡': 'warning',
    '待调班审批': 'danger',
    '待出车审批': 'danger',
    '已完成': 'success'
  };
  return map[status] || 'info';
};
const getCheckInStatusType = (status) => {
  const map = {'未打卡': 'warning', '已打卡': 'success'};
  return map[status] || 'info';
};
const getTransferStatusType = (status) => {
  const map = {'无': 'info', '待审批': 'warning', '已通过': 'success', '已驳回': 'danger'};
  return map[status] || 'info';
};
const getCarStatusType = (status) => {
  const map = {'无': 'info', '待审批': 'warning', '已通过': 'success'};
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

// 标签筛选
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
  const map = {dutyUser: '值班人', status: '状态', creator: '创建人', createTime: '创建时间'};
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// 抽屉定义
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
});
const [ScheduleDrawer, scheduleDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => scheduleDrawerApi.close()
});
const [ShiftApplyDrawer, shiftApplyDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => shiftApplyDrawerApi.close()
});
const [VehicleApplyDrawer, vehicleApplyDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => vehicleApplyDrawerApi.close()
});
const [UploadRecordDrawer, uploadRecordDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => uploadRecordDrawerApi.close()
});
const [EditDrawer, editDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => editDrawerApi.close()
});

const dataObj = reactive({
  totalShow: false, detailObj: {}, total: 0, currentPage: 1, pageSize: 10, list: [], loading: false,
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

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {...searchParams.value, pageNo: page.currentPage, pageSize: page.pageSize};
    if (params.dutyDate && Array.isArray(params.dutyDate) && params.dutyDate.length === 2) {
      params.dutyDateStart = params.dutyDate[0];
      params.dutyDateEnd = params.dutyDate[1];
      delete params.dutyDate;
    }
    const res = await getDutyMgmtPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        if (field === 'dutyUser') itemValue = item.dutyUser;
        else if (field === 'status') itemValue = item.status;
        else if (field === 'creator') itemValue = item.creator;
        else if (field === 'createTime') itemValue = item.createTime ? getDateFromTimestamp(item.createTime) : '';
        else itemValue = item[field];
        if (Array.isArray(filterValue)) return filterValue.includes(String(itemValue));
        else return String(itemValue) === String(filterValue);
      });
    });
    dataObj.total = res.total;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取值班列表失败，请检查网络或联系管理员');
  } finally {
    dataObj.loading = false;
  }
  return dataObj;
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
    const loading = ElLoading.service({text: '正在导出...'});
    try {
      const data = await exportDutyMgmt(searchParams.value);
      downloadFileFromBlobPart({fileName: '值班管理列表.xls', source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    ElMessage.error('导出失败');
  }
}

// 排班表单（直接使用 schema，无需 options）
const [ScheduleForm, scheduleFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '排班中...'});
    try {
      let dateRange = values.dutyDateList;
      if (!dateRange || dateRange.length !== 2) {
        ElMessage.error('请选择有效的日期范围');
        loading.close();
        return;
      }
      let allDates = getDateRangeArray(dateRange);
      if (dateRange[0] === dateRange[1]) allDates = [dateRange[0]];
      const res = await scheduleDutyMgmt({
        dutyDateList: allDates,
        dutyUser: values.dutyUser,
        status: values.status || '待打卡',
        remark: values.remark || '',
      });
      if (res && res !== false) {
        ElMessage.success(`排班成功，共生成 ${allDates.length} 条记录`);
        scheduleDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('排班失败');
      }
    } catch (error) {
      console.error('排班失败', error);
      ElMessage.error('排班失败');
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useScheduleFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交排班'},
});

function handleSchedule() {
  scheduleFormApi.resetForm();
  scheduleDrawerApi.open();
}

// 编辑表单（直接使用 schema）
const currentEditRow = ref(null);
const [EditForm, editFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存中...'});
    try {
      const res = await updateDutyMgmt({
        id: currentEditRow.value.id,
        dutyDate: values.dutyDate,
        dutyUser: values.dutyUser,
        status: values.status,
        remark: values.remark || '',
      });
      if (res && res !== false) {
        ElMessage.success('编辑成功');
        editDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('编辑失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useEditFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存修改'},
});

function handleEdit(row) {
  currentEditRow.value = row;
  editFormApi.setValues({
    dutyDate: row.dutyDate,
    dutyUser: row.dutyUser,
    status: row.status,
    remark: row.remark || '',
  });
  editDrawerApi.open();
}

// 批量调班申请
const currentShiftRows = ref([]);

function handleBatchShiftApply() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条值班记录');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待打卡');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待打卡】的值班记录');
    return;
  }
  currentShiftRows.value = selectedRows;
  shiftApplyFormApi.resetForm();
  shiftApplyDrawerApi.open();
}

const [ShiftApplyForm, shiftApplyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '提交调班申请中...'});
    try {
      const ids = currentShiftRows.value.map(row => row.id);
      const res = await shiftApplyDutyMgmt({
        ids,
        transferReason: values.transferReason,
        transferUser: values.transferUser
      });
      if (res && res !== false) {
        ElMessage.success('调班申请提交成功');
        shiftApplyDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('提交失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useShiftApplyFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交申请'},
});

// 批量出车申请
const currentVehicleRows = ref([]);

function handleBatchVehicleApply() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条值班记录');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待打卡');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待打卡】的值班记录');
    return;
  }
  currentVehicleRows.value = selectedRows;
  vehicleApplyFormApi.resetForm();
  vehicleApplyDrawerApi.open();
}

const [VehicleApplyForm, vehicleApplyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '提交出车申请中...'});
    try {
      const ids = currentVehicleRows.value.map(row => row.id);
      const res = await vehicleApplyDutyMgmt({
        ids,
        carReason: values.carReason,
        carDestination: values.carDestination
      });
      if (res && res !== false) {
        ElMessage.success('出车申请提交成功');
        vehicleApplyDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('提交失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useVehicleApplyFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交申请'},
});

// 打卡
async function handleCheckin(row) {
  if (row.status !== '待打卡') {
    ElMessage.warning('只有待打卡状态的记录可以打卡');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认打卡（值班人：${row.dutyUser}，日期：${row.dutyDate}）？`, '打卡确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '打卡中...'});
    try {
      const res = await checkinDutyMgmt({ids: [row.id]});
      if (res && res !== false) {
        ElMessage.success('打卡成功');
        handleRefresh();
      } else {
        ElMessage.error('打卡失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

async function handleBatchCheckin() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条值班记录');
    return;
  }
  const selectedRows = checkedRows.value.filter(row => row.status === '待打卡');
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择状态为【待打卡】的值班记录');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认打卡选中的 ${selectedRows.length} 条值班记录？`, '批量打卡确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const loading = ElLoading.service({text: '打卡中...'});
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await checkinDutyMgmt({ids});
      if (res && res !== false) {
        ElMessage.success('批量打卡成功');
        handleRefresh();
      } else {
        ElMessage.error('批量打卡失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

// 调班审批
const shiftAuditDialogVisible = ref(false);
const currentShiftAuditRow = ref(null);
const shiftAuditResult = ref('');
const shiftAuditRemark = ref('');

function handleShiftAudit(row) {
  if (row.status !== '待调班审批') {
    ElMessage.warning('只有待调班审批状态的记录可以审批');
    return;
  }
  currentShiftAuditRow.value = row;
  shiftAuditResult.value = '';
  shiftAuditRemark.value = '';
  shiftAuditDialogVisible.value = true;
}

async function confirmShiftAudit() {
  if (!shiftAuditResult.value) {
    ElMessage.warning('请选择审批结果');
    return;
  }
  const loading = ElLoading.service({text: '审批中...'});
  try {
    const res = await shiftAuditDutyMgmt({
      id: currentShiftAuditRow.value.id,
      auditResult: shiftAuditResult.value,
      remark: shiftAuditRemark.value || ''
    });
    if (res && res !== false) {
      ElMessage.success('调班审批成功');
      shiftAuditDialogVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('审批失败');
    }
  } finally {
    loading.close();
  }
}

// 出车审批
const vehicleAuditDialogVisible = ref(false);
const currentVehicleAuditRow = ref(null);
const vehicleAuditResult = ref('');
const vehicleAuditRemark = ref('');

function handleVehicleAudit(row) {
  if (row.status !== '待出车审批') {
    ElMessage.warning('只有待出车审批状态的记录可以审批');
    return;
  }
  currentVehicleAuditRow.value = row;
  vehicleAuditResult.value = '';
  vehicleAuditRemark.value = '';
  vehicleAuditDialogVisible.value = true;
}

async function confirmVehicleAudit() {
  if (!vehicleAuditResult.value) {
    ElMessage.warning('请选择审批结果');
    return;
  }
  const loading = ElLoading.service({text: '审批中...'});
  try {
    const res = await vehicleAuditDutyMgmt({
      id: currentVehicleAuditRow.value.id,
      auditResult: vehicleAuditResult.value,
      remark: vehicleAuditRemark.value || ''
    });
    if (res && res !== false) {
      ElMessage.success('出车审批成功');
      vehicleAuditDialogVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('审批失败');
    }
  } finally {
    loading.close();
  }
}

// 上传记录
const currentUploadRow = ref(null);
const [UploadRecordForm, uploadRecordFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '上传记录中...'});
    try {
      const res = await uploadRecordDutyMgmt({
        id: currentUploadRow.value.id,
        recordContent: values.recordContent
      });
      if (res && res !== false) {
        ElMessage.success('值班记录上传成功');
        uploadRecordDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('上传失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useUploadRecordFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交记录'},
});

function handleUploadRecord(row) {
  currentUploadRow.value = row;
  uploadRecordFormApi.resetForm();
  uploadRecordDrawerApi.open();
}

// 详情
const dutyDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  dutyDetailDrawerRef.value.open();
}

// 查询表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: (values) => {
    searchParams.value = {...values};
    drawerApi.close();
    gridApi.reload();
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
  gridApi.reload();
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};
defineExpose({handleFilterTagClick, clearFilters});
</script>

<template>
  <div class="park-lot-table-new">
    <DutyDetailDrawer ref="dutyDetailDrawerRef" :detail-obj="dataObj.detailObj"
                      @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <ScheduleDrawer title="排班">
      <ScheduleForm/>
    </ScheduleDrawer>
    <ShiftApplyDrawer title="调班申请">
      <ShiftApplyForm/>
    </ShiftApplyDrawer>
    <VehicleApplyDrawer title="出车申请">
      <VehicleApplyForm/>
    </VehicleApplyDrawer>
    <UploadRecordDrawer title="上传值班记录">
      <UploadRecordForm/>
    </UploadRecordDrawer>
    <EditDrawer title="编辑值班记录">
      <EditForm/>
    </EditDrawer>

    <Grid>
      <template #table-title>
        <ElTag v-for="(value, field) in tagFilters" :key="field" type="success" closable
               @close="removeFilterTag(field)"
               style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px">
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="排班" icon-name="Plus" @click="handleSchedule"/>
          <IconButton content="打卡" icon-name="Check" @click="handleBatchCheckin"/>
          <IconButton content="调班" icon-name="Switch" @click="handleBatchShiftApply"/>
          <IconButton content="出车申请" icon-name="Van" @click="handleBatchVehicleApply"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart"
                      @click="toggleChart"/>
        </div>
      </template>

      <template #dutyUser="{ row }">
        <el-text @click="handleFilterTagClick('dutyUser', row.dutyUser)" type="primary"
                 style="cursor: pointer;">{{ row.dutyUser }}
        </el-text>
      </template>
      <template #checkInStatus="{ row }">
        <el-tag :type="getCheckInStatusType(row.checkInStatus)">{{ row.checkInStatus }}</el-tag>
      </template>
      <template #transferStatus="{ row }">
        <el-tag :type="getTransferStatusType(row.transferStatus)">{{ row.transferStatus }}</el-tag>
      </template>
      <template #carStatus="{ row }">
        <el-tag :type="getCarStatusType(row.carStatus)">{{ row.carStatus }}</el-tag>
      </template>
      <template #recordUploadTime="{ row }">
        <el-text>{{ formatTimestamp(row.recordUploadTime) }}</el-text>
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
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待打卡'" content="打卡" icon-name="Check"
                      @click="handleCheckin(row)"/>
          <IconButton v-if="row.status === '待调班审批'" content="调班审批" icon-name="Checked"
                      @click="handleShiftAudit(row)"/>
          <IconButton v-if="row.status === '待出车审批'" content="出车审批" icon-name="Checked"
                      @click="handleVehicleAudit(row)"/>
          <IconButton v-if="row.status === '已完成'" content="上传记录" icon-name="Upload"
                      @click="handleUploadRecord(row)"/>
        </div>
      </template>
    </Grid>

    <!-- 调班审批弹窗 -->
    <el-dialog title="调班审批" v-model="shiftAuditDialogVisible" width="400px">
      <el-form label-width="100px">
        <el-form-item label="审批结果" required>
          <el-select v-model="shiftAuditResult" placeholder="请选择审批结果" style="width: 100%;">
            <el-option label="通过" value="通过"/>
            <el-option label="驳回" value="驳回"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审批备注">
          <el-input v-model="shiftAuditRemark" type="textarea" :rows="3"
                    placeholder="请输入备注（可选）"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shiftAuditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmShiftAudit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 出车审批弹窗 -->
    <el-dialog title="出车审批" v-model="vehicleAuditDialogVisible" width="400px">
      <el-form label-width="100px">
        <el-form-item label="审批结果" required>
          <el-select v-model="vehicleAuditResult" placeholder="请选择审批结果" style="width: 100%;">
            <el-option label="通过" value="通过"/>
            <el-option label="驳回" value="驳回"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审批备注">
          <el-input v-model="vehicleAuditRemark" type="textarea" :rows="3"
                    placeholder="请输入备注（可选）"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vehicleAuditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmVehicleAudit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
