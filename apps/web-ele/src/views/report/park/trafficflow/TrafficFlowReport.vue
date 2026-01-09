<script setup>
import { onMounted, ref } from 'vue';

import { Bottom, Top, TrendCharts } from '@element-plus/icons-vue';

import EntryFlowReport from './EntryFlow.vue';
import ExitFlowReport from './ExitFlow.vue';
import FlowDistributionReport from './FlowDist.vue';

// 当前激活的标签页
const activeTab = ref('entry');

// 标签页点击事件
const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.props.name);
  // 保存用户偏好
  localStorage.setItem('lastTrafficTab', tab.props.name);
};

// 初始化
onMounted(() => {
  // 恢复上次查看的标签页
  const lastTab = localStorage.getItem('lastTrafficTab');
  if (lastTab) {
    activeTab.value = lastTab;
  }
});
</script>

<template>
  <div class="traffic-flow-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">车流数据报表</h1>
      <p class="page-subtitle">漳州市智慧停车车流数据分析</p>
    </div>

    <!-- 标签页 -->
    <div class="report-tabs">
      <el-tabs
        v-model="activeTab"
        type="border-card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="入场车流报表" name="entry">
          <template #label>
            <span class="tab-label">
              <el-icon><Top /></el-icon>
              入场车流
            </span>
          </template>
          <EntryFlowReport v-if="activeTab === 'entry'" />
        </el-tab-pane>

        <el-tab-pane label="出场车流报表" name="exit">
          <template #label>
            <span class="tab-label">
              <el-icon><Bottom /></el-icon>
              出场车流
            </span>
          </template>
          <ExitFlowReport v-if="activeTab === 'exit'" />
        </el-tab-pane>

        <el-tab-pane label="车流分布报表" name="distribution">
          <template #label>
            <span class="tab-label">
              <el-icon><TrendCharts /></el-icon>
              车流分布
            </span>
          </template>
          <FlowDistributionReport v-if="activeTab === 'distribution'" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 全局提示 -->
    <div class="global-tips">
      <el-alert title="数据说明" type="info" :closable="false" show-icon>
        <p>1. 数据统计截止时间为昨日24:00</p>
        <p>2. 车流时段划分：早高峰(7-9点)、晚高峰(17-19点)、平峰(其他时段)</p>
        <p>3. 车型分类：小型车、中型车、大型车、新能源汽车</p>
        <p>4. 停留时长：1小时内、1-3小时、3-6小时、6小时以上</p>
      </el-alert>
    </div>
  </div>
</template>

<style scoped>
.traffic-flow-report {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.page-subtitle {
  margin-top: 8px;
  font-size: 14px;
  color: #909399;
}

.report-tabs {
  margin-bottom: 20px;
}

.tab-label {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.global-tips {
  margin-top: 20px;
}

.global-tips p {
  margin: 4px 0;
  font-size: 13px;
}

:deep(.el-tabs__content) {
  padding: 0;
  background: #fff;
}
</style>
