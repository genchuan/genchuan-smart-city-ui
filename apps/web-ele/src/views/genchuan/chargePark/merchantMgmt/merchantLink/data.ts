import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type MerchantLinkStatus = '未对接' | '已对接';

export interface SyncLog {
  content: string;
  result: string;
  time: string;
}

export interface MerchantLinkRow {
  apiKey: string;
  apiUrl: string;
  createTime: string;
  creator: string;
  effectTime: string;
  id: number;
  lastSyncTime: string;
  linkType: string;
  merchantId: number;
  merchantName: string;
  remark: string;
  status: MerchantLinkStatus;
  syncLogs: SyncLog[];
  updateTime: string;
}

export const linkTypeOptions = ['数据对接', '接口对接', '商品同步', '核销同步'];

export const linkStatusOptions: MerchantLinkStatus[] = ['未对接', '已对接'];

export const textObj = {
  addText: '新增对接',
  editText: '编辑对接',
  excelAllName: '商户对接列表.xlsx',
  excelName: '商户对接',
};

export function maskApiKey(apiKey: string) {
  if (apiKey.length <= 6) {
    return `${apiKey.slice(0, 2)}***`;
  }

  return `${apiKey.slice(0, 3)}****${apiKey.slice(-3)}`;
}

export function getMockMerchantLinks(): MerchantLinkRow[] {
  return [
    {
      id: 1,
      merchantId: 1,
      merchantName: '泉州丰泽充停商户',
      linkType: '接口对接',
      apiUrl: 'https://merchant.quanzhou.com/api/v1',
      apiKey: 'abc123xyz789',
      status: '已对接',
      effectTime: '2026-01-09 11:00:00',
      lastSyncTime: '2026-04-16 09:20:00',
      creator: 'admin',
      createTime: '2026-01-08 10:00:00',
      updateTime: '2026-04-16 09:20:00',
      remark: '商品和订单接口双向同步',
      syncLogs: [
        {
          content: '接口连通性测试通过',
          result: '成功',
          time: '2026-01-09 11:00:00',
        },
        {
          content: '今日同步商品 42 条',
          result: '成功',
          time: '2026-04-16 09:20:00',
        },
      ],
    },
    {
      id: 2,
      merchantId: 4,
      merchantName: '丰泽万达联合商户',
      linkType: '商品同步',
      apiUrl: 'https://wanda.partner.com/link',
      apiKey: 'wanda888partner',
      status: '已对接',
      effectTime: '2026-03-06 15:30:00',
      lastSyncTime: '2026-04-15 18:00:00',
      creator: 'admin',
      createTime: '2026-03-06 15:00:00',
      updateTime: '2026-04-15 18:00:00',
      remark: '门店商品与核销数据同步',
      syncLogs: [
        {
          content: '商品同步 25 条',
          result: '成功',
          time: '2026-04-15 18:00:00',
        },
      ],
    },
    {
      id: 3,
      merchantId: 5,
      merchantName: '晋江机场停车商户',
      linkType: '核销同步',
      apiUrl: 'https://airport.parking.com/open-api',
      apiKey: 'airportlink001',
      status: '已对接',
      effectTime: '2026-04-10 14:20:00',
      lastSyncTime: '2026-04-16 08:40:00',
      creator: 'admin',
      createTime: '2026-04-10 13:50:00',
      updateTime: '2026-04-16 08:40:00',
      remark: '停车券核销同步',
      syncLogs: [
        {
          content: '核销记录同步 18 条',
          result: '成功',
          time: '2026-04-16 08:40:00',
        },
      ],
    },
    {
      id: 4,
      merchantId: 2,
      merchantName: '泉州鲤城停车商户',
      linkType: '数据对接',
      apiUrl: 'https://parking.ly.com/data',
      apiKey: 'parking-data-001',
      status: '未对接',
      effectTime: '-',
      lastSyncTime: '-',
      creator: 'admin',
      createTime: '2026-02-13 09:30:00',
      updateTime: '2026-02-13 09:30:00',
      remark: '待完成数据对接测试',
      syncLogs: [],
    },
    {
      id: 5,
      merchantId: 3,
      merchantName: '泉州洛江充电商户',
      linkType: '接口对接',
      apiUrl: 'https://charge.lj.com/interface',
      apiKey: 'charge-link-778',
      status: '未对接',
      effectTime: '-',
      lastSyncTime: '-',
      creator: 'admin',
      createTime: '2026-02-27 10:20:00',
      updateTime: '2026-02-27 10:20:00',
      remark: '等待商户修正接口白名单',
      syncLogs: [],
    },
  ];
}

export function buildStatsData(links: MerchantLinkRow[]) {
  const linkedCount = links.filter((item) => item.status === '已对接').length;
  const successRate = links.length
    ? Number(((linkedCount / links.length) * 100).toFixed(2))
    : 0;

  return {
    cards: [
      {
        title: '对接商户数',
        value: linkedCount,
        desc: '点击可钻取已对接记录',
        color: '#2F80ED',
      },
      {
        title: '对接成功率',
        value: successRate,
        desc: '文档要求的核心卡片指标',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '对接类型分布',
        type: 'bar',
        xAxis: linkTypeOptions,
        series: linkTypeOptions.map(
          (item) => links.filter((link) => link.linkType === item).length,
        ),
      },
    ],
  };
}

export function buildExportRows(links: MerchantLinkRow[]) {
  return links.map((item) => ({
    商户名称: item.merchantName,
    对接类型: item.linkType,
    接口地址: item.apiUrl,
    接口密钥: maskApiKey(item.apiKey),
    对接状态: item.status,
    对接生效时间: item.effectTime,
    最后同步时间: item.lastSyncTime,
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
      fieldName: 'linkType',
      label: '对接类型',
      component: 'Select',
      componentProps: {
        options: linkTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择对接类型',
      },
    },
    {
      fieldName: 'status',
      label: '对接状态',
      component: 'Select',
      componentProps: {
        options: linkStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择对接状态',
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
      fieldName: 'linkType',
      label: '对接类型',
      component: 'Select',
      componentProps: {
        options: linkTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择对接类型',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'apiUrl',
      label: '接口地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接口地址',
        maxlength: 120,
      },
      rules: 'required',
    },
    {
      fieldName: 'apiKey',
      label: '对接密钥',
      component: 'Input',
      componentProps: {
        placeholder: '请输入对接密钥',
        maxlength: 60,
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

export function useGridColumns(): VxeTableGridOptions<MerchantLinkRow>['columns'] {
  return [
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 180,
      slots: { default: 'merchantName' },
    },
    {
      field: 'linkType',
      title: '对接类型',
      minWidth: 130,
      slots: { default: 'linkType' },
    },
    {
      field: 'apiUrl',
      title: '接口地址',
      minWidth: 240,
    },
    {
      field: 'apiKey',
      title: '接口密钥',
      minWidth: 140,
      slots: { default: 'apiKey' },
    },
    {
      field: 'status',
      title: '对接状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 170,
    },
    {
      field: 'lastSyncTime',
      title: '最后同步时间',
      minWidth: 170,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
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
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
