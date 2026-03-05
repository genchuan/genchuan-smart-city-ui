<!-- detail.vue -->
<script setup>
import { defineProps, toRefs, computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的taskName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算绩效等级
const performanceLevel = computed(() => {
  const score = detailObj.value.performanceScore || 0;
  if (score >= 95) return { text: '优秀', type: 'success' };
  if (score >= 90) return { text: '良好', type: 'primary' };
  if (score >= 85) return { text: '合格', type: 'warning' };
  return { text: '待改进', type: 'danger' };
});

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
  <DetailDrawer :title="title || `绩效考核详情 - ${detailObj.maintainer} ${detailObj.period}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计周期:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.statCycle === '月' ? 'success' :
                   detailObj.statCycle === '周' ? 'warning' : 'primary'"
            size="small"
          >
            {{ detailObj.statCycle }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计期间:</div>
        <div class="detail-row-right">{{ detailObj.period }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">运维人员:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.maintainer }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            {{ detailObj.areaName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">考核指标:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.indicatorName === '综合绩效' ? 'success' :
                   detailObj.indicatorName === '响应速度' ? 'primary' :
                   detailObj.indicatorName === '维修质量' ? 'warning' :
                   detailObj.indicatorName === '工作效率' ? 'info' : ''"
            size="small"
          >
            {{ detailObj.indicatorName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">绩效等级:</div>
        <div class="detail-row-right">
          <el-tag :type="performanceLevel.type" size="small">
            {{ performanceLevel.text }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">排名:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.rank === 1 ? 'success' :
                   detailObj.rank === 2 ? 'primary' :
                   detailObj.rank === 3 ? 'warning' : 'info'"
            size="small"
          >
            第{{ detailObj.rank }}名
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单处置及时率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.workorderTimelyRate) > 95 ? 'success' :
                   parseFloat(detailObj.workorderTimelyRate) > 90 ? 'primary' :
                   parseFloat(detailObj.workorderTimelyRate) > 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.workorderTimelyRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">巡检完成率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.inspectionCompletionRate) > 95 ? 'success' :
                   parseFloat(detailObj.inspectionCompletionRate) > 90 ? 'primary' :
                   parseFloat(detailObj.inspectionCompletionRate) > 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.inspectionCompletionRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障修复率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.faultRepairRate) > 95 ? 'success' :
                   parseFloat(detailObj.faultRepairRate) > 90 ? 'primary' :
                   parseFloat(detailObj.faultRepairRate) > 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.faultRepairRate }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均处置时长:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.avgDisposalTime) < 3 ? 'success' :
                   parseFloat(detailObj.avgDisposalTime) < 4 ? 'primary' :
                   parseFloat(detailObj.avgDisposalTime) < 5 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.avgDisposalTime }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">绩效得分:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.performanceScore >= 95 ? 'success' :
                   detailObj.performanceScore >= 90 ? 'primary' :
                   detailObj.performanceScore >= 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.performanceScore }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">及时性得分:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.timelyScore >= 95 ? 'success' :
                   detailObj.timelyScore >= 90 ? 'primary' :
                   detailObj.timelyScore >= 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.timelyScore }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">质量得分:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.qualityScore >= 95 ? 'success' :
                   detailObj.qualityScore >= 90 ? 'primary' :
                   detailObj.qualityScore >= 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.qualityScore }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">效率得分:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.efficiencyScore >= 95 ? 'success' :
                   detailObj.efficiencyScore >= 90 ? 'primary' :
                   detailObj.efficiencyScore >= 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.efficiencyScore }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">态度得分:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.attitudeScore >= 95 ? 'success' :
                   detailObj.attitudeScore >= 90 ? 'primary' :
                   detailObj.attitudeScore >= 85 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.attitudeScore }}
          </el-tag>
        </div>
      </div>
      <div v-if="detailObj.deductionReason" class="detail-card-row">
        <div class="detail-row-left">扣分原因:</div>
        <div class="detail-row-right">
          <el-tag type="warning" size="small">
            {{ detailObj.deductionReason }}
          </el-tag>
        </div>
      </div>
      <div v-if="detailObj.improvementSuggestion" class="detail-card-row">
        <div class="detail-row-left">改进建议:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.improvementSuggestion }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator }}</div>
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
  min-height: 300px; // 保证最小高度，避免内容过少时样式塌陷
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
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
  width: 120px; // 固定宽度，保证对齐
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 18px; // 统一行高
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 18px;
  word-break: break-all; // 处理长文本换行
  padding-right: 10px;

  // 空值样式区分
  &:empty::before {
    content: '-';
    color: #c0c4cc;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
}
</style>
