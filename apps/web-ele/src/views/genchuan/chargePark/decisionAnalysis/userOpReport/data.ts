import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type ReportType =
  | '日报'
  | '周报'
  | '季报'
  | '半年报'
  | '年报'
  | '月报'
  | '自定义报表';

export type TimeScale = '周' | '季' | '半年' | '年' | '日' | '月' | '自定义';

export interface CoreIndex {
  avgCreditScore: number;
  totalMemberCount: number;
  totalUserCount: number;
  userGrowthRate: number;
}

export interface UserOpTrendItem {
  date: string;
  memberCount: number;
  userCount: number;
}

export interface UserTypeDistributionItem {
  count: number;
  type: string;
}

export interface UserOpReportRow {
  compareSummary: string;
  coreIndex: CoreIndex;
  createTime: string;
  creator: string;
  filterCondition: string;
  id: number;
  remark: string;
  reportType: ReportType;
  statTime: string;
  status: string;
  summary: string;
  timeScale: TimeScale;
  userOpTrend: UserOpTrendItem[];
  userTypeDistribution: UserTypeDistributionItem[];
}

export const reportTypeOptions: ReportType[] = [
  '日报',
  '周报',
  '月报',
  '季报',
  '半年报',
  '年报',
  '自定义报表',
];

export const timeScaleOptions: TimeScale[] = [
  '日',
  '周',
  '月',
  '季',
  '半年',
  '年',
  '自定义',
];

function buildTrend(
  labels: string[],
  baseUserCount: number,
  baseMemberCount: number,
) {
  return labels.map((item, index) => ({
    date: item,
    userCount: baseUserCount + index * 25,
    memberCount: baseMemberCount + index * 18,
  }));
}

function createReport(
  report: Omit<UserOpReportRow, 'status'> & {
    status?: string;
  },
): UserOpReportRow {
  return {
    ...report,
    status: report.status || '已生成',
  };
}

export function getMockReports(): UserOpReportRow[] {
  return [
    createReport({
      id: 6,
      reportType: '自定义报表',
      timeScale: '自定义',
      statTime: '2026-04-01 00:00:00 ~ 2026-04-20 23:59:59',
      createTime: '2026-04-20 09:30:00',
      filterCondition:
        '{"userType":"个人用户","statTime":"2026-04-01,2026-04-20"}',
      creator: 'admin',
      remark: '近 20 天个人用户运营报表',
      summary: '个人用户活跃度稳步提升，会员转化率持续增长。',
      compareSummary:
        '较上一个周期，用户总数增长 4.2%，会员规模增长 5.1%，信用分保持稳定。',
      coreIndex: {
        totalUserCount: 1280,
        totalMemberCount: 835,
        avgCreditScore: 93,
        userGrowthRate: 0.042,
      },
      userOpTrend: buildTrend(
        ['04-01', '04-05', '04-09', '04-13', '04-17', '04-20'],
        1180,
        740,
      ),
      userTypeDistribution: [
        { type: '个人用户', count: 1040 },
        { type: '小程序用户', count: 190 },
        { type: '平台用户', count: 50 },
      ],
    }),
    createReport({
      id: 5,
      reportType: '年报',
      timeScale: '年',
      statTime: '2026-01-01 00:00:00 ~ 2026-12-31 23:59:59',
      createTime: '2026-04-18 18:00:00',
      filterCondition: '',
      creator: 'system',
      remark: '年度用户运营总览',
      summary: '全年用户规模增长显著，会员与信用体系协同效果明显。',
      compareSummary:
        '同比去年用户增长 18%，会员增长 22%，平均信用分提升 3 分。',
      coreIndex: {
        totalUserCount: 1350,
        totalMemberCount: 860,
        avgCreditScore: 92,
        userGrowthRate: 0.18,
      },
      userOpTrend: buildTrend(
        ['01月', '03月', '05月', '07月', '09月', '11月'],
        980,
        610,
      ),
      userTypeDistribution: [
        { type: '个人用户', count: 1050 },
        { type: '小程序用户', count: 230 },
        { type: '平台用户', count: 70 },
      ],
    }),
    createReport({
      id: 4,
      reportType: '月报',
      timeScale: '月',
      statTime: '2026-03-01 00:00:00 ~ 2026-03-31 23:59:59',
      createTime: '2026-04-01 08:00:00',
      filterCondition: '',
      creator: 'system',
      remark: '月度用户运营报表',
      summary: '月报显示新用户增长主要来自停车场景和小程序渠道。',
      compareSummary: '环比 2 月，新用户增长 3.7%，会员增长 4.5%。',
      coreIndex: {
        totalUserCount: 1250,
        totalMemberCount: 800,
        avgCreditScore: 92,
        userGrowthRate: 0.037,
      },
      userOpTrend: buildTrend(
        ['03-01', '03-06', '03-11', '03-16', '03-21', '03-26'],
        1120,
        710,
      ),
      userTypeDistribution: [
        { type: '个人用户', count: 980 },
        { type: '小程序用户', count: 210 },
        { type: '平台用户', count: 60 },
      ],
    }),
    createReport({
      id: 3,
      reportType: '周报',
      timeScale: '周',
      statTime: '2026-04-07 00:00:00 ~ 2026-04-13 23:59:59',
      createTime: '2026-04-14 08:00:00',
      filterCondition: '',
      creator: 'system',
      remark: '周度用户运营报表',
      summary: '本周用户转化主要集中在商户联动活动和停车优惠场景。',
      compareSummary: '较上周新增用户增长 1.8%，信用分保持平稳。',
      coreIndex: {
        totalUserCount: 1230,
        totalMemberCount: 785,
        avgCreditScore: 91,
        userGrowthRate: 0.018,
      },
      userOpTrend: buildTrend(
        ['04-07', '04-08', '04-09', '04-10', '04-11', '04-12', '04-13'],
        1180,
        752,
      ),
      userTypeDistribution: [
        { type: '个人用户', count: 960 },
        { type: '小程序用户', count: 210 },
        { type: '平台用户', count: 60 },
      ],
    }),
    createReport({
      id: 2,
      reportType: '季报',
      timeScale: '季',
      statTime: '2026-01-01 00:00:00 ~ 2026-03-31 23:59:59',
      createTime: '2026-04-02 10:20:00',
      filterCondition: '',
      creator: 'system',
      remark: '季度运营复盘报表',
      summary: '季度复盘显示停车业务带动会员活跃和信用体系正向增长。',
      compareSummary: '同比上季度新增用户增长 6.4%，会员增长 7.8%。',
      coreIndex: {
        totalUserCount: 1260,
        totalMemberCount: 810,
        avgCreditScore: 92,
        userGrowthRate: 0.064,
      },
      userOpTrend: buildTrend(
        ['1月', '1月下', '2月', '2月下', '3月', '3月下'],
        1080,
        690,
      ),
      userTypeDistribution: [
        { type: '个人用户', count: 990 },
        { type: '小程序用户', count: 210 },
        { type: '平台用户', count: 60 },
      ],
    }),
    createReport({
      id: 1,
      reportType: '日报',
      timeScale: '日',
      statTime: '2026-04-19 00:00:00 ~ 2026-04-19 23:59:59',
      createTime: '2026-04-20 07:40:00',
      filterCondition: '',
      creator: 'system',
      remark: '上一日运营日报',
      summary: '日报显示昨日停车高峰时段新增用户主要来自小程序渠道。',
      compareSummary: '较前一日新增用户增长 1.2%，会员增长 0.8%。',
      coreIndex: {
        totalUserCount: 1220,
        totalMemberCount: 778,
        avgCreditScore: 91,
        userGrowthRate: 0.012,
      },
      userOpTrend: buildTrend(
        ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        1120,
        705,
      ),
      userTypeDistribution: [
        { type: '个人用户', count: 950 },
        { type: '小程序用户', count: 210 },
        { type: '平台用户', count: 60 },
      ],
    }),
  ];
}

export function buildDetailStatsData(row?: UserOpReportRow | null) {
  if (!row) {
    return {
      cards: [],
      charts: [],
    };
  }

  return {
    cards: [
      {
        title: '用户总数',
        value: row.coreIndex.totalUserCount,
        desc: '核心指标',
        color: '#2F80ED',
      },
      {
        title: '会员总数',
        value: row.coreIndex.totalMemberCount,
        desc: '会员转化规模',
        color: '#27AE60',
      },
      {
        title: '平均信用分',
        value: row.coreIndex.avgCreditScore,
        desc: '用户信用表现',
        color: '#F2994A',
      },
      {
        title: '用户增长率',
        value: `${(row.coreIndex.userGrowthRate * 100).toFixed(1)}%`,
        desc: '同比/环比指标',
        color: '#9B51E0',
      },
    ],
    charts: [
      {
        title: '用户运营趋势',
        type: 'line',
        xAxis: row.userOpTrend.map((item) => item.date),
        series: row.userOpTrend.map((item) => item.userCount),
      },
      {
        title: '用户类型分布',
        type: 'bar',
        xAxis: row.userTypeDistribution.map((item) => item.type),
        series: row.userTypeDistribution.map((item) => item.count),
      },
    ],
  };
}

export function buildLatestStatsData(rows: UserOpReportRow[]) {
  if (!rows.length) {
    return buildDetailStatsData(null);
  }

  const latest = [...rows].sort(
    (a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf(),
  )[0];

  return buildDetailStatsData(latest);
}

export function buildExportRows(rows: UserOpReportRow[]) {
  return rows.map((item) => ({
    报表类型: item.reportType,
    时间尺度: item.timeScale,
    统计时间: item.statTime,
    生成时间: item.createTime,
    数据范围: item.filterCondition || '-',
    报表状态: item.status,
    创建人: item.creator,
    备注: item.remark,
  }));
}

export function buildDetailExportRows(rows: UserOpReportRow[]) {
  return rows.map((item) => ({
    报表类型: item.reportType,
    时间尺度: item.timeScale,
    统计时间: item.statTime,
    生成时间: item.createTime,
    数据范围: item.filterCondition || '-',
    用户总数: item.coreIndex.totalUserCount,
    会员总数: item.coreIndex.totalMemberCount,
    平均信用分: item.coreIndex.avgCreditScore,
    用户增长率: `${(item.coreIndex.userGrowthRate * 100).toFixed(1)}%`,
    用户运营趋势: item.userOpTrend
      .map(
        (trend) =>
          `${trend.date} 用户 ${trend.userCount} / 会员 ${trend.memberCount}`,
      )
      .join('；'),
    用户类型分布: item.userTypeDistribution
      .map((distribution) => `${distribution.type} ${distribution.count}`)
      .join('；'),
    分析摘要: item.summary,
    同比环比分析: item.compareSummary,
  }));
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'reportType',
      label: '报表类型',
      component: 'Select',
      componentProps: {
        options: reportTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择报表类型',
      },
    },
    {
      fieldName: 'timeScale',
      label: '时间尺度',
      component: 'Select',
      componentProps: {
        options: timeScaleOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择时间尺度',
      },
    },
    {
      fieldName: 'statTime',
      label: '统计时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions<UserOpReportRow>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportType',
      title: '报表类型',
      minWidth: 120,
      slots: { default: 'reportType' },
    },
    {
      field: 'timeScale',
      title: '时间尺度',
      minWidth: 100,
    },
    {
      field: 'statTime',
      title: '统计时间',
      minWidth: 220,
    },
    {
      field: 'createTime',
      title: '生成时间',
      minWidth: 170,
    },
    {
      field: 'filterCondition',
      title: '数据范围',
      minWidth: 240,
      slots: { default: 'filterCondition' },
    },
    {
      field: 'status',
      title: '报表状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
