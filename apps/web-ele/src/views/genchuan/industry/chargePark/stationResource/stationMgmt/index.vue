<script setup>
import { computed, ref } from 'vue';

import DebtExpand from './debtExpand/index.vue';
import StationConfig from './stationConfig/index.vue';
import StationInfo from './stationInfo/index.vue';

const activeName = ref('场站信息');
const tabs = [
  { label: '场站信息', component: StationInfo },
  { label: '场站配置', component: StationConfig },
  { label: '联合追缴拓场', component: DebtExpand },
];

const currentTab = computed(
  () => tabs.find((item) => item.label === activeName.value) || tabs[0],
);
</script>

<template>
  <div class="station-resource-entry">
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabs" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component :is="currentTab.component" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.station-resource-entry {
  .table-first {
    display: flex;
    align-items: center;
  }
}
</style>
