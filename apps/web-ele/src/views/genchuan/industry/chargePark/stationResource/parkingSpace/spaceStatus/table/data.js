export const pageConfig = {
  apiName: 'ParkingSpaceStatus',
  title: '车位状态',
  exportName: '车位状态数据.xlsx',
  importTemplateName: '车位状态导入模板.xlsx',
  nameField: 'spaceNo',
  primaryField: 'spaceNo',
  toolbar: ['import', 'export', 'refresh'],
  rowActionMap: {
    空闲: ['detail', 'locate'],
    占用: ['detail', 'locate'],
    故障: ['alarm', 'detail', 'locate'],
  },
  chart: {
    cards: [
      ['freeSpace', '空闲车位数', '空闲'],
      ['occupiedSpace', '占用车位数', '占用'],
      ['faultSpace', '故障车位数', '故障'],
      ['totalSpace', '监控车位数'],
    ],
    pie: ['pieData', 'name', 'count'],
    map: true,
  },
};

export const searchFields = [
  { field: 'spaceNo', label: '车位编号', type: 'input', required: false },
  { field: 'stationId', label: '所属场站ID', type: 'number', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: ['空闲', '占用', '故障'],
    required: false,
  },
];

export const formFields = [
  { field: 'spaceNo', label: '车位编号', type: 'input', required: false },
  { field: 'stationId', label: '所属场站ID', type: 'number', required: false },
  { field: 'deviceId', label: '设备ID', type: 'number', required: false },
  {
    field: 'lastReportTime',
    label: '最近上报时间',
    type: 'input',
    required: false,
  },
  { field: 'location', label: '定位信息', type: 'input', required: false },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
];

export const tableColumns = [
  { field: 'spaceNo', label: '车位编号', minWidth: 140, drillType: 'detail' },
  {
    field: 'stationId',
    label: '所属场站',
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  {
    field: 'deviceId',
    label: '设备ID',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '设备详情',
  },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
  {
    field: 'lastReportTime',
    label: '最近上报时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  {
    field: 'location',
    label: '定位信息',
    minWidth: 180,
    drillType: 'dialog',
    drillLabel: '地图定位',
  },
  {
    field: 'updateTime',
    label: '更新时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
];

export const detailFields = [
  { key: 'spaceNo', label: '车位编号', section: '基础信息' },
  { key: 'stationId', label: '所属场站ID', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'deviceId', label: '设备ID', section: '监控信息' },
  { key: 'lastReportTime', label: '最近上报时间', section: '监控信息' },
  { key: 'location', label: '定位信息', section: '监控信息' },
  { key: 'remark', label: '备注', section: '监控信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
