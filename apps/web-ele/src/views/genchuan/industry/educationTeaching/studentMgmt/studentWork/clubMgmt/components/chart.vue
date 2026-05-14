<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getClubMgmtChart,
  getClubDistribution,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/clubMgmt/data.js';

// 社团类型映射（后端 type 数字转中文）
const clubTypeMap = {
  '1': '文体',
  '2': '学术',
  '3': '志愿',
  '4': '其他'
};

// 时间范围选择器
const timeRange = ref([]);
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};
const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day}T${time}`;
};
const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};
const handleDateRangeChange = () => {
  loadData();
};

const loading = ref(true);
const overviewData = ref({});
const clubData = ref([]);
const typeData = ref([]);

// 卡片列表
const cardList = computed(() => {
  const totalClub = overviewData.value.totalClubCount || 0;
  const totalMember = overviewData.value.totalMemberCount || 0;
  const pendingAudit = overviewData.value.pendingAuditCount || 0;
  const venueApply = overviewData.value.venueApplyCount || 0;
  return [
    { title: '社团总数', value: totalClub, color: '#409EFF', status: 'totalClub' },
    { title: '成员总数', value: totalMember, color: '#67C23A', status: 'totalMember' },
    { title: '待审核入团', value: pendingAudit, color: '#E6A23C', status: 'pendingAudit' },
    { title: '场馆申请次数', value: venueApply, color: '#F56C6C', status: 'venueApply' },
  ];
});

// 各社团人数占比饼图数据
const clubPieData = computed(() => clubData.value.map(item => ({
  name: item.clubName,
  value: item.memberCount,
})));

// 社团类型成员分布饼图数据
const typePieData = computed(() => {
  return (typeData.value || []).map(item => ({
    name: item.name || '未知类型',
    value: item.count
  }));
});

// 社团类型数量分布饼图数据
const clubTypeDistributionPieData = computed(() => {
  const distribution = overviewData.value.clubTypeDistribution || [];
  return distribution.map(item => ({
    name: item.name || clubTypeMap[item.type] || '未知',
    value: item.count
  }));
});

// 饼图切换选项
const pieOptions = computed(() => [
  { title: '各社团人数占比', data: clubPieData.value, pieType: 'club' },
  { title: '社团类型成员分布', data: typePieData.value, pieType: 'type' },
  { title: '社团类型数量分布', data: clubTypeDistributionPieData.value, pieType: 'clubTypeCount' },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 核心修改：所有点击改为派发自定义事件 ==========
// 卡片点击：映射筛选条件
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'pendingAudit':   // 待审核入团 → 筛选状态为“待审核”
      filterType = 'status';
      filterValue = '待审核';
      break;
    case 'totalClub':
    case 'totalMember':
    case 'venueApply':
    default:
      // 其他卡片不触发筛选（可根据需求调整，这里都不筛选）
      return;
  }
  if (filterType) {
    window.dispatchEvent(new CustomEvent('club-chart-filter', {
      detail: { type: filterType, value: filterValue }
    }));
  }
};

// 饼图点击（根据当前饼图类型派发不同筛选）
const handlePieClickWrapper = (item) => {
  const currentType = currentPieData.value.pieType;
  if (currentType === 'club') {
    // 点击具体社团 → 筛选社团名称
    window.dispatchEvent(new CustomEvent('club-chart-filter', {
      detail: { type: 'clubName', value: item.name }
    }));
  } else if (currentType === 'type' || currentType === 'clubTypeCount') {
    // 点击社团类型 → 筛选社团类型
    window.dispatchEvent(new CustomEvent('club-chart-filter', {
      detail: { type: 'clubType', value: item.name }
    }));
  }
};

// 加载数据（保持不变）
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [overviewRes, distributionRes] = await Promise.allSettled([
      getClubMgmtChart({ timeRange: timeRangeParam }),
      getClubDistribution({ timeRange: timeRangeParam }),
    ]);
    if (overviewRes.status === 'fulfilled') {
      overviewData.value = overviewRes.value;
    } else {
      console.warn('看板接口失败，使用模拟数据', overviewRes.reason);
      overviewData.value = {
        totalClubCount: 9,
        totalMemberCount: 9,
        pendingAuditCount: 1,
        venueApplyCount: 9,
        clubTypeDistribution: [
          { count: 4, name: "文体", type: "1" },
          { count: 3, name: "学术", type: "2" },
          { count: 2, name: "志愿", type: "3" }
        ],
      };
    }
    if (distributionRes.status === 'fulfilled') {
      clubData.value = distributionRes.value.clubStatistics || [];
      typeData.value = distributionRes.value.typeMemberDistribution || [];
    } else {
      console.warn('分布接口失败，使用模拟数据', distributionRes.reason);
      clubData.value = [
        { clubName: '篮球社', memberCount: 68, clubType: '文体' },
        { clubName: '文学社', memberCount: 42, clubType: '学术' },
        { clubName: '志愿者协会', memberCount: 86, clubType: '志愿' },
        { clubName: '动漫社', memberCount: 35, clubType: '其他' },
      ];
      typeData.value = [
        { name: '文体', count: 426 },
        { name: '学术', count: 235 },
        { name: '志愿', count: 189 },
        { name: '其他', count: 46 },
      ];
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  timeRange.value = getDefaultTimeRange();
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 卡片区 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 饼图切换区域 -->
    <div class="pie-chart-area">
      <div class="date-range-wrapper">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始"
          end-placeholder="结束"
          size="small"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :shortcuts="[
            { text: '近7天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 7); return [start, end]; } },
            { text: '近30天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 30); return [start, end]; } },
            { text: '近90天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 90); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
      </div>
      <div class="pie-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
      </div>
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieData.title"
        :data="currentPieData.data"
        @pie-click="handlePieClickWrapper"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;
    .left-card { height: 150px !important; }
  }
}
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  height: 100%;
  margin-left: 12px;
}
.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
.date-range-wrapper {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index: 10;
}
:deep(.el-date-editor) {
  --el-date-editor-width: 240px;
  .el-range__icon { margin-right: 2px; }
  .el-range-separator { padding: 0 4px; }
  .el-range__close-icon { margin-left: 2px; }
}
</style>
