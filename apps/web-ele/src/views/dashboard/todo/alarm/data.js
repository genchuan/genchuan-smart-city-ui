// data.js - 预警管理数据
/** 预警表格初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "alarm_id": "ALARM-20260120-001",
      "alarm_level": "紧急",
      "alarm_type": "设备预警",
      "alarm_time": "2026-01-20 09:30:00",
      "related_object": "服务器集群-A",
      "location": "机房A区",
      "alarm_description": "服务器CPU使用率超过95%持续10分钟，系统负载过高",
      "source": "设备上报",
      "responsible_person": "",
      "alarm_status": "待处置",
      "deal_start_time": "",
      "current_deal_status": "",
      "related_workorder": "",
      "deal_progress": "",
      "update_time": "",
      "deal_log_summary": "",
      "deal_result": "",
      "finish_time": "",
      "deal_summary": "",
      "deal_duration": "",
      "review_opinion": "",
      "operation_log": "预警生成",
      "operator": "系统",
      "create_time": "2026-01-20 09:30:00"
    },
    {
      "id": 2,
      "alarm_id": "ALARM-20260121-002",
      "alarm_level": "高",
      "alarm_type": "安全预警",
      "alarm_time": "2026-01-21 14:00:00",
      "related_object": "Web服务器-01",
      "location": "办公区网络",
      "alarm_description": "检测到异常登录行为，1小时内尝试登录次数超过50次",
      "source": "系统检测",
      "responsible_person": "张三",
      "alarm_status": "处置中",
      "deal_start_time": "2026-01-21 14:30:00",
      "current_deal_status": "处置中",
      "related_workorder": "WO-20260121-001",
      "deal_progress": "60%",
      "update_time": "2026-01-22 10:30:00",
      "deal_log_summary": "已锁定异常IP，正在排查账号安全",
      "deal_result": "",
      "finish_time": "",
      "deal_summary": "",
      "deal_duration": "",
      "review_opinion": "",
      "operation_log": "开始处置",
      "operator": "张三",
      "create_time": "2026-01-21 14:00:00"
    },
    {
      "id": 3,
      "alarm_id": "ALARM-20260119-003",
      "alarm_level": "中",
      "alarm_type": "环境预警",
      "alarm_time": "2026-01-19 10:00:00",
      "related_object": "机房温控系统",
      "location": "机房B区",
      "alarm_description": "机房温度超过28℃阈值，当前温度29.5℃",
      "source": "设备上报",
      "responsible_person": "李四",
      "alarm_status": "已处理",
      "deal_start_time": "2026-01-19 10:30:00",
      "current_deal_status": "已解决",
      "related_workorder": "WO-20260119-001",
      "deal_progress": "100%",
      "update_time": "2026-01-22 09:45:00",
      "deal_log_summary": "检查空调系统，调整温度设置",
      "deal_result": "已解决",
      "finish_time": "2026-01-22 09:45:00",
      "deal_summary": "空调滤网清洁后恢复正常，温度稳定在25℃",
      "deal_duration": "3天",
      "review_opinion": "建议增加温度监控点",
      "operation_log": "处理完成",
      "operator": "李四",
      "create_time": "2026-01-19 10:00:00"
    }
    // ... 更多数据按类似结构添加
  ];
};

/** 预警搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'alarm_id',
      label: '预警ID',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入预警ID',
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '设备预警', value: '设备预警' },
          { label: '安全预警', value: '安全预警' },
          { label: '环境预警', value: '环境预警' },
          { label: '网络预警', value: '网络预警' },
          { label: '其他', value: '其他' },
        ],
        placeholder: '请选择预警类型',
        showSearch: true,
      },
      fieldName: 'alarm_type',
      label: '预警类型',
    },
    {
      fieldName: 'alarm_level',
      label: '预警等级',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '紧急', value: '紧急' },
          { label: '高', value: '高' },
          { label: '中', value: '中' },
          { label: '低', value: '低' },
        ],
        placeholder: '请选择预警等级',
      },
    },
    {
      fieldName: 'alarm_time',
      label: '发生时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'datetimerange',
        placeholder: ['开始时间', '结束时间'],
      },
    },
    {
      fieldName: 'location',
      label: '发生地点',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入发生地点',
      },
    },
    {
      fieldName: 'source',
      label: '预警来源',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '设备上报', value: '设备上报' },
          { label: '系统检测', value: '系统检测' },
          { label: '人工上报', value: '人工上报' },
        ],
        placeholder: '请选择预警来源',
      },
    },
    {
      fieldName: 'alarm_status',
      label: '预警状态',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '待处置', value: '待处置' },
          { label: '处置中', value: '处置中' },
          { label: '已处理', value: '已处理' },
          { label: '已忽略', value: '已忽略' },
        ],
        placeholder: '请选择预警状态',
      },
    },
  ];
}

/** 预警表格列配置 */
export function useGridColumns(activeTab) {
  const baseColumns = [
    { type: 'checkbox', width: 40 },
    {
      field: 'alarm_id',
      title: '预警ID',
      minWidth: 160,
      sortable: true,
      slots: { default: 'alarm_id' },
    },
    {
      field: 'alarm_level',
      title: '预警等级',
      minWidth: 100,
      sortable: true,
      slots: { default: 'alarm_level' },
    },
    {
      field: 'alarm_type',
      title: '预警类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'alarm_time',
      title: '发生时间',
      minWidth: 160,
      sortable: true,
    },
  ];

  // 根据不同标签页动态返回不同的列
  switch (activeTab) {
    case '待处置':
      return [
        ...baseColumns,
        {
          field: 'related_object',
          title: '关联对象',
          minWidth: 150,
          sortable: true,
          slots: { default: 'related_object' },
        },
        {
          field: 'location',
          title: '发生地点',
          minWidth: 150,
        },
        {
          field: 'alarm_description',
          title: '预警描述',
          minWidth: 200,
        },
        {
          field: 'source',
          title: '预警来源',
          minWidth: 100,
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'actions_waiting' },
        },
      ];

    case '处置中':
      return [
        ...baseColumns,
        {
          field: 'responsible_person',
          title: '处置人',
          minWidth: 100,
        },
        {
          field: 'deal_start_time',
          title: '开始处置时间',
          minWidth: 160,
        },
        {
          field: 'current_deal_status',
          title: '当前处置状态',
          minWidth: 120,
          slots: { default: 'deal_status' },
        },
        {
          field: 'related_workorder',
          title: '关联工单',
          minWidth: 140,
          slots: { default: 'workorder' },
        },
        {
          field: 'deal_progress',
          title: '处置进度',
          minWidth: 120,
          slots: { default: 'progress' },
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'actions_handling' },
        },
      ];

    case '已归档':
      return [
        ...baseColumns,
        {
          field: 'deal_result',
          title: '处置结果',
          minWidth: 100,
          slots: { default: 'deal_result' },
        },
        {
          field: 'finish_time',
          title: '完成时间',
          minWidth: 160,
        },
        {
          field: 'deal_summary',
          title: '处置总结',
          minWidth: 200,
        },
        {
          field: 'deal_duration',
          title: '处置时长',
          minWidth: 100,
        },
        {
          title: '操作',
          width: 180,
          fixed: 'right',
          slots: { default: 'actions_archived' },
        },
      ];

    default:
      return baseColumns;
  }
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑预警',
  addText: '新增预警',
  excelName: '预警列表',
  excelAllName: '预警数据.xlsx',
  total: '预警总数: 50; 待处置: 15; 处置中: 23; 已处理: 10; 已忽略: 2;',
};
