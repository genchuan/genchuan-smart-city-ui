<!-- survey/chart.vue -->
<script setup>
import { reactive, onMounted, watch } from 'vue';
import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
// import Line from '#/components/stats/line.vue';
import { getAllQuestionnaires, evalTaskList, issueTypeList, surveyStatusList } from './table/data';

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
  const allQuests = getAllQuestionnaires();

  if (props.activeTab === '全部') {
    const total = allQuests.length;
    const statusMap = {};
    allQuests.forEach(q => { statusMap[q.status] = (statusMap[q.status] || 0) + 1; });
    const totalFill = allQuests.reduce((sum, q) => sum + q.fill_count, 0);
    const avgFillRate = (allQuests.reduce((sum, q) => sum + q.fill_rate, 0) / total).toFixed(1);
    const notStarted = statusMap['not_started'] || 0;

    state.cardList = [
      { title: '总问卷数', value: total, color: '#13ce66' },
      { title: '各状态问卷数', value: `${statusMap['not_started'] || 0}/${statusMap['in_progress'] || 0}/${statusMap['finished'] || 0}`, color: '#4ECDC4' },
      { title: '累计填写人数', value: totalFill, color: '#FFC107' },
      { title: '平均填写率', value: avgFillRate + '%', color: '#FF6B6B' },
    ];

    // 问卷状态占比
    const statusNameMap = {};
    surveyStatusList.forEach(s => { statusNameMap[s.id] = s.name; });
    state.pieData1 = Object.entries(statusMap).map(([id, value]) => ({ name: statusNameMap[id] || id, value }));

    // 发放方式占比
    const issueMap = {};
    allQuests.forEach(q => {
      const issue = issueTypeList.find(i => i.id === q.issue_type_id);
      const issueName = issue?.name || '未知';
      issueMap[issueName] = (issueMap[issueName] || 0) + 1;
    });
    state.pieData2 = Object.entries(issueMap).map(([name, value]) => ({ name, value }));

    // 各问卷的填写人数对比（取前10）
    const topQuests = [...allQuests].sort((a,b) => b.fill_count - a.fill_count).slice(0,10);
    state.barData = {
      xData: topQuests.map(q => q.name.length > 8 ? q.name.slice(0,8)+'...' : q.name),
      series: [{ name: '填写人数', data: topQuests.map(q => q.fill_count) }]
    };

    // 近7天问卷填写人数新增趋势
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    // 模拟每天新增填写人数（需从日志统计，这里用随机数据）
    const trend = last7Days.map(() => Math.floor(Math.random() * 50) + 10);
    state.lineData = {
      xData: last7Days,
      series: [{ name: '新增填写人数', data: trend }]
    };
  } else if (props.activeTab === '未开始') {
    const notStarted = allQuests.filter(q => q.status === 'not_started');
    const total = notStarted.length;
    const taskMap = {};
    notStarted.forEach(q => {
      const task = evalTaskList.find(t => t.task_id === q.task_id);
      const taskName = task?.name || '未知';
      taskMap[taskName] = (taskMap[taskName] || 0) + 1;
    });
    const pendingStart = total;

    state.cardList = [
      { title: '未开始问卷总数', value: total, color: '#13ce66' },
      { title: '各任务关联数', value: Object.values(taskMap).join('/'), color: '#4ECDC4' },
      { title: '待启动问卷数', value: pendingStart, color: '#FFC107' }
    ];

    // 发放方式占比
    const issueMap = {};
    notStarted.forEach(q => {
      const issue = issueTypeList.find(i => i.id === q.issue_type_id);
      const issueName = issue?.name || '未知';
      issueMap[issueName] = (issueMap[issueName] || 0) + 1;
    });
    state.pieData1 = Object.entries(issueMap).map(([name, value]) => ({ name, value }));

    // 关联评价任务占比（第二圆环）
    state.pieData2 = Object.entries(taskMap).map(([name, value]) => ({ name, value }));

    // 各区域未开始问卷数量对比（模拟区域）
    const areaMap = { 'XX区': 3, '南岸区': 2, '北区': 1 };
    state.barData = {
      xData: Object.keys(areaMap),
      series: [{ name: '未开始问卷数', data: Object.values(areaMap) }]
    };
    state.lineData = { xData: [], series: [] };
  } else if (props.activeTab === '进行中') {
    const inProgress = allQuests.filter(q => q.status === 'in_progress');
    const total = inProgress.length;
    const totalFill = inProgress.reduce((sum, q) => sum + q.fill_count, 0);
    const avgFillRate = (inProgress.reduce((sum, q) => sum + q.fill_rate, 0) / total).toFixed(1);
    const highRateCount = inProgress.filter(q => q.fill_rate >= 80).length;

    state.cardList = [
      { title: '进行中问卷总数', value: total, color: '#13ce66' },
      { title: '累计填写人数', value: totalFill, color: '#4ECDC4' },
      { title: '平均填写率', value: avgFillRate + '%', color: '#FFC107' },
      { title: '高填写率问卷数(≥80%)', value: highRateCount, color: '#FF6B6B' }
    ];

    // 发放方式占比
    const issueMap = {};
    inProgress.forEach(q => {
      const issue = issueTypeList.find(i => i.id === q.issue_type_id);
      const issueName = issue?.name || '未知';
      issueMap[issueName] = (issueMap[issueName] || 0) + 1;
    });
    state.pieData1 = Object.entries(issueMap).map(([name, value]) => ({ name, value }));

    // 填写率区间占比
    const rateRanges = { '<30%': 0, '30%-60%': 0, '60%-80%': 0, '≥80%': 0 };
    inProgress.forEach(q => {
      if (q.fill_rate < 30) rateRanges['<30%']++;
      else if (q.fill_rate < 60) rateRanges['30%-60%']++;
      else if (q.fill_rate < 80) rateRanges['60%-80%']++;
      else rateRanges['≥80%']++;
    });
    state.pieData2 = Object.entries(rateRanges).map(([name, value]) => ({ name, value }));

    // 各问卷的填写人数与填写率对比（取前10）
    const topQuests = [...inProgress].sort((a,b) => b.fill_count - a.fill_count).slice(0,10);
    state.barData = {
      xData: topQuests.map(q => q.name.length > 8 ? q.name.slice(0,8)+'...' : q.name),
      series: [
        { name: '填写人数', data: topQuests.map(q => q.fill_count), type: 'bar' },
        { name: '填写率(%)', data: topQuests.map(q => q.fill_rate), type: 'line', yAxisIndex: 1 }
      ]
    };

    // 近7天各问卷的填写人数新增趋势（模拟）
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth()+1}-${d.getDate()}`;
    }).reverse();
    const trend = last7Days.map(() => Math.floor(Math.random() * 80) + 20);
    state.lineData = {
      xData: last7Days,
      series: [{ name: '新增填写人数', data: trend }]
    };
  } else if (props.activeTab === '已结束') {
    const finished = allQuests.filter(q => q.status === 'finished');
    const total = finished.length;
    const totalFill = finished.reduce((sum, q) => sum + q.fill_count, 0);
    const avgFinalFillRate = (finished.reduce((sum, q) => sum + q.final_fill_rate, 0) / total).toFixed(1);
    const avgFinalScore = (finished.reduce((sum, q) => sum + q.final_average_score, 0) / total).toFixed(1);
    const relatedCount = finished.filter(q => q.data_relation_status === 'related').length;

    state.cardList = [
      { title: '已结束问卷总数', value: total, color: '#13ce66' },
      { title: '累计填写人数', value: totalFill, color: '#4ECDC4' },
      { title: '平均最终填写率', value: avgFinalFillRate + '%', color: '#FFC107' },
      { title: '平均最终平均分', value: avgFinalScore, color: '#FF6B6B' },
      { title: '已关联评价数', value: relatedCount, color: '#909399' }
    ];

    // 发放方式占比
    const issueMap = {};
    finished.forEach(q => {
      const issue = issueTypeList.find(i => i.id === q.issue_type_id);
      const issueName = issue?.name || '未知';
      issueMap[issueName] = (issueMap[issueName] || 0) + 1;
    });
    state.pieData1 = Object.entries(issueMap).map(([name, value]) => ({ name, value }));

    // 关联评价任务占比
    const taskMap = {};
    finished.forEach(q => {
      const task = evalTaskList.find(t => t.task_id === q.task_id);
      const taskName = task?.name || '未知';
      taskMap[taskName] = (taskMap[taskName] || 0) + 1;
    });
    state.pieData2 = Object.entries(taskMap).map(([name, value]) => ({ name, value }));

    // 各问卷的最终平均分对比
    const topQuests = [...finished].sort((a,b) => b.final_average_score - a.final_average_score).slice(0,10);
    state.barData = {
      xData: topQuests.map(q => q.name.length > 8 ? q.name.slice(0,8)+'...' : q.name),
      series: [{ name: '最终平均分', data: topQuests.map(q => q.final_average_score) }]
    };

    // 近6个月已结束问卷的填写率与平均分趋势
    const months = ['2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03'];
    const fillRateTrend = [75, 78, 82, 85, 80, 88];
    const scoreTrend = [7.5, 7.8, 8.0, 8.2, 8.1, 8.5];
    state.lineData = {
      xData: months,
      series: [
        { name: '平均填写率(%)', data: fillRateTrend },
        { name: '平均分', data: scoreTrend }
      ]
    };
  }
};

onMounted(updateChartData);
watch(() => props.activeTab, updateChartData);
</script>

<template>
  <div class="park-chart-box park-template-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Circle
      v-if="state.pieData1.length"
      width="340px"
      height="330px"
      :title-text="activeTab === '全部' ? '问卷状态占比' : (activeTab === '未开始' ? '发放方式占比' : (activeTab === '进行中' ? '发放方式占比' : (activeTab === '已结束' ? '发放方式占比' : '')))"
      :data="state.pieData1"
    />
    <Circle
      v-if="state.pieData2.length"
      width="340px"
      height="330px"
      :title-text="activeTab === '全部' ? '发放方式占比' : (activeTab === '未开始' ? '关联评价任务占比' : (activeTab === '进行中' ? '填写率区间占比' : (activeTab === '已结束' ? '关联评价任务占比' : '')))"
      :data="state.pieData2"
    />
    <Columnar
      v-if="state.barData.xData && state.barData.xData.length"
      class="district-columnar"
      height="330px"
      :title="activeTab === '全部' ? '各问卷填写人数对比' : (activeTab === '未开始' ? '各区域未开始问卷数量对比' : (activeTab === '进行中' ? '各问卷填写人数与填写率对比' : (activeTab === '已结束' ? '各问卷最终平均分对比' : '')))"
      :x-data="state.barData.xData"
      :series-data="state.barData.series"
    />
    <Line
      v-if="state.lineData.xData && state.lineData.xData.length"
      height="330px"
      :title="activeTab === '全部' ? '近7天问卷填写人数新增趋势' : (activeTab === '进行中' ? '近7天填写人数新增趋势' : (activeTab === '已结束' ? '近6个月填写率与平均分趋势' : ''))"
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
