<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 代付码详情
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

// 标题
const drawerTitle = computed(() => {
  const code = detailObj.value?.code || '代付码';
  return title.value || `${code} 详情`;
});

// 代付码状态映射
const statusMap = {
  unused: { label: '未使用', type: 'primary' },
  used: { label: '已使用', type: 'success' },
  expired: { label: '已过期', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 抽屉
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
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">代付码:</div>
        <div class="detail-row-right">{{ detailObj.code || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">商户ID:</div>
        <div class="detail-row-right">{{ detailObj.merchantId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">商户名称:</div>
        <div class="detail-row-right">{{ detailObj.merchantName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联规则ID:</div>
        <div class="detail-row-right">{{ detailObj.ruleId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">规则名称:</div>
        <div class="detail-row-right">{{ detailObj.ruleName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">过期时间:</div>
        <div class="detail-row-right">{{ detailObj.expireTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">状态:</div>
        <div class="detail-row-right">
          <el-tag :type="getStatusType(detailObj.status)">
            {{ getStatusLabel(detailObj.status) }}
          </el-tag>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">用户ID:</div>
        <div class="detail-row-right">{{ detailObj.userId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">用户名称:</div>
        <div class="detail-row-right">{{ detailObj.userName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">用户手机号:</div>
        <div class="detail-row-right">{{ detailObj.userTel || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">使用时间:</div>
        <div class="detail-row-right">{{ detailObj.useTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联订单ID:</div>
        <div class="detail-row-right">{{ detailObj.orderId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
      </div> 
      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
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
    padding: 12px 8px;
    margin: 0 -8px;
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
  color: #606266;
}

.detail-row-right {
  flex: 1;
  font-size: 14px;
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
