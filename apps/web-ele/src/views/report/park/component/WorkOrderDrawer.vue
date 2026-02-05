<script setup>
import { ref, computed, watch } from 'vue';
import {
  Document,
  Download,
  View,
  Clock,
  User,
  PriceTag,  // 替换 Tag 为 PriceTag
  Picture,
  Folder
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { formatCurrency } from '#/views/report/park/component/ReportUtils';

const props = defineProps({
  workOrderId: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  },
  workOrderData: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: '工单详情'
  },
  size: {
    type: String,
    default: '50%'
  }
});

const emit = defineEmits(['update:visible', 'close', 'refresh']);

const drawerVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
    if (!value) {
      emit('close');
    }
  }
});

// 工单状态颜色映射
const statusColorMap = {
  '待处理': 'danger',
  '处理中': 'warning',
  '已完成': 'success',
  '已关闭': 'info',
  '复核中': 'primary'
};

// 优先级颜色映射
const priorityColorMap = {
  '紧急': 'danger',
  '高': 'warning',
  '普通': 'success',
  '低': 'info'
};

// 格式化时间
const formatTime = (time) => {
  if (!time) return '';
  return time.replace('T', ' ').substring(0, 19);
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  return statusColorMap[status] || 'info';
};

// 获取优先级标签类型
const getPriorityTagType = (priority) => {
  return priorityColorMap[priority] || 'info';
};

// 计算剩余时间
const getRemainingTime = (deadline) => {
  if (!deadline) return '';
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `已超时${Math.abs(days)}天`;
  if (days === 0) return '今日截止';
  if (days === 1) return '明天截止';
  return `剩余${days}天`;
};

// 下载附件
const handleDownloadAttachment = (attachment) => {
  ElMessage.success(`开始下载: ${attachment.name}`);
  // 实际项目中这里应该是真实的下载逻辑
  console.log('下载附件:', attachment);
};

// 查看附件
const handleViewAttachment = (attachment) => {
  ElMessage.info(`查看附件: ${attachment.name}`);
  // 实际项目中这里应该是打开预览的逻辑
  console.log('查看附件:', attachment);
};

// 获取文件类型图标
const getFileTypeIcon = (fileType) => {
  const iconMap = {
    'image': Picture,
    'pdf': Document,
    'text': Document,
    'excel': Document,
    'word': Document,
    'zip': Folder
  };
  return iconMap[fileType] || Document;
};

// 获取文件类型颜色
const getFileTypeColor = (fileType) => {
  const colorMap = {
    'image': '#52c41a',
    'pdf': '#f5222d',
    'text': '#1890ff',
    'excel': '#52c41a',
    'word': '#1890ff',
    'zip': '#fa8c16'
  };
  return colorMap[fileType] || '#8c8c8c';
};

// 格式化文件大小
const formatFileSize = (size) => {
  if (!size) return '';
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    :title="title"
    :size="size"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <div v-if="workOrderData" class="workorder-drawer">
      <!-- 工单头部信息 -->
      <div class="workorder-header">
        <div class="header-main">
          <h3 class="workorder-title">{{ workOrderData.title }}</h3>
          <div class="header-tags">
            <el-tag :type="getStatusTagType(workOrderData.status)" size="large">
              {{ workOrderData.status }}
            </el-tag>
            <el-tag :type="getPriorityTagType(workOrderData.priority)" size="large">
              <el-icon><Clock /></el-icon>
              {{ workOrderData.priority }}
            </el-tag>
            <el-tag type="info" size="large" v-if="workOrderData.category">
              <el-icon><PriceTag /></el-icon>
              {{ workOrderData.category }}
            </el-tag>
          </div>
        </div>
        <div class="header-meta">
          <div class="meta-item">
            <el-icon><Clock /></el-icon>
            <span class="meta-label">创建时间:</span>
            <span class="meta-value">{{ formatTime(workOrderData.createTime) }}</span>
          </div>
          <div class="meta-item" v-if="workOrderData.deadline">
            <el-icon><Clock /></el-icon>
            <span class="meta-label">截止时间:</span>
            <span class="meta-value">{{ workOrderData.deadline }}</span>
            <span class="deadline-warning" :class="{ overdue: getRemainingTime(workOrderData.deadline).includes('超时') }">
              {{ getRemainingTime(workOrderData.deadline) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 工单基本信息 -->
      <div class="workorder-section">
        <h4 class="section-title">基本信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单ID">
            {{ workOrderData.workOrderId }}
          </el-descriptions-item>
          <el-descriptions-item label="关联ID" v-if="workOrderData.faultId || workOrderData.abnormalId || workOrderData.orderNo">
            {{ workOrderData.faultId || workOrderData.abnormalId || workOrderData.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item label="负责人">
            <div class="assignee-info">
              <el-icon><User /></el-icon>
              <span>{{ workOrderData.assignee || '待分配' }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="所属部门">
            {{ workOrderData.department || '运维部' }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间" v-if="workOrderData.updateTime">
            {{ formatTime(workOrderData.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="预估成本" v-if="workOrderData.cost">
            {{ formatCurrency(workOrderData.cost) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 工单描述 -->
      <div class="workorder-section" v-if="workOrderData.description">
        <h4 class="section-title">问题描述</h4>
        <div class="description-content">
          {{ workOrderData.description }}
        </div>
      </div>

      <!-- 解决方案 -->
      <div class="workorder-section" v-if="workOrderData.solution || workOrderData.result">
        <h4 class="section-title">处理情况</h4>
        <div class="solution-content">
          <div v-if="workOrderData.solution" class="solution-item">
            <strong>解决方案:</strong> {{ workOrderData.solution }}
          </div>
          <div v-if="workOrderData.result" class="solution-item">
            <strong>处理结果:</strong> {{ workOrderData.result }}
          </div>
        </div>
      </div>

      <!-- 处理历史 -->
      <div class="workorder-section" v-if="workOrderData.history && workOrderData.history.length > 0">
        <h4 class="section-title">处理历史</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in workOrderData.history"
            :key="index"
            :timestamp="formatTime(record.time)"
            placement="top"
            :type="index === workOrderData.history.length - 1 ? 'primary' : 'info'"
          >
            <el-card shadow="hover">
              <div class="history-item">
                <div class="history-header">
                  <span class="history-action">{{ record.action }}</span>
                  <span class="history-operator">
                    <el-icon><User /></el-icon>
                    {{ record.operator }}
                  </span>
                </div>
                <div class="history-result" v-if="record.result">
                  <strong>结果:</strong> {{ record.result }}
                </div>
                <div class="history-remark" v-if="record.remark">
                  <strong>备注:</strong> {{ record.remark }}
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 附件列表 -->
      <div class="workorder-section" v-if="workOrderData.attachments && workOrderData.attachments.length > 0">
        <h4 class="section-title">附件列表</h4>
        <div class="attachment-list">
          <div v-for="attachment in workOrderData.attachments" :key="attachment.name" class="attachment-item">
            <div class="attachment-icon" :style="{ color: getFileTypeColor(attachment.type) }">
              <el-icon>
                <component :is="getFileTypeIcon(attachment.type)" />
              </el-icon>
            </div>
            <div class="attachment-info">
              <div class="attachment-name">{{ attachment.name }}</div>
              <div class="attachment-meta">
                <span class="attachment-type">{{ attachment.type || '文件' }}</span>
                <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
              </div>
            </div>
            <div class="attachment-actions">
              <el-button
                type="text"
                size="small"
                :icon="View"
                @click="handleViewAttachment(attachment)"
              >
                查看
              </el-button>
              <el-button
                type="text"
                size="small"
                :icon="Download"
                @click="handleDownloadAttachment(attachment)"
              >
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="workorder-empty">
        <el-empty description="暂无工单数据" />
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.workorder-drawer {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.workorder-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.workorder-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.header-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
}

.meta-item .el-icon {
  font-size: 16px;
}

.meta-label {
  color: #909399;
}

.meta-value {
  color: #303133;
  font-weight: 500;
}

.deadline-warning {
  margin-left: 8px;
  padding: 2px 6px;
  background: #f0f9ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
}

.deadline-warning.overdue {
  background: #fff2f0;
  color: #f5222d;
}

.workorder-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.description-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  line-height: 1.6;
  color: #303133;
}

.solution-content {
  padding: 16px;
  background: #f6ffed;
  border-radius: 4px;
  border-left: 4px solid #52c41a;
}

.solution-item {
  margin-bottom: 8px;
  line-height: 1.6;
}

.solution-item:last-child {
  margin-bottom: 0;
}

.history-item {
  padding: 8px 0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-action {
  font-weight: 600;
  color: #303133;
}

.history-operator {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 14px;
}

.history-result,
.history-remark {
  margin-top: 4px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.attachment-item:hover {
  background: #f0f2f5;
}

.attachment-icon {
  margin-right: 12px;
  font-size: 24px;
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  word-break: break-all;
}

.attachment-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.attachment-type {
  text-transform: capitalize;
}

.attachment-actions {
  display: flex;
  gap: 8px;
}

.assignee-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.workorder-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style>
