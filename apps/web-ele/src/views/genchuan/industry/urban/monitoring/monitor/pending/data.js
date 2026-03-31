/** 表格初始数据 - 窨井盖设施待处置预警数据 */
export const dataList = () => [
  {
    id: '1',
    warnNo: 'MH-YJ-202406-001',
    coverNo: 'MH-202406-003',
    roadName: '泉州市丰泽区刺桐路（湖心街-泉秀街）',
    abnormalType: '倾斜角度异常',
    openStatus: '开启',
    tiltAngle: 15.8,
    vibrationData: 2.5,
    createTime: '2024-06-15 14:32:00',
    dealLimit: 24,
    remainTime: 8,
    assignStatus: '已派单',
    riskLevel: '高风险',
    disposalSuggest: '立即派运维人员现场检查，确认窨井盖状态并进行修复',
  },
  {
    id: '2',
    warnNo: 'MH-YJ-202406-002',
    coverNo: 'MH-202406-007',
    roadName: '龙岩市新罗区龙川路（中山路-登高西路）',
    abnormalType: '振动异常',
    openStatus: '开启',
    tiltAngle: 8.5,
    vibrationData: 1.8,
    createTime: '2024-06-15 14:31:00',
    dealLimit: 12,
    remainTime: 5,
    assignStatus: '未派单',
    riskLevel: '中风险',
    disposalSuggest: '派运维人员现场检查，确认是否存在异常振动原因',
  },
  {
    id: '3',
    warnNo: 'MH-YJ-202406-003',
    coverNo: 'MH-202406-005',
    roadName: '莆田市城厢区荔城南大道（凤凰山-万达广场）',
    abnormalType: '设备离线',
    openStatus: '关闭',
    tiltAngle: 3.2,
    vibrationData: 1.2,
    createTime: '2024-06-15 13:45:00',
    dealLimit: 48,
    remainTime: 24,
    assignStatus: '已派单',
    riskLevel: '中风险',
    disposalSuggest: '检查设备连接状态，重新连接或更换设备',
  },
  {
    id: '4',
    warnNo: 'MH-YJ-202406-004',
    coverNo: 'MH-202406-009',
    roadName: '南平市延平区八一路（江滨路-中山路）',
    abnormalType: '设备异常',
    openStatus: '关闭',
    tiltAngle: 4.2,
    vibrationData: 0.7,
    createTime: '2024-06-15 13:50:00',
    dealLimit: 24,
    remainTime: 10,
    assignStatus: '未派单',
    riskLevel: '低风险',
    disposalSuggest: '检查设备运行状态，进行故障排除',
  },
  {
    id: '5',
    warnNo: 'MH-YJ-202406-005',
    coverNo: 'MH-202406-001',
    roadName: '福州市鼓楼区杨桥东路（东街口-五一广场）',
    abnormalType: '轻微倾斜',
    openStatus: '关闭',
    tiltAngle: 2.5,
    vibrationData: 0.8,
    createTime: '2024-06-15 14:30:00',
    dealLimit: 72,
    remainTime: 48,
    assignStatus: '未派单',
    riskLevel: '低风险',
    disposalSuggest: '定期观察，无需立即处理',
  },
];

/** 文字描述对象 - 窨井盖设施预警文案 */
export const textObj = {
  editText: '编辑预警',
  addText: '手动触发预警',
  excelName: '窨井盖设施待处置预警',
  excelAllName: '窨井盖设施待处置预警.xlsx',
  total: '待处置预警总数:5;高风险预警数:1;中风险预警数:2;低风险预警数:2',
};

/** 新增/修改的表单/列表的搜索表单 - 窨井盖设施待处置预警表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'warnNo',
      label: '预警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预警编号',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required', // 预警编号为必填项
    },
    {
      fieldName: 'coverNo',
      label: '井盖编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入井盖编号',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required', // 井盖编号为必填项
    },
    {
      fieldName: 'roadName',
      label: '路段名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入路段名称',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required', // 路段名称为必填项
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '倾斜角度异常', value: '倾斜角度异常' },
          { label: '振动异常', value: '振动异常' },
          { label: '设备离线', value: '设备离线' },
          { label: '设备异常', value: '设备异常' },
          { label: '轻微倾斜', value: '轻微倾斜' },
        ],
        placeholder: '请选择异常类型',
        showSearch: true,
      },
      fieldName: 'abnormalType',
      label: '异常类型',
      rules: 'required', // 异常类型为必填项
    },
    {
      fieldName: 'tiltAngle',
      label: '倾斜角度',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入倾斜角度',
        min: 0,
        precision: 1,
        addonAfter: '度',
      },
      rules: 'required', // 倾斜角度为必填项
    },
    {
      fieldName: 'vibrationData',
      label: '振动数据',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入振动数据',
        min: 0,
        precision: 1,
      },
      rules: 'required', // 振动数据为必填项
    },
    {
      fieldName: 'createTime',
      label: '触发时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择触发时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required', // 触发时间为必填项
    },
    {
      fieldName: 'dealLimit',
      label: '处置时限',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入处置时限（单位：小时）',
        min: 1,
        precision: 0,
        addonAfter: '小时',
      },
      rules: 'required', // 处置时限为必填项
    },
    {
      fieldName: 'remainTime',
      label: '剩余处置时间',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入剩余处置时间（单位：小时）',
        min: 0,
        precision: 0,
        addonAfter: '小时',
      },
      rules: 'required', // 剩余处置时间为必填项
    },
    {
      component: 'Select',
      labelWidth: '100',
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
      fieldName: 'assignStatus',
      label: '派单状态',
      rules: 'required', // 派单状态为必填项
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '高风险', value: '高风险' },
          { label: '中风险', value: '中风险' },
          { label: '低风险', value: '低风险' },
        ],
        placeholder: '请选择安全风险等级',
        showSearch: true,
      },
      fieldName: 'riskLevel',
      label: '安全风险等级',
      rules: 'required', // 安全风险等级为必填项
    },
    {
      fieldName: 'disposalSuggest',
      label: '处置方向建议',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置方向建议',
        maxlength: 200,
      },
      labelWidth: '100',
      rules: 'required', // 处置方向建议为必填项
    },
  ];
}

/** 表格字段 - 窨井盖设施待处置预警表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'warnNo',
      title: '预警编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'warnNo' },
    },
    {
      field: 'coverNo',
      title: '井盖编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'coverNo' },
    },
    {
      field: 'roadName',
      title: '路段名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'roadName' },
    },
    {
      field: 'abnormalType',
      title: '异常类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'abnormalType' },
    },
    {
      field: 'openStatus',
      title: '开合状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'openStatus' },
    },
    {
      field: 'tiltAngle',
      title: '倾斜角度(度)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'vibrationData',
      title: '振动数据',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '触发时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'dealLimit',
      title: '处置时限(小时)',
      minWidth: 120,
      sortable: true,
      slots: { default: 'dealLimit' },
    },
    {
      field: 'remainTime',
      title: '剩余处置时间(小时)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'assignStatus',
      title: '派单状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'assignStatus' },
    },
    {
      field: 'riskLevel',
      title: '安全风险等级',
      minWidth: 120,
      sortable: true,
      slots: { default: 'riskLevel' },
    },
    {
      field: 'disposalSuggest',
      title: '处置方向建议',
      minWidth: 200,
      sortable: false,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}


