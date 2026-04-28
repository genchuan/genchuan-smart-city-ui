<script setup>
import { onMounted, reactive } from 'vue';

import { getDebtRecordCollectConfigChart } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';

// 追缴方式映射
const methodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

const state = reactive({
  cardList: [
    { title: '启用配置数', value: 0, color: '#13ce66' },
    { title: '追缴触发率', value: 0, color: '#4ECDC4', suffix: '%' },
    { title: '配置总数', value: 0, color: '#FF6B6B' },
  ],
  typeData: [],
});



// 获取追缴配置图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordCollectConfigChart();
    state.cardList[0].value = res.enableConfigCount;
    state.cardList[1].value = res.collectTriggerRate;
    state.cardList[2].value = res.typeData.reduce((sum, item) => sum + item.count, 0);
    state.typeData = res.typeData || [];
  } catch (error) {
    console.error('获取追缴配置图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 2;
    state.cardList[1].value = 66.7;
    state.cardList[2].value = 3;
    state.typeData = [
      { method: 'sms', count: 1 },
      { method: 'phone', count: 1 },
      { method: 'notify', count: 1 },
    ];
  }
};

onMounted(() => {
  fetchOrderChartData();
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
     class="simple-bar-chart"
      title="追缴方式分布"
      :x-data="
        state.typeData.map(
          (item) => methodMap[item.method]?.label || item.method,
        )
      "
      :series-data="[
        { name: '配置数', data: state.typeData.map((item) => item.count) },
      ]"
    />
  </div>
</template>
