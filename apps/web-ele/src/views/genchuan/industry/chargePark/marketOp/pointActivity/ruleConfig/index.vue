<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { ElMessage } from 'element-plus';

import RuleConfigStats from './components/RuleConfigStats.vue';
import Table from './table/index.vue';
import { getRuleConfigChart } from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/ruleConfig';

import '#/genchuan-components/page/index.scss';

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

// 获取规则类型字典标签
const getTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

// 获取适用场景字典标签
const getSceneLabel = (scene) => {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_SCENE, String(scene));
  return dict ? dict.label : scene;
};

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getRuleConfigChart();
    if (!response) {
      throw new Error('获取统计数据失败');
    }

    const data = response.data || response;

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '生效配置数',
        value: data.enableCount || 0,
        color: '#4A90E2',
        type: 'active',
        desc: '已生效的规则数量',
      },
      {
        title: '规则匹配率',
        value: `${(data.matchRate || 0).toFixed(2)}%`,
        color: '#50E3C2',
        type: 'matchRate',
        desc: '规则匹配成功率',
      },
    ];

    // 组装饼图数据（使用 typeCountList）
    statsData.value.pieData = (data.typeCountList || []).map((item) => ({
      name: getTypeLabel(item.type),
      value: item.count,
      type: item.type,
    }));

    // 组装柱状图数据（使用 sceneCountList）
    statsData.value.barData = (data.sceneCountList || []).map((item) => ({
      name: getSceneLabel(item.scene),
      value: item.count,
      scene: item.scene,
    }));
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);

    // 使用模拟数据作为备用
    const mockData = {
      enableCount: 5,
      matchRate: 0.785,
      typeCountList: [
        { type: '0', count: 3 },
        { type: '1', count: 2 },
        { type: '2', count: 3 },
      ],
      sceneCountList: [
        { scene: '0', count: 8 },
        { scene: '1', count: 3 },
        { scene: '2', count: 5 },
        { scene: '3', count: 8 },
      ],
    };

    statsData.value.cards = [
      {
        title: '生效配置数',
        value: mockData.enableCount,
        color: '#4A90E2',
        type: 'active',
        desc: '已生效的规则数量',
      },
      {
        title: '规则匹配率',
        value: `${(mockData.matchRate * 100).toFixed(1)}%`,
        color: '#50E3C2',
        type: 'matchRate',
        desc: '规则匹配成功率',
      },
    ];

    statsData.value.pieData = mockData.typeCountList.map((item) => ({
      name: getTypeLabel(item.type),
      value: item.count,
      type: item.type,
    }));

    statsData.value.barData = mockData.sceneCountList.map((item) => ({
      name: getSceneLabel(item.scene),
      value: item.count,
      scene: item.scene,
    }));
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (type, value) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value) ? tableRef.value[0] : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('card', type, value);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

const tableRef = ref(null);

// 处理饼图点击 - 钻取筛选
const handlePieClick = async (type, typeName) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value) ? tableRef.value[0] : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('type', type, typeName);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选
const handleBarClick = async (scene, sceneName) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value) ? tableRef.value[0] : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('scene', scene, sceneName);
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

// 使用computed确保showStats是响应式的
const showStatsValue = computed(() => showStats.value);

const tabArray = ref([
  {
    label: '规则配置',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('规则配置');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <RuleConfigStats
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
