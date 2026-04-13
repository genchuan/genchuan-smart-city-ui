<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总订单数', value: 15, color: '#13ce66' },
    { title: '完成订单数', value: 14, color: '#4ECDC4' },
    { title: '交易总金额', value: 8, color: '#FF6B6B' },
    // { title: '已闭环工单数', value: 8, color: '#FF6B6B' },
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
      title-text="订单状态"
      :data="[
        { name: '待支付', value: 4 },
        { name: '已取消', value: 5 },
                { name: '已完成', value: 5 },

      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />

    <Columnar
      height="330px"
      title="各场站订单数量对比"
      :x-data="['星星', '国家电网', '特来电']"
      :series-data="[{ name: '', data: [58, 42, 33] }]"
    />
  </div>
</template>
