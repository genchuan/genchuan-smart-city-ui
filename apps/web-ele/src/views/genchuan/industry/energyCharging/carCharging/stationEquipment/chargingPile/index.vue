<!-- charging-pile/index.vue -->
<template>
  <div class="common-index">
    <carchart ref="chartRef" v-if="tabArray[0].arrowShow" @drill-down="handleDrillDown" />
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
        <Table
          v-if="item.label === '充电桩管理'"
          ref="tableRef"
          :second-show="item.secondShow"
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

import carchart from './table/chargingPileChart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const chartRef = ref(null);
const tableRef = ref(null);

const refreshChart = () => {
  chartRef.value?.fetchOverview();
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
    label: '充电桩管理',
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

const activeName = ref('充电桩管理');

// 获取表格组件实例（兼容数组情况）
const getTableInstance = () => {
  let instance = tableRef.value;
  if (Array.isArray(instance)) {
    instance = instance[0];
  }
  return instance;
};

// 图表钻取处理 - 完善版本，增加空值检查和错误处理
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
      // 卡片点击：总充电桩数、运行中数量、故障数量、停用数量
      let filters = {};
      if (data.statusType === 'enable') {
        filters = { pileStatus: '已启用' };
      } else if (data.statusType === 'fault') {
        filters = { faultFlag: true };
      } else if (data.statusType === 'disabled') {
        filters = { pileStatus: '已停用' };
      } else if (data.statusType === 'total') {
        if (typeof tableInstance.resetFilter === 'function') {
          tableInstance.resetFilter();
        } else {
          tableInstance.setFilter({});
        }
        return;
      }
      tableInstance.setFilter(filters);
      break;

    case 'type':
      // 柱状图点击：各类型充电桩数量统计 -> 筛选对应充电模式
      if (data.typeName) {
        tableInstance.setFilter({ chargeMode: data.typeName });
      }
      break;

    case 'trend':
      // 折线图点击：充电桩运行时长趋势 -> 筛选对应运行时长
      if (data.runTime !== undefined && data.runTime !== null) {
        const runTimeValue = parseFloat(data.runTime);
        if (!isNaN(runTimeValue)) {
          tableInstance.setFilter({ runTime: runTimeValue });
        }
      }
      break;

    default:
      console.warn('未知的钻取类型:', type);
      break;
  }
};
</script>
