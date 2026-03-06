<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为广告详情数据）
const props = defineProps({
  // 详情数据对象（广告详情数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的roadSectionName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用路段名称，兜底显示默认值
const drawerTitle = computed(() => {
  const roadSectionName = detailObj.value?.roadSectionName || '广告';
  return title.value || `${roadSectionName}详情`;
});

// 初始化抽屉实例（加宽适配广告详情更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽到800px适配广告详情字段
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
      <!-- 广告详情基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">车辆牌照:</div>
        <div class="detail-row-right">
          {{ detailObj.licensePlate || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核定载重:</div>
        <div class="detail-row-right">
          {{ detailObj.approvedLoad || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">实际载重:</div>
        <div class="detail-row-right">
          {{ detailObj.actualLoad || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">密闭状态:</div>
        <div class="detail-row-right">
          {{ detailObj.sealStatusId || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属片区:</div>
        <div class="detail-row-right">
          {{ detailObj.areaCode || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">执法员:</div>
        <div class="detail-row-right">
          {{ detailObj.lawEnforcerId || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单编号:</div>
        <div class="detail-row-right">
          {{ detailObj.orderNo || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 110px; // 小屏适配标签宽度
  }

  .detail-card {
    min-height: 450px;
    max-height: 60vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 500px; // 适配广告详情字段数量，提升最小高度
  max-height: 75vh; // 提高最大高度，容纳更多内容
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
  &:hover {
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  flex-shrink: 0; // 不收缩
  width: 130px; // 加宽标签宽度，适配"监测设备编号"等长标签
  font-size: 14px;
  font-weight: 500; // 加粗突出标签
  line-height: 18px; // 统一行高
  color: #606266; // 灰色调，区分内容
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133; // 主文本色
  word-break: break-all; // 处理长文本换行（如指标阈值范围）
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
} // 详情卡片整体样式
</style>
