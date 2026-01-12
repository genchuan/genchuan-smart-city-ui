<script setup>
import { onMounted, ref } from 'vue';

import { Calendar, List, Money } from '@element-plus/icons-vue';

import DailyIncomeReport from './DailyIncome.vue';
import IncomeDetailReport from './IncomeDetail.vue';
import MonthlyIncomeReport from './MonthlyIncome.vue';

// 当前激活的标签页
const activeTab = ref('daily');

// 标签页点击事件
const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.props.name);
  // 保存用户偏好
  localStorage.setItem('lastIncomeTab', tab.props.name);
};

// 初始化
onMounted(() => {
  // 恢复上次查看的标签页
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
  min-height: 100vh;
  padding: 10px;
  background-color: #f5f7fa;
}

.report-tabs {
  margin-bottom: 10px;
}

.tab-label {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.global-tips {
  margin-top: 10px;
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
