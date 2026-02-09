<!-- detail.vue - 运营趋势报表详情 -->
<script setup>
import { defineProps, toRefs } from 'vue';

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
  <DetailDrawer :title="title || `趋势详情 - ${detailObj.areaName} ${detailObj.parkType}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计周期:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.statCycle === '日' ? 'success' :
                   detailObj.statCycle === '周' ? 'warning' : 'primary'"
            size="small"
          >
            {{ detailObj.statCycle }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计时间:</div>
        <div class="detail-row-right">{{ detailObj.statTime }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">时间范围:</div>
        <div class="detail-row-right">
          {{ detailObj.startDate }} 至 {{ detailObj.endDate }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">行政区域:</div>
        <div class="detail-row-right">
          <el-tag type="primary" size="small">
            {{ detailObj.areaName }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场类型:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.parkType === '商业停车场' ? 'success' :
                   detailObj.parkType === '路侧停车' ? 'warning' :
                   detailObj.parkType === '小区停车场' ? 'info' : 'primary'"
            size="small"
          >
            {{ detailObj.parkType }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总入场车次:</div>
        <div class="detail-row-right">
          <el-tag type="info" size="small">
            {{ detailObj.totalEntry?.toLocaleString() }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总收费金额:</div>
        <div class="detail-row-right">
          <el-tag type="success" size="small">
            ¥{{ detailObj.totalIncome?.toLocaleString() }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均泊位利用率:</div>
        <div class="detail-row-right">
          <el-tag
            :type="parseFloat(detailObj.avgBerthUtilization) > 80 ? 'success' :
                   parseFloat(detailObj.avgBerthUtilization) > 70 ? 'primary' :
                   parseFloat(detailObj.avgBerthUtilization) > 60 ? 'warning' : 'danger'"
            size="small"
          >
            {{ detailObj.avgBerthUtilization }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关键节点:</div>
        <div class="detail-row-right">
          <el-tag
            :type="detailObj.keyNode && detailObj.keyNode.includes('促销') ? 'danger' :
                   detailObj.keyNode && detailObj.keyNode.includes('活动') ? 'warning' : 'info'"
            size="small"
          >
            {{ detailObj.keyNode || '正常运营' }}
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
      <div class="detail-card-row" v-if="detailObj.keyNode && detailObj.keyNode !== '正常运营'">
        <div class="detail-row-left">异常分析:</div>
        <div class="detail-row-right" style="color: #f56c6c; font-size: 13px;">
          <div v-if="detailObj.keyNode.includes('促销')">
            • 促销活动期间车流量显著增加，泊位利用率提升15%<br>
            • 建议提前规划临时停车区域<br>
            • 增加高峰期引导人员
          </div>
          <div v-else-if="detailObj.keyNode.includes('活动')">
            • 大型活动导致周边停车需求激增<br>
            • 建议活动期间启用预约停车系统<br>
            • 加强周边交通疏导
          </div>
          <div v-else-if="detailObj.keyNode.includes('维护') || detailObj.keyNode.includes('升级')">
            • 设备维护期间部分车位暂停使用<br>
            • 建议分批次进行设备维护<br>
            • 提前公告维护时间
          </div>
          <div v-else-if="detailObj.keyNode.includes('管制')">
            • 交通管制导致车流路线改变<br>
            • 建议调整出入口管理策略<br>
            • 增加临时指示标识
          </div>
        </div>
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
