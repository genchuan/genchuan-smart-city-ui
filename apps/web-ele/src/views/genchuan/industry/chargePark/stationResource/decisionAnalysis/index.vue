<script setup>
import { computed, ref } from 'vue';

import StationOpReport from './stationOpReport/index.vue';

const activeName = ref('场站运营报表');
const tabs = [{ label: '场站运营报表', component: StationOpReport }];

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
