<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（企业风险报告）
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题
const drawerTitle = computed(() => {
  const reportNo = detailObj.value?.reportNumber || '企业风险报告';
  return title.value || `${reportNo} 详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
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
      <!-- 企业风险报告 月度详情字段 -->
      <div class="detail-card-row">
        <div class="detail-row-left">报告编号:</div>
        <div class="detail-row-right">
          {{ detailObj.reportNumber || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计月份:</div>
        <div class="detail-row-right">
          {{ detailObj.statMonth || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计区域:</div>
        <div class="detail-row-right">
          {{ detailObj.statArea || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">企业类型分布:</div>
        <div class="detail-row-right">
          {{ detailObj.entTypeDist || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">本月总告警次数:</div>
        <div class="detail-row-right">
          {{ detailObj.monthWarnCount || 0 }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">本月违规企业数量:</div>
        <div class="detail-row-right">
          {{ detailObj.monthIllegalEntCount || 0 }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">高频违规类型:</div>
        <div class="detail-row-right">
          {{ detailObj.highIllegalType || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">区域违规排名:</div>
        <div class="detail-row-right">
          {{ detailObj.areaIllegalRank || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">企业类型违规分布:</div>
        <div class="detail-row-right">
          {{ detailObj.entTypeIllegalDist || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">同比告警变化率:</div>
        <div class="detail-row-right">{{ detailObj.warnChangeYoy || 0 }} %</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">环比告警变化率:</div>
        <div class="detail-row-right">{{ detailObj.warnChangeMom || 0 }} %</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">本月整改完成率:</div>
        <div class="detail-row-right">
          {{ detailObj.monthRectifyRate || 0 }} %
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">本月设备正常率:</div>
        <div class="detail-row-right">
          {{ detailObj.monthDeviceNormalRate || 0 }} %
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 150px;
  }

  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 650px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
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
  flex-shrink: 0;
  width: 160px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
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
