<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, computed } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchHandleFakePlateControl,
  checkFakePlateControl,
  createFakePlateControl,
  deleteFakePlateControl,
  exportFakePlateControl,
  getFakePlateControl,
  getFakePlateControlPage,
  ignoreFakePlateControl,
  updateFakePlateControlProgress,
} from '#/api/genchuan/industry/chargePark/vehiclePass/inParkMgmt/fakePlateControl';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';
import { downloadFileFromBlobPart } from '@vben/utils';
import { formatTime } from '../../../utils/timeFormatter';

import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import {
  dataList,
  detailFields,
  getStationOptions,
  matchSceneTypeMap,
  statusTypeMap,
  textObj,
  useGridColumns,
  useIgnoreFormSchema,
  useSearchFormSchema,
  useUpdateProgressFormSchema,
  useCreateFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 是否使用真实API
const USE_REAL_API = true;

const stationOptions = ref([]);

async function loadStationOptions() {
  try {
    stationOptions.value = await getStationOptions();
  } catch (error) {
    console.error('Failed to load station options:', error);
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
});

const detailDrawerRef = ref(null);
const vehicleDetailRef = ref(null);
const formData = ref();

// 忽略表单
const [IgnoreForm, ignoreFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useIgnoreFormSchema(),
  showDefaultActions: false,
});

const [IgnoreFormDrawer, ignoreFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    ignoreFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      const values = ignoreFormApi.form.values;
      if (!values.ignoreReason || values.ignoreReason.length < 10) {
        ElMessage.error('忽略理由至少10个字');
        return;
      }
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await ignoreFakePlateControl({
          id: values.id,
          ignoreReason: values.ignoreReason,
        });
        ElMessage.success('忽略成功');
        handleRefresh();
        ignoreFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('忽略失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = ignoreFormDrawerApi.getData();
      if (data?.id) {
        await ignoreFormApi.setValues({ id: data.id });
      }
    }
  },
});

// 更新进度表单
const [UpdateProgressForm, updateProgressFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useUpdateProgressFormSchema(),
  showDefaultActions: false,
});

const [UpdateProgressDrawer, updateProgressDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    updateProgressDrawerApi.close();
  },
  async onConfirm() {
    try {
      const values = updateProgressFormApi.form.values;
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await updateFakePlateControlProgress({
          id: values.id,
          handleProgress: values.handleProgress,
        });
        ElMessage.success('更新成功');
        handleRefresh();
        updateProgressDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('更新失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = updateProgressDrawerApi.getData();
      if (data?.id) {
        await updateProgressFormApi.setValues({
          id: data.id,
          handleProgress: data.handleProgress || '',
        });
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  const loadingInstance = ElLoading.service({
    text: '导出中...',
  });
  try {
    if (USE_REAL_API) {
      const res = await exportFakePlateControl(dataObj.searchParams);
      downloadFileFromBlobPart({ fileName: '套牌控制.xlsx', source: res });
      ElMessage.success('导出成功');
    } else {
      exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
    }
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

// 批量处置
async function handleBatchHandle() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要处置的记录');
    return;
  }

  // 检查选中的记录是否都是未处理状态
  const selectedRows = dataObj.list.filter((item) =>
    checkedIds.value.includes(item.id),
  );
  const hasNonPending = selectedRows.some((row) => row.status !== '未处理');

  if (hasNonPending) {
    ElMessage.warning('只能批量处置未处理状态的记录');
    return;
  }

  try {
    await confirm('确认批量处置选中的记录吗？');
    const loadingInstance = ElLoading.service({ text: '处置中...' });
    try {
      await batchHandleFakePlateControl({
        ids: checkedIds.value,
        handleType: '核查',
      });
      ElMessage.success('批量处置成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量处置失败');
      console.error(error);
    }
  }
}

// 核查
async function handleCheck(row) {
  try {
    await confirm('确认核查该套牌记录吗？');
    const loadingInstance = ElLoading.service({ text: '核查中...' });
    try {
      await checkFakePlateControl({ id: row.id });
      ElMessage.success('核查成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('核查失败');
      console.error(error);
    }
  }
}

// 忽略
function handleIgnore(row) {
  ignoreFormDrawerApi.setData({ title: '忽略套牌记录', id: row.id }).open();
}

// 更新进度
function handleUpdateProgress(row) {
  updateProgressDrawerApi
    .setData({
      title: '更新处置进度',
      id: row.id,
      handleProgress: row.handleProgress,
    })
    .open();
}

// 删除
async function handleDelete(row) {
  try {
    await confirm('确认删除该套牌记录吗？');
    const loadingInstance = ElLoading.service({ text: '删除中...' });
    try {
      await deleteFakePlateControl(row.id);
      ElMessage.success('删除成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
      console.error(error);
    }
  }
}

// 新增
function handleCreate() {
  createFormDrawerApi.setData({ title: '补录套牌记录' }).open();
}

// 新增表单
const [CreateForm, createFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: computed(() => {
    const schema = useCreateFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
  showDefaultActions: false,
});

const [CreateFormDrawer, createFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  confirmText: '保存',
  cancelText: '取消',
  onCancel() {
    createFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await createFormApi.validate();
    } catch {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const values = createFormApi.form.values;

    if (USE_REAL_API) {
      const loadingInstance = ElLoading.service({ text: '补录中...' });
      try {
        await createFakePlateControl(values);
        ElMessage.success('补录成功');
        handleRefresh();
        createFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('补录失败');
        console.error(error);
      } finally {
        loadingInstance.close();
      }
    } else {
      dataObj.apilist.push({
        ...values,
        id: Date.now(),
        status: '未处理',
        isCorrected: false,
        creator: 'admin',
        createTime: Date.now(),
        updater: 'admin',
        updateTime: Date.now(),
      });
      handleRefresh();
      createFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
    }
  },
});

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  searchParams: {},
  filterLabels: {}, // 存储筛选条件的标签
});

let isSearching = false;

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;
  const labels = dataObj.filterLabels;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.matchScene) {
    const matchSceneLabel = labels.matchScene || obj.matchScene;
    filters.push({ label: `匹配场景：${matchSceneLabel}`, field: 'matchScene' });
  }
  if (obj.status) {
    const statusLabel = labels.status || obj.status;
    filters.push({ label: `状态：${statusLabel}`, field: 'status' });
  }
  if (obj.stationName) {
    filters.push({ label: `场站：${obj.stationName}`, field: 'stationId' });
  }
  if (obj.handleUserId) {
    const handleUserName = labels.handleUserId || obj.handleUserId;
    filters.push({ label: `处置人：${handleUserName}`, field: 'handleUserId' });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchParams };
  delete next[fieldName];
  dataObj.searchParams = next;

  const nextLabels = { ...dataObj.filterLabels };
  delete nextLabels[fieldName];
  dataObj.filterLabels = nextLabels;

  dataObj.currentPage = 1;
  gridApi.query();
};

const handleResetFilters = () => {
  dataObj.searchParams = {};
  dataObj.filterLabels = {};
  dataObj.currentPage = 1;
  gridApi.query();
};

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: isSearching ? 1 : page.currentPage,
        pageSize: page.pageSize,
        ...dataObj.searchParams,
      };

      if (isSearching) {
        isSearching = false;
        dataObj.currentPage = 1;
      } else {
        dataObj.currentPage = page.currentPage;
      }

      const res = await getFakePlateControlPage(params);
      dataObj.total = res.total || 0;
      dataObj.list = res.list || [];
      return dataObj;
    } catch (error) {
      ElMessage.error('获取数据失败');
      console.error(error);
      return dataObj;
    }
  }

  // 使用模拟数据
  const filteredList = dataObj.apilist.filter((v) => {
    let statusMatch = true;
    switch (activeName.value) {
      case '处理中': {
        statusMatch = v.status === '处理中';
        break;
      }
      case '已关闭': {
        statusMatch = v.status === '已关闭';
        break;
      }
      case '未处理': {
        statusMatch = v.status === '未处理';
        break;
      }
    }

    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        if (key === 'identifyTime' && Array.isArray(value) && value.length === 2) {
          // 处理时间范围
          const [startTime, endTime] = value;
          const start = new Date(startTime).getTime();
          const end = new Date(endTime).getTime();
          searchMatch = searchMatch && v[key] >= start && v[key] <= end;
        } else if (typeof value === 'string') {
          searchMatch = searchMatch && v[key]?.toString().includes(value);
        } else {
          searchMatch = searchMatch && v[key] === value;
        }
      }
    });

    return statusMatch && searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [SearchForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: computed(() => {
    const schema = useSearchFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

function onSubmit(values) {
  dataObj.searchParams = values;

  // 保存标签信息
  const labels = {};
  const searchSchema = useSearchFormSchema();
  searchSchema.forEach((field) => {
    if (field.component === 'Select' && values[field.fieldName]) {
      const option = field.componentProps.options?.find(
        (opt) => opt.value === values[field.fieldName]
      );
      if (option) {
        labels[field.fieldName] = option.label;
      }
    }
  });

  dataObj.filterLabels = labels;
  isSearching = true;
  gridApi.query();
  drawerApi.close();
}


const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
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

const activeName = ref('全部');

const handleOpenDetail = async (row) => {
  try {
    const loadingInstance = ElLoading.service({ text: '加载详情中...' });
    try {
      const data = await getFakePlateControl(row.id);
      dataObj.detailObj = data;
      detailDrawerRef.value.open();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情失败');
    // 失败时使用行数据兜底
    dataObj.detailObj = row;
    detailDrawerRef.value.open();
  }
};

// 车牌点击 - 查看车辆详情
const handlePlateNoClick = (row) => {
  if (!row.plateNo) {
    ElMessage.warning('该记录无车牌信息');
    return;
  }
  vehicleDetailRef.value?.open(row.plateNo);
};

// 匹配场景点击 - 筛选同场景记录
const handleMatchSceneClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    matchScene: row.matchScene,
  };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选匹配场景: ${row.matchScene}`);
};

// 状态点击 - 筛选同状态记录
const handleStatusClick = (row) => {
  dataObj.searchParams = { ...dataObj.searchParams, status: row.status };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选状态: ${row.status}`);
};

// 场站点击 - 筛选同场站记录
const handleStationClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    stationId: row.stationId,
    stationName: row.stationName,
  };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选场站: ${row.stationName}`);
};

// 处置人点击 - 筛选同处置人记录
const handleHandleUserClick = (row) => {
  if (!row.handleUserName) return;
  dataObj.searchParams = {
    ...dataObj.searchParams,
    handleUserId: row.handleUserId,
  };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选处置人: ${row.handleUserName}`);
};

// 片区点击 - 筛选同片区记录
const handleAreaClick = (row) => {
  if (!row.area) return;
  dataObj.searchParams = {
    ...dataObj.searchParams,
    area: row.area,
  };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选片区: ${row.area}`);
};

// 操作人点击 - 筛选同操作人记录
const handleUpdaterClick = (row) => {
  if (!row.updater) return;
  dataObj.searchParams = {
    ...dataObj.searchParams,
    updater: row.updater,
  };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选操作人: ${row.updater}`);
};

// 根据状态判断按钮显示
const shouldShowCheck = (status) => status === '未处理';
const shouldShowIgnore = (status) => status === '未处理';
const shouldShowUpdateProgress = (status) => status === '处理中';

const tabsData = ref([
  { label: '全部' },
  { label: '未处理' },
  { label: '处理中' },
  { label: '已关闭' },
]);

const createLabel = (item) => {
  let count = 0;
  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '处理中': {
      count = dataObj.apilist.filter((v) => v.status === '处理中').length;
      break;
    }
    case '已关闭': {
      count = dataObj.apilist.filter((v) => v.status === '已关闭').length;
      break;
    }
    case '未处理': {
      count = dataObj.apilist.filter((v) => v.status === '未处理').length;
      break;
    }
  }
  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// 处理图表卡片点击筛选
const handleFilterByChart = (event) => {
  const filterParams = event.detail;
  dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:fakePlateControl', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:fakePlateControl', handleFilterByChart);
});
</script>

<template>
  <div class="park-lot-table-new">
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailRef" />
    <IgnoreFormDrawer title="忽略套牌记录">
      <IgnoreForm />
    </IgnoreFormDrawer>
    <UpdateProgressDrawer title="更新处置进度">
      <UpdateProgressForm />
    </UpdateProgressDrawer>
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <Drawer title="搜索">
      <SearchForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="activeFilters.length" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px;">
            <el-tag
              v-for="filter in activeFilters"
              :key="filter.field"
              type="primary"
              closable
              @close="handleClearField(filter.field)"
            >
              {{ filter.label }}
            </el-tag>
            <IconButton
              v-if="activeFilters.length > 0"
              content="重置"
              icon-name="RefreshLeft"
              @click="handleResetFilters"
            />
          </div>
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
          <IconButton
            content="筛选"
            icon-name="Filter"
            @click="handleSerachShow"
          />
          <IconButton
            content="重置"
            icon-name="Refresh"
            @click="handleResetFilters"
          />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
          />
          <IconButton content="补录" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="批量处置"
            icon-name="Operation"
            @click="handleBatchHandle"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #plateNo="{ row }">
        <el-text
          @click="handlePlateNoClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #matchScene="{ row }">
        <el-text
          @click="handleMatchSceneClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.matchScene }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="statusTypeMap[row.status]">
          {{ row.status }}
        </el-tag>
      </template>
      <template #stationName="{ row }">
        <el-text
          @click="handleStationClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationName }}
        </el-text>
      </template>
      <template #handleUserName="{ row }">
        <el-text
          v-if="row.handleUserName"
          @click="handleHandleUserClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.handleUserName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="shouldShowCheck(row.status)"
            content="核查"
            icon-name="Check"
            @click="handleCheck(row)"
          />
          <IconButton
            v-if="shouldShowIgnore(row.status)"
            content="忽略"
            icon-name="Close"
            @click="handleIgnore(row)"
          />
          <IconButton
            v-if="shouldShowUpdateProgress(row.status)"
            content="更新进度"
            icon-name="Edit"
            @click="handleUpdateProgress(row)"
          />
          <IconButton
            content="删除"
            icon-name="Delete"
            @click="handleDelete(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span
            >本页统计：套牌记录数量: {{ dataObj.list.length }}; 已选择:
            {{ checkedIds.length }}</span
          >
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
