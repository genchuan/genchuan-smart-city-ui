<template>
  <div class="common-index">
    <Alarmechart v-if="tabArray[0].arrowShow" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus">
        <ArrowDown />
      </el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus">
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component :is="item.components" :second-show="item.secondShow" :key="item.label" :arrow-show="item.arrowShow" @arrow-change="arrowChange" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Table from './table/index.vue';
import Alarmechart from './alarmechart.vue';
import '#/components/page/index.scss';

const secondShow = ref(false);
const activeName = ref('我的预警');

const tabArray = ref([
  {
    label: '我的预警',
    components: Table,
    showSecondary: true,
    secondShow: false,
    arrowShow: false,
    arrowState: false
  }
]);

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach(v => { v.secondShow = secondShow.value; });
};

const arrowChange = () => {
  tabArray.value.forEach(v => { v.arrowShow = !v.arrowShow; });
};

const tabChange = () => {};
</script>

<style scoped lang="scss">
.common-index {
  padding: 20px;
}
.icon-change {
  text-align: center;
  margin: 10px 0;
  cursor: pointer;
}
.tabel-tab-icon {
  font-size: 20px;
}
.common-tabs {
  margin-top: 10px;
}
</style>
