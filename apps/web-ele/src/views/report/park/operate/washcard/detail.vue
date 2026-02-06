<!-- washcard/detail.vue -->
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
  // 抽屉标题（可选，默认使用详情对象的areaName和cardName）
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
  <DetailDrawer :title="title || `洗车卡详情 - ${detailObj.areaName} ${detailObj.cardName}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计日期:</div>
        <div class="detail-row-right">{{ detailObj.statDate }}</div>
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
        <div class="detail-row-left">洗车卡类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.cardName === '月卡' ? 'success' :
                   detailObj.cardName === '季卡' ? 'warning' :
                   detailObj.cardName === '年卡' ? 'primary' : 'info'"
            size="small"
          >
            {{ detailObj.cardName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">卡片状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.cardStatus === '正常' ? 'success' :
                   detailObj.cardStatus === '已过期' ? 'danger' : 'warning'"
            size="small"
          >
            {{ detailObj.cardStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">发放总数:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.totalIssue }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">使用次数:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.usedCount }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">未使用数:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.unusedCount > 50 ? 'danger' : detailObj.unusedCount > 20 ? 'warning' : 'primary'"
            size="small"
          >
            {{ detailObj.unusedCount }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">已过期数:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.expiredCount > 10 ? 'danger' : detailObj.expiredCount > 5 ? 'warning' : 'success'"
            size="small"
          >
            {{ detailObj.expiredCount }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">兑换率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.redemptionRate > 80 ? 'success' :
                   detailObj.redemptionRate > 60 ? 'primary' :
                   detailObj.redemptionRate > 40 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.redemptionRate }}%
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
