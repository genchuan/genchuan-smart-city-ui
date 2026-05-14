<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为订单详情数据）
const props = defineProps({
  // 详情数据对象（订单详情数据）
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

// 计算属性处理标题
const drawerTitle = computed(() => {
  const orderCode = detailObj.value?.orderCode || '订单';
  return title.value || `${orderCode}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
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

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-';
  return new Date(time).toLocaleString();
};

// 格式化金额
const formatMoney = (money) => {
  if (money === null || money === undefined) return '-';
  return `¥${(money || 0).toFixed(2)}`;
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 订单详情基础信息 -->

      <!-- 订单编号 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">
          {{ detailObj.orderCode || '-' }}
        </div>
      </div>

      <!-- 用户ID -->
      <div class="detail-card-row">
        <div class="detail-row-left">用户ID:</div>
        <div class="detail-row-right">
          {{ detailObj.userId || '-' }}
        </div>
      </div>

      <!-- 车牌号 -->
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号:</div>
        <div class="detail-row-right">
          {{ detailObj.plateNo || '-' }}
        </div>
      </div>

      <!-- 充电桩编号 -->
      <div class="detail-card-row">
        <div class="detail-row-left">充电桩编号:</div>
        <div class="detail-row-right">
          {{ detailObj.pileCode || '-' }}
        </div>
      </div>

      <!-- 充电时长 -->
      <div class="detail-card-row">
        <div class="detail-row-left">充电时长:</div>
        <div class="detail-row-right">
          {{ detailObj.chargeTime ? `${detailObj.chargeTime}小时` : '-' }}
        </div>
      </div>

      <!-- 充电量 -->
      <div class="detail-card-row">
        <div class="detail-row-left">充电量:</div>
        <div class="detail-row-right">
          {{ detailObj.chargeAmount ? `${detailObj.chargeAmount}度` : '-' }}
        </div>
      </div>

      <!-- 充电金额 -->
      <div class="detail-card-row">
        <div class="detail-row-left">充电金额:</div>
        <div class="detail-row-right">
          {{ formatMoney(detailObj.chargeMoney) }}
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">
          {{ detailObj.payType || '-' }}
        </div>
      </div>

      <!-- 支付状态 -->
      <div class="detail-card-row">
        <div class="detail-row-left">支付状态:</div>
        <div class="detail-row-right">
          <el-tag :type="detailObj.payStatus === '已支付' ? 'success' : 'danger'">
            {{ detailObj.payStatus || '-' }}
          </el-tag>
        </div>
      </div>

      <!-- 订单状态 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单状态:</div>
        <div class="detail-row-right">
          <el-tag :type="getOrderStatusType(detailObj.orderStatus)">
            {{ detailObj.orderStatus || '-' }}
          </el-tag>
        </div>
      </div>

      <!-- 备注 -->
      <div class="detail-card-row" v-if="detailObj.remark">
        <div class="detail-row-left">备注:</div>
        <div class="detail-row-right">
          {{ detailObj.remark }}
        </div>
      </div>

      <!-- 创建时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{ formatTime(detailObj.createTime) }}
        </div>
      </div>

      <!-- 支付时间 -->
      <div class="detail-card-row" v-if="detailObj.payTime">
        <div class="detail-row-left">支付时间:</div>
        <div class="detail-row-right">
          {{ formatTime(detailObj.payTime) }}
        </div>
      </div>

      <!-- 完成时间 -->
      <div class="detail-card-row" v-if="detailObj.completeTime">
        <div class="detail-row-left">完成时间:</div>
        <div class="detail-row-right">
          {{ formatTime(detailObj.completeTime) }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<script>
// 添加订单状态样式辅助函数
const getOrderStatusType = (status) => {
  const typeMap = {
    '待支付': 'warning',
    '充电中': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  };
  return typeMap[status] || 'info';
};
</script>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 110px;
  }

  .detail-card {
    min-height: 450px;
    max-height: 60vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 500px;
  max-height: 75vh;
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
  flex-shrink: 0;
  width: 130px;
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
