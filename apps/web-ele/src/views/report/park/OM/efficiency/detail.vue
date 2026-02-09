<!-- detail.vue -->
<script setup>
import { defineProps, toRefs, computed } from 'vue';

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

// 计算时间范围显示
const dateRangeDisplay = computed(() => {
  if (detailObj.value.startDate && detailObj.value.endDate) {
    if (detailObj.value.startDate === detailObj.value.endDate) {
      return detailObj.value.startDate;
    }
    return `${detailObj.value.startDate} 至 ${detailObj.value.endDate}`;
  }
  return '-';
});

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
  <DetailDrawer :title="title || `运维效率详情 - ${detailObj.maintainer} ${detailObj.areaName}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">时间范围:</div>
        <div class="detail-row-right">{{ dateRangeDisplay }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">运维人员:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.maintainer }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.areaName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.orderType === '设备维修' ? 'danger' :
                   detailObj.orderType === '设备巡检' ? 'success' :
                   detailObj.orderType === '设备保养' ? 'primary' :
                   detailObj.orderType === '故障处理' ? 'warning' : 'info'"
            size="small"
          >
            {{ detailObj.orderType }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总工单数:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.totalWorkorder }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">已完成数:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.completedWorkorder }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">进行中:</div>
        <div class="detail-row-right">
          <el-tag type="warning" size="small">
            {{ detailObj.inProgressWorkorder }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">待处理:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.pendingWorkorder }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时数:</div>
        <div class="detail-row-right">
          <el-tag type="danger" size="small">
            {{ detailObj.overtimeCount }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">闭环率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.closedRate) > 95 ? 'success' :
                   parseFloat(detailObj.closedRate) > 90 ? 'primary' :
                   parseFloat(detailObj.closedRate) > 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.closedRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.overtimeRate) < 3 ? 'success' :
                   parseFloat(detailObj.overtimeRate) < 6 ? 'primary' :
                   parseFloat(detailObj.overtimeRate) < 10 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.overtimeRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均处置时长:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.avgDisposalDuration) < 3 ? 'success' :
                   parseFloat(detailObj.avgDisposalDuration) < 5 ? 'primary' :
                   parseFloat(detailObj.avgDisposalDuration) < 7 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.avgDisposalDuration }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均响应时长:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.avgResponseDuration) < 25 ? 'success' :
                   parseFloat(detailObj.avgResponseDuration) < 35 ? 'primary' :
                   parseFloat(detailObj.avgResponseDuration) < 45 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.avgResponseDuration }}
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
