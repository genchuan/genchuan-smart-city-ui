 /** 新增/修改的表单/列表的搜索表单 - 执法复审台账表单（截图字段版） */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主键ID',
        disabled: true, // 主键为自增/系统生成，禁用输入
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'ledgerCode',
      label: '台账编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入台账编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'overdueFlag',
      label: '逾期标识',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择逾期标识',
        options: [
          { label: '否', value: '0' },
          { label: '是', value: '1' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'paymentDeadlineTime',
      label: '缴费截止时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择缴费截止时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'entId',
      label: '企业ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业ID',
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
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'illegalTypeId',
      label: '违规类型ID',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择违规类型',
        showSearch: true,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'illegalLevelId',
      label: '违规等级ID',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择违规等级',
        showSearch: true,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'entRectifyRecordId',
      label: '企业整改记录ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业整改记录ID',
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'lawEnforceId',
      label: '执法ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入执法ID',
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'lawLedgerCode',
      label: '执法复审台账编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入执法复审台账编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'illegalEvidenceUrl',
      label: '违规证据链接',
      component: 'Input',
      componentProps: {
        placeholder: '请输入违规证据链接',
        maxLength: 200,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'draftPunishAmtMin',
      label: '草拟处罚金额下限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入草拟处罚金额下限',
        min: 0,
        precision: 2,
        addonAfter: '元',
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'draftPunishAmtMax',
      label: '草拟处罚金额上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入草拟处罚金额上限',  
        min: 0,
        precision: 2,
        addonAfter: '元',
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'legalBasis',
      label: '处罚法律依据',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处罚法律依据',
        maxLength: 500,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'reviewStatus',
      label: '复审状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择复审状态',
        options: [
          { label: '待复审', value: '待复审' },
          { label: '已下发', value: '已下发' },
          { label: '已撤销', value: '已撤销' },
        ],
        showSearch: true,
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'reviewBy',
      label: '复审人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入复审人',
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'cancelReasonId',
      label: '撤销原因ID',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择撤销原因',
        showSearch: true,
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'draftTime',
      label: '草拟时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择草拟时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'reviewTime',
      label: '复审时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择复审时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'cancelTime',
      label: '撤销时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择撤销时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      },
      labelWidth: '120',
      rules: '',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
        disabled: true,
      },
      labelWidth: '120',
      rules: '',
    },
  ];
} 
/** 表格字段 - 执法复审台账表格列（截图字段版） */
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
      field: 'ledgerCode',
      title: '台账编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'ledgerCode' },
    },
     {
      field: 'reviewStatus',
      title: '复审状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reviewStatus' },
    },
    // {
    //   field: 'overdueFlag',
    //   title: '逾期标识',
    //   minWidth: 100,
    //   sortable: true, 
    //   slots: { default: 'overdueFlag' },
    // },
    {
      field: 'paymentDeadlineTime',
      title: '缴费截止时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'entName',
      title: '企业名称',
      minWidth: 200,
      sortable: true,
    },  
     {
      field: 'evidenceUrl',
      title: '违规证据',
      minWidth: 200,
      sortable: true,
      slots: { default: 'evidenceUrl' },
    },  
    {
      field: 'draftPunishAmt',
      title: '草拟处罚金额(元)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'legalBasis',
      title: '处罚法律依据',
      minWidth: 200,
      sortable: false,
    }, 
    {
      field: 'reviewByName',
      title: '复审人',
      minWidth: 120,
      sortable: true,
    }, 
    {
      field: 'draftTime',
      title: '草拟时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'reviewTime',
      title: '复审时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'cancelTime',
      title: '撤销时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
