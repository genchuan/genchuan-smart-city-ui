import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type MerchantRechargeStatus = '待支付' | '已支付' | '已生效' | '已取消';

export interface RechargeLog {
  content: string;
  operator: string;
  time: string;
}

export interface MerchantRechargeRow {
  amount: number;
  confirmTime: string;
  createTime: string;
  creator: string;
  id: number;
  logs: RechargeLog[];
  merchantId: number;
  merchantName: string;
  orderNo: string;
  payChannel: string;
  payTime: string;
  remark: string;
  status: MerchantRechargeStatus;
  updateTime: string;
}

export const payChannelOptions = ['微信', '支付宝', '银行转账', '平台余额'];

export const rechargeStatusOptions: MerchantRechargeStatus[] = [
  '待支付',
  '已支付',
  '已生效',
  '已取消',
];

export const textObj = {
  excelAllName: '商户充值列表.xlsx',
  excelName: '商户充值',
};

export function getMockMerchantRecharges(): MerchantRechargeRow[] {
  return [
    {
      id: 1,
      merchantId: 1,
      merchantName: '泉州丰泽充停商户',
      amount: 10000,
      payChannel: '银行转账',
      status: '已生效',
      orderNo: 'RECHARGE202604010001',
      payTime: '2026-04-01 10:00:00',
      confirmTime: '2026-04-01 11:20:00',
      remark: '月度账户充值',
      creator: 'admin',
      createTime: '2026-04-01 09:30:00',
      updateTime: '2026-04-01 11:20:00',
      logs: [
        {
          content: '发起充值申请',
          operator: 'admin',
          time: '2026-04-01 09:30:00',
        },
        {
          content: '完成支付',
          operator: 'admin',
          time: '2026-04-01 10:00:00',
        },
        {
          content: '确认到账并生效',
          operator: '李主管',
          time: '2026-04-01 11:20:00',
        },
      ],
    },
    {
      id: 2,
      merchantId: 4,
      merchantName: '丰泽万达联合商户',
      amount: 3600,
      payChannel: '支付宝',
      status: '已支付',
      orderNo: 'RECHARGE202604050002',
      payTime: '2026-04-05 15:00:00',
      confirmTime: '-',
      remark: '活动前补充预算',
      creator: 'admin',
      createTime: '2026-04-05 14:20:00',
      updateTime: '2026-04-05 15:00:00',
      logs: [
        {
          content: '发起充值申请',
          operator: 'admin',
          time: '2026-04-05 14:20:00',
        },
        {
          content: '完成支付',
          operator: 'admin',
          time: '2026-04-05 15:00:00',
        },
      ],
    },
    {
      id: 3,
      merchantId: 5,
      merchantName: '晋江机场停车商户',
      amount: 2360,
      payChannel: '微信',
      status: '已生效',
      orderNo: 'RECHARGE202604100003',
      payTime: '2026-04-10 08:45:00',
      confirmTime: '2026-04-10 09:00:00',
      remark: '新增商户首笔充值',
      creator: 'admin',
      createTime: '2026-04-10 08:20:00',
      updateTime: '2026-04-10 09:00:00',
      logs: [
        {
          content: '发起充值申请',
          operator: 'admin',
          time: '2026-04-10 08:20:00',
        },
        {
          content: '完成支付',
          operator: 'admin',
          time: '2026-04-10 08:45:00',
        },
        {
          content: '确认到账并生效',
          operator: '李主管',
          time: '2026-04-10 09:00:00',
        },
      ],
    },
    {
      id: 4,
      merchantId: 2,
      merchantName: '泉州鲤城停车商户',
      amount: 2000,
      payChannel: '平台余额',
      status: '待支付',
      orderNo: 'RECHARGE202604120004',
      payTime: '-',
      confirmTime: '-',
      remark: '待完成支付',
      creator: 'admin',
      createTime: '2026-04-12 12:00:00',
      updateTime: '2026-04-12 12:00:00',
      logs: [
        {
          content: '发起充值申请',
          operator: 'admin',
          time: '2026-04-12 12:00:00',
        },
      ],
    },
    {
      id: 5,
      merchantId: 3,
      merchantName: '泉州洛江充电商户',
      amount: 1800,
      payChannel: '微信',
      status: '已取消',
      orderNo: 'RECHARGE202604130005',
      payTime: '-',
      confirmTime: '-',
      remark: '驳回后取消充值',
      creator: 'admin',
      createTime: '2026-04-13 14:00:00',
      updateTime: '2026-04-13 14:30:00',
      logs: [
        {
          content: '发起充值申请',
          operator: 'admin',
          time: '2026-04-13 14:00:00',
        },
        {
          content: '取消充值',
          operator: '王客服',
          time: '2026-04-13 14:30:00',
        },
      ],
    },
  ];
}

export function buildStatsData(recharges: MerchantRechargeRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const amountMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  recharges.forEach((item) => {
    if (item.payTime === '-') {
      return;
    }

    const key = dayjs(item.payTime).format('YYYY-MM');
    if (key in amountMap) {
      amountMap[key] += item.amount;
    }
  });

  const totalAmount = recharges
    .filter((item) => item.status === '已生效')
    .reduce((total, item) => total + item.amount, 0);

  const successCount = recharges.filter(
    (item) => item.status === '已生效',
  ).length;
  const successRate = recharges.length
    ? Number(((successCount / recharges.length) * 100).toFixed(2))
    : 0;

  return {
    cards: [
      {
        title: '充值金额',
        value: totalAmount,
        desc: '点击可钻取全部充值记录',
        color: '#2F80ED',
      },
      {
        title: '充值成功率',
        value: successRate,
        desc: '以已生效记录计算',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '充值金额趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => amountMap[item]),
      },
    ],
  };
}

export function buildExportRows(recharges: MerchantRechargeRow[]) {
  return recharges.map((item) => ({
    商户名称: item.merchantName,
    充值金额: item.amount,
    支付渠道: item.payChannel,
    充值状态: item.status,
    充值订单号: item.orderNo,
    支付时间: item.payTime,
    确认时间: item.confirmTime,
    创建人: item.creator,
    创建时间: item.createTime,
    更新时间: item.updateTime,
    备注: item.remark,
  }));
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
      },
    },
    {
      fieldName: 'payChannel',
      label: '支付渠道',
      component: 'Select',
      componentProps: {
        options: payChannelOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择支付渠道',
      },
    },
    {
      fieldName: 'status',
      label: '充值状态',
      component: 'Select',
      componentProps: {
        options: rechargeStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择充值状态',
      },
    },
    {
      fieldName: 'payTime',
      label: '支付时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions<MerchantRechargeRow>['columns'] {
  return [
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'merchantName' },
    },
    {
      field: 'amount',
      title: '充值金额',
      minWidth: 110,
      slots: { default: 'amount' },
    },
    {
      field: 'payChannel',
      title: '支付渠道',
      minWidth: 120,
      slots: { default: 'payChannel' },
    },
    {
      field: 'createTime',
      title: '申请时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '充值状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'orderNo',
      title: '充值订单号',
      minWidth: 180,
    },
    {
      field: 'payTime',
      title: '支付时间',
      minWidth: 170,
    },
    {
      field: 'confirmTime',
      title: '确认时间',
      minWidth: 170,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
