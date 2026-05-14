<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElTag } from 'element-plus';

// 定义组件接收的属性（临时停车订单详情）
const props = defineProps({
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

// 订单状态映射
const statusMap = {
  'charging': { label: '充电中', type: 'primary' },
  'pending_pay': { label: '待支付', type: 'warning' },
  'paid': { label: '已支付', type: 'success' },
  'completed': { label: '已完成', type: 'success' },
  'cancelled': { label: '已取消', type: 'info' },
  'refunding': { label: '退款中', type: 'danger' },
};

const { detailObj, title } = toRefs(props);

// 标题
const drawerTitle = computed(() => {
  const orderNo = detailObj.value?.orderNo || '临时停车订单';
  return title.value || `${orderNo} 详情`;
});

// 抽屉初始化
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

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 临时停车订单 标准字段 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">车牌:</div>
        <div class="detail-row-right">{{ detailObj.plateNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">预约开始时间:</div>
        <div class="detail-row-right">{{ detailObj.reserveStartTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">预约结束时间:</div>
        <div class="detail-row-right">{{ detailObj.reserveEndTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">实际使用开始时间:</div>
        <div class="detail-row-right">{{ detailObj.actualStartTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">实际使用结束时间:</div>
        <div class="detail-row-right">{{ detailObj.actualEndTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单金额:</div>
        <div class="detail-row-right">{{ detailObj.amount || '0.00' }} 元</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付状态:</div>
        <div class="detail-row-right">
          <template v-if="detailObj.status">
            <ElTag :type="statusMap[detailObj.status]?.type || 'default'">
              {{ statusMap[detailObj.status]?.label || detailObj.status }}
            </ElTag>
          </template>
          <template v-else>
            -
          </template>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单生成时间:</div>
        <div class="detail-row-right">{{ detailObj.createOrderTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">所属场站:</div>
        <div class="detail-row-right">{{ detailObj.stationName || detailObj.stationId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付时间:</div>
        <div class="detail-row-right">{{ detailObj.payTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">
          <span v-if="detailObj.payMethod === 'wechat'">微信</span>
          <span v-else-if="detailObj.payMethod === 'alipay'">支付宝</span>
          <span v-else-if="detailObj.payMethod === 'bank'">银行卡</span>
          <span v-else-if="detailObj.payMethod === 'cash'">现金</span>
          <span v-else>{{ detailObj.payMethod || '-' }}</span>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">归档时间:</div>
        <div class="detail-row-right">{{ detailObj.archiveTime || '-' }}</div>
      </div>
 
      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新者:</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
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

.detail-row-left {
  flex-shrink: 0;
  width: 160px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}

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