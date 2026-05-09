<script setup>
import { ref, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import communicateMgmt from './communicateMgmt/index.vue';
import communicateMgmtChart from './communicateMgmt/components/chart.vue';
import parentReplyTeacher from './parentReply/index.vue';
import parentReplyTeacherChart from './parentReply/components/chart.vue';
import parentReplyParent from './parentReply/parentIndex.vue';
import '#/components/page/index.scss';

// 控制二级菜单折叠状态
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// Tab配置数组（保留原有沟通管理和家长回复（老师端），新增家长回复（家长端））
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
  {
    label: '家长回复（老师端）',
    components: parentReplyTeacher,
    chartComponent: parentReplyTeacherChart,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '家长回复（家长端）',
    components: parentReplyParent,
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

// 家长回复（老师端）组件引用
const parentReplyTeacherRef = ref(null);
const setParentReplyTeacherRef = (el) => {
  if (el) parentReplyTeacherRef.value = el;
};

// 家长回复（家长端）组件引用
const parentReplyParentRef = ref(null);
const setParentReplyParentRef = (el) => {
  if (el) parentReplyParentRef.value = el;
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

const onCommunicateBarSelect = async ({field, value}) => {
  await nextTick();
  if (!communicateMgmtRef.value) {
    ElMessage.warning('沟通管理列表组件未就绪');
    return;
  }
  if (field === 'msgType') {
    communicateMgmtRef.value.handleFilterTagClick('title', value);
  } else if (field === 'className') {
    ElMessage.info(`点击班级：${value}，可按班级筛选`);
  }
};

const onCommunicateLineSelect = async ({field, value}) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选消息`);
};

// ========== 家长回复（老师端）图表事件 ==========
const onParentReplyTeacherCardSelect = async (status) => {
  await nextTick();
  if (!parentReplyTeacherRef.value) {
    ElMessage.warning('家长回复（老师端）列表组件未就绪');
    return;
  }
  parentReplyTeacherRef.value.clearFilters();
  if (status === 'unread') {
    parentReplyTeacherRef.value.handleFilterTagClick('readStatus', '未读');
  }
};

const onParentReplyTeacherBarSelect = async ({field, value}) => {
  await nextTick();
  if (!parentReplyTeacherRef.value) {
    ElMessage.warning('家长回复（老师端）列表组件未就绪');
    return;
  }
  if (field === 'studentName') {
    parentReplyTeacherRef.value.handleFilterTagClick('studentName', value);
  } else if (field === 'className') {
    ElMessage.info(`点击班级：${value}，可按班级筛选回复`);
  }
};

const onParentReplyTeacherLineSelect = async ({field, value}) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选回复`);
};

// ========== 家长回复（家长端）图表事件 ==========
const onParentReplyParentCardSelect = async (status) => {
  await nextTick();
  if (!parentReplyParentRef.value) {
    ElMessage.warning('家长回复（家长端）列表组件未就绪');
    return;
  }
  parentReplyParentRef.value.clearFilters();
  if (status === 'unread') {
    parentReplyParentRef.value.handleFilterTagClick('readStatus', '未读');
  }
};

const onParentReplyParentBarSelect = async ({field, value}) => {
  await nextTick();
  if (!parentReplyParentRef.value) {
    ElMessage.warning('家长回复（家长端）列表组件未就绪');
    return;
  }
  if (field === 'studentName') {
    parentReplyParentRef.value.handleFilterTagClick('studentName', value);
  } else if (field === 'className') {
    ElMessage.info(`点击班级：${value}，可按班级筛选回复`);
  }
};

const onParentReplyParentLineSelect = async ({field, value}) => {
  ElMessage.info(`点击日期：${value}，可按日期筛选回复`);
};

// 当前激活的Tab
const currentTab = computed(() => tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0]);
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
    <!-- 家长回复（老师端）图表 -->
    <component
      v-if="currentArrowShow && activeName === '家长回复（老师端）'"
      :is="currentChartComponent"
      @cardSelect="onParentReplyTeacherCardSelect"
      @barSelect="onParentReplyTeacherBarSelect"
      @lineSelect="onParentReplyTeacherLineSelect"
    />
    <!-- 家长回复（家长端）图表 -->
    <component
      v-if="currentArrowShow && activeName === '家长回复（家长端）'"
      :is="currentChartComponent"
      @cardSelect="onParentReplyParentCardSelect"
      @barSelect="onParentReplyParentBarSelect"
      @lineSelect="onParentReplyParentLineSelect"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 沟通管理组件 -->
        <component
          v-if="item.label === '沟通管理'"
          :is="item.components"
          :ref="setCommunicateMgmtRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 家长回复（老师端）组件 -->
        <component
          v-else-if="item.label === '家长回复（老师端）'"
          :is="item.components"
          :ref="setParentReplyTeacherRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
        <!-- 家长回复（家长端）组件 -->
        <component
          v-else
          :is="item.components"
          :ref="setParentReplyParentRef"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
