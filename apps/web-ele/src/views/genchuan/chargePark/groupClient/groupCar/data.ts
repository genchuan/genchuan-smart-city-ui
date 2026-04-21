import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type GroupCarStatus = '待审核' | '已绑定' | '已解绑' | '已驳回';

export interface BindingLog {
  action: string;
  operator: string;
  remark: string;
  time: string;
}

export interface GroupCarRow {
  auditRemark: string;
  auditTime: string;
  auditorName: string;
  bindTime: string;
  bindingLogs: BindingLog[];
  carType: string;
  createTime: string;
  creator: string;
  groupId: number;
  groupName: string;
  id: number;
  plateColor: string;
  plateNo: string;
  remark: string;
  status: GroupCarStatus;
  updateTime: string;
}

export const carTypeOptions = ['小型车', '大型车', '新能源', '其他'];

export const plateColorOptions = ['蓝牌', '黄牌', '绿牌', '黑牌', '白牌'];

export const statusOptions: GroupCarStatus[] = [
  '待审核',
  '已绑定',
  '已解绑',
  '已驳回',
];

export const groupOptions = [
  { label: '泉州智联企业集团', value: 1 },
  { label: '泉州教育服务中心', value: 2 },
  { label: '泉州市政协调服务中心', value: 3 },
  { label: '福建商务联合体', value: 4 },
  { label: '晋江航空产业联盟', value: 5 },
];

export const detailFields = [
  { key: 'groupName', label: '所属集团' },
  { key: 'plateNo', label: '车牌号码' },
  {
    key: 'plateColor',
    label: '车牌颜色',
    type: 'tag',
    tagType: () => 'primary',
  },
  {
    key: 'carType',
    label: '车辆类型',
    type: 'tag',
    tagType: () => 'warning',
  },
  {
    key: 'status',
    label: '绑定状态',
    type: 'tag',
    tagType: (value: string) => {
      switch (value) {
        case '已绑定': {
          return 'success';
        }
        case '待审核': {
          return 'warning';
        }
        case '已驳回': {
          return 'danger';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'bindTime', label: '绑定时间' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTime', label: '审核时间' },
  { key: 'auditRemark', label: '审核备注' },
  { key: 'bindingLogsSummary', label: '绑定操作日志' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '最后更新时间' },
  { key: 'remark', label: '备注' },
];

function buildGroupCar(data: GroupCarRow): GroupCarRow {
  return data;
}

export function getMockGroupCars(): GroupCarRow[] {
  return [
    buildGroupCar({
      id: 1,
      groupId: 1,
      groupName: '泉州智联企业集团',
      plateNo: '闽C11111',
      plateColor: '蓝牌',
      carType: '小型车',
      bindTime: '2026-04-02 10:00:00',
      status: '已绑定',
      auditorName: '李主管',
      auditTime: '2026-04-02 11:00:00',
      auditRemark: '审核通过',
      remark: '集团公务车辆',
      creator: 'admin',
      createTime: '2026-04-02 10:00:00',
      updateTime: '2026-04-02 11:00:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: 'admin',
          remark: '新增集团车辆绑定申请',
          time: '2026-04-02 10:00:00',
        },
        {
          action: '审核通过',
          operator: '李主管',
          remark: '资料齐全，审核通过',
          time: '2026-04-02 11:00:00',
        },
      ],
    }),
    buildGroupCar({
      id: 2,
      groupId: 2,
      groupName: '泉州教育服务中心',
      plateNo: '闽C22222',
      plateColor: '绿牌',
      carType: '新能源',
      bindTime: '2026-04-05 09:20:00',
      status: '待审核',
      auditorName: '-',
      auditTime: '-',
      auditRemark: '',
      remark: '待审核新能源车辆',
      creator: 'admin',
      createTime: '2026-04-05 09:20:00',
      updateTime: '2026-04-05 09:20:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: 'admin',
          remark: '发起集团车辆绑定',
          time: '2026-04-05 09:20:00',
        },
      ],
    }),
    buildGroupCar({
      id: 3,
      groupId: 4,
      groupName: '福建商务联合体',
      plateNo: '闽C33333',
      plateColor: '黄牌',
      carType: '大型车',
      bindTime: '2026-03-18 08:45:00',
      status: '已解绑',
      auditorName: '王客服',
      auditTime: '2026-03-18 10:00:00',
      auditRemark: '审核通过，后续解绑',
      remark: '集团业务调整后解绑',
      creator: 'admin',
      createTime: '2026-03-18 08:45:00',
      updateTime: '2026-04-08 16:20:00',
      bindingLogs: [
        {
          action: '审核通过',
          operator: '王客服',
          remark: '资料审核通过',
          time: '2026-03-18 10:00:00',
        },
        {
          action: '解绑',
          operator: '李主管',
          remark: '执行解绑操作',
          time: '2026-04-08 16:20:00',
        },
      ],
    }),
    buildGroupCar({
      id: 4,
      groupId: 3,
      groupName: '泉州市政协调服务中心',
      plateNo: '闽C44444',
      plateColor: '黑牌',
      carType: '其他',
      bindTime: '2026-04-07 14:10:00',
      status: '已驳回',
      auditorName: '王客服',
      auditTime: '2026-04-07 15:30:00',
      auditRemark: '行驶证信息不符',
      remark: '待重新提交资料',
      creator: '王客服',
      createTime: '2026-04-07 14:10:00',
      updateTime: '2026-04-07 15:30:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: '王客服',
          remark: '发起集团车辆绑定',
          time: '2026-04-07 14:10:00',
        },
        {
          action: '审核驳回',
          operator: '王客服',
          remark: '行驶证信息不符',
          time: '2026-04-07 15:30:00',
        },
      ],
    }),
    buildGroupCar({
      id: 5,
      groupId: 5,
      groupName: '晋江航空产业联盟',
      plateNo: '闽C55555',
      plateColor: '蓝牌',
      carType: '小型车',
      bindTime: '2026-04-10 16:20:00',
      status: '已绑定',
      auditorName: '李主管',
      auditTime: '2026-04-10 16:55:00',
      auditRemark: '审核通过',
      remark: '联盟常用通勤车',
      creator: 'admin',
      createTime: '2026-04-10 16:20:00',
      updateTime: '2026-04-10 16:55:00',
      bindingLogs: [
        {
          action: '创建绑定',
          operator: 'admin',
          remark: '新增集团车辆绑定',
          time: '2026-04-10 16:20:00',
        },
        {
          action: '审核通过',
          operator: '李主管',
          remark: '审核通过',
          time: '2026-04-10 16:55:00',
        },
      ],
    }),
  ];
}

export function buildStatsData(cars: GroupCarRow[]) {
  const bindCount = cars.filter((item) => item.status === '已绑定').length;
  const passCount = cars.filter(
    (item) => item.auditRemark === '审核通过',
  ).length;
  const passRate =
    cars.length === 0 ? 0 : Number((passCount / cars.length).toFixed(2));

  return {
    cards: [
      {
        title: '绑定车辆数',
        value: bindCount,
        desc: '点击表格字段可进行钻取筛选',
        color: '#2F80ED',
      },
      {
        title: '审核通过率',
        value: `${Math.round(passRate * 100)}%`,
        desc: '集团车辆审核指标',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '车辆类型分布',
        type: 'bar',
        xAxis: carTypeOptions,
        series: carTypeOptions.map(
          (item) => cars.filter((car) => car.carType === item).length,
        ),
      },
    ],
  };
}

export function buildExportRows(cars: GroupCarRow[]) {
  return cars.map((item) => ({
    所属集团: item.groupName,
    车牌号码: item.plateNo,
    车牌颜色: item.plateColor,
    车辆类型: item.carType,
    绑定时间: item.bindTime,
    绑定状态: item.status,
    审核人: item.auditorName,
    审核时间: item.auditTime,
    审核备注: item.auditRemark,
    创建人: item.creator,
    创建时间: item.createTime,
    更新时间: item.updateTime,
    备注: item.remark,
  }));
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'groupId',
      label: '所属集团',
      component: 'Select',
      componentProps: {
        options: groupOptions,
        placeholder: '请选择所属集团',
      },
    },
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
    },
    {
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        options: carTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车辆类型',
      },
    },
    {
      fieldName: 'status',
      label: '绑定状态',
      component: 'Select',
      componentProps: {
        options: statusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择绑定状态',
      },
    },
    {
      fieldName: 'bindTime',
      label: '绑定时间',
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
      fieldName: 'groupId',
      label: '所属集团',
      component: 'Select',
      componentProps: {
        options: groupOptions,
        placeholder: '请选择所属集团',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        options: plateColorOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车牌颜色',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        options: carTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车辆类型',
      },
      rules: 'selectRequired',
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
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        options: plateColorOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车牌颜色',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        options: carTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择车辆类型',
      },
      rules: 'selectRequired',
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

export function useGridColumns(): VxeTableGridOptions<GroupCarRow>['columns'] {
  return [
    {
      field: 'groupName',
      title: '所属集团',
      minWidth: 160,
      slots: { default: 'groupName' },
    },
    {
      field: 'plateNo',
      title: '车牌号码',
      minWidth: 130,
      slots: { default: 'plateNo' },
    },
    {
      field: 'plateColor',
      title: '车牌颜色',
      minWidth: 100,
      slots: { default: 'plateColor' },
    },
    {
      field: 'carType',
      title: '车辆类型',
      minWidth: 110,
      slots: { default: 'carType' },
    },
    {
      field: 'bindTime',
      title: '绑定时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '绑定状态',
      minWidth: 110,
      slots: { default: 'status' },
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 110,
      slots: { default: 'auditorName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 170,
    },
    {
      field: 'auditRemark',
      title: '审核备注',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 210,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
