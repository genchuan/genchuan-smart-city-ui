<script setup>
import { ref } from 'vue';

import Table from './basic/index.vue';
import Road from './road/index.vue';

import '#/components/page/index.scss';
const changeArrowStatus = (item) => {
  item.secondShow = !item.secondShow;
};
const tabArray = ref([
  {
    label: '车辆信息管理',
    components: Table,
    showSecondary: true,
    secondShow: true,
  },
  {
    label: '开发展示用例',
    components: Road,
    showSecondary: false,
    secondShow: false,
  },
]);
const activeName = ref('车辆信息管理');
</script>
<template>
  <div class="common-index">
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
            <div v-show="item.showSecondary" class="icon-first">
              <el-icon
                class="tabel-tab-icon"
                v-if="item.secondShow"
                @click="changeArrowStatus(item)"
              >
                <ArrowDown />
              </el-icon>
              <el-icon
                class="tabel-tab-icon"
                v-if="!item.secondShow"
                @click="changeArrowStatus(item)"
              >
                <ArrowUp />
              </el-icon>
            </div>
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component :is="item.components" :second-show="item.secondShow" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template> 