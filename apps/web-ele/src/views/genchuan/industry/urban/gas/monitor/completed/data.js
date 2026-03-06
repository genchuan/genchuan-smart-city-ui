/** 表格初始数据 - 改造为燃气管网预警处置归档管理数据 */
export const dataList = () => [
  {
    archiveCode: 'FJ-YW-G-202406-ARC001',
    relatedWorkOrderCode: 'FJ-YW-G-202406-001',
    relatedWarningCode: 'FJ-YJ-G-202406-001',
    warningPipeNetworkSection: '福州市台江区八一七中路管网段',
    affiliatedArea: '台江区',
    disposalType: '管网压力调节',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-16 02:00:00',
    archiveTime: '2024-06-16 09:00:00',
    warningMaintenanceTotalTime: 19,
    indexRecoveryValue: 0.38,
    verificationPerson: '张明（FJHC001）',
    indexComparisonBeforeAfter:
      '处置前管网压力0.45MPa，处置后0.38MPa，恢复至阈值（0.2~0.4MPa）范围内',
    archiveFileCount: 5,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC002',
    relatedWorkOrderCode: 'FJ-YW-G-202406-002',
    relatedWarningCode: 'FJ-YJ-G-202406-002',
    warningPipeNetworkSection: '厦门市思明区湖滨南路管网段',
    affiliatedArea: '思明区',
    disposalType: '燃气浓度检测与泄漏排查',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 10:00:00',
    archiveTime: '2024-06-15 15:00:00',
    warningMaintenanceTotalTime: 29,
    indexRecoveryValue: 0.3,
    verificationPerson: '李丽（FJHC002）',
    indexComparisonBeforeAfter:
      '处置前燃气浓度1.2%，处置后0.3%，恢复至阈值（≤1%）范围内',
    archiveFileCount: 8,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC003',
    relatedWorkOrderCode: 'FJ-YW-G-202406-003',
    relatedWarningCode: 'FJ-YJ-G-202406-003',
    warningPipeNetworkSection: '泉州市丰泽区刺桐路管网段',
    affiliatedArea: '丰泽区',
    disposalType: '管网压力调节',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 18:00:00',
    archiveTime: '2024-06-15 20:00:00',
    warningMaintenanceTotalTime: 8,
    indexRecoveryValue: 0.39,
    verificationPerson: '王强（FJHC003）',
    indexComparisonBeforeAfter:
      '处置前管网压力0.52MPa，处置后0.39MPa，恢复至阈值（0.2~0.4MPa）范围内',
    archiveFileCount: 3,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC004',
    relatedWorkOrderCode: 'FJ-YW-G-202406-004',
    relatedWarningCode: 'FJ-YJ-G-202406-004',
    warningPipeNetworkSection: '漳州市芗城区胜利路管网段',
    affiliatedArea: '芗城区',
    disposalType: '燃气浓度检测与泄漏排查',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 16:00:00',
    archiveTime: '2024-06-15 18:00:00',
    warningMaintenanceTotalTime: 8,
    indexRecoveryValue: 0.25,
    verificationPerson: '陈杰（FJHC004）',
    indexComparisonBeforeAfter:
      '处置前燃气浓度0.95%，处置后0.25%，恢复至阈值（≤1%）范围内',
    archiveFileCount: 4,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC005',
    relatedWorkOrderCode: 'FJ-YW-G-202406-005',
    relatedWarningCode: 'FJ-YJ-G-202406-005',
    warningPipeNetworkSection: '莆田市城厢区文献路管网段',
    affiliatedArea: '城厢区',
    disposalType: '管网压力调节',
    verificationResult: '不合格',
    workOrderCompleteTime: '2024-06-14 10:00:00',
    archiveTime: '2024-06-14 12:00:00',
    warningMaintenanceTotalTime: 14,
    indexRecoveryValue: 0.40,
    verificationPerson: '赵伟（FJHC005）',
    indexComparisonBeforeAfter:
      '处置前管网压力0.48MPa（预警值），实际0.40MPa，数据误差未通过核查',
    archiveFileCount: 2,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC006',
    relatedWorkOrderCode: 'FJ-YW-G-202406-006',
    relatedWarningCode: 'FJ-YJ-G-202406-006',
    warningPipeNetworkSection: '宁德市蕉城区蕉城南路管网段',
    affiliatedArea: '蕉城区',
    disposalType: '燃气浓度检测与泄漏排查',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 19:00:00',
    archiveTime: '2024-06-15 21:00:00',
    warningMaintenanceTotalTime: 32,
    indexRecoveryValue: 0.4,
    verificationPerson: '孙丽（FJHC006）',
    indexComparisonBeforeAfter:
      '处置前燃气浓度1.1%，处置后0.4%，恢复至阈值（≤1%）范围内',
    archiveFileCount: 6,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC007',
    relatedWorkOrderCode: 'FJ-YW-G-202406-007',
    relatedWarningCode: 'FJ-YJ-G-202406-007',
    warningPipeNetworkSection: '龙岩市新罗区中山路管网段',
    affiliatedArea: '新罗区',
    disposalType: '管网压力调节',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 17:00:00',
    archiveTime: '2024-06-15 19:00:00',
    warningMaintenanceTotalTime: 5,
    indexRecoveryValue: 0.38,
    verificationPerson: '周明（FJHC007）',
    indexComparisonBeforeAfter:
      '处置前管网压力0.42MPa，处置后0.38MPa，恢复至阈值（0.2~0.4MPa）范围内',
    archiveFileCount: 3,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC008',
    relatedWorkOrderCode: 'FJ-YW-G-202406-008',
    relatedWarningCode: 'FJ-YJ-G-202406-008',
    warningPipeNetworkSection: '三明市梅列区列东街管网段',
    affiliatedArea: '梅列区',
    disposalType: '燃气浓度检测与泄漏排查',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 10:00:00',
    archiveTime: '2024-06-15 12:00:00',
    warningMaintenanceTotalTime: 13,
    indexRecoveryValue: 0.5,
    verificationPerson: '吴杰（FJHC008）',
    indexComparisonBeforeAfter:
      '处置前燃气浓度0.85%，处置后0.5%，恢复至阈值（≤1%）范围内',
    archiveFileCount: 5,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC009',
    relatedWorkOrderCode: 'FJ-YW-G-202406-009',
    relatedWarningCode: 'FJ-YJ-G-202406-009',
    warningPipeNetworkSection: '南平市延平区解放路管网段',
    affiliatedArea: '延平区',
    disposalType: '管网压力调节',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-16 07:00:00',
    archiveTime: '2024-06-16 09:00:00',
    warningMaintenanceTotalTime: 21.5,
    indexRecoveryValue: 0.41,
    verificationPerson: '郑浩（FJHC009）',
    indexComparisonBeforeAfter:
      '处置前管网压力0.41MPa，处置后0.41MPa，符合阈值（0.2~0.4MPa）要求',
    archiveFileCount: 7,
  },
  {
    archiveCode: 'FJ-YW-G-202406-ARC010',
    relatedWorkOrderCode: 'FJ-YW-G-202406-010',
    relatedWarningCode: 'FJ-YJ-G-202406-010',
    warningPipeNetworkSection: '平潭综合实验区金井湾管网段',
    affiliatedArea: '平潭综合实验区',
    disposalType: '燃气浓度检测与泄漏排查',
    verificationResult: '不合格',
    workOrderCompleteTime: '2024-06-14 09:00:00',
    archiveTime: '2024-06-14 11:00:00',
    warningMaintenanceTotalTime: 16,
    indexRecoveryValue: 1.1,
    verificationPerson: '黄鑫（FJHC010）',
    indexComparisonBeforeAfter:
      '处置前燃气浓度1.3%（预警值），实际1.1%，数据误差未通过核查',
    archiveFileCount: 2,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为燃气管网预警处置归档管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'archiveCode',
      label: '归档编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入归档编号（如：FJ-YW-G-202406-ARC001）',
        maxLength: 50, // 限制编号长度，符合编码规范
      },
      labelWidth: '120',
      rules: 'required', // 归档编号为必填项
    },
    {
      fieldName: 'relatedWorkOrderCode',
      label: '关联工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联工单编号（如：FJ-YW-G-202406-001）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 关联工单编号为必填项
    },
    {
      fieldName: 'relatedWarningCode',
      label: '关联预警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联预警编号（如：FJ-YJ-G-202406-001）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 关联预警编号为必填项
    },
    {
      fieldName: 'warningPipeNetworkSection',
      label: '预警管网路段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预警管网路段（如：福州市台江区八一七中路管网段）',
      },
      labelWidth: '120',
      rules: 'required', // 预警管网路段为必填项
    },
    {
      fieldName: 'affiliatedArea',
      label: '所属区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属区域（如：台江区、思明区）',
      },
      labelWidth: '120',
      rules: 'required', // 所属区域为必填项
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '管网压力调节', value: '管网压力调节' },
          { label: '燃气浓度检测与泄漏排查', value: '燃气浓度检测与泄漏排查' },
          { label: '设备维修', value: '设备维修' },
          { label: '现场巡检', value: '现场巡检' },
          { label: '管道维修', value: '管道维修' },
          { label: '调压装置更换', value: '调压装置更换' },
        ],
        placeholder: '请选择处置类型',
        showSearch: true,
      },
      fieldName: 'disposalType',
      label: '处置类型',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '120',
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
      label: '完成时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择工单完成时间',
        type: 'datetime', // 支持日期+时间选择
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 完成时间为必填项
    },
    {
      fieldName: 'archiveTime',
      label: '归档时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择归档时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 归档时间为必填项
    },
    {
      fieldName: 'warningMaintenanceTotalTime',
      label: '预警处置总时长',
      component: 'InputNumber',
      labelWidth: '120',
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
      label: '管网参数恢复值',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入管网参数恢复值（如压力0.38MPa/浓度0.3%）',
        min: 0, // 数值非负
        precision: 2, // 适配管网参数精度需求
      },
      rules: 'required', // 管网参数恢复值为必填项
    },
    {
      fieldName: 'verificationPerson',
      label: '核查员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入核查员（姓名/工号，如：张明（FJHC001））',
        maxLength: 100,
      },
      labelWidth: '120',
      rules: 'required', // 核查员为必填项
    },
    {
      fieldName: 'indexComparisonBeforeAfter',
      label: '处置前后指标对比',
      component: 'InputTextArea',
      componentProps: {
        placeholder:
          '请输入处置前后指标对比（如：处置前管网压力0.45MPa，处置后0.38MPa）',
        maxlength: 500, // 适配长文本描述
        rows: 4,
      },
      labelWidth: '120',
      rules: 'required', // 处置前后指标对比为必填项
    },
    {
      fieldName: 'archiveFileCount',
      label: '归档资料数',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入归档资料数',
        min: 0, // 资料数非负
        precision: 0, // 整数
      },
      rules: 'required', // 归档资料数为必填项
    },
  ];
}

/** 表格字段 - 改造为燃气管网预警处置归档管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'archiveCode',
      title: '归档编号',
      minWidth: 220,
      sortable: true,
      slots: { default: 'archiveCode' }, // 自定义slot适配归档编号渲染
    },
    {
      field: 'relatedWorkOrderCode',
      title: '关联工单编号',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'relatedWarningCode',
      title: '关联预警编号',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'warningPipeNetworkSection',
      title: '预警管网路段',
      minWidth: 220,
      sortable: true,
    },
    {
      field: 'affiliatedArea',
      title: '所属区域',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'disposalType',
      title: '处置类型',
      minWidth: 180,
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
      title: '完成时间',
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
      field: 'warningMaintenanceTotalTime',
      title: '预警处置总时长(小时)',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'indexRecoveryValue',
      title: '管网参数恢复值',
      minWidth: 140,
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
      minWidth: 280,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'archiveFileCount',
      title: '归档资料数',
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