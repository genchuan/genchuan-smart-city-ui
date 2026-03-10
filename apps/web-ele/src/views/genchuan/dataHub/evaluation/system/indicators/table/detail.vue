<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const objName = detailObj.value?.name || '指标体系';
  return title.value || `${objName}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900, // 保持900px宽度，适应表格展示
  onCancel() { detailDrawerApi.close(); },
  async onOpenChange() {},
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 体系基本信息 - 网格布局 -->
      <h3>基本信息</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="label">体系名称：</span>
          <span class="value">{{ detailObj.name || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">体系编码：</span>
          <span class="value">{{ detailObj.code || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">适用对象类型：</span>
          <span class="value">{{ detailObj.objectTypeName || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">版本号：</span>
          <span class="value">{{ detailObj.version || '-' }}</span>
        </div>
        <div class="detail-item full-width">
          <span class="label">描述信息：</span>
          <span class="value">{{ detailObj.desc || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">分类总数：</span>
          <span class="value">{{ detailObj.categoryCount ?? 0 }}</span>
        </div>
        <div class="detail-item">
          <span class="label">指标项总数：</span>
          <span class="value">{{ detailObj.itemCount ?? 0 }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <span class="value">{{ detailObj.statusName || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">创建人：</span>
          <span class="value">{{ detailObj.createUserName || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ detailObj.createTime || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">更新人：</span>
          <span class="value">{{ detailObj.updateUserName || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">更新时间：</span>
          <span class="value">{{ detailObj.updateTime || '-' }}</span>
        </div>
        <!-- 新增：最近使用时间 & 使用次数（若存在） -->
        <div class="detail-item" v-if="detailObj.lastUseTime">
          <span class="label">最近使用时间：</span>
          <span class="value">{{ detailObj.lastUseTime }}</span>
        </div>
        <div class="detail-item" v-if="detailObj.useCount !== undefined">
          <span class="label">使用次数：</span>
          <span class="value">{{ detailObj.useCount }}</span>
        </div>
        <div class="detail-item full-width">
          <span class="label">变更日志：</span>
          <span class="value">{{ detailObj.changeLog || '-' }}</span>
        </div>
      </div>

      <!-- 分类与指标项列表 -->
      <div class="detail-section" v-if="detailObj.categories && detailObj.categories.length">
        <h3>分类及指标项配置</h3>
        <div v-for="cat in detailObj.categories" :key="cat.categoryId" class="category-block">
          <div class="category-header">
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-weight">权重：{{ cat.weight }}%</span>
            <span class="cat-sort">排序：{{ cat.sortNo }}</span>
          </div>
          <el-table :data="cat.items" border size="small" style="width: 100%">
            <el-table-column prop="name" label="指标项名称" min-width="150" />
            <el-table-column prop="indexTypeName" label="指标类型" width="100" />
            <el-table-column prop="calcWayName" label="计算方式" width="100" />
            <el-table-column prop="threshold" label="达标阈值" width="100" />
            <el-table-column prop="weight" label="权重(%)" width="100" />
          </el-table>
        </div>
      </div>
      <div v-else class="no-data">暂无分类配置</div>
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
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    border-left: 4px solid #409eff;
    padding-left: 12px;
  }
}

/* 网格布局（仿评价对象） */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
  font-size: 14px;

  .label {
    width: 110px;
    flex-shrink: 0;
    color: #606266;
    font-weight: 500;
  }

  .value {
    flex: 1;
    color: #303133;
    word-break: break-word;
  }

  &.full-width {
    grid-column: span 2;
  }
}

/* 分类区块 */
.category-block {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .category-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 500;

    .cat-name {
      font-size: 16px;
      color: #409eff;
      margin-right: 20px;
    }

    .cat-weight,
    .cat-sort {
      font-size: 14px;
      color: #909399;
      margin-right: 20px;
    }
  }
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 40px;
  background: white;
  border-radius: 8px;
}

/* 滚动条样式 */
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

/* 移动端适配 */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .detail-item.full-width {
    grid-column: span 1;
  }
}
</style>
