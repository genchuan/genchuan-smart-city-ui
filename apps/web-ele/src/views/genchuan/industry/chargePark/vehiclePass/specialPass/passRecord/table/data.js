/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      stationName: '芗城区XX社区停车场',
      plateNo: '闽E12345',
      status: '正常',
      remark: '',
      createTime: '2025-04-18 08:30:15',
    },
    {
      id: '002',
      stationName: '龙文区碧湖公园停车场',
      plateNo: '闽E67890',
      status: '正常',
      remark: '',
      createTime: '2025-04-18 09:15:30',
    },
    {
      id: '003',
      stationName: '龙海区石码镇停车场',
      plateNo: '闽E11111',
      status: '异常',
      remark: '需要处理',
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
  ];
}

/** 表格列配置 */
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
      field: 'createTime',
      title: '创建时间',
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
  editText: '编辑记录',
  addText: '新增记录',
  excelName: '数据列表',
  excelAllName: '数据导出.xlsx',
  total: '总计: 记录3条; 正常2条; 异常1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '编号' },
  { key: 'stationName', label: '场站名称' },
  { key: 'plateNo', label: '车牌号码' },
  { key: 'status', label: '状态' },
  { key: 'remark', label: '备注' },
  { key: 'createTime', label: '创建时间' },
];
