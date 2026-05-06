<script setup>
import { reactive, ref, onMounted, onUnmounted, onActivated, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getReserveListPage,
  exportReserveListExcel,
  batchAuditReserve,
  approveReserve,
  rejectReserve,
  cancelReserve,
  completeReserve,
  evaluateReserve,
  getReserveDetail,
  getUserList,
  getStationList,
  getSpaceList,
  createReserve,
} from '#/api/genchuan/industry/chargePark/carService/reserveService/reserveList/index.js';
import { useFormSchema, useGridColumns } from './data';
import ReserveDetailDrawer from './detail.vue';

// 新增 props 和 emit
const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },   // 新增
});
const emit = defineEmits(['arrow-change']);         // 新增

// 新增：触发箭头切换事件
const arrowChange = () => {
  emit('arrow-change');
};

const checkedIds = ref([]);
const handleRowCheckboxChange = ({ records }) => {
  checkedIds.value = records.map((item) => item.id);
};
const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

// ==================== 映射表：用户、场站、车位 ====================
const userMap = ref(new Map());
const stationMap = ref(new Map());
const spaceMap = ref(new Map());

async function fetchMappings() {
  try {
    const [users, stations, spaces] = await Promise.all([
      getUserList(),
      getStationList(),
      getSpaceList(),
    ]);
    users.forEach(user => userMap.value.set(user.userId, user.userName));
    stations.forEach(station => stationMap.value.set(station.id, station.name));
    spaces.forEach(space => spaceMap.value.set(space.id, space.name));
  } catch (error) {
    console.error('获取基础数据映射失败', error);
  }
}

function getUserName(id) { return userMap.value.get(id) || id; }
function getStationName(id) { return stationMap.value.get(id) || id; }
function getSpaceName(id) { return spaceMap.value.get(id) || id; }

// ==================== 获取表格数据 ====================
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  if (dataObj.searchObj.statusList && Array.isArray(dataObj.searchObj.statusList)) {
    params.status = dataObj.searchObj.statusList.join(',');
    delete params.statusList;
  }
  // userName / stationName / spaceName 都是前端模糊筛选（后端 PageReqVO 没有这些字段），不发给后端
  const userNameFilter = (params.userName || '').trim().toLowerCase();
  const stationNameFilter = (params.stationName || '').trim().toLowerCase();
  const spaceNameFilter = (params.spaceName || '').trim().toLowerCase();
  delete params.userName; delete params.stationName; delete params.spaceName;
  // 把 reserveTime 数组转为逗号分隔字符串，绕开 Spring 对 LocalDateTime[] 的多值 query 绑定问题
  if (params.reserveTime && Array.isArray(params.reserveTime) && params.reserveTime.length === 2) {
    params.reserveTime = `${params.reserveTime[0]},${params.reserveTime[1]}`;
  }
  const hasNameFilter = userNameFilter || stationNameFilter || spaceNameFilter;
  // 名称模糊筛选是前端做的，分页页面只能筛出当前页数据，结果会偏少。
  // 简单兜底：有名称筛选时，把后端 pageSize 拉到 200 一次拿足够多再前端筛。
  if (hasNameFilter) {
    params.pageNo = 1;
    params.pageSize = 200;
  }
  const res = await getReserveListPage(params);
  let list = res.list || [];
  let total = res.total;
  if (hasNameFilter) {
    list = list.filter(v => {
      const u = String(getUserName(v.userId) ?? v.userId ?? '').toLowerCase();
      const s = String(getStationName(v.stationId) ?? v.stationId ?? '').toLowerCase();
      const p = String(getSpaceName(v.spaceId) ?? v.spaceId ?? '').toLowerCase();
      if (userNameFilter && !u.includes(userNameFilter)) return false;
      if (stationNameFilter && !s.includes(stationNameFilter)) return false;
      if (spaceNameFilter && !p.includes(spaceNameFilter)) return false;
      return true;
    });
    total = list.length;
    // 客户端再做一次分页，保持表格分页器可用
    const pStart = (pageObj.page.currentPage - 1) * pageObj.page.pageSize;
    list = list.slice(pStart, pStart + pageObj.page.pageSize);
  }
  dataObj.total = total;
  dataObj.list = list.map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    reserveTime: formatTimestamp(v.reserveTime),
    auditTime: formatTimestamp(v.auditTime),
    finishTime: formatTimestamp(v.finishTime),
  }));
  return dataObj;
};

// ==================== 搜索表单 ====================
const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema()
    .filter(v => v.isSearch)
    .map(v => {
      delete v.rules;
      return v;
    }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      QueryFormApi.resetForm();
      QueryFormApi.submitForm();
    }
  },
});

const resetAllFilters = async () => {
  dataObj.searchObj = {};
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
};

async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
  } else {
    dataObj.searchObj = { ...values };
    dataObj.currentPage = 1;
    gridApi.query();
    searchDrawerApi?.close?.();
  }
}

const handleClearField = async (fieldName) => {
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj[fieldName];
  dataObj.searchObj = newSearchObj;
  const currentFormValues = await QueryFormApi.getValues();
  delete currentFormValues[fieldName];
  await QueryFormApi.setValues(currentFormValues, false);
  dataObj.currentPage = 1;
  gridApi.query();
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.userName) filters.push({ label: `用户名称：${obj.userName}`, field: 'userName' });
  if (obj.stationName) filters.push({ label: `场站名称：${obj.stationName}`, field: 'stationName' });
  if (obj.spaceName) filters.push({ label: `车位名称：${obj.spaceName}`, field: 'spaceName' });
  if (obj.userId) filters.push({ label: `用户：${getUserName(obj.userId)}`, field: 'userId' });
  if (obj.stationId) filters.push({ label: `场站：${getStationName(obj.stationId)}`, field: 'stationId' });
  if (obj.spaceId) filters.push({ label: `车位：${getSpaceName(obj.spaceId)}`, field: 'spaceId' });
  if (obj.reserveType) filters.push({ label: `预约类型：${obj.reserveType}`, field: 'reserveType' });
  if (obj.status) filters.push({ label: `状态：${obj.status}`, field: 'status' });
  if (obj.reserveTime && obj.reserveTime.length === 2) {
    filters.push({ label: `预约时间：${obj.reserveTime[0]} 至 ${obj.reserveTime[1]}`, field: 'reserveTime' });
  }
  return filters;
});

// ==================== 表格组件 ====================
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, getStationName, getSpaceName }),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

function handleRefresh() { gridApi.query(); }
async function handleExport() {
  const data = await exportReserveListExcel(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '预约信息记录.xls', source: data });
}

// 详情抽屉
const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getReserveDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

// ==================== 批量审核抽屉 ====================
const batchAuditForm = reactive({ auditResult: '', auditRemark: '', rejectReason: '' });
const [BatchAuditDrawer, batchAuditDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '批量审核',
  onCancel: () => batchAuditDrawerApi.close(),
  onConfirm: async () => {
    if (!batchAuditForm.auditResult) return ElMessage.warning('请选择审核结果');
    if (batchAuditForm.auditResult === '驳回' && !batchAuditForm.rejectReason) {
      return ElMessage.warning('驳回理由不能为空');
    }
    await batchAuditReserve({
      ids: checkedIds.value,
      auditResult: batchAuditForm.auditResult,
      auditRemark: batchAuditForm.auditRemark,
      rejectReason: batchAuditForm.rejectReason,
    });
    ElMessage.success('批量审核成功');
    batchAuditDrawerApi.close();
    checkedIds.value = [];
    handleRefresh();
  },
});

const openBatchAudit = () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个待审核的预约');
  batchAuditForm.auditResult = '';
  batchAuditForm.auditRemark = '';
  batchAuditForm.rejectReason = '';
  batchAuditDrawerApi.open();
};

// ==================== 新增预约抽屉 ====================
const createForm = reactive({ userId: null, stationId: null, spaceId: null, reserveTime: '', reserveType: '停车预约' });
const createFormRef = ref(null);
const createRules = {
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  stationId: [{ required: true, message: '请选择场站', trigger: 'change' }],
  spaceId: [{ required: true, message: '请选择车位', trigger: 'change' }],
  reserveTime: [{ required: true, message: '请选择预约时间', trigger: 'change' }],
  reserveType: [{ required: true, message: '请选择预约类型', trigger: 'change' }],
};
const userOptions = computed(() => [...userMap.value.entries()].map(([id, name]) => ({ label: name, value: id })));
const stationOptions = computed(() => [...stationMap.value.entries()].map(([id, name]) => ({ label: name, value: id })));
const spaceOptions = computed(() => [...spaceMap.value.entries()].map(([id, name]) => ({ label: name, value: id })));

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '新增预约',
  onCancel: () => createDrawerApi.close(),
  onConfirm: async () => {
    // 1. 表单校验
    let valid = false;
    try {
      valid = await createFormRef.value?.validate();
    } catch (validateErr) {
      console.warn('[新增预约] 表单校验未通过', validateErr);
      ElMessage.warning('请填写所有必填字段');
      return;
    }
    if (valid === false) {
      ElMessage.warning('请填写所有必填字段');
      return;
    }
    // 2. 提交
    try {
      console.log('[新增预约] 提交参数', JSON.parse(JSON.stringify(createForm)));
      // 后端 LocalDateTime 反序列化器期望毫秒时间戳，把字符串转成 epoch ms
      const payload = { ...createForm };
      if (payload.reserveTime && typeof payload.reserveTime === 'string') {
        payload.reserveTime = new Date(payload.reserveTime.replace(' ', 'T')).getTime();
      }
      await createReserve(payload);
      ElMessage.success('预约创建成功，等待审核');
      createDrawerApi.close();
      handleRefresh();
    } catch (err) {
      console.error('[新增预约] 提交失败', err);
      ElMessage.error('创建失败：' + (err?.msg || err?.message || '未知错误'));
    }
  },
});

const openCreate = (preset = {}) => {
  createForm.userId = preset.userId ?? null;
  createForm.stationId = preset.stationId ?? null;
  createForm.spaceId = preset.spaceId ?? null;
  createForm.reserveTime = preset.reserveTime ?? '';
  createForm.reserveType = preset.reserveType ?? '停车预约';
  createDrawerApi.open();
};

// ==================== 驳回抽屉 ====================
const rejectForm = reactive({ rejectReason: '' });
let currentRejectRow = null;
const [RejectDrawer, rejectDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '驳回理由',
  onCancel: () => rejectDrawerApi.close(),
  onConfirm: async () => {
    if (!rejectForm.rejectReason) return ElMessage.warning('请填写驳回理由');
    await rejectReserve({ id: currentRejectRow.id, rejectReason: rejectForm.rejectReason });
    ElMessage.success('已驳回');
    rejectDrawerApi.close();
    handleRefresh();
  },
});

const openReject = (row) => {
  currentRejectRow = row;
  rejectForm.rejectReason = '';
  rejectDrawerApi.open();
};

// ==================== 评价抽屉 ====================
const evaluateForm = reactive({ score: 5, evaluateContent: '' });
let currentEvaluateRow = null;
const [EvaluateDrawer, evaluateDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '预约评价',
  onCancel: () => evaluateDrawerApi.close(),
  onConfirm: async () => {
    if (!evaluateForm.score) return ElMessage.warning('请填写评分');
    await evaluateReserve({ id: currentEvaluateRow.id, ...evaluateForm });
    ElMessage.success('评价成功');
    evaluateDrawerApi.close();
    handleRefresh();
  },
});

const openEvaluate = (row) => {
  currentEvaluateRow = row;
  evaluateForm.score = 5;
  evaluateForm.evaluateContent = '';
  evaluateDrawerApi.open();
};

// 通过
const handleApprove = async (row) => {
  await confirm('确认通过该预约吗？');
  await approveReserve({ id: row.id, auditRemark: '' });
  ElMessage.success('审核通过');
  handleRefresh();
};

// 取消
const handleCancel = async (row) => {
  await confirm('确认取消该预约吗？取消后将释放车位资源。');
  await cancelReserve({ id: row.id });
  ElMessage.success('已取消');
  handleRefresh();
};

// 完成（已生效 → 已完成）
const handleComplete = async (row) => {
  await confirm('确认标记该预约为已完成吗？完成后用户可对本次预约进行评价。');
  await completeReserve({ id: row.id });
  ElMessage.success('已标记为已完成');
  handleRefresh();
};

// 审核人详情弹窗
const auditorDetailVisible = ref(false);
const currentAuditor = ref({});
const showAuditorDetail = (auditUserId) => {
  if (!auditUserId) return;
  const userName = getUserName(auditUserId);
  currentAuditor.value = { id: auditUserId, name: userName };
  auditorDetailVisible.value = true;
};

// 评价得分详情弹窗
const scoreDetailVisible = ref(false);
const currentScoreDetail = ref({});
const showScoreDetail = (row) => {
  currentScoreDetail.value = row;
  scoreDetailVisible.value = true;
};

// 图表刷新事件
const handleChartRefresh = (event) => {
  const filters = event.detail;
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj.status;
  delete newSearchObj.statusList;
  if (filters?.date) {
    newSearchObj.reserveTime = [`${filters.date} 00:00:00`, `${filters.date} 23:59:59`];
  } else if (filters?.reserveType) {
    newSearchObj.reserveType = filters.reserveType;
  } else if (filters?.statusList) {
    newSearchObj.statusList = filters.statusList;
  }
  dataObj.searchObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

// 从外部页面（如周边场站"预订"按钮）携带 query 参数跳进来时，等基础数据加载完后自动打开新增弹窗并预填
const route = useRoute();
const router = useRouter();
// 已处理过的 query 签名,避免 onMounted + onActivated 双触发或第二次激活时重复弹窗
let consumedRouteSignature = '';
async function autoOpenCreateFromRoute() {
  const { stationId, userId, reserveType } = route.query || {};
  if (!stationId && !userId) return;
  const sig = `${stationId || ''}|${userId || ''}|${reserveType || ''}`;
  if (sig === consumedRouteSignature) return; // 同一组 query 不重复处理
  consumedRouteSignature = sig;
  await fetchMappings();
  openCreate({
    stationId: stationId ? Number(stationId) : null,
    userId: userId ? Number(userId) : null,
    reserveType: reserveType || '停车预约',
  });
}

onMounted(() => {
  fetchMappings();
  window.addEventListener('reserve-chart-refresh', handleChartRefresh);
  autoOpenCreateFromRoute();
});

// 页面有 keep-alive,组件被缓存复用时 onMounted 不会再跑;用 onActivated 接住每次重新激活
onActivated(() => {
  autoOpenCreateFromRoute();
});
onUnmounted(() => {
  window.removeEventListener('reserve-chart-refresh', handleChartRefresh);
});

const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

// 搜索抽屉
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});
</script>

<template>
  <div class="park-lot-table-new">
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-for="filter in activeFilters" :key="filter.field" type="primary" closable @close="handleClearField(filter.field)">
            {{ filter.label }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增预约" icon-name="Plus" @click="openCreate" />
          <IconButton content="批量审核" icon-name="check" :disabled="isEmpty(checkedIds)" @click="openBatchAudit" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <!-- 新增展开/收缩按钮 -->
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #user_name="{ row }">
        <el-text @click="() => handleClearField('userId') || (dataObj.searchObj.userId = row.userId) || gridApi.query()" type="primary" style="cursor: pointer">
          {{ getUserName(row.userId) }}
        </el-text>
      </template>
      <template #station_name="{ row }">
        <el-text @click="() => handleClearField('stationId') || (dataObj.searchObj.stationId = row.stationId) || gridApi.query()" type="primary" style="cursor: pointer">
          {{ getStationName(row.stationId) }}
        </el-text>
      </template>
      <template #space_name="{ row }">
        <el-text @click="() => handleClearField('spaceId') || (dataObj.searchObj.spaceId = row.spaceId) || gridApi.query()" type="primary" style="cursor: pointer">
          {{ getSpaceName(row.spaceId) }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="{ 待审核: 'warning', 已生效: 'success', 已完成: 'info', 已取消: 'danger' }[row.status]" @click="() => handleClearField('status') || (dataObj.searchObj.status = row.status) || gridApi.query()" style="cursor: pointer">
          {{ row.status }}
        </el-tag>
      </template>
      <template #audit_user_name="{ row }">
        <el-text v-if="row.auditUserId" @click="showAuditorDetail(row.auditUserId)" type="primary" style="cursor: pointer">
          {{ getUserName(row.auditUserId) }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #score="{ row }">
        <el-text v-if="row.score" @click="showScoreDetail(row)" type="primary" style="cursor: pointer">{{ row.score }}分</el-text>
        <span v-else>-</span>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.status === '待审核'">
            <IconButton content="通过" icon-name="check" @click="handleApprove(row)" />
            <IconButton content="驳回" icon-name="close" @click="openReject(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '已生效'">
            <IconButton content="完成" icon-name="check" @click="handleComplete(row)" />
            <IconButton content="取消" icon-name="delete" @click="handleCancel(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '已完成'">
            <IconButton content="评价" icon-name="star" @click="openEvaluate(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else>
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <ReserveDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="预约详情" />

    <!-- 新增预约抽屉 -->
    <CreateDrawer>
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="用户" prop="userId">
          <el-select v-model="createForm.userId" placeholder="请选择用户" filterable clearable style="width: 100%">
            <el-option v-for="o in userOptions" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="场站" prop="stationId">
          <el-select v-model="createForm.stationId" placeholder="请选择场站" filterable clearable style="width: 100%">
            <el-option v-for="o in stationOptions" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="车位" prop="spaceId">
          <el-select v-model="createForm.spaceId" placeholder="请选择车位" filterable clearable style="width: 100%">
            <el-option v-for="o in spaceOptions" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间" prop="reserveTime">
          <el-date-picker v-model="createForm.reserveTime" type="datetime" placeholder="选择预约时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="预约类型" prop="reserveType">
          <el-radio-group v-model="createForm.reserveType">
            <el-radio label="停车预约">停车预约</el-radio>
            <el-radio label="充电预约">充电预约</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </CreateDrawer>

    <!-- 批量审核抽屉 -->
    <BatchAuditDrawer>
      <el-form :model="batchAuditForm" label-width="100px">
        <el-form-item label="审核结果" required>
          <el-radio-group v-model="batchAuditForm.auditResult">
            <el-radio label="通过">通过</el-radio>
            <el-radio label="驳回">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="batchAuditForm.auditRemark" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item v-if="batchAuditForm.auditResult === '驳回'" label="驳回理由" required>
          <el-input v-model="batchAuditForm.rejectReason" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
    </BatchAuditDrawer>

    <!-- 驳回理由抽屉 -->
    <RejectDrawer>
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回理由" required>
          <el-input v-model="rejectForm.rejectReason" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
    </RejectDrawer>

    <!-- 评价抽屉 -->
    <EvaluateDrawer>
      <el-form :model="evaluateForm" label-width="100px">
        <el-form-item label="评分" required>
          <el-rate v-model="evaluateForm.score" :max="5" show-text />
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="evaluateForm.evaluateContent" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
    </EvaluateDrawer>

    <!-- 审核人详情弹窗 -->
    <el-dialog v-model="auditorDetailVisible" title="审核人详情" width="400px">
      <div>审核人ID：{{ currentAuditor.id }}</div>
      <div>审核人姓名：{{ currentAuditor.name }}</div>
    </el-dialog>

    <!-- 评价得分详情弹窗 -->
    <el-dialog v-model="scoreDetailVisible" title="评价详情" width="500px">
      <div>评分：{{ currentScoreDetail.score }}分</div>
      <div>评价内容：{{ currentScoreDetail.evaluateContent || '无' }}</div>
      <div>评价时间：{{ currentScoreDetail.updateTime || '-' }}</div>
    </el-dialog>

  </div>
</template>
