<script setup>
import { computed, onMounted, reactive } from 'vue';
import { userOptions } from './data.js'
import { getScheduleViewChart } from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/scheduleView';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';

import {
  getMockChartData,
  getScheduleStatusOptionValue,
  getShiftTypeTagType,
  getUserName,
} from './data';

const emit = defineEmits(['dateFilter', 'statusFilter', 'userFilter']);

const CALENDAR_ROW_COUNT = 2;
const CALENDAR_COL_COUNT = 6;
const CALENDAR_CELL_COUNT = CALENDAR_ROW_COUNT * CALENDAR_COL_COUNT;

const state = reactive({
  cardList: [
    {
      title: '排班数',
      value: 0,
      desc: '全部排班',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '在岗人员数',
      value: 0,
      desc: '正常排班人员',
      status: getScheduleStatusOptionValue('正常'),
      color: '#27ae60',
    },
  ],
  calendarData: [],
  userData: [],
});

const userXData = computed(() => state.userData.map((item) => item.userName));
const userSeriesData = computed(() => [
  {
    name: '排班次数',
    data: state.userData.map((item) => item.count),
  },
]);
const calendarCells = computed(() => {
  const grouped = new Map();
  state.calendarData.forEach((item) => {
    const list = grouped.get(item.date) || [];
    list.push({
      ...item,
      userName: item.userName || getUserName(item.userId),
    });
    grouped.set(item.date, list);
  });
  const cells = [...grouped.entries()]
    .map(([date, schedules]) => ({
      date,
      day: date.slice(-2),
      schedules,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, CALENDAR_CELL_COUNT);

  while (cells.length < CALENDAR_CELL_COUNT) {
    cells.push(null);
  }
  return cells;
});

function normalizeChartData(data) {
  const chartData =
    data?.calendarData || data?.userData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.scheduleCount ?? 0;
  state.cardList[1].value = cardData.onDutyCount ?? 0;
  state.calendarData = Array.isArray(chartData.calendarData)
    ? chartData.calendarData
    : [];
  state.userData = Array.isArray(chartData.userData) ? chartData.userData : [];
}

async function fetchChartData() {
  try {
    const response = await getScheduleViewChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取排班统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status || '');
}

function handleDateClick(date) {
  const dateTime = new Date(`${date} 00:00:00`)?.getTime();
  emit('dateFilter', dateTime);
}

function handleUserClick(userName) {
  console.log(userName);
  const user = userOptions?.find((v) => v.label === userName) ?? null
  console.log(user);
  emit('userFilter', user);
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <IndicatorClick
        v-for="card in state.cardList"
        class="left-card"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <div class="park-type-chart schedule-calendar-section">
      <div class="calendar-title">排班日历展示</div>
      <div class="calendar-grid">
        <button
          v-for="(cell, index) in calendarCells"
          :key="cell?.date ?? `empty-${index}`"
          class="calendar-cell"
          :class="{ 'is-empty': !cell }"
          type="button"
          :disabled="!cell"
          @click="cell && handleDateClick(cell.date)"
        >
          <template v-if="cell">
            <span class="calendar-day">{{ cell.day }}</span>
            <span class="calendar-date">{{ cell.date }}</span>
            <div class="calendar-shifts">
              <span
                v-for="schedule in cell.schedules"
                :key="`${cell.date}-${schedule.userId}-${schedule.shiftType}`"
                class="calendar-shift"
              >
                {{ schedule.userName }}
              </span>
            </div>
          </template>
        </button>
      </div>
    </div>

    <BarClick
      class="simple-bar-chart"
      title="人员排班分布"
      :series-data="userSeriesData"
      :x-data="userXData"
      y-name="排班数"
      @bar-click="handleUserClick"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box-left {
  .left-card {
    height: 159px !important;
  }
}

.schedule-calendar-section {
  display: flex;
  flex: 1.05 1 0;
  flex-direction: column;
  min-width: 0;
  padding: 14px;
  overflow: hidden;
}

.calendar-title {
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #6e7e91;
  text-align: center;
}

.calendar-grid {
  display: grid;
  flex: 1;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  min-height: 0;
  overflow: hidden;
}

.calendar-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 8px;
  text-align: left;
  cursor: pointer;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

.calendar-cell:not(:disabled):hover {
  border-color: var(--el-color-primary);
}

.calendar-cell.is-empty,
.calendar-cell:disabled {
  cursor: default;
  background: var(--el-fill-color-lighter);
  border-style: dashed;
}

.calendar-day {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  color: var(--el-text-color-primary);
}

.calendar-date {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.calendar-shifts {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-height: 0;
  overflow-y: auto;
}

.calendar-shift {
  flex-shrink: 0;
  max-width: 100%;
  padding: 2px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  border-radius: 6px;
}

.shift-success {
  color: var(--el-color-success);
  background-color: var(--el-color-success-light-9);
}

.shift-warning {
  color: var(--el-color-warning);
  background-color: var(--el-color-warning-light-9);
}

.shift-info {
  color: var(--el-color-info);
  background-color: var(--el-color-info-light-9);
}
</style>
