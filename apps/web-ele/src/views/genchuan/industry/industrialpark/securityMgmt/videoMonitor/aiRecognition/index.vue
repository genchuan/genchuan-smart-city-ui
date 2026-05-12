<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import AiRecognitionDetailDrawer from './components/detail.vue';
import {
  getMockList,
  getAiRecognitionPage,
  updateAiRecognition,
  enableAiRecognition,
  disableAiRecognition,
  testAiRecognition,
  checkAiRecognition,
  alarmRealTimeMonitor,
  ignoreAiRecognition,
  handleAiRecognition,
  archiveAiRecognition,
  getAiRecognitionDetail,
  getCameraDetail,
  getUserDetail,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/aiRecognition/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useConfigFormSchema,
  useCheckFormSchema,
  useHandleFormSchema,
  useIgnoreFormSchema,
  formatTimestamp,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/aiRecognition/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
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
  const map = {
    ruleType: '识别类型',
    ruleStatus: '规则状态',
    creator: '创建人',
    createTime: '创建时间',
    ruleName: '规则名称',
    handleUser: '操作人',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// 抽屉组件
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [ConfigDrawer, configDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => configDrawerApi.close(),
});

const [CheckDrawer, checkDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => checkDrawerApi.close(),
});

const [HandleDrawer, handleDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => handleDrawerApi.close(),
});

const [IgnoreDrawer, ignoreDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => ignoreDrawerApi.close(),
});

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const currentConfigRow = ref(null);
const currentCheckRow = ref(null);
const currentHandleRow = ref(null);
const currentIgnoreRow = ref(null);
const currentAlarmRow = ref(null);

const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRuleStatusType = (status) => {
  const map = {
    '启用': 'success',
    '禁用': 'danger',
  };
  return map[status] || 'info';
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getAiRecognitionPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'ruleType':
            itemValue = item.ruleType;
            break;
          case 'ruleStatus':
            itemValue = item.ruleStatus;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'ruleName':
            itemValue = item.ruleName;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
            break;
          default:
            itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = res.total || filtered.length;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = getMockList();
    let filtered = mockData;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'ruleType':
            itemValue = item.ruleType;
            break;
          case 'ruleStatus':
            itemValue = item.ruleStatus;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'ruleName':
            itemValue = item.ruleName;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
            break;
          default:
            itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
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

// 批量启用
async function handleBatchEnable() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个规则');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认启用选中的 ${checkedIds.value.length} 个规则吗？`, '启用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '启用中...' });
    try {
      const res = await enableAiRecognition({ ids: checkedIds.value });
      if (res && res !== false) {
        ElMessage.success('批量启用成功');
        handleRefresh();
      } else {
        ElMessage.error('批量启用失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 批量禁用
async function handleBatchDisable() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个规则');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认禁用选中的 ${checkedIds.value.length} 个规则吗？`, '禁用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '禁用中...' });
    try {
      const res = await disableAiRecognition({ ids: checkedIds.value });
      if (res && res !== false) {
        ElMessage.success('批量禁用成功');
        handleRefresh();
      } else {
        ElMessage.error('批量禁用失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 行内配置
async function handleConfig(row) {
  currentConfigRow.value = row;
  configFormApi.resetForm();
  configFormApi.setValues({
    ruleName: row.ruleName,
    ruleType: row.ruleType,
    cameraId: row.cameraId,
    ruleConfig: '{"area": [10,20,30,40],"threshold": 0.8}',
  });
  configDrawerApi.open();
}

// 行内启用
async function handleEnable(row) {
  try {
    await ElMessageBox.confirm(`确认启用规则"${row.ruleName}"吗？`, '启用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '启用中...' });
    try {
      const res = await enableAiRecognition({ ids: [row.id] });
      if (res && res !== false) {
        ElMessage.success('启用成功');
        handleRefresh();
      } else {
        ElMessage.error('启用失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 行内禁用
async function handleDisable(row) {
  try {
    await ElMessageBox.confirm(`确认禁用规则"${row.ruleName}"吗？`, '禁用确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '禁用中...' });
    try {
      const res = await disableAiRecognition({ ids: [row.id] });
      if (res && res !== false) {
        ElMessage.success('禁用成功');
        handleRefresh();
      } else {
        ElMessage.error('禁用失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 行内测试
async function handleTest(row) {
  const loading = ElLoading.service({ text: '测试中...' });
  try {
    const res = await testAiRecognition({ id: row.id });
    if (res && res.testResult) {
      ElMessage.success(`测试成功：${res.testMsg}`);
    } else {
      ElMessage.warning(res?.testMsg || '测试失败');
    }
  } catch (error) {
    console.error('测试失败', error);
    ElMessage.error('测试失败');
  } finally {
    loading.close();
  }
}

// 行内核实
function handleCheck(row) {
  currentCheckRow.value = row;
  checkFormApi.resetForm();
  checkDrawerApi.open();
}

// 行内告警 —— 去掉弹窗，直接触发告警
async function handleAlarm(row) {
  const loading = ElLoading.service({ text: '触发告警中...' });
  try {
    const res = await alarmRealTimeMonitor({ id: row.id, alarmContent: 'AI识别触发告警' });
    if (res && res !== false) {
      ElMessage.success('告警已触发，已推送至安保人员');
      handleRefresh(); // 刷新列表，更新告警状态
    } else {
      ElMessage.error('告警失败');
    }
  } catch (error) {
    console.error('告警失败', error);
    ElMessage.error('告警失败');
  } finally {
    loading.close();
  }
}

// 行内忽略
function handleIgnore(row) {
  currentIgnoreRow.value = row;
  ignoreFormApi.resetForm();
  ignoreDrawerApi.open();
}

// 行内处置
function handleHandle(row) {
  currentHandleRow.value = row;
  handleFormApi.resetForm();
  handleDrawerApi.open();
}

// 行内归档
async function handleArchive(row) {
  try {
    await ElMessageBox.confirm(`确认归档规则"${row.ruleName}"的识别记录吗？`, '归档确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '归档中...' });
    try {
      const res = await archiveAiRecognition({ id: row.id });
      if (res && res !== false) {
        ElMessage.success('归档成功');
        handleRefresh();
      } else {
        ElMessage.error('归档失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 配置表单
const [ConfigForm, configFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '保存中...' });
    try {
      const res = await updateAiRecognition({ ...values, id: currentConfigRow.value.id });
      if (res && res !== false) {
        ElMessage.success('配置成功');
        configDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('配置失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useConfigFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 核实表单
const [CheckForm, checkFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '核实中...' });
    try {
      const res = await checkAiRecognition({ id: currentCheckRow.value.id, alarmId: 1, checkResult: values.checkResult });
      if (res && res !== false) {
        ElMessage.success('核实成功');
        checkDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('核实失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useCheckFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 处置表单
const [HandleForm, handleFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '处置中...' });
    try {
      const res = await handleAiRecognition({ id: currentHandleRow.value.id, handleResult: values.handleResult });
      if (res && res !== false) {
        ElMessage.success('处置成功');
        handleDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('处置失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useHandleFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 忽略表单
const [IgnoreForm, ignoreFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '忽略中...' });
    try {
      const res = await ignoreAiRecognition({ alarmId: 1, ignoreReason: values.ignoreReason });
      if (res && res !== false) {
        ElMessage.success('已忽略');
        ignoreDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('忽略失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useIgnoreFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '确认' },
});

// 详情抽屉
const aiRecognitionDetailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  try {
    const detail = await getAiRecognitionDetail({ id: row.id });
    dataObj.detailObj = detail;
    aiRecognitionDetailDrawerRef.value.open();
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error('获取详情失败');
  }
}

// 点击识别总数/告警总数
async function handleViewRecognizeCount(row) {
  ElMessageBox.alert(`规则"${row.ruleName}"识别总数为 ${row.recognizeCount} 次`, '识别记录明细', { confirmButtonText: '关闭' });
}

async function handleViewAlarmCount(row) {
  ElMessageBox.alert(`规则"${row.ruleName}"告警总数为 ${row.alarmCount} 次`, '告警记录明细', { confirmButtonText: '关闭' });
}

// 点击操作人弹出用户详情
async function handleViewUser(row) {
  if (!row.handleUser) {
    ElMessage.warning('无操作人信息');
    return;
  }
  try {
    const userDetail = await getUserDetail({ username: row.handleUser });
    ElMessageBox.alert(
      `用户名：${userDetail.username}\n昵称：${userDetail.nickname}\n电话：${userDetail.phone}`,
      '操作人信息',
      { confirmButtonText: '关闭' }
    );
  } catch (error) {
    console.error('获取用户信息失败', error);
    ElMessage.error('获取用户信息失败');
  }
}

// 点击关联摄像头弹出设备详情
async function handleViewCamera(row) {
  if (!row.cameraId) {
    ElMessage.warning('无关联摄像头');
    return;
  }
  try {
    const cameraDetail = await getCameraDetail({ id: row.cameraId });
    ElMessageBox.alert(
      `设备名称：${cameraDetail.name}\n安装位置：${cameraDetail.location}\n设备状态：${cameraDetail.status}\n设备型号：${cameraDetail.model}`,
      '摄像头设备详情',
      { confirmButtonText: '关闭' }
    );
  } catch (error) {
    console.error('获取摄像头信息失败', error);
    ElMessage.error('获取摄像头信息失败');
  }
}

// 筛选表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: { checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange },
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <!-- 模板部分与原文件完全一致，无需修改 -->
  <div class="park-lot-table-new">
    <AiRecognitionDetailDrawer ref="aiRecognitionDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="筛选">
      <QueryForm />
    </Drawer>
    <ConfigDrawer title="配置规则">
      <ConfigForm />
    </ConfigDrawer>
    <CheckDrawer title="核实事件">
      <CheckForm />
    </CheckDrawer>
    <HandleDrawer title="处置事件">
      <HandleForm />
    </HandleDrawer>
    <IgnoreDrawer title="忽略告警">
      <IgnoreForm />
    </IgnoreDrawer>
    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton :content="textObj.enableText" icon-name="Check" @click="handleBatchEnable" />
          <IconButton :content="textObj.disableText" icon-name="CircleClose" @click="handleBatchDisable" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 钻取列 -->
      <template #ruleName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.ruleName }}
        </el-text>
      </template>
      <template #ruleType="{ row }">
        <el-text @click="handleFilterTagClick('ruleType', row.ruleType)" type="primary" style="cursor: pointer;">
          {{ row.ruleType }}
        </el-text>
      </template>
      <template #cameraId="{ row }">
        <el-text @click="handleViewCamera(row)" type="primary" style="cursor: pointer;">
          {{ row.cameraId || '-' }}
        </el-text>
      </template>
      <template #ruleStatus="{ row }">
        <el-tag :type="getRuleStatusType(row.ruleStatus)" @click="handleFilterTagClick('ruleStatus', row.ruleStatus)" style="cursor: pointer">
          {{ row.ruleStatus }}
        </el-tag>
      </template>
      <template #recognizeCount="{ row }">
        <el-text @click="handleViewRecognizeCount(row)" type="primary" style="cursor: pointer;">
          {{ row.recognizeCount }}
        </el-text>
      </template>
      <template #alarmCount="{ row }">
        <el-text @click="handleViewAlarmCount(row)" type="primary" style="cursor: pointer;">
          {{ row.alarmCount }}
        </el-text>
      </template>
      <template #handleUser="{ row }">
        <el-text v-if="row.handleUser" @click="handleViewUser(row)" type="primary" style="cursor: pointer;">
          {{ row.handleUser }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #updateTime="{ row }">
        {{ formatTimestamp(row.updateTime) }}
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton :content="textObj.configText" icon-name="Edit" @click="handleConfig(row)" />
          <IconButton v-if="row.ruleStatus === '启用'" :content="textObj.disableText" icon-name="CircleClose" color="#E6A23C" @click="handleDisable(row)" />
          <IconButton v-else :content="textObj.enableText" icon-name="Check" @click="handleEnable(row)" />
          <IconButton :content="textObj.testText" icon-name="Cpu" @click="handleTest(row)" />
          <IconButton :content="textObj.checkText" icon-name="Select" @click="handleCheck(row)" />
          <IconButton :content="textObj.alarmText" icon-name="Warning" color="#F56C6C" @click="handleAlarm(row)" />
          <IconButton :content="textObj.ignoreText" icon-name="Close" @click="handleIgnore(row)" />
          <IconButton :content="textObj.handleText" icon-name="Edit" @click="handleHandle(row)" />
          <IconButton :content="textObj.archiveText" icon-name="Folder" @click="handleArchive(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
