/** 入场记录表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 'ER001',
      stationName: '芗城区XX社区停车场',
      spaceId: 'A-101',
      plateNo: '闽E12345',
      inTime: '2025-04-18 08:30:15',
      gateId: 'G001',
      operatorId: 'OP001',
      status: '正常',
      remark: '',
    },
    {
      id: 'ER002',
      stationName: '龙文区碧湖公园停车场',
      spaceId: 'B-205',
      plateNo: '闽E67890',
      inTime: '2025-04-18 09:15:30',
      gateId: 'G002',
      operatorId: 'OP002',
      status: '正常',
      remark: '',
    },
    {
      id: 'ER003',
      stationName: '龙海区石码镇停车场',
      spaceId: 'C-308',
      plateNo: '闽E11111',
      inTime: '2025-04-18 10:20:45',
      gateId: 'G003',
      operatorId: 'OP001',
      status: '异常',
      remark: '车牌识别失败，人工放行',
    },
    {
      id: 'ER004',
      stationName: '芗城区江滨路停车场',
      spaceId: 'D-412',
      plateNo: '闽E22222',
      inTime: '2025-04-18 11:05:20',
      gateId: 'G004',
      operatorId: 'OP003',
      status: '正常',
      remark: '',
    },
    {
      id: 'ER005',
      stationName: '龙文区万达商圈停车场',
      spaceId: 'E-520',
      plateNo: '闽E33333',
      inTime: '2025-04-18 12:30:10',
      gateId: 'G005',
      operatorId: 'OP002',
      status: '正常',
      remark: '',
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站名称',
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
      fieldName: 'spaceId',
      label: '车位ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位ID',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '异常', value: '异常' },
        ],
      },
    },
    {
      fieldName: 'inTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
    },
  ];
}

/** 新增表单配置 */
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceId',
      label: '车位ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位ID',
      },
      rules: 'required',
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
      fieldName: 'inTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'gateId',
      label: '闸机ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入闸机ID',
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
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceId',
      label: '车位ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位ID',
      },
      rules: 'required',
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
      fieldName: 'inTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '异常', value: '异常' },
        ],
      },
      rules: 'required',
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
      fieldName: 'inTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      rules: 'required',
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

/** 入场记录表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '编号',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'stationName',
      title: '场站名称',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'spaceId',
      title: '车位ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'plateNo',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'inTime',
      title: '入场时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'gateId',
      title: '闸机ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'operatorId',
      title: '操作人ID',
      minWidth: 110,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑入场记录',
  addText: '新增入场记录',
  excelName: '入场记录列表',
  excelAllName: '入场记录数据.xlsx',
  total: '总计: 入场记录5条; 正常4条; 异常1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '编号' },
  { key: 'stationName', label: '场站名称' },
  { key: 'spaceId', label: '车位ID' },
  { key: 'plateNo', label: '车牌号码' },
  { key: 'inTime', label: '入场时间' },
  { key: 'gateId', label: '闸机ID' },
  { key: 'operatorId', label: '操作人ID' },
  { key: 'status', label: '状态' },
  { key: 'remark', label: '备注' },
];
