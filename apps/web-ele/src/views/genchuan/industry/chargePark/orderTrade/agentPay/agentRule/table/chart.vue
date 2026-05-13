<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElTag } from 'element-plus';

import { getAgentPayRuleChart, getAgentPayRulePage } from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import { useVbenDrawer } from '@vben/common-ui';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';

const statusMap = {
  enabled: { label: '已生效', type: 'success' },
  disabled: { label: '已禁用', type: 'info' },
  pending: { label: '待生效', type: 'warning' },
};

const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

const agentTypeMap = {
  merchant: '商户代付',
  enterprise: '企业代付',
  public: '公益代付',
};

const getAgentTypeLabel = (agentType) => {
  return agentTypeMap[agentType] || agentType;
};

const getAgentTypeType = (agentType) => {
  const typeMap = {
    merchant: 'primary',
    enterprise: 'success',
    public: 'warning',
  };
  return typeMap[agentType] || 'default';
};

const state = reactive({
  cardList: [
    { title: '已生效数量', value: 0, color: '#FF6B6B', status: 'enabled' },
    { title: '今日订单数', value: 0, color: '#4ECDC4', status: null },
  ],
  useDistData: [],
});

const selectedAgentType = ref(null);
const selectedStatus = ref(null);

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '代付规则列表';
    if (selectedAgentType.value) {
      title = `${getAgentTypeLabel(selectedAgentType.value)} ${title}`;
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

  if (selectedAgentType.value) {
    params.agentType = selectedAgentType.value;
  }

  if (selectedStatus.value) {
    params.status = selectedStatus.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getAgentPayRulePage(params);
    drawerDataObj.total = res.total;
    drawerDataObj.list = res.list.map((v) => {
      return {
        ...v,
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return drawerDataObj;
  } catch (error) {
    console.error('获取代付规则列表失败:', error);
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

const handleCardClick = (status) => {
  selectedStatus.value = status;
  selectedAgentType.value = null;
  drawerGridApi.query();
  drawerApi.open();
};

const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    const agentTypeKey = Object.keys(agentTypeMap).find(key => agentTypeMap[key] === params.name);
    if (agentTypeKey) {
      selectedAgentType.value = agentTypeKey;
    }
    selectedStatus.value = null;
    drawerGridApi.query();
    drawerApi.open();
  }
};

const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'name', title: '规则名称', width: 180 },
      { field: 'merchantName', title: '商户名称', width: 150 },
      { field: 'agentType', title: '代付类型', width: 120,
        slots: { default: 'agentType' }
      },
      { field: 'singleLimit', title: '单次限额', width: 120 },
      { field: 'dayLimit', title: '日累计限额', width: 120 },
      { field: 'scene', title: '适用场景', width: 100 },
      { field: 'status', title: '状态', width: 100,
        slots: { default: 'status' }
      },
      { field: 'useCount', title: '使用次数', width: 100 },
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

const fetchOrderChartData = async () => {
  try {
    const res = await getAgentPayRuleChart();
    state.cardList[0].value = res.cardData?.enabledCount || res.enabledCount || 0;
    state.cardList[1].value = res.cardData?.todayOrderCount || res.todayOrderCount || 0;
    state.useDistData =
      res.useDistData && res.useDistData.length > 0
        ? res.useDistData
        : [
            { agent_type: 'merchant', count: 5 },
            { agent_type: 'public', count: 3 },
            { agent_type: 'enterprise', count: 2 },
          ];
    updateChart();
  } catch (error) {
    console.error('获取代付规则图表数据失败:', error);
    state.cardList[0].value = 7;
    state.cardList[1].value = 0;
    state.useDistData = [
      { agent_type: 'merchant', count: 5 },
      { agent_type: 'public', count: 3 },
      { agent_type: 'enterprise', count: 2 },
    ];
    updateChart();
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '代付类型分布',
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
      data: state.useDistData.map((item) => getAgentTypeLabel(item.agent_type)),
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
        data: state.useDistData.map((item) => item.count),
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#1E5AA8' },
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
      data: state.useDistData.map((item) => getAgentTypeLabel(item.agent_type)),
    },
    series: [
      {
        data: state.useDistData.map((item) => item.count),
      },
    ],
  });
};

onMounted(() => {
  fetchOrderChartData().then(() => {
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
        @click="handleCardClick(item.status)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #agentType="{ row }">
        <el-tag :type="getAgentTypeType(row.agentType)">
          {{ getAgentTypeLabel(row.agentType) }}
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
