import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type PlateAuthStatus = '待审核' | '已认证' | '已驳回';

export interface AuthLog {
  action: string;
  operator: string;
  remark: string;
  time: string;
}

export interface PlateAuthRow {
  id: number;
  userId: number;
  userName: string;
  phone: string;
  carId: number;
  plateNo: string;
  plateColor: string;
  carType: string;
  drivingLicense: string;
  applyTime: string;
  status: PlateAuthStatus;
  auditorName: string;
  auditTime: string;
  auditRemark: string;
  remark: string;
  creator: string;
  createTime: string;
  updateTime: string;
  authLogs: AuthLog[];
}

export const statusOptions: PlateAuthStatus[] = ['待审核', '已认证', '已驳回'];

export const userOptions = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
  { label: '孙七', value: 5 },
];

function buildLicenseImage(plateNo: string, status: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260">
      <rect width="420" height="260" rx="18" fill="#f5f7fa" />
      <rect x="18" y="18" width="384" height="224" rx="12" fill="#ffffff" stroke="#dcdfe6" stroke-width="2" />
      <text x="32" y="60" fill="#303133" font-size="22" font-family="Microsoft YaHei">机动车行驶证</text>
      <text x="32" y="110" fill="#606266" font-size="18" font-family="Microsoft YaHei">车牌号码</text>
      <text x="160" y="110" fill="#409eff" font-size="24" font-family="Microsoft YaHei">${plateNo}</text>
      <text x="32" y="155" fill="#606266" font-size="18" font-family="Microsoft YaHei">认证状态</text>
      <text x="160" y="155" fill="#67c23a" font-size="20" font-family="Microsoft YaHei">${status}</text>
      <text x="32" y="205" fill="#909399" font-size="16" font-family="Microsoft YaHei">充电停车一体化管理系统示意资料</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function maskPhone(phone: string) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function getMockPlateAuths(): PlateAuthRow[] {
  return [
    {
      id: 1,
      userId: 1,
      userName: '张三',
      phone: '13812345678',
      carId: 1,
      plateNo: '闽C12345',
      plateColor: '蓝牌',
      carType: '小型车',
      drivingLicense: buildLicenseImage('闽C12345', '已认证'),
      applyTime: '2026-02-10 09:30:00',
      status: '已认证',
      auditorName: '李主管',
      auditTime: '2026-02-10 11:00:00',
      auditRemark: '认证通过',
      remark: '用户首次提交认证',
      creator: '张三',
      createTime: '2026-02-10 09:30:00',
      updateTime: '2026-02-10 11:00:00',
      authLogs: [
        {
          action: '发起认证',
          operator: '张三',
          remark: '上传行驶证资料',
          time: '2026-02-10 09:30:00',
        },
        {
          action: '审核通过',
          operator: '李主管',
          remark: '资料齐全，认证通过',
          time: '2026-02-10 11:00:00',
        },
      ],
    },
    {
      id: 2,
      userId: 2,
      userName: '李四',
      phone: '13912345679',
      carId: 2,
      plateNo: '闽C56789',
      plateColor: '绿牌',
      carType: '新能源',
      drivingLicense: buildLicenseImage('闽C56789', '待审核'),
      applyTime: '2026-03-06 14:20:00',
      status: '待审核',
      auditorName: '-',
      auditTime: '-',
      auditRemark: '',
      remark: '新能源车辆认证申请',
      creator: '李四',
      createTime: '2026-03-06 14:20:00',
      updateTime: '2026-03-06 14:20:00',
      authLogs: [
        {
          action: '发起认证',
          operator: '李四',
          remark: '上传认证资料',
          time: '2026-03-06 14:20:00',
        },
      ],
    },
    {
      id: 3,
      userId: 3,
      userName: '王五',
      phone: '13712345670',
      carId: 4,
      plateNo: '闽C99999',
      plateColor: '黑牌',
      carType: '其他',
      drivingLicense: buildLicenseImage('闽C99999', '已驳回'),
      applyTime: '2026-03-28 10:00:00',
      status: '已驳回',
      auditorName: '王客服',
      auditTime: '2026-03-28 11:10:00',
      auditRemark: '资料照片模糊',
      remark: '需重新上传资料',
      creator: '王五',
      createTime: '2026-03-28 10:00:00',
      updateTime: '2026-03-28 11:10:00',
      authLogs: [
        {
          action: '发起认证',
          operator: '王五',
          remark: '提交行驶证资料',
          time: '2026-03-28 10:00:00',
        },
        {
          action: '审核驳回',
          operator: '王客服',
          remark: '资料照片模糊',
          time: '2026-03-28 11:10:00',
        },
      ],
    },
    {
      id: 4,
      userId: 4,
      userName: '赵六',
      phone: '13612345671',
      carId: 3,
      plateNo: '闽C88888',
      plateColor: '黄牌',
      carType: '大型车',
      drivingLicense: buildLicenseImage('闽C88888', '已认证'),
      applyTime: '2026-04-08 16:20:00',
      status: '已认证',
      auditorName: '李主管',
      auditTime: '2026-04-08 17:00:00',
      auditRemark: '认证通过',
      remark: '集团车辆个人补充认证',
      creator: '赵六',
      createTime: '2026-04-08 16:20:00',
      updateTime: '2026-04-08 17:00:00',
      authLogs: [
        {
          action: '发起认证',
          operator: '赵六',
          remark: '提交大型车资料',
          time: '2026-04-08 16:20:00',
        },
        {
          action: '审核通过',
          operator: '李主管',
          remark: '资料齐全，认证通过',
          time: '2026-04-08 17:00:00',
        },
      ],
    },
    {
      id: 5,
      userId: 5,
      userName: '孙七',
      phone: '13512345672',
      carId: 5,
      plateNo: '闽C23456',
      plateColor: '蓝牌',
      carType: '小型车',
      drivingLicense: buildLicenseImage('闽C23456', '待审核'),
      applyTime: '2026-04-15 08:40:00',
      status: '待审核',
      auditorName: '-',
      auditTime: '-',
      auditRemark: '',
      remark: '近期新增认证申请',
      creator: '孙七',
      createTime: '2026-04-15 08:40:00',
      updateTime: '2026-04-15 08:40:00',
      authLogs: [
        {
          action: '发起认证',
          operator: '孙七',
          remark: '上传认证资料',
          time: '2026-04-15 08:40:00',
        },
      ],
    },
  ];
}

export function buildStatsData(auths: PlateAuthRow[]) {
  const monthLabels = Array.from({ length: 6 }, (_, index) =>
    dayjs().subtract(5 - index, 'month').format('YYYY-MM'),
  );

  const trendMap = Object.fromEntries(monthLabels.map((item) => [item, 0]));

  auths.forEach((item) => {
    const key = dayjs(item.applyTime).format('YYYY-MM');
    if (key in trendMap) {
      trendMap[key] += 1;
    }
  });

  const authCount = auths.length;
  const passCount = auths.filter((item) => item.status === '已认证').length;
  const passRate = authCount === 0 ? 0 : Number((passCount / authCount).toFixed(2));

  return {
    cards: [
      {
        title: '认证量',
        value: authCount,
        desc: '点击数字可回到全部认证记录',
        color: '#2F80ED',
      },
      {
        title: '认证通过率',
        value: `${Math.round(passRate * 100)}%`,
        desc: '点击数字可查看认证通过记录',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '认证量趋势',
        type: 'line',
        xAxis: monthLabels,
        series: monthLabels.map((item) => trendMap[item]),
      },
    ],
  };
}

export function buildExportRows(auths: PlateAuthRow[]) {
  return auths.map((item) => ({
    所属用户: item.userName,
    绑定手机号: maskPhone(item.phone),
    车牌号码: item.plateNo,
    认证申请时间: item.applyTime,
    认证状态: item.status,
    审核人: item.auditorName,
    审核时间: item.auditTime,
    审核备注: item.auditRemark,
    备注: item.remark,
    创建人: item.creator,
    创建时间: item.createTime,
    更新时间: item.updateTime,
  }));
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'userId',
      label: '所属用户',
      component: 'Select',
      componentProps: {
        options: userOptions,
        placeholder: '请选择所属用户',
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
      fieldName: 'status',
      label: '认证状态',
      component: 'Select',
      componentProps: {
        options: statusOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择认证状态',
      },
    },
    {
      fieldName: 'applyTime',
      label: '申请时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions<PlateAuthRow>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'userName',
      title: '所属用户',
      minWidth: 120,
      slots: { default: 'userName' },
    },
    {
      field: 'plateNo',
      title: '车牌号码',
      minWidth: 130,
      slots: { default: 'plateNo' },
    },
    {
      field: 'drivingLicense',
      title: '行驶证信息',
      minWidth: 120,
      slots: { default: 'drivingLicense' },
    },
    {
      field: 'applyTime',
      title: '认证申请时间',
      minWidth: 170,
    },
    {
      field: 'status',
      title: '认证状态',
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
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
