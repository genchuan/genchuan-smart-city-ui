<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const objName = detailObj.value?.name || '规则分类';
  return title.value || `${objName}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() {
    detailDrawerApi.close();
  },
  async onOpenChange() {},
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <!-- 整体滚动容器（避免多个卡片各自滚动） -->
    <div class="detail-scroll-container">
      <!-- 基本信息卡片 -->
      <div class="detail-card">
        <h3 class="detail-card-title">基本信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">规则分类名称：</div>
          <div class="detail-row-right">{{ detailObj.name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">适用指标体系：</div>
          <div class="detail-row-right">{{ detailObj.systemName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">规则项数量：</div>
          <div class="detail-row-right">{{ detailObj.itemCount || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">否决项数量：</div>
          <div class="detail-row-right">{{ detailObj.vetoCount || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">状态：</div>
          <div class="detail-row-right">{{ detailObj.statusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建人：</div>
          <div class="detail-row-right">{{ detailObj.createByName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间：</div>
          <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">变更日志：</div>
          <div class="detail-row-right">{{ detailObj.changeLog || '-' }}</div>
        </div>
      </div>

      <!-- 规则项列表卡片 -->
      <div v-if="detailObj.ruleItems?.length" class="detail-card">
        <h3 class="detail-card-title">规则项列表</h3>
        <div class="detail-table-wrapper">
          <table class="detail-table">
            <thead>
            <tr>
              <th>规则项名称</th>
              <th>关联指标项</th>
              <th>评分逻辑</th>
              <th>满分值</th>
              <th>规则类型</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in detailObj.ruleItems" :key="item.ruleItemId">
              <td>{{ item.name || '-' }}</td>
              <td>{{ item.indexName || '-' }}</td>
              <td>{{ item.scoreLogic || '-' }}</td>
              <td>{{ item.fullScore || '-' }}</td>
              <td>{{ item.ruleTypeName || '-' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 否决项列表卡片 -->
      <div v-if="detailObj.vetoItems?.length" class="detail-card">
        <h3 class="detail-card-title">否决项列表</h3>
        <div class="detail-table-wrapper">
          <table class="detail-table">
            <thead>
            <tr>
              <th>否决项名称</th>
              <th>适用对象类型</th>
              <th>否决条件</th>
              <th>生效周期</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in detailObj.vetoItems" :key="item.vetoItemId">
              <td>{{ item.name || '-' }}</td>
              <td>{{ item.objectTypeName || '-' }}</td>
              <td>{{ item.condition || '-' }}</td>
              <td>{{ item.validCycle || '-' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
/* 滚动容器：使所有卡片统一滚动，避免每个卡片独立滚动条 */
.detail-scroll-container {
  max-height: calc(70vh - 20px);
  overflow-y: auto;
  padding: 4px; /* 为滚动条留出一点空间，避免 hover 时被遮挡 */
}

/* 卡片样式（完全复用评价对象示例） */
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

/* 卡片标题（新增，保持简洁） */
.detail-card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2f3d;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

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

.detail-row-left {
  width: 140px !important;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}

/* 表格包装器：使表格在卡片内也有适当间距 */
.detail-table-wrapper {
  margin-top: 10px;
  overflow-x: auto;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ebeef5;
  }

  th {
    background-color: #f2f6fc;
    font-weight: 500;
    color: #1f2f3d;
  }

  tr:hover {
    background-color: #f5f7fa;
  }
}

/* 滚动条样式（同评价对象示例） */
.detail-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.detail-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.detail-scroll-container::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.detail-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
  .detail-card {
    padding: 15px;
  }
}
</style>
