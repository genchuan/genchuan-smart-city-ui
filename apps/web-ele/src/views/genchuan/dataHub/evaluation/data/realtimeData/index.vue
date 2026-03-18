<script setup>
import { ref, computed } from 'vue';

import carchart from './chart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

// 外层 tabs 控制
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '实时监测数据接入',
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
const activeName = ref('实时监测数据接入'); // 外层 tabs 的激活项
const secondShow = ref(false);

// 引用表格组件实例
const tableRef = ref(null);

// 从表格组件内部获取二级 tab 激活值，默认 '全部'
const chartActiveTab = computed(() => tableRef.value?.activeName || '全部');
</script>

<template>
  <div class="common-index">
    <!-- 将 chartActiveTab 传递给图表组件 -->
    <carchart :active-tab="chartActiveTab" v-if="tabArray[0].arrowShow" />
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
          ref="tableRef"
        :second-show="item.secondShow"
        :key="item.label"
        :arrow-show="item.arrowShow"
        @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
