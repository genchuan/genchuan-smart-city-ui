/** 油车处置表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      plateNo: '闽C12345',
      spaceId: 1,
      spaceName: 'A-01',
      identifyTime: Date.now() - 1 * 60 * 60 * 1000,
      occupyType: '燃油车占位',
      status: '未处理',
      stationId: 1,
      stationName: '充电站1',
      handleUserId: null,
      handleUserName: null,
      handleTime: null,
      handleMethod: null,
      handleProgress: null,
      ignoreReason: null,
      remark: '',
      creator: 'admin',
      createTime: Date.now() - 1 * 60 * 60 * 1000,
      updateTime: Date.now() - 1 * 60 * 60 * 1000,
    },
    {
      id: 2,
      plateNo: '闽C67890',
      spaceId: 2,
      spaceName: 'A-02',
      identifyTime: Date.now() - 3 * 60 * 60 * 1000,
      occupyType: '燃油车占位',
      status: '处理中',
      stationId: 2,
      stationName: '充电站2',
      handleUserId: 1,
      handleUserName: '张三',
      handleTime: Date.now() - 30 * 60 * 1000,
      handleMethod: '电话通知车主挪车',
      handleProgress: '已通知车主，等待挪车',
      ignoreReason: null,
      remark: '',
      creator: 'admin',
      createTime: Date.now() - 3 * 60 * 60 * 1000,
      updateTime: Date.now() - 30 * 60 * 1000,
    },
    {
      id: 3,
      plateNo: '闽C11111',
      spaceId: 3,
      spaceName: 'A-03',
      identifyTime: Date.now() - 12 * 60 * 60 * 1000,
      occupyType: '燃油车占位',
      status: '已关闭',
      stationId: 3,
      stationName: '充电站3',
      handleUserId: 2,
      handleUserName: '李四',
      handleTime: Date.now() - 6 * 60 * 60 * 1000,
      handleMethod: '现场劝离',
      handleProgress: '车主已挪车',
      ignoreReason: null,
      remark: '已处理完成',
      creator: 'admin',
      createTime: Date.now() - 12 * 60 * 60 * 1000,
      updateTime: Date.now() - 6 * 60 * 60 * 1000,
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
    },
    {
      fieldName: 'occupyType',
      label: '占位类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择占位类型',
        options: [
          { label: '燃油车占位', value: '燃油车占位' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'status',
      label: '处置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置状态',
        options: [
          { label: '未处理', value: '未处理' },
          { label: '处理中', value: '处理中' },
          { label: '已关闭', value: '已关闭' },
        ],
      },
    },
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站ID',
      },
    },
    {
      fieldName: 'identifyTime',
      label: '识别时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择识别时间',
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'X',
      },
    },
  ];
}

/** 处置表单配置 */
export function useHandleFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'handleMethod',
      label: '处置方式',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入处置方式',
      },
      rules: 'required',
    },
  ];
}

/** 忽略表单配置 */
export function useIgnoreFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'ignoreReason',
      label: '忽略理由',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入忽略理由（至少10个字）',
        minlength: 10,
      },
      rules: [
        { required: true, message: '请输入忽略理由' },
        { min: 10, message: '忽略理由至少10个字' },
      ],
    },
  ];
}

/** 更新进度表单配置 */
export function useUpdateProgressFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'handleProgress',
      label: '处置进度',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入处置进度',
      },
      rules: 'required',
    },
  ];
}

/** 油车处置表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '处置ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'spaceName',
      title: '车位',
      minWidth: 100,
      sortable: true,
      slots: { default: 'spaceName' },
    },
    {
      field: 'identifyTime',
      title: '识别时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue).toLocaleString('zh-CN');
      },
    },
    {
      field: 'occupyType',
      title: '占位类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'occupyType' },
    },
    {
      field: 'status',
      title: '处置状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 120,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'handleUserName',
      title: '处置人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'handleUserName' },
    },
    {
      field: 'handleTime',
      title: '处置时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '-';
        return new Date(cellValue).toLocaleString('zh-CN');
      },
    },
    {
      field: 'handleMethod',
      title: '处置方式',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑油车处置',
  addText: '新增油车处置',
  excelName: '油车处置列表',
  excelAllName: '油车处置数据.xlsx',
  total: '总计: 处置记录3条; 未处理1条; 处理中1条; 已关闭1条',
};

/** 状态类型映射 */
export const statusTypeMap = {
  未处理: 'danger',
  处理中: 'warning',
  已关闭: 'success',
};

/** 占位类型映射 */
export const occupyTypeMap = {
  燃油车占位: 'danger',
  其他: 'warning',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '处置ID' },
  { key: 'plateNo', label: '车牌号' },
  { key: 'spaceName', label: '车位' },
  {
    key: 'identifyTime',
    label: '识别时间',
    formatter: (val) => (val ? new Date(val).toLocaleString('zh-CN') : ''),
  },
  { key: 'occupyType', label: '占位类型' },
  { key: 'status', label: '处置状态' },
  { key: 'stationName', label: '场站' },
  { key: 'handleUserName', label: '处置人' },
  {
    key: 'handleTime',
    label: '处置时间',
    formatter: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
  },
  { key: 'handleMethod', label: '处置方式' },
  { key: 'handleProgress', label: '处置进度' },
  { key: 'ignoreReason', label: '忽略理由' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建者' },
  {
    key: 'createTime',
    label: '创建时间',
    formatter: (val) => (val ? new Date(val).toLocaleString('zh-CN') : ''),
  },
  {
    key: 'updateTime',
    label: '更新时间',
    formatter: (val) => (val ? new Date(val).toLocaleString('zh-CN') : ''),
  },
];
