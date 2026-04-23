export const pageConfig = {
  apiName: 'AreaInfo',
  title: '片区信息',
  exportName: '片区信息数据.xlsx',
  nameField: 'name',
  primaryField: 'areaNo',
  toolbar: ['create', 'import', 'export'],
  rowActionMap: {
    "未生效": ['enable', 'edit', 'detail'],
    "已生效": ['disable', 'edit', 'detail'],
    "已禁用": ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['totalArea', '总片区数'],
      ['enableArea', '已生效片区数', '已生效'],
      ['disableArea', '已禁用片区数', '已禁用'],
      ['totalStation', '覆盖场站数'],
    ],
    bar: ['barData', 'name', 'stationCount', '关联场站数'],
    map: true,
  },
};

export const searchFields = [
  { field: 'name', label: '片区名称', type: 'input', required: false },
  { field: 'leaderName', label: '负责人', type: 'input', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: ['未生效', '已生效', '已禁用'],
    required: false,
  },
  { field: 'areaId', label: '所在地区', type: 'areaSelect', required: false },
];

export const formFields = [
  { field: 'areaNo', label: '片区编号', type: 'input', required: true },
  { field: 'name', label: '片区名称', type: 'input', required: true },
  {
    field: 'parentId',
    label: '上级片区',
    type: 'select',
    options: [],
    required: false,
  },
  {
    field: 'areaId',
    label: '所在地区',
    type: 'areaSelect',
    required: true,
    placeholder: '请选择省/市/区',
  },
  { field: 'address', label: '详细地址', type: 'input', required: true },
  { field: 'leaderName', label: '负责人', type: 'input', required: true },
  {
    field: 'phone',
    label: '联系电话',
    type: 'input',
    required: true,
    placeholder: '请输入手机号或座机号',
  },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
];

export const tableColumns = [
  { field: 'areaNo', label: '片区编号', minWidth: 140, drillType: 'detail' },
  { field: 'name', label: '片区名称', minWidth: 160, drillType: 'filter' },
  {
    field: 'parentId',
    label: '上级片区',
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '上级片区详情',
  },
  { field: 'province', label: '省份', minWidth: 120, drillType: 'filter' },
  { field: 'city', label: '城市', minWidth: 120, drillType: 'filter' },
  { field: 'district', label: '区县', minWidth: 120, drillType: 'filter' },
  { field: 'address', label: '详细地址', minWidth: 220 },
  { field: 'leaderName', label: '负责人', minWidth: 140, drillType: 'filter' },
  { field: 'phone', label: '联系电话', minWidth: 150 },
  {
    field: 'stationCount',
    label: '覆盖场站数',
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '该片区场站列表',
  },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
  { field: 'remark', label: '备注', minWidth: 150 },
  { field: 'creator', label: '创建者', minWidth: 120, drillType: 'filter' },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'updater', label: '更新者', minWidth: 120, drillType: 'filter' },
  {
    field: 'updateTime',
    label: '更新时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
];

export const detailFields = [
  { key: 'id', label: 'ID', section: '基础信息' },
  { key: 'areaNo', label: '片区编号', section: '基础信息' },
  { key: 'name', label: '片区名称', section: '基础信息' },
  { key: 'parentName', label: '上级片区', section: '基础信息' },
  { key: 'province', label: '省份', section: '区域信息' },
  { key: 'city', label: '城市', section: '区域信息' },
  { key: 'district', label: '区县', section: '区域信息' },
  { key: 'address', label: '详细地址', section: '区域信息' },
  { key: 'leaderName', label: '负责人', section: '联系信息' },
  { key: 'phone', label: '联系电话', section: '联系信息' },
  { key: 'stationCount', label: '覆盖场站数', section: '统计信息' },
  { key: 'remark', label: '备注', section: '详细信息' },
  { key: 'status', label: '状态', section: '状态信息' },
  { key: 'creator', label: '创建者', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新者', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
