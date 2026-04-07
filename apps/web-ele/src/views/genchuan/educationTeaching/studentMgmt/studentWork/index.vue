<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import studentInfo from './studentInfo/index.vue';
import studentInfoChart from './studentInfo/components/chart.vue';
import honorMgmt from './honorMgmt/index.vue';
import honorMgmtChart from './honorMgmt/components/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => { v.secondShow = secondShow.value; });
};

const tabArray = ref([
  {
    label: '学生信息',
    components: studentInfo,
    chartComponent: studentInfoChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '荣誉管理',
    components: honorMgmt,
    chartComponent: honorMgmtChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => { v.arrowShow = !v.arrowShow; });
};

const activeName = ref('学生信息');
const secondShow = ref(false);

const studentInfoRef = ref(null);
const setStudentInfoRef = (el) => { if (el) studentInfoRef.value = el; };

const honorMgmtRef = ref(null);
const setHonorMgmtRef = (el) => { if (el) honorMgmtRef.value = el; };

// 学生信息图表事件
const onStudentPieSelect = async ({ field, value }) => {
  await nextTick();
  if (!studentInfoRef.value) { ElMessage.warning('学生信息列表组件未就绪'); return; }
  if (field === 'grade') ElMessage.info('年级筛选暂未实现');
  else if (field === 'major') studentInfoRef.value.handleFilterTagClick('major', value);
  else if (field === 'className') studentInfoRef.value.handleFilterTagClick('className', value);
};
const onStudentBarSelect = async (date) => {
  await nextTick();
  if (!studentInfoRef.value) { ElMessage.warning('学生信息列表组件未就绪'); return; }
  studentInfoRef.value.handleFilterTagClick('createTime', date);
};
const onStudentCardSelect = async (status) => {
  await nextTick();
  if (!studentInfoRef.value) { ElMessage.warning('学生信息列表组件未就绪'); return; }
  studentInfoRef.value.clearFilters();
  switch (status) {
    case 'total': break;
    case 'inSchool': studentInfoRef.value.handleFilterTagClick('status', '在籍'); break;
    case 'abnormal': studentInfoRef.value.handleFilterTagClick('status', ['休学', '异动']); break;
    default: break;
  }
};

// 荣誉管理图表事件
const onHonorBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!honorMgmtRef.value) { ElMessage.warning('荣誉管理列表组件未就绪'); return; }
  honorMgmtRef.value.handleFilterTagClick(field, value);
};
const onHonorCardSelect = async (status) => {
  await nextTick();
  if (!honorMgmtRef.value) { ElMessage.warning('荣誉管理列表组件未就绪'); return; }
  honorMgmtRef.value.clearFilters();
  switch (status) {
    case 'total': break;
    case 'pending': honorMgmtRef.value.handleFilterTagClick('status', '待审核'); break;
    case 'pushed': honorMgmtRef.value.handleFilterTagClick('status', '已推送'); break;
    case 'monthNew': ElMessage.info('本月新增筛选暂未实现'); break;
    default: break;
  }
};

const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 学生信息图表 -->
    <component
      v-if="currentArrowShow && activeName === '学生信息'"
      :is="currentChartComponent"
      @pieSelect="onStudentPieSelect"
      @barSelect="onStudentBarSelect"
      @cardSelect="onStudentCardSelect"
    />
    <!-- 荣誉管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '荣誉管理'"
      :is="currentChartComponent"
      @barSelect="onHonorBarSelect"
      @cardSelect="onHonorCardSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label><div class="table-first"><span>{{ item.label }}</span></div></template>
        <!-- 学生信息组件 -->
        <component
          v-if="item.label === '学生信息'"
          :is="item.components"
          :ref="setStudentInfoRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 荣誉管理组件 -->
        <component
          v-else
          :is="item.components"
          :ref="setHonorMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
