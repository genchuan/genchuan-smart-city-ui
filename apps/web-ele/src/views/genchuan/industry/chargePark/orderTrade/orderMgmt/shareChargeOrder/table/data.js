/** 设备借出订单搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入主键ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'orderNo',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单编号',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入用户ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'userNickname',
      label: '用户昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户昵称',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'lendTime',
      label: '借出时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择借出时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'returnTime',
      label: '归还时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择归还时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'actualDuration',
      label: '实际使用时长（分钟）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入实际使用时长',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'amount',
      label: '订单金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入订单金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'status',
      label: '订单状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择订单状态',
        options: [
          { label: '已完成', value: 'completed' },
          { label: '未支付', value: 'unpaid' },
          { label: '已取消', value: 'cancelled' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'createOrderTime',
      label: '订单生成时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择订单生成时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'stationId',
      label: '所属场站ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入所属场站ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'payMethod',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '支付宝', value: 'alipay' },
          { label: '微信支付', value: 'wechat' },
          { label: '现金', value: 'cash' },
        ],
      },
      labelWidth: 120,
    },
    {
      fieldName: 'discountAmount',
      label: '优惠抵扣金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入优惠抵扣金额',
        precision: 2,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'archiveTime',
      label: '归档时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择归档时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'operatorId',
      label: '操作人ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入操作人ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'reserve1',
      label: '备用字段1',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备用字段1',
        maxLength: 100,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'reserve2',
      label: '备用字段2',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备用字段2',
        maxLength: 100,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'creator',
      label: '创建者',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建者',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'updater',
      label: '更新者',
      component: 'Input',
      componentProps: {
        placeholder: '请输入更新者',
        maxLength: 50,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择更新时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
  ];
}
/** 设备借出订单表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'orderNo',
      title: '订单编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'userNickname',
      title: '用户昵称',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'lendTime',
      title: '借出时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'returnTime',
      title: '归还时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'actualDuration',
      title: '实际使用时长（分钟）',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'amount',
      title: '订单金额',
      minWidth: 120,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'status',
      title: '订单状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createOrderTime',
      title: '订单生成时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'payMethod',
      title: '支付方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'payMethod' },
    },
    {
      field: 'discountAmount',
      title: '优惠抵扣金额',
      minWidth: 160,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'archiveTime',
      title: '归档时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    }, 
    {
      field: 'creator',
      title: '创建者',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'updater',
      title: '更新者',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}