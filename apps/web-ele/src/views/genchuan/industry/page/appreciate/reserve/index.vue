<script setup>
import { ref } from 'vue';

import garagechart from './garagechart.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

// 新增：控制图表显示的状态
const chartShow = ref(true);

// 新增：供子组件调用的切换图表方法
const toggleChart = () => {
  chartShow.value = !chartShow.value;
};

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '停车预约服务',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('停车预约服务');
const secondShow = ref(false);
</script>

<template>
  <div class="common-index">
    <!-- 新增：添加 v-if 控制图表显示隐藏 -->
    <garagechart v-if="chartShow" />

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
        <!-- 修改：给子组件传递 toggleChart 方法 -->
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :key="item.label"
          @toggle-chart="toggleChart"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
