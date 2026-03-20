/** 表格初始数据 - 供水管网监测数据 */
export const dataList = () => [
  {
    id: 1,
    pipeArea: '福州市鼓楼区供水管网分区',
    pipePressure: 0.45,
    pipeFlow: 120,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-FZ-202406-001',
    deviceStatus: '在线',
    staffName: '陈铭（工号：FJYW001）',
    collectFrequency: '5分钟',
    syncDuration: 3,
    monitorStatus: '运行中',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 10:30:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 2,
    pipeArea: '厦门市思明区供水管网分区',
    pipePressure: 0.52,
    pipeFlow: 150,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-XM-202406-002',
    deviceStatus: '在线',
    staffName: '林晓婷（工号：FJYW002）',
    collectFrequency: '10分钟',
    syncDuration: 5,
    monitorStatus: '运行中',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 10:25:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 3,
    pipeArea: '泉州市丰泽区供水管网分区',
    pipePressure: 0.35,
    pipeFlow: 95,
    leakStatus: '疑似泄漏',
    deviceCode: 'WATER-FJ-QZ-202406-003',
    deviceStatus: '异常',
    staffName: '王志远（工号：FJYW003）',
    collectFrequency: '1分钟',
    syncDuration: 2,
    monitorStatus: '异常',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 10:20:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 4,
    pipeArea: '漳州市芗城区供水管网分区',
    pipePressure: 0.48,
    pipeFlow: 80,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-ZZ-202406-004',
    deviceStatus: '在线',
    staffName: '黄丽萍（工号：FJYW004）',
    collectFrequency: '30分钟',
    syncDuration: 4,
    monitorStatus: '运行中',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 10:15:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 5,
    pipeArea: '莆田市城厢区供水管网分区',
    pipePressure: 0.55,
    pipeFlow: 130,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-PT-202406-005',
    deviceStatus: '离线',
    staffName: '郑建明（工号：FJYW005）',
    collectFrequency: '1小时',
    syncDuration: 6,
    monitorStatus: '已停止',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 10:10:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 6,
    pipeArea: '宁德市蕉城区供水管网分区',
    pipePressure: 0.42,
    pipeFlow: 100,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-ND-202406-006',
    deviceStatus: '在线',
    staffName: '吴永辉（工号：FJYW006）',
    collectFrequency: '5分钟',
    syncDuration: 3,
    monitorStatus: '运行中',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 10:05:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 7,
    pipeArea: '龙岩市新罗区供水管网分区',
    pipePressure: 0.38,
    pipeFlow: 110,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-LY-202406-007',
    deviceStatus: '在线',
    staffName: '张志强（工号：FJYW007）',
    collectFrequency: '10分钟',
    syncDuration: 4,
    monitorStatus: '运行中',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 10:00:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 8,
    pipeArea: '三明市梅列区供水管网分区',
    pipePressure: 0.46,
    pipeFlow: 90,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-SM-202406-008',
    deviceStatus: '在线',
    staffName: '李芳（工号：FJYW008）',
    collectFrequency: '30分钟',
    syncDuration: 5,
    monitorStatus: '运行中',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 09:55:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 9,
    pipeArea: '南平市延平区供水管网分区',
    pipePressure: 0.58,
    pipeFlow: 140,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-NP-202406-009',
    deviceStatus: '异常',
    staffName: '刘建国（工号：FJYW009）',
    collectFrequency: '1分钟',
    syncDuration: 2,
    monitorStatus: '已停止',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 09:50:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
  {
    id: 10,
    pipeArea: '平潭综合实验区供水管网分区',
    pipePressure: 0.40,
    pipeFlow: 105,
    leakStatus: '正常',
    deviceCode: 'WATER-FJ-PTTH-202406-010',
    deviceStatus: '在线',
    staffName: '蔡伟明（工号：FJYW010）',
    collectFrequency: '1小时',
    syncDuration: 6,
    monitorStatus: '运行中',
    indexThresholdRange: '压力0.3-0.6MPa；流量80-150m³/h',
    updateTime: '2024-06-15 09:45:00',
    warnPriorityRule: '泄漏>压力异常>流量异常',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 供水管网监测表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'pipeArea',
      label: '管网分区',
      component: 'Input',
      componentProps: {
        placeholder: '请输入管网分区',
      },
      labelWidth: '100',
      rules: 'required', // 管网分区为必填项
    },
    {
      fieldName: 'pipePressure',
      label: '管网压力',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入管网压力（单位：MPa）',
        min: 0, // 压力不能为负数
        precision: 2, // 保留2位小数
        addonAfter: 'MPa',
      },
      rules: [
        { required: true, message: '请输入管网压力' },
        { type: 'number', min: 0.1, max: 1.0, message: '管网压力应在0.1-1.0 MPa之间' }
      ], // 管网压力为必填项且有范围校验
    },
    {
      fieldName: 'pipeFlow',
      label: '管网流量',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入管网流量（单位：m³/h）',
        min: 0, // 流量不能为负数
        precision: 0,
        addonAfter: 'm³/h',
      },
      rules: [
        { required: true, message: '请输入管网流量' },
        { type: 'number', min: 10, max: 500, message: '管网流量应在10-500 m³/h之间' }
      ], // 管网流量为必填项且有范围校验
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '正常', value: '正常' },
          { label: '疑似泄漏', value: '疑似泄漏' },
          { label: '确认泄漏', value: '确认泄漏' },
        ],
        placeholder: '请选择泄漏状态',
        showSearch: true,
      },
      fieldName: 'leakStatus',
      label: '泄漏状态',
      rules: 'required',
    },
    {
      fieldName: 'deviceCode',
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
      fieldName: 'deviceStatus',
      label: '设备在线状态',
      rules: 'required',
    },
    {
      fieldName: 'staffName',
      label: '负责维修员',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入负责维修员姓名/工号',
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
      fieldName: 'collectFrequency',
      label: '数据采集频率',
      rules: 'required',
    },
    {
      fieldName: 'syncDuration',
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
          { label: '运行中', value: '运行中' },
          { label: '已停止', value: '已停止' },
          { label: '异常', value: '异常' },
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
          '请输入指标阈值范围（如：压力0.3-0.6MPa；流量80-150m³/h）',
        maxlength: 200, // 限制输入长度
      },
      rules: [
        { required: true, message: '请输入指标阈值范围' },
        {
          validator: (rule, value, callback) => {
            // 简单的阈值格式校验
            const pressureRegex = /压力\d+\.\d+-\d+\.\d+MPa/;
            const flowRegex = /流量\d+-\d+m³\/h/;
            if (pressureRegex.test(value) && flowRegex.test(value)) {
              callback();
            } else {
              callback(new Error('指标阈值范围格式不正确，请按照示例格式输入'));
            }
          }
        }
      ],
    },
    {
      fieldName: 'warnPriorityRule',
      label: '预警优先级规则',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入预警优先级规则（如：泄漏>压力异常>流量异常）',
        maxlength: 100, // 限制输入长度
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 供水管网监测表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'pipeArea',
      title: '管网分区',
      minWidth: 200,
      sortable: true,
      slots: { default: 'pipeArea' }, // 自定义slot适配管网分区渲染
    },
    {
      field: 'pipePressure',
      title: '管网压力(MPa)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'pipePressure' },
    },
    {
      field: 'pipeFlow',
      title: '管网流量(m³/h)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'pipeFlow' },
    },
    {
      field: 'leakStatus',
      title: '泄漏状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'leakStatus' }, // 自定义slot适配泄漏状态渲染
    },
    {
      field: 'deviceCode',
      title: '监测设备编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'deviceCode' }, // 自定义slot适配设备编号渲染
    },
    {
      field: 'deviceStatus',
      title: '设备在线状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'deviceStatus' }, // 自定义slot适配设备状态渲染
    },
    {
      field: 'staffName',
      title: '负责维修员',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'collectFrequency',
      title: '数据采集频率',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'syncDuration',
      title: '数据同步时长(秒)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'monitorStatus',
      title: '监测状态',
      minWidth: 160,
      sortable: true,
      slots: { default: 'monitorStatus' }, // 自定义slot适配监测状态渲染
    },
    {
      field: 'indexThresholdRange',
      title: '指标阈值范围',
      minWidth: 200,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'updateTime',
      title: '最近更新时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'warnPriorityRule',
      title: '预警优先级规则',
      minWidth: 180,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 过滤表单字段 - 供水管网监测过滤表单 */
export function useFilterFormSchema() {
  return [
    {
      fieldName: 'pipeArea',
      label: '管网分区',
      component: 'Input',
      componentProps: {
        placeholder: '请输入管网分区',
      },
      labelWidth: '100',
      isSearch: true,
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '正常', value: '正常' },
          { label: '疑似泄漏', value: '疑似泄漏' },
          { label: '确认泄漏', value: '确认泄漏' },
        ],
        placeholder: '请选择泄漏状态',
        showSearch: true,
      },
      fieldName: 'leakStatus',
      label: '泄漏状态',
      isSearch: true,
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
      fieldName: 'deviceStatus',
      label: '设备在线状态',
      isSearch: true,
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '运行中', value: '运行中' },
          { label: '已停止', value: '已停止' },
          { label: '异常', value: '异常' },
        ],
        placeholder: '请选择监测状态',
        showSearch: true,
      },
      fieldName: 'monitorStatus',
      label: '监测状态',
      isSearch: true,
    },
  ];
}
