<script setup>
import { onMounted, ref } from 'vue';

import { Calendar, DataLine, TrendCharts } from '@element-plus/icons-vue';

import DailyReport from './DailyReport.vue';
import MonthlyReport from './MonthlyReport.vue';
import TrendReport from './TrendReport.vue';

// 当前激活的标签页
const activeTab = ref('daily');

// 标签页点击事件
const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.props.name);
  // 可以在这里保存用户偏好
  localStorage.setItem('lastReportTab', tab.props.name);
};

// 初始化
onMounted(() => {
  // 恢复上次查看的标签页
  const lastTab = localStorage.getItem('lastReportTab');
  if (lastTab) {
    activeTab.value = lastTab;
  }
});
</script>

<template>
  <div class="operational-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">运营数据报表</h1>
      <p class="page-subtitle">漳州市智慧停车运营数据分析</p>
    </div>

    <!-- 标签页 -->
    <div class="report-tabs">
      <el-tabs
        v-model="activeTab"
        type="border-card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="日报表" name="daily">
          <template #label>
            <span class="tab-label">
              <el-icon><Calendar /></el-icon>
              日报表
            </span>
          </template>
          <DailyReport v-if="activeTab === 'daily'" />
        </el-tab-pane>

        <el-tab-pane label="月报表" name="monthly">
          <template #label>
            <span class="tab-label">
              <el-icon><DataLine /></el-icon>
              月报表
            </span>
          </template>
          <MonthlyReport v-if="activeTab === 'monthly'" />
        </el-tab-pane>

        <el-tab-pane label="趋势报表" name="trend">
          <template #label>
            <span class="tab-label">
              <el-icon><TrendCharts /></el-icon>
              趋势报表
            </span>
          </template>
          <TrendReport v-if="activeTab === 'trend'" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 全局提示 -->
    <div class="global-tips">
      <el-alert title="数据说明" type="info" :closable="false" show-icon>
        <p>1. 数据统计截止时间为昨日24:00</p>
        <p>2. 异常标注标准：与近7日均值偏差超过30%</p>
        <p>3. 所有金额单位为元（¥）</p>
      </el-alert>
    </div>
  </div>
</template>

<style scoped>
.operational-report {
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
