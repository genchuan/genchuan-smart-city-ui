import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  UserOpReportChartVO,
  UserOpReportDetailVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

const QUERY_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export type ReportType =
  | '半年报'
  | '周报'
  | '季报'
  | '年报'
  | '日报'
  | '月报'
  | '自定义报表';

export type TimeScale = '半年' | '周' | '季' | '年' | '日' | '月' | '自定义';

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

export interface ReportDistributionItem {
  count: number;
  type: string;
}

export interface UserOpReportChartOption {
  data:
    | Array<{
        name: string;
        type?: number | string;
        value: number;
      }>
    | {
        fullDates: string[];
        series: number[];
        xAxis: string[];
      };
  label: string;
  value: string;
}

type DistributionChartOption = UserOpReportChartOption & {
  data: Array<{ name: string; type?: number | string; value: number }>;
};

type LineChartOption = UserOpReportChartOption & {
  data: {
    fullDates: string[];
    series: number[];
    xAxis: string[];
  };
};

export interface UserOpReportStatsCard {
  color?: string;
  desc?: string;
  title: string;
  type: string;
  value: number | string;
}

export interface UserOpReportStatsData {
  barData: Array<{ name: string; type?: number | string; value: number }>;
  cards: UserOpReportStatsCard[];
  lineData: Array<{ date: string; fullDate: string; value: number }>;
  pieData: Array<{ name: string; type?: number | string; value: number }>;
}

export interface UserOpReportTopStatsData extends UserOpReportStatsData {
  barChartOptions: UserOpReportChartOption[];
  lineChartOptions: UserOpReportChartOption[];
  pieChartOptions: UserOpReportChartOption[];
}

export interface UserOpReportRow {
  avgCreditScore: number;
  bindCarCount: number;
  compareSummary: string;
  coreIndex: CoreIndex;
  createTime: string;
  creator: string;
  exportCount: number;
  filterCondition: string;
  id: number;
  linkMerchantCount: number;
  newGroupCount: number;
  newMemberCount: number;
  newMerchantCount: number;
  newUserCount: number;
  plateAuthCount: number;
  rechargeAmount: number;
  remark: string;
  reportType: ReportType;
  sendCouponCount: number;
  statTime: string;
  status: string;
  summary: string;
  timeScale: TimeScale;
  carTypeDistribution: ReportDistributionItem[];
  creditLevelDistribution: ReportDistributionItem[];
  groupTypeDistribution: ReportDistributionItem[];
  memberLevelDistribution: ReportDistributionItem[];
  merchantTypeDistribution: ReportDistributionItem[];
  plateAuthTrend: Array<{ date: string; value: number }>;
  rechargeAmountTrend: Array<{ date: string; value: number }>;
  sendCouponTrend: Array<{ date: string; value: number }>;
  userGrowthTrend: Array<{ date: string; value: number }>;
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

const reportCycleTimeScaleMap: Record<string, TimeScale> = {
  半年报: '半年',
  季报: '季',
  年报: '年',
  日报: '日',
  月报: '月',
  周报: '周',
  自定义报表: '自定义',
};

const freshColors = [
  '#4A90E2',
  '#50E3C2',
  '#FF9F40',
  '#A17FE0',
  '#FF6B8B',
  '#FFD93D',
  '#2F80ED',
  '#27AE60',
  '#F2994A',
  '#9B51E0',
];

/** 格式化接口时间 */
export function formatApiTime(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const timeValue = String(value);
  if (/^\d+$/.test(timeValue)) {
    const timestamp =
      timeValue.length === 10 ? Number(timeValue) * 1000 : Number(timeValue);

    return dayjs(timestamp).isValid()
      ? dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
      : '-';
  }

  const normalizedTimeValue = timeValue.includes('T')
    ? timeValue
    : timeValue.replaceAll('-', '/');
  const parsedTime = dayjs(normalizedTimeValue);

  return parsedTime.isValid() ? parsedTime.format('YYYY-MM-DD HH:mm:ss') : '-';
}

export function formatAmount(value?: null | number | string) {
  const amount = Number(value ?? 0);
  return `¥${amount.toLocaleString('zh-CN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function formatChartDate(value?: null | string) {
  if (!value) {
    return '-';
  }

  const date = dayjs(value);
  return date.isValid() ? `${date.month() + 1}/${date.date()}` : value;
}

function normalizeDistributionRecord(
  record?: null | Record<string, number>,
): Array<{ name: string; value: number }> {
  if (!record) {
    return [];
  }

  return Object.entries(record).map(([name, value]) => ({
    name,
    value: Number(value ?? 0),
  }));
}

function normalizeChartDistribution(
  list?:
    | Array<{ count?: number; name?: string; type?: string; value?: number }>
    | null
    | Record<string, number>,
) {
  return normalizeDistributionItems(list).map((item) => ({
    name: item.type,
    value: item.count,
  }));
}

function normalizeDistributionItems(
  list?:
    | Array<{ count?: number; name?: string; type?: string; value?: number }>
    | null
    | Record<string, number>,
): ReportDistributionItem[] {
  const sourceList = Array.isArray(list)
    ? list
    : normalizeDistributionRecord(list);

  return sourceList.map((item) => ({
    count: Number(item.count ?? item.value ?? 0),
    type: item.type || item.name || '-',
  }));
}

function normalizeTrendItems(
  list?: Array<{ amount?: number; count?: number; date?: string }> | null,
  valueKey: 'amount' | 'count' = 'count',
) {
  return (Array.isArray(list) ? list : []).map((item) => ({
    date: item.date || '-',
    value: Number(item[valueKey] ?? 0),
  }));
}

/** 构建核心指标 */
function buildCoreIndex(
  data?: null | Partial<UserOpReportChartVO['coreIndex']>,
  cardData?: null | UserOpReportChartVO['cardData'],
) {
  return {
    avgCreditScore: Number(
      data?.avgCreditScore ?? cardData?.avgCreditScore ?? 0,
    ),
    totalMemberCount: Number(
      data?.totalMemberCount ?? cardData?.newMemberCount ?? 0,
    ),
    totalUserCount: Number(data?.totalUserCount ?? cardData?.newUserCount ?? 0),
    userGrowthRate: Number(
      data?.userGrowthRate ??
        (cardData?.newUserCount && cardData.newMemberCount
          ? cardData.newUserCount / cardData.newMemberCount
          : 0),
    ),
  };
}

function buildCardData(data?: null | Partial<UserOpReportChartVO['cardData']>) {
  return {
    avgCreditScore: Number(data?.avgCreditScore ?? 0),
    bindCarCount: Number(data?.bindCarCount ?? 0),
    linkMerchantCount: Number(data?.linkMerchantCount ?? 0),
    newGroupCount: Number(data?.newGroupCount ?? 0),
    newMemberCount: Number(data?.newMemberCount ?? 0),
    newMerchantCount: Number(data?.newMerchantCount ?? 0),
    newUserCount: Number(data?.newUserCount ?? 0),
    plateAuthCount: Number(data?.plateAuthCount ?? 0),
    rechargeAmount: Number(data?.rechargeAmount ?? 0),
    sendCouponCount: Number(data?.sendCouponCount ?? 0),
  };
}

function buildSeriesOption(
  label: string,
  value: string,
  list?: Array<{ amount?: number; count?: number; date?: string }>,
  valueKey: 'amount' | 'count' = 'count',
): LineChartOption {
  const sourceList = Array.isArray(list) ? list : [];

  return {
    label,
    value,
    data: {
      fullDates: sourceList.map((item) => item.date || ''),
      series: sourceList.map((item) => Number(item[valueKey] ?? 0)),
      xAxis: sourceList.map((item) => formatChartDate(item.date)),
    },
  };
}

function buildDistributionOption(
  label: string,
  value: string,
  list?: Array<{ name?: string; type?: string; value?: number }>,
): DistributionChartOption {
  return {
    label,
    value,
    data: (Array.isArray(list) ? list : []).map((item) => ({
      name: item.name || item.type || '-',
      type: item.type || item.name,
      value: Number(item.value ?? 0),
    })),
  };
}

function buildTopStatsCards(
  cardData?: null | Partial<UserOpReportChartVO['cardData']>,
): UserOpReportStatsCard[] {
  const data = buildCardData(cardData);
  const cards = [
    {
      title: '新增用户数',
      value: data.newUserCount,
      desc: '本周期新增用户',
      type: 'newUserCount',
    },
    {
      title: '绑定车辆数',
      value: data.bindCarCount,
      desc: '本周期绑定车辆',
      type: 'bindCarCount',
    },
    {
      title: '车牌认证量',
      value: data.plateAuthCount,
      desc: '认证通过量',
      type: 'plateAuthCount',
    },
    {
      title: '新增商户数',
      value: data.newMerchantCount,
      desc: '本周期新增商户',
      type: 'newMerchantCount',
    },
    {
      title: '对接商户数',
      value: data.linkMerchantCount,
      desc: '完成对接商户',
      type: 'linkMerchantCount',
    },
    {
      title: '充值金额',
      value: formatAmount(data.rechargeAmount),
      desc: '商户充值金额',
      type: 'rechargeAmount',
    },
    {
      title: '发券量',
      value: data.sendCouponCount,
      desc: '商户发券数量',
      type: 'sendCouponCount',
    },
    {
      title: '新增集团数',
      value: data.newGroupCount,
      desc: '本周期新增集团',
      type: 'newGroupCount',
    },
    {
      title: '会员新增数',
      value: data.newMemberCount,
      desc: '新增会员用户',
      type: 'newMemberCount',
    },
    {
      title: '平均信用分',
      value: data.avgCreditScore,
      desc: '用户信用表现',
      type: 'avgCreditScore',
    },
  ];

  return cards.map((item, index) => ({
    ...item,
    color: freshColors[index % freshColors.length],
  }));
}

/** 构建趋势数据 */
function buildUserOpTrend(
  list?: null | UserOpReportChartVO['userOpTrend'],
  lineData?: null | UserOpReportChartVO['lineData'],
): UserOpTrendItem[] {
  const sourceList = Array.isArray(list)
    ? list
    : (lineData?.userGrowth || []).map((item) => ({
        date: item.date,
        memberCount: 0,
        userCount: item.count,
      }));

  return sourceList.map((item) => ({
    date: item.date || '-',
    memberCount: Number(item.memberCount ?? 0),
    userCount: Number(item.userCount ?? 0),
  }));
}

/** 构建用户类型分布 */
function buildUserTypeDistribution(
  list?: null | UserOpReportChartVO['userTypeDistribution'],
  barData?: null | UserOpReportChartVO['barData'],
): UserTypeDistributionItem[] {
  const sourceList = Array.isArray(list)
    ? list
    : (barData?.userType || []).map((item) => ({
        count: item.value,
        type: item.name,
      }));

  return sourceList.map((item) => ({
    count: Number(item.count ?? 0),
    type: item.type || '-',
  }));
}

/** 构建报表行数据 */
export function buildUserOpReportRowFromApi(
  data?: null | Partial<UserOpReportDetailVO>,
  fallback?: null | Partial<UserOpReportRow>,
  chartData?: null | Partial<UserOpReportChartVO>,
): UserOpReportRow {
  const normalizedChartData = {
    ...chartData,
    barData: chartData?.barData ||
      data?.barData || {
        carType: normalizeChartDistribution(data?.carTypeDistribution),
        groupType: normalizeChartDistribution(data?.groupTypeDistribution),
        merchantType: normalizeChartDistribution(
          data?.merchantTypeDistribution,
        ),
        userType: normalizeChartDistribution(
          data?.userTypeDistribution as
            | Array<{
                count?: number;
                name?: string;
                type?: string;
                value?: number;
              }>
            | Record<string, number>,
        ),
      },
    cardData: chartData?.cardData || {
      avgCreditScore: data?.avgCreditScore,
      bindCarCount: data?.bindCarCount,
      linkMerchantCount: data?.linkMerchantCount,
      newGroupCount: data?.newGroupCount,
      newMemberCount: data?.newMemberCount,
      newMerchantCount: data?.newMerchantCount,
      newUserCount: data?.newUserCount,
      plateAuthCount: data?.plateAuthCount,
      rechargeAmount: data?.rechargeAmount,
      sendCouponCount: data?.sendCouponCount,
    },
    coreIndex: chartData?.coreIndex || data?.coreIndex,
    lineData: chartData?.lineData ||
      data?.lineData || {
        plateAuth: data?.plateAuthTrend,
        rechargeAmount: data?.rechargeAmountTrend,
        sendCoupon: data?.sendCouponTrend,
        userGrowth: data?.userGrowthTrend,
      },
    pieData: chartData?.pieData ||
      data?.pieData || {
        creditLevel: normalizeChartDistribution(data?.creditLevelDistribution),
        memberLevel: normalizeChartDistribution(data?.memberLevelDistribution),
      },
    userOpTrend:
      chartData?.userOpTrend ||
      data?.userOpTrend ||
      data?.userGrowthTrend?.map((item) => ({
        date: item.date,
        memberCount: 0,
        userCount: item.count,
      })),
    userTypeDistribution:
      chartData?.userTypeDistribution ||
      (data?.userTypeDistribution
        ? normalizeDistributionItems(
            data.userTypeDistribution as
              | Array<{
                  count?: number;
                  name?: string;
                  type?: string;
                  value?: number;
                }>
              | Record<string, number>,
          )
        : undefined),
  };
  const cardData = buildCardData(normalizedChartData.cardData);

  return {
    ...cardData,
    compareSummary:
      data?.compareSummary || fallback?.compareSummary || '暂无同比环比分析',
    coreIndex:
      normalizedChartData.coreIndex || normalizedChartData.cardData
        ? buildCoreIndex(
            normalizedChartData.coreIndex,
            normalizedChartData.cardData,
          )
        : fallback?.coreIndex || buildCoreIndex(),
    createTime: formatApiTime(data?.createTime ?? fallback?.createTime),
    creator: data?.creator || fallback?.creator || '-',
    exportCount: Number(data?.exportCount ?? fallback?.exportCount ?? 0),
    filterCondition: data?.filterCondition || fallback?.filterCondition || '',
    id: Number(data?.id ?? fallback?.id ?? 0),
    remark: data?.remark || fallback?.remark || '',
    reportType: (data?.reportCycle ||
      data?.reportType ||
      fallback?.reportType ||
      '日报') as ReportType,
    statTime:
      data?.statTime ||
      (data?.statStartTime && data?.statEndTime
        ? `${formatApiTime(data.statStartTime)} - ${formatApiTime(data.statEndTime)}`
        : fallback?.statTime || '-'),
    status: data?.reportStatus || data?.status || fallback?.status || '-',
    summary: data?.summary || fallback?.summary || '暂无分析摘要',
    timeScale: (data?.timeScale ||
      reportCycleTimeScaleMap[
        data?.reportCycle || data?.reportType || fallback?.reportType || ''
      ] ||
      fallback?.timeScale ||
      '日') as TimeScale,
    carTypeDistribution:
      normalizedChartData.barData?.carType || data?.carTypeDistribution
        ? normalizeDistributionItems(
            normalizedChartData.barData?.carType || data?.carTypeDistribution,
          )
        : fallback?.carTypeDistribution || [],
    creditLevelDistribution:
      normalizedChartData.pieData?.creditLevel || data?.creditLevelDistribution
        ? normalizeDistributionItems(
            normalizedChartData.pieData?.creditLevel ||
              data?.creditLevelDistribution,
          )
        : fallback?.creditLevelDistribution || [],
    groupTypeDistribution:
      normalizedChartData.barData?.groupType || data?.groupTypeDistribution
        ? normalizeDistributionItems(
            normalizedChartData.barData?.groupType ||
              data?.groupTypeDistribution,
          )
        : fallback?.groupTypeDistribution || [],
    memberLevelDistribution:
      normalizedChartData.pieData?.memberLevel || data?.memberLevelDistribution
        ? normalizeDistributionItems(
            normalizedChartData.pieData?.memberLevel ||
              data?.memberLevelDistribution,
          )
        : fallback?.memberLevelDistribution || [],
    merchantTypeDistribution:
      normalizedChartData.barData?.merchantType ||
      data?.merchantTypeDistribution
        ? normalizeDistributionItems(
            normalizedChartData.barData?.merchantType ||
              data?.merchantTypeDistribution,
          )
        : fallback?.merchantTypeDistribution || [],
    plateAuthTrend:
      normalizedChartData.lineData?.plateAuth || data?.plateAuthTrend
        ? normalizeTrendItems(
            normalizedChartData.lineData?.plateAuth || data?.plateAuthTrend,
          )
        : fallback?.plateAuthTrend || [],
    rechargeAmountTrend:
      normalizedChartData.lineData?.rechargeAmount || data?.rechargeAmountTrend
        ? normalizeTrendItems(
            normalizedChartData.lineData?.rechargeAmount ||
              data?.rechargeAmountTrend,
            'amount',
          )
        : fallback?.rechargeAmountTrend || [],
    sendCouponTrend:
      normalizedChartData.lineData?.sendCoupon || data?.sendCouponTrend
        ? normalizeTrendItems(
            normalizedChartData.lineData?.sendCoupon || data?.sendCouponTrend,
          )
        : fallback?.sendCouponTrend || [],
    userGrowthTrend:
      normalizedChartData.lineData?.userGrowth || data?.userGrowthTrend
        ? normalizeTrendItems(
            normalizedChartData.lineData?.userGrowth || data?.userGrowthTrend,
          )
        : fallback?.userGrowthTrend || [],
    userOpTrend:
      normalizedChartData.userOpTrend || normalizedChartData.lineData
        ? buildUserOpTrend(
            normalizedChartData.userOpTrend,
            normalizedChartData.lineData,
          )
        : fallback?.userOpTrend || [],
    userTypeDistribution:
      normalizedChartData.userTypeDistribution || normalizedChartData.barData
        ? buildUserTypeDistribution(
            normalizedChartData.userTypeDistribution,
            normalizedChartData.barData,
          )
        : fallback?.userTypeDistribution || [],
  };
}

/** 构建详情统计图表 */
export function buildDetailStatsData(row?: null | UserOpReportRow) {
  if (!row) {
    return {
      cards: [],
      charts: [],
    };
  }

  const rowCardData = {
    avgCreditScore: row.avgCreditScore,
    bindCarCount: row.bindCarCount,
    linkMerchantCount: row.linkMerchantCount,
    newGroupCount: row.newGroupCount,
    newMemberCount: row.newMemberCount,
    newMerchantCount: row.newMerchantCount,
    newUserCount: row.newUserCount,
    plateAuthCount: row.plateAuthCount,
    rechargeAmount: row.rechargeAmount,
    sendCouponCount: row.sendCouponCount,
  };

  return {
    cards: buildTopStatsCards(rowCardData),
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

/** 构建顶部统计图表 */
export function buildTopStatsDataFromApi(
  data?: Partial<UserOpReportChartVO>,
): UserOpReportTopStatsData {
  const pieChartOptions = [
    buildDistributionOption(
      '信用等级分布',
      'creditLevel',
      data?.pieData?.creditLevel,
    ),
    buildDistributionOption(
      '会员等级分布',
      'memberLevel',
      data?.pieData?.memberLevel,
    ),
  ].filter((item) => Array.isArray(item.data) && item.data.length > 0);

  const barChartOptions = [
    buildDistributionOption(
      '用户类型分布',
      'userType',
      data?.barData?.userType,
    ),
    buildDistributionOption('车辆类型分布', 'carType', data?.barData?.carType),
    buildDistributionOption(
      '商户类型分布',
      'merchantType',
      data?.barData?.merchantType,
    ),
    buildDistributionOption(
      '集团类型分布',
      'groupType',
      data?.barData?.groupType,
    ),
  ].filter((item) => Array.isArray(item.data) && item.data.length > 0);

  const lineChartOptions = [
    buildSeriesOption('用户增长趋势', 'userGrowth', data?.lineData?.userGrowth),
    buildSeriesOption('车牌认证量趋势', 'plateAuth', data?.lineData?.plateAuth),
    buildSeriesOption(
      '充值金额趋势',
      'rechargeAmountTrend',
      data?.lineData?.rechargeAmount,
      'amount',
    ),
    buildSeriesOption('发券量趋势', 'sendCoupon', data?.lineData?.sendCoupon),
  ].filter((item) => item.data.xAxis.length > 0);

  const lineDataSource = lineChartOptions[0]?.data;

  return {
    barChartOptions,
    barData: barChartOptions[0]?.data || [],
    cards: buildTopStatsCards(data?.cardData),
    lineChartOptions,
    lineData: lineDataSource
      ? lineDataSource.xAxis.map((date, index) => ({
          date,
          fullDate: lineDataSource.fullDates[index] || date,
          value: lineDataSource.series[index] || 0,
        }))
      : [],
    pieChartOptions,
    pieData: pieChartOptions[0]?.data || [],
  };
}

/** 构建查询参数 */
export function buildUserOpReportQueryParams(formValues: Record<string, any>) {
  let statStartTimeRange: string[] | undefined;

  if (
    Array.isArray(formValues.statStartTime) &&
    formValues.statStartTime.length === 2
  ) {
    statStartTimeRange = [
      dayjs(formValues.statStartTime[0]).format(QUERY_TIME_FORMAT),
      dayjs(formValues.statStartTime[1]).format(QUERY_TIME_FORMAT),
    ];
  } else if (
    Array.isArray(formValues.statTime) &&
    formValues.statTime.length === 2
  ) {
    statStartTimeRange = [
      dayjs(formValues.statTime[0]).format(QUERY_TIME_FORMAT),
      dayjs(formValues.statTime[1]).format(QUERY_TIME_FORMAT),
    ];
  }

  return {
    reportCycle: formValues.reportType || formValues.reportCycle || undefined,
    reportStatus: formValues.status || formValues.reportStatus || undefined,
    statEndTime: statStartTimeRange?.[1],
    statStartTime: statStartTimeRange?.[0],
    tenantId: 1,
    timeScale: formValues.timeScale || undefined,
  };
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'reportCycle',
      label: '报表周期',
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
      fieldName: 'reportStatus',
      label: '生成状态',
      component: 'Select',
      componentProps: {
        options: ['已生成', '生成中', '生成失败'].map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择生成状态',
      },
    },
    {
      fieldName: 'statStartTime',
      label: '统计时段',
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
      title: '报表周期',
      minWidth: 120,
      slots: { default: 'reportType' },
    },
    {
      field: 'newUserCount',
      title: '新增用户数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'newUserCount' },
    },
    {
      field: 'bindCarCount',
      title: '绑定车辆数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'bindCarCount' },
    },
    {
      field: 'plateAuthCount',
      title: '车牌认证量',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plateAuthCount' },
    },
    {
      field: 'newMerchantCount',
      title: '新增商户数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'newMerchantCount' },
    },
    {
      field: 'linkMerchantCount',
      title: '对接商户数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'linkMerchantCount' },
    },
    {
      field: 'rechargeAmount',
      title: '充值金额',
      minWidth: 120,
      sortable: true,
      slots: { default: 'rechargeAmount' },
    },
    {
      field: 'sendCouponCount',
      title: '发券量',
      minWidth: 100,
      sortable: true,
      slots: { default: 'sendCouponCount' },
    },
    {
      field: 'newGroupCount',
      title: '新增集团数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'newGroupCount' },
    },
    {
      field: 'newMemberCount',
      title: '会员新增数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'newMemberCount' },
    },
    {
      field: 'avgCreditScore',
      title: '平均信用分',
      minWidth: 120,
      sortable: true,
      slots: { default: 'avgCreditScore' },
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
      title: '筛选条件',
      minWidth: 240,
      slots: { default: 'filterCondition' },
    },
    {
      field: 'status',
      title: '生成状态',
      minWidth: 120,
      slots: { default: 'status' },
    },
    {
      field: 'creator',
      title: '操作人',
      minWidth: 100,
    },
    {
      field: 'exportCount',
      title: '导出次数',
      minWidth: 100,
      sortable: true,
    },
    {
      title: '操作',
      width: 90,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'reportType', label: '报表周期' },
  { key: 'statTime', label: '统计时段' },
  { key: 'status', label: '生成状态', type: 'tag', tagType: getStatusTagType },
  { key: 'createTime', label: '生成时间' },
  { key: 'creator', label: '操作人' },
  { key: 'exportCount', label: '导出次数' },
  { key: 'newUserCount', label: '新增用户数' },
  { key: 'bindCarCount', label: '绑定车辆数' },
  { key: 'plateAuthCount', label: '车牌认证量' },
  { key: 'newMerchantCount', label: '新增商户数' },
  { key: 'linkMerchantCount', label: '对接商户数' },
  { key: 'rechargeAmount', label: '充值金额', formatter: formatAmount },
  { key: 'sendCouponCount', label: '发券量' },
  { key: 'newGroupCount', label: '新增集团数' },
  { key: 'newMemberCount', label: '会员新增数' },
  { key: 'avgCreditScore', label: '平均信用分' },
  {
    key: 'userTypeDistribution',
    label: '用户类型分布',
    formatter: formatDistributionList,
  },
  {
    key: 'carTypeDistribution',
    label: '车辆类型分布',
    formatter: formatDistributionList,
  },
  {
    key: 'merchantTypeDistribution',
    label: '商户类型分布',
    formatter: formatDistributionList,
  },
  {
    key: 'groupTypeDistribution',
    label: '集团类型分布',
    formatter: formatDistributionList,
  },
  {
    key: 'creditLevelDistribution',
    label: '信用等级分布',
    formatter: formatDistributionList,
  },
  {
    key: 'memberLevelDistribution',
    label: '会员等级分布',
    formatter: formatDistributionList,
  },
  {
    key: 'userGrowthTrend',
    label: '用户增长趋势',
    formatter: formatTrendList,
  },
  {
    key: 'plateAuthTrend',
    label: '车牌认证量趋势',
    formatter: formatTrendList,
  },
  {
    key: 'rechargeAmountTrend',
    label: '充值金额趋势',
    formatter: (list: Array<{ date: string; value: number }>) =>
      formatTrendList(list, true),
  },
  {
    key: 'sendCouponTrend',
    label: '发券量趋势',
    formatter: formatTrendList,
  },
  { key: 'filterCondition', label: '筛选条件' },
  { key: 'summary', label: '分析摘要' },
  { key: 'compareSummary', label: '同比环比分析' },
  { key: 'remark', label: '备注' },
];

function formatDistributionList(
  list?: Array<{ count?: number; type?: string }>,
) {
  if (!Array.isArray(list) || list.length === 0) {
    return '-';
  }

  return list
    .map((item) => `${item.type || '-'}：${item.count || 0}`)
    .join('；');
}

function formatTrendList(
  list?: Array<{ date?: string; value?: number }>,
  isAmount = false,
) {
  if (!Array.isArray(list) || list.length === 0) {
    return '-';
  }

  return list
    .slice(0, 8)
    .map((item) => {
      const value = isAmount ? formatAmount(item.value) : item.value || 0;
      return `${item.date || '-'}：${value}`;
    })
    .join('；');
}

export function getReportCycleTagType(cycle: string) {
  const cycleTypeMap: Record<string, string> = {
    半年报: 'danger',
    季报: 'warning',
    年报: 'danger',
    日报: 'info',
    月报: 'primary',
    周报: 'success',
    自定义报表: 'info',
  };

  return cycleTypeMap[cycle] || 'info';
}

export function getStatusTagType(status: string) {
  const statusMap: Record<string, string> = {
    已生成: 'success',
    生成失败: 'danger',
    生成中: 'warning',
  };

  return statusMap[status] || 'info';
}
