<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题
const drawerTitle = computed(() => {
  const archiveNo = detailObj.value?.archiveNo || '归档';
  return title.value || `${archiveNo}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: (tab = '1') => {
    detailDrawerApi.open();
  },
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 归档基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">归档编号:</div>
        <div class="detail-row-right">{{ detailObj.archiveNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联处置工单编号:</div>
        <div class="detail-row-right">
          {{ detailObj.orderNo || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联预警编号:</div>
        <div class="detail-row-right">
          {{ detailObj.warnNo || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">井盖编号:</div>
        <div class="detail-row-right">
          {{ detailObj.coverNo || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">路段名称:</div>
        <div class="detail-row-right">
          {{ detailObj.roadName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常类型:</div>
        <div class="detail-row-right">{{ detailObj.abnormalType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查结果:</div>
        <div class="detail-row-right">{{ detailObj.checkResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置完成时间:</div>
        <div class="detail-row-right">
          {{ detailObj.completeTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">归档时间:</div>
        <div class="detail-row-right">
          {{ detailObj.archiveTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警处置总时长:</div>
        <div class="detail-row-right">
          {{ detailObj.dealDuration || '-' }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">窨井盖指标恢复值:</div>
        <div class="detail-row-right">
          {{ detailObj.recoverValue || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查员:</div>
        <div class="detail-row-right">
          {{ detailObj.checkStaff || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">安全风险消除状态:</div>
        <div class="detail-row-right">
          {{ detailObj.riskStatus || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">归档资料数:</div>
        <div class="detail-row-right">
          {{ detailObj.fileNum || '-' }} 份
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置前后指标对比:</div>
        <div class="detail-row-right">
          {{ detailObj.beforeAfter || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 130px; // 小屏适配工单字段标签宽度
  }

  .detail-card {
    min-height: 520px;
    max-height: 70vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 600px; // 适配工单处置 14 个字段，提升最小高度
  max-height: 85vh; // 提高最大高度，容纳更多工单字段
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（处置内容/检测数据）
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
  width: 150px; // 加宽标签宽度，适配"处置进度更新时间"等长标签
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
  word-break: break-all; // 处理长文本换行（如现场检测数据、处置内容）
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
