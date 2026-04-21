<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { formatTimestamp } from '#/utils';

// 定义组件接收的属性
const props = defineProps({
  // 整改通知书复审台账详情数据对象
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

// 计算整改逾期状态
const isOverdue = computed(() => {
  if (!detailObj.value?.rectifyDeadlineTime) return false;
  const deadline = new Date(detailObj.value.rectifyDeadlineTime).getTime();
  const now = Date.now();
  return now > deadline;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
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
        <div class="detail-row-left">企业名称:</div>
        <div class="detail-row-right">{{ detailObj.entName || '-' }}</div>
      </div> 
      <div class="detail-card-row">
        <div class="detail-row-left">违规类型名称:</div>
        <div class="detail-row-right">
          {{ detailObj.illegalTypeName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规等级:</div>
        <div class="detail-row-right">
          {{ detailObj.illegalLevelName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规证据链接:</div>
        <div class="detail-row-right">
          <span v-if="evidenceList.length === 0">-</span>
          <div v-else class="evidence-container">
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
            </div>
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
        <div class="detail-row-left">整改截止时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.rectifyDeadlineTime
              ? formatTimestamp(detailObj.rectifyDeadlineTime)
              : '-'
          }}
          <el-tag
            size="mini"
            :type="isOverdue ? 'danger' : 'success'"
            class="overdue-tag"
          >
            {{ isOverdue ? '已逾期' : '未逾期' }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审状态:</div>
        <div class="detail-row-right">{{ detailObj.reviewStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审人:</div>
        <div class="detail-row-right">
          {{ detailObj.reviewUserName || '-' }}
        </div>
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
        <div class="detail-row-left">下发时间:</div>
        <div class="detail-row-right">
          {{ detailObj.issueTime ? formatTimestamp(detailObj.issueTime) : '-' }}
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
        <div class="detail-row-left">撤销原因:</div>
        <div class="detail-row-right">{{ detailObj.cancelReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">送达状态:</div>
        <div class="detail-row-right">{{ detailObj.receiveStatus || '-' }}</div>
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
  position: relative;
}

// 逾期标签样式
.overdue-tag {
  margin-left: 8px;
  vertical-align: middle;
}

// 违规证据容器样式
.evidence-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

// 图片项样式
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

// 文件项样式
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
