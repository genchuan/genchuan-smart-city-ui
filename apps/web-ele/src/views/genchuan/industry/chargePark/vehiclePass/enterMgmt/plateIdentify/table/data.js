/** 车牌识别表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 'PI001',
      stationName: '芗城区XX社区停车场',
      plateNo: '闽E12345',
      success: '是',
      imageUrl: 'https://example.com/image1.jpg',
      errorMsg: '',
      identifyTime: '2025-04-18 08:30:10',
      remark: '',
      creator: '系统',
      createTime: '2025-04-18 08:30:15',
    },
    {
      id: 'PI002',
      stationName: '龙文区碧湖公园停车场',
      plateNo: '闽E67890',
      success: '是',
      imageUrl: 'https://example.com/image2.jpg',
      errorMsg: '',
      identifyTime: '2025-04-18 09:15:25',
      remark: '',
      creator: '系统',
      createTime: '2025-04-18 09:15:30',
    },
    {
      id: 'PI003',
      stationName: '龙海区石码镇停车场',
      plateNo: '',
      success: '否',
      imageUrl: 'https://example.com/image3.jpg',
      errorMsg: '车牌模糊无法识别',
      identifyTime: '2025-04-18 10:20:40',
      remark: '需人工处理',
      creator: '系统',
      createTime: '2025-04-18 10:20:45',
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
      fieldName: 'status',
      label: '识别结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择识别结果',
        options: [
          { label: '是', value: '是' },
          { label: '否', value: '否' },
        ],
      },
    },
    {
      fieldName: 'identifyTime',
      label: '识别时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择识别时间',
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
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
    },
    {
      fieldName: 'imageUrl',
      label: '识别图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入图片地址',
      },
    },
    {
      fieldName: 'identifyTime',
      label: '识别时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择识别时间',
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

/** 车牌识别表格列配置 */
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
      field: 'plateNo',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: '识别结果',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'imageUrl',
      title: '识别图片',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'errorMsg',
      title: '错误信息',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'identifyTime',
      title: '识别时间',
      minWidth: 180,
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
  editText: '编辑车牌识别',
  addText: '新增车牌识别',
  excelName: '车牌识别列表',
  excelAllName: '车牌识别数据.xlsx',
  total: '总计: 识别记录3条; 成功2条; 失败1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '编号' },
  { key: 'stationName', label: '场站名称' },
  { key: 'plateNo', label: '车牌号码' },
  { key: 'status', label: '识别结果' },
  { key: 'imageUrl', label: '识别图片' },
  { key: 'errorMsg', label: '错误信息' },
  { key: 'identifyTime', label: '识别时间' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
];
