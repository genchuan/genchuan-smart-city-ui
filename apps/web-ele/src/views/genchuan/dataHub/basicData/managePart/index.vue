<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { ArrowDown, ArrowUp, Search } from '@element-plus/icons-vue';
import { ElInput, ElLoading, ElMessage, ElTree } from 'element-plus';

import StatsVisualization from '#/components/stats/StatsVisualization.vue';
import { getCategoryTree } from '#/api/genchuan/dataHub/basicData/managePart';
import { useTreeExpandController } from '#/utils/useTreeExpandController';

import Table from './table/index.vue';

import '#/components/page/index.scss';

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
};

const filterCategoryId = ref('');
const treeData = ref([]);
const loading = ref(false);
const searchValue = ref('');
const treeRef = ref(null);
const isExpandAll = ref(true);

const secondShow = ref(false);
const activeName = ref('管理部件实例');

const tabArray = ref([
  {
    label: '管理部件实例',
    components: Table,
    showSecondary: true,
    secondShow: false,
    showStats,
    toggleStats,
    filterCategoryId,
    treeData,
    tabType: 'instance',
  },
  {
    label: '管理部件分类',
    components: Table,
    showSecondary: true,
    secondShow: false,
    filterCategoryId,
    treeData,
    tabType: 'category',
  },
]);

// 存储表格数据用于统计
const tableDataList = ref([]);

// 处理表格数据更新
const handleTableDataUpdate = (data) => {
  tableDataList.value = data;
};

// 根据表格数据计算统计数据
const statsData = computed(() => {
  const list = tableDataList.value || [];

  if (list.length === 0) {
    return {
      cards: [
        { title: '总部件数', value: 0, unit: '个', icon: 'Box', color: '#4A90E2' },
        { title: '正常运行部件数', value: 0, unit: '个', icon: 'CircleCheck', color: '#50E3C2' },
        { title: '关联监测部件数', value: 0, unit: '个', icon: 'Connection', color: '#FF9F40' },
      ],
      charts: [],
    };
  }

  // 计算卡片数据
  const totalCount = list.length;
  const normalCount = list.filter(item => item.runStatus === '2').length;
  const monitorCount = list.reduce((sum, item) => sum + Number(item.monitorCount || 0), 0);

  // 计算部件分类占比
  const categoryMap = {};
  list.forEach(item => {
    const name = item.categoryName || '未分类';
    categoryMap[name] = (categoryMap[name] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // 计算主管部门占比
  const deptMap = {};
  list.forEach(item => {
    const name = item.deptName || '未知部门';
    deptMap[name] = (deptMap[name] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

  // 计算不同网格部件数量
  const gridMap = {};
  list.forEach(item => {
    const name = item.gridName || '未知网格';
    gridMap[name] = (gridMap[name] || 0) + 1;
  });
  const gridNames = Object.keys(gridMap);
  const gridValues = Object.values(gridMap);

  return {
    cards: [
      { title: '总部件数', value: totalCount, unit: '个', icon: 'Box', color: '#4A90E2' },
      { title: '正常运行部件数', value: normalCount, unit: '个', icon: 'CircleCheck', color: '#50E3C2' },
      { title: '关联监测部件数', value: monitorCount, unit: '个', icon: 'Connection', color: '#FF9F40' },
    ],
    charts: [
      { title: '部件分类占比', type: 'pie', data: categoryData },
      { title: '主管部门占比', type: 'pie', data: deptData },
      { title: '不同网格部件数量对比', type: 'bar', xAxis: gridNames, series: gridValues },
    ],
  };
});

// 根据表格数据计算地图数据
const mapData = computed(() => {
  const list = tableDataList.value || [];
  return list
    .filter(item => item.longitude && item.latitude)
    .map(item => {
      // 根据runStatus确定状态名称和颜色
      let statusName = '未知';
      switch (item.runStatus) {
        case '1':
          statusName = '异常';
          break;
        case '2':
          statusName = '正常';
          break;
        case '3':
          statusName = '离线';
          break;
        case '4':
          statusName = '维护中';
          break;
      }

      return {
        id: String(item.id),
        geoCode: item.uniqueCode,
        locationName: item.partName,
        coordinateInfo: `${item.longitude},${item.latitude}`,
        statusName: statusName,
        areaName: item.gridName || '',
        layerTypeName: item.categoryName || '',
        adminCode: item.areaName || '',
        checkResultName: item.coordVerifyFlag ? '通过' : '未通过',
        runStatus: item.runStatus,
      };
    });
});

// 地图配置 - 使用managePart目录下的图标
const mapConfig = computed(() => ({
  markerIcons: {
    normal: '/static/imgs/dataHub/map/managePart/manage_part_green.png',
    green: '/static/imgs/dataHub/map/managePart/manage_part_green.png',
    orange: '/static/imgs/dataHub/map/managePart/manage_part_orange.png',
    red: '/static/imgs/dataHub/map/managePart/manage_part_red.png',
    blue: '/static/imgs/dataHub/map/managePart/manage_part_blue.png',
    gray: '/static/imgs/dataHub/map/managePart/manage_part_gray.png',
  },
  statusIconMap: {
    green: 'green',
    orange: 'orange',
    red: 'red',
    blue: 'blue',
    gray: 'gray',
  },
  statusKeyMap: {
    '正常': 'green',
    '异常': 'red',
    '离线': 'gray',
    '维护中': 'orange',
  },
  infoWindowConfig: {
    title: 'locationName',
    fields: [
      { key: 'geoCode', label: '16位标识码' },
      { key: 'statusName', label: '运行状态', bold: true },
      { key: 'layerTypeName', label: '所属分类' },
      { key: 'areaName', label: '所在网格' },
      { key: 'adminCode', label: '行政区划' },
      { key: 'checkResultName', label: '坐标校验' },
    ],
  },
}));

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
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <StatsVisualization
      v-if="showStats"
      :data="statsData"
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
          width: 220px;
          min-width: 220px;
          flex-shrink: 0;
          border: 1px solid var(--el-border-color);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          height: 523px;
        "
      >
        <!-- 树头 -->
        <div
          style="
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 500;
            border-bottom: 1px solid var(--el-border-color);
            background-color: var(--el-bg-color-secondary);
            display: flex;
            align-items: center;
            justify-content: space-between;
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
      <div style="flex: 1; min-width: 0; overflow: hidden;">
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
              :show-stats="item.showStats"
              :toggle-stats="item.toggleStats"
              :filter-category-id="filterCategoryId"
              :tree-data="treeData"
              :tab-type="item.tabType"
              @clear-filter="handleClearFilter"
              @refresh-tree="loadTreeData"
              @update:table-data="handleTableDataUpdate"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
