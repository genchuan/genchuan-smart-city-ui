<!-- IncomeReport.vue -->
<script setup>
import { onMounted, ref } from 'vue';

import { Calendar, List, Money } from '@element-plus/icons-vue';

import DailyIncomeReport from './DailyIncome.vue';
import IncomeDetailReport from './IncomeDetail.vue';
import MonthlyIncomeReport from './MonthlyIncome.vue';

const activeTab = ref('daily');

const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.props.name);
  localStorage.setItem('lastIncomeTab', tab.props.name);
};

onMounted(() => {
  const lastTab = localStorage.getItem('lastIncomeTab');
  if (lastTab) {
    activeTab.value = lastTab;
  }
});
</script>

<template>
  <div class="income-report">
    <!-- 标签页 -->
    <div class="report-tabs">
      <el-tabs
        v-model="activeTab"
        type="border-card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="日收入报表" name="daily">
          <template #label>
            <span class="tab-label">
              <el-icon><Calendar /></el-icon>
              日收入
            </span>
          </template>
          <DailyIncomeReport v-if="activeTab === 'daily'" />
        </el-tab-pane>

        <el-tab-pane label="月收入报表" name="monthly">
          <template #label>
            <span class="tab-label">
              <el-icon><Money /></el-icon>
              月收入
            </span>
          </template>
          <MonthlyIncomeReport v-if="activeTab === 'monthly'" />
        </el-tab-pane>

        <el-tab-pane label="收入明细报表" name="detail">
          <template #label>
            <span class="tab-label">
              <el-icon><List /></el-icon>
              收入明细
            </span>
          </template>
          <IncomeDetailReport v-if="activeTab === 'detail'" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 全局提示 -->
    <div class="global-tips">
      <el-alert title="数据说明" type="info" :closable="false" show-icon>
        <p>1. 日收入报表：统计每日收入数据，数据更新截止前一日24:00</p>
        <p>2. 月收入报表：每月1日自动生成上月报表，支持手动生成历史月份报表</p>
        <p>3. 收入明细报表：包含每笔订单的完整信息，支持多条件筛选</p>
        <p>4. 异常标注：当日/当月收入与近7日/近3月均值偏差超30%时自动标注</p>
      </el-alert>
    </div>
  </div>
</template>

<style scoped>
.income-report {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 20px);
  padding: 10px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.report-tabs {
  flex: 1;
  margin-bottom: 10px;
  overflow: hidden;
  min-height: 600px;
}

.tab-label {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.global-tips {
  flex-shrink: 0;
  margin-top: 10px;
}

.global-tips p {
  margin: 4px 0;
  font-size: 13px;
}

:deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.el-tabs__content) {
  flex: 1;
  padding: 0 !important;
  overflow: hidden;
  background: #fff;
}

:deep(.el-tab-pane) {
  height: 100%;
  overflow: auto;
}

:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 0 !important;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}
</style>
