
/** 道路预警归档管理表单配置 - 严格匹配表格JSON原始字段 */
export function useFormSchema() {
  return [
    {
      fieldName: 'archiveNo', // 匹配表格字段archiveNo
      label: '归档编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入归档编号（如：FJ-GD-202406-ARC001）',
        maxLength: 50, // 限制编号长度，符合编码规范
      },
      labelWidth: '100',
      rules: 'required', // 归档编号为必填项 
    },
    {
      fieldName: 'orderNo', // 匹配表格字段orderNo
      label: '关联工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联工单编号（如：FJ-GD-202406-001）',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required', // 关联工单编号为必填项
      // 支持搜索
    },
    {
      fieldName: 'warnNo', // 匹配表格字段warnNo
      label: '关联预警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联预警编号（如：FJ-YJ-202406-001）',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required', // 关联预警编号为必填项
      // 支持搜索
    },
    {
      fieldName: 'facilityName', // 匹配表格字段facilityName
      label: '处置路段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置路段（如：福州市鼓楼区杨桥东路）',
      },
      labelWidth: '100',
      rules: 'required', // 处置路段为必填项
      // 支持搜索
      isSearch: true,
    },
    {
      fieldName: 'facilityType', // 匹配表格字段facilityType
      component: 'Select',
      label: '处置类型',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '坑洼修补', value: '坑洼修补' },
          { label: '裂缝填补', value: '裂缝填补' },
          { label: '路面降温处理', value: '路面降温处理' },
          { label: '交通疏导', value: '交通疏导' },
          { label: '设备维修', value: '设备维修' },
          { label: '现场巡检', value: '现场巡检' },
        ],
        placeholder: '请选择处置类型',
        showSearch: true,
      },
      rules: 'required',
      isSearch: true,
      // 支持搜索
    },
    {
      fieldName: 'assignStaffName', // 匹配表格字段assignStaffName
      label: '指派运维员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入指派运维员（姓名/工号，如：陈铭（FJYW001））',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required', // 指派运维员为必填项
      // 支持搜索
    },
    {
      fieldName: 'checkResult', // 匹配表格字段checkResult
      component: 'Select',
      label: '核查结果',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '合格', value: '合格' },
          { label: '不合格', value: '不合格' },
        ],
        placeholder: '请选择核查结果',
        showSearch: true,
      },
      rules: 'required',
      isSearch: true,
      // 支持搜索
    },
    {
      fieldName: 'completeTime', // 匹配表格字段completeTime
      label: '工单完成时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择工单完成时间',
        type: 'datetime', // 支持日期+时间选择
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      isSearch: true,
      rules: 'required', // 工单完成时间为必填项
      // 支持搜索
    },
    {
      fieldName: 'createTime', // 匹配表格字段createTime
      label: '归档时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择归档时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      isSearch: true,
      rules: 'required', // 归档时间为必填项
      // 支持搜索
    },
    {
      fieldName: 'dealDuration', // 匹配表格字段dealDuration
      label: '预警处置总时长',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入预警处置总时长（单位：小时）',
        min: 0, // 时长非负
        precision: 1, // 支持小数（如21.5小时）
        addonAfter: '小时',
      },
      rules: 'required', // 预警处置总时长为必填项
      // 支持搜索
    },
    {
      fieldName: 'recoverValue', // 匹配表格字段recoverValue
      label: '指标恢复值',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入指标恢复值（如坑洼数量8个）',
        min: 0, // 数值非负
        precision: 1,
      },
      rules: 'required', // 指标恢复值为必填项
      // 支持搜索
    },
    {
      fieldName: 'checkStaffName', // 匹配表格字段checkStaffName
      label: '核查员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入核查员（姓名/工号，如：张明（FJHC001））',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required', // 核查员为必填项
      // 支持搜索
    },
    {
      fieldName: 'indexComparison', // 处置前后指标对比（自定义字段名，适配业务）
      label: '处置前后指标对比',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置前后指标对比（如：处置前坑洼12个，处置后8个）',
        maxlength: 500, // 适配长文本描述
        type: 'textarea',
        rows: 4,
      },
      labelWidth: '100',
      rules: 'required', // 处置前后指标对比为必填项
      isSearch: false // 文本描述类字段不支持搜索
    },
    {
      fieldName: 'fileNum', // 匹配表格字段fileNum
      label: '归档文件数',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入归档文件数',
        min: 0, // 文件数非负
        precision: 0, // 整数
      },
      rules: 'required', // 归档文件数为必填项
      // 支持搜索
    },
  ];
}

/** 道路预警归档管理表格列配置 - 严格匹配业务文档顺序及JSON原始字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    // 1. 归档编号（文档首位，对应archiveNo）
    {
      field: 'archiveNo',
      title: '归档编号',
      minWidth: 180,
      sortable: true,
    },
    // 2. 关联工单编号（文档第二位，对应orderNo，支持钻取）
    {
      field: 'orderNo',
      title: '关联工单编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'orderNo' }, // 保留钻取插槽
    },
    // 3. 关联预警编号（文档第三位，对应warnNo，支持钻取）
    {
      field: 'warnNo',
      title: '关联预警编号',
      minWidth: 180,
      sortable: true,
    },
    // 4. 处置路段（文档第四位，对应facilityName，支持钻取）
    {
      field: 'facilityName',
      title: '处置路段',
      minWidth: 200,
      sortable: true,
    },
    // 5. 处置类型（文档第五位，对应facilityType，支持钻取）
    {
      field: 'facilityType',
      title: '处置类型',
      minWidth: 120,
      sortable: true,
    },
    // 6. 指派运维员（文档第六位，对应assignStaffName，支持钻取）
    {
      field: 'assignStaffName',
      title: '指派运维员',
      minWidth: 150,
      sortable: true,
    },
    // 7. 核查结果（文档第七位，对应checkResult，支持钻取）
    {
      field: 'checkResult',
      title: '核查结果',
      minWidth: 100,
      sortable: true,
    },
    // 8. 工单完成时间（文档第八位，对应completeTime）
    {
      field: 'completeTime',
      title: '工单完成时间',
      minWidth: 200,
      sortable: true,
    },
    // 9. 归档时间（文档第九位，对应createTime）
    {
      field: 'createTime',
      title: '归档时间',
      minWidth: 200,
      sortable: true,
    },
    // 10. 预警处置总时长(小时)（文档第十位，对应dealDuration，自动计算）
    {
      field: 'dealDuration',
      title: '预警处置总时长(小时)',
      minWidth: 150,
      sortable: true,
    },
    // 11. 指标恢复值（文档第十一位，对应recoverValue，自动统计）
    {
      field: 'recoverValue',
      title: '指标恢复值',
      minWidth: 120,
      sortable: true,
    },
    // 12. 核查员（文档第十二位，对应checkStaffName）
    {
      field: 'checkStaffName',
      title: '核查员',
      minWidth: 150,
      sortable: true,
    },
    // 13. 处置前后指标对比（文档第十三位，对应beforeIndexName/afterIndexValue，自动聚合）
    {
      field: 'recoverValue',
      title: '处置前后指标对比',
      minWidth: 250,
      sortable: false, // 文本描述类字段无需排序 
    },
    // 14. 归档文件数（文档第十四位，对应fileNum，自动统计）
    {
      field: 'fileNum',
      title: '归档文件数',
      minWidth: 120,
      sortable: true,
    },
    // 操作列（固定右侧）
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}