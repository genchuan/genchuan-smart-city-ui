<script setup>
import { ref } from 'vue';

import Table from './table/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = (item) => {
  item.secondShow = !item.secondShow;
};
const tabArray = ref([
  {
    label: '电子发票服务',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('电子发票服务');
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
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
