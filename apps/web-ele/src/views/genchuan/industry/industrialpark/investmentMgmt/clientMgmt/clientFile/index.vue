<script setup>
import { ref } from 'vue';

import ClientDetailDrawer from './components/ClientDetailDrawer.vue';
import ClientFileStats from './components/ClientFileStats.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '客户档案',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);

const activeName = ref('客户档案');
const secondShow = ref(false);

/** 处理卡片点击钻取 */
const handleCardClick = (cardType) => {
  console.log('卡片钻取:', cardType);
};

/** 处理饼图扇区点击筛选 */
const handlePieClick = (type, name) => {
  console.log('饼图筛选:', type, name);
};

/** 处理柱状图柱形点击筛选 */
const handleBarClick = (scene, name) => {
  console.log('柱状图筛选:', scene, name);
};
</script>

<template>
  <div class="common-index">
    <!-- 统计组件 - 放在 el-tabs 外面（参照 siteMgmt 布局） -->
    <ClientFileStats
      @card-click="handleCardClick"
      @pie-click="handlePieClick"
      @bar-click="handleBarClick"
    />

    <!-- 客户完整详情抽屉 -->
    <ClientDetailDrawer ref="clientDetailDrawerRef" />

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
          :key="item.label"
          ref="tableRef"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
