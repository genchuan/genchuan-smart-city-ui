<template>
  <div class="iot-home-page">
    <!-- 第一行：统计卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card" :loading="loading">
          <div class="stats-card-content">
            <div class="stats-card-icon text-blue-500">
              <el-icon><Menu /></el-icon>
            </div>
            <div class="stats-card-info">
              <div class="stats-card-title">分类数量</div>
              <div class="stats-card-value">{{ statsData.productCategoryCount }}</div>
              <div class="stats-card-today">
                今日新增：{{ statsData.productCategoryTodayCount }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card" :loading="loading">
          <div class="stats-card-content">
            <div class="stats-card-icon text-orange-500">
              <el-icon><Box /></el-icon>
            </div>
            <div class="stats-card-info">
              <div class="stats-card-title">产品数量</div>
              <div class="stats-card-value">{{ statsData.productCount }}</div>
              <div class="stats-card-today">
                今日新增：{{ statsData.productTodayCount }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card" :loading="loading">
          <div class="stats-card-content">
            <div class="stats-card-icon text-purple-500">
              <el-icon><Cpu /></el-icon>
            </div>
            <div class="stats-card-info">
              <div class="stats-card-title">设备数量</div>
              <div class="stats-card-value">{{ statsData.deviceCount }}</div>
              <div class="stats-card-today">
                今日新增：{{ statsData.deviceTodayCount }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card" :loading="loading">
          <div class="stats-card-content">
            <div class="stats-card-icon text-teal-500">
              <el-icon><Message /></el-icon>
            </div>
            <div class="stats-card-info">
              <div class="stats-card-title">设备消息数</div>
              <div class="stats-card-value">{{ statsData.deviceMessageCount }}</div>
              <div class="stats-card-today">
                今日新增：{{ statsData.deviceMessageTodayCount }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行：图表 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="12">
        <DeviceCountCard :stats-data="statsData" :loading="loading" />
      </el-col>
      <el-col :span="12">
        <DeviceStateCountCard :stats-data="statsData" :loading="loading" />
      </el-col>
    </el-row>

    <!-- 第三行：消息统计 -->
    <el-row :gutter="16">
      <el-col :span="24">
        <MessageTrendCard />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElRow, ElCol, ElCard } from 'element-plus'
import { Menu, Box, Cpu, Message } from '@element-plus/icons-vue'
import type { StatsData } from './data'
import { getStatisticsSummary } from '#/api/iot/statistics'
import { defaultStatsData } from './data'
import DeviceCountCard from './modules/device-count-card.vue'
import DeviceStateCountCard from './modules/device-state-count-card.vue'
import MessageTrendCard from './modules/message-trend-card.vue'

defineOptions({ name: 'IoTHome' })

const loading = ref(true)
const statsData = ref<StatsData>(defaultStatsData)

/** 加载统计数据 */
async function loadStatisticsData(): Promise<StatsData> {
  return await getStatisticsSummary()
}

/** 加载数据 */
async function loadData() {
  loading.value = true
  try {
    statsData.value = await loadStatisticsData()
  } finally {
    loading.value = false
  }
}

/** 组件挂载时加载数据 */
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.iot-home-page {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.stats-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stats-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-card-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stats-card-info {
  flex: 1;
}

.stats-card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stats-card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stats-card-today {
  font-size: 12px;
  color: #999;
}

.text-blue-500 {
  color: #409eff;
}

.text-orange-500 {
  color: #e6a23c;
}

.text-purple-500 {
  color: #909399;
}

.text-teal-500 {
  color: #67c23a;
}
</style>
