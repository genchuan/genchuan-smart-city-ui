<!-- index.vue -->
<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElButton } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
// 引入封装后的详情抽屉组件
import ApproveDetailDrawer from '#/views/dashboard/todo/approve/detail.vue';

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

// 创建审批操作抽屉（用于同意/驳回）
const [ApproveActionDrawer, approveActionDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    approveActionDrawerApi.close();
  },
  onConfirm() {
    handleSubmitApprove();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      approveAction.opinion = '';
      approveAction.rejectReason = '';
    }
  },
});

// 创建批量审批操作抽屉
const [BatchApproveDrawer, batchApproveDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    batchApproveDrawerApi.close();
  },
  onConfirm() {
    handleSubmitBatchApprove();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      batchApproveAction.opinion = '';
    }
  },
});

// 审批相关状态
const approveAction = reactive({
  type: 'agree', // agree: 同意, reject: 驳回
  title: '',
  row: null,
  opinion: '',
  rejectReason: '',
});

// 批量审批相关状态
const batchApproveAction = reactive({
  type: 'agree',
  title: '',
  rows: [],
  opinion: '',
});

// 复盘弹窗（保持原有对话框）
const reviewDialog = reactive({
  visible: false,
  row: null,
  reviewOpinion: '',
});

// 重提弹窗（保持原有对话框）
const resubmitDialog = reactive({
  visible: false,
  row: null,
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
      taskObj.apilist.push(obj);
    } else {
      taskObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          taskObj.apilist[i] = obj;
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
  exportToExcel(taskObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建审批 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑审批 */
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
    text: $t('ui.actionMessage.deleting', [row.approveTitle]),
  });
  try {
    taskObj.apilist = taskObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.approveTitle]));
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
    taskObj.apilist = taskObj.apilist.filter(
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

const taskObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  taskObj.totalShow = !taskObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = taskObj.apilist;
  if (activeName.value === '待我审批') {
    filteredList = taskObj.apilist.filter(v => v.moduleType === 'waiting');
  } else if (activeName.value === '我已审批') {
    filteredList = taskObj.apilist.filter(v => v.moduleType === 'approved');
  } else if (activeName.value === '我发起的') {
    filteredList = taskObj.apilist.filter(v => v.moduleType === 'myApply');
  } else if (activeName.value === '抄送我的') {
    filteredList = taskObj.apilist.filter(v => v.moduleType === 'copy');
  } else if (activeName.value === '全部审批') {
    filteredList = taskObj.apilist;
  }

  taskObj.total = filteredList.length;
  taskObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return taskObj;
};

// 动态获取搜索表单配置
const getCurrentFormSchema = () => {
  let moduleType = 'waiting';
  if (activeName.value === '待我审批') moduleType = 'waiting';
  else if (activeName.value === '我已审批') moduleType = 'approved';
  else if (activeName.value === '我发起的') moduleType = 'myApply';
  else if (activeName.value === '抄送我的') moduleType = 'copy';

  return useFormSchema(moduleType);
};

// 定义 activeName 在 getCurrentFormSchema 之后
const activeName = ref('待我审批');

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
  let moduleType = 'waiting';
  if (activeName.value === '待我审批') moduleType = 'waiting';
  else if (activeName.value === '我已审批') moduleType = 'approved';
  else if (activeName.value === '我发起的') moduleType = 'myApply';
  else if (activeName.value === '抄送我的') moduleType = 'copy';

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
    pagerConfig: taskObj,
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
  taskObj.detailObj = row;
  approveDetailDrawerRef.value.open();
};

// 同意审批 - 使用抽屉
const handleAgree = (row) => {
  approveAction.type = 'agree';
  approveAction.title = '同意审批';
  approveAction.row = row;
  approveAction.opinion = '';
  approveAction.rejectReason = '';
  approveActionDrawerApi.open();
};

// 驳回审批 - 使用抽屉
const handleReject = (row) => {
  approveAction.type = 'reject';
  approveAction.title = '驳回审批';
  approveAction.row = row;
  approveAction.opinion = '';
  approveAction.rejectReason = '';
  approveActionDrawerApi.open();
};

// 提交审批
const handleSubmitApprove = () => {
  if (approveAction.type === 'reject' && !approveAction.rejectReason) {
    ElMessage.error('驳回理由不能为空');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '提交审批中...',
  });

  try {
    // 更新审批状态
    const index = taskObj.apilist.findIndex(v => v.id === approveAction.row.id);
    if (index !== -1) {
      taskObj.apilist[index].approveResult = approveAction.type === 'agree' ? '同意' : '驳回';
      taskObj.apilist[index].approveTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
      taskObj.apilist[index].opinion = approveAction.type === 'agree' ? approveAction.opinion : approveAction.rejectReason;
      taskObj.apilist[index].approveStatus = '已完成';
      taskObj.apilist[index].moduleType = 'approved';

      if (approveAction.type === 'reject') {
        taskObj.apilist[index].rejectReason = approveAction.rejectReason;
      }
    }

    ElMessage.success(approveAction.type === 'agree' ? '审批同意成功' : '审批驳回成功');
    approveActionDrawerApi.close();
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 批量审批 - 使用抽屉
const handleBatchApprove = (type) => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要审批的事项');
    return;
  }

  // 检查是否为同类型事项
  const selectedRows = taskObj.list.filter(v => checkedIds.value.includes(v.id));
  const businessTypes = [...new Set(selectedRows.map(v => v.businessType))];

  if (businessTypes.length > 1) {
    ElMessage.warning('批量审批仅支持同类型事项');
    return;
  }

  batchApproveAction.type = type;
  batchApproveAction.title = type === 'agree' ? '批量同意审批' : '批量驳回审批';
  batchApproveAction.rows = selectedRows;
  batchApproveAction.opinion = '';
  batchApproveDrawerApi.open();
};

// 提交批量审批
const handleSubmitBatchApprove = () => {
  if (batchApproveAction.type === 'reject' && !batchApproveAction.opinion) {
    ElMessage.error('驳回理由不能为空');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '批量审批中...',
  });

  try {
    batchApproveAction.rows.forEach(row => {
      const index = taskObj.apilist.findIndex(v => v.id === row.id);
      if (index !== -1) {
        taskObj.apilist[index].approveResult = batchApproveAction.type === 'agree' ? '同意' : '驳回';
        taskObj.apilist[index].approveTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        taskObj.apilist[index].opinion = batchApproveAction.opinion;
        taskObj.apilist[index].approveStatus = '已完成';
        taskObj.apilist[index].moduleType = 'approved';

        if (batchApproveAction.type === 'reject') {
          taskObj.apilist[index].rejectReason = batchApproveAction.opinion;
        }
      }
    });

    ElMessage.success(`批量${batchApproveAction.type === 'agree' ? '同意' : '驳回'}成功`);
    batchApproveDrawerApi.close();
    checkedIds.value = [];
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
};

// 审批复盘
const handleReview = (row) => {
  reviewDialog.row = row;
  reviewDialog.reviewOpinion = '';
  reviewDialog.visible = true;
};

// 提交复盘
const handleSubmitReview = () => {
  const loadingInstance = ElLoading.service({
    text: '提交复盘中...',
  });

  try {
    const index = taskObj.apilist.findIndex(v => v.id === reviewDialog.row.id);
    if (index !== -1) {
      taskObj.apilist[index].opinion = reviewDialog.reviewOpinion + ' (复盘意见)';
    }

    ElMessage.success('复盘意见已提交');
    reviewDialog.visible = false;
  } finally {
    loadingInstance.close();
  }
};

// 撤回审批
const handleWithdraw = (row) => {
  // 检查是否已进入下一节点
  if (row.currentNode !== '部门主管审批') {
    ElMessage.warning('审批已进入下一节点，不可撤回');
    return;
  }

  confirm('确定要撤回此审批吗？').then(() => {
    const loadingInstance = ElLoading.service({
      text: '撤回审批中...',
    });

    try {
      const index = taskObj.apilist.findIndex(v => v.id === row.id);
      if (index !== -1) {
        taskObj.apilist[index].approveStatus = '已撤回';
        taskObj.apilist[index].latestDynamic = '发起人已撤回';
      }

      ElMessage.success('撤回成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

// 重提审批
const handleResubmit = (row) => {
  if (row.approveStatus !== '已驳回') {
    ElMessage.warning('只有被驳回的审批才能重提');
    return;
  }

  resubmitDialog.row = row;
  resubmitDialog.visible = true;

  // 实际项目中这里应该跳转到编辑页面
  setTimeout(() => {
    ElMessage.success('已跳转到编辑页面，请修改后重新提交');
    resubmitDialog.visible = false;
  }, 1500);
};

// 标记为已读
const handleMarkRead = (row) => {
  const index = taskObj.apilist.findIndex(v => v.id === row.id);
  if (index !== -1) {
    taskObj.apilist[index].copyStatus = '已读';
  }
  ElMessage.success('已标记为已读');
};

// 批量标记为已读
const handleBatchMarkRead = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要标记的事项');
    return;
  }

  checkedIds.value.forEach(id => {
    const index = taskObj.apilist.findIndex(v => v.id === id);
    if (index !== -1 && taskObj.apilist[index].moduleType === 'copy') {
      taskObj.apilist[index].copyStatus = '已读';
    }
  });

  ElMessage.success(`已标记${checkedIds.value.length}条为已读`);
  checkedIds.value = [];
};

// 删除抄送
const handleDeleteCopy = (row) => {
  confirm('确定要删除此抄送事项吗？').then(() => {
    const loadingInstance = ElLoading.service({
      text: '删除中...',
    });

    try {
      taskObj.apilist = taskObj.apilist.filter(v => v.id !== row.id);
      ElMessage.success('删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

// 批量删除抄送
const handleBatchDeleteCopy = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的事项');
    return;
  }

  confirm(`确定要删除这${checkedIds.value.length}条抄送事项吗？`).then(() => {
    const loadingInstance = ElLoading.service({
      text: '批量删除中...',
    });

    try {
      taskObj.apilist = taskObj.apilist.filter(v => !checkedIds.value.includes(v.id));
      checkedIds.value = [];
      ElMessage.success('批量删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

const tabsData = ref([
  { label: '待我审批' },
  { label: '我已审批' },
  { label: '我发起的' },
  { label: '抄送我的' },
  { label: '全部审批' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '待我审批') {
    count = taskObj.apilist.filter((v) => v.moduleType === 'waiting').length;
  } else if (item.label === '我已审批') {
    count = taskObj.apilist.filter((v) => v.moduleType === 'approved').length;
  } else if (item.label === '我发起的') {
    count = taskObj.apilist.filter((v) => v.moduleType === 'myApply').length;
  } else if (item.label === '抄送我的') {
    count = taskObj.apilist.filter((v) => v.moduleType === 'copy').length;
  } else if (item.label === '全部审批') {
    count = taskObj.apilist.length;
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
const approveDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <ApproveDetailDrawer
      ref="approveDetailDrawerRef"
      :detail-obj="taskObj.detailObj"
      :title="`审批详情 - ${taskObj.detailObj.approveTitle}`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 审批操作抽屉（同意/驳回） -->
    <ApproveActionDrawer :title="approveAction.title">
      <div class="approve-action-content">
        <div v-if="approveAction.type === 'agree'" class="action-form">
          <div class="form-title">审批意见（可选）：</div>
          <el-input
            v-model="approveAction.opinion"
            type="textarea"
            :rows="5"
            placeholder="请输入审批意见"
            maxlength="500"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-tips">审批标题：{{ approveAction.row?.approveTitle }}</div>
          <div class="form-tips">申请人：{{ approveAction.row?.applicant }}</div>
          <div class="form-tips">紧急程度：{{ approveAction.row?.emergencyDegree }}</div>
        </div>
        <div v-else class="action-form">
          <div class="form-title">驳回理由<span class="required">*</span>：</div>
          <el-input
            v-model="approveAction.rejectReason"
            type="textarea"
            :rows="5"
            placeholder="请输入驳回理由"
            maxlength="300"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-tips" style="color: #f56c6c;">请务必填写详细驳回理由</div>
          <div class="form-tips">审批标题：{{ approveAction.row?.approveTitle }}</div>
          <div class="form-tips">申请人：{{ approveAction.row?.applicant }}</div>
          <div class="form-tips">紧急程度：{{ approveAction.row?.emergencyDegree }}</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="approveActionDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitApprove"
            :disabled="approveAction.type === 'reject' && !approveAction.rejectReason"
          >
            {{ approveAction.type === 'agree' ? '确认同意' : '确认驳回' }}
          </ElButton>
        </div>
      </template>
    </ApproveActionDrawer>

    <!-- 批量审批操作抽屉 -->
    <BatchApproveDrawer :title="batchApproveAction.title">
      <div class="approve-action-content">
        <div v-if="batchApproveAction.type === 'agree'" class="action-form">
          <div class="form-title">批量审批意见（可选）：</div>
          <el-input
            v-model="batchApproveAction.opinion"
            type="textarea"
            :rows="5"
            placeholder="请输入审批意见"
            maxlength="500"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-tips">将批量处理 {{ batchApproveAction.rows.length }} 条审批事项</div>
          <div class="form-tips">业务类型：{{ batchApproveAction.rows[0]?.businessType }}</div>
          <div class="form-tips">涉及申请人：{{ [...new Set(batchApproveAction.rows.map(r => r.applicant))].join('、') }}</div>
        </div>
        <div v-else class="action-form">
          <div class="form-title">批量驳回理由<span class="required">*</span>：</div>
          <el-input
            v-model="batchApproveAction.opinion"
            type="textarea"
            :rows="5"
            placeholder="请输入驳回理由"
            maxlength="300"
            show-word-limit
            class="action-textarea"
          />
          <div class="form-tips" style="color: #f56c6c;">请务必填写详细驳回理由</div>
          <div class="form-tips">将批量处理 {{ batchApproveAction.rows.length }} 条审批事项</div>
          <div class="form-tips">业务类型：{{ batchApproveAction.rows[0]?.businessType }}</div>
          <div class="form-tips">涉及申请人：{{ [...new Set(batchApproveAction.rows.map(r => r.applicant))].join('、') }}</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="batchApproveDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitBatchApprove"
            :disabled="batchApproveAction.type === 'reject' && !batchApproveAction.opinion"
          >
            {{ batchApproveAction.type === 'agree' ? '确认批量同意' : '确认批量驳回' }}
          </ElButton>
        </div>
      </template>
    </BatchApproveDrawer>

    <!-- 复盘弹窗（保持原有对话框） -->
    <ElDialog
      v-model="reviewDialog.visible"
      title="审批复盘"
      width="500px"
    >
      <p style="margin-bottom: 10px;">复盘意见（可选）：</p>
      <el-input
        v-model="reviewDialog.reviewOpinion"
        type="textarea"
        :rows="4"
        placeholder="请输入复盘意见"
        maxlength="500"
        show-word-limit
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialog.visible = false">关闭</el-button>
          <el-button type="primary" @click="handleSubmitReview">保存</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 重提弹窗（保持原有对话框） -->
    <ElDialog
      v-model="resubmitDialog.visible"
      title="重提审批"
      width="400px"
    >
      <p>确定要重新提交此审批吗？</p>
      <p style="color: #e6a23c; margin-top: 10px;">重提将生成新的审批记录</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resubmitDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="resubmitDialog.visible = false">提交</el-button>
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
          <!-- 待我审批模块按钮 -->
          <template v-if="activeName === '待我审批'">
            <IconButton
              content="批量同意"
              icon-name="check"
              color="#67C23A"
              :disabled="isEmpty(checkedIds)"
              @click="() => handleBatchApprove('agree')"
            />
            <IconButton
              content="批量驳回"
              icon-name="close"
              color="#F56C6C"
              :disabled="isEmpty(checkedIds)"
              @click="() => handleBatchApprove('reject')"
            />
          </template>

          <!-- 我已审批模块按钮 -->
          <template v-if="activeName === '我已审批'">
            <IconButton
              content="导出"
              icon-name="download"
              @click="handleExport"
            />
          </template>

          <!-- 我发起的模块按钮 -->
          <template v-if="activeName === '我发起的'">
            <IconButton
              content="发起审批"
              icon-name="Plus"
              @click="handleCreate"
            />
          </template>

          <!-- 抄送我的模块按钮 -->
          <template v-if="activeName === '抄送我的'">
            <IconButton
              content="批量标读"
              icon-name="read"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchMarkRead"
            />
            <IconButton
              content="批量删除"
              icon-name="delete"
              color="#F56C6C"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchDeleteCopy"
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

      <!-- 待我审批列模板 -->
      <template #approveTitle="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.approveTitle }}
        </el-text>
      </template>

      <template #businessType="{ row }">
        <el-tag
          size="small"
          @click="gridApi.query({ businessType: row.businessType })"
          style="cursor: pointer;"
        >
          {{ row.businessType }}
        </el-tag>
      </template>

      <template #applicant="{ row }">
        <el-text
          @click="gridApi.query({ applicant: row.applicant })"
          style="cursor: pointer;"
          type="primary"
        >
          {{ row.applicant }}
        </el-text>
      </template>

      <template #emergencyDegree="{ row }">
        <el-tag
          :type="row.emergencyDegree === '紧急' ? 'danger' :
                 row.emergencyDegree === '高' ? 'warning' :
                 row.emergencyDegree === '中' ? 'primary' : 'info'"
          size="small"
          @click="gridApi.query({ emergencyDegree: row.emergencyDegree })"
          style="cursor: pointer;"
        >
          {{ row.emergencyDegree }}
        </el-tag>
      </template>

      <template #attachmentCount="{ row }">
        <span v-if="row.attachmentCount > 0">
          <el-icon><Document /></el-icon> {{ row.attachmentCount }}
        </span>
        <span v-else>-</span>
      </template>

      <template #approveResult="{ row }">
        <el-tag
          :type="row.approveResult === '同意' ? 'success' : 'danger'"
          size="small"
          @click="gridApi.query({ approveResult: row.approveResult })"
          style="cursor: pointer;"
        >
          {{ row.approveResult }}
        </el-tag>
      </template>

      <template #approveStatus="{ row }">
        <el-tag
          :type="row.approveStatus === '待审批' ? 'info' :
                 row.approveStatus === '处理中' ? 'primary' :
                 row.approveStatus === '已完成' ? 'success' :
                 row.approveStatus === '已驳回' ? 'danger' :
                 row.approveStatus === '已撤回' ? 'warning' : 'info'"
          size="small"
          @click="gridApi.query({ approveStatus: row.approveStatus })"
          style="cursor: pointer;"
        >
          {{ row.approveStatus }}
        </el-tag>
      </template>

      <template #copyStatus="{ row }">
        <el-tag
          :type="row.copyStatus === '未读' ? 'danger' : 'success'"
          size="small"
        >
          {{ row.copyStatus }}
        </el-tag>
      </template>

      <!-- 待我审批操作列 -->
      <template #waitingActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="同意"
            icon-name="check"
            color="#67C23A"
            @click="handleAgree(row)"
          />
          <IconButton
            content="驳回"
            icon-name="close"
            color="#F56C6C"
            @click="handleReject(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
        </div>
      </template>

      <!-- 我已审批操作列 -->
      <template #approvedActions="{ row }">
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
            @click="ElMessage.info('开始下载附件')"
          />
          <IconButton
            content="复盘"
            icon-name="edit"
            @click="handleReview(row)"
          />
        </div>
      </template>

      <!-- 我发起的操作列 -->
      <template #myApplyActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="跟踪"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="撤回"
            icon-name="delete"
            color="#E6A23C"
            v-if="row.approveStatus === '待审批' || row.approveStatus === '处理中'"
            @click="handleWithdraw(row)"
          />
          <IconButton
            content="重提"
            icon-name="refresh"
            color="#67C23A"
            v-if="row.approveStatus === '已驳回'"
            @click="handleResubmit(row)"
          />
        </div>
      </template>

      <!-- 抄送我的操作列 -->
      <template #copyActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="标读"
            icon-name="read"
            v-if="row.copyStatus === '未读'"
            @click="handleMarkRead(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDeleteCopy(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!taskObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="taskObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：审批数量{{ taskObj.list.length }};
            <template v-if="activeName === '待我审批'">
              紧急事项: {{ taskObj.list.filter(v => v.emergencyDegree === '紧急').length }};
              高紧急度: {{ taskObj.list.filter(v => v.emergencyDegree === '高').length }};
            </template>
            <template v-if="activeName === '我已审批'">
              同意: {{ taskObj.list.filter(v => v.approveResult === '同意').length }};
              驳回: {{ taskObj.list.filter(v => v.approveResult === '驳回').length }};
            </template>
            <template v-if="activeName === '我发起的'">
              待审批: {{ taskObj.list.filter(v => v.approveStatus === '待审批').length }};
              处理中: {{ taskObj.list.filter(v => v.approveStatus === '处理中').length }};
            </template>
            <template v-if="activeName === '抄送我的'">
              未读: {{ taskObj.list.filter(v => v.copyStatus === '未读').length }};
              已读: {{ taskObj.list.filter(v => v.copyStatus === '已读').length }};
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="taskObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.approve-action-content {
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
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
