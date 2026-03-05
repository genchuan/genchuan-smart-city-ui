<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { ArrowDown, ArrowUp, Search } from '@element-plus/icons-vue';
import { ElInput, ElTree } from 'element-plus';

import StatsVisualization from '#/components/stats/StatsVisualization.vue';
import { useTreeExpandController } from '#/utils/useTreeExpandController';

import { dataList, getGeocodingStatsData } from './table/data.js';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
};

const filterGeoCode = ref('');
const searchValue = ref('');
const treeRef = ref(null);
const isExpandAll = ref(true);

// 初始化树控制器
const treeCtl = useTreeExpandController(treeRef);

// 树过滤方法
const filterNode = (value, data) => {
  if (!value) return true;
  const label = data.label || '';
  return label.toLowerCase().includes(value.toLowerCase());
};

// 展开 / 收起整棵树
const toggleTreeExpand = () => {
  treeCtl.toggle();
  isExpandAll.value = !isExpandAll.value;
};

// 监听搜索
watch(searchValue, (val) => {
  if (!treeRef.value) return;

  treeRef.value.filter(val);

  if (val) {
    // 搜索时展开全部匹配节点
    nextTick(() => {
      treeCtl.expandAll();
      isExpandAll.value = true;
    });
  }
});

const treeData = computed(() => {
  const allData = dataList();
  const rootNodes = allData.filter((item) => item.parentGeoCodeId === null);

  const buildTree = (nodes) => {
    return nodes.map((node) => {
      const children = allData.filter(
        (item) => item.parentGeoCodeId === node.geoCode,
      );
      return {
        id: node.geoCode,
        label: `${node.locationName} (${node.layerTypeName})`,
        children: children.length > 0 ? buildTree(children) : [],
      };
    });
  };

  return buildTree(rootNodes);
});

const handleTreeNodeClick = (data) => {
  filterGeoCode.value = data.id;
};

const handleClearFilter = () => {
  filterGeoCode.value = '';
};

const tabArray = ref([
  {
    label: '地理编码管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    showStats,
    toggleStats,
    filterGeoCode,
  },
]);
const activeName = ref('地理编码管理');
const secondShow = ref(false);

// 获取地理编码统计数据
const statsData = computed(() => {
  return getGeocodingStatsData();
});

// 获取地理编码地图数据
const mapData = computed(() => {
  return dataList();
});

// 地图配置 - 使用geocoding目录下的图标
const mapConfig = computed(() => ({
  markerIcons: {
    normal: '/static/imgs/dataHub/map/geocoding/marker-normal.png',
    green: '/static/imgs/dataHub/map/geocoding/marker-green.png',
    orange: '/static/imgs/dataHub/map/geocoding/marker-orange.png',
    red: '/static/imgs/dataHub/map/geocoding/marker-red.png',
    blue: '/static/imgs/dataHub/map/geocoding/marker-blue.png',
    gray: '/static/imgs/dataHub/map/geocoding/marker-gray.png',
  },
  statusIconMap: {
    green: 'green',
    orange: 'orange',
    red: 'red',
    blue: 'blue',
    gray: 'gray',
  },
  statusKeyMap: {
    正常: 'green',
    异常: 'red',
    停用: 'red',
    建设中: 'gray',
    维护中: 'orange',
  },
  infoWindowConfig: {
    title: 'locationName',
    fields: [
      { key: 'geoCode', label: '地理编码' },
      { key: 'statusName', label: '状态', bold: true },
      { key: 'areaName', label: '区域' },
      { key: 'layerTypeName', label: '图层类型' },
      { key: 'adminCode', label: '行政区划' },
      { key: 'checkResultName', label: '校验结果' },
    ],
  },
}));

// 组件挂载时展开所有树节点
onMounted(() => {
  nextTick(() => {
    treeCtl.expandAll();
    isExpandAll.value = true;
  });
});
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
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 300px;
          max-height: calc(100vh - 120px);
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
          <el-icon
            class="tabel-tab-icon"
            @click="toggleTreeExpand"
            style="margin-left: 8px; cursor: pointer"
          >
            <ArrowUp v-if="isExpandAll" />
            <ArrowDown v-else />
          </el-icon>
        </div>

        <!-- 树搜索 -->
        <div
          style="padding: 10px; border-bottom: 1px solid var(--el-border-color)"
        >
          <ElInput
            v-model="searchValue"
            placeholder="搜索分类"
            :prefix-icon="Search"
            clearable
            style="width: 100%"
          />
        </div>

        <!-- 树节点 -->
        <div style="flex: 1; overflow: auto">
          <ElTree
            ref="treeRef"
            :data="treeData"
            node-key="id"
            @node-click="handleTreeNodeClick"
            :filter-node-method="filterNode"
            :filter-after-expand="false"
            style="padding: 10px"
          />
        </div>
      </div>
      <div style="flex: 1; overflow-x: auto">
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
              :filter-geo-code="filterGeoCode"
              @clear-filter="handleClearFilter"
              :key="item.label"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
