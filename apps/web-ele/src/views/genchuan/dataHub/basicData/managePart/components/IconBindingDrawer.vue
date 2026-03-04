<script setup>
import { ref } from 'vue';

import {
  Basketball,
  // Building,
  Delete,
  FirstAidKit,
  Food,
  Guide,
  House,
  Money,
  Picture,
  Present,
  Reading,
  Shop,
  Sunny,
  Van,
  VideoCamera,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  category: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'confirm']);

// 图标映射
const iconMap = {
  Shop,
  Van,
  Sunny,
  Food,
  FirstAidKit,
  Reading,
  Guide,
  Present,
  VideoCamera,
  Delete,
  Money,
  House,
  Picture,
  Basketball,
};

// 图示库数据（模拟）
const iconLibrary = ref([
  // { id: 'Building', name: '建筑物' },
  { id: 'Shop', name: '商店' },
  { id: 'Van', name: '车辆' },
  { id: 'Sunny', name: '阳光' },
  { id: 'Food', name: '食物' },
  { id: 'FirstAidKit', name: '急救包' },
  { id: 'Reading', name: '阅读' },
  { id: 'Guide', name: '指南' },
  { id: 'Present', name: '礼物' },
  { id: 'VideoCamera', name: '摄像机' },
  { id: 'Delete', name: '垃圾桶' },
  { id: 'Money', name: '金钱' },
  { id: 'House', name: '住宿' },
  { id: 'Picture', name: '图片' },
  { id: 'Basketball', name: '篮球' },
]);

const selectedIcon = ref(props.category.iconName || '');

const handleConfirm = () => {
  if (!selectedIcon.value) {
    ElMessage.warning('请选择一个图示');
    return;
  }
  emit('confirm', selectedIcon.value);
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="icon-binding-drawer">
    <div class="drawer-content">
      <p>
        为分类
        <span class="category-name">{{ category.categoryName }}</span>
        选择一个标准化图示：
      </p>
      <div class="icon-library">
        <div
          v-for="icon in iconLibrary"
          :key="icon.id"
          class="icon-item"
          :class="{ active: selectedIcon === icon.id }"
          @click="selectedIcon = icon.id"
        >
          <el-icon :size="32"><component :is="iconMap[icon.id]" /></el-icon>
          <span>{{ icon.name }}</span>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>
  </div>
</template>

<style scoped>
.icon-binding-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.drawer-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.drawer-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.category-name {
  font-weight: 500;
  color: #409eff;
}

.icon-library {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.icon-item.active {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.icon-item span {
  margin-top: 8px;
  font-size: 12px;
  text-align: center;
}

.drawer-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>
