<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import chargingStation from './chargingStation/index.vue';
import chargingStationChart from './chargingStation/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '充电场站管理',
    components: chargingStation,
    chartComponent: chargingStationChart,
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

const activeName = ref('充电场站管理');
const secondShow = ref(false);

const chargingStationRef = ref(null);
const setChargingStationRef = (el) => {
  if (el) chargingStationRef.value = el;
};

// 辅助：标准化状态（用于卡片筛选）
const normalizeStatus = (status) => {
  if (!status) return '';
  const lower = status.toLowerCase();
  if (lower === 'enabled' || lower === '已启用') return 'enabled';
  if (lower === 'disabled' || lower === '已停用') return 'disabled';
  if (lower === 'wait' || lower === '未启用') return 'wait';
  return lower;
};

// 卡片点击筛选
const onCardSelect = async (status) => {
  await nextTick();
  if (!chargingStationRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  chargingStationRef.value.clearFilters();
  if (status === 'total') {
    // 总场站数：不添加任何筛选，即显示全部
    return;
  }
  chargingStationRef.value.handleFilterTagClick('stationStatus', normalizeStatus(status));
};

// 地图标注点点击筛选（场站名称）
const onMarkerSelect = async (stationName) => {
  await nextTick();
  if (!chargingStationRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  chargingStationRef.value.clearFilters();
  chargingStationRef.value.handleFilterTagClick('stationName', stationName);
};

const currentTab = computed(() => {
  return tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0];
});
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <component
      v-if="currentArrowShow"
      :is="currentChartComponent"
      @cardSelect="onCardSelect"
      @markerSelect="onMarkerSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :ref="setChargingStationRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
