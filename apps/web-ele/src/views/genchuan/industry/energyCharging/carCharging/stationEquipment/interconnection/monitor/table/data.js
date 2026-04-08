/** 接口对接统计分析数据 */
export const dataList = () => [
  {
    code: 'JD001',
    plat_name: '特来电充电桩平台',
    type: 'REST API',
    api_param: 'appKey=xxx&appSecret=xxx&timestamp=yyyyMMddHHmmss',
    sync_freq: '5分钟',
    sync_rate: 99.2,
    sync_error: 3,
    status: '正常',
    create_time: '2024-01-10 08:30:00'
  },
  {
    code: 'TB002',
    plat_name: '星星充电平台',
    type: 'HTTP API',
    api_param: 'appId=xxx&sessionKey=xxx&sign=xxx',
    sync_freq: '10分钟',
    sync_rate: 98.5,
    sync_error: 7,
    status: '正常',
    create_time: '2024-01-12 10:15:00'
  },
  {
    code: 'PDD003',
    plat_name: '国家电网充电桩',
    type: 'RPC',
    api_param: 'clientId=xxx&clientSecret=xxx&version=v2',
    sync_freq: '15分钟',
    sync_rate: 97.8,
    sync_error: 12,
    status: '预警',
    create_time: '2024-01-08 14:20:00'
  },
  {
    code: 'VX004',
    plat_name: '特来电充电桩平台',
    type: 'HTTPS API',
    api_param: 'mchId=xxx&apiKey=xxx&nonceStr=xxx&signType=HMAC-SHA256',
    sync_freq: '1分钟',
    sync_rate: 99.8,
    sync_error: 1,
    status: '正常',
    create_time: '2024-01-05 09:00:00'
  },
  {
    code: 'ALI005',
    plat_name: '星星充电平台',
    type: 'OPEN API',
    api_param: 'appId=xxx&privateKey=xxx&format=json&charset=utf-8',
    sync_freq: '3分钟',
    sync_rate: 99.0,
    sync_error: 5,
    status: '正常',
    create_time: '2024-01-09 11:45:00'
  },
  {
    code: 'SF006',
    plat_name: '国家电网充电桩',
    type: 'SOAP API',
    api_param: 'partnerId=xxx&partnerKey=xxx&serviceCode=EXP_RECEIVE',
    sync_freq: '30分钟',
    sync_rate: 95.6,
    sync_error: 23,
    status: '异常',
    create_time: '2024-01-07 16:10:00'
  },
  {
    code: 'YT007',
    plat_name: '特来电充电桩平台',
    type: 'REST API',
    api_param: 'apiKey=xxx&secretKey=xxx&timestamp=xxx&sign=xxx',
    sync_freq: '20分钟',
    sync_rate: 96.7,
    sync_error: 18,
    status: '预警',
    create_time: '2024-01-11 13:30:00'
  },
  {
    code: 'ZTO008',
    plat_name: '星星充电平台',
    type: 'HTTP API',
    api_param: 'customerCode=xxx&checkword=xxx&msgType=REQUEST',
    sync_freq: '25分钟',
    sync_rate: 97.2,
    sync_error: 15,
    status: '正常',
    create_time: '2024-01-06 07:45:00'
  },
  {
    code: 'EMS009',
    plat_name: '国家电网充电桩',
    type: 'WebService',
    api_param: 'userID=xxx&password=xxx&mailNo=xxx&type=1',
    sync_freq: '60分钟',
    sync_rate: 98.1,
    sync_error: 9,
    status: '正常',
    create_time: '2024-01-04 15:20:00'
  },
  {
    code: 'DL010',
    plat_name: '特来电充电桩平台',
    type: 'REST API',
    api_param: 'deptCode=xxx&token=xxx&pageNum=1&pageSize=20',
    sync_freq: '40分钟',
    sync_rate: 94.8,
    sync_error: 28,
    status: '异常',
    create_time: '2024-01-13 10:00:00'
  }
];

/** 接口对接统计分析搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'code',
      label: '对接编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入对接编码',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'plat_name',
      label: '平台名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入平台名称',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '对接类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择对接类型',
        options: [
          { label: 'REST API', value: 'REST API' },
          { label: 'HTTP API', value: 'HTTP API' },
          { label: 'HTTPS API', value: 'HTTPS API' },
          { label: 'RPC', value: 'RPC' },
          { label: 'SOAP API', value: 'SOAP API' },
          { label: 'WebService', value: 'WebService' },
          { label: 'OPEN API', value: 'OPEN API' }
        ]
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'api_param',
      label: '接口参数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接口参数',
        maxlength: 500,
        type: 'textarea',
        rows: 3,
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'sync_freq',
      label: '同步频率',
      component: 'Input',
      componentProps: {
        placeholder: '请输入同步频率（如：5分钟、1小时）',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'sync_rate',
      label: '同步成功率(%)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入同步成功率',
        min: 0,
        max: 100,
        precision: 1,
        addonAfter: '%',
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'sync_error',
      label: '同步异常次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入同步异常次数',
        min: 0,
        precision: 0,
      },
      labelWidth: '130',
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '对接状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择对接状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '预警', value: '预警' },
          { label: '异常', value: '异常' }
        ]
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
      },
      labelWidth: '130',
      rules: 'required',
    }
  ];
}

/** 接口对接统计分析表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'code',
      title: '对接编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'code' },

    },
    {
      field: 'plat_name',
      title: '平台名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'plat_name' },

    },
    {
      field: 'type',
      title: '对接类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'type' },

    },
    {
      field: 'api_param',
      title: '接口参数',
      minWidth: 250,
      sortable: false,
    },
    {
      field: 'sync_freq',
      title: '同步频率',
      minWidth: 120,
      sortable: true,
      slots: { default: 'sync_freq' },

    },
    {
      field: 'sync_rate',
      title: '同步成功率(%)',
      minWidth: 150,
      sortable: true,
      slots: { default: 'sync_rate' },

    },
    {
      field: 'sync_error',
      title: '同步异常次数',
      minWidth: 150,
      sortable: true,
      slots: { default: 'sync_error' },

    },
    {
      field: 'status',
      title: '对接状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },

      render: (text) => {
        const colorMap = {
          '正常': 'green',
          '预警': 'orange',
          '异常': 'red'
        };
        return `<span style="color: ${colorMap[text]}; font-weight: bold;">${text}</span>`;
      }
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
      slots: { default: 'create_time' },

    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
