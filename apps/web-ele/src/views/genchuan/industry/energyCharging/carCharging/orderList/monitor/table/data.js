/** 表格初始数据 - 充电桩订单统计分析数据 */
export const dataList = () => [
  {
    order_code: 'OD20240501001',
    user_id: 'U10001',
    car_no: '闽A88888',
    pile_id: 'PL2024001',
    station_id: '星星充电平台',
    charge_hour: 2.5,
    charge_elec: 45.2,
    amount: 89.5,
    pay_type: '微信支付',
    pay_time: '2024-05-01 10:25:30',
    status: '已完成',
    create_time: '2024-05-01 08:00:15'
  },
  {
    order_code: 'OD20240501002',
    user_id: 'U10002',
    car_no: '闽A99999',
    pile_id: 'PL2024002',
    station_id: '星星充电平台',
    charge_hour: 1.8,
    charge_elec: 32.5,
    amount: 64.2,
    pay_type: '支付宝',
    pay_time: '2024-05-01 14:10:20',
    status: '已完成',
    create_time: '2024-05-01 12:30:05'
  },
  {
    order_code: 'OD20240501003',
    user_id: 'U10003',
    car_no: '闽A77777',
    pile_id: 'PL2024003',
    station_id: '国家电网充电桩',
    charge_hour: 3.2,
    charge_elec: 58.8,
    amount: 116.5,
    pay_type: '银联支付',
    pay_time: '2024-05-01 16:45:10',
    status: '已完成',
    create_time: '2024-05-01 13:20:40'
  },
  {
    order_code: 'OD20240501004',
    user_id: 'U10004',
    car_no: '闽A66666',
    pile_id: 'PL2024004',
    station_id: '国家电网充电桩',
    charge_hour: 0.9,
    charge_elec: 16.7,
    amount: 33.0,
    pay_type: '微信支付',
    pay_time: '2024-05-01 09:15:55',
    status: '已取消',
    create_time: '2024-05-01 08:30:25'
  },
  {
    order_code: 'OD20240501005',
    user_id: 'U10005',
    car_no: '闽A55555',
    pile_id: 'PL2024005',
    station_id: '特来电充电桩平台',
    charge_hour: 4.1,
    charge_elec: 75.3,
    amount: 149.0,
    pay_type: '支付宝',
    pay_time: '2024-05-01 20:30:18',
    status: '已完成',
    create_time: '2024-05-01 16:20:10'
  },
  {
    order_code: 'OD20240501006',
    user_id: 'U10006',
    car_no: '闽A44444',
    pile_id: 'PL2024006',
    station_id: '特来电充电桩平台',
    charge_hour: 2.7,
    charge_elec: 48.9,
    amount: 96.8,
    pay_type: '现金',
    pay_time: '2024-05-01 11:50:45',
    status: '待支付',
    create_time: '2024-05-01 09:20:30'
  },
  {
    order_code: 'OD20240501007',
    user_id: 'U10007',
    car_no: '闽A33333',
    pile_id: 'PL2024007',
    station_id: '星星充电平台',
    charge_hour: 1.5,
    charge_elec: 27.4,
    amount: 54.2,
    pay_type: '微信支付',
    pay_time: '2024-05-01 17:20:12',
    status: '已完成',
    create_time: '2024-05-01 15:50:05'
  },
  {
    order_code: 'OD20240501008',
    user_id: 'U10008',
    car_no: '闽A22222',
    pile_id: 'PL2024008',
    station_id: '国家电网充电桩',
    charge_hour: 3.5,
    charge_elec: 62.1,
    amount: 122.8,
    pay_type: '支付宝',
    pay_time: '2024-05-01 21:15:30',
    status: '已完成',
    create_time: '2024-05-01 17:45:18'
  },
  {
    order_code: 'OD20240501009',
    user_id: 'U10009',
    car_no: '闽A11111',
    pile_id: 'PL2024009',
    station_id: '特来电充电桩平台',
    charge_hour: 2.2,
    charge_elec: 39.8,
    amount: 78.6,
    pay_type: '银联支付',
    pay_time: '2024-05-01 13:40:25',
    status: '已完成',
    create_time: '2024-05-01 11:20:10'
  },
  {
    order_code: 'OD20240501010',
    user_id: 'U10010',
    car_no: '闽A00000',
    pile_id: 'PL2024010',
    station_id: '星星充电平台',
    charge_hour: 1.1,
    charge_elec: 20.5,
    amount: 40.5,
    pay_type: '微信支付',
    pay_time: '2024-05-01 07:30:40',
    status: '已取消',
    create_time: '2024-05-01 06:20:05'
  }
];

/** 新增/修改的表单/列表的搜索表单 - 充电桩订单统计分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'order_code',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'user_id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'car_no',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'pile_id',
      label: '充电桩编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充电桩编号',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'station_id',
      label: '所属场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属场站',
        options: [
          { label: '星星充电平台', value: '星星充电平台' },
          { label: '国家电网充电桩', value: '国家电网充电桩' },
          { label: '特来电充电桩平台', value: '特来电充电桩平台' }
        ]
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'charge_hour',
      label: '充电时长',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入充电时长（小时）',
        min: 0,
        precision: 1,
        addonAfter: '小时'
      },
      rules: 'required',
    },
    {
      fieldName: 'charge_elec',
      label: '充电量',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入充电量（度）',
        min: 0,
        precision: 1,
        addonAfter: '度'
      },
      rules: 'required',
    },
    {
      fieldName: 'amount',
      label: '订单金额',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入订单金额（元）',
        min: 0,
        precision: 1,
        addonAfter: '元'
      },
      rules: 'required',
    },
    {
      fieldName: 'pay_type',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '微信支付', value: '微信支付' },
          { label: '支付宝', value: '支付宝' },
          { label: '银联支付', value: '银联支付' },
          { label: '现金', value: '现金' }
        ]
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'pay_time',
      label: '支付时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择支付时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '订单状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单状态',
        options: [
          { label: '已完成', value: '已完成' },
          { label: '待支付', value: '待支付' },
          { label: '已取消', value: '已取消' }
        ]
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'create_time',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      labelWidth: '130',
      rules: 'required',
    }
  ];
}

/** 表格字段 - 充电桩订单统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'order_code',
      title: '订单编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'order_code' },

    },
    {
      field: 'user_id',
      title: '用户ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'car_no',
      title: '车牌号',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'pile_id',
      title: '充电桩编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'pile_id' },

    },
    {
      field: 'station_id',
      title: '所属场站',
      minWidth: 180,
      sortable: true,
      slots: { default: 'station_id' },

    },
    {
      field: 'charge_hour',
      title: '充电时长(小时)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'charge_elec',
      title: '充电量(度)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'amount',
      title: '订单金额(元)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'pay_type',
      title: '支付方式',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'pay_time',
      title: '支付时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'status',
      title: '订单状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
