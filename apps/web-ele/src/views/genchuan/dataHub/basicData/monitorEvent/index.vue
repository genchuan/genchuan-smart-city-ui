<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { ArrowDown, ArrowUp, Search } from '@element-plus/icons-vue';
import { ElInput, ElLoading, ElMessage, ElTree } from 'element-plus';

import {
  getCategoryTree,
  getInstancePage,
} from '#/api/genchuan/dataHub/basicData/monitorEvent';
import StatsFourVisualization from '#/components/stats/StatsFourVisualization.vue';
import { useTreeExpandController } from '#/utils/useTreeExpandController';

import Table from './table/index.vue';

import '#/components/page/index.scss';

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value) {
    // 显示统计时刷新数据
    refreshStatsData();
  }
};

// 标志位：是否跳过统计区更新（用于三级状态切换时）
const skipStatsUpdate = ref(false);

const filterCategoryId = ref('');
const treeData = ref([]);
const loading = ref(false);
const searchValue = ref('');
const treeRef = ref(null);
const isExpandAll = ref(true);

const secondShow = ref(false);
const activeName = ref('监测事件实例');

// 存储表格数据用于统计
const tableDataList = ref([]);

const tabArray = ref([
  {
    label: '监测事件实例',
    components: Table,
    showSecondary: true,
    secondShow: false,
    filterCategoryId,
    treeData,
    tabType: 'instance',
  },
  {
    label: '监测事件分类',
    components: Table,
    showSecondary: true,
    secondShow: false,
    filterCategoryId,
    treeData,
    tabType: 'category',
  },
]);

// 处理表格数据更新
const handleTableDataUpdate = (data) => {
  // 根据标志位决定是否更新统计数据
  if (!skipStatsUpdate.value) {
    tableDataList.value = data;
  }
};

// 处理三级状态切换（不刷新统计区）
const handleStatusChange = (status) => {
  skipStatsUpdate.value = true;
  // 使用setTimeout确保在query完成后重置标志
  setTimeout(() => {
    skipStatsUpdate.value = false;
  }, 100);
};

// 刷新统计数据
const refreshStatsData = async () => {
  if (activeName.value !== '监测事件实例') return;

  try {
    const response = await getInstancePage({
      pageNo: 1,
      pageSize: 100,
      treeParentId: filterCategoryId.value,
      includeSelf: filterCategoryId.value ? true : undefined,
    });
    if (response && response.list) {
      tableDataList.value = response.list;
    }
  } catch (error) {
    console.error('刷新统计数据失败:', error);
  }
};

// 监听标签页切换和分类筛选变化
watch([() => activeName.value, () => filterCategoryId.value], () => {
  if (showStats.value && activeName.value === '监测事件实例') {
    refreshStatsData();
  }
});

// 根据表格数据计算统计数据
const statsData = computed(() => {
  const list = tableDataList.value || [];

  if (list.length === 0) {
    return {
      cards: [
        {
          title: '总事件数',
          value: 0,
          desc: '全部事件',
          icon: '📋',
          color: '#4A90E2',
        },
        {
          title: '各等级事件数',
          value: 0,
          desc: '等级统计',
          icon: '📊',
          color: '#50E3C2',
        },
        {
          title: '待处置事件数',
          value: 0,
          desc: '待处理',
          icon: '⏳',
          color: '#FF9F40',
        },
        {
          title: '已办结事件数',
          value: 0,
          desc: '已完成',
          icon: '✅',
          color: '#A17FE0',
        },
      ],
      pieChartOptions: [
        { label: '事件分类占比', value: 'category', data: [] },
        { label: '状态占比', value: 'status', data: [] },
        { label: '等级占比', value: 'level', data: [] },
      ],
      barLineChartOptions: [
        {
          label: '不同区域事件数量对比',
          value: 'area',
          type: 'bar',
          data: {
            xAxis: [],
            series: [],
          },
        },
        {
          label: '近7日事件处置趋势',
          value: 'trend',
          type: 'line',
          data: {
            xAxis: [],
            series: [],
          },
        },
      ],
    };
  }

  // 计算卡片数据
  const totalCount = list.length;

  // 各等级事件数（按事件等级统计不重复等级数）
  const levelSet = new Set(list.map((item) => item.eventLevel).filter(Boolean));
  const levelCount = levelSet.size;

  // 待处置事件数（状态为待处置的）
  const pendingCount = list.filter((item) => {
    const status = String(item.status);
    return status === '1' || status === '待处置' || status === '待处理';
  }).length;

  // 已办结事件数（状态为已办结的）
  const completedCount = list.filter((item) => {
    const status = String(item.status);
    return status === '2' || status === '已办结' || status === '已完成';
  }).length;

  // 计算事件分类占比数据
  const categoryMap = {};
  list.forEach((item) => {
    const name = item.categoryName || '未分类';
    categoryMap[name] = (categoryMap[name] || 0) + 1;
  });
  const categoryPieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 计算状态占比数据 - 使用字典映射状态值到中文
  const statusMap = {};
  list.forEach((item) => {
    // 使用字典获取状态的中文标签
    const dict = getDictObj(DICT_TYPE.DATA_MATTER_STATUS, String(item.status));
    const statusLabel =
      dict?.label || item.statusName || `状态${item.status}` || '未知';
    statusMap[statusLabel] = (statusMap[statusLabel] || 0) + 1;
  });
  const statusPieData = Object.entries(statusMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 计算事件等级占比数据 - 使用字典映射等级值到中文
  const levelMap = {};
  list.forEach((item) => {
    // 使用字典获取等级的中文标签
    const dict = getDictObj(
      DICT_TYPE.DATA_EVENT_LEVEL,
      String(item.eventLevel),
    );
    const levelLabel =
      dict?.label || item.eventLevelName || `等级${item.eventLevel}` || '未知';
    levelMap[levelLabel] = (levelMap[levelLabel] || 0) + 1;
  });
  const levelPieData = Object.entries(levelMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 计算不同区域事件数量对比（柱状图）
  const areaMap = {};
  list.forEach((item) => {
    const name = item.areaName || '未知区域';
    areaMap[name] = (areaMap[name] || 0) + 1;
  });
  const areaNames = Object.keys(areaMap);
  const areaValues = Object.values(areaMap);

  // 计算近7日事件处置趋势（折线图）
  const last7Days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().slice(0, 10));
  }

  const dailyDealMap = {};
  last7Days.forEach((day) => {
    dailyDealMap[day] = 0;
  });

  list.forEach((item) => {
    if (item.dealTime) {
      const dealDate = new Date(item.dealTime).toISOString().slice(0, 10);
      if (dailyDealMap.hasOwnProperty(dealDate)) {
        dailyDealMap[dealDate]++;
      }
    }
  });

  return {
    cards: [
      {
        title: '总事件数',
        value: totalCount,
        desc: '全部事件',
        icon: '📋',
        color: '#4A90E2',
      },
      {
        title: '各等级事件数',
        value: levelCount,
        desc: '等级统计',
        icon: '📊',
        color: '#50E3C2',
      },
      {
        title: '待处置事件数',
        value: pendingCount,
        desc: '待处理',
        icon: '⏳',
        color: '#FF9F40',
      },
      {
        title: '已办结事件数',
        value: completedCount,
        desc: '已完成',
        icon: '✅',
        color: '#A17FE0',
      },
    ],
    pieChartOptions: [
      { label: '事件分类占比', value: 'category', data: categoryPieData },
      { label: '状态占比', value: 'status', data: statusPieData },
      { label: '等级占比', value: 'level', data: levelPieData },
    ],
    barLineChartOptions: [
      {
        label: '不同区域事件数量对比',
        value: 'area',
        type: 'bar',
        data: {
          xAxis: areaNames,
          series: areaValues,
        },
      },
      {
        label: '近7日事件处置趋势',
        value: 'trend',
        type: 'line',
        data: {
          xAxis: last7Days.map((d) => d.slice(5)), // 显示 MM-DD 格式
          series: last7Days.map((d) => dailyDealMap[d]),
        },
      },
    ],
  };
});

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// 初始化树控制器（核心）
const treeCtl = useTreeExpandController(treeRef);

// 加载树数据
const loadTreeData = async () => {
  loading.value = true;
  try {
    const res = await getCategoryTree();
    if (res) {
      treeData.value = res;

      // 等 DOM & Tree 初始化完成后再展开
      await nextTick();
      treeCtl.expandAll();
      isExpandAll.value = true;
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('加载树形结构失败');
  } finally {
    loading.value = false;
  }
};

onMounted(loadTreeData);

// 展开 / 收起整棵树
const toggleTreeExpand = () => {
  treeCtl.toggle();
  isExpandAll.value = !isExpandAll.value;
};

// 点击节点
const handleTreeNodeClick = (data) => {
  filterCategoryId.value = data.id;
};

// 搜索过滤
const filterNode = (value, data) => {
  if (!value) return true;
  const label = data.categoryName || data.label || data.name || '';
  return label.includes(value);
};

// 搜索时自动展开全部
watch(searchValue, (val) => {
  if (!treeRef.value) return;

  treeRef.value.filter(val);

  if (val) {
    nextTick(() => {
      treeCtl.expandAll();
      isExpandAll.value = true;
    });
  }
});

const handleClearFilter = () => {
  filterCategoryId.value = '';
};
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，仅在监测事件实例标签页且showStats为true时显示 -->
    <StatsFourVisualization
      v-if="showStats && activeName === '监测事件实例'"
      :cards="statsData.cards"
      :pie-chart-options="statsData.pieChartOptions"
      :bar-line-chart-options="statsData.barLineChartOptions"
      style="margin-bottom: 8px"
    />
    <div
      style="
        display: flex;
        gap: 8px;
        align-items: flex-start;
        height: calc(100vh - 100px);
      "
    >
      <!-- 左侧树 -->
      <div
        style="
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
          width: 220px;
          min-width: 220px;
          height: 523px;
          border: 1px solid var(--el-border-color);
          border-radius: 4px;
        "
      >
        <!-- 树头 -->
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 500;
            background-color: var(--el-bg-color-secondary);
            border-bottom: 1px solid var(--el-border-color);
          "
        >
          <span>分类</span>
          <el-icon @click="toggleTreeExpand" style="cursor: pointer">
            <ArrowUp v-if="isExpandAll" />
            <ArrowDown v-else />
          </el-icon>
        </div>

        <!-- 搜索 -->
        <div
          style="padding: 10px; border-bottom: 1px solid var(--el-border-color)"
        >
          <ElInput
            v-model="searchValue"
            placeholder="搜索分类"
            :prefix-icon="Search"
            clearable
          />
        </div>

        <!-- 树 -->
        <div style="flex: 1; overflow: auto">
          <ElLoading v-if="loading" text="加载中..." />
          <ElTree
            v-else
            ref="treeRef"
            :data="treeData"
            node-key="id"
            :filter-node-method="filterNode"
            :filter-after-expand="false"
            :default-expand-all="true"
            @node-click="handleTreeNodeClick"
            style="padding: 10px"
          />
        </div>
      </div>

      <!-- 右侧内容 -->
      <div style="flex: 1; min-width: 0; overflow: hidden">
        <div class="icon-change">
          <el-icon
            class="tabel-tab-icon"
            v-if="secondShow"
            @click="changeArrowStatus"
          >
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-else @click="changeArrowStatus">
            <ArrowUp />
          </el-icon>
        </div>

        <el-tabs v-model="activeName" class="common-tabs" type="card">
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
              :second-show="item.secondShow"
              :show-stats="showStats"
              :toggle-stats="toggleStats"
              :filter-category-id="filterCategoryId"
              :tree-data="treeData"
              :tab-type="item.tabType"
              @clear-filter="handleClearFilter"
              @refresh-tree="loadTreeData"
              @update:table-data="handleTableDataUpdate"
              @status-change="handleStatusChange"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
