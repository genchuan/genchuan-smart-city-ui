<script setup>
import { ref, markRaw } from 'vue';
import WordingMgmtTable from './table/index.vue';
import '#/components/page/index.scss';
import WordingMgmtChart from './table/chart.vue';

const secondShow = ref(false);
const activeName = ref('话术管理');

const tabArray = ref([
  {
    label: '话术管理',
    components: markRaw(WordingMgmtTable),
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
  },
]);

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach(v => v.secondShow = secondShow.value);
};

const arrowChange = () => {
  tabArray.value.forEach(v => v.arrowShow = !v.arrowShow);
};

const handleChartRefresh = (filters) => {
  window.dispatchEvent(new CustomEvent('wording-mgmt-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <WordingMgmtChart v-if="tabArray[0].arrowShow" @refresh="handleChartRefresh" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus"><ArrowDown /></el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus"><ArrowUp /></el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
