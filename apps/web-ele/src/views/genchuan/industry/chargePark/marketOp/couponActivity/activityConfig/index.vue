<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { getActivityConfigChart } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/activityConfig';

import ActivityConfigStats from './components/ActivityConfigStats.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

// 获取配置类型字典标签
const getActivityConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

// 获取适用人群字典标签
const getActivityConfigUserGroupLabel = (userGroup) => {
  const dict = getDictObj(
    DICT_TYPE.ACTIVITY_CONFIG_USER_GROUP,
    String(userGroup),
  );
  return dict ? dict.label : userGroup;
};

// 控制统计组件显示/隐藏的状态
const showStats = ref(true);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value) {
    fetchStatsData();
  }
};

// 统计数据
const statsData = ref({
  cards: [],
  pieData: [],
  barData: [],
});

// 静态统计数据 - 接口失败时使用
const staticStatsData = {
  enableCount: 23,
  joinRate: 0,
  typeList: [
    { type: '0', count: 8 },
    { type: '1', count: 8 },
    { type: '2', count: 4 },
    { type: '3', count: 6 },
  ],
  userGroupList: [
    { userGroup: '0', count: 6 },
    { userGroup: '2', count: 15 },
    { userGroup: '1', count: 5 },
  ],
};

// 组装统计数据
const assembleStatsData = (data) => {
  // 组装卡片数据
  statsData.value.cards = [
    {
      title: '生效配置数',
      value: data.enableCount || 0,
      color: '#4A90E2',
      filterType: 'enable',
    },
    {
      title: '活动参与率',
      value: `${data.joinRate || 0}%`,
      color: '#50E3C2',
      desc: '参与占比',
      filterType: 'join',
    },
  ];

  // 组装饼图数据 - 配置类型分布
  statsData.value.pieData = (data.typeList || []).map((item) => ({
    name: getActivityConfigTypeLabel(item.type),
    value: item.count,
    type: item.type,
  }));

  // 组装柱状图数据 - 适用人群分布
  statsData.value.barData = (data.userGroupList || []).map((item) => ({
    name: getActivityConfigUserGroupLabel(item.userGroup),
    value: item.count,
    userGroup: item.userGroup,
  }));
};

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getActivityConfigChart();
    if (response && response.data) {
      const data = response.data;

      // 检查数据是否为空
      const hasData =
        data.enableCount > 0 || (data.typeList && data.typeList.length > 0);

      if (hasData) {
        assembleStatsData(data);
      } else {
        // 接口返回数据为空，使用静态数据
        console.log('统计接口返回数据为空，使用静态数据');
        assembleStatsData(staticStatsData);
      }
    } else {
      // 接口返回异常，使用静态数据
      console.log('统计接口返回异常，使用静态数据');
      assembleStatsData(staticStatsData);
    }
  } catch (error) {
    // 接口调用失败，错误信息打印到控制台，使用静态数据
    console.error('获取统计数据失败，使用静态数据', error);
    assembleStatsData(staticStatsData);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (card) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value)
    ? tableRef.value[0]
    : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('card', card.filterType);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理饼图点击 - 钻取筛选（按配置类型）
const handlePieClick = async (type) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value)
    ? tableRef.value[0]
    : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('type', type);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选（按适用人群）
const handleBarClick = async (userGroup) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value)
    ? tableRef.value[0]
    : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('userGroup', userGroup);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tableRef = ref(null);

// 使用computed确保showStats是响应式的
const showStatsValue = computed(() => showStats.value);

const tabArray = ref([
  {
    label: '活动配置',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('活动配置');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <ActivityConfigStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
      @pie-click="handlePieClick"
      @bar-click="handleBarClick"
    />
    <!-- 箭头图标已屏蔽 -->
    <!--
    <div class="icon-change">
      <el-icon
        class="tabel-tab-icon"
        v-if="secondShow"
        @click="changeArrowStatus"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        class="tabel-tab-icon"
        v-if="!secondShow"
        @click="changeArrowStatus"
      >
        <ArrowUp />
      </el-icon>
    </div>
    -->
    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
      @tab-change="tabChange"
    >
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.components"
          ref="tableRef"
          :second-show="item.secondShow"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
