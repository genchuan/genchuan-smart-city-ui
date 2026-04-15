<script setup>
import {ref, computed, nextTick} from 'vue';
import {ElMessage} from 'element-plus';
import bedMgmt from './bedMgmt/index.vue';
import bedMgmtChart from './bedMgmt/components/chart.vue';
import dormCompare from './dormCompare/index.vue';
import dormCompareChart from './dormCompare/components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组
const tabArray = ref([
  {
    label: '床位管理',
    components: bedMgmt,
    chartComponent: bedMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '宿舍评比',
    components: dormCompare,
    chartComponent: dormCompareChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

// 箭头折叠切换（控制图表区域显隐）
const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('床位管理');
const secondShow = ref(false);

// 床位管理组件引用
const bedMgmtRef = ref(null);
const setBedMgmtRef = (el) => {
  if (el) bedMgmtRef.value = el;
};

// 宿舍评比组件引用
const dormCompareRef = ref(null);
const setDormCompareRef = (el) => {
  if (el) dormCompareRef.value = el;
};

// ========== 床位管理图表事件 ==========
const onBedCardSelect = async (status) => {
  await nextTick();
  if (!bedMgmtRef.value) {
    ElMessage.warning('床位管理列表组件未就绪');
    return;
  }
  bedMgmtRef.value.clearFilters();
  if (status === 'used') {
    bedMgmtRef.value.handleFilterTagClick('status', '已分配');
  } else if (status === 'unused') {
    bedMgmtRef.value.handleFilterTagClick('status', '未分配');
  }
};

const onBedPieSelect = async ({field, value}) => {
  await nextTick();
  if (!bedMgmtRef.value) {
    ElMessage.warning('床位管理列表组件未就绪');
    return;
  }
  bedMgmtRef.value.handleFilterTagClick('building', value);
};

const onBedLineSelect = async ({field, value}) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选操作记录`);
};

// ========== 宿舍评比图表事件 ==========
const onDormCardSelect = async (status) => {
  await nextTick();
  if (!dormCompareRef.value) {
    ElMessage.warning('宿舍评比列表组件未就绪');
    return;
  }
  // 卡片点击暂不实现筛选，可根据需求扩展
};

const onDormBarSelect = async ({field, value}) => {
  await nextTick();
  if (!dormCompareRef.value) {
    ElMessage.warning('宿舍评比列表组件未就绪');
    return;
  }
  dormCompareRef.value.handleFilterTagClick(field, value);
};

// 当前激活的Tab
const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 床位管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '床位管理'"
      :is="currentChartComponent"
      @cardSelect="onBedCardSelect"
      @pieSelect="onBedPieSelect"
      @lineSelect="onBedLineSelect"
    />
    <!-- 宿舍评比图表 -->
    <component
      v-if="currentArrowShow && activeName === '宿舍评比'"
      :is="currentChartComponent"
      @cardSelect="onDormCardSelect"
      @barSelect="onDormBarSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 床位管理组件 -->
        <component
          v-if="item.label === '床位管理'"
          :is="item.components"
          :ref="setBedMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 宿舍评比组件 -->
        <component
          v-else
          :is="item.components"
          :ref="setDormCompareRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
