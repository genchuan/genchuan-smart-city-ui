<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 引入时间格式化工具（根据项目实际路径调整）
import { formatTimestamp } from '#/utils';

// 定义组件接收的属性
const props = defineProps({
  // 审计记录详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用审计记录ID）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用审计记录ID，兜底显示默认值
const drawerTitle = computed(() => {
  const auditId = detailObj.value?.id || '审计记录';
  return title.value || `${auditId}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 700,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 格式化批量操作信息（JSON字符串美化）
const formatBatchSelectInfo = (info) => {
  if (!info) return '-';
  try {
    const json = typeof info === 'string' ? JSON.parse(info) : info;
    return JSON.stringify(json, null, 2);
  } catch {
    return info;
  }
};

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 审计记录基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">审计记录ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人ID:</div>
        <div class="detail-row-right">{{ detailObj.operUserId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人姓名:</div>
        <div class="detail-row-right">{{ detailObj.operUserName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作时间:</div>
        <div class="detail-row-right">
          {{ detailObj.operTime ? formatTimestamp(detailObj.operTime) : '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作类型:</div>
        <div class="detail-row-right">{{ detailObj.operType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作对象:</div>
        <div class="detail-row-right">{{ detailObj.operObject || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作结果:</div>
        <div class="detail-row-right">{{ detailObj.operResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">批量操作信息:</div>
        <div class="detail-row-right">
          <pre class="json-text">{{
            formatBatchSelectInfo(detailObj.batchSelectInfo)
          }}</pre>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作IP地址:</div>
        <div class="detail-row-right">{{ detailObj.operIp || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作描述:</div>
        <div class="detail-row-right">{{ detailObj.operDesc || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">记录创建时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-'
          }}
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
  min-height: 500px;
  max-height: 70vh;
  overflow-y: auto;
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
}

// JSON文本样式
.json-text {
  width: 100%;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #333;
  overflow-x: auto;
  margin: 4px 0 0 0;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
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
}

// JSON文本滚动条优化
.json-text::-webkit-scrollbar {
  height: 6px;
}
.json-text::-webkit-scrollbar-track {
  background: #e9e9e9;
  border-radius: 3px;
}
.json-text::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
</style>
