<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import targetMgmt from './targetMgmt/index.vue';
import targetMgmtChart from './targetMgmt/components/chart.vue';
import compareMgmt from './compareMgmt/index.vue';
import compareMgmtChart from './compareMgmt/components/chart.vue';
import moralActivity from './moralActivity/index.vue';
import moralActivityChart from './moralActivity/components/chart.vue';
import moralResource from './moralResource/index.vue';
import moralResourceChart from './moralResource/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '指标管理',
    components: targetMgmt,
    chartComponent: targetMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '评比管理',
    components: compareMgmt,
    chartComponent: compareMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '德育活动',
    components: moralActivity,
    chartComponent: moralActivityChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '德育资源',
    components: moralResource,
    chartComponent: moralResourceChart,
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

const activeName = ref('指标管理');
const secondShow = ref(false);

// 指标管理组件引用
const targetMgmtRef = ref(null);
const setTargetMgmtRef = (el) => {
  if (el) targetMgmtRef.value = el;
};

// 评比管理组件引用
const compareMgmtRef = ref(null);
const setCompareMgmtRef = (el) => {
  if (el) compareMgmtRef.value = el;
};

// 德育活动组件引用
const moralActivityRef = ref(null);
const setMoralActivityRef = (el) => {
  if (el) moralActivityRef.value = el;
};

// 德育资源组件引用
const moralResourceRef = ref(null);
const setMoralResourceRef = (el) => {
  if (el) moralResourceRef.value = el;
};

// ========== 指标管理图表事件 ==========
const onTargetBarSelect = async ({field, value}) => {
  await nextTick();
  if (!targetMgmtRef.value) {
    ElMessage.warning('指标管理列表组件未就绪');
    return;
  }
  targetMgmtRef.value.handleFilterTagClick(field, value);
};

const onTargetCardSelect = async (status) => {
  await nextTick();
  if (!targetMgmtRef.value) {
    ElMessage.warning('指标管理列表组件未就绪');
    return;
  }
  switch (status) {
    case 'total':
      targetMgmtRef.value.clearFilters();
      break;
    case 'enabled':
      targetMgmtRef.value.handleFilterTagClick('status', '已启用');
      break;
    case 'unEnabled':
      targetMgmtRef.value.handleFilterTagClick('status', '未启用');
      break;
    default:
      break;
  }
};

// ========== 评比管理图表事件 ==========
const onCompareBarSelect = async ({field, value}) => {
  await nextTick();
  if (!compareMgmtRef.value) {
    ElMessage.warning('评比管理列表组件未就绪');
    return;
  }
  compareMgmtRef.value.handleFilterTagClick(field, value);
};

const onCompareCardSelect = async (status) => {
  await nextTick();
  if (!compareMgmtRef.value) {
    ElMessage.warning('评比管理列表组件未就绪');
    return;
  }
  compareMgmtRef.value.clearFilters();
  if (status === 'scoring') {
    compareMgmtRef.value.handleFilterTagClick('status', '打分中');
  } else if (status === 'finished') {
    compareMgmtRef.value.handleFilterTagClick('status', '已汇总');
  }
};

// ========== 德育活动图表事件 ==========
const onMoralBarSelect = async ({field, value}) => {
  await nextTick();
  if (!moralActivityRef.value) {
    ElMessage.warning('德育活动列表组件未就绪');
    return;
  }
  moralActivityRef.value.handleFilterTagClick(field, value);
};

// ========== 德育资源图表事件 ==========
const onMoralResourceBarSelect = async ({field, value}) => {
  await nextTick();
  if (!moralResourceRef.value) {
    ElMessage.warning('德育资源列表组件未就绪');
    return;
  }
  moralResourceRef.value.handleFilterTagClick(field, value);
};

const onMoralResourcePieSelect = async ({field, value}) => {
  await nextTick();
  if (!moralResourceRef.value) {
    ElMessage.warning('德育资源列表组件未就绪');
    return;
  }
  moralResourceRef.value.handleFilterTagClick(field, value);
};

// 当前激活的Tab
const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 指标管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '指标管理'"
      :is="currentChartComponent"
      @barSelect="onTargetBarSelect"
      @cardSelect="onTargetCardSelect"
    />
    <!-- 评比管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '评比管理'"
      :is="currentChartComponent"
      @barSelect="onCompareBarSelect"
      @cardSelect="onCompareCardSelect"
    />
    <!-- 德育活动图表 -->
    <component
      v-if="currentArrowShow && activeName === '德育活动'"
      :is="currentChartComponent"
      @barSelect="onMoralBarSelect"
    />
    <!-- 德育资源图表 -->
    <component
      v-if="currentArrowShow && activeName === '德育资源'"
      :is="currentChartComponent"
      @barSelect="onMoralResourceBarSelect"
      @pieSelect="onMoralResourcePieSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 指标管理组件 -->
        <component
          v-if="item.label === '指标管理'"
          :is="item.components"
          :ref="setTargetMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 评比管理组件 -->
        <component
          v-else-if="item.label === '评比管理'"
          :is="item.components"
          :ref="setCompareMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 德育活动组件 -->
        <component
          v-else-if="item.label === '德育活动'"
          :is="item.components"
          :ref="setMoralActivityRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 德育资源组件 -->
        <component
          v-else
          :is="item.components"
          :ref="setMoralResourceRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
