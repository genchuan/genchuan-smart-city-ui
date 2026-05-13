<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElTag } from 'element-plus';

import { getInvoiceConfigChart, getInvoiceConfigPage } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';
import { useVbenDrawer } from '@vben/common-ui';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';

const statusMap = {
  pending: { label: '未生效', type: 'warning' },
  enabled: { label: '已生效', type: 'success' },
  disabled: { label: '已禁用', type: 'danger' },
};

const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '已生效配置', value: 0, color: '#13ce66', status: 'enabled' },
    { title: '总配置数', value: 0, color: '#4ECDC4', status: null },
  ],
  categoryData: [],
});

const selectedCategory = ref(null);
const selectedStatus = ref(null);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '发票配置列表';
    if (selectedCategory.value) {
      title = `${selectedCategory.value} ${title}`;
    }
    if (selectedStatus.value) {
      title = `${statusMap[selectedStatus.value]?.label || selectedStatus.value} ${title}`;
    }
    return title;
  }),
  class: 'genchuan-detail-drawer',
  onCancel() {
    drawerApi.close();
  },
});

const drawerDataObj = reactive({
  total: 0,
  list: [],
  loading: false,
});

const getDrawerTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  if (selectedCategory.value) {
    params.category = selectedCategory.value;
  }

  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getInvoiceConfigPage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        auditTime: formatTimestamp(v.auditTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取发票配置列表失败:', error);
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

const handleCardClick = (status) => {
  selectedStatus.value = status;
  selectedCategory.value = null;
  drawerGridApi.query();
  drawerApi.open();
};

const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    selectedCategory.value = params.name;
    selectedStatus.value = null;
    drawerGridApi.query();
    drawerApi.open();
  }
};

const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'category', title: '开票类目', width: 180 },
      { field: 'taxRate', title: '税率(%)', width: 100 },
      { field: 'taxBody', title: '开票主体', width: 160 },
      { field: 'status', title: '状态', width: 120,
        slots: { default: 'status' }
      },
      { field: 'auditorName', title: '审核人名称', width: 120 },
      { field: 'auditTime', title: '审核时间', width: 180 },
      { field: 'creator', title: '创建者', width: 100 },
      { field: 'createTime', title: '创建时间', width: 180 },
    ],
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getDrawerTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: drawerDataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
    },
    showOverflow: true,
  },
  showSearchForm: false,
});

const lineChartRef = ref(null);
let lineChartInstance = null;

const fetchInvoiceConfigChartData = async () => {
  try {
    const res = await getInvoiceConfigChart();
    state.cardList[0].value = res.cardData?.enabledCount || res.enabledCount || 0;
    const totalCount = res.categoryData?.reduce((sum, item) => sum + item.count, 0) || 0;
    state.cardList[1].value = totalCount;
    state.categoryData =
      res.categoryData && res.categoryData.length > 0
        ? res.categoryData
        : [
            { category: '共享充电服务费', count: 1 },
            { category: '设备租赁费', count: 1 },
            { category: '增值服务费', count: 1 },
            { category: '广告服务费', count: 1 },
            { category: '运营管理费', count: 1 },
            { category: '维保服务费', count: 1 },
            { category: '数据服务费', count: 1 },
            { category: '咨询服务费', count: 1 },
            { category: '安装调试费', count: 1 },
            { category: '培训服务费', count: 1 },
          ];
    updateChart();
  } catch (error) {
    console.error('获取发票配置图表数据失败:', error);
    state.cardList[0].value = 5;
    state.cardList[1].value = 10;
    state.categoryData = [
      { category: '共享充电服务费', count: 1 },
      { category: '设备租赁费', count: 1 },
      { category: '增值服务费', count: 1 },
      { category: '广告服务费', count: 1 },
      { category: '运营管理费', count: 1 },
      { category: '维保服务费', count: 1 },
      { category: '数据服务费', count: 1 },
      { category: '咨询服务费', count: 1 },
      { category: '安装调试费', count: 1 },
      { category: '培训服务费', count: 1 },
    ];
    updateChart();
  }
};

const initChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '开票类目统计',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: state.categoryData.map((item) => item.category),
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: state.categoryData.map((item) => item.count),
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#357ABD' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  lineChartInstance.setOption(option);

  lineChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

const updateChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.categoryData.map((item) => item.category),
    },
    series: [
      {
        data: state.categoryData.map((item) => item.count),
      },
    ],
  });
};

onMounted(() => {
  fetchInvoiceConfigChartData().then(() => {
    initChart();
  });

  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
  });
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card
        class="left-card cursor-pointer"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(item.status)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DrawerGrid>
  </Drawer>
</template>
<style scoped lang="scss"> 
 
.left-card {
  flex:1;
  width: 330px; 

  :deep(.stat-card) {
    flex:1;
  }
}
</style>
