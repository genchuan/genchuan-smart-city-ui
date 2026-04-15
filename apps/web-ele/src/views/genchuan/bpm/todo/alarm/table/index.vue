<!-- index.vue -->
<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElButton, ElDialog } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form.js';
import { useVbenVxeGrid } from '#/adapter/vxe-table.js';
import { $t } from '#/locales/index.js';
import { exportToExcel } from '#/utils/excel.js';
// 引入预警详情抽屉组件
import AlarmDetailDrawer from '#/views/dashboard/todo/alarm/table/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns } from './data.js';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['arrow-change']);
const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 创建处置操作抽屉
const [DisposeDrawer, disposeDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    disposeDrawerApi.close();
  },
  onConfirm() {
    handleSubmitDispose();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      disposeAction.disposeContent = '';
      disposeAction.evidenceFiles = [];
    }
  },
});

// 创建派单操作抽屉
const [AssignDrawer, assignDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    assignDrawerApi.close();
  },
  onConfirm() {
    handleSubmitAssign();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      assignAction.assignee = '';
      assignAction.assignNote = '';
    }
  },
});

// 创建忽略预警抽屉
const [IgnoreDrawer, ignoreDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    ignoreDrawerApi.close();
  },
  onConfirm() {
    handleSubmitIgnore();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      ignoreAction.ignoreReason = '';
    }
  },
});

// 创建批量处置操作抽屉
const [BatchDisposeDrawer, batchDisposeDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    batchDisposeDrawerApi.close();
  },
  onConfirm() {
    handleSubmitBatchDispose();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      batchDisposeAction.disposeContent = '';
    }
  },
});

// 处置相关状态
const disposeAction = reactive({
  title: '处置预警',
  row: null,
  disposeContent: '',
  evidenceFiles: [],
});

// 派单相关状态
const assignAction = reactive({
  title: '派单处理',
  row: null,
  assignee: '',
  assignNote: '',
  assigneeOptions: [
    { label: '张三', value: '张三' },
    { label: '李四', value: '李四' },
    { label: '王五', value: '王五' },
    { label: '赵六', value: '赵六' },
    { label: '孙七', value: '孙七' },
  ]
});

// 忽略相关状态
const ignoreAction = reactive({
  title: '忽略预警',
  row: null,
  ignoreReason: '',
});

// 批量处置相关状态
const batchDisposeAction = reactive({
  title: '批量处置',
  rows: [],
  disposeContent: '',
});

// 更新进展弹窗
const updateDialog = reactive({
  visible: false,
  row: null,
  dealStatus: '',
  progressNote: '',
});

// 验证弹窗
const verifyDialog = reactive({
  visible: false,
  row: null,
  verifyResult: '',
  verifyNote: '',
});

// 备注弹窗
const remarkDialog = reactive({
  visible: false,
  row: null,
  remarkContent: '',
});

// 复盘弹窗
const reviewDialog = reactive({
  visible: false,
  row: null,
  reviewOpinion: '',
});

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      alarmObj.apilist.push(obj);
    } else {
      alarmObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          alarmObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(alarmObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建预警 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑预警 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.alarmId]),
  });
  try {
    alarmObj.apilist = alarmObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.alarmId]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    alarmObj.apilist = alarmObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const alarmObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  alarmObj.totalShow = !alarmObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = alarmObj.apilist;
  if (activeName.value === '待处置') {
    filteredList = alarmObj.apilist.filter(v => v.moduleType === 'pending');
  } else if (activeName.value === '处置中') {
    filteredList = alarmObj.apilist.filter(v => v.moduleType === 'dealing');
  } else if (activeName.value === '已归档') {
    filteredList = alarmObj.apilist.filter(v => v.moduleType === 'archived');
  } else if (activeName.value === '全部预警') {
    filteredList = alarmObj.apilist;
  }

  alarmObj.total = filteredList.length;
  alarmObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return alarmObj;
};

// 动态获取搜索表单配置
const getCurrentFormSchema = () => {
  let moduleType = 'pending';
  if (activeName.value === '待处置') moduleType = 'pending';
  else if (activeName.value === '处置中') moduleType = 'dealing';
  else if (activeName.value === '已归档') moduleType = 'archived';

  return useFormSchema(moduleType);
};

// 定义 activeName 在 getCurrentFormSchema 之后
const activeName = ref('待处置');

// 修改：将 QueryForm 的定义移到 activeName 之后
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: getCurrentFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}

// 动态获取表格列配置
const getCurrentGridColumns = () => {
  let moduleType = 'pending';
  if (activeName.value === '待处置') moduleType = 'pending';
  else if (activeName.value === '处置中') moduleType = 'dealing';
  else if (activeName.value === '已归档') moduleType = 'archived';

  return useGridColumns(moduleType);
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getCurrentGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: alarmObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// 打开详情
const handleOpenDetail = (row) => {
  alarmObj.detailObj = row;
  alarmDetailDrawerRef.value.open();
};

// 处置预警
const handleDispose = (row) => {
  disposeAction.row = row;
  disposeAction.disposeContent = '';
  disposeAction.evidenceFiles = [];
  disposeDrawerApi.open();
};

// 提交处置
const handleSubmitDispose = () => {
  if (!disposeAction.disposeContent) {
    ElMessage.error('处置措施不能为空');
    return;
  }

  if (disposeAction.disposeContent.length > 500) {
    ElMessage.error('处置措施不能超过500字');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '提交处置中...',
  });

  try {
    // 更新预警状态
    const index = alarmObj.apilist.findIndex(v => v.id === disposeAction.row.id);
    if (index !== -1) {
      alarmObj.apilist[index].dealStatus = '处置中';
      alarmObj.apilist[index].currentDealStatus = '处理中';
      alarmObj.apilist[index].dealStartTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      alarmObj.apilist[index].dealProgress = '20%';
      alarmObj.apilist[index].dealLogSummary = disposeAction.disposeContent.length > 50 ? disposeAction.disposeContent.substring(0, 50) + '...' : disposeAction.disposeContent;
      alarmObj.apilist[index].latestDynamic = '已开始处置，处置措施已提交';
      alarmObj.apilist[index].moduleType = 'dealing';
      alarmObj.apilist[index].responsiblePerson = '当前用户'; // 实际项目中应该是当前登录用户

      if (disposeAction.evidenceFiles.length > 0) {
        alarmObj.apilist[index].attachmentCount = disposeAction.evidenceFiles.length;
      }
    }

    ElMessage.success('处置措施提交成功');
    disposeDrawerApi.close();
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 派单处理
const handleAssign = (row) => {
  assignAction.row = row;
  assignAction.assignee = '';
  assignAction.assignNote = '';
  assignDrawerApi.open();
};

// 提交派单
const handleSubmitAssign = () => {
  if (!assignAction.assignee) {
    ElMessage.error('请选择处置人');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '派单中...',
  });

  try {
    // 更新预警状态
    const index = alarmObj.apilist.findIndex(v => v.id === assignAction.row.id);
    if (index !== -1) {
      alarmObj.apilist[index].responsiblePerson = assignAction.assignee;
      alarmObj.apilist[index].dealStatus = '处置中';
      alarmObj.apilist[index].latestDynamic = `已派单给${assignAction.assignee}`;
    }

    ElMessage.success('派单成功');
    assignDrawerApi.close();
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 忽略预警 - 改为右侧弹窗
const handleIgnore = (row) => {
  ignoreAction.row = row;
  ignoreAction.ignoreReason = '';
  ignoreDrawerApi.open();
};

// 提交忽略
const handleSubmitIgnore = () => {
  if (!ignoreAction.ignoreReason) {
    ElMessage.error('忽略理由不能为空');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '提交忽略申请中...',
  });

  try {
    const index = alarmObj.apilist.findIndex(v => v.id === ignoreAction.row.id);
    if (index !== -1) {
      alarmObj.apilist[index].dealStatus = '已忽略';
      alarmObj.apilist[index].currentDealStatus = '已忽略';
      alarmObj.apilist[index].disposalResult = '已忽略';
      alarmObj.apilist[index].dealLogSummary = ignoreAction.ignoreReason.length > 50 ? ignoreAction.ignoreReason.substring(0, 50) + '...' : ignoreAction.ignoreReason;
      alarmObj.apilist[index].latestDynamic = '预警已被忽略';
      alarmObj.apilist[index].moduleType = 'archived';
      alarmObj.apilist[index].finishTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    ElMessage.success('忽略申请已提交');
    ignoreDrawerApi.close();
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 批量处置
const handleBatchDispose = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要处置的预警');
    return;
  }

  // 检查是否为同类型预警
  const selectedRows = alarmObj.list.filter(v => checkedIds.value.includes(v.id));
  const alarmTypes = [...new Set(selectedRows.map(v => v.alarmType))];

  if (alarmTypes.length > 1) {
    ElMessage.warning('批量处置仅支持同类型预警');
    return;
  }

  batchDisposeAction.rows = selectedRows;
  batchDisposeAction.disposeContent = '';
  batchDisposeDrawerApi.open();
};

// 提交批量处置
const handleSubmitBatchDispose = () => {
  if (!batchDisposeAction.disposeContent) {
    ElMessage.error('处置措施不能为空');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '批量处置中...',
  });

  try {
    batchDisposeAction.rows.forEach(row => {
      const index = alarmObj.apilist.findIndex(v => v.id === row.id);
      if (index !== -1) {
        alarmObj.apilist[index].dealStatus = '处置中';
        alarmObj.apilist[index].currentDealStatus = '处理中';
        alarmObj.apilist[index].dealStartTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        alarmObj.apilist[index].dealProgress = '20%';
        alarmObj.apilist[index].dealLogSummary = batchDisposeAction.disposeContent.length > 50 ? batchDisposeAction.disposeContent.substring(0, 50) + '...' : batchDisposeAction.disposeContent;
        alarmObj.apilist[index].latestDynamic = '已批量处置，处置措施已提交';
        alarmObj.apilist[index].moduleType = 'dealing';
      }
    });

    ElMessage.success(`批量处置成功，共处理${batchDisposeAction.rows.length}条预警`);
    batchDisposeDrawerApi.close();
    checkedIds.value = [];
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 更新进展
const handleUpdate = (row) => {
  updateDialog.row = row;
  updateDialog.dealStatus = row.currentDealStatus;
  updateDialog.progressNote = '';
  updateDialog.visible = true;
};

// 提交更新
const handleSubmitUpdate = () => {
  if (!updateDialog.dealStatus) {
    ElMessage.error('请选择处置状态');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '更新进展中...',
  });

  try {
    const index = alarmObj.apilist.findIndex(v => v.id === updateDialog.row.id);
    if (index !== -1) {
      alarmObj.apilist[index].currentDealStatus = updateDialog.dealStatus;

      // 根据状态更新进度
      let newProgress = alarmObj.apilist[index].dealProgress;
      if (updateDialog.dealStatus === '处理中') newProgress = '40%';
      else if (updateDialog.dealStatus === '待验证') newProgress = '80%';
      else if (updateDialog.dealStatus === '协同处理中') newProgress = '60%';

      alarmObj.apilist[index].dealProgress = newProgress;
      alarmObj.apilist[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      if (updateDialog.progressNote) {
        alarmObj.apilist[index].dealLogSummary = updateDialog.progressNote.length > 50 ? updateDialog.progressNote.substring(0, 50) + '...' : updateDialog.progressNote;
        alarmObj.apilist[index].latestDynamic = `进展已更新：${updateDialog.progressNote}`;
      } else {
        alarmObj.apilist[index].latestDynamic = `状态已更新为：${updateDialog.dealStatus}`;
      }
    }

    ElMessage.success('进展更新成功');
    updateDialog.visible = false;
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 添加备注
const handleRemark = (row) => {
  remarkDialog.row = row;
  remarkDialog.remarkContent = '';
  remarkDialog.visible = true;
};

// 提交备注
const handleSubmitRemark = () => {
  const loadingInstance = ElLoading.service({
    text: '保存备注中...',
  });

  try {
    const index = alarmObj.apilist.findIndex(v => v.id === remarkDialog.row.id);
    if (index !== -1 && remarkDialog.remarkContent) {
      const newRemark = `[备注] ${remarkDialog.remarkContent}`;
      alarmObj.apilist[index].dealLogSummary = newRemark.length > 50 ? newRemark.substring(0, 50) + '...' : newRemark;
      alarmObj.apilist[index].latestDynamic = '已添加备注';
    }

    ElMessage.success('备注已保存');
    remarkDialog.visible = false;
  } finally {
    loadingInstance.close();
  }
};

// 验证处置
const handleVerify = (row) => {
  verifyDialog.row = row;
  verifyDialog.verifyResult = '';
  verifyDialog.verifyNote = '';
  verifyDialog.visible = true;
};

// 提交验证
const handleSubmitVerify = () => {
  if (!verifyDialog.verifyResult) {
    ElMessage.error('请选择验证结果');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '提交验证中...',
  });

  try {
    const index = alarmObj.apilist.findIndex(v => v.id === verifyDialog.row.id);
    if (index !== -1) {
      alarmObj.apilist[index].currentDealStatus = '已完成';
      alarmObj.apilist[index].dealProgress = '100%';
      alarmObj.apilist[index].dealStatus = '已处理';
      alarmObj.apilist[index].disposalResult = verifyDialog.verifyResult === '已解决' ? '已解决' : '无法解决';
      alarmObj.apilist[index].finishTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      alarmObj.apilist[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      alarmObj.apilist[index].dealSummary = verifyDialog.verifyNote || '验证通过';
      alarmObj.apilist[index].latestDynamic = `验证完成：${verifyDialog.verifyResult}`;
      alarmObj.apilist[index].moduleType = 'archived';

      // 计算处置时长
      const startTime = new Date(alarmObj.apilist[index].dealStartTime);
      const finishTime = new Date(alarmObj.apilist[index].finishTime);
      const durationHours = Math.round((finishTime - startTime) / (1000 * 60 * 60));
      alarmObj.apilist[index].dealDuration = durationHours > 24 ? `${Math.floor(durationHours / 24)}天${durationHours % 24}小时` : `${durationHours}小时`;
    }

    ElMessage.success('验证提交成功');
    verifyDialog.visible = false;
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 跟踪处置进度（批量查看日志）
const handleTrack = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要跟踪的预警');
    return;
  }

  const selectedRows = alarmObj.list.filter(v => checkedIds.value.includes(v.id));
  console.log('批量查看处置进度日志:', selectedRows);
  ElMessage.info(`已选中${selectedRows.length}条预警进行跟踪`);
};

// 下载附件
const handleDownload = (row) => {
  if (row.attachmentCount > 0) {
    ElMessage.info(`开始下载${row.attachmentCount}个附件`);
  } else {
    ElMessage.warning('没有可下载的附件');
  }
};

// 复盘
const handleReview = (row) => {
  reviewDialog.row = row;
  reviewDialog.reviewOpinion = row.reviewOpinion || '';
  reviewDialog.visible = true;
};

// 提交复盘
const handleSubmitReview = () => {
  const loadingInstance = ElLoading.service({
    text: '提交复盘中...',
  });

  try {
    const index = alarmObj.apilist.findIndex(v => v.id === reviewDialog.row.id);
    if (index !== -1) {
      alarmObj.apilist[index].reviewOpinion = reviewDialog.reviewOpinion;
      alarmObj.apilist[index].latestDynamic = '复盘意见已更新';
    }

    ElMessage.success('复盘意见已提交');
    reviewDialog.visible = false;
  } finally {
    loadingInstance.close();
  }
};

// 标记为已读
const handleMarkRead = (row) => {
  // 预警模块暂无标记已读功能，保留方法但显示提示
  ElMessage.info('预警模块暂不支持标记已读功能');
};

// 批量标记为已读
const handleBatchMarkRead = () => {
  ElMessage.info('预警模块暂不支持批量标记已读功能');
};

// 删除预警
const handleDeleteAlarm = (row) => {
  confirm('确定要删除此预警吗？删除后不可恢复。').then(() => {
    const loadingInstance = ElLoading.service({
      text: '删除中...',
    });

    try {
      alarmObj.apilist = alarmObj.apilist.filter(v => v.id !== row.id);
      ElMessage.success('删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

// 批量删除预警
const handleBatchDeleteAlarm = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的预警');
    return;
  }

  confirm(`确定要删除这${checkedIds.value.length}条预警吗？删除后不可恢复。`).then(() => {
    const loadingInstance = ElLoading.service({
      text: '批量删除中...',
    });

    try {
      alarmObj.apilist = alarmObj.apilist.filter(v => !checkedIds.value.includes(v.id));
      checkedIds.value = [];
      ElMessage.success('批量删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

const tabsData = ref([
  { label: '待处置' },
  { label: '处置中' },
  { label: '已归档' },
  { label: '全部预警' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '待处置') {
    count = alarmObj.apilist.filter((v) => v.moduleType === 'pending').length;
  } else if (item.label === '处置中') {
    count = alarmObj.apilist.filter((v) => v.moduleType === 'dealing').length;
  } else if (item.label === '已归档') {
    count = alarmObj.apilist.filter((v) => v.moduleType === 'archived').length;
  } else if (item.label === '全部预警') {
    count = alarmObj.apilist.length;
  }
  return `${item.label}(${count})`;
};

const handleClick = () => {
  // 重新加载表格配置
  gridApi.query();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

const arrowChange = () => {
  emit('arrow-change');
};

// 定义组件ref，用于调用组件方法
const alarmDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <AlarmDetailDrawer
      ref="alarmDetailDrawerRef"
      :detail-obj="alarmObj.detailObj"
      :title="`预警详情 - ${alarmObj.detailObj.alarmId}`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 处置操作抽屉 -->
    <DisposeDrawer title="处置预警">
      <div class="dispose-action-content">
        <div class="action-form">
          <div class="form-title">处置措施<span class="required">*</span>：</div>
          <el-input
            v-model="disposeAction.disposeContent"
            type="textarea"
            :rows="6"
            placeholder="请输入处置措施（不超过500字）"
            maxlength="500"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-title" style="margin-top: 15px;">上传凭证（可选，最多3张）：</div>
          <el-upload
            v-model:file-list="disposeAction.evidenceFiles"
            class="upload-demo"
            action="#"
            multiple
            :limit="3"
            :on-exceed="() => ElMessage.warning('最多上传3个文件')"
            :auto-upload="false"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持图片、文档格式，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
          <div class="form-tips">预警ID：{{ disposeAction.row?.alarmId }}</div>
          <div class="form-tips">预警等级：{{ disposeAction.row?.alarmLevel }}</div>
          <div class="form-tips">预警类型：{{ disposeAction.row?.alarmType }}</div>
          <div class="form-tips">发生地点：{{ disposeAction.row?.location }}</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="disposeDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitDispose"
            :disabled="!disposeAction.disposeContent"
          >
            确认处置
          </ElButton>
        </div>
      </template>
    </DisposeDrawer>

    <!-- 派单操作抽屉 -->
    <AssignDrawer title="派单处理">
      <div class="dispose-action-content">
        <div class="action-form">
          <div class="form-title">选择处置人<span class="required">*</span>：</div>
          <el-select
            v-model="assignAction.assignee"
            placeholder="请选择处置人"
            class="w-full"
            filterable
          >
            <el-option
              v-for="item in assignAction.assigneeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-title" style="margin-top: 15px;">派单说明（可选）：</div>
          <el-input
            v-model="assignAction.assignNote"
            type="textarea"
            :rows="4"
            placeholder="请输入派单说明"
            maxlength="300"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-tips">预警ID：{{ assignAction.row?.alarmId }}</div>
          <div class="form-tips">预警等级：{{ assignAction.row?.alarmLevel }}</div>
          <div class="form-tips">预警类型：{{ assignAction.row?.alarmType }}</div>
          <div class="form-tips">发生时间：{{ assignAction.row?.alarmTime }}</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="assignDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitAssign"
            :disabled="!assignAction.assignee"
          >
            确认派单
          </ElButton>
        </div>
      </template>
    </AssignDrawer>

    <!-- 忽略预警抽屉 -->
    <IgnoreDrawer title="忽略预警">
      <div class="dispose-action-content">
        <div class="action-form">
          <div class="form-title">忽略理由<span class="required">*</span>：</div>
          <el-input
            v-model="ignoreAction.ignoreReason"
            type="textarea"
            :rows="6"
            placeholder="请输入忽略理由（将提交审批）"
            maxlength="300"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-tips" style="color: #e6a23c;">忽略预警需提交审批，请填写详细忽略理由</div>
          <div class="form-tips">预警ID：{{ ignoreAction.row?.alarmId }}</div>
          <div class="form-tips">预警等级：{{ ignoreAction.row?.alarmLevel }}</div>
          <div class="form-tips">预警类型：{{ ignoreAction.row?.alarmType }}</div>
          <div class="form-tips">发生时间：{{ ignoreAction.row?.alarmTime }}</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="ignoreDrawerApi.close">取消</ElButton>
          <ElButton
            type="warning"
            @click="handleSubmitIgnore"
            :disabled="!ignoreAction.ignoreReason"
          >
            提交忽略
          </ElButton>
        </div>
      </template>
    </IgnoreDrawer>

    <!-- 批量处置操作抽屉 -->
    <BatchDisposeDrawer :title="batchDisposeAction.title">
      <div class="dispose-action-content">
        <div class="action-form">
          <div class="form-title">批量处置措施<span class="required">*</span>：</div>
          <el-input
            v-model="batchDisposeAction.disposeContent"
            type="textarea"
            :rows="6"
            placeholder="请输入处置措施（将应用于所有选中预警）"
            maxlength="500"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-tips">将批量处理 {{ batchDisposeAction.rows.length }} 条预警</div>
          <div class="form-tips">预警类型：{{ batchDisposeAction.rows[0]?.alarmType }}</div>
          <div class="form-tips">预警等级分布：{{ [...new Set(batchDisposeAction.rows.map(r => r.alarmLevel))].join('、') }}</div>
          <div class="form-tips">涉及地点：{{ [...new Set(batchDisposeAction.rows.map(r => r.location))].slice(0, 3).join('、') }}{{ batchDisposeAction.rows.length > 3 ? '等' : '' }}</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="batchDisposeDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitBatchDispose"
            :disabled="!batchDisposeAction.disposeContent"
          >
            确认批量处置
          </ElButton>
        </div>
      </template>
    </BatchDisposeDrawer>

    <!-- 更新进展弹窗 -->
    <ElDialog
      v-model="updateDialog.visible"
      title="更新进展"
      width="500px"
    >
      <div class="dialog-content">
        <p style="margin-bottom: 10px;">处置状态<span class="required">*</span>：</p>
        <el-select
          v-model="updateDialog.dealStatus"
          placeholder="请选择处置状态"
          class="w-full"
        >
          <el-option label="处理中" value="处理中" />
          <el-option label="协同处理中" value="协同处理中" />
          <el-option label="待验证" value="待验证" />
          <el-option label="挂起" value="挂起" />
        </el-select>
        <p style="margin-top: 15px; margin-bottom: 10px;">进展说明（可选）：</p>
        <el-input
          v-model="updateDialog.progressNote"
          type="textarea"
          :rows="3"
          placeholder="请输入进展说明"
          maxlength="200"
          show-word-limit
        />
        <p style="margin-top: 15px; color: #909399; font-size: 13px;">预警ID：{{ updateDialog.row?.alarmId }}</p>
        <p style="color: #909399; font-size: 13px;">当前进度：{{ updateDialog.row?.dealProgress }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updateDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitUpdate" :disabled="!updateDialog.dealStatus">确认更新</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 验证弹窗 -->
    <ElDialog
      v-model="verifyDialog.visible"
      title="验证处置"
      width="500px"
    >
      <div class="dialog-content">
        <p style="margin-bottom: 10px;">验证结果<span class="required">*</span>：</p>
        <el-select
          v-model="verifyDialog.verifyResult"
          placeholder="请选择验证结果"
          class="w-full"
        >
          <el-option label="已解决" value="已解决" />
          <el-option label="未解决" value="未解决" />
        </el-select>
        <p style="margin-top: 15px; margin-bottom: 10px;">验证说明（可选）：</p>
        <el-input
          v-model="verifyDialog.verifyNote"
          type="textarea"
          :rows="3"
          placeholder="请输入验证说明"
          maxlength="200"
          show-word-limit
        />
        <p style="margin-top: 15px; color: #909399; font-size: 13px;">预警ID：{{ verifyDialog.row?.alarmId }}</p>
        <p style="color: #909399; font-size: 13px;">处置人：{{ verifyDialog.row?.responsiblePerson }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="verifyDialog.visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitVerify" :disabled="!verifyDialog.verifyResult">提交验证</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 备注弹窗 -->
    <ElDialog
      v-model="remarkDialog.visible"
      title="添加备注"
      width="500px"
    >
      <div class="dialog-content">
        <p style="margin-bottom: 10px;">备注内容（可选）：</p>
        <el-input
          v-model="remarkDialog.remarkContent"
          type="textarea"
          :rows="4"
          placeholder="请输入备注内容"
          maxlength="300"
          show-word-limit
        />
        <p style="margin-top: 15px; color: #909399; font-size: 13px;">预警ID：{{ remarkDialog.row?.alarmId }}</p>
        <p style="color: #909399; font-size: 13px;">当前状态：{{ remarkDialog.row?.currentDealStatus }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="remarkDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitRemark">保存备注</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 复盘弹窗 -->
    <ElDialog
      v-model="reviewDialog.visible"
      title="预警复盘"
      width="500px"
    >
      <div class="dialog-content">
        <p style="margin-bottom: 10px;">复盘意见（可选）：</p>
        <el-input
          v-model="reviewDialog.reviewOpinion"
          type="textarea"
          :rows="5"
          placeholder="请输入复盘意见，可用于优化预警处置流程"
          maxlength="500"
          show-word-limit
        />
        <p style="margin-top: 15px; color: #909399; font-size: 13px;">预警ID：{{ reviewDialog.row?.alarmId }}</p>
        <p style="color: #909399; font-size: 13px;">处置时长：{{ reviewDialog.row?.dealDuration }}</p>
        <p style="color: #909399; font-size: 13px;">处置结果：{{ reviewDialog.row?.disposalResult }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialog.visible = false">关闭</el-button>
          <el-button type="primary" @click="handleSubmitReview">保存</el-button>
        </span>
      </template>
    </ElDialog>

    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 待处置模块按钮 -->
          <template v-if="activeName === '待处置'">
            <IconButton
              content="批量处置"
              icon-name="check"
              color="#67C23A"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchDispose"
            />
          </template>

          <!-- 处置中模块按钮 -->
          <template v-if="activeName === '处置中'">
            <IconButton
              content="跟踪进度"
              icon-name="search"
              :disabled="isEmpty(checkedIds)"
              @click="handleTrack"
            />
            <IconButton
              content="导出"
              icon-name="download"
              @click="handleExport"
            />
          </template>

          <!-- 已归档模块按钮 -->
          <template v-if="activeName === '已归档'">
            <IconButton
              content="导出"
              icon-name="download"
              @click="handleExport"
            />
            <IconButton
              content="批量删除"
              icon-name="delete"
              color="#F56C6C"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchDeleteAlarm"
            />
          </template>

          <IconButton
            content="筛选"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
          <IconButton
            content="刷新"
            icon-name="refresh"
            @click="handleRefresh"
          />
        </div>
      </template>

      <!-- 预警ID列模板 -->
      <template #alarmId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.alarmId }}
        </el-text>
      </template>

      <template #alarmLevel="{ row }">
        <el-tag
          :type="row.alarmLevel === '严重' ? 'danger' :
                 row.alarmLevel === '高' ? 'warning' :
                 row.alarmLevel === '中' ? 'primary' : 'info'"
          size="small"
          @click="gridApi.query({ alarmLevel: row.alarmLevel })"
          style="cursor: pointer;"
        >
          {{ row.alarmLevel }}
        </el-tag>
      </template>

      <template #alarmType="{ row }">
        <el-tag
          size="small"
          @click="gridApi.query({ alarmType: row.alarmType })"
          style="cursor: pointer;"
        >
          {{ row.alarmType }}
        </el-tag>
      </template>

      <template #assetName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          style="cursor: pointer;"
          type="primary"
        >
          {{ row.assetName }}
        </el-text>
      </template>

      <template #source="{ row }">
        <el-tag
          size="small"
          :type="row.source === '设备上报' ? 'primary' : 'success'"
          @click="gridApi.query({ source: row.source })"
          style="cursor: pointer;"
        >
          {{ row.source }}
        </el-tag>
      </template>

      <template #responsiblePerson="{ row }">
        <el-text
          v-if="row.responsiblePerson"
          @click="gridApi.query({ responsiblePerson: row.responsiblePerson })"
          style="cursor: pointer;"
          type="primary"
        >
          {{ row.responsiblePerson }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #currentDealStatus="{ row }">
        <el-tag
          :type="row.currentDealStatus === '处理中' ? 'primary' :
                 row.currentDealStatus === '协同处理中' ? 'warning' :
                 row.currentDealStatus === '待验证' ? 'info' :
                 row.currentDealStatus === '已完成' ? 'success' :
                 row.currentDealStatus === '已忽略' ? 'danger' : 'info'"
          size="small"
          @click="gridApi.query({ currentDealStatus: row.currentDealStatus })"
          style="cursor: pointer;"
        >
          {{ row.currentDealStatus }}
        </el-tag>
      </template>

      <template #workorderNo="{ row }">
        <el-text
          v-if="row.workorderNo"
          @click="handleOpenDetail(row)"
          style="cursor: pointer;"
          type="primary"
        >
          {{ row.workorderNo }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #dealProgress="{ row }">
        <el-progress
          v-if="row.dealProgress && row.dealProgress !== '0%'"
          :percentage="parseInt(row.dealProgress)"
          :status="row.dealProgress === '100%' ? 'success' : ''"
          style="width: 80px;"
        />
        <span v-else>{{ row.dealProgress || '-' }}</span>
      </template>

      <template #disposalResult="{ row }">
        <el-tag
          v-if="row.disposalResult"
          :type="row.disposalResult === '已解决' ? 'success' :
                 row.disposalResult === '已忽略' ? 'warning' :
                 row.disposalResult === '误报' ? 'info' : 'danger'"
          size="small"
          @click="gridApi.query({ disposalResult: row.disposalResult })"
          style="cursor: pointer;"
        >
          {{ row.disposalResult }}
        </el-tag>
        <span v-else>-</span>
      </template>

      <!-- 待处置操作列 -->
      <template #pendingActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="处置"
            icon-name="edit"
            color="#67C23A"
            @click="handleDispose(row)"
          />
          <IconButton
            content="派单"
            icon-name="user"
            @click="handleAssign(row)"
          />
          <IconButton
            content="忽略"
            icon-name="close"
            color="#E6A23C"
            @click="handleIgnore(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
        </div>
      </template>

      <!-- 处置中操作列 -->
      <template #dealingActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="更新"
            icon-name="edit"
            @click="handleUpdate(row)"
          />
          <IconButton
            content="备注"
            icon-name="document"
            @click="handleRemark(row)"
          />
          <IconButton
            content="验证"
            icon-name="check"
            color="#67C23A"
            @click="handleVerify(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
        </div>
      </template>

      <!-- 已归档操作列 -->
      <template #archivedActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="下载"
            icon-name="download"
            v-if="row.attachmentCount > 0"
            @click="handleDownload(row)"
          />
          <IconButton
            content="复盘"
            icon-name="edit"
            @click="handleReview(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDeleteAlarm(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!alarmObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="alarmObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：预警数量{{ alarmObj.list.length }};
            <template v-if="activeName === '待处置'">
              严重等级: {{ alarmObj.list.filter(v => v.alarmLevel === '严重').length }};
              高级预警: {{ alarmObj.list.filter(v => v.alarmLevel === '高').length }};
            </template>
            <template v-if="activeName === '处置中'">
              处理中: {{ alarmObj.list.filter(v => v.currentDealStatus === '处理中').length }};
              待验证: {{ alarmObj.list.filter(v => v.currentDealStatus === '待验证').length }};
            </template>
            <template v-if="activeName === '已归档'">
              已解决: {{ alarmObj.list.filter(v => v.disposalResult === '已解决').length }};
              已忽略: {{ alarmObj.list.filter(v => v.disposalResult === '已忽略').length }};
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="alarmObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.dispose-action-content {
  padding: 20px;
}

.action-form {
  .form-title {
    font-weight: 500;
    margin-bottom: 10px;
    color: #303133;

    .required {
      color: #f56c6c;
      margin-left: 2px;
    }
  }

  .action-textarea {
    margin-bottom: 15px;
  }

  .form-tips {
    font-size: 13px;
    color: #909399;
    margin-bottom: 5px;
    line-height: 1.5;
  }

  .upload-demo {
    margin-bottom: 15px;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
}

.dialog-content {
  .required {
    color: #f56c6c;
    margin-left: 2px;
  }
}
</style>
