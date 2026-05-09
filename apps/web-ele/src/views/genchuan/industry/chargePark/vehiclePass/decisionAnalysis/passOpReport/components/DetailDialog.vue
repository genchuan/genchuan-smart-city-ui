<script setup>
import { reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCycleReportPage } from '#/api/genchuan/industry/chargePark/vehiclePass/passReport/cycleReport';

const visible = ref(false);
const dialogTitle = ref('明细');
const filterParams = ref({});

const dataObj = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
});

// 表格列配置
const columns = [
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

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...filterParams.value,
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
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
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

const open = (config) => {
  dialogTitle.value = config.title || '明细';
  filterParams.value = config.filterParams || {};

  visible.value = true;

  setTimeout(() => {
    if (gridApi) {
      gridApi.query();
    }
  }, 100);
};

const close = () => {
  visible.value = false;
};

defineExpose({
  open,
  close,
});

</script>

<template>
  <el-drawer
    v-model="visible"
    :title="dialogTitle"
    size="75%"
    direction="rtl"
    :append-to-body="true"
  >
    <Grid />
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-drawer__body) {
  padding: 20px;
}
</style>
