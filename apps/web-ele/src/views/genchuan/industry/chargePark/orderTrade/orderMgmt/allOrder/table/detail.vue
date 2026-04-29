<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { ElTag } from 'element-plus';

// 订单状态映射
const statusMap = {
  charging: { label: '充电中', type: 'primary' },
  pending_pay: { label: '待支付', type: 'warning' },
  paid: { label: '已支付', type: 'success' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' },
  refunding: { label: '退款中', type: 'danger' },
};

// 定义组件接收的属性（充电停车订单详情）
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
  const orderNo = detailObj.value?.orderNo || '充电停车订单';
  return title.value || `${orderNo} 详情`;
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
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 充电停车订单 详情字段 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">
          {{ detailObj.orderNo || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单类型:</div>
        <div class="detail-row-right">
          {{ detailObj.type || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单金额:</div>
        <div class="detail-row-right">{{ detailObj.amount || 0 }} 元</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">优惠抵扣金额:</div>
        <div class="detail-row-right">
          {{ detailObj.discountAmount || 0 }} 元
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单状态:</div>
        <div class="detail-row-right">
          <template v-if="detailObj.status">
            <ElTag :type="statusMap[detailObj.status]?.type || 'default'">
              {{ statusMap[detailObj.status]?.label || detailObj.status }}
            </ElTag>
          </template>
          <template v-else> - </template>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付时间:</div>
        <div class="detail-row-right">
          {{ detailObj.payTime || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">备注:</div>
        <div class="detail-row-right">
          {{ detailObj.remark || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">
          {{ detailObj.creator || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新者:</div>
        <div class="detail-row-right">
          {{ detailObj.updater || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{ detailObj.createTime || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.updateTime || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 150px;
  }

  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 650px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

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
  flex-shrink: 0;
  width: 160px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
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
