<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import ParkDetailDrawer from './components/detail.vue';
import Chart2 from './components/chart2.vue';
// 导入原有模拟数据（用于非“全部”标签页）
import { dataList } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/data.js';

import {
  getGarbageTransferPage,
  createGarbageTransfer,
  updateGarbageTransfer,
  deleteGarbageTransfer,
  exportGarbageTransferExcel,
  getTransferReserveDetail,
  getTransferOperationDetail,
  getTransferAlarmDetail,
  getTransferMaintenanceDetail
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/data.js';

import {
  textObj,
  useGarbageTransferFormSchema,
  useGarbageTransferSearchSchema,
  getColumnsByStatus,
  getAreaOptions,
  getUserOptions,
  getOperationStatusOptions,
  getEquipmentOptions,
  // 新增弹窗 Schema
  useBatchReserveSchema,
  useBatchArchiveSchema,
  useReserveNumberSchema,
  useConfirmEntrySchema,
  useCancelReserveSchema,
  usePauseOperationSchema,
  useReportAlarmSchema,
  useHandleAlarmSchema,
  useAssignPersonSchema,
  useReleaseAlarmSchema,
  useAssignMaintenanceSchema,
  useMaintenanceProcessSchema,
  useAcceptMaintenanceSchema,
  useTransferArchiveSchema,
  useReReserveSchema,
  useReuseProfileSchema,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 状态与数据 ----------
const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '车辆待进站' },
  { label: '作业进行中' },
  { label: '预警待处理' },
  { label: '设备待维护' },
  { label: '已完成' },
]);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] === value) {
    delete tagFilters.value[field];
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    areaCode: '所属区域',
    operationStatusId: '运营状态',
    progressStatus: '流程状态',
  };
  return map[field] || field;
}

function getTagDisplayText(field, id) {
  if (id == null) return '';
  let options = [];
  switch (field) {
    case 'areaCode':
      options = loadedOptions.area;
      break;
    case 'operationStatusId':
      options = loadedOptions.operationStatus;
      break;
    default:
      return id;
  }
  const found = options.find(opt => opt.value === id);
  return found ? found.label : id;
}

const counts = ref({
  total: 0,
  statusCounts: {
    全部: 0,
    车辆待进站: 0,
    作业进行中: 0,
    预警待处理: 0,
    设备待维护: 0,
    已完成: 0,
  },
});

const createLabel = (item) => {
  const key = item.label;
  if (key === '全部') {
    return `${key} (${counts.value.total || 0})`;
  } else {
    const filtered = dataList().filter(v => v.status === key).length;
    return `${key} (${filtered})`;
  }
};

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});

const checkedIds = ref([]);

const loadedOptions = reactive({
  area: [],
  user: [],
  operationStatus: [],
  equipment: [],
});

const isApiTab = computed(() => activeName.value === '全部');

const gridColumns = ref(getColumnsByStatus(activeName.value));

// ---------- 搜索表单 ----------
const [SearchForm, searchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async () => {
    const rawValues = await searchFormApi.getValues();
    dataObj.searchParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== '')
    );
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useGarbageTransferSearchSchema(),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

// ---------- 编辑表单 ----------
const [EditForm, editFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useGarbageTransferFormSchema(),
  showDefaultActions: false,
});

const formData = ref();
const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => editDrawerApi.close(),
  async onConfirm() {
    const formValues = await editFormApi.getValues();
    const isAdd = !formData.value?.id;
    const submitData = {...formValues};
    if (submitData.equipmentIds && Array.isArray(submitData.equipmentIds)) {
      submitData.equipmentIds = JSON.stringify(submitData.equipmentIds);
    }
    try {
      if (isAdd) {
        await createGarbageTransfer(submitData);
      } else {
        const originalData = {...formData.value};
        delete originalData.areaName;
        delete originalData.equipmentsName;
        delete originalData.operationStatusName;
        delete originalData.managerName;
        delete originalData.$tableRowIndex;
        const fullData = {...originalData, ...submitData, id: originalData.id};
        if (fullData.equipmentIds && Array.isArray(fullData.equipmentIds)) {
          fullData.equipmentIds = JSON.stringify(fullData.equipmentIds);
        }
        await updateGarbageTransfer(fullData);
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh();
      editDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      const errMsg = error?.response?.data?.msg || error?.message || '操作失败，请重试';
      ElMessage.error(errMsg);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = editDrawerApi.getData();
      if (formData.value?.id) {
        const editData = {...formData.value};
        if (editData.equipmentIds && typeof editData.equipmentIds === 'string') {
          try {
            editData.equipmentIds = JSON.parse(editData.equipmentIds);
          } catch {
            editData.equipmentIds = editData.equipmentIds.split(',').map(s => s.trim());
          }
        }
        await editFormApi.setValues(editData);
      } else {
        await editFormApi.resetForm();
      }
    }
  },
});

// ---------- 新增功能抽屉 ----------
// 批量预约
const [BatchReserveForm, batchReserveFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useBatchReserveSchema(),
  showDefaultActions: false,
});
const [BatchReserveDrawer, batchReserveDrawerApi] = useVbenDrawer({
  title: '批量预约',
  appendToMain: true,
  modal: false,
  onCancel: () => batchReserveDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchReserveFormApi.getValues();
    ElMessage.info('批量预约功能待实现');
    batchReserveDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      batchReserveFormApi.resetForm();
      batchReserveFormApi.updateSchema([
        {fieldName: 'vehicleIds', componentProps: {options: loadedOptions.vehicle || []}},
        {fieldName: 'garbageTypeId', componentProps: {options: loadedOptions.garbageType || []}},
      ]);
    }
  },
});

// 批量归档
const [BatchArchiveForm, batchArchiveFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useBatchArchiveSchema(),
  showDefaultActions: false,
});
const [BatchArchiveDrawer, batchArchiveDrawerApi] = useVbenDrawer({
  title: '批量归档',
  appendToMain: true,
  modal: false,
  onCancel: () => batchArchiveDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchArchiveFormApi.getValues();
    ElMessage.info('批量归档功能待实现');
    batchArchiveDrawerApi.close();
  },
});

// 预约排号
const [ReserveNumberForm, reserveNumberFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useReserveNumberSchema(),
  showDefaultActions: false,
});
const [ReserveNumberDrawer, reserveNumberDrawerApi] = useVbenDrawer({
  title: '预约排号',
  appendToMain: true,
  modal: false,
  onCancel: () => reserveNumberDrawerApi.close(),
  async onConfirm() {
    const formValues = await reserveNumberFormApi.getValues();
    ElMessage.info('预约排号功能待实现');
    reserveNumberDrawerApi.close();
  },
});

// 确认进站
const [ConfirmEntryForm, confirmEntryFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useConfirmEntrySchema(),
  showDefaultActions: false,
});
const [ConfirmEntryDrawer, confirmEntryDrawerApi] = useVbenDrawer({
  title: '确认进站',
  appendToMain: true,
  modal: false,
  onCancel: () => confirmEntryDrawerApi.close(),
  async onConfirm() {
    const formValues = await confirmEntryFormApi.getValues();
    ElMessage.info('确认进站功能待实现');
    confirmEntryDrawerApi.close();
  },
});

// 取消预约
const [CancelReserveForm, cancelReserveFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useCancelReserveSchema(),
  showDefaultActions: false,
});
const [CancelReserveDrawer, cancelReserveDrawerApi] = useVbenDrawer({
  title: '取消预约',
  appendToMain: true,
  modal: false,
  onCancel: () => cancelReserveDrawerApi.close(),
  async onConfirm() {
    const formValues = await cancelReserveFormApi.getValues();
    ElMessage.info('取消预约功能待实现');
    cancelReserveDrawerApi.close();
  },
});

// 实时监控（无表单，仅占位）
const [RealTimeMonitorDrawer, realTimeMonitorDrawerApi] = useVbenDrawer({
  title: '实时监控',
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel: () => realTimeMonitorDrawerApi.close(),
});

// 暂停作业
const [PauseOperationForm, pauseOperationFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: usePauseOperationSchema(),
  showDefaultActions: false,
});
const [PauseOperationDrawer, pauseOperationDrawerApi] = useVbenDrawer({
  title: '暂停作业',
  appendToMain: true,
  modal: false,
  onCancel: () => pauseOperationDrawerApi.close(),
  async onConfirm() {
    const formValues = await pauseOperationFormApi.getValues();
    ElMessage.info('暂停作业功能待实现');
    pauseOperationDrawerApi.close();
  },
});

// 上报预警
const [ReportAlarmForm, reportAlarmFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useReportAlarmSchema(),
  showDefaultActions: false,
});
const [ReportAlarmDrawer, reportAlarmDrawerApi] = useVbenDrawer({
  title: '上报预警',
  appendToMain: true,
  modal: false,
  onCancel: () => reportAlarmDrawerApi.close(),
  async onConfirm() {
    const formValues = await reportAlarmFormApi.getValues();
    ElMessage.info('上报预警功能待实现');
    reportAlarmDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      reportAlarmFormApi.resetForm();
      reportAlarmFormApi.updateSchema([
        {fieldName: 'alarmTypeId', componentProps: {options: loadedOptions.alarmType || []}},
      ]);
    }
  },
});

// 处理预警
const [HandleAlarmForm, handleAlarmFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useHandleAlarmSchema(),
  showDefaultActions: false,
});
const [HandleAlarmDrawer, handleAlarmDrawerApi] = useVbenDrawer({
  title: '处理预警',
  appendToMain: true,
  modal: false,
  onCancel: () => handleAlarmDrawerApi.close(),
  async onConfirm() {
    const formValues = await handleAlarmFormApi.getValues();
    ElMessage.info('处理预警功能待实现');
    handleAlarmDrawerApi.close();
  },
});

// 指派人员（通用）
const [AssignPersonForm, assignPersonFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useAssignPersonSchema(),
  showDefaultActions: false,
});
const [AssignPersonDrawer, assignPersonDrawerApi] = useVbenDrawer({
  title: '指派人员',
  appendToMain: true,
  modal: false,
  onCancel: () => assignPersonDrawerApi.close(),
  async onConfirm() {
    const formValues = await assignPersonFormApi.getValues();
    ElMessage.info('指派人员功能待实现');
    assignPersonDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      assignPersonFormApi.resetForm();
      assignPersonFormApi.updateSchema([
        {fieldName: 'handlerId', componentProps: {options: loadedOptions.user}},
      ]);
    }
  },
});

// 解除预警
const [ReleaseAlarmForm, releaseAlarmFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useReleaseAlarmSchema(),
  showDefaultActions: false,
});
const [ReleaseAlarmDrawer, releaseAlarmDrawerApi] = useVbenDrawer({
  title: '解除预警',
  appendToMain: true,
  modal: false,
  onCancel: () => releaseAlarmDrawerApi.close(),
  async onConfirm() {
    const formValues = await releaseAlarmFormApi.getValues();
    ElMessage.info('解除预警功能待实现');
    releaseAlarmDrawerApi.close();
  },
});

// 指派维护
const [AssignMaintenanceForm, assignMaintenanceFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useAssignMaintenanceSchema(),
  showDefaultActions: false,
});
const [AssignMaintenanceDrawer, assignMaintenanceDrawerApi] = useVbenDrawer({
  title: '指派维护',
  appendToMain: true,
  modal: false,
  onCancel: () => assignMaintenanceDrawerApi.close(),
  async onConfirm() {
    const formValues = await assignMaintenanceFormApi.getValues();
    ElMessage.info('指派维护功能待实现');
    assignMaintenanceDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      assignMaintenanceFormApi.resetForm();
      assignMaintenanceFormApi.updateSchema([
        {fieldName: 'repairBy', componentProps: {options: loadedOptions.user}},
      ]);
    }
  },
});

// 维护处理
const [MaintenanceProcessForm, maintenanceProcessFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useMaintenanceProcessSchema(),
  showDefaultActions: false,
});
const [MaintenanceProcessDrawer, maintenanceProcessDrawerApi] = useVbenDrawer({
  title: '维护处理',
  appendToMain: true,
  modal: false,
  onCancel: () => maintenanceProcessDrawerApi.close(),
  async onConfirm() {
    const formValues = await maintenanceProcessFormApi.getValues();
    ElMessage.info('维护处理功能待实现');
    maintenanceProcessDrawerApi.close();
  },
});

// 验收维护
const [AcceptMaintenanceForm, acceptMaintenanceFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useAcceptMaintenanceSchema(),
  showDefaultActions: false,
});
const [AcceptMaintenanceDrawer, acceptMaintenanceDrawerApi] = useVbenDrawer({
  title: '验收维护',
  appendToMain: true,
  modal: false,
  onCancel: () => acceptMaintenanceDrawerApi.close(),
  async onConfirm() {
    const formValues = await acceptMaintenanceFormApi.getValues();
    ElMessage.info('验收维护功能待实现');
    acceptMaintenanceDrawerApi.close();
  },
});

// 转运归档
const [TransferArchiveForm, transferArchiveFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useTransferArchiveSchema(),
  showDefaultActions: false,
});
const [TransferArchiveDrawer, transferArchiveDrawerApi] = useVbenDrawer({
  title: '转运归档',
  appendToMain: true,
  modal: false,
  onCancel: () => transferArchiveDrawerApi.close(),
  async onConfirm() {
    const formValues = await transferArchiveFormApi.getValues();
    ElMessage.info('转运归档功能待实现');
    transferArchiveDrawerApi.close();
  },
});

// 重新预约
const [ReReserveForm, reReserveFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useReReserveSchema(),
  showDefaultActions: false,
});
const [ReReserveDrawer, reReserveDrawerApi] = useVbenDrawer({
  title: '重新预约',
  appendToMain: true,
  modal: false,
  onCancel: () => reReserveDrawerApi.close(),
  async onConfirm() {
    const formValues = await reReserveFormApi.getValues();
    ElMessage.info('重新预约功能待实现');
    reReserveDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      reReserveFormApi.resetForm();
      reReserveFormApi.updateSchema([
        {fieldName: 'vehicleId', componentProps: {options: loadedOptions.vehicle || []}},
        {fieldName: 'garbageTypeId', componentProps: {options: loadedOptions.garbageType || []}},
      ]);
    }
  },
});

// 复用建档信息
const [ReuseProfileForm, reuseProfileFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useReuseProfileSchema(),
  showDefaultActions: false,
});
const [ReuseProfileDrawer, reuseProfileDrawerApi] = useVbenDrawer({
  title: '复用建档信息',
  appendToMain: true,
  modal: false,
  onCancel: () => reuseProfileDrawerApi.close(),
  async onConfirm() {
    const formValues = await reuseProfileFormApi.getValues();
    ElMessage.info('复用建档信息功能待实现');
    reuseProfileDrawerApi.close();
  },
});

// ---------- 数据转换函数 ----------
function convertGarbageTransferItem(item) {
  if (item.name !== undefined) {
    let equipmentIds = item.equipmentIds;
    if (typeof equipmentIds === 'string') {
      try {
        equipmentIds = JSON.parse(equipmentIds);
      } catch {
        equipmentIds = equipmentIds ? equipmentIds.split(',').map(s => s.trim()) : [];
      }
    }
    let environmentDataObj = {};
    if (item.environmentData && typeof item.environmentData === 'string') {
      try {
        environmentDataObj = JSON.parse(item.environmentData);
      } catch {
      }
    }
    return {
      ...item,
      equipmentIds,
      environmentDataObj,
      createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
      updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    };
  }
  return item;
}

// 获取表格数据
const getTableData = async ({page}) => {
  if (activeName.value === '全部') {
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...dataObj.searchParams,
      ...tagFilters.value,
    };
    try {
      const res = await getGarbageTransferPage(params);
      const listData = res.data?.list || res.list || [];
      const total = res.data?.total || res.total || 0;

      counts.value.total = total;
      dataObj.total = total;

      dataObj.list = listData.map(item => {
        const converted = convertGarbageTransferItem(item);
        if (converted.equipmentIds && Array.isArray(converted.equipmentIds)) {
          converted.equipmentsName = converted.equipmentIds.map(id => {
            const option = loadedOptions.equipment.find(opt => opt.value === id);
            return option ? option.label : id;
          });
        } else {
          converted.equipmentsName = [];
        }
        return converted;
      });

      return dataObj;
    } catch (error) {
      console.error('获取数据失败', error);
      ElMessage.error('数据加载失败，请重试');
      dataObj.total = 0;
      dataObj.list = [];
      return dataObj;
    }
  } else {
    const allData = dataList();
    const filtered = allData.filter(v => v.status === activeName.value);
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
    return dataObj;
  }
};

// Grid 配置
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
  gridEvents: {
    checkboxAll: ({records}) => {
      checkedIds.value = records.map(item => item.id);
    },
    checkboxChange: ({records}) => {
      checkedIds.value = records.map(item => item.id);
    },
  },
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({columns: gridColumns.value});
  }
  dataObj.searchParams = {};
  searchDrawerApi.close();
  parkDetailDrawerRef.value?.close();
  handleRefresh();
});

function handleRefresh() {
  gridApi.query();
}

function handleClick() {
  gridApi.query();
}

function handleSerachShow() {
  searchFormApi.resetForm();
  searchDrawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function handleCreate() {
  editDrawerApi.setData({}).open();
}

function handleEdit(row) {
  editDrawerApi.setData(row).open();
}

async function handleDelete(row) {
  const loading = ElLoading.service({text: $t('ui.actionMessage.deleting', [row.name || row.toiletName])});
  try {
    if (activeName.value === '全部') {
      await deleteGarbageTransfer(row.id);
    } else {
      ElMessage.info('非全部标签页暂不支持删除');
      return;
    }
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } catch (error) {
    ElMessage.error('删除失败：' + (error.message || '未知错误'));
  } finally {
    loading.close();
  }
}

async function handleExport() {
  const params = dataObj.searchParams || {};
  try {
    if (activeName.value === '全部') {
      const response = await exportGarbageTransferExcel(params);
      const blob = response.data || response;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `转运站运营数据_${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      exportToExcel(dataObj.list, textObj.excelName, textObj.excelAllName);
    }
  } catch (error) {
    ElMessage.error('导出失败：' + (error.message || '未知错误'));
  }
}

// 车辆待进站数据转换
function transformReserveData(data) {
  if (!data) return null;
  return {
    ...data,
    licensePlate: data.vehicleName,
    garbageType: data.garbageTypeName,
    area: data.areaName,
    handler: data.handleName,
    status: '车辆待进站',
    progressStatus: '车辆待进站',
  };
}

// 作业进行中/已完成/已归档数据转换
function transformOperationData(data, status) {
  if (!data) return null;
  return {
    ...data,
    licensePlate: data.vehicleName,
    garbageType: data.garbageTypeName,
    points: data.pointsName,
    status: status,
  };
}

// 预警待处理数据转换
function transformAlarmData(data) {
  if (!data) return null;
  return {
    ...data,
    transferName: data.transferName,
    alarmType: data.alarmTypeName,
    handler: data.handleName,
    status: '预警待处理',
  };
}

// 设备待维护数据转换
function transformMaintenanceData(data) {
  if (!data) return null;
  return {
    ...data,
    transferName: data.transferName,
    equipmentName: data.equipmentName,
    handler: data.handleName,
    status: '设备待维护',
  };
}

const parkDetailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  const loading = ElLoading.service({ text: '加载详情中...' });
  try {
    let detailData = null;

    // 仅当当前为“全部”标签页时调用接口，否则使用行数据（模拟数据场景）
    if (activeName.value === '全部') {
      const progressStatus = row.progressStatus;

      if (progressStatus === '车辆待进站' && row.reserveId) {
        const res = await getTransferReserveDetail({ reserveId: row.reserveId });
        const rawData = res.data?.list?.[0];
        detailData = transformReserveData(rawData);
      }
      else if (['作业进行中', '已完成', '已归档'].includes(progressStatus) && row.operationId) {
        const res = await getTransferOperationDetail({ operationId: row.operationId });
        const rawData = res.data?.list?.[0];
        detailData = transformOperationData(rawData, progressStatus);
      }
      else if (progressStatus === '预警待处理' && row.alarmId) {
        const res = await getTransferAlarmDetail({ alarmId: row.alarmId });
        const rawData = res.data?.list?.[0];
        detailData = transformAlarmData(rawData);
      }
      else if (progressStatus === '设备待维护' && row.maintenanceId) {
        const res = await getTransferMaintenanceDetail({ maintenanceId: row.maintenanceId });
        const rawData = res.data?.list?.[0];
        detailData = transformMaintenanceData(rawData);
      }
      else {
        // 无对应状态或缺少ID时，直接使用行数据（保留原始字段）
        detailData = row;
      }
    } else {
      // 非全部标签页（模拟数据）暂不调用接口，直接使用行数据
      detailData = row;
    }

    if (detailData) {
      dataObj.detailObj = detailData;
      parkDetailDrawerRef.value?.open();
    } else {
      ElMessage.error('未获取到详情数据');
    }
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error('获取详情失败，请重试');
  } finally {
    loading.close();
  }
}

const arrowChange = () => emit('arrow-change');
const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// 处理行内按钮（根据进度状态）
function handleRowAction(row, action) {
  // 根据 action 打开对应抽屉，可以传入 row 数据
  const data = {...row};
  switch (action) {
    case 'reserveNumber':
      reserveNumberDrawerApi.open();
      break;
    case 'confirmEntry':
      confirmEntryDrawerApi.open();
      break;
    case 'cancelReserve':
      cancelReserveDrawerApi.open();
      break;
    case 'realTimeMonitor':
      realTimeMonitorDrawerApi.open();
      break;
    case 'pauseOperation':
      pauseOperationDrawerApi.open();
      break;
    case 'reportAlarm':
      reportAlarmDrawerApi.open();
      break;
    case 'handleAlarm':
      handleAlarmDrawerApi.open();
      break;
    case 'assignPerson':
      assignPersonDrawerApi.open();
      break;
    case 'releaseAlarm':
      releaseAlarmDrawerApi.open();
      break;
    case 'assignMaintenance':
      assignMaintenanceDrawerApi.open();
      break;
    case 'maintenanceProcess':
      maintenanceProcessDrawerApi.open();
      break;
    case 'acceptMaintenance':
      acceptMaintenanceDrawerApi.open();
      break;
    case 'transferArchive':
      transferArchiveDrawerApi.open();
      break;
    case 'exportRecord':
      exportToExcel([row], '作业记录', '作业记录.xlsx');
      break;
    case 'reReserve':
      reReserveDrawerApi.open();
      break;
    case 'reuseProfile':
      reuseProfileDrawerApi.open();
      break;
    default:
      break;
  }
}

// 加载选项（需要扩展 vehicle 和 garbageType 等）
async function loadOptions() {
  try {
    const [
      areaOptionsRes,
      userOptionsRes,
      statusOptionsRes,
      equipOptionsRes,
    ] = await Promise.all([
      getAreaOptions(),
      getUserOptions(),
      getOperationStatusOptions(),
      getEquipmentOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    };

    loadedOptions.area = extractData(areaOptionsRes);
    loadedOptions.user = extractData(userOptionsRes);
    loadedOptions.operationStatus = extractData(statusOptionsRes);
    loadedOptions.equipment = extractData(equipOptionsRes);

    // 为了示例，模拟 vehicle 和 garbageType 选项（实际应从后端获取）
    loadedOptions.vehicle = [
      {value: '1', label: '车辆A'},
      {value: '2', label: '车辆B'},
    ];
    loadedOptions.garbageType = [
      {value: '1', label: '生活垃圾'},
      {value: '2', label: '厨余垃圾'},
    ];
    loadedOptions.alarmType = [
      {value: '1', label: '设备故障'},
      {value: '2', label: '环境超标'},
    ];

    await editFormApi.updateSchema([
      {fieldName: 'areaCode', componentProps: {options: loadedOptions.area}},
      {fieldName: 'managerId', componentProps: {options: loadedOptions.user}},
      {fieldName: 'operationStatusId', componentProps: {options: loadedOptions.operationStatus}},
      {fieldName: 'equipmentIds', componentProps: {options: loadedOptions.equipment}},
    ]);

    await searchFormApi.updateSchema([
      {fieldName: 'areaCode', componentProps: {options: loadedOptions.area}},
      {fieldName: 'operationStatusId', componentProps: {options: loadedOptions.operationStatus}},
      {fieldName: 'managerId', componentProps: {options: loadedOptions.user}},
    ]);

    console.log('所有选项加载成功');
  } catch (error) {
    console.error('加载选项失败', error);
    ElMessage.error('加载选项失败，请刷新重试');
  }
}

onMounted(async () => {
  await loadOptions();
  handleRefresh();
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑抽屉 -->
    <EditDrawer :title="getTitle">
      <EditForm/>
    </EditDrawer>

    <!-- 详情抽屉 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj"/>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <SearchForm/>
    </SearchDrawer>

    <!-- 新增功能抽屉 -->
    <BatchReserveDrawer title="批量预约">
      <BatchReserveForm/>
    </BatchReserveDrawer>
    <BatchArchiveDrawer title="批量归档">
      <BatchArchiveForm/>
    </BatchArchiveDrawer>
    <ReserveNumberDrawer title="预约排号">
      <ReserveNumberForm/>
    </ReserveNumberDrawer>
    <ConfirmEntryDrawer title="确认进站">
      <ConfirmEntryForm/>
    </ConfirmEntryDrawer>
    <CancelReserveDrawer title="取消预约">
      <CancelReserveForm/>
    </CancelReserveDrawer>
    <RealTimeMonitorDrawer title="实时监控">
      <div style="padding: 20px; text-align: center;">实时监控数据展示</div>
    </RealTimeMonitorDrawer>
    <PauseOperationDrawer title="暂停作业">
      <PauseOperationForm/>
    </PauseOperationDrawer>
    <ReportAlarmDrawer title="上报预警">
      <ReportAlarmForm/>
    </ReportAlarmDrawer>
    <HandleAlarmDrawer title="处理预警">
      <HandleAlarmForm/>
    </HandleAlarmDrawer>
    <AssignPersonDrawer title="指派人员">
      <AssignPersonForm/>
    </AssignPersonDrawer>
    <ReleaseAlarmDrawer title="解除预警">
      <ReleaseAlarmForm/>
    </ReleaseAlarmDrawer>
    <AssignMaintenanceDrawer title="指派维护">
      <AssignMaintenanceForm/>
    </AssignMaintenanceDrawer>
    <MaintenanceProcessDrawer title="维护处理">
      <MaintenanceProcessForm/>
    </MaintenanceProcessDrawer>
    <AcceptMaintenanceDrawer title="验收维护">
      <AcceptMaintenanceForm/>
    </AcceptMaintenanceDrawer>
    <TransferArchiveDrawer title="转运归档">
      <TransferArchiveForm/>
    </TransferArchiveDrawer>
    <ReReserveDrawer title="重新预约">
      <ReReserveForm/>
    </ReReserveDrawer>
    <ReuseProfileDrawer title="复用建档信息">
      <ReuseProfileForm/>
    </ReuseProfileDrawer>

    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 全部标签页：新增按钮 -->
          <IconButton v-if="activeName === '全部'" content="新增" icon-name="Plus"
                      @click="handleCreate"/>
          <!-- 批量预约和批量归档按钮（全部标签页） -->
          <IconButton v-if="activeName === '全部'" content="批量预约" icon-name="DocumentAdd"
                      @click="batchReserveDrawerApi.open"/>
          <IconButton v-if="activeName === '全部'" content="批量归档" icon-name="FolderOpened"
                      @click="batchArchiveDrawerApi.open"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow"/>
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton
            :content="showChart ? '隐藏图表' : '显示图表'"
            icon-name="PieChart"
            @click="toggleChart"
          />
        </div>
      </template>

      <!-- 钻取列自定义渲染 -->
      <template #name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{
            row.name || row.toiletName
          }}
        </el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleFilterTagClick('areaCode', row.areaCode)" type="primary">
          {{ row.areaName || row.area }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text @click="handleFilterTagClick('operationStatusId', row.operationStatusId)"
                 type="primary">
          {{ row.operationStatusName || row.status }}
        </el-text>
      </template>
      <template #progressStatus="{ row }">
        <el-text @click="handleFilterTagClick('progressStatus', row.progressStatus)" type="primary">
          {{ row.progressStatus || '-' }}
        </el-text>
      </template>

      <!-- 其他状态钻取插槽（原样保留） -->
      <template #reserveId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.reserveId }}</el-text>
      </template>
      <template #licensePlate="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.licensePlate }}</el-text>
      </template>
      <template #garbageType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.garbageType }}</el-text>
      </template>
      <template #operationId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.operationId }}</el-text>
      </template>
      <template #alarmId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.alarmId }}</el-text>
      </template>
      <template #alarmType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.alarmType }}</el-text>
      </template>
      <template #transferName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.transferName }}</el-text>
      </template>
      <template #maintenanceId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.maintenanceId }}</el-text>
      </template>
      <template #equipmentName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.equipmentName }}</el-text>
      </template>
      <template #taskType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.taskType }}</el-text>
      </template>
      <template #photoUrl="{ row }">
        <a v-if="row.photoUrl" :href="row.photoUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>
      <template #proofUrl="{ row }">
        <a v-if="row.proofUrl" :href="row.proofUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮始终显示 -->
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>

          <!-- 全部标签页：根据流程状态显示不同按钮 -->
          <template v-if="activeName === '全部'">
            <template v-if="row.progressStatus === '车辆待进站'">
              <IconButton content="预约排号" icon-name="Sort"
                          @click="handleRowAction(row, 'reserveNumber')"/>
              <IconButton content="确认进站" icon-name="Check"
                          @click="handleRowAction(row, 'confirmEntry')"/>
              <IconButton content="取消预约" icon-name="Close"
                          @click="handleRowAction(row, 'cancelReserve')"/>
            </template>
            <template v-else-if="row.progressStatus === '作业进行中'">
              <IconButton content="实时监控" icon-name="Monitor"
                          @click="handleRowAction(row, 'realTimeMonitor')"/>
              <IconButton content="暂停作业" icon-name="VideoPause"
                          @click="handleRowAction(row, 'pauseOperation')"/>
              <IconButton content="上报预警" icon-name="Warning"
                          @click="handleRowAction(row, 'reportAlarm')"/>
            </template>
            <template v-else-if="row.progressStatus === '预警待处理'">
              <IconButton content="处理预警" icon-name="Setting"
                          @click="handleRowAction(row, 'handleAlarm')"/>
              <IconButton content="指派人员" icon-name="User"
                          @click="handleRowAction(row, 'assignPerson')"/>
              <IconButton content="解除预警" icon-name="SuccessFilled"
                          @click="handleRowAction(row, 'releaseAlarm')"/>
            </template>
            <template v-else-if="row.progressStatus === '设备待维护'">
              <IconButton content="指派维护" icon-name="Tools"
                          @click="handleRowAction(row, 'assignMaintenance')"/>
              <IconButton content="维护处理" icon-name="Edit"
                          @click="handleRowAction(row, 'maintenanceProcess')"/>
              <IconButton content="验收维护" icon-name="Finished"
                          @click="handleRowAction(row, 'acceptMaintenance')"/>
            </template>
            <template v-else-if="row.progressStatus === '已完成'">
              <IconButton content="转运归档" icon-name="FolderOpened"
                          @click="handleRowAction(row, 'transferArchive')"/>
              <IconButton content="导出作业记录" icon-name="download"
                          @click="handleRowAction(row, 'exportRecord')"/>
              <IconButton content="重新预约" icon-name="Refresh"
                          @click="handleRowAction(row, 'reReserve')"/>
            </template>
            <template v-else-if="row.progressStatus === '已归档'">
              <IconButton content="复用建档信息" icon-name="CopyDocument"
                          @click="handleRowAction(row, 'reuseProfile')"/>
              <IconButton content="删除归档" icon-name="delete" color="#F56C6C"
                          @click="handleDelete(row)"/>
            </template>

<!--            <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)"/>-->
          </template>

          <!-- 其他标签页：显示处理按钮（原样保留） -->
          <template v-else>
            <IconButton content="处理" icon-name="Checked" @click="handleProcess(row)"/>
          </template>
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow"/>
            <ArrowUp v-else/>
          </el-icon>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <div v-if="dataObj.totalShow && showChart && activeName !== '全部'"
               class="bottom-chart-wrapper">
            <Chart2 :active-name="activeName" :data-list="dataObj.list"/>
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
:deep(.common-toolbar-tools) {
  .el-button.is-disabled {
    opacity: 0.6;
  }
}
</style>
