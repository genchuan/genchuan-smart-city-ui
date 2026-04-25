/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      carNo: '闽C12345',
      spaceName: 'A-01',
      stationName: '充电站1',
      inTime: Date.now() - 30 * 60 * 1000, // 30分钟前
      status: '正常在停',
      createTime: Date.now() - 30 * 60 * 1000,
    },
    {
      id: '002',
      carNo: '闽C67890',
      spaceName: 'A-02',
      stationName: '充电站1',
      inTime: Date.now() - 180 * 60 * 1000, // 3小时前
      status: '超时长在停',
      createTime: Date.now() - 180 * 60 * 1000,
    },
    {
      id: '003',
      carNo: '闽C11111',
      spaceName: 'A-03',
      stationName: '充电站1',
      inTime: Date.now() - 360 * 60 * 1000, // 6小时前
      status: '异常状态',
      createTime: Date.now() - 360 * 60 * 1000,
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'carNo',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      fieldName: 'spaceName',
      label: '车位名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位名称',
      },
    },
    {
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站名称',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常在停', value: '正常在停' },
          { label: '超时长在停', value: '超时长在停' },
          { label: '异常状态', value: '异常状态' },
        ],
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: 'ID',
      minWidth: 80,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'carNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'carNo' },
    },
    {
      field: 'spaceName',
      title: '车位',
      minWidth: 120,
      sortable: true,
      slots: { default: 'spaceName' },
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 120,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'inTime',
      title: '入场时间',
      minWidth: 160,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue).toLocaleString('zh-CN');
      },
    },
    {
      field: 'parkDuration',
      title: '在停时长',
      minWidth: 120,
      sortable: true,
      slots: { default: 'parkDuration' },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑在停状态',
  addText: '新增在停状态',
  excelName: '在停状态列表',
  excelAllName: '在停状态导出.xlsx',
  total: '总计: 记录3条; 正常在停1条; 超时长在停1条; 异常状态1条',
};

/** 状态类型映射 */
export const statusTypeMap = {
  正常在停: 'success',
  超时长在停: 'warning',
  异常状态: 'danger',
};

/** 超时长在停阈值（分钟） */
export const OVERTIME_THRESHOLD = 120; // 2小时

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: 'ID' },
  { key: 'carNo', label: '车牌号' },
  { key: 'spaceName', label: '车位名称' },
  { key: 'stationName', label: '场站名称' },
  {
    key: 'inTime',
    label: '入场时间',
    formatter: (val) => (val ? new Date(val).toLocaleString('zh-CN') : ''),
  },
  { key: 'status', label: '状态' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建者' },
  {
    key: 'createTime',
    label: '创建时间',
    formatter: (val) => (val ? new Date(val).toLocaleString('zh-CN') : ''),
  },
  { key: 'updater', label: '更新者' },
  {
    key: 'updateTime',
    label: '更新时间',
    formatter: (val) => (val ? new Date(val).toLocaleString('zh-CN') : ''),
  },
];

/** 告警表单配置 */
export function useAlarmFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'alarmContent',
      label: '告警内容',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入告警内容',
      },
      rules: 'required',
    },
  ];
}
