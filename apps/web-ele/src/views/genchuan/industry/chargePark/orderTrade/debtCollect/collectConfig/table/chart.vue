<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';
import { ElMessage, ElTag } from 'element-plus';

import { getDebtRecordCollectConfigChart, getDebtRecordCollectConfigPage } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import { useGridColumns } from './data';

// 追缴方式映射
const methodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

// 状态映射
const statusMap = {
  inactive: { label: '未生效', type: 'info' },
  active: { label: '已生效', type: 'success' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 获取追缴方式标签
const getMethodLabel = (method) => {
  return methodMap[method]?.label || method;
};

// 获取追缴方式类型
const getMethodType = (method) => {
  return methodMap[method]?.type || 'default';
};

const state = reactive({
  cardList: [
    { title: '启用配置数', value: 0, color: '#13ce66' },
    { title: '追缴触发率', value: 0, color: '#4ECDC4', suffix: '%' },
  ],
  typeData: [],
});

// 当前选中的追缴方式（用于柱状图点击后筛选）
const selectedMethod = ref(null);

// 抽屉配置
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: '75%',
  title: computed(() => {
    let title = '';
    if (selectedMethod.value) {
      title = `${methodMap[selectedMethod.value]?.label || selectedMethod.value} `;
    }
    title += '追缴配置列表';
    return title;
  }),
  class: 'genchuan-detail-drawer',
  onCancel() {
    drawerApi.close();
  },
});

// 抽屉表格数据对象
const drawerDataObj = reactive({
  total: 0,
  list: [],
  loading: false,
});

// 抽屉表格数据获取
const getDrawerTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  };

  // 如果选中了追缴方式，添加追缴方式参数
  if (selectedMethod.value) {
    params.collectMethod = selectedMethod.value;
  }

  try {
    drawerDataObj.loading = true;
    const res = await getDebtRecordCollectConfigPage(params);
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
    console.error('获取追缴配置列表失败:', error);
    ElMessage.error('获取追缴配置列表失败');
    return drawerDataObj;
  } finally {
    drawerDataObj.loading = false;
  }
};

// 点击卡片事件
const handleCardClick = () => {
  // 查询全部
  drawerGridApi.query();
  drawerApi.open();
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  console.log('柱状图点击事件触发:', params);
  if (params && params.name) {
    // 根据中文追缴方式名称找到对应的英文值
    const methodKey = Object.keys(methodMap).find(key => methodMap[key].label === params.name);
    if (methodKey) {
      selectedMethod.value = methodKey;
      console.log('选中追缴方式:', selectedMethod.value);
    } else {
      selectedMethod.value = params.name;
      console.log('选中追缴方式 (未映射):', selectedMethod.value);
    }
    drawerGridApi.query();
    drawerApi.open();
  }
};

// 抽屉表格配置 - 删除最后一个操作列
const [DrawerGrid, drawerGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns().slice(0, -1),
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

// 获取追缴配置图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordCollectConfigChart();
    state.cardList[0].value = res.cardData?.enableConfigCount || res.enableConfigCount || 0;
    state.cardList[1].value = res.cardData?.collectTriggerRate || res.collectTriggerRate || 0;
    // 如果 typeData 为空，使用假数据
    state.typeData =
      res.typeData && Array.isArray(res.typeData) && res.typeData.length > 0
        ? res.typeData
        : [
            { method: 'sms', count: 6 },
            { method: 'notify', count: 5 },
            { method: 'phone', count: 4 },
          ];
    // 更新柱状图
    updateBarChart();
  } catch (error) {
    console.error('获取追缴配置图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 11;
    state.cardList[1].value = 73.3;
    state.typeData = [
      { method: 'sms', count: 6 },
      { method: 'notify', count: 5 },
      { method: 'phone', count: 4 },
    ];
    // 更新柱状图
    updateBarChart();
  }
};

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return;

  barChartInstance = echarts.init(barChartRef.value);

  const option = {
    title: {
      text: '追缴方式分布',
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
      data: state.typeData.map((item) => methodMap[item.method]?.label || item.method),
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
        name: '配置数',
        type: 'bar',
        barWidth: '40%',
        data: state.typeData.map((item) => item.count),
        itemStyle: {
          color: (params) => {
            const method = state.typeData[params.dataIndex]?.method;
            return methodMap[method]?.color || '#4A90E2';
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  barChartInstance.setOption(option);

  // 添加点击事件监听
  barChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

// 更新柱状图
const updateBarChart = () => {
  if (!barChartInstance) return;

  barChartInstance.setOption({
    xAxis: {
      data: state.typeData.map((item) => methodMap[item.method]?.label || item.method),
    },
    series: [
      {
        data: state.typeData.map((item) => item.count),
      },
    ],
  });
};

const barChartRef = ref(null);
let barChartInstance = null;

onMounted(() => {
  fetchOrderChartData().then(() => {
    initBarChart();
  });

  window.addEventListener('resize', () => {
    barChartInstance?.resize();
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
        @click="handleCardClick"
      />
    </div>
    <div ref="barChartRef" class="simple-bar-chart"></div>
  </div>

  <Drawer>
    <DrawerGrid>
      <template #status="{ row }">
        <ElTag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <template #collectMethod="{ row }">
        <ElTag :type="getMethodType(row.collectMethod)">
          {{ getMethodLabel(row.collectMethod) }}
        </ElTag>
      </template>
      <template #configNo="{ row }">
        {{ row.configNo }}
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
