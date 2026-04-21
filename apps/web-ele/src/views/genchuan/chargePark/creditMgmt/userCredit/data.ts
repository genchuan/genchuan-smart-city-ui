import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getRangePickerDefaultProps } from '#/utils';

export type CreditLevel = '中等' | '优秀' | '良好' | '极差' | '较差';
export type CreditStatus = '低信用' | '正常信用';

export interface AuditLog {
  content: string;
  operator: string;
  remark?: string;
  time: string;
}

export interface CreditChangeRecord {
  afterScore: number;
  beforeScore: number;
  changeReason: string;
  changeTime: string;
  operator: string;
}

export interface UserCreditRow {
  auditLogs?: AuditLog[];
  auditSummary: string;
  changeRecords: CreditChangeRecord[];
  createTime: string;
  creator: string;
  creditLevel: CreditLevel;
  creditScore: number;
  creditStatus: CreditStatus;
  id: number;
  phone: string;
  remark: string;
  ruleCode: string;
  ruleDesc: string;
  updateTime: string;
  updater: string;
  userId: number;
  userName: string;
  userType: string;
}

export const creditLevelOptions: CreditLevel[] = [
  '优秀',
  '良好',
  '中等',
  '较差',
  '极差',
];

export const textObj = {
  excelAllName: '用户信用列表.xlsx',
  excelName: '用户信用',
};

function getCreditStatus(score: number): CreditStatus {
  return score < 70 ? '低信用' : '正常信用';
}

export function maskPhone(phone: string) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function buildAuditLogs(row: UserCreditRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建信用记录',
      operator: row.creator,
      time: row.createTime,
    },
  ];

  if (row.updateTime !== row.createTime) {
    logs.push({
      content: row.auditSummary || '更新信用记录',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
}

function buildCreditRow(
  row: Omit<UserCreditRow, 'creditStatus'>,
): UserCreditRow {
  return {
    ...row,
    creditStatus: getCreditStatus(row.creditScore),
  };
}

export function getMockCredits(): UserCreditRow[] {
  return [
    buildCreditRow({
      id: 1,
      userId: 101,
      userName: '张三',
      phone: '13812345678',
      userType: '个人用户',
      creditScore: 96,
      creditLevel: '优秀',
      updateTime: '2026-04-18 09:20:00',
      ruleCode: 'DEFAULT_RULE',
      ruleDesc: '按时缴费加 2 分，违停扣 10 分',
      creator: 'admin',
      createTime: '2026-01-12 09:20:00',
      updater: '李主管',
      remark: '信用记录稳定',
      changeRecords: [
        {
          beforeScore: 92,
          afterScore: 96,
          changeReason: '近 30 天连续按时缴费',
          changeTime: '2026-04-18 09:20:00',
          operator: '李主管',
        },
      ],
      auditSummary: '同步最新信用评分',
    }),
    buildCreditRow({
      id: 2,
      userId: 102,
      userName: '李四',
      phone: '13912345679',
      userType: '小程序用户',
      creditScore: 84,
      creditLevel: '良好',
      updateTime: '2026-04-17 14:10:00',
      ruleCode: 'DEFAULT_RULE',
      ruleDesc: '按时缴费加 2 分，违停扣 10 分',
      creator: 'admin',
      createTime: '2026-02-11 14:10:00',
      updater: '陈老师',
      remark: '近期停车行为良好',
      changeRecords: [
        {
          beforeScore: 80,
          afterScore: 84,
          changeReason: '补缴历史欠费',
          changeTime: '2026-04-17 14:10:00',
          operator: '陈老师',
        },
      ],
      auditSummary: '同步信用变更记录',
    }),
    buildCreditRow({
      id: 3,
      userId: 103,
      userName: '王五',
      phone: '13712345670',
      userType: '平台用户',
      creditScore: 63,
      creditLevel: '较差',
      updateTime: '2026-04-16 10:00:00',
      ruleCode: 'RISK_RULE',
      ruleDesc: '逾期缴费扣 20 分，逃单扣 50 分',
      creator: '王客服',
      createTime: '2026-02-28 11:35:00',
      updater: '王客服',
      remark: '需进行低信用提醒',
      changeRecords: [
        {
          beforeScore: 78,
          afterScore: 63,
          changeReason: '存在逾期缴费记录',
          changeTime: '2026-04-16 10:00:00',
          operator: '王客服',
        },
      ],
      auditSummary: '标记为低信用用户',
    }),
    buildCreditRow({
      id: 4,
      userId: 104,
      userName: '赵六',
      phone: '13612345671',
      userType: '个人用户',
      creditScore: 72,
      creditLevel: '中等',
      updateTime: '2026-04-12 08:40:00',
      ruleCode: 'ACTIVITY_RULE',
      ruleDesc: '活动履约加 1 分，异常停车扣 8 分',
      creator: 'admin',
      createTime: '2026-03-18 08:45:00',
      updater: '李主管',
      remark: '信用分略有波动',
      changeRecords: [
        {
          beforeScore: 76,
          afterScore: 72,
          changeReason: '异常停车扣分',
          changeTime: '2026-04-12 08:40:00',
          operator: '李主管',
        },
      ],
      auditSummary: '更新信用评分',
    }),
    buildCreditRow({
      id: 5,
      userId: 105,
      userName: '孙七',
      phone: '13512345672',
      userType: '小程序用户',
      creditScore: 38,
      creditLevel: '极差',
      updateTime: '2026-04-19 17:30:00',
      ruleCode: 'RISK_RULE',
      ruleDesc: '逃单扣 50 分，恶意占位扣 20 分',
      creator: 'admin',
      createTime: '2026-04-10 16:05:00',
      updater: '李主管',
      remark: '高风险用户，需要重点跟进',
      changeRecords: [
        {
          beforeScore: 58,
          afterScore: 38,
          changeReason: '恶意占位并逃单',
          changeTime: '2026-04-19 17:30:00',
          operator: '李主管',
        },
      ],
      auditSummary: '触发高风险预警',
    }),
  ];
}

export function buildStatsData(rows: UserCreditRow[]) {
  const avgCreditScore = rows.length
    ? Math.round(
        rows.reduce((total, item) => total + item.creditScore, 0) / rows.length,
      )
    : 0;

  const lowCreditUserCount = rows.filter(
    (item) => item.creditStatus === '低信用',
  ).length;

  return {
    cards: [
      {
        title: '平均信用分',
        value: avgCreditScore,
        desc: '文档要求的核心卡片指标',
        color: '#2F80ED',
      },
      {
        title: '低信用用户数',
        value: lowCreditUserCount,
        desc: '较差/极差用户预警',
        color: '#EB5757',
      },
    ],
    charts: [
      {
        title: '信用等级分布',
        type: 'pie',
        data: creditLevelOptions.map((item) => ({
          name: item,
          value: rows.filter((row) => row.creditLevel === item).length,
        })),
      },
    ],
  };
}

export function buildExportRows(rows: UserCreditRow[]) {
  return rows.map((item) => ({
    用户名称: item.userName,
    手机号: maskPhone(item.phone),
    用户类型: item.userType,
    信用分: item.creditScore,
    信用等级: item.creditLevel,
    评分规则: item.ruleCode,
    更新时间: item.updateTime,
    记录状态: item.creditStatus,
    备注: item.remark,
  }));
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'userName',
      label: '用户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名称',
      },
    },
    {
      fieldName: 'creditLevel',
      label: '信用等级',
      component: 'Select',
      componentProps: {
        options: creditLevelOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择信用等级',
      },
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions<UserCreditRow>['columns'] {
  return [
    {
      field: 'userName',
      title: '用户名称',
      minWidth: 140,
      slots: { default: 'userName' },
    },
    {
      field: 'creditScore',
      title: '信用分',
      minWidth: 90,
      slots: { default: 'creditScore' },
    },
    {
      field: 'creditLevel',
      title: '信用等级',
      minWidth: 110,
      slots: { default: 'creditLevel' },
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 170,
    },
    {
      field: 'ruleCode',
      title: '评分规则',
      minWidth: 130,
    },
    {
      field: 'updater',
      title: '最后更新人',
      minWidth: 110,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
