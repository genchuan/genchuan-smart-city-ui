<!-- detail.vue - 月收入数据详情版本 -->
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
  <DetailDrawer :title="title || `月收入详情 - ${detailObj.areaName} ${detailObj.statMonth}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计月份:</div>
        <div class="detail-row-right">{{ detailObj.statMonth }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.areaName }} ({{ detailObj.areaCode }})
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.parkType === '商业停车场' ? 'success' :
                   detailObj.parkType === '路侧停车' ? 'warning' :
                   detailObj.parkType === '小区停车场' ? 'info' : 'primary'"
            size="small"
          >
            {{ detailObj.parkType }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.orderType === '临时停车' ? 'success' :
                   detailObj.orderType === '月卡停车' ? 'primary' :
                   detailObj.orderType === '业主停车' ? 'warning' : 'info'"
            size="small"
          >
            {{ detailObj.orderType }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总收费金额:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            ¥{{ detailObj.totalIncome?.toLocaleString() }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单总数:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.orderCount?.toLocaleString() }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">月均客单价:</div>
        <div class="detail-row-right">
          <el-tag type="warning" size="small">
            ¥{{ detailObj.avgOrderAmount }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">欠费金额:</div>
        <div class="detail-row-right">
          <el-tag type="danger" size="small">
            ¥{{ detailObj.arrearsAmount?.toLocaleString() }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">同比增长率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.yoyGrowthRate > 0 ? 'success' : 'danger'"
            size="small"
          >
            {{ detailObj.yoyGrowthRate }}%
          </el-tag>
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
  </DetailDrawer>
</template>

<!-- 样式部分保持不变 -->
<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
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
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  width: 140px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

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

@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
}
</style>
