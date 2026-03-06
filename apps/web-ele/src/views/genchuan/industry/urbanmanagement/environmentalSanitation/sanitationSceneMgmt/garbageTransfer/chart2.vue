<script setup>
import {computed} from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const props = defineProps({
  activeName: {type: String, required: true},
  // 保留 dataList 但不再使用，完全采用静态模拟数据
  dataList: {type: Array, default: () => []}
});

// ---------- 静态模拟数据（完全按照需求文档各模块要求）----------
const mockConfig = {
  // 1.4.2 车辆待进站
  '车辆待进站': {
    cards: [
      {title: '待进站车辆数', value: 15, color: '#409EFF'},
      {title: '已排序车辆数', value: 8, color: '#67C23A'},
      {title: '今日预约总数', value: 23, color: '#E6A23C'},
    ],
    pie1: {
      title: '垃圾品类占比', data: [
        {name: '其他垃圾', value: 8},
        {name: '厨余垃圾', value: 5},
        {name: '可回收物', value: 2},
      ]
    },
    pie2: {
      title: '区域分布占比', data: [
        {name: '龙文区', value: 6},
        {name: '龙海区', value: 4},
        {name: '芗城区', value: 3},
        {name: '长泰区', value: 2},
      ]
    },
    bar: {
      title: '不同时段预约车辆数量对比',
      x: ['08-10点', '10-12点', '12-14点', '14-16点', '16-18点'],
      series: [5, 8, 4, 7, 3]
    },
  },
  // 1.4.3 作业进行中（无圆环图，有折线图+柱状图）
  '作业进行中': {
    cards: [
      {title: '当前作业数', value: 12, color: '#409EFF'},
      {title: '正常运行数', value: 10, color: '#67C23A'},
      {title: '异常标记数', value: 2, color: '#F56C6C'},
    ],
    line: {
      title: '近1小时环境指标变化趋势',
      x: ['14:00', '14:10', '14:20', '14:30', '14:40', '14:50', '15:00'],
      series: [22, 23, 25, 24, 26, 25, 24],
      yName: '温度(℃)'
    },
    bar: {
      title: '各设备运行参数实时展示',
      x: ['压缩机', '分选机', '清洗机', '输送带'],
      series: [85, 92, 78, 88]
    },
  },
  // 1.4.4 预警待处理
  '预警待处理': {
    cards: [
      {title: '待处置预警总数', value: 18, color: '#409EFF'},
      {title: '高优先级数', value: 5, color: '#E6A23C'},
      {title: '超时未处理数', value: 3, color: '#F56C6C'},
    ],
    pie1: {
      title: '预警类型占比', data: [
        {name: '设备故障', value: 8},
        {name: '环境超标', value: 6},
        {name: '安全告警', value: 4},
      ]
    },
    pie2: {
      title: '转运站分布占比', data: [
        {name: '龙文站', value: 5},
        {name: '龙海站', value: 4},
        {name: '芗城站', value: 6},
        {name: '长泰站', value: 3},
      ]
    },
    bar: {
      title: '不同责任人待处置预警数量对比',
      x: ['张三', '李四', '王五', '赵六'],
      series: [7, 5, 3, 3]
    },
  },
  // 1.4.5 设备待维护
  '设备待维护': {
    cards: [
      {title: '待维护设备总数', value: 24, color: '#409EFF'},
      {title: '按类型待维护数', value: 12, color: '#67C23A'},
      {title: '超时未维护数', value: 4, color: '#F56C6C'},
    ],
    pie1: {
      title: '设备类型占比', data: [
        {name: '压缩机', value: 10},
        {name: '分选机', value: 6},
        {name: '清洗机', value: 5},
        {name: '输送带', value: 3},
      ]
    },
    pie2: {
      title: '维护状态占比', data: [
        {name: '待维护', value: 15},
        {name: '维护中', value: 7},
        {name: '已完成', value: 2},
      ]
    },
    bar: {
      title: '不同转运站待维护设备数量对比',
      x: ['龙文站', '龙海站', '芗城站', '长泰站', '漳浦站'],
      series: [8, 6, 5, 3, 2]
    },
  },
  // 1.4.6 已完成
  '已完成': {
    cards: [
      {title: '已完成任务总数', value: 156, color: '#409EFF'},
      {title: '进站总量', value: '2450吨', color: '#67C23A'},
      {title: '设备完好率', value: '96%', color: '#E6A23C'},
      {title: '环境达标率', value: '98%', color: '#F56C6C'},
    ],
    pie1: {
      title: '各任务类型占比', data: [
        {name: '进站作业', value: 80},
        {name: '设备维护', value: 40},
        {name: '预警处置', value: 36},
      ]
    },
    pie2: {
      title: '各转运站完成量占比', data: [
        {name: '龙文站', value: 50},
        {name: '龙海站', value: 40},
        {name: '芗城站', value: 30},
        {name: '长泰站', value: 20},
        {name: '漳浦站', value: 16},
      ]
    },
    bar: {
      title: '按日进站量对比',
      x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'],
      series: [320, 350, 300, 380, 410, 390, 420]
    },
    line: {
      title: '设备完好率趋势变化',
      x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'],
      series: [95, 96, 94, 97, 96, 98, 97],
      yName: '%'
    },
  },
};

// 根据 activeName 获取当前模块的配置
const currentConfig = computed(() => mockConfig[props.activeName] || null);
</script>

<template>
  <div class="chart2-box">
    <!-- 车辆待进站 -->
    <template v-if="activeName === '车辆待进站'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['车辆待进站'].cards"
                   :key="item.title" v-bind="item"/>
      </div>
      <Pie style="flex:1" :title-text="mockConfig['车辆待进站'].pie1.title"
           :data="mockConfig['车辆待进站'].pie1.data"/>
      <Pie style="flex:1" :title-text="mockConfig['车辆待进站'].pie2.title"
           :data="mockConfig['车辆待进站'].pie2.data"/>
      <Bar style="flex:1" :title="mockConfig['车辆待进站'].bar.title"
           :x-data="mockConfig['车辆待进站'].bar.x"
           :series-data="[{ name: '预约数', data: mockConfig['车辆待进站'].bar.series }]"/>
    </template>

    <!-- 作业进行中（无圆环图，有折线图+柱状图） -->
    <template v-else-if="activeName === '作业进行中'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['作业进行中'].cards"
                   :key="item.title" v-bind="item"/>
      </div>
      <LineChart style="flex:1" :title="mockConfig['作业进行中'].line.title"
                 :x-data="mockConfig['作业进行中'].line.x"
                 :series-data="[{ name: '温度', data: mockConfig['作业进行中'].line.series }]"
                 :y-name="mockConfig['作业进行中'].line.yName" :smooth="true"/>
      <Bar style="flex:1" :title="mockConfig['作业进行中'].bar.title"
           :x-data="mockConfig['作业进行中'].bar.x"
           :series-data="[{ name: '运行参数', data: mockConfig['作业进行中'].bar.series }]"/>
    </template>

    <!-- 预警待处理 -->
    <template v-else-if="activeName === '预警待处理'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['预警待处理'].cards"
                   :key="item.title" v-bind="item"/>
      </div>
      <Pie style="flex:1" :title-text="mockConfig['预警待处理'].pie1.title"
           :data="mockConfig['预警待处理'].pie1.data"/>
      <Pie style="flex:1" :title-text="mockConfig['预警待处理'].pie2.title"
           :data="mockConfig['预警待处理'].pie2.data"/>
      <Bar style="flex:1" :title="mockConfig['预警待处理'].bar.title"
           :x-data="mockConfig['预警待处理'].bar.x"
           :series-data="[{ name: '预警数', data: mockConfig['预警待处理'].bar.series }]"/>
    </template>

    <!-- 设备待维护 -->
    <template v-else-if="activeName === '设备待维护'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['设备待维护'].cards"
                   :key="item.title" v-bind="item"/>
      </div>
      <Pie style="flex:1" :title-text="mockConfig['设备待维护'].pie1.title"
           :data="mockConfig['设备待维护'].pie1.data"/>
      <Pie style="flex:1" :title-text="mockConfig['设备待维护'].pie2.title"
           :data="mockConfig['设备待维护'].pie2.data"/>
      <Bar style="flex:1" :title="mockConfig['设备待维护'].bar.title"
           :x-data="mockConfig['设备待维护'].bar.x"
           :series-data="[{ name: '待维护数', data: mockConfig['设备待维护'].bar.series }]"/>
    </template>

    <!-- 已完成（两个圆环图 + 柱状图 + 折线图） -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title"
                   v-bind="item"/>
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie1.title"
           :data="mockConfig['已完成'].pie1.data"/>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie2.title"
           :data="mockConfig['已完成'].pie2.data"/>
      <Bar style="flex:1" :title="mockConfig['已完成'].bar.title"
           :x-data="mockConfig['已完成'].bar.x"
           :series-data="[{ name: '进站量(吨)', data: mockConfig['已完成'].bar.series }]"/>
      <LineChart style="flex:1" :title="mockConfig['已完成'].line.title"
                 :x-data="mockConfig['已完成'].line.x"
                 :series-data="[{ name: '完好率', data: mockConfig['已完成'].line.series }]"
                 :y-name="mockConfig['已完成'].line.yName" :smooth="true"/>
    </template>
  </div>
</template>

<style scoped lang="scss">
.chart2-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-box-left {
    display: flex;
    flex: 0 0 max(280px, min(25vw, 320px));
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }
}
</style>
