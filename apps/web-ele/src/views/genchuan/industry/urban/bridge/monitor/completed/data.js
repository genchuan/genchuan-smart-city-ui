/** 表格初始数据 - 改造为桥梁养护归档管理数据 */
export const dataList = () => [
  {
    archiveCode: 'FJ-YH-B-202406-ARC001',
    relatedWorkOrderCode: 'FJ-YH-B-202406-001',
    relatedWarningCode: 'FJ-YJ-B-202406-001',
    maintenanceBridge: '福州市闽江大桥',
    monitorPosition: '主桥左侧支座',
    maintenanceType: '支座更换',
    assignedMaintenancePerson: '陈铭（FJYH001）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-16 02:00:00',
    archiveTime: '2024-06-16 09:00:00',
    warningMaintenanceTotalTime: 19,
    indexRecoveryValue: 1.2,
    verificationPerson: '张明（FJHC001）',
    indexComparisonBeforeAfter:
      '处置前支座位移2.5mm，处置后1.2mm，恢复至阈值（≤2mm）范围内',
    maintenanceMaterialTotalUsage:
      '橡胶支座8个，高强螺栓48套，密封胶12支，润滑油5L',
    archiveFileCount: 5,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC002',
    relatedWorkOrderCode: 'FJ-YH-B-202406-002',
    relatedWarningCode: 'FJ-YJ-B-202406-002',
    maintenanceBridge: '厦门市集美大桥',
    monitorPosition: '引桥右侧支座',
    maintenanceType: '振动检测与加固',
    assignedMaintenancePerson: '林晓婷（FJYH002）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 10:00:00',
    archiveTime: '2024-06-15 15:00:00',
    warningMaintenanceTotalTime: 29,
    indexRecoveryValue: 4.2,
    verificationPerson: '李丽（FJHC002）',
    indexComparisonBeforeAfter:
      '处置前振动频率5.8Hz，处置后4.2Hz，恢复至阈值（1~5Hz）范围内',
    maintenanceMaterialTotalUsage:
      '抗震加固钢板12㎡，膨胀螺栓36套，环氧结构胶8kg',
    archiveFileCount: 8,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC003',
    relatedWorkOrderCode: 'FJ-YH-B-202406-003',
    relatedWarningCode: 'FJ-YJ-B-202406-003',
    maintenanceBridge: '泉州市晋江大桥',
    monitorPosition: '主桥中跨支座',
    maintenanceType: '应变检测与修复',
    assignedMaintenancePerson: '王志远（FJYH003）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 18:00:00',
    archiveTime: '2024-06-15 20:00:00',
    warningMaintenanceTotalTime: 8,
    indexRecoveryValue: 190.5,
    verificationPerson: '王强（FJHC003）',
    indexComparisonBeforeAfter:
      '处置前应变值210.5με，处置后190.5με，恢复至阈值（≤200με）范围内',
    maintenanceMaterialTotalUsage:
      '应变片20片，数据采集仪1台，环氧结构胶3kg，砂纸10张',
    archiveFileCount: 3,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC004',
    relatedWorkOrderCode: 'FJ-YH-B-202406-004',
    relatedWarningCode: 'FJ-YJ-B-202406-004',
    maintenanceBridge: '漳州市九龙江大桥',
    monitorPosition: '副桥左侧支座',
    maintenanceType: '支座调平',
    assignedMaintenancePerson: '黄丽萍（FJYH004）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 16:00:00',
    archiveTime: '2024-06-15 18:00:00',
    warningMaintenanceTotalTime: 8,
    indexRecoveryValue: 0.8,
    verificationPerson: '陈杰（FJHC004）',
    indexComparisonBeforeAfter:
      '处置前支座位移1.8mm，处置后0.8mm，恢复至阈值（≤2mm）范围内',
    maintenanceMaterialTotalUsage:
      '液压调平千斤顶2台，水平仪1台，防锈剂3L，密封胶2支',
    archiveFileCount: 4,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC005',
    relatedWorkOrderCode: 'FJ-YH-B-202406-005',
    relatedWarningCode: 'FJ-YJ-B-202406-005',
    maintenanceBridge: '莆田市木兰溪大桥',
    monitorPosition: '主桥右侧支座',
    maintenanceType: '支座更换',
    assignedMaintenancePerson: '郑建明（FJYH005）',
    verificationResult: '不合格',
    workOrderCompleteTime: '2024-06-14 10:00:00',
    archiveTime: '2024-06-14 12:00:00',
    warningMaintenanceTotalTime: 14,
    indexRecoveryValue: 1.9,
    verificationPerson: '赵伟（FJHC005）',
    indexComparisonBeforeAfter:
      '处置前支座位移2.2mm（预警值），实际1.9mm，数据误差未通过核查',
    maintenanceMaterialTotalUsage: '未使用，材料已退回仓库',
    archiveFileCount: 2,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC006',
    relatedWorkOrderCode: 'FJ-YH-B-202406-006',
    relatedWarningCode: 'FJ-YJ-B-202406-006',
    maintenanceBridge: '宁德市东湖大桥',
    monitorPosition: '引桥左侧支座',
    maintenanceType: '振动检测与加固',
    assignedMaintenancePerson: '吴永辉（FJYH006）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 19:00:00',
    archiveTime: '2024-06-15 21:00:00',
    warningMaintenanceTotalTime: 32,
    indexRecoveryValue: 4.5,
    verificationPerson: '孙丽（FJHC006）',
    indexComparisonBeforeAfter:
      '处置前振动频率5.2Hz，处置后4.5Hz，恢复至阈值（1~5Hz）范围内',
    maintenanceMaterialTotalUsage: '加固钢板8㎡，螺栓24套，结构胶5kg，防锈剂2L',
    archiveFileCount: 6,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC007',
    relatedWorkOrderCode: 'FJ-YH-B-202406-007',
    relatedWarningCode: 'FJ-YJ-B-202406-007',
    maintenanceBridge: '龙岩市龙津河大桥',
    monitorPosition: '主桥边跨支座',
    maintenanceType: '应变检测与修复',
    assignedMaintenancePerson: '张志强（FJYH007）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 17:00:00',
    archiveTime: '2024-06-15 19:00:00',
    warningMaintenanceTotalTime: 5,
    indexRecoveryValue: 192.8,
    verificationPerson: '周明（FJHC007）',
    indexComparisonBeforeAfter:
      '处置前应变值198.8με，处置后192.8με，恢复至阈值（≤200με）范围内',
    maintenanceMaterialTotalUsage:
      '应变片15片，数据采集仪1台，结构胶2kg，清洁布10块',
    archiveFileCount: 3,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC008',
    relatedWorkOrderCode: 'FJ-YH-B-202406-008',
    relatedWarningCode: 'FJ-YJ-B-202406-008',
    maintenanceBridge: '三明市沙溪大桥',
    monitorPosition: '副桥右侧支座',
    maintenanceType: '支座调平',
    assignedMaintenancePerson: '李芳（FJYH008）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-15 10:00:00',
    archiveTime: '2024-06-15 12:00:00',
    warningMaintenanceTotalTime: 13,
    indexRecoveryValue: 1.2,
    verificationPerson: '吴杰（FJHC008）',
    indexComparisonBeforeAfter:
      '处置前支座位移1.8mm，处置后1.2mm，恢复至阈值（≤2mm）范围内',
    maintenanceMaterialTotalUsage: '千斤顶1台，水平仪1台，防锈剂2L，密封胶4支',
    archiveFileCount: 5,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC009',
    relatedWorkOrderCode: 'FJ-YH-B-202406-009',
    relatedWarningCode: 'FJ-YJ-B-202406-009',
    maintenanceBridge: '南平市建溪大桥',
    monitorPosition: '主桥中支座',
    maintenanceType: '振动检测与加固',
    assignedMaintenancePerson: '刘建国（FJYH009）',
    verificationResult: '合格',
    workOrderCompleteTime: '2024-06-16 07:00:00',
    archiveTime: '2024-06-16 09:00:00',
    warningMaintenanceTotalTime: 21.5,
    indexRecoveryValue: 4.8,
    verificationPerson: '郑浩（FJHC009）',
    indexComparisonBeforeAfter:
      '处置前振动频率5.8Hz，处置后4.8Hz，恢复至阈值（1~5Hz）范围内',
    maintenanceMaterialTotalUsage:
      '加固钢板10㎡，螺栓30套，结构胶7kg，防锈剂5L',
    archiveFileCount: 7,
  },
  {
    archiveCode: 'FJ-YH-B-202406-ARC010',
    relatedWorkOrderCode: 'FJ-YH-B-202406-010',
    relatedWarningCode: 'FJ-YJ-B-202406-010',
    maintenanceBridge: '平潭综合实验区海峡大桥',
    monitorPosition: '引桥中支座',
    maintenanceType: '应变检测与修复',
    assignedMaintenancePerson: '蔡伟明（FJYH010）',
    verificationResult: '不合格',
    workOrderCompleteTime: '2024-06-14 09:00:00',
    archiveTime: '2024-06-14 11:00:00',
    warningMaintenanceTotalTime: 16,
    indexRecoveryValue: 195.6,
    verificationPerson: '黄鑫（FJHC010）',
    indexComparisonBeforeAfter:
      '处置前应变值205.6με（预警值），实际195.6με，数据误差未通过核查',
    maintenanceMaterialTotalUsage: '未使用，材料已退回仓库',
    archiveFileCount: 2,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为桥梁养护归档管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'archiveCode',
      label: '归档编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入归档编号（如：FJ-YH-B-202406-ARC001）',
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
        placeholder: '请输入关联工单编号（如：FJ-YH-B-202406-001）',
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
        placeholder: '请输入关联预警编号（如：FJ-YJ-B-202406-001）',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 关联预警编号为必填项
    },
    {
      fieldName: 'maintenanceBridge',
      label: '养护桥梁',
      component: 'Input',
      componentProps: {
        placeholder: '请输入养护桥梁（如：福州市闽江大桥）',
      },
      labelWidth: '120',
      rules: 'required', // 养护桥梁为必填项
    },
    {
      fieldName: 'monitorPosition',
      label: '监测部位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入监测部位（如：主桥左侧支座）',
      },
      labelWidth: '120',
      rules: 'required', // 监测部位为必填项
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '支座更换', value: '支座更换' },
          { label: '支座调平', value: '支座调平' },
          { label: '振动检测与加固', value: '振动检测与加固' },
          { label: '应变检测与修复', value: '应变检测与修复' },
          { label: '设备维修', value: '设备维修' },
          { label: '现场巡检', value: '现场巡检' },
        ],
        placeholder: '请选择养护类型',
        showSearch: true,
      },
      fieldName: 'maintenanceType',
      label: '养护类型',
      rules: 'required',
    },
    {
      fieldName: 'assignedMaintenancePerson',
      label: '指派养护员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入指派养护员（姓名/工号，如：陈铭（FJYH001））',
        maxLength: 100,
      },
      labelWidth: '120',
      rules: 'required', // 指派养护员为必填项
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
      label: '工单完成时间',
      component: 'DatePicker',
      labelWidth: '120',
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
      label: '预警养护总时长',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入预警养护总时长（单位：小时）',
        min: 0, // 时长非负
        precision: 1, // 支持小数（如21.5小时）
        addonAfter: '小时',
      },
      rules: 'required', // 预警养护总时长为必填项
    },
    {
      fieldName: 'indexRecoveryValue',
      label: '指标恢复值',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入指标恢复值（如支座位移1.2mm）',
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
      labelWidth: '120',
      rules: 'required', // 核查员为必填项
    },
    {
      fieldName: 'indexComparisonBeforeAfter',
      label: '养护前后指标对比',
      component: 'InputTextArea',
      componentProps: {
        placeholder:
          '请输入养护前后指标对比（如：处置前支座位移2.5mm，处置后1.2mm）',
        maxlength: 500, // 适配长文本描述
        rows: 4,
      },
      labelWidth: '120',
      rules: 'required', // 养护前后指标对比为必填项
    },
    {
      fieldName: 'maintenanceMaterialTotalUsage',
      label: '养护材料总使用量',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入养护材料总使用量（如：橡胶支座8个，高强螺栓48套）',
        maxlength: 300,
        rows: 3,
      },
      labelWidth: '120',
      rules: 'required', // 养护材料总使用量为必填项
    },
    {
      fieldName: 'archiveFileCount',
      label: '归档文件数',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入归档文件数',
        min: 0, // 文件数非负
        precision: 0, // 整数
      },
      rules: 'required', // 归档文件数为必填项
    },
  ];
}

/** 表格字段 - 改造为桥梁养护归档管理表格列 */
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
      field: 'maintenanceBridge',
      title: '养护桥梁',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'monitorPosition',
      title: '监测部位',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'maintenanceType',
      title: '养护类型',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'assignedMaintenancePerson',
      title: '指派养护员',
      minWidth: 160,
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
      field: 'warningMaintenanceTotalTime',
      title: '预警养护总时长(小时)',
      minWidth: 160,
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
      title: '养护前后指标对比',
      minWidth: 280,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'maintenanceMaterialTotalUsage',
      title: '养护材料总使用量',
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
