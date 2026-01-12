<script setup>
import { ref } from 'vue';

import Table from './table/index.vue';

import '#/components/page/index.scss';

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
</script>
<template>
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
</template>
