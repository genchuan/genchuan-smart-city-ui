<script setup>
import { computed, ref } from 'vue';

import BlackWhiteList from './blackWhiteList/index.vue';
import ChargeParkLink from './chargeParkLink/index.vue';
import DepositPlan from './depositPlan/index.vue';
import FeeRule from './feeRule/index.vue';
import OfftimeRule from './offtimeRule/index.vue';
import TimePermission from './timePermission/index.vue';

const activeName = ref('时段权限');
const tabs = [
  { label: '时段权限', component: TimePermission },
  { label: '收费规则', component: FeeRule },
  { label: '充停联动', component: ChargeParkLink },
  { label: '黑白名单', component: BlackWhiteList },
  { label: '错时规则', component: OfftimeRule },
  { label: '押金方案', component: DepositPlan },
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
