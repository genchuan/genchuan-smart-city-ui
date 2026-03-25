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

// ---------- 静态模拟数据（严格符合 2.2.2 ~ 2.2.5 各子模块需求）----------
const mockConfig = {
  // 2.2.2 待排班
  '待排班': {
    cards: [
      { title: '待排班人数', value: 12, color: '#409EFF' },
      { title: '已排班人数', value: 74, color: '#67C23A' },
      { title: '换班申请待审核数', value: 5, color: '#E6A23C' },
      { title: '岗位空缺数', value: 3, color: '#F56C6C' },
      { title: '排班覆盖率', value: '86%', color: '#909399' },
    ],
    pies: [
      { title: '岗位类型分布占比', data: [
          { name: '保洁员', value: 8 },
          { name: '收运员', value: 3 },
          { name: '驾驶员', value: 1 },
        ]},
      { title: '排班周期分布占比', data: [
          { name: '日排班', value: 6 },
          { name: '周排班', value: 4 },
          { name: '月排班', value: 2 },
        ]},
      { title: '所属班组分布占比', data: [
          { name: '龙文班组', value: 5 },
          { name: '龙海班组', value: 4 },
          { name: '芗城班组', value: 2 },
          { name: '长泰班组', value: 1 },
        ]},
    ],
    bars: [
      { title: '不同班组排班覆盖率对比', x: ['龙文班组', '龙海班组', '芗城班组', '长泰班组'], series: [92, 88, 85, 82], name: '覆盖率%' },
      { title: '不同岗位待排班人数对比', x: ['保洁员', '收运员', '驾驶员', '管理员'], series: [8, 3, 1, 0], name: '待排班人数' },
    ],
    lines: [
      { title: '排班覆盖率周度趋势变化', x: ['周一', '周二', '周三', '周四', '周五'], series: [84, 86, 88, 89, 91], name: '覆盖率%', yName: '%' },
    ],
  },
  // 2.2.3 待考勤
  '待考勤': {
    cards: [
      { title: '待审核考勤数', value: 18, color: '#409EFF' },
      { title: '异常考勤数', value: 12, color: '#E6A23C' },
      { title: '全勤人数', value: 65, color: '#67C23A' },
      { title: '未打卡人数', value: 7, color: '#F56C6C' },
      { title: '补录考勤数', value: 4, color: '#909399' },
    ],
    pies: [
      { title: '打卡状态占比', data: [
          { name: '正常', value: 65 },
          { name: '迟到', value: 5 },
          { name: '早退', value: 3 },
          { name: '未打卡', value: 7 },
          { name: '定位异常', value: 4 },
        ]},
      { title: '异常类型占比', data: [
          { name: '迟到', value: 5 },
          { name: '早退', value: 3 },
          { name: '未打卡', value: 7 },
          { name: '定位异常', value: 4 },
        ]},
      { title: '所属班组分布占比', data: [
          { name: '龙文班组', value: 8 },
          { name: '龙海班组', value: 5 },
          { name: '芗城班组', value: 3 },
          { name: '长泰班组', value: 2 },
        ]},
    ],
    bars: [
      { title: '不同班组考勤全勤率对比', x: ['龙文班组', '龙海班组', '芗城班组', '长泰班组'], series: [92, 88, 85, 90], name: '全勤率%' },
      { title: '不同岗位异常考勤次数对比', x: ['保洁员', '收运员', '驾驶员', '管理员'], series: [8, 5, 2, 1], name: '异常次数' },
    ],
    lines: [
      { title: '考勤全勤率周度趋势变化', x: ['周一', '周二', '周三', '周四', '周五'], series: [88, 90, 89, 91, 92], name: '全勤率%', yName: '%' },
    ],
  },
  // 2.2.4 考核待审核
  '考核待审核': {
    cards: [
      { title: '待审核考核数', value: 26, color: '#409EFF' },
      { title: '各等级预估数', value: 18, color: '#67C23A' },
      { title: '高分行数', value: 12, color: '#E6A23C' },
      { title: '需退回修改数', value: 3, color: '#F56C6C' },
    ],
    pies: [
      { title: '岗位类型占比', data: [
          { name: '保洁员', value: 14 },
          { name: '收运员', value: 8 },
          { name: '驾驶员', value: 3 },
          { name: '管理员', value: 1 },
        ]},
      { title: '考核等级分布占比', data: [
          { name: '优秀', value: 12 },
          { name: '良好', value: 8 },
          { name: '合格', value: 4 },
          { name: '待改进', value: 2 },
        ]},
      { title: '所属班组分布占比', data: [
          { name: '龙文班组', value: 10 },
          { name: '龙海班组', value: 8 },
          { name: '芗城班组', value: 5 },
          { name: '长泰班组', value: 3 },
        ]},
    ],
    bars: [
      { title: '不同班组考核初始平均分对比', x: ['龙文班组', '龙海班组', '芗城班组', '长泰班组'], series: [92, 88, 85, 90], name: '平均分' },
      { title: '各维度得分分布对比', x: ['考勤', '作业质量', '问题处置'], series: [88, 92, 86], name: '得分' },
    ],
    lines: [
      { title: '考核总分分布趋势', x: ['60-70', '70-80', '80-90', '90-100'], series: [2, 5, 10, 9], name: '人数' },
      { title: '班组考核通过率周度变化', x: ['周一', '周二', '周三', '周四', '周五'], series: [82, 85, 88, 90, 92], name: '通过率%', yName: '%' },
    ],
  },
  // 2.2.5 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 432, color: '#409EFF' },
      { title: '排班类任务数', value: 156, color: '#67C23A' },
      { title: '考勤类任务数', value: 168, color: '#E6A23C' },
      { title: '考核类任务数', value: 108, color: '#F56C6C' },
      { title: '优秀人员数', value: 42, color: '#909399' },
    ],
    pies: [
      { title: '各任务类型完成量占比', data: [
          { name: '排班类', value: 156 },
          { name: '考勤类', value: 168 },
          { name: '考核类', value: 108 },
        ]},
      { title: '各班组完成量占比', data: [
          { name: '龙文班组', value: 145 },
          { name: '龙海班组', value: 112 },
          { name: '芗城班组', value: 98 },
          { name: '长泰班组', value: 77 },
        ]},
      { title: '优秀人员分布占比', data: [
          { name: '保洁员', value: 20 },
          { name: '收运员', value: 12 },
          { name: '驾驶员', value: 6 },
          { name: '管理员', value: 4 },
        ]},
    ],
    bars: [
      { title: '按日已完成任务量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [62, 58, 65, 70, 68, 72, 75], name: '完成量' },
      { title: '不同班组综合管理评分对比', x: ['龙文班组', '龙海班组', '芗城班组', '长泰班组'], series: [92, 88, 85, 90], name: '综合评分' },
    ],
    lines: [
      { title: '班组平均考核分月度趋势变化', x: ['1月', '2月', '3月', '4月', '5月'], series: [86, 88, 89, 91, 92], name: '平均分', yName: '分' },
      { title: '考勤率季度趋势变化', x: ['Q1', 'Q2', 'Q3', 'Q4'], series: [85, 88, 90, 92], name: '考勤率%', yName: '%' },
    ],
  },
};
</script>

<template>
  <div class="chart2-box">
    <!-- 待排班 -->
    <template v-if="activeName === '待排班'">
      <div style="flex-direction: column; width: 100%;">
        <div style="flex: 1; display: flex; width: 100%;">
          <div class="box-left-m">
            <Indicator class="left-card" v-for="item in mockConfig['待排班'].cards" :key="item.title" v-bind="item" />
          </div>
          <Pie style="flex:1" :title-text="mockConfig['待排班'].pies[0].title" :data="mockConfig['待排班'].pies[0].data" />
          <Pie style="flex:1" :title-text="mockConfig['待排班'].pies[1].title" :data="mockConfig['待排班'].pies[1].data" />
          <Pie style="flex:1" :title-text="mockConfig['待排班'].pies[2].title" :data="mockConfig['待排班'].pies[2].data" />
        </div>
        <div style="flex: 1; display: flex; width: 100%;">
          <Bar style="flex:1" :title="mockConfig['待排班'].bars[0].title" :x-data="mockConfig['待排班'].bars[0].x" :series-data="[{ name: mockConfig['待排班'].bars[0].name, data: mockConfig['待排班'].bars[0].series }]" />
          <Bar style="flex:1" :title="mockConfig['待排班'].bars[1].title" :x-data="mockConfig['待排班'].bars[1].x" :series-data="[{ name: mockConfig['待排班'].bars[1].name, data: mockConfig['待排班'].bars[1].series }]" />
          <LineChart style="flex:1" :title="mockConfig['待排班'].lines[0].title" :x-data="mockConfig['待排班'].lines[0].x" :series-data="[{ name: mockConfig['待排班'].lines[0].name, data: mockConfig['待排班'].lines[0].series }]" :y-name="mockConfig['待排班'].lines[0].yName" :smooth="true" />
        </div>
      </div>
    </template>

    <!-- 待考勤 -->
    <template v-else-if="activeName === '待考勤'">
      <div style="flex-direction: column; width: 100%;">
        <div style="flex: 1; display: flex; width: 100%;">
          <div class="box-left-m">
            <Indicator class="left-card" v-for="item in mockConfig['待考勤'].cards" :key="item.title" v-bind="item" />
          </div>
          <Pie style="flex:1" :title-text="mockConfig['待考勤'].pies[0].title" :data="mockConfig['待考勤'].pies[0].data" />
          <Pie style="flex:1" :title-text="mockConfig['待考勤'].pies[1].title" :data="mockConfig['待考勤'].pies[1].data" />
          <Pie style="flex:1" :title-text="mockConfig['待考勤'].pies[2].title" :data="mockConfig['待考勤'].pies[2].data" />
        </div>
        <div style="flex: 1; display: flex; width: 100%;">
          <Bar style="flex:1" :title="mockConfig['待考勤'].bars[0].title" :x-data="mockConfig['待考勤'].bars[0].x" :series-data="[{ name: mockConfig['待考勤'].bars[0].name, data: mockConfig['待考勤'].bars[0].series }]" />
          <Bar style="flex:1" :title="mockConfig['待考勤'].bars[1].title" :x-data="mockConfig['待考勤'].bars[1].x" :series-data="[{ name: mockConfig['待考勤'].bars[1].name, data: mockConfig['待考勤'].bars[1].series }]" />
          <LineChart style="flex:1" :title="mockConfig['待考勤'].lines[0].title" :x-data="mockConfig['待考勤'].lines[0].x" :series-data="[{ name: mockConfig['待考勤'].lines[0].name, data: mockConfig['待考勤'].lines[0].series }]" :y-name="mockConfig['待考勤'].lines[0].yName" :smooth="true" />
        </div>
      </div>
    </template>

    <!-- 考核待审核 -->
    <template v-else-if="activeName === '考核待审核'">
      <div style="flex-direction: column; width: 100%;">
        <div style="flex: 1; display: flex; width: 100%;">
          <div class="box-left">
            <Indicator class="left-card" v-for="item in mockConfig['考核待审核'].cards" :key="item.title" v-bind="item" />
          </div>
          <Pie style="flex:1" :title-text="mockConfig['考核待审核'].pies[0].title" :data="mockConfig['考核待审核'].pies[0].data" />
          <Pie style="flex:1" :title-text="mockConfig['考核待审核'].pies[1].title" :data="mockConfig['考核待审核'].pies[1].data" />
          <Pie style="flex:1" :title-text="mockConfig['考核待审核'].pies[2].title" :data="mockConfig['考核待审核'].pies[2].data" />
        </div>
        <div style="flex: 1; display: flex; width: 100%;">
          <Bar style="flex:1" :title="mockConfig['考核待审核'].bars[0].title" :x-data="mockConfig['考核待审核'].bars[0].x" :series-data="[{ name: mockConfig['考核待审核'].bars[0].name, data: mockConfig['考核待审核'].bars[0].series }]" />
          <Bar style="flex:1" :title="mockConfig['考核待审核'].bars[1].title" :x-data="mockConfig['考核待审核'].bars[1].x" :series-data="[{ name: mockConfig['考核待审核'].bars[1].name, data: mockConfig['考核待审核'].bars[1].series }]" />
          <LineChart style="flex:1" :title="mockConfig['考核待审核'].lines[0].title" :x-data="mockConfig['考核待审核'].lines[0].x" :series-data="[{ name: mockConfig['考核待审核'].lines[0].name, data: mockConfig['考核待审核'].lines[0].series }]" :y-name="mockConfig['考核待审核'].lines[0].yName" :smooth="true" />
          <LineChart style="flex:1" :title="mockConfig['考核待审核'].lines[1].title" :x-data="mockConfig['考核待审核'].lines[1].x" :series-data="[{ name: mockConfig['考核待审核'].lines[1].name, data: mockConfig['考核待审核'].lines[1].series }]" :y-name="mockConfig['考核待审核'].lines[1].yName" :smooth="true" />
        </div>
      </div>
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div style="flex-direction: column; width: 100%;">
        <div style="flex: 1; display: flex; width: 100%;">
          <div class="box-left-m">
            <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
          </div>
          <Pie style="flex:1" :title-text="mockConfig['已完成'].pies[0].title" :data="mockConfig['已完成'].pies[0].data" />
          <Pie style="flex:1" :title-text="mockConfig['已完成'].pies[1].title" :data="mockConfig['已完成'].pies[1].data" />
          <Pie style="flex:1" :title-text="mockConfig['已完成'].pies[2].title" :data="mockConfig['已完成'].pies[2].data" />
        </div>
        <div style="flex: 1; display: flex; width: 100%;">
          <Bar style="flex:1" :title="mockConfig['已完成'].bars[0].title" :x-data="mockConfig['已完成'].bars[0].x" :series-data="[{ name: mockConfig['已完成'].bars[0].name, data: mockConfig['已完成'].bars[0].series }]" />
          <Bar style="flex:1" :title="mockConfig['已完成'].bars[1].title" :x-data="mockConfig['已完成'].bars[1].x" :series-data="[{ name: mockConfig['已完成'].bars[1].name, data: mockConfig['已完成'].bars[1].series }]" />
          <LineChart style="flex:1" :title="mockConfig['已完成'].lines[0].title" :x-data="mockConfig['已完成'].lines[0].x" :series-data="[{ name: mockConfig['已完成'].lines[0].name, data: mockConfig['已完成'].lines[0].series }]" :y-name="mockConfig['已完成'].lines[0].yName" :smooth="true" />
          <LineChart style="flex:1" :title="mockConfig['已完成'].lines[1].title" :x-data="mockConfig['已完成'].lines[1].x" :series-data="[{ name: mockConfig['已完成'].lines[1].name, data: mockConfig['已完成'].lines[1].series }]" :y-name="mockConfig['已完成'].lines[1].yName" :smooth="true" />
        </div>
      </div>
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
