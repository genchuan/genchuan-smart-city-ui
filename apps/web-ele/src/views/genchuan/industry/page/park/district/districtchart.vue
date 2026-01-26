<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '待关联车场数', value: 5, color: '#13ce66' },
    { title: '待关联道路数', value: 8, color: '#4ECDC4' },
    { title: '已关联资源总数', value: 22, color: '#FF6B6B' },
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
    <Columnar
      title="各片区关联资源数量对比"
      :x-data="['芗城区', '龙海区', '龙文区', '台商投资区', '高新区', '东山县']"
      :series-data="[{ name: '数量', data: [58, 42, 35, 15, 33, 21] }]"
    />
  </div>
</template>
