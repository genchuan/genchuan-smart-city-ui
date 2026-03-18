<script setup>
import { computed, defineProps, toRefs, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { syncLogList } from './data';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  return title.value || (detailObj.value?.name ? `${detailObj.value.name}详情` : '规则详情');
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() {
    detailDrawerApi.close();
  },
  async onOpenChange() {},
});

// 最近10条日志
const recentLogs = ref([]);
watch(() => detailObj.value?.rule_id, (newId) => {
  if (newId) {
    recentLogs.value = syncLogList(newId).slice(0, 10);
  }
}, { immediate: true });

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle" >
    <div class="detail-scroll-container">
      <!-- 基本信息卡片 -->
      <div class="detail-card">
        <h3 class="detail-card-title">基本信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">规则名称：</div>
          <div class="detail-row-right">{{ detailObj.name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">规则编码：</div>
          <div class="detail-row-right">{{ detailObj.code || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联评价任务：</div>
          <div class="detail-row-right">{{ detailObj.task_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联指标项：</div>
          <div class="detail-row-right">{{ detailObj.index_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据来源设备：</div>
          <div class="detail-row-right">{{ detailObj.device_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">同步频率：</div>
          <div class="detail-row-right">{{ detailObj.sync_freq_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据清洗规则：</div>
          <div class="detail-row-right">{{ detailObj.clean_rule || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">状态：</div>
          <div class="detail-row-right">{{ detailObj.statusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建人：</div>
          <div class="detail-row-right">{{ detailObj.create_by_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间：</div>
          <div class="detail-row-right">{{ detailObj.create_time || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">最近同步时间：</div>
          <div class="detail-row-right">{{ detailObj.last_sync_time || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">同步成功率：</div>
          <div class="detail-row-right">{{ detailObj.sync_success_rate || '-' }}%</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">今日同步次数：</div>
          <div class="detail-row-right">{{ detailObj.today_sync_count || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">累计同步次数：</div>
          <div class="detail-row-right">{{ detailObj.total_sync_count || '-' }}</div>
        </div>
        <div v-if="detailObj.statusName === '停用'" class="detail-card-row">
          <div class="detail-row-left">停用原因：</div>
          <div class="detail-row-right">{{ detailObj.stop_reason || '-' }}</div>
        </div>
        <div v-if="detailObj.statusName === '停用'" class="detail-card-row">
          <div class="detail-row-left">停用时间：</div>
          <div class="detail-row-right">{{ detailObj.stop_time || '-' }}</div>
        </div>
        <div v-if="detailObj.statusName === '停用'" class="detail-card-row">
          <div class="detail-row-left">停用操作人：</div>
          <div class="detail-row-right">{{ detailObj.stop_by_name || '-' }}</div>
        </div>
      </div>

      <!-- 最近同步日志卡片 -->
      <div class="detail-card">
        <h3 class="detail-card-title">最近同步日志</h3>
        <div class="detail-table-wrapper">
          <el-table :data="recentLogs" border size="small" max-height="300">
            <el-table-column prop="sync_time" label="同步时间" width="160"></el-table-column>
            <el-table-column prop="data_value" label="数据值" width="100"></el-table-column>
            <el-table-column prop="sync_type" label="方式" width="80"></el-table-column>
            <el-table-column label="状态" width="80">
              <template #default="{ row }">{{ row.fail_reason ? '失败' : '成功' }}</template>
            </el-table-column>
            <el-table-column prop="fail_reason" label="失败原因" min-width="150"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
/* 滚动容器：使所有卡片统一滚动 */
.detail-scroll-container {
  max-height: calc(70vh - 20px);
  overflow-y: auto;
  padding: 4px;
}

.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.detail-card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2f3d;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  width: 140px !important;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}

.detail-table-wrapper {
  margin-top: 10px;
  overflow-x: auto;
}

/* 滚动条样式 */
.detail-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.detail-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.detail-scroll-container::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.detail-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
  .detail-card {
    padding: 15px;
  }
}
</style>
