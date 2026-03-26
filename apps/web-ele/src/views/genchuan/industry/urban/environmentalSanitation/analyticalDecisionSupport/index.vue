<script setup>
import { ref, computed } from 'vue';

import customize from './sanitationMgmtReport/index.vue';
import customizechart from './sanitationMgmtReport/components/chart.vue';
import '#/components/page/index.scss';

const tabArray = ref([
  {
    label: '环卫管理报表',
    components: customize,
    showSecondary: false,
    secondShow: false,
    arrowShow: true,      // 初始状态，可由你控制
    arrowState: false,
    chartComponent: customizechart,
  },
]);

const activeName = ref('环卫管理报表');

// 计算当前激活的tab对象
const currentTab = computed(() => {
  return tabArray.value.find(item => item.label === activeName.value) || tabArray.value[0];
});

// 计算当前图表的显示状态（基于当前tab的arrowShow）
const currentArrowShow = computed(() => {
  return currentTab.value.arrowShow;
});

const arrowChange = () => {
  // 切换当前tab的arrowShow（图表显隐）
  const nowTab = currentTab.value;
  if (nowTab) {
    nowTab.arrowShow = !nowTab.arrowShow;
  }
  // 如果需要，可以同步修改其他状态（例如secondShow），但示例中只控制图表
};

const tabChange = (item) => {
  // 重置所有tab的状态
  tabArray.value.forEach((v) => {
    v.showSecondary = false;
    v.secondShow = false;
    v.arrowShow = false;
    v.arrowState = false;
  });
  const nowObj = tabArray.value.find((v) => v.label === item);
  if (nowObj) {
    nowObj.arrowShow = true;
    nowObj.arrowState = true;
    nowObj.secondShow = true;
  }
};
</script>

<template>
  <div class="common-index">
    <!-- 图表组件根据当前arrowShow状态显示/隐藏 -->
    <component
      v-if="currentArrowShow"
      :is="currentTab.chartComponent"
    />

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
