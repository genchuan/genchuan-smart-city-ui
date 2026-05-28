<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportLeaveRecord,
  getLeaveRecordPage,
  getLeaveRecord,
  correctLeaveRecord,
  createLeaveRecord,
  updateLeaveRecord,
} from '#/api/genchuan/industry/chargePark/vehiclePass/leaveMgmt/leaveRecord';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import IconButton from '#/components/common/IconButton.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import { exportToExcel } from '#/utils/excel.js';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';

import {
  dataList,
  detailFields,
  getStationOptions,
  textObj,
  useSearchFormSchema,
  useCreateFormSchema,
  useUpdateFormSchema,
  useCorrectFormSchema,
  useGridColumns,
  statusTypeMap,
} from './data';
import { formatTime } from '../../../utils/timeFormatter';

const router = useRouter();

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
const formData = ref();

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
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const obj = createFormApi.form.values;

    const payload = {
      ...obj,
      enterTime: obj.enterTime ? new Date(obj.enterTime).getTime() : undefined,
      leaveTime: obj.leaveTime ? new Date(obj.leaveTime).getTime() : undefined,
      status: '正常记录',
    };

    if (USE_REAL_API) {
      try {
        await createLeaveRecord(payload);
        ElMessage.success('补录成功');
        handleRefresh();
        createFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('补录失败');
        console.error(error);
      }
    } else {
      dataObj.apilist.push(payload);
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
    return useUpdateFormSchema();
  }),
  showDefaultActions: false,
});

const [UpdateFormDrawer, updateFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  confirmText: '保存',
  cancelText: '取消',
  onCancel() {
    updateFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await updateFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const obj = updateFormApi.form.values;

    if (USE_REAL_API) {
      try {
        await updateLeaveRecord({
          id: formData.value?.id,
          ...obj,
        });
        ElMessage.success('编辑成功');
        handleRefresh();
        updateFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('编辑失败');
        console.error(error);
      }
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
      handleRefresh();
      updateFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = updateFormDrawerApi.getData();
      await updateFormApi.setValues({
        remark: formData.value.remark || '',
      });
    }
  },
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

const [CorrectFormDrawer, correctFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  confirmText: '保存',
  cancelText: '取消',
  onCancel() {
    correctFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await correctFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }

    const obj = correctFormApi.form.values;

    // 时间合法性校验：离场时间必须晚于入场时间
    const enterTime = obj.enterTime ? new Date(obj.enterTime).getTime() : null;
    const leaveTime = obj.leaveTime ? new Date(obj.leaveTime).getTime() : null;

    if (enterTime && leaveTime && leaveTime <= enterTime) {
      ElMessage.error('离场时间必须晚于入场时间');
      return;
    }

    if (USE_REAL_API) {
      try {
        await correctLeaveRecord({
          id: formData.value?.id,
          ...obj,
          status: '正常记录', // 修正后更新状态为正常记录
        });
        ElMessage.success('修正成功，记录状态已更新为正常');
        handleRefresh();
        correctFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('修正失败');
        console.error(error);
      }
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = {
            ...v,
            ...obj,
            status: '正常记录',
            isCorrected: true
          };
        }
      });
      ElMessage.success('修正成功，记录状态已更新为正常');
      handleRefresh();
      correctFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = correctFormDrawerApi.getData();
      const formValues = {
        ...formData.value,
        enterTime: formData.value.enterTime ? new Date(formData.value.enterTime).getTime() : null,
        leaveTime: formData.value.leaveTime ? new Date(formData.value.leaveTime).getTime() : null,
      };
      await correctFormApi.setValues(formValues);
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
      const res = await exportLeaveRecord(dataObj.searchParams);
      downloadFileFromBlobPart({ fileName: '离场记录.xlsx', source: res });
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

function handleEdit(row) {
  updateFormDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

function handleCorrect(row) {
  correctFormDrawerApi
    .setData({
      title: textObj.correctText,
      ...row,
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
});

let isSearching = false;

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.status) {
    filters.push({ label: `记录状态：${obj.status}`, field: 'status' });
  }
  if (obj.stationId && obj.stationName) {
    filters.push({ label: `场站：${obj.stationName}`, field: 'stationId' });
  }
  if (obj.updater) {
    filters.push({ label: `操作人：${obj.updater}`, field: 'updater' });
  }
  if (obj.parkDuration !== undefined && obj.parkDuration !== null) {
    filters.push({
      label: `停车时长：${obj.parkDuration}分钟`,
      field: 'parkDuration',
    });
  }
  if (obj.isCorrected !== undefined && obj.isCorrected !== null) {
    const correctedLabels = { 0: '未修正', 1: '已修正', 2: '已确认' };
    filters.push({
      label: `修正状态：${correctedLabels[obj.isCorrected] || obj.isCorrected}`,
      field: 'isCorrected',
    });
  }
  if (obj.leaveTimeHour) {
    filters.push({
      label: `离场小时：${obj.leaveTimeHour}`,
      field: 'leaveTimeHour',
    });
  }
  if (
    obj.enterTime &&
    Array.isArray(obj.enterTime) &&
    obj.enterTime.length === 2
  ) {
    const startTime = formatTime(obj.enterTime[0]);
    const endTime = formatTime(obj.enterTime[1]);
    filters.push({
      label: `入场时间：${startTime} 至 ${endTime}`,
      field: 'enterTime',
    });
  }
  if (
    obj.leaveTime &&
    Array.isArray(obj.leaveTime) &&
    obj.leaveTime.length === 2
  ) {
    const startTime = formatTime(obj.leaveTime[0]);
    const endTime = formatTime(obj.leaveTime[1]);
    filters.push({
      label: `离场时间：${startTime} 至 ${endTime}`,
      field: 'leaveTime',
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
  // 清除leaveTime时，同时清除leaveTimeHour（如果存在）
  if (fieldName === 'leaveTime') {
    delete next.leaveTimeHour;
  }
  dataObj.searchParams = next;
  dataObj.currentPage = 1;
  gridApi.query();
};

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

function formatDateTime(value, isEnd) {
  if (!value) return value;

  let date;
  // 解析时间值
  if (typeof value === 'number') {
    // 时间戳
    date = new Date(value);
  } else if (value instanceof Date) {
    // Date 对象
    date = value;
  } else {
    // 字符串，尝试解析
    date = new Date(value);
  }

  // 检查是否有效
  if (isNaN(date.getTime())) {
    return value;
  }

  // 格式化为 YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = isEnd ? '23' : '00';
  const minutes = isEnd ? '59' : '00';
  const seconds = isEnd ? '59' : '00';

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function buildApiParams(rawParams) {
  const params = { ...rawParams };
  if (
    params.leaveTime &&
    Array.isArray(params.leaveTime) &&
    params.leaveTime.length === 2
  ) {
    params.leaveTime = [
      formatDateTime(params.leaveTime[0], false),
      formatDateTime(params.leaveTime[1], true),
    ];
  }
  if (
    params.enterTime &&
    Array.isArray(params.enterTime) &&
    params.enterTime.length === 2
  ) {
    params.enterTime = [
      formatDateTime(params.enterTime[0], false),
      formatDateTime(params.enterTime[1], true),
    ];
  }
  return params;
}

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  // 使用真实API
  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: isSearching ? 1 : page.currentPage,
        pageSize: page.pageSize,
        ...buildApiParams(dataObj.searchParams),
      };

      if (isSearching) {
        isSearching = false;
        dataObj.currentPage = 1;
      } else {
        dataObj.currentPage = page.currentPage;
      }

      const res = await getLeaveRecordPage(params);
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
      return {
        ...v,
      };
    });
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

function onSubmit(values) {
  const params = { ...values };

  // 如果选择了场站，需要同时保存场站名称
  if (params.stationId) {
    const station = stationOptions.value.find(s => s.value === params.stationId);
    if (station) {
      params.stationName = station.label;
    }
  }

  // 时间不做任何转换，保持原样，由 buildApiParams 统一处理
  dataObj.searchParams = params;
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
  try {
    const loadingInstance = ElLoading.service({ text: '加载详情中...' });
    try {
      const data = await getLeaveRecord(row.id);
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
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// 处理图表卡片点击筛选
const handleFilterByChart = (event) => {
  const filterParams = event.detail;

  // 如果有 leaveTimeHour 参数，转换成完整的时间范围
  if (filterParams.leaveTimeHour) {
    const hourStr = String(filterParams.leaveTimeHour).padStart(2, '0');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const leaveTimeRange = [
      `${year}-${month}-${day} ${hourStr}:00:00`,
      `${year}-${month}-${day} ${hourStr}:59:59`
    ];
    
    dataObj.searchParams = {
      ...dataObj.searchParams,
      leaveTime: leaveTimeRange,
    };
    ElMessage.success(`已筛选 ${filterParams.leaveTimeHour} 时段的离场记录`);
  } else if (filterParams.startTime && filterParams.endTime) {
    // 如果没有小时参数，使用时间范围
    const startDate = new Date(Number(filterParams.startTime));
    const endDate = new Date(Number(filterParams.endTime));

    // 格式化为 YYYY-MM-DD HH:mm:ss
    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const leaveTimeRange = [formatDateTime(startDate), formatDateTime(endDate)];
    dataObj.searchParams = {
      ...dataObj.searchParams,
      leaveTime: leaveTimeRange,
    };
    ElMessage.success('已应用图表筛选');
  } else {
    dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
    ElMessage.success('已应用图表筛选');
  }

  handleRefresh();
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:leaveRecord', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:leaveRecord', handleFilterByChart);
});

// 车辆详情弹窗
const vehicleDetailDialogRef = ref(null);
const handlePlateClick = (row) => {
  vehicleDetailDialogRef.value?.open(row.plateNo);
};

// 字段点击筛选
const handleFieldFilter = (field, value, extraData = {}) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    [field]: value,
    ...extraData,
  };
  isSearching = true;
  gridApi.query();
};

// 格式化停车时长
const formatDuration = (minutes) => {
  if (!minutes) return '-';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
};
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <UpdateFormDrawer :title="textObj.editText">
      <UpdateForm />
    </UpdateFormDrawer>
    <CorrectFormDrawer :title="textObj.correctText">
      <CorrectForm />
    </CorrectFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailDialogRef" />
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
          <IconButton content="补录" icon-name="DocumentAdd" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
          />
          <IconButton
            content="筛选"
            icon-name="Search"
            @click="handleSerachShow"
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
          @click="handlePlateClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #parkDuration="{ row }">
        <span>{{ formatDuration(row.parkDuration) }}</span>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="statusTypeMap[row.status]"
          @click="handleFieldFilter('status', row.status)"
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #stationName="{ row }">
        <el-text
          @click="handleFieldFilter('stationId', row.stationId, { stationName: row.stationName })"
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
          v-if="row.updater"
          @click="handleFieldFilter('updater', row.updater)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.updater }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{
          row.updateTime ? formatTime(row.updateTime) : '-'
        }}</el-text>
      </template>
      <template #correctionMark="{ row }">
        <el-tag :type="row.isCorrected ? 'success' : 'info'">
          {{ row.isCorrected ? '已修正' : '未修正' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="row.status === '正常记录'"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="row.status === '异常记录'"
            content="修正"
            icon-name="Tools"
            @click="handleCorrect(row)"
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
            本页统计：离场记录数量: {{ dataObj.list.length }}; 已选择:
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
