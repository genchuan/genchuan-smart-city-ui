<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const objName = detailObj.value?.name || '评价主体';
  return title.value || `${objName}详情`;
});

// 计算成员姓名列表字符串（基于 memberList 数组）
const memberNames = computed(() => {
  const list = detailObj.value?.memberList;
  if (list && list.length > 0) {
    return list.map(m => m.userName).join('、');
  }
  return '-';
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() { detailDrawerApi.close(); },
  async onOpenChange() {},
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">主体名称：</div><div class="detail-row-right">{{ detailObj.name || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">主体编码：</div><div class="detail-row-right">{{ detailObj.code || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">主体类型：</div><div class="detail-row-right">{{ detailObj.subjectTypeName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">联系人：</div><div class="detail-row-right">{{ detailObj.contactName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">联系电话：</div><div class="detail-row-right">{{ detailObj.contactPhone || '-' }}</div></div>
      <!-- 成员列表行：使用计算属性 memberNames 展示 -->
      <div class="detail-card-row">
        <div class="detail-row-left">成员列表：</div>
        <div class="detail-row-right">{{ memberNames }}</div>
      </div>
      <div class="detail-card-row"><div class="detail-row-left">状态：</div><div class="detail-row-right">{{ detailObj.statusName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">成员数量：</div><div class="detail-row-right">{{ detailObj.memberCount || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">使用次数：</div><div class="detail-row-right">{{ detailObj.useCount || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建人：</div><div class="detail-row-right">{{ detailObj.createByName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新人：</div><div class="detail-row-right">{{ detailObj.updateByName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">变更日志：</div><div class="detail-row-right">{{ detailObj.changeLog || '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
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
