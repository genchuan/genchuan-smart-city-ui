/** 入场记录表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      plateNo: '闽E12345',
      plateColor: '蓝牌',
      spaceNo: 'A-101',
      enterTime: '2025-04-18 08:30:15',
      recordType: '自动识别',
      status: '正常记录',
      stationId: 1,
      stationName: '充电站1',
      remark: '',
      proofImage: '',
      isCorrected: false,
      creator: 'admin',
      createTime: '2025-04-18 08:30:15',
      updateTime: '2025-04-18 08:30:15',
    },
    {
      id: 2,
      plateNo: '闽E67890',
      plateColor: '黄牌',
      spaceNo: 'B-205',
      enterTime: '2025-04-18 09:15:30',
      recordType: '自动识别',
      status: '正常记录',
      stationId: 2,
      stationName: '充电站2',
      remark: '',
      proofImage: '',
      isCorrected: false,
      creator: 'admin',
      createTime: '2025-04-18 09:15:30',
      updateTime: '2025-04-18 09:15:30',
    },
    {
      id: 3,
      plateNo: '闽E11111',
      plateColor: '蓝牌',
      spaceNo: 'C-308',
      enterTime: '2025-04-18 10:20:45',
      recordType: '人工补录',
      status: '异常记录',
      stationId: 3,
      stationName: '充电站3',
      remark: '车牌识别失败，人工放行',
      proofImage: '',
      isCorrected: false,
      creator: 'admin',
      createTime: '2025-04-18 10:20:45',
      updateTime: '2025-04-18 10:20:45',
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
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车牌颜色',
        options: [
          { label: '蓝牌', value: '蓝牌' },
          { label: '黄牌', value: '黄牌' },
          { label: '绿牌', value: '绿牌' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
    },
    {
      fieldName: 'recordType',
      label: '记录类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录类型',
        options: [
          { label: '自动识别', value: '自动识别' },
          { label: '人工补录', value: '人工补录' },
        ],
      },
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
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
      fieldName: 'isCorrected',
      label: '修正状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择修正状态',
        options: [
          { label: '未修正', value: false },
          { label: '已修正', value: true },
        ],
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'X',
      },
    },
  ];
}

/** 新增表单配置 */
export function useCreateFormSchema() {
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
        placeholder: '请选择车牌颜色',
        options: [
          { label: '蓝牌', value: '蓝牌' },
          { label: '黄牌', value: '黄牌' },
          { label: '绿牌', value: '绿牌' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'X',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'recordType',
      label: '记录类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录类型',
        options: [{ label: '人工补录', value: '人工补录' }],
      },
      rules: 'required',
      defaultValue: '人工补录',
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'stationId',
      label: '场站ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入场站ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'proofImage',
      label: '佐证图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入佐证图片地址',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 3,
      },
    },
  ];
}

/** 编辑表单配置 */
export function useUpdateFormSchema() {
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
        placeholder: '请选择车牌颜色',
        options: [
          { label: '蓝牌', value: '蓝牌' },
          { label: '黄牌', value: '黄牌' },
          { label: '绿牌', value: '绿牌' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'X',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'recordType',
      label: '记录类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录类型',
        options: [
          { label: '自动识别', value: '自动识别' },
          { label: '人工补录', value: '人工补录' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'stationId',
      label: '场站ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入场站ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'proofImage',
      label: '佐证图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入佐证图片地址',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 3,
      },
    },
  ];
}

/** 修正表单配置 */
export function useCorrectFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入正确的车牌号码',
      },
      rules: 'required',
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
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'X',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'stationId',
      label: '场站ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入场站ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'proofImage',
      label: '佐证图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入佐证图片地址',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入修正备注',
        rows: 3,
      },
    },
  ];
}

/** 入场记录表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '记录ID',
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
      field: 'plateColor',
      title: '车牌颜色',
      minWidth: 100,
      sortable: true,
      slots: { default: 'plateColor' },
    },
    {
      field: 'spaceNo',
      title: '车位编号',
      minWidth: 120,
      sortable: true,
      slots: { default: 'spaceNo' },
    },
    {
      field: 'enterTime',
      title: '入场时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'recordType',
      title: '记录类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'recordType' },
    },
    {
      field: 'status',
      title: '记录状态',
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
      field: 'isCorrected',
      title: '修正标记',
      minWidth: 100,
      sortable: true,
      slots: { default: 'isCorrected' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑入场记录',
  addText: '补录入场记录',
  excelName: '入场记录列表',
  excelAllName: '入场记录数据.xlsx',
  total: '总计: 入场记录3条; 正常2条; 异常1条',
};

/** 状态类型映射 */
export const statusTypeMap = {
  正常记录: 'success',
  异常记录: 'danger',
};

/** 记录类型映射 */
export const recordTypeMap = {
  自动识别: 'success',
  人工补录: 'warning',
};

/** 车牌颜色类型映射 */
export const plateColorTypeMap = {
  蓝牌: 'primary',
  黄牌: 'warning',
  绿牌: 'success',
  其他: 'info',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '记录ID' },
  { key: 'plateNo', label: '车牌号' },
  { key: 'plateColor', label: '车牌颜色' },
  { key: 'spaceNo', label: '车位编号' },
  { key: 'enterTime', label: '入场时间' },
  { key: 'recordType', label: '记录类型' },
  { key: 'status', label: '记录状态' },
  { key: 'stationName', label: '场站' },
  { key: 'proofImage', label: '佐证图片' },
  {
    key: 'isCorrected',
    label: '是否已修正',
    formatter: (val) => (val ? '是' : '否'),
  },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
];
