<script setup lang="ts">
import { computed, ref } from 'vue';

import { ElMessage } from 'element-plus';

interface Props {
  merchant: any;
}

const props = defineProps<Props>();

const emit = defineEmits(['close']);

// 结算周期选项
const settlementCycles = ref([
  { label: '日结', value: 'daily' },
  { label: '月结', value: 'monthly' },
  { label: '季度结', value: 'quarterly' },
]);

// 结算方式选项
const settlementMethods = ref([
  { label: '手动支付', value: 'manual' },
  { label: '自动转账', value: 'auto' },
]);

// 结算规则表单数据
const settlementRule = ref({
  cycle: 'monthly',
  ratio: 65,
  threshold: 200,
  method: 'manual',
});

// 计算属性：结算方式描述
const methodDescription = computed(() => {
  return settlementRule.value.method === 'manual'
    ? '财务手动转账，需上传支付凭证'
    : '系统自动转账，无需人工干预';
});

// 激活的标签页
const activeTab = ref('config');

// 计算商户状态标签
const statusTag = computed(() => {
  return {
    label: '已配置',
    type: 'success',
  };
});

// 结算单列表数据
const settlementOrders = ref([
  {
    orderNo: 'S2023100048',
    cycle: '2023-09-01 至 2023-09-30',
    amount: 6500,
    status: '已支付',
    statusType: 'success',
  },
  {
    orderNo: 'S2023090048',
    cycle: '2023-08-01 至 2023-08-31',
    amount: 5800,
    status: '已支付',
    statusType: 'success',
  },
  {
    orderNo: 'S2023080048',
    cycle: '2023-07-01 至 2023-07-31',
    amount: 6200,
    status: '已支付',
    statusType: 'success',
  },
]);

// 时间范围选项
const timeRangeOptions = ref([
  { label: '最近3个月', value: '3month' },
  { label: '最近6个月', value: '6month' },
  { label: '最近12个月', value: '12month' },
]);

// 选择的时间范围
const selectedTimeRange = ref('6month');

// 当前待支付结算单
const currentSettlementOrder = ref({
  orderNo: 'S2023110048',
  cycle: '2023-10-01 至 2023-10-31',
  amount: 6900,
  status: '待支付',
  statusType: 'warning',
});

// 支付信息表单
const paymentForm = ref({
  paymentDate: '2023-11-05',
  paymentMethod: 'bank',
  transactionNo: 'T00001100000000123456',
  paymentVoucher: '',
});

// 支付方式选项
const paymentMethods = ref([
  { label: '银行转账', value: 'bank' },
  { label: '支付宝', value: 'alipay' },
  { label: '微信支付', value: 'wechat' },
]);

// 记录支付信息
const recordPayment = () => {
  ElMessage.success('支付信息已记录');
};
</script>

<template>
  <div class="settlement-management">
    <!-- 商户信息卡片 -->
    <div class="merchant-info-card">
      <div class="merchant-icon">
        <span class="icon-box">
          <i class="iconfont icon-company"></i>
        </span>
      </div>
      <div class="merchant-details">
        <div class="merchant-name">
          {{ merchant.merchantName }}
          <el-tag :type="statusTag.type" class="ml-2">
            {{ statusTag.label }}
          </el-tag>
        </div>
        <div class="merchant-meta">
          <span class="meta-item">商户ID: {{ merchant.merchantId }}</span>
          <span class="meta-item">最近结算: 2023-10-01(已支付)</span>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" class="settlement-tabs">
      <el-tab-pane label="结算规则配置" name="config">
        <!-- 结算周期 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label required">结算周期</label>
            <div class="cycle-options">
              <el-radio-group v-model="settlementRule.cycle" size="large">
                <el-radio-button
                  v-for="cycle in settlementCycles"
                  :key="cycle.value"
                  :label="cycle.value"
                >
                  {{ cycle.label }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 商户分成比例 -->
          <div class="form-item">
            <label class="form-label required">商户分成比例</label>
            <div class="ratio-input">
              <el-input-number
                v-model="settlementRule.ratio"
                :min="0"
                :max="100"
                :step="1"
                class="w-full"
              />
              <span class="ratio-unit">%</span>
            </div>
            <div class="form-help">
              商户可获得收入的{{ settlementRule.ratio }}%作为分成
            </div>
          </div>

          <!-- 最低结算金额 -->
          <div class="form-item">
            <label class="form-label required">最低结算金额</label>
            <div class="amount-input">
              <span class="amount-unit">¥</span>
              <el-input-number
                v-model="settlementRule.threshold"
                :min="0"
                :max="1000000"
                :step="10"
                class="w-full"
              />
              <span class="amount-currency">元</span>
            </div>
            <div class="form-help">
              当月收入达到{{
                settlementRule.threshold
              }}元才进行结算，不足则累计至下月
            </div>
          </div>

          <!-- 结算方式 -->
          <div class="form-item">
            <label class="form-label">结算方式</label>
            <el-select
              v-model="settlementRule.method"
              placeholder="请选择结算方式"
              class="w-full"
            >
              <el-option
                v-for="method in settlementMethods"
                :key="method.value"
                :label="method.label"
                :value="method.value"
              />
            </el-select>
            <div class="form-help">{{ methodDescription }}</div>
          </div>

          <!-- 经营账户信息 -->
          <div class="form-item">
            <label class="form-label">经营账户信息</label>
            <div class="account-info">
              <p class="account-text">账户名称：{{ merchant.merchantName }}</p>
              <p class="account-text">银行账号：********1234</p>
              <p class="account-text">开户银行：中国建设银行</p>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="结算单管理" name="settle-orders">
        <div class="orders-section">
          <!-- 结算单列表 -->
          <div class="form-section">
            <div class="form-item">
              <label class="form-label">结算单列表</label>
              <div class="time-range-selector">
                <el-select
                  v-model="selectedTimeRange"
                  placeholder="请选择时间范围"
                  class="w-full"
                >
                  <el-option
                    v-for="option in timeRangeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </div>
            </div>
          </div>

          <!-- 结算单列表 -->
          <div class="settlement-list">
            <div
              v-for="order in settlementOrders"
              :key="order.orderNo"
              class="settlement-item"
            >
              <div class="order-header">
                <div class="order-info">
                  <span class="order-no">{{ order.orderNo }}</span>
                  <el-tag :type="order.statusType" size="small" class="ml-2">
                    {{ order.status }}
                  </el-tag>
                </div>
              </div>
              <div class="order-cycle">结算周期: {{ order.cycle }}</div>
              <div class="order-amount">
                <span class="amount-label">实付金额</span>
                <span class="amount-value">¥{{ order.amount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="支付跟踪" name="payment-tracking">
        <div class="tracking-section">
          <!-- 当前待支付结算单 -->
          <div class="form-section">
            <div class="form-item">
              <label class="form-label">当前待支付结算单</label>
              <div class="order-card">
                <div class="order-info">
                  <span class="order-no">{{
                    currentSettlementOrder.orderNo
                  }}</span>
                  <el-tag
                    :type="currentSettlementOrder.statusType"
                    size="small"
                    class="ml-2"
                  >
                    {{ currentSettlementOrder.status }}
                  </el-tag>
                </div>
                <div class="order-cycle">
                  结算周期: {{ currentSettlementOrder.cycle }}
                </div>
                <div class="order-amount">
                  <span class="amount-label">实付金额</span>
                  <span class="amount-value"
                    >¥{{ currentSettlementOrder.amount.toFixed(2) }}</span
                  >
                </div>
              </div>
            </div>

            <!-- 记录支付信息 -->
            <div class="form-item">
              <label class="form-label">记录支付信息</label>
            </div>

            <div class="form-item">
              <label class="form-label required">支付日期</label>
              <el-date-picker
                v-model="paymentForm.paymentDate"
                type="date"
                placeholder="选择支付日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="w-full"
              />
            </div>

            <div class="form-item">
              <label class="form-label required">支付方式</label>
              <el-select
                v-model="paymentForm.paymentMethod"
                placeholder="请选择支付方式"
                class="w-full"
              >
                <el-option
                  v-for="method in paymentMethods"
                  :key="method.value"
                  :label="method.label"
                  :value="method.value"
                />
              </el-select>
            </div>

            <div class="form-item">
              <label class="form-label required">交易流水号</label>
              <el-input
                v-model="paymentForm.transactionNo"
                placeholder="请输入交易流水号"
                class="w-full"
              />
            </div>

            <div class="form-item">
              <label class="form-label">支付凭证</label>
              <el-upload
                v-model="paymentForm.paymentVoucher"
                action="#"
                :auto-upload="false"
                list-type="picture"
                accept=".jpg,.jpeg,.png,.pdf"
              >
                <el-button type="primary" plain>上传凭证</el-button>
              </el-upload>
            </div>

            <!--            &lt;!&ndash; 操作按钮 &ndash;&gt;-->
            <!--            <div class="form-item" style="margin-bottom: 0;">-->
            <!--              <div class="action-buttons" style="margin-top: 0;">-->
            <!--                <el-button type="primary" @click="recordPayment">确认支付</el-button>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.settlement-management {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .merchant-info-card {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f0f9ff;
    border: 1px solid #e0f2fe;
    border-radius: 8px;
    margin-bottom: 20px;

    .merchant-icon {
      margin-right: 16px;

      .icon-box {
        width: 48px;
        height: 48px;
        background-color: #3b82f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }
    }

    .merchant-details {
      flex: 1;

      .merchant-name {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #1e293b;
      }

      .merchant-meta {
        display: flex;
        gap: 20px;
        font-size: 14px;
        color: #64748b;

        .meta-item {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .settlement-tabs {
    margin-bottom: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      margin-bottom: 12px;
    }

    .el-tabs__content {
      flex: 1;
      overflow: auto;

      > .el-tab-pane {
        padding: 16px 0;
      }
    }
  }

  .form-section {
    margin-bottom: 20px;

    .form-item {
      margin-bottom: 24px;

      .form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #334155;

        &.required::after {
          content: '*';
          color: #ef4444;
          margin-left: 4px;
        }
      }

      .cycle-options {
        margin-bottom: 8px;

        .el-radio-group {
          .el-radio-button__inner {
            border-color: #93c5fd;
            color: #3b82f6;

            &:hover {
              border-color: #60a5fa;
              color: #2563eb;
            }

            &.is-active {
              background-color: #3b82f6;
              border-color: #3b82f6;
              color: white;
            }
          }
        }
      }

      .ratio-input {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .ratio-unit {
          color: #64748b;
          font-weight: 500;
        }
      }

      .amount-input {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .amount-unit,
        .amount-currency {
          color: #64748b;
          font-weight: 500;
        }
      }

      .form-help {
        font-size: 13px;
        color: #64748b;
        margin-top: 4px;
      }

      .account-info {
        background-color: #f8fafc;
        padding: 12px;
        border-radius: 6px;

        .account-text {
          margin-bottom: 8px;
          font-size: 14px;
          color: #475569;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  /* 结算单列表样式 */
  .settlement-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
  }

  .settlement-item,
  .order-card {
    padding: 16px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .order-info {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .order-no {
      font-weight: 600;
      font-size: 14px;
      color: #334155;
    }
  }

  .order-cycle {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 12px;
  }

  .order-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .amount-label {
      font-size: 13px;
      color: #64748b;
    }

    .amount-value {
      font-weight: 600;
      font-size: 18px;
      color: #ef4444;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;

    .el-button--primary {
      background-color: #3b82f6;
      border-color: #3b82f6;

      &:hover {
        background-color: #2563eb;
        border-color: #2563eb;
      }
    }
  }
}
</style>
