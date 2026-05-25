<!-- 文件6: src/views/genchuan/industry/industrialpark/securityMgmt/index.vue（父容器，仅周界报警） -->
<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
// 周界报警组件
import perimeterAlarm from './perimeterAlarm/index.vue';
import perimeterAlarmChart from './perimeterAlarm/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '周界报警',
    components: perimeterAlarm,
    chartComponent: perimeterAlarmChart,
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

const activeName = ref('周界报警');
const secondShow = ref(false);

// 周界报警组件引用
const perimeterAlarmRef = ref(null);
const setPerimeterAlarmRef = (el) => {
  if (el) perimeterAlarmRef.value = el;
};

// ========== 周界报警图表事件 ==========
const onCardSelect = async (status) => {
  await nextTick();
  if (!perimeterAlarmRef.value) {
    ElMessage.warning('周界报警列表组件未就绪');
    return;
  }
  perimeterAlarmRef.value.clearFilters();
  if (status === 'handled') {
    perimeterAlarmRef.value.handleFilterTagClick('alarmStatus', '已处置');
  } else if (status === 'unhandled') {
    perimeterAlarmRef.value.handleFilterTagClick('alarmStatus', '告警中');
  }
  // 告警总数不筛选
};

const onBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!perimeterAlarmRef.value) {
    ElMessage.warning('周界报警列表组件未就绪');
    return;
  }
  perimeterAlarmRef.value.clearFilters();
  if (field === 'alarmTime') {
    perimeterAlarmRef.value.handleFilterTagClick('alarmTime', value);
  } else if (field === 'alarmArea') {
    perimeterAlarmRef.value.handleFilterTagClick('alarmArea', value);
  }
};

const onMarkerSelect = async (alarmArea) => {
  await nextTick();
  if (!perimeterAlarmRef.value) {
    ElMessage.warning('周界报警列表组件未就绪');
    return;
  }
  perimeterAlarmRef.value.clearFilters();
  perimeterAlarmRef.value.handleFilterTagClick('alarmArea', alarmArea);
};

const currentTab = computed(() => tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <component
      v-if="currentArrowShow"
      :is="currentChartComponent"
      @cardSelect="onCardSelect"
      @barSelect="onBarSelect"
      @markerSelect="onMarkerSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :ref="setPerimeterAlarmRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
