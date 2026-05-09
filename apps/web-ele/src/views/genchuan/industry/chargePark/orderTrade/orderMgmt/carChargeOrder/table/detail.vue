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
  unpaid: { label: '未支付', type: 'warning' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status || '-';
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
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
      <!-- 主键ID -->
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">
          {{ detailObj.id || '-' }}
        </div>
      </div>

      <!-- 订单编号 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">
          {{ detailObj.orderNo || '-' }}
        </div>
      </div>

      <!-- 车牌 -->
      <div class="detail-card-row">
        <div class="detail-row-left">车牌:</div>
        <div class="detail-row-right">
          {{ detailObj.plateNo || '-' }}
        </div>
      </div>

      <!-- 充电时长（分钟） -->
      <div class="detail-card-row">
        <div class="detail-row-left">充电时长（分钟）:</div>
        <div class="detail-row-right">
          {{ detailObj.chargeDuration || '-' }}
        </div>
      </div>

      <!-- 充电量（度） -->
      <div class="detail-card-row">
        <div class="detail-row-left">充电量（度）:</div>
        <div class="detail-row-right">
          {{ detailObj.chargeQuantity ? detailObj.chargeQuantity.toFixed(2) + ' 度' : '-' }}
        </div>
      </div>

      <!-- 充电功率（kw） -->
      <div class="detail-card-row">
        <div class="detail-row-left">充电功率（kw）:</div>
        <div class="detail-row-right">
          {{ detailObj.chargePower ? detailObj.chargePower.toFixed(2) + ' kw' : '-' }}
        </div>
      </div>

      <!-- 订单金额 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单金额:</div>
        <div class="detail-row-right">
          {{ detailObj.amount ? '¥' + detailObj.amount.toFixed(2) : '-' }}
        </div>
      </div>

      <!-- 订单状态 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单状态:</div>
        <div class="detail-row-right">
          <ElTag :type="getStatusType(detailObj.status)">
            {{ getStatusLabel(detailObj.status) }}
          </ElTag>
        </div>
      </div>

      <!-- 订单生成时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单生成时间:</div>
        <div class="detail-row-right">
          {{ detailObj.createOrderTime || '-' }}
        </div>
      </div>

      <!-- 所属场站ID -->
      <div class="detail-card-row">
        <div class="detail-row-left">所属场站:</div>
        <div class="detail-row-right">
          {{ detailObj.stationName || '-' }}
        </div>
      </div>

      <!-- 支付时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">支付时间:</div>
        <div class="detail-row-right">
          {{ detailObj.payTime || '-' }}
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">
          <span v-if="detailObj.payMethod === 'wechat'">微信支付</span>
          <span v-else-if="detailObj.payMethod === 'alipay'">支付宝</span>
          <span v-else-if="detailObj.payMethod === 'cash'">现金</span>
          <span v-else>{{ detailObj.payMethod || '-' }}</span>
        </div>
      </div>

      <!-- 优惠抵扣金额 -->
      <div class="detail-card-row">
        <div class="detail-row-left">优惠抵扣金额:</div>
        <div class="detail-row-right">
          {{ detailObj.discountAmount ? '¥' + detailObj.discountAmount.toFixed(2) : '-' }}
        </div>
      </div>

      <!-- 归档时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">归档时间:</div>
        <div class="detail-row-right">
          {{ detailObj.archiveTime || '-' }}
        </div>
      </div>
 

      <!-- 创建者 -->
      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">
          {{ detailObj.creator || '-' }}
        </div>
      </div>

      <!-- 更新者 -->
      <div class="detail-card-row">
        <div class="detail-row-left">更新者:</div>
        <div class="detail-row-right">
          {{ detailObj.updater || '-' }}
        </div>
      </div>

      <!-- 创建时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{ detailObj.createTime || '-' }}
        </div>
      </div>

      <!-- 更新时间 -->
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
