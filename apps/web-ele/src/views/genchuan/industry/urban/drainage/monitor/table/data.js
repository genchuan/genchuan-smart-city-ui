/** 表格初始数据 - 改造为出入口管理数据 */
export const dataList = () => [
  {
    roadSectionName: '福州市鼓楼区杨桥东路（东街口-五一广场）',
    potholeCount: 6,
    crackLength: 9.8,
    roadSurfaceTemp: 27.5,
    trafficFlow: 1180,
    monitorDeviceCode: 'FJ-FZ-202406-001',
    deviceOnlineStatus: '在线',
    maintenancePerson: '陈铭（工号：FJYW001）',
    dataCollectionFreq: '5分钟',
    dataSyncDuration: 3,
    monitorStatus: '正常监测',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '厦门市思明区鹭江道（轮渡码头-中山路）',
    potholeCount: 2,
    crackLength: 3.5,
    roadSurfaceTemp: 29.2,
    trafficFlow: 1560,
    monitorDeviceCode: 'FJ-XM-202406-002',
    deviceOnlineStatus: '在线',
    maintenancePerson: '林晓婷（工号：FJYW002）',
    dataCollectionFreq: '10分钟',
    dataSyncDuration: 5,
    monitorStatus: '正常监测',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '泉州市丰泽区刺桐路（湖心街-泉秀街）',
    potholeCount: 12,
    crackLength: 18.3,
    roadSurfaceTemp: 28.8,
    trafficFlow: 950,
    monitorDeviceCode: 'FJ-QZ-202406-003',
    deviceOnlineStatus: '异常',
    maintenancePerson: '王志远（工号：FJYW003）',
    dataCollectionFreq: '1分钟',
    dataSyncDuration: 2,
    monitorStatus: '数据异常',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '漳州市芗城区胜利路（延安北路-新华西路）',
    potholeCount: 0,
    crackLength: 1.2,
    roadSurfaceTemp: 30.1,
    trafficFlow: 780,
    monitorDeviceCode: 'FJ-ZZ-202406-004',
    deviceOnlineStatus: '在线',
    maintenancePerson: '黄丽萍（工号：FJYW004）',
    dataCollectionFreq: '30分钟',
    dataSyncDuration: 4,
    monitorStatus: '正常监测',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '莆田市城厢区荔城南大道（凤凰山-万达广场）',
    potholeCount: 8,
    crackLength: 14.7,
    roadSurfaceTemp: 28,
    trafficFlow: 890,
    monitorDeviceCode: 'FJ-PT-202406-005',
    deviceOnlineStatus: '离线',
    maintenancePerson: '郑建明（工号：FJYW005）',
    dataCollectionFreq: '1小时',
    dataSyncDuration: 6,
    monitorStatus: '设备故障',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '宁德市蕉城区闽东中路（市政府-万达广场）',
    potholeCount: 5,
    crackLength: 7.9,
    roadSurfaceTemp: 26.3,
    trafficFlow: 650,
    monitorDeviceCode: 'FJ-ND-202406-006',
    deviceOnlineStatus: '在线',
    maintenancePerson: '吴永辉（工号：FJYW006）',
    dataCollectionFreq: '5分钟',
    dataSyncDuration: 3,
    monitorStatus: '正常监测',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '龙岩市新罗区龙川路（中山路-登高西路）',
    potholeCount: 10,
    crackLength: 15,
    roadSurfaceTemp: 27.8,
    trafficFlow: 1020,
    monitorDeviceCode: 'FJ-LY-202406-007',
    deviceOnlineStatus: '在线',
    maintenancePerson: '张志强（工号：FJYW007）',
    dataCollectionFreq: '10分钟',
    dataSyncDuration: 4,
    monitorStatus: '人工巡检中',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '三明市梅列区列东街（东新四路-东新六路）',
    potholeCount: 4,
    crackLength: 6.5,
    roadSurfaceTemp: 25.9,
    trafficFlow: 720,
    monitorDeviceCode: 'FJ-SM-202406-008',
    deviceOnlineStatus: '在线',
    maintenancePerson: '李芳（工号：FJYW008）',
    dataCollectionFreq: '30分钟',
    dataSyncDuration: 5,
    monitorStatus: '正常监测',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '南平市延平区八一路（江滨路-中山路）',
    potholeCount: 7,
    crackLength: 11.2,
    roadSurfaceTemp: 26.7,
    trafficFlow: 850,
    monitorDeviceCode: 'FJ-NP-202406-009',
    deviceOnlineStatus: '异常',
    maintenancePerson: '刘建国（工号：FJYW009）',
    dataCollectionFreq: '1分钟',
    dataSyncDuration: 2,
    monitorStatus: '暂停监测',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
  {
    roadSectionName: '平潭综合实验区金井大道（管委会-龙凤头沙滩）',
    potholeCount: 1,
    crackLength: 2.8,
    roadSurfaceTemp: 31.5,
    trafficFlow: 1380,
    monitorDeviceCode: 'FJ-PTTH-202406-010',
    deviceOnlineStatus: '在线',
    maintenancePerson: '蔡伟明（工号：FJYW010）',
    dataCollectionFreq: '1小时',
    dataSyncDuration: 6,
    monitorStatus: '正常监测',
    indexThresholdRange: '坑洼≤10个；裂缝≤15米；温度-5~40℃；流量≤2000辆/小时',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为道路监测管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'roadSectionName',
      label: '路段名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入路段名称',
      },
      labelWidth: '100',
      rules: 'required', // 路段名称为必填项
    },
    {
      fieldName: 'potholeCount',
      label: '坑洼数量',
      component: 'InputNumber', // 数量用数字输入框，贴合场景
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入坑洼数量',
        min: 0, // 数量不能为负数
        precision: 0, // 只能输入整数
      },
      rules: 'required', // 坑洼数量为必填项
    },
    {
      fieldName: 'crackLength',
      label: '裂缝长度',
      component: 'InputNumber', // 长度用数字输入框，支持小数
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入裂缝长度（单位：米）',
        min: 0, // 长度不能为负数
        precision: 2, // 保留2位小数，贴合长度计量场景
        addonAfter: '米', // 增加单位提示，提升用户体验
      },
      rules: 'required', // 裂缝长度为必填项
    },
    {
      fieldName: 'roadSurfaceTemp',
      label: '路面温度',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入路面温度（单位：℃）',
        min: -40, // 最低温度阈值（符合实际场景）
        max: 80, // 最高温度阈值
        precision: 1, // 保留1位小数
        addonAfter: '℃',
      },
      rules: 'required',
    },
    {
      fieldName: 'trafficFlow',
      label: '交通流量',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入交通流量（单位：辆/小时）',
        min: 0,
        precision: 0,
        addonAfter: '辆/小时',
      },
      rules: 'required',
    },
    {
      fieldName: 'monitorDeviceCode',
      label: '监测设备编号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入监测设备编号',
        maxLength: 50, // 限制编号长度，避免输入过长
      },
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '在线', value: '在线' },
          { label: '离线', value: '离线' },
          { label: '异常', value: '异常' },
        ],
        placeholder: '请选择设备在线状态',
        showSearch: true,
      },
      fieldName: 'deviceOnlineStatus',
      label: '设备在线状态',
      rules: 'required',
    },
    {
      fieldName: 'maintenancePerson',
      label: '负责运维员',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入负责运维员姓名/工号',
      },
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '1分钟', value: '1分钟' },
          { label: '5分钟', value: '5分钟' },
          { label: '10分钟', value: '10分钟' },
          { label: '30分钟', value: '30分钟' },
          { label: '1小时', value: '1小时' },
          { label: '24小时', value: '24小时' },
        ],
        placeholder: '请选择数据采集频率',
        showSearch: true,
      },
      fieldName: 'dataCollectionFreq',
      label: '数据采集频率',
      rules: 'required',
    },
    {
      fieldName: 'dataSyncDuration',
      label: '数据同步时长',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入数据同步时长（单位：秒）',
        min: 1, // 同步时长至少1秒
        precision: 0,
        addonAfter: '秒',
      },
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '正常监测', value: '正常监测' },
          { label: '暂停监测', value: '暂停监测' },
          { label: '数据异常', value: '数据异常' },
          { label: '设备故障', value: '设备故障' },
          { label: '人工巡检中', value: '人工巡检中' },
        ],
        placeholder: '请选择监测状态',
        showSearch: true,
      },
      fieldName: 'monitorStatus',
      label: '监测状态',
      rules: 'required',
    },
    {
      fieldName: 'indexThresholdRange',
      label: '指标阈值范围',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder:
          '请输入指标阈值范围（如：坑洼≤5个；裂缝≤10米；温度-10~40℃）',
        maxlength: 200, // 限制输入长度
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 改造为道路监测管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'roadSectionName',
      title: '路段名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'roadSectionName' }, // 自定义slot适配路段名称渲染
    },
    {
      field: 'potholeCount',
      title: '坑洼数量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'crackLength',
      title: '裂缝长度(米)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'roadSurfaceTemp',
      title: '路面温度(℃)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'trafficFlow',
      title: '交通流量(辆/小时)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'monitorDeviceCode',
      title: '监测设备编号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'deviceOnlineStatus',
      title: '设备在线状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'maintenancePerson',
      title: '负责运维员',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'dataCollectionFreq',
      title: '数据采集频率',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'dataSyncDuration',
      title: '数据同步时长(秒)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'monitorStatus',
      title: '监测状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'indexThresholdRange',
      title: '指标阈值范围',
      minWidth: 200,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
