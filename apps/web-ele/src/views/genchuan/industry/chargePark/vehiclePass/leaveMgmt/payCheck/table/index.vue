<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportPayCheck,
  getPayCheckPage,
  getPayCheck,
  releasePayCheck,
  remindPayCheck,
} from '#/api/genchuan/industry/chargePark/vehiclePass/leaveMgmt/payCheck';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import IconButton from '#/components/common/IconButton.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import { exportToExcel } from '#/utils/excel.js';
import { formatTime } from '../../../utils/timeFormatter';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';

import {
  dataList,
  detailFields,
  getStationOptions,
  textObj,
  useSearchFormSchema,
  useGridColumns,
  statusTypeMap,
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
const formData = ref();

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
        const res = await exportPayCheck(dataObj.searchParams);
        const fileExtension = exportFormat === 'pdf' ? '.pdf' : '.xlsx';
        await downloadFileFromBlobPart({
          fileName: `缴费核验数据${fileExtension}`,
          source: res,
        });
        ElMessage.success({
          message: '导出成功！文件已开始下载',
          duration: 3000,
        });
      } else {
        exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
        ElMessage.success({
          message: '导出成功！',
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

// 放行操作
async function handleRelease(row) {
  try {
    await ElMessageBox.confirm('确认对该车辆进行放行操作？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });

    if (USE_REAL_API) {
      try {
        await releasePayCheck({ id: row.id });
        ElMessage.success('放行成功');
        handleRefresh();
      } catch (error) {
        ElMessage.error('放行失败');
        console.error(error);
      }
    } else {
      ElMessage.success('放行成功');
      handleRefresh();
    }
  } catch {
    // 用户取消操作
  }
}

// 催缴操作
async function handleRemind(row) {
  try {
    await ElMessageBox.confirm('确认向车主推送欠费催缴提醒？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });

    if (USE_REAL_API) {
      try {
        await remindPayCheck({ id: row.id });
        ElMessage.success('催缴提醒已发送');
        handleRefresh();
      } catch (error) {
        ElMessage.error('催缴提醒发送失败');
        console.error(error);
      }
    } else {
      ElMessage.success('催缴提醒已发送');
      handleRefresh();
    }
  } catch {
    // 用户取消操作
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
    filters.push({ label: `缴费状态：${obj.status}`, field: 'status' });
  }
  if (obj.stationName) {
    filters.push({ label: `场站：${obj.stationName}`, field: 'stationName' });
  }
  if (obj.checkUserId && obj.checkUserName) {
    filters.push({ label: `核验人：${obj.checkUserName}`, field: 'checkUserId' });
  }
  if (
    obj.checkTime &&
    Array.isArray(obj.checkTime) &&
    obj.checkTime.length === 2
  ) {
    filters.push({
      label: `核验时间：${obj.checkTime[0]} 至 ${obj.checkTime[1]}`,
      field: 'checkTime',
    });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchParams };
  delete next[fieldName];
  // 清除核验人ID时，同时清除核验人名称
  if (fieldName === 'checkUserId') {
    delete next.checkUserName;
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

      const res = await getPayCheckPage(params);
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
      case '已缴清': {
        statusMatch = v.status === '已缴清';
        break;
      }
      case '欠费': {
        statusMatch = v.status === '欠费';
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
  dataObj.searchParams = values;
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
      const data = await getPayCheck(row.id);
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
  { label: '已缴清' },
  { label: '欠费' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '已缴清': {
      count = dataObj.apilist.filter((v) => v.status === '已缴清').length;
      break;
    }
    case '欠费': {
      count = dataObj.apilist.filter((v) => v.status === '欠费').length;
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

  // 如果是显示所有记录（平均核验时长卡片）
  if (filterParams.showAll) {
    // 清空所有筛选条件
    dataObj.searchParams = {};
    handleRefresh();
    ElMessage.success('已显示所有核验记录');
    return;
  }

  // 转换时间参数格式
  if (filterParams.startTime && filterParams.endTime) {
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

    dataObj.searchParams = {
      ...dataObj.searchParams,
      checkTime: [formatDateTime(startDate), formatDateTime(endDate)],
    };
    ElMessage.success('已应用图表筛选');
  } else {
    dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
    if (filterParams.status) {
      ElMessage.success(`已筛选状态: ${filterParams.status}`);
    } else {
      ElMessage.success('已应用图表筛选');
    }
  }

  handleRefresh();
};

onMounted(() => {
  loadStationOptions();
  window.addEventListener('filterByChart:payCheck', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:payCheck', handleFilterByChart);
});

// 车辆详情弹窗
const vehicleDetailDialogRef = ref(null);
const handlePlateClick = (row) => {
  vehicleDetailDialogRef.value?.open(row.plateNo);
};

// 字段点击筛选
const handleFieldFilter = (field, value) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    [field]: value,
  };
  handleRefresh();
};
</script>

<template>
  <div class="park-lot-table-new">
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailDialogRef" />
    <Drawer title="筛选">
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
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="筛选"
            icon-name="Filter"
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
          @click="handleFieldFilter('stationName', row.stationName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationName }}
        </el-text>
      </template>
      <template #checkUserName="{ row }">
        <el-text
          v-if="row.checkUserName"
          @click="handleFieldFilter('checkUserId', row.checkUserId); dataObj.searchParams.checkUserName = row.checkUserName"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.checkUserName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #updater="{ row }">
        <el-text>{{ row.updater || '-' }}</el-text>
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
            v-if="row.status === '已缴清'"
            content="放行"
            icon-name="CircleCheck"
            @click="handleRelease(row)"
          />
          <IconButton
            v-if="row.status === '欠费'"
            content="催缴"
            icon-name="Bell"
            color="#E6A23C"
            @click="handleRemind(row)"
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
            本页统计：缴费核验数量: {{ dataObj.list.length }}; 已选择:
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
