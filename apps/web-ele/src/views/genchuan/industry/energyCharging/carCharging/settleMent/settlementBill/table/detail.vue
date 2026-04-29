<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（设备监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用设备编号）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用自定义标题，兜底显示结算单编号
const drawerTitle = computed(() => {
  const billCode = detailObj.value?.billCode || '结算单';
  return title.value || `${billCode}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750, // 加宽抽屉适配更多字段
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 结算单基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">结算单编号:</div>
        <div class="detail-row-right">{{ detailObj.billCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">合作方名称:</div>
        <div class="detail-row-right">{{ detailObj.cooperator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">结算周期:</div>
        <div class="detail-row-right">
          {{ detailObj.settlementCycle || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总结算金额:</div>
        <div class="detail-row-right">
          {{ detailObj.settlementAmount || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">分账结算金额:</div>
        <div class="detail-row-right">{{ detailObj.sharingAmount || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">结算状态:</div>
        <div class="detail-row-right">{{ detailObj.billStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审核人员:</div>
        <div class="detail-row-right">{{ detailObj.auditUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审核时间:</div>
        <div class="detail-row-right">{{ detailObj.auditTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审核备注:</div>
        <div class="detail-row-right">{{ detailObj.auditRemark || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">结算时间:</div>
        <div class="detail-row-right">
          {{ detailObj.settlementTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">结算渠道:</div>
        <div class="detail-row-right">
          {{ detailObj.settlementChannel || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">备注:</div>
        <div class="detail-row-right">{{ detailObj.remark || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }

  .detail-card {
    max-height: 60vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 450px; // 适配新字段数量
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
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
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  flex-shrink: 0; // 不收缩
  width: 120px; // 固定宽度，保证所有标签对齐
  font-size: 14px;
  font-weight: 500; // 加粗突出标签
  line-height: 18px; // 统一行高
  color: #606266; // 灰色调，区分内容
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133; // 主文本色
  word-break: break-all; // 处理长文本换行（如内容、链接）
}

// 长文本内容样式
.content-text {
  padding: 8px 0;
  line-height: 1.6; // 增大行高，提升长文本可读性
  white-space: pre-wrap; // 保留空白和换行
}

// 整改佐证证据链接样式
.evidence-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #66b1ff;
  }
}

// 滚动条样式优化
.detail-card::-webkit-scrollbar {
  width: 6px;
}

.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
} // 详情卡片整体样式
</style>
