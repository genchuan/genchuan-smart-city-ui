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
  <DetailDrawer :title="title || `设备异常详情 - ${detailObj.deviceCode}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">故障ID:</div>
        <div class="detail-row-right">{{ detailObj.faultId }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备编码:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.deviceCode }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备类型:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.deviceType }}
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
        <div class="detail-row-left">故障时间:</div>
        <div class="detail-row-right">{{ detailObj.faultTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.faultType === '硬件故障' ? 'danger' :
                   detailObj.faultType === '软件故障' ? 'warning' :
                   detailObj.faultType === '网络故障' ? 'primary' :
                   detailObj.faultType === '电源故障' ? 'info' : 'success'"
            size="small"
          >
            {{ detailObj.faultType }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障描述:</div>
        <div class="detail-row-right">{{ detailObj.faultDescription || '-' }}</div>
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
        <div class="detail-row-left">处置时间:</div>
        <div class="detail-row-right">{{ detailObj.disposalTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理人:</div>
        <div class="detail-row-right">{{ detailObj.processor || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator }}</div>
      </div>

      <!-- 处置流程区域 -->
      <div class="detail-section">
        <div class="detail-section-title">处置流程</div>
        <div class="detail-section-content">
          <div v-if="detailObj.disposalProcess && detailObj.disposalProcess.length > 0" class="process-timeline">
            <div v-for="(process, index) in detailObj.disposalProcess" :key="index" class="process-step">
              <div class="process-step-header">
                <div class="process-step-title">{{ process.step }}</div>
                <div class="process-step-time">{{ process.time }}</div>
              </div>
              <div class="process-step-content">{{ process.description }}</div>
              <div class="process-step-operator">处理人: {{ process.operator }}</div>
            </div>
          </div>
          <div v-else class="empty-process">暂无处置流程记录</div>
        </div>
      </div>

      <!-- 设备运行日志区域 -->
      <div class="detail-section">
        <div class="detail-section-title">设备运行日志</div>
        <div class="detail-section-content">
          <div class="device-logs">
            <div class="log-entry">
              <div class="log-time">2026-02-05 08:28:15</div>
              <div class="log-level info">INFO</div>
              <div class="log-message">设备启动正常</div>
            </div>
            <div class="log-entry">
              <div class="log-time">2026-02-05 08:29:30</div>
              <div class="log-level warn">WARN</div>
              <div class="log-message">检测到异常电流波动</div>
            </div>
            <div class="log-entry">
              <div class="log-time">2026-02-05 08:30:00</div>
              <div class="log-level error">ERROR</div>
              <div class="log-message">道闸电机故障，无法抬起</div>
            </div>
          </div>
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

// 处置流程样式
.process-timeline {
  .process-step {
    position: relative;
    padding-left: 20px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 10px;
      height: 10px;
      background-color: #409eff;
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 18px;
      bottom: -10px;
      width: 2px;
      background-color: #e4e7ed;
    }

    &:last-child::after {
      display: none;
    }

    .process-step-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .process-step-title {
        font-weight: 600;
        color: #303133;
      }

      .process-step-time {
        color: #909399;
        font-size: 12px;
      }
    }

    .process-step-content {
      color: #606266;
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .process-step-operator {
      color: #409eff;
      font-size: 12px;
    }
  }
}

.empty-process {
  color: #909399;
  text-align: center;
  padding: 20px;
}

// 设备日志样式
.device-logs {
  .log-entry {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px dashed #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .log-time {
      width: 160px;
      color: #909399;
      font-size: 12px;
    }

    .log-level {
      width: 60px;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 600;
      text-align: center;

      &.info {
        background-color: #f4f4f5;
        color: #909399;
      }

      &.warn {
        background-color: #fdf6ec;
        color: #e6a23c;
      }

      &.error {
        background-color: #fef0f0;
        color: #f56c6c;
      }
    }

    .log-message {
      flex: 1;
      color: #303133;
      font-size: 13px;
      margin-left: 10px;
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }

  .process-step {
    padding-left: 15px;

    &::before {
      width: 8px;
      height: 8px;
    }
  }

  .log-entry {
    flex-direction: column;
    align-items: flex-start;

    .log-time,
    .log-level,
    .log-message {
      width: 100%;
      margin-bottom: 4px;
    }
  }
}
</style>
