<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getClubMgmtChart,
  getClubDistribution,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/clubMgmt/data.js';

// 社团类型映射（后端 type 数字转中文）
const clubTypeMap = {
  '1': '文体',
  '2': '学术',
  '3': '志愿',
  '4': '其他'
};

// 默认 timeRange 参数（两个时间戳）
const defaultTimeRange = [1704067200000, 1798732799000];

// 格式化月份：将 "2024-09" 转为 "09月"
const formatMonth = (monthStr) => {
  if (!monthStr) return '';
  const parts = monthStr.split('-');
  if (parts.length === 2) {
    return `${parts[1]}月`;
  }
  return monthStr;
};

const loading = ref(true);
const overviewData = ref({});        // 看板数据（卡片 + 趋势）
const clubData = ref([]);            // 各社团人数数据 { clubName, memberCount }
const typeData = ref([]);            // 各类型成员分布数据 { name, count }

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

// 各社团人数占比饼图数据（来自 distribution 接口）
const clubPieData = computed(() => clubData.value.map(item => ({
  name: item.clubName,
  value: item.memberCount,
})));

// 社团类型成员分布饼图数据（来自 distribution 接口）
// 后端返回 { name, count }，需要转换为 { name, value }
const typePieData = computed(() => {
  return (typeData.value || []).map(item => ({
    name: item.name || '未知类型',   // 如果 name 为空，显示占位文本
    value: item.count
  }));
});

// 社团类型数量分布饼图数据（来自 overview 接口的 clubTypeDistribution）
// 将后端返回的 { count, type } 转换为 { name: 中文, value: count }
const clubTypeDistributionPieData = computed(() => {
  const distribution = overviewData.value.clubTypeDistribution || [];
  return distribution.map(item => ({
    name: clubTypeMap[item.type] || item.name || '未知',
    value: item.count
  }));
});

// 每月申请趋势折线图数据（格式化月份）
const lineXData = computed(() => {
  const trend = overviewData.value.monthlyApplyTrend || [];
  return trend.map(item => formatMonth(item.month));
});
const lineSeriesData = computed(() => [
  { name: '申请人数', data: (overviewData.value.monthlyApplyTrend || []).map(item => item.count) },
]);

// 饼图切换选项
const pieOptions = computed(() => [
  {
    title: '各社团人数占比',
    data: clubPieData.value,
    pieType: 'club',
  },
  {
    title: '社团类型成员分布',
    data: typePieData.value,
    pieType: 'type',
  },
  {
    title: '社团类型数量分布',
    data: clubTypeDistributionPieData.value,
    pieType: 'clubTypeCount',
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const emit = defineEmits(['pieClick', 'lineClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClickWrapper = (item) => {
  const currentType = currentPieData.value.pieType;
  if (currentType === 'club') {
    emit('pieClick', { type: 'clubName', value: item.name });
  } else if (currentType === 'type') {
    emit('pieClick', { type: 'clubType', value: item.name });
  } else if (currentType === 'clubTypeCount') {
    emit('pieClick', { type: 'clubType', value: item.name });
  }
};

const handleLineClick = (params) => {
  emit('lineClick', { type: 'month', value: params.name });
};

const loadData = async () => {
  loading.value = true;
  try {
    // 保留默认 timeRange 参数
    const [overviewRes, distributionRes] = await Promise.allSettled([
      getClubMgmtChart({ timeRange: defaultTimeRange }),
      getClubDistribution({ timeRange: defaultTimeRange }),
    ]);
    if (overviewRes.status === 'fulfilled') {
      overviewData.value = overviewRes.value;
    } else {
      console.warn('看板接口失败，使用模拟数据');
      overviewData.value = {
        totalClubCount: 9,
        totalMemberCount: 9,
        pendingAuditCount: 1,
        venueApplyCount: 9,
        clubTypeDistribution: [
          { count: 4, type: "1" },
          { count: 3, type: "2" },
          { count: 2, type: "3" }
        ],
        monthlyApplyTrend: [
          { month: "2024-09", count: 7 },
          { month: "2026-04", count: 2 }
        ],
      };
    }
    if (distributionRes.status === 'fulfilled') {
      clubData.value = distributionRes.value.clubStatistics || [];
      typeData.value = distributionRes.value.typeMemberDistribution || [];
    } else {
      console.warn('分布接口失败，使用模拟数据');
      clubData.value = [
        { clubName: '篮球社', memberCount: 68, clubType: '文体' },
        { clubName: '文学社', memberCount: 42, clubType: '学术' },
        { clubName: '志愿者协会', memberCount: 86, clubType: '志愿' },
        { clubName: '动漫社', memberCount: 35, clubType: '其他' },
      ];
      typeData.value = [
        { name: '文体', value: 426 },
        { name: '学术', value: 235 },
        { name: '志愿', value: 189 },
        { name: '其他', value: 46 },
      ];
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = {
      totalClubCount: 9,
      totalMemberCount: 9,
      pendingAuditCount: 1,
      venueApplyCount: 9,
      clubTypeDistribution: [
        { count: 4, type: "1" },
        { count: 3, type: "2" },
        { count: 2, type: "3" }
      ],
      monthlyApplyTrend: [
        { month: "2024-09", count: 7 },
        { month: "2026-04", count: 2 }
      ],
    };
    clubData.value = [
      { clubName: '篮球社', memberCount: 68, clubType: '文体' },
      { clubName: '文学社', memberCount: 42, clubType: '学术' },
      { clubName: '志愿者协会', memberCount: 86, clubType: '志愿' },
      { clubName: '动漫社', memberCount: 35, clubType: '其他' },
    ];
    typeData.value = [
      { name: '文体', value: 426 },
      { name: '学术', value: 235 },
      { name: '志愿', value: 189 },
      { name: '其他', value: 46 },
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
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

    <!-- 饼图切换区域（带下拉选择器） -->
    <div class="pie-chart-area">
      <div class="pie-select-wrapper">
        <el-select
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieData.title"
        :data="currentPieData.data"
        @pie-click="handlePieClickWrapper"
      />
    </div>

    <!-- 每月申请趋势折线图 -->
    <lineChart
      style="flex: 1 !important;"
      :title="'每月入团申请趋势'"
      :x-data="lineXData"
      :series-data="lineSeriesData"
      y-name="申请人数"
      @line-click="handleLineClick"
    />
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

    .left-card {
      height: 150px !important;
    }
  }
}

.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  height: 100%;
}

.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
