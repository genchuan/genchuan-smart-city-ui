<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import { formatTime } from '../../../utils/timeFormatter';
import {
  createCycleReport,
  exportCycleReport,
  exportCycleReportById,
  getCycleReport,
  getCycleReportPage,
} from '#/api/genchuan/industry/chargePark/vehiclePass/passReport/cycleReport';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import DrillDownDetailDialog from '../components/DrillDownDetailDialog.vue';
import {
  dataList,
  detailFields,
  getGenerateStatusTagType,
  getReportCycleTagType,
  textObj,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
  activeReportCycle: {
    type: String,
    default: '',
  },
});

// 是否使用真实API（默认true使用真实API）
const USE_REAL_API = true;

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
const formData = ref();

// 钻取弹窗引用
const drillDownDialogRef = ref(null);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const obj = formApi.form.values;

    if (USE_REAL_API) {
      try {
        const loadingInstance = ElLoading.service({
          text: '正在生成报表...',
        });
        try {
          await createCycleReport({
            reportCycle: obj.reportCycle,
            statStartTime: obj.statStartTime,
            statEndTime: obj.statEndTime,
            stationId: obj.stationId,
            remark: obj.remark,
            tenantId: 1, // TODO: 从用户信息获取
          });
          ElMessage.success('报表生成任务已提交');
          handleRefresh();
          formDrawerApi.close();
        } finally {
          loadingInstance.close();
        }
      } catch (error) {
        ElMessage.error('报表生成失败');
        console.error(error);
      }
    } else {
      // 模拟数据模式
      const newReport = {
        id: dataObj.apilist.length + 1,
        ...obj,
        enterCount: 0,
        leaveCount: 0,
        parkingCount: 0,
        identifySuccessRate: 0,
        checkSuccessRate: 0,
        abnormalHandleRate: 0,
        etcPassSuccessRate: 0,
        reportStatus: '生成中',
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        createCost: 0,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        creator: '当前用户',
      };
      dataObj.apilist.unshift(newReport);
      ElMessage.success('报表生成任务已提交');
      handleRefresh();
      formDrawerApi.close();
    }
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
  if (USE_REAL_API) {
    const loadingInstance = ElLoading.service({
      text: '正在导出报表...',
    });
    try {
      const res = await exportCycleReport(dataObj.searchParams);
      downloadFileFromBlobPart({ fileName: '周期报表.xlsx', source: res });
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    } finally {
      loadingInstance.close();
    }
  } else {
    exportToExcel(dataObj.list, textObj.excelName, textObj.excelAllName);
  }
}

function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 时间格式转换：将 "YYYY-MM-DD HH:mm:ss" 转换为 "YYYY-MM-DDTHH:mm:ss" (ISO 8601)
const formatTimeForApi = (timeStr) => {
  if (!timeStr) return timeStr;
  // 如果已经是 ISO 格式，直接返回
  if (timeStr.includes('T')) return timeStr;
  // 将空格替换为 T
  return timeStr.replace(' ', 'T');
};

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

// 当前激活的筛选标签
const activeFilterTags = reactive({
  reportStatus: '',
});

// 移除筛选标签
const removeFilterTag = (type) => {
  if (type === 'reportStatus') {
    activeFilterTags.reportStatus = '';
    delete dataObj.searchParams.reportStatus;
    handleRefresh();
  }
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

      const res = await getCycleReportPage(params);
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
    if (activeName.value !== '全部') {
      statusMatch = v.reportCycle === activeName.value;
    }

    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'beginTime') {
          searchMatch = searchMatch && v.statStartTime >= value;
        } else if (key === 'endTime') {
          searchMatch = searchMatch && v.statEndTime <= value;
        } else {
          searchMatch =
            typeof value === 'string'
              ? searchMatch && v[key]?.toString().includes(value)
              : searchMatch && v[key] === value;
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
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema(),
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
      if (USE_REAL_API) {
        const data = await getCycleReport(row.id);
        dataObj.detailObj = data;
      } else {
        dataObj.detailObj = row;
      }
      detailDrawerRef.value.open();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情失败');
    dataObj.detailObj = row;
    detailDrawerRef.value.open();
  }
};

const tabsData = ref([
  { label: '全部' },
  { label: '日报' },
  { label: '周报' },
  { label: '月报' },
  { label: '季报' },
  { label: '半年报' },
  { label: '年报' },
  { label: '自定义报表' },
]);

const createLabel = (item) => {
  let count = 0;

  if (item.label === '全部') {
    count = dataObj.apilist.length;
  } else {
    count = dataObj.apilist.filter((v) => v.reportCycle === item.label).length;
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

// 下钻筛选 - 点击报表周期
const handleReportCycleClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    reportCycle: row.reportCycle,
  };
  activeName.value = row.reportCycle;
  handleRefresh();
};

// 下钻跳转 - 点击场站名称（筛选该场站的报表）
const handleStationClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    stationName: row.stationName,
  };
  handleRefresh();
};

// 下钻跳转 - 点击入场量（打开钻取弹窗）
const handleEnterCountClick = (row) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: 'tableEnterCount',
      drillValue: String(row.id),
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
      stationName: row.stationName,
    });
  }
};

// 下钻跳转 - 点击离场量（打开钻取弹窗）
const handleLeaveCountClick = (row) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: 'tableLeaveCount',
      drillValue: String(row.id),
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
      stationName: row.stationName,
    });
  }
};

// 下钻跳转 - 点击在停车辆数（打开钻取弹窗）
const handleParkingCountClick = (row) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: 'tableParkingCount',
      drillValue: String(row.id),
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
      stationName: row.stationName,
    });
  }
};

// 下钻跳转 - 点击识别成功率（打开钻取弹窗）
const handleIdentifySuccessRateClick = (row) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: 'tableIdentifySuccessRate',
      drillValue: String(row.id),
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
      stationName: row.stationName,
    });
  }
};

// 下钻跳转 - 点击核验成功率（打开钻取弹窗）
const handleCheckSuccessRateClick = (row) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: 'tableCheckSuccessRate',
      drillValue: String(row.id),
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
      stationName: row.stationName,
    });
  }
};

// 下钻跳转 - 点击异常处置率（打开钻取弹窗）
const handleAbnormalHandleRateClick = (row) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: 'tableAbnormalHandleRate',
      drillValue: String(row.id),
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
      stationName: row.stationName,
    });
  }
};

// 下钻跳转 - 点击ETC通行成功率（打开钻取弹窗）
const handleEtcPassSuccessRateClick = (row) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: 'tableEtcPassSuccessRate',
      drillValue: String(row.id),
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
      stationName: row.stationName,
    });
  }
};

// 下钻筛选 - 点击生成状态
const handleReportStatusClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    reportStatus: row.reportStatus,
  };
  activeFilterTags.reportStatus = row.reportStatus;
  handleRefresh();
};

// 下钻筛选 - 点击操作人
const handleCreatorClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    creator: row.creator,
  };
  handleRefresh();
};

// 导出单条报表
const handleExportRow = async (row) => {
  const loadingInstance = ElLoading.service({
    text: `正在导出${row.reportCycle}...`,
  });
  try {
    if (USE_REAL_API) {
      await exportCycleReportById(row.id);
    } else {
      // 模拟导出
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
};

// 监听图表卡片点击事件
onMounted(() => {
  const handleCardClick = (e) => {
    const { key } = e.detail;
    const today = new Date();
    // 使用 ISO 8601 格式：YYYY-MM-DDTHH:mm:ss
    const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString().slice(0, 19);
    const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString().slice(0, 19);

    // 根据卡片类型筛选报表列表，并传递点击类型参数
    const filterParams = {
      beginTime: todayStart,
      endTime: todayEnd,
      clickType: key, // 传递点击类型：enterCount、leaveCount、parkingCount等
    };

    dataObj.searchParams = {
      ...dataObj.searchParams,
      ...filterParams,
    };
    handleRefresh();

    const cardTitleMap = {
      enterCount: '入场量',
      leaveCount: '离场量',
      parkingCount: '在停车辆数',
      identifySuccessRate: '识别成功率',
      checkSuccessRate: '核验成功率',
      abnormalHandleRate: '异常处置率',
      etcPassSuccessRate: 'ETC通行成功率',
    };

    ElMessage.success(`已筛选今日${cardTitleMap[key]}相关报表`);
  };

  window.addEventListener('cycleReport:cardClick', handleCardClick);
});

onUnmounted(() => {
  window.removeEventListener('cycleReport:cardClick', () => {});
});

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  dataObj.searchParams = {};
  activeFilterTags.reportStatus = '';

  switch (type) {
    case 'card': {
      switch (value) {
        case 'enterCount':
        case 'leaveCount':
        case 'parkingCount':
        case 'identifySuccessRate':
        case 'checkSuccessRate':
        case 'abnormalHandleRate':
        case 'etcPassSuccessRate': {
          console.log('钻取：卡片', value);
          break;
        }
      }
      break;
    }
    case 'reportCycle': {
      if (value) {
        dataObj.searchParams.reportCycle = value;
        console.log('钻取：报表周期', value);
      } else {
        delete dataObj.searchParams.reportCycle;
        console.log('取消报表周期筛选');
      }
      break;
    }
  }

  gridApi.query();
};

// 监听 activeReportCycle prop 变化
watch(
  () => props.activeReportCycle,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if (newVal) {
        dataObj.searchParams.reportCycle = newVal;
      } else {
        delete dataObj.searchParams.reportCycle;
      }
      gridApi.query();
    }
  },
  { immediate: false },
);

defineExpose({
  handleStatsFilter,
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.reportCycle || '报表'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <DrillDownDetailDialog ref="drillDownDialogRef" />
    <Drawer title="搜索">
      <SearchForm class="query-form" />
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
          <!-- 筛选标签 -->
          <div
            v-if="activeFilterTags.reportStatus"
            style="display: flex; gap: 8px; margin-top: 8px"
          >
            <el-tag
              type="primary"
              closable
              @close="removeFilterTag('reportStatus')"
            >
              生成状态：{{ activeFilterTags.reportStatus }}
            </el-tag>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="生成" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="筛选"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="刷新"
            icon-name="Refresh"
            @click="handleRefresh"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #reportCycle="{ row }">
        <el-tag
          :type="getReportCycleTagType(row.reportCycle)"
          style="cursor: pointer"
          @click="handleReportCycleClick(row)"
        >
          {{ row.reportCycle }}
        </el-tag>
      </template>
      <template #stationName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleStationClick(row)"
        >
          {{ row.stationName }}
        </el-text>
      </template>
      <template #enterCount="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleEnterCountClick(row)"
        >
          {{ row.enterCount }}
        </el-text>
      </template>
      <template #leaveCount="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleLeaveCountClick(row)"
        >
          {{ row.leaveCount }}
        </el-text>
      </template>
      <template #parkingCount="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleParkingCountClick(row)"
        >
          {{ row.parkingCount }}
        </el-text>
      </template>
      <template #identifySuccessRate="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleIdentifySuccessRateClick(row)"
        >
          {{ row.identifySuccessRate }}
        </el-text>
      </template>
      <template #checkSuccessRate="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleCheckSuccessRateClick(row)"
        >
          {{ row.checkSuccessRate }}
        </el-text>
      </template>
      <template #abnormalHandleRate="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleAbnormalHandleRateClick(row)"
        >
          {{ row.abnormalHandleRate }}
        </el-text>
      </template>
      <template #etcPassSuccessRate="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleEtcPassSuccessRateClick(row)"
        >
          {{ row.etcPassSuccessRate }}
        </el-text>
      </template>
      <template #reportStatus="{ row }">
        <el-tag
          :type="
            row.reportStatus === '已生成'
              ? 'success'
              : row.reportStatus === '生成中'
                ? 'warning'
                : 'danger'
          "
          style="cursor: pointer"
          @click="handleReportStatusClick(row)"
        >
          {{ row.reportStatus }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleCreatorClick(row)"
        >
          {{ row.creator }}
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
            content="导出"
            icon-name="download"
            @click="handleExportRow(row)"
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
            本页统计：报表数量: {{ dataObj.list.length }}; 已选择:
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
