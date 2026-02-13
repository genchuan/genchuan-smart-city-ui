<!-- templatechart.vue -->
<script setup>
import { reactive, computed } from 'vue';
import { dataList } from './data';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const listData = dataList();

const state = reactive({
  cardList: computed(() => [
    {
      title: '模板总数',
      value: listData.length.toString(),
      color: '#4ECDC4',
      icon: 'Document',
      subTitle: '配置模板总数'
    },
    {
      title: '启用模板数',
      value: listData.filter(v => v.status === '启用').length.toString(),
      color: '#13ce66',
      icon: 'SuccessFilled',
      subTitle: '当前可用模板'
    },
    {
      title: '常用模板数',
      value: listData.filter(v =>
        ['运营统计', '设施统计', '监管统计'].includes(v.report_type) &&
        v.status === '启用'
      ).length.toString(),
      color: '#E6A23C',
      icon: 'Star',
      subTitle: '高频使用模板'
    },
    {
      title: '平台级模板',
      value: listData.filter(v => v.apply_scope === '平台级').length.toString(),
      color: '#409EFF',
      icon: 'Platform',
      subTitle: '全平台适用'
    },
  ]),

  // 报表类型分布数据
  reportTypeData: computed(() => {
    const types = {};
    listData.forEach(item => {
      types[item.report_type] = (types[item.report_type] || 0) + 1;
    });

    return Object.entries(types).map(([name, value]) => ({
      name,
      value
    }));
  }),

  // 适用范围分布数据
  applyScopeData: computed(() => {
    const scopes = {};
    listData.forEach(item => {
      scopes[item.apply_scope] = (scopes[item.apply_scope] || 0) + 1;
    });

    return Object.entries(scopes).map(([name, value]) => ({
      name,
      value
    }));
  }),

  // 模板使用次数排名数据（模拟）
  templateUsageData: computed(() => {
    // 模拟使用次数，实际应从接口获取
    const usageMap = {
      '市级停车场运营日报': 125,
      '区域停车设施统计月报': 98,
      '政务停车场监管日报': 87,
      '商业中心停车月报': 76,
      '小区停车场使用周报': 65,
      '路边停车收费日报': 54,
      '医院停车场服务报告': 43,
      '学校周边停车分析': 32,
      '节假日停车预测报告': 21,
      '景区停车场节假日报告': 15
    };

    return Object.entries(usageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8); // 取前8个
  })
});

// 获取报表类型排名前几的数据
const getTopReportTypes = (data, limit = 5) => {
  return data.sort((a, b) => b.value - a.value).slice(0, limit);
};
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

    <Circle
      title-text="报表类型占比"
      :data="getTopReportTypes(state.reportTypeData)"
      :show-legend="true"
      :legend-position="'right'"
    />

    <Circle
      title-text="适用范围占比"
      :data="state.applyScopeData"
      :show-legend="true"
      :legend-position="'right'"
      :color-scheme="['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']"
    />

    <Columnar
      title="模板使用次数排名"
      :x-data="state.templateUsageData.map(item => item[0])"
      :series-data="[
        {
          name: '使用次数',
          data: state.templateUsageData.map(item => item[1]),
          type: 'bar',
          itemStyle: {
            color: '#409EFF'
          }
        },
      ]"
      :y-axis-name="'使用次数'"
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

  .district-columnar {
    min-width: 200px !important;
    height: 300px;
  }

  // 调整多个图表容器的布局
  > div {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
