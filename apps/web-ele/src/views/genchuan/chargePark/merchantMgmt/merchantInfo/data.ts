import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type MerchantStatus = '待审核' | '已驳回' | '正常' | '禁用';

export interface MerchantAccountLog {
  afterBalance: number;
  amount: number;
  time: string;
  type: string;
}

export interface MerchantLinkInfo {
  apiUrl: string;
  linkType: string;
  status: string;
}

export interface MerchantRechargeInfo {
  amount: number;
  payChannel: string;
  status: string;
  time: string;
}

export interface MerchantCouponInfo {
  couponName: string;
  sendCount: number;
  status: string;
  useCount: number;
}

export interface AuditLog {
  content: string;
  operator: string;
  remark?: string;
  time: string;
}

export interface MerchantInfoRow {
  accountLogs: MerchantAccountLog[];
  address: string;
  auditLogs?: AuditLog[];
  auditSummary: string;
  auditTime: string;
  auditorName: string;
  contact: string;
  couponRecords: MerchantCouponInfo[];
  createTime: string;
  creator: string;
  id: number;
  linkRecords: MerchantLinkInfo[];
  merchantType: string;
  name: string;
  phone: string;
  rechargeRecords: MerchantRechargeInfo[];
  registerTime: string;
  remark: string;
  status: MerchantStatus;
  updateTime: string;
  updater: string;
  walletBalance: number;
}

export const merchantStatusOptions: MerchantStatus[] = [
  '待审核',
  '正常',
  '禁用',
  '已驳回',
];

export const merchantTypeOptions = ['充电商户', '停车商户', '充停一体商户'];

export const textObj = {
  addText: '新增商户',
  editText: '编辑商户',
  excelAllName: '商户信息列表.xlsx',
  excelName: '商户信息',
};

export function maskPhone(phone: string) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function buildAuditLogs(row: MerchantInfoRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建商户',
      operator: row.creator,
      time: row.createTime,
    },
  ];

  if (row.status === '正常' && row.auditTime !== '-') {
    logs.push({
      content: '审核通过',
      operator: row.auditorName,
      time: row.auditTime,
    });
  }

  if (row.status === '已驳回' && row.auditTime !== '-') {
    logs.push({
      content: '审核驳回',
      operator: row.auditorName,
      time: row.auditTime,
      remark: '商户资质补充后可重新提交',
    });
  }

  if (row.updateTime !== row.createTime) {
    logs.push({
      content: row.auditSummary || '更新商户信息',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
}

function buildMerchant(row: MerchantInfoRow): MerchantInfoRow {
  return row;
}

export function getMockMerchants(): MerchantInfoRow[] {
  return [
    buildMerchant({
      id: 1,
      name: '泉州丰泽充停商户',
      contact: '王五',
      phone: '13712345678',
      merchantType: '充停一体商户',
      address: '福建省泉州市丰泽区东海大街 88 号',
      registerTime: '2026-01-06 09:10:00',
      status: '正常',
      walletBalance: 5000,
      auditorName: '李主管',
      auditTime: '2026-01-08 14:00:00',
      creator: 'admin',
      createTime: '2026-01-06 09:10:00',
      updater: '李主管',
      updateTime: '2026-04-15 10:20:00',
      remark: '核心合作商户，覆盖充停一体业务',
      accountLogs: [
        {
          afterBalance: 5000,
          amount: 3000,
          time: '2026-04-01 10:00:00',
          type: '账户充值',
        },
        {
          afterBalance: 2300,
          amount: -700,
          time: '2026-04-10 09:20:00',
          type: '发券消耗',
        },
        {
          afterBalance: 5000,
          amount: 2700,
          time: '2026-04-15 08:30:00',
          type: '账户充值',
        },
      ],
      linkRecords: [
        {
          apiUrl: 'https://merchant.quanzhou.com/api/v1',
          linkType: '接口对接',
          status: '已对接',
        },
      ],
      rechargeRecords: [
        {
          amount: 3000,
          payChannel: '银行转账',
          status: '已支付',
          time: '2026-04-01 10:00:00',
        },
      ],
      couponRecords: [
        {
          couponName: '停车满 20 减 5 券',
          sendCount: 500,
          status: '已执行',
          useCount: 326,
        },
      ],
      auditSummary: '审核通过并同步账户信息',
    }),
    buildMerchant({
      id: 2,
      name: '泉州鲤城停车商户',
      contact: '赵六',
      phone: '13612345679',
      merchantType: '停车商户',
      address: '福建省泉州市鲤城区新华路 16 号',
      registerTime: '2026-02-12 11:20:00',
      status: '待审核',
      walletBalance: 0,
      auditorName: '-',
      auditTime: '-',
      creator: 'admin',
      createTime: '2026-02-12 11:20:00',
      updater: 'admin',
      updateTime: '2026-02-12 11:20:00',
      remark: '新入驻停车场商户',
      accountLogs: [],
      linkRecords: [],
      rechargeRecords: [],
      couponRecords: [],
      auditSummary: '待审核',
    }),
    buildMerchant({
      id: 3,
      name: '泉州洛江充电商户',
      contact: '陈七',
      phone: '13512345670',
      merchantType: '充电商户',
      address: '福建省泉州市洛江区安吉路 99 号',
      registerTime: '2026-02-26 15:45:00',
      status: '已驳回',
      walletBalance: 0,
      auditorName: '王客服',
      auditTime: '2026-02-27 09:10:00',
      creator: 'admin',
      createTime: '2026-02-26 15:45:00',
      updater: '王客服',
      updateTime: '2026-02-27 09:10:00',
      remark: '资质材料不完整，待补充',
      accountLogs: [],
      linkRecords: [],
      rechargeRecords: [],
      couponRecords: [],
      auditSummary: '驳回商户审核',
    }),
    buildMerchant({
      id: 4,
      name: '丰泽万达联合商户',
      contact: '林八',
      phone: '13412345671',
      merchantType: '充停一体商户',
      address: '福建省泉州市丰泽区宝洲路 688 号',
      registerTime: '2026-03-05 13:30:00',
      status: '禁用',
      walletBalance: 1820,
      auditorName: '李主管',
      auditTime: '2026-03-06 10:00:00',
      creator: 'admin',
      createTime: '2026-03-05 13:30:00',
      updater: '李主管',
      updateTime: '2026-04-08 09:40:00',
      remark: '因对账异常暂时禁用',
      accountLogs: [
        {
          afterBalance: 1820,
          amount: -480,
          time: '2026-04-07 16:00:00',
          type: '代付结算',
        },
      ],
      linkRecords: [
        {
          apiUrl: 'https://wanda.partner.com/link',
          linkType: '商品同步',
          status: '已对接',
        },
      ],
      rechargeRecords: [
        {
          amount: 2000,
          payChannel: '支付宝',
          status: '已支付',
          time: '2026-03-18 12:00:00',
        },
      ],
      couponRecords: [
        {
          couponName: '停车满 50 减 10 券',
          sendCount: 260,
          status: '已执行',
          useCount: 188,
        },
      ],
      auditSummary: '禁用商户并保留账户数据',
    }),
    buildMerchant({
      id: 5,
      name: '晋江机场停车商户',
      contact: '周九',
      phone: '13312345672',
      merchantType: '停车商户',
      address: '福建省晋江市和平南路 21 号',
      registerTime: '2026-04-09 09:00:00',
      status: '正常',
      walletBalance: 2360,
      auditorName: '李主管',
      auditTime: '2026-04-10 10:30:00',
      creator: 'admin',
      createTime: '2026-04-09 09:00:00',
      updater: '李主管',
      updateTime: '2026-04-16 08:45:00',
      remark: '最近 30 天新增商户',
      accountLogs: [
        {
          afterBalance: 2360,
          amount: 2360,
          time: '2026-04-16 08:45:00',
          type: '账户充值',
        },
      ],
      linkRecords: [
        {
          apiUrl: 'https://airport.parking.com/open-api',
          linkType: '核销同步',
          status: '已对接',
        },
      ],
      rechargeRecords: [
        {
          amount: 2360,
          payChannel: '微信',
          status: '已支付',
          time: '2026-04-16 08:45:00',
        },
      ],
      couponRecords: [],
      auditSummary: '审核通过并开通账户',
    }),
  ];
}

export function buildStatsData(merchants: MerchantInfoRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const growthMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  merchants.forEach((item) => {
    const key = dayjs(item.registerTime).format('YYYY-MM');
    if (key in growthMap) {
      growthMap[key] += 1;
    }
  });

  const newMerchantCount = merchants.filter(
    (item) => dayjs().diff(dayjs(item.registerTime), 'day') <= 30,
  ).length;

  return {
    cards: [
      {
        title: '总商户数',
        value: merchants.length,
        desc: '点击字段可钻取到商户列表',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: newMerchantCount,
        desc: '对齐文档中的新增商户指标',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '商户增长趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => growthMap[item]),
      },
      {
        title: '商户类型分布',
        type: 'bar',
        xAxis: merchantTypeOptions,
        series: merchantTypeOptions.map(
          (item) =>
            merchants.filter((merchant) => merchant.merchantType === item)
              .length,
        ),
      },
    ],
  };
}

export function buildExportRows(merchants: MerchantInfoRow[]) {
  return merchants.map((item) => ({
    商户名称: item.name,
    联系人: item.contact,
    联系手机号: maskPhone(item.phone),
    商户类型: item.merchantType,
    地址: item.address,
    注册时间: item.registerTime,
    商户状态: item.status,
    账户余额: item.walletBalance.toFixed(2),
    审核人: item.auditorName,
    审核时间: item.auditTime,
    创建人: item.creator,
    创建时间: item.createTime,
    最后更新人: item.updater,
    更新时间: item.updateTime,
    备注: item.remark,
  }));
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
      },
    },
    {
      fieldName: 'contact',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
    },
    {
      fieldName: 'merchantType',
      label: '商户类型',
      component: 'Select',
      componentProps: {
        options: merchantTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择商户类型',
      },
    },
    {
      fieldName: 'status',
      label: '商户状态',
      component: 'Select',
      componentProps: {
        options: merchantStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择商户状态',
      },
    },
    {
      fieldName: 'registerTime',
      label: '注册时间',
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
      fieldName: 'name',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
        maxlength: 40,
      },
      rules: 'required',
    },
    {
      fieldName: 'contact',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
        maxlength: 20,
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '联系手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系手机号',
        maxlength: 11,
      },
      rules: 'mobileRequired',
    },
    {
      fieldName: 'merchantType',
      label: '商户类型',
      component: 'Select',
      componentProps: {
        options: merchantTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择商户类型',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'address',
      label: '地址',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入商户地址',
        maxlength: 100,
      },
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
  return [
    {
      fieldName: 'contact',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
        maxlength: 20,
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '联系手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系手机号',
        maxlength: 11,
      },
      rules: 'mobileRequired',
    },
    {
      fieldName: 'address',
      label: '地址',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入商户地址',
        maxlength: 100,
      },
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

export function useGridColumns(): VxeTableGridOptions<MerchantInfoRow>['columns'] {
  return [
    {
      field: 'name',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'name' },
    },
    {
      field: 'contact',
      title: '联系人',
      minWidth: 120,
      slots: { default: 'contact' },
    },
    {
      field: 'phone',
      title: '联系手机号',
      minWidth: 140,
      slots: { default: 'phone' },
    },
    {
      field: 'merchantType',
      title: '商户类型',
      minWidth: 130,
      slots: { default: 'merchantType' },
    },
    {
      field: 'registerTime',
      title: '注册时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '商户状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'walletBalance',
      title: '账户余额',
      minWidth: 110,
      slots: { default: 'walletBalance' },
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 100,
      slots: { default: 'auditorName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 170,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
      slots: { default: 'creator' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 170,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 170,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
