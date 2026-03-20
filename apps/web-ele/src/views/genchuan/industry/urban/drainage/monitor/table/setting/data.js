/** 监测参数配置表单 schema */
export function useFormSchema() {
  return [
    {
      fieldName: 'pipe_road',
      label: '管网路段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入管网路段名称',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'code',
      label: '监测设备编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入监测设备编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '1分钟', value: '1分钟' },
          { label: '5分钟', value: '5分钟' },
          { label: '10分钟', value: '10分钟' },
          { label: '30分钟', value: '30分钟' },
          { label: '1小时', value: '1小时' },
        ],
        placeholder: '请选择常规采集频率',
        showSearch: true,
      },
      fieldName: 'normal_collect_frequency',
      label: '常规采集频率',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '1分钟', value: '1分钟' },
          { label: '5分钟', value: '5分钟' },
          { label: '10分钟', value: '10分钟' },
        ],
        placeholder: '请选择降雨期采集频率',
        showSearch: true,
      },
      fieldName: 'rain_collect_frequency',
      label: '降雨期采集频率',
      rules: 'required',
    },
    {
      fieldName: 'pipe_level_threshold',
      label: '液位阈值',
      component: 'Input',
      componentProps: {
        placeholder: '请输入液位阈值范围（如：0-2.0）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'pipe_flow_speed_threshold',
      label: '流速阈值',
      component: 'Input',
      componentProps: {
        placeholder: '请输入流速阈值范围（如：0-1.5）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'rainfall_threshold',
      label: '降雨量阈值',
      component: 'Input',
      componentProps: {
        placeholder: '请输入降雨量阈值范围（如：0-10）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'user_name',
      label: '负责运维员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入负责运维员姓名',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '开启', value: '开启' },
          { label: '关闭', value: '关闭' },
        ],
        placeholder: '请选择降雨联动预警开关',
        showSearch: true,
      },
      fieldName: 'rain_warn_switch',
      label: '降雨联动预警开关',
      rules: 'required',
    },
  ];
}
