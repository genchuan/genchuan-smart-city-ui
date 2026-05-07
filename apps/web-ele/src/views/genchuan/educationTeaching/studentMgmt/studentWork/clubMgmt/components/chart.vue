<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
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

// 时间范围选择器绑定的值（数组格式 [startDate, endDate]）
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（带 T 分隔，如 "2023-01-01T00:00:00"）
// isEnd: 是否为结束时间（结束时间用 23:59:59，起始用 00:00:00）
const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day}T${time}`;
};

// 生成 timeRange 字符串（格式："起始时间,结束时间"）
const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

// 日期范围变化时重新加载数据
const handleDateRangeChange = () => {
  loadData();
};

const loading = ref(true);
const overviewData = ref({});        // 看板数据（卡片 + 饼图）
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
    name: item.name || '未知类型',
    value: item.count
  }));
});

// 社团类型数量分布饼图数据（来自 overview 接口的 clubTypeDistribution）
// 将后端返回的 { count, name, type } 转换为 { name: 中文, value: count }
const clubTypeDistributionPieData = computed(() => {
  const distribution = overviewData.value.clubTypeDistribution || [];
  return distribution.map(item => ({
    name: item.name || clubTypeMap[item.type] || '未知',
    value: item.count
  }));
});

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

const emit = defineEmits(['pieClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClickWrapper = (item) => {
  const currentType = currentPieData.value.pieType;
  if (currentType === 'club') {
    emit('pieClick', { type: 'clubName', value: item.name });
  } else if (currentType === 'type' || currentType === 'clubTypeCount') {
    emit('pieClick', { type: 'clubType', value: item.name });
  }
};

// 加载数据
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

    <!-- 饼图切换区域（含日期选择器） -->
    <div class="pie-chart-area">
      <!-- 将日期选择器放在饼图区域上方 -->
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

  .el-range__icon {
    margin-right: 2px;
  }

  .el-range-separator {
    padding: 0 4px;
  }

  .el-range__close-icon {
    margin-left: 2px;
  }
}
</style>
