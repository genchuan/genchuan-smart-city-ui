<!-- dailychart.vue -->
<script setup>
import { reactive, computed, onMounted } from 'vue';
import { dataList } from './data';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import LineChart from '#/components/stats/line.vue';

const listData = dataList();

const state = reactive({
  cardList: computed(() => [
    {
      title: '今日生成报表',
      value: listData.filter(v => v.generate_time.includes('2026-02-05')).length.toString(),
      color: '#4ECDC4',
      icon: 'DocumentAdd',
      subTitle: '当日新生成'
    },
    {
      title: '待上报报表',
      value: listData.filter(v => v.upload_status === '未上报' || v.upload_status === '待上报').length.toString(),
      color: '#E6A23C',
      icon: 'Clock',
      subTitle: '待处理'
    },
    {
      title: '已上报报表',
      value: listData.filter(v => v.upload_status === '已上报').length.toString(),
      color: '#13ce66',
      icon: 'SuccessFilled',
      subTitle: '已完成上报'
    },
    {
      title: '本月累计',
      value: listData.filter(v => v.generate_time.includes('2026-02')).length.toString(),
      color: '#409EFF',
      icon: 'Calendar',
      subTitle: '2月份总计'
    },
  ]),

  // 按模板类型分布
  templateTypeData: computed(() => {
    const types = {};
    listData.forEach(item => {
      const type = item.template_name.replace(/停车场|报告|分析|统计|日报|月报|周报/g, '').trim();
      types[type] = (types[type] || 0) + 1;
    });

    return Object.entries(types)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }),

  // 按区域分布
  areaData: computed(() => {
    const areas = {};
    listData.forEach(item => {
      areas[item.area_name] = (areas[item.area_name] || 0) + 1;
    });

    return Object.entries(areas)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }),

  // 核心指标趋势数据（模拟7天数据）
  trendData: computed(() => {
    const dates = ['02-01', '02-02', '02-03', '02-04', '02-05', '02-06', '02-07'];
    const generateTrend = [3, 5, 4, 6, 3, 0, 0];
    const uploadTrend = [2, 4, 3, 5, 2, 0, 0];

    return {
      dates,
      series: [
        { name: '生成数量', data: generateTrend },
        { name: '上报数量', data: uploadTrend }
      ]
    };
  }),

  // 报表生成量排名
  templateUsageData: computed(() => {
    const templates = {};
    listData.forEach(item => {
      templates[item.template_name] = (templates[item.template_name] || 0) + 1;
    });

    return Object.entries(templates)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  })
});

// 模拟生成报表函数
const simulateGenerateReport = () => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // 这里可以添加实际生成报表的逻辑
  console.log(`模拟生成报表，日期: ${dateStr}`);

  return {
    success: true,
    message: '报表生成成功',
    date: dateStr
  };
};

onMounted(() => {
  // 组件加载时可以执行一些初始化操作
  console.log('政务报表生成图表组件已加载');
});
</script>

<template>
  <div class="park-chart-box park-district-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <LineChart
      title="报表生成与上报趋势"
      :x-data="state.trendData.dates"
      :series-data="state.trendData.series"
      :y-axis-name="'数量'"
      :legend-position="'top'"
      :grid-bottom="'15%'"
    />

    <div class="chart-row">
      <Circle
        title-text="按模板类型分布"
        :data="state.templateTypeData.slice(0, 6)"
        :show-legend="true"
        :legend-position="'right'"
        :radius="['40%', '70%']"
        class="chart-item"
      />

      <Circle
        title-text="按区域分布"
        :data="state.areaData"
        :show-legend="true"
        :legend-position="'right'"
        :color-scheme="['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFD166', '#EF476F']"
        class="chart-item"
      />
    </div>

    <Columnar
      title="热门模板使用排名"
      :x-data="state.templateUsageData.map(item => item[0])"
      :series-data="[
        {
          name: '生成次数',
          data: state.templateUsageData.map(item => item[1]),
          type: 'bar',
          itemStyle: {
            color: '#409EFF'
          }
        },
      ]"
      :y-axis-name="'生成次数'"
      :x-axis-rotate="-45"
      :grid-bottom="'25%'"
      class="district-columnar"
    />
  </div>
</template>

<style lang="scss">
.park-district-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 100%;

    .left-card {
      height: 159px !important;
    }
  }

  .chart-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;

    .chart-item {
      height: 300px;
    }
  }

  .district-columnar {
    min-width: 200px !important;
    height: 350px;
  }

  // 调整多个图表容器的布局
  > div {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@media (max-width: 1200px) {
  .park-district-chart {
    .chart-row {
      grid-template-columns: 1fr;
    }
  }
}
</style>
