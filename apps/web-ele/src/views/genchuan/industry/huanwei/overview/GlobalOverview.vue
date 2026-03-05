<template>
  <div class="mainbox-content">
    <!-- 左侧考核得分 -->
    <div class="panel left" style="min-width: 20vw;">
      <div class="panel-header">
        <h3>考核得分</h3>
        <div class="filter-controls">
          <div class="filter-group">
            <span class="filter-label">时间维度：</span>
            <div class="filter-buttons">
              <button
                v-for="dim in ['日', '月', '季', '年']"
                :key="dim"
                :class="['time-btn', { active: timeDimension === dim }]"
                @click="handleTimeDimensionChange(dim)"
              >
                {{ dim }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="average-score">
        <div class="average-label">平均得分</div>
        <div class="average-value">{{ averageScore }}</div>
        <div class="average-range">
          <span class="range-label">得分范围：</span>
          <span class="range-value">{{ scoreRange.min }} - {{ scoreRange.max }}</span>
        </div>
      </div>
      <div class="scores-list">
        <div class="scores-header">
          <span class="header-rank">排名</span>
          <span class="header-region">区域</span>
          <span class="header-score">得分</span>
          <span class="header-trend">趋势</span>
        </div>
        <div class="scores-content">
          <div
            v-for="item in assessmentScores"
            :key="item.region"
            :class="['score-item', `rank-${item.rank}`]"
          >
            <div class="item-rank"><span class="rank-number">{{ item.rank }}</span></div>
            <div class="item-region">{{ item.region }}</div>
            <div class="item-score" :style="{ color: getScoreColor(item.score) }">{{ item.score }}</div>
            <div class="item-trend" :class="{
              'trend-up': getTrendIcon(item.region) === '↑',
              'trend-down': getTrendIcon(item.region) === '↓',
              'trend-equal': getTrendIcon(item.region) === '→'
            }">{{ getTrendIcon(item.region) }}</div>
          </div>
        </div>
      </div>
      <div class="legend">
        <div class="legend-item"><span class="legend-color" style="background:#00ff99;"></span><span class="legend-text">优秀(≥90)</span></div>
        <div class="legend-item"><span class="legend-color" style="background:#00ccff;"></span><span class="legend-text">良好(≥85)</span></div>
        <div class="legend-item"><span class="legend-color" style="background:#ffcc00;"></span><span class="legend-text">合格(≥80)</span></div>
        <div class="legend-item"><span class="legend-color" style="background:#ff3333;"></span><span class="legend-text">不合格(<80)</span></div>
      </div>
      <div class="panel-footer"></div>
    </div>

    <!-- 中间地图 -->
    <div class="panel middle" style="min-width: 20vw;" ref="middle">
      <div class="header-actions">
        <div class="actions-left"><p>地图</p></div>
        <div class="actions-right">
          <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('middle')">
            <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
          </button>
        </div>
      </div>
      <MapCommom :deviceStats="deviceStatsForMap" />
      <div class="panel-footer"></div>
    </div>

    <!-- 右侧事件汇总 -->
    <div class="panel right" ref="rightBottomPanel" style="min-width: 20vw;">
      <div class="header-actions">
        <div class="actions-left"><p>处理事件汇总</p></div>
        <div class="actions-right">
          <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('rightBottomPanel')">
            <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
          </button>
        </div>
      </div>
      <div class="table-box1">
        <ElTable class="table1" :data="eventList" border size="small" width="100%" height="100%"
                 table-layout="fixed" highlight-current-row>
          <ElTableColumn prop="region" label="区域" align="center" min-width="100px" />
          <ElTableColumn prop="type" label="类型" align="center" />
          <ElTableColumn prop="time" label="时间" align="center" min-width="100px" />
          <ElTableColumn prop="status" label="状态" align="center">
            <template #default="scope">
              <ElTag :type="getStatusTagType(scope.row.status)" size="small">
                {{ scope.row.status }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="person" label="负责人" align="center" />
          <ElTableColumn prop="completionRate" label="处理完成率" align="center" min-width="100px">
            <template #default="scope">
              <span v-if="scope.row.status === '已完成'">{{ scope.row.completionRate }}%</span>
              <span v-else>-</span>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <div class="panel-footer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, getCurrentInstance } from 'vue'
import { FullScreen } from "@element-plus/icons-vue"
import screenFull from 'screenfull'
import { ElMessage, ElTable, ElTableColumn, ElTag } from 'element-plus'
import MapCommom from '#/views/genchuan/industry/huanwei/overview/MapCommon.vue'
// 导入模拟数据
import {
  mockAssessmentData,
  eventList as mockEventList,
  deviceIndicatorsMock
} from './mockData'  // 根据实际路径调整

// 获取当前组件实例（用于面板全屏）
const instance = getCurrentInstance()

// 考核得分相关
const timeDimension = ref('日')
const assessmentScores = ref([])
const regions = ['东埔街道','源西街道','上城街道','新江街道','源南镇','高埔岗街道','埔前镇','转运站']

// 维度映射
const dimensionMap = {
  '日': 'day',
  '月': 'month',
  '季': 'quarter',
  '年': 'year'
}

// 设备指标
const deviceIndicators = ref(deviceIndicatorsMock)

// 事件列表
const eventList = ref(mockEventList)

// 获取当前维度数据
const getCurrentDimensionData = () => {
  const dimKey = dimensionMap[timeDimension.value]
  return mockAssessmentData[dimKey]
}

// 排名得分
const getRankedScores = () => {
  const data = getCurrentDimensionData()
  return regions.map(r => ({
    region: r,
    score: data[r].current,
    rank: 0
  }))
    .sort((a,b) => b.score - a.score)
    .map((item,i) => ({ ...item, rank: i+1 }))
}

// 平均分
const averageScore = computed(() => {
  const data = getCurrentDimensionData()
  const sum = regions.reduce((acc, region) => acc + data[region].current, 0)
  return parseFloat((sum / regions.length).toFixed(1))
})

// 得分范围
const scoreRange = computed(() => {
  const data = getCurrentDimensionData()
  const scores = regions.map(r => data[r].current)
  return {
    min: Math.min(...scores).toFixed(1),
    max: Math.max(...scores).toFixed(1)
  }
})

// 趋势图标
const getTrendIcon = (region) => {
  const data = getCurrentDimensionData()
  const current = data[region].current
  const previous = data[region].previous
  if (current > previous) return '↑'
  if (current < previous) return '↓'
  return '→'
}

// 得分颜色
const getScoreColor = (score) => {
  if (score >= 90) return '#00ff99'
  if (score >= 85) return '#00ccff'
  if (score >= 80) return '#ffcc00'
  return '#ff3333'
}

// 状态标签类型
const getStatusTagType = (status) => {
  switch (status) {
    case '已完成': return 'success'
    case '处理中': return 'warning'
    case '待处理': return 'danger'
    default: return 'info'
  }
}

// 更新得分
const updateAssessmentScores = () => {
  assessmentScores.value = getRankedScores()
}

// 时间维度变化
const handleTimeDimensionChange = (val) => {
  timeDimension.value = val
  updateAssessmentScores()
}

// 地图图例数据
const deviceStatsForMap = computed(() => ({
  total: deviceIndicators.value.tbDeviceTotalCount,
  online: deviceIndicators.value.tbDeviceOnlineCount,
  offline: deviceIndicators.value.tbDeviceTotalCount - deviceIndicators.value.tbDeviceOnlineCount,
  fault: deviceIndicators.value.tbDeviceFaultCount
}))

// 面板全屏功能
const togglePanelFullscreen = (panelRefName) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能')
    return
  }
  const panel = instance.refs[panelRefName]
  if (!panel) {
    ElMessage.error('未找到面板元素')
    return
  }
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit()
  } else {
    screenFull.request(panel)
  }
}

// 初始化
updateAssessmentScores()
</script>

<style lang="scss" scoped>
@import url('./common-styles.scss');

.mainbox-content {
  display: flex;
  margin: 0 auto;
  height: 88vh;
  box-sizing: border-box;
  gap: 0.6vw;
  width: 100%;
}

.panel {
  position: relative;
  border: 0.2vh solid rgba(25, 186, 139, 0.17);
  background: url("../images/line(1).png") rgba(255, 255, 255, .04);
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0.5vw;
  box-sizing: border-box;
}

.left {
  flex: 1;
  display: flex;
  flex-direction: column;

  .panel-header {
    margin-bottom: 1vw;
    h3 {
      margin: 0 0 0.8vw 0;
      color: #00ccff;
      font-size: 1.5vw;
      text-align: center;
    }
  }
  .filter-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5vw;
  }
  .filter-group {
    display: flex;
    align-items: center;
  }
  .filter-label {
    color: #00ffcc;
    font-size: 0.9vw;
    white-space: nowrap;
    width: 6vw;
  }
  .filter-buttons {
    display: flex;
    gap: 0.5vw;
  }
  .time-btn {
    padding: 0.3vw 0.8vw;
    background: rgba(0, 102, 153, 0.3);
    border: 1px solid rgba(0, 204, 255, 0.3);
    color: #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8vw;
    transition: all 0.3s;
    &:hover {
      background: rgba(0, 153, 204, 0.5);
      border-color: #00ccff;
    }
    &.active {
      background: rgba(0, 204, 255, 0.7);
      border-color: #00ccff;
      color: #fff;
      font-weight: bold;
    }
  }
  .average-score {
    text-align: center;
    background: rgba(0, 51, 102, 0.3);
    border: 1px solid rgba(0, 153, 204, 0.3);
    border-radius: 8px;
    padding: 0.8vw;
    margin-bottom: 1vw;
    .average-label {
      color: #99ccff;
      font-size: 0.9vw;
      margin-bottom: 0.3vw;
    }
    .average-value {
      font-size: 2.5vw;
      font-weight: bold;
      color: #00ffcc;
      text-shadow: 0 0 8px rgba(0, 255, 204, 0.5);
      line-height: 1;
      margin-bottom: 0.5vw;
    }
    .average-range {
      font-size: 0.8vw;
      color: #ccc;
    }
    .range-label {
      color: #99ccff;
    }
    .range-value {
      color: #ffcc00;
    }
  }
  .scores-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .scores-header {
    display: flex;
    background: rgba(0, 51, 102, 0.5);
    border-radius: 4px 4px 0 0;
    padding: 0.5vw;
    font-size: 0.9vw;
    font-weight: bold;
    color: #00ccff;
    .header-rank {
      width: 15%;
      text-align: center;
    }
    .header-region {
      width: 45%;
      text-align: left;
    }
    .header-score {
      width: 25%;
      text-align: center;
    }
    .header-trend {
      width: 15%;
      text-align: center;
    }
  }
  .scores-content {
    flex: 1;
    overflow-y: auto;
    border: 1px solid rgba(0, 153, 204, 0.3);
    border-top: none;
    border-radius: 0 0 4px 4px;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(0, 51, 102, 0.3);
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 204, 255, 0.5);
      border-radius: 2px;
    }
  }
  .score-item {
    display: flex;
    align-items: center;
    padding: 0.6vw 0.5vw;
    border-bottom: 1px solid rgba(0, 153, 204, 0.2);
    font-size: 0.9vw;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: rgba(0, 102, 153, 0.2);
    }
    &.rank-1 {
      background: rgba(255, 215, 0, 0.1);
      border-left: 3px solid #ffd700;
    }
    &.rank-2 {
      background: rgba(192, 192, 192, 0.1);
      border-left: 3px solid #c0c0c0;
    }
    &.rank-3 {
      background: rgba(205, 127, 50, 0.1);
      border-left: 3px solid #cd7f32;
    }
  }
  .item-rank {
    width: 15%;
    text-align: center;
    .rank-number {
      display: inline-block;
      width: 1.5vw;
      height: 1.5vw;
      line-height: 1.5vw;
      border-radius: 50%;
      background: rgba(0, 102, 153, 0.5);
      font-weight: bold;
    }
  }
  .rank-1 .rank-number {
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    color: #333;
  }
  .rank-2 .rank-number {
    background: linear-gradient(135deg, #c0c0c0, #999);
    color: #333;
  }
  .rank-3 .rank-number {
    background: linear-gradient(135deg, #cd7f32, #b5651d);
    color: #fff;
  }
  .item-region {
    width: 45%;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item-score {
    width: 25%;
    text-align: center;
    font-weight: bold;
    font-size: 1vw;
  }
  .item-trend {
    width: 15%;
    text-align: center;
    font-size: 1.2vw;
    font-weight: bold;
    &.trend-up {
      color: #00ff99;
    }
    &.trend-down {
      color: #ff3333;
    }
    &.trend-equal {
      color: #ccc;
    }
  }
  .legend {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 0.8vw;
    padding: 0.5vw;
    background: rgba(0, 51, 102, 0.3);
    border-radius: 4px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    margin: 0.2vw 0.5vw;
  }
  .legend-color {
    width: 0.8vw;
    height: 0.8vw;
    border-radius: 2px;
    margin-right: 0.3vw;
  }
  .legend-text {
    font-size: 0.7vw;
    color: #ccc;
  }
}

.middle {
  flex: 2;
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;

  .table-box1 {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: calc(100% - 2vh);
    overflow: auto hidden;
  }
}

:deep(.table1) {
  width: 100% !important;
  height: 100% !important;
  overflow: auto !important;
  table-layout: fixed !important;
  border-spacing: 0;
  border-collapse: separate;
  background-color: transparent;

  th {
    padding: 0.3vw 0;
    font-size: 0.7vw;
    font-weight: 500;
    color: #00ffd0;
    text-align: center;
    white-space: nowrap;
    background-color: rgb(0 82 103 / 80%);
    border-bottom: 1px solid rgb(0 40 80 / 50%);
    transition: all 0.2s;
    &:hover {
      background-color: rgb(0 82 103 / 100%);
    }
  }
  td {
    padding: 0.2vw 0;
    font-size: 0.7vw;
    color: #afc2ff;
    text-align: center;
    white-space: nowrap;
    background-color: rgb(0 54 108 / 70%) !important;
    border-bottom: 1px solid rgb(0 204 255 / 15%);
    transition: all 0.2s;
  }
  .el-table__row {
    background-color: rgb(0 30 60 / 50%);
    &:nth-child(even) {
      background-color: rgb(0 40 80 / 50%);
    }
    &:hover > td {
      color: #fff;
      background-color: rgb(0 122 255 / 30%) !important;
    }
  }
  &::before {
    background-color: rgb(0 204 255 / 20%);
  }
  .el-table__cell {
    border-right: 1px solid rgb(0 204 255 / 15%);
    &:last-child {
      border-right: none;
    }
  }
  .el-table__sort-icon {
    color: rgb(0 255 208 / 60%);
    &:hover {
      color: #00ffd0;
    }
  }
  &::-webkit-scrollbar {
    width: 0.5vw;
    height: 0.5vh;
  }
  &::-webkit-scrollbar-track {
    background: rgb(0 54 108 / 50%);
    border-radius: 0.2vw;
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(0 204 255 / 50%);
    border-radius: 0.2vw;
    &:hover {
      background: rgb(0 255 208 / 70%);
    }
  }
}

:deep(.el-tag) {
  font-size: 0.7vw;
  &.el-tag--success {
    color: #2eb861;
    background-color: rgb(46 184 97 / 20%);
    border-color: rgb(46 184 97 / 50%);
  }
  &.el-tag--warning {
    color: #fad514;
    background-color: rgb(250 173 20 / 20%);
    border-color: rgb(250 173 20 / 50%);
  }
  &.el-tag--danger {
    color: #eb5757;
    background-color: rgb(235 87 87 / 20%);
    border-color: rgb(235 87 87 / 50%);
  }
  &.el-tag--info {
    color: #4299e1;
    background-color: rgb(66 153 225 / 20%);
    border-color: rgb(66 153 225 / 50%);
  }
}
</style>
