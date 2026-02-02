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
    label: '优惠券管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    type: 'coupon'
  },
  {
    label: '活动配置管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
    type: 'activity'
  },
]);
const activeName = ref('优惠券管理');
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
          :type="item.type"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
