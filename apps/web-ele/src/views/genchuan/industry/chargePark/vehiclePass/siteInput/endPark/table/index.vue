<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTime } from '../../../utils/timeFormatter';
import {
  exportEndPark,
  getEndParkPage,
  getEndPark,
  payEndPark,
  confirmEndPark,
  cancelEndPark,
} from '#/api/genchuan/industry/chargePark/vehiclePass/siteInput/endPark';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import IconButton from '#/components/common/IconButton.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import { exportToExcel } from '#/utils/excel.js';

import SpaceDetailDialog from '../../../components/SpaceDetailDialog.vue';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';

import {
  dataList,
  detailFields,
  getStationOptions,
  textObj,
  useSearchFormSchema,
  useCreateFormSchema,
  useGridColumns,
  usePayFormSchema,
  useCancelFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 是否使用真实API（默认false使用模拟数据）
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
  onConfirm() {},
  async onOpenChange() {},
});

const detailDrawerRef = ref(null);
const vehicleDetailRef = ref(null);
const spaceDetailRef = ref(null);

const [CreateForm, createFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
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
  onCancel() {
    createFormDrawerApi.close();
  },
  onConfirm() {
    const obj = createFormApi.form.values;
    dataObj.apilist.push(obj);
    handleRefresh();
    createFormDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
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
      const res = await exportEndPark(dataObj.searchParams);
      downloadFileFromBlobPart({ fileName: '结束停车.xlsx', source: res });
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

function handleCreate() {
  createFormDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.plateNo]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.plateNo]));
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
    dataObj.apilist = dataObj.apilist.filter(
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
  currentRow: null,
});

let isSearching = false;

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;
  const labels = dataObj.filterLabels;

  if (obj.plateNo) {
    filters.push({ label: `车牌：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.status) {
    const statusLabel = labels.status || obj.status;
    filters.push({ label: `缴费状态：${statusLabel}`, field: 'status' });
  }
  if (obj.areaId) {
    const areaName = labels.areaId || obj.areaName || obj.areaId;
    filters.push({ label: `片区：${areaName}`, field: 'areaId' });
  }
  if (obj.operatorId) {
    const operatorName = labels.operatorId || obj.operatorName || obj.operatorId;
    filters.push({ label: `操作人：${operatorName}`, field: 'operatorId' });
  }
  if (obj.endTime && Array.isArray(obj.endTime) && obj.endTime.length === 2) {
    filters.push({
      label: `结束时间：${obj.endTime[0]} 至 ${obj.endTime[1]}`,
      field: 'endTime',
    });
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

  // 使用真实API
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

      const res = await getEndParkPage(params);
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
      case '待支付': {
        statusMatch = v.status === '待支付';
        break;
      }
      case '已支付': {
        statusMatch = v.status === '已支付';
        break;
      }
      case '已取消': {
        statusMatch = v.status === '已取消';
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

const [SearchForm] = useVbenForm({
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
  schema: computed(() => {
    const schema = useSearchFormSchema().map((v) => {
      delete v.rules;
      return { ...v };
    });

    const areaField = schema.find((f) => f.fieldName === 'areaId');
    if (areaField) {
      areaField.componentProps.options = stationOptions.value;
    }

    return schema;
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

function onSubmit(values) {
  // 过滤掉空值，只合并有值的字段
  const newParams = {};
  Object.keys(values).forEach((key) => {
    if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
      newParams[key] = values[key];
    }
  });

  dataObj.searchParams = { ...dataObj.searchParams, ...newParams };

  // 保存标签信息
  const labels = {};
  const searchSchema = useSearchFormSchema();
  searchSchema.forEach((field) => {
    if (field.component === 'Select' && newParams[field.fieldName]) {
      const option = field.componentProps.options?.find(
        (opt) => String(opt.value) === String(newParams[field.fieldName])
      );
      if (option) {
        labels[field.fieldName] = option.label;
      }
    }
  });

  // 片区标签从 stationOptions 获取
  if (newParams.areaId) {
    const areaOption = stationOptions.value.find(
      (opt) => String(opt.value) === String(newParams.areaId)
    );
    if (areaOption) {
      labels.areaId = areaOption.label;
    }
  }

  dataObj.filterLabels = { ...dataObj.filterLabels, ...labels };
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
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
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
  if (USE_REAL_API) {
    try {
      const res = await getEndPark(row.id);
      dataObj.detailObj = res;
      detailDrawerRef.value.open();
    } catch (error) {
      ElMessage.error('获取详情失败');
      console.error(error);
    }
  } else {
    dataObj.detailObj = row;
    detailDrawerRef.value.open();
  }
};

const tabsData = ref([
  { label: '全部' },
  { label: '待支付' },
  { label: '已支付' },
  { label: '已取消' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '待支付': {
      count = dataObj.apilist.filter((v) => v.status === '待支付').length;
      break;
    }
    case '已支付': {
      count = dataObj.apilist.filter((v) => v.status === '已支付').length;
      break;
    }
    case '已取消': {
      count = dataObj.apilist.filter((v) => v.status === '已取消').length;
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
  const { status, date } = event.detail;

  if (status !== undefined) {
    // 卡片钻取：按状态筛选
    if (status === null) {
      // 结束量卡片：移除状态筛选，保留其他条件
      const { status: _, ...rest } = dataObj.searchParams;
      dataObj.searchParams = rest;
    } else {
      // 支付成功率卡片：显示已支付记录
      dataObj.searchParams = { ...dataObj.searchParams, status };
    }
  } else if (date) {
    // 折线图钻取：按日期筛选，将日期转换为时间范围
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    dataObj.searchParams = {
      ...dataObj.searchParams,
      endTime: [formatDate(startDate), formatDate(endDate)],
    };
  }

  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:endPark', handleFilterByChart);
  // 监听图表钻取事件
  window.addEventListener('filterEndPark', handleChartFilter);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:endPark', handleFilterByChart);
  window.removeEventListener('filterEndPark', handleChartFilter);
});

// 支付表单
const [PayForm, payFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: usePayFormSchema(),
  showDefaultActions: false,
});

const [PayFormDrawer, payFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    payFormDrawerApi.close();
  },
  async onConfirm() {
    if (USE_REAL_API) {
      try {
        await payEndPark({
          id: dataObj.currentRow.id,
        });
        ElMessage.success('支付成功');
        handleRefresh();
        payFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('支付失败');
        console.error(error);
      }
    } else {
      const index = dataObj.apilist.findIndex(
        (v) => v.id === dataObj.currentRow.id,
      );
      if (index !== -1) {
        dataObj.apilist[index].status = '已支付';
      }
      handleRefresh();
      payFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      payFormApi.resetForm();
    }
  },
});

// 取消表单
const [CancelForm, cancelFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCancelFormSchema(),
  showDefaultActions: false,
});

const [CancelFormDrawer, cancelFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    cancelFormDrawerApi.close();
  },
  async onConfirm() {
    if (USE_REAL_API) {
      try {
        const values = cancelFormApi.form.values;
        await cancelEndPark({
          id: dataObj.currentRow.id,
          cancelReason: values.cancelReason,
        });
        ElMessage.success('取消成功');
        handleRefresh();
        cancelFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('取消失败');
        console.error(error);
      }
    } else {
      const values = cancelFormApi.form.values;
      const index = dataObj.apilist.findIndex(
        (v) => v.id === dataObj.currentRow.id,
      );
      if (index !== -1) {
        dataObj.apilist[index].status = '已取消';
        dataObj.apilist[index].remark = values.cancelReason;
      }
      handleRefresh();
      cancelFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      cancelFormApi.resetForm();
    }
  },
});

// 支付操作
const handlePay = (row) => {
  dataObj.currentRow = row;
  payFormDrawerApi
    .setData({
      title: '支付结束停车',
    })
    .open();
};

// 确认操作
const handleConfirm = async (row) => {
  await confirm('确定确认该结束停车记录吗？');
  if (USE_REAL_API) {
    try {
      await confirmEndPark({ id: row.id });
      ElMessage.success('确认成功');
      handleRefresh();
    } catch (error) {
      ElMessage.error('确认失败');
      console.error(error);
    }
  } else {
    const index = dataObj.apilist.findIndex((v) => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].status = '已完成';
    }
    handleRefresh();
  }
};

// 取消操作
const handleCancel = (row) => {
  dataObj.currentRow = row;
  cancelFormDrawerApi
    .setData({
      title: '取消结束停车',
    })
    .open();
};

// 点击车牌打开车辆详情
const handlePlateNoClick = (row) => {
  if (!row.plateNo) {
    ElMessage.warning('该记录无车牌信息');
    return;
  }
  vehicleDetailRef.value?.open(row.plateNo);
};

// 点击车位打开泊位详情
const handleSpaceIdClick = (row) => {
  spaceDetailRef.value?.open(row.spaceId, row);
};

// 点击缴费状态筛选同状态记录
const handleStatusClick = (row) => {
  dataObj.searchParams = { ...dataObj.searchParams, status: row.status };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选状态：${row.status}`);
};

// 点击片区筛选同片区记录
const handleAreaClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    areaId: row.areaId,
  };
  dataObj.filterLabels = {
    ...dataObj.filterLabels,
    areaId: row.areaName,
  };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选片区：${row.areaName}`);
};

// 点击操作人筛选同操作人记录
const handleOperatorClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    operatorId: row.operatorId,
    operatorName: row.operatorName,
  };
  dataObj.currentPage = 1;
  handleRefresh();
  ElMessage.success(`已筛选操作人：${row.operatorName}`);
};

// 监听图表钻取事件
onMounted(() => {
  // 监听图表卡片和折线图的钻取事件
  window.addEventListener('filterEndPark', handleChartFilter);
});

onUnmounted(() => {
  window.removeEventListener('filterEndPark', handleChartFilter);
});

// 处理图表钻取筛选
const handleChartFilter = (event) => {
  const { status, date } = event.detail;

  if (status !== undefined) {
    // 卡片钻取：按状态筛选
    if (status === null) {
      // 结束量卡片：移除状态筛选，保留其他条件
      const { status: _, ...rest } = dataObj.searchParams;
      dataObj.searchParams = rest;
    } else {
      // 支付成功率卡片：显示已支付记录
      dataObj.searchParams = { ...dataObj.searchParams, status };
      activeName.value = status;
    }
  } else if (date) {
    // 折线图钻取：按日期筛选
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    dataObj.searchParams = {
      ...dataObj.searchParams,
      endTime: [formatDate(startDate), formatDate(endDate)],
    };
  }

  handleRefresh();
};
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <PayFormDrawer title="支付结束停车">
      <PayForm />
    </PayFormDrawer>
    <CancelFormDrawer title="取消结束停车">
      <CancelForm />
    </CancelFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailRef" />
    <SpaceDetailDialog ref="spaceDetailRef" />
    <Drawer title="搜索">
      <SearchForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div
            v-if="activeFilters.length"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              align-items: center;
              margin-bottom: 12px;
              max-height: 100px;
              overflow-y: auto;
              padding-right: 8px;
            "
          >
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
            content="导出"
            icon-name="Download"
            @click="handleExport"
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
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #plateNo="{ row }">
        <el-text
          @click="handlePlateNoClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #spaceId="{ row }">
        <el-text
          @click="handleSpaceIdClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.spaceId }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag
          @click="handleStatusClick(row)"
          :type="
            row.status === '已支付'
              ? 'success'
              : row.status === '待支付'
                ? 'warning'
                : 'info'
          "
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #areaName="{ row }">
        <el-text
          @click="handleAreaClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #operatorName="{ row }">
        <el-text
          @click="handleOperatorClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.operatorName }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="row.status === '待支付'"
            content="支付"
            icon-name="Wallet"
            @click="handlePay(row)"
          />
          <IconButton
            v-if="row.status === '已支付'"
            content="确认"
            icon-name="Select"
            @click="handleConfirm(row)"
          />
          <IconButton
            v-if="row.status === '待支付'"
            content="取消"
            icon-name="CircleClose"
            color="#F56C6C"
            @click="handleCancel(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
          <span>
            本页统计：结束停车记录数量: {{ dataObj.list.length }}; 已选择:
            {{ checkedIds.length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
