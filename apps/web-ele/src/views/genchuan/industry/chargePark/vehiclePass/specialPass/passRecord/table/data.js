/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车牌颜色',
        options: [
          { label: '蓝牌', value: '蓝牌' },
          { label: '黄牌', value: '黄牌' },
          { label: '绿牌', value: '绿牌' },
          { label: '白牌', value: '白牌' },
        ],
      },
    },
    {
      fieldName: 'passTime',
      label: '通行时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        placeholder: ['开始时间', '结束时间'],
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [
          { label: '1号场站', value: 1 },
          { label: '2号场站', value: 2 },
          { label: '3号场站', value: 3 },
        ],
      },
    },
    {
      fieldName: 'gateId',
      label: '闸机',
      component: 'Select',
      componentProps: {
        placeholder: '请选择闸机',
        options: [
          { label: '1号闸机', value: 1 },
          { label: '2号闸机', value: 2 },
          { label: '3号闸机', value: 3 },
        ],
      },
    },
    {
      fieldName: 'passType',
      label: '通行类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择通行类型',
        options: [
          { label: '正常通行', value: '正常通行' },
          { label: '特殊放行', value: '特殊放行' },
          { label: '异常通行', value: '异常通行' },
        ],
      },
    },
    {
      fieldName: 'checkStatus',
      label: '核查状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择核查状态',
        options: [
          { label: '未核查', value: '未核查' },
          { label: '已核查', value: '已核查' },
        ],
      },
    },
    {
      fieldName: 'operator',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人',
      },
    },
  ];
}

/** 核查表单配置 */
export function useCheckFormSchema() {
  return [
    {
      fieldName: 'checkResult',
      label: '核查结果',
      component: 'Select',
      rules: [{ required: true, message: '请选择核查结果' }],
      componentProps: {
        placeholder: '请选择核查结果',
        options: [
          { label: '正常', value: '正常' },
          { label: '异常', value: '异常' },
        ],
      },
    },
    {
      fieldName: 'checkRemark',
      label: '核查备注',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入核查备注',
        rows: 4,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'plateNo',
      title: '车牌号',
      minWidth: 120,
      fixed: 'left',
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'plateColor',
      title: '车牌颜色',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'passTime',
      title: '通行时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 120,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'gateName',
      title: '闸机',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'passType',
      title: '通行类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'passType' },
    },
    {
      field: 'passReason',
      title: '通行原因',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'operator' },
    },
    {
      field: 'checkStatus',
      title: '核查状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'checkStatus' },
    },
    {
      field: 'checkTime',
      title: '核查时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'checker',
      title: '核查人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  excelName: '放行记录',
  excelAllName: '放行记录导出.xlsx',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'plateNo', label: '车牌号' },
  { key: 'plateColor', label: '车牌颜色' },
  { key: 'passTime', label: '通行时间' },
  { key: 'stationName', label: '场站' },
  { key: 'gateName', label: '闸机' },
  { key: 'passType', label: '通行类型' },
  { key: 'passReason', label: '通行原因' },
  { key: 'operator', label: '操作人' },
  { key: 'checkStatus', label: '核查状态' },
  { key: 'checkTime', label: '核查时间' },
  { key: 'checker', label: '核查人' },
  { key: 'checkRemark', label: '核查备注' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '更新人' },
  { key: 'updateTime', label: '更新时间' },
];

/** 模拟详情数据 */
export const mockDetailData = {
  id: 1,
  plateNo: '粤B12345',
  plateColor: '蓝牌',
  passTime: '2024-04-24 10:30:00',
  stationId: 1,
  stationName: '1号场站',
  gateId: 1,
  gateName: '1号闸机',
  passType: '特殊放行',
  passReason: '临时通行',
  operator: '张三',
  checkStatus: '已核查',
  checkTime: '2024-04-24 11:00:00',
  checker: '李四',
  checkRemark: '核查正常',
  remark: '临时通行申请',
  creator: '系统',
  createTime: '2024-04-24 10:30:00',
  updater: '李四',
  updateTime: '2024-04-24 11:00:00',
};

/** 核查状态类型映射 */
export const checkStatusTypeMap = {
  未核查: 'warning',
  已核查: 'success',
};
