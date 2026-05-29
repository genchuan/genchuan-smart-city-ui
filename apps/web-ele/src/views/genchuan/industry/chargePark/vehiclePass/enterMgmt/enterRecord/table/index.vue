<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  correctEnterRecord,
  createEnterRecord,
  exportEnterRecord,
  getEnterRecord,
  getEnterRecordPage,
  updateEnterRecord,
} from '#/api/genchuan/industry/chargePark/vehiclePass/enterMgmt/enterRecord';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import SpaceDetailDialog from '../../../components/SpaceDetailDialog.vue';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import { formatTime } from '../../../utils/timeFormatter';
import {
  dataList,
  detailFields,
  getStationOptions,
  plateColorTypeMap,
  recordTypeMap,
  statusTypeMap,
  textObj,
  useCorrectFormSchema,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
  useUpdateFormSchema,
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

const detailDrawerRef = ref(null);
const vehicleDetailRef = ref(null);
const spaceDetailRef = ref(null);
const formData = ref();

// 查询表单
const [SearchForm, searchFormApi] = useVbenForm({
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
    const schema = useSearchFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 新增表单
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

// 编辑表单
const [UpdateForm, updateFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: computed(() => {
    const schema = useUpdateFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
  showDefaultActions: false,
});

// 修正表单
const [CorrectForm, correctFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: computed(() => {
    const schema = useCorrectFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
  showDefaultActions: false,
});

// 新增Drawer
const [CreateFormDrawer, createFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    createFormDrawerApi.close();
  },
  onConfirm() {
    const obj = createFormApi.form.values;
    handleCreateSubmit(obj);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
    }
  },
});

// 编辑Drawer
const [UpdateFormDrawer, updateFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    updateFormDrawerApi.close();
  },
  onConfirm() {
    const obj = updateFormApi.form.values;
    handleUpdateSubmit(obj);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = updateFormDrawerApi.getData();
      if (formData.value?.id) {
        const formValues = { ...formData.value };
        // 格式化时间戳为日期字符串
        if (formValues.enterTime && typeof formValues.enterTime === 'number') {
          formValues.enterTime = formatTime(formValues.enterTime);
        }
        console.log('编辑表单数据:', formValues);
        await updateFormApi.setValues(formValues);
      }
    }
  },
});

// 修正Drawer
const [CorrectFormDrawer, correctFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    correctFormDrawerApi.close();
  },
  onConfirm() {
    const obj = correctFormApi.form.values;
    handleCorrectSubmit(obj);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = correctFormDrawerApi.getData();
      if (formData.value?.id) {
        const formValues = { ...formData.value };
        // 格式化时间戳为日期字符串
        if (formValues.enterTime && typeof formValues.enterTime === 'number') {
          formValues.enterTime = formatTime(formValues.enterTime);
        }
        await correctFormApi.setValues(formValues);
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
      const res = await exportEnterRecord(dataObj.searchParams);
      downloadFileFromBlobPart({
        fileName: `${textObj.excelAllName}.xlsx`,
        source: res,
      });
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

async function handleCreateSubmit(data) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在补录...',
    });
    try {
      await createEnterRecord(data);
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
    dataObj.apilist.push(data);
    handleRefresh();
    createFormDrawerApi.close();
  }
}

function handleEdit(row) {
  updateFormDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleUpdateSubmit(data) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在更新...',
    });
    try {
      await updateEnterRecord({
        ...data,
        id: formData.value?.id,
      });
      ElMessage.success('更新成功');
      handleRefresh();
      updateFormDrawerApi.close();
    } catch (error) {
      ElMessage.error('更新失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.apilist.forEach((v, i) => {
      if (v.id === formData.value?.id) {
        dataObj.apilist[i] = data;
      }
    });
    handleRefresh();
    updateFormDrawerApi.close();
  }
}

function handleCorrect(row) {
  correctFormDrawerApi
    .setData({
      title: '修正入场记录',
      ...row,
    })
    .open();
}

async function handleCorrectSubmit(data) {
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在修正...',
    });
    try {
      // 准备提交数据
      const submitData = {
        ...data,
        id: formData.value?.id,
        isCorrected: true,
      };

      // 如果有 stationId，查找并设置正确的 stationName
      if (submitData.stationId) {
        const station = stationOptions.value.find(s => s.value === submitData.stationId);
        if (station) {
          submitData.stationName = station.label;
        }
      }

      await correctEnterRecord(submitData);
      ElMessage.success('修正成功');
      handleRefresh();
      correctFormDrawerApi.close();
    } catch (error) {
      ElMessage.error('修正失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.apilist.forEach((v, i) => {
      if (v.id === formData.value?.id) {
        dataObj.apilist[i] = { ...v, ...data, isCorrected: true };
      }
    });
    handleRefresh();
    correctFormDrawerApi.close();
  }
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
  filterLabels: {},
});

let isSearching = false;

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;
  const labels = dataObj.filterLabels;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.plateColor) {
    const plateColorLabel = labels.plateColor || obj.plateColor;
    filters.push({ label: `车牌颜色：${plateColorLabel}`, field: 'plateColor' });
  }
  if (obj.spaceNo) {
    filters.push({ label: `车位编号：${obj.spaceNo}`, field: 'spaceNo' });
  }
  if (obj.recordType) {
    const recordTypeLabel = labels.recordType || obj.recordType;
    filters.push({ label: `记录类型：${recordTypeLabel}`, field: 'recordType' });
  }
  if (obj.status) {
    const statusLabel = labels.status || obj.status;
    filters.push({ label: `记录状态：${statusLabel}`, field: 'status' });
  }
  if (obj.stationId && obj.stationName) {
    filters.push({ label: `场站：${obj.stationName}`, field: 'stationId' });
  }
  if (obj.isCorrected !== undefined && obj.isCorrected !== null) {
    filters.push({
      label: `修正状态：${obj.isCorrected ? '已修正' : '未修正'}`,
      field: 'isCorrected',
    });
  }
  if (
    obj.enterTime &&
    Array.isArray(obj.enterTime) &&
    obj.enterTime.length === 2
  ) {
    filters.push({
      label: `入场时间：${obj.enterTime[0]} 至 ${obj.enterTime[1]}`,
      field: 'enterTime',
    });
  }
  if (obj.startTime && obj.endTime && !obj.enterTimeHour) {
    const start = new Date(Number(obj.startTime)).toLocaleString('zh-CN');
    const end = new Date(Number(obj.endTime)).toLocaleString('zh-CN');
    filters.push({
      label: `入场时间：${start} 至 ${end}`,
      field: 'timeRange',
    });
  }
  if (obj.enterTimeHour) {
    filters.push({
      label: `入场时段：${obj.enterTimeHour}`,
      field: 'enterTimeHour',
    });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchParams };
  delete next[fieldName];
  // 清除场站ID时，同时清除场站名称
  if (fieldName === 'stationId') {
    delete next.stationName;
  }
  // 清除时间范围时，同时清除 startTime 和 endTime
  if (fieldName === 'timeRange') {
    delete next.startTime;
    delete next.endTime;
  }
  // 清除入场时段时，同时清除其附带的当日 startTime/endTime
  if (fieldName === 'enterTimeHour') {
    delete next.startTime;
    delete next.endTime;
  }
  dataObj.searchParams = next;

  const nextLabels = { ...dataObj.filterLabels };
  delete nextLabels[fieldName];
  dataObj.filterLabels = nextLabels;

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

      const res = await getEnterRecordPage(params);
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
      case '异常记录': {
        statusMatch = v.status === '异常记录';
        break;
      }
      case '正常记录': {
        statusMatch = v.status === '正常记录';
        break;
      }
    }

    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'enterTime' && Array.isArray(value) && value.length === 2) {
          // 处理时间范围
          const [startTime, endTime] = value;
          const start = new Date(startTime).getTime();
          const end = new Date(endTime).getTime();
          searchMatch = searchMatch && v[key] >= start && v[key] <= end;
        } else if (typeof value === 'string') {
          searchMatch = searchMatch && v[key]?.toString().includes(value);
        } else if (typeof value === 'boolean') {
          searchMatch = searchMatch && v[key] === value;
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

function onSubmit(values) {
  const params = { ...values };

  // 如果选择了场站，需要同时保存场站名称
  if (params.stationId) {
    const station = stationOptions.value.find(s => s.value === params.stationId);
    if (station) {
      params.stationName = station.label;
    }
  }

  // 清空之前的搜索参数，只保留新提交的值
  dataObj.searchParams = params;

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

function handleResetFilters() {
  dataObj.searchParams = {};
  dataObj.filterLabels = {};
  dataObj.currentPage = 1;
  gridApi.query();
  ElMessage.success('已重置筛选条件');
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
    const loadingInstance = ElLoading.service({
      text: '加载详情中...',
    });
    try {
      const res = await getEnterRecord(row.id);
      // 如果API返回的数据中没有stationName，从行数据中补充
      dataObj.detailObj = {
        ...row,
        ...res,
        stationName: res?.stationName || row?.stationName,
      };
      detailDrawerRef.value?.open();
    } catch (error) {
      ElMessage.error('获取详情失败');
      console.error(error);
      // 失败时使用行数据
      dataObj.detailObj = row;
      detailDrawerRef.value?.open();
    } finally {
      loadingInstance.close();
    }
  } else {
    dataObj.detailObj = row;
    detailDrawerRef.value?.open();
  }
};

const tabsData = ref([
  { label: '全部' },
  { label: '正常记录' },
  { label: '异常记录' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '异常记录': {
      count = dataObj.apilist.filter((v) => v.status === '异常记录').length;
      break;
    }
    case '正常记录': {
      count = dataObj.apilist.filter((v) => v.status === '正常记录').length;
      break;
    }
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};

const handleSerachShow = () => {
  // 打开搜索表单时，回填当前的搜索参数（只回填搜索表单中存在的字段）
  const searchSchema = useSearchFormSchema();
  const searchFieldNames = searchSchema.map((f) => f.fieldName);
  const formValues = {};

  searchFieldNames.forEach((fieldName) => {
    if (dataObj.searchParams[fieldName] !== undefined) {
      formValues[fieldName] = dataObj.searchParams[fieldName];
    }
  });

  searchFormApi.setValues(formValues);
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// 车牌点击 - 查看车辆详情
const handlePlateNoClick = (row) => {
  if (!row.plateNo) {
    ElMessage.warning('该记录无车牌信息');
    return;
  }
  vehicleDetailRef.value?.open(row.plateNo);
};

// 车牌颜色点击 - 筛选同颜色车牌
const handlePlateColorClick = (row) => {
  if (!row.plateColor) return;
  dataObj.searchParams = {
    ...dataObj.searchParams,
    plateColor: row.plateColor,
  };
  handleRefresh();
  ElMessage.success(`已筛选车牌颜色: ${row.plateColor}`);
};

// 车位点击 - 跳转车位详情
const handleSpaceNoClick = (row) => {
  spaceDetailRef.value?.open(row.spaceNo, row);
};

// 状态点击 - 筛选同状态记录
const handleStatusClick = (row) => {
  dataObj.searchParams = { ...dataObj.searchParams, status: row.status };
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
  handleRefresh();
  ElMessage.success(`已筛选场站: ${row.stationName}`);
};

// 记录类型点击 - 筛选同类型记录
const handleRecordTypeClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    recordType: row.recordType,
  };
  handleRefresh();
  ElMessage.success(`已筛选记录类型: ${row.recordType}`);
};

// 操作人点击 - 筛选同操作人记录
const handleUpdaterClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    updater: row.updater,
  };
  handleRefresh();
  ElMessage.success(`已筛选操作人: ${row.updater}`);
};

// 根据状态判断按钮显示
const shouldShowEdit = (status) => {
  return status === '正常记录';
};

const shouldShowCorrect = (status) => {
  return status === '异常记录';
};

// 处理图表卡片点击筛选
const handleFilterByChart = (event) => {
  const filterParams = event.detail;
  console.log('[enterRecord] Received filter params:', filterParams);

  const validParams = { ...filterParams };

  // 如果有 stationId，自动补充 stationName
  if (validParams.stationId && !validParams.stationName) {
    const station = stationOptions.value.find(
      (s) => s.value === validParams.stationId
    );
    if (station) {
      validParams.stationName = station.label;
    }
  }

  dataObj.searchParams = { ...dataObj.searchParams, ...validParams };
  console.log('[enterRecord] Updated searchParams:', dataObj.searchParams);
  dataObj.currentPage = 1;
  gridApi.query();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:enterRecord', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:enterRecord', handleFilterByChart);
});
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <UpdateFormDrawer :title="textObj.editText">
      <UpdateForm />
    </UpdateFormDrawer>
    <CorrectFormDrawer title="修正入场记录">
      <CorrectForm />
    </CorrectFormDrawer>
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
            v-if="activeFilters.length > 0"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              align-items: center;
              margin-bottom: 12px;
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
            icon-name="Search"
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
      <template #plateColor="{ row }">
        <el-tag
          :type="plateColorTypeMap[row.plateColor] || 'info'"
          @click="handlePlateColorClick(row)"
          style="cursor: pointer"
        >
          {{ row.plateColor }}
        </el-tag>
      </template>
      <template #spaceNo="{ row }">
        <el-text
          @click="handleSpaceNoClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.spaceNo }}
        </el-text>
      </template>
      <template #recordType="{ row }">
        <el-tag
          :type="recordTypeMap[row.recordType] || 'info'"
          @click="handleRecordTypeClick(row)"
          style="cursor: pointer"
        >
          {{ row.recordType }}
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
      <template #isCorrected="{ row }">
        <el-tag :type="row.isCorrected ? 'success' : 'info'">
          {{ row.isCorrected ? '已修正' : '未修正' }}
        </el-tag>
      </template>
      <template #updater="{ row }">
        <el-text
          @click="handleUpdaterClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.updater || '-' }}
        </el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>
          {{ row.updateTime ? formatTime(row.updateTime) : '-' }}
        </el-text>
      </template>
      <template #correctionMark="{ row }">
        <el-tag :type="row.isCorrected ? 'success' : 'info'">
          {{ row.isCorrected ? '已修正' : '未修正' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="shouldShowEdit(row.status)"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="shouldShowCorrect(row.status)"
            content="修正"
            icon-name="Edit"
            @click="handleCorrect(row)"
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
            本页统计：入场记录数量: {{ dataObj.list.length }}; 已选择:
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
