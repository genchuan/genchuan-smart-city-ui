<!-- orderReport/index.vue -->
<template>
  <div class="common-index">
    <OrderReportChart ref="chartRef" @drill-down="handleDrillDown" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus">
        <ArrowDown />
      </el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus">
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <OrderReportTable
          ref="tableRef"
          :second-show="item.secondShow"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
          @refresh-chart="refreshChart"
          @open-custom-drawer="handleCustomCreate"
        />
      </el-tab-pane>
    </el-tabs>

    <CustomDrawer ref="customDrawerRef" @success="refreshCurrentTable" />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import OrderReportChart from './table/OrderReportChart.vue';
import OrderReportTable from './table/index.vue';
import CustomDrawer from './table/customDrawer.vue';
import '#/components/page/index.scss';

const chartRef = ref(null);
const tableRef = ref(null);
const customDrawerRef = ref(null);

const tabArray = ref([
  {
    label: '报表管理',
    components: OrderReportTable,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const activeName = ref('报表管理');
const secondShow = ref(false);

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const refreshChart = () => {
  chartRef.value?.fetchChartData();
};

const refreshCurrentTable = () => {
  const table = getTableInstance();
  table?.handleRefresh();
  refreshChart();
};

const getTableInstance = () => {
  let instance = tableRef.value;
  if (Array.isArray(instance)) {
    instance = instance[0];
  }
  return instance;
};

const handleDrillDown = async (payload) => {
  const { type, data } = payload;
  await nextTick();
  const tableInstance = getTableInstance();
  if (!tableInstance) return;

  switch (type) {
    case 'card':
      if (data.filterType === 'abnormal') {
        tableInstance.setFilter({ abnormalType: '异常订单' });
      } else if (data.filterType === 'refund') {
        tableInstance.setFilter({ refundStatus: '已退款' });
      } else if (data.filterType === 'total') {
        tableInstance.resetFilter();
      } else if (data.filterType === 'amount') {
        tableInstance.setFilter({ tradeAmount: '>0' });
      } else {
        tableInstance.resetFilter();
      }
      break;
    case 'line':
    case 'bar':
      if (data.date) {
        tableInstance.setFilter({
          startTime: `${data.date} 00:00:00`,
          endTime: `${data.date} 23:59:59`,
        });
      }
      break;
    default:
      break;
  }
};

const handleCustomCreate = () => {
  customDrawerRef.value?.open();
};

const tabChange = () => {};

defineExpose({
  refreshChart,
  refreshCurrentTable,
});
</script>


