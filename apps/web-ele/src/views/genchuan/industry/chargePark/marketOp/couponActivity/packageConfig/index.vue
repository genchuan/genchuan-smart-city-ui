<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { getPackageConfigChart } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/packageConfig';

import PackageConfigStats from './components/PackageConfigStats.vue';
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
    { name: '新手包', value: 2 },
    { name: '节日包', value: 2 },
    { name: '日常包', value: 4 },
  ],
  effectiveCount: 5,
  totalSaleCount: 985,
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
      desc: '已生效的券包配置',
    },
    {
      title: '累计券包销量',
      value: data.totalSaleCount || 0,
      color: '#50E3C2',
      filterType: 'sale',
      desc: '累计销售数量',
    },
  ];

  // 组装柱状图数据 - 券包类型分布
  statsData.value.barData = (data.typeDistribution || []).map((item) => ({
    name: item.name,
    value: item.value,
  }));
};

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getPackageConfigChart();
    if (response && response.code === 200 && response.data) {
      const data = response.data;

      // 检查数据是否为空
      const hasData = data.effectiveCount > 0 || (data.typeDistribution && data.typeDistribution.length > 0);

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
    label: '券包配置',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('券包配置');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <PackageConfigStats
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
