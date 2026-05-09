<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

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
  if (isCardDrill.value) {
    return getCardDrillColumns();
  }
  if (isTableDrill.value) {
    return getTableDrillColumns();
  }
  if (isChartDrill.value) {
    return getChartDrillColumns();
  }
  return [];
};

const getCardDrillColumns = () => {
  const baseColumns = [
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'passTime', title: '通行时间', minWidth: 160 },
    { field: 'plateNumber', title: '车牌号', minWidth: 120 },
    { field: 'passType', title: '通行类型', minWidth: 100 },
  ];

  switch (drillInfo.drillType) {
    case 'enterCount':
      return [
        ...baseColumns,
        { field: 'enterLane', title: '入场车道', minWidth: 120 },
        { field: 'identifyResult', title: '识别结果', minWidth: 100 },
      ];
    case 'leaveCount':
      return [
        ...baseColumns,
        { field: 'leaveLane', title: '离场车道', minWidth: 120 },
        { field: 'parkingDuration', title: '停车时长', minWidth: 120 },
      ];
    case 'parkingCount':
      return [
        ...baseColumns,
        { field: 'parkingSpace', title: '停车位', minWidth: 100 },
        { field: 'parkingDuration', title: '停车时长', minWidth: 120 },
      ];
    default:
      return baseColumns;
  }
};

const getTableDrillColumns = () => {
  return [
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'passTime', title: '通行时间', minWidth: 160 },
    { field: 'plateNumber', title: '车牌号', minWidth: 120 },
    { field: 'passType', title: '通行类型', minWidth: 100 },
    { field: 'value', title: '数值', minWidth: 100 },
  ];
};

const getChartDrillColumns = () => {
  return [
    { field: 'stationName', title: '场站名称', minWidth: 180 },
    { field: 'statTime', title: '统计时间', minWidth: 160 },
    { field: 'passCount', title: '通行量', minWidth: 100 },
    { field: 'enterCount', title: '入场量', minWidth: 100 },
    { field: 'leaveCount', title: '离场量', minWidth: 100 },
  ];
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 模拟数据
    const mockData = generateMockData();
    dataObj.total = mockData.length;
    dataObj.list = mockData.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
    return dataObj;
  } catch (error) {
    console.error('获取钻取数据失败:', error);
    ElMessage.error('获取钻取数据失败');
    return dataObj;
  }
};

const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i + 1,
      stationName: '泉州丰泽充停场站',
      passTime: `2026-05-08 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      plateNumber: `闽D${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      passType: Math.random() > 0.5 ? '入场' : '离场',
      enterLane: `${Math.floor(Math.random() * 5) + 1}号车道`,
      leaveLane: `${Math.floor(Math.random() * 5) + 1}号车道`,
      identifyResult: Math.random() > 0.1 ? '成功' : '失败',
      parkingSpace: `A${Math.floor(Math.random() * 100) + 1}`,
      parkingDuration: `${Math.floor(Math.random() * 120)}分钟`,
      value: Math.floor(Math.random() * 100),
      statTime: `2026-05-08`,
      passCount: Math.floor(Math.random() * 500) + 100,
      enterCount: Math.floor(Math.random() * 300) + 50,
      leaveCount: Math.floor(Math.random() * 300) + 50,
    });
  }
  return data;
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
    showOverflow: true,
  },
  showSearchForm: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
    emit('close');
  },
  onConfirm() {},
  async onOpenChange(isOpen) {
    if (isOpen) {
      const columns = getColumns();
      gridApi.setGridOption('columns', columns);
      gridApi.query();
    }
  },
});

const open = (info) => {
  Object.assign(drillInfo, info);
  drawerApi
    .setData({
      title: dialogTitle.value,
    })
    .open();
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
