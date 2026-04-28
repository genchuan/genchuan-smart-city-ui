<script setup>
import { computed, ref } from 'vue';

import SpaceInfo from './spaceInfo/index.vue';
import SpaceStatus from './spaceStatus/index.vue';

const activeName = ref('车位信息');
const tabs = [
  { label: '车位信息', component: SpaceInfo },
  { label: '车位状态', component: SpaceStatus },
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
