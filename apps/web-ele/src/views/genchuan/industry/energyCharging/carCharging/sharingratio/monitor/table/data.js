/** 分账方案统计分析数据 */
export const dataList = () => [
  {
    plan_code: 'FZ2024001',
    plan_name: '场站常规分账方案',
    partner_name: '福州XX科技有限公司',
    share_ratio: 30.5,
    station_ids: '国家电网充电桩',
    effect_time: '2024-01-01 00:00:00',
    status: '生效中',
    create_time: '2023-12-20 15:30:25'
  },
  {
    plan_code: 'FZ2024002',
    plan_name: '核心场站专属分账方案',
    partner_name: '福建XX运营管理有限公司',
    share_ratio: 45.0,
    station_ids: '特来电充电桩平台',
    effect_time: '2024-02-10 00:00:00',
    status: '生效中',
    create_time: '2024-01-05 09:15:40'
  },
  {
    plan_code: 'FZ2024003',
    plan_name: '临时促销分账方案',
    partner_name: '福州XX商贸有限公司',
    share_ratio: 20.0,
    station_ids: '星星充电平台',
    effect_time: '2024-03-01 00:00:00',
    status: '待生效',
    create_time: '2024-02-18 11:20:10'
  },
  {
    plan_code: 'FZ2024004',
    plan_name: '季度特惠分账方案',
    partner_name: 'XX物流集团福州分公司',
    share_ratio: 35.8,
    station_ids: '国家电网充电桩,特来电充电桩平台',
    effect_time: '2024-01-15 00:00:00',
    status: '生效中',
    create_time: '2024-01-01 10:00:00'
  },
  {
    plan_code: 'FZ2024005',
    plan_name: '试点场站分账方案',
    partner_name: '福州XX创新科技有限公司',
    share_ratio: 25.3,
    station_ids: '星星充电平台,国家电网充电桩',
    effect_time: '2024-04-01 00:00:00',
    status: '待生效',
    create_time: '2024-02-25 16:45:30'
  },
  {
    plan_code: 'FZ2024006',
    plan_name: '年度框架分账方案',
    partner_name: '福建XX投资有限公司',
    share_ratio: 40.2,
    station_ids: '国家电网充电桩,特来电充电桩平台,星星充电平台',
    effect_time: '2024-01-01 00:00:00',
    status: '已过期',
    create_time: '2023-11-10 08:30:15'
  }
];

/** 分账方案搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'plan_code',
      label: '方案编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入方案编号',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'plan_name',
      label: '方案名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入方案名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'partner_name',
      label: '合作方名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入合作方名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'share_ratio',
      label: '分账比例',
      component: 'InputNumber',
      labelWidth: '130',
      componentProps: {
        placeholder: '请输入分账比例（单位：%）',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      rules: 'required',
    },
    {
      fieldName: 'station_ids',
      label: '适用场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用场站',
        mode: 'multiple', // 支持多选
        options: [
          { label: '国家电网充电桩', value: '国家电网充电桩' },
          { label: '特来电充电桩平台', value: '特来电充电桩平台' },
          { label: '星星充电平台', value: '星星充电平台' }
        ],
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'effect_time',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '方案状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择方案状态',
        options: [
          { label: '生效中', value: '生效中' },
          { label: '待生效', value: '待生效' },
          { label: '已过期', value: '已过期' },
          { label: '已作废', value: '已作废' }
        ],
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'create_time',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        disabled: true,
      },
      labelWidth: '130',
      rules: 'required',
    },
  ];
}

/** 分账方案表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'plan_code',
      title: '方案编号',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plan_code' },

    },
    {
      field: 'plan_name',
      title: '方案名称',
      minWidth: 180,
      sortable: true,
      // slots: { default: 'plan_name' },

    },
    {
      field: 'partner_name',
      title: '合作方名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'partner_name' },

    },
    {
      field: 'share_ratio',
      title: '分账比例(%)',
      minWidth: 120,
      sortable: true,
      // slots: { default: 'share_ratio' },

    },
    {
      field: 'station_ids',
      title: '适用场站',
      minWidth: 260,
      sortable: false,
      // slots: { default: 'station_ids' },

    },
    {
      field: 'effect_time',
      title: '生效时间',
      minWidth: 200,
      sortable: true,
      // slots: { default: 'effect_time' },

    },
    {
      field: 'status',
      title: '方案状态',
      minWidth: 120,
      sortable: true,
      // slots: { default: 'create_time' },

    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
      // slots: { default: 'create_time' },

    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
