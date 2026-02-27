/** 表格初始数据 - 改造为桥梁预警管理数据 */
export const dataList = () => [
  {
    warningCode: 'FJ-YJ-B-202406-001',
    warningBridge: '福州市闽江大桥',
    monitorPosition: '主桥左侧支座',
    overStandardIndex: '支座位移',
    overStandardValue: 2.5,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅲ级',
    warningTriggerTime: '2024-06-15 08:30:25',
    monitorDeviceCode: 'FJ-FZ-B-202406-001',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 8,
    relatedMonitorData: 'FJ-FZ-B-202406-001-202406150825',
    dispatchStatus: '已接单',
    levelDisposalReq:
      'Ⅲ级预警：立即组织现场核查，24小时内完成应急处置，同步上报市级桥梁管理部门',
  },
  {
    warningCode: 'FJ-YJ-B-202406-002',
    warningBridge: '厦门市集美大桥',
    monitorPosition: '引桥右侧支座',
    overStandardIndex: '振动频率',
    overStandardValue: 5.8,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅱ级',
    warningTriggerTime: '2024-06-14 14:15:40',
    monitorDeviceCode: 'FJ-XM-B-202406-002',
    warningDisposalTimeLimit: 48,
    remainingDisposalTime: 0,
    relatedMonitorData: 'FJ-XM-B-202406-002-202406141410',
    dispatchStatus: '已完成',
    levelDisposalReq:
      'Ⅱ级预警：48小时内完成现场检测，出具初步处置方案，做好交通疏导准备',
  },
  {
    warningCode: 'FJ-YJ-B-202406-003',
    warningBridge: '泉州市晋江大桥',
    monitorPosition: '主桥中跨支座',
    overStandardIndex: '应变值',
    overStandardValue: 210.5,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅲ级',
    warningTriggerTime: '2024-06-15 12:05:10',
    monitorDeviceCode: 'FJ-QZ-B-202406-003',
    warningDisposalTimeLimit: 12,
    remainingDisposalTime: 10,
    relatedMonitorData: 'FJ-QZ-B-202406-003-202406151200',
    dispatchStatus: '未派单',
    levelDisposalReq:
      'Ⅲ级预警：立即组织现场核查，24小时内完成应急处置，同步上报市级桥梁管理部门',
  },
  {
    warningCode: 'FJ-YJ-B-202406-004',
    warningBridge: '漳州市九龙江大桥',
    monitorPosition: '副桥左侧支座',
    overStandardIndex: '支座位移',
    overStandardValue: 1.8,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-15 07:45:30',
    monitorDeviceCode: 'FJ-ZZ-B-202406-004',
    warningDisposalTimeLimit: 18,
    remainingDisposalTime: 5,
    relatedMonitorData: 'FJ-ZZ-B-202406-004-202406150740',
    dispatchStatus: '已派单',
    levelDisposalReq:
      'Ⅰ级预警：18小时内完成数据复核，72小时内完成常规巡检，记录数据变化趋势',
  },
  {
    warningCode: 'FJ-YJ-B-202406-005',
    warningBridge: '莆田市木兰溪大桥',
    monitorPosition: '主桥右侧支座',
    overStandardIndex: '支座位移',
    overStandardValue: 2.2,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅲ级',
    warningTriggerTime: '2024-06-13 19:20:15',
    monitorDeviceCode: 'FJ-PT-B-202406-005',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 0,
    relatedMonitorData: 'FJ-PT-B-202406-005-202406131915',
    dispatchStatus: '已驳回',
    levelDisposalReq:
      'Ⅲ级预警：立即组织现场核查，24小时内完成应急处置，同步上报市级桥梁管理部门',
  },
  {
    warningCode: 'FJ-YJ-B-202406-006',
    warningBridge: '宁德市东湖大桥',
    monitorPosition: '引桥左侧支座',
    overStandardIndex: '振动频率',
    overStandardValue: 5.2,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅱ级',
    warningTriggerTime: '2024-06-14 10:10:05',
    monitorDeviceCode: 'FJ-ND-B-202406-006',
    warningDisposalTimeLimit: 36,
    remainingDisposalTime: 12,
    relatedMonitorData: 'FJ-ND-B-202406-006-202406141005',
    dispatchStatus: '已接单',
    levelDisposalReq:
      'Ⅱ级预警：48小时内完成现场检测，出具初步处置方案，做好交通疏导准备',
  },
  {
    warningCode: 'FJ-YJ-B-202406-007',
    warningBridge: '龙岩市龙津河大桥',
    monitorPosition: '主桥边跨支座',
    overStandardIndex: '应变值',
    overStandardValue: 198.8,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-15 14:30:45',
    monitorDeviceCode: 'FJ-LY-B-202406-007',
    warningDisposalTimeLimit: 12,
    remainingDisposalTime: 9,
    relatedMonitorData: 'FJ-LY-B-202406-007-202406151425',
    dispatchStatus: '未派单',
    levelDisposalReq:
      'Ⅰ级预警：18小时内完成数据复核，72小时内完成常规巡检，记录数据变化趋势',
  },
  {
    warningCode: 'FJ-YJ-B-202406-008',
    warningBridge: '三明市沙溪大桥',
    monitorPosition: '副桥右侧支座',
    overStandardIndex: '支座位移',
    overStandardValue: 1.5,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-14 20:05:20',
    monitorDeviceCode: 'FJ-SM-B-202406-008',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 0,
    relatedMonitorData: 'FJ-SM-B-202406-008-202406142000',
    dispatchStatus: '已完成',
    levelDisposalReq:
      'Ⅰ级预警：18小时内完成数据复核，72小时内完成常规巡检，记录数据变化趋势',
  },
  {
    warningCode: 'FJ-YJ-B-202406-009',
    warningBridge: '南平市建溪大桥',
    monitorPosition: '主桥中支座',
    overStandardIndex: '振动频率',
    overStandardValue: 4.8,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-15 09:15:30',
    monitorDeviceCode: 'FJ-NP-B-202406-009',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 15,
    relatedMonitorData: 'FJ-NP-B-202406-009-202406150910',
    dispatchStatus: '已派单',
    levelDisposalReq:
      'Ⅰ级预警：18小时内完成数据复核，72小时内完成常规巡检，记录数据变化趋势',
  },
  {
    warningCode: 'FJ-YJ-B-202406-010',
    warningBridge: '平潭综合实验区海峡大桥',
    monitorPosition: '引桥中支座',
    overStandardIndex: '应变值',
    overStandardValue: 205.6,
    thresholdStandard:
      '支座位移≤2mm；振动频率1~5Hz；应变值≤200με；预警等级≤Ⅱ级',
    warningLevel: 'Ⅱ级',
    warningTriggerTime: '2024-06-13 16:40:10',
    monitorDeviceCode: 'FJ-PTTH-B-202406-010',
    warningDisposalTimeLimit: 48,
    remainingDisposalTime: 0,
    relatedMonitorData: 'FJ-PTTH-B-202406-010-202406131635',
    dispatchStatus: '已驳回',
    levelDisposalReq:
      'Ⅱ级预警：48小时内完成现场检测，出具初步处置方案，做好交通疏导准备',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为桥梁预警管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'warningCode',
      label: '预警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预警编号',
        maxLength: 50, // 限制编号长度，符合编码规范
      },
      labelWidth: '120',
      rules: 'required', // 预警编号为必填项
    },
    {
      fieldName: 'warningBridge',
      label: '预警桥梁',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预警桥梁（如：福州市闽江大桥）',
      },
      labelWidth: '120',
      rules: 'required', // 预警桥梁为必填项
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
          { label: '支座位移', value: '支座位移' },
          { label: '振动频率', value: '振动频率' },
          { label: '应变值', value: '应变值' },
        ],
        placeholder: '请选择超标指标',
        showSearch: true,
      },
      fieldName: 'overStandardIndex',
      label: '超标指标',
      rules: 'required',
    },
    {
      fieldName: 'overStandardValue',
      label: '超标数值',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入超标数值',
        min: 0, // 数值非负
        precision: 1, // 适配桥梁监测指标小数需求
        addonAfter: '', // 动态适配单位，结合超标指标联动
      },
      rules: 'required', // 超标数值为必填项
    },
    {
      fieldName: 'thresholdStandard',
      label: '阈值标准',
      component: 'Input',
      componentProps: {
        placeholder: '请输入阈值标准（如：支座位移≤2mm；振动频率1~5Hz）',
        maxlength: 200,
      },
      labelWidth: '120',
      rules: 'required', // 阈值标准为必填项
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: 'Ⅰ级', value: 'Ⅰ级' },
          { label: 'Ⅱ级', value: 'Ⅱ级' },
          { label: 'Ⅲ级', value: 'Ⅲ级' },
        ],
        placeholder: '请选择预警等级',
        showSearch: true,
      },
      fieldName: 'warningLevel',
      label: '预警等级',
      rules: 'required',
    },
    {
      fieldName: 'warningTriggerTime',
      label: '预警触发时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择预警触发时间',
        type: 'datetime', // 支持日期+时间选择
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 预警触发时间为必填项
    },
    {
      fieldName: 'monitorDeviceCode',
      label: '监测设备编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入监测设备编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 监测设备编号为必填项
    },
    {
      fieldName: 'warningDisposalTimeLimit',
      label: '预警处置时限',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入预警处置时限（单位：小时）',
        min: 1, // 时限至少1小时
        precision: 0,
        addonAfter: '小时',
      },
      rules: 'required', // 预警处置时限为必填项
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
      fieldName: 'relatedMonitorData',
      label: '关联监测数据',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联监测数据（如：FJ-FZ-B-202406-001-20240615）',
        maxlength: 200,
      },
      labelWidth: '120',
      rules: 'required', // 关联监测数据为必填项
    },
    {
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未派单', value: '未派单' },
          { label: '已派单', value: '已派单' },
          { label: '已接单', value: '已接单' },
          { label: '已完成', value: '已完成' },
          { label: '已驳回', value: '已驳回' },
        ],
        placeholder: '请选择派单状态',
        showSearch: true,
      },
      fieldName: 'dispatchStatus',
      label: '派单状态',
      rules: 'required',
    },
    {
      fieldName: 'levelDisposalReq',
      label: '等级处置要求',
      component: 'InputTextArea', // 长文本用文本域
      componentProps: {
        placeholder:
          '请输入等级处置要求（如：Ⅲ级预警：立即组织现场核查，24小时内完成应急处置）',
        maxlength: 500,
        rows: 3, // 显示3行，适配长文本输入
      },
      labelWidth: '120',
      rules: 'required', // 等级处置要求为必填项
    },
  ];
}

/** 表格字段 - 改造为桥梁预警管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'warningCode',
      title: '预警编号',
      minWidth: 200,
      sortable: true,
      slots: { default: 'warningCode' }, // 自定义slot适配预警编号渲染
    },
    {
      field: 'warningBridge',
      title: '预警桥梁',
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
      field: 'overStandardIndex',
      title: '超标指标',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'overStandardValue',
      title: '超标数值',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'thresholdStandard',
      title: '阈值标准',
      minWidth: 200,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'warningLevel',
      title: '预警等级',
      minWidth: 100,
      sortable: true,
      slots: { default: 'warningLevel' }, // 预留slot用于颜色标记
    },
    {
      field: 'warningTriggerTime',
      title: '预警触发时间',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'monitorDeviceCode',
      title: '监测设备编号',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'warningDisposalTimeLimit',
      title: '预警处置时限(小时)',
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
      field: 'relatedMonitorData',
      title: '关联监测数据',
      minWidth: 220,
      sortable: false, // 文本描述类字段无需排序
    },
    {
      field: 'dispatchStatus',
      title: '派单状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'levelDisposalReq',
      title: '等级处置要求',
      minWidth: 250,
      sortable: false, // 长文本描述类字段无需排序
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
