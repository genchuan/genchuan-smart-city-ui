<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

import DistChart from '#/views/report/park/traffic/flowdist/distchart.vue';
import DistReport from '#/views/report/park/traffic/flowdist/index.vue';
import EntryChart from './entry/entrychart.vue';
import EntryReport from './entry/index.vue';
import ExitChart from './exit/exitchart.vue';
import ExitReport from './exit/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '入场车流报表',
    components: EntryReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '出场车流报表',
    components: ExitReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
  {
    label: '车流分布报表',
    components: DistReport,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);

const activeName = ref('入场车流报表');
const secondShow = ref(false);

// 全局图表显示状态
const showStats = ref(false);
const toggleStats = () => {
  showStats.value = !showStats.value;
};
</script>

<template>
  <div class="common-index">
    <EntryChart v-if="showStats && activeName === '入场车流报表'" />
    <ExitChart v-if="showStats && activeName === '出场车流报表'" />
    <DistChart v-if="showStats && activeName === '车流分布报表'" />

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
    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
    >
      <el-tab-pane
        v-for="(item) in tabArray"
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
          :arrow-show="showStats"
          @arrow-change="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
