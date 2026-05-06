<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchHandleOilCar,
  exportOilCarHandle,
  getOilCarHandle,
  getOilCarHandlePage,
  handleOilCar,
  ignoreOilCarHandle,
  updateOilCarHandleProgress,
} from '#/api/genchuan/industry/chargePark/vehiclePass/inParkMgmt/oilCarHandle';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import SpaceDetailDialog from '../../../components/SpaceDetailDialog.vue';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import {
  dataList,
  detailFields,
  occupyTypeMap,
  statusTypeMap,
  textObj,
  useGridColumns,
  useHandleFormSchema,
  useIgnoreFormSchema,
  useSearchFormSchema,
  useUpdateProgressFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

const USE_REAL_API = true;

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
const spaceDetailRef = ref(null);
const formData = ref();

// 处置表单
const [HandleForm, handleFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useHandleFormSchema(),
  showDefaultActions: false,
});

const [HandleFormDrawer, handleFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    handleFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      const values = handleFormApi.form.values;
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await handleOilCar({
          id: values.id,
          handleMethod: values.handleMethod,
        });
        ElMessage.success('处置成功');
        handleRefresh();
        handleFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('处置失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = handleFormDrawerApi.getData();
      if (data?.id) {
        await handleFormApi.setValues({ id: data.id });
      }
    }
  },
});

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
        await ignoreOilCarHandle({
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
        await updateOilCarHandleProgress({
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
  if (USE_REAL_API) {
    try {
      await exportOilCarHandle(dataObj.searchParams);
      ElMessage.success('导出成功');
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    }
  } else {
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

// 批量处置
async function handleBatchHandle() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要处置的记录');
    return;
  }

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
      await batchHandleOilCar({ ids: checkedIds.value, handleType: '处置' });
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

// 处置
function handleHandle(row) {
  handleFormDrawerApi.setData({ title: '处置油车占位', id: row.id }).open();
}

// 忽略
function handleIgnore(row) {
  ignoreFormDrawerApi.setData({ title: '忽略油车占位', id: row.id }).open();
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
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...dataObj.searchParams,
      };

      const res = await getOilCarHandlePage(params);
      dataObj.total = res.total || 0;
      dataObj.list = res.list || [];
      return dataObj;
    } catch (error) {
      ElMessage.error('获取数据失败');
      console.error(error);
      return dataObj;
    }
  }

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
        searchMatch =
          typeof value === 'string'
            ? searchMatch && v[key]?.toString().includes(value)
            : searchMatch && v[key] === value;
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

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
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
      const data = await getOilCarHandle(row.id);
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

const handlePlateNoClick = (row) => {
  if (!row.plateNo) {
    ElMessage.warning('该记录无车牌信息');
    return;
  }
  vehicleDetailRef.value?.open(row.plateNo);
};

const handleSpaceNameClick = (row) => {
  spaceDetailRef.value?.open(row.spaceName, row);
};

const handleOccupyTypeClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    occupyType: row.occupyType,
  };
  handleRefresh();
  ElMessage.success(`已筛选占位类型: ${row.occupyType}`);
};

const handleStatusClick = (row) => {
  dataObj.searchParams = { ...dataObj.searchParams, status: row.status };
  handleRefresh();
  ElMessage.success(`已筛选状态: ${row.status}`);
};

const handleStationClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    stationName: row.stationName,
  };
  handleRefresh();
  ElMessage.success(`已筛选场站: ${row.stationName}`);
};

const handleHandleUserClick = (row) => {
  if (!row.handleUserName) return;
  dataObj.searchParams = {
    ...dataObj.searchParams,
    handleUserId: row.handleUserId,
  };
  handleRefresh();
  ElMessage.success(`已筛选处置人: ${row.handleUserName}`);
};

const shouldShowHandle = (status) => status === '未处理';
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
  window.addEventListener('filterByChart:oilCarHandle', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:oilCarHandle', handleFilterByChart);
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
    <SpaceDetailDialog ref="spaceDetailRef" />
    <HandleFormDrawer title="处置油车占位">
      <HandleForm />
    </HandleFormDrawer>
    <IgnoreFormDrawer title="忽略油车占位">
      <IgnoreForm />
    </IgnoreFormDrawer>
    <UpdateProgressDrawer title="更新处置进度">
      <UpdateProgressForm />
    </UpdateProgressDrawer>
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
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
          <IconButton
            content="筛选"
            icon-name="Filter"
            @click="handleSerachShow"
          />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
          />
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
      <template #id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.id }}
        </el-text>
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
      <template #spaceName="{ row }">
        <el-text
          @click="handleSpaceNameClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.spaceName }}
        </el-text>
      </template>
      <template #occupyType="{ row }">
        <el-tag
          :type="occupyTypeMap[row.occupyType] || 'info'"
          @click="handleOccupyTypeClick(row)"
          style="cursor: pointer"
        >
          {{ row.occupyType }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="statusTypeMap[row.status] || 'info'"
          @click="handleStatusClick(row)"
          style="cursor: pointer"
        >
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
            v-if="shouldShowHandle(row.status)"
            content="处置"
            icon-name="Check"
            @click="handleHandle(row)"
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
            >本页统计：处置记录数量: {{ dataObj.list.length }}; 已选择:
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
