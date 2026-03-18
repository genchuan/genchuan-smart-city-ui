/** 实时监测数据接入 - 数据字典与模拟数据（显式版） */

// 同步频率字典
export const syncFreqList = [
  { id: 'freq1', name: '实时' },
  { id: 'freq2', name: '1分钟' },
  { id: 'freq3', name: '5分钟' },
  { id: 'freq4', name: '15分钟' },
  { id: 'freq5', name: '30分钟' },
  { id: 'freq6', name: '1小时' },
  { id: 'freq7', name: '2小时' },
  { id: 'freq8', name: '4小时' },
  { id: 'freq9', name: '8小时' },
  { id: 'freq10', name: '12小时' },
  { id: 'freq11', name: '1天' }
];

// 设备类型字典
export const deviceTypeList = [
  { id: 'dt1', name: '在线监测仪' },
  { id: 'dt2', name: '智能水表' },
  { id: 'dt3', name: '环境传感器' }
];

// 物联网设备表模拟
export const iotDeviceList = [
  { device_id: 'dev001', device_name: 'XX区网格在线监测仪01', device_code: 'DEV001', device_type: 'dt1', device_addr: 'XX区网格A', status: '1' },
  { device_id: 'dev002', device_name: 'XX区网格在线监测仪02', device_code: 'DEV002', device_type: 'dt1', device_addr: 'XX区网格B', status: '1' },
  { device_id: 'dev003', device_name: '智能水表-南岸', device_code: 'WM001', device_type: 'dt2', device_addr: '南岸路1号', status: '1' },
  { device_id: 'dev004', device_name: '环境传感器-北区', device_code: 'ES001', device_type: 'dt3', device_addr: '北区公园', status: '0' }
];

// 评价任务表模拟
export const evalTaskList = [
  { task_id: 'task01', name: '2025年10月XX区网格管理评价任务' },
  { task_id: 'task02', name: '2025年11月河道水质监测任务' },
  { task_id: 'task03', name: '2025年第四季度设备在线率考核' }
];

// 指标项表模拟
export const evalIndexItemList = [
  { item_id: 'idx001', name: '设备在线率' },
  { item_id: 'idx002', name: 'PM2.5浓度' },
  { item_id: 'idx003', name: '污水排放量' },
  { item_id: 'idx004', name: '噪声分贝' }
];

// 状态字典
export const statusList = [
  { id: '1', name: '启用' },
  { id: '0', name: '停用' }
];

// 用户表模拟
export const userList = [
  { id: 'u1', name: '张三' },
  { id: 'u2', name: '李四' }
];

// 实时接入规则表模拟数据（字段与需求一致）- 显式写出
export const dataList = () => {
  return [
    {
      rule_id: 'rule001',
      name: '网格设备在线率同步规则',
      code: 'R001',
      task_id: 'task01',
      task_name: '2025年10月XX区网格管理评价任务',
      index_id: 'idx001',
      index_name: '设备在线率',
      device_id: 'dev001',
      device_name: 'XX区网格在线监测仪01',
      sync_freq_id: 'freq3',
      sync_freq_name: '5分钟',
      clean_rule: '剔除大于3倍标准差数据',
      status: '1',
      statusName: '启用',
      create_by: 'u1',
      create_by_name: '张三',
      create_time: '2026-03-01 09:00:00',
      update_by: 'u1',
      update_by_name: '张三',
      update_time: '2026-03-01 09:00:00',
      last_sync_time: '2026-03-17 10:15:00',
      sync_success_rate: 98.5,
      today_sync_count: 120,
      total_sync_count: 3560,
      stop_reason: '',
      stop_time: null,
      stop_by: null,
      stop_by_name: ''
    },
    {
      rule_id: 'rule002',
      name: '南岸水质监测同步规则',
      code: 'R002',
      task_id: 'task02',
      task_name: '2025年11月河道水质监测任务',
      index_id: 'idx003',
      index_name: '污水排放量',
      device_id: 'dev003',
      device_name: '智能水表-南岸',
      sync_freq_id: 'freq2',
      sync_freq_name: '1分钟',
      clean_rule: '剔除异常值，保留有效数据',
      status: '1',
      statusName: '启用',
      create_by: 'u2',
      create_by_name: '李四',
      create_time: '2026-03-02 14:30:00',
      update_by: 'u2',
      update_by_name: '李四',
      update_time: '2026-03-02 14:30:00',
      last_sync_time: '2026-03-17 10:20:00',
      sync_success_rate: 99.2,
      today_sync_count: 300,
      total_sync_count: 8900,
      stop_reason: '',
      stop_time: null,
      stop_by: null,
      stop_by_name: ''
    },
    {
      rule_id: 'rule003',
      name: '北区环境监测同步规则',
      code: 'R003',
      task_id: 'task03',
      task_name: '2025年第四季度设备在线率考核',
      index_id: 'idx001',
      index_name: '设备在线率',
      device_id: 'dev004',
      device_name: '环境传感器-北区',
      sync_freq_id: 'freq4',
      sync_freq_name: '15分钟',
      clean_rule: '取平均值，剔除异常值',
      status: '0',
      statusName: '停用',
      create_by: 'u1',
      create_by_name: '张三',
      create_time: '2026-03-03 11:00:00',
      update_by: 'u1',
      update_by_name: '张三',
      update_time: '2026-03-03 11:00:00',
      last_sync_time: '2026-01-10 10:00:00',
      sync_success_rate: 85.0,
      today_sync_count: 0,
      total_sync_count: 1200,
      stop_reason: '设备故障，临时停用',
      stop_time: '2026-01-15 14:30:00',
      stop_by: 'u2',
      stop_by_name: '李四'
    }
  ];
};

// 同步日志表模拟（为每个规则生成固定数量的日志，字段与需求一致）- 显式写出
export const syncLogList = (ruleId) => {
  // 根据 ruleId 返回对应的固定日志数组
  if (ruleId === 'rule001') {
    return [
      {
        log_id: 'log001_rule001',
        rule_id: 'rule001',
        task_id: 'task01',
        task_name: '2025年10月XX区网格管理评价任务',
        index_id: 'idx001',
        index_name: '设备在线率',
        device_id: 'dev001',
        device_name: 'XX区网格在线监测仪01',
        data_value: '98.5%',
        sync_time: '2026-03-17 08:00:00',
        sync_type: '自动',
        clean_result: '已清洗',
        store_status: '已存储',
        fail_reason: null,
        retry_count: 0,
        last_retry_time: null
      },
      {
        log_id: 'log002_rule001',
        rule_id: 'rule001',
        task_id: 'task01',
        task_name: '2025年10月XX区网格管理评价任务',
        index_id: 'idx001',
        index_name: '设备在线率',
        device_id: 'dev001',
        device_name: 'XX区网格在线监测仪01',
        data_value: null,
        sync_time: '2026-03-16 08:00:00',
        sync_type: '自动',
        clean_result: '无需清洗',
        store_status: '',
        fail_reason: 'API超时',
        retry_count: 2,
        last_retry_time: '2026-03-16 08:05:00'
      },
      {
        log_id: 'log003_rule001',
        rule_id: 'rule001',
        task_id: 'task01',
        task_name: '2025年10月XX区网格管理评价任务',
        index_id: 'idx001',
        index_name: '设备在线率',
        device_id: 'dev001',
        device_name: 'XX区网格在线监测仪01',
        data_value: '99.1%',
        sync_time: '2026-03-15 08:00:00',
        sync_type: '手动',
        clean_result: '已清洗',
        store_status: '已存储',
        fail_reason: null,
        retry_count: 0,
        last_retry_time: null
      }
    ];
  } else if (ruleId === 'rule002') {
    return [
      {
        log_id: 'log001_rule002',
        rule_id: 'rule002',
        task_id: 'task02',
        task_name: '2025年11月河道水质监测任务',
        index_id: 'idx003',
        index_name: '污水排放量',
        device_id: 'dev003',
        device_name: '智能水表-南岸',
        data_value: '120.5',
        sync_time: '2026-03-17 09:15:00',
        sync_type: '自动',
        clean_result: '已清洗',
        store_status: '已存储',
        fail_reason: null,
        retry_count: 0,
        last_retry_time: null
      },
      {
        log_id: 'log002_rule002',
        rule_id: 'rule002',
        task_id: 'task02',
        task_name: '2025年11月河道水质监测任务',
        index_id: 'idx003',
        index_name: '污水排放量',
        device_id: 'dev003',
        device_name: '智能水表-南岸',
        data_value: '118.3',
        sync_time: '2026-03-16 09:15:00',
        sync_type: '自动',
        clean_result: '无需清洗',
        store_status: '已存储',
        fail_reason: null,
        retry_count: 0,
        last_retry_time: null
      },
      {
        log_id: 'log003_rule002',
        rule_id: 'rule002',
        task_id: 'task02',
        task_name: '2025年11月河道水质监测任务',
        index_id: 'idx003',
        index_name: '污水排放量',
        device_id: 'dev003',
        device_name: '智能水表-南岸',
        data_value: null,
        sync_time: '2026-03-15 09:15:00',
        sync_type: '手动',
        clean_result: '无需清洗',
        store_status: '',
        fail_reason: '设备离线',
        retry_count: 1,
        last_retry_time: '2026-03-15 09:20:00'
      }
    ];
  } else if (ruleId === 'rule003') {
    return [
      {
        log_id: 'log001_rule003',
        rule_id: 'rule003',
        task_id: 'task03',
        task_name: '2025年第四季度设备在线率考核',
        index_id: 'idx001',
        index_name: '设备在线率',
        device_id: 'dev004',
        device_name: '环境传感器-北区',
        data_value: '85.0%',
        sync_time: '2026-01-10 10:00:00',
        sync_type: '自动',
        clean_result: '已清洗',
        store_status: '已存储',
        fail_reason: null,
        retry_count: 0,
        last_retry_time: null
      },
      {
        log_id: 'log002_rule003',
        rule_id: 'rule003',
        task_id: 'task03',
        task_name: '2025年第四季度设备在线率考核',
        index_id: 'idx001',
        index_name: '设备在线率',
        device_id: 'dev004',
        device_name: '环境传感器-北区',
        data_value: '87.2%',
        sync_time: '2026-01-09 10:00:00',
        sync_type: '自动',
        clean_result: '无需清洗',
        store_status: '已存储',
        fail_reason: null,
        retry_count: 0,
        last_retry_time: null
      },
      {
        log_id: 'log003_rule003',
        rule_id: 'rule003',
        task_id: 'task03',
        task_name: '2025年第四季度设备在线率考核',
        index_id: 'idx001',
        index_name: '设备在线率',
        device_id: 'dev004',
        device_name: '环境传感器-北区',
        data_value: null,
        sync_time: '2026-01-08 10:00:00',
        sync_type: '手动',
        clean_result: '已清洗',
        store_status: '',
        fail_reason: '数据格式错误',
        retry_count: 2,
        last_retry_time: '2026-01-08 10:05:00'
      }
    ];
  }
  return []; // 默认返回空数组
};

// 获取所有规则的合并日志（用于同步成功/失败页）
export const getAllSyncLogs = () => {
  const rules = dataList();
  let allLogs = [];
  rules.forEach(rule => {
    const logs = syncLogList(rule.rule_id).map(log => ({
      ...log,
      rule_name: rule.name, // 补充规则名称
    }));
    allLogs = allLogs.concat(logs);
  });
  return allLogs;
};

/** 新增/编辑规则表单schema（必填字段标星） */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则名称' },
      rules: 'required'
    },
    {
      fieldName: 'code',
      label: '规则编码',
      component: 'Input',
      componentProps: { placeholder: '请输入规则编码' },
      rules: 'required'
    },
    {
      fieldName: 'task_id',
      label: '关联评价任务',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评价任务',
        options: evalTaskList.map(t => ({ label: t.name, value: t.task_id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'index_id',
      label: '关联指标项',
      component: 'Select',
      componentProps: {
        placeholder: '请选择指标项',
        options: evalIndexItemList.map(i => ({ label: i.name, value: i.item_id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'device_id',
      label: '数据来源设备',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备',
        options: iotDeviceList.map(d => ({ label: d.device_name, value: d.device_id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'sync_freq_id',
      label: '同步频率',
      component: 'Select',
      componentProps: {
        placeholder: '请选择同步频率',
        options: syncFreqList.map(f => ({ label: f.name, value: f.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'clean_rule',
      label: '数据清洗规则',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '请输入清洗规则' },
      rules: 'required'
    }
  ];
}

/** 根据标签页获取表格列配置（严格按需求） */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: true }
  ];

  // 公共列（所有非日志页都显示规则名称和编码）
  const commonColumns = [
    {
      field: 'name',
      title: '规则名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'code',
      title: '规则编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'code' }
    }
  ];

  // 全部tab特有列
  const allExtraColumns = [
    { field: 'task_name', title: '关联评价任务', minWidth: 200, sortable: true, slots: { default: 'taskName' } },
    { field: 'index_name', title: '关联指标项', minWidth: 150, sortable: true, slots: { default: 'indexName' } },
    { field: 'device_name', title: '数据来源设备', minWidth: 150, sortable: true },
    { field: 'sync_freq_name', title: '同步频率', minWidth: 100, sortable: true },
    { field: 'clean_rule', title: '数据清洗规则', minWidth: 200, formatter: row => row.clean_rule?.substring(0, 20) + '...' },
    { field: 'statusName', title: '状态', minWidth: 80, sortable: true, slots: { default: 'statusName' } },
    { field: 'create_by_name', title: '创建人', minWidth: 100, sortable: true },
    { field: 'create_time', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'last_sync_time', title: '最近同步时间', minWidth: 160, sortable: true },
    { field: 'sync_success_rate', title: '同步成功率', minWidth: 120, sortable: true, formatter: row => row.sync_success_rate + '%' }
  ];

  // 启用tab特有列
  const enableExtraColumns = [
    { field: 'task_name', title: '关联评价任务', minWidth: 200, sortable: true },
    { field: 'index_name', title: '关联指标项', minWidth: 150, sortable: true },
    { field: 'device_name', title: '数据来源设备', minWidth: 150, sortable: true },
    { field: 'sync_freq_name', title: '同步频率', minWidth: 100, sortable: true },
    { field: 'last_sync_time', title: '最近同步时间', minWidth: 160, sortable: true },
    { field: 'sync_success_rate', title: '同步成功率', minWidth: 120, sortable: true, formatter: row => row.sync_success_rate + '%' },
    { field: 'create_by_name', title: '创建人', minWidth: 100, sortable: true },
    { field: 'create_time', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'today_sync_count', title: '今日同步次数', minWidth: 120, sortable: true },
    { field: 'total_sync_count', title: '累计同步次数', minWidth: 120, sortable: true }
  ];

  // 停用tab特有列
  const disableExtraColumns = [
    { field: 'task_name', title: '关联评价任务', minWidth: 200, sortable: true },
    { field: 'index_name', title: '关联指标项', minWidth: 150, sortable: true },
    { field: 'stop_reason', title: '停用原因', minWidth: 200, sortable: false },
    { field: 'create_by_name', title: '创建人', minWidth: 100, sortable: true },
    { field: 'create_time', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'stop_time', title: '停用时间', minWidth: 160, sortable: true },
    { field: 'stop_by_name', title: '停用操作人', minWidth: 120, sortable: true }
  ];

  // 同步成功tab特有列（日志数据）
  const successExtraColumns = [
    { field: 'log_id', title: '日志ID', minWidth: 180, slots: { default: 'logId' } },
    { field: 'rule_name', title: '关联规则', minWidth: 150, sortable: true },
    { field: 'task_name', title: '关联任务', minWidth: 200 },
    { field: 'index_name', title: '关联指标项', minWidth: 150 },
    { field: 'device_name', title: '数据来源设备', minWidth: 150 },
    { field: 'data_value', title: '数据值', minWidth: 100 },
    { field: 'sync_time', title: '同步时间', minWidth: 160 },
    { field: 'clean_result', title: '数据清洗结果', minWidth: 120 },
    { field: 'sync_type', title: '同步方式', minWidth: 100 },
    { field: 'store_status', title: '存储状态', minWidth: 100 }
  ];

  // 同步失败tab特有列
  const failExtraColumns = [
    { field: 'log_id', title: '日志ID', minWidth: 180, slots: { default: 'logId' } },
    { field: 'rule_name', title: '关联规则', minWidth: 150, sortable: true },
    { field: 'task_name', title: '关联任务', minWidth: 200 },
    { field: 'index_name', title: '关联指标项', minWidth: 150 },
    { field: 'device_name', title: '数据来源设备', minWidth: 150 },
    { field: 'sync_time', title: '同步时间', minWidth: 160 },
    { field: 'fail_reason', title: '失败原因', minWidth: 200 },
    { field: 'retry_count', title: '重试次数', minWidth: 100 },
    { field: 'last_retry_time', title: '最近重试时间', minWidth: 160 },
    { field: 'sync_type', title: '同步方式', minWidth: 100 }
  ];

  let dynamicColumns = [];
  if (tab === '全部') dynamicColumns = allExtraColumns;
  else if (tab === '启用') dynamicColumns = enableExtraColumns;
  else if (tab === '停用') dynamicColumns = disableExtraColumns;
  else if (tab === '同步成功') dynamicColumns = successExtraColumns;
  else if (tab === '同步失败') dynamicColumns = failExtraColumns;

  // 操作列
  const actionsColumn = {
    title: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'actions' }
  };

  // 判断是否为日志页（同步成功/失败），日志页不显示规则名称和编码
  const isLogTab = tab === '同步成功' || tab === '同步失败';
  return isLogTab
    ? [...baseColumns, ...dynamicColumns, actionsColumn]
    : [...baseColumns, ...commonColumns, ...dynamicColumns, actionsColumn];
}

export const textObj = {
  editText: '编辑接入规则',
  addText: '新增接入规则',
  excelName: '实时接入规则列表',
  excelAllName: '实时接入规则数据.xlsx',
  total: '总计：规则总数3；启用2；停用1',
};
