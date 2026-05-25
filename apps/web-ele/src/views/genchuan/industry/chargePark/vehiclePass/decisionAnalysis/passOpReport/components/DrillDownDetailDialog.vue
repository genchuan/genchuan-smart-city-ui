<script setup>
import { computed, nextTick, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCycleReportPage } from '#/api/genchuan/industry/chargePark/vehiclePass/passReport/cycleReport';

const emit = defineEmits(['close']);

const drillInfo = reactive({
  drillType: '',
  drillValue: '',
  drillName: '',
  reportCycle: '',
  reportId: '',
  stationId: '',
});

const dataObj = reactive({
  total: 0,
  list: [],
  pageSize: 10,
  currentPage: 1,
});

const isCardDrill = computed(() => {
  const cardTypes = [
    'enterCount',
    'leaveCount',
    'parkingCount',
    'identifySuccessRate',
    'checkSuccessRate',
    'abnormalHandleRate',
    'etcPassSuccessRate',
  ];
  return cardTypes.includes(drillInfo.drillType);
});

const isChartDrill = computed(() => {
  const chartTypes = [
    'stationDistribution',
    'hourDistribution',
    'passTrend',
    'identifyTrend',
    'abnormalType',
  ];
  return chartTypes.includes(drillInfo.drillType);
});

const isTableDrill = computed(() => {
  const tableDrillTypes = [
    'tableEnterCount',
    'tableLeaveCount',
    'tableParkingCount',
    'tableIdentifySuccessRate',
    'tableCheckSuccessRate',
    'tableAbnormalHandleRate',
    'tableEtcPassSuccessRate',
  ];
  return tableDrillTypes.includes(drillInfo.drillType);
});

const cardTypeMap = {
  enterCount: { name: '入场量' },
  leaveCount: { name: '离场量' },
  parkingCount: { name: '在停车辆数' },
  identifySuccessRate: { name: '识别成功率' },
  checkSuccessRate: { name: '核验成功率' },
  abnormalHandleRate: { name: '异常处置率' },
  etcPassSuccessRate: { name: 'ETC通行成功率' },
};

const chartTypeMap = {
  stationDistribution: { chartType: 'bar', apiParam: 'stationDistribution' },
  hourDistribution: { chartType: 'bar', apiParam: 'hourDistribution' },
  passTrend: { chartType: 'line', apiParam: 'passTrend' },
  identifyTrend: { chartType: 'line', apiParam: 'identifyTrend' },
  abnormalType: { chartType: 'pie', apiParam: 'abnormalType' },
};

const tableDrillTypeMap = {
  tableEnterCount: { name: '入场量' },
  tableLeaveCount: { name: '离场量' },
  tableParkingCount: { name: '在停车辆数' },
  tableIdentifySuccessRate: { name: '识别成功率' },
  tableCheckSuccessRate: { name: '核验成功率' },
  tableAbnormalHandleRate: { name: '异常处置率' },
  tableEtcPassSuccessRate: { name: 'ETC通行成功率' },
};

const dialogTitle = computed(() => {
  if (isCardDrill.value) {
    const cardInfo = cardTypeMap[drillInfo.drillType];
    return `${cardInfo?.name || ''}明细`;
  }
  if (isTableDrill.value) {
    const tableInfo = tableDrillTypeMap[drillInfo.drillType];
    return `${tableInfo?.name || ''}明细 - ${drillInfo.drillName}`;
  }
  if (isChartDrill.value) {
    return `${drillInfo.drillName || '图表'}钻取明细`;
  }
  return '钻取明细';
});

const getColumns = () => {
  // 返回周期报表的列配置
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportCycle',
      title: '报表周期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'statStartTime',
      title: '统计时段',
      minWidth: 320,
      sortable: true,
      formatter: ({ row }) => {
        return `${row.statStartTime} ~ ${row.statEndTime}`;
      },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'enterCount',
      title: '入场量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'leaveCount',
      title: '离场量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'parkingCount',
      title: '在停车辆数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'identifySuccessRate',
      title: '识别成功率(%)',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'checkSuccessRate',
      title: '核验成功率(%)',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'abnormalHandleRate',
      title: '异常处置率(%)',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'etcPassSuccessRate',
      title: 'ETC通行成功率(%)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'reportStatus',
      title: '报表生成状态',
      minWidth: 120,
      sortable: true,
    },
  ];
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 构建查询参数
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    console.log('下钻信息:', drillInfo);
    console.log('是否卡片下钻:', isCardDrill.value);
    console.log('是否图表下钻:', isChartDrill.value);

    // 根据下钻类型添加筛选条件
    if (drillInfo.reportCycle && drillInfo.reportCycle !== '全部') {
      params.reportCycle = drillInfo.reportCycle;
    }

    if (drillInfo.stationId) {
      params.stationId = drillInfo.stationId;
    }

    // 卡片下钻 - 添加今日时间筛选
    if (isCardDrill.value) {
      const today = new Date();
      const beginTime = new Date(today.setHours(0, 0, 0, 0)).toISOString().slice(0, 19);
      const endTime = new Date(today.setHours(23, 59, 59, 999)).toISOString().slice(0, 19);
      params.beginTime = beginTime;
      params.endTime = endTime;
    }

    // 图表下钻 - 根据下钻类型添加筛选
    if (isChartDrill.value) {
      // 柱状图下钻 - 按场站筛选
      if (drillInfo.drillType === 'stationDistribution' && drillInfo.stationId) {
        params.stationId = drillInfo.stationId;
      }

      // 折线图下钻 - 按时间筛选
      if ((drillInfo.drillType === 'passTrend' || drillInfo.drillType === 'identifyTrend') && drillInfo.drillValue) {
        const date = new Date(drillInfo.drillValue);
        const beginTime = new Date(date.setHours(0, 0, 0, 0)).toISOString().slice(0, 19);
        const endTime = new Date(date.setHours(23, 59, 59, 999)).toISOString().slice(0, 19);
        params.beginTime = beginTime;
        params.endTime = endTime;
      }

      // 饼图下钻 - 暂时不添加特定筛选，显示所有数据
      // 如果后端支持按异常类型筛选，可以添加：
      // if (drillInfo.drillType === 'abnormalType' && drillInfo.drillValue) {
      //   params.abnormalType = drillInfo.drillValue;
      // }
    }

    console.log('钻取查询参数:', params);

    // 调用真实API
    const res = await getCycleReportPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];

    return dataObj;
  } catch (error) {
    console.error('获取钻取数据失败:', error);
    ElMessage.error('获取钻取数据失败');
    return dataObj;
  }
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [],
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
      refresh: true,
    },
    showOverflow: true,
  },
  showSearchForm: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  mask: false,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  class: 'w-[75vw]',
  onCancel() {
    drawerApi.close();
    emit('close');
  },
  onConfirm() {},
});

const open = async (info) => {
  console.log('打开钻取弹窗:', info);
  Object.assign(drillInfo, info);

  drawerApi.setState({
    title: dialogTitle.value,
  });

  await nextTick();

  // 动态更新表格列配置
  const columns = getColumns();
  gridApi.setGridOptions({ columns });

  drawerApi.open();

  // 等待抽屉打开后加载数据
  setTimeout(() => {
    gridApi.query();
  }, 100);
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer :title="dialogTitle">
    <div class="drill-down-detail">
      <div class="drill-info">
        <span v-if="drillInfo.drillName" class="info-item">
          钻取维度: {{ drillInfo.drillName }}
        </span>
        <span v-if="drillInfo.reportCycle" class="info-item">
          报表周期: {{ drillInfo.reportCycle }}
        </span>
      </div>
      <Grid />
    </div>
  </Drawer>
</template>

<style scoped>
.drill-down-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drill-info {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.info-item {
  font-size: 14px;
  color: #606266;
}
</style>
