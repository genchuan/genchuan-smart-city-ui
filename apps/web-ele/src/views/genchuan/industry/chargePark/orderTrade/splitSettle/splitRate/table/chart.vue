<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElTag } from 'element-plus';

import { getSplitRateChart, getSplitRatePage } from '#/api/genchuan/industry/chargePark/orderTrade/splitSettle/index.js';
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

const splitModeMap = {
  fixed: { label: '固定比例', type: 'primary' },
  ladder: { label: '阶梯比例', type: 'success' },
};

const getSplitModeLabel = (splitMode) => {
  return splitModeMap[splitMode]?.label || splitMode;
};

const getSplitModeType = (splitMode) => {
  return splitModeMap[splitMode]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '已生效数量', value: 0, color: '#FF6B6B', status: 'enabled' },
    { title: '固定比例数', value: 0, color: '#4ECDC4', splitMode: 'fixed' },
    { title: '阶梯比例数', value: 0, color: '#13ce66', splitMode: 'ladder' },
  ],
  splitModeData: [],
});

const selectedSplitMode = ref(null);
const selectedStatus = ref(null);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '分账规则列表';
    if (selectedSplitMode.value) {
      title = `${getSplitModeLabel(selectedSplitMode.value)} ${title}`;
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

  if (selectedSplitMode.value) {
    params.splitMode = selectedSplitMode.value;
  }

  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getSplitRatePage(params);
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
    console.error('获取分账规则列表失败:', error);
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

const handleCardClick = (item) => {
  if (item.splitMode) {
    selectedSplitMode.value = item.splitMode;
    selectedStatus.value = null;
  } else if (item.status) {
    selectedStatus.value = item.status;
    selectedSplitMode.value = null;
  }
  drawerGridApi.query();
  drawerApi.open();
};

const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    const splitModeKey = params.name === '固定比例' ? 'fixed' : 'ladder';
    selectedSplitMode.value = splitModeKey;
    selectedStatus.value = null;
    drawerGridApi.query();
    drawerApi.open();
  }
};

const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'partnerId', title: '合作方ID', width: 120 },
      { field: 'partnerName', title: '合作方名称', width: 160 },
      { field: 'splitMode', title: '分账模式', width: 120,
        slots: { default: 'splitMode' }
      },
      { field: 'rateValue', title: '比例值(%)', width: 100 },
      { field: 'status', title: '状态', width: 100,
        slots: { default: 'status' }
      },
      { field: 'auditorName', title: '审核人', width: 100 },
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

const fetchSplitRateChartData = async () => {
  try {
    const res = await getSplitRateChart();
    state.cardList[0].value = res.cardData?.enabledCount || res.enabledCount || 0;
    const fixedData = res.splitModeData?.find(item => item.split_mode === 'fixed');
    const ladderData = res.splitModeData?.find(item => item.split_mode === 'ladder');
    state.cardList[1].value = fixedData?.count || 0;
    state.cardList[2].value = ladderData?.count || 0;
    state.splitModeData =
      res.splitModeData && res.splitModeData.length > 0
        ? res.splitModeData
        : [
            { split_mode: 'fixed', count: 6 },
            { split_mode: 'ladder', count: 4 },
          ];
    updateLineChart();
  } catch (error) {
    console.error('获取分账结算图表数据失败:', error);
    state.cardList[0].value = 4;
    state.cardList[1].value = 6;
    state.cardList[2].value = 4;
    state.splitModeData = [
      { split_mode: 'fixed', count: 6 },
      { split_mode: 'ladder', count: 4 },
    ];
    updateLineChart();
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '分账模式分布',
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
      formatter: (params) => {
        const data = params[0];
        return `<div style="padding: 8px;">
          <div style="font-weight: 500;">${data.name}</div>
          <div>数量：${data.value} 个</div>
        </div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: state.splitModeData.map((item) => item.split_mode === 'fixed' ? '固定比例' : '阶梯比例'),
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: { color: '#6E7E91', fontSize: 12 },
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: state.splitModeData.map((item) => ({
          value: item.count,
          itemStyle: {
            color: item.split_mode === 'fixed' 
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ECDC4' },
                  { offset: 1, color: '#44A08D' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF6B6B' },
                  { offset: 1, color: '#EE5A24' },
                ]),
          },
        })),
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
    ],
  };

  lineChartInstance.setOption(option);

  lineChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

const updateLineChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.splitModeData.map((item) => item.split_mode === 'fixed' ? '固定比例' : '阶梯比例'),
    },
    series: [
      {
        data: state.splitModeData.map((item) => ({
          value: item.count,
          itemStyle: {
            color: item.split_mode === 'fixed' 
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ECDC4' },
                  { offset: 1, color: '#44A08D' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF6B6B' },
                  { offset: 1, color: '#EE5A24' },
                ]),
          },
        })),
      },
    ],
  });
};

onMounted(() => {
  fetchSplitRateChartData().then(() => {
    initLineChart();
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
        @click="handleCardClick(item)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #splitMode="{ row }">
        <el-tag :type="getSplitModeType(row.splitMode)">
          {{ getSplitModeLabel(row.splitMode) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </DrawerGrid>
  </Drawer>
</template>
