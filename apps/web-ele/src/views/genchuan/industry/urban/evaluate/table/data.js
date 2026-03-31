/** 考核统计信息的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      searchFilter: true,
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入主键ID',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'itemId',
      label: '指标项ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入指标项ID（关联eval_index_item.id）',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'itemName',
      label: '指标项名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入指标项名称',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'objectId',
      label: '评价对象ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入评价对象ID（关联eval_object.id）',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'objectName',
      label: '评价对象名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入评价对象名称',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'count',
      label: '统计指标项数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入统计指标项数量',
        min: 0,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'score',
      label: '规则回调分数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联规则中回调的分数',
        min: 0,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'addressCoding',
      label: '地址编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入地址编码',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'extCommon1',
      label: '通用扩展字段1',
      component: 'Input',
      componentProps: {
        placeholder: '请输入通用扩展字段1',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'extCommon2',
      label: '通用扩展字段2',
      component: 'Input',
      componentProps: {
        placeholder: '请输入通用扩展字段2',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'extCommon3',
      label: '通用扩展字段3',
      component: 'Input',
      componentProps: {
        placeholder: '请输入通用扩展字段3',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'extCommon4',
      label: '通用扩展字段4',
      component: 'Input',
      componentProps: {
        placeholder: '请输入通用扩展字段4',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'createTime',
      label: '创建时间',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'updateTime',
      label: '更新时间',
    },
    {
      fieldName: 'changeLog',
      label: '变更日志',
      component: 'Input',
      componentProps: {
        placeholder: '请输入变更日志',
        type: 'textarea',
        rows: 3,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        clearable: true,
        filterOption: true,
        options: [
          { label: '待审核', value: 1 },
          { label: '审核通过', value: 2 },
          { label: '不用审核', value: 3 },
        ],
        placeholder: '请选择状态',
        showSearch: true,
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      fieldName: 'ruleId',
      label: '统计规则ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入统计规则ID（关联eval_comment_rule.id）',
        min: 0,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'systemId',
      label: '体系ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入体系ID（关联体系表主键id）',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'systemName',
      label: '体系名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入体系名称',
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
  ];
}

/** 考核统计信息表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 80,
      sortable: true,
    },
    
    {
      field: 'itemName',
      title: '指标项名称',
      minWidth: 120,
      sortable: true,
    },
     
    {
      field: 'objectName',
      title: '评价对象名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'count',
      title: '统计指标项数量',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'score',
      title: '规则回调分数',
      minWidth: 120,
      sortable: true,
      tips: '关联规则中回调的分数',
    },
    {
      field: 'addressCoding',
      title: '地址编码',
      minWidth: 120,
      sortable: true,
    }, 
     
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'changeLog',
      title: '变更日志',
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      formatter: (value) => {
        const statusMap = {
          1: '待审核',
          2: '审核通过',
          3: '不用审核',
        };
        return statusMap[value] || '未知状态';
      },
    },
    
    {
      field: 'ruleName',
      title: '规则名称',
      minWidth: 120,
      sortable: true,
    },
     
    {
      field: 'systemName',
      title: '体系名称',
      minWidth: 120,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' }, // 操作列（编辑/删除/详情）
    },
  ];
}