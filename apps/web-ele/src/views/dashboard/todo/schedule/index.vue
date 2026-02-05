<!-- index.vue - 排班管理主页面 -->
<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import {
  ElLoading,
  ElMessage,
  ElButton,
  ElDialog,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElUpload,
  ElTag,
  ElText,
  ElProgress,
  ElIcon
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
// 引入排班详情抽屉组件
import ScheduleDetailDrawer from '#/views/dashboard/todo/schedule/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

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

// 创建换班申请抽屉
const [ShiftApplyDrawer, shiftApplyDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    shiftApplyDrawerApi.close();
  },
  onConfirm() {
    handleSubmitShiftApply();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      shiftApply.newDate = '';
      shiftApply.newShiftTime = '';
      shiftApply.shiftTarget = '';
      shiftApply.shiftReason = '';
    }
  },
});

// 创建交接日志抽屉
const [HandoverLogDrawer, handoverLogDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    handoverLogDrawerApi.close();
  },
  onConfirm() {
    handleSubmitHandoverLog();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      handoverLog.keyWork = '';
      handoverLog.unfinished = '';
      handoverLog.alarmDeal = '';
      handoverLog.deviceStatus = '';
      handoverLog.attachments = [];
      handoverLog.isDraft = false;
    }
  },
});

// 创建更多操作抽屉
const [MoreActionsDrawer, moreActionsDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    moreActionsDrawerApi.close();
  },
  onConfirm() {
    handleMoreAction();
  },
  async onOpenChange() {},
});

// 换班申请相关状态
const shiftApply = reactive({
  title: '换班申请',
  row: null,
  originalInfo: '',
  newDate: '',
  newShiftTime: '',
  shiftTarget: '',
  shiftReason: '',
  shiftTargetOptions: [
    { label: '张三', value: '张三' },
    { label: '李四', value: '李四' },
    { label: '王五', value: '王五' },
    { label: '赵六', value: '赵六' },
    { label: '孙七', value: '孙七' },
    { label: '周八', value: '周八' },
    { label: '吴九', value: '吴九' },
  ],
  shiftTimeOptions: [
    { label: '08:00-18:00 (白班)', value: '08:00-18:00' },
    { label: '18:00-08:00 (夜班)', value: '18:00-08:00' },
    { label: '09:00-17:00 (行政班)', value: '09:00-17:00' },
  ]
});

// 交接日志相关状态
const handoverLog = reactive({
  title: '交接日志',
  row: null,
  keyWork: '',
  unfinished: '',
  alarmDeal: '',
  deviceStatus: '',
  attachments: [],
  isDraft: false,
});

// 更多操作相关状态
const moreAction = reactive({
  title: '更多操作',
  row: null,
  actionType: '',
});

// 打印预览弹窗
const printDialog = reactive({
  visible: false,
  row: null,
});

// 取消换班弹窗
const cancelShiftDialog = reactive({
  visible: false,
  row: null,
  cancelReason: '',
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
      scheduleObj.apilist.push(obj);
    } else {
      scheduleObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          scheduleObj.apilist[i] = obj;
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
  exportToExcel(scheduleObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建排班 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑排班 */
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
    text: $t('ui.actionMessage.deleting', [row.scheduleId]),
  });
  try {
    scheduleObj.apilist = scheduleObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.scheduleId]));
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
    scheduleObj.apilist = scheduleObj.apilist.filter(
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

const scheduleObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  scheduleObj.totalShow = !scheduleObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = scheduleObj.apilist;
  if (activeName.value === '我的排班') {
    // 我的排班显示所有数据
    filteredList = scheduleObj.apilist;
  } else if (activeName.value === '换班申请') {
    // 显示换班申请相关数据
    filteredList = scheduleObj.apilist.filter(v => v.moduleType === 'shifting' || v.moduleType === 'shifted');
  } else if (activeName.value === '交接日志') {
    // 显示有交接日志的数据
    filteredList = scheduleObj.apilist.filter(v => v.handoverLogId);
  }

  scheduleObj.total = filteredList.length;
  scheduleObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return scheduleObj;
};

// 动态获取搜索表单配置
const getCurrentFormSchema = () => {
  let moduleType = 'mySchedule';
  if (activeName.value === '我的排班') moduleType = 'mySchedule';
  else if (activeName.value === '换班申请') moduleType = 'shiftApply';
  else if (activeName.value === '交接日志') moduleType = 'handoverLog';

  return useFormSchema(moduleType);
};

// 定义 activeName 在 getCurrentFormSchema 之后
const activeName = ref('我的排班');

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
  let moduleType = 'mySchedule';
  if (activeName.value === '我的排班') moduleType = 'mySchedule';
  else if (activeName.value === '换班申请') moduleType = 'shiftApply';
  else if (activeName.value === '交接日志') moduleType = 'handoverLog';

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
    pagerConfig: scheduleObj,
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
  scheduleObj.detailObj = row;
  scheduleDetailDrawerRef.value.open();
};

// 换班申请
const handleShiftApply = (row) => {
  // 检查是否可换班
  if (row.scheduleStatus === '已换班') {
    ElMessage.warning('已换班的排班不可再次申请换班');
    return;
  }

  shiftApply.row = row;
  shiftApply.originalInfo = `${row.scheduleDate} ${row.shiftTime}`;
  shiftApply.newDate = '';
  shiftApply.newShiftTime = '';
  shiftApply.shiftTarget = '';
  shiftApply.shiftReason = '';
  shiftApplyDrawerApi.open();
};

// 提交换班申请
const handleSubmitShiftApply = () => {
  if (!shiftApply.newDate || !shiftApply.newShiftTime || !shiftApply.shiftTarget || !shiftApply.shiftReason) {
    ElMessage.error('请填写所有必填项');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '提交换班申请中...',
  });

  try {
    // 更新排班状态
    const index = scheduleObj.apilist.findIndex(v => v.id === shiftApply.row.id);
    if (index !== -1) {
      scheduleObj.apilist[index].scheduleStatus = '换班中';
      scheduleObj.apilist[index].moduleType = 'shifting';
      scheduleObj.apilist[index].taskStatus = '待审批';
    }

    ElMessage.success('换班申请已提交，等待审批');
    shiftApplyDrawerApi.close();
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 交接日志
const handleHandoverLog = (row) => {
  handoverLog.row = row;
  handoverLog.keyWork = row.keyWork || '';
  handoverLog.unfinished = row.unfinished || '';
  handoverLog.alarmDeal = row.alarmDeal || '';
  handoverLog.deviceStatus = row.deviceStatus || '';
  handoverLog.attachments = [];
  handoverLog.isDraft = false;
  handoverLogDrawerApi.open();
};

// 提交交接日志
const handleSubmitHandoverLog = () => {
  if (!handoverLog.keyWork) {
    ElMessage.error('重点工作不能为空');
    return;
  }

  if (handoverLog.keyWork.length > 500) {
    ElMessage.error('重点工作不能超过500字');
    return;
  }

  if (handoverLog.unfinished && handoverLog.unfinished.length > 300) {
    ElMessage.error('未完成事项不能超过300字');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: handoverLog.isDraft ? '保存草稿中...' : '提交交接日志中...',
  });

  try {
    // 更新排班状态
    const index = scheduleObj.apilist.findIndex(v => v.id === handoverLog.row.id);
    if (index !== -1) {
      scheduleObj.apilist[index].keyWork = handoverLog.keyWork;
      scheduleObj.apilist[index].unfinished = handoverLog.unfinished;
      scheduleObj.apilist[index].alarmDeal = handoverLog.alarmDeal;
      scheduleObj.apilist[index].deviceStatus = handoverLog.deviceStatus;

      if (!handoverLog.isDraft) {
        scheduleObj.apilist[index].handoverStatus = '已交接';
        scheduleObj.apilist[index].handoverTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        scheduleObj.apilist[index].submitTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        scheduleObj.apilist[index].handoverLogId = `LOG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(index + 1).padStart(3, '0')}`;
      }

      if (handoverLog.attachments.length > 0) {
        scheduleObj.apilist[index].attachmentCount = handoverLog.attachments.length;
      }
    }

    ElMessage.success(handoverLog.isDraft ? '已保存为草稿' : '交接日志已提交');
    handoverLogDrawerApi.close();
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 保存草稿
const handleSaveDraft = () => {
  handoverLog.isDraft = true;
  handleSubmitHandoverLog();
};

// 更多操作
const handleMoreAction = () => {
  switch(moreAction.actionType) {
    case 'print':
      handlePrint(moreAction.row);
      break;
    case 'cancelShift':
      handleCancelShift(moreAction.row);
      break;
  }
  moreActionsDrawerApi.close();
};

// 打开更多操作抽屉
const handleOpenMoreActions = (row, actionType = '') => {
  moreAction.row = row;
  moreAction.actionType = actionType;
  moreActionsDrawerApi.open();
};

// 打印
const handlePrint = (row) => {
  printDialog.row = row;
  printDialog.visible = true;
};

// 实际打印操作
const handleDoPrint = () => {
  ElMessage.success('打印任务已发送');
  printDialog.visible = false;
};

// 取消换班
const handleCancelShift = (row) => {
  if (row.scheduleStatus !== '换班中') {
    ElMessage.warning('只有换班中状态的排班可以取消换班');
    return;
  }

  cancelShiftDialog.row = row;
  cancelShiftDialog.cancelReason = '';
  cancelShiftDialog.visible = true;
};

// 提交取消换班
const handleSubmitCancelShift = () => {
  if (!cancelShiftDialog.cancelReason) {
    ElMessage.error('请填写取消原因');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '取消换班申请中...',
  });

  try {
    const index = scheduleObj.apilist.findIndex(v => v.id === cancelShiftDialog.row.id);
    if (index !== -1) {
      scheduleObj.apilist[index].scheduleStatus = '正常';
      scheduleObj.apilist[index].moduleType = 'normal';
      scheduleObj.apilist[index].taskStatus = '待执行';
    }

    ElMessage.success('换班申请已取消');
    cancelShiftDialog.visible = false;
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 复盘
const handleReview = (row) => {
  if (row.handoverStatus !== '已交接') {
    ElMessage.warning('请先完成交接再进行复盘');
    return;
  }

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
    const index = scheduleObj.apilist.findIndex(v => v.id === reviewDialog.row.id);
    if (index !== -1 && reviewDialog.reviewOpinion) {
      // 在实际应用中，这里应该更新复盘意见字段
      ElMessage.success('复盘意见已提交');
    }

    reviewDialog.visible = false;
  } finally {
    loadingInstance.close();
  }
};

// 下载附件
const handleDownload = (row) => {
  if (row.attachmentCount > 0) {
    ElMessage.info(`开始下载${row.attachmentCount}个附件`);
  } else {
    ElMessage.warning('没有可下载的附件');
  }
};

// 撤回申请（换班申请模块）
const handleWithdrawApply = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要撤回的申请');
    return;
  }

  confirm('确定要撤回选中的换班申请吗？').then(() => {
    const loadingInstance = ElLoading.service({
      text: '撤回申请中...',
    });

    try {
      checkedIds.value.forEach(id => {
        const index = scheduleObj.apilist.findIndex(v => v.id === id);
        if (index !== -1 && scheduleObj.apilist[index].scheduleStatus === '换班中') {
          scheduleObj.apilist[index].scheduleStatus = '正常';
          scheduleObj.apilist[index].moduleType = 'normal';
          scheduleObj.apilist[index].taskStatus = '待执行';
        }
      });

      ElMessage.success(`已撤回${checkedIds.value.length}个换班申请`);
      checkedIds.value = [];
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

// 跟踪进度（换班申请模块）
const handleTrackProgress = (row) => {
  ElMessage.info(`跟踪换班申请 ${row.scheduleId} 的审批进度`);
  // 在实际应用中，这里应该打开审批进度跟踪弹窗
};

const tabsData = ref([
  { label: '我的排班' },
  { label: '换班申请' },
  { label: '交接日志' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '我的排班') {
    count = scheduleObj.apilist.length;
  } else if (item.label === '换班申请') {
    count = scheduleObj.apilist.filter((v) => v.moduleType === 'shifting' || v.moduleType === 'shifted').length;
  } else if (item.label === '交接日志') {
    count = scheduleObj.apilist.filter((v) => v.handoverLogId).length;
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
const scheduleDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <ScheduleDetailDrawer
      ref="scheduleDetailDrawerRef"
      :detail-obj="scheduleObj.detailObj"
      :title="`排班详情 - ${scheduleObj.detailObj.scheduleId}`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 换班申请抽屉 -->
    <ShiftApplyDrawer title="换班申请">
      <div class="shift-apply-content">
        <div class="action-form">
          <div class="form-title">原值班信息：</div>
          <div class="form-info">{{ shiftApply.originalInfo }}</div>

          <div class="form-title">申请换班日期<span class="required">*</span>：</div>
          <el-date-picker
            v-model="shiftApply.newDate"
            type="date"
            placeholder="请选择换班日期"
            class="w-full"
            :disabled-date="(date) => date < new Date()"
          />

          <div class="form-title" style="margin-top: 15px;">申请换班时段<span class="required">*</span>：</div>
          <el-select
            v-model="shiftApply.newShiftTime"
            placeholder="请选择换班时段"
            class="w-full"
          >
            <el-option
              v-for="item in shiftApply.shiftTimeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <div class="form-title" style="margin-top: 15px;">换班对象<span class="required">*</span>：</div>
          <el-select
            v-model="shiftApply.shiftTarget"
            placeholder="请选择换班对象"
            class="w-full"
            filterable
          >
            <el-option
              v-for="item in shiftApply.shiftTargetOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <div class="form-title" style="margin-top: 15px;">换班理由<span class="required">*</span>：</div>
          <el-input
            v-model="shiftApply.shiftReason"
            type="textarea"
            :rows="4"
            placeholder="请填写换班理由（不超过200字）"
            maxlength="200"
            show-word-limit
            class="action-textarea"
          />

          <div class="form-tips" style="margin-top: 15px; color: #e6a23c;">
            注意：换班申请需对方同意并经过审批，请提前与换班对象沟通
          </div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="shiftApplyDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitShiftApply"
            :disabled="!shiftApply.newDate || !shiftApply.newShiftTime || !shiftApply.shiftTarget || !shiftApply.shiftReason"
          >
            提交申请
          </ElButton>
        </div>
      </template>
    </ShiftApplyDrawer>

    <!-- 交接日志抽屉 -->
    <HandoverLogDrawer :title="handoverLog.title">
      <div class="handover-log-content">
        <div class="action-form">
          <div class="form-title">值班重点工作<span class="required">*</span>：</div>
          <el-input
            v-model="handoverLog.keyWork"
            type="textarea"
            :rows="6"
            placeholder="请填写值班重点工作（不超过500字）"
            maxlength="500"
            show-word-limit
            class="action-textarea"
          />

          <div class="form-title" style="margin-top: 15px;">未完成事项（可选）：</div>
          <el-input
            v-model="handoverLog.unfinished"
            type="textarea"
            :rows="4"
            placeholder="请填写未完成事项（不超过300字）"
            maxlength="300"
            show-word-limit
            class="action-textarea"
          />

          <div class="form-title" style="margin-top: 15px;">预警处置情况（可选）：</div>
          <el-input
            v-model="handoverLog.alarmDeal"
            type="textarea"
            :rows="4"
            placeholder="请填写预警处置情况（不超过300字）"
            maxlength="300"
            show-word-limit
            class="action-textarea"
          />

          <div class="form-title" style="margin-top: 15px;">设备运行状态（可选）：</div>
          <el-input
            v-model="handoverLog.deviceStatus"
            type="textarea"
            :rows="4"
            placeholder="请填写设备运行状态（不超过300字）"
            maxlength="300"
            show-word-limit
            class="action-textarea"
          />

          <div class="form-title" style="margin-top: 15px;">附件上传（可选，最多3张）：</div>
          <el-upload
            v-model:file-list="handoverLog.attachments"
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

          <div class="form-tips">值班日期：{{ handoverLog.row?.scheduleDate }}</div>
          <div class="form-tips">值班时段：{{ handoverLog.row?.shiftTime }}</div>
          <div class="form-tips">值班岗位：{{ handoverLog.row?.post }}</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="handoverLogDrawerApi.close">取消</ElButton>
          <ElButton @click="handleSaveDraft">保存草稿</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitHandoverLog"
            :disabled="!handoverLog.keyWork"
          >
            提交日志
          </ElButton>
        </div>
      </template>
    </HandoverLogDrawer>

    <!-- 更多操作抽屉 -->
    <MoreActionsDrawer :title="moreAction.title">
      <div class="more-actions-content">
        <div class="action-form">
          <div class="form-title">选择操作：</div>
          <div class="action-buttons">
            <el-button
              @click="moreAction.actionType = 'print'"
              :type="moreAction.actionType === 'print' ? 'primary' : ''"
              :title="打印排班信息"
            >
              打印
            </el-button>
            <el-button
              @click="moreAction.actionType = 'cancelShift'"
              :type="moreAction.actionType === 'cancelShift' ? 'primary' : ''"
              :disabled="moreAction.row?.scheduleStatus !== '换班中'"
              :title="moreAction.row?.scheduleStatus !== '换班中' ? '只有换班中状态的排班可以取消换班' : '取消换班申请'"
            >
              取消换班
            </el-button>
          </div>
          <div class="form-tips" style="margin-top: 15px;">
            当前排班：{{ moreAction.row?.scheduleId }}
          </div>
          <div class="form-tips">
            排班状态：{{ moreAction.row?.scheduleStatus }}
          </div>
          <div v-if="moreAction.actionType === 'cancelShift'" class="warning-tips">
            注意：取消换班需要填写理由并提交审批
          </div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="moreActionsDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleMoreAction"
            :disabled="!moreAction.actionType"
          >
            确认操作
          </ElButton>
        </div>
      </template>
    </MoreActionsDrawer>

    <!-- 打印预览弹窗 -->
    <ElDialog
      v-model="printDialog.visible"
      title="打印预览"
      width="800px"
    >
      <div class="dialog-content">
        <div class="print-preview">
          <h3 style="text-align: center;">排班信息</h3>
          <div class="print-info">
            <p><strong>排班ID：</strong>{{ printDialog.row?.scheduleId }}</p>
            <p><strong>值班日期：</strong>{{ printDialog.row?.scheduleDate }}</p>
            <p><strong>值班时段：</strong>{{ printDialog.row?.shiftTime }}</p>
            <p><strong>值班岗位：</strong>{{ printDialog.row?.post }}</p>
            <p><strong>值班地点：</strong>{{ printDialog.row?.location }}</p>
            <p><strong>同岗人员：</strong>{{ printDialog.row?.coWorkers }}</p>
            <p><strong>排班状态：</strong>{{ printDialog.row?.scheduleStatus }}</p>
            <p><strong>值班要求：</strong>{{ printDialog.row?.dutyRequirement }}</p>
          </div>
          <div class="print-footer">
            <p>打印时间：{{ new Date().toLocaleString() }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="printDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleDoPrint">打印</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 取消换班弹窗 -->
    <ElDialog
      v-model="cancelShiftDialog.visible"
      title="取消换班"
      width="500px"
    >
      <div class="dialog-content">
        <p style="margin-bottom: 10px;">取消原因<span class="required">*</span>：</p>
        <el-input
          v-model="cancelShiftDialog.cancelReason"
          type="textarea"
          :rows="4"
          placeholder="请填写取消换班的原因"
          maxlength="200"
          show-word-limit
        />
        <p style="margin-top: 15px; color: #909399; font-size: 13px;">排班ID：{{ cancelShiftDialog.row?.scheduleId }}</p>
        <p style="color: #909399; font-size: 13px;">值班日期：{{ cancelShiftDialog.row?.scheduleDate }}</p>
        <p style="color: #909399; font-size: 13px;">换班对象：{{ cancelShiftDialog.row?.coWorkers }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelShiftDialog.visible = false">取消</el-button>
          <el-button type="warning" @click="handleSubmitCancelShift" :disabled="!cancelShiftDialog.cancelReason">提交取消</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 复盘弹窗 -->
    <ElDialog
      v-model="reviewDialog.visible"
      title="排班复盘"
      width="500px"
    >
      <div class="dialog-content">
        <p style="margin-bottom: 10px;">复盘意见（可选）：</p>
        <el-input
          v-model="reviewDialog.reviewOpinion"
          type="textarea"
          :rows="5"
          placeholder="请输入复盘意见，可用于优化排班流程"
          maxlength="500"
          show-word-limit
        />
        <p style="margin-top: 15px; color: #909399; font-size: 13px;">排班ID：{{ reviewDialog.row?.scheduleId }}</p>
        <p style="color: #909399; font-size: 13px;">值班日期：{{ reviewDialog.row?.scheduleDate }}</p>
        <p style="color: #909399; font-size: 13px;">值班岗位：{{ reviewDialog.row?.post }}</p>
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
          <!-- 我的排班模块按钮 -->
          <template v-if="activeName === '我的排班'">
            <IconButton
              content="刷新"
              icon-name="refresh"
              @click="handleRefresh"
              title="刷新排班数据"
            />
            <IconButton
              content="导出"
              icon-name="download"
              @click="handleExport"
              title="导出排班数据到Excel"
            />
          </template>

          <!-- 换班申请模块按钮 -->
          <template v-if="activeName === '换班申请'">
            <IconButton
              content="撤回"
              icon-name="close"
              color="#E6A23C"
              :disabled="isEmpty(checkedIds)"
              :title="isEmpty(checkedIds) ? '请先选择要撤回的申请' : '撤回选中的换班申请'"
              @click="handleWithdrawApply"
            />
            <IconButton
              content="刷新"
              icon-name="refresh"
              @click="handleRefresh"
              title="刷新换班申请列表"
            />
          </template>

          <!-- 交接日志模块按钮 -->
          <template v-if="activeName === '交接日志'">
            <IconButton
              content="导出"
              icon-name="download"
              @click="handleExport"
              title="导出交接日志数据"
            />
            <IconButton
              content="刷新"
              icon-name="refresh"
              @click="handleRefresh"
              title="刷新交接日志列表"
            />
          </template>

          <IconButton
            content="筛选"
            icon-name="search"
            @click="handleSerachShow"
            title="打开筛选条件"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
            :title="props.arrowShow ? '展开面板' : '收缩面板'"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
            title="切换全屏模式"
          />
        </div>
      </template>

      <!-- 排班ID列模板 -->
      <template #scheduleId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer;"
          title="查看排班详情"
        >
          {{ row.scheduleId }}
        </el-text>
      </template>

      <template #post="{ row }">
        <el-tag
          size="small"
          @click="gridApi.query({ post: row.post })"
          style="cursor: pointer;"
          title="按此岗位筛选"
        >
          {{ row.post }}
        </el-tag>
      </template>

      <template #location="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          style="cursor: pointer;"
          type="primary"
          title="查看排班详情"
        >
          {{ row.location }}
        </el-text>
      </template>

      <template #coWorkers="{ row }">
        <el-text
          v-if="row.coWorkers"
          @click="handleOpenDetail(row)"
          style="cursor: pointer;"
          type="primary"
          title="查看排班详情"
        >
          {{ row.coWorkers }}
        </el-text>
        <span v-else title="暂无同岗人员">-</span>
      </template>

      <template #scheduleStatus="{ row }">
        <el-tag
          :type="row.scheduleStatus === '正常' ? 'success' :
                 row.scheduleStatus === '换班中' ? 'warning' :
                 row.scheduleStatus === '已换班' ? 'primary' : 'info'"
          size="small"
          @click="gridApi.query({ scheduleStatus: row.scheduleStatus })"
          style="cursor: pointer;"
          :title="`按${row.scheduleStatus}状态筛选`"
        >
          {{ row.scheduleStatus }}
        </el-tag>
      </template>

      <template #handoverStatus="{ row }">
        <el-tag
          :type="row.handoverStatus === '已交接' ? 'success' :
                 row.handoverStatus === '未交接' ? 'info' : 'warning'"
          size="small"
          @click="gridApi.query({ handoverStatus: row.handoverStatus })"
          style="cursor: pointer;"
          :title="`按${row.handoverStatus}状态筛选`"
        >
          {{ row.handoverStatus }}
        </el-tag>
      </template>

      <!-- 我的排班操作列 -->
      <template #scheduleActions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
            title="查看排班详情"
          />

          <!-- 换班按钮 -->
          <IconButton
            content="换班"
            icon-name="edit"
            :color="row.scheduleStatus === '已换班' ? '#C0C4CC' : '#67C23A'"
            :disabled="row.scheduleStatus === '已换班'"
            :title="row.scheduleStatus === '已换班' ? '已换班的排班不可再次申请换班' : '申请换班'"
            @click="handleShiftApply(row)"
          />

          <!-- 更多操作按钮 -->
          <IconButton
            content="更多"
            icon-name="more"
            @click="handleOpenMoreActions(row)"
            title="更多操作选项"
          />

          <!-- 交接按钮 -->
          <IconButton
            v-if="row.handoverStatus === '未交接'"
            content="交接"
            icon-name="edit"
            @click="handleHandoverLog(row)"
            title="填写交接日志"
          />
          <IconButton
            v-else
            content="已交接"
            icon-name="success"
            color="#C0C4CC"
            disabled
            title="已交接完成"
          />
        </div>
      </template>

      <!-- 换班申请操作列 -->
      <template #applyActions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
            title="查看换班申请详情"
          />

          <!-- 跟踪进度按钮 -->
          <IconButton
            content="跟踪"
            icon-name="search"
            @click="handleTrackProgress(row)"
            title="跟踪审批进度"
          />

          <!-- 根据状态显示不同按钮 -->
          <IconButton
            v-if="row.scheduleStatus === '换班中'"
            content="撤销"
            icon-name="delete"
            color="#F56C6C"
            @click="handleCancelShift(row)"
            title="撤销换班申请"
          />
          <IconButton
            v-else-if="row.scheduleStatus === '已换班'"
            content="已换班"
            icon-name="success"
            color="#C0C4CC"
            disabled
            title="已换班完成"
          />
          <IconButton
            v-else
            content="撤销"
            icon-name="delete"
            color="#C0C4CC"
            disabled
            title="当前状态不可撤销"
          />
        </div>
      </template>

      <!-- 交接日志操作列 -->
      <template #logActions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
            title="查看交接日志详情"
          />

          <!-- 下载按钮 -->
          <IconButton
            content="下载"
            icon-name="download"
            :color="(!row.attachmentCount || row.attachmentCount === 0) ? '#C0C4CC' : ''"
            :disabled="!row.attachmentCount || row.attachmentCount === 0"
            :title="(!row.attachmentCount || row.attachmentCount === 0) ? '暂无附件可下载' : `下载${row.attachmentCount}个附件`"
            @click="handleDownload(row)"
          />

          <!-- 复盘按钮 -->
          <IconButton
            content="复盘"
            icon-name="edit"
            :color="row.handoverStatus !== '已交接' ? '#C0C4CC' : ''"
            :disabled="row.handoverStatus !== '已交接'"
            :title="row.handoverStatus !== '已交接' ? '请先完成交接再进行复盘' : '复盘本次值班情况'"
            @click="handleReview(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow" >
          <el-icon class="tabel-tab-icon" v-if="!scheduleObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="scheduleObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：排班数量{{ scheduleObj.list.length }};
            <template v-if="activeName === '我的排班'">
              今日排班: {{ scheduleObj.list.filter(v => v.scheduleDate === new Date().toISOString().slice(0, 10)).length }};
              未交接: {{ scheduleObj.list.filter(v => v.handoverStatus === '未交接').length }};
              换班中: {{ scheduleObj.list.filter(v => v.scheduleStatus === '换班中').length }};
            </template>
            <template v-if="activeName === '换班申请'">
              待审批: {{ scheduleObj.list.filter(v => v.taskStatus === '待审批').length }};
              已通过: {{ scheduleObj.list.filter(v => v.scheduleStatus === '已换班').length }};
              已驳回: 0;
            </template>
            <template v-if="activeName === '交接日志'">
              已提交: {{ scheduleObj.list.filter(v => v.submitTime).length }};
              有附件: {{ scheduleObj.list.filter(v => v.attachmentCount > 0).length }};
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="scheduleObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.shift-apply-content,
.handover-log-content,
.more-actions-content {
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

  .form-info {
    background-color: #f5f7fa;
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 15px;
    color: #606266;
  }

  .action-textarea {
    margin-bottom: 15px;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;

    .el-button {
      flex: 1;
    }
  }

  .form-tips {
    font-size: 13px;
    color: #909399;
    margin-bottom: 5px;
    line-height: 1.5;
  }

  .warning-tips {
    font-size: 13px;
    color: #e6a23c;
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #fdf6ec;
    border-radius: 4px;
    border-left: 4px solid #e6a23c;
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

  .print-preview {
    font-family: 'Microsoft YaHei', sans-serif;

    h3 {
      margin-bottom: 20px;
    }

    .print-info {
      p {
        margin: 8px 0;
        line-height: 1.6;

        strong {
          width: 100px;
          display: inline-block;
        }
      }
    }

    .print-footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px dashed #e0e0e0;
      text-align: right;
      color: #666;
      font-size: 12px;
    }
  }
}

.common-toolbar-tools {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.table-toolbar-tools {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
}

.tabel-tabs {
  margin-bottom: 10px;
}

/* 禁用状态样式 */
.icon-button-disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}

/* 工具提示样式 */
.el-button[disabled] {
  cursor: not-allowed !important;
  opacity: 0.5;
}

/* 调整IconButton的禁用状态显示 */
:deep(.icon-button-disabled) .el-button {
  background-color: #f5f7fa !important;
  border-color: #e4e7ed !important;
  color: #c0c4cc !important;
  cursor: not-allowed !important;
}

</style>
