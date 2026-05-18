<script setup>
import { computed, ref } from 'vue';

import SiteMgmtStats from './components/SiteMgmtStats.vue';
import SiteDetailDrawer from './components/SiteDetailDrawer.vue';
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
    label: '场地管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);

const activeName = ref('场地管理');
const secondShow = ref(false);

const showStats = ref(true);

const toggleStats = () => {
  showStats.value = !showStats.value;
};

const showStatsValue = computed(() => showStats.value);

/** 场地完整详情抽屉引用 */
const siteDetailDrawerRef = ref(null);

const handleCardClick = (cardType) => {
  console.log('卡片钻取:', cardType);
};

/** 处理地图标记点击 - 打开场地详情 */
const handleSiteDetail = (markerData) => {
  if (siteDetailDrawerRef.value && markerData) {
    siteDetailDrawerRef.value.open(markerData);
  }
};
</script>

<template>
  <div class="common-index">
    <SiteMgmtStats
      v-if="showStats"
      @card-click="handleCardClick"
      @site-detail="handleSiteDetail"
    />

    <!-- 场地完整详情抽屉 -->
    <SiteDetailDrawer ref="siteDetailDrawerRef" />

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
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
