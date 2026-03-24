export function useFormSchema() {
  return [
    {
      fieldName: 'ledgerCode',
      label: '台账编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入台账编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'entName',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'illegalTypeName',
      label: '违规类型名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入违规类型名称',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'illegalLevelName',
      label: '违规等级',
      component: 'Input',
      componentProps: {
        placeholder: '请输入违规等级',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'reviewStatus',
      label: '复审状态',
      component: 'Input',
      componentProps: {
        placeholder: '请输入复审状态',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'evidenceUrl',
      label: '违规证据链接',
      component: 'Input',
      componentProps: {
        placeholder: '请输入违规证据链接',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
    }, 
    {
      fieldName: 'reviewUserName',
      label: '复审人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入复审人',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
    }, 
  ];
}

/** 整改通知书台账表表格列配置 */
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
      minWidth: 200,
      sortable: true,
      slots: { default: 'ledgerCode' }, // 整改通知书复审台账唯一编号，预留钻取插槽
    }, 
    {
      field: 'entName',
      title: '企业名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'entName' }, // 整改通知书复审台账唯一编号，预留钻取插槽
    }, 
    {
      field: 'illegalTypeName',
      title: '违规类型名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'illegalTypeName' },
    },
    {
      field: 'illegalLevelName',
      title: '违规等级',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'reviewStatus',
      title: '复审状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reviewStatus' },
    },
    {
      field: 'evidenceUrl',
      title: '违规证据链接',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'draftTime',
      title: '草拟时间',
      minWidth: 180,
      sortable: true,
    },
    // {
    //   field: 'rectifyDeadlineTime',
    //   title: '整改截止时间',
    //   minWidth: 180,
    //   sortable: true,
    // }, 
    {
      field: 'reviewUserName',
      title: '复审人',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'reviewTime',
      title: '复审时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'issueTime',
      title: '下发时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'cancelTime',
      title: '撤销时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'cancelReason',
      title: '撤销原因',
      minWidth: 200,
      sortable: true,
      slots: { default: 'cancelReason' },
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
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' }, // 操作列（编辑/删除/详情/复审）
    },
  ];
}