<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const objName = detailObj.value?.name || '标准分类';
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
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle" >
    <div class="detail-scroll-container">
      <div class="detail-card">
        <h3 class="detail-card-title">基本信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">标准分类名称：</div>
          <div class="detail-row-right">{{ detailObj.name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">适用指标体系：</div>
          <div class="detail-row-right">{{ detailObj.systemName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">标准项数量：</div>
          <div class="detail-row-right">{{ detailObj.itemCount || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">状态：</div>
          <div class="detail-row-right">{{ detailObj.statusName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建人：</div>
          <div class="detail-row-right">{{ detailObj.creatorName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间：</div>
          <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">变更日志：</div>
          <div class="detail-row-right">{{ detailObj.changeLogShort || '-' }}</div>
        </div>
      </div>

      <div v-if="detailObj.items?.length" class="detail-card">
        <h3 class="detail-card-title">标准项列表</h3>
        <el-table :data="detailObj.items" border size="small" style="width: 100%">
          <el-table-column prop="grade" label="等级" min-width="150" />
          <el-table-column prop="scoreRange" label="分数范围" min-width="150" />
          <el-table-column prop="sortNo" label="排序" width="80" />
        </el-table>
      </div>
      <div v-else class="detail-card">
        <h3 class="detail-card-title">标准项列表</h3>
        <div class="empty-tip">暂无标准项配置</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-scroll-container {
  max-height: calc(70vh - 20px);
  overflow-y: auto;
  padding: 4px;
}

.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

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

.empty-tip {
  text-align: center;
  color: #c0c4cc;
  padding: 20px 0;
}

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

@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
  .detail-card {
    padding: 15px;
  }
}
</style>
