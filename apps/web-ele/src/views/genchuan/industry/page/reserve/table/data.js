/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      用户ID: 'U1001',
      车场ID: 'P001',
      预约时段: '2025-01-15 08:00-12:00',
      泊位类型: '小型车',
      车牌号码: '闽A12345',
      预约订单号: 'ORD20250115001',
      预约码: 'RES8888',
      核验时间: '2025-01-15 08:05',
      取消原因: '',
      申请时间: '2025-01-14 20:30',
    },
    {
      用户ID: 'U1002',
      车场ID: 'P002',
      预约时段: '2025-01-16 14:00-18:00',
      泊位类型: '新能源',
      车牌号码: '闽B67890',
      预约订单号: 'ORD20250116002',
      预约码: 'RES9999',
      核验时间: '2025-01-16 14:10',
      取消原因: '行程变动',
      申请时间: '2025-01-15 22:15',
    },
    {
      用户ID: 'U1003',
      车场ID: 'P003',
      预约时段: '2025-01-17 10:00-16:00',
      泊位类型: '大型车',
      车牌号码: '闽C11223',
      预约订单号: 'ORD20250117003',
      预约码: 'RES7777',
      核验时间: '2025-01-17 10:20',
      取消原因: '',
      申请时间: '2025-01-16 18:45',
    },
    {
      用户ID: 'U1004',
      车场ID: 'P004',
      预约时段: '2025-01-18 13:00-17:00',
      泊位类型: '小型车',
      车牌号码: '闽D44556',
      预约订单号: 'ORD20250118004',
      预约码: 'RES6666',
      核验时间: '2025-01-18 13:05',
      取消原因: '车辆故障',
      申请时间: '2025-01-17 21:10',
    },
    {
      用户ID: 'U1005',
      车场ID: 'P005',
      预约时段: '2025-01-19 09:00-15:00',
      泊位类型: '新能源',
      车牌号码: '闽E77889',
      预约订单号: 'ORD20250119005',
      预约码: 'RES5555',
      核验时间: '2025-01-19 09:15',
      取消原因: '',
      申请时间: '2025-01-18 19:25',
    },
    {
      用户ID: 'U1006',
      车场ID: 'P006',
      预约时段: '2025-01-20 16:00-20:00',
      泊位类型: '小型车',
      车牌号码: '闽F99001',
      预约订单号: 'ORD20250120006',
      预约码: 'RES4444',
      核验时间: '2025-01-20 16:10',
      取消原因: '天气原因',
      申请时间: '2025-01-19 23:40',
    },
    {
      用户ID: 'U1007',
      车场ID: 'P007',
      预约时段: '2025-01-21 11:00-18:00',
      泊位类型: '大型车',
      车牌号码: '闽G22334',
      预约订单号: 'ORD20250121007',
      预约码: 'RES3333',
      核验时间: '2025-01-21 11:25',
      取消原因: '',
      申请时间: '2025-01-20 20:50',
    },
    {
      用户ID: 'U1008',
      车场ID: 'P008',
      预约时段: '2025-01-22 08:30-12:30',
      泊位类型: '小型车',
      车牌号码: '闽H55667',
      预约订单号: 'ORD20250122008',
      预约码: 'RES2222',
      核验时间: '2025-01-22 08:40',
      取消原因: '计划取消',
      申请时间: '2025-01-21 22:05',
    },
    {
      用户ID: 'U1009',
      车场ID: 'P009',
      预约时段: '2025-01-23 14:30-20:30',
      泊位类型: '新能源',
      车牌号码: '闽J88990',
      预约订单号: 'ORD20250123009',
      预约码: 'RES1111',
      核验时间: '2025-01-23 14:45',
      取消原因: '',
      申请时间: '2025-01-22 18:30',
    },
    {
      用户ID: 'U1010',
      车场ID: 'P010',
      预约时段: '2025-01-24 07:00-11:00',
      泊位类型: '小型车',
      车牌号码: '闽K00112',
      预约订单号: 'ORD20250124010',
      预约码: 'RES0000',
      核验时间: '2025-01-24 07:10',
      取消原因: '临时出差',
      申请时间: '2025-01-23 21:20',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: '用户ID',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      rules: 'required',
    },
    {
      fieldName: '车场ID',
      label: '车场ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车场ID',
      },
      rules: 'required',
    },
    {
      fieldName: '预约时段',
      label: '预约时段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预约时段',
      },
      rules: 'required',
    },
    {
      fieldName: '泊位类型',
      label: '泊位类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位类型',
      },
      rules: 'required',
    },
    {
      fieldName: '车牌号码',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: '预约订单号',
      label: '预约订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预约订单号',
      },
      rules: 'required',
    },
    {
      fieldName: '预约码',
      label: '预约码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预约码',
      },
      rules: 'required',
    },
    {
      fieldName: '核验时间',
      label: '核验时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入核验时间',
      },
      rules: 'required',
    },
    {
      fieldName: '取消原因',
      label: '取消原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入取消原因',
      },
    },
    {
      fieldName: '申请时间',
      label: '申请时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请时间',
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: '用户ID',
      title: '用户ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: '车场ID',
      title: '车场ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: '预约时段',
      title: '预约时段',
      minWidth: 180,
      sortable: true,
    },
    {
      field: '泊位类型',
      title: '泊位类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: '车牌号码',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: '预约订单号',
      title: '预约订单号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: '预约码',
      title: '预约码',
      minWidth: 100,
      sortable: true,
    },
    {
      field: '核验时间',
      title: '核验时间',
      minWidth: 140,
      sortable: true,
    },
    {
      field: '取消原因',
      title: '取消原因',
      minWidth: 150,
      sortable: true,
    },
    {
      field: '申请时间',
      title: '申请时间',
      minWidth: 140,
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

/** 文字描述对象 */
export const textObj = {
  editText: '编辑预约记录',
  addText: '新增预约记录',
  excelName: '预约记录列表',
  excelAllName: '全市预约记录数据.xlsx',
  total: ' 总计: 预约记录10条;已核验8条;取消预约2条',
}
