<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { getPrizeMgmtChart } from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/prizeMgmt';

import PrizeMgmtStats from './components/PrizeMgmtStats.vue';
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
  barData: [],
});

// 静态统计数据 - 接口失败时使用
const staticStatsData = {
  typeDistribution: [
    { name: '优惠券', value: 3 },
    { name: '积分', value: 2 },
    { name: '实物', value: 2 },
    { name: '虚拟', value: 1 },
  ],
  prizeCount: 8,
  sendCount: 10270,
};

// 组装统计数据
const assembleStatsData = (data) => {
  // 组装卡片数据
  statsData.value.cards = [
    {
      title: '总奖品数',
      value: data.prizeCount || 0,
      color: '#4A90E2',
      filterType: 'all',
      desc: '全部奖品',
    },
    {
      title: '累计奖品发放量',
      value: data.sendCount || 0,
      color: '#50E3C2',
      filterType: 'distribute',
      desc: '累计发放',
    },
  ];

  // 组装柱状图数据 - 奖品类型分布
  statsData.value.barData = (data.typeDistribution || []).map((item) => ({
    name: item.name,
    value: item.value,
  }));
};

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getPrizeMgmtChart();
    if (response && response.code === 200 && response.data) {
      const data = response.data;
      
      // 检查数据是否为空
      const hasData = data.prizeCount > 0 || (data.typeDistribution && data.typeDistribution.length > 0);
      
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
  }
};

// 处理柱状图点击 - 钻取筛选
const handleBarClick = async (typeName) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('type', typeName);
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
    label: '奖品管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('奖品管理');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <PrizeMgmtStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
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
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane label="奖品管理" name="奖品管理">
        <Table
          ref="tableRef"
          :second-show="false"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
