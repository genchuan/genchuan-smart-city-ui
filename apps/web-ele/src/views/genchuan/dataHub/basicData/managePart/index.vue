<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';

import { ArrowDown, ArrowUp, Search } from '@element-plus/icons-vue';
import { ElInput, ElLoading, ElMessage, ElTree } from 'element-plus';

import { getCategoryTree } from '#/api/genchuan/dataHub/basicData/managePart';
import { useTreeExpandController } from '#/utils/useTreeExpandController';

import Table from './table/index.vue';

import '#/components/page/index.scss';

const filterCategoryId = ref('');
const treeData = ref([]);
const loading = ref(false);
const searchValue = ref('');
const treeRef = ref(null);
const isExpandAll = ref(true);

const secondShow = ref(false);
const activeName = ref('管理部件分类');

const tabArray = ref([
  {
    label: '管理部件实例',
    components: Table,
    showSecondary: true,
    secondShow: false,
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
              :filter-category-id="filterCategoryId"
              :tree-data="treeData"
              :tab-type="item.tabType"
              @clear-filter="handleClearFilter"
              @refresh-tree="loadTreeData"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
