<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import studentArchive from './table/index.vue';
import studentArchiveChart from './components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（只保留学籍档案管理）
const tabArray = ref([
  {
    label: '学籍档案管理',
    components: studentArchive,
    chartComponent: studentArchiveChart,
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

const activeName = ref('学籍档案管理');
const secondShow = ref(false);

// 学籍档案管理组件引用
const studentArchiveRef = ref(null);
const setStudentArchiveRef = (el) => {
  if (el) studentArchiveRef.value = el;
};

// 图表事件（父级无需额外处理，组件内部派发自定义事件，由子组件监听）
// 但为了保持结构，保留空函数
const onChartCardSelect = async (status) => {
  // 已通过自定义事件处理，无需额外代码
};

const onChartPieSelect = async (params) => {
  // 已通过自定义事件处理
};

const onChartLineSelect = async (params) => {
  // 已通过自定义事件处理
};

const currentTab = computed(() => tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 学籍档案管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '学籍档案管理'"
      :is="currentChartComponent"
      @cardSelect="onChartCardSelect"
      @pieSelect="onChartPieSelect"
      @lineSelect="onChartLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 学籍档案管理组件 -->
        <component
          :is="item.components"
          :ref="setStudentArchiveRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
