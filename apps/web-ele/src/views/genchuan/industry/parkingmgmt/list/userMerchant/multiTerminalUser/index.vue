<script setup>
import { computed, ref } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import { getStatsDataByUserType } from './table/data.js';
import Table from './table/index.vue';

import '#/components/page/index.scss';
import StatsVisualization from "#/components/stats/StatsVisualization.vue";

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '全部',
    components: Table,
    showSecondary: true,
    secondShow: false,
    userType: '全部',
  },
  {
    label: '个人用户管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    userType: '个人',
  },
  {
    label: '企业用户管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    userType: '企业',
  },
  {
    label: '政府用户管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    userType: '政府',
  },
]);
const activeName = ref('全部');
const secondShow = ref(false);

// 当前选中的用户类型
const currentUserType = ref('全部');
// 获取当前用户类型的统计数据
const statsData = computed(() => {
  return getStatsDataByUserType(currentUserType.value);
});

// 监听标签页切换，更新当前用户类型
const tabChange = (tabName) => {
  activeName.value = tabName;
  // 根据标签页名称更新当前用户类型
  const tab = tabArray.value.find((item) => item.label === tabName);
  if (tab) {

    currentUserType.value = tab.userType;
  }
};
</script>
<template>
  <div class="multi-termina-user">
  <!-- 统计可视化组件 -->
  <StatsVisualization :data="statsData" />
    <div class="common-index">

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
            :user-type="item.userType"
            :key="item.label"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<style scope lang="scss">
.multi-termina-user {
  overflow: auto;
  height: 89vh;
  .common-index{
    height: auto;
  }
  .common-index .icon-change {
    position: relative;
    top: 30px;
  }
  .common-index .park-lot-table-new .vxe-tools--wrapper {
    position: relative;
    right: 0px;
    top: 0px;
  }
  .common-index .park-lot-table-new .vxe-tools--operate{
    position: relative;
    right: 0px;
    top: 0px;
  }
}

</style>
