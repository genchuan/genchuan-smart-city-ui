<script setup>
import {computed, defineProps, toRefs} from 'vue';

import {useVbenDrawer} from '@vben/common-ui';

// 定义组件接收的属性（环卫管理报表）
const props = defineProps({
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

const {detailObj, title} = toRefs(props);

// 标题自动处理
const drawerTitle = computed(() => {
  const reportName = detailObj.value?.reportName || '自定义报表';
  return title.value || `${reportName} 详情`;
});

// 抽屉配置
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {
  },
  async onOpenChange() {
  },
});

// 暴露方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">报表名称:</div>
        <div class="detail-row-right">
          {{ detailObj.reportName || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计时间范围:</div>
        <div class="detail-row-right">
          {{ detailObj.timeRange || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计区域:</div>
        <div class="detail-row-right">
          {{ detailObj.area || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">业务模块:</div>
        <div class="detail-row-right">
          {{ detailObj.businessModule || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计指标:</div>
        <div class="detail-row-right">
          {{ detailObj.indicators || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建人:</div>
        <div class="detail-row-right">
          {{ detailObj.createBy || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{ detailObj.createTime || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">报表状态:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.status === '已生成' ? 'success' : (detailObj.status === '生成中' ? 'warning' : (detailObj.status === '生成失败' ? 'danger' : 'info'))"
            size="small"
          >
            {{ detailObj.status || '-' }}
          </el-tag>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">数据记录数:</div>
        <div class="detail-row-right">
          {{ detailObj.dataCount ?? 0 }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">核心指标汇总:</div>
        <div class="detail-row-right">
          {{ detailObj.coreIndicatorSummary || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 750px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
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
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 200px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}

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
