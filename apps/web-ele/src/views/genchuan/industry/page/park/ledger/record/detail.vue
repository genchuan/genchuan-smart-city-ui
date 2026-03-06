<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { formatTimestamp } from '#/utils';
// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（停车订单数据，匹配表格字段）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用订单编号）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用订单编号，兜底显示默认值
const drawerTitle = computed(() => {
  const orderCode = detailObj.value?.orderCode || '停车订单';
  return title.value || `${orderCode}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽抽屉适配更多字段
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
      <!-- 停车订单核心信息（匹配表格字段） -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号:</div>
        <div class="detail-row-right">{{ detailObj.carNumber || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场ID:</div>
        <div class="detail-row-right">{{ detailObj.lotId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">停车泊位ID:</div>
        <div class="detail-row-right">{{ detailObj.spaceId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">入场时间:</div>
        <div class="detail-row-right">
          {{ formatTimestamp(detailObj.entryTime || '-') }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">出场时间:</div>
        <div class="detail-row-right">
          {{ formatTimestamp(detailObj.exitTime || '-') }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">停车时长:</div>
        <div class="detail-row-right">
          {{ detailObj.parkingDuration || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">应收金额:</div>
        <div class="detail-row-right">
          {{
            detailObj.originalAmount
              ? `${detailObj.originalAmount.toFixed(2)} 元`
              : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单优惠金额:</div>
        <div class="detail-row-right">
          {{
            detailObj.discountAmount
              ? `${detailObj.discountAmount.toFixed(2)} 元`
              : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最终金额:</div>
        <div class="detail-row-right">
          {{
            detailObj.payAmount ? `${detailObj.payAmount.toFixed(2)} 元` : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单状态:</div>
        <div class="detail-row-right">{{ detailObj.orderStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付状态:</div>
        <div class="detail-row-right">{{ detailObj.payStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">{{ detailObj.payType || '-' }}</div>
      </div>
      <!-- 保留业务补充字段（如有需要可删除） -->
      <div class="detail-card-row">
        <div class="detail-row-left">白名单:</div>
        <div class="detail-row-right">
          {{
            detailObj.isWhiteList
              ? '是'
              : detailObj.isWhiteList === false
                ? '否'
                : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">畅停卡:</div>
        <div class="detail-row-right">
          {{
            detailObj.isSmoothStopCard
              ? '是'
              : detailObj.isSmoothStopCard === false
                ? '否'
                : '-'
          }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }

  .detail-card {
    max-height: 60vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 400px; // 增加最小高度适配更多字段
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
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
  width: 140px; // 加宽适配长标签（订单优惠金额/最终金额）
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
  word-break: break-all; // 处理长文本换行（如订单编号）
}

// 滚动条样式优化（可选）
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
