<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import pileAlarm from './pileAlarm/index.vue';
import pileAlarmChart from './pileAlarm/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => { v.secondShow = secondShow.value; });
};

const tabArray = ref([
  {
    label: '充电桩告警管理',
    components: pileAlarm,
    chartComponent: pileAlarmChart,
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

const activeName = ref('充电桩告警管理');
const secondShow = ref(false);

const pileAlarmRef = ref(null);
const setPileAlarmRef = (el) => {
  if (el) pileAlarmRef.value = el;
};

// 饼图点击筛选（故障类型）
const onPieSelect = async (faultType) => {
  await nextTick();
  if (!pileAlarmRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  pileAlarmRef.value.handleFilterTagClick('faultType', faultType);
};

// 柱状图点击筛选（日期）
const onBarSelect = async (date) => {
  await nextTick();
  if (!pileAlarmRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  pileAlarmRef.value.handleFilterTagClick('alarmTime', date);
};

// 卡片点击筛选
const onCardSelect = async (status) => {
  await nextTick();
  if (!pileAlarmRef.value) {
    ElMessage.warning('列表组件未就绪，请稍后重试');
    return;
  }
  // 先清除所有现有筛选
  pileAlarmRef.value.clearFilters();
  // 根据卡片类型添加相应筛选
  switch (status) {
    case 'total':
      // 总告警数：不添加任何筛选，即显示全部
      break;
    case 'unhandled':
      // 未处置数：筛选状态为未派单、已派单、处置中
      pileAlarmRef.value.handleFilterTagClick('alarmStatus', ['未派单', '已派单', '处置中']);
      break;
    case 'handled':
    case 'rate':
      // 已处置数 或 处置完成率：筛选状态为已销单
      pileAlarmRef.value.handleFilterTagClick('alarmStatus', '已销单');
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
          :ref="setPileAlarmRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
