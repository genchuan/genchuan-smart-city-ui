<!-- detail.vue - 排班详情 -->
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
  // 抽屉标题（可选，默认使用详情对象的scheduleId）
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
  <DetailDrawer :title="title || `排班详情 - ${detailObj.scheduleId}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">排班ID:</div>
        <div class="detail-row-right">{{ detailObj.scheduleId }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">值班日期:</div>
        <div class="detail-row-right">{{ detailObj.scheduleDate }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">值班时段:</div>
        <div class="detail-row-right">{{ detailObj.shiftTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">值班岗位:</div>
        <div class="detail-row-right">{{ detailObj.post }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">值班地点:</div>
        <div class="detail-row-right">{{ detailObj.location }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">同岗人员:</div>
        <div class="detail-row-right">{{ detailObj.coWorkers || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">排班状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="
              detailObj.scheduleStatus === '正常'
                ? 'success'
                : detailObj.scheduleStatus === '换班中'
                  ? 'warning'
                  : detailObj.scheduleStatus === '已换班'
                    ? 'primary'
                    : 'info'
            "
            size="small"
          >
            {{ detailObj.scheduleStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">交接状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="
              detailObj.handoverStatus === '已交接'
                ? 'success'
                : detailObj.handoverStatus === '未交接'
                  ? 'info'
                  : 'warning'
            "
            size="small"
          >
            {{ detailObj.handoverStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">值班要求:</div>
        <div class="detail-row-right">
          {{ detailObj.dutyRequirement || '-' }}
        </div>
      </div>
      <div class="detail-card-row" v-if="detailObj.handoverTime">
        <div class="detail-row-left">交接时间:</div>
        <div class="detail-row-right">{{ detailObj.handoverTime }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.receiver">
        <div class="detail-row-left">接收人:</div>
        <div class="detail-row-right">{{ detailObj.receiver }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.keyWork">
        <div class="detail-row-left">重点工作:</div>
        <div class="detail-row-right">{{ detailObj.keyWork }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.unfinished">
        <div class="detail-row-left">未完成事项:</div>
        <div class="detail-row-right">{{ detailObj.unfinished }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.alarmDeal">
        <div class="detail-row-left">预警处置情况:</div>
        <div class="detail-row-right">{{ detailObj.alarmDeal }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.deviceStatus">
        <div class="detail-row-left">设备运行状态:</div>
        <div class="detail-row-right">{{ detailObj.deviceStatus }}</div>
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
      <div class="detail-card-row" v-if="detailObj.handoverLogId">
        <div class="detail-row-left">交接日志ID:</div>
        <div class="detail-row-right">{{ detailObj.handoverLogId }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.submitTime">
        <div class="detail-row-left">提交时间:</div>
        <div class="detail-row-right">{{ detailObj.submitTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
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
