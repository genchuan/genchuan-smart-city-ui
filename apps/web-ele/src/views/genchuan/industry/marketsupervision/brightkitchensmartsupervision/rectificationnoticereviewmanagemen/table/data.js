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
      fieldName: 'entId',
      label: '企业ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业ID',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
    },
    {
      fieldName: 'illegalLevelId',
      label: '违规等级ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入违规等级ID',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
    },
    {
      fieldName: 'illegalTypeId',
      label: '违规类型ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入违规类型ID',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
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
      fieldName: 'draftTime',
      label: '整改通知书草拟时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入整改通知书草拟时间',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 台账编号为必填项
      isEdit: true,
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
    },

    {
      fieldName: 'enterpriseName',
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
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未按规范进行桥梁养护', value: '未按规范进行桥梁养护' },
          { label: '监测数据造假', value: '监测数据造假' },
          { label: '未按时提交养护报告', value: '未按时提交养护报告' },
          { label: '养护设备未定期校准', value: '养护设备未定期校准' },
          { label: '违规占道施工', value: '违规占道施工' },
          { label: '安全警示标识缺失', value: '安全警示标识缺失' },
          { label: '养护人员无证上岗', value: '养护人员无证上岗' },
          { label: '未按要求设置防护措施', value: '未按要求设置防护措施' },
          { label: '养护记录不完整', value: '养护记录不完整' },
          { label: '超限车辆未报备通行', value: '超限车辆未报备通行' },
        ],
        placeholder: '请选择违规类型',
        showSearch: true,
      },
      fieldName: 'violationType',
      label: '违规类型',
      rules: 'required',
      isSearch: true
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '轻微违规', value: '轻微违规' },
          { label: '一般违规', value: '一般违规' },
          { label: '严重违规', value: '严重违规' },
        ],
        placeholder: '请选择违规等级',
        showSearch: true,
      },
      fieldName: 'violationLevel',
      label: '违规等级',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'violationEvidenceUrl',
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
      fieldName: 'draftTime',
      label: '草拟时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入草拟时间（格式：YYYY-MM-DD HH:mm:ss）',
        maxlength: 20,
      },
      labelWidth: '120',
      rules: 'required',
      isSearch: true
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未复审', value: '未复审' },
          { label: '复审中', value: '复审中' },
          { label: '已复审', value: '已复审' },
          { label: '已撤销', value: '已撤销' },
        ],
        placeholder: '请选择复审状态',
        showSearch: true,
      },
      fieldName: 'reviewStatus',
      label: '复审状态',
      rules: 'required',
      isSearch: true
    },
    {
      fieldName: 'reviewer',
      label: '复审人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入复审人姓名/工号',
      },
      labelWidth: '120',
      isSearch: true
    },
    {
      fieldName: 'reviewTime',
      label: '复审时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入复审时间（格式：YYYY-MM-DD HH:mm:ss）',
        maxlength: 20,
      },
      labelWidth: '120',
      rules: '', // 非必填，复审状态为未复审时可空
    },
    {
      fieldName: 'issueTime',
      label: '下发时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入下发时间（格式：YYYY-MM-DD HH:mm:ss）',
        maxlength: 20,
      },
      labelWidth: '120',
      isSearch: true,
      rules: '', // 非必填，未下发时可空
    },
    {
      fieldName: 'revokeTime',
      label: '撤销时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入撤销时间（格式：YYYY-MM-DD HH:mm:ss）',
        maxlength: 20,
      },
      labelWidth: '120',
      isSearch: true,
      rules: '', // 非必填，未撤销时可空
    },
    {
      fieldName: 'revokeReason',
      label: '撤销原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入撤销原因',
        maxlength: 500,
      },
      labelWidth: '120',
      rules: '', // 非必填，未撤销时可空
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未送达', value: '未送达' },
          { label: '待送达', value: '待送达' },
          { label: '已送达', value: '已送达' },
          { label: '已撤回', value: '已撤回' },
        ],
        placeholder: '请选择送达状态',
        showSearch: true,
      },
      fieldName: 'serviceStatus',
      label: '送达状态',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未整改', value: '未整改' },
          { label: '整改中', value: '整改中' },
          { label: '已整改', value: '已整改' },
          { label: '整改完成', value: '整改完成' },
          { label: '无需整改', value: '无需整改' },
          { label: '逾期未整改', value: '逾期未整改' },
        ],
        placeholder: '请选择企业整改反馈状态',
        showSearch: true,
      },
      fieldName: 'enterpriseRectificationStatus',
      label: '企业整改反馈状态',
      rules: 'required',
    },
    {
      fieldName: 'lawEnforcementReviewLedgerCode',
      label: '执法复审台账编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入执法复审台账编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
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
      field: 'entId',
      title: '企业ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'illegalTypeId',
      title: '违规类型ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'illegalLevelId',
      title: '违规等级ID',
      minWidth: 120,
      sortable: true,
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
    {
      field: 'reviewStatus',
      title: '复审状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'reviewerId',
      title: '复审人ID',
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
      field: 'cancelTime',
      title: '撤销时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'cancelReasonId',
      title: '撤销原因ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'lawLedgerCode',
      title: '执法复审台账编号',
      minWidth: 200,
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
      field: 'creator',
      title: '创建人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'updater',
      title: '更新人',
      minWidth: 100,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' }, // 操作列（编辑/删除/详情/复审）
    },
  ];
}
