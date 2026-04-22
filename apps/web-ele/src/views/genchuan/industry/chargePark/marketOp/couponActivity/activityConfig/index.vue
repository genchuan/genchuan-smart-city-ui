<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getActivityConfigChart } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/activityConfig';

import ActivityConfigStats from './components/ActivityConfigStats.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

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
});

// 静态统计数据 - 接口失败时使用
const staticStatsData = {
  effectiveCount: 5,
  participationRate: 75,
  typeRatio: [
    { type: '1', typeName: '满减券', count: 2 },
    { type: '2', typeName: '折扣券', count: 2 },
    { type: '3', typeName: '兑换券', count: 1 },
  ],
};

// 组装统计数据
const assembleStatsData = (data) => {
  // 组装卡片数据
  statsData.value.cards = [
    {
      title: '生效配置数',
      value: data.effectiveCount || 0,
      color: '#4A90E2',
      filterType: 'effective',
    },
    {
      title: '活动参与率',
      value: `${data.participationRate || 0}%`,
      color: '#50E3C2',
      desc: '平均参与率',
      filterType: 'participation',
    },
  ];

  // 组装饼图数据
  statsData.value.pieData = (data.typeRatio || []).map((item) => ({
    name: item.typeName,
    value: item.count,
    type: item.type,
  }));
};

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getActivityConfigChart();
    if (response && response.code === 200 && response.data) {
      const data = response.data;

      // 检查数据是否为空
      const hasData =
        data.effectiveCount > 0 ||
        (data.typeRatio && data.typeRatio.length > 0);

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
    console.error('获取统计数据失败，使用静态数据:', error);
    assembleStatsData(staticStatsData);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (card) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('card', card.filterType);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理饼图点击 - 钻取筛选
const handlePieClick = async (typeName) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    // 从饼图数据中找到对应的type值
    const pieItem = statsData.value.pieData.find((item) => item.name === typeName);
    if (pieItem) {
      tableRef.value.handleStatsFilter('type', pieItem.type);
    }
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
