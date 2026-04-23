<script setup>
import { computed, ref } from 'vue';

import AreaMgmt from './areaMgmt/index.vue';
import DecisionAnalysis from './decisionAnalysis/index.vue';
import ParkingSpace from './parkingSpace/index.vue';
import RuleControl from './ruleControl/index.vue';
import StationMgmt from './stationMgmt/index.vue';

import '#/components/page/index.scss';

const activeName = ref('片区管理');
const tabs = [
  { label: '片区管理', component: AreaMgmt },
  { label: '场站管理', component: StationMgmt },
  { label: '车位管理', component: ParkingSpace },
  { label: '规则管控', component: RuleControl },
  { label: '决策分析', component: DecisionAnalysis },
];

const currentTab = computed(
  () => tabs.find((item) => item.label === activeName.value) || tabs[0],
);
</script>

<template>
  <div class="common-index">
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
