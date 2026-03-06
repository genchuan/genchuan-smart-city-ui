/** 表格初始数据 - 改造为燃气管网运维工单管理数据 */
export const dataList = () => [
  {
    workOrderCode: 'FJ-YW-G-202406-001',
    relatedWarningCode: 'FJ-YJ-G-202406-001',
    warningPipeNetworkSection: '福州市台江区八一七中路管网段',
    affiliatedArea: '台江区',
    disposalType: '管网压力调节',
    assignedMaintenancePerson: '陈铭（FJYW001）',
    workOrderCreateTime: '2024-06-15 09:00:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '处置中',
    remainingDisposalTime: 6,
    arriveSceneTime: '2024-06-15 10:30:00',
    maintenanceProgressUpdateTime: '2024-06-15 16:00:00',
    sceneDetectionData:
      '管网压力0.45MPa（阈值0.2~0.4MPa），调压阀老化，需更换调压装置',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-002',
    relatedWarningCode: 'FJ-YJ-G-202406-002',
    warningPipeNetworkSection: '厦门市思明区湖滨南路管网段',
    affiliatedArea: '思明区',
    disposalType: '燃气浓度检测与泄漏排查',
    assignedMaintenancePerson: '林晓婷（FJYW002）',
    workOrderCreateTime: '2024-06-14 15:00:00',
    disposalTimeLimit: 48,
    currentMaintenanceProgress: '已完成',
    remainingDisposalTime: 0,
    arriveSceneTime: '2024-06-14 16:00:00',
    maintenanceProgressUpdateTime: '2024-06-15 10:00:00',
    sceneDetectionData:
      '燃气浓度1.2%（阈值≤1%），排查发现接口密封不严，已修复，浓度降至0.3%',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-003',
    relatedWarningCode: 'FJ-YJ-G-202406-003',
    warningPipeNetworkSection: '泉州市丰泽区刺桐路管网段',
    affiliatedArea: '丰泽区',
    disposalType: '管网压力调节',
    assignedMaintenancePerson: '王志远（FJYW003）',
    workOrderCreateTime: '2024-06-15 10:00:00',
    disposalTimeLimit: 12,
    currentMaintenanceProgress: '前往现场',
    remainingDisposalTime: 8,
    arriveSceneTime: '',
    maintenanceProgressUpdateTime: '2024-06-15 11:00:00',
    sceneDetectionData:
      '暂未检测，预警显示管网压力0.52MPa，需紧急调压处理',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-004',
    relatedWarningCode: 'FJ-YJ-G-202406-004',
    warningPipeNetworkSection: '漳州市芗城区胜利路管网段',
    affiliatedArea: '芗城区',
    disposalType: '燃气浓度检测与泄漏排查',
    assignedMaintenancePerson: '黄丽萍（FJYW004）',
    workOrderCreateTime: '2024-06-15 08:00:00',
    disposalTimeLimit: 18,
    currentMaintenanceProgress: '现场检测',
    remainingDisposalTime: 4,
    arriveSceneTime: '2024-06-15 08:45:00',
    maintenanceProgressUpdateTime: '2024-06-15 14:00:00',
    sceneDetectionData:
      '实测燃气浓度0.95%，管道接口轻微泄漏，准备密封处理',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-005',
    relatedWarningCode: 'FJ-YJ-G-202406-005',
    warningPipeNetworkSection: '莆田市城厢区文献路管网段',
    affiliatedArea: '城厢区',
    disposalType: '管网压力调节',
    assignedMaintenancePerson: '郑建明（FJYW005）',
    workOrderCreateTime: '2024-06-13 20:00:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '已驳回',
    remainingDisposalTime: 0,
    arriveSceneTime: '2024-06-13 21:00:00',
    maintenanceProgressUpdateTime: '2024-06-14 10:00:00',
    sceneDetectionData:
      '实际管网压力0.40MPa（预警显示0.48MPa），数据误差较大，需重新采集',
    timeoutReminderFlag: '已超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-006',
    relatedWarningCode: 'FJ-YJ-G-202406-006',
    warningPipeNetworkSection: '宁德市蕉城区蕉城南路管网段',
    affiliatedArea: '蕉城区',
    disposalType: '燃气浓度检测与泄漏排查',
    assignedMaintenancePerson: '吴永辉（FJYW006）',
    workOrderCreateTime: '2024-06-14 11:00:00',
    disposalTimeLimit: 36,
    currentMaintenanceProgress: '处置中',
    remainingDisposalTime: 10,
    arriveSceneTime: '2024-06-14 12:30:00',
    maintenanceProgressUpdateTime: '2024-06-15 09:00:00',
    sceneDetectionData: '燃气浓度1.1%，已修复4处泄漏点，剩余2处待处理',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-007',
    relatedWarningCode: 'FJ-YJ-G-202406-007',
    warningPipeNetworkSection: '龙岩市新罗区中山路管网段',
    affiliatedArea: '新罗区',
    disposalType: '管网压力调节',
    assignedMaintenancePerson: '张志强（FJYW007）',
    workOrderCreateTime: '2024-06-15 12:00:00',
    disposalTimeLimit: 12,
    currentMaintenanceProgress: '未开始',
    remainingDisposalTime: 5,
    arriveSceneTime: '',
    maintenanceProgressUpdateTime: '2024-06-15 12:00:00',
    sceneDetectionData: '暂未检测，预警显示管网压力0.42MPa，需优先处理',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-008',
    relatedWarningCode: 'FJ-YJ-G-202406-008',
    warningPipeNetworkSection: '三明市梅列区列东街管网段',
    affiliatedArea: '梅列区',
    disposalType: '燃气浓度检测与泄漏排查',
    assignedMaintenancePerson: '李芳（FJYW008）',
    workOrderCreateTime: '2024-06-14 21:00:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '已完成',
    remainingDisposalTime: 0,
    arriveSceneTime: '2024-06-14 22:00:00',
    maintenanceProgressUpdateTime: '2024-06-15 10:00:00',
    sceneDetectionData: '燃气浓度0.85%，排查无泄漏，调压后浓度稳定在0.5%',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-009',
    relatedWarningCode: 'FJ-YJ-G-202406-009',
    warningPipeNetworkSection: '南平市延平区解放路管网段',
    affiliatedArea: '延平区',
    disposalType: '管网压力调节',
    assignedMaintenancePerson: '刘建国（FJYW009）',
    workOrderCreateTime: '2024-06-15 09:30:00',
    disposalTimeLimit: 24,
    currentMaintenanceProgress: '待验收',
    remainingDisposalTime: 12,
    arriveSceneTime: '2024-06-15 10:00:00',
    maintenanceProgressUpdateTime: '2024-06-15 17:00:00',
    sceneDetectionData: '调压后管网压力0.41MPa，符合阈值标准，等待验收',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-YW-G-202406-010',
    relatedWarningCode: 'FJ-YJ-G-202406-010',
    warningPipeNetworkSection: '平潭综合实验区金井湾管网段',
    affiliatedArea: '平潭综合实验区',
    disposalType: '燃气浓度检测与泄漏排查',
    assignedMaintenancePerson: '蔡伟明（FJYW010）',
    workOrderCreateTime: '2024-06-13 17:00:00',
    disposalTimeLimit: 48,
    currentMaintenanceProgress: '已驳回',
    remainingDisposalTime: 0,
    arriveSceneTime: '2024-06-13 18:00:00',
    maintenanceProgressUpdateTime: '2024-06-14 09:00:00',
    sceneDetectionData:
      '实际燃气浓度1.1%（预警显示1.3%），数据误差较大，需重新采集',
    timeoutReminderFlag: '已超时',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为燃气管网运维工单管理表单 */
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
      fieldName: 'assignedMaintenancePerson',
      label: '指派运维员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入指派运维员（姓名/工号，如：陈铭（FJYW001））',
        maxLength: 100,
      },
      labelWidth: '120',
      rules: 'required', // 指派运维员为必填项
    },
    {
      fieldName: 'workOrderCreateTime',
      label: '创建时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择工单创建时间',
        type: 'datetime', // 支持日期+时间选择
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 创建时间为必填项
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
        placeholder: '请选择当前进度',
        showSearch: true,
      },
      fieldName: 'currentMaintenanceProgress',
      label: '当前进度',
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
      fieldName: 'arriveSceneTime',
      label: '抵达现场时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择抵达现场时间（未抵达则留空）',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: '', // 非必填，未抵达现场时可留空
    },
    {
      fieldName: 'maintenanceProgressUpdateTime',
      label: '进度更新时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择养护进度更新时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 进度更新时间为必填项
    },
    {
      fieldName: 'sceneDetectionData',
      label: '现场检测数据',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入现场检测数据（如：管网压力0.45MPa，燃气浓度1.2%）',
        maxlength: 500,
        rows: 3,
      },
      labelWidth: '120',
      rules: 'required', // 现场检测数据为必填项
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

/** 表格字段 - 改造为燃气管网运维工单管理表格列 */
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
      field: 'assignedMaintenancePerson',
      title: '指派运维员',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'workOrderCreateTime',
      title: '创建时间',
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
      title: '当前进度',
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
      field: 'arriveSceneTime',
      title: '抵达现场时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'maintenanceProgressUpdateTime',
      title: '进度更新时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'sceneDetectionData',
      title: '现场检测数据',
      minWidth: 250,
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