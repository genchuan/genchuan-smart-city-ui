<script setup>
import { ref } from 'vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

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
    label: '代付规则',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabName: 'proxyRule',
  },
  {
    label: '代付订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabName: 'proxyOrder',
  },
  {
    label: '代付记录',
    components: Table,
    showSecondary: true,
    secondShow: false,
    tabName: 'proxyRecord',
  },
]);
const activeName = ref('代付规则');
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
          :tab-name="item.tabName"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
