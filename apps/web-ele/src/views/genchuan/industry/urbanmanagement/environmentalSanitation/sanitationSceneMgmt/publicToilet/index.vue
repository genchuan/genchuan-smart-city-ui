<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import ParkDetailDrawer from './detail.vue';
import ComplaintDetailDrawer from './complaintDetail.vue';
import RepairDetailDrawer from './repairDetail.vue';
import Chart2 from './chart2.vue';
import {
  getPublicToiletPage,
  createPublicToilet,
  updatePublicToilet,
  deletePublicToilet,
  deletePublicToiletBatch,
  exportPublicToiletExcel,
  getToiletComplaintPage,
  createToiletComplaint,
  updateToiletComplaint,
  deleteToiletComplaint,
  deleteToiletComplaintBatch,
  exportToiletComplaintExcel,
  getToiletFacilityRepairPage,
  createToiletFacilityRepair,
  updateToiletFacilityRepair,
  deleteToiletFacilityRepair,
  deleteToiletFacilityRepairBatch,
  exportToiletFacilityRepairExcel,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/publicToilet/data.js';
import {
  textObj,
  useFormSchema,
  useComplaintFormSchema,
  useRepairFormSchema,
  getColumnsByStatus,
  getPublicToiletOptions,
  getUserOptions,
  getAreaOptions,
  getOperationStatusOptions,
  getComplaintTypeOptions,
  getFacilityOptions,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/publicToilet/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 状态与数据 ----------
const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '保洁待执行' },
  { label: '物资待补充' },
  { label: '投诉待处置' },
  { label: '设施待维修' },
  { label: '已完成' },
]);

const counts = ref({
  total: 0,
  planStatusCounts: {
    全部: 8,
    保洁待执行: 8,
    物资待补充: 8,
    投诉待处置: 8,
    设施待维修: 8,
    已完成: 8,
  },
});

const createLabel = (item) => {
  const key = item.label;
  return `${key} (${counts.value.planStatusCounts?.[key] || 0})`;
};

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});

const checkedIds = ref([]);

// 存储所有下拉选项
const loadedOptions = reactive({
  area: [],
  operationStatus: [],
  complaintType: [],
  facility: [],
  toilet: [],
  user: [],
});

// ---------- 判断当前标签页属于哪个数据源 ----------
const isComplaintTab = computed(() => activeName.value === '投诉待处置');
const isRepairTab = computed(() => activeName.value === '设施待维修');
const isToiletTab = computed(() => !isComplaintTab.value && !isRepairTab.value);

// ---------- 表格列动态更新 ----------
const gridColumns = ref(getColumnsByStatus(activeName.value));

// ---------- 创建三个独立的搜索表单组件 ----------
// 公厕搜索表单
const [ToiletSearchForm, toiletSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async () => {
    const rawValues = await toiletSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== '')
    );
    console.log('公厕搜索参数（已过滤空值）:', filteredParams);
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema().filter(f => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 投诉搜索表单
const [ComplaintSearchForm, complaintSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async () => {
    const rawValues = await complaintSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== '')
    );
    console.log('投诉搜索参数（已过滤空值）:', filteredParams);
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useComplaintFormSchema().filter(f => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 维修搜索表单
const [RepairSearchForm, repairSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async () => {
    const rawValues = await repairSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== '')
    );
    console.log('维修搜索参数（已过滤空值）:', filteredParams);
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useRepairFormSchema().filter(f => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 根据当前标签页选择对应的搜索表单组件和 API
const currentSearchFormComponent = computed(() => {
  if (isComplaintTab.value) return ComplaintSearchForm;
  if (isRepairTab.value) return RepairSearchForm;
  return ToiletSearchForm;
});

const currentSearchFormApi = computed(() => {
  if (isComplaintTab.value) return complaintSearchFormApi;
  if (isRepairTab.value) return repairSearchFormApi;
  return toiletSearchFormApi;
});

// ---------- 搜索抽屉 ----------
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

// ---------- 三个独立的编辑表单组件 ----------
// 公厕表单
const [ToiletEditForm, toiletEditFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

// 投诉表单
const [ComplaintEditForm, complaintEditFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useComplaintFormSchema(),
  showDefaultActions: false,
});

// 维修表单
const [RepairEditForm, repairEditFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useRepairFormSchema(),
  showDefaultActions: false,
});

// 根据当前标签页选择对应的编辑表单组件和 API
const currentFormComponent = computed(() => {
  if (isComplaintTab.value) return ComplaintEditForm;
  if (isRepairTab.value) return RepairEditForm;
  return ToiletEditForm;
});

const currentFormApi = computed(() => {
  if (isComplaintTab.value) return complaintEditFormApi;
  if (isRepairTab.value) return repairEditFormApi;
  return toiletEditFormApi;
});

// 编辑抽屉
const formData = ref();
const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => editDrawerApi.close(),
  async onConfirm() {
    const formValues = await currentFormApi.value.getValues();
    const isAdd = !formData.value?.id;

    try {
      if (isComplaintTab.value) {
        const submitData = { ...formValues };
        if (isAdd) {
          await createToiletComplaint(submitData);
        } else {
          await updateToiletComplaint({ ...submitData, id: formData.value.id });
        }
      } else if (isRepairTab.value) {
        const submitData = { ...formValues };
        if (isAdd) {
          await createToiletFacilityRepair(submitData);
        } else {
          await updateToiletFacilityRepair({ ...submitData, id: formData.value.id });
        }
      } else {
        const submitData = {
          ...formValues,
          cleanerIds: Array.isArray(formValues.cleanerIds) ? JSON.stringify(formValues.cleanerIds) : formValues.cleanerIds,
        };
        if (isAdd) {
          await createPublicToilet(submitData);
        } else {
          await updatePublicToilet({ ...submitData, id: formData.value.id });
        }
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh();
      editDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      ElMessage.error('操作失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = editDrawerApi.getData();
      if (formData.value?.id) {
        await currentFormApi.value.setValues(formData.value);
      } else {
        await currentFormApi.value.resetForm();
        if (isComplaintTab.value) {
          currentFormApi.value.setValues({ complaintTime: Date.now() });
        } else if (isRepairTab.value) {
          currentFormApi.value.setValues({ reportTime: Date.now(), repairStatus: '待维修' });
        }
      }
    }
  },
});

// ---------- 详情抽屉引用 ----------
const parkDetailDrawerRef = ref(null);
const complaintDetailDrawerRef = ref(null);
const repairDetailDrawerRef = ref(null);

// ---------- 数据转换函数 ----------
function convertToiletItem(item) {
  return {
    ...item,
    name: item.name || item.toiletName,
    areaName: item.areaName || item.areaCode,
    managerName: item.managerName || item.managerId,
    operationStatusName: item.operationStatusName || item.operationStatusId,
    cleanersName: item.cleanersName || (item.cleanerIds ? JSON.parse(item.cleanerIds) : []),
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    lastSupplyTime: item.lastSupplyTime ? new Date(item.lastSupplyTime).toLocaleString() : '-',
    warningStatus: item.consumableGap > 0 ? '预警' : '正常',
  };
}

function convertComplaintItem(item) {
  return {
    ...item,
    complaintTime: item.complaintTime ? new Date(item.complaintTime).toLocaleString() : '-',
    reportTime: item.reportTime ? new Date(item.reportTime).toLocaleString() : '-',
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    toiletName: item.toiletName,
    complaintTypeName: item.complaintTypeName,
    handlerName: item.handlerName,
  };
}

function convertRepairItem(item) {
  return {
    ...item,
    reportTime: item.reportTime ? new Date(item.reportTime).toLocaleString() : '-',
    expectedCompleteTime: item.expectedCompleteTime ? new Date(item.expectedCompleteTime).toLocaleString() : '-',
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    toiletName: item.toiletName,
    facilityName: item.facilityName,
    reportName: item.reportName,
    repairName: item.repairName,
  };
}

// ---------- 获取表格数据 ----------
const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
  };

  console.log('请求参数:', params);

  try {
    let res;
    if (isComplaintTab.value) {
      res = await getToiletComplaintPage(params);
    } else if (isRepairTab.value) {
      res = await getToiletFacilityRepairPage(params);
    } else {
      res = await getPublicToiletPage(params);
    }

    const listData = res.data?.list || res.list || [];
    const total = res.data?.total || res.total || 0;

    let convertedList = [];
    if (isComplaintTab.value) {
      convertedList = listData.map(convertComplaintItem);
    } else if (isRepairTab.value) {
      convertedList = listData.map(convertRepairItem);
    } else {
      convertedList = listData.map(convertToiletItem);
    }

    dataObj.total = total;
    dataObj.list = convertedList;
    return dataObj;
  } catch (error) {
    console.error('获取数据失败', error);
    ElMessage.error('数据加载失败，请重试');
    dataObj.total = 0;
    dataObj.list = [];
    return dataObj;
  }
};

// ---------- Grid 配置 ----------
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
  gridEvents: {
    checkboxAll: ({ records }) => {
      checkedIds.value = records.map(item => item.id);
    },
    checkboxChange: ({ records }) => {
      checkedIds.value = records.map(item => item.id);
    },
  },
  showSearchForm: false,
});

// 监听标签页变化，更新列定义并重置搜索参数
watch(activeName, (newVal) => {
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({ columns: gridColumns.value });
  }
  dataObj.searchParams = {};
  searchDrawerApi.close();
  parkDetailDrawerRef.value?.close();
  complaintDetailDrawerRef.value?.close();
  repairDetailDrawerRef.value?.close();
  handleRefresh();
});

// ---------- 操作函数 ----------
function handleRefresh() {
  gridApi.query();
}

function handleClick() {
  gridApi.query();
}

function handleSerachShow() {
  // 打开前重置当前搜索表单
  currentSearchFormApi.value.resetForm();
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
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deleting', [row.name || row.complaintId || row.repairId]) });
  try {
    if (isComplaintTab.value) {
      await deleteToiletComplaint(row.id);
    } else if (isRepairTab.value) {
      await deleteToiletFacilityRepair(row.id);
    } else {
      await deletePublicToilet(row.id);
    }
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } catch (error) {
    console.error('删除失败', error);
    ElMessage.error('删除失败：' + (error.message || '未知错误'));
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  if (isEmpty(checkedIds.value)) return;
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deletingBatch') });
  try {
    if (isComplaintTab.value) {
      await deleteToiletComplaintBatch(checkedIds.value);
    } else if (isRepairTab.value) {
      await deleteToiletFacilityRepairBatch(checkedIds.value);
    } else {
      await deletePublicToiletBatch(checkedIds.value);
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    console.warn('批量删除失败', error);
    ElMessage.error('批量删除失败：' + (error.message || '未知错误'));
  } finally {
    loading.close();
  }
}

async function handleExport() {
  const params = dataObj.searchParams || {};
  try {
    let response;
    let fileName = textObj.excelAllName;
    if (isComplaintTab.value) {
      response = await exportToiletComplaintExcel(params);
      fileName = `投诉记录_${new Date().toLocaleDateString()}.xlsx`;
    } else if (isRepairTab.value) {
      response = await exportToiletFacilityRepairExcel(params);
      fileName = `维修记录_${new Date().toLocaleDateString()}.xlsx`;
    } else {
      response = await exportPublicToiletExcel(params);
      fileName = `公厕信息_${new Date().toLocaleDateString()}.xlsx`;
    }

    const blob = response.data || response;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    ElMessage.error('导出失败：' + (error.message || '未知错误'));
  }
}

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  if (isComplaintTab.value) {
    complaintDetailDrawerRef.value?.open();
  } else if (isRepairTab.value) {
    repairDetailDrawerRef.value?.open();
  } else {
    parkDetailDrawerRef.value?.open();
  }
}

function handleOpenAreaFilter(area) {
  activeName.value = '全部';
  dataObj.searchParams = { area };
  gridApi.reload();
}

function handleOpenStatusFilter(status) {
  const statusMap = {
    正常运营: '全部',
    暂停运营: '全部',
    待整改: '全部',
  };
  const targetTab = statusMap[status] || '全部';
  activeName.value = targetTab;
  gridApi.reload();
}

function handleOpenComplaintDetail(row) {
  dataObj.detailObj = row;
  complaintDetailDrawerRef.value?.open();
}

const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// ---------- 加载下拉选项 ----------
async function loadOptions() {
  try {
    const [
      toiletOptionsRes,
      userOptionsRes,
      areaOptionsRes,
      operationStatusOptionsRes,
      complaintTypeOptionsRes,
      facilityOptionsRes,
    ] = await Promise.all([
      getPublicToiletOptions(),
      getUserOptions(),
      getAreaOptions(),
      getOperationStatusOptions(),
      getComplaintTypeOptions(),
      getFacilityOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      console.warn('返回数据格式异常', res);
      return [];
    };

    loadedOptions.toilet = extractData(toiletOptionsRes);
    loadedOptions.user = extractData(userOptionsRes);
    loadedOptions.area = extractData(areaOptionsRes);
    loadedOptions.operationStatus = extractData(operationStatusOptionsRes);
    loadedOptions.complaintType = extractData(complaintTypeOptionsRes);
    loadedOptions.facility = extractData(facilityOptionsRes);

    // 更新公厕编辑表单
    await toiletEditFormApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'operationStatusId', componentProps: { options: loadedOptions.operationStatus } },
      { fieldName: 'managerId', componentProps: { options: loadedOptions.user } },
      { fieldName: 'cleanerIds', componentProps: { options: loadedOptions.user } },
    ]);

    // 更新投诉编辑表单
    await complaintEditFormApi.updateSchema([
      { fieldName: 'toiletId', componentProps: { options: loadedOptions.toilet } },
      { fieldName: 'complaintTypeId', componentProps: { options: loadedOptions.complaintType } },
      { fieldName: 'handlerId', componentProps: { options: loadedOptions.user } },
    ]);

    // 更新维修编辑表单
    await repairEditFormApi.updateSchema([
      { fieldName: 'toiletId', componentProps: { options: loadedOptions.toilet } },
      { fieldName: 'facilityId', componentProps: { options: loadedOptions.facility } },
      { fieldName: 'reportBy', componentProps: { options: loadedOptions.user } },
      { fieldName: 'repairBy', componentProps: { options: loadedOptions.user } },
    ]);

    // 更新公厕搜索表单
    await toiletSearchFormApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'operationStatusId', componentProps: { options: loadedOptions.operationStatus } },
      { fieldName: 'managerId', componentProps: { options: loadedOptions.user } },
      { fieldName: 'cleanerIds', componentProps: { options: loadedOptions.user } },
    ]);

    // 更新投诉搜索表单
    await complaintSearchFormApi.updateSchema([
      { fieldName: 'toiletId', componentProps: { options: loadedOptions.toilet } },
      { fieldName: 'complaintTypeId', componentProps: { options: loadedOptions.complaintType } },
      { fieldName: 'handlerId', componentProps: { options: loadedOptions.user } },
    ]);

    // 更新维修搜索表单
    await repairSearchFormApi.updateSchema([
      { fieldName: 'toiletId', componentProps: { options: loadedOptions.toilet } },
      { fieldName: 'facilityId', componentProps: { options: loadedOptions.facility } },
      { fieldName: 'reportBy', componentProps: { options: loadedOptions.user } },
      { fieldName: 'repairBy', componentProps: { options: loadedOptions.user } },
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
    <!-- 编辑抽屉：动态渲染对应的表单组件 -->
    <EditDrawer :title="getTitle">
      <component :is="currentFormComponent" ref="editFormRef" />
    </EditDrawer>

    <!-- 详情抽屉 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <ComplaintDetailDrawer ref="complaintDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <RepairDetailDrawer ref="repairDetailDrawerRef" :detail-obj="dataObj.detailObj" />

    <!-- 搜索抽屉：动态渲染对应的搜索表单组件 -->
    <SearchDrawer title="搜索">
      <component :is="currentSearchFormComponent" ref="searchFormRef" />
    </SearchDrawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" v-if="props.secondShow">
          <el-tabs v-model="activeName" @tab-change="handleClick">
            <el-tab-pane
              v-for="item in tabsData"
              :key="item.label"
              :label="createLabel(item)"
              :name="item.label"
            />
          </el-tabs>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton
            :content="showChart ? '隐藏图表' : '显示图表'"
            icon-name="PieChart"
            @click="toggleChart"
          />
        </div>
      </template>

      <!-- 钻取列自定义渲染 -->
      <template #name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.name }}</el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleOpenAreaFilter(row.areaName)" type="primary">{{ row.areaName }}</el-text>
      </template>
      <template #status="{ row }">
        <el-text @click="handleOpenStatusFilter(row.operationStatusName)" type="primary">
          {{ row.operationStatusName }}
        </el-text>
      </template>
      <template #toiletName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.toiletName }}</el-text>
      </template>
      <template #complaintId="{ row }">
        <el-text @click="handleOpenComplaintDetail(row)" type="primary">{{ row.complaintId }}</el-text>
      </template>
      <template #complaintType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.complaintTypeName }}</el-text>
      </template>
      <template #repairId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.repairId }}</el-text>
      </template>
      <template #facilityType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.facilityName }}</el-text>
      </template>
      <template #photoUrl="{ row }">
        <a v-if="row.photoUrl" :href="row.photoUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>
      <template #proofUrl="{ row }">
        <a v-if="row.proofUrl" :href="row.proofUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>
      <template #taskType="{ row }">
        {{ row.taskType || '-' }}
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow" />
            <ArrowUp v-else />
          </el-icon>
          <span>本页统计：任务总数{{ dataObj.list.length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：{{ textObj.total }}</span>
          <div v-if="dataObj.totalShow && showChart && activeName !== '全部'" class="bottom-chart-wrapper">
            <Chart2 :active-name="activeName" :data-list="dataObj.list" />
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>
