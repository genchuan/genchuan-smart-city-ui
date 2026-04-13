<!-- module-alarm/index.vue -->
<template>
  <div class="common-index">
    <AlarmChart ref="chartRef" v-if="tabArray[0].arrowShow" @drill-down="handleDrillDown" />
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
import { ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import AlarmChart from './table/AlarmChart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

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

// 获取表格组件实例（兼容数组情况）
const getTableInstance = () => {
  let instance = tableRef.value;
  if (Array.isArray(instance)) {
    instance = instance[0];
  }
  return instance;
};

// 图表钻取处理 - 调用表格的 setFilter 或 resetFilter
const handleDrillDown = async (payload) => {
  const { type, data } = payload;

  await nextTick();

  const tableInstance = getTableInstance();
  if (!tableInstance) {
    console.error('表格组件引用未找到');
    ElMessage?.error('表格组件未加载完成，请重试');
    return;
  }

  if (typeof tableInstance.setFilter !== 'function') {
    console.error('表格组件未暴露 setFilter 方法', tableInstance);
    ElMessage?.error('表格组件方法缺失，请刷新页面重试');
    return;
  }

  switch (type) {
    case 'status':
      // 卡片点击：总告警数、未修复告警数、已修复告警数、修复中数量
      if (data.statusType === 'total') {
        tableInstance.resetFilter();
      } else if (data.statusType === 'unrepaired') {
        tableInstance.setFilter({ alarmStatus: ['未修复'] });
      } else if (data.statusType === 'repaired') {
        tableInstance.setFilter({ alarmStatus: ['已销账'] });
      } else if (data.statusType === 'repairing') {
        tableInstance.setFilter({ alarmStatus: ['修复中'] });
      }
      break;

    case 'type':
      // 柱状图点击：各模块告警数量统计 -> 筛选对应模块名称
      if (data.typeName) {
        tableInstance.setFilter({ moduleName: data.typeName });
      }
      break;

    case 'trend':
      // 折线图点击：告警修复时长趋势 -> 筛选对应修复日期
      if (data.date) {
        tableInstance.setFilter({
          repairTimeStart: `${data.date} 00:00:00`,
          repairTimeEnd: `${data.date} 23:59:59`,
        });
      }
      break;

    default:
      console.warn('未知的钻取类型:', type);
      break;
  }
};
</script>

<style scoped lang="scss">
@import '#/components/page/index.scss';

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
