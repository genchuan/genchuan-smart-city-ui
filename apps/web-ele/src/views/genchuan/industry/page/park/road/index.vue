<script setup>
import { ref } from 'vue';

import Billing from './billing/index.vue';
import End from './End/index.vue';
import ListComponent from './list/index.vue';
import Query from './query/index.vue';
import roadchart from './roadchart.vue';
import Staggered from './staggered/index.vue';
import Table from './table/index.vue';
import Vehiclentry from './vehiclentry/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '路测泊位管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '路侧计费桩关联管理',
    components: Billing,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '错时停车订单管理',
    components: Staggered,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '道路列表管理',
    components: ListComponent,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '录入车辆',
    components: Vehiclentry,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '泊位在停车辆类型查询',
    components: Query,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '结束停车',
    components: End,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('路测泊位管理');
const secondShow = ref(false);
const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};
</script>
<template>
  <div class="common-index">
    <roadchart v-if="tabArray[0].arrowShow" />
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
      @tab-change="tabChange"
    >
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
