<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const objName = detailObj.value?.name || '任务模板';
  return title.value || `${objName}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel() { detailDrawerApi.close(); },
  async onOpenChange() {},
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <h3>基本信息</h3>
      <div class="detail-card-row"><div class="detail-row-left">模板编码：</div><div class="detail-row-right">{{ detailObj.code || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">适用对象类型：</div><div class="detail-row-right">{{ detailObj.objectTypeName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">关联指标体系：</div><div class="detail-row-right">{{ detailObj.systemName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">评价主体：</div><div class="detail-row-right">{{ detailObj.subjectName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">任务周期：</div><div class="detail-row-right">{{ detailObj.cycleTypeName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">描述信息：</div><div class="detail-row-right">{{ detailObj.desc || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">状态：</div><div class="detail-row-right">
        <el-tag :type="detailObj.statusName === '启用' ? 'success' : 'danger'" size="small">{{ detailObj.statusName }}</el-tag>
      </div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建人：</div><div class="detail-row-right">{{ detailObj.createByName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row" v-if="detailObj.lastUseTime"><div class="detail-row-left">最近使用时间：</div><div class="detail-row-right">{{ detailObj.lastUseTime }}</div></div>
      <div class="detail-card-row" v-if="detailObj.useCount !== undefined"><div class="detail-row-left">使用次数：</div><div class="detail-row-right">{{ detailObj.useCount }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">变更日志：</div><div class="detail-row-right">{{ detailObj.changeLog || '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
  h3 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    border-left: 4px solid #409eff;
    padding-left: 12px;
  }
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
  width: 140px;
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

@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
  }
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
