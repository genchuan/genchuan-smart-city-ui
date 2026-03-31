<script setup>
import { computed, defineProps, toRefs, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import Line from '#/components/stats/line.vue';

// 定义组件接收的属性（替换为窨井盖预警数据）
const props = defineProps({
  // 详情数据对象（窨井盖预警数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的warnNo）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用预警编号，兜底显示默认值
const drawerTitle = computed(() => {
  const warnNo = detailObj.value?.warnNo || '窨井盖预警';
  return title.value || `${warnNo}详情`;
});

// 模拟历史类似预警记录
const historyWarnings = ref([
  {
    warnNo: 'MH-YJ-202406-001',
    coverNo: 'MH-202406-003',
    abnormalType: '倾斜角度异常',
    createTime: '2024-06-10 10:30:00',
    riskLevel: '高风险',
    disposalSuggest: '立即派运维人员现场检查，确认窨井盖状态并进行修复',
  },
  {
    warnNo: 'MH-YJ-202406-002',
    coverNo: 'MH-202406-003',
    abnormalType: '振动异常',
    createTime: '2024-06-05 14:20:00',
    riskLevel: '中风险',
    disposalSuggest: '派运维人员现场检查，确认是否存在异常振动原因',
  },
]);

// 模拟倾斜角度变化曲线数据
const tiltAngleData = ref({
  xData: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  seriesData: [
    { name: '倾斜角度', data: [0, 2.5, 5.8, 8.2, 12.5, 15.8, 14.2, 15.0], color: '#4a90e2' }
  ]
});

// 模拟振动数据变化曲线数据
const vibrationData = ref({
  xData: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  seriesData: [
    { name: '振动数据', data: [0, 0.5, 0.8, 1.2, 1.8, 2.5, 2.2, 2.0], color: '#FF6B6B' }
  ]
});

// 初始化抽屉实例（加宽适配预警字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900, // 加宽到900px适配预警更多字段
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 窨井盖预警基础信息 -->
      <div class="detail-card-section">
        <h3 class="section-title">基础信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">预警编号:</div>
          <div class="detail-row-right">{{ detailObj.warnNo || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">井盖编号:</div>
          <div class="detail-row-right">{{ detailObj.coverNo || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路段名称:</div>
          <div class="detail-row-right">{{ detailObj.roadName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">异常类型:</div>
          <div class="detail-row-right">{{ detailObj.abnormalType || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">开合状态:</div>
          <div class="detail-row-right">{{ detailObj.openStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">倾斜角度:</div>
          <div class="detail-row-right">{{ detailObj.tiltAngle || '-' }} 度</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">振动数据:</div>
          <div class="detail-row-right">{{ detailObj.vibrationData || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">触发时间:</div>
          <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置时限:</div>
          <div class="detail-row-right">{{ detailObj.dealLimit || '-' }} 小时</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">剩余处置时间:</div>
          <div class="detail-row-right">{{ detailObj.remainTime || '-' }} 小时</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">派单状态:</div>
          <div class="detail-row-right">{{ detailObj.assignStatus || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">安全风险等级:</div>
          <div class="detail-row-right">{{ detailObj.riskLevel || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置方向建议:</div>
          <div class="detail-row-right">{{ detailObj.disposalSuggest || '-' }}</div>
        </div>
      </div>
      
      <!-- 数据变化曲线 -->
      <div class="detail-card-section">
        <h3 class="section-title">数据变化曲线</h3>
        <div class="chart-container">
          <div class="chart-item">
            <h4 class="chart-title">倾斜角度近24小时变化趋势</h4>
            <Line
              height="250px"
              width="100%"
              :x-data="tiltAngleData.xData"
              :series-data="tiltAngleData.seriesData"
              :y-name="'角度 (°)'"
            />
          </div>
          <div class="chart-item">
            <h4 class="chart-title">振动数据近24小时变化趋势</h4>
            <Line
              height="250px"
              width="100%"
              :x-data="vibrationData.xData"
              :series-data="vibrationData.seriesData"
              :y-name="'振动值'"
            />
          </div>
        </div>
      </div>
      
      <!-- 历史类似预警记录 -->
      <div class="detail-card-section">
        <h3 class="section-title">历史类似预警记录</h3>
        <div class="history-table">
          <table>
            <thead>
              <tr>
                <th>预警编号</th>
                <th>井盖编号</th>
                <th>异常类型</th>
                <th>触发时间</th>
                <th>风险等级</th>
                <th>处置建议</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in historyWarnings" :key="index">
                <td>{{ item.warnNo }}</td>
                <td>{{ item.coverNo }}</td>
                <td>{{ item.abnormalType }}</td>
                <td>{{ item.createTime }}</td>
                <td>{{ item.riskLevel }}</td>
                <td>{{ item.disposalSuggest }}</td>
              </tr>
              <tr v-if="historyWarnings.length === 0">
                <td colspan="6" class="no-data">暂无历史记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px; // 小屏适配预警字段标签宽度
  }

  .detail-card {
    min-height: 480px;
    max-height: 65vh;
    padding: 15px;
  }
  
  .chart-container {
    flex-direction: column;
  }
  
  .chart-item {
    width: 100%;
  }
  
  .history-table {
    overflow-x: auto;
  }
}

.detail-card {
  min-height: 800px; // 适配预警字段数量，提升最小高度
  max-height: 80vh; // 提高最大高度，容纳更多预警字段
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 章节样式
.detail-card-section {
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

// 章节标题样式
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
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
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  flex-shrink: 0; // 不收缩
  width: 140px; // 加宽标签宽度，适配"预警处置时限"等长标签
  font-size: 14px;
  font-weight: 500; // 加粗突出标签
  line-height: 18px; // 统一行高
  color: #606266; // 灰色调，区分内容
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133; // 主文本色
  word-break: break-all; // 处理长文本换行（如关联监测数据）
}

// 图表容器样式
.chart-container {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

// 单个图表项样式
.chart-item {
  flex: 1;
  min-width: 300px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

// 图表标题样式
.chart-title {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 10px;
  text-align: center;
}

// 历史记录表格样式
.history-table {
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.history-table table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.history-table th {
  background-color: #f5f7fa;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.history-table td {
  font-size: 13px;
  color: #303133;
}

.history-table tr:hover {
  background-color: #f5f7fa;
}

// 无数据状态
.no-data {
  text-align: center;
  color: #909399;
  padding: 20px;
}

// 滚动条样式优化
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
