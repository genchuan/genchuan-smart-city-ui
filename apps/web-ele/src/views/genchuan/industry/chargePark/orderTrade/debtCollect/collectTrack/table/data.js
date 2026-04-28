/** 追缴记录搜索表单配置 */
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
      fieldName: 'trackNo',
      label: '追缴编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入追缴编号',
        maxLength: 50,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'plateNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
        maxLength: 20,
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'collectMethod',
      label: '追缴方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择追缴方式',
        options: [
          { label: '线上追缴', value: 'online' },
          { label: '线下追缴', value: 'offline' },
        ],
      },
      labelWidth: 120,
    },
    {
      fieldName: 'collectTime',
      label: '追缴时间',
      component: 'DateTimePicker',
      componentProps: {
        placeholder: '请选择追缴时间',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: 120,
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待追缴', value: 'pending' },
          { label: '追缴中', value: 'processing' },
          { label: '已完成', value: 'completed' },
          { label: '追缴失败', value: 'failed' },
        ],
      },
      labelWidth: 120,
      isSearch: true,
    },
    {
      fieldName: 'areaId',
      label: '片区ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入片区ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'transferUserId',
      label: '转派用户ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入转派用户ID',
        precision: 0,
        min: 0,
      },
      labelWidth: 120,
    },
    {
      fieldName: 'collectProgress',
      label: '追缴进度',
      component: 'Input',
      componentProps: {
        placeholder: '请输入追缴进度',
        maxLength: 100,
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
/** 追缴记录表格列配置 */
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
      field: 'trackNo',
      title: '追缴编号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'trackNo' },
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'collectMethod',
      title: '追缴方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'collectMethod' },
    },
    {
      field: 'collectTime',
      title: '追缴时间',
      minWidth: 220,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'areaId',
      title: '片区ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'transferUserId',
      title: '转派用户ID',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'collectProgress',
      title: '追缴进度',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'operatorId',
      title: '操作人ID',
      minWidth: 120,
      sortable: true,
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