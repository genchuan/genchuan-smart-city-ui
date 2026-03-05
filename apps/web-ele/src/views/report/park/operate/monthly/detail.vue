<!-- detail.vue - 修改为月度详情 -->
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
    :title="title || `月度运营详情 - ${detailObj.areaName} ${detailObj.parkType}`"
    @ok="handleEdit"
  >
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计月份:</div>
        <div class="detail-row-right">{{ detailObj.statMonth }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.areaName }}
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
        <div class="detail-row-left">总入场车次:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.totalEntry?.toLocaleString() }}
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
        <div class="detail-row-left">月均泊位利用率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.avgBerthUtilization) > 80 ? 'success' :
                   parseFloat(detailObj.avgBerthUtilization) > 70 ? 'primary' :
                   parseFloat(detailObj.avgBerthUtilization) > 60 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.avgBerthUtilization }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障处置率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.faultDisposalRate) > 95 ? 'success' :
                   parseFloat(detailObj.faultDisposalRate) > 90 ? 'primary' :
                   parseFloat(detailObj.faultDisposalRate) > 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.faultDisposalRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警处置率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.alarmDisposalRate) > 96 ? 'success' :
                   parseFloat(detailObj.alarmDisposalRate) > 93 ? 'primary' :
                   parseFloat(detailObj.alarmDisposalRate) > 90 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.alarmDisposalRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">同比增长率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.yoyGrowthRate) > 10 ? 'success' :
                   parseFloat(detailObj.yoyGrowthRate) > 5 ? 'primary' :
                   parseFloat(detailObj.yoyGrowthRate) > 0 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.yoyGrowthRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">环比增长率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.momGrowthRate) > 8 ? 'success' :
                   parseFloat(detailObj.momGrowthRate) > 4 ? 'primary' :
                   parseFloat(detailObj.momGrowthRate) > 0 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.momGrowthRate }}
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

@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
}
</style>
