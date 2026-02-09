<script setup>
import { ref, getCurrentInstance, onMounted, computed, nextTick } from 'vue';
import { FullScreen } from "@element-plus/icons-vue";
import screenFull from 'screenfull';
import { ElMessage, ElTable, ElTableColumn, ElTag } from 'element-plus';
import MapCommom from '#/views/genchuan/industry/huanwei/overview/MapCommon.vue'

const pageContainerRef = ref(null);
const currentTime = ref('');
// 获取当前组件实例，用于访问ref
const instance = getCurrentInstance();

// 新增顶部导航相关数据
const topNavItems = ref([
  { name: '全局态势', tag: 'global' },
  { name: '指标分析', tag: 'indicators' },
  { name: '风险预警', tag: 'risks' }
]);

const currentNav = ref('global'); // 当前选中的导航项

// 导航点击处理（只做样式切换，不需要实际功能）
const handleNavClick = (item) => {
  currentNav.value = item.tag;
  // 这里可以添加你想要的其他逻辑，比如刷新面板内容等
  ElMessage.info(`切换到${item.name}`);
};

// 考核得分相关数据
const timeDimension = ref('日'); // 时间维度：日、月、季、年
const assessmentScores = ref([]); // 所有区域的考核得分

// 区域列表
const regions = [
  '东埔街道',
  '源西街道',
  '上城街道',
  '新江街道',
  '源南镇',
  '高埔岗街道',
  '埔前镇',
  '转运站'
];

// 模拟考核数据
const mockAssessmentData = {
  '日': {
    '东埔街道': 91.2,
    '源西街道': 88.3,
    '上城街道': 87.6,
    '新江街道': 90.1,
    '源南镇': 85.4,
    '高埔岗街道': 86.7,
    '埔前镇': 89.9,
    '转运站': 92.3
  },
  '月': {
    '东埔街道': 90.5,
    '源西街道': 87.2,
    '上城街道': 86.8,
    '新江街道': 89.4,
    '源南镇': 84.9,
    '高埔岗街道': 85.6,
    '埔前镇': 88.3,
    '转运站': 91.5
  },
  '季': {
    '东埔街道': 89.8,
    '源西街道': 86.5,
    '上城街道': 86.1,
    '新江街道': 88.7,
    '源南镇': 84.2,
    '高埔岗街道': 85.0,
    '埔前镇': 87.6,
    '转运站': 90.8
  },
  '年': {
    '东埔街道': 89.1,
    '源西街道': 85.8,
    '上城街道': 85.4,
    '新江街道': 88.0,
    '源南镇': 83.5,
    '高埔岗街道': 84.3,
    '埔前镇': 86.9,
    '转运站': 90.1
  }
};

// 有线设备相关数据
const deviceIndicators = ref({
  tbDeviceTotalCount: 131,
  tbDeviceOnlineCount: 115,
  tbDeviceNormalCount: 109,
  tbDeviceFaultCount: 6
});

// 处理事件相关数据
const eventList = ref([
  {
    id: 1,
    region: '东埔街道',
    type: '垃圾清运',
    time: '2024-03-15 08:30',
    status: '已完成',
    person: '张三'
  },
  {
    id: 2,
    region: '源西街道',
    type: '道路清扫',
    time: '2024-03-15 09:15',
    status: '处理中',
    person: '李四'
  },
  {
    id: 3,
    region: '上城街道',
    type: '绿化维护',
    time: '2024-03-15 10:00',
    status: '待处理',
    person: '王五'
  },
  {
    id: 4,
    region: '新江街道',
    type: '设施维修',
    time: '2024-03-15 11:20',
    status: '已完成',
    person: '赵六'
  },
  {
    id: 5,
    region: '源南镇',
    type: '公厕清洁',
    time: '2024-03-15 13:45',
    status: '处理中',
    person: '钱七'
  },
  {
    id: 6,
    region: '高埔岗街道',
    type: '垃圾分类',
    time: '2024-03-15 14:30',
    status: '已完成',
    person: '孙八'
  },
  {
    id: 7,
    region: '埔前镇',
    type: '园林修剪',
    time: '2024-03-15 15:10',
    status: '待处理',
    person: '周九'
  },
  {
    id: 8,
    region: '转运站',
    type: '设备检查',
    time: '2024-03-15 16:00',
    status: '处理中',
    person: '吴十'
  }
]);

// 数字增长动画函数
const animateValue = (element, start, end, duration) => {
  let startTimestamp = null;
  // 判断原始指标是否为整数
  const isInteger = Number.isInteger(end);

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = progress * (end - start) + start;

    // 整数用 toFixed(0)，小数用 toFixed(1)
    element.textContent = isInteger
      ? currentValue.toFixed(0)  // 整数：不带小数位
      : currentValue.toFixed(1); // 小数：保留一位小数

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

// 初始化数字动画
const initNumberAnimations = () => {
  nextTick(() => {
    const elements = document.querySelectorAll('.number-animate');
    elements.forEach(el => {
      const value = parseFloat(el.getAttribute('data-value'));
      animateValue(el, 0, value, 1500);
    });
  });
};

// 获取当前时间维度的区域得分排名
const getRankedScores = () => {
  const dimensionData = mockAssessmentData[timeDimension.value];

  // 转换为数组并排序（从高到低）
  return regions
    .map(region => ({
      region,
      score: dimensionData[region],
      rank: 0
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
};

// 计算平均分
const averageScore = computed(() => {
  const dimensionData = mockAssessmentData[timeDimension.value];
  const sum = Object.values(dimensionData).reduce((acc, score) => acc + score, 0);
  return parseFloat((sum / regions.length).toFixed(1));
});

// 获取趋势图标（与前一时间维度比较）
const getTrendIcon = (region) => {
  const currentScore = mockAssessmentData[timeDimension.value][region];
  let previousScore = 0;

  // 根据当前时间维度获取上一个时间维度的数据
  switch (timeDimension.value) {
    case '月':
      previousScore = mockAssessmentData['日'][region];
      break;
    case '季':
      previousScore = mockAssessmentData['月'][region];
      break;
    case '年':
      previousScore = mockAssessmentData['季'][region];
      break;
    default:
      previousScore = currentScore;
  }

  if (currentScore > previousScore) {
    return '↑'; // 上升
  } else if (currentScore < previousScore) {
    return '↓'; // 下降
  } else {
    return '→'; // 持平
  }
};

// 获取得分颜色
const getScoreColor = (score) => {
  if (score >= 90) return '#00ff99'; // 优秀
  if (score >= 85) return '#00ccff'; // 良好
  if (score >= 80) return '#ffcc00'; // 合格
  return '#ff3333'; // 不合格
};

// 获取状态标签样式
const getStatusTagType = (status) => {
  switch (status) {
    case '已完成': return 'success';
    case '处理中': return 'warning';
    case '待处理': return 'danger';
    default: return 'info';
  }
};

// 更新考核得分
const updateAssessmentScores = () => {
  assessmentScores.value = getRankedScores();
};

// 时间维度变化处理
const handleTimeDimensionChange = (value) => {
  timeDimension.value = value;
  updateAssessmentScores();
};

// 工具函数
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
};

// 全屏功能
const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
};

// 全屏相关功能
const togglePanelFullscreen = (panelRefName) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }

  const panel = instance.refs[panelRefName];
  if (!panel) {
    ElMessage.error('未找到面板元素');
    return;
  }

  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.request(panel);
  }
};

onMounted(() => {
  // 初始化时间
  currentTime.value = formatTime(new Date());
  const timer = setInterval(() => {
    currentTime.value = formatTime(new Date());
  }, 1000);

  // 初始化考核得分
  updateAssessmentScores();

  // 初始化数字动画
  initNumberAnimations();

  // 清理定时器
  return () => {
    clearInterval(timer);
  };
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <div class="top-nav-container">
        <ul class="top-nav-list">
          <li
            v-for="(item, index) in topNavItems"
            :key="index"
            @click="handleNavClick(item)"
            :class="{ 'active': currentNav === item.tag }"
          >
            <div class="nav-border">
              <span>{{ item.name }}</span>
              <div class="nav-corner top-left"></div>
              <div class="nav-corner bottom-right"></div>
            </div>
          </li>
        </ul>
      </div>

      <span class="head-name">
        环卫园林绿化一体化数智平台
      </span>
      <div class="time-display">{{ currentTime }}</div>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <FullScreen />
        </el-icon>
      </button>
    </div>
    <div class="mainbox">
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
            <span class="range-value">83.5 - 92.3</span>
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
              <div class="item-rank">
                <span class="rank-number">{{ item.rank }}</span>
              </div>
              <div class="item-region">{{ item.region }}</div>
              <div class="item-score" :style="{ color: getScoreColor(item.score) }">
                {{ item.score }}
              </div>
              <div class="item-trend" :class="{
                'trend-up': getTrendIcon(item.region) === '↑',
                'trend-down': getTrendIcon(item.region) === '↓',
                'trend-equal': getTrendIcon(item.region) === '→'
              }">
                {{ getTrendIcon(item.region) }}
              </div>
            </div>
          </div>
        </div>
        <div class="legend">
          <div class="legend-item">
            <span class="legend-color" style="background-color: #00ff99;"></span>
            <span class="legend-text">优秀(≥90)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #00ccff;"></span>
            <span class="legend-text">良好(≥85)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #ffcc00;"></span>
            <span class="legend-text">合格(≥80)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #ff3333;"></span>
            <span class="legend-text">不合格(<80)</span>
          </div>
        </div>
        <div class="panel-footer"></div>
      </div>
      <div class="panel middle" style="min-width: 20vw;" ref="middle">
        <div class="header-actions">
          <div class="actions-left"><p>地图</p></div>
          <div class="actions-right">
            <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('middle')">
              <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
            </button>
          </div>
        </div>
        <MapCommom/>
        <div class="panel-footer"></div>
      </div>
      <div class="right" style="min-width: 20vw;">
        <div class="panel right_top" ref="rightTopPanel">
          <div class="indicator-cards3">
            <div class="indicator-card3 card1">
              <div class="indicator-title">设备总数</div>
              <div class="indicator-value">
                <span class="number-animate" :data-value="deviceIndicators.tbDeviceTotalCount">{{ deviceIndicators.tbDeviceTotalCount }}</span>
              </div>
              <div class="indicator-unit">台</div>
            </div>
            <div class="indicator-card3 card2">
              <div class="indicator-title">在线数</div>
              <div class="indicator-value">
                <span class="number-animate" :data-value="deviceIndicators.tbDeviceOnlineCount">{{ deviceIndicators.tbDeviceOnlineCount }}</span>
              </div>
              <div class="indicator-unit">台</div>
            </div>
            <div class="indicator-card3 card3">
              <div class="indicator-title">正常运行数</div>
              <div class="indicator-value">
                <span class="number-animate" :data-value="deviceIndicators.tbDeviceNormalCount">{{ deviceIndicators.tbDeviceNormalCount }}</span>
              </div>
              <div class="indicator-unit">台</div>
            </div>
            <div class="indicator-card3 card4">
              <div class="indicator-title">故障数</div>
              <div class="indicator-value">
                <span class="number-animate" :data-value="deviceIndicators.tbDeviceFaultCount">{{ deviceIndicators.tbDeviceFaultCount }}</span>
              </div>
              <div class="indicator-unit">台</div>
            </div>
          </div>
          <div class="device-status-chart">
            <div class="chart-content">
              <div class="status-item status-normal">
                <div class="status-label">正常</div>
                <div class="status-bar">
                  <div class="status-fill" :style="{ width: `${(deviceIndicators.tbDeviceNormalCount / deviceIndicators.tbDeviceTotalCount) * 100}%` }"></div>
                </div>
                <div class="status-value">{{ ((deviceIndicators.tbDeviceNormalCount / deviceIndicators.tbDeviceTotalCount) * 100).toFixed(1) }}%</div>
              </div>
              <div class="status-item status-fault">
                <div class="status-label">故障</div>
                <div class="status-bar">
                  <div class="status-fill" :style="{ width: `${(deviceIndicators.tbDeviceFaultCount / deviceIndicators.tbDeviceTotalCount) * 100}%` }"></div>
                </div>
                <div class="status-value">{{ ((deviceIndicators.tbDeviceFaultCount / deviceIndicators.tbDeviceTotalCount) * 100).toFixed(1) }}%</div>
              </div>
              <div class="status-item status-offline">
                <div class="status-label">离线</div>
                <div class="status-bar">
                  <div class="status-fill" :style="{ width: `${((deviceIndicators.tbDeviceTotalCount - deviceIndicators.tbDeviceOnlineCount) / deviceIndicators.tbDeviceTotalCount) * 100}%` }"></div>
                </div>
                <div class="status-value">{{ (((deviceIndicators.tbDeviceTotalCount - deviceIndicators.tbDeviceOnlineCount) / deviceIndicators.tbDeviceTotalCount) * 100).toFixed(1) }}%</div>
              </div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel right_bottom" ref="rightBottomPanel">
          <div class="header-actions">
            <div class="actions-left"><p>处理事件汇总</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('rightBottomPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>

          <!-- 使用Element Plus Table组件 -->
          <div class="table-box1">
            <ElTable class="table1" :data="eventList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
              <ElTableColumn prop="region" label="区域" align="center" />
              <ElTableColumn prop="type" label="类型" align="center" />
              <ElTableColumn prop="time" label="时间" align="center" />
              <ElTableColumn prop="status" label="状态" align="center">
                <template #default="scope">
                  <ElTag :type="getStatusTagType(scope.row.status)" size="small">
                    {{ scope.row.status }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn prop="person" label="负责人" align="center" />
            </ElTable>
          </div>

          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('./common-styles.scss');

.page-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url("../images/bg.jpg");
  background-size: 100% 100%;
  color: #fff;
  padding: 0 1vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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

.mainbox {
  display: flex;
  margin: 0 auto;
  height: 88vh;
  box-sizing: border-box;
  gap: 0.6vw;
  width: 100%;
}

.header-box {
  width: 100%;
  height: 10vh;
  background: url("../images/head_bg.png");
  background-size: 100% 100%;
  color: #00ccff;
  font-size: 2.1vw;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .head-name {
    line-height: normal;
    white-space: nowrap;
  }

  .time-display {
    position: absolute;
    right: 5vw;
    font-size: 1vw;
    color: #00ffcc;
  }

  .fullScreenBut {
    position: absolute;
    right: 1vw;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5vw;

    &:hover {
      background: rgba(0, 204, 255, 0.1);
      border-radius: 4px;
    }
  }
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
    color: #cccccc;
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
      color: #ffffff;
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
  }

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
    color: #cccccc;
  }

  .range-label {
    color: #99ccff;
  }

  .range-value {
    color: #ffcc00;
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
    background: linear-gradient(135deg, #c0c0c0, #999999);
    color: #333;
  }

  .rank-3 .rank-number {
    background: linear-gradient(135deg, #cd7f32, #b5651d);
    color: #fff;
  }

  .item-region {
    width: 45%;
    color: #ffffff;
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
      color: #cccccc;
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
    color: #cccccc;
  }
}

// 有线设备面板样式
.right_top {
  flex: 1;
  display: flex;
  flex-direction: column;

  .indicator-cards3 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 0.8vw;
    margin-bottom: 1vw;

    .indicator-card3 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 51, 102, 0.3);
      border: 1px solid rgba(0, 153, 204, 0.3);
      border-radius: 8px;
      padding: 0.8vw;

      &.card1 {
        border-color: rgba(0, 204, 255, 0.5);
      }

      &.card2 {
        border-color: rgba(0, 255, 153, 0.5);
      }

      &.card3 {
        border-color: rgba(255, 204, 0, 0.5);
      }

      &.card4 {
        border-color: rgba(255, 102, 102, 0.5);
      }

      .indicator-title {
        font-size: 0.9vw;
        color: #99ccff;
        margin-bottom: 0.3vw;
        text-align: center;
      }

      .indicator-value {
        font-size: 2vw;
        font-weight: bold;
        color: #00ffcc;
        text-shadow: 0 0 6px rgba(0, 255, 204, 0.5);
        line-height: 1;
        margin-bottom: 0.2vw;

        .number-animate {
          display: inline-block;
        }
      }

      .indicator-unit {
        font-size: 0.8vw;
        color: #cccccc;
      }
    }
  }

  .device-status-chart {
    flex: 1;
    display: flex;
    flex-direction: column;

    .chart-content {
      display: flex;
      flex-direction: column;
      gap: 1vw;
      padding: 0 0.5vw;
    }

    .status-item {
      display: flex;
      align-items: center;

      .status-label {
        width: 3.5vw;
        font-size: 0.9vw;
        color: #ffffff;
      }

      .status-bar {
        flex: 1;
        height: 1.2vw;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 0.6vw;
        overflow: hidden;
        margin: 0 0.8vw;

        .status-fill {
          height: 100%;
          border-radius: 0.6vw;
          transition: width 1s ease;
        }
      }

      .status-value {
        width: 4vw;
        font-size: 0.9vw;
        text-align: right;
        color: #00ffcc;
        font-weight: bold;
      }

      &.status-normal .status-fill {
        background: linear-gradient(90deg, rgba(0, 255, 153, 0.8), rgba(0, 204, 255, 0.8));
      }

      &.status-fault .status-fill {
        background: linear-gradient(90deg, rgba(255, 102, 102, 0.8), rgba(255, 153, 102, 0.8));
      }

      &.status-offline .status-fill {
        background: linear-gradient(90deg, rgba(153, 153, 153, 0.8), rgba(102, 102, 102, 0.8));
      }
    }
  }
}

// 处理事件汇总面板样式
.right_bottom {
  flex: 1;
  display: flex;
  flex-direction: column;

  // 表格容器
  .table-box1 {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: calc(100% - 2vh);
    overflow: auto hidden;
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
}

// 表格样式（完全按照参考代码）
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

// ElTag样式（完全按照参考代码）
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

// 顶部导航容器
.top-nav-container {
  position: absolute;
  left: 4vw;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

// 顶部导航列表
.top-nav-list {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 1vw;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    cursor: pointer;
    font-size: 1.1vw;

    &:hover {
      .nav-border {
        transform: scale(1.05);
        box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
      }
    }

    &.active {
      .nav-border {
        background: rgba(0, 204, 255, 0.1);
        border-color: #00ccff;

        span {
          color: #00ffcc;
          text-shadow: 0 0 8px rgba(0, 255, 204, 0.5);
        }

        .nav-corner {
          border-color: #00ffcc;
        }
      }
    }
  }
}

// 导航边框样式（参考 datav-border.scss）
.nav-border {
  position: relative;
  padding: 0.3vw 0.6vw;
  margin-bottom: 1vw;
  margin-left: 1vw;
  color: #00ccff;
  background: rgba(0, 51, 102, 0.2);
  border: 1px solid rgba(0, 204, 255, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;

  span {
    font-weight: bold;
    letter-spacing: 1px;
    transition: color 0.3s;
  }
}

// 导航角标样式
.nav-corner {
  position: absolute;
  width: 0.5vw;
  height: 0.5vw;
  border: 1px solid #00ccff;
  transition: border-color 0.3s;
}

.nav-corner.top-left {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.nav-corner.bottom-right {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

</style>
