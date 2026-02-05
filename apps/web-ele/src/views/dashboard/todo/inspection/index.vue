<!-- index.vue -->
<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElButton, ElDialog } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
// 引入巡检计划详情抽屉组件
import InspectionDetailDrawer from '#/views/dashboard/todo/inspection/detail.vue';

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

// 创建调整计划抽屉
const [AdjustDrawer, adjustDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    adjustDrawerApi.close();
  },
  onConfirm() {
    handleSubmitAdjust();
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空数据
      adjustAction.planCycle = '';
      adjustAction.frequency = '';
      adjustAction.chargeBy = '';
    }
  },
});

// 调整计划相关状态
const adjustAction = reactive({
  title: '调整计划',
  row: null,
  planCycle: '',
  frequency: '',
  chargeBy: '',
  chargeByOptions: [
    { label: '张三', value: '张三' },
    { label: '李四', value: '李四' },
    { label: '王五', value: '王五' },
    { label: '赵六', value: '赵六' },
    { label: '孙七', value: '孙七' },
  ],
  frequencyOptions: [
    { label: '日', value: '日' },
    { label: '周', value: '周' },
    { label: '月', value: '月' },
    { label: '季度', value: '季度' },
    { label: '年', value: '年' },
  ]
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
      inspectionObj.apilist.push(obj);
    } else {
      inspectionObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          inspectionObj.apilist[i] = obj;
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
  exportToExcel(inspectionObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建巡检计划 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑巡检计划 */
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
    text: $t('ui.actionMessage.deleting', [row.planId]),
  });
  try {
    inspectionObj.apilist = inspectionObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.planId]));
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
    inspectionObj.apilist = inspectionObj.apilist.filter(
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

const inspectionObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  inspectionObj.totalShow = !inspectionObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = inspectionObj.apilist;
  if (activeName.value === '待开始') {
    filteredList = inspectionObj.apilist.filter(v => v.moduleType === 'pending');
  } else if (activeName.value === '执行中') {
    filteredList = inspectionObj.apilist.filter(v => v.moduleType === 'dealing');
  } else if (activeName.value === '已归档') {
    filteredList = inspectionObj.apilist.filter(v => v.moduleType === 'archived');
  } else if (activeName.value === '全部计划') {
    filteredList = inspectionObj.apilist;
  }

  inspectionObj.total = filteredList.length;
  inspectionObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return inspectionObj;
};

// 动态获取搜索表单配置
const getCurrentFormSchema = () => {
  let moduleType = 'pending';
  if (activeName.value === '待开始') moduleType = 'pending';
  else if (activeName.value === '执行中') moduleType = 'dealing';
  else if (activeName.value === '已归档') moduleType = 'archived';

  return useFormSchema(moduleType);
};

// 定义 activeName 在 getCurrentFormSchema 之后
const activeName = ref('待开始');

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
  if (activeName.value === '待开始') moduleType = 'pending';
  else if (activeName.value === '执行中') moduleType = 'dealing';
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
    pagerConfig: inspectionObj,
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
  inspectionObj.detailObj = row;
  inspectionDetailDrawerRef.value.open();
};

// 启动计划
const handleStart = (row) => {
  if (row.planStatus === '未开始') {
    const loadingInstance = ElLoading.service({
      text: '启动计划中...',
    });

    try {
      const index = inspectionObj.apilist.findIndex(v => v.id === row.id);
      if (index !== -1) {
        inspectionObj.apilist[index].planStatus = '执行中';
        inspectionObj.apilist[index].currentProgress = '执行中';
        inspectionObj.apilist[index].moduleType = 'dealing';
        inspectionObj.apilist[index].executeTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        inspectionObj.apilist[index].executeBy = row.chargeBy;
        inspectionObj.apilist[index].latestDynamic = '计划已启动，开始执行';
        inspectionObj.apilist[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }

      ElMessage.success('计划启动成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } else {
    ElMessage.warning('只有未开始状态的计划可以启动');
  }
};

// 批量启动计划
const handleBatchStart = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要启动的计划');
    return;
  }

  // 检查是否都为未开始状态
  const selectedRows = inspectionObj.list.filter(v => checkedIds.value.includes(v.id));
  const notPendingRows = selectedRows.filter(v => v.planStatus !== '未开始');

  if (notPendingRows.length > 0) {
    ElMessage.warning('批量启动仅支持未开始状态计划');
    return;
  }

  confirm(`确定要批量启动这${selectedRows.length}条计划吗？`).then(() => {
    const loadingInstance = ElLoading.service({
      text: '批量启动中...',
    });

    try {
      selectedRows.forEach(row => {
        const index = inspectionObj.apilist.findIndex(v => v.id === row.id);
        if (index !== -1) {
          inspectionObj.apilist[index].planStatus = '执行中';
          inspectionObj.apilist[index].currentProgress = '执行中';
          inspectionObj.apilist[index].moduleType = 'dealing';
          inspectionObj.apilist[index].executeTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
          inspectionObj.apilist[index].executeBy = row.chargeBy;
          inspectionObj.apilist[index].latestDynamic = '计划已批量启动';
          inspectionObj.apilist[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
      });

      ElMessage.success(`批量启动成功，共启动${selectedRows.length}条计划`);
      checkedIds.value = [];
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

// 调整计划
const handleAdjust = (row) => {
  if (row.planStatus !== '未开始') {
    ElMessage.warning('只有未开始状态的计划可以调整');
    return;
  }

  adjustAction.row = row;
  adjustAction.planCycle = row.planCycle;
  adjustAction.frequency = row.frequency;
  adjustAction.chargeBy = row.chargeBy;
  adjustDrawerApi.open();
};

// 提交调整
const handleSubmitAdjust = () => {
  if (!adjustAction.planCycle || !adjustAction.frequency || !adjustAction.chargeBy) {
    ElMessage.error('请填写所有必填项');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '调整计划中...',
  });

  try {
    const index = inspectionObj.apilist.findIndex(v => v.id === adjustAction.row.id);
    if (index !== -1) {
      inspectionObj.apilist[index].planCycle = adjustAction.planCycle;
      inspectionObj.apilist[index].frequency = adjustAction.frequency;
      inspectionObj.apilist[index].chargeBy = adjustAction.chargeBy;
      inspectionObj.apilist[index].latestDynamic = '计划参数已调整';
      inspectionObj.apilist[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    ElMessage.success('计划调整成功');
    adjustDrawerApi.close();
    handleRefresh();
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
    const index = inspectionObj.apilist.findIndex(v => v.id === reviewDialog.row.id);
    if (index !== -1) {
      inspectionObj.apilist[index].reviewOpinion = reviewDialog.reviewOpinion;
      inspectionObj.apilist[index].latestDynamic = '复盘意见已更新';
    }

    ElMessage.success('复盘意见已提交');
    reviewDialog.visible = false;
  } finally {
    loadingInstance.close();
  }
};

// 删除计划
const handleDeletePlan = (row) => {
  confirm('确定要删除此计划吗？删除后不可恢复。').then(() => {
    const loadingInstance = ElLoading.service({
      text: '删除中...',
    });

    try {
      inspectionObj.apilist = inspectionObj.apilist.filter(v => v.id !== row.id);
      ElMessage.success('删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

// 批量删除计划
const handleBatchDeletePlan = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的计划');
    return;
  }

  confirm(`确定要删除这${checkedIds.value.length}条计划吗？删除后不可恢复。`).then(() => {
    const loadingInstance = ElLoading.service({
      text: '批量删除中...',
    });

    try {
      inspectionObj.apilist = inspectionObj.apilist.filter(v => !checkedIds.value.includes(v.id));
      checkedIds.value = [];
      ElMessage.success('批量删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  });
};

// 跟踪执行进度
const handleTrack = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要跟踪的计划');
    return;
  }

  const selectedRows = inspectionObj.list.filter(v => checkedIds.value.includes(v.id));
  console.log('批量查看执行进度:', selectedRows);
  ElMessage.info(`已选中${selectedRows.length}条计划进行跟踪`);
};

const tabsData = ref([
  { label: '待开始' },
  { label: '执行中' },
  { label: '已归档' },
  { label: '全部计划' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '待开始') {
    count = inspectionObj.apilist.filter((v) => v.moduleType === 'pending').length;
  } else if (item.label === '执行中') {
    count = inspectionObj.apilist.filter((v) => v.moduleType === 'dealing').length;
  } else if (item.label === '已归档') {
    count = inspectionObj.apilist.filter((v) => v.moduleType === 'archived').length;
  } else if (item.label === '全部计划') {
    count = inspectionObj.apilist.length;
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
const inspectionDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <InspectionDetailDrawer
      ref="inspectionDetailDrawerRef"
      :detail-obj="inspectionObj.detailObj"
      :title="`巡检计划详情 - ${inspectionObj.detailObj.planId}`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 调整计划抽屉 -->
    <AdjustDrawer title="调整计划">
      <div class="dispose-action-content">
        <div class="action-form">
          <div class="form-title">计划周期<span class="required">*</span>：</div>
          <el-input
            v-model="adjustAction.planCycle"
            placeholder="请输入计划周期，如：2026-01-01 至 2026-12-31"
            class="action-input"
          />
          <div class="form-title" style="margin-top: 15px;">巡检频次<span class="required">*</span>：</div>
          <el-select
            v-model="adjustAction.frequency"
            placeholder="请选择巡检频次"
            class="w-full"
          >
            <el-option
              v-for="item in adjustAction.frequencyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-title" style="margin-top: 15px;">负责人<span class="required">*</span>：</div>
          <el-select
            v-model="adjustAction.chargeBy"
            placeholder="请选择负责人"
            class="w-full"
            filterable
          >
            <el-option
              v-for="item in adjustAction.chargeByOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-tips">计划ID：{{ adjustAction.row?.planId }}</div>
          <div class="form-tips">计划名称：{{ adjustAction.row?.planName }}</div>
          <div class="form-tips">巡检类型：{{ adjustAction.row?.taskType }}</div>
          <div class="form-tips">巡检范围：{{ adjustAction.row?.inspectionRange }}</div>
          <div class="form-tips" style="color: #e6a23c;">仅未开始状态计划可调整，调整后需重新启动</div>
        </div>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="drawer-footer">
          <ElButton @click="adjustDrawerApi.close">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSubmitAdjust"
            :disabled="!adjustAction.planCycle || !adjustAction.frequency || !adjustAction.chargeBy"
          >
            保存调整
          </ElButton>
        </div>
      </template>
    </AdjustDrawer>

    <!-- 复盘弹窗 -->
    <ElDialog
      v-model="reviewDialog.visible"
      title="计划复盘"
      width="500px"
    >
      <div class="dialog-content">
        <p style="margin-bottom: 10px;">复盘意见（可选）：</p>
        <el-input
          v-model="reviewDialog.reviewOpinion"
          type="textarea"
          :rows="5"
          placeholder="请输入复盘意见，可用于优化巡检计划流程"
          maxlength="500"
          show-word-limit
        />
        <p style="margin-top: 15px; color: #909399; font-size: 13px;">计划ID：{{ reviewDialog.row?.planId }}</p>
        <p style="color: #909399; font-size: 13px;">执行时长：{{ reviewDialog.row?.executeDuration }}</p>
        <p style="color: #909399; font-size: 13px;">发现问题：{{ reviewDialog.row?.problemCount }}</p>
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
          <!-- 待开始模块按钮 -->
          <template v-if="activeName === '待开始'">
            <IconButton
              content="批量启动"
              icon-name="check"
              color="#67C23A"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchStart"
            />
          </template>

          <!-- 执行中模块按钮 -->
          <template v-if="activeName === '执行中'">
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
              @click="handleBatchDeletePlan"
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

      <!-- 计划ID列模板 -->
      <template #planId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.planId }}
        </el-text>
      </template>

      <template #planName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          style="cursor: pointer;"
          :type="row.planStatus === '未开始' ? 'primary' : ''"
          :class="row.planStatus === '未开始' ? 'plan-pending' : ''"
        >
          {{ row.planName }}
        </el-text>
      </template>

      <template #taskType="{ row }">
        <el-tag
          size="small"
          @click="gridApi.query({ taskType: row.taskType })"
          style="cursor: pointer;"
        >
          {{ row.taskType }}
        </el-tag>
      </template>

      <template #frequency="{ row }">
        <el-tag
          :type="row.frequency === '日' ? 'danger' :
                 row.frequency === '周' ? 'warning' :
                 row.frequency === '月' ? 'primary' : 'info'"
          size="small"
          @click="gridApi.query({ frequency: row.frequency })"
          style="cursor: pointer;"
        >
          {{ row.frequency }}
        </el-tag>
      </template>

      <template #chargeBy="{ row }">
        <el-text
          v-if="row.chargeBy"
          @click="gridApi.query({ chargeBy: row.chargeBy })"
          style="cursor: pointer;"
          type="primary"
        >
          {{ row.chargeBy }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #currentProgress="{ row }">
        <el-tag
          :type="row.currentProgress === '未开始' ? 'info' :
                 row.currentProgress === '执行中' ? 'primary' :
                 row.currentProgress === '暂停' ? 'warning' :
                 row.currentProgress === '待验收' ? 'info' :
                 row.currentProgress === '已完成' ? 'success' : 'info'"
          size="small"
          @click="gridApi.query({ currentProgress: row.currentProgress })"
          style="cursor: pointer;"
        >
          {{ row.currentProgress }}
        </el-tag>
      </template>

      <template #planStatus="{ row }">
        <el-tag
          :type="row.planStatus === '未开始' ? 'info' :
                 row.planStatus === '执行中' ? 'primary' :
                 row.planStatus === '已完成' ? 'success' :
                 row.planStatus === '已取消' ? 'warning' : 'info'"
          size="small"
          @click="gridApi.query({ planStatus: row.planStatus })"
          style="cursor: pointer;"
        >
          {{ row.planStatus }}
        </el-tag>
      </template>

      <!-- 待开始操作列 -->
      <template #pendingActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="调整"
            icon-name="edit"
            @click="handleAdjust(row)"
          />
          <IconButton
            content="启动"
            icon-name="check"
            color="#67C23A"
            @click="handleStart(row)"
          />
        </div>
      </template>

      <!-- 执行中操作列 -->
      <template #dealingActions="{ row }">
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
            @click="handleDeletePlan(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!inspectionObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="inspectionObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：计划数量{{ inspectionObj.list.length }};
            <template v-if="activeName === '待开始'">
              日常巡检: {{ inspectionObj.list.filter(v => v.frequency === '日').length }};
              周度巡检: {{ inspectionObj.list.filter(v => v.frequency === '周').length }};
            </template>
            <template v-if="activeName === '执行中'">
              执行中: {{ inspectionObj.list.filter(v => v.currentProgress === '执行中').length }};
              待验收: {{ inspectionObj.list.filter(v => v.currentProgress === '待验收').length }};
            </template>
            <template v-if="activeName === '已归档'">
              已完成: {{ inspectionObj.list.filter(v => v.planStatus === '已完成').length }};
              已取消: {{ inspectionObj.list.filter(v => v.planStatus === '已取消').length }};
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="inspectionObj.totalShow">
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

  .action-input {
    margin-bottom: 15px;
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

.dialog-content {
  .required {
    color: #f56c6c;
    margin-left: 2px;
  }
}

.plan-pending {
  font-weight: 500;
  color: #409eff !important;
}
</style>
