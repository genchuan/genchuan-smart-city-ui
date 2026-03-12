<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { ArrowDown, ArrowUp, Search } from '@element-plus/icons-vue';
import { ElInput, ElLoading, ElMessage, ElTree } from 'element-plus';

import {
  getCategoryTree,
  getInstancePage,
} from '#/api/genchuan/dataHub/basicData/monitorPart';
import StatsFourVisualization from '#/components/stats/StatsFourVisualization.vue';
import { useTreeExpandController } from '#/utils/useTreeExpandController';

import Table from './table/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const filterCategoryId = ref('');
const treeData = ref([]);
const loading = ref(false);
const searchValue = ref('');
const treeRef = ref(null);
const isExpandAll = ref(true);

const secondShow = ref(false);
const activeName = ref('监测部件实例');

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 存储表格数据用于统计
const tableDataList = ref([]);

// 标志位：是否跳过统计区更新（用于三级状态切换时）
const skipStatsUpdate = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value) {
    // 显示统计时刷新数据
    refreshStatsData();
  }
};

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
  if (activeName.value !== '监测部件实例') return;

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
  if (showStats.value && activeName.value === '监测部件实例') {
    refreshStatsData();
  }
});

const tabArray = ref([
  {
    label: '监测部件实例',
    components: Table,
    showSecondary: true,
    secondShow: false,
    filterCategoryId,
    treeData,
    tabType: 'instance',
    showStats,
    toggleStats,
  },
  {
    label: '监测部件分类',
    components: Table,
    showSecondary: true,
    secondShow: false,
    filterCategoryId,
    treeData,
    tabType: 'category',
    showStats,
    toggleStats,
  },
]);

// 初始化树控制器
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

const tabChange = () => {
  // 标签切换时的处理逻辑
};

// 根据表格数据计算统计数据
const statsData = computed(() => {
  const list = tableDataList.value || [];

  if (list.length === 0) {
    return {
      cards: [
        {
          title: '总部件数',
          value: 0,
          desc: '全部部件',
          icon: '🔧',
          color: '#4A90E2',
        },
        {
          title: '各分类部件数',
          value: 0,
          desc: '分类统计',
          icon: '📂',
          color: '#50E3C2',
        },
        {
          title: '正常运行部件数',
          value: 0,
          desc: '正常运行',
          icon: '✅',
          color: '#7ED321',
        },
        {
          title: '待校准部件数',
          value: 0,
          desc: '待校准',
          icon: '⏰',
          color: '#F5A623',
        },
      ],
      pieChartOptions: [
        { label: '部件分类占比', value: 'category', data: [] },
        { label: '运行状态占比', value: 'status', data: [] },
        { label: '校准周期占比', value: 'calibrate', data: [] },
      ],
      barLineChartOptions: [
        {
          label: '不同网格部件数量对比',
          value: 'grid',
          type: 'bar',
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

  // 各分类部件数（按所属分类统计不重复分类数）
  const categorySet = new Set(
    list.map((item) => item.categoryName).filter(Boolean),
  );
  const categoryCount = categorySet.size;

  // 正常运行部件数（运行状态为正常的）- 字典值2表示正常
  const normalCount = list.filter((item) => {
    const status = String(item.runStatus);
    return status === '2' || status === '正常';
  }).length;

  // 待校准部件数（根据校准周期和下次校准时间计算）
  const now = Date.now();
  const pendingCalibrateCount = list.filter((item) => {
    if (!item.nextCalibrateTime) return false;
    const nextTime = new Date(item.nextCalibrateTime).getTime();
    return nextTime <= now;
  }).length;

  // 计算部件分类占比数据
  const categoryMap = {};
  list.forEach((item) => {
    const name = item.categoryName || '未分类';
    categoryMap[name] = (categoryMap[name] || 0) + 1;
  });
  const categoryPieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 计算运行状态占比数据 - 使用字典映射状态值到中文
  const statusMap = {};
  list.forEach((item) => {
    // 使用字典获取状态的中文标签
    const dict = getDictObj(
      DICT_TYPE.DATA_RUN_STATUS,
      String(item.runStatus),
    );
    const statusLabel = dict?.label || `状态${item.runStatus}` || '未知';
    statusMap[statusLabel] = (statusMap[statusLabel] || 0) + 1;
  });
  const statusPieData = Object.entries(statusMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 计算校准周期占比数据
  const calibrateMap = {};
  list.forEach((item) => {
    const cycle = item.calibrateCycle ? `${item.calibrateCycle}天` : '未知周期';
    calibrateMap[cycle] = (calibrateMap[cycle] || 0) + 1;
  });
  const calibratePieData = Object.entries(calibrateMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 计算不同网格部件数量对比（柱状图）
  const gridMap = {};
  list.forEach((item) => {
    const name = item.gridName || '未知网格';
    gridMap[name] = (gridMap[name] || 0) + 1;
  });
  const gridBarData = {
    xAxis: Object.keys(gridMap),
    series: Object.values(gridMap), // 直接是数据数组，不是对象数组
  };

  return {
    cards: [
      {
        title: '总部件数',
        value: totalCount,
        desc: '全部部件',
        icon: '🔧',
        color: '#4A90E2',
      },
      {
        title: '各分类部件数',
        value: categoryCount,
        desc: '分类统计',
        icon: '📂',
        color: '#50E3C2',
      },
      {
        title: '正常运行部件数',
        value: normalCount,
        desc: '正常运行',
        icon: '✅',
        color: '#7ED321',
      },
      {
        title: '待校准部件数',
        value: pendingCalibrateCount,
        desc: '待校准',
        icon: '⏰',
        color: '#F5A623',
      },
    ],
    pieChartOptions: [
      { label: '部件分类占比', value: 'category', data: categoryPieData },
      { label: '运行状态占比', value: 'status', data: statusPieData },
      { label: '校准周期占比', value: 'calibrate', data: calibratePieData },
    ],
    barLineChartOptions: [
      {
        label: '不同网格部件数量对比',
        value: 'grid',
        type: 'bar',
        data: gridBarData,
      },
    ],
  };
});

// 根据表格数据计算地图数据
const mapData = computed(() => {
  const list = tableDataList.value || [];
  return list
    .filter((item) => item.coordinate)
    .map((item) => {
      return {
        id: item.id,
        geoCode: item.uniqueCode, // 使用18位标识码作为geoCode
        coordinate: item.coordinate, // 使用coordinate字段，格式为"经度,纬度"
        locationName: item.name, // 使用name作为locationName
        name: item.name,
        status: item.runStatus,
        statusName:
          getDictObj(
            DICT_TYPE.DATA_RUN_STATUS,
            String(item.runStatus),
          )?.label || '未知',
        categoryName: item.categoryName,
        layerTypeName: item.categoryName, // 使用categoryName作为layerTypeName
        gridName: item.gridName,
        areaName: item.gridName, // 使用gridName作为areaName
        uniqueCode: item.uniqueCode,
      };
    });
});

// 地图配置 - 使用monitorPart目录下的图标
const mapConfig = computed(() => ({
  markerIcons: {
    normal: '/static/imgs/dataHub/map/monitorPart/monitor_part_green.png',
    green: '/static/imgs/dataHub/map/monitorPart/monitor_part_green.png',
    cyan: '/static/imgs/dataHub/map/monitorPart/monitor_part_cyan.png',
    orange: '/static/imgs/dataHub/map/monitorPart/monitor_part_orange.png',
    red: '/static/imgs/dataHub/map/monitorPart/monitor_part_red.png',
    blue: '/static/imgs/dataHub/map/monitorPart/monitor_part_green.png',
  },
  statusIconMap: {
    green: 'green',
    cyan: 'cyan',
    orange: 'orange',
    red: 'red',
    blue: 'blue',
  },
  statusKeyMap: {
    正常: 'green',
    异常: 'red',
    离线: 'cyan',
    维护中: 'orange',
  },
  infoWindowConfig: {
    title: 'locationName',
    fields: [
      { key: 'geoCode', label: '18位标识码' },
      { key: 'statusName', label: '运行状态', bold: true },
      { key: 'layerTypeName', label: '所属分类' },
      { key: 'areaName', label: '所在网格' },
    ],
  },
}));
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，仅在监测部件实例标签页且showStats为true时显示 -->
    <StatsFourVisualization
      v-if="showStats && activeName === '监测部件实例'"
      :cards="statsData.cards"
      :pie-chart-options="statsData.pieChartOptions"
      :bar-line-chart-options="statsData.barLineChartOptions"
      :show-map-toggle="true"
      :map-data="mapData"
      :map-config="mapConfig"
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
              :second-show="item.secondShow"
              :filter-category-id="filterCategoryId"
              :tree-data="treeData"
              :tab-type="item.tabType"
              :show-stats="showStats"
              :toggle-stats="toggleStats"
              @clear-filter="handleClearFilter"
              @refresh-tree="loadTreeData"
              @table-data-update="handleTableDataUpdate"
              @status-change="handleStatusChange"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
