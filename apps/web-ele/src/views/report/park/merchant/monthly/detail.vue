<!-- detail.vue - 修改为商户月度详情 -->
<script setup>
import { defineProps, toRefs, defineEmits } from 'vue';

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

const emit = defineEmits(['edit']);

const { detailObj, title } = toRefs(props);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

const handleEdit = () => {
  emit('edit', detailObj.value);
  detailDrawerApi.close();
};

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer
    :title="title || `商户月运营详情 - ${detailObj.merchantName}`"
    @ok="handleEdit"
  >
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计月份:</div>
        <div class="detail-row-right">{{ detailObj.statMonth }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">商户名称:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.merchantName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.areaName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场名称:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.lotName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总营收金额:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            ¥{{ detailObj.totalIncome?.toLocaleString() }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总订单数:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.totalOrder?.toLocaleString() }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">月均利用率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.avgUtilization) > 80 ? 'success' :
                   parseFloat(detailObj.avgUtilization) > 70 ? 'primary' :
                   parseFloat(detailObj.avgUtilization) > 60 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.avgUtilization }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">高峰时段分布:</div>
        <div class="detail-row-right">
          <div class="peak-hour-distribution">
            <div v-if="detailObj.peakHourDistribution">
              <div
                v-for="period in detailObj.peakHourDistribution.split(',')"
                :key="period"
                class="period-item"
              >
                {{ period }}
              </div>
            </div>
            <span v-else class="text-gray-400">-</span>
          </div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">环比增长率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.growthRate) > 8 ? 'success' :
                   parseFloat(detailObj.growthRate) > 4 ? 'primary' :
                   parseFloat(detailObj.growthRate) > 0 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.growthRate }}
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

.peak-hour-distribution {
  .period-item {
    margin-bottom: 4px;
    padding: 2px 6px;
    background-color: #f0f9ff;
    border-radius: 4px;
    font-size: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
}
</style>
