<!-- detail.vue - 收入明细详情版本 -->
<script setup>
import { defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

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

const { detailObj, title } = toRefs(props);

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

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="title || `订单详情 - ${detailObj.orderNo}`">
    <div class="detail-card">
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
        <div class="detail-row-left">用户手机号:</div>
        <div class="detail-row-right">{{ detailObj.userPhone }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场名称:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.lotName }} ({{ detailObj.lotId }})
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">停放时段:</div>
        <div class="detail-row-right">
          {{ detailObj.parkingStartTime }} 至 {{ detailObj.parkingEndTime }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">停车时长:</div>
        <div class="detail-row-right">
          <el-tag type="warning" size="small">
            {{ detailObj.parkingDuration }} 分钟
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">应付金额:</div>
        <div class="detail-row-right">
          <el-tag size="small">
            ¥{{ detailObj.originalAmount?.toFixed(2) }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">优惠金额:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            ¥{{ detailObj.discountAmount?.toFixed(2) }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">实付金额:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            ¥{{ detailObj.payAmount?.toFixed(2) }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.payWay === '微信支付' ? 'success' :
                   detailObj.payWay === '支付宝' ? 'primary' :
                   detailObj.payWay === '银联支付' ? 'warning' : 'info'"
            size="small"
          >
            {{ detailObj.payWay }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付时间:</div>
        <div class="detail-row-right">{{ detailObj.payTime }}</div>
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
