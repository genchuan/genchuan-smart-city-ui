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
  width: 900,
  onCancel() { detailDrawerApi.close(); },
  async onOpenChange() {},
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle" >
    <div class="detail-card">
      <!-- 标准分类基本信息 -->
      <h3>基本信息</h3>
      <div class="detail-card-row"><div class="detail-row-left">分类名称：</div><div class="detail-row-right">{{ detailObj.name || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">适用指标体系：</div><div class="detail-row-right">{{ detailObj.systemName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">指标数量：</div><div class="detail-row-right">{{ detailObj.itemCount || 0 }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">状态：</div><div class="detail-row-right">{{ detailObj.statusName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建人：</div><div class="detail-row-right">{{ detailObj.createByName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新人：</div><div class="detail-row-right">{{ detailObj.updateByName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">变更日志：</div><div class="detail-row-right">{{ detailObj.changeLog || '-' }}</div></div>
      <div class="detail-card-row" v-if="detailObj.lastUseTime"><div class="detail-row-left">最近使用时间：</div><div class="detail-row-right">{{ detailObj.lastUseTime }}</div></div>
      <div class="detail-card-row" v-if="detailObj.useCount !== undefined"><div class="detail-row-left">使用次数：</div><div class="detail-row-right">{{ detailObj.useCount }}</div></div>

      <!-- 指标列表（每个指标显示其标准档次及分数） -->
      <div class="detail-section" v-if="detailObj.items && detailObj.items.length">
        <h3>指标配置详情</h3>
        <div v-for="item in detailObj.items" :key="item.indicatorId" class="indicator-block">
          <h4>{{ item.name }}（权重：{{ item.weight }}）</h4>
          <el-table :data="item.standards.map((std, idx) => ({ grade: std, score: item.scores[idx] }))" border size="small" style="width: 100%">
            <el-table-column prop="grade" label="标准档次" min-width="150" />
            <el-table-column prop="score" label="得分" width="100" />
          </el-table>
        </div>
      </div>
      <div v-else class="no-data">暂无指标配置</div>
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

.detail-section {
  margin-bottom: 24px;
  h3 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    border-left: 4px solid #409eff;
    padding-left: 12px;
  }
}

.indicator-block {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #409eff;
  }
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 40px;
  background: white;
  border-radius: 8px;
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
