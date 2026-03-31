<!-- platform-report/chart.vue -->
<script setup>
import { reactive, onMounted, watch } from 'vue';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
// import Line from '#/components/stats/line.vue';
import { getAllPlatformReports, evalTaskList, userList, reportStatusList } from './table/data';

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
  const allReports = getAllPlatformReports();

  if (props.activeTab === '全部') {
    const totalBatches = allReports.length;
    const statusMap = {};
    allReports.forEach(r => { statusMap[r.status] = (statusMap[r.status] || 0) + 1; });
    const totalDataRows = allReports.reduce((sum, r) => sum + r.data_count, 0);
    const avgPassRate = (allReports.reduce((sum, r) => sum + (r.success_count / r.data_count) * 100, 0) / totalBatches).toFixed(1);

    state.cardList = [
      { title: '总上报批次', value: totalBatches, color: '#13ce66' },
      { title: '各状态批次', value: Object.values(statusMap).join('/'), color: '#4ECDC4' },
      { title: '累计上报数据条数', value: totalDataRows, color: '#FFC107' },
      { title: '平均校验通过率', value: avgPassRate + '%', color: '#FF6B6B' }
    ];

    // 数据状态占比
    const statusNameMap = {};
    reportStatusList.forEach(s => { statusNameMap[s.id] = s.name; });
    state.pieData1 = Object.entries(statusMap).map(([id, value]) => ({ name: statusNameMap[id] || id, value }));

    // 关联任务占比
    const taskMap = {};
    allReports.forEach(r => {
      const task = evalTaskList.find(t => t.task_id === r.task_id);
      taskMap[task?.name || '未知'] = (taskMap[task?.name || '未知'] || 0) + 1;
    });
    state.pieData2 = Object.entries(taskMap).map(([name, value]) => ({ name, value }));

    // 各任务上报批次数量对比
    const taskBatchMap = {};
    allReports.forEach(r => {
      const task = evalTaskList.find(t => t.task_id === r.task_id);
      const taskName = task?.name || '未知';
      taskBatchMap[taskName] = (taskBatchMap[taskName] || 0) + 1;
    });
    state.barData = {
      xData: Object.keys(taskBatchMap),
      series: [{ name: '上报批次数量', data: Object.values(taskBatchMap) }]
    };

    // 近7天上报批次趋势
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    const trend = last7Days.map(day => {
      return allReports.filter(r => r.report_time?.includes(day)).length;
    });
    state.lineData = {
      xData: last7Days,
      series: [{ name: '上报批次', data: trend }]
    };
  } else if (props.activeTab === '未校验') {
    const unverified = allReports.filter(r => r.status === 'unverified');
    const totalUnverified = unverified.length;
    const taskUnverified = {};
    unverified.forEach(r => {
      const task = evalTaskList.find(t => t.task_id === r.task_id);
      const taskName = task?.name || '未知';
      taskUnverified[taskName] = (taskUnverified[taskName] || 0) + 1;
    });
    const todayAdd = unverified.filter(r => {
      const today = new Date().toLocaleDateString();
      return r.report_time?.startsWith(today);
    }).length;
    const pendingDataRows = unverified.reduce((sum, r) => sum + r.data_count, 0);

    state.cardList = [
      { title: '未校验上报记录总数', value: totalUnverified, color: '#13ce66' },
      { title: '各任务未校验数', value: Object.values(taskUnverified).join('/'), color: '#4ECDC4' },
      { title: '今日新增未校验数', value: todayAdd, color: '#FFC107' },
      { title: '待校验数据总条数', value: pendingDataRows, color: '#FF6B6B' }
    ];

    // 柱状图：不同评价任务的未校验上报记录数量对比
    state.barData = {
      xData: Object.keys(taskUnverified),
      series: [{ name: '未校验记录数', data: Object.values(taskUnverified) }]
    };

    // 折线图：近7天未校验上报记录新增趋势
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    const trend = last7Days.map(day => {
      return unverified.filter(r => r.report_time?.includes(day)).length;
    });
    state.lineData = {
      xData: last7Days,
      series: [{ name: '未校验记录数', data: trend }]
    };
    state.pieData1 = [];
    state.pieData2 = [];
  } else if (props.activeTab === '已校验') {
    const verified = allReports.filter(r => r.status === 'verified');
    const totalVerified = verified.length;
    const taskVerified = {};
    verified.forEach(r => {
      const task = evalTaskList.find(t => t.task_id === r.task_id);
      const taskName = task?.name || '未知';
      taskVerified[taskName] = (taskVerified[taskName] || 0) + 1;
    });
    const passRate = (verified.reduce((sum, r) => sum + (r.success_count / r.data_count) * 100, 0) / totalVerified).toFixed(1);
    const totalStoredRows = verified.reduce((sum, r) => sum + r.success_count, 0);

    state.cardList = [
      { title: '已校验上报记录总数', value: totalVerified, color: '#13ce66' },
      { title: '各任务已校验数', value: Object.values(taskVerified).join('/'), color: '#4ECDC4' },
      { title: '校验通过率', value: passRate + '%', color: '#FFC107' },
      { title: '已入库数据总条数', value: totalStoredRows, color: '#FF6B6B' }
    ];

    // 圆环图：各评价任务的已校验上报记录占比
    state.pieData1 = Object.entries(taskVerified).map(([name, value]) => ({ name, value }));

    // 柱状图：不同上报人的已校验记录数量对比
    const reporterMap = {};
    verified.forEach(r => {
      const user = userList.find(u => u.id === r.report_by);
      const userName = user?.name || '未知';
      reporterMap[userName] = (reporterMap[userName] || 0) + 1;
    });
    state.barData = {
      xData: Object.keys(reporterMap),
      series: [{ name: '已校验记录数', data: Object.values(reporterMap) }]
    };
    state.pieData2 = [];
    state.lineData = { xData: [], series: [] };
  } else if (props.activeTab === '校验失败') {
    const failed = allReports.filter(r => r.status === 'failed');
    const totalFailed = failed.length;
    const taskFailed = {};
    failed.forEach(r => {
      const task = evalTaskList.find(t => t.task_id === r.task_id);
      const taskName = task?.name || '未知';
      taskFailed[taskName] = (taskFailed[taskName] || 0) + 1;
    });
    const reasonMap = {};
    failed.forEach(r => {
      const reason = r.fail_reason?.substring(0, 20) || '未知';
      reasonMap[reason] = (reasonMap[reason] || 0) + 1;
    });
    const notReupload = failed.filter(r => r.reupload_count === 0).length;

    state.cardList = [
      { title: '校验失败记录总数', value: totalFailed, color: '#F56C6C' },
      { title: '各任务失败数', value: Object.values(taskFailed).join('/'), color: '#E6A23C' },
      { title: '主要失败原因数', value: Math.max(...Object.values(reasonMap), 0), color: '#909399' },
      { title: '未重新上传数', value: notReupload, color: '#FFC107' }
    ];

    // 圆环图：校验失败原因占比
    state.pieData1 = Object.entries(reasonMap).map(([name, value]) => ({ name, value }));

    // 柱状图：不同失败原因的记录数量对比
    state.barData = {
      xData: Object.keys(reasonMap),
      series: [{ name: '失败记录数', data: Object.values(reasonMap) }]
    };

    // 圆环图：各评价任务的失败记录占比（第二圆环）
    state.pieData2 = Object.entries(taskFailed).map(([name, value]) => ({ name, value }));

    state.lineData = { xData: [], series: [] };
  }
};

onMounted(updateChartData);
watch(() => props.activeTab, updateChartData);
</script>

<template>
  <div class="park-chart-box park-template-chart">
    <!-- 卡片区域 -->
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <!-- 圆环图1 -->
    <Circle
      v-if="state.pieData1.length"
      width="340px"
      height="330px"
      :title-text="activeTab === '全部' ? '数据状态占比' : (activeTab === '已校验' ? '各任务已校验记录占比' : (activeTab === '校验失败' ? '校验失败原因占比' : ''))"
      :data="state.pieData1"
    />
    <!-- 圆环图2 -->
    <Circle
      v-if="state.pieData2.length"
      width="340px"
      height="330px"
      :title-text="activeTab === '全部' ? '关联任务占比' : (activeTab === '校验失败' ? '各任务失败记录占比' : '')"
      :data="state.pieData2"
    />
    <!-- 柱状图 -->
    <Columnar
      v-if="state.barData.xData && state.barData.xData.length"
      class="district-columnar"
      height="330px"
      :title="activeTab === '全部' ? '各任务上报批次数量对比' : (activeTab === '未校验' ? '不同任务未校验记录数量对比' : (activeTab === '已校验' ? '不同上报人已校验记录数量对比' : (activeTab === '校验失败' ? '不同失败原因记录数量对比' : '')))"
      :x-data="state.barData.xData"
      :series-data="state.barData.series"
    />
    <!-- 折线图 -->
    <Line
      v-if="state.lineData.xData && state.lineData.xData.length"
      height="330px"
      :title="activeTab === '全部' ? '近7天上报批次趋势' : (activeTab === '未校验' ? '近7天未校验记录新增趋势' : '')"
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
