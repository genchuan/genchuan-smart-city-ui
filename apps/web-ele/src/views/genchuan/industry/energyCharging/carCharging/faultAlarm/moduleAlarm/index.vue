<!-- module-alarm/index.vue -->
<template>
  <div class="common-index">
    <chart ref="chartRef" v-if="tabArray[0].arrowShow" @drill-down="handleDrillDown" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus">
        <ArrowDown />
      </el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus">
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.components"
          ref="tableRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
          @refresh-chart="refreshChart"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import chart from './table/AlarmChart.vue';
import Table from './table/index.vue';

const chartRef = ref(null);
const tableRef = ref(null);
const refreshChart = () => {
  chartRef.value?.fetchChartData();
};

const secondShow = ref(false);
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '模块告警管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('模块告警管理');

// 图表钻取处理（传递给表格组件筛选）
const handleDrillDown = async (payload) => {
  const { type, data } = payload;
  if (!tableRef.value) return;

  switch (type) {
    case 'card':
      // 卡片钻取：筛选对应状态的告警
      if (data.statusType === 'total') {
        tableRef.value.resetFilter();
      } else if (data.statusType === 'unrepaired') {
        tableRef.value.setFilter({ alarmStatus: ['未排查', '已排查', '修复中'] });
      } else if (data.statusType === 'repaired') {
        tableRef.value.setFilter({ alarmStatus: ['已销账'] });
      }
      break;
    case 'bar':
      // 柱状图钻取：筛选对应模块的告警
      if (data.moduleName) {
        tableRef.value.setFilter({ moduleName: data.moduleName });
      }
      break;
    case 'line':
      // 折线图钻取：筛选对应日期的告警（按修复时间范围）
      if (data.date) {
        tableRef.value.setFilter({
          repairTimeStart: `${data.date} 00:00:00`,
          repairTimeEnd: `${data.date} 23:59:59`,
        });
      }
      break;
    default:
      break;
  }
};
</script>

<style scoped lang="scss">
.common-index {
  width: 100%;
  height: 100%;
}
.icon-change {
  text-align: center;
  cursor: pointer;
  margin: 8px 0;
}
.tabel-tab-icon {
  font-size: 20px;
  color: #409eff;
}
.common-tabs {
  margin-top: 8px;
}
.table-first {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
