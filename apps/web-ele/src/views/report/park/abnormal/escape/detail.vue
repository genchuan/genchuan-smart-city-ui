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
  <DetailDrawer :title="title || `逃费详情 - ${detailObj.carNumber}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">逃费ID:</div>
        <div class="detail-row-right">{{ detailObj.escapeId }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.carNumber }}
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
        <div class="detail-row-right">{{ detailObj.lotName }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">逃费时间:</div>
        <div class="detail-row-right">{{ detailObj.escapeTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">逃费金额:</div>
        <div class="detail-row-right">
          <el-tag type="danger" size="small">
            ¥{{ detailObj.escapeAmount }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">逃费等级:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.escapeLevel === '一级逃费' ? 'danger' :
                   detailObj.escapeLevel === '二级逃费' ? 'warning' : 'primary'"
            size="small"
          >
            {{ detailObj.escapeLevel }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">追缴状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.traceStatus === '待追缴' ? 'info' :
                   detailObj.traceStatus === '追缴中' ? 'warning' : 'success'"
            size="small"
          >
            {{ detailObj.traceStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上次追缴时间:</div>
        <div class="detail-row-right">{{ detailObj.lastTraceTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator }}</div>
      </div>

      <!-- 追缴历史区域 -->
      <div class="detail-section">
        <div class="detail-section-title">追缴历史</div>
        <div class="detail-section-content">
          <div v-if="detailObj.traceHistory && detailObj.traceHistory.length > 0" class="trace-history">
            <div v-for="(history, index) in detailObj.traceHistory" :key="index" class="trace-history-item">
              <div class="trace-time">{{ history.time }}</div>
              <div class="trace-action">{{ history.action }}</div>
              <div class="trace-operator">{{ history.operator }}</div>
            </div>
          </div>
          <div v-else class="empty-history">暂无追缴历史记录</div>
        </div>
      </div>

      <!-- 车辆通行记录区域 -->
      <div class="detail-section">
        <div class="detail-section-title">车辆通行记录</div>
        <div class="detail-section-content">
          <div class="empty-history">此功能需对接车辆通行系统</div>
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

// 追缴历史样式
.trace-history {
  .trace-history-item {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px dashed #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .trace-time {
      width: 160px;
      color: #909399;
    }

    .trace-action {
      flex: 1;
      color: #303133;
    }

    .trace-operator {
      width: 80px;
      color: #409eff;
      text-align: right;
    }
  }
}

.empty-history {
  color: #909399;
  text-align: center;
  padding: 20px;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }

  .trace-history-item {
    flex-direction: column;

    .trace-time,
    .trace-action,
    .trace-operator {
      width: 100%;
      text-align: left;
      margin-bottom: 4px;
    }
  }
}
</style>
