/** 表格初始数据 - 改造为桥梁养护工单管理数据 */
export const dataList = () => [
  {
    workOrderCode: 'FJ-YH-B-202406-001',
    relatedWarningCode: 'FJ-YJ-B-202406-001',
    maintenanceBridge: '福州市闽江大桥',
    monitorPosition: '主桥左侧支座',
    maintenanceType: '支座更换',
    assignedMaintenancePerson: '陈铭（FJYH001）',
    workOrderCreateTime: '2024-06-15 09:00:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '处置中',
    remainingDisposalTime: 6,
    maintenanceProgressUpdateTime: '2024-06-15 16:00:00',
    completedMaintenanceContent: '已拆卸旧支座6个，剩余2个待更换，现场清理完成',
    sceneDetectionData:
      '支座最大位移2.5mm，超出阈值2mm，支座老化程度70%，需紧急更换',
    maintenanceMaterialUsage: '橡胶支座8个，高强螺栓48套，密封胶12支，润滑油5L',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-002',
    relatedWarningCode: 'FJ-YJ-B-202406-002',
    maintenanceBridge: '厦门市集美大桥',
    monitorPosition: '引桥右侧支座',
    maintenanceType: '振动检测与加固',
    assignedMaintenancePerson: '林晓婷（FJYH002）',
    workOrderCreateTime: '2024-06-14 15:00:00',
    disposalTimeLimit: 48,
    currentMaintenanceProgress: '已完成',
    remainingDisposalTime: 0,
    maintenanceProgressUpdateTime: '2024-06-15 10:00:00',
    completedMaintenanceContent:
      '已完成振动频率检测（5.8Hz），加固支座8处，检测合格',
    sceneDetectionData:
      '加固前振动频率5.8Hz（阈值1~5Hz），加固后降至4.2Hz，符合安全标准',
    maintenanceMaterialUsage: '抗震加固钢板12㎡，膨胀螺栓36套，环氧结构胶8kg',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-003',
    relatedWarningCode: 'FJ-YJ-B-202406-003',
    maintenanceBridge: '泉州市晋江大桥',
    monitorPosition: '主桥中跨支座',
    maintenanceType: '应变检测与修复',
    assignedMaintenancePerson: '王志远（FJYH003）',
    workOrderCreateTime: '2024-06-15 10:00:00',
    disposalTimeLimit: 12,
    currentMaintenanceProgress: '前往现场',
    remainingDisposalTime: 8,
    maintenanceProgressUpdateTime: '2024-06-15 11:00:00',
    completedMaintenanceContent: '暂未开始处置，已调配应变检测设备前往现场',
    sceneDetectionData:
      '暂未检测，预警显示应变值210.5με（阈值≤200με），需紧急检测修复',
    maintenanceMaterialUsage: '暂未使用，已调配应变片20片，数据采集仪1台',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-004',
    relatedWarningCode: 'FJ-YJ-B-202406-004',
    maintenanceBridge: '漳州市九龙江大桥',
    monitorPosition: '副桥左侧支座',
    maintenanceType: '支座调平',
    assignedMaintenancePerson: '黄丽萍（FJYH004）',
    workOrderCreateTime: '2024-06-15 08:00:00',
    disposalTimeLimit: 18,
    currentMaintenanceProgress: '现场检测',
    remainingDisposalTime: 4,
    maintenanceProgressUpdateTime: '2024-06-15 14:00:00',
    completedMaintenanceContent: '已完成支座位移检测（1.8mm），准备调平设备',
    sceneDetectionData:
      '实测支座位移1.8mm（阈值≤2mm），左侧支座倾斜0.5°，需调平处理',
    maintenanceMaterialUsage: '液压调平千斤顶2台，水平仪1台，防锈剂3L',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-005',
    relatedWarningCode: 'FJ-YJ-B-202406-005',
    maintenanceBridge: '莆田市木兰溪大桥',
    monitorPosition: '主桥右侧支座',
    maintenanceType: '支座更换',
    assignedMaintenancePerson: '郑建明（FJYH005）',
    workOrderCreateTime: '2024-06-13 20:00:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '已驳回',
    remainingDisposalTime: 0,
    maintenanceProgressUpdateTime: '2024-06-14 10:00:00',
    completedMaintenanceContent: '现场核实支座位移数据与预警不符，驳回重新检测',
    sceneDetectionData:
      '实际支座位移1.9mm（预警显示2.2mm），数据误差较大，需重新采集',
    maintenanceMaterialUsage: '未使用，驳回后材料已退回仓库',
    timeoutReminderFlag: '已超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-006',
    relatedWarningCode: 'FJ-YJ-B-202406-006',
    maintenanceBridge: '宁德市东湖大桥',
    monitorPosition: '引桥左侧支座',
    maintenanceType: '振动检测与加固',
    assignedMaintenancePerson: '吴永辉（FJYH006）',
    workOrderCreateTime: '2024-06-14 11:00:00',
    disposalTimeLimit: 36,
    currentMaintenanceProgress: '处置中',
    remainingDisposalTime: 10,
    maintenanceProgressUpdateTime: '2024-06-15 09:00:00',
    completedMaintenanceContent: '已加固支座6处，剩余2处待完成，材料充足',
    sceneDetectionData: '加固前振动频率5.2Hz，加固后降至4.5Hz，无渗水情况',
    maintenanceMaterialUsage: '加固钢板8㎡，螺栓24套，结构胶5kg',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-007',
    relatedWarningCode: 'FJ-YJ-B-202406-007',
    maintenanceBridge: '龙岩市龙津河大桥',
    monitorPosition: '主桥边跨支座',
    maintenanceType: '应变检测与修复',
    assignedMaintenancePerson: '张志强（FJYH007）',
    workOrderCreateTime: '2024-06-15 12:00:00',
    disposalTimeLimit: 12,
    currentMaintenanceProgress: '未开始',
    remainingDisposalTime: 5,
    maintenanceProgressUpdateTime: '2024-06-15 12:00:00',
    completedMaintenanceContent: '暂未开始处置，养护员正在调配设备',
    sceneDetectionData: '暂未检测，预警显示应变值198.8με，需优先处理',
    maintenanceMaterialUsage: '暂未使用，已调配检测设备1套',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-008',
    relatedWarningCode: 'FJ-YJ-B-202406-008',
    maintenanceBridge: '三明市沙溪大桥',
    monitorPosition: '副桥右侧支座',
    maintenanceType: '支座调平',
    assignedMaintenancePerson: '李芳（FJYH008）',
    workOrderCreateTime: '2024-06-14 21:00:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '已完成',
    remainingDisposalTime: 0,
    maintenanceProgressUpdateTime: '2024-06-15 10:00:00',
    completedMaintenanceContent: '已完成支座调平，位移降至1.2mm，符合安全标准',
    sceneDetectionData: '调平后支座位移1.2mm，水平度0.1°，符合验收标准',
    maintenanceMaterialUsage: '千斤顶1台，水平仪1台，防锈剂2L，密封胶4支',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-009',
    relatedWarningCode: 'FJ-YJ-B-202406-009',
    maintenanceBridge: '南平市建溪大桥',
    monitorPosition: '主桥中支座',
    maintenanceType: '振动检测与加固',
    assignedMaintenancePerson: '刘建国（FJYH009）',
    workOrderCreateTime: '2024-06-15 09:30:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '待验收',
    remainingDisposalTime: 12,
    maintenanceProgressUpdateTime: '2024-06-15 17:00:00',
    completedMaintenanceContent: '已完成全部8处支座加固，等待验收',
    sceneDetectionData: '加固后振动频率4.8Hz，符合阈值1~5Hz，平整度达标',
    maintenanceMaterialUsage: '加固钢板10㎡，螺栓30套，结构胶7kg',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YH-B-202406-010',
    relatedWarningCode: 'FJ-YJ-B-202406-010',
    maintenanceBridge: '平潭综合实验区海峡大桥',
    monitorPosition: '引桥中支座',
    maintenanceType: '应变检测与修复',
    assignedMaintenancePerson: '蔡伟明（FJYH010）',
    workOrderCreateTime: '2024-06-13 17:00:00',
    disposalTimeLimit: 48,
    currentMaintenanceProgress: '已驳回',
    remainingDisposalTime: 0,
    maintenanceProgressUpdateTime: '2024-06-14 09:00:00',
    completedMaintenanceContent: '现场核实应变值数据与预警不符，驳回重新检测',
    sceneDetectionData:
      '实际应变值195.6με（预警显示205.6με），数据误差较大，需重新采集',
    maintenanceMaterialUsage: '未使用，材料已退回仓库',
    timeoutReminderFlag: '已超时',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为桥梁养护工单管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'workOrderCode',
      label: '工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单编号',
        maxLength: 50, // 限制编号长度，符合编码规范
      },
      labelWidth: '120',
      rules: 'required', // 工单编号为必填项
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
      fieldName: 'workOrderCreateTime',
      label: '工单创建时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择工单创建时间',
        type: 'datetime', // 支持日期+时间选择
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 工单创建时间为必填项
    },
    {
      fieldName: 'disposalTimeLimit',
      label: '处置时限',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入处置时限（单位：小时）',
        min: 1, // 时限至少1小时
        precision: 0,
        addonAfter: '小时',
      },
      rules: 'required', // 处置时限为必填项
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未开始', value: '未开始' },
          { label: '前往现场', value: '前往现场' },
          { label: '现场检测', value: '现场检测' },
          { label: '处置中', value: '处置中' },
          { label: '待验收', value: '待验收' },
          { label: '已完成', value: '已完成' },
          { label: '已驳回', value: '已驳回' },
        ],
        placeholder: '请选择当前养护进度',
        showSearch: true,
      },
      fieldName: 'currentMaintenanceProgress',
      label: '当前养护进度',
      rules: 'required',
    },
    {
      fieldName: 'remainingDisposalTime',
      label: '剩余处置时间',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入剩余处置时间（单位：小时）',
        min: 0, // 剩余时间非负
        precision: 0,
        addonAfter: '小时',
      },
      rules: 'required', // 剩余处置时间为必填项
    },
    {
      fieldName: 'maintenanceProgressUpdateTime',
      label: '养护进度更新时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择养护进度更新时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 养护进度更新时间为必填项
    },
    {
      fieldName: 'completedMaintenanceContent',
      label: '已完成养护内容',
      component: 'InputTextArea', // 长文本用文本域
      componentProps: {
        placeholder: '请输入已完成养护内容（如：已更换支座6个，加固8处）',
        maxlength: 500,
        rows: 3, // 显示3行，适配长文本输入
      },
      labelWidth: '120',
      rules: 'required', // 已完成养护内容为必填项
    },
    {
      fieldName: 'sceneDetectionData',
      label: '现场检测数据',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入现场检测数据（如：支座位移2.5mm，振动频率5.8Hz）',
        maxlength: 500,
        rows: 3,
      },
      labelWidth: '120',
      rules: 'required', // 现场检测数据为必填项
    },
    {
      fieldName: 'maintenanceMaterialUsage',
      label: '养护材料使用量',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入养护材料使用量（如：橡胶支座8个，高强螺栓48套）',
        maxlength: 300,
        rows: 2,
      },
      labelWidth: '120',
      rules: 'required', // 养护材料使用量为必填项
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未超时', value: '未超时' },
          { label: '即将超时', value: '即将超时' },
          { label: '已超时', value: '已超时' },
        ],
        placeholder: '请选择超时提醒标识',
        showSearch: true,
      },
      fieldName: 'timeoutReminderFlag',
      label: '超时提醒标识',
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为桥梁养护工单管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'workOrderCode',
      title: '工单编号',
      minWidth: 200,
      sortable: true,
      slots: { default: 'workOrderCode' }, // 自定义slot适配工单编号渲染
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
      field: 'workOrderCreateTime',
      title: '工单创建时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'disposalTimeLimit',
      title: '处置时限(小时)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'currentMaintenanceProgress',
      title: '当前养护进度',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'remainingDisposalTime',
      title: '剩余处置时间(小时)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'maintenanceProgressUpdateTime',
      title: '养护进度更新时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'completedMaintenanceContent',
      title: '已完成养护内容',
      minWidth: 250,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'sceneDetectionData',
      title: '现场检测数据',
      minWidth: 250,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'maintenanceMaterialUsage',
      title: '养护材料使用量',
      minWidth: 220,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'timeoutReminderFlag',
      title: '超时提醒标识',
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
