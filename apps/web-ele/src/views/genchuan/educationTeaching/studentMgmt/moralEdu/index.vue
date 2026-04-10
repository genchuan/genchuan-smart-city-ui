<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import targetMgmt from './targetMgmt/index.vue';
import targetMgmtChart from './targetMgmt/components/chart.vue';
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
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const activeName = ref('指标管理');
const secondShow = ref(false);

const targetMgmtRef = ref(null);
const setTargetMgmtRef = (el) => {
  if (el) targetMgmtRef.value = el;
};

// 指标管理图表事件
const onTargetBarSelect = async ({ field, value }) => {
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
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :ref="item.label === '指标管理' ? setTargetMgmtRef : undefined"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
