<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  alarmInParkStatus,
  exportInParkStatus,
  getInParkStatus,
  getInParkStatusLocation,
  getInParkStatusPage,
  remindInParkStatus,
} from '#/api/genchuan/industry/chargePark/vehiclePass/inParkMgmt/inParkStatus';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportWithFormat } from '#/utils/exportWithFormat.js';

import SpaceDetailDialog from '../../../components/SpaceDetailDialog.vue';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import LocationMapDialog from '../components/LocationMapDialog.vue';
import {
  dataList,
  detailFields,
  getStationOptions,
  OVERTIME_THRESHOLD,
  statusTypeMap,
  textObj,
  useGridColumns,
  useSearchFormSchema,
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
const locationMapDialogRef = ref(null);
const formData = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: computed(() => {
    const schema = useSearchFormSchema();
    const stationField = schema.find((f) => f.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps.options = stationOptions.value;
    }
    return schema;
  }),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  try {
    // 使用confirm对话框让用户选择格式
    let exportFormat = 'excel';
    try {
      await ElMessageBox.confirm(
        '请选择导出格式：\n• Excel格式支持完整数据和中文显示（推荐）\n• PDF格式中文显示可能不正确，仅供参考',
        '选择导出格式',
        {
          confirmButtonText: 'Excel (.xlsx) 推荐',
          cancelButtonText: 'PDF (.pdf)',
          type: 'info',
          distinguishCancelAndClose: true,
        },
      );
      exportFormat = 'excel';
    } catch (error) {
      if (error === 'cancel') {
        exportFormat = 'pdf';
        // 再次确认PDF导出
        try {
          await ElMessageBox.confirm(
            '提示：PDF格式中文显示可能不正确，建议使用Excel格式。确定继续导出PDF吗？',
            '确认导出PDF',
            {
              confirmButtonText: '继续导出PDF',
              cancelButtonText: '返回选择Excel',
              type: 'warning',
            },
          );
        } catch {
          // 用户选择返回Excel
          exportFormat = 'excel';
        }
      } else {
        // 用户点击了关闭按钮
        return;
      }
    }

    const loadingInstance = ElLoading.service({
      text: '导出中...',
    });

    try {
      if (USE_REAL_API) {
        // 使用真实API导出（后端返回文件流）
        const res = await exportInParkStatus(dataObj.searchParams);
        const fileExtension = exportFormat === 'pdf' ? '.pdf' : '.xlsx';
        await downloadFileFromBlobPart({
          fileName: `在停状态数据${fileExtension}`,
          source: res,
        });
        ElMessage.success({
          message: '导出成功！文件已开始下载',
          duration: 3000,
        });
      } else {
        // 使用前端导出（模拟数据）
        const exportData =
          dataObj.list.length > 0 ? dataObj.list : dataObj.apilist;
        const columns = useGridColumns();

        const result = await exportWithFormat(
          exportData,
          columns,
          exportFormat,
          '在停状态数据',
        );

        ElMessage.success({
          message: result,
          duration: 3000,
        });
      }
    } catch (error) {
      const errorMessage = error.message || '未知错误';
      ElMessage.error(`导出失败：${errorMessage}`);
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    console.error('导出操作失败:', error);
  }
}

function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleLocation(row) {
  const loadingInstance = ElLoading.service({ text: '定位中...' });
  try {
    const result = await getInParkStatusLocation({ id: row.id });
    const locationData = {
      ...row,
      lat: result.lat,
      lon: result.lon,
      spaceName: result.spaceName || row.spaceName,
      stationName: result.stationName || row.stationName,
    };
    locationMapDialogRef.value?.open(locationData);
  } catch (error) {
    ElMessage.error('定位失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

async function handleRemind(row) {
  const loadingInstance = ElLoading.service({ text: '推送提醒中...' });
  try {
    await remindInParkStatus({ id: row.id });
    ElMessage.success('已推送超时挪车提醒短信至车主，提醒记录已更新');
    handleRefresh();
  } catch (error) {
    ElMessage.error('提醒失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

async function handleAlarm(row) {
  const loadingInstance = ElLoading.service({ text: '推送告警中...' });
  try {
    await alarmInParkStatus({
      id: row.id,
      alarmContent: `车辆${row.carNo}在${row.stationName}的${row.spaceName}车位出现异常状态，请及时处理`,
    });
    ElMessage.success('已推送异常告警至场站工作人员，异常状态已标记');
    handleRefresh();
  } catch (error) {
    ElMessage.error('告警失败');
    console.error(error);
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

  if (obj.carNo) {
    filters.push({ label: `车牌号：${obj.carNo}`, field: 'carNo' });
  }
  if (obj.spaceName) {
    filters.push({ label: `车位名称：${obj.spaceName}`, field: 'spaceName' });
  }
  if (obj.stationName) {
    filters.push({ label: `场站名称：${obj.stationName}`, field: 'stationName' });
  }
  if (obj.status) {
    filters.push({ label: `状态：${obj.status}`, field: 'status' });
  }
  if (obj.inTimeStart && obj.inTimeEnd) {
    const start = new Date(Number(obj.inTimeStart)).toLocaleString('zh-CN');
    const end = new Date(Number(obj.inTimeEnd)).toLocaleString('zh-CN');
    filters.push({ label: `入场时间：${start} 至 ${end}`, field: 'inTimeRange' });
  }
  if (obj.updateTimeStart && obj.updateTimeEnd) {
    const start = new Date(Number(obj.updateTimeStart)).toLocaleString('zh-CN');
    const end = new Date(Number(obj.updateTimeEnd)).toLocaleString('zh-CN');
    filters.push({ label: `更新时间：${start} 至 ${end}`, field: 'updateTimeRange' });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchParams };

  // 处理时间范围字段的清除
  if (fieldName === 'inTimeRange') {
    delete next.inTimeStart;
    delete next.inTimeEnd;
  } else if (fieldName === 'updateTimeRange') {
    delete next.updateTimeStart;
    delete next.updateTimeEnd;
  } else {
    delete next[fieldName];
  }

  dataObj.searchParams = next;
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

      const res = await getInParkStatusPage(params);
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
      case '异常状态': {
        statusMatch = v.status === '异常状态';
        break;
      }
      case '正常在停': {
        statusMatch = v.status === '正常在停';
        break;
      }
      case '超时长在停': {
        statusMatch = v.status === '超时长在停';
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

const [SearchForm, searchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleReset: () => {
    searchFormApi.resetForm();
    dataObj.searchParams = {};
    isSearching = true;
    gridApi.query();
    ElMessage.success('已清空筛选条件');
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
  resetButtonOptions: {
    content: '清空',
  },
});

function onSubmit(values) {
  // 处理时间范围参数
  const params = { ...values };

  if (params.inTimeRange && Array.isArray(params.inTimeRange)) {
    params.inTimeStart = params.inTimeRange[0];
    params.inTimeEnd = params.inTimeRange[1];
    delete params.inTimeRange;
  }

  if (params.updateTimeRange && Array.isArray(params.updateTimeRange)) {
    params.updateTimeStart = params.updateTimeRange[0];
    params.updateTimeEnd = params.updateTimeRange[1];
    delete params.updateTimeRange;
  }

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
      const data = await getInParkStatus(row.id);
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
const handleCarNoClick = (row) => {
  if (!row.carNo) {
    ElMessage.warning('该记录无车牌信息');
    return;
  }
  vehicleDetailRef.value?.open(row.carNo);
};

// 车位点击 - 跳转车位详情
const handleSpaceNameClick = (row) => {
  spaceDetailRef.value?.open(row.spaceName, row);
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

// 计算在停时长（分钟）
const calculateParkDuration = (inTime) => {
  if (!inTime) return 0;
  const now = Date.now();
  const duration = Math.floor((now - inTime) / 1000 / 60);
  return duration;
};

// 计算车辆实际状态（根据在停时长）
const calculateActualStatus = (inTime, originalStatus) => {
  const duration = calculateParkDuration(inTime);

  // 如果原始状态是异常，保持异常
  if (originalStatus === '异常状态') {
    return '异常状态';
  }

  // 根据在停时长判断
  if (duration > OVERTIME_THRESHOLD) {
    return '超时长在停';
  }

  return '正常在停';
};

// 根据状态判断按钮是否显示（不可用按钮隐藏）
const shouldShowRemind = (status) => {
  // 超时长在停状态显示提醒按钮
  return status === '超时长在停' || status?.includes('超时');
};

const shouldShowAlarm = (status) => {
  // 异常状态显示告警按钮
  return status === '异常状态' || status === '异常';
};

// 获取状态标签类型
const getStatusType = (status) => {
  return statusTypeMap[status] || 'info';
};

const tabsData = ref([
  { label: '全部' },
  { label: '正常在停' },
  { label: '超时长在停' },
  { label: '异常状态' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '异常状态': {
      count = dataObj.apilist.filter((v) => v.status === '异常状态').length;
      break;
    }
    case '正常在停': {
      count = dataObj.apilist.filter((v) => v.status === '正常在停').length;
      break;
    }
    case '超时长在停': {
      count = dataObj.apilist.filter((v) => v.status === '超时长在停').length;
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

  // 转换时间参数格式
  if (filterParams.startTime && filterParams.endTime) {
    dataObj.searchParams = {
      ...dataObj.searchParams,
      inTimeStart: filterParams.startTime,
      inTimeEnd: filterParams.endTime,
    };
    ElMessage.success('已应用图表筛选');
  } else if (filterParams.showAll) {
    // 在停车辆数卡片点击，清除所有筛选显示全部
    dataObj.searchParams = {};
    ElMessage.success('已显示全部在停车辆');
  } else {
    dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
    if (filterParams.parkStatus) {
      ElMessage.success(`已筛选状态: ${filterParams.parkStatus}`);
    } else {
      ElMessage.success('已应用图表筛选');
    }
  }

  handleRefresh();
};

// 处理地图标记点击打开详情
const handleOpenVehicleDetail = (event) => {
  const { plateNo, id } = event.detail;
  // Find the vehicle record
  const vehicle = dataObj.list.find((v) => v.id === id || v.carNo === plateNo);
  if (vehicle) {
    handleOpenDetail(vehicle);
  } else {
    ElMessage.warning('未找到该车辆记录');
  }
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:inParkStatus', handleFilterByChart);
  window.addEventListener('openVehicleDetail:inParkStatus', handleOpenVehicleDetail);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:inParkStatus', handleFilterByChart);
  window.removeEventListener('openVehicleDetail:inParkStatus', handleOpenVehicleDetail);
});

// 批量定位（全局定位）
const handleBatchLocation = async () => {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要定位的车辆');
    return;
  }

  const loadingInstance = ElLoading.service({ text: '批量定位中...' });
  try {
    const locationPromises = checkedIds.value.map((id) => {
      return getInParkStatusLocation({ id });
    });

    const results = await Promise.all(locationPromises);

    // 打开地图弹窗显示第一个定位点
    if (results.length > 0 && results[0]) {
      const firstRow = dataObj.list.find((item) => item.id === checkedIds.value[0]);
      const locationData = {
        ...firstRow,
        lat: results[0].lat,
        lon: results[0].lon,
        spaceName: results[0].spaceName || firstRow.spaceName,
        stationName: results[0].stationName || firstRow.stationName,
      };
      locationMapDialogRef.value?.open(locationData);
      ElMessage.success(`成功定位 ${results.length} 辆车辆，已显示第一辆车位置`);
    }
  } catch (error) {
    ElMessage.error('批量定位失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.carNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailRef" />
    <SpaceDetailDialog ref="spaceDetailRef" />
    <LocationMapDialog ref="locationMapDialogRef" />
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
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="定位"
            icon-name="Location"
            @click="handleBatchLocation"
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
      <template #carNo="{ row }">
        <el-text
          @click="handleCarNoClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.carNo }}
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
      <template #status="{ row }">
        <el-tag
          :type="getStatusType(row.status)"
          @click="handleStatusClick(row)"
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #parkDuration="{ row }">
        <span>{{ calculateParkDuration(row.inTime) }}分钟</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 调试：显示实际状态值 -->
          <!-- <span style="font-size: 10px; color: red; margin-right: 8px;">状态:{{ row.status }}</span> -->
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="定位"
            icon-name="Location"
            @click="handleLocation(row)"
          />
          <IconButton
            v-if="shouldShowRemind(row.status)"
            content="提醒"
            icon-name="Bell"
            @click="handleRemind(row)"
          />
          <IconButton
            v-if="shouldShowAlarm(row.status)"
            content="告警"
            icon-name="Warning"
            color="#E6A23C"
            @click="handleAlarm(row)"
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
