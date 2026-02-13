<!-- 主页面 index.vue（位于外层目录） -->
<script setup>
import { ref } from 'vue';

// import TemplateReport from './template/index.vue';
// import TemplateChart from './template/templatechart.vue';
// import GenerateReport from './generate/index.vue';
// import GenerateChart from './generate/generatechart.vue';
// import RecordReport from './record/index.vue';
// import RecordChart from './record/recordchart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const arrowChange = (index) => {
  tabArray.value[index].arrowShow = !tabArray.value[index].arrowShow;
};
const tabArray = ref([
  // {
  //   label: '数据上报模板配置',
  //   components: TemplateReport,
  //   showSecondary: true,
  //   secondShow: false,
  //   arrowShow: false,
  //   arrowState: false,
  // },
  // {
  //   label: '政务报表生成',
  //   components: GenerateReport,
  //   showSecondary: true,
  //   secondShow: false,
  //   arrowShow: false,
  //   arrowState: false,
  // },
  // {
  //   label: '上报记录管理',
  //   components: RecordReport,
  //   showSecondary: true,
  //   secondShow: false,
  //   arrowShow: false,
  //   arrowState: false,
  // },
]);
const tabChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = false;
  });
};
const activeName = ref('数据上报模板配置');
const secondShow = ref(false);
</script>
<template>
  <div class="common-index">
<!--    <TemplateChart v-if="tabArray[0].arrowShow" />-->
<!--    <GenerateChart v-if="tabArray[1].arrowShow" />-->
<!--    <RecordChart v-if="tabArray[2].arrowShow" />-->
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
        v-for="(item, index) in tabArray"
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
          @arrow-change="arrowChange(index)"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
