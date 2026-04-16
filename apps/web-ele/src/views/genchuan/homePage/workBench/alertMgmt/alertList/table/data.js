// 格式化时间戳（秒）
function formatTimestamp(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp) * 1000);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

/** 搜索表单配置 - 根据模块类型返回不同表单 */
export function useFormSchema(moduleType = 'pending') {
  const statusMap = { pending: '未处理', dealing: '处理中', archived: '已关闭' };
  const currentStatus = statusMap[moduleType];

  const baseSchema = [
    {
      fieldName: 'alertNo',
      label: '预警编号',
      component: 'Input',
      componentProps: { placeholder: '请输入预警编号' }
    }
  ];

  const commonSchema = [
    {
      fieldName: 'level',
      label: '预警等级',
      component: 'Select',
      componentProps: {
        options: [
          { label: '低', value: '低' },
          { label: '中', value: '中' },
          { label: '高', value: '高' },
          { label: '高危', value: '高危' }
        ],
        placeholder: '请选择预警等级'
      }
    },
    {
      fieldName: 'type',
      label: '预警类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '设备异常', value: '设备异常' },
          { label: '车位异常', value: '车位异常' },
          { label: '欠费异常', value: '欠费异常' },
          { label: '其他', value: '其他' }
        ],
        placeholder: '请选择预警类型'
      }
    },
    {
      fieldName: 'occurTime',
      label: '发生时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '请选择时间范围'
      }
    },
    {
      fieldName: 'address',
      label: '发生地点',
      component: 'Input',
      componentProps: { placeholder: '请输入发生地点' }
    }
  ];

  switch (moduleType) {
    case 'pending':
      return [...baseSchema, ...commonSchema];
    case 'dealing':
      return [
        ...baseSchema,
        ...commonSchema,
        {
          fieldName: 'handleUserId',
          label: '处置人ID',
          component: 'Input',
          componentProps: { placeholder: '请输入处置人ID' }
        }
      ];
    case 'archived':
      return [
        ...baseSchema,
        ...commonSchema,
        {
          fieldName: 'handleUserId',
          label: '处置人ID',
          component: 'Input',
          componentProps: { placeholder: '请输入处置人ID' }
        }
      ];
    default:
      return baseSchema;
  }
}

/** 表格列配置 - 根据模块类型返回不同列 */
export function useGridColumns(moduleType = 'pending') {
  const baseColumns = [
    { type: 'checkbox', width: 40 },
    {
      field: 'alertNo',
      title: '预警编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'alertNo' }
    },
    {
      field: 'level',
      title: '预警等级',
      minWidth: 100,
      sortable: true,
      slots: { default: 'level' }
    },
    {
      field: 'type',
      title: '预警类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'type' }
    },
    {
      field: 'occurTime',
      title: '发生时间',
      minWidth: 160,
      sortable: true,
      formatter: ({ cellValue }) => formatTimestamp(cellValue)
    },
    {
      field: 'relateObjId',
      title: '关联对象ID',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'address',
      title: '发生地点',
      minWidth: 150
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' }
    }
  ];

  switch (moduleType) {
    case 'pending':
      return [
        ...baseColumns,
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'pendingActions' }
        }
      ];
    case 'dealing':
      return [
        ...baseColumns,
        {
          field: 'handleUserId',
          title: '处置人ID',
          minWidth: 100,
          sortable: true
        },
        {
          field: 'progress',
          title: '处置进度',
          minWidth: 120,
          sortable: true,
          slots: { default: 'progress' }
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'dealingActions' }
        }
      ];
    case 'archived':
      return [
        ...baseColumns,
        {
          field: 'handleUserId',
          title: '处置人ID',
          minWidth: 100,
          sortable: true
        },
        {
          field: 'closeTime',
          title: '关闭时间',
          minWidth: 160,
          sortable: true,
          formatter: ({ cellValue }) => formatTimestamp(cellValue)
        },
        {
          field: 'ignoreReason',
          title: '忽略理由',
          minWidth: 150,
          formatter: ({ cellValue }) => cellValue || '-'
        },
        {
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: { default: 'archivedActions' }
        }
      ];
    default:
      return baseColumns;
  }
}

// ==================== 模拟数据（供开发测试使用） ====================
export const mockAlertList = [
  {
    id: 1,
    alertNo: 'ALERT-20260415-001',
    level: '高危',
    type: '设备异常',
    occurTime: '1744675200',
    relateObjId: 101,
    address: '泉州市丰泽区XX路1号',
    status: '未处理',
    handleUserId: null,
    progress: 0,
    ignoreReason: null,
    closeTime: null,
    voucherUrl: null,
    description: '充电桩离线超过2小时'
  },
  {
    id: 2,
    alertNo: 'ALERT-20260415-002',
    level: '高',
    type: '车位异常',
    occurTime: '1744682400',
    relateObjId: 102,
    address: '泉州市鲤城区XX路2号',
    status: '未处理',
    handleUserId: null,
    progress: 0,
    ignoreReason: null,
    closeTime: null,
    voucherUrl: null,
    description: '地锁故障无法降下'
  },
  {
    id: 3,
    alertNo: 'ALERT-20260414-003',
    level: '中',
    type: '欠费异常',
    occurTime: '1744596000',
    relateObjId: 103,
    address: '泉州市洛江区XX路3号',
    status: '处理中',
    handleUserId: 1001,
    progress: 60,
    ignoreReason: null,
    closeTime: null,
    voucherUrl: '/uploads/voucher1.png',
    description: '订单超时未支付'
  },
  {
    id: 4,
    alertNo: 'ALERT-20260413-004',
    level: '低',
    type: '其他',
    occurTime: '1744502400',
    relateObjId: 104,
    address: '泉州市晋江市XX路4号',
    status: '已关闭',
    handleUserId: 1002,
    progress: 100,
    ignoreReason: null,
    closeTime: '1744588800',
    voucherUrl: null,
    description: '巡检发现设备松动'
  },
  {
    id: 5,
    alertNo: 'ALERT-20260412-005',
    level: '高危',
    type: '设备异常',
    occurTime: '1744416000',
    relateObjId: 105,
    address: '泉州市石狮市XX路5号',
    status: '未处理',
    handleUserId: null,
    progress: 0,
    ignoreReason: null,
    closeTime: null,
    voucherUrl: null,
    description: '服务器CPU过载'
  }
];

// 模拟图表数据（按时间范围）
export const mockChartData = {
  day: {
    typeCount: [
      { name: '设备异常', value: 8 },
      { name: '车位异常', value: 5 },
      { name: '欠费异常', value: 12 },
      { name: '其他', value: 2 }
    ],
    timeTrend: [
      { label: '00:00', value: 1 },
      { label: '04:00', value: 0 },
      { label: '08:00', value: 3 },
      { label: '12:00', value: 7 },
      { label: '16:00', value: 5 },
      { label: '20:00', value: 4 }
    ],
    cardData: {
      waitHandleCount: 3,
      handledCount: 10,
      highRiskCount: 2
    }
  },
  week: {
    typeCount: [
      { name: '设备异常', value: 45 },
      { name: '车位异常', value: 28 },
      { name: '欠费异常', value: 62 },
      { name: '其他', value: 15 }
    ],
    timeTrend: [
      { label: '周一', value: 12 },
      { label: '周二', value: 18 },
      { label: '周三', value: 25 },
      { label: '周四', value: 22 },
      { label: '周五', value: 30 },
      { label: '周六', value: 28 },
      { label: '周日', value: 35 }
    ],
    cardData: {
      waitHandleCount: 18,
      handledCount: 52,
      highRiskCount: 9
    }
  },
  month: {
    typeCount: [
      { name: '设备异常', value: 180 },
      { name: '车位异常', value: 95 },
      { name: '欠费异常', value: 210 },
      { name: '其他', value: 45 }
    ],
    timeTrend: [
      { label: '第1周', value: 85 },
      { label: '第2周', value: 102 },
      { label: '第3周', value: 130 },
      { label: '第4周', value: 115 }
    ],
    cardData: {
      waitHandleCount: 42,
      handledCount: 198,
      highRiskCount: 21
    }
  },
  quarter: {
    typeCount: [
      { name: '设备异常', value: 520 },
      { name: '车位异常', value: 310 },
      { name: '欠费异常', value: 640 },
      { name: '其他', value: 120 }
    ],
    timeTrend: [
      { label: '1月', value: 180 },
      { label: '2月', value: 210 },
      { label: '3月', value: 260 }
    ],
    cardData: {
      waitHandleCount: 110,
      handledCount: 580,
      highRiskCount: 45
    }
  },
  year: {
    typeCount: [
      { name: '设备异常', value: 2100 },
      { name: '车位异常', value: 1350 },
      { name: '欠费异常', value: 2800 },
      { name: '其他', value: 520 }
    ],
    timeTrend: [
      { label: 'Q1', value: 620 },
      { label: 'Q2', value: 850 },
      { label: 'Q3', value: 940 },
      { label: 'Q4', value: 1120 }
    ],
    cardData: {
      waitHandleCount: 380,
      handledCount: 2750,
      highRiskCount: 210
    }
  }
};
