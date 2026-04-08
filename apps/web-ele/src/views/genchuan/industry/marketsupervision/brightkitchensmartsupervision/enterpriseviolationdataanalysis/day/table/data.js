 
/** 新增/修改的表单/列表的搜索表单 - 企业违规数据分析表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'rank',
      label: '统计周期',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入企业违规频次排名',
        min: 1,
        precision: 0,
      },
      labelWidth: '180',
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
      slots: { default: 'alarmCount' },  
    },
    {
      field: 'violationCount',
      title: '违规次数（整改复审计数）',
      minWidth: 160,
      sortable: true, 
      slots: { default: 'violationCount' },  
    },
    {
      field: 'deviceNormalRate',
      title: '设备正常率（去重设备计算）',
      minWidth: 160,
      sortable: true, 
      slots: { default: 'deviceNormalRate' },  
    },
    {
      field: 'rectifyFinishRate',
      title: '整改完成率（整改复审计数）',
      minWidth: 160,
      sortable: true, 
      slots: { default: 'rectifyFinishRate' },  
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