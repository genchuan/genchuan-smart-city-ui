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

    <!-- 运行时长明细弹窗（折线图钻取） -->
    <el-dialog v-model="trendDetailVisible" title="设备运行明细" width="60%">
      <el-table :data="trendDetailList" border v-loading="trendDetailLoading">
        <el-table-column prop="pileCode" label="设备编号" min-width="150" />
        <el-table-column prop="runTime" label="运行时长(小时)" min-width="120" />
        <el-table-column prop="stationName" label="所属场站" min-width="150" />
      </el-table>
      <div v-if="trendDetailList.length === 0 && !trendDetailLoading" class="empty-tip">暂无运行明细数据</div>
      <template #footer>
        <el-button @click="trendDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

import carchart from './table/chargingPileChart.vue';
import Table from './table/index.vue';
import { getPageList } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

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

// 运行明细弹窗
const trendDetailVisible = ref(false);
const trendDetailList = ref([]);
const trendDetailLoading = ref(false);

// 辅助：获取状态ID
const getStatusIdByName = (name, statusMap) => {
  for (let [id, label] of statusMap.entries()) {
    if (label === name) return id;
  }
  return null;
};

// 图表钻取处理
const handleDrillDown = async (payload) => {
  const { type, data } = payload;
  if (!tableRef.value) return;

  // 获取当前字典映射（从表格组件暴露或重新获取，此处通过表格实例内部维护，但为了映射，简单重新获取）
  // 实际可以从表格组件获取，但为了解耦，直接调用API获取映射（或者从全局状态获取）
  // 简便方式：调用表格组件暴露的映射表（需要tableRef暴露chargeModeMap/pileStatusMap）
  // 这里假设表格组件已经加载过字典，我们直接调用其内部方法；为了可靠，重新获取一次（但可能影响性能）
  // 由于表格组件尚未暴露map，我们采用内部请求方式（仅做演示，实际生产建议通过store或ref传递）
  // 为避免复杂度，我们直接在handleDrillDown中请求字典（但可能异步延迟，先简单处理为从表格组件取）
  // 修改：让表格组件对外暴露 getMaps 方法，这里先采用临时方案：从表格实例取内部状态（需要修改表格defineExpose）
  // 为了快速修复，直接使用已知的默认ID（根据后端实际值，但不可靠）。最佳实践：在父组件维护字典。
  // 简单起见，我们在表格组件中增加 expose 方法 getMaps，父组件调用。
  // 但由于时间，我们暂时假设表格组件已通过 emit 将字典传上来？不推荐。
  // 这里采用保守方案：直接根据字符串筛选，后端支持字符串名称（如果后端支持则没问题）
  // 根据需求，建议后端同时支持名称和ID，但为稳妥，我们传递ID。由于表格setFilter会做转换，父组件可以传递原始名称，由setFilter转换。
  // 因此，对于status和type，直接传递中文名称，setFilter内部会转换。已经修改setFilter支持名称转ID，所以父组件无需修改。
  // 但需要确保setFilter的转换函数能访问到映射表，已在表格中实现。
  switch (type) {
    case 'status':
      let filters = {};
      if (data.statusType === 'enable') {
        filters = { pileStatus: '已启用' };
      } else if (data.statusType === 'fault') {
        filters = { faultFlag: true };
      } else if (data.statusType === 'disabled') {
        filters = { pileStatus: '已停用' };
      } else if (data.statusType === 'total') {
        tableRef.value.resetFilter();
        return;
      }
      tableRef.value.setFilter(filters);
      break;
    case 'type':
      tableRef.value.setFilter({ chargeMode: data.typeName });
      break;
    case 'trend':
      trendDetailVisible.value = true;
      trendDetailLoading.value = true;
      try {
        const res = await getPageList({ pageNo: 1, pageSize: 10 });
        const list = (res.list || []).map(item => ({
          pileCode: item.pileCode,
          runTime: item.runTime || 0,
          stationName: item.stationName,
        })).sort((a, b) => b.runTime - a.runTime);
        trendDetailList.value = list;
      } catch (error) {
        ElMessage.error('获取运行明细失败');
        trendDetailList.value = [];
      } finally {
        trendDetailLoading.value = false;
      }
      break;
    default:
      break;
  }
};
</script>
