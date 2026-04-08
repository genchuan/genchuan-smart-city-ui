 
/** 新增/修改的表单/列表的搜索表单 - 企业违规数据分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'rank',
      label: '企业违规频次排名（降序）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入企业违规频次排名',
        min: 1,
        precision: 0,
      },
      labelWidth: '180',
      rules: 'required',
    },
    {
      fieldName: 'timeLabel',
      label: '用于图表展示',
      component: 'Input',
      componentProps: {
        placeholder: '请输入图表展示格式（如：yyyy-MM-dd / yyyy-第W周 / yyyy-MM / 第几年第几月第几日-第几年第几月第几日）',
        maxLength: 100,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'entId',
      label: '企业ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入企业ID',
        min: 1,
        precision: 0,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'entName',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称',
        maxLength: 100,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'alarmCount',
      label: '总告警次数（AI预警按企业分组统计）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入总告警次数',
        min: 0,
        precision: 0,
      },
      labelWidth: '180',
      rules: 'required',
    },
    {
      fieldName: 'violationCount',
      label: '违规次数（整改复审计数）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入违规次数',
        min: 0,
        precision: 0,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'deviceNormalRate',
      label: '设备正常率（去重设备计算）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入设备正常率',
        min: 0,
        max: 100,
        precision: 2,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'rectifyFinishRate',
      label: '整改完成率（整改复审计数）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入整改完成率',
        min: 0,
        max: 100,
        precision: 2,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'beginTime',
      label: '统计开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计开始时间',
        picker: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: '统计结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计结束时间',
        picker: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '120',
      rules: 'required',
    },
  ];
}

/** 表格字段 - 企业违规数据分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'rank',
      title: '企业违规频次排名（降序）',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'timeLabel',
      title: '图表展示格式',
      minWidth: 200,
      sortable: true,
    }, 
    {
      field: 'entName',
      title: '企业名称',
      minWidth: 220,
      sortable: true, 
      slots: { default: 'entName' },  
    },
    {
      field: 'alarmCount',
      title: '总告警次数（AI预警按企业分组统计）',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'violationCount',
      title: '违规次数（整改复审计数）',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'deviceNormalRate',
      title: '设备正常率（去重设备计算）',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'rectifyFinishRate',
      title: '整改完成率（整改复审计数）',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'beginTime',
      title: '统计开始时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'endTime',
      title: '统计结束时间',
      minWidth: 180,
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