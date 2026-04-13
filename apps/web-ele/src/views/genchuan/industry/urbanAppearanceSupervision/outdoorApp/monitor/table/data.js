/** 表格初始数据 - 改造为户外广告管理数据 */
export const dataList = () => [
  {
    outdoorAdId: 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
    name: '鼓楼东街口LED大屏',
    location: '福州市鼓楼区东街口百货大楼楼顶',
    approvedSize: '20m×10m',
    actualSize: '20m×10m',
    tiltAngle: 0.5,
    damageStatus: '完好', // 破损状态 - 中文
    adStatus: '正常',     // 广告状态 - 中文
    areaCode: '350102',
    supervisor: '张明',   // 监管员 - 中文
    warningTypeId: 'g8b9c0d1-e2f3-4a5b-9c6d-7e8f9a0b1c2d',
    warningTime: '2025-02-27 14:30:00',
    createTime: '2025-02-27 14:30:00',
    updateTime: '2025-02-27 14:30:00',
    delFlag: 0,
  },
  {
    outdoorAdId: 'b2c3d4e5-f6a7-4b5c-9d8e-0f1a2b3c4d5e',
    name: '五四路高架桥广告牌',
    location: '福州市鼓楼区五四路与湖东路交叉口高架桥',
    approvedSize: '15m×8m',
    actualSize: '15.2m×8.1m',
    tiltAngle: 1.2,
    damageStatus: '完好', // 破损状态 - 中文
    adStatus: '正常',     // 广告状态 - 中文
    areaCode: '350102',
    supervisor: '张明',   // 监管员 - 中文
    warningTypeId: 'h9c0d1e2-f3a4-4b5c-8d6e-7f8a9b0c1d2e',
    warningTime: '2025-02-27 15:00:00',
    createTime: '2025-02-27 15:00:00',
    updateTime: '2025-02-27 15:00:00',
    delFlag: 0,
  },
  {
    outdoorAdId: 'c3d4e5f6-a7b8-4c5d-9e0f-1a2b3c4d5e6f',
    name: '厦门环岛路落地广告',
    location: '厦门市思明区环岛路曾厝垵路段',
    approvedSize: '12m×6m',
    actualSize: '12m×6m',
    tiltAngle: 0.0,
    damageStatus: '轻微破损', // 破损状态 - 中文
    adStatus: '待审批',       // 广告状态 - 中文
    areaCode: '350203',
    supervisor: '李华',       // 监管员 - 中文
    warningTypeId: 'l3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c',
    warningTime: '2025-02-27 16:20:00',
    createTime: '2025-02-27 16:20:00',
    updateTime: '2025-02-27 16:20:00',
    delFlag: 0,
  },
  {
    outdoorAdId: 'd4e5f6a7-b8c9-4d5e-8f0a-1b2c3d4e5f6a',
    name: '泉州丰泽街楼顶广告',
    location: '泉州市丰泽区丰泽街建设银行大楼',
    approvedSize: '25m×12m',
    actualSize: '24.8m×11.9m',
    tiltAngle: 2.3,
    damageStatus: '中度破损', // 破损状态 - 中文
    adStatus: '已过期',       // 广告状态 - 中文
    areaCode: '350503',
    supervisor: '王伟',       // 监管员 - 中文
    warningTypeId: 'p7e8f9a0-b1c2-4d3e-4f5a-6b7c8d9e0f1a',
    warningTime: '2025-02-28 09:10:00',
    createTime: '2025-02-28 09:10:00',
    updateTime: '2025-02-28 09:10:00',
    delFlag: 0,
  },
  {
    outdoorAdId: 'e5f6a7b8-c9d0-4e1f-9a0b-2c3d4e5f6a7b',
    name: '漳州胜利路灯箱广告',
    location: '漳州市芗城区胜利路与延安北路交叉口',
    approvedSize: '3m×1.5m',
    actualSize: '3m×1.5m',
    tiltAngle: 0.0,
    damageStatus: '严重破损', // 破损状态 - 中文
    adStatus: '违规',         // 广告状态 - 中文
    areaCode: '350602',
    supervisor: '陈芳',       // 监管员 - 中文
    warningTypeId: 't1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
    warningTime: '2025-02-28 10:30:00',
    createTime: '2025-02-28 10:30:00',
    updateTime: '2025-02-28 10:30:00',
    delFlag: 0,
  },
  {
    outdoorAdId: 'f6a7b8c9-d0e1-4f2a-9b0c-3d4e5f6a7b8c',
    name: '龙岩大道高立柱广告',
    location: '龙岩市新罗区龙岩大道与人民路交叉口',
    approvedSize: '18m×6m',
    actualSize: '18m×6m',
    tiltAngle: 0.8,
    damageStatus: '严重破损', // 破损状态 - 中文
    adStatus: '违规',         // 广告状态 - 中文
    areaCode: '350802',
    supervisor: '陈芳',       // 监管员 - 中文
    warningTypeId: 'x5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c',
    warningTime: '2025-02-28 11:45:00',
    createTime: '2025-02-28 11:45:00',
    updateTime: '2025-02-28 11:45:00',
    delFlag: 0,
  },
  {
    outdoorAdId: 'a7b8c9d0-e1f2-4a3b-8c4d-5e6f7a8b9c0d',
    name: '三明列东街落地广告',
    location: '三明市梅列区列东街阳光城广场',
    approvedSize: '10m×5m',
    actualSize: '10m×5m',
    tiltAngle: 0.2,
    damageStatus: '严重破损', // 破损状态 - 中文
    adStatus: '违规',         // 广告状态 - 中文
    areaCode: '350402',
    supervisor: '陈芳',       // 监管员 - 中文
    warningTypeId: 'b9e0f1a2-b3c4-4d5e-6f7a-8b9c0d1e2f3a',
    warningTime: '2025-02-28 13:20:00',
    createTime: '2025-02-28 13:20:00',
    updateTime: '2025-02-28 13:20:00',
    delFlag: 1,
  },
];

/** 新增/修改的表单/列表的搜索表单 - 改造为户外广告管理表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'outdoorAdId',
      label: '广告ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入广告ID（UUID，系统自动生成）',
        maxLength: 36,
        disabled: true,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'name',
      label: '广告名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入广告名称（如：鼓楼东街口LED大屏）',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '广告位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入广告位置（如：福州市鼓楼区东街口百货大楼楼顶）',
        maxLength: 200,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'approvedSize',
      label: '审批尺寸',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审批尺寸（如：20m×10m）',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'actualSize',
      label: '实际尺寸',
      component: 'Input',
      componentProps: {
        placeholder: '请输入实际尺寸（如：20m×10m）',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'tiltAngle',
      label: '倾斜角度',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入倾斜角度（单位：度）',
        min: 0,
        max: 90,
        precision: 1,
        addonAfter: '°',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'damageStatus', // 字段名同步修改
      label: '破损状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '完好', value: '完好' },
          { label: '轻微破损', value: '轻微破损' },
          { label: '中度破损', value: '中度破损' },
          { label: '严重破损', value: '严重破损' },
        ],
        placeholder: '请选择破损状态',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'adStatus', // 字段名同步修改
      label: '广告状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '正常', value: '正常' },
          { label: '待审批', value: '待审批' },
          { label: '已过期', value: '已过期' },
          { label: '违规', value: '违规' },
        ],
        placeholder: '请选择广告状态',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '鼓楼区', value: '350102' },
          { label: '思明区', value: '350203' },
          { label: '丰泽区', value: '350503' },
          { label: '芗城区', value: '350602' },
          { label: '新罗区', value: '350802' },
          { label: '梅列区', value: '350402' },
        ],
        placeholder: '请选择所属区域',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'supervisor', // 字段名同步修改
      label: '监管员',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '张明', value: '张明' },
          { label: '李华', value: '李华' },
          { label: '王伟', value: '王伟' },
          { label: '陈芳', value: '陈芳' },
        ],
        placeholder: '请选择监管员',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'warningTypeId',
      label: '预警类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '倾斜超标', value: 'g8b9c0d1-e2f3-4a5b-9c6d-7e8f9a0b1c2d' },
          { label: '破损预警', value: 'h9c0d1e2-f3a4-4b5c-8d6e-7f8a9b0c1d2e' },
          { label: '尺寸不符', value: 'l3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c' },
          { label: '过期未拆', value: 'p7e8f9a0-b1c2-4d3e-4f5a-6b7c8d9e0f1a' },
          { label: '违规设置', value: 't1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e' },
        ],
        placeholder: '请选择预警类型',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'warningTime',
      label: '预警时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择预警时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        disabled: true,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择更新时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        disabled: true,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'delFlag',
      label: '删除标记',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '未删除', value: 0 },
          { label: '已删除', value: 1 },
        ],
        placeholder: '请选择删除状态',
      },
      labelWidth: '100',
      rules: '',
    },
  ];
}

/** 表格字段 - 改造为户外广告管理表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '广告名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'location',
      title: '广告位置',
      minWidth: 200,
      sortable: true,
      slots: { default: 'location' },
    },
    {
      field: 'approvedSize',
      title: '审批尺寸',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'actualSize',
      title: '实际尺寸',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'tiltAngle',
      title: '倾斜角度(°)',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'damageStatus', // 同步字段
      title: '破损状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'damageStatus' },

    },
    {
      field: 'adStatus', // 同步字段
      title: '广告状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'adStatus' },

    },
    {
      field: 'areaCode',
      title: '所属区域',
      minWidth: 100,
      sortable: true,
      slots: { default: 'areaCode' },
    },
    {
      field: 'supervisor', // 同步字段
      title: '监管员',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'warningTypeId',
      title: '预警类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'warningTime',
      title: '预警时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'delFlag',
      title: '删除标记',
      minWidth: 100,
      sortable: true,
      slots: {
        default: ({ row }) => (row.delFlag === 0 ? '未删除' : '已删除'),
      },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
