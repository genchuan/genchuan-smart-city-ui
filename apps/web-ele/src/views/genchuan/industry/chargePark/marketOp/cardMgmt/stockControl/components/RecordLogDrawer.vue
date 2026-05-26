<script setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  title: {
    type: String,
    default: '记录详情',
  },
  logData: {
    type: Array,
    default: () => [],
  },
  width: {
    type: String,
    default: '50%',
  },
});

const emit = defineEmits(['close']);

const [DrawerComponent, drawerApi] = useVbenDrawer({
  width: computed(() => props.width),
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(() => props.title),
  showCancelButton: false,
  showConfirmButton: false,
});

const open = () => {
  drawerApi.open();
};

const close = () => {
  drawerApi.close();
  emit('close');
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <DrawerComponent>
    <div class="record-log-container">
      <div v-if="logData.length > 0" class="log-list">
        <div
          v-for="(log, index) in logData"
          :key="index"
          class="log-item"
        >
          <div class="log-index">{{ index + 1 }}</div>
          <div class="log-content">{{ log }}</div>
        </div>
      </div>

      <div v-else class="log-empty">
        <span>暂无记录</span>
      </div>
    </div>
  </DrawerComponent>
</template>

<style scoped>
.record-log-container {
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  padding: 8px 12px;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f6f8fc 0%, #ffffff 100%);
  border-left: 4px solid var(--el-color-primary, #409eff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease-in-out;
}

.log-item:hover {
  background: linear-gradient(135deg, #eef3fd 0%, #f5f9ff 100%);
  border-left-color: var(--el-color-primary-light-3, #79bbff);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateX(3px) translateY(-1px);
}

.log-index {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--el-color-primary, #409eff) 0%, var(--el-color-primary-light-3, #79bbff) 100%);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
  flex-shrink: 0;
}

.log-content {
  flex: 1;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--el-text-color-primary, #303133);
  word-break: break-word;
  overflow-wrap: break-word;
  font-weight: 400;
}

.log-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  font-size: 14px;
  color: var(--el-text-color-placeholder, #a8abb2);
}
</style>
