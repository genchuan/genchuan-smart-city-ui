<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 引入时间格式化工具（根据项目实际路径调整）
import { formatTimestamp } from '#/utils';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（AI告警消息数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用平台告警ID）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用平台告警ID，兜底显示默认值
const drawerTitle = computed(() => {
  const alertId = detailObj.value?.alertId || 'AI告警消息';
  return title.value || `${alertId}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽抽屉适配更多告警字段
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 格式化用户ID列表（JSON数组转字符串）
const formatUserIds = (userIds) => {
  if (!userIds) return '-';
  try {
    // 兼容JSON字符串和数组格式
    const ids = typeof userIds === 'string' ? JSON.parse(userIds) : userIds;
    return Array.isArray(ids) ? ids.join('，') : userIds;
  } catch {
    return userIds;
  }
};

// 格式化JSON参数（美化展示）
const formatAlertParams = (params) => {
  if (!params) return '-';
  try {
    const json = typeof params === 'string' ? JSON.parse(params) : params;
    return JSON.stringify(json, null, 2);
  } catch {
    return params;
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
      <!-- AI告警消息基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备关联用户ID列表:</div>
        <div class="detail-row-right">
          {{ formatUserIds(detailObj.userIds) }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">场景实例ID:</div>
        <div class="detail-row-right">{{ detailObj.sceneId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">功能算法编码:</div>
        <div class="detail-row-right">{{ detailObj.aiAbilityCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">告警类型:</div>
        <div class="detail-row-right">{{ detailObj.alertType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">消息产生时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.alertCreateTime
              ? formatTimestamp(detailObj.alertCreateTime)
              : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备编码:</div>
        <div class="detail-row-right">{{ detailObj.deviceCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">功能标识:</div>
        <div class="detail-row-right">{{ detailObj.featureId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">消息来源:</div>
        <div class="detail-row-right">{{ detailObj.alertSource || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">图片地址:</div>
        <div class="detail-row-right">
          <a
            v-if="detailObj.srcUrl"
            :href="detailObj.srcUrl"
            target="_blank"
            class="evidence-link"
          >
            点击查看图片
          </a>
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">图片刷新token:</div>
        <div class="detail-row-right">{{ detailObj.srcToken || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备手机号:</div>
        <div class="detail-row-right">{{ detailObj.deviceAccount || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">消息版本:</div>
        <div class="detail-row-right">{{ detailObj.msgVersion || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平台告警ID:</div>
        <div class="detail-row-right">{{ detailObj.alertId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">AI平台消息ID:</div>
        <div class="detail-row-right">
          {{ detailObj.aiPlatformMsgId || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">检测框:</div>
        <div class="detail-row-right">{{ detailObj.boxType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">重复告警:</div>
        <div class="detail-row-right">{{ detailObj.repeatAlarm || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">离岗时间:</div>
        <div class="detail-row-right">{{ detailObj.leaveTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">结束时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.times10End ? formatTimestamp(detailObj.times10End) : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">间隔时间:</div>
        <div class="detail-row-right">{{ detailObj.intervalTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">完整告警参数JSON:</div>
        <div class="detail-row-right">
          <pre class="json-text">{{
            formatAlertParams(detailObj.alertParams)
          }}</pre>
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
  min-height: 600px; // 适配更多告警字段
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
  overflow-y: auto; // 内容过多时显示滚动条
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
  width: 140px; // 加宽标签宽度，适配长字段名
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
  word-break: break-all; // 处理长文本换行（如链接、JSON）
  padding-right: 10px;
}

// 图片链接样式
.evidence-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #66b1ff;
  }
}

// JSON参数文本样式
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
    width: 120px;
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
