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
  // 抽屉标题（可选，默认使用详情对象的alarmId）
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
  <DetailDrawer :title="title || `预警详情 - ${detailObj.alarmId}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">预警ID:</div>
        <div class="detail-row-right">{{ detailObj.alarmId }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警等级:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.alarmLevel === '严重' ? 'danger' :
                   detailObj.alarmLevel === '高' ? 'warning' :
                   detailObj.alarmLevel === '中' ? 'primary' : 'info'"
            size="small"
          >
            {{ detailObj.alarmLevel }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警类型:</div>
        <div class="detail-row-right">{{ detailObj.alarmType }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">发生时间:</div>
        <div class="detail-row-right">{{ detailObj.alarmTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联对象:</div>
        <div class="detail-row-right">{{ detailObj.assetName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联对象ID:</div>
        <div class="detail-row-right">{{ detailObj.assetExtendId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">发生地点:</div>
        <div class="detail-row-right">{{ detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警来源:</div>
        <div class="detail-row-right">{{ detailObj.source || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警描述:</div>
        <div class="detail-row-right">{{ detailObj.alarmContent || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.dealStatus === '待处置' ? 'info' :
                   detailObj.dealStatus === '处置中' ? 'primary' :
                   detailObj.dealStatus === '已处理' ? 'success' :
                   detailObj.dealStatus === '已忽略' ? 'warning' : 'info'"
            size="small"
          >
            {{ detailObj.dealStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">责任人:</div>
        <div class="detail-row-right">{{ detailObj.responsiblePerson || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前处置状态:</div>
        <div class="detail-row-right">{{ detailObj.currentDealStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">开始处置时间:</div>
        <div class="detail-row-right">{{ detailObj.dealStartTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置进度:</div>
        <div class="detail-row-right">
          <el-progress
            v-if="detailObj.dealProgress"
            :percentage="parseInt(detailObj.dealProgress)"
            :status="detailObj.dealProgress === '100%' ? 'success' : ''"
            style="width: 200px;"
          />
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联工单:</div>
        <div class="detail-row-right">{{ detailObj.workorderNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置日志摘要:</div>
        <div class="detail-row-right">{{ detailObj.dealLogSummary || '-' }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.dealSummary">
        <div class="detail-row-left">处置总结:</div>
        <div class="detail-row-right">{{ detailObj.dealSummary }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.disposalResult">
        <div class="detail-row-left">处置结果:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.disposalResult === '已解决' ? 'success' :
                   detailObj.disposalResult === '已忽略' ? 'warning' :
                   detailObj.disposalResult === '误报' ? 'info' : 'danger'"
            size="small"
          >
            {{ detailObj.disposalResult }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row" v-if="detailObj.finishTime">
        <div class="detail-row-left">完成时间:</div>
        <div class="detail-row-right">{{ detailObj.finishTime }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.dealDuration">
        <div class="detail-row-left">处置时长:</div>
        <div class="detail-row-right">{{ detailObj.dealDuration }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.reviewOpinion">
        <div class="detail-row-left">复盘意见:</div>
        <div class="detail-row-right">{{ detailObj.reviewOpinion }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联附件:</div>
        <div class="detail-row-right">
          <span v-if="detailObj.attachmentCount > 0">
            {{ detailObj.attachmentCount }} 个附件
          </span>
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最新动态:</div>
        <div class="detail-row-right">{{ detailObj.latestDynamic || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">提交次数:</div>
        <div class="detail-row-right">{{ detailObj.submitCount || '1' }}</div>
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
