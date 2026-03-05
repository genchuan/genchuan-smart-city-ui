<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '会员等级总数', value: 15, color: '#13ce66' },
    { title: '启用等级数', value: 14, color: '#4ECDC4' },
    { title: '用户等级分布占比', value: 8, color: '#FF6B6B' },
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
    <Circle
      width="340px"
      height="330px"
      title-text="各等级用户占比"
      :data="[
        { name: '普通会员', value: 4 },
        { name: '白银会员', value: 5 },
        { name: '黄金会员', value: 5 },
        { name: '白金会员', value: 5 },
        { name: '钻石会员', value: 5 },
        { name: '测试会员', value: 5 },
      ]"
    />

    <Columnar
      height="330px"
      title="各等级所需成长值对比"
      :x-data="['初级会员等级', '中级会员等级', '高级会员等级', '顶级会员等级']"
      :series-data="[{ name: '', data: [58, 42, 33, 33] }]"
    />
  </div>
</template>
