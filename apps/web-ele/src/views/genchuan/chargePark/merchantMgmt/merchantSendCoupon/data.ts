import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type MerchantSendCouponStatus = '待执行' | '已执行' | '已取消';

export interface RedemptionLog {
  count: number;
  time: string;
  type: string;
}

export interface MerchantSendCouponRow {
  couponId: number;
  couponName: string;
  createTime: string;
  creator: string;
  execTime: string;
  finishTime: string;
  id: number;
  merchantId: number;
  merchantName: string;
  redemptions: RedemptionLog[];
  remark: string;
  sendCount: number;
  status: MerchantSendCouponStatus;
  updateTime: string;
  useCount: number;
}

export const couponOptions = [
  '停车满 20 减 5 券',
  '停车满 50 减 10 券',
  '充电满 30 减 8 券',
  '充停联名体验券',
];

export const sendStatusOptions: MerchantSendCouponStatus[] = [
  '待执行',
  '已执行',
  '已取消',
];

export const textObj = {
  addText: '发券任务',
  excelAllName: '商户发券列表.xlsx',
  excelName: '商户发券',
};

export function getMockMerchantCoupons(): MerchantSendCouponRow[] {
  return [
    {
      id: 1,
      merchantId: 1,
      merchantName: '泉州丰泽充停商户',
      couponId: 101,
      couponName: '停车满 20 减 5 券',
      sendCount: 500,
      execTime: '2026-04-01 09:00:00',
      finishTime: '2026-04-01 09:05:00',
      useCount: 326,
      status: '已执行',
      remark: '商户营销发券',
      creator: 'admin',
      createTime: '2026-04-01 08:30:00',
      updateTime: '2026-04-01 09:05:00',
      redemptions: [
        {
          count: 120,
          time: '2026-04-03 10:00:00',
          type: '首轮核销',
        },
        {
          count: 206,
          time: '2026-04-15 16:20:00',
          type: '累计核销',
        },
      ],
    },
    {
      id: 2,
      merchantId: 4,
      merchantName: '丰泽万达联合商户',
      couponId: 102,
      couponName: '停车满 50 减 10 券',
      sendCount: 260,
      execTime: '2026-04-05 12:00:00',
      finishTime: '2026-04-05 12:03:00',
      useCount: 188,
      status: '已执行',
      remark: '活动周末营销',
      creator: 'admin',
      createTime: '2026-04-05 11:30:00',
      updateTime: '2026-04-05 12:03:00',
      redemptions: [
        {
          count: 188,
          time: '2026-04-14 15:20:00',
          type: '累计核销',
        },
      ],
    },
    {
      id: 3,
      merchantId: 5,
      merchantName: '晋江机场停车商户',
      couponId: 104,
      couponName: '充停联名体验券',
      sendCount: 180,
      execTime: '2026-04-11 10:00:00',
      finishTime: '-',
      useCount: 0,
      status: '待执行',
      remark: '新商户拉新活动',
      creator: 'admin',
      createTime: '2026-04-10 18:00:00',
      updateTime: '2026-04-10 18:00:00',
      redemptions: [],
    },
    {
      id: 4,
      merchantId: 2,
      merchantName: '泉州鲤城停车商户',
      couponId: 101,
      couponName: '停车满 20 减 5 券',
      sendCount: 120,
      execTime: '2026-04-12 15:00:00',
      finishTime: '-',
      useCount: 0,
      status: '待执行',
      remark: '待执行发券任务',
      creator: 'admin',
      createTime: '2026-04-12 14:30:00',
      updateTime: '2026-04-12 14:30:00',
      redemptions: [],
    },
    {
      id: 5,
      merchantId: 3,
      merchantName: '泉州洛江充电商户',
      couponId: 103,
      couponName: '充电满 30 减 8 券',
      sendCount: 90,
      execTime: '2026-04-08 09:00:00',
      finishTime: '-',
      useCount: 0,
      status: '已取消',
      remark: '商户状态异常后取消',
      creator: 'admin',
      createTime: '2026-04-08 08:30:00',
      updateTime: '2026-04-08 08:45:00',
      redemptions: [],
    },
  ];
}

export function buildStatsData(coupons: MerchantSendCouponRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const sendMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  coupons.forEach((item) => {
    const key = dayjs(item.createTime).format('YYYY-MM');
    if (key in sendMap) {
      sendMap[key] += item.sendCount;
    }
  });

  const totalSendCount = coupons.reduce(
    (total, item) => total + item.sendCount,
    0,
  );
  const totalUseCount = coupons.reduce(
    (total, item) => total + item.useCount,
    0,
  );
  const useRate = totalSendCount
    ? Number(((totalUseCount / totalSendCount) * 100).toFixed(2))
    : 0;

  return {
    cards: [
      {
        title: '发券量',
        value: totalSendCount,
        desc: '点击可钻取全部发券任务',
        color: '#2F80ED',
      },
      {
        title: '核销率',
        value: useRate,
        desc: '按累计核销数量计算',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '发券量趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => sendMap[item]),
      },
    ],
  };
}

export function buildExportRows(coupons: MerchantSendCouponRow[]) {
  return coupons.map((item) => ({
    商户名称: item.merchantName,
    优惠券名称: item.couponName,
    发放数量: item.sendCount,
    执行时间: item.execTime,
    发券完成时间: item.finishTime,
    已核销数量: item.useCount,
    发券状态: item.status,
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
      fieldName: 'couponName',
      label: '优惠券名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优惠券名称',
      },
    },
    {
      fieldName: 'status',
      label: '发券状态',
      component: 'Select',
      componentProps: {
        options: sendStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择发券状态',
      },
    },
    {
      fieldName: 'execTime',
      label: '执行时间',
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
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
        maxlength: 40,
      },
      rules: 'required',
    },
    {
      fieldName: 'couponName',
      label: '优惠券名称',
      component: 'Select',
      componentProps: {
        options: couponOptions.map((item, index) => ({
          label: item,
          value: `${item}|${101 + index}`,
        })),
        placeholder: '请选择优惠券',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'sendCount',
      label: '发放数量',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '请输入发放数量',
      },
      rules: 'required',
    },
    {
      fieldName: 'execTime',
      label: '执行时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '不填则立即执行',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
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

export function useGridColumns(): VxeTableGridOptions<MerchantSendCouponRow>['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
    },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'merchantName' },
    },
    {
      field: 'couponName',
      title: '优惠券名称',
      minWidth: 170,
      slots: { default: 'couponName' },
    },
    {
      field: 'sendCount',
      title: '发放数量',
      minWidth: 100,
    },
    {
      field: 'execTime',
      title: '执行时间',
      minWidth: 170,
    },
    {
      field: 'finishTime',
      title: '发券完成时间',
      minWidth: 170,
    },
    {
      field: 'useCount',
      title: '已核销数量',
      minWidth: 110,
      slots: { default: 'useCount' },
    },
    {
      field: 'status',
      title: '发券状态',
      minWidth: 100,
      slots: { default: 'status' },
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
