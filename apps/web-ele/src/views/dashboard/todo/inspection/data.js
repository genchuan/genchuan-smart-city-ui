// data.js
/** 表格初始数据 - 巡检计划数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      planId: 'PLAN-202601-001',
      planName: '服务器设备日常巡检',
      taskType: '设备巡检',
      inspectionRange: '服务器集群-A,服务器集群-B',
      frequency: '日',
      planCycle: '2026-01-01 至 2026-12-31',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      chargeBy: '张三',
      currentProgress: '未开始',
      progressName: '未开始',
      planStatus: '未开始',
      createTime: '2026-01-10 09:00:00',
      taskCount: 365,
      finishCount: 0,
      executeTime: '',
      executeBy: '',
      executeDuration: '',
      submitTime: '',
      problemCount: 0,
      problemFinishCount: 0,
      location: '机房A区,B区',
      updateTime: '2026-01-10 09:00:00',
      description: '服务器设备日常巡检计划',
      moduleType: 'pending', // 待开始
      attachmentCount: 0,
      latestDynamic: '计划已创建',
      relatedResource: '',
      reviewOpinion: '',
    },
    {
      id: 2,
      planId: 'PLAN-202601-002',
      planName: '网络安全周检',
      taskType: '安全巡检',
      inspectionRange: '核心交换机,防火墙',
      frequency: '周',
      planCycle: '2026-01-01 至 2026-03-31',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      chargeBy: '李四',
      currentProgress: '执行中',
      progressName: '执行中',
      planStatus: '执行中',
      createTime: '2026-01-05 14:30:00',
      taskCount: 12,
      finishCount: 4,
      executeTime: '2026-01-22 09:00:00',
      executeBy: '李四',
      executeDuration: '2小时',
      submitTime: '2026-01-22 11:00:00',
      problemCount: 2,
      problemFinishCount: 1,
      location: '网络机房',
      updateTime: '2026-01-22 11:00:00',
      description: '网络安全设备每周巡检',
      moduleType: 'dealing', // 执行中
      attachmentCount: 2,
      latestDynamic: '本周巡检已完成，发现2个问题',
      relatedResource: '巡检报告',
      reviewOpinion: '巡检流程执行规范',
    },
    {
      id: 3,
      planId: 'PLAN-202512-003',
      planName: '存储设备月检',
      taskType: '存储巡检',
      inspectionRange: '存储阵列,备份服务器',
      frequency: '月',
      planCycle: '2025-12-01 至 2026-05-31',
      startDate: '2025-12-01',
      endDate: '2026-05-31',
      chargeBy: '王五',
      currentProgress: '已完成',
      progressName: '已完成',
      planStatus: '已完成',
      createTime: '2025-11-25 10:00:00',
      taskCount: 6,
      finishCount: 6,
      executeTime: '2026-01-20 14:00:00',
      executeBy: '王五',
      executeDuration: '3小时',
      submitTime: '2026-01-20 17:00:00',
      problemCount: 3,
      problemFinishCount: 3,
      location: '机房存储区',
      updateTime: '2026-01-21 09:00:00',
      description: '存储设备月度巡检',
      moduleType: 'archived', // 已归档
      attachmentCount: 3,
      latestDynamic: '本月巡检已完成，所有问题已解决',
      relatedResource: '存储巡检报告',
      reviewOpinion: '存储空间不足问题需要长期关注',
    },
    {
      id: 4,
      planId: 'PLAN-202601-004',
      planName: '空调系统季度巡检',
      taskType: '环境巡检',
      inspectionRange: '机房空调,温湿度传感器',
      frequency: '月',
      planCycle: '2026-01-01 至 2026-06-30',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      chargeBy: '赵六',
      currentProgress: '未开始',
      progressName: '未开始',
      planStatus: '未开始',
      createTime: '2026-01-15 11:00:00',
      taskCount: 6,
      finishCount: 0,
      executeTime: '',
      executeBy: '',
      executeDuration: '',
      submitTime: '',
      problemCount: 0,
      problemFinishCount: 0,
      location: '机房空调房',
      updateTime: '2026-01-15 11:00:00',
      description: '空调系统季度巡检维护',
      moduleType: 'pending', // 待开始
      attachmentCount: 1,
      latestDynamic: '计划已创建',
      relatedResource: '维护手册',
      reviewOpinion: '',
    },
    {
      id: 5,
      planId: 'PLAN-202512-005',
      planName: '应用服务器巡检',
      taskType: '应用巡检',
      inspectionRange: '应用服务器集群',
      frequency: '周',
      planCycle: '2025-12-01 至 2026-02-28',
      startDate: '2025-12-01',
      endDate: '2026-02-28',
      chargeBy: '孙七',
      currentProgress: '执行中',
      progressName: '执行中',
      planStatus: '执行中',
      createTime: '2025-11-20 09:30:00',
      taskCount: 12,
      finishCount: 8,
      executeTime: '2026-01-22 10:00:00',
      executeBy: '孙七',
      executeDuration: '1.5小时',
      submitTime: '2026-01-22 11:30:00',
      problemCount: 1,
      problemFinishCount: 1,
      location: '机房A区-应用区',
      updateTime: '2026-01-22 11:30:00',
      description: '应用服务器性能与稳定性巡检',
      moduleType: 'dealing', // 执行中
      attachmentCount: 0,
      latestDynamic: '本周巡检完成，发现1个性能问题',
      relatedResource: '性能监控图',
      reviewOpinion: '性能优化需要持续跟进',
    },
    {
      id: 6,
      planId: 'PLAN-202511-006',
      planName: '电源设备年检',
      taskType: '电源巡检',
      inspectionRange: 'UPS电源,配电柜',
      frequency: '年',
      planCycle: '2025-11-01 至 2026-10-31',
      startDate: '2025-11-01',
      endDate: '2026-10-31',
      chargeBy: '周八',
      currentProgress: '已完成',
      progressName: '已完成',
      planStatus: '已完成',
      createTime: '2025-10-20 14:00:00',
      taskCount: 1,
      finishCount: 1,
      executeTime: '2025-12-10 09:00:00',
      executeBy: '周八',
      executeDuration: '4小时',
      submitTime: '2025-12-10 13:00:00',
      problemCount: 0,
      problemFinishCount: 0,
      location: '配电室',
      updateTime: '2025-12-11 09:00:00',
      description: '电源设备年度全面检查',
      moduleType: 'archived', // 已归档
      attachmentCount: 5,
      latestDynamic: '年检完成，设备运行正常',
      relatedResource: '年检报告',
      reviewOpinion: '设备维护良好，建议明年继续',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 - 根据模块类型返回不同表单 */
export function useFormSchema(moduleType = 'pending') {
  const baseSchema = [
    {
      fieldName: 'planId',
      label: '计划ID',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入计划ID',
      },
    },
  ];

  switch (moduleType) {
    case 'pending': // 待开始
      return [
        ...baseSchema,
        {
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '设备巡检', value: '设备巡检' },
              { label: '安全巡检', value: '安全巡检' },
              { label: '存储巡检', value: '存储巡检' },
              { label: '环境巡检', value: '环境巡检' },
              { label: '应用巡检', value: '应用巡检' },
              { label: '电源巡检', value: '电源巡检' },
              { label: '网络巡检', value: '网络巡检' },
              { label: '其他', value: '其他' },
            ],
            placeholder: '请选择巡检类型',
            showSearch: true,
          },
          fieldName: 'taskType',
          label: '巡检类型',
        },
        {
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '日', value: '日' },
              { label: '周', value: '周' },
              { label: '月', value: '月' },
              { label: '季度', value: '季度' },
              { label: '年', value: '年' },
            ],
            placeholder: '请选择巡检频次',
            showSearch: true,
          },
          fieldName: 'frequency',
          label: '巡检频次',
        },
        {
          fieldName: 'chargeBy',
          label: '负责人',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入负责人',
          },
        },
        {
          fieldName: 'createTime',
          label: '创建时间',
          component: 'DatePicker',
          labelWidth: '100',
          componentProps: {
            type: 'daterange',
            placeholder: '请选择创建时间范围',
          },
        },
        {
          fieldName: 'inspectionRange',
          label: '巡检范围',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入巡检范围',
          },
        },
      ];

    case 'dealing': // 执行中
      return [
        ...baseSchema,
        {
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '设备巡检', value: '设备巡检' },
              { label: '安全巡检', value: '安全巡检' },
              { label: '存储巡检', value: '存储巡检' },
              { label: '环境巡检', value: '环境巡检' },
              { label: '应用巡检', value: '应用巡检' },
              { label: '电源巡检', value: '电源巡检' },
              { label: '网络巡检', value: '网络巡检' },
              { label: '其他', value: '其他' },
            ],
            placeholder: '请选择巡检类型',
            showSearch: true,
          },
          fieldName: 'taskType',
          label: '巡检类型',
        },
        {
          fieldName: 'chargeBy',
          label: '负责人',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入负责人',
          },
        },
        {
          fieldName: 'currentProgress',
          label: '当前进度',
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            options: [
              { label: '执行中', value: '执行中' },
              { label: '暂停', value: '暂停' },
              { label: '待验收', value: '待验收' },
            ],
            placeholder: '请选择当前进度',
          },
        },
        {
          fieldName: 'planCycle',
          label: '计划周期',
          component: 'DatePicker',
          labelWidth: '100',
          componentProps: {
            type: 'daterange',
            placeholder: '请选择计划周期范围',
          },
        },
        {
          fieldName: 'executeBy',
          label: '执行人',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入执行人',
          },
        },
      ];

    case 'archived': // 已归档
      return [
        ...baseSchema,
        {
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '设备巡检', value: '设备巡检' },
              { label: '安全巡检', value: '安全巡检' },
              { label: '存储巡检', value: '存储巡检' },
              { label: '环境巡检', value: '环境巡检' },
              { label: '应用巡检', value: '应用巡检' },
              { label: '电源巡检', value: '电源巡检' },
              { label: '网络巡检', value: '网络巡检' },
              { label: '其他', value: '其他' },
            ],
            placeholder: '请选择巡检类型',
            showSearch: true,
          },
          fieldName: 'taskType',
          label: '巡检类型',
        },
        {
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            allowClear: true,
            filterOption: true,
            options: [
              { label: '日', value: '日' },
              { label: '周', value: '周' },
              { label: '月', value: '月' },
              { label: '季度', value: '季度' },
              { label: '年', value: '年' },
            ],
            placeholder: '请选择巡检频次',
            showSearch: true,
          },
          fieldName: 'frequency',
          label: '巡检频次',
        },
        {
          fieldName: 'planStatus',
          label: '计划状态',
          component: 'Select',
          labelWidth: '100',
          componentProps: {
            options: [
              { label: '已完成', value: '已完成' },
              { label: '已取消', value: '已取消' },
              { label: '已终止', value: '已终止' },
            ],
            placeholder: '请选择计划状态',
          },
        },
        {
          fieldName: 'executeTime',
          label: '执行时间',
          component: 'DatePicker',
          labelWidth: '100',
          componentProps: {
            type: 'daterange',
            placeholder: '请选择执行时间范围',
          },
        },
        {
          fieldName: 'chargeBy',
          label: '负责人',
          component: 'Input',
          labelWidth: '100',
          componentProps: {
            placeholder: '请输入负责人',
          },
        },
      ];

    default:
      return baseSchema;
  }
}

/** 表格字段 - 根据模块类型返回不同列配置 */
export function useGridColumns(moduleType = 'pending') {
  const baseColumns = [
    { type: 'checkbox', width: 40 },
    {
      field: 'planId',
      title: '计划ID',
      minWidth: 180,
      sortable: true,
      slots: { default: 'planId' },
    },
  ];

  switch (moduleType) {
    case 'pending': // 待开始
      return [
        ...baseColumns,
        {
          field: 'planName',
          title: '计划名称',
          minWidth: 180,
          sortable: true,
          slots: { default: 'planName' },
        },
        {
          field: 'taskType',
          title: '巡检类型',
          minWidth: 120,
          sortable: true,
          slots: { default: 'taskType' },
        },
        {
          field: 'inspectionRange',
          title: '巡检范围',
          minWidth: 180,
          formatter: ({ cellValue }) =>
            cellValue
              ? cellValue.length > 30
                ? cellValue.substring(0, 30) + '...'
                : cellValue
              : '-',
        },
        {
          field: 'frequency',
          title: '巡检频次',
          minWidth: 100,
          sortable: true,
          slots: { default: 'frequency' },
        },
        {
          field: 'planCycle',
          title: '计划周期',
          minWidth: 180,
        },
        {
          field: 'chargeBy',
          title: '负责人',
          minWidth: 100,
          sortable: true,
          slots: { default: 'chargeBy' },
        },
        {
          field: 'currentProgress',
          title: '当前进度',
          minWidth: 100,
          sortable: true,
          slots: { default: 'currentProgress' },
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'pendingActions' },
        },
      ];

    case 'dealing': // 执行中
      return [
        ...baseColumns,
        {
          field: 'planName',
          title: '计划名称',
          minWidth: 180,
          sortable: true,
          slots: { default: 'planName' },
        },
        {
          field: 'taskType',
          title: '巡检类型',
          minWidth: 120,
          sortable: true,
          slots: { default: 'taskType' },
        },
        {
          field: 'inspectionRange',
          title: '巡检范围',
          minWidth: 180,
          formatter: ({ cellValue }) =>
            cellValue
              ? cellValue.length > 30
                ? cellValue.substring(0, 30) + '...'
                : cellValue
              : '-',
        },
        {
          field: 'chargeBy',
          title: '负责人',
          minWidth: 100,
          sortable: true,
          slots: { default: 'chargeBy' },
        },
        {
          field: 'currentProgress',
          title: '当前进度',
          minWidth: 100,
          sortable: true,
          slots: { default: 'currentProgress' },
        },
        {
          field: 'taskCount',
          title: '任务数量',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'finishCount',
          title: '已完成',
          minWidth: 100,
          sortable: true,
          formatter: ({ row }) => {
            const percentage =
              row.taskCount > 0
                ? Math.round((row.finishCount / row.taskCount) * 100)
                : 0;
            return `${row.finishCount}/${row.taskCount} (${percentage}%)`;
          },
        },
        {
          title: '操作',
          width: 280,
          fixed: 'right',
          slots: { default: 'dealingActions' },
        },
      ];

    case 'archived': // 已归档
      return [
        ...baseColumns,
        {
          field: 'planName',
          title: '计划名称',
          minWidth: 180,
          sortable: true,
          slots: { default: 'planName' },
        },
        {
          field: 'taskType',
          title: '巡检类型',
          minWidth: 120,
          sortable: true,
          slots: { default: 'taskType' },
        },
        {
          field: 'planStatus',
          title: '计划状态',
          minWidth: 100,
          sortable: true,
          slots: { default: 'planStatus' },
        },
        {
          field: 'executeTime',
          title: '执行时间',
          minWidth: 160,
          sortable: true,
        },
        {
          field: 'problemCount',
          title: '发现问题',
          minWidth: 100,
          sortable: true,
          formatter: ({ row }) => {
            const finishRate =
              row.problemCount > 0
                ? Math.round((row.problemFinishCount / row.problemCount) * 100)
                : 0;
            return `${row.problemFinishCount}/${row.problemCount} (${finishRate}%)`;
          },
        },
        {
          field: 'chargeBy',
          title: '负责人',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'executeDuration',
          title: '执行时长',
          minWidth: 100,
          sortable: true,
        },
        {
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: { default: 'archivedActions' },
        },
      ];

    default:
      return baseColumns;
  }
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑巡检计划',
  addText: '新增巡检计划',
  excelName: '巡检计划列表',
  excelAllName: '巡检计划数据.xlsx',
  total: '巡检计划总数: 50; 待开始: 15; 执行中: 12; 已归档: 23;',
};
