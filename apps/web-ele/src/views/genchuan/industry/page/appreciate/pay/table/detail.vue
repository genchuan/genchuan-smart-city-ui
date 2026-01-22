<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（出入口数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的entranceName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用出入口名称，兜底显示默认值
const drawerTitle = computed(() => {
  const entranceName = detailObj.value?.entranceName || '出入口';
  return title.value || `${entranceName}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750, // 加宽抽屉适配更多出入口字段
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
      <!-- 出入口基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">支付ID:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.payment_id }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联订单ID:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.order_id }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单类型:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.order_type }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.car_number }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">停放时长:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.parking_duration }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">应收金额:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.original_amount }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">实付金额:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.pay_amount }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">优惠金额:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.discount_amount }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.pay_type }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付时间:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.pay_time }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">交易流水号:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.trade_no }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">核验状态:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.verification_status }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">放行状态:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.release_status }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.create_time }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">备注:</div>
        <div class="detail-row-right">
          {{ dataObj.detailObj.remark }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }

  .detail-card {
    max-height: 60vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 450px; // 增加最小高度适配出入口字段数量
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
  width: 120px; // 固定宽度，保证所有标签对齐
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
  word-break: break-all; // 处理长文本换行（如地址）
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
