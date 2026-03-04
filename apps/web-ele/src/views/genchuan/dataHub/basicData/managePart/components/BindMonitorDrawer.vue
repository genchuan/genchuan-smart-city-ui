<script setup lang="ts">
import { ref, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElCheckbox, ElInput, ElMessage, ElTag } from 'element-plus';

const emit = defineEmits(['success']);

const [Drawer, drawerApi] = useVbenDrawer({
  title: '关联监测部件',
  width: 600,
  position: 'right',
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

const currentPart = ref<any>({});
const searchKeyword = ref('');
const selectedMonitors = ref<string[]>([]);

// 模拟监测部件数据
const monitorList = reactive([
  { id: 'M001', name: '温度传感器-001', type: '温度监测', status: '1', location: '中山路网格A区' },
  { id: 'M002', name: '湿度传感器-002', type: '湿度监测', status: '1', location: '中山路网格A区' },
  { id: 'M003', name: '摄像头-003', type: '视频监控', status: '1', location: '公园路网格B区' },
  { id: 'M004', name: '烟雾报警器-004', type: '烟雾监测', status: '2', location: '建设路网格D区' },
  { id: 'M005', name: '水位传感器-005', type: '水位监测', status: '1', location: '长安街网格C区' },
  { id: 'M006', name: '压力传感器-006', type: '压力监测', status: '1', location: '中山路网格A区' },
  { id: 'M007', name: '振动传感器-007', type: '振动监测', status: '0', location: '商业街网格E区' },
  { id: 'M008', name: '光照传感器-008', type: '光照监测', status: '1', location: '公园路网格B区' },
]);

// 已关联的监测部件（模拟）
const boundMonitors = ref<string[]>([]);

const open = (row: any) => {
  currentPart.value = row;
  selectedMonitors.value = [];
  searchKeyword.value = '';
  // 模拟加载已关联的监测部件
  boundMonitors.value = ['M001', 'M002']; // 假设已关联M001和M002
  drawerApi.open();
};

const handleConfirm = async () => {
  if (selectedMonitors.value.length === 0) {
    ElMessage.warning('请至少选择一个监测部件');
    return;
  }

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    ElMessage.success(`成功关联 ${selectedMonitors.value.length} 个监测部件`);
    emit('success');
    drawerApi.close();
  } catch (error) {
    ElMessage.error('关联失败');
  }
};

const getStatusType = (status: string) => {
  switch (status) {
    case '1': return 'success';
    case '2': return 'warning';
    case '0': return 'danger';
    default: return 'info';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case '1': return '正常';
    case '2': return '故障';
    case '0': return '离线';
    default: return '未知';
  }
};

// 过滤后的监测部件列表
const filteredMonitorList = () => {
  if (!searchKeyword.value) return monitorList;
  return monitorList.filter(item => 
    item.name.includes(searchKeyword.value) || 
    item.type.includes(searchKeyword.value) ||
    item.location.includes(searchKeyword.value)
  );
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <div class="bind-monitor-container">
      <!-- 当前部件信息 -->
      <div class="current-part-info">
        <div class="info-title">当前部件</div>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">部件名称：</span>
            <span class="info-value">{{ currentPart.partName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">16位标识码：</span>
            <span class="info-value">{{ currentPart.uniqueCode }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">已关联监测部件：</span>
            <span class="info-value">{{ boundMonitors.length }} 个</span>
          </div>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="search-section">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索监测部件名称、类型或位置"
          clearable
          prefix-icon="Search"
        />
      </div>

      <!-- 监测部件列表 -->
      <div class="monitor-list">
        <div class="list-header">
          <ElCheckbox 
            :model-value="selectedMonitors.length === filteredMonitorList().length && filteredMonitorList().length > 0"
            :indeterminate="selectedMonitors.length > 0 && selectedMonitors.length < filteredMonitorList().length"
            @change="(val: any) => selectedMonitors = val ? filteredMonitorList().map(item => item.id) : []"
          >
            全选
          </ElCheckbox>
          <span class="selected-count">已选择 {{ selectedMonitors.length }} 个</span>
        </div>
        
        <div class="list-content">
          <div 
            v-for="item in filteredMonitorList()" 
            :key="item.id"
            class="monitor-item"
            :class="{ 'is-bound': boundMonitors.includes(item.id) }"
          >
            <ElCheckbox 
              v-model="selectedMonitors" 
              :label="item.id"
              :disabled="boundMonitors.includes(item.id)"
            >
              <div class="monitor-info">
                <div class="monitor-header">
                  <span class="monitor-name">{{ item.name }}</span>
                </div>
                <div class="monitor-detail">
                  <span class="monitor-type">{{ item.type }}</span>
                  <span class="monitor-location">{{ item.location }}</span>
                </div>
              </div>
            </ElCheckbox>
            <div class="monitor-status-group">
              <ElTag size="small" :type="getStatusType(item.status)">
                {{ getStatusText(item.status) }}
              </ElTag>
              <div v-if="boundMonitors.includes(item.id)" class="bound-tag">已关联</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义底部按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <ElButton @click="drawerApi.close()">取消</ElButton>
        <ElButton type="primary" @click="handleConfirm">
          确认绑定
        </ElButton>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
.bind-monitor-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.current-part-info {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  font-size: 13px;
}

.info-label {
  color: var(--el-text-color-secondary);
  width: 120px;
}

.info-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.search-section {
  margin-bottom: 16px;
}

.monitor-list {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
}

.selected-count {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.monitor-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s;
}

.monitor-item:hover {
  background-color: var(--el-fill-color-light);
}

.monitor-item.is-bound {
  background-color: var(--el-fill-color-light);
  opacity: 0.7;
}

.monitor-item :deep(.el-checkbox) {
  flex: 1;
  margin-right: 0;
}

.monitor-item :deep(.el-checkbox__label) {
  flex: 1;
  padding-left: 12px;
}

.monitor-item-content {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
}

.monitor-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.monitor-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.monitor-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.monitor-detail {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.monitor-status-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.bound-tag {
  font-size: 12px;
  color: var(--el-color-success);
  padding: 2px 8px;
  background-color: var(--el-color-success-light-9);
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  height: 24px;
  line-height: 20px;
  box-sizing: border-box;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
