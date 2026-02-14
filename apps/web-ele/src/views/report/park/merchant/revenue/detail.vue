<!-- detail.vue - 商户营收报表详情 -->
<script setup>
import { defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的taskName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="title || `营收详情 - ${detailObj.merchantName}`">
    <div class="detail-card">
      <!-- 营收明细 -->
      <div class="detail-section">
        <div class="detail-section-title">营收明细</div>
        <div class="detail-card-row">
          <div class="detail-row-left">商户名称:</div>
          <div class="detail-row-right">
            <el-tag type="primary" size="small">
              {{ detailObj.merchantName }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">结算周期:</div>
          <div class="detail-row-right">
            <el-tag type="info" size="small">
              {{ detailObj.settlementPeriod }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">时间范围:</div>
          <div class="detail-row-right">
            {{ detailObj.startDate }} 至 {{ detailObj.endDate }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">订单类型:</div>
          <div class="detail-row-right">
            <el-tag
              :type="detailObj.orderType === '停车费收入' ? 'success' :
                     detailObj.orderType === '车位租赁' ? 'warning' :
                     detailObj.orderType === '广告收入' ? 'primary' : 'info'"
              size="small"
            >
              {{ detailObj.orderType }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 分账规则 -->
      <div class="detail-section">
        <div class="detail-section-title">分账规则</div>
        <div class="detail-card-row">
          <div class="detail-row-left">总营收:</div>
          <div class="detail-row-right">
            <el-tag type="success" size="small">
              ¥{{ detailObj.totalIncome?.toLocaleString() }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">平台分成:</div>
          <div class="detail-row-right">
            <el-tag type="warning" size="small">
              ¥{{ detailObj.platformAmount?.toLocaleString() }}
              <span style="margin-left: 8px; color: #909399; font-size: 12px;">
                ({{ detailObj.totalIncome ? ((detailObj.platformAmount / detailObj.totalIncome) * 100).toFixed(1) : 0 }}%)
              </span>
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">商户分成:</div>
          <div class="detail-row-right">
            <el-tag type="primary" size="small">
              ¥{{ detailObj.merchantAmount?.toLocaleString() }}
              <span style="margin-left: 8px; color: #909399; font-size: 12px;">
                ({{ detailObj.totalIncome ? ((detailObj.merchantAmount / detailObj.totalIncome) * 100).toFixed(1) : 0 }}%)
              </span>
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">分成比例:</div>
          <div class="detail-row-right">
            <span style="color: #67C23A;">平台:商户 =
              {{ detailObj.totalIncome ? ((detailObj.platformAmount / detailObj.totalIncome) * 100).toFixed(0) : 0 }}% :
              {{ detailObj.totalIncome ? ((detailObj.merchantAmount / detailObj.totalIncome) * 100).toFixed(0) : 0 }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 税费计算 -->
      <div class="detail-section">
        <div class="detail-section-title">税费计算</div>
        <div class="detail-card-row">
          <div class="detail-row-left">税费金额:</div>
          <div class="detail-row-right">
            <el-tag type="danger" size="small">
              ¥{{ detailObj.taxAmount?.toLocaleString() }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">税率:</div>
          <div class="detail-row-right">
            <span style="color: #F56C6C;">
              {{ detailObj.totalIncome ? ((detailObj.taxAmount / detailObj.totalIncome) * 100).toFixed(1) : 0 }}%
            </span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">税后营收:</div>
          <div class="detail-row-right">
            <span style="font-weight: 600; color: #67C23A;">
              ¥{{ detailObj.totalIncome && detailObj.taxAmount ? (detailObj.totalIncome - detailObj.taxAmount).toLocaleString() : 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- 结算凭证 -->
      <div class="detail-section">
        <div class="detail-section-title">结算凭证</div>
        <div class="detail-card-row">
          <div class="detail-row-left">结算状态:</div>
          <div class="detail-row-right">
            <el-tag
              :type="detailObj.settlementStatus === '已结算' ? 'success' :
                     detailObj.settlementStatus === '结算中' ? 'warning' : 'danger'"
              size="small"
            >
              {{ detailObj.settlementStatus }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">到账金额:</div>
          <div class="detail-row-right">
            <el-tag type="success" size="small">
              ¥{{ detailObj.arrivalAmount?.toLocaleString() }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">到账比例:</div>
          <div class="detail-row-right">
            <span :style="{
              color: detailObj.totalIncome && (detailObj.arrivalAmount / detailObj.totalIncome) * 100 >= 80 ? '#67C23A' :
                     detailObj.totalIncome && (detailObj.arrivalAmount / detailObj.totalIncome) * 100 >= 50 ? '#E6A23C' : '#F56C6C'
            }">
              {{ detailObj.totalIncome ? ((detailObj.arrivalAmount / detailObj.totalIncome) * 100).toFixed(1) : 0 }}%
            </span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">更新时间:</div>
          <div class="detail-row-right">{{ detailObj.updateTime }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">操作人:</div>
          <div class="detail-row-right">{{ detailObj.operator }}</div>
        </div>
      </div>

      <!-- 结算备注 -->
      <div class="detail-section" v-if="detailObj.settlementStatus && detailObj.settlementStatus !== '已结算'">
        <div class="detail-section-title">结算备注</div>
        <div class="detail-card-row">
          <div class="detail-row-left">状态说明:</div>
          <div class="detail-row-right" style="color: #f56c6c; font-size: 13px;">
            <div v-if="detailObj.settlementStatus === '结算中'">
              • 结算处理中，预计1-3个工作日内完成<br>
              • 银行处理时间可能影响最终到账<br>
              • 如有疑问请联系平台客服
            </div>
            <div v-else-if="detailObj.settlementStatus === '待结算'">
              • 等待结算申请审核<br>
              • 请确认所有订单已完成<br>
              • 结算周期结束后自动进入结算流程
            </div>
            <div v-else>
              • 结算状态异常，请联系平台客服<br>
              • 可能需要重新提交结算申请
            </div>
          </div>
        </div>
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
  min-height: 300px; // 保证最小高度，避免内容过少时样式塌陷
}

// 详情模块
.detail-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

// 模块标题
.detail-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #409eff;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本
  padding: 10px 0;
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
  width: 120px; // 固定宽度，保证对齐
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
  word-break: break-all; // 处理长文本换行
  padding-right: 10px;

  // 空值样式区分
  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
}
</style>
