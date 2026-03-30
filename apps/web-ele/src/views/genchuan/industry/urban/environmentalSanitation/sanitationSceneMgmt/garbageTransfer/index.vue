<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {confirm, useVbenDrawer, useVbenModal} from '@vben/common-ui';
import {ElLoading, ElMessage} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {$t} from '#/locales';
import {exportToExcel} from '#/utils/excel.js';
import ParkDetailDrawer from './components/detail.vue';
import Chart2 from './components/chart2.vue';
// 导入原有模拟数据（用于非“全部”标签页）
import {
  createGarbageTransfer,
  createTransferAlarm,
  dataList,
  deleteGarbageTransfer,
  exportGarbageTransferExcel,
  getGarbageTransferPage,
  getTransferAlarmDetail,
  getTransferMaintenanceDetail,
  getTransferOperationDetail,
  getTransferReserveDetail,
  relieveTransferAlarm,
  updateGarbageTransfer,
  updateTransferAlarm,
  cancelTransferReserve,
  updateTransferMaintenance,
  pauseTransferOperation,
  reviewTransferMaintenance,
  sortTransferReserve,
  batchSortTransferReserve,
  startTransferOperation,
  confirmTransferReserve,
  completeTransferOperation,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/data.js';

import {
  getAlarmTypeOptions,
  getAreaOptions,
  getColumnsByStatus,
  getEquipmentOptions,
  getGarbageTypeOptions,
  getHandleStatusOptions,
  getOperationStatusOptions,
  getUserOptions,
  getVehicleOptions,
  textObj,
  useAcceptMaintenanceSchema,
  useAssignMaintenanceSchema,
  useAssignPersonSchema,
  useBatchArchiveSchema,
  useConfirmEntrySchema,
  useGarbageTransferFormSchema,
  useGarbageTransferSearchSchema,
  useMaintenanceProcessSchema,
  usePauseOperationSchema,
  useReportAlarmSchema,
  useReReserveSchema,
  useReuseProfileSchema,
  useTransferArchiveSchema,
  useBatchReserveNumberSchema,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/form.js';

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
const emit = defineEmits(['arrow-change']);

// ---------- 状态与数据 ----------
const activeName = ref('全部');
const tabsData = ref([
  {label: '全部'},
  {label: '车辆待进站'},
  {label: '作业进行中'},
  {label: '预警待处理'},
  {label: '设备待维护'},
  {label: '已完成'},
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
  alarmList: [],
  reserveList: [],
  maintenanceList: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});

const checkedIds = ref([]);
const checkedReserveIds = ref([]);

const loadedOptions = reactive({
  area: [],
  user: [],
  operationStatus: [],
  equipment: [],
  vehicle: [],
  garbageType: [],
  alarmType: [],
  handleStatus: [],
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
// 批量预约排号（原批量预约改为批量排号）
const [BatchReserveNumberForm, batchReserveNumberFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useBatchReserveNumberSchema(),
  showDefaultActions: false,
});
const [BatchReserveNumberModal, batchReserveNumberModalApi] = useVbenModal({
  title: '批量预约排号',
  onCancel: () => batchReserveNumberModalApi.close(),
  async onConfirm() {
    const formValues = await batchReserveNumberFormApi.getValues();
    const data = batchReserveNumberModalApi.getData();
    const ids = data?.ids;
    if (!ids || ids.length === 0) {
      ElMessage.error('请选择需要排号的预约记录');
      return;
    }
    try {
      await batchSortTransferReserve({
        ids,
        sortType: formValues.sortType,
      });
      ElMessage.success('批量排号成功');
      handleRefresh();
      batchReserveNumberModalApi.close();
    } catch (error) {
      console.error('批量排号失败', error);
      ElMessage.error('批量排号失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await batchReserveNumberFormApi.resetForm();
      // 设置默认排序方式
      await batchReserveNumberFormApi.setValues({sortType: 'EXPECTED_TIME'});
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

// 确认进站
const [ConfirmEntryForm, confirmEntryFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useConfirmEntrySchema(),
  showDefaultActions: false,
});
const [ConfirmEntryModal, confirmEntryModalApi] = useVbenModal({
  title: '确认进站',
  onCancel: () => confirmEntryModalApi.close(),
  async onConfirm() {
    const formValues = await confirmEntryFormApi.getValues();
    const rowData = confirmEntryModalApi.getData();

    if (!rowData || !rowData.reserveId || !rowData.id) {
      ElMessage.error('缺少必要参数，请重试');
      return;
    }

    try {
      await updateTransferReserve({
        id: rowData.id,
        reserveId: rowData.reserveId,
        reserveStatus: '已进站',
        expectedTime: formValues.entryTime,
      });
      ElMessage.success('确认进站成功');
      handleRefresh();
      confirmEntryModalApi.close();
    } catch (error) {
      console.error('确认进站失败', error);
      ElMessage.error('确认进站失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await confirmEntryFormApi.resetForm();
      await confirmEntryFormApi.setValues({entryTime: Date.now()});
    }
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

// 暂停作业（已改为确认框，但保留抽屉以防其他地方使用，实际不再使用）
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
    ElMessage.info('暂停作业功能已改用确认框');
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
    const row = reportAlarmDrawerApi.getData();
    if (!row || !row.transferId) {
      ElMessage.error('缺少转运站信息，请重试');
      return;
    }
    try {
      await createTransferAlarm({
        transferId: row.transferId,
        alarmTypeId: formValues.alarmTypeId,
        alarmContent: formValues.alarmContent,
        relevantInfo: formValues.relevantInfo,
      });
      ElMessage.success('上报预警成功');
      handleRefresh();
      reportAlarmDrawerApi.close();
    } catch (error) {
      console.error('上报预警失败', error);
      ElMessage.error('上报预警失败，请重试');
    }
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

// 指派人员
const [AssignPersonForm, assignPersonFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useAssignPersonSchema(),
  showDefaultActions: false,
});

const [AssignPersonModal, assignPersonModalApi] = useVbenModal({
  title: '指派人员',
  onCancel: () => assignPersonModalApi.close(),
  async onConfirm() {
    const formValues = await assignPersonFormApi.getValues();
    const row = assignPersonModalApi.getData(); // 获取行数据

    if (!row || !row.alarmId || !row.transferId) {
      ElMessage.error('缺少必要参数，请重试');
      return;
    }

    try {
      await updateTransferAlarm({
        id: row.alarmId,           // 预警自增主键
        transferId: row.transferId,
        handleBy: formValues.handleBy, // 使用 handleBy 字段
      });
      ElMessage.success('指派成功');
      handleRefresh();
      assignPersonModalApi.close();
    } catch (error) {
      console.error('指派人员失败', error);
      ElMessage.error('指派人员失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await assignPersonFormApi.resetForm();
      // 更新人员选项（从 loadedOptions.user 获取）
      await assignPersonFormApi.updateSchema([
        { fieldName: 'handleBy', componentProps: { options: loadedOptions.user } },
      ]);
    }
  },
});

// 指派维护
const [AssignMaintenanceForm, assignMaintenanceFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useAssignMaintenanceSchema(),
  showDefaultActions: false,
});
const [AssignMaintenanceModal, assignMaintenanceModalApi] = useVbenModal({
  title: '指派维护',
  onCancel: () => assignMaintenanceModalApi.close(),
  async onConfirm() {
    const formValues = await assignMaintenanceFormApi.getValues();
    const row = assignMaintenanceModalApi.getData();

    if (!row || !row.transferId) {
      ElMessage.error('缺少转运站信息，请重试');
      return;
    }

    const params = {
      transferId: row.transferId,
      equipmentId: row.equipmentId,
      handleBy: formValues.repairBy,
      expectedCompleteTime: formValues.expectedCompleteTime,
      maintenanceStatus: '待维护',
    };

    if (row.maintenanceId) {
      params.id = row.id;
      params.maintenanceId = row.maintenanceId;
    }

    const formatTimestamp = (timestamp) => {
      return timestamp ? new Date(timestamp).toISOString() : null;
    };
    params.expectedCompleteTime = formatTimestamp(params.expectedCompleteTime);

    try {
      await updateTransferMaintenance(params);
      ElMessage.success('指派成功');
      handleRefresh();
      assignMaintenanceModalApi.close();
    } catch (error) {
      console.error('指派失败', error);
      ElMessage.error('指派失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const row = assignMaintenanceModalApi.getData();
      await assignMaintenanceFormApi.resetForm();
      await assignMaintenanceFormApi.updateSchema([
        {fieldName: 'repairBy', componentProps: {options: loadedOptions.user}},
      ]);

      if (row && row.maintenanceId) {
        try {
          const res = await getTransferMaintenanceDetail({id: row.maintenanceId});
          const detail = res.list?.[0] || res.data?.list?.[0];
          if (detail) {
            await assignMaintenanceFormApi.setValues({
              repairBy: detail.handleBy,
              expectedCompleteTime: detail.expectedCompleteTime,
            });
            row.id = detail.id;
            row.maintenanceId = detail.maintenanceId;
          }
        } catch (error) {
          console.error('获取维护详情失败', error);
        }
      } else {
        await assignMaintenanceFormApi.setValues({
          expectedCompleteTime: Date.now() + 7 * 24 * 3600 * 1000,
        });
      }
    }
  },
});

// 维护处理
const currentMaintenance = reactive({
  id: null,
  maintenanceId: null,
  transferId: null,
  equipmentId: null,
});
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
  async onOpenChange(isOpen) {
    if (isOpen) {
      const row = maintenanceProcessDrawerApi.getData();
      await maintenanceProcessFormApi.resetForm();
      await maintenanceProcessFormApi.updateSchema([
        {fieldName: 'equipmentId', componentProps: {options: loadedOptions.equipment}},
      ]);

      currentMaintenance.id = null;
      currentMaintenance.maintenanceId = null;
      currentMaintenance.transferId = row.transferId;
      currentMaintenance.equipmentId = row.equipmentId;

      if (row && row.maintenanceId) {
        try {
          const res = await getTransferMaintenanceDetail({id: row.maintenanceId});
          const detail = res.list?.[0] || res.data?.list?.[0];
          if (detail) {
            currentMaintenance.id = detail.id;
            currentMaintenance.maintenanceId = detail.maintenanceId;

            await maintenanceProcessFormApi.setValues({
              equipmentId: detail.equipmentId,
              maintenanceContent: detail.maintenanceContent,
              maintenanceStatus: detail.maintenanceStatus,
              maintenanceTime: detail.maintenanceTime,
              replaceParts: detail.replaceParts,
              maintenanceCost: detail.maintenanceCost,
              abnormalIsTimeout: detail.abnormalIsTimeout,
            });
          }
        } catch (error) {
          console.error('获取维护详情失败', error);
        }
      } else {
        await maintenanceProcessFormApi.setValues({
          maintenanceStatus: '维护中',
        });
      }
    }
  },
  async onConfirm() {
    const formValues = await maintenanceProcessFormApi.getValues();

    if (!currentMaintenance.transferId) {
      ElMessage.error('缺少转运站信息，请重试');
      return;
    }

    const params = {
      transferId: currentMaintenance.transferId,
      equipmentId: formValues.equipmentId,
      maintenanceContent: formValues.maintenanceContent,
      maintenanceStatus: formValues.maintenanceStatus,
      maintenanceTime: formValues.maintenanceTime,
      replaceParts: formValues.replaceParts,
      maintenanceCost: formValues.maintenanceCost,
      abnormalIsTimeout: formValues.abnormalIsTimeout,
    };

    if (currentMaintenance.maintenanceId) {
      params.id = currentMaintenance.id;
      params.maintenanceId = currentMaintenance.maintenanceId;
    }

    const formatTimestamp = (timestamp) => {
      return timestamp ? new Date(timestamp).toISOString() : null;
    };
    params.maintenanceTime = formatTimestamp(params.maintenanceTime);

    try {
      await updateTransferMaintenance(params);
      ElMessage.success('保存成功');
      handleRefresh();
      maintenanceProcessDrawerApi.close();
    } catch (error) {
      console.error('保存失败', error);
      ElMessage.error('保存失败，请重试');
    }
  },
});

// 验收维护
const currentAcceptMaintenanceId = ref(null);

const [AcceptMaintenanceForm, acceptMaintenanceFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useAcceptMaintenanceSchema(),
  showDefaultActions: false,
});

const [AcceptMaintenanceModal, acceptMaintenanceModalApi] = useVbenModal({
  title: '验收维护',
  onCancel: () => acceptMaintenanceModalApi.close(),
  async onConfirm() {
    const formValues = await acceptMaintenanceFormApi.getValues();
    if (!currentAcceptMaintenanceId.value) {
      ElMessage.error('维护记录ID缺失，请重新打开');
      return;
    }
    try {
      await reviewTransferMaintenance(currentAcceptMaintenanceId.value, formValues.result);
      ElMessage.success('验收成功');
      handleRefresh();
      acceptMaintenanceModalApi.close();
    } catch (error) {
      console.error('验收失败', error);
      ElMessage.error('验收失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const row = acceptMaintenanceModalApi.getData();
      await acceptMaintenanceFormApi.resetForm();
      currentAcceptMaintenanceId.value = null;

      if (row && row.maintenanceId) {
        try {
          const res = await getTransferMaintenanceDetail({id: row.maintenanceId});
          const detail = res.list?.[0] || res.data?.list?.[0];
          if (detail && detail.id) {
            currentAcceptMaintenanceId.value = detail.id;
          } else {
            ElMessage.error('未找到维护记录详情');
            acceptMaintenanceModalApi.close();
          }
        } catch (error) {
          console.error('获取维护详情失败', error);
          ElMessage.error('获取维护详情失败，请重试');
          acceptMaintenanceModalApi.close();
        }
      } else {
        ElMessage.error('缺少维护记录标识');
        acceptMaintenanceModalApi.close();
      }
    }
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

      // 1. 基础转换（保留所有原始字段）
      let processedList = listData.map(item => {
        const converted = convertGarbageTransferItem(item);
        // 保留关联ID
        if (item.maintenanceId) converted.maintenanceId = item.maintenanceId;
        if (item.reserveId) converted.reserveId = item.reserveId;
        if (item.operationId) converted.operationId = item.operationId;
        // 初始化状态字段
        converted.maintenanceStatus = null;
        converted.reserveStatus = null;
        converted.operationStatus = null;
        converted.operationSelfId = null; // 作业自增主键
        // 设备名称映射
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

      // 2. 并发获取维护状态（设备待维护）
      const rowsWithMaintenance = processedList.filter(row => row.maintenanceId);
      if (rowsWithMaintenance.length) {
        const maintenancePromises = rowsWithMaintenance.map(row =>
          getTransferMaintenanceDetail({ id: row.maintenanceId })
            .then(res => {
              const detail = res.list?.[0] || res.data?.list?.[0];
              return { maintenanceId: row.maintenanceId, detail };
            })
            .catch(error => {
              console.error(`获取维护详情失败 (maintenanceId: ${row.maintenanceId})`, error);
              return { maintenanceId: row.maintenanceId, detail: null };
            })
        );
        const maintenanceResults = await Promise.all(maintenancePromises);
        maintenanceResults.forEach(({ maintenanceId, detail }) => {
          const targetRow = processedList.find(row => row.maintenanceId === maintenanceId);
          if (targetRow && detail) {
            targetRow.maintenanceStatus = detail.maintenanceStatus;
          }
        });
      }

      // 3. 并发获取预约状态（车辆待进站）
      const rowsWithReserve = processedList.filter(row => row.reserveId);
      if (rowsWithReserve.length) {
        const reservePromises = rowsWithReserve.map(row =>
          getTransferReserveDetail({ id: row.reserveId })
            .then(res => {
              const detail = res.list?.[0] || res.data?.list?.[0];
              return { reserveId: row.reserveId, detail };
            })
            .catch(error => {
              console.error(`获取预约详情失败 (reserveId: ${row.reserveId})`, error);
              return { reserveId: row.reserveId, detail: null };
            })
        );
        const reserveResults = await Promise.all(reservePromises);
        reserveResults.forEach(({ reserveId, detail }) => {
          const targetRow = processedList.find(row => row.reserveId === reserveId);
          if (targetRow && detail) {
            targetRow.reserveStatus = detail.reserveStatus;
          }
        });
      }

      // 4. 并发获取作业状态（作业进行中）
      const rowsWithOperation = processedList.filter(row => row.operationId);
      if (rowsWithOperation.length) {
        const operationPromises = rowsWithOperation.map(row =>
          getTransferOperationDetail({ id: row.operationId })
            .then(res => {
              const detail = res.list?.[0] || res.data?.list?.[0];
              return { operationId: row.operationId, detail };
            })
            .catch(error => {
              console.error(`获取作业详情失败 (operationId: ${row.operationId})`, error);
              return { operationId: row.operationId, detail: null };
            })
        );
        const operationResults = await Promise.all(operationPromises);
        operationResults.forEach(({ operationId, detail }) => {
          const targetRow = processedList.find(row => row.operationId === operationId);
          if (targetRow && detail) {
            targetRow.operationStatus = detail.operationStatus;   // 运行/暂停
            targetRow.operationSelfId = detail.id;               // 作业自增主键（用于启停接口）
          }
        });
      }

      dataObj.list = processedList;
      return dataObj;
    } catch (error) {
      console.error('获取数据失败', error);
      ElMessage.error('数据加载失败，请重试');
      dataObj.total = 0;
      dataObj.list = [];
      return dataObj;
    }
  } else {
    // 非全部标签页的模拟逻辑保持不变
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
      checkedReserveIds.value = records.map(item => item.reserveId).filter(id => id);
    },
    checkboxChange: ({records}) => {
      checkedIds.value = records.map(item => item.id);
      checkedReserveIds.value = records.map(item => item.reserveId).filter(id => id);
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

// ---------- 详情数据转换函数 ----------
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
    expectedTime: data.expectedTime ? new Date(data.expectedTime).toLocaleString() : '-',
    createTime: data.createTime ? new Date(data.createTime).toLocaleString() : '-',
    updateTime: data.updateTime ? new Date(data.updateTime).toLocaleString() : '-',
  };
}

function transformOperationData(data, status) {
  if (!data) return null;

  let equipmentStatusObj = {};
  if (data.equipmentStatus && typeof data.equipmentStatus === 'string') {
    try {
      equipmentStatusObj = JSON.parse(data.equipmentStatus);
    } catch (e) {
    }
  }

  const mappedEquipmentStatus = {};
  if (loadedOptions.equipment && loadedOptions.equipment.length) {
    Object.entries(equipmentStatusObj).forEach(([deviceId, status]) => {
      const found = loadedOptions.equipment.find(opt => opt.value === deviceId);
      const deviceName = found ? found.label : deviceId;
      mappedEquipmentStatus[deviceName] = status;
    });
  } else {
    Object.assign(mappedEquipmentStatus, equipmentStatusObj);
  }

  return {
    ...data,
    licensePlate: data.vehicleName,
    garbageType: data.garbageTypeName,
    relatedPoints: data.pointsName?.join('、') || '-',
    equipmentStatus: mappedEquipmentStatus,
    status: status,
    progressStatus: status,
    entryTime: data.entryTime ? new Date(data.entryTime).toLocaleString() : '-',
    createTime: data.createTime ? new Date(data.createTime).toLocaleString() : '-',
    updateTime: data.updateTime ? new Date(data.updateTime).toLocaleString() : '-',
  };
}

function transformAlarmData(data) {
  if (!data) return null;
  return {
    ...data,
    transferName: data.transferName,
    alarmType: data.alarmTypeName,
    handler: data.handleName,
    status: '预警待处理',
    progressStatus: '预警待处理',
    alarmTime: data.alarmTime ? new Date(data.alarmTime).toLocaleString() : '-',
    createTime: data.createTime ? new Date(data.createTime).toLocaleString() : '-',
    updateTime: data.updateTime ? new Date(data.updateTime).toLocaleString() : '-',
  };
}

function transformMaintenanceData(data) {
  if (!data) return null;

  let equipmentName = data.equipmentName;
  if (equipmentName && loadedOptions.equipment.length) {
    const found = loadedOptions.equipment.find(opt => opt.value === equipmentName);
    if (found) equipmentName = found.label;
  }

  return {
    ...data,
    transferName: data.transferName,
    equipmentName: equipmentName,
    handler: data.handleName,
    status: '设备待维护',
    progressStatus: '设备待维护',
    lastMaintenanceTime: data.lastMaintenanceTime ? new Date(data.lastMaintenanceTime).toLocaleString() : '-',
    expectedCompleteTime: data.expectedCompleteTime ? new Date(data.expectedCompleteTime).toLocaleString() : '-',
    createTime: data.createTime ? new Date(data.createTime).toLocaleString() : '-',
    updateTime: data.updateTime ? new Date(data.updateTime).toLocaleString() : '-',
  };
}

const parkDetailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  const loading = ElLoading.service({ text: '加载详情中...' });
  try {
    let detailData = null;
    dataObj.alarmList = [];
    dataObj.reserveList = [];
    dataObj.maintenanceList = [];

    if (activeName.value === '全部') {
      const progressStatus = row.progressStatus;

      // 车辆待进站
      if (progressStatus === '车辆待进站') {
        const res = await getTransferReserveDetail({ transferId: row.transferId });
        dataObj.reserveList = res.data?.list || res.list || [];
        dataObj.detailObj = { ...row, progressStatus: '车辆待进站' };
        parkDetailDrawerRef.value?.open();
        loading.close();
        return;
      }
      // 预警待处理
      else if (progressStatus === '预警待处理') {
        const res = await getTransferAlarmDetail({ transferId: row.transferId });
        dataObj.alarmList = res.data?.list || res.list || [];
        dataObj.detailObj = { ...row, progressStatus: '预警待处理' };
        parkDetailDrawerRef.value?.open();
        loading.close();
        return;
      }
      // 作业进行中 / 已完成 / 已归档
      else if (['作业进行中', '已完成', '已归档'].includes(progressStatus) && row.operationId) {
        const res = await getTransferOperationDetail({ id: row.operationId });
        const rawData = res.list?.[0] || res.data?.list?.[0];
        detailData = transformOperationData(rawData, progressStatus);
      }
      // 设备待维护
      else if (progressStatus === '设备待维护') {
        const res = await getTransferMaintenanceDetail({ transferId: row.transferId });
        dataObj.maintenanceList = res.data?.list || res.list || [];
        dataObj.detailObj = { ...row, progressStatus: '设备待维护' };
        parkDetailDrawerRef.value?.open();
        loading.close();
        return;
      }
      else {
        detailData = row;
      }
    } else {
      detailData = row;
    }

    if (detailData) {
      dataObj.detailObj = detailData;
      parkDetailDrawerRef.value?.open();
    } else {
      ElMessage.error('未获取到详情数据');
    }
  } catch (error) {
    console.error('❌ 获取详情失败:', error);
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
  switch (action) {
    case 'reserveNumber':
      confirm({
        title: '预约排号',
        content: '确定要对该预约进行排号吗？',
      }).then(async () => {
        if (!row.id) {
          ElMessage.error('缺少预约记录标识');
          return;
        }
        try {
          await sortTransferReserve({ id: row.id });
          ElMessage.success('排号成功');
          handleRefresh();
        } catch (error) {
          console.error('排号失败', error);
          ElMessage.error('排号失败，请重试');
        }
      }).catch(() => {
        // 用户取消，不做任何操作
      });
      break;
    case 'confirmEntry':
      confirm({
        title: '确认进站',
        content: '确定要确认进站吗？',
      }).then(async () => {
        if (!row.reserveId) {
          ElMessage.error('缺少预约记录标识，请重试');
          return;
        }
        try {
          await confirmTransferReserve({ id: row.reserveId });
          ElMessage.success('确认进站成功');
          handleRefresh();
        } catch (error) {
          console.error('确认进站失败', error);
          ElMessage.error('确认进站失败，请重试');
        }
      }).catch(() => {
        // 用户取消，无需额外操作
      });
      break;
    case 'cancelReserve':
      confirm({
        title: '确认取消预约',
        content: '确定要取消预约吗？',
      }).then(async () => {
        if (!row.reserveId) {
          ElMessage.error('缺少预约记录标识，请重试');
          return;
        }
        try {
          await cancelTransferReserve(row.reserveId);
          ElMessage.success('取消预约成功');
          handleRefresh();
        } catch (error) {
          console.error('取消预约失败', error);
          ElMessage.error('取消预约失败，请重试');
        }
      });
      break;
    case 'realTimeMonitor':
      realTimeMonitorDrawerApi.open();
      break;
    case 'pauseOperation':
      confirm({
        title: '确认暂停作业',
        content: '确定要暂停当前作业吗？暂停后作业将无法继续，请谨慎操作。',
      }).then(async () => {
        try {
          // 使用作业自增主键
          await pauseTransferOperation(row.operationSelfId, 'uuid-plan-status-004');
          ElMessage.success('作业已暂停');
          handleRefresh();
        } catch (error) {
          console.error('暂停作业失败', error);
          ElMessage.error('暂停作业失败，请重试');
        }
      }).catch(() => {});
      break;
    case 'resumeOperation':
      confirm({
        title: '确认启动作业',
        content: '确定要恢复该作业吗？',
      }).then(async () => {
        try {
          // 使用作业自增主键
          await startTransferOperation(row.operationSelfId);
          ElMessage.success('作业已启动');
          handleRefresh();
        } catch (error) {
          console.error('启动作业失败', error);
          ElMessage.error('启动作业失败，请重试');
        }
      });
      break;
    case 'reportAlarm':
      reportAlarmDrawerApi.setData(row).open();
      break;
    case 'handleAlarm':
      confirm({
        title: '确认处理预警',
        content: '确定要将此预警标记为“处理中”吗？',
      }).then(async () => {
        if (!row.alarmId || !row.transferId) {
          ElMessage.error('缺少必要参数，请重试');
          return;
        }
        try {
          await updateTransferAlarm({
            id: row.alarmId,
            transferId: row.transferId,
            handleStatus: '处理中',
          });
          ElMessage.success('处理成功');
          handleRefresh();
        } catch (error) {
          console.error('处理预警失败', error);
          ElMessage.error('处理预警失败，请重试');
        }
      });
      break;
    case 'assignPerson':
      assignPersonModalApi.setData(row).open();
      break;
    case 'releaseAlarm':
      confirm({
        title: '确认解除预警',
        content: '确定要解除此预警吗？',
      }).then(async () => {
        if (!row.alarmId) {
          ElMessage.error('缺少预警信息，请重试');
          return;
        }
        try {
          await relieveTransferAlarm(row.alarmId);
          ElMessage.success('解除预警成功');
          handleRefresh();
        } catch (error) {
          console.error('解除预警失败', error);
          ElMessage.error('解除预警失败，请重试');
        }
      });
      break;
    case 'assignMaintenance':
      assignMaintenanceModalApi.setData(row).open();
      break;
    case 'maintenanceProcess':
      maintenanceProcessDrawerApi.setData(row).open();
      break;
    case 'acceptMaintenance':
      acceptMaintenanceModalApi.setData(row).open();
      break;
    case 'transferArchive':
      confirm({
        title: '确认转运归档',
        content: '确定要将该作业归档吗？归档后不可恢复。',
      }).then(async () => {
        if (!row.operationId) {
          ElMessage.error('缺少作业ID，无法归档');
          return;
        }
        try {
          await completeTransferOperation(row.operationId);
          ElMessage.success('转运归档成功');
          handleRefresh();
        } catch (error) {
          console.error('转运归档失败', error);
          ElMessage.error('转运归档失败，请重试');
        }
      });
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

async function loadOptions() {
  try {
    const [
      areaOptionsRes,
      userOptionsRes,
      statusOptionsRes,
      equipOptionsRes,
      vehicleOptionsRes,
      garbageTypeOptionsRes,
      alarmTypeOptionsRes,
      handleStatusOptionsRes,
    ] = await Promise.all([
      getAreaOptions(),
      getUserOptions(),
      getOperationStatusOptions(),
      getEquipmentOptions(),
      getVehicleOptions(),
      getGarbageTypeOptions(),
      getAlarmTypeOptions(),
      getHandleStatusOptions(),
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
    loadedOptions.vehicle = extractData(vehicleOptionsRes);
    loadedOptions.garbageType = extractData(garbageTypeOptionsRes);
    loadedOptions.alarmType = extractData(alarmTypeOptionsRes);
    loadedOptions.handleStatus = extractData(handleStatusOptionsRes);

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
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      :alarm-list="dataObj.alarmList"
      :reserve-list="dataObj.reserveList"
      :maintenance-list="dataObj.maintenanceList"
    />

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <SearchForm/>
    </SearchDrawer>

    <!-- 新增功能抽屉 -->
    <BatchReserveNumberModal title="批量预约排号">
      <BatchReserveNumberForm/>
    </BatchReserveNumberModal>
    <BatchArchiveDrawer title="批量归档">
      <BatchArchiveForm/>
    </BatchArchiveDrawer>
    <ConfirmEntryModal title="确认进站">
      <ConfirmEntryForm/>
    </ConfirmEntryModal>
    <RealTimeMonitorDrawer title="实时监控">
      <div style="padding: 20px; text-align: center;">实时监控数据展示</div>
    </RealTimeMonitorDrawer>
    <PauseOperationDrawer title="暂停作业">
      <PauseOperationForm/>
    </PauseOperationDrawer>
    <ReportAlarmDrawer title="上报预警">
      <ReportAlarmForm/>
    </ReportAlarmDrawer>
    <AssignPersonModal title="指派人员">
      <AssignPersonForm/>
    </AssignPersonModal>
    <AssignMaintenanceModal title="指派维护">
      <AssignMaintenanceForm/>
    </AssignMaintenanceModal>
    <MaintenanceProcessDrawer title="维护处理">
      <MaintenanceProcessForm/>
    </MaintenanceProcessDrawer>
    <AcceptMaintenanceModal title="验收维护">
      <AcceptMaintenanceForm/>
    </AcceptMaintenanceModal>
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
          <IconButton v-if="activeName === '全部'" content="批量预约排号" icon-name="Sort"
                      @click="batchReserveNumberModalApi.setData({ ids: checkedReserveIds.value }).open()"/>
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

      <!-- 其他状态钻取插槽 -->
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
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>

          <template v-if="activeName === '全部'">
            <template v-if="row.progressStatus === '车辆待进站'">
              <IconButton
                content="预约排号"
                icon-name="Sort"
                :disabled="row.reserveStatus !== '待排序'"
                @click="handleRowAction(row, 'reserveNumber')"
              />
              <IconButton content="确认进站" icon-name="Check"
                          @click="handleRowAction(row, 'confirmEntry')"/>
              <IconButton content="取消预约" icon-name="Close"
                          @click="handleRowAction(row, 'cancelReserve')"/>
            </template>
            <template v-else-if="row.progressStatus === '作业进行中'">
              <IconButton content="实时监控" icon-name="Monitor"
                          @click="handleRowAction(row, 'realTimeMonitor')"/>
              <!-- 根据作业状态显示不同按钮 -->
              <template v-if="row.operationStatus === '运行'">
                <IconButton content="暂停作业" icon-name="VideoPause"
                            @click="handleRowAction(row, 'pauseOperation')"/>
              </template>
              <template v-else-if="row.operationStatus === '暂停'">
                <IconButton content="启动作业" icon-name="VideoPlay"
                            @click="handleRowAction(row, 'resumeOperation')"/>
              </template>
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
                          :disabled="row.maintenanceStatus !== '维护中'"
                          @click="handleRowAction(row, 'acceptMaintenance')"/>
            </template>
            <template v-else-if="row.progressStatus === '已完成'">
              <IconButton
                content="转运归档"
                icon-name="FolderOpened"
                :disabled="row.operationStatus === '归档'"
                @click="handleRowAction(row, 'transferArchive')"
              />
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
          </template>

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
