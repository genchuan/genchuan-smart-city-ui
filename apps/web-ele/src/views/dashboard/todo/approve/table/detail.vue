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
  // 抽屉标题（可选，默认使用详情对象的approveTitle）
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
  <DetailDrawer :title="title || `审批详情 - ${detailObj.approveTitle}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">审批标题:</div>
        <div class="detail-row-right">{{ detailObj.approveTitle }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">业务类型:</div>
        <div class="detail-row-right">{{ detailObj.businessType }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">申请人:</div>
        <div class="detail-row-right">{{ detailObj.applicant }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">申请人部门:</div>
        <div class="detail-row-right">{{ detailObj.applicantDept || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">申请时间:</div>
        <div class="detail-row-right">{{ detailObj.applyTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">紧急程度:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.emergencyDegree === '紧急' ? 'danger' :
                   detailObj.emergencyDegree === '高' ? 'warning' :
                   detailObj.emergencyDegree === '中' ? 'primary' : 'info'"
            size="small"
          >
            {{ detailObj.emergencyDegree }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">截止审批时间:</div>
        <div class="detail-row-right">{{ detailObj.deadline }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审批状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.approveStatus === '待审批' ? 'info' :
                   detailObj.approveStatus === '处理中' ? 'primary' :
                   detailObj.approveStatus === '已完成' ? 'success' :
                   detailObj.approveStatus === '已驳回' ? 'danger' :
                   detailObj.approveStatus === '已撤回' ? 'warning' : 'info'"
            size="small"
          >
            {{ detailObj.approveStatus }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前节点:</div>
        <div class="detail-row-right">{{ detailObj.currentNode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审批人:</div>
        <div class="detail-row-right">{{ detailObj.approver || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审批结果:</div>
        <div class="detail-row-right">
          <el-tag
            v-if="detailObj.approveResult"
            :type="detailObj.approveResult === '同意' ? 'success' : 'danger'"
            size="small"
          >
            {{ detailObj.approveResult }}
          </el-tag>
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审批时间:</div>
        <div class="detail-row-right">{{ detailObj.approveTime || '-' }}</div>
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
        <div class="detail-row-left">审批意见:</div>
        <div class="detail-row-right">{{ detailObj.opinion || '-' }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.rejectReason">
        <div class="detail-row-left">驳回理由:</div>
        <div class="detail-row-right" style="color: #f56c6c;">{{ detailObj.rejectReason }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审批描述:</div>
        <div class="detail-row-right">{{ detailObj.description }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最新动态:</div>
        <div class="detail-row-right">{{ detailObj.latestDynamic || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">提交次数:</div>
        <div class="detail-row-right">{{ detailObj.submitCount || '1' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联业务:</div>
        <div class="detail-row-right">{{ detailObj.businessName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">业务状态:</div>
        <div class="detail-row-right">{{ detailObj.businessStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审批流程:</div>
        <div class="detail-row-right">{{ detailObj.approveFlow || '-' }}</div>
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
