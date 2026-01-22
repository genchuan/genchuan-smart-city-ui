<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总车库数', value: 15, color: '#13ce66' },
    { title: '总车库数', value: 14, color: '#4ECDC4' },
    { title: '可用车库数', value: 8, color: '#FF6B6B' },
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
    <div class="chart-box-right">
      <Circle
        width="340px"
        height="330px"
        class="chart-box-circle"
        title-text="门禁类型占比"
        :data="[
          { name: '道闸', value: 4 },
          { name: '车牌识别', value: 5 },
          { name: '道闸+刷卡', value: 2 },
          { name: '车牌识别+人脸识别', value: 5 },
        ]"
      />
      <Circle
        width="340px"
        height="330px"
        class="chart-box-circle"
        title-text="车库状态占比"
        :data="[
          { name: '启用', value: 4 },
          { name: '禁用', value: 5 },
        ]"
        :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
      />
      <Columnar
        class="chart-box-Columnar"
        height="330px"
        title="不同车场车库数量对比"
        :x-data="[
          '龙文区碧湖公园停车场',
          '龙海区石码镇便民停车场',
          '龙海区闽齐社区停车场',
          '龙海区闽齐社区停车场',
          '长泰区武安镇公共停车场',
          '漳浦县绥安镇便民停车场',
        ]"
        :series-data="[{ name: '', data: [58, 42, 35, 15, 13, 33] }]"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  min-height: 360px;
  display: flex;
  .chart-box-left {
    display: flex;
    flex: 0 0 max(280px, min(25vw, 320px));
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-left: 30px;
  }
  .chart-box-right {
    display: flex;
    flex-wrap: wrap;
    .chart-box-circle {
      margin-left: 5px;
      width: 300px;
      display: flex;
      justify-content: center;
    }
    .chart-box-Columnar {
      margin-left: 15px;
      min-width: 560px;
    }
  }
}
</style>
