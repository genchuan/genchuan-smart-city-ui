<template>
  <div class="abnormal-report">
    <!-- 标签页 -->
    <div class="report-tabs">
      <el-tabs
        v-model="activeTab"
        type="border-card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="逃费数据报表" name="escape">
          <template #label>
            <span class="tab-label">
              <el-icon><Money /></el-icon>
              逃费数据
            </span>
          </template>
          <EscapeData v-if="activeTab === 'escape'" />
        </el-tab-pane>

        <el-tab-pane label="设备异常报表" name="device">
          <template #label>
            <span class="tab-label">
              <el-icon><Tools /></el-icon>
              设备异常
            </span>
          </template>
          <DeviceAbnormal v-if="activeTab === 'device'" />
        </el-tab-pane>

        <el-tab-pane label="收费异常报表" name="charge">
          <template #label>
            <span class="tab-label">
              <el-icon><Warning /></el-icon>
              收费异常
            </span>
          </template>
          <ChargeAbnormal v-if="activeTab === 'charge'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Money, Tools, Warning } from '@element-plus/icons-vue';
import EscapeData from './EscapeData.vue';
import DeviceAbnormal from './DeviceAbnormal.vue';
import ChargeAbnormal from './ChargeAbnormal.vue';

const activeTab = ref('escape');

const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.props.name);
  localStorage.setItem('lastAbnormalTab', tab.props.name);
};

onMounted(() => {
  const lastTab = localStorage.getItem('lastAbnormalTab');
  if (lastTab) {
    activeTab.value = lastTab;
  }
});
</script>

<style scoped>
.abnormal-report {
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
