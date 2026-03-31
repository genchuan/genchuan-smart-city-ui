 /** 设备监测表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'device_code',
      label: '设备编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备编号',
      },
      rules: 'required'
    },
    {
      fieldName: 'station_name',
      label: '所属场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属场站'
      },
      rules: 'required'
    },
    {
      fieldName: 'lot_code',
      label: '所属车位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属车位编号'
      },
      rules: 'required'
    },
    {
      fieldName: 'device_type',
      label: '设备类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备类型',
        options: [
          { label: '充电桩', value: '充电桩' },
          { label: '车位', value: '车位' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'voltage',
      label: '电压',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电压'
      },
      rules: 'required'
    },
    {
      fieldName: 'current',
      label: '电流',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电流'
      },
      rules: 'required'
    },
    {
      fieldName: 'power',
      label: '功率',
      component: 'Input',
      componentProps: {
        placeholder: '请输入功率'
      },
      rules: 'required'
    },
    {
      fieldName: 'alarm_level',
      label: '告警等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警等级',
        options: [
          { label: '无', value: '无' },
          { label: '一般', value: '一般' },
          { label: '严重', value: '严重' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'monitor_status',
      label: '监测状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择监测状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '异常', value: '异常' },
          { label: '处置中', value: '处置中' },
          { label: '已恢复', value: '已恢复' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'dispose_user',
      label: '处置人员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置人员'
      },
      rules: 'required'
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注信息'
      }
    },
    {
      fieldName: 'dispose_measure',
      label: '处置措施',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置措施'
      }
    },
    {
      fieldName: 'dispose_time',
      label: '处置时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择处置时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'monitor_time',
      label: '监测时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择监测时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    }
  ];
}

/** 设备监测表格列配置（带钻取交互标记） */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'device_code',
      title: '设备编号',
      minWidth: 120,
      sortable: true, 
      slots: { default: 'device_code' }
    },
    {
      field: 'station_name',
      title: '所属场站',
      minWidth: 200,
      sortable: true, 
    },
    {
      field: 'lot_code',
      title: '所属车位',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'device_type_name',
      title: '设备类型',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'voltage',
      title: '电压',
      minWidth: 100,
      sortable: true // 无钻取
    },
    {
      field: 'current',
      title: '电流',
      minWidth: 100,
      sortable: true // 无钻取
    },
    {
      field: 'power',
      title: '功率',
      minWidth: 100,
      sortable: true // 无钻取
    },
    {
      field: 'alarm_level_name',
      title: '告警等级',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'monitor_status_name',
      title: '监测状态',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'disposeUserName',
      title: '处置人员',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true // 无钻取
    },
    {
      field: 'dispose_measure',
      title: '处置措施',
      minWidth: 150,
      sortable: true // 无钻取
    },
    {
      field: 'dispose_time',
      title: '处置时间',
      minWidth: 180,
      sortable: true, 
    },
    {
      field: 'monitor_time',
      title: '监测时间',
      minWidth: 180,
      sortable: true, 
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
} 