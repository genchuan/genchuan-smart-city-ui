<script setup>
import { reactive, onMounted, watch } from 'vue';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import Line from '#/components/stats/line.vue';
import { getAllSyncLogs, dataList, iotDeviceList, deviceTypeList, syncFreqList } from './table/data';

const props = defineProps({
  activeTab: { type: String, default: '全部' }
});

const state = reactive({
  cardList: [],
  pieData1: [],
  pieData2: [],
  barData: {},
  lineData: {}
});

// 根据tab更新图表数据
const updateChartData = () => {
  const rules = dataList();
  const allLogs = getAllSyncLogs();

  if (props.activeTab === '全部') {
    const totalRules = rules.length;
    const enabledRules = rules.filter(r => r.statusName === '启用').length;
    const avgSuccessRate = (rules.reduce((sum, r) => sum + r.sync_success_rate, 0) / totalRules).toFixed(1);
    const todaySyncCount = rules.reduce((sum, r) => sum + r.today_sync_count, 0);

    state.cardList = [
      { title: '总规则数', value: totalRules, color: '#13ce66' },
      { title: '启用规则数', value: enabledRules, color: '#4ECDC4' },
      { title: '平均同步成功率', value: avgSuccessRate + '%', color: '#FFC107' },
      { title: '今日同步次数', value: todaySyncCount, color: '#FF6B6B' }
    ];

    // 规则状态占比
    state.pieData1 = [
      { name: '启用', value: enabledRules },
      { name: '停用', value: totalRules - enabledRules }
    ];

    // 同步频率占比
    const freqMap = {};
    rules.forEach(r => { freqMap[r.sync_freq_name] = (freqMap[r.sync_freq_name] || 0) + 1; });
    state.pieData2 = Object.entries(freqMap).map(([name, value]) => ({ name, value }));

    // 各任务关联规则数量
    const taskMap = {};
    rules.forEach(r => { taskMap[r.task_name] = (taskMap[r.task_name] || 0) + 1; });
    state.barData = {
      xData: Object.keys(taskMap),
      series: [{ name: '规则数量', data: Object.values(taskMap) }]
    };

    // 近7天同步成功率趋势（模拟，实际可从日志计算）
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    state.lineData = {
      xData: last7Days,
      series: [{ name: '同步成功率', data: [98, 97, 96, 99, 95, 97, 98] }]
    };
  } else if (props.activeTab === '启用') {
    const enabledRules = rules.filter(r => r.statusName === '启用');
    const avgSuccessRate = (enabledRules.reduce((sum, r) => sum + r.sync_success_rate, 0) / enabledRules.length).toFixed(1);
    const highSuccessCount = enabledRules.filter(r => r.sync_success_rate >= 95).length;
    const todaySuccessCount = enabledRules.reduce((sum, r) => sum + r.today_sync_count, 0);

    state.cardList = [
      { title: '启用规则数', value: enabledRules.length, color: '#13ce66' },
      { title: '平均同步成功率', value: avgSuccessRate + '%', color: '#4ECDC4' },
      { title: '高成功率规则数(≥95%)', value: highSuccessCount, color: '#FFC107' },
      { title: '今日同步成功次数', value: todaySuccessCount, color: '#FF6B6B' }
    ];

    // 同步频率占比
    const freqMap = {};
    enabledRules.forEach(r => { freqMap[r.sync_freq_name] = (freqMap[r.sync_freq_name] || 0) + 1; });
    state.pieData1 = Object.entries(freqMap).map(([name, value]) => ({ name, value }));

    // 设备类型占比
    const deviceTypeMap = {};
    enabledRules.forEach(r => {
      const device = iotDeviceList.find(d => d.device_id === r.device_id);
      const typeName = deviceTypeList.find(t => t.id === device?.device_type)?.name || '其他';
      deviceTypeMap[typeName] = (deviceTypeMap[typeName] || 0) + 1;
    });
    state.pieData2 = Object.entries(deviceTypeMap).map(([name, value]) => ({ name, value }));

    // 各规则同步成功率对比
    state.barData = {
      xData: enabledRules.map(r => r.name.length > 6 ? r.name.slice(0,6)+'...' : r.name),
      series: [{ name: '同步成功率', data: enabledRules.map(r => r.sync_success_rate) }]
    };

    // 近7天同步成功次数趋势
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    // 模拟成功次数
    state.lineData = {
      xData: last7Days,
      series: [{ name: '成功次数', data: [20, 18, 22, 19, 21, 23, 20] }]
    };
  } else if (props.activeTab === '停用') {
    const disabledRules = rules.filter(r => r.statusName === '停用');
    const taskCount = disabledRules.length; // 简化
    const recentStopCount = disabledRules.filter(r => {
      const stopTime = new Date(r.stop_time);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return stopTime >= threeMonthsAgo;
    }).length;

    state.cardList = [
      { title: '停用规则数', value: disabledRules.length, color: '#F56C6C' },
      { title: '各任务关联数', value: taskCount, color: '#909399' },
      { title: '近3个月停用数', value: recentStopCount, color: '#E6A23C' }
    ];

    // 关联任务占比
    const taskMap = {};
    disabledRules.forEach(r => { taskMap[r.task_name] = (taskMap[r.task_name] || 0) + 1; });
    state.pieData1 = Object.entries(taskMap).map(([name, value]) => ({ name, value }));

    // 停用原因占比
    const reasonMap = {};
    disabledRules.forEach(r => { reasonMap[r.stop_reason || '未知'] = (reasonMap[r.stop_reason || '未知'] || 0) + 1; });
    state.pieData2 = Object.entries(reasonMap).map(([name, value]) => ({ name, value }));

    // 各季度停用数量对比
    const quarterMap = { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0 };
    disabledRules.forEach(r => {
      if (r.stop_time) {
        const month = new Date(r.stop_time).getMonth();
        if (month < 3) quarterMap.Q1++;
        else if (month < 6) quarterMap.Q2++;
        else if (month < 9) quarterMap.Q3++;
        else quarterMap.Q4++;
      }
    });
    state.barData = {
      xData: Object.keys(quarterMap),
      series: [{ name: '停用数量', data: Object.values(quarterMap) }]
    };
    state.lineData = { xData: [], series: [] };
  } else if (props.activeTab === '同步成功') {
    const successLogs = allLogs.filter(l => !l.fail_reason);
    const todayStr = new Date().toLocaleDateString();
    const todaySuccess = successLogs.filter(l => l.sync_time.startsWith(todayStr)).length;
    const indexCounts = {};
    successLogs.forEach(l => { indexCounts[l.index_name] = (indexCounts[l.index_name] || 0) + 1; });
    const avgDataValue = successLogs.filter(l => l.data_value).reduce((sum, l) => sum + parseFloat(l.data_value), 0) / successLogs.length || 0;

    state.cardList = [
      { title: '成功日志总数', value: successLogs.length, color: '#13ce66' },
      { title: '今日成功数', value: todaySuccess, color: '#4ECDC4' },
      { title: '各指标项成功数', value: Math.max(...Object.values(indexCounts)), color: '#FFC107' },
      { title: '平均数据值', value: avgDataValue.toFixed(1) + '%', color: '#FF6B6B' }
    ];

    // 关联规则占比
    const ruleMap = {};
    successLogs.forEach(l => { ruleMap[l.rule_name] = (ruleMap[l.rule_name] || 0) + 1; });
    state.pieData1 = Object.entries(ruleMap).map(([name, value]) => ({ name, value }));

    // 同步方式占比
    const typeMap = { '自动': 0, '手动': 0 };
    successLogs.forEach(l => { typeMap[l.sync_type]++; });
    state.pieData2 = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

    // 各指标项成功次数对比
    state.barData = {
      xData: Object.keys(indexCounts),
      series: [{ name: '成功次数', data: Object.values(indexCounts) }]
    };

    // 近7天成功次数趋势
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    const trend = last7Days.map(day => {
      return successLogs.filter(l => l.sync_time.includes(day)).length;
    });
    state.lineData = {
      xData: last7Days,
      series: [{ name: '成功次数', data: trend }]
    };
  } else if (props.activeTab === '同步失败') {
    const failLogs = allLogs.filter(l => l.fail_reason);
    const todayStr = new Date().toLocaleDateString();
    const todayFail = failLogs.filter(l => l.sync_time.startsWith(todayStr)).length;
    const reasonCounts = {};
    failLogs.forEach(l => { reasonCounts[l.fail_reason] = (reasonCounts[l.fail_reason] || 0) + 1; });
    const unretried = failLogs.filter(l => l.retry_count === 0).length;

    state.cardList = [
      { title: '失败日志总数', value: failLogs.length, color: '#F56C6C' },
      { title: '今日失败数', value: todayFail, color: '#E6A23C' },
      { title: '各失败原因数', value: Math.max(...Object.values(reasonCounts)), color: '#909399' },
      { title: '未重试失败数', value: unretried, color: '#FFC107' }
    ];

    // 失败原因占比
    state.pieData1 = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }));

    // 关联规则占比
    const ruleMap = {};
    failLogs.forEach(l => { ruleMap[l.rule_name] = (ruleMap[l.rule_name] || 0) + 1; });
    state.pieData2 = Object.entries(ruleMap).map(([name, value]) => ({ name, value }));

    // 各规则失败次数对比
    state.barData = {
      xData: Object.keys(ruleMap),
      series: [{ name: '失败次数', data: Object.values(ruleMap) }]
    };

    // 近7天失败次数趋势
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    const trend = last7Days.map(day => {
      return failLogs.filter(l => l.sync_time.includes(day)).length;
    });
    state.lineData = {
      xData: last7Days,
      series: [{ name: '失败次数', data: trend }]
    };
  }
};

onMounted(updateChartData);
watch(() => props.activeTab, updateChartData);
</script>

<template>
  <div class="park-chart-box park-template-chart">
    <!-- 卡片区域 -->
    <div class="chart-box-left" >
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <!-- 圆环图1 -->
    <Circle
      width="340px"
      height="330px"
      :title-text="activeTab === '全部' ? '规则状态占比' : (activeTab === '启用' ? '同步频率占比' : (activeTab === '停用' ? '关联任务占比' : (activeTab === '同步成功' ? '关联规则占比' : '失败原因占比')))"
      :data="state.pieData1"
    />
    <!-- 圆环图2 -->
    <Circle
      width="340px"
      height="330px"
      :title-text="activeTab === '全部' ? '同步频率占比' : (activeTab === '启用' ? '设备类型占比' : (activeTab === '停用' ? '停用原因占比' : (activeTab === '同步成功' ? '同步方式占比' : '关联规则占比')))"
      :data="state.pieData2"
    />
    <!-- 柱状图 -->
<!--    <Columnar-->
<!--      class="district-columnar"-->
<!--      height="330px"-->
<!--      :title="activeTab === '全部' ? '各任务关联规则数量对比' : (activeTab === '启用' ? '各规则同步成功率对比' : (activeTab === '停用' ? '各季度停用规则数量对比' : (activeTab === '同步成功' ? '各指标项同步成功次数对比' : '各规则同步失败次数对比')))"-->
<!--      :x-data="state.barData.xData"-->
<!--      :series-data="state.barData.series"-->
<!--    />-->
    <!-- 折线图（如无数据则不显示） -->
    <Line
      v-if="state.lineData.xData && state.lineData.xData.length"
      height="330px"
      :title="activeTab === '全部' ? '近7天同步成功率趋势' : (activeTab === '启用' ? '近7天同步成功次数趋势' : (activeTab === '停用' ? '' : (activeTab === '同步成功' ? '近7天同步成功次数趋势' : '近7天同步失败次数趋势')))"
      :x-data="state.lineData.xData"
      :series-data="state.lineData.series"
    />
  </div>
</template>

<style lang="scss">
.park-template-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }
  .template-columnar {
    min-width: 200px !important;
  }
}
</style>
