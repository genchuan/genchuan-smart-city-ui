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
  // 抽屉标题（可选，默认使用详情对象的planId）
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
  <DetailDrawer :title="title || `巡检计划详情 - ${detailObj.planId}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">计划ID:</div>
        <div class="detail-row-right">{{ detailObj.planId }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">计划名称:</div>
        <div class="detail-row-right">{{ detailObj.planName }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">巡检类型:</div>
        <div class="detail-row-right">{{ detailObj.taskType }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">巡检范围:</div>
        <div class="detail-row-right">
          {{ detailObj.inspectionRange || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">巡检频次:</div>
        <div class="detail-row-right">
          <el-tag
            :type="
              detailObj.frequency === '日'
                ? 'danger'
                : detailObj.frequency === '周'
                  ? 'warning'
                  : detailObj.frequency === '月'
                    ? 'primary'
                    : 'info'
            "
            size="small"
          >
            {{ detailObj.frequency }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">计划周期:</div>
        <div class="detail-row-right">{{ detailObj.planCycle || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人:</div>
        <div class="detail-row-right">{{ detailObj.chargeBy || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">计划状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="
              detailObj.planStatus === '未开始'
                ? 'info'
                : detailObj.planStatus === '执行中'
                  ? 'primary'
                  : detailObj.planStatus === '已完成'
                    ? 'success'
                    : detailObj.planStatus === '已取消'
                      ? 'warning'
                      : 'info'
            "
            size="small"
          >
            {{ detailObj.planStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前进度:</div>
        <div class="detail-row-right">
          {{ detailObj.currentProgress || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">任务数量:</div>
        <div class="detail-row-right">{{ detailObj.taskCount || '0' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">已完成任务:</div>
        <div class="detail-row-right">{{ detailObj.finishCount || '0' }}</div>
      </div>
      <div v-if="detailObj.executeTime" class="detail-card-row">
        <div class="detail-row-left">执行时间:</div>
        <div class="detail-row-right">{{ detailObj.executeTime }}</div>
      </div>
      <div v-if="detailObj.executeBy" class="detail-card-row">
        <div class="detail-row-left">执行人:</div>
        <div class="detail-row-right">{{ detailObj.executeBy }}</div>
      </div>
      <div v-if="detailObj.executeDuration" class="detail-card-row">
        <div class="detail-row-left">执行时长:</div>
        <div class="detail-row-right">{{ detailObj.executeDuration }}</div>
      </div>
      <div v-if="detailObj.submitTime" class="detail-card-row">
        <div class="detail-row-left">提交时间:</div>
        <div class="detail-row-right">{{ detailObj.submitTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">发现问题数:</div>
        <div class="detail-row-right">{{ detailObj.problemCount || '0' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">问题已处置:</div>
        <div class="detail-row-right">
          {{ detailObj.problemFinishCount || '0' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">巡检地点:</div>
        <div class="detail-row-right">{{ detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">计划描述:</div>
        <div class="detail-row-right">{{ detailObj.description || '-' }}</div>
      </div>
      <div v-if="detailObj.reviewOpinion" class="detail-card-row">
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
