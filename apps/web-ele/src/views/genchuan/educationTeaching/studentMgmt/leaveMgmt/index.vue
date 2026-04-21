<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import leaveHandle from './leaveHandle/index.vue';
import leaveHandleChart from './leaveHandle/components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（只保留离校办理）
const tabArray = ref([
  {
    label: '离校办理',
    components: leaveHandle,
    chartComponent: leaveHandleChart,
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

const activeName = ref('离校办理');
const secondShow = ref(false);

// 离校办理组件引用
const leaveHandleRef = ref(null);
const setLeaveHandleRef = (el) => {
  if (el) leaveHandleRef.value = el;
};

// ========== 离校办理图表事件 ==========
const onLeaveCardSelect = async (status) => {
  await nextTick();
  if (!leaveHandleRef.value) {
    ElMessage.warning('离校办理列表组件未就绪');
    return;
  }
  leaveHandleRef.value.clearFilters();
  if (status === 'waitHandle') {
    leaveHandleRef.value.handleFilterTagClick('status', '待办理');
  }
  // total 和 rate 不做筛选
};

const onLeaveLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选离校记录`);
};

// 当前激活的Tab（仅一个）
const currentTab = computed(() => tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 离校办理图表 -->
    <component
      v-if="currentArrowShow && activeName === '离校办理'"
      :is="currentChartComponent"
      @cardSelect="onLeaveCardSelect"
      @lineSelect="onLeaveLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 离校办理组件 -->
        <component
          :is="item.components"
          :ref="setLeaveHandleRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
