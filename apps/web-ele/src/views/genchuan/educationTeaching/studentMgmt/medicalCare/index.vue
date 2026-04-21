<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import treatMgmt from './treatMgmt/index.vue';
import treatMgmtChart from './treatMgmt/components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（只保留就诊管理）
const tabArray = ref([
  {
    label: '就诊管理',
    components: treatMgmt,
    chartComponent: treatMgmtChart,
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

const activeName = ref('就诊管理');
const secondShow = ref(false);

// 就诊管理组件引用
const treatMgmtRef = ref(null);
const setTreatMgmtRef = (el) => {
  if (el) treatMgmtRef.value = el;
};

// ========== 就诊管理图表事件 ==========
const onTreatCardSelect = async (status) => {
  await nextTick();
  if (!treatMgmtRef.value) {
    ElMessage.warning('就诊管理列表组件未就绪');
    return;
  }
  treatMgmtRef.value.clearFilters();
  if (status === 'pending') {
    treatMgmtRef.value.handleFilterTagClick('status', '待审核');
  } else if (status === 'finished') {
    treatMgmtRef.value.handleFilterTagClick('status', '已就诊');
  } else if (status === 'outpatient') {
    treatMgmtRef.value.handleFilterTagClick('treatType', '门诊');
  } else if (status === 'emergency') {
    treatMgmtRef.value.handleFilterTagClick('treatType', '急诊');
  } else if (status === 'other') {
    treatMgmtRef.value.handleFilterTagClick('treatType', '其他');
  }
};

const onTreatPieSelect = async ({ field, value }) => {
  await nextTick();
  if (!treatMgmtRef.value) {
    ElMessage.warning('就诊管理列表组件未就绪');
    return;
  }
  if (field === 'treatType') {
    treatMgmtRef.value.handleFilterTagClick('treatType', value);
  } else if (field === 'grade') {
    treatMgmtRef.value.handleFilterTagClick('grade', value);
  }
};

const onTreatLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选就诊记录`);
};

// 当前激活的Tab（仅一个）
const currentTab = computed(() => tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 就诊管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '就诊管理'"
      :is="currentChartComponent"
      @cardSelect="onTreatCardSelect"
      @pieSelect="onTreatPieSelect"
      @lineSelect="onTreatLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 就诊管理组件 -->
        <component
          :is="item.components"
          :ref="setTreatMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
