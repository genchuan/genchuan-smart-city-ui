<script setup>
import { ref } from 'vue';

import endParkChart from './endParkChart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const tabArray = ref([
  {
    label: '结束停车',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
]);

const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};
const activeName = ref('结束停车');
</script>

<template>
  <div class="common-index">
    <endParkChart v-if="tabArray[0].arrowShow" />
    <el-tabs v-model="activeName" class="common-tabs mark-tabs" type="card">
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
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.common-index {
  .common-tabs {
    :deep(.el-tabs__nav) {
      margin-left: 0 !important;
    }

    :deep(.el-tabs__item) {
      padding-right: 5px !important;
    }
  }
}
</style>
