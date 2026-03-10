<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportToExcel } from '#/utils/excel.js';
import detailDrawer from './detail.vue';
import {
  dataList,
  textObj,
  useTaskFormSchema,
  getGridColumnsByTab,
  templateList,
  collectTypeList,
  cycleTypeList,
  taskStatusList
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'update-chart']);

const currentTask = ref(null);
const activeTab = ref('全部');

const [TaskForm, taskFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useTaskFormSchema(),
  showDefaultActions: false,
});

const [TaskDrawer, taskDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { taskDrawerApi.close(); },
  onConfirm: async () => {
    const values = taskFormApi.form.values;
    if (!values.name || !values.templateId || !values.objectScope || !values.startTime || !values.endTime || !values.collectTypeId) {
      ElMessage.warning('请填写必填项');
      return;
    }
    const title = taskDrawerApi.sharedData.payload?.title;
    if (title === textObj.addText) {
      const cycleType = cycleTypeList.find(c => c.id === values.cycleId);
      const template = templateList.find(t => t.id === values.templateId);
      const collectType = collectTypeList.find(c => c.id === values.collectTypeId);
      const newTask = {
        taskId: Date.now().toString(),
        name: values.name,
        code: `EVL${Date.now().toString().slice(-4)}`,
        templateId: values.templateId,
        templateName: template?.name,
        objectScope: values.objectScope,
        cycle: cycleType?.name || '',
        cycleId: values.cycleId,
        startTime: values.startTime,
        endTime: values.endTime,
        originalEndTime: values.endTime,
        collectTypeId: values.collectTypeId,
        collectTypeName: collectType?.name,
        statusId: 'ts1',
        statusName: '未启动',
        completeRate: 0,
        totalObject: 0,
        completedObject: 0,
        uncompletedObject: 0,
        createByName: '当前用户',
        createTime: new Date().toLocaleString(),
        updateByName: '当前用户',
        updateTime: new Date().toLocaleString(),
        changeLog: '新建任务'
      };
      dataObj.apilist.push(newTask);
    } else if (title === textObj.editText) {
      const index = dataObj.apilist.findIndex(c => c.taskId === currentTask.value?.taskId);
      if (index !== -1) {
        const cycleType = cycleTypeList.find(c => c.id === values.cycleId);
        const template = templateList.find(t => t.id === values.templateId);
        const collectType = collectTypeList.find(c => c.id === values.collectTypeId);
        dataObj.apilist[index] = {
          ...dataObj.apilist[index],
          ...values,
          templateName: template?.name,
          cycle: cycleType?.name,
          collectTypeName: collectType?.name,
          updateByName: '当前用户',
          updateTime: new Date().toLocaleString(),
          changeLog: (dataObj.apilist[index].changeLog || '') + '；编辑任务'
        };
      }
    }
    handleRefresh();
    taskDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const payload = taskDrawerApi.sharedData.payload;
      if (payload?.title === textObj.editText && payload?.task) {
        currentTask.value = payload.task;
        await taskFormApi.setValues(payload.task);
      } else {
        currentTask.value = null;
        taskFormApi.resetForm();
      }
    }
  }
});

const [ExtendTimeModal, extendTimeModalApi] = useVbenModal({
  onConfirm: async () => {
    const newEndTime = extendTimeFormApi.form.values.newEndTime;
    if (!newEndTime) {
      ElMessage.warning('请选择新的结束时间');
      return;
    }
    const index = dataObj.apilist.findIndex(c => c.taskId === currentTask.value?.taskId);
    if (index !== -1) {
      dataObj.apilist[index].endTime = newEndTime;
      dataObj.apilist[index].updateTime = new Date().toLocaleString();
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；延长时间';
    }
    ElMessage.success('时间已延长');
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      extendTimeFormApi.resetForm();
    }
  }
});

const [ExtendTimeForm, extendTimeFormApi] = useVbenForm({
  schema: [
    {
      fieldName: 'newEndTime',
      label: '新结束时间',
      component: 'DatePicker',
      componentProps: { type: 'datetime', placeholder: '请选择新的结束时间' },
      rules: 'required'
    }
  ],
  showDefaultActions: false
});

const [CancelReasonModal, cancelReasonModalApi] = useVbenModal({
  onConfirm: async () => {
    const cancelReason = cancelReasonFormApi.form.values.cancelReason;
    if (!cancelReason) {
      ElMessage.warning('请填写取消原因');
      return;
    }
    const index = dataObj.apilist.findIndex(c => c.taskId === currentTask.value?.taskId);
    if (index !== -1) {
      dataObj.apilist[index].statusName = '已取消';
      dataObj.apilist[index].statusId = 'ts5';
      dataObj.apilist[index].cancelReason = cancelReason;
      dataObj.apilist[index].cancelTime = new Date().toLocaleString();
      dataObj.apilist[index].cancelByName = '当前用户';
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；取消任务';
    }
    ElMessage.success('任务已取消');
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      cancelReasonFormApi.resetForm();
    }
  }
});

const [CancelReasonForm, cancelReasonFormApi] = useVbenForm({
  schema: [
    {
      fieldName: 'cancelReason',
      label: '取消原因',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '请填写取消原因' },
      rules: 'required'
    }
  ],
  showDefaultActions: false
});

const searchParams = ref({});
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  garageDetail: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const chartData = computed(() => {
  const list = dataObj.apilist;
  const total = list.length;
  const inProgress = list.filter(v => v.statusName === '进行中' || v.statusName === '暂停中').length;
  const totalRate = list.length > 0 ? Math.round(list.reduce((sum, v) => sum + (v.completeRate || 0), 0) / list.length) : 0;
  const notCompleted = list.filter(v => v.statusName !== '已完成' && v.statusName !== '已取消').length;

  const cardList = [
    { title: '总任务数', value: total, color: '#13ce66' },
    { title: '进行中任务', value: inProgress, color: '#409eff' },
    { title: '平均完成率', value: totalRate, color: '#ffc107' },
    { title: '未完成任务数', value: notCompleted, color: '#f56c6c' }
  ];

  const statusMap = {};
  list.forEach(v => { statusMap[v.statusName] = (statusMap[v.statusName] || 0) + 1; });
  const pieData1 = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  const collectTypeMap = {};
  list.forEach(v => { collectTypeMap[v.collectTypeName] = (collectTypeMap[v.collectTypeName] || 0) + 1; });
  const pieData2 = Object.entries(collectTypeMap).map(([name, value]) => ({ name, value }));

  const templateMap = {};
  list.forEach(v => { templateMap[v.templateName] = (templateMap[v.templateName] || 0) + 1; });
  const pieData3 = Object.entries(templateMap).map(([name, value]) => ({ name, value }));

  const cycleMap = {};
  list.forEach(v => { cycleMap[v.cycle] = (cycleMap[v.cycle] || 0) + 1; });
  const barData = {
    xData: Object.keys(cycleMap),
    series: [{ name: '任务数量', data: Object.values(cycleMap) }]
  };

  const lineData = {
    xData: ['10月', '11月', '12月', '1月', '2月', '3月'],
    series: [
      { name: '创建任务', data: [6, 5, 4, 3, 4, 2] },
      { name: '完成任务', data: [5, 4, 3, 3, 3, 1] }
    ]
  };

  return { cardList, pieData1, pieData2, pieData3, barData, lineData };
});

const filterTemplate = ref('');
const filterStatus = ref('');
const filterCode = ref('');

const handleTemplateClick = (templateName) => {
  filterTemplate.value = filterTemplate.value === templateName ? '' : templateName;
  gridApi.query();
};
const handleStatusClick = (statusName) => {
  filterStatus.value = filterStatus.value === statusName ? '' : statusName;
  gridApi.query();
};
const handleCodeClick = (code) => {
  filterCode.value = filterCode.value === code ? '' : code;
  searchParams.value.code = filterCode.value;
  gridApi.query();
};

const getTableData = (pageObj) => {
  const page = pageObj.page;
  let filtered = dataObj.apilist.filter(v => {
    if (activeName.value === '全部') return true;
    return v.statusName === activeName.value;
  });

  const params = searchParams.value;
  if (Object.keys(params).length > 0) {
    filtered = filtered.filter(item => {
      let match = true;
      if (params.name && !item.name.includes(params.name)) match = false;
      if (params.code && !item.code.includes(params.code)) match = false;
      if (params.templateId && item.templateId !== params.templateId) match = false;
      if (params.statusId && item.statusId !== params.statusId) match = false;
      return match;
    });
  }

  if (filterTemplate.value) {
    filtered = filtered.filter(item => item.templateName === filterTemplate.value);
  }
  if (filterStatus.value) {
    filtered = filtered.filter(item => item.statusName === filterStatus.value);
  }

  filtered.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));

  dataObj.total = filtered.length;
  dataObj.list = filtered.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return dataObj;
};

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    { fieldName: 'name', label: '任务名称', component: 'Input' },
    { fieldName: 'code', label: '任务编码', component: 'Input' },
    {
      fieldName: 'templateId',
      label: '关联模板',
      component: 'Select',
      componentProps: {
        options: templateList.map(t => ({ label: t.name, value: t.id }))
      }
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: taskStatusList.map(s => ({ label: s.name, value: s.id }))
      }
    }
  ],
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    }
  }
});

function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumnsByTab('全部'),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'taskId', isHover: true },
    pagerConfig: dataObj,
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

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.taskId);
}

function handleRefresh() {
  gridApi.query();
}

function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

function handleCreate() {
  taskDrawerApi.setData({ title: textObj.addText }).open();
}

function handleEdit(row) {
  if (row.statusName !== '未启动') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能编辑`);
    return;
  }
  taskDrawerApi.setData({ title: textObj.editText, task: row }).open();
}

async function handleStart(row) {
  if (row.statusName !== '未启动') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能启动`);
    return;
  }
  await confirm('确定启动该评价任务吗？');
  const index = dataObj.apilist.findIndex(v => v.taskId === row.taskId);
  if (index !== -1) {
    dataObj.apilist[index].statusName = '进行中';
    dataObj.apilist[index].statusId = 'ts2';
    dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；启动任务';
    dataObj.apilist[index].updateTime = new Date().toLocaleString();
  }
  ElMessage.success('任务已启动');
  handleRefresh();
}

async function handlePause(row) {
  if (row.statusName !== '进行中') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能暂停`);
    return;
  }
  await confirm('确定暂停该评价任务吗？');
  const index = dataObj.apilist.findIndex(v => v.taskId === row.taskId);
  if (index !== -1) {
    dataObj.apilist[index].statusName = '暂停中';
    dataObj.apilist[index].statusId = 'ts3';
    dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；暂停任务';
    dataObj.apilist[index].updateTime = new Date().toLocaleString();
  }
  ElMessage.success('任务已暂停');
  handleRefresh();
}

async function handleResume(row) {
  if (row.statusName !== '暂停中') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能恢复`);
    return;
  }
  await confirm('确定恢复该评价任务吗？');
  const index = dataObj.apilist.findIndex(v => v.taskId === row.taskId);
  if (index !== -1) {
    dataObj.apilist[index].statusName = '进行中';
    dataObj.apilist[index].statusId = 'ts2';
    dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；恢复任务';
    dataObj.apilist[index].updateTime = new Date().toLocaleString();
  }
  ElMessage.success('任务已恢复');
  handleRefresh();
}

async function handleComplete(row) {
  if (row.statusName !== '进行中') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能完成`);
    return;
  }
  await confirm('确定完成该评价任务吗？');
  const index = dataObj.apilist.findIndex(v => v.taskId === row.taskId);
  if (index !== -1) {
    dataObj.apilist[index].statusName = '已完成';
    dataObj.apilist[index].statusId = 'ts4';
    dataObj.apilist[index].completeRate = 100;
    dataObj.apilist[index].completedObject = dataObj.apilist[index].totalObject;
    dataObj.apilist[index].uncompletedObject = 0;
    dataObj.apilist[index].completeTime = new Date().toLocaleString();
    dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；完成任务';
    dataObj.apilist[index].updateTime = new Date().toLocaleString();
  }
  ElMessage.success('任务已完成');
  handleRefresh();
}

async function handleCancel(row) {
  if (row.statusName !== '未启动' && row.statusName !== '暂停中') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能取消`);
    return;
  }
  currentTask.value = row;
  cancelReasonModalApi.open();
}

function handleExtendTime(row) {
  if (row.statusName !== '进行中') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能延长时间`);
    return;
  }
  currentTask.value = row;
  extendTimeModalApi.open();
}

async function handleRelateAudit(row) {
  await confirm('确定关联结果审核吗？');
  const index = dataObj.apilist.findIndex(v => v.taskId === row.taskId);
  if (index !== -1) {
    dataObj.apilist[index].relatedAudit = '已关联';
    dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；关联结果审核';
  }
  ElMessage.success('已关联结果审核');
  handleRefresh();
}

function handleExportData(row) {
  ElMessage.success('正在导出该任务数据...');
}

const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '未启动' },
  { label: '进行中' },
  { label: '已完成' },
  { label: '已取消' }
]);
const createLabel = (item) => {
  let count = 0;
  if (item.label === '全部') {
    count = dataObj.apilist.length;
  } else {
    count = dataObj.apilist.filter(v => v.statusName === item.label).length;
  }
  return `${item.label} (${count})`;
};
const handleClick = () => {
  gridApi.setGridOptions({ columns: getGridColumnsByTab(activeName.value) });
  gridApi.query();
};

const detailRef = ref(null);
function handleGarageOpenDetail(row) {
  dataObj.garageDetail = row;
  detailRef.value.open();
}
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const changeTotalShow = () => dataObj.totalShow = !dataObj.totalShow;

watch(chartData, (newData) => {
  emit('update-chart', newData);
}, { immediate: true, deep: true });
</script>

<template>
  <div class="park-lot-table-new">
    <TaskDrawer :title="taskDrawerApi.sharedData.payload?.title">
      <TaskForm />
    </TaskDrawer>

    <ExtendTimeModal title="延长任务时间">
      <ExtendTimeForm />
    </ExtendTimeModal>

    <CancelReasonModal title="取消任务">
      <CancelReasonForm />
    </CancelReasonModal>

    <detailDrawer
      ref="detailRef"
      :detail-obj="dataObj.garageDetail"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" @tab-change="handleClick">
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
          <el-tag v-if="filterTemplate" type="primary" closable @close="filterTemplate=''; gridApi.query()" style="height:32px; line-height:32px">
            关联模板：{{ filterTemplate }}
          </el-tag>
          <el-tag v-if="filterStatus" type="success" closable @close="filterStatus=''; gridApi.query()" style="height:32px; line-height:32px">
            状态：{{ filterStatus }}
          </el-tag>
          <el-tag v-if="filterCode" type="info" closable @close="filterCode=''; searchParams.value.code=''; gridApi.query()" style="height:32px; line-height:32px">
            任务编码：{{ filterCode }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton v-if="activeName === '全部'" content="新增任务" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton v-if="activeName === '全部'" content="批量导出" icon-name="FolderAdd" :disabled="isEmpty(checkedIds)" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #name="{ row }">
        <el-text @click="handleGarageOpenDetail(row)" class="common-align" type="primary">
          {{ row.name }}
        </el-text>
      </template>
      <template #code="{ row }">
        <el-text @click="handleCodeClick(row.code)" class="common-align" type="primary">
          {{ row.code }}
        </el-text>
      </template>
      <template #templateName="{ row }">
        <el-text @click="handleTemplateClick(row.templateName)" class="common-align" type="primary">
          {{ row.templateName }}
        </el-text>
      </template>
      <template #statusName="{ row }">
        <el-text @click="handleStatusClick(row.statusName)" class="common-align" type="primary">
          {{ row.statusName }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          
          <IconButton v-if="row.statusName === '未启动'" content="编辑" icon-name="edit" @click="handleEdit(row)" />
          
          <IconButton v-if="row.statusName === '未启动'" content="启动" icon-name="VideoPlay" color="#67C23A" @click="handleStart(row)" />
          
          <IconButton v-if="row.statusName === '进行中'" content="暂停" icon-name="VideoPause" color="#E6A23C" @click="handlePause(row)" />
          
          <IconButton v-if="row.statusName === '暂停中'" content="恢复" icon-name="VideoPlay" color="#67C23A" @click="handleResume(row)" />
          
          <IconButton v-if="row.statusName === '进行中'" content="延长时间" icon-name="Clock" color="#409eff" @click="handleExtendTime(row)" />
          
          <IconButton v-if="row.statusName === '进行中'" content="完成" icon-name="CircleCheck" color="#67C23A" @click="handleComplete(row)" />
          
          <IconButton v-if="row.statusName === '未启动' || row.statusName === '暂停中'" content="取消" icon-name="close" color="#F56C6C" @click="handleCancel(row)" />
          
          <IconButton v-if="row.statusName === '已完成'" content="导出数据" icon-name="download" @click="handleExportData(row)" />
          
          <IconButton v-if="row.statusName === '已完成' && !row.relatedAudit" content="关联结果审核" icon-name="Link" color="#409eff" @click="handleRelateAudit(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：任务数量{{ dataObj.list.length }}，未启动{{ dataObj.list.filter(v => v.statusName === '未启动').length }}，进行中{{ dataObj.list.filter(v => v.statusName === '进行中' || v.statusName === '暂停中').length }}，已完成{{ dataObj.list.filter(v => v.statusName === '已完成').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：任务总数{{ dataObj.apilist.length }}，未启动{{ dataObj.apilist.filter(v => v.statusName === '未启动').length }}，进行中{{ dataObj.apilist.filter(v => v.statusName === '进行中' || v.statusName === '暂停中').length }}，已完成{{ dataObj.apilist.filter(v => v.statusName === '已完成').length }}，已取消{{ dataObj.apilist.filter(v => v.statusName === '已取消').length }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
