/** 表格初始数据 - 改造为通用预警管理数据 */
export const dataList = () => [
  {
    warningCode: 'FJ-YJ-G-202406-001',
    affiliatedArea: '福州市台江区',
    overStandardIndex: '管网压力',
    overStandardValue: 0.45,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅲ级',
    warningTriggerTime: '2024-06-15 08:30:25',
    monitorDeviceCode: 'FJ-FZ-G-202406-001',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 8,
    dispatchStatus: '已接单',
    riskLevel: '高风险',
    createUser: '陈铭（工号：FJYW001）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-002',
    affiliatedArea: '厦门市思明区',
    overStandardIndex: '燃气浓度',
    overStandardValue: 1.2,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅱ级',
    warningTriggerTime: '2024-06-14 14:15:40',
    monitorDeviceCode: 'FJ-XM-G-202406-002',
    warningDisposalTimeLimit: 48,
    remainingDisposalTime: 0,
    dispatchStatus: '已完成',
    riskLevel: '中风险',
    createUser: '林晓婷（工号：FJYW002）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-003',
    affiliatedArea: '泉州市丰泽区',
    overStandardIndex: '管网压力',
    overStandardValue: 0.52,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅲ级',
    warningTriggerTime: '2024-06-15 12:05:10',
    monitorDeviceCode: 'FJ-QZ-G-202406-003',
    warningDisposalTimeLimit: 12,
    remainingDisposalTime: 10,
    dispatchStatus: '未派单',
    riskLevel: '高风险',
    createUser: '王志远（工号：FJYW003）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-004',
    affiliatedArea: '漳州市芗城区',
    overStandardIndex: '燃气浓度',
    overStandardValue: 0.95,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-15 07:45:30',
    monitorDeviceCode: 'FJ-ZZ-G-202406-004',
    warningDisposalTimeLimit: 18,
    remainingDisposalTime: 5,
    dispatchStatus: '已派单',
    riskLevel: '低风险',
    createUser: '黄丽萍（工号：FJYW004）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-005',
    affiliatedArea: '莆田市城厢区',
    overStandardIndex: '管网压力',
    overStandardValue: 0.48,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅲ级',
    warningTriggerTime: '2024-06-13 19:20:15',
    monitorDeviceCode: 'FJ-PT-G-202406-005',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 0,
    dispatchStatus: '已驳回',
    riskLevel: '高风险',
    createUser: '郑建明（工号：FJYW005）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-006',
    affiliatedArea: '宁德市蕉城区',
    overStandardIndex: '燃气浓度',
    overStandardValue: 1.1,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅱ级',
    warningTriggerTime: '2024-06-14 10:10:05',
    monitorDeviceCode: 'FJ-ND-G-202406-006',
    warningDisposalTimeLimit: 36,
    remainingDisposalTime: 12,
    dispatchStatus: '已接单',
    riskLevel: '中风险',
    createUser: '吴永辉（工号：FJYW006）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-007',
    affiliatedArea: '龙岩市新罗区',
    overStandardIndex: '管网压力',
    overStandardValue: 0.42,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-15 14:30:45',
    monitorDeviceCode: 'FJ-LY-G-202406-007',
    warningDisposalTimeLimit: 12,
    remainingDisposalTime: 9,
    dispatchStatus: '未派单',
    riskLevel: '低风险',
    createUser: '张志强（工号：FJYW007）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-008',
    affiliatedArea: '三明市梅列区',
    overStandardIndex: '燃气浓度',
    overStandardValue: 0.85,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-14 20:05:20',
    monitorDeviceCode: 'FJ-SM-G-202406-008',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 0,
    dispatchStatus: '已完成',
    riskLevel: '低风险',
    createUser: '李芳（工号：FJYW008）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-009',
    affiliatedArea: '南平市延平区',
    overStandardIndex: '管网压力',
    overStandardValue: 0.41,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅰ级',
    warningTriggerTime: '2024-06-15 09:15:30',
    monitorDeviceCode: 'FJ-NP-G-202406-009',
    warningDisposalTimeLimit: 24,
    remainingDisposalTime: 15,
    dispatchStatus: '已派单',
    riskLevel: '低风险',
    createUser: '刘建国（工号：FJYW009）',
  },
  {
    warningCode: 'FJ-YJ-G-202406-010',
    affiliatedArea: '平潭综合实验区',
    overStandardIndex: '燃气浓度',
    overStandardValue: 1.3,
    thresholdStandard: '管网压力0.2~0.4MPa；燃气浓度≤1%；预警等级≤Ⅱ级',
    warningLevel: 'Ⅱ级',
    warningTriggerTime: '2024-06-13 16:40:10',
    monitorDeviceCode: 'FJ-PTTH-G-202406-010',
    warningDisposalTimeLimit: 48,
    remainingDisposalTime: 0,
    dispatchStatus: '已驳回',
    riskLevel: '中风险',
    createUser: '蔡伟明（工号：FJYW010）',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为通用预警管理表单 */
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
      fieldName: 'affiliatedArea',
      label: '所属区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属区域（如：福州市台江区）',
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
          { label: '管网压力', value: '管网压力' },
          { label: '燃气浓度', value: '燃气浓度' },
          { label: '温度', value: '温度' },
          { label: '流量', value: '流量' },
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
        precision: 2, // 适配通用监测指标小数需求
        addonAfter: '', // 动态适配单位，结合超标指标联动
      },
      rules: 'required', // 超标数值为必填项
    },
    {
      fieldName: 'thresholdStandard',
      label: '阈值标准',
      component: 'Input',
      componentProps: {
        placeholder: '请输入阈值标准（如：管网压力0.2~0.4MPa；燃气浓度≤1%）',
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
      label: '触发时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择预警触发时间',
        type: 'datetime', // 支持日期+时间选择
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 触发时间为必填项
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
      label: '处置时限',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入预警处置时限（单位：小时）',
        min: 1, // 时限至少1小时
        precision: 0,
        addonAfter: '小时',
      },
      rules: 'required', // 处置时限为必填项
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
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '低风险', value: '低风险' },
          { label: '中风险', value: '中风险' },
          { label: '高风险', value: '高风险' },
        ],
        placeholder: '请选择风险等级',
        showSearch: true,
      },
      fieldName: 'riskLevel',
      label: '风险等级',
      rules: 'required',
    },
    {
      fieldName: 'createUser',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人姓名/工号',
        maxlength: 50,
      },
      labelWidth: '120',
      rules: 'required', // 创建人为必填项
    },
  ];
}

/** 表格字段 - 改造为通用预警管理表格列 */
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
      field: 'affiliatedArea',
      title: '所属区域',
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
      title: '触发时间',
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
      title: '处置时限(小时)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'remainingDisposalTime',
      title: '剩余处置时间(小时)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'dispatchStatus',
      title: '派单状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'riskLevel',
      title: '风险等级',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'createUser',
      title: '创建人',
      minWidth: 160,
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