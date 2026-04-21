<!-- table/index.vue -->
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useVbenDrawer, confirm } from '@vben/common-ui';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportToExcel } from '#/utils/excel.js';
import ApproveDetailDrawer from './detail.vue';

// 使用标准 BPM API
import {
  getTaskTodoPage,
  getTaskDonePage,
  getTaskManagerPage,
  approveTask,
  rejectTask,
  withdrawTask,
  copyTask,
} from '#/api/bpm/task';
import {
  getProcessInstanceMyPage,
  getProcessInstanceCopyPage,
  createProcessInstance,
  getApprovalDetail,
} from '#/api/bpm/processInstance';
import { getSimpleProcessDefinitionList } from '#/api/bpm/definition';

import { useFormSchema, useQuerySchema, useGridColumns, textObj } from './data.js';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const activeName = ref('待我审批');
const searchParams = ref({});
const checkedIds = ref([]);
const detailDrawerRef = ref(null);
const detailObj = ref({});
const processDefinitions = ref([]);

// 仿充电桩模块：使用 reactive 对象统一存储列表、总数、分页信息
const dataObj = reactive({
  list: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

const approveAction = reactive({ visible: false, type: 'agree', row: null, opinion: '', rejectReason: '' });
const reviewDialog = reactive({ visible: false, row: null, reviewOpinion: '' });
const resubmitDialog = reactive({ visible: false, row: null });

// ==================== 表格数据获取 ====================
const getTableData = async ({ page }) => {
  console.log('🚀 getTableData 被调用，模块：', activeName.value, 'page:', page);
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  try {
    let res;
    switch (activeName.value) {
      case '待我审批':
        console.log('📡 调用 getTaskTodoPage，参数：', params);
        res = await getTaskTodoPage(params);
        console.log('✅ getTaskTodoPage 返回：', res);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          approveTitle: item.name,
          businessType: item.processInstance?.processDefinition?.categoryName || '通用',
          applicant: item.processInstance?.startUser?.nickname || item.ownerUser?.nickname || '-',
          applyTime: item.createTime,
          deadline: item.processInstance?.variables?.deadline || '-',
          emergencyDegree: item.processInstance?.variables?.emergencyDegree || '中',
          processInstanceId: item.processInstanceId,
          taskId: item.id,
        }));
        break;
      case '我已审批':
        console.log('📡 调用 getTaskDonePage，参数：', params);
        res = await getTaskDonePage(params);
        console.log('✅ getTaskDonePage 返回：', res);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          approveTitle: item.name,
          businessType: item.processInstance?.processDefinition?.categoryName || '通用',
          applicant: item.processInstance?.startUser?.nickname || '-',
          applyTime: item.createTime,
          approveResult: item.status === 2 ? '同意' : (item.reason ? '驳回' : '同意'),
          approveTime: item.endTime,
          opinion: item.reason,
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '我发起的':
        console.log('📡 调用 getProcessInstanceMyPage，参数：', params);
        res = await getProcessInstanceMyPage(params);
        console.log('✅ getProcessInstanceMyPage 返回：', res);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          approveTitle: item.name,
          businessType: item.categoryName || '通用',
          currentNode: (item.tasks?.length > 0) ? item.tasks[0].name : '已完成',
          approver: (item.tasks?.length > 0) ? item.tasks[0].assigneeUser?.nickname : '-',
          applyTime: item.startTime,
          approveStatus: item.status === 1 ? '处理中' : (item.status === 2 ? '已完成' : '已取消'),
          processInstanceId: item.id,
        }));
        break;
      case '抄送我的':
        console.log('📡 调用 getProcessInstanceCopyPage，参数：', params);
        res = await getProcessInstanceCopyPage(params);
        console.log('✅ getProcessInstanceCopyPage 返回：', res);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          approveTitle: item.processInstanceName,
          businessType: item.categoryName || '通用',
          applicant: item.startUser?.nickname || '-',
          currentNode: item.activityName || '-',
          copyTime: item.createTime,
          flowSummary: item.summary?.map(s => `${s.key}:${s.value}`).join('；') || '-',
          copyStatus: item.readStatus === 0 ? '未读' : '已读',
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '全部审批':
        console.log('📡 调用 getTaskManagerPage，参数：', params);
        res = await getTaskManagerPage(params);
        console.log('✅ getTaskManagerPage 返回：', res);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          approveTitle: item.name,
          businessType: item.processInstance?.processDefinition?.categoryName || '通用',
          assignee: item.assigneeUser?.nickname,
          applyTime: item.createTime,
          deadline: item.processInstance?.variables?.deadline || '-',
          approveStatus: item.status === 0 ? '待处理' : (item.status === 1 ? '处理中' : '已完成'),
          priority: item.processInstance?.variables?.emergencyDegree || '中',
          processInstanceId: item.processInstanceId,
        }));
        break;
      default:
        dataObj.list = [];
        dataObj.total = 0;
    }
    return dataObj;
  } catch (error) {
    console.error('❌ 获取数据失败：', error);
    ElMessage.error('获取数据失败：' + (error.message || '未知错误'));
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

// ==================== 表格配置 ====================
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: () => {
      let type = 'waiting';
      if (activeName.value === '待我审批') type = 'waiting';
      else if (activeName.value === '我已审批') type = 'approved';
      else if (activeName.value === '我发起的') type = 'myApply';
      else if (activeName.value === '抄送我的') type = 'copy';
      return useGridColumns(type);
    },
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, zoom: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxChange: ({ records }) => { checkedIds.value = records.map(r => r.id); },
    checkboxAll: ({ records }) => { checkedIds.value = records.map(r => r.id); },
  },
});

// ==================== 搜索表单 ====================
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = values;
    dataObj.currentPage = 1;
    drawerApi.close();
    gridApi.query();
  },
  layout: 'horizontal',
  schema: () => {
    let type = 'waiting';
    if (activeName.value === '待我审批') type = 'waiting';
    else if (activeName.value === '我已审批') type = 'approved';
    else if (activeName.value === '我发起的') type = 'myApply';
    else if (activeName.value === '抄送我的') type = 'copy';
    return useQuerySchema(type);
  },
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      searchParams.value = {};
      dataObj.currentPage = 1;
      gridApi.query();
    },
  },
});

// ==================== 发起审批表单 ====================
const [Form, formApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => formDrawerApi.close(),
  onConfirm: async () => {
    const values = formApi.form.values;
    if (!values.processDefinitionId) {
      ElMessage.warning('请选择审批流程');
      return;
    }
    const loading = ElLoading.service({ text: '发起审批中...' });
    try {
      await createProcessInstance({
        processDefinitionId: values.processDefinitionId,
        variables: {
          businessType: values.businessType,
          emergencyDegree: values.emergencyDegree,
          deadline: values.deadline,
          reason: values.reason,
          title: values.approveTitle,
        },
      });
      ElMessage.success('发起成功');
      formDrawerApi.close();
      gridApi.query();
    } catch (error) {
      ElMessage.error('发起失败：' + error.message);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      if (processDefinitions.value.length === 0) {
        const res = await getSimpleProcessDefinitionList();
        processDefinitions.value = res.data || [];
      }
      await formApi.updateSchema([
        { fieldName: 'processDefinitionId', componentProps: { options: processDefinitions.value.map(p => ({ label: p.name, value: p.id })) } }
      ]);
      formApi.resetForm();
    }
  },
});

// ==================== 抽屉 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel: () => drawerApi.close(),
});

// ==================== 审批操作 ====================
const openApproveDrawer = (type, row) => {
  approveAction.type = type;
  approveAction.row = row;
  approveAction.opinion = '';
  approveAction.rejectReason = '';
  approveAction.visible = true;
};

const submitApprove = async () => {
  if (approveAction.type === 'reject' && !approveAction.rejectReason) {
    ElMessage.error('驳回理由不能为空');
    return;
  }
  const loading = ElLoading.service({ text: '提交中...' });
  try {
    const taskId = approveAction.row.taskId || approveAction.row.id;
    if (approveAction.type === 'agree') {
      await approveTask({ id: taskId, reason: approveAction.opinion });
    } else {
      await rejectTask({ id: taskId, reason: approveAction.rejectReason });
    }
    ElMessage.success(approveAction.type === 'agree' ? '审批同意成功' : '审批驳回成功');
    approveAction.visible = false;
    gridApi.query();
  } catch (error) {
    ElMessage.error('操作失败：' + error.message);
  } finally {
    loading.close();
  }
};

const handleWithdraw = async (row) => {
  await confirm('确定要撤回此审批吗？');
  const loading = ElLoading.service({ text: '撤回中...' });
  try {
    await withdrawTask(row.taskId || row.id);
    ElMessage.success('撤回成功');
    gridApi.query();
  } catch (error) {
    ElMessage.error('撤回失败：' + error.message);
  } finally {
    loading.close();
  }
};

const handleResubmit = (row) => {
  if (row.approveStatus !== '已驳回') {
    ElMessage.warning('只有被驳回的审批才能重提');
    return;
  }
  resubmitDialog.row = row;
  resubmitDialog.visible = true;
  setTimeout(() => {
    resubmitDialog.visible = false;
    formDrawerApi.open();
  }, 1000);
};

const handleOpenDetail = async (row) => {
  const processInstanceId = row.processInstanceId || row.id;
  if (!processInstanceId) {
    detailObj.value = row;
    detailDrawerRef.value?.open();
    return;
  }
  const loading = ElLoading.service({ text: '加载详情...' });
  try {
    const res = await getApprovalDetail({ processInstanceId });
    detailObj.value = { ...row, ...res.data };
    detailDrawerRef.value?.open();
  } catch (error) {
    detailObj.value = row;
    detailDrawerRef.value?.open();
  } finally {
    loading.close();
  }
};

const handleReview = (row) => {
  reviewDialog.row = row;
  reviewDialog.reviewOpinion = '';
  reviewDialog.visible = true;
};

const submitReview = () => {
  ElMessage.success('复盘意见已提交');
  reviewDialog.visible = false;
};

const handleMarkRead = async (row) => {
  try {
    await copyTask({ id: row.id, readStatus: 1 });
    const idx = dataObj.list.findIndex(v => v.id === row.id);
    if (idx !== -1) dataObj.list[idx].copyStatus = '已读';
    gridApi.refreshData();
    ElMessage.success('已标记为已读');
  } catch (error) {
    ElMessage.error('标记失败：' + error.message);
  }
};

const handleBatchMarkRead = async () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要标记的事项');
    return;
  }
  try {
    for (const id of checkedIds.value) {
      await copyTask({ id, readStatus: 1 });
      const idx = dataObj.list.findIndex(v => v.id === id);
      if (idx !== -1) dataObj.list[idx].copyStatus = '已读';
    }
    gridApi.refreshData();
    ElMessage.success(`已标记${checkedIds.value.length}条为已读`);
    checkedIds.value = [];
  } catch (error) {
    ElMessage.error('批量标记失败：' + error.message);
  }
};

const handleDeleteCopy = (row) => {
  confirm('确定要删除此抄送事项吗？').then(() => {
    dataObj.list = dataObj.list.filter(v => v.id !== row.id);
    dataObj.total = dataObj.list.length;
    gridApi.refreshData();
    ElMessage.success('删除成功');
  });
};

const handleBatchDeleteCopy = () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的事项');
    return;
  }
  confirm(`确定要删除${checkedIds.value.length}条抄送事项吗？`).then(() => {
    dataObj.list = dataObj.list.filter(v => !checkedIds.value.includes(v.id));
    dataObj.total = dataObj.list.length;
    gridApi.refreshData();
    checkedIds.value = [];
    ElMessage.success('批量删除成功');
  });
};

const handleExport = () => {
  exportToExcel(dataObj.list, textObj.excelName, textObj.excelAllName);
};

const handleRefresh = () => gridApi.query();
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const handleCreate = () => formDrawerApi.open();

const handleTabChange = () => {
  queryFormApi.setSchema(() => {
    let type = 'waiting';
    if (activeName.value === '待我审批') type = 'waiting';
    else if (activeName.value === '我已审批') type = 'approved';
    else if (activeName.value === '我发起的') type = 'myApply';
    else if (activeName.value === '抄送我的') type = 'copy';
    return useQuerySchema(type);
  });
  queryFormApi.resetForm();
  searchParams.value = {};
  dataObj.currentPage = 1;
  gridApi.query();
};

const tabsData = ref([
  { label: '待我审批' },
  { label: '我已审批' },
  { label: '我发起的' },
  { label: '抄送我的' },
  { label: '全部审批' },
]);

const createLabel = (item) => `${item.label}`;

onMounted(() => {
  console.log('✅ 审批组件已挂载，开始加载数据...');
  gridApi.query();
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="textObj.addText">
      <Form />
    </FormDrawer>

    <ApproveDetailDrawer ref="detailDrawerRef" :detail-obj="detailObj" />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 审批操作弹窗 -->
    <ElDialog v-model="approveAction.visible" :title="approveAction.type === 'agree' ? '同意审批' : '驳回审批'" width="500px">
      <div v-if="approveAction.type === 'agree'">
        <p style="margin-bottom: 8px;">审批意见（可选）：</p>
        <el-input v-model="approveAction.opinion" type="textarea" :rows="4" placeholder="请输入审批意见" maxlength="500" show-word-limit />
      </div>
      <div v-else>
        <p style="margin-bottom: 8px;">驳回理由<span style="color:#f56c6c">*</span>：</p>
        <el-input v-model="approveAction.rejectReason" type="textarea" :rows="4" placeholder="请输入驳回理由" maxlength="300" show-word-limit />
        <p style="color:#f56c6c; font-size:12px; margin-top:8px;">请务必填写详细驳回理由</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveAction.visible = false">取消</el-button>
          <el-button type="primary" @click="submitApprove">确认</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 复盘弹窗 -->
    <ElDialog v-model="reviewDialog.visible" title="审批复盘" width="500px">
      <p style="margin-bottom: 10px;">复盘意见（可选）：</p>
      <el-input v-model="reviewDialog.reviewOpinion" type="textarea" :rows="4" placeholder="请输入复盘意见" maxlength="500" show-word-limit />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialog.visible = false">关闭</el-button>
          <el-button type="primary" @click="submitReview">保存</el-button>
        </span>
      </template>
    </ElDialog>

    <!-- 重提弹窗 -->
    <ElDialog v-model="resubmitDialog.visible" title="重提审批" width="400px">
      <p>确定要重新提交此审批吗？</p>
      <p style="color:#e6a23c; margin-top:10px;">重提将生成新的审批记录</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resubmitDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="resubmitDialog.visible = false; handleCreate()">提交</el-button>
        </span>
      </template>
    </ElDialog>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabChange">
              <el-tab-pane v-for="item in tabsData" :key="item.label" :label="createLabel(item)" :name="item.label" />
            </el-tabs>
          </div>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <template v-if="activeName === '待我审批'">
            <IconButton content="批量同意" icon-name="check" color="#67C23A" :disabled="checkedIds.length === 0" @click="() => openApproveDrawer('agree', { id: checkedIds[0] })" />
            <IconButton content="批量驳回" icon-name="close" color="#F56C6C" :disabled="checkedIds.length === 0" @click="() => openApproveDrawer('reject', { id: checkedIds[0] })" />
          </template>
          <template v-if="activeName === '我已审批'">
            <IconButton content="导出" icon-name="download" @click="handleExport" />
          </template>
          <template v-if="activeName === '我发起的'">
            <IconButton content="发起审批" icon-name="Plus" @click="handleCreate" />
          </template>
          <template v-if="activeName === '抄送我的'">
            <IconButton content="批量标读" icon-name="read" :disabled="checkedIds.length === 0" @click="handleBatchMarkRead" />
            <IconButton content="批量删除" icon-name="delete" color="#F56C6C" :disabled="checkedIds.length === 0" @click="handleBatchDeleteCopy" />
          </template>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
        </div>
      </template>

      <!-- 通用列模板 -->
      <template #approveTitle="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.approveTitle }}</el-text>
      </template>
      <template #businessType="{ row }">
        <el-tag size="small">{{ row.businessType }}</el-tag>
      </template>
      <template #emergencyDegree="{ row }">
        <el-tag :type="row.emergencyDegree === '紧急' ? 'danger' : row.emergencyDegree === '高' ? 'warning' : row.emergencyDegree === '中' ? 'primary' : 'info'" size="small">{{ row.emergencyDegree }}</el-tag>
      </template>
      <template #approveResult="{ row }">
        <el-tag :type="row.approveResult === '同意' ? 'success' : 'danger'" size="small">{{ row.approveResult }}</el-tag>
      </template>
      <template #approveStatus="{ row }">
        <el-tag :type="row.approveStatus === '处理中' ? 'primary' : row.approveStatus === '已完成' ? 'success' : 'danger'" size="small">{{ row.approveStatus }}</el-tag>
      </template>
      <template #copyStatus="{ row }">
        <el-tag :type="row.copyStatus === '未读' ? 'danger' : 'success'" size="small">{{ row.copyStatus }}</el-tag>
      </template>

      <!-- 待我审批操作列 -->
      <template #waitingActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="同意" icon-name="check" color="#67C23A" @click="openApproveDrawer('agree', row)" />
          <IconButton content="驳回" icon-name="close" color="#F56C6C" @click="openApproveDrawer('reject', row)" />
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
        </div>
      </template>

      <!-- 我已审批操作列 -->
      <template #approvedActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="复盘" icon-name="edit" @click="handleReview(row)" />
        </div>
      </template>

      <!-- 我发起的操作列 -->
      <template #myApplyActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="跟踪" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="撤回" icon-name="delete" color="#E6A23C" v-if="row.approveStatus === '处理中'" @click="handleWithdraw(row)" />
          <IconButton content="重提" icon-name="refresh" color="#67C23A" v-if="row.approveStatus === '已驳回'" @click="handleResubmit(row)" />
        </div>
      </template>

      <!-- 抄送我的操作列 -->
      <template #copyActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="标读" icon-name="read" v-if="row.copyStatus === '未读'" @click="handleMarkRead(row)" />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDeleteCopy(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.park-lot-table-new {
  width: 100%;
}
.tabel-tabs {
  margin-bottom: 16px;
}
.common-toolbar-tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.table-toolbar-tools {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>
