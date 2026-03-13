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
      <!-- 体系基本信息 - 单列行布局（仿评价主体） -->
      <h3>基本信息</h3>
      <div class="detail-card-row">
        <div class="detail-row-left">体系名称：</div>
        <div class="detail-row-right">{{ detailObj.name || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">体系编码：</div>
        <div class="detail-row-right">{{ detailObj.code || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">适用对象类型：</div>
        <div class="detail-row-right">{{ detailObj.objectTypeName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">版本号：</div>
        <div class="detail-row-right">{{ detailObj.version || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">描述信息：</div>
        <div class="detail-row-right">{{ detailObj.desc || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">分类总数：</div>
        <div class="detail-row-right">{{ detailObj.categoryCount ?? 0 }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指标项总数：</div>
        <div class="detail-row-right">{{ detailObj.itemCount ?? 0 }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">状态：</div>
        <div class="detail-row-right">{{ detailObj.statusName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人：</div>
        <div class="detail-row-right">{{ detailObj.createUserName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新人：</div>
        <div class="detail-row-right">{{ detailObj.updateUserName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
      <!-- 新增字段：最近使用时间 & 使用次数（若存在） -->
<!--      <div class="detail-card-row" v-if="detailObj.lastUseTime">-->
<!--        <div class="detail-row-left">最近使用时间：</div>-->
<!--        <div class="detail-row-right">{{ detailObj.lastUseTime }}</div>-->
<!--      </div>-->
<!--      <div class="detail-card-row" v-if="detailObj.useCount !== undefined">-->
<!--        <div class="detail-row-left">使用次数：</div>-->
<!--        <div class="detail-row-right">{{ detailObj.useCount }}</div>-->
<!--      </div>-->
      <div class="detail-card-row">
        <div class="detail-row-left">变更日志：</div>
        <div class="detail-row-right">{{ detailObj.changeLogShort || '-' }}</div>
      </div>

      <!-- 分类与指标项列表（保留原有结构，稍作样式微调） -->
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
  min-height: 400px;
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
.detail-section{
  h3 {
    margin: 10px 0 0 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    border-left: 4px solid #409eff;
    padding-left: 12px;
  }
}

/* 单列行布局（完全复用评价主体样式） */
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  background: white; /* 与评价主体一致，白色背景 */
  padding-left: 20px;
  padding-right: 20px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 28px; /* 保持左右内边距一致 */
    padding-right: 20px;
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

/* 分类区块（微调，与整体背景融合） */
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
  .detail-row-left {
    width: 120px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
  }
}
</style>
