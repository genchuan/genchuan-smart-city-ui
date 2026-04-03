<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import abnormalOrder from './abnormalOrder/index.vue';
import abnormalOrderChart from './abnormalOrder/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => { v.secondShow = secondShow.value; });
};

const tabArray = ref([
  {
    label: '异常订单管理',
    components: abnormalOrder,
    chartComponent: abnormalOrderChart,
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

const activeName = ref('异常订单管理');
const secondShow = ref(false);

const abnormalOrderRef = ref(null);
const setAbnormalOrderRef = (el) => {
  if (el) abnormalOrderRef.value = el;
};

// 饼图点击筛选（异常类型）
const onPieSelect = async (abnormalType) => {
  await nextTick();
  if (!abnormalOrderRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  abnormalOrderRef.value.handleFilterTagClick('abnormalType', abnormalType);
};

// 柱状图点击筛选（日期）
const onBarSelect = async (date) => {
  await nextTick();
  if (!abnormalOrderRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  abnormalOrderRef.value.handleFilterTagClick('createTime', date);
};

// 卡片点击筛选
const onCardSelect = async (status) => {
  await nextTick();
  if (!abnormalOrderRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  abnormalOrderRef.value.clearFilters();
  switch (status) {
    case 'total':
      // 总异常订单数：不添加筛选
      break;
    case 'unhandled':
      // 未处理数：筛选状态为未核实、已核实、处理中
      abnormalOrderRef.value.handleFilterTagClick('abnormalStatus', ['未核实', '已核实', '处理中']);
      break;
    case 'handled':
    case 'rate':
      // 已处理数 / 处理完成率：筛选状态为已完结
      abnormalOrderRef.value.handleFilterTagClick('abnormalStatus', '已完结');
      break;
    default:
      break;
  }
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
      @pieSelect="onPieSelect"
      @barSelect="onBarSelect"
      @cardSelect="onCardSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :ref="setAbnormalOrderRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
