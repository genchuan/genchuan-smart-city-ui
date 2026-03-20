<script setup>
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
  // dataList 不再使用，完全采用静态数据
  dataList: { type: Array, default: () => [] }
});

// ---------- 静态模拟数据（严格符合 2.1.2 ~ 2.1.6 各子模块需求）----------
const mockConfig = {
  // 2.1.2 车辆待作业
  '车辆待作业': {
    cards: [
      { title: '待作业计划数', value: 24, color: '#409EFF' },
      { title: '未分配驾驶员计划数', value: 5, color: '#E6A23C' },
      { title: '高频作业车辆数', value: 8, color: '#67C23A' },
      { title: '跨区域作业计划数', value: 3, color: '#F56C6C' },
    ],
    pies: [
      { title: '车辆类型分布占比', data: [
          { name: '压缩车', value: 12 },
          { name: '洒水车', value: 6 },
          { name: '清扫车', value: 4 },
          { name: '转运车', value: 2 },
        ]},
      { title: '作业时段分布占比', data: [
          { name: '凌晨', value: 8 },
          { name: '上午', value: 10 },
          { name: '下午', value: 4 },
          { name: '夜间', value: 2 },
        ]},
      { title: '作业区域分布占比', data: [
          { name: '龙文区', value: 9 },
          { name: '龙海区', value: 6 },
          { name: '芗城区', value: 5 },
          { name: '长泰区', value: 4 },
        ]},
    ],
    bars: [
      { title: '不同车辆预计作业量对比', x: ['压缩车', '洒水车', '清扫车', '转运车'], series: [120, 80, 60, 40], name: '预计作业量(吨)' },
      { title: '不同路线作业计划数对比', x: ['路线A', '路线B', '路线C', '路线D'], series: [8, 6, 5, 5], name: '计划数' },
    ],
  },
  // 2.1.3 作业进行中
  '作业进行中': {
    cards: [
      { title: '作业中车辆数', value: 18, color: '#409EFF' },
      { title: '合规作业车辆数', value: 15, color: '#67C23A' },
      { title: '异常告警车辆数', value: 3, color: '#F56C6C' },
      { title: '已完成作业量', value: '45吨', color: '#E6A23C' },
      { title: '剩余作业量', value: '30吨', color: '#909399' },
    ],
    pies: [
      { title: '作业状态分布占比', data: [
          { name: '正常作业', value: 15 },
          { name: '异常告警', value: 3 },
        ]},
      { title: '异常类型分布占比', data: [
          { name: '超速', value: 2 },
          { name: '偏离路线', value: 1 },
        ]},
    ],
    bars: [
      { title: '不同作业路线车辆作业量对比', x: ['路线A', '路线B', '路线C', '路线D'], series: [12, 10, 8, 5], name: '作业量(吨)' },
    ],
    lines: [
      { title: '单车辆作业进度实时趋势', x: ['08:00', '09:00', '10:00', '11:00'], series: [20, 45, 70, 85], name: '进度%', yName: '%' },
      { title: '行驶速度变化趋势', x: ['08:00', '09:00', '10:00', '11:00'], series: [25, 30, 28, 32], name: '速度(km/h)', yName: 'km/h' },
    ],
  },
  // 2.1.4 违规待处理
  '违规待处理': {
    cards: [
      { title: '待处理违规数', value: 16, color: '#409EFF' },
      { title: '整改中违规数', value: 8, color: '#E6A23C' },
      { title: '超时未整改数', value: 3, color: '#F56C6C' },
      { title: '已办结违规数', value: 12, color: '#67C23A' },
    ],
    pies: [
      { title: '违规类型占比', data: [
          { name: '超速', value: 8 },
          { name: '偏离路线', value: 5 },
          { name: '违规停车', value: 3 },
        ]},
      { title: '违规状态占比', data: [
          { name: '待处理', value: 16 },
          { name: '整改中', value: 8 },
          { name: '已办结', value: 12 },
        ]},
      { title: '责任部门分布占比', data: [
          { name: '龙文车队', value: 10 },
          { name: '龙海车队', value: 8 },
          { name: '芗城车队', value: 6 },
        ]},
    ],
    bars: [
      { title: '不同驾驶员违规次数对比', x: ['张师傅', '李师傅', '王师傅', '赵师傅'], series: [4, 3, 2, 2], name: '违规次数' },
      { title: '不同违规类型整改完成率对比', x: ['超速', '偏离路线', '违规停车'], series: [75, 80, 67], name: '完成率%' },
    ],
    lines: [
      { title: '违规整改完成率周度趋势变化', x: ['周一', '周二', '周三', '周四', '周五'], series: [72, 75, 78, 80, 82], name: '完成率%', yName: '%' },
    ],
  },
  // 2.1.5 车辆待维护
  '车辆待维护': {
    cards: [
      { title: '待维护车辆数', value: 10, color: '#409EFF' },
      { title: '已派单车辆数', value: 4, color: '#67C23A' },
      { title: '超时未维护数', value: 2, color: '#F56C6C' },
      { title: '设备完好车辆数', value: 38, color: '#E6A23C' },
    ],
    pies: [
      { title: '维护类型占比', data: [
          { name: '定期保养', value: 6 },
          { name: '故障维修', value: 4 },
        ]},
      { title: '维护状态占比', data: [
          { name: '待派单', value: 4 },
          { name: '已派单', value: 4 },
          { name: '维修中', value: 2 },
        ]},
      { title: '车辆类型分布占比', data: [
          { name: '压缩车', value: 5 },
          { name: '洒水车', value: 3 },
          { name: '清扫车', value: 2 },
        ]},
    ],
    bars: [
      { title: '不同维护责任人维护完成率对比', x: ['张三', '李四', '王五'], series: [95, 90, 88], name: '完成率%' },
      { title: '不同车辆类型维护周期对比', x: ['压缩车', '洒水车', '清扫车', '转运车'], series: [30, 45, 60, 90], name: '维护周期(天)' },
    ],
    lines: [
      { title: '车辆设备完好率月度趋势变化', x: ['1月', '2月', '3月', '4月', '5月'], series: [94, 95, 96, 95, 97], name: '完好率%', yName: '%' },
    ],
  },
  // 2.1.6 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 328, color: '#409EFF' },
      { title: '作业类任务数', value: 180, color: '#67C23A' },
      { title: '维护类任务数', value: 85, color: '#E6A23C' },
      { title: '违规整改类任务数', value: 63, color: '#F56C6C' },
      { title: '运营评分优秀车辆数', value: 22, color: '#909399' },
    ],
    pies: [
      { title: '各任务类型完成量占比', data: [
          { name: '作业类', value: 180 },
          { name: '维护类', value: 85 },
          { name: '违规整改类', value: 63 },
        ]},
      { title: '各车辆完成量占比', data: [
          { name: '车辆A', value: 45 },
          { name: '车辆B', value: 38 },
          { name: '车辆C', value: 32 },
          { name: '车辆D', value: 28 },
        ]},
    ],
    bars: [
      { title: '按日已完成任务量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [45, 48, 52, 50, 55, 58, 60], name: '完成量' },
      { title: '不同部门运营评分对比', x: ['龙文车队', '龙海车队', '芗城车队', '长泰车队'], series: [92, 88, 90, 85], name: '运营评分' },
    ],
    lines: [
      { title: '车辆运营评分月度趋势变化', x: ['1月', '2月', '3月', '4月', '5月'], series: [86, 88, 89, 91, 92], name: '运营评分', yName: '分' },
      { title: '作业覆盖率季度趋势变化', x: ['Q1', 'Q2', 'Q3', 'Q4'], series: [82, 85, 88, 90], name: '覆盖率%', yName: '%' },
    ],
  },
};
</script>

<template>
  <div class="chart2-box">
    <!-- 车辆待作业 -->
    <template v-if="activeName === '车辆待作业'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['车辆待作业'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['车辆待作业'].pies[0].title" :data="mockConfig['车辆待作业'].pies[0].data" />
      <Pie style="flex:1" :title-text="mockConfig['车辆待作业'].pies[1].title" :data="mockConfig['车辆待作业'].pies[1].data" />
      <Pie style="flex:1" :title-text="mockConfig['车辆待作业'].pies[2].title" :data="mockConfig['车辆待作业'].pies[2].data" />
      <Bar style="flex:1" :title="mockConfig['车辆待作业'].bars[0].title" :x-data="mockConfig['车辆待作业'].bars[0].x" :series-data="[{ name: mockConfig['车辆待作业'].bars[0].name, data: mockConfig['车辆待作业'].bars[0].series }]" />
      <Bar style="flex:1" :title="mockConfig['车辆待作业'].bars[1].title" :x-data="mockConfig['车辆待作业'].bars[1].x" :series-data="[{ name: mockConfig['车辆待作业'].bars[1].name, data: mockConfig['车辆待作业'].bars[1].series }]" />
    </template>

    <!-- 作业进行中 -->
    <template v-else-if="activeName === '作业进行中'">
      <div class="box-left-m">
        <Indicator class="left-card" v-for="item in mockConfig['作业进行中'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['作业进行中'].pies[0].title" :data="mockConfig['作业进行中'].pies[0].data" />
      <Pie style="flex:1" :title-text="mockConfig['作业进行中'].pies[1].title" :data="mockConfig['作业进行中'].pies[1].data" />
      <Bar style="flex:1" :title="mockConfig['作业进行中'].bars[0].title" :x-data="mockConfig['作业进行中'].bars[0].x" :series-data="[{ name: mockConfig['作业进行中'].bars[0].name, data: mockConfig['作业进行中'].bars[0].series }]" />
      <LineChart style="flex:1" :title="mockConfig['作业进行中'].lines[0].title" :x-data="mockConfig['作业进行中'].lines[0].x" :series-data="[{ name: mockConfig['作业进行中'].lines[0].name, data: mockConfig['作业进行中'].lines[0].series }]" :y-name="mockConfig['作业进行中'].lines[0].yName" :smooth="true" />
      <LineChart style="flex:1" :title="mockConfig['作业进行中'].lines[1].title" :x-data="mockConfig['作业进行中'].lines[1].x" :series-data="[{ name: mockConfig['作业进行中'].lines[1].name, data: mockConfig['作业进行中'].lines[1].series }]" :y-name="mockConfig['作业进行中'].lines[1].yName" :smooth="true" />
    </template>

    <!-- 违规待处理 -->
    <template v-else-if="activeName === '违规待处理'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['违规待处理'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['违规待处理'].pies[0].title" :data="mockConfig['违规待处理'].pies[0].data" />
      <Pie style="flex:1" :title-text="mockConfig['违规待处理'].pies[1].title" :data="mockConfig['违规待处理'].pies[1].data" />
      <Pie style="flex:1" :title-text="mockConfig['违规待处理'].pies[2].title" :data="mockConfig['违规待处理'].pies[2].data" />
      <Bar style="flex:1" :title="mockConfig['违规待处理'].bars[0].title" :x-data="mockConfig['违规待处理'].bars[0].x" :series-data="[{ name: mockConfig['违规待处理'].bars[0].name, data: mockConfig['违规待处理'].bars[0].series }]" />
      <Bar style="flex:1" :title="mockConfig['违规待处理'].bars[1].title" :x-data="mockConfig['违规待处理'].bars[1].x" :series-data="[{ name: mockConfig['违规待处理'].bars[1].name, data: mockConfig['违规待处理'].bars[1].series }]" />
      <LineChart style="flex:1" :title="mockConfig['违规待处理'].lines[0].title" :x-data="mockConfig['违规待处理'].lines[0].x" :series-data="[{ name: mockConfig['违规待处理'].lines[0].name, data: mockConfig['违规待处理'].lines[0].series }]" :y-name="mockConfig['违规待处理'].lines[0].yName" :smooth="true" />
    </template>

    <!-- 车辆待维护 -->
    <template v-else-if="activeName === '车辆待维护'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['车辆待维护'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['车辆待维护'].pies[0].title" :data="mockConfig['车辆待维护'].pies[0].data" />
      <Pie style="flex:1" :title-text="mockConfig['车辆待维护'].pies[1].title" :data="mockConfig['车辆待维护'].pies[1].data" />
      <Pie style="flex:1" :title-text="mockConfig['车辆待维护'].pies[2].title" :data="mockConfig['车辆待维护'].pies[2].data" />
      <Bar style="flex:1" :title="mockConfig['车辆待维护'].bars[0].title" :x-data="mockConfig['车辆待维护'].bars[0].x" :series-data="[{ name: mockConfig['车辆待维护'].bars[0].name, data: mockConfig['车辆待维护'].bars[0].series }]" />
      <Bar style="flex:1" :title="mockConfig['车辆待维护'].bars[1].title" :x-data="mockConfig['车辆待维护'].bars[1].x" :series-data="[{ name: mockConfig['车辆待维护'].bars[1].name, data: mockConfig['车辆待维护'].bars[1].series }]" />
      <LineChart style="flex:1" :title="mockConfig['车辆待维护'].lines[0].title" :x-data="mockConfig['车辆待维护'].lines[0].x" :series-data="[{ name: mockConfig['车辆待维护'].lines[0].name, data: mockConfig['车辆待维护'].lines[0].series }]" :y-name="mockConfig['车辆待维护'].lines[0].yName" :smooth="true" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left-m">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pies[0].title" :data="mockConfig['已完成'].pies[0].data" />
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pies[1].title" :data="mockConfig['已完成'].pies[1].data" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bars[0].title" :x-data="mockConfig['已完成'].bars[0].x" :series-data="[{ name: mockConfig['已完成'].bars[0].name, data: mockConfig['已完成'].bars[0].series }]" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bars[1].title" :x-data="mockConfig['已完成'].bars[1].x" :series-data="[{ name: mockConfig['已完成'].bars[1].name, data: mockConfig['已完成'].bars[1].series }]" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].lines[0].title" :x-data="mockConfig['已完成'].lines[0].x" :series-data="[{ name: mockConfig['已完成'].lines[0].name, data: mockConfig['已完成'].lines[0].series }]" :y-name="mockConfig['已完成'].lines[0].yName" :smooth="true" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].lines[1].title" :x-data="mockConfig['已完成'].lines[1].x" :series-data="[{ name: mockConfig['已完成'].lines[1].name, data: mockConfig['已完成'].lines[1].series }]" :y-name="mockConfig['已完成'].lines[1].yName" :smooth="true" />
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

  .box-left-m {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

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
}
</style>
