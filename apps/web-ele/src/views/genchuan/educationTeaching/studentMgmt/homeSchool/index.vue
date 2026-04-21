<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import communicateMgmt from './communicateMgmt/index.vue';
import communicateMgmtChart from './communicateMgmt/components/chart.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（只保留沟通管理）
const tabArray = ref([
  {
    label: '沟通管理',
    components: communicateMgmt,
    chartComponent: communicateMgmtChart,
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

const activeName = ref('沟通管理');
const secondShow = ref(false);

// 沟通管理组件引用
const communicateMgmtRef = ref(null);
const setCommunicateMgmtRef = (el) => {
  if (el) communicateMgmtRef.value = el;
};

// ========== 沟通管理图表事件 ==========
const onCommunicateCardSelect = async (status) => {
  await nextTick();
  if (!communicateMgmtRef.value) {
    ElMessage.warning('沟通管理列表组件未就绪');
    return;
  }
  communicateMgmtRef.value.clearFilters();
  if (status === 'total') {
    // 总消息数不做筛选
  } else if (status === 'reply') {
    // 家长反馈次数不做筛选
  } else if (status === 'rate') {
    // 互动率不做筛选
  }
};

const onCommunicateBarSelect = async ({ field, value }) => {
  await nextTick();
  if (!communicateMgmtRef.value) {
    ElMessage.warning('沟通管理列表组件未就绪');
    return;
  }
  if (field === 'msgType') {
    // 消息类型筛选（按标题模糊匹配，简化处理）
    communicateMgmtRef.value.handleFilterTagClick('title', value);
  } else if (field === 'className') {
    // 班级互动率筛选（按创建人？实际可扩展，暂不实现）
    ElMessage.info(`点击班级：${value}，可按班级筛选`);
  }
};

const onCommunicateLineSelect = async ({ field, value }) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选消息`);
};

// 当前激活的Tab（仅一个）
const currentTab = computed(() => tabArray.value[0]);
const currentChartComponent = computed(() => currentTab.value.chartComponent);
const currentArrowShow = computed(() => currentTab.value.arrowShow);
</script>

<template>
  <div class="common-index">
    <!-- 沟通管理图表 -->
    <component
      v-if="currentArrowShow && activeName === '沟通管理'"
      :is="currentChartComponent"
      @cardSelect="onCommunicateCardSelect"
      @barSelect="onCommunicateBarSelect"
      @lineSelect="onCommunicateLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 沟通管理组件 -->
        <component
          :is="item.components"
          :ref="setCommunicateMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
