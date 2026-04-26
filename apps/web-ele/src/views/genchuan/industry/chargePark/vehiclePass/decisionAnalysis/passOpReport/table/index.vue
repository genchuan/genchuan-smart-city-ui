<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPassOpReport } from '#/api/genchuan/industry/chargePark/vehiclePass/decisionAnalysis/passOpReport';
import {
  createCycleReport,
  exportCycleReport,
  getCycleReportPage,
} from '#/api/genchuan/industry/chargePark/vehiclePass/passReport/cycleReport';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
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
});

// 是否使用真实API（默认false使用模拟数据）
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
    try {
      const loadingInstance = ElLoading.service({
        text: '正在导出报表...',
      });
      try {
        await exportCycleReport(dataObj.searchParams);
        ElMessage.success('导出成功');
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    }
  } else {
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
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

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  // 使用真实API
  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...dataObj.searchParams,
      };

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
    switch (activeName.value) {
      case '半年报': {
        statusMatch = v.reportType === '半年报';
        break;
      }
      case '周报': {
        statusMatch = v.reportType === '周报';
        break;
      }
      case '季报': {
        statusMatch = v.reportType === '季报';
        break;
      }
      case '年报': {
        statusMatch = v.reportType === '年报';
        break;
      }
      case '日报': {
        statusMatch = v.reportType === '日报';
        break;
      }
      case '月报': {
        statusMatch = v.reportType === '月报';
        break;
      }
      case '自定义报表': {
        statusMatch = v.reportType === '自定义报表';
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
      // 优先使用 passOpReport 的详情接口
      const data = await getPassOpReport(row.id);
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

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '半年报': {
      count = dataObj.apilist.filter((v) => v.reportType === '半年报').length;
      break;
    }
    case '周报': {
      count = dataObj.apilist.filter((v) => v.reportType === '周报').length;
      break;
    }
    case '季报': {
      count = dataObj.apilist.filter((v) => v.reportType === '季报').length;
      break;
    }
    case '年报': {
      count = dataObj.apilist.filter((v) => v.reportType === '年报').length;
      break;
    }
    case '日报': {
      count = dataObj.apilist.filter((v) => v.reportType === '日报').length;
      break;
    }
    case '月报': {
      count = dataObj.apilist.filter((v) => v.reportType === '月报').length;
      break;
    }
    case '自定义报表': {
      count = dataObj.apilist.filter(
        (v) => v.reportType === '自定义报表',
      ).length;
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

// 下钻筛选 - 点击报表类型
const handleReportTypeClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    reportCycle: row.reportType, // 后端字段是 reportCycle
  };
  handleRefresh();
  // ElMessage.success(`已筛选报表类型：${row.reportType}`);
};

// 下钻筛选 - 点击统计周期
const handleStatisticPeriodClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    statisticPeriod: row.statisticPeriod,
  };
  handleRefresh();
  ElMessage.success(`已筛选统计周期：${row.statisticPeriod}`);
};

// 下钻筛选 - 点击场站名称
const handleStationClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    stationId: row.stationId,
  };
  handleRefresh();
  ElMessage.success(`已筛选场站：${row.stationName}`);
};

// 下钻跳转 - 点击入场量
const handleEntryCountClick = (row) => {
  ElMessage.info(
    `查看${row.statisticPeriod}入场明细 - 入场量：${row.entryCount}`,
  );
  // TODO: 打开入场明细弹窗
};

// 下钻跳转 - 点击离场量
const handleExitCountClick = (row) => {
  ElMessage.info(
    `查看${row.statisticPeriod}离场明细 - 离场量：${row.exitCount}`,
  );
  // TODO: 打开离场明细弹窗
};

// 下钻跳转 - 点击在停车辆数
const handleParkingCountClick = (row) => {
  ElMessage.info(
    `查看${row.statisticPeriod}在停车辆明细 - 在停车辆数：${row.parkingCount}`,
  );
  // TODO: 打开在停车辆明细弹窗
};

// 下钻筛选 - 点击生成状态
const handleGenerateStatusClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    reportStatus: row.generateStatus, // 后端字段是 reportStatus
  };
  handleRefresh();
  ElMessage.success(`已筛选生成状态：${row.generateStatus}`);
};

// 下钻筛选 - 点击操作人
const handleOperatorClick = (row) => {
  dataObj.searchParams = {
    ...dataObj.searchParams,
    creator: row.operatorName, // 后端字段是 creator
  };
  handleRefresh();
  ElMessage.success(`已筛选操作人：${row.operatorName}`);
};

// 导出单条报表
const handleExportRow = async (row) => {
  const loadingInstance = ElLoading.service({
    text: `正在导出${row.reportType}...`,
  });
  try {
    if (USE_REAL_API) {
      await exportCycleReport({ id: row.id });
      ElMessage.success(`${row.reportType}导出成功`);
    } else {
      // 模拟导出
      await new Promise((resolve) => setTimeout(resolve, 1000));
      ElMessage.success(`${row.reportType}导出成功`);
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
  const handleFilterByChart = (e) => {
    // 没有下钻逻辑。
    return;
    const { status } = e.detail;

    // 根据卡片key设置筛选条件
    // 卡片的key对应后端接口的字段名
    const filterMap = {
      entryCount: { field: 'minEntryCount', label: '入场量' },
      exitCount: { field: 'minExitCount', label: '离场量' },
      parkingCount: { field: 'minParkingCount', label: '在停车辆数' },
      identifySuccessRate: {
        field: 'minIdentifySuccessRate',
        label: '识别成功率',
      },
      verifySuccessRate: { field: 'minVerifySuccessRate', label: '核验成功率' },
      abnormalHandleRate: {
        field: 'minAbnormalHandleRate',
        label: '异常处置率',
      },
      etcSuccessRate: { field: 'minEtcSuccessRate', label: 'ETC通行成功率' },
    };

    const filter = filterMap[status];
    if (filter) {
      // 设置筛选条件（这里可以根据实际需求调整筛选逻辑）
      dataObj.searchParams = {
        ...dataObj.searchParams,
        // 可以添加具体的筛选值，比如大于某个阈值
        // [filter.field]: 某个值
      };
      handleRefresh();
      ElMessage.success(`已点击${filter.label}卡片`);
    }
  };

  window.addEventListener('filterByChart', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart', handleFilterByChart);
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.reportType || '报表'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
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
      <template #id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #reportType="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleReportTypeClick(row)"
        >
          {{ row.reportType }}
        </el-text>
      </template>
      <template #statisticPeriod="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleStatisticPeriodClick(row)"
        >
          {{ row.statisticPeriod }}
        </el-text>
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
      <template #entryCount="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleEntryCountClick(row)"
        >
          {{ row.entryCount }}
        </el-text>
      </template>
      <template #exitCount="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleExitCountClick(row)"
        >
          {{ row.exitCount }}
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
      <template #generateStatus="{ row }">
        <el-tag
          :type="
            row.generateStatus === '已生成'
              ? 'success'
              : row.generateStatus === '生成中'
                ? 'warning'
                : 'danger'
          "
          style="cursor: pointer"
          @click="handleGenerateStatusClick(row)"
        >
          {{ row.generateStatus }}
        </el-tag>
      </template>
      <template #operatorName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOperatorClick(row)"
        >
          {{ row.operatorName }}
        </el-text>
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
