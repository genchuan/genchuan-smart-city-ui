<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总分账方案数', value: 15, color: '#13ce66' },
    { title: '已启用方案数', value: 14, color: '#4ECDC4' },
    { title: '合作方总数', value: 8, color: '#FF6B6B' },
    { title: '平均分账比例', value: 8, color: '#FF6B6B' },
    // { title: '整改达标率', value: 8, color: '#FF6B6B' },
  ],
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
<!--    <Circle-->
<!--      width="340px"-->
<!--      height="330px"-->
<!--      title-text="广告状态占比"-->
<!--      :data="[-->
<!--        { name: '正常运行', value: 4 },-->
<!--        { name: '数据异常', value: 5 },-->
<!--      ]"-->
<!--    />-->
    <Circle
      width="340px"
      height="330px"
      title-text="合作方类型分布"
      :data="[
        { name: '试点场站分账方案', value: 4 },
        { name: '年度框架分账方案', value: 5 },
        { name: '季度特惠分账方案', value: 5 },
       { name: '临时促销分账方案', value: 5 },
       { name: '核心场站专属分账方案', value: 5 },



      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="分账方案启用/停用状态占比"
      :data="[
        { name: '启用', value: 4 },
        { name: '禁用', value: 5 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="各方案关联合作方数量"
      :x-data="['试点场站分账方案', '年度框架分账方案', '季度特惠分账方案', '临时促销分账方案', '核心场站专属分账方案', ]"
      :series-data="[{ name: '', data: [58, 42, 35, 15, 13] }]"
    />
  </div>
</template>
<style scoped>
/* 调整卡片大小 */
:deep(.left-card) {
  width: 290px !important;
  height: 75px !important;
  padding: 5px !important;
}

/* 缩小卡片内标题文字 */
:deep(.left-card .title) {
  font-size: 1px !important;
}

/* 缩小卡片内数值文字 */
:deep(.left-card .value) {
  font-size: 2px !important;
}
</style>
