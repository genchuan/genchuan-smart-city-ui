// data.js - 排班管理数据
/** 表格初始数据 - 我的排班数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      scheduleId: 'SCH-20260201-001',
      scheduleDate: '2026-02-01',
      shiftTime: '08:00-18:00',
      post: '机房值班岗',
      location: 'A区数据中心-主控室',
      coWorkers: '张三,李四',
      dutyRequirement:
        '1. 每小时巡查机房温湿度；2. 监控服务器状态；3. 处理紧急告警；4. 填写值班日志',
      scheduleStatus: '正常',
      handoverStatus: '已交接',
      handoverTime: '2026-02-01 18:00:00',
      receiver: '王五',
      keyWork: '完成服务器巡检，处理2个紧急告警，更新系统补丁',
      unfinished: '备份任务因存储空间不足未完成',
      alarmDeal: '处理了服务器CPU过载告警和网络中断告警',
      deviceStatus: '服务器运行正常，UPS电池容量85%',
      attachmentCount: 2,
      handoverLogId: 'LOG-20260201-001',
      submitTime: '2026-02-01 18:30:00',
      moduleType: 'normal',
      priority: '常规',
      taskName: '白班值班',
      taskStatus: '已完成',
      relatedResource: '值班记录表',
      initiator: '排班系统',
      operator: '张三',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
    {
      id: 2,
      scheduleId: 'SCH-20260202-002',
      scheduleDate: '2026-02-02',
      shiftTime: '18:00-08:00',
      post: '机房值班岗',
      location: 'A区数据中心-主控室',
      coWorkers: '李四,王五',
      dutyRequirement:
        '1. 夜间巡检每2小时一次；2. 监控备份任务；3. 应急响应准备；4. 填写夜间值班记录',
      scheduleStatus: '换班中',
      handoverStatus: '未交接',
      handoverTime: '',
      receiver: '',
      keyWork: '',
      unfinished: '',
      alarmDeal: '',
      deviceStatus: '',
      attachmentCount: 0,
      handoverLogId: '',
      submitTime: '',
      moduleType: 'shifting',
      priority: '紧急',
      taskName: '夜班值班',
      taskStatus: '待确认',
      relatedResource: '',
      initiator: '排班系统',
      operator: '李四',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
    {
      id: 3,
      scheduleId: 'SCH-20260203-003',
      scheduleDate: '2026-02-03',
      shiftTime: '08:00-18:00',
      post: '网络监控岗',
      location: 'B区网络中心',
      coWorkers: '赵六,孙七',
      dutyRequirement:
        '1. 监控网络流量；2. 处理网络告警；3. 更新网络配置；4. 编写网络日报',
      scheduleStatus: '已换班',
      handoverStatus: '已交接',
      handoverTime: '2026-02-03 17:45:00',
      receiver: '孙七',
      keyWork: '网络巡检完成，处理了3个端口异常告警，优化了路由策略',
      unfinished: '网络设备固件升级计划推迟',
      alarmDeal: '端口流量异常告警已处理，调整了QoS策略',
      deviceStatus: '核心交换机运行正常，防火墙策略已更新',
      attachmentCount: 1,
      handoverLogId: 'LOG-20260203-001',
      submitTime: '2026-02-03 18:10:00',
      moduleType: 'shifted',
      priority: '常规',
      taskName: '网络值班',
      taskStatus: '已完成',
      relatedResource: '网络巡检报告',
      initiator: '排班系统',
      operator: '赵六',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
    {
      id: 4,
      scheduleId: 'SCH-20260204-004',
      scheduleDate: '2026-02-04',
      shiftTime: '08:00-18:00',
      post: '机房值班岗',
      location: 'A区数据中心-主控室',
      coWorkers: '周八,吴九',
      dutyRequirement: '1. 设备巡检；2. 环境监控；3. 故障处理；4. 值班记录',
      scheduleStatus: '正常',
      handoverStatus: '未交接',
      handoverTime: '',
      receiver: '',
      keyWork: '',
      unfinished: '',
      alarmDeal: '',
      deviceStatus: '',
      attachmentCount: 0,
      handoverLogId: '',
      submitTime: '',
      moduleType: 'normal',
      priority: '常规',
      taskName: '白班值班',
      taskStatus: '待执行',
      relatedResource: '',
      initiator: '排班系统',
      operator: '周八',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
    {
      id: 5,
      scheduleId: 'SCH-20260205-005',
      scheduleDate: '2026-02-05',
      shiftTime: '08:00-18:00',
      post: '安全监控岗',
      location: 'C区安全中心',
      coWorkers: '钱十,郑十一',
      dutyRequirement:
        '1. 监控安全事件；2. 分析安全日志；3. 应急响应；4. 编写安全日报',
      scheduleStatus: '换班中',
      handoverStatus: '已交接',
      handoverTime: '2026-02-05 17:50:00',
      receiver: '郑十一',
      keyWork: '处理了5个安全告警，完成了日志分析，更新了防火墙规则',
      unfinished: '安全审计报告未完成',
      alarmDeal: '处理了异常登录告警和DDoS攻击告警',
      deviceStatus: 'WAF设备运行正常，IDS检测到可疑流量',
      attachmentCount: 3,
      handoverLogId: 'LOG-20260205-001',
      submitTime: '2026-02-05 18:20:00',
      moduleType: 'shifting',
      priority: '紧急',
      taskName: '安全值班',
      taskStatus: '待审批',
      relatedResource: '安全日志',
      initiator: '排班系统',
      operator: '钱十',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
    {
      id: 6,
      scheduleId: 'SCH-20260201-006',
      scheduleDate: '2026-02-01',
      shiftTime: '18:00-08:00',
      post: '机房值班岗',
      location: 'A区数据中心-主控室',
      coWorkers: '王五,赵六',
      dutyRequirement: '1. 夜间巡检；2. 备份监控；3. 应急准备；4. 填写夜班记录',
      scheduleStatus: '已换班',
      handoverStatus: '已交接',
      handoverTime: '2026-02-02 08:10:00',
      receiver: '赵六',
      keyWork: '完成了夜间巡检，处理了1个存储告警，备份任务成功',
      unfinished: '服务器重启计划未执行',
      alarmDeal: '存储空间不足告警已处理，清理了临时文件',
      deviceStatus: '存储阵列运行正常，备份服务器工作正常',
      attachmentCount: 1,
      handoverLogId: 'LOG-20260202-001',
      submitTime: '2026-02-02 08:30:00',
      moduleType: 'shifted',
      priority: '常规',
      taskName: '夜班值班',
      taskStatus: '已完成',
      relatedResource: '备份报告',
      initiator: '排班系统',
      operator: '王五',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
    {
      id: 7,
      scheduleId: 'SCH-20260206-007',
      scheduleDate: '2026-02-06',
      shiftTime: '08:00-18:00',
      post: '机房值班岗',
      location: 'A区数据中心-主控室',
      coWorkers: '张三,李四',
      dutyRequirement: '1. 设备巡检；2. 环境监控；3. 故障处理；4. 值班记录',
      scheduleStatus: '正常',
      handoverStatus: '未交接',
      handoverTime: '',
      receiver: '',
      keyWork: '',
      unfinished: '',
      alarmDeal: '',
      deviceStatus: '',
      attachmentCount: 0,
      handoverLogId: '',
      submitTime: '',
      moduleType: 'normal',
      priority: '常规',
      taskName: '白班值班',
      taskStatus: '待执行',
      relatedResource: '',
      initiator: '排班系统',
      operator: '张三',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
    {
      id: 8,
      scheduleId: 'SCH-20260207-008',
      scheduleDate: '2026-02-07',
      shiftTime: '18:00-08:00',
      post: '网络监控岗',
      location: 'B区网络中心',
      coWorkers: '孙七,周八',
      dutyRequirement: '1. 网络监控；2. 告警处理；3. 配置备份；4. 夜班报告',
      scheduleStatus: '换班中',
      handoverStatus: '未交接',
      handoverTime: '',
      receiver: '',
      keyWork: '',
      unfinished: '',
      alarmDeal: '',
      deviceStatus: '',
      attachmentCount: 0,
      handoverLogId: '',
      submitTime: '',
      moduleType: 'shifting',
      priority: '紧急',
      taskName: '夜班值班',
      taskStatus: '待确认',
      relatedResource: '',
      initiator: '排班系统',
      operator: '孙七',
      createTime: '2026-01-25 09:00:00',
      assignTime: '2026-01-25 09:00:00',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 - 根据模块类型返回不同表单 */
export function useFormSchema(moduleType = 'mySchedule') {
  const baseSchema = [
    {
      fieldName: 'scheduleDate',
      label: '值班日期',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'daterange',
        placeholder: '请选择值班日期范围',
      },
    },
  ];

  switch (moduleType) {
    case 'mySchedule': // 我的排班
      return [
        ...baseSchema,
        {
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '机房值班岗', value: '机房值班岗' },
              { label: '网络监控岗', value: '网络监控岗' },
              { label: '安全监控岗', value: '安全监控岗' },
              { label: '系统维护岗', value: '系统维护岗' },
              { label: '数据库管理岗', value: '数据库管理岗' },
            ],
            placeholder: '请选择值班岗位',
            showSearch: true,
          },
          fieldName: 'post',
          label: '值班岗位',
        },
        {
          fieldName: 'location',
          label: '值班地点',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入值班地点',
          },
        },
        {
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '正常', value: '正常' },
              { label: '换班中', value: '换班中' },
              { label: '已换班', value: '已换班' },
            ],
            placeholder: '请选择排班状态',
            showSearch: true,
          },
          fieldName: 'scheduleStatus',
          label: '排班状态',
        },
      ];

    case 'shiftApply': // 换班申请
      return [
        {
          fieldName: 'applyStatus',
          label: '申请状态',
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '待审批', value: '待审批' },
              { label: '已通过', value: '已通过' },
              { label: '已驳回', value: '已驳回' },
              { label: '已撤回', value: '已撤回' },
            ],
            placeholder: '请选择申请状态',
            showSearch: true,
          },
        },
        {
          fieldName: 'applyTime',
          label: '申请时间',
          component: 'DatePicker',
          labelWidth: '100',
          componentProps: {
            type: 'daterange',
            placeholder: '请选择申请时间范围',
          },
        },
        {
          fieldName: 'shiftTarget',
          label: '换班对象',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入换班对象姓名',
          },
        },
      ];

    case 'handoverLog': // 交接日志
      return [
        ...baseSchema,
        {
          fieldName: 'dutyPerson',
          label: '值班人员',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入值班人员姓名',
          },
        },
        {
          fieldName: 'submitTime',
          label: '提交时间',
          component: 'DatePicker',
          labelWidth: '100',
          componentProps: {
            type: 'daterange',
            placeholder: '请选择提交时间范围',
          },
        },
      ];

    default:
      return baseSchema;
  }
}

/** 表格字段 - 根据模块类型返回不同列配置 */
export function useGridColumns(moduleType = 'mySchedule') {
  const baseColumns = [
    { type: 'checkbox', width: 40 },
    {
      field: 'scheduleId',
      title: '排班ID',
      minWidth: 180,
      sortable: true,
      slots: { default: 'scheduleId' },
    },
  ];

  switch (moduleType) {
    case 'mySchedule': // 我的排班
      return [
        ...baseColumns,
        {
          field: 'scheduleDate',
          title: '值班日期',
          minWidth: 120,
          sortable: true,
        },
        {
          field: 'shiftTime',
          title: '值班时段',
          minWidth: 120,
          sortable: true,
        },
        {
          field: 'post',
          title: '值班岗位',
          minWidth: 120,
          sortable: true,
          slots: { default: 'post' },
        },
        {
          field: 'location',
          title: '值班地点',
          minWidth: 150,
          sortable: true,
          slots: { default: 'location' },
        },
        {
          field: 'coWorkers',
          title: '同岗人员',
          minWidth: 150,
          formatter: ({ cellValue }) =>
            cellValue
              ? cellValue.length > 20
                ? cellValue.substring(0, 20) + '...'
                : cellValue
              : '-',
          slots: { default: 'coWorkers' },
        },
        {
          field: 'scheduleStatus',
          title: '排班状态',
          minWidth: 100,
          sortable: true,
          slots: { default: 'scheduleStatus' },
        },
        {
          field: 'dutyRequirement',
          title: '值班要求',
          minWidth: 200,
          formatter: ({ cellValue }) =>
            cellValue
              ? cellValue.length > 50
                ? cellValue.substring(0, 50) + '...'
                : cellValue
              : '-',
        },
        {
          field: 'handoverStatus',
          title: '交接状态',
          minWidth: 100,
          sortable: true,
          slots: { default: 'handoverStatus' },
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'scheduleActions' },
        },
      ];

    case 'shiftApply': // 换班申请
      return [
        ...baseColumns,
        {
          field: 'originalSchedule',
          title: '原值班信息',
          minWidth: 200,
          formatter: ({ row }) =>
            row.scheduleDate && row.shiftTime
              ? `${row.scheduleDate} ${row.shiftTime}`
              : '-',
        },
        {
          field: 'newScheduleInfo',
          title: '新值班信息',
          minWidth: 200,
        },
        {
          field: 'shiftTarget',
          title: '换班对象',
          minWidth: 100,
        },
        {
          field: 'applyStatus',
          title: '申请状态',
          minWidth: 100,
          slots: { default: 'applyStatus' },
        },
        {
          field: 'applyTime',
          title: '申请时间',
          minWidth: 160,
          sortable: true,
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'applyActions' },
        },
      ];

    case 'handoverLog': // 交接日志
      return [
        ...baseColumns,
        {
          field: 'dutyDate',
          title: '值班日期',
          minWidth: 120,
          sortable: true,
        },
        {
          field: 'dutyPerson',
          title: '值班人员',
          minWidth: 100,
        },
        {
          field: 'keyWork',
          title: '重点工作',
          minWidth: 200,
          formatter: ({ cellValue }) =>
            cellValue
              ? cellValue.length > 50
                ? cellValue.substring(0, 50) + '...'
                : cellValue
              : '-',
        },
        {
          field: 'submitTime',
          title: '提交时间',
          minWidth: 160,
          sortable: true,
        },
        {
          field: 'receiver',
          title: '接收人',
          minWidth: 100,
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'logActions' },
        },
      ];

    default:
      return baseColumns;
  }
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑排班',
  addText: '新增排班',
  excelName: '我的排班',
  excelAllName: '排班数据.xlsx',
  total: '总排班数: 45; 正常排班: 30; 换班中: 8; 已换班: 7;',
};
