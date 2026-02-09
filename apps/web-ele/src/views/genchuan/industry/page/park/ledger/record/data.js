/** 停车场入场记录的搜索表单（适配表格字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'orderCode', // 对应表格orderCode字段
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'carNumber', // 对应表格carNumber字段
      label: '车牌号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      fieldName: 'lotId', // 对应表格lotId字段
      label: '车场ID',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入车场ID',
      },
    },
    {
      fieldName: 'spaceId', // 对应表格spaceId字段
      label: '停车泊位ID',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入停车泊位ID',
      },
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        valueFormat: 'x',
        style: { width: '100%' },
      },
      fieldName: 'entryTime', // 对应表格entryTime字段
      label: '入场时间',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        valueFormat: 'x',
        style: { width: '100%' },
      },
      fieldName: 'exitTime', // 对应表格exitTime字段
      label: '出场时间',
    },
    {
      fieldName: 'parkingDuration', // 对应表格parkingDuration字段
      label: '停车时长',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入停车时长（如：1小时30分）',
      },
    },
    {
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入应收金额',
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
      fieldName: 'originalAmount', // 对应表格originalAmount字段
      label: '应收金额',
    },
    {
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入订单优惠金额',
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
      fieldName: 'discountAmount', // 对应表格discountAmount字段
      label: '订单优惠金额',
    },
    {
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入用户实际支付金额',
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
      fieldName: 'payAmount', // 对应表格payAmount字段
      label: '用户实际支付金额',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        placeholder: '请选择订单状态',
        showSearch: true,
        // 订单状态选项可根据实际业务调整值和标签
        options: [
          { label: '待支付', value: '待支付' },
          { label: '已支付', value: '已支付' },
        ],
      },
      fieldName: 'orderStatus', // 对应表格orderStatus字段
      label: '订单状态',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        placeholder: '请选择支付状态',
        showSearch: true,
        // 支付状态选项可根据实际业务调整值和标签
        options: [
          { label: '未支付', value: '未支付' },
          { label: '已支付', value: '已支付' },
        ],
      },
      fieldName: 'payStatus', // 对应表格payStatus字段
      label: '支付状态',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        placeholder: '请选择支付方式',
        showSearch: true,
        options: [{ label: '钱包', value: '钱包' }],
      },
      fieldName: 'payType', // 对应表格payType字段（原payMethod改为payType匹配表格）
      label: '支付方式',
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'orderCode',
      title: '订单编号',
      minWidth: 200,
      sortable: true,
      slots: { default: 'orderCode' },
    },
    {
      field: 'carNumber',
      title: '车牌',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'lotId',
      title: '车场ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'spaceId',
      title: '停车泊位ID',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'entryTime',
      title: '入场时间',
      minWidth: 150,
      sortable: true,
      slots: { default: 'entryTime' },
    },
    {
      field: 'exitTime',
      title: '出场时间',
      minWidth: 150,
      sortable: true,
      slots: { default: 'exitTime' },
    },
    {
      field: 'parkingDuration',
      title: '停车时长',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'originalAmount',
      title: '应收金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'discountAmount',
      title: '订单优惠金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'payAmount',
      title: '用户实际支付金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'orderStatus',
      title: '订单状态',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'payStatus',
      title: '支付状态',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'payType',
      title: '支付方式',
      minWidth: 100,
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

/** 文字描述对象 */
export const textObj = {
  editText: '',
  addText: '',
  excelName: '',
  excelAllName: '全市停车场数据.xlsx',
  total: '停车场数量10;车位总数:1211;车场车位7',
};
