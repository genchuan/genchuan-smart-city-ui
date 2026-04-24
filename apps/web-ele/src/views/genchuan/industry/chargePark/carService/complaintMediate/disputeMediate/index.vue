<script setup>
import { ref, markRaw } from 'vue';
import DisputeMediateTable from './table/index.vue';
import '#/components/page/index.scss';
import DisputeMediateChart from './table/chart.vue';

const secondShow = ref(false);
const activeName = ref('纠纷调解');

const tabArray = ref([
  {
    label: '纠纷调解',
    components: markRaw(DisputeMediateTable),
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
  window.dispatchEvent(new CustomEvent('dispute-mediate-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <DisputeMediateChart v-if="tabArray[0].arrowShow" @refresh="handleChartRefresh" />
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
