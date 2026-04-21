import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type GroupStatus = '待审核' | '正常' | '禁用' | '已驳回';

export interface AccountLog {
  afterBalance: number;
  amount: number;
  time: string;
  type: string;
}

export interface GroupCarInfo {
  carType: string;
  plateNo: string;
  status: string;
}

export interface AuditLog {
  content: string;
  operator: string;
  remark?: string;
  time: string;
}

export interface GroupInfoRow {
  accountLogs: AccountLog[];
  address: string;
  auditLogs?: AuditLog[];
  auditSummary: string;
  auditTime: string;
  auditorName: string;
  cars: GroupCarInfo[];
  contact: string;
  createTime: string;
  creator: string;
  groupType: string;
  id: number;
  name: string;
  phone: string;
  registerTime: string;
  remark: string;
  status: GroupStatus;
  updateTime: string;
  updater: string;
  walletBalance: number;
}

export const groupStatusOptions: GroupStatus[] = [
  '待审核',
  '正常',
  '禁用',
  '已驳回',
];

export const groupTypeOptions = ['企业单位', '事业单位', '政府机构', '其他'];

export const textObj = {
  addText: '新增集团',
  editText: '编辑集团',
  excelAllName: '集团信息列表.xlsx',
  excelName: '集团信息',
};

export function maskPhone(phone: string) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function buildAuditLogs(row: GroupInfoRow): AuditLog[] {
  const logs: AuditLog[] = [
    {
      content: '创建集团',
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
    });
  }

  if (row.updateTime !== row.createTime) {
    logs.push({
      content: row.auditSummary || '更新集团信息',
      operator: row.updater,
      time: row.updateTime,
    });
  }

  return logs;
}

export function getMockGroups(): GroupInfoRow[] {
  return [
    {
      id: 1,
      name: '泉州智联企业集团',
      contact: '孙七',
      phone: '13512349012',
      groupType: '企业单位',
      address: '福建省泉州市鲤城区江南大街 66 号',
      registerTime: '2026-01-12 09:10:00',
      status: '正常',
      walletBalance: 100000,
      auditorName: '李主管',
      auditTime: '2026-01-14 10:00:00',
      creator: 'admin',
      createTime: '2026-01-12 09:10:00',
      updater: '李主管',
      updateTime: '2026-04-16 09:20:00',
      remark: '大型企业集团客户',
      cars: [
        {
          carType: '小型车',
          plateNo: '闽C11111',
          status: '已绑定',
        },
        {
          carType: '新能源',
          plateNo: '闽C22222',
          status: '已绑定',
        },
      ],
      accountLogs: [
        {
          afterBalance: 100000,
          amount: 50000,
          time: '2026-04-01 09:00:00',
          type: '集团充值',
        },
      ],
      auditSummary: '审核通过并开通集团账户',
    },
    {
      id: 2,
      name: '泉州教育服务中心',
      contact: '周八',
      phone: '13412345678',
      groupType: '事业单位',
      address: '福建省泉州市丰泽区北清东路 18 号',
      registerTime: '2026-02-06 10:20:00',
      status: '待审核',
      walletBalance: 0,
      auditorName: '-',
      auditTime: '-',
      creator: 'admin',
      createTime: '2026-02-06 10:20:00',
      updater: 'admin',
      updateTime: '2026-02-06 10:20:00',
      remark: '新入驻事业单位客户',
      cars: [],
      accountLogs: [],
      auditSummary: '待审核',
    },
    {
      id: 3,
      name: '泉州市政协调服务中心',
      contact: '吴九',
      phone: '13312345679',
      groupType: '政府机构',
      address: '福建省泉州市丰泽区行政服务路 8 号',
      registerTime: '2026-02-28 11:00:00',
      status: '已驳回',
      walletBalance: 0,
      auditorName: '王客服',
      auditTime: '2026-03-01 08:30:00',
      creator: 'admin',
      createTime: '2026-02-28 11:00:00',
      updater: '王客服',
      updateTime: '2026-03-01 08:30:00',
      remark: '集团资质待补充',
      cars: [],
      accountLogs: [],
      auditSummary: '驳回集团审核',
    },
    {
      id: 4,
      name: '福建商务联合体',
      contact: '郑十',
      phone: '13212345670',
      groupType: '企业单位',
      address: '福建省泉州市东海总部经济区 12 号',
      registerTime: '2026-03-15 09:30:00',
      status: '禁用',
      walletBalance: 32500,
      auditorName: '李主管',
      auditTime: '2026-03-16 10:00:00',
      creator: 'admin',
      createTime: '2026-03-15 09:30:00',
      updater: '李主管',
      updateTime: '2026-04-08 16:20:00',
      remark: '对账异常临时禁用',
      cars: [
        {
          carType: '大型车',
          plateNo: '闽C33333',
          status: '已绑定',
        },
      ],
      accountLogs: [
        {
          afterBalance: 32500,
          amount: -7500,
          time: '2026-04-08 16:20:00',
          type: '代付扣款',
        },
      ],
      auditSummary: '禁用集团',
    },
    {
      id: 5,
      name: '晋江航空产业联盟',
      contact: '钱十一',
      phone: '13112345671',
      groupType: '其他',
      address: '福建省晋江市和平南路 88 号',
      registerTime: '2026-04-10 14:10:00',
      status: '正常',
      walletBalance: 12000,
      auditorName: '李主管',
      auditTime: '2026-04-11 09:00:00',
      creator: 'admin',
      createTime: '2026-04-10 14:10:00',
      updater: '李主管',
      updateTime: '2026-04-16 11:20:00',
      remark: '最近 30 天新增集团',
      cars: [
        {
          carType: '新能源',
          plateNo: '闽C55555',
          status: '已绑定',
        },
      ],
      accountLogs: [
        {
          afterBalance: 12000,
          amount: 12000,
          time: '2026-04-16 11:20:00',
          type: '集团充值',
        },
      ],
      auditSummary: '审核通过并同步车辆信息',
    },
  ];
}

export function buildStatsData(groups: GroupInfoRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs()
      .subtract(5 - index, 'month')
      .format('YYYY-MM'),
  );

  const growthMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  groups.forEach((item) => {
    const key = dayjs(item.registerTime).format('YYYY-MM');
    if (key in growthMap) {
      growthMap[key] += 1;
    }
  });

  const newGroupCount = groups.filter(
    (item) => dayjs().diff(dayjs(item.registerTime), 'day') <= 30,
  ).length;

  return {
    cards: [
      {
        title: '总集团数',
        value: groups.length,
        desc: '点击字段可钻取全部集团列表',
        color: '#2F80ED',
      },
      {
        title: '近30天新增',
        value: newGroupCount,
        desc: '文档要求的新增集团指标',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '集团增长趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => growthMap[item]),
      },
    ],
  };
}

export function buildExportRows(groups: GroupInfoRow[]) {
  return groups.map((item) => ({
    集团名称: item.name,
    联系人: item.contact,
    联系手机号: maskPhone(item.phone),
    集团类型: item.groupType,
    地址: item.address,
    注册时间: item.registerTime,
    集团状态: item.status,
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
      label: '集团名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团名称',
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
      fieldName: 'groupType',
      label: '集团类型',
      component: 'Select',
      componentProps: {
        options: groupTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择集团类型',
      },
    },
    {
      fieldName: 'status',
      label: '集团状态',
      component: 'Select',
      componentProps: {
        options: groupStatusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择集团状态',
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
      label: '集团名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团名称',
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
      fieldName: 'groupType',
      label: '集团类型',
      component: 'Select',
      componentProps: {
        options: groupTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择集团类型',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'address',
      label: '地址',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入集团地址',
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
        placeholder: '请输入集团地址',
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

export function useGridColumns(): VxeTableGridOptions<GroupInfoRow>['columns'] {
  return [
    {
      field: 'name',
      title: '集团名称',
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
      field: 'groupType',
      title: '集团类型',
      minWidth: 130,
      slots: { default: 'groupType' },
    },
    {
      field: 'registerTime',
      title: '注册时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '集团状态',
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
