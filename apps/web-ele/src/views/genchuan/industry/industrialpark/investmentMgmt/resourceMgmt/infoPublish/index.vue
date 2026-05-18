<script setup>
import { computed, ref } from 'vue';

import InfoPublishStats from './components/InfoPublishStats.vue';
import InfoDetailDrawer from './components/InfoDetailDrawer.vue';
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
    label: '信息发布',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);

const activeName = ref('信息发布');
const secondShow = ref(false);

const showStats = ref(true);

const toggleStats = () => {
  showStats.value = !showStats.value;
};

const showStatsValue = computed(() => showStats.value);

/** 信息完整详情抽屉引用 */
const infoDetailDrawerRef = ref(null);

const handleCardClick = (cardType) => {
  console.log('卡片钻取:', cardType);
};

/** 处理地图标记点击 - 打开信息详情 */
const handleSiteDetail = (markerData) => {
  if (infoDetailDrawerRef.value && markerData) {
    infoDetailDrawerRef.value.open(markerData);
  }
};
</script>

<template>
  <div class="common-index">
    <InfoPublishStats
      v-if="showStats"
      @card-click="handleCardClick"
      @site-detail="handleSiteDetail"
    />

    <!-- 信息完整详情抽屉 -->
    <InfoDetailDrawer ref="infoDetailDrawerRef" />

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
