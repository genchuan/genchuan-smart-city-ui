<!-- detail.vue -->
<script setup>
import { defineProps, toRefs, computed } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { indicatorList } from './data';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的template_name）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 获取统计维度名称
const getIndicatorNames = (indicatorIds) => {
  if (!indicatorIds || !Array.isArray(indicatorIds)) return [];
  const indicators = indicatorList();
  return indicatorIds.map(id => {
    const indicator = indicators.find(item => item.id === id);
    return indicator ? indicator.label : `未知指标(${id})`;
  });
};

// 解析过滤条件
const parseFilterCondition = (conditionStr) => {
  if (!conditionStr) return [];
  return conditionStr.split(';').filter(item => item.trim()).map(item => {
    const [key, value] = item.split('=');
    return { key, value };
  });
};

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="title || `模板配置详情 - ${detailObj.template_name}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">模板ID:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small" class="cursor-pointer" @click="$emit('template-id-click', detailObj)">
            {{ detailObj.template_id }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">模板名称:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.template_name }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">报表类型:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.report_type }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">适用范围:</div>
        <div class="detail-row-right">
          <el-tag :type="detailObj.apply_scope === '平台级' ? 'warning' :
                         detailObj.apply_scope === '区域级' ? 'primary' :
                         detailObj.apply_scope === '商户级' ? 'success' : 'info'"
                  size="small">
            {{ detailObj.apply_scope }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计维度:</div>
        <div class="detail-row-right">
          <div class="indicator-tags">
            <el-tag
              v-for="(name, index) in getIndicatorNames(detailObj.indicator_ids)"
              :key="index"
              type="info"
              size="small"
              class="mr-2 mb-2"
            >
              {{ name }}
            </el-tag>
          </div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">过滤条件:</div>
        <div class="detail-row-right">
          <div class="filter-conditions">
            <div v-for="(condition, index) in parseFilterCondition(detailObj.filter_condition)"
                 :key="index"
                 class="filter-item">
              <span class="filter-key">{{ condition.key }}:</span>
              <span class="filter-value">{{ condition.value }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">展示样式:</div>
        <div class="detail-row-right">
          <el-tag :type="detailObj.display_style === '表格' ? 'primary' : 'success'" size="small">
            {{ detailObj.display_style }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">配置详情:</div>
        <div class="detail-row-right config-content">
          {{ detailObj.config_content }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">状态:</div>
        <div class="detail-row-right">
          <el-tag :type="detailObj.status === '启用' ? 'success' : 'danger'"
                  size="small"
                  class="cursor-pointer"
                  @click="$emit('status-click', detailObj)">
            {{ detailObj.status }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人:</div>
        <div class="detail-row-right">{{ detailObj.creator }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.create_time }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.update_time }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
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
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;

  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

// 指标标签容器
.indicator-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

// 过滤条件样式
.filter-conditions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.filter-key {
  font-weight: 500;
  color: #409eff;
  margin-right: 8px;
}

.filter-value {
  color: #606266;
}

// 配置内容样式
.config-content {
  background-color: #f6f6f6;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
}
</style>
