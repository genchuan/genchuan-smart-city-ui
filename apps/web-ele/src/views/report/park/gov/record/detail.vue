<!-- detail.vue -->
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
  <DetailDrawer :title="title || `上报详情 - ${detailObj.reportNo}`">
    <div class="detail-card">
      <!-- 上报基本信息 -->
      <div class="detail-section-title">上报信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报ID：</div>
        <div class="detail-row-right">{{ detailObj.uploadId }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">报表编号：</div>
        <div class="detail-row-right">{{ detailObj.reportNo }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">模板名称：</div>
        <div class="detail-row-right">{{ detailObj.templateName }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报时间：</div>
        <div class="detail-row-right">{{ detailObj.uploadTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报状态：</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.uploadStatus === '已上报' ? 'primary' :
                   detailObj.uploadStatus === '已驳回' ? 'danger' :
                   detailObj.uploadStatus === '审核通过' ? 'success' : 'info'"
            size="small"
          >
            {{ detailObj.uploadStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row" v-if="detailObj.rejectReason">
        <div class="detail-row-left">驳回原因：</div>
        <div class="detail-row-right">
          <span style="color: #f56c6c;">{{ detailObj.rejectReason }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报人：</div>
        <div class="detail-row-right">{{ detailObj.userName }}</div>
      </div>

      <!-- 报表数据（模拟） -->
      <div class="detail-section-title">报表数据</div>
      <div class="detail-card-row">
        <div class="detail-row-left">入场车流量：</div>
        <div class="detail-row-right">1,250</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">营收总额：</div>
        <div class="detail-row-right">¥28,750.50</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单数：</div>
        <div class="detail-row-right">1,245</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均利用率：</div>
        <div class="detail-row-right">78.5%</div>
      </div>

      <!-- 政务系统反馈 -->
      <div class="detail-section-title">政务系统反馈</div>
      <div class="detail-card-row" v-if="detailObj.uploadStatus === '已驳回'">
        <div class="detail-row-left">反馈意见：</div>
        <div class="detail-row-right">{{ detailObj.rejectReason || '无' }}</div>
      </div>
      <div class="detail-card-row" v-else>
        <div class="detail-row-left">处理结果：</div>
        <div class="detail-row-right">已接收，处理正常</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">反馈时间：</div>
        <div class="detail-row-right">
          {{ detailObj.uploadStatus === '已驳回' ? '2026-02-05 16:30:22' : '2026-02-05 14:25:10' }}
        </div>
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

.detail-section-title {
  font-weight: 600;
  font-size: 16px;
  color: #1e2a3a;
  margin-top: 16px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;

  &:first-of-type {
    margin-top: 0;
  }
}

.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
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
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 22px;
}

.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 22px;
  word-break: break-all;
  padding-right: 10px;

  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
}
</style>
