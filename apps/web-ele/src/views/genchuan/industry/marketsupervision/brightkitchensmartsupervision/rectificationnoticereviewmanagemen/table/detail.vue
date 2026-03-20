<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 引入时间格式化工具（根据项目实际路径调整）
import { formatTimestamp } from '#/utils';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（整改通知书复审台账数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用台账编号）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用台账编号，兜底显示默认值
const drawerTitle = computed(() => {
  const ledgerCode = detailObj.value?.ledgerCode || '整改通知书复审台账';
  return title.value || `${ledgerCode}详情`;
});

// 解析违规证据链接（JSON字符串转数组）
const evidenceList = computed(() => {
  if (!detailObj.value?.evidenceUrl) return [];
  try {
    return JSON.parse(detailObj.value.evidenceUrl);
  } catch (error) {
    console.error('解析违规证据链接失败：', error);
    return [];
  }
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750, // 加宽抽屉适配更多台账字段
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
      <!-- 整改通知书复审台账基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">台账编号:</div>
        <div class="detail-row-right">{{ detailObj.ledgerCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">企业ID:</div>
        <div class="detail-row-right">{{ detailObj.entId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规类型ID:</div>
        <div class="detail-row-right">{{ detailObj.illegalTypeId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规等级ID:</div>
        <div class="detail-row-right">
          {{ detailObj.illegalLevelId || '-' }}
        </div>
      </div>

      <!-- 核心修改：违规证据链接（图片展示+文件打开新窗口） -->
      <div class="detail-card-row">
        <div class="detail-row-left">违规证据链接:</div>
        <div class="detail-row-right">
          <!-- 无证据时显示 -->
          <span v-if="evidenceList.length === 0">-</span>

          <!-- 有证据时：图片+文件分开展示 -->
          <div v-else class="evidence-container">
            <!-- 图片直接展示 -->
            <div
              class="evidence-image-item"
              v-for="(item, index) in evidenceList.filter(
                (i) => i.type === 'image',
              )"
              :key="`img-${index}`"
            >
              <img
                :src="item.url"
                :alt="item.name"
                class="evidence-img"
                title="点击查看原图"
                @click="window.open(item.url, '_blank')"
              />
              <span class="evidence-name">{{ item.name }}</span>
            </div>

            <!-- 文件点击打开新窗口（修改后的逻辑） -->
            <a
              class="evidence-file-item"
              v-for="(item, index) in evidenceList.filter(
                (i) => i.type === 'file',
              )"
              :key="`file-${index}`"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              📁 {{ item.name }} (点击查看/下载)
            </a>
          </div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">草拟时间:</div>
        <div class="detail-row-right">
          {{ detailObj.draftTime ? formatTimestamp(detailObj.draftTime) : '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审状态:</div>
        <div class="detail-row-right">{{ detailObj.reviewStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审人ID:</div>
        <div class="detail-row-right">{{ detailObj.reviewerId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.reviewTime ? formatTimestamp(detailObj.reviewTime) : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">撤销时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.cancelTime ? formatTimestamp(detailObj.cancelTime) : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">撤销原因ID:</div>
        <div class="detail-row-right">
          {{ detailObj.cancelReasonId || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">执法复审台账编号:</div>
        <div class="detail-row-right">{{ detailObj.lawLedgerCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.updateTime ? formatTimestamp(detailObj.updateTime) : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新人:</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
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
  min-height: 450px; // 增加最小高度适配台账字段数量
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
  width: 120px; // 固定宽度，保证所有标签对齐
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
  word-break: break-all; // 处理长文本换行（如链接）
  padding-right: 10px;
}

// 新增：违规证据容器样式
.evidence-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

// 新增：图片项样式
.evidence-image-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  .evidence-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.02);
      border-color: #409eff;
    }
  }

  .evidence-name {
    font-size: 13px;
    color: #666;
  }
}

// 新增：文件项样式
.evidence-file-item {
  display: inline-block;
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
  line-height: 24px;

  &:hover {
    color: #66b1ff;
    text-decoration: underline;
  }
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

  .evidence-img {
    width: 60px !important;
    height: 60px !important;
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
</style>
