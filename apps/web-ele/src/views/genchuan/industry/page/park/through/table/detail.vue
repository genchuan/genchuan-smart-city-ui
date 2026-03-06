<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（规则数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用规则名称）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用规则名称，兜底显示默认值
const drawerTitle = computed(() => {
  const ruleName = detailObj.value?.ruleName || '规则';
  return title.value || `${ruleName}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 850, // 加宽抽屉适配长文本规则字段
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 规则详情信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">规则名称:</div>
        <div class="detail-row-right">{{ detailObj.ruleName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">适用出入口:</div>
        <div class="detail-row-right">
          {{ detailObj.applicableEntrance || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">通行时段:</div>
        <div class="detail-row-right">{{ detailObj.passTimeSlot || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">无牌车规则:</div>
        <div class="detail-row-right">{{ detailObj.noPlateRule || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">重复进场限制:</div>
        <div class="detail-row-right">
          {{ detailObj.repeatEntryLimit || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最长停留时长:</div>
        <div class="detail-row-right">{{ detailObj.maxStayTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">特殊车辆规则:</div>
        <div class="detail-row-right">
          {{ detailObj.specialVehicleRule || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">时段差异化规则:</div>
        <div class="detail-row-right">
          {{ detailObj.timeDifferentiatedRule || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">优先级:</div>
        <div class="detail-row-right">{{ detailObj.priority || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">生效状态:</div>
        <div class="detail-row-right">
          {{ detailObj.effectiveStatus || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">冲突提示:</div>
        <div class="detail-row-right">
          {{ detailObj.conflictPrompt || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">修改时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 500px; // 适配13个规则字段的显示高度
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
  overflow-y: auto; // 内容过多时显示滚动条
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（如时段差异化规则）
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
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

// 左侧标签样式
.detail-row-left {
  width: 140px; // 适配长标签（时段差异化规则/重复进场限制）
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 18px; // 统一行高
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 18px;
  word-break: break-all; // 处理长文本换行（如时段差异化规则、冲突提示）
  padding-right: 10px;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
  }
}

// 滚动条样式优化
.detail-card::-webkit-scrollbar {
  width: 6px;
}
.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
