<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportToExcel } from '#/utils/excel.js';
import detailDrawer from './detail.vue';
import LogDetailDrawer from './logDetail.vue';
import {
  dataList,
  getAllSyncLogs,
  textObj,
  useFormSchema,
  getGridColumnsByTab,
  iotDeviceList,
  evalTaskList,
  evalIndexItemList,
  syncFreqList,
  statusList,
  userList,
  syncLogList
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'data-change']);

// ==================== 数据定义 ====================
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  garageDetail: {},
  logDetail: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  logList: [],
});

const checkedIds = ref([]);
const searchParams = ref({});
const formData = ref();
const activeName = ref('全部');
const detailRef = ref(null);
const logDetailRef = ref(null);

// ==================== computed ====================
const getTitle = computed(() => {
  return formData.value?.rule_id ? textObj.editText : textObj.addText;
});

const tabsData = ref([
  { label: '全部' },
  { label: '启用' },
  { label: '停用' },
  { label: '同步成功' },
  { label: '同步失败' }
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '全部') {
    count = dataObj.apilist.length;
  } else if (item.label === '同步成功') {
    const successLogs = getAllSyncLogs().filter(log => !log.fail_reason);
    count = successLogs.length;
  } else if (item.label === '同步失败') {
    const failLogs = getAllSyncLogs().filter(log => log.fail_reason);
    count = failLogs.length;
  } else {
    count = dataObj.apilist.filter(v => v.statusName === item.label).length;
  }
  return `${item.label} (${count})`;
};

// ==================== 抽屉和表单配置 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  async onOpenChange() {},
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  onConfirm() {
    const obj = formApi.form.values;
    // 唯一性校验：规则编码不能重复
    const exists = dataObj.apilist.some(item =>
      item.code === obj.code &&
      item.rule_id !== (formData.value?.rule_id || '')
    );
    if (exists) {
      ElMessage.error('规则编码已存在');
      return;
    }

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增
      obj.rule_id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      obj.task_name = evalTaskList.find(t => t.task_id === obj.task_id)?.name || '';
      obj.index_name = evalIndexItemList.find(i => i.item_id === obj.index_id)?.name || '';
      obj.device_name = iotDeviceList.find(d => d.device_id === obj.device_id)?.device_name || '';
      obj.sync_freq_name = syncFreqList.find(f => f.id === obj.sync_freq_id)?.name || '';
      obj.status = '1';
      obj.statusName = '启用';
      obj.create_by = 'u1';
      obj.create_by_name = '当前用户';
      obj.create_time = new Date().toLocaleString();
      obj.update_by = 'u1';
      obj.update_by_name = '当前用户';
      obj.update_time = obj.create_time;
      obj.last_sync_time = '';
      obj.sync_success_rate = 0;
      obj.today_sync_count = 0;
      obj.total_sync_count = 0;
      obj.stop_reason = '';
      obj.stop_time = null;
      obj.stop_by = null;
      obj.stop_by_name = '';
      dataObj.apilist.push(obj);
      dataObj.currentPage = 1;
    } else {
      // 编辑
      const index = dataObj.apilist.findIndex(v => v.rule_id === formData.value?.rule_id);
      if (index !== -1) {
        const updated = { ...dataObj.apilist[index], ...obj };
        updated.task_name = evalTaskList.find(t => t.task_id === obj.task_id)?.name || '';
        updated.index_name = evalIndexItemList.find(i => i.item_id === obj.index_id)?.name || '';
        updated.device_name = iotDeviceList.find(d => d.device_id === obj.device_id)?.device_name || '';
        updated.sync_freq_name = syncFreqList.find(f => f.id === obj.sync_freq_id)?.name || '';
        updated.update_by = 'u1';
        updated.update_by_name = '当前用户';
        updated.update_time = new Date().toLocaleString();
        dataObj.apilist[index] = updated;
      }
    }
    handleRefresh();
    emit('data-change');
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.rule_id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 日志抽屉
const logList = ref([]);
const [LogDrawer, logDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: false,
  width: 900,
  onCancel() { logDrawerApi.close(); },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const { ruleId } = logDrawerApi.getData();
      logList.value = syncLogList(ruleId);
    }
  },
});

// ==================== 函数定义 ====================
function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  const sheets = [
    {
      name: '实时接入规则',
      data: dataObj.apilist.map(c => ({
        '规则名称': c.name,
        '规则编码': c.code,
        '关联评价任务': c.task_name,
        '关联指标项': c.index_name,
        '数据来源设备': c.device_name,
        '同步频率': c.sync_freq_name,
        '数据清洗规则': c.clean_rule,
        '状态': c.statusName,
        '创建人': c.create_by_name,
        '创建时间': c.create_time,
        '最近同步时间': c.last_sync_time,
        '同步成功率': c.sync_success_rate + '%',
        '今日同步次数': c.today_sync_count,
        '累计同步次数': c.total_sync_count
      }))
    }
  ];
  exportToExcel(sheets, textObj.excelName, textObj.excelAllName);
}

function handleBatchExport() {
  const selected = activeName.value === '同步成功' || activeName.value === '同步失败'
    ? dataObj.logList.filter(item => checkedIds.value.includes(item.log_id))
    : dataObj.apilist.filter(item => checkedIds.value.includes(item.rule_id));
  ElMessage.success(`已选中 ${selected.length} 条记录，批量导出功能待实现`);
}

function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

async function handleDisable(row) {
  if (row.statusName !== '启用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该规则吗？');
  const index = dataObj.apilist.findIndex(v => v.rule_id === row.rule_id);
  if (index !== -1) {
    dataObj.apilist[index].status = '0';
    dataObj.apilist[index].statusName = '停用';
    dataObj.apilist[index].stop_reason = '手动停用';
    dataObj.apilist[index].stop_time = new Date().toLocaleString();
    dataObj.apilist[index].stop_by = 'u1';
    dataObj.apilist[index].stop_by_name = '当前用户';
    ElMessage.success('已停用');
    handleRefresh();
    emit('data-change');
  }
}

async function handleEnable(row) {
  if (row.statusName !== '停用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该规则吗？');
  const index = dataObj.apilist.findIndex(v => v.rule_id === row.rule_id);
  if (index !== -1) {
    dataObj.apilist[index].status = '1';
    dataObj.apilist[index].statusName = '启用';
    dataObj.apilist[index].stop_reason = '';
    dataObj.apilist[index].stop_time = null;
    dataObj.apilist[index].stop_by = null;
    dataObj.apilist[index].stop_by_name = '';
    ElMessage.success('已启用');
    handleRefresh();
    emit('data-change');
  }
}

async function handleBatchStatusChange(targetStatus) {
  const allowedCurrentStatus = targetStatus === '启用' ? '停用' : '启用';
  const invalidRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.rule_id) && item.statusName !== allowedCurrentStatus);
  if (invalidRows.length > 0) {
    ElMessage.warning(`选中的行中包含状态不是“${allowedCurrentStatus}”的对象，无法批量${targetStatus}。`);
    return;
  }
  await confirm(`确定将选中的对象${targetStatus === '启用' ? '启用' : '停用'}吗？`);
  dataObj.apilist.forEach(item => {
    if (checkedIds.value.includes(item.rule_id)) {
      item.status = targetStatus === '启用' ? '1' : '0';
      item.statusName = targetStatus;
      if (targetStatus === '停用') {
        item.stop_reason = '批量停用';
        item.stop_time = new Date().toLocaleString();
        item.stop_by = 'u1';
        item.stop_by_name = '当前用户';
      } else {
        item.stop_reason = '';
        item.stop_time = null;
        item.stop_by = null;
        item.stop_by_name = '';
      }
    }
  });
  checkedIds.value = [];
  ElMessage.success(`批量${targetStatus}成功`);
  handleRefresh();
  emit('data-change');
}

function handleManualSync(row) {
  const rules = row ? [row] : dataObj.apilist.filter(item => checkedIds.value.includes(item.rule_id));
  if (rules.length === 0) {
    ElMessage.warning('请至少选择一条规则');
    return;
  }
  const invalid = rules.filter(r => r.statusName !== '启用');
  if (invalid.length > 0) {
    ElMessage.warning('仅启用状态的规则可手动同步');
    return;
  }
  ElMessageBox.confirm(`确定手动同步选中的 ${rules.length} 条规则吗？`, '提示', { type: 'info' }).then(() => {
    ElMessage.success('同步任务已触发');
    rules.forEach(r => {
      const idx = dataObj.apilist.findIndex(a => a.rule_id === r.rule_id);
      if (idx !== -1) {
        dataObj.apilist[idx].last_sync_time = new Date().toLocaleString();
      }
    });
    handleRefresh();
  }).catch(() => {});
}

function handleRetrySync(row) {
  const logs = row ? [row] : dataObj.logList.filter(item => checkedIds.value.includes(item.log_id));
  if (logs.length === 0) {
    ElMessage.warning('请至少选择一条失败日志');
    return;
  }
  ElMessageBox.confirm(`确定重试同步选中的 ${logs.length} 条失败日志吗？`, '提示', { type: 'info' }).then(() => {
    ElMessage.success('重试任务已触发');
    // 模拟更新日志状态（实际应调用API）
  }).catch(() => {});
}

function handleViewLog(row) {
  logDrawerApi.setData({ ruleId: row.rule_id, ruleName: row.name }).open();
}

function handleLogDetail(log) {
  dataObj.logDetail = log;
  logDetailRef.value.open();
}

function handleRowCheckboxChange({ records }) {
  if (activeName.value === '同步成功' || activeName.value === '同步失败') {
    checkedIds.value = records.map(item => item.log_id);
  } else {
    checkedIds.value = records.map(item => item.rule_id);
  }
}

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 搜索表单 schema（根据tab动态）
const searchSchema = computed(() => {
  const base = [
    { fieldName: 'name', label: '规则名称', component: 'Input' },
    { fieldName: 'task_id', label: '关联任务', component: 'Select', componentProps: { options: evalTaskList.map(t => ({ label: t.name, value: t.task_id })) } },
    { fieldName: 'index_id', label: '关联指标项', component: 'Select', componentProps: { options: evalIndexItemList.map(i => ({ label: i.name, value: i.item_id })) } }
  ];
  if (activeName.value === '全部' || activeName.value === '启用') {
    base.push(
      { fieldName: 'device_id', label: '数据来源设备', component: 'Select', componentProps: { options: iotDeviceList.map(d => ({ label: d.device_name, value: d.device_id })) } },
      { fieldName: 'sync_freq_id', label: '同步频率', component: 'Select', componentProps: { options: syncFreqList.map(f => ({ label: f.name, value: f.id })) } }
    );
  }
  if (activeName.value === '全部') {
    base.push({ fieldName: 'status', label: '状态', component: 'Select', componentProps: { options: statusList.map(s => ({ label: s.name, value: s.id })) } });
  }
  if (activeName.value === '同步失败') {
    base.push({ fieldName: 'fail_reason', label: '失败原因', component: 'Input' });
  }
  if (activeName.value === '同步成功' || activeName.value === '同步失败') {
    base.push({ fieldName: 'sync_type', label: '同步方式', component: 'Select', componentProps: { options: [{ label: '自动', value: '自动' }, { label: '手动', value: '手动' }] } });
  }
  return base;
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: searchSchema.value,
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

// 钻取点击处理函数（统一更新 searchParams）
function handleFieldClick(fieldName, value, displayValue) {
  const newParams = { ...searchParams.value, [fieldName]: value };
  // 如果需要显示标签，可以同时存储显示值（可选）
  if (displayValue !== undefined) {
    newParams[`${fieldName}_display`] = displayValue;
  }
  searchParams.value = newParams;
  handleRefresh();
}

// 清除钻取字段
function handleClearField(fieldName) {
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  delete newParams[`${fieldName}_display`];
  searchParams.value = newParams;
  handleRefresh();
}

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  let filtered = [];
  let total = 0;

  if (activeName.value === '同步成功' || activeName.value === '同步失败') {
    // 日志数据
    let logs = getAllSyncLogs();
    if (activeName.value === '同步成功') {
      logs = logs.filter(log => !log.fail_reason);
    } else {
      logs = logs.filter(log => log.fail_reason);
    }

    const params = searchParams.value;
    if (Object.keys(params).length > 0) {
      logs = logs.filter(log => {
        let match = true;
        if (params.name && !log.rule_name?.includes(params.name)) match = false;
        if (params.task_id && log.task_id !== params.task_id) match = false;
        if (params.index_id && log.index_id !== params.index_id) match = false;
        if (params.device_id && log.device_id !== params.device_id) match = false;
        if (params.sync_freq_id && log.sync_freq_id !== params.sync_freq_id) match = false;
        if (params.fail_reason && log.fail_reason?.includes(params.fail_reason)) match = false;
        if (params.sync_type && log.sync_type !== params.sync_type) match = false;
        // 钻取字段
        if (params.code && log.rule_code !== params.code) match = false;
        if (params.task_name && log.task_name !== params.task_name) match = false;
        if (params.index_name && log.index_name !== params.index_name) match = false;
        if (params.statusName && log.status !== params.statusName) match = false;
        return match;
      });
    }

    total = logs.length;
    filtered = logs.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize
    );
    dataObj.logList = filtered;
  } else {
    // 规则数据
    let rules = dataObj.apilist.filter(v => {
      if (activeName.value === '全部') return true;
      return v.statusName === activeName.value;
    });

    const params = searchParams.value;
    if (Object.keys(params).length > 0) {
      rules = rules.filter(item => {
        let match = true;
        if (params.name && !item.name.includes(params.name)) match = false;
        if (params.task_id && item.task_id !== params.task_id) match = false;
        if (params.index_id && item.index_id !== params.index_id) match = false;
        if (params.device_id && item.device_id !== params.device_id) match = false;
        if (params.sync_freq_id && item.sync_freq_id !== params.sync_freq_id) match = false;
        if (params.status && item.status !== params.status) match = false;
        // 钻取字段
        if (params.code && item.code !== params.code) match = false;
        if (params.task_name && item.task_name !== params.task_name) match = false;
        if (params.index_name && item.index_name !== params.index_name) match = false;
        if (params.statusName && item.statusName !== params.statusName) match = false;
        return match;
      });
    }

    rules.sort((a, b) => (b.create_time || '').localeCompare(a.create_time || ''));

    total = rules.length;
    filtered = rules.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize
    );
  }

  dataObj.total = total;
  dataObj.list = filtered;
  return dataObj;
};

const gridColumns = ref(getGridColumnsByTab('全部'));

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: activeName.value === '同步成功' || activeName.value === '同步失败' ? 'log_id' : 'rule_id', isHover: true },
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

const handleGarageOpenDetail = (row) => {
  dataObj.garageDetail = row;
  detailRef.value.open();
};

const handleClick = () => {
  gridColumns.value = getGridColumnsByTab(activeName.value);
  gridApi.setGridOptions({ columns: gridColumns.value });
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

defineExpose({
  activeName,          // 新增：暴露二级 tab 激活值
  dataList: dataObj.apilist
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle" class="genchuan-detail-drawer">
      <Form />
    </FormDrawer>

    <LogDrawer title="同步日志">
      <el-table :data="logList" border style="width: 100%">
        <el-table-column prop="sync_time" label="同步时间" width="160"></el-table-column>
        <el-table-column prop="data_value" label="数据值" width="100"></el-table-column>
        <el-table-column prop="sync_type" label="同步方式" width="80"></el-table-column>
        <el-table-column prop="clean_result" label="清洗结果" width="100"></el-table-column>
        <el-table-column prop="store_status" label="存储状态" width="100"></el-table-column>
        <el-table-column prop="fail_reason" label="失败原因" min-width="150"></el-table-column>
        <el-table-column prop="retry_count" label="重试次数" width="80"></el-table-column>
        <el-table-column prop="last_retry_time" label="最近重试时间" width="160"></el-table-column>
      </el-table>
    </LogDrawer>

    <detailDrawer
      ref="detailRef"
      :detail-obj="dataObj.garageDetail"
    />

    <LogDetailDrawer
      ref="logDetailRef"
      :log-obj="dataObj.logDetail"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
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

          <!-- 动态显示钻取筛选标签 -->
          <el-tag
            v-if="searchParams.code"
            type="primary"
            closable
            @close="handleClearField('code')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            规则编码：{{ searchParams.code }}
          </el-tag>
          <el-tag
            v-if="searchParams.task_name"
            type="success"
            closable
            @close="handleClearField('task_name')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            关联任务：{{ searchParams.task_name }}
          </el-tag>
          <el-tag
            v-if="searchParams.index_name"
            type="info"
            closable
            @close="handleClearField('index_name')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            关联指标项：{{ searchParams.index_name }}
          </el-tag>
          <el-tag
            v-if="searchParams.statusName"
            type="warning"
            closable
            @close="handleClearField('statusName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            状态：{{ searchParams.statusName }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 全部页：新增 -->
          <IconButton v-if="activeName === '全部'" content="新增规则" icon-name="Plus" @click="handleCreate" />

          <!-- 全部/启用页：手动同步（选中规则） -->
          <IconButton
            v-if="activeName === '全部' || activeName === '启用'"
            content="手动同步"
            icon-name="Refresh"
            :disabled="isEmpty(checkedIds)"
            @click="handleManualSync()"
          />

          <!-- 失败页：重试同步（选中日志） -->
          <IconButton
            v-if="activeName === '同步失败'"
            content="重试同步"
            icon-name="RefreshRight"
            :disabled="isEmpty(checkedIds)"
            @click="handleRetrySync()"
          />

          <!-- 导出按钮（所有页都显示） -->
          <IconButton content="导出" icon-name="download" @click="handleExport" />

          <!-- 批量导出：启用/停用/成功/失败页 -->
          <IconButton
            v-if="activeName === '启用' || activeName === '停用' || activeName === '同步成功' || activeName === '同步失败'"
            content="批量导出"
            icon-name="FolderOpened"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchExport"
          />

          <!-- 全部页批量停用/启用 -->
          <IconButton
            v-if="activeName === '全部'"
            content="批量停用"
            icon-name="close"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange('停用')"
          />
          <IconButton
            v-if="activeName === '停用'"
            content="批量启用"
            icon-name="check"
            color="#67C23A"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange('启用')"
          />

          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列渲染 - 使用 el-text 样式，与评价对象管理页面一致 -->
      <template #name="{ row }">
        <el-text
          v-if="activeName !== '同步成功' && activeName !== '同步失败'"
          @click="handleGarageOpenDetail(row)"
          class="common-align"
          type="primary"
          :title="row.name"
        >
          {{ row.name }}
        </el-text>
        <span v-else :title="row.rule_name">{{ row.rule_name }}</span>
      </template>

      <template #code="{ row }">
        <el-text @click="handleFieldClick('code', row.code)" class="common-align" type="primary" :title="row.code">
          {{ row.code }}
        </el-text>
      </template>

      <template #logId="{ row }">
        <el-text @click="handleLogDetail(row)" class="common-align" type="primary" :title="row.log_id">
          {{ row.log_id }}
        </el-text>
      </template>

      <template #taskName="{ row }">
        <el-text @click="handleFieldClick('task_name', row.task_name)" class="common-align" type="primary" :title="row.task_name">
          {{ row.task_name }}
        </el-text>
      </template>

      <template #indexName="{ row }">
        <el-text @click="handleFieldClick('index_name', row.index_name)" class="common-align" type="primary" :title="row.index_name">
          {{ row.index_name }}
        </el-text>
      </template>

      <template #statusName="{ row }">
        <el-text @click="handleFieldClick('statusName', row.statusName)" class="common-align" type="primary" :title="row.statusName">
          {{ row.statusName }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <!-- 规则详情（规则页）或日志详情（日志页） -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="activeName === '同步成功' || activeName === '同步失败' ? handleLogDetail(row) : handleGarageOpenDetail(row)"
          />

          <!-- 规则页特有操作 -->
          <template v-if="activeName !== '同步成功' && activeName !== '同步失败'">
            <IconButton v-if="activeName === '全部'" content="编辑" icon-name="edit" @click="handleEdit(row)" />
            <IconButton v-if="activeName === '全部' || activeName === '启用'" content="手动同步" icon-name="Refresh" @click="handleManualSync(row)" />
            <IconButton content="查看日志" icon-name="Document" @click="handleViewLog(row)" />
            <IconButton
              v-if="row.statusName === '启用' && (activeName === '全部' || activeName === '启用')"
              content="停用"
              icon-name="close"
              color="#F56C6C"
              @click="handleDisable(row)"
            />
            <IconButton
              v-if="row.statusName === '停用' && (activeName === '全部' || activeName === '停用')"
              content="启用"
              icon-name="check"
              color="#67C23A"
              @click="handleEnable(row)"
            />
          </template>

          <!-- 失败页日志行特有操作：重试同步 -->
          <IconButton v-if="activeName === '同步失败'" content="重试同步" icon-name="RefreshRight" @click="handleRetrySync(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>
            {{
              activeName === '同步成功' || activeName === '同步失败'
                ? `本页统计：日志数量${dataObj.list.length}`
                : `本页统计：规则数量${dataObj.list.length}，启用${dataObj.list.filter(v => v.statusName === '启用').length}，停用${dataObj.list.filter(v => v.statusName === '停用').length}`
            }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span v-if="activeName === '同步成功' || activeName === '同步失败'">
            全部统计：日志总数{{ activeName === '同步成功' ? getAllSyncLogs().filter(l => !l.fail_reason).length : getAllSyncLogs().filter(l => l.fail_reason).length }}
          </span>
          <span v-else>
            全部统计：规则总数{{ dataObj.apilist.length }}，启用{{ dataObj.apilist.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.apilist.filter(v => v.statusName === '停用').length }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
