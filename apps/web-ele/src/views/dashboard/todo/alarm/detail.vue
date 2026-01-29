<!-- detail.vue - 预警详情抽屉 -->
<script setup>
import { defineProps, toRefs, computed } from 'vue';
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

// 计算处置时长
const dealDuration = computed(() => {
  if (!detailObj.value.finish_time || !detailObj.value.deal_start_time) return '-';
  const start = new Date(detailObj.value.deal_start_time);
  const end = new Date(detailObj.value.finish_time);
  const duration = end - start;
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}天${hours}小时`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 600,
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
  <DetailDrawer :title="title || `预警详情 - ${detailObj.alarm_id}`">
    <div class="detail-card">
      <!-- 基础信息 -->
      <div class="detail-section">
        <div class="detail-section-title">基础信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警ID:</div>
          <div class="detail-row-right">{{ detailObj.alarm_id }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警等级:</div>
          <div class="detail-row-right">
            <el-tag
              :type="detailObj.alarm_level === '紧急' ? 'danger' :
                     detailObj.alarm_level === '高' ? 'warning' :
                     detailObj.alarm_level === '中' ? 'primary' : 'info'"
              size="small"
            >
              {{ detailObj.alarm_level }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警类型:</div>
          <div class="detail-row-right">{{ detailObj.alarm_type }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">发生时间:</div>
          <div class="detail-row-right">{{ detailObj.alarm_time }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联对象:</div>
          <div class="detail-row-right">{{ detailObj.related_object }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">发生地点:</div>
          <div class="detail-row-right">{{ detailObj.location }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警来源:</div>
          <div class="detail-row-right">{{ detailObj.source }}</div>
        </div>
      </div>

      <!-- 预警描述 -->
      <div class="detail-section">
        <div class="detail-section-title">预警描述</div>
        <div class="detail-card-row">
          <div class="detail-row-right description-content">
            {{ detailObj.alarm_description }}
          </div>
        </div>
      </div>

      <!-- 处置信息 -->
      <div v-if="detailObj.alarm_status !== '待处置'" class="detail-section">
        <div class="detail-section-title">处置信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警状态:</div>
          <div class="detail-row-right">
            <el-tag
              :type="detailObj.alarm_status === '待处置' ? 'info' :
                     detailObj.alarm_status === '处置中' ? 'primary' :
                     detailObj.alarm_status === '已处理' ? 'success' :
                     detailObj.alarm_status === '已忽略' ? 'warning' : 'info'"
              size="small"
            >
              {{ detailObj.alarm_status }}
            </el-tag>
          </div>
        </div>
        <div v-if="detailObj.responsible_person" class="detail-card-row">
          <div class="detail-row-left">责任人:</div>
          <div class="detail-row-right">{{ detailObj.responsible_person }}</div>
        </div>
        <div v-if="detailObj.deal_start_time" class="detail-card-row">
          <div class="detail-row-left">开始处置时间:</div>
          <div class="detail-row-right">{{ detailObj.deal_start_time }}</div>
        </div>
        <div v-if="detailObj.current_deal_status" class="detail-card-row">
          <div class="detail-row-left">当前处置状态:</div>
          <div class="detail-row-right">{{ detailObj.current_deal_status }}</div>
        </div>
        <div v-if="detailObj.related_workorder" class="detail-card-row">
          <div class="detail-row-left">关联工单:</div>
          <div class="detail-row-right">{{ detailObj.related_workorder }}</div>
        </div>
        <div v-if="detailObj.deal_progress" class="detail-card-row">
          <div class="detail-row-left">处置进度:</div>
          <div class="detail-row-right">
            <el-progress
              :percentage="parseInt(detailObj.deal_progress)"
              :show-text="false"
              size="small"
            />
            <span style="margin-left: 8px;">{{ detailObj.deal_progress }}</span>
          </div>
        </div>
      </div>

      <!-- 归档信息 -->
      <div v-if="detailObj.alarm_status === '已处理' || detailObj.alarm_status === '已忽略'" class="detail-section">
        <div class="detail-section-title">归档信息</div>
        <div v-if="detailObj.deal_result" class="detail-card-row">
          <div class="detail-row-left">处置结果:</div>
          <div class="detail-row-right">{{ detailObj.deal_result }}</div>
        </div>
        <div v-if="detailObj.finish_time" class="detail-card-row">
          <div class="detail-row-left">完成时间:</div>
          <div class="detail-row-right">{{ detailObj.finish_time }}</div>
        </div>
        <div v-if="detailObj.deal_summary" class="detail-card-row">
          <div class="detail-row-left">处置总结:</div>
          <div class="detail-row-right">{{ detailObj.deal_summary }}</div>
        </div>
        <div v-if="detailObj.deal_duration || dealDuration !== '-'" class="detail-card-row">
          <div class="detail-row-left">处置时长:</div>
          <div class="detail-row-right">{{ detailObj.deal_duration || dealDuration }}</div>
        </div>
        <div v-if="detailObj.review_opinion" class="detail-card-row">
          <div class="detail-row-left">复盘意见:</div>
          <div class="detail-row-right">{{ detailObj.review_opinion }}</div>
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
}

.detail-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-section-title {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
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
  line-height: 20px;
}

.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 20px;
  word-break: break-all;
  padding-right: 10px;

  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

.description-content {
  background-color: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
}
</style>
