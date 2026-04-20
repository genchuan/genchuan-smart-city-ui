import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getRangePickerDefaultProps } from '#/utils';

export type CreditConfigStatus = '已生效' | '未生效';

export interface AuditLog {
  content: string;
  operator: string;
  remark?: string;
  time: string;
}

export interface ApplyRecord {
  applyResult: string;
  applyTarget: string;
  time: string;
}

export interface CreditConfigRow {
  accuracy: number;
  applyRecords: ApplyRecord[];
  auditLogs?: AuditLog[];
  auditSummary: string;
  configType: string;
  createTime: string;
  creator: string;
  effectTime: string;
  id: number;
  levelThreshold: string;
  remark: string;
  ruleDesc: string;
  status: CreditConfigStatus;
  updateTime: string;
  updater: string;
}

export const creditConfigStatusOptions: CreditConfigStatus[] = [
  '未生效',
  '已生效',
];

export const textObj = {
  addText: '新增信用配置',
  editText: '编辑信用配置',
};

export function classifyConfigType(ruleDesc: string) {
  if (
    ruleDesc.includes('逃单') ||
    ruleDesc.includes('违停') ||
    ruleDesc.includes('恶意')
  ) {
    return '特殊规则';
  }

  if (ruleDesc.includes('行业') || ruleDesc.includes('商户')) {
    return '行业规则';
  }

  return '基础规则';
}

export function buildAuditLogs(row: CreditConfigRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建信用配置',
      operator: row.creator,
      time: row.createTime,
    },
  ];

  if (row.status === '已生效' && row.effectTime !== '-') {
    logs.push({
      content: '信用配置生效',
      operator: row.updater,
      time: row.effectTime,
    });
  }

  if (row.updateTime !== row.createTime) {
    logs.push({
      content: row.auditSummary || '更新信用配置',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
}

export function getMockConfigs(): CreditConfigRow[] {
  return [
    {
      id: 1,
      configType: '基础规则',
      ruleDesc: '按时缴费加 2 分，逾期缴费扣 5 分，违停扣 10 分',
      levelThreshold: '90 - 优秀，80 - 良好，60 - 中等，40 - 较差，<40 - 极差',
      status: '已生效',
      effectTime: '2026-01-08 10:00:00',
      remark: '当前默认生效规则',
      creator: 'admin',
      createTime: '2026-01-06 09:30:00',
      updater: '李主管',
      updateTime: '2026-04-14 09:20:00',
      accuracy: 0.96,
      applyRecords: [
        {
          applyTarget: '停车缴费信用评分',
          applyResult: '已同步 1250 条用户记录',
          time: '2026-04-14 09:20:00',
        },
      ],
      auditSummary: '更新基础评分规则',
    },
    {
      id: 2,
      configType: '特殊规则',
      ruleDesc: '逃单扣 50 分，恶意占位扣 20 分，黑名单恢复加 10 分',
      levelThreshold: '95 - 优秀，85 - 良好，70 - 中等，50 - 较差，<50 - 极差',
      status: '未生效',
      effectTime: '-',
      remark: '待审核后启用的风险规则',
      creator: 'admin',
      createTime: '2026-02-10 14:00:00',
      updater: 'admin',
      updateTime: '2026-02-10 14:00:00',
      accuracy: 0.92,
      applyRecords: [],
      auditSummary: '新建特殊信用规则',
    },
    {
      id: 3,
      configType: '行业规则',
      ruleDesc: '商户联动免停权益核销成功加 3 分，异常核销扣 8 分',
      levelThreshold: '88 - 优秀，78 - 良好，58 - 中等，38 - 较差，<38 - 极差',
      status: '已生效',
      effectTime: '2026-03-20 15:30:00',
      remark: '联动商户信用评分场景',
      creator: '王客服',
      createTime: '2026-03-18 11:20:00',
      updater: '王客服',
      updateTime: '2026-04-12 16:10:00',
      accuracy: 0.94,
      applyRecords: [
        {
          applyTarget: '商户联动场景',
          applyResult: '已同步 320 条联动规则命中记录',
          time: '2026-04-12 16:10:00',
        },
      ],
      auditSummary: '同步行业规则应用记录',
    },
    {
      id: 4,
      configType: '基础规则',
      ruleDesc: '连续 30 天无异常停车加 5 分，违规停车扣 12 分',
      levelThreshold: '92 - 优秀，82 - 良好，65 - 中等，45 - 较差，<45 - 极差',
      status: '未生效',
      effectTime: '-',
      remark: '待确认后的行为评分规则',
      creator: 'admin',
      createTime: '2026-04-11 10:10:00',
      updater: '李主管',
      updateTime: '2026-04-18 09:00:00',
      accuracy: 0.95,
      applyRecords: [],
      auditSummary: '编辑待生效配置',
    },
  ];
}

export function buildStatsData(rows: CreditConfigRow[]) {
  const effectConfigCount = rows.filter(
    (item) => item.status === '已生效',
  ).length;
  const accuracy = rows.length
    ? Math.round(
        (rows.reduce((total, item) => total + item.accuracy, 0) / rows.length) *
          100,
      )
    : 0;

  const configTypes = Array.from(new Set(rows.map((item) => item.configType)));

  return {
    cards: [
      {
        title: '生效配置数',
        value: effectConfigCount,
        desc: '文档要求的核心卡片指标',
        color: '#2F80ED',
      },
      {
        title: '信用评分准确率',
        value: `${accuracy}%`,
        desc: '基于模拟评分校验结果',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '配置类型占比',
        type: 'pie',
        data: configTypes.map((item) => ({
          name: item,
          value: rows.filter((row) => row.configType === item).length,
        })),
      },
    ],
  };
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'ruleDesc',
      label: '加减分规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入加减分规则',
      },
    },
    {
      fieldName: 'levelThreshold',
      label: '等级阈值',
      component: 'Input',
      componentProps: {
        placeholder: '请输入等级阈值',
      },
    },
    {
      fieldName: 'status',
      label: '配置状态',
      component: 'Select',
      componentProps: {
        options: creditConfigStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择配置状态',
      },
    },
    {
      fieldName: 'effectTime',
      label: '生效时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useCreateSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'ruleDesc',
      label: '加减分规则',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入加减分规则',
        maxlength: 200,
      },
      rules: 'required',
    },
    {
      fieldName: 'levelThreshold',
      label: '等级阈值',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入等级阈值',
        maxlength: 200,
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        maxlength: 200,
      },
    },
  ];
}

export function useEditSchema(): VbenFormSchema[] {
  return useCreateSchema();
}

export function useGridColumns(): VxeTableGridOptions<CreditConfigRow>['columns'] {
  return [
    {
      field: 'ruleDesc',
      title: '加减分规则',
      minWidth: 260,
      slots: { default: 'ruleDesc' },
    },
    {
      field: 'levelThreshold',
      title: '等级阈值',
      minWidth: 260,
      slots: { default: 'levelThreshold' },
    },
    {
      field: 'status',
      title: '配置状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 170,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 170,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
