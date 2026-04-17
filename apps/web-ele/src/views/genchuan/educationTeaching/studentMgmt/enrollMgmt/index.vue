<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import registerMgmt from './registerMgmt/index.vue';
import registerMgmtChart from './registerMgmt/components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（只保留报名管理）
const tabArray = ref([
  {
    label: '报名管理',
    components: registerMgmt,
    chartComponent: registerMgmtChart,
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

const activeName = ref('报名管理');
const secondShow = ref(false);

// 报名管理组件引用
const registerMgmtRef = ref(null);
const setRegisterMgmtRef = (el) => {
  if (el) registerMgmtRef.value = el;
};

// ========== 报名管理图表事件 ==========
const onRegisterCardSelect = async (status) => {
  await nextTick();
  if (!registerMgmtRef.value) {
    ElMessage.warning('报名管理列表组件未就绪');
    return;
  }
  registerMgmtRef.value.clearFilters();
  if (status === 'pending') {
    registerMgmtRef.value.handleFilterTagClick('status', '待审核');
  } else if (status === 'admitted') {
    registerMgmtRef.value.handleFilterTagClick('status', '已录取');
  }
};

const onRegisterBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!registerMgmtRef.value) {
    ElMessage.warning('报名管理列表组件未就绪');
    return;
  }
  registerMgmtRef.value.handleFilterTagClick('major', value);
};

const onRegisterLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选报名记录`);
};

// 当前激活的Tab（仅一个）
const currentTab = computed(() => tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 报名管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '报名管理'"
      :is="currentChartComponent"
      @cardSelect="onRegisterCardSelect"
      @barSelect="onRegisterBarSelect"
      @lineSelect="onRegisterLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 报名管理组件 -->
        <component
          :is="item.components"
          :ref="setRegisterMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
