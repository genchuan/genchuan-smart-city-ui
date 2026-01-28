/** 基础费率管理初始数据 */
export const baseRateDataList = () => {
  return [
    {
      feeStrategyId: 'FEE001',
      strategyName: '全局基础费率',
      baseRate: 0.05,
      maxDailyFee: 50,
      applyScope: '全局',
      scopeIds: [],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 10:00:00',
      updateTime: '2024-12-15 10:00:00',
      remark: '适用于所有停车场的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE002',
      strategyName: '商业区基础费率',
      baseRate: 0.1,
      maxDailyFee: 80,
      applyScope: '区域',
      scopeIds: ['REGION001', 'REGION002'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 10:30:00',
      updateTime: '2024-12-15 10:30:00',
      remark: '适用于商业区停车场的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE003',
      strategyName: '住宅区基础费率',
      baseRate: 0.03,
      maxDailyFee: 30,
      applyScope: '区域',
      scopeIds: ['REGION003', 'REGION004'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 11:00:00',
      updateTime: '2024-12-15 11:00:00',
      remark: '适用于住宅区停车场的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE004',
      strategyName: '机场区域基础费率',
      baseRate: 0.15,
      maxDailyFee: 100,
      applyScope: '区域',
      scopeIds: ['REGION005'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 11:30:00',
      updateTime: '2024-12-15 11:30:00',
      remark: '适用于机场区域的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE005',
      strategyName: '火车站区域基础费率',
      baseRate: 0.12,
      maxDailyFee: 90,
      applyScope: '区域',
      scopeIds: ['REGION006'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 12:00:00',
      updateTime: '2024-12-15 12:00:00',
      remark: '适用于火车站区域的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE006',
      strategyName: '医院区域基础费率',
      baseRate: 0.08,
      maxDailyFee: 60,
      applyScope: '区域',
      scopeIds: ['REGION007'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 12:30:00',
      updateTime: '2024-12-15 12:30:00',
      remark: '适用于医院区域的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE007',
      strategyName: '学校区域基础费率',
      baseRate: 0.06,
      maxDailyFee: 45,
      applyScope: '区域',
      scopeIds: ['REGION008'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 13:00:00',
      updateTime: '2024-12-15 13:00:00',
      remark: '适用于学校区域的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE008',
      strategyName: '商业区夜间基础费率',
      baseRate: 0.07,
      maxDailyFee: 70,
      applyScope: '区域',
      scopeIds: ['REGION001', 'REGION002'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 13:30:00',
      updateTime: '2024-12-15 13:30:00',
      remark: '适用于商业区夜间的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE009',
      strategyName: '住宅区夜间基础费率',
      baseRate: 0.04,
      maxDailyFee: 40,
      applyScope: '区域',
      scopeIds: ['REGION003', 'REGION004'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 14:00:00',
      updateTime: '2024-12-15 14:00:00',
      remark: '适用于住宅区夜间的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE010',
      strategyName: '工业区基础费率',
      baseRate: 0.09,
      maxDailyFee: 75,
      applyScope: '区域',
      scopeIds: ['REGION009'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 14:30:00',
      updateTime: '2024-12-15 14:30:00',
      remark: '适用于工业区的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE011',
      strategyName: '科技园区基础费率',
      baseRate: 0.11,
      maxDailyFee: 85,
      applyScope: '区域',
      scopeIds: ['REGION010'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 15:00:00',
      updateTime: '2024-12-15 15:00:00',
      remark: '适用于科技园区的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE012',
      strategyName: '景区区域基础费率',
      baseRate: 0.13,
      maxDailyFee: 95,
      applyScope: '区域',
      scopeIds: ['REGION011'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 15:30:00',
      updateTime: '2024-12-15 15:30:00',
      remark: '适用于景区区域的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE013',
      strategyName: '商业区中心基础费率',
      baseRate: 0.14,
      maxDailyFee: 100,
      applyScope: '区域',
      scopeIds: ['REGION012'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 16:00:00',
      updateTime: '2024-12-15 16:00:00',
      remark: '适用于商业区中心的基础费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE014',
      strategyName: '郊区基础费率',
      baseRate: 0.05,
      maxDailyFee: 35,
      applyScope: '区域',
      scopeIds: ['REGION013'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 16:30:00',
      updateTime: '2024-12-15 16:30:00',
      remark: '适用于郊区的基础费率策略',
      createUserName: '管理员',
    },
  ];
};

/** 时段费率管理初始数据 */
export const timeRateDataList = () => {
  return [
    {
      feeStrategyId: 'FEE004',
      strategyName: '工作日时段费率',
      peakTime: [{ start: '08:00', end: '18:00' }],
      peakRate: 0.15,
      offPeakTime: [
        { start: '00:00', end: '08:00' },
        { start: '18:00', end: '24:00' },
      ],
      offPeakRate: 0.05,
      applyScope: '全局',
      scopeIds: [],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 14:00:00',
      updateTime: '2024-12-15 14:00:00',
      remark: '工作日时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE005',
      strategyName: '节假日时段费率',
      peakTime: [{ start: '10:00', end: '20:00' }],
      peakRate: 0.2,
      offPeakTime: [
        { start: '00:00', end: '10:00' },
        { start: '20:00', end: '24:00' },
      ],
      offPeakRate: 0.1,
      applyScope: '全局',
      scopeIds: [],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 14:30:00',
      updateTime: '2024-12-15 14:30:00',
      remark: '节假日时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE006',
      strategyName: '商业区时段费率',
      peakTime: [{ start: '09:00', end: '22:00' }],
      peakRate: 0.25,
      offPeakTime: [
        { start: '00:00', end: '09:00' },
        { start: '22:00', end: '24:00' },
      ],
      offPeakRate: 0.1,
      applyScope: '区域',
      scopeIds: ['REGION001'],
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 15:00:00',
      updateTime: '2024-12-15 15:00:00',
      remark: '商业区时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE007',
      strategyName: '机场区域时段费率',
      peakTime: [{ start: '07:00', end: '21:00' }],
      peakRate: 0.2,
      offPeakTime: [
        { start: '00:00', end: '07:00' },
        { start: '21:00', end: '24:00' },
      ],
      offPeakRate: 0.1,
      applyScope: '区域',
      scopeIds: ['REGION005'],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 15:30:00',
      updateTime: '2024-12-15 15:30:00',
      remark: '机场区域时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE008',
      strategyName: '火车站区域时段费率',
      peakTime: [{ start: '08:00', end: '20:00' }],
      peakRate: 0.18,
      offPeakTime: [
        { start: '00:00', end: '08:00' },
        { start: '20:00', end: '24:00' },
      ],
      offPeakRate: 0.08,
      applyScope: '区域',
      scopeIds: ['REGION006'],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 16:00:00',
      updateTime: '2024-12-15 16:00:00',
      remark: '火车站区域时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE009',
      strategyName: '医院区域时段费率',
      peakTime: [{ start: '08:00', end: '18:00' }],
      peakRate: 0.12,
      offPeakTime: [
        { start: '00:00', end: '08:00' },
        { start: '18:00', end: '24:00' },
      ],
      offPeakRate: 0.06,
      applyScope: '区域',
      scopeIds: ['REGION007'],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 16:30:00',
      updateTime: '2024-12-15 16:30:00',
      remark: '医院区域时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE010',
      strategyName: '学校区域时段费率',
      peakTime: [{ start: '07:00', end: '19:00' }],
      peakRate: 0.1,
      offPeakTime: [
        { start: '00:00', end: '07:00' },
        { start: '19:00', end: '24:00' },
      ],
      offPeakRate: 0.05,
      applyScope: '区域',
      scopeIds: ['REGION008'],
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 17:00:00',
      updateTime: '2024-12-15 17:00:00',
      remark: '学校区域时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE011',
      strategyName: '工业区时段费率',
      peakTime: [{ start: '06:00', end: '18:00' }],
      peakRate: 0.15,
      offPeakTime: [
        { start: '00:00', end: '06:00' },
        { start: '18:00', end: '24:00' },
      ],
      offPeakRate: 0.08,
      applyScope: '区域',
      scopeIds: ['REGION009'],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 17:30:00',
      updateTime: '2024-12-15 17:30:00',
      remark: '工业区时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE012',
      strategyName: '科技园区时段费率',
      peakTime: [{ start: '09:00', end: '19:00' }],
      peakRate: 0.18,
      offPeakTime: [
        { start: '00:00', end: '09:00' },
        { start: '19:00', end: '24:00' },
      ],
      offPeakRate: 0.09,
      applyScope: '区域',
      scopeIds: ['REGION010'],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 18:00:00',
      updateTime: '2024-12-15 18:00:00',
      remark: '科技园区时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE013',
      strategyName: '景区区域时段费率',
      peakTime: [{ start: '10:00', end: '18:00' }],
      peakRate: 0.25,
      offPeakTime: [
        { start: '00:00', end: '10:00' },
        { start: '18:00', end: '24:00' },
      ],
      offPeakRate: 0.12,
      applyScope: '区域',
      scopeIds: ['REGION011'],
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 18:30:00',
      updateTime: '2024-12-15 18:30:00',
      remark: '景区区域时段差异化费率策略',
    },
    {
      feeStrategyId: 'FEE014',
      strategyName: '郊区时段费率',
      peakTime: [{ start: '08:00', end: '17:00' }],
      peakRate: 0.1,
      offPeakTime: [
        { start: '00:00', end: '08:00' },
        { start: '17:00', end: '24:00' },
      ],
      offPeakRate: 0.05,
      applyScope: '区域',
      scopeIds: ['REGION013'],
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 19:00:00',
      updateTime: '2024-12-15 19:00:00',
      remark: '郊区时段差异化费率策略',
    },
  ];
};

/** 区域费率管理初始数据 */
export const areaRateDataList = () => {
  return [
    {
      feeStrategyId: 'FEE007',
      strategyName: '中心区域费率',
      regionName: '市中心区域',
      regionRate: 0.15,
      applyScope: '区域',
      scopeIds: ['REGION001'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 16:00:00',
      updateTime: '2024-12-15 16:00:00',
      remark: '市中心区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE008',
      strategyName: '郊区区域费率',
      regionName: '郊区区域',
      regionRate: 0.05,
      applyScope: '区域',
      scopeIds: ['REGION005', 'REGION006'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 16:30:00',
      updateTime: '2024-12-15 16:30:00',
      remark: '郊区区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE009',
      strategyName: '景区区域费率',
      regionName: '景区区域',
      regionRate: 0.2,
      applyScope: '区域',
      scopeIds: ['REGION007'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 17:00:00',
      updateTime: '2024-12-15 17:00:00',
      remark: '景区区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE010',
      strategyName: '机场区域费率',
      regionName: '机场区域',
      regionRate: 0.25,
      applyScope: '区域',
      scopeIds: ['REGION008'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 17:30:00',
      updateTime: '2024-12-15 17:30:00',
      remark: '机场区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE011',
      strategyName: '火车站区域费率',
      regionName: '火车站区域',
      regionRate: 0.2,
      applyScope: '区域',
      scopeIds: ['REGION009'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 18:00:00',
      updateTime: '2024-12-15 18:00:00',
      remark: '火车站区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE012',
      strategyName: '医院区域费率',
      regionName: '医院区域',
      regionRate: 0.12,
      applyScope: '区域',
      scopeIds: ['REGION010'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 18:30:00',
      updateTime: '2024-12-15 18:30:00',
      remark: '医院区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE013',
      strategyName: '学校区域费率',
      regionName: '学校区域',
      regionRate: 0.1,
      applyScope: '区域',
      scopeIds: ['REGION011'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 19:00:00',
      updateTime: '2024-12-15 19:00:00',
      remark: '学校区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE014',
      strategyName: '工业区区域费率',
      regionName: '工业区区域',
      regionRate: 0.15,
      applyScope: '区域',
      scopeIds: ['REGION012'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 19:30:00',
      updateTime: '2024-12-15 19:30:00',
      remark: '工业区区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE015',
      strategyName: '科技园区区域费率',
      regionName: '科技园区区域',
      regionRate: 0.18,
      applyScope: '区域',
      scopeIds: ['REGION013'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 20:00:00',
      updateTime: '2024-12-15 20:00:00',
      remark: '科技园区区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE016',
      strategyName: '商业区区域费率',
      regionName: '商业区区域',
      regionRate: 0.22,
      applyScope: '区域',
      scopeIds: ['REGION001', 'REGION002'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '禁用',
      createBy: 'U001',
      createTime: '2024-12-15 20:30:00',
      updateTime: '2024-12-15 20:30:00',
      remark: '商业区区域专用费率策略',
      createUserName: '管理员',
    },
    {
      feeStrategyId: 'FEE017',
      strategyName: '住宅区区域费率',
      regionName: '住宅区区域',
      regionRate: 0.08,
      applyScope: '区域',
      scopeIds: ['REGION003', 'REGION004'],
      effectTime: '2025-01-01 00:00:00',
      expireTime: '2025-12-31 23:59:59',
      status: '启用',
      createBy: 'U001',
      createTime: '2024-12-15 21:00:00',
      updateTime: '2024-12-15 21:00:00',
      remark: '住宅区区域专用费率策略',
      createUserName: '管理员',
    },
  ];
};

/** 获取指定类型的数据列表 */
export const dataList = (type = 'base') => {
  switch (type) {
    case 'area': {
      return areaRateDataList();
    }
    case 'base': {
      return baseRateDataList();
    }
    case 'time': {
      return timeRateDataList();
    }
    default: {
      return baseRateDataList();
    }
  }
};

/** 基础费率表单配置 */
export function useBaseRateFormSchema() {
  return [
    {
      fieldName: 'strategyName',
      label: '策略名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入策略名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'baseRate',
      label: '基础费率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入基础费率（元/分钟）',
        min: 0,
        step: 0.01,
      },
      rules: 'required',
    },
    {
      fieldName: 'maxDailyFee',
      label: '单日最高费用',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入单日最高费用',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'applyScope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: [
          { label: '全局', value: '全局' },
          { label: '区域', value: '区域' },
          { label: '车场', value: '车场' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'scopeIds',
      label: '适用范围ID列表',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用范围ID列表（JSON格式）',
        type: 'textarea',
      },
    },
    {
      fieldName: 'effectTime',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'expireTime',
      label: '失效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择失效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
      },
    },
  ];
}

/** 时段费率表单配置 */
export function useTimeRateFormSchema() {
  return [
    {
      fieldName: 'strategyName',
      label: '策略名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入策略名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'peakTime',
      label: '高峰时段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入高峰时段（JSON格式）',
        type: 'textarea',
      },
      rules: 'required',
    },
    {
      fieldName: 'peakRate',
      label: '高峰费率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入高峰费率（元/分钟）',
        min: 0,
        step: 0.01,
      },
      rules: 'required',
    },
    {
      fieldName: 'offPeakTime',
      label: '平峰时段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入平峰时段（JSON格式）',
        type: 'textarea',
      },
      rules: 'required',
    },
    {
      fieldName: 'offPeakRate',
      label: '平峰费率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入平峰费率（元/分钟）',
        min: 0,
        step: 0.01,
      },
      rules: 'required',
    },
    {
      fieldName: 'applyScope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: [
          { label: '全局', value: '全局' },
          { label: '区域', value: '区域' },
          { label: '车场', value: '车场' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'scopeIds',
      label: '适用范围ID列表',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用范围ID列表（JSON格式）',
        type: 'textarea',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
      },
    },
  ];
}

/** 区域费率表单配置 */
export function useAreaRateFormSchema() {
  return [
    {
      fieldName: 'strategyName',
      label: '策略名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入策略名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'regionName',
      label: '区域名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区域名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'regionRate',
      label: '区域费率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入区域费率（元/分钟）',
        min: 0,
        step: 0.01,
      },
      rules: 'required',
    },
    {
      fieldName: 'applyScope',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: [
          { label: '全局', value: '全局' },
          { label: '区域', value: '区域' },
          { label: '车场', value: '车场' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'scopeIds',
      label: '适用范围ID列表',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用范围ID列表（JSON格式）',
        type: 'textarea',
      },
    },
    {
      fieldName: 'effectTime',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'expireTime',
      label: '失效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择失效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
      },
    },
  ];
}

/** 根据类型获取表单配置 */
export function useFormSchema(type = 'base') {
  switch (type) {
    case 'area': {
      return useAreaRateFormSchema();
    }
    case 'base': {
      return useBaseRateFormSchema();
    }
    case 'time': {
      return useTimeRateFormSchema();
    }
    default: {
      return useBaseRateFormSchema();
    }
  }
}

/** 基础费率表格列配置 */
export function useBaseRateGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'feeStrategyId',
      title: '策略ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'feeStrategyId' },
    },
    {
      field: 'strategyName',
      title: '策略名称',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'baseRate',
      title: '基础费率',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'maxDailyFee',
      title: '单日最高费用',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'applyScope',
      title: '适用范围',
      minWidth: 100,
      sortable: true,
      slots: { default: 'applyScope' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'expireTime',
      title: '失效时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'createUserName',
      title: '操作人',
      minWidth: 120,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 时段费率表格列配置 */
export function useTimeRateGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'feeStrategyId',
      title: '策略ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'feeStrategyId' },
    },
    {
      field: 'strategyName',
      title: '策略名称',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'peakTime',
      title: '高峰时段',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!Array.isArray(cellValue)) return '';
        return cellValue.map((item) => `${item.start}-${item.end}`).join(', ');
      },
    },
    {
      field: 'peakRate',
      title: '高峰费率',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'offPeakTime',
      title: '平峰时段',
      minWidth: 180,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!Array.isArray(cellValue)) return '';
        return cellValue.map((item) => `${item.start}-${item.end}`).join(', ');
      },
    },
    {
      field: 'offPeakRate',
      title: '平峰费率',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'applyScope',
      title: '适用范围',
      minWidth: 100,
      sortable: true,
      slots: { default: 'applyScope' },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
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
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 区域费率表格列配置 */
export function useAreaRateGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'feeStrategyId',
      title: '策略ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'feeStrategyId' },
    },
    {
      field: 'strategyName',
      title: '策略名称',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'regionName',
      title: '区域名称',
      minWidth: 140,
      sortable: true,
      slots: { default: 'regionName' },
    },
    {
      field: 'regionRate',
      title: '区域费率',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'applyScope',
      title: '适用范围',
      minWidth: 100,
      sortable: true,
      slots: { default: 'applyScope' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'expireTime',
      title: '失效时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createUserName',
      title: '操作人',
      minWidth: 120,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 根据类型获取表格列配置 */
export function useGridColumns(type = 'base') {
  switch (type) {
    case 'area': {
      return useAreaRateGridColumns();
    }
    case 'base': {
      return useBaseRateGridColumns();
    }
    case 'time': {
      return useTimeRateGridColumns();
    }
    default: {
      return useBaseRateGridColumns();
    }
  }
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑费率策略',
  addText: '新增费率策略',
  // 导出Excel相关文本
  excelName: '费率策略列表',
  excelAllName: '费率策略数据.xlsx',
  // 统计总计文本
  total: ' 总计: 策略数量9',
};

/** 基础费率详情字段配置 */
export const baseRateDetailFields = [
  { key: 'feeStrategyId', label: '策略ID' },
  { key: 'strategyName', label: '策略名称' },
  { key: 'baseRate', label: '基础费率' },
  { key: 'maxDailyFee', label: '单日最高费用' },
  { key: 'applyScope', label: '适用范围' },
  {
    key: 'scopeIds',
    label: '适用范围ID列表',
    formatter: (value) => JSON.stringify(value || []),
  },
  { key: 'effectTime', label: '生效时间' },
  { key: 'expireTime', label: '失效时间' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: (value) => getStatusTagType(value),
  },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'createUserName', label: '操作人' },
  { key: 'remark', label: '备注' },
];

/** 时段费率详情字段配置 */
export const timeRateDetailFields = [
  { key: 'feeStrategyId', label: '策略ID' },
  { key: 'strategyName', label: '策略名称' },
  {
    key: 'peakTime',
    label: '高峰时段',
    formatter: (value) => JSON.stringify(value || []),
  },
  { key: 'peakRate', label: '高峰费率' },
  {
    key: 'offPeakTime',
    label: '平峰时段',
    formatter: (value) => JSON.stringify(value || []),
  },
  { key: 'offPeakRate', label: '平峰费率' },
  { key: 'applyScope', label: '适用范围' },
  {
    key: 'scopeIds',
    label: '适用范围ID列表',
    formatter: (value) => JSON.stringify(value || []),
  },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: (value) => getStatusTagType(value),
  },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'remark', label: '备注' },
];

/** 区域费率详情字段配置 */
export const areaRateDetailFields = [
  { key: 'feeStrategyId', label: '策略ID' },
  { key: 'strategyName', label: '策略名称' },
  { key: 'regionName', label: '区域名称' },
  { key: 'regionRate', label: '区域费率' },
  { key: 'applyScope', label: '适用范围' },
  {
    key: 'scopeIds',
    label: '适用范围ID列表',
    formatter: (value) => JSON.stringify(value || []),
  },
  { key: 'effectTime', label: '生效时间' },
  { key: 'expireTime', label: '失效时间' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: (value) => getStatusTagType(value),
  },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'createUserName', label: '操作人' },
  { key: 'remark', label: '备注' },
];

/** 根据费率类型获取详情字段配置 */
export const getRateDetailFields = (rateType = 'base') => {
  switch (rateType) {
    case 'area': {
      return areaRateDetailFields;
    }
    case 'base': {
      return baseRateDetailFields;
    }
    case 'time': {
      return timeRateDetailFields;
    }
    default: {
      return baseRateDetailFields;
    }
  }
};

/** 获取状态标签类型 */
export const getStatusTagType = (status) => {
  if (status === '启用') return 'success';
  if (status === '禁用') return 'danger';
  return 'info';
};

/** 根据费率类型获取统计数据 */
export const getStatsDataByRateType = (rateType = 'base') => {
  // 获取对应费率类型的数据
  const rateData = dataList(rateType);
  const totalCount = rateData.length;
  const enabledCount = rateData.filter((item) => item.status === '启用').length;
  const disabledCount = rateData.filter(
    (item) => item.status === '禁用',
  ).length;

  // 统计适用范围占比
  const applyScopeStats = {};
  rateData.forEach((item) => {
    applyScopeStats[item.applyScope] =
      (applyScopeStats[item.applyScope] || 0) + 1;
  });

  // 统计状态占比
  const statusStats = {
    启用: enabledCount,
    禁用: disabledCount,
  };

  switch (rateType) {
    case 'area': {
      // 区域费率统计
      const regionRates = rateData.map((item) => item.regionRate);
      const regionRateAvg =
        regionRates.length > 0
          ? regionRates.reduce((sum, rate) => sum + rate, 0) /
            regionRates.length
          : 0;

      // 统计区域名称占比
      const regionNameStats = {};
      rateData.forEach((item) => {
        regionNameStats[item.regionName] = (regionNameStats[item.regionName] || 0) + 1;
      });

      return {
        cards: [
          {
            title: '总策略数',
            value: totalCount,
            desc: `共${totalCount}个区域费率策略`,
            color: '#13ce66',
          },
          {
            title: '启用策略数',
            value: enabledCount,
            desc: `${Math.round((enabledCount / totalCount) * 100)}%的策略已启用`,
            color: '#4ECDC4',
          },
          {
            title: '区域费率均值',
            value: regionRateAvg.toFixed(2),
            desc: '所有策略的区域费率平均值',
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '区域名称占比',
            type: 'pie',
            data: Object.entries(regionNameStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '状态占比',
            type: 'pie',
            data: Object.entries(statusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同区域费率对比',
            type: 'bar',
            xAxis: rateData.map((item) => item.regionName),
            series: rateData.map((item) => item.regionRate),
          },
        ],
      };
    }
    case 'base': {
      // 基础费率统计
      const baseRates = rateData.map((item) => item.baseRate);
      const baseRateAvg =
        baseRates.length > 0
          ? baseRates.reduce((sum, rate) => sum + rate, 0) / baseRates.length
          : 0;

      return {
        cards: [
          {
            title: '总策略数',
            value: totalCount,
            desc: `共${totalCount}个基础费率策略`,
            color: '#13ce66',
          },
          {
            title: '启用策略数',
            value: enabledCount,
            desc: `${Math.round((enabledCount / totalCount) * 100)}%的策略已启用`,
            color: '#4ECDC4',
          },
          {
            title: '禁用策略数',
            value: disabledCount,
            desc: `${Math.round((disabledCount / totalCount) * 100)}%的策略已禁用`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '适用范围占比',
            type: 'pie',
            data: Object.entries(applyScopeStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '状态占比',
            type: 'pie',
            data: Object.entries(statusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同策略基础费率对比',
            type: 'line',
            xAxis: rateData.map((item) => item.strategyName),
            series: rateData.map((item) => item.baseRate),
          },
        ],
      };
    }
    case 'time': {
      // 时段费率统计
      const peakRates = rateData.map((item) => item.peakRate);
      const offPeakRates = rateData.map((item) => item.offPeakRate);
      const peakRateAvg =
        peakRates.length > 0
          ? peakRates.reduce((sum, rate) => sum + rate, 0) / peakRates.length
          : 0;
      const offPeakRateAvg =
        offPeakRates.length > 0
          ? offPeakRates.reduce((sum, rate) => sum + rate, 0) /
            offPeakRates.length
          : 0;

      return {
        cards: [
          {
            title: '启用策略数',
            value: enabledCount,
            desc: `${Math.round((enabledCount / totalCount) * 100)}%的策略已启用`,
            color: '#13ce66',
          },
          {
            title: '高峰费率均值',
            value: peakRateAvg.toFixed(2),
            desc: '所有策略的高峰费率平均值',
            color: '#4ECDC4',
          },
          {
            title: '平峰费率均值',
            value: offPeakRateAvg.toFixed(2),
            desc: '所有策略的平峰费率平均值',
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '适用范围占比',
            type: 'pie',
            data: Object.entries(applyScopeStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '状态占比',
            type: 'pie',
            data: Object.entries(statusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '不同策略高峰费率对比',
            type: 'bar',
            xAxis: rateData.map((item) => item.strategyName),
            series: rateData.map((item) => item.peakRate),
          },
        ],
      };
    }
    default: {
      return {
        cards: [],
        charts: [],
      };
    }
  }
};
