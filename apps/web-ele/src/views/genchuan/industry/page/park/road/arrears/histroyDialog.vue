<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 停车欠费基础信息对象（车牌、总欠费、订单数等）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 新增：停车欠费明细数组（对应模拟的4条数据）
  arrearList: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const { detailObj, arrearList } = toRefs(props);

// 计算属性处理标题，优先使用车牌号码，兜底显示默认值
const drawerTitle = computed(() => {
  const plateNo = detailObj.value?.plateNo || '停车欠费';
  return `${plateNo}详情`;
});

// 初始化抽屉实例（优化层级配置，避免被覆盖）
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

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle" class="parking-arrears-detail-drawer">
    <div class="detail-card">
      <!-- 停车欠费核心基础信息（原有字段） -->
      <div class="detail-card-section">
        <div class="detail-section-title">基础信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">车牌号码:</div>
          <div class="detail-row-right">{{ detailObj.plateNo || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">欠费金额:</div>
          <div class="detail-row-right">
            {{
              detailObj.arrearsAmount
                ? `¥${Number(detailObj.arrearsAmount).toFixed(2)}`
                : '-'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">欠费订单数:</div>
          <div class="detail-row-right">
            {{ arrearList.length || detailObj.arrearsOrderCount || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">片区:</div>
          <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
        </div>
      </div>

      <!-- 新增：停车欠费明细列表（渲染模拟的4条数据） -->
      <div class="detail-card-section" v-if="arrearList.length > 0">
        <div class="detail-section-title">欠费明细</div>
        <!-- 明细表头 -->
        <div class="detail-list-header">
          <div class="list-header-item">停车地址</div>
          <div class="list-header-item">欠费金额</div>
          <div class="list-header-item">停车时长</div>
          <div class="list-header-item">停车时间段</div>
        </div>
        <!-- 明细列表渲染 -->
        <div class="detail-list-body">
          <div
            class="detail-list-row"
            v-for="(item, index) in arrearList"
            :key="index"
          >
            <div class="list-body-item">{{ item.address || '-' }}</div>
            <div class="list-body-item">
              ¥{{ Number(item.arrearsAmount).toFixed(2) }}
            </div>
            <div class="list-body-item">{{ item.time || '-' }}</div>
            <div class="list-body-item">{{ item.allTime || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式（适配停车欠费字段）
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px; // 提升最小高度，适配基础信息+明细列表
  max-height: 70vh; // 限制最大高度，避免溢出
  overflow-y: auto; // 内容过多时滚动
}

// 新增：分区标题样式
.detail-card-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .detail-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2329;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;
  }
}

// 每行的布局（基础信息）
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐
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

// 左侧标签样式（固定宽度保证对齐）
.detail-row-left {
  width: 120px; // 适配停车欠费字段标签宽度
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 24px; // 提升行高，优化阅读体验
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 24px; // 提升行高
  word-break: break-all; // 处理长文本换行
  padding-right: 10px;
  white-space: pre-line; // 保留换行符（如有）
}

// 新增：明细列表样式
.detail-list-header {
  display: flex;
  background-color: #f5f7fa;
  border-radius: 4px 4px 0 0;
  padding: 12px;

  .list-header-item {
    flex: 1;
    text-align: left;
    font-weight: 500;
    color: #606266;
    font-size: 13px;
  }
}

.detail-list-body {
  border: 1px solid #f0f0f0;
  border-top: none;
  border-radius: 0 0 4px 4px;

  .detail-list-row {
    display: flex;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #fafbfc;
    }

    .list-body-item {
      flex: 1;
      text-align: left;
      color: #303133;
      font-size: 13px;
      line-height: 20px;
      word-break: break-all;
    }
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

  // 响应式下明细列表换行优化
  .detail-list-header,
  .detail-list-row {
    flex-wrap: wrap;

    .list-header-item,
    .list-body-item {
      flex: 0 0 50%;
      margin-bottom: 8px;

      &:nth-child(odd) {
        font-weight: 500;
        color: #606266;
      }
    }
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
