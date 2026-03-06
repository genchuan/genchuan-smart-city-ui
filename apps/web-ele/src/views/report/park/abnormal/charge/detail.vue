<!-- detail.vue -->
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
  <DetailDrawer :title="title || `收费异常详情 - ${detailObj.orderNo}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">异常ID:</div>
        <div class="detail-row-right">{{ detailObj.abnormalId }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.orderNo }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.carNumber }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">区域名称:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.areaName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场名称:</div>
        <div class="detail-row-right">{{ detailObj.lotName }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常时间:</div>
        <div class="detail-row-right">{{ detailObj.abnormalTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.abnormalType === '重复收费' ? 'danger' :
                   detailObj.abnormalType === '少收费' ? 'warning' :
                   detailObj.abnormalType === '多收费' ? 'primary' :
                   detailObj.abnormalType === '未收费' ? 'info' : 'success'"
            size="small"
          >
            {{ detailObj.abnormalType }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常原因:</div>
        <div class="detail-row-right">{{ detailObj.abnormalReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.disposalStatus === '待处理' ? 'info' :
                   detailObj.disposalStatus === '处理中' ? 'warning' : 'success'"
            size="small"
          >
            {{ detailObj.disposalStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理结果:</div>
        <div class="detail-row-right">{{ detailObj.disposalResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator }}</div>
      </div>

      <!-- 订单明细区域 -->
      <div class="detail-section">
        <div class="detail-section-title">订单明细</div>
        <div class="detail-section-content">
          <div class="order-details">
            <div class="order-row">
              <div class="order-label">停车时长:</div>
              <div class="order-value">2小时15分钟</div>
            </div>
            <div class="order-row">
              <div class="order-label">应收金额:</div>
              <div class="order-value">¥30.00</div>
            </div>
            <div class="order-row">
              <div class="order-label">实收金额:</div>
              <div class="order-value">¥55.00</div>
            </div>
            <div class="order-row">
              <div class="order-label">差额:</div>
              <div class="order-value">
                <el-tag type="danger" size="small">+¥25.00</el-tag>
              </div>
            </div>
            <div class="order-row">
              <div class="order-label">入场时间:</div>
              <div class="order-value">2026-02-05 08:15:00</div>
            </div>
            <div class="order-row">
              <div class="order-label">出场时间:</div>
              <div class="order-value">2026-02-05 10:30:00</div>
            </div>
            <div class="order-row">
              <div class="order-label">支付方式:</div>
              <div class="order-value">微信支付</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 纠错记录区域 -->
      <div class="detail-section">
        <div class="detail-section-title">纠错记录</div>
        <div class="detail-section-content">
          <div v-if="detailObj.correctionRecords && detailObj.correctionRecords.length > 0" class="correction-records">
            <div v-for="(record, index) in detailObj.correctionRecords" :key="index" class="correction-record">
              <div class="correction-header">
                <div class="correction-time">{{ record.time }}</div>
                <div class="correction-operator">{{ record.operator }}</div>
              </div>
              <div class="correction-action">{{ record.action }}</div>
              <div class="correction-result">
                <el-tag :type="record.result === '成功' ? 'success' : 'warning'" size="small">
                  {{ record.result }}
                </el-tag>
              </div>
            </div>
          </div>
          <div v-else class="empty-correction">暂无纠错记录</div>
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
  min-height: 300px;
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
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;

  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

// 详情区块样式
.detail-section {
  margin-top: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}

.detail-section-title {
  padding: 10px 15px;
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
}

.detail-section-content {
  padding: 15px;
  background-color: #fff;
}

// 订单明细样式
.order-details {
  .order-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .order-label {
      color: #909399;
      font-weight: 500;
    }

    .order-value {
      color: #303133;
      font-weight: 500;
    }
  }
}

// 纠错记录样式
.correction-records {
  .correction-record {
    padding: 12px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    margin-bottom: 12px;
    background-color: #fafafa;

    &:last-child {
      margin-bottom: 0;
    }

    .correction-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .correction-time {
        color: #909399;
        font-size: 12px;
      }

      .correction-operator {
        color: #409eff;
        font-size: 12px;
        font-weight: 500;
      }
    }

    .correction-action {
      color: #606266;
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .correction-result {
      text-align: right;
    }
  }
}

.empty-correction {
  color: #909399;
  text-align: center;
  padding: 20px;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }

  .order-row {
    flex-direction: column;

    .order-label,
    .order-value {
      width: 100%;
      margin-bottom: 4px;
    }
  }

  .correction-header {
    flex-direction: column;

    .correction-time,
    .correction-operator {
      width: 100%;
      margin-bottom: 4px;
    }
  }
}
</style>
