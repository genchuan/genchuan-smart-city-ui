<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElLoading } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTime } from '../../../utils/timeFormatter';
import {
  checkPassRecord,
  exportPassRecord,
  getPassRecordPage,
  getPassRecord,
} from '#/api/genchuan/industry/chargePark/vehiclePass/specialPass/passRecord';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import IconButton from '#/components/common/IconButton.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import { exportToExcel } from '#/utils/excel.js';
import VehicleDetailDialog from '../../../components/VehicleDetailDialog.vue';
import ImagePreviewDialog from '../components/ImagePreviewDialog.vue';

import {
  detailFields,
  statusTypeMap,
  textObj,
  useCheckFormSchema,
  useGridColumns,
  useSearchFormSchema,
  getStationOptions,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: true,
  },
  drillDownFilter: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['arrowChange']);

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
const vehicleDetailDialogRef = ref(null);
const imagePreviewRef = ref(null);
const formData = ref();
const stationOptions = ref([]);

// 核查表单
const [CheckForm, checkFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-1',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useCheckFormSchema(),
  showDefaultActions: false,
});

const [CheckDrawer, checkDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    checkDrawerApi.close();
  },
  async onConfirm() {
    try {
      await checkFormApi.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }
    const values = checkFormApi.form.values;
    await handleCheckSubmit(values);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = checkDrawerApi.getData();
      checkFormApi.resetForm();
    }
  },
});

async function handleCheckSubmit(values) {
  if (USE_REAL_API) {
    try {
      await checkPassRecord({
        id: formData.value.id,
        checkResult: values.checkResult,
        checkRemark: values.checkRemark,
      });
      ElMessage.success('核查成功');
      checkDrawerApi.close();
      handleRefresh();
    } catch (error) {
      ElMessage.error('核查失败');
      console.error(error);
    }
  } else {
    ElMessage.success('核查成功');
    checkDrawerApi.close();
    handleRefresh();
  }
}

function handleRefresh() {
  gridApi.query();
}

function toDateTimeString(value, isEnd) {
  if (!value) return value;
  const str = String(value);
  if (/\d{2}:\d{2}:\d{2}/.test(str)) return str;
  return `${str} ${isEnd ? '23:59:59' : '00:00:00'}`;
}

function buildApiParams(rawParams) {
  const params = { ...rawParams };
  if (
    params.passTime &&
    Array.isArray(params.passTime) &&
    params.passTime.length === 2
  ) {
    params.passTime = [
      toDateTimeString(params.passTime[0], false),
      toDateTimeString(params.passTime[1], true),
    ];
  }
  return params;
}

async function handleExport() {
  const loadingInstance = ElLoading.service({
    text: '导出中...',
  });
  try {
    if (USE_REAL_API) {
      const res = await exportPassRecord(buildApiParams(dataObj.searchParams));
      downloadFileFromBlobPart({ fileName: '放行记录.xlsx', source: res });
    } else {
      exportToExcel([], textObj.excelName, textObj.excelAllName);
    }
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

function handleCheck(row) {
  console.log('handleCheck called with row:', row);
  console.log('checkDrawerApi:', checkDrawerApi);
  checkDrawerApi.setData(row).open();
  console.log('open() called');
}

function handleFieldClick(field, value) {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    [field]: value,
  };
  handleRefresh();
}

function handlePlateClick(row) {
  vehicleDetailDialogRef.value?.open(row.plateNo);
}

// 图片预览
const handleImagePreview = (imageUrl) => {
  if (!imageUrl) {
    ElMessage.warning('暂无图片');
    return;
  }
  imagePreviewRef.value?.open(imageUrl, '抓拍图片');
};

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});

const drillDownInfo = ref(null);

let isSearching = false;

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchParams;

  if (obj.plateNo) {
    filters.push({ label: `车牌号码：${obj.plateNo}`, field: 'plateNo' });
  }
  if (obj.passReason) {
    filters.push({ label: `放行原因：${obj.passReason}`, field: 'passReason' });
  }
  if (obj.status) {
    filters.push({ label: `状态：${obj.status}`, field: 'status' });
  }
  if (obj.passTime && obj.passTime.length === 2) {
    filters.push({ label: `放行时间：${obj.passTime[0]} ~ ${obj.passTime[1]}`, field: 'passTime' });
  }
  if (obj.stationName) {
    filters.push({ label: `场站：${obj.stationName}`, field: 'stationName' });
  }
  if (obj.stationId && !obj.stationName) {
    const station = stationOptions.value.find(s => s.value === obj.stationId);
    filters.push({ label: `场站：${station?.label || obj.stationId}`, field: 'stationId' });
  }
  if (obj.operatorName) {
    filters.push({ label: `操作人：${obj.operatorName}`, field: 'operatorName' });
  }
  if (obj.operatorId && !obj.operatorName) {
    filters.push({ label: `操作人ID：${obj.operatorId}`, field: 'operatorId' });
  }

  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchParams };
  delete next[fieldName];
  dataObj.searchParams = next;
  if (drillDownInfo.value?.fields?.includes(fieldName)) {
    drillDownInfo.value = null;
  }
  dataObj.currentPage = 1;
  gridApi.query();
};

const handleResetFilters = () => {
  dataObj.searchParams = {};
  drillDownInfo.value = null;
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
        ...buildApiParams(dataObj.searchParams),
      };

      if (isSearching) {
        isSearching = false;
        dataObj.currentPage = 1;
      } else {
        dataObj.currentPage = page.currentPage;
      }

      const res = await getPassRecordPage(params);
      dataObj.total = res.total || 0;
      dataObj.list = res.list || [];
      return dataObj;
    } catch (error) {
      ElMessage.error('获取数据失败');
      console.error(error);
      return dataObj;
    }
  }

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
      const data = await getPassRecord(row.id);
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
  { label: '未核查' },
  { label: '已核查' },
]);

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
  const { filterKey, date } = event.detail;

  // 根据不同的筛选类型设置查询参数（追加到现有筛选条件）
  if (filterKey === 'todayPass') {
    // 今日放行量：筛选今天的记录
    dataObj.searchParams = {
      ...dataObj.searchParams,
      passTime: [date, date],
    };
    drillDownInfo.value = {
      label: `今日放行（${date}）`,
      fields: ['passTime'],
    };
  } else if (filterKey === 'abnormalPass') {
    // 异常放行占比：筛选异常记录
    dataObj.searchParams = {
      ...dataObj.searchParams,
      status: '异常记录',
    };
    drillDownInfo.value = {
      label: '异常放行记录',
      fields: ['status'],
    };
  } else if (filterKey === 'trendDate') {
    // 折线图点击：筛选指定日期的记录
    dataObj.searchParams = {
      ...dataObj.searchParams,
      passTime: [date, date],
    };
    drillDownInfo.value = {
      label: `指定日期（${date}）`,
      fields: ['passTime'],
    };
  }

  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(async () => {
  stationOptions.value = await getStationOptions();
  window.addEventListener('filterByChart:passRecord', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart:passRecord', handleFilterByChart);
});

// 监听图表下钻筛选参数
watch(
  () => props.drillDownFilter,
  (newFilter) => {
    if (newFilter) {
      const { filterKey, date } = newFilter;

      // 根据不同的筛选类型设置查询参数
      if (filterKey === 'todayPass') {
        // 今日放行量：筛选今天的记录
        dataObj.searchParams = {
          passTime: [date, date],
        };
        drillDownInfo.value = {
          label: `今日放行（${date}）`,
          fields: ['passTime'],
        };
      } else if (filterKey === 'abnormalPass') {
        // 异常放行占比：筛选异常记录
        dataObj.searchParams = {
          status: '异常记录',
        };
        drillDownInfo.value = {
          label: '异常放行记录',
          fields: ['status'],
        };
      } else if (filterKey === 'trendDate') {
        // 折线图点击：筛选指定日期的记录
        dataObj.searchParams = {
          passTime: [date, date],
        };
        drillDownInfo.value = {
          label: `指定日期（${date}）`,
          fields: ['passTime'],
        };
      }

      // 刷新表格数据
      handleRefresh();
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <CheckDrawer>
      <CheckForm />
    </CheckDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`放行记录详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <VehicleDetailDialog ref="vehicleDetailDialogRef" />
    <ImagePreviewDialog ref="imagePreviewRef" />
    <Drawer title="搜索">
      <SearchForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div
            v-if="activeFilters.length"
            style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px;"
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
                :label="item.label"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            v-if="props.arrowShow"
            content="收起"
            icon-name="ArrowUp"
            @click="emit('arrowChange')"
          />
          <IconButton
            v-else
            content="展开"
            icon-name="ArrowDown"
            @click="emit('arrowChange')"
          />
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
      <template #passReason="{ row }">
        <el-text
          @click="handleFieldClick('passReason', row.passReason)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.passReason }}
        </el-text>
      </template>
      <template #imageUrl="{ row }">
        <img
          v-if="row.imageUrl"
          :src="row.imageUrl"
          alt="抓拍图片"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          style="width: 60px; height: 40px; cursor: pointer; object-fit: cover; border-radius: 4px;"
          @click="handleImagePreview(row.imageUrl)"
        />
        <span v-else>-</span>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="statusTypeMap[row.status]"
          @click="handleFieldClick('status', row.status)"
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #stationName="{ row }">
        <el-text
          @click="handleFieldClick('stationName', row.stationName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationName }}
        </el-text>
      </template>
      <template #operatorName="{ row }">
        <el-text
          @click="handleFieldClick('operatorName', row.operatorName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.operatorName }}
        </el-text>
      </template>
      <template #correctionMark="{ row }">
        <el-tag v-if="row.isCorrected" type="success">已修正</el-tag>
        <el-tag v-else type="info">未修正</el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="row.status === '异常记录'"
            content="核查"
            icon-name="Search"
            @click="handleCheck(row)"
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
            本页统计：放行记录数量: {{ dataObj.list.length }}; 已选择:
            {{ checkedIds.length }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
