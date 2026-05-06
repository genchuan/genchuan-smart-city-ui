<script setup>
import { ref, markRaw } from 'vue';
import SuggestionTable from './table/index.vue';
import '#/components/page/index.scss';
import SuggestionChart from './table/chart.vue';

const secondShow = ref(false);
const activeName = ref('意见建议');

const tabArray = ref([
  {
    label: '意见建议',
    components: markRaw(SuggestionTable),
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
  window.dispatchEvent(new CustomEvent('suggestion-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <SuggestionChart v-if="tabArray[0].arrowShow" @refresh="handleChartRefresh" />
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
<style scoped lang="scss">
.common-index {
  // 图表容器下边距（参照 DetailDrawer 卡片间距）
  :deep(.stats-four-visualization) {
    margin-bottom: 8px;
  }

  // 图标按钮组上下边距，与图表和 tabs 自然分隔
  .icon-change {
    margin: 8px 0 16px 0;
  }

  // 确保 tabs 顶部无多余间距
  .el-tabs {
    margin-top: 0;
  }
}
</style>
