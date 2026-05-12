<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElTag } from 'element-plus';

// 追缴配置状态映射
const statusMap = {
  inactive: { label: '未生效', type: 'info' },
  active: { label: '已生效', type: 'success' },
};

// 追缴方式映射
const collectMethodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 获取追缴方式标签
const getCollectMethodLabel = (method) => {
  return collectMethodMap[method]?.label || method;
};

// 获取追缴方式类型
const getCollectMethodType = (method) => {
  return collectMethodMap[method]?.type || 'default';
};

// 追缴配置详情
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

const { detailObj, title } = toRefs(props);

// 标题
const drawerTitle = computed(() => {
  const configNo = detailObj.value?.configNo || '追缴配置';
  return title.value || `${configNo} 详情`;
});

// 抽屉
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

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">配置编号:</div>
        <div class="detail-row-right">{{ detailObj.configNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">追缴方式:</div>
        <div class="detail-row-right">
          <ElTag :type="getCollectMethodType(detailObj.collectMethod)">
            {{ getCollectMethodLabel(detailObj.collectMethod) }}
          </ElTag>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">推送模板ID:</div>
        <div class="detail-row-right">{{ detailObj.templateId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">推送频次（小时）:</div>
        <div class="detail-row-right">{{ detailObj.pushFrequency || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">状态:</div>
        <div class="detail-row-right">
          <ElTag :type="getStatusType(detailObj.status)">
            {{ getStatusLabel(detailObj.status) }}
          </ElTag>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">配置说明:</div>
        <div class="detail-row-right">{{ detailObj.remark || '-' }}</div>
      </div>
 
      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新者:</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
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

.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    padding: 12px 8px;
    margin: 0 -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 160px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  font-size: 14px;
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