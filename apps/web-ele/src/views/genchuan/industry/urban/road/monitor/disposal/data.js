/** 表格初始数据 - 改造为出入口管理数据 */
export const dataList = () => [
  {
    workOrderCode: 'FJ-GD-202406-001',
    relatedWarningCode: 'FJ-YJ-202406-001',
    disposalRoadSection: '福州市鼓楼区杨桥东路（东街口-五一广场）',
    disposalType: '坑洼修补',
    assignedMaintenancePerson: '陈铭（FJYW001）',
    workOrderCreateTime: '2024-06-15 09:00:00',
    disposalTimeLimit: 24,
    currentDisposalProgress: '处置中',
    arriveSceneTime: '2024-06-15 10:30:00',
    remainingDisposalTime: 6,
    disposalProgressUpdateTime: '2024-06-15 16:00:00',
    completedDisposalContent: '已修补坑洼6处，剩余2处待修补，现场清理完成',
    sceneDetectionData: '坑洼深度0.3-0.8米，平均深度0.5米，最大坑洼面积0.6㎡',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-002',
    relatedWarningCode: 'FJ-YJ-202406-002',
    disposalRoadSection: '厦门市思明区鹭江道（轮渡码头-中山路）',
    disposalType: '裂缝填补',
    assignedMaintenancePerson: '林晓婷（FJYW002）',
    workOrderCreateTime: '2024-06-14 15:00:00',
    disposalTimeLimit: 48,
    currentDisposalProgress: '已完成',
    arriveSceneTime: '2024-06-14 16:15:00',
    remainingDisposalTime: 0,
    disposalProgressUpdateTime: '2024-06-15 10:00:00',
    completedDisposalContent: '已填补裂缝18.5米，路面打磨平整，现场检测合格',
    sceneDetectionData:
      '裂缝宽度0.2-1.5厘米，最深裂缝深度3厘米，填补后平整度达标',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-003',
    relatedWarningCode: 'FJ-YJ-202406-003',
    disposalRoadSection: '泉州市丰泽区刺桐路（湖心街-泉秀街）',
    disposalType: '路面降温处理',
    assignedMaintenancePerson: '王志远（FJYW003）',
    workOrderCreateTime: '2024-06-15 10:00:00',
    disposalTimeLimit: 12,
    currentDisposalProgress: '前往现场',
    arriveSceneTime: '',
    remainingDisposalTime: 8,
    disposalProgressUpdateTime: '2024-06-15 11:00:00',
    completedDisposalContent: '暂未开始处置，已调配降温设备前往现场',
    sceneDetectionData: '暂未检测，预计路面温度42.3℃，需紧急降温',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-004',
    relatedWarningCode: 'FJ-YJ-202406-004',
    disposalRoadSection: '漳州市芗城区胜利路（延安北路-新华西路）',
    disposalType: '交通疏导',
    assignedMaintenancePerson: '黄丽萍（FJYW004）',
    workOrderCreateTime: '2024-06-15 08:00:00',
    disposalTimeLimit: 18,
    currentDisposalProgress: '现场检测',
    arriveSceneTime: '2024-06-15 08:45:00',
    remainingDisposalTime: 4,
    disposalProgressUpdateTime: '2024-06-15 14:00:00',
    completedDisposalContent: '已完成现场交通流量检测，设置临时疏导标识',
    sceneDetectionData:
      '实测交通流量2500辆/小时，超阈值2000辆/小时，拥堵路段长约300米',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-005',
    relatedWarningCode: 'FJ-YJ-202406-005',
    disposalRoadSection: '莆田市城厢区荔城南大道（凤凰山-万达广场）',
    disposalType: '坑洼修补',
    assignedMaintenancePerson: '郑建明（FJYW005）',
    workOrderCreateTime: '2024-06-13 20:00:00',
    disposalTimeLimit: 24,
    currentDisposalProgress: '已驳回',
    arriveSceneTime: '2024-06-14 09:00:00',
    remainingDisposalTime: 0,
    disposalProgressUpdateTime: '2024-06-14 10:00:00',
    completedDisposalContent: '现场核实坑洼数量与预警数据不符，驳回重新检测',
    sceneDetectionData:
      '实际坑洼数量8个，预警显示15个，数据误差较大，需重新采集',
    timeoutReminderFlag: '已超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-006',
    relatedWarningCode: 'FJ-YJ-202406-006',
    disposalRoadSection: '宁德市蕉城区闽东中路（市政府-万达广场）',
    disposalType: '裂缝填补',
    assignedMaintenancePerson: '吴永辉（FJYW006）',
    workOrderCreateTime: '2024-06-14 11:00:00',
    disposalTimeLimit: 36,
    currentDisposalProgress: '处置中',
    arriveSceneTime: '2024-06-14 13:00:00',
    remainingDisposalTime: 10,
    disposalProgressUpdateTime: '2024-06-15 09:00:00',
    completedDisposalContent: '已填补裂缝10米，剩余6.8米待填补，材料充足',
    sceneDetectionData: '裂缝平均宽度0.6厘米，深度2厘米，无渗水情况',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-007',
    relatedWarningCode: 'FJ-YJ-202406-007',
    disposalRoadSection: '龙岩市新罗区龙川路（中山路-登高西路）',
    disposalType: '路面降温处理',
    assignedMaintenancePerson: '张志强（FJYW007）',
    workOrderCreateTime: '2024-06-15 12:00:00',
    disposalTimeLimit: 12,
    currentDisposalProgress: '未开始',
    arriveSceneTime: '',
    remainingDisposalTime: 5,
    disposalProgressUpdateTime: '2024-06-15 12:00:00',
    completedDisposalContent: '暂未开始处置，运维员正在调配设备',
    sceneDetectionData: '暂未检测，预警显示路面温度41.5℃，需优先处理',
    timeoutReminderFlag: '即将超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-008',
    relatedWarningCode: 'FJ-YJ-202406-008',
    disposalRoadSection: '三明市梅列区列东街（东新四路-东新六路）',
    disposalType: '交通疏导',
    assignedMaintenancePerson: '李芳（FJYW008）',
    workOrderCreateTime: '2024-06-14 21:00:00',
    disposalTimeLimit: 24,
    currentDisposalProgress: '已完成',
    arriveSceneTime: '2024-06-15 07:00:00',
    remainingDisposalTime: 0,
    disposalProgressUpdateTime: '2024-06-15 10:00:00',
    completedDisposalContent:
      '已完成交通疏导，增设临时车道，流量降至1800辆/小时',
    sceneDetectionData: '疏导后交通流量1800辆/小时，符合阈值标准，无拥堵情况',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-009',
    relatedWarningCode: 'FJ-YJ-202406-009',
    disposalRoadSection: '南平市延平区八一路（江滨路-中山路）',
    disposalType: '坑洼修补',
    assignedMaintenancePerson: '刘建国（FJYW009）',
    workOrderCreateTime: '2024-06-15 09:30:00',
    disposalTimeLimit: 24,
    currentDisposalProgress: '待验收',
    arriveSceneTime: '2024-06-15 11:00:00',
    remainingDisposalTime: 12,
    disposalProgressUpdateTime: '2024-06-15 17:00:00',
    completedDisposalContent: '已完成全部11个坑洼修补，等待验收',
    sceneDetectionData: '修补后坑洼深度≤0.1米，路面平整度达标，符合验收标准',
    timeoutReminderFlag: '未超时',
  },
  {
    workOrderCode: 'FJ-GD-202406-010',
    relatedWarningCode: 'FJ-YJ-202406-010',
    disposalRoadSection: '平潭综合实验区金井大道（管委会-龙凤头沙滩）',
    disposalType: '裂缝填补',
    assignedMaintenancePerson: '蔡伟明（FJYW010）',
    workOrderCreateTime: '2024-06-13 17:00:00',
    disposalTimeLimit: 48,
    currentDisposalProgress: '已驳回',
    arriveSceneTime: '2024-06-14 08:00:00',
    remainingDisposalTime: 0,
    disposalProgressUpdateTime: '2024-06-14 09:00:00',
    completedDisposalContent: '现场核实裂缝长度与预警数据不符，驳回重新检测',
    sceneDetectionData:
      '实际裂缝长度12米，预警显示17.2米，数据误差较大，需重新采集',
    timeoutReminderFlag: '已超时',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为道路监测管理表单 */
/** 新增/修改的表单/列表的搜索表单 - 改造为道路预警管理表单 */
/** 新增/修改的表单/列表的搜索表单 - 改造为道路预警工单处置表单 */
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
      labelWidth: '100',
      rules: 'required', // 工单编号为必填项
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
      fieldName: 'workOrderCreateTime',
      label: '工单创建时间',
      component: 'DatePicker',
      labelWidth: '100',
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
      labelWidth: '100',
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
      labelWidth: '100',
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
        placeholder: '请选择当前处置进度',
        showSearch: true,
      },
      fieldName: 'currentDisposalProgress',
      label: '当前处置进度',
      rules: 'required',
    },
    {
      fieldName: 'arriveSceneTime',
      label: '抵达现场时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择抵达现场时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 抵达现场时间为必填项
    },
    {
      fieldName: 'remainingDisposalTime',
      label: '剩余处置时间',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入剩余处置时间（单位：小时）',
        min: 0, // 剩余时间非负
        precision: 0,
        addonAfter: '小时',
      },
      rules: 'required', // 剩余处置时间为必填项
    },
    {
      fieldName: 'disposalProgressUpdateTime',
      label: '处置进度更新时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择处置进度更新时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 处置进度更新时间为必填项
    },
    {
      fieldName: 'completedDisposalContent',
      label: '已完成处置内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入已完成处置内容（如：修补坑洼8处，填补裂缝5米）',
        maxlength: 300, // 适配长文本描述
        type: 'textarea', // 多行文本输入，更贴合内容描述场景
        rows: 3,
      },
      labelWidth: '100',
      rules: 'required', // 已完成处置内容为必填项
    },
    {
      fieldName: 'sceneDetectionData',
      label: '现场检测数据',
      component: 'Input',
      componentProps: {
        placeholder: '请输入现场检测数据（如：坑洼深度0.5米，裂缝宽度0.8厘米）',
        maxlength: 300,
        type: 'textarea',
        rows: 3,
      },
      labelWidth: '100',
      rules: 'required', // 现场检测数据为必填项
    },
    {
      component: 'Select',
      labelWidth: '100',
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

/** 表格字段 - 改造为道路预警工单处置表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'workOrderCode',
      title: '工单编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'workOrderCode' }, // 自定义slot适配工单编号渲染
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
      field: 'currentDisposalProgress',
      title: '当前处置进度',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'arriveSceneTime',
      title: '抵达现场时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'remainingDisposalTime',
      title: '剩余处置时间(小时)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'disposalProgressUpdateTime',
      title: '处置进度更新时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'completedDisposalContent',
      title: '已完成处置内容',
      minWidth: 220,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'sceneDetectionData',
      title: '现场检测数据',
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
