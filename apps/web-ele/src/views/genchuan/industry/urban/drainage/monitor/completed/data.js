/** 表格初始数据 - 改造为道路预警归档管理数据 */
export const dataList = () => [
  {
    archiveCode: 'FJ-GD-202406-ARC001',
    relatedWorkOrderCode: 'FJ-GD-202406-001',
    relatedWarningCode: 'FJ-YJ-202406-001',
    disposalRoadSection: '福州市鼓楼区杨桥东路（东街口-五一广场）',
    disposalType: '坑洼修补',
    assignedMaintenancePerson: '陈铭（FJYW001）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-16 02:00:00',
    archiveTime: '2024-06-16 09:00:00',
    warningDisposalTotalTime: 19,
    indexRecoveryValue: 8,
    verificationPerson: '张明（FJHC001）',
    indexComparisonBeforeAfter:
      '处置前坑洼数量12个，处置后8个，恢复至阈值范围内',
    archiveFileCount: 5,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC002',
    relatedWorkOrderCode: 'FJ-GD-202406-002',
    relatedWarningCode: 'FJ-YJ-202406-002',
    disposalRoadSection: '厦门市思明区鹭江道（轮渡码头-中山路）',
    disposalType: '裂缝填补',
    assignedMaintenancePerson: '林晓婷（FJYW002）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 10:00:00',
    archiveTime: '2024-06-15 15:00:00',
    warningDisposalTotalTime: 29,
    indexRecoveryValue: 0,
    verificationPerson: '李丽（FJHC002）',
    indexComparisonBeforeAfter: '处置前裂缝长度18.5米，处置后0米，完全修复',
    archiveFileCount: 8,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC003',
    relatedWorkOrderCode: 'FJ-GD-202406-003',
    relatedWarningCode: 'FJ-YJ-202406-003',
    disposalRoadSection: '泉州市丰泽区刺桐路（湖心街-泉秀街）',
    disposalType: '路面降温处理',
    assignedMaintenancePerson: '王志远（FJYW003）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 18:00:00',
    archiveTime: '2024-06-15 20:00:00',
    warningDisposalTotalTime: 8,
    indexRecoveryValue: 38.5,
    verificationPerson: '王强（FJHC003）',
    indexComparisonBeforeAfter:
      '处置前路面温度42.3℃，处置后38.5℃，恢复至阈值范围内',
    archiveFileCount: 3,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC004',
    relatedWorkOrderCode: 'FJ-GD-202406-004',
    relatedWarningCode: 'FJ-YJ-202406-004',
    disposalRoadSection: '漳州市芗城区胜利路（延安北路-新华西路）',
    disposalType: '交通疏导',
    assignedMaintenancePerson: '黄丽萍（FJYW004）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 16:00:00',
    archiveTime: '2024-06-15 18:00:00',
    warningDisposalTotalTime: 8,
    indexRecoveryValue: 1800,
    verificationPerson: '陈杰（FJHC004）',
    indexComparisonBeforeAfter:
      '处置前交通流量2500辆/小时，处置后1800辆/小时，恢复至阈值范围内',
    archiveFileCount: 4,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC005',
    relatedWorkOrderCode: 'FJ-GD-202406-005',
    relatedWarningCode: 'FJ-YJ-202406-005',
    disposalRoadSection: '莆田市城厢区荔城南大道（凤凰山-万达广场）',
    disposalType: '坑洼修补',
    assignedMaintenancePerson: '郑建明（FJYW005）',
    verificationResult: '不合格',
    workOrderCompleteTime: '2024-06-14 10:00:00',
    archiveTime: '2024-06-14 12:00:00',
    warningDisposalTotalTime: 14,
    indexRecoveryValue: 8,
    verificationPerson: '赵伟（FJHC005）',
    indexComparisonBeforeAfter:
      '处置前坑洼数量15个（预警值），实际8个，数据误差未通过核查',
    archiveFileCount: 2,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC006',
    relatedWorkOrderCode: 'FJ-GD-202406-006',
    relatedWarningCode: 'FJ-YJ-202406-006',
    disposalRoadSection: '宁德市蕉城区闽东中路（市政府-万达广场）',
    disposalType: '裂缝填补',
    assignedMaintenancePerson: '吴永辉（FJYW006）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 19:00:00',
    archiveTime: '2024-06-15 21:00:00',
    warningDisposalTotalTime: 32,
    indexRecoveryValue: 6.8,
    verificationPerson: '孙丽（FJHC006）',
    indexComparisonBeforeAfter:
      '处置前裂缝长度16.8米，处置后6.8米，剩余部分择期处理',
    archiveFileCount: 6,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC007',
    relatedWorkOrderCode: 'FJ-GD-202406-007',
    relatedWarningCode: 'FJ-YJ-202406-007',
    disposalRoadSection: '龙岩市新罗区龙川路（中山路-登高西路）',
    disposalType: '路面降温处理',
    assignedMaintenancePerson: '张志强（FJYW007）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 17:00:00',
    archiveTime: '2024-06-15 19:00:00',
    warningDisposalTotalTime: 5,
    indexRecoveryValue: 39.2,
    verificationPerson: '周明（FJHC007）',
    indexComparisonBeforeAfter:
      '处置前路面温度41.5℃，处置后39.2℃，恢复至阈值范围内',
    archiveFileCount: 3,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC008',
    relatedWorkOrderCode: 'FJ-GD-202406-008',
    relatedWarningCode: 'FJ-YJ-202406-008',
    disposalRoadSection: '三明市梅列区列东街（东新四路-东新六路）',
    disposalType: '交通疏导',
    assignedMaintenancePerson: '李芳（FJYW008）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 10:00:00',
    archiveTime: '2024-06-15 12:00:00',
    warningDisposalTotalTime: 13,
    indexRecoveryValue: 1800,
    verificationPerson: '吴杰（FJHC008）',
    indexComparisonBeforeAfter:
      '处置前交通流量2150辆/小时，处置后1800辆/小时，恢复至阈值范围内',
    archiveFileCount: 5,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC009',
    relatedWorkOrderCode: 'FJ-GD-202406-009',
    relatedWarningCode: 'FJ-YJ-202406-009',
    disposalRoadSection: '南平市延平区八一路（江滨路-中山路）',
    disposalType: '坑洼修补',
    assignedMaintenancePerson: '刘建国（FJYW009）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-16 07:00:00',
    archiveTime: '2024-06-16 09:00:00',
    warningDisposalTotalTime: 21.5,
    indexRecoveryValue: 0,
    verificationPerson: '郑浩（FJHC009）',
    indexComparisonBeforeAfter: '处置前坑洼数量11个，处置后0个，完全修复',
    archiveFileCount: 7,
  },
  {
    archiveCode: 'FJ-GD-202406-ARC010',
    relatedWorkOrderCode: 'FJ-GD-202406-010',
    relatedWarningCode: 'FJ-YJ-202406-010',
    disposalRoadSection: '平潭综合实验区金井大道（管委会-龙凤头沙滩）',
    disposalType: '裂缝填补',
    assignedMaintenancePerson: '蔡伟明（FJYW010）',
    verificationResult: '不合格',
    workOrderCompleteTime: '2024-06-14 09:00:00',
    archiveTime: '2024-06-14 11:00:00',
    warningDisposalTotalTime: 16,
    indexRecoveryValue: 12,
    verificationPerson: '黄鑫（FJHC010）',
    indexComparisonBeforeAfter:
      '处置前裂缝长度17.2米（预警值），实际12米，数据误差未通过核查',
    archiveFileCount: 2,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为道路预警归档管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'archiveCode',
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
      fieldName: 'relatedWorkOrderCode',
      label: '关联工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联工单编号（如：FJ-GD-202406-001）',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required', // 关联工单编号为必填项
    },
    {
      fieldName: 'relatedWarningCode',
      label: '关联预警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联预警编号（如：FJ-YJ-202406-001）',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required', // 关联预警编号为必填项
    },
    {
      fieldName: 'disposalRoadSection',
      label: '处置路段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置路段（如：福州市鼓楼区杨桥东路）',
      },
      labelWidth: '100',
      rules: 'required', // 处置路段为必填项
    },
    {
      component: 'Select',
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
      fieldName: 'disposalType',
      label: '处置类型',
      rules: 'required',
    },
    {
      fieldName: 'assignedMaintenancePerson',
      label: '指派运维员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入指派运维员（姓名/工号，如：陈铭（FJYW001））',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required', // 指派运维员为必填项
    },
    {
      component: 'Select',
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
      fieldName: 'verificationResult',
      label: '核查结果',
      rules: 'required',
    },
    {
      fieldName: 'workOrderCompleteTime',
      label: '工单完成时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择工单完成时间',
        type: 'datetime', // 支持日期+时间选择
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 工单完成时间为必填项
    },
    {
      fieldName: 'archiveTime',
      label: '归档时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择归档时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 归档时间为必填项
    },
    {
      fieldName: 'warningDisposalTotalTime',
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
    },
    {
      fieldName: 'indexRecoveryValue',
      label: '指标恢复值',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入指标恢复值（如坑洼数量8个）',
        min: 0, // 数值非负
        precision: 1,
      },
      rules: 'required', // 指标恢复值为必填项
    },
    {
      fieldName: 'verificationPerson',
      label: '核查员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入核查员（姓名/工号，如：张明（FJHC001））',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required', // 核查员为必填项
    },
    {
      fieldName: 'indexComparisonBeforeAfter',
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
    },
    {
      fieldName: 'archiveFileCount',
      label: '归档文件数',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入归档文件数',
        min: 0, // 文件数非负
        precision: 0, // 整数
      },
      rules: 'required', // 归档文件数为必填项
    },
  ];
}

/** 表格字段 - 改造为道路预警归档管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'archiveCode',
      title: '归档编号',
      minWidth: 200,
      sortable: true,
      slots: { default: 'archiveCode' }, // 自定义slot适配归档编号渲染
    },
    {
      field: 'relatedWorkOrderCode',
      title: '关联工单编号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'relatedWarningCode',
      title: '关联预警编号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'disposalRoadSection',
      title: '处置路段',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'disposalType',
      title: '处置类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'assignedMaintenancePerson',
      title: '指派运维员',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'verificationResult',
      title: '核查结果',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'workOrderCompleteTime',
      title: '工单完成时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'archiveTime',
      title: '归档时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'warningDisposalTotalTime',
      title: '预警处置总时长(小时)',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'indexRecoveryValue',
      title: '指标恢复值',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'verificationPerson',
      title: '核查员',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'indexComparisonBeforeAfter',
      title: '处置前后指标对比',
      minWidth: 250,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'archiveFileCount',
      title: '归档文件数',
      minWidth: 120,
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
