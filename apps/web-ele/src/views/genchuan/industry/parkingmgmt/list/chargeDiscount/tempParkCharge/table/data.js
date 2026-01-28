/** 收费规则管理表格初始数据 */
export const chargeRuleData = () => {
  return [
    {
      feeTempId: 'FTR001',
      ruleName: '工作日白天收费规则',
      strategyName: '标准费率策略',
      freeParkingTime: '30',
      maxDailyFee: '50',
      applyLotNames: '芗城区XX社区公共停车场,龙文区碧湖公园停车场',
      status: '1',
      createTime: '2025-01-10 09:20:30',
      updateTime: '2025-01-10 09:20:30',
      operator: '张三'
    },
    {
      feeTempId: 'FTR002',
      ruleName: '工作日夜间收费规则',
      strategyName: '夜间优惠策略',
      freeParkingTime: '20',
      maxDailyFee: '30',
      applyLotNames: '龙海区石码镇便民停车场',
      status: '1',
      createTime: '2025-01-11 14:15:20',
      updateTime: '2025-01-11 14:15:20',
      operator: '李四'
    },
    {
      feeTempId: 'FTR003',
      ruleName: '周末收费规则',
      strategyName: '周末优惠策略',
      freeParkingTime: '40',
      maxDailyFee: '40',
      applyLotNames: '芗城区江滨路生态停车场',
      status: '1',
      createTime: '2025-01-12 10:05:10',
      updateTime: '2025-01-12 10:05:10',
      operator: '王五'
    },
    {
      feeTempId: 'FTR004',
      ruleName: '节假日收费规则',
      strategyName: '节假日免费策略',
      freeParkingTime: '60',
      maxDailyFee: '20',
      applyLotNames: '龙文区万达商圈停车场',
      status: '1',
      createTime: '2025-01-13 08:30:45',
      updateTime: '2025-01-13 08:30:45',
      operator: '赵六'
    },
    {
      feeTempId: 'FTR005',
      ruleName: '长时停车收费规则',
      strategyName: '长时优惠策略',
      freeParkingTime: '15',
      maxDailyFee: '80',
      applyLotNames: '长泰区武安镇公共停车场',
      status: '0',
      createTime: '2025-01-14 16:40:15',
      updateTime: '2025-01-14 16:40:15',
      operator: '孙七'
    },
    {
      feeTempId: 'FTR006',
      ruleName: '短时停车收费规则',
      strategyName: '短时优惠策略',
      freeParkingTime: '45',
      maxDailyFee: '25',
      applyLotNames: '漳浦县绥安镇便民停车场',
      status: '1',
      createTime: '2025-01-15 11:10:30',
      updateTime: '2025-01-15 11:10:30',
      operator: '周八'
    },
    {
      feeTempId: 'FTR007',
      ruleName: 'VIP用户收费规则',
      strategyName: 'VIP专属策略',
      freeParkingTime: '60',
      maxDailyFee: '10',
      applyLotNames: '芗城区巷口街道停车场',
      status: '1',
      createTime: '2025-01-16 13:25:40',
      updateTime: '2025-01-16 13:25:40',
      operator: '吴九'
    },
    {
      feeTempId: 'FTR008',
      ruleName: '新能源车收费规则',
      strategyName: '新能源车优惠策略',
      freeParkingTime: '120',
      maxDailyFee: '20',
      applyLotNames: '龙文区蓝田街道停车场',
      status: '1',
      createTime: '2025-01-17 09:50:25',
      updateTime: '2025-01-17 09:50:25',
      operator: '郑十'
    },
    {
      feeTempId: 'FTR009',
      ruleName: '大型车辆收费规则',
      strategyName: '大型车辆专用策略',
      freeParkingTime: '10',
      maxDailyFee: '100',
      applyLotNames: '龙文区步文街道停车场',
      status: '0',
      createTime: '2025-01-18 15:15:10',
      updateTime: '2025-01-18 15:15:10',
      operator: '张三'
    },
    {
      feeTempId: 'FTR010',
      ruleName: '临时访客收费规则',
      strategyName: '访客临时策略',
      freeParkingTime: '25',
      maxDailyFee: '45',
      applyLotNames: '芗城区东铺头街道停车场',
      status: '1',
      createTime: '2025-01-19 10:30:50',
      updateTime: '2025-01-19 10:30:50',
      operator: '李四'
    },
    {
      feeTempId: 'FTR011',
      ruleName: '商业区域收费规则',
      strategyName: '商业区域高费率策略',
      freeParkingTime: '15',
      maxDailyFee: '80',
      applyLotNames: '龙文区万达商圈停车场',
      status: '1',
      createTime: '2025-01-20 14:20:15',
      updateTime: '2025-01-20 14:20:15',
      operator: '王五'
    },
    {
      feeTempId: 'FTR012',
      ruleName: '居民区收费规则',
      strategyName: '居民区优惠策略',
      freeParkingTime: '60',
      maxDailyFee: '20',
      applyLotNames: '芗城区XX社区公共停车场',
      status: '1',
      createTime: '2025-01-21 09:40:30',
      updateTime: '2025-01-21 09:40:30',
      operator: '赵六'
    }
  ];
};

/** 费用核算管理表格初始数据 */
export const feeCalculationData = () => {
  return [
    {
      orderNo: 'ORD20250101001',
      carNumber: '闽A12345',
      entryTime: '2025-01-01 08:00:00',
      exitTime: '2025-01-01 10:30:00',
      parkingDuration: '150',
      strategyName: '标准费率策略',
      originalAmount: '30',
      discountAmount: '5',
      payAmount: '25',
      calculateResult: '正常计费'
    },
    {
      orderNo: 'ORD20250101002',
      carNumber: '闽B67890',
      entryTime: '2025-01-01 09:15:00',
      exitTime: '2025-01-01 11:45:00',
      parkingDuration: '150',
      strategyName: '夜间优惠策略',
      originalAmount: '25',
      discountAmount: '3',
      payAmount: '22',
      calculateResult: '正常计费'
    },
    {
      orderNo: 'ORD20250101003',
      carNumber: '闽C24680',
      entryTime: '2025-01-01 10:30:00',
      exitTime: '2025-01-01 13:00:00',
      parkingDuration: '150',
      strategyName: '周末优惠策略',
      originalAmount: '20',
      discountAmount: '2',
      payAmount: '18',
      calculateResult: '正常计费'
    },
    {
      orderNo: 'ORD20250101004',
      carNumber: '闽D13579',
      entryTime: '2025-01-01 11:45:00',
      exitTime: '2025-01-01 14:15:00',
      parkingDuration: '150',
      strategyName: '节假日免费策略',
      originalAmount: '15',
      discountAmount: '15',
      payAmount: '0',
      calculateResult: '免费'
    },
    {
      orderNo: 'ORD20250101005',
      carNumber: '闽E36925',
      entryTime: '2025-01-01 13:00:00',
      exitTime: '2025-01-01 15:30:00',
      parkingDuration: '150',
      strategyName: '长时优惠策略',
      originalAmount: '40',
      discountAmount: '10',
      payAmount: '30',
      calculateResult: '正常计费'
    },
    {
      orderNo: 'ORD20250101006',
      carNumber: '闽F58321',
      entryTime: '2025-01-01 14:15:00',
      exitTime: '2025-01-01 16:45:00',
      parkingDuration: '150',
      strategyName: '短时优惠策略',
      originalAmount: '15',
      discountAmount: '2',
      payAmount: '13',
      calculateResult: '正常计费'
    },
    {
      orderNo: 'ORD20250101007',
      carNumber: '闽G75319',
      entryTime: '2025-01-01 15:30:00',
      exitTime: '2025-01-01 18:00:00',
      parkingDuration: '150',
      strategyName: 'VIP专属策略',
      originalAmount: '10',
      discountAmount: '8',
      payAmount: '2',
      calculateResult: 'VIP优惠'
    },
    {
      orderNo: 'ORD20250101008',
      carNumber: '闽H96385',
      entryTime: '2025-01-01 16:45:00',
      exitTime: '2025-01-01 19:15:00',
      parkingDuration: '150',
      strategyName: '新能源车优惠策略',
      originalAmount: '20',
      discountAmount: '15',
      payAmount: '5',
      calculateResult: '新能源车优惠'
    },
    {
      orderNo: 'ORD20250101009',
      carNumber: '闽J25846',
      entryTime: '2025-01-01 18:00:00',
      exitTime: '2025-01-01 20:30:00',
      parkingDuration: '150',
      strategyName: '大型车辆专用策略',
      originalAmount: '50',
      discountAmount: '5',
      payAmount: '45',
      calculateResult: '正常计费'
    },
    {
      orderNo: 'ORD20250101010',
      carNumber: '闽K46825',
      entryTime: '2025-01-01 19:15:00',
      exitTime: '2025-01-01 21:45:00',
      parkingDuration: '150',
      strategyName: '商业区域高费率策略',
      originalAmount: '40',
      discountAmount: '5',
      payAmount: '35',
      calculateResult: '正常计费'
    },
    {
      orderNo: 'ORD20250101011',
      carNumber: '闽L75328',
      entryTime: '2025-01-01 20:30:00',
      exitTime: '2025-01-01 23:00:00',
      parkingDuration: '150',
      strategyName: '居民区优惠策略',
      originalAmount: '15',
      discountAmount: '5',
      payAmount: '10',
      calculateResult: '居民区优惠'
    },
    {
      orderNo: 'ORD20250101012',
      carNumber: '闽M85236',
      entryTime: '2025-01-01 21:45:00',
      exitTime: '2025-01-02 00:15:00',
      parkingDuration: '150',
      strategyName: '夜间优惠策略',
      originalAmount: '25',
      discountAmount: '10',
      payAmount: '15',
      calculateResult: '夜间优惠'
    }
  ];
};

/** 优惠抵扣管理表格初始数据 */
export const discountManagementData = () => {
  return [
    {
      orderNo: 'ORD20250101001',
      couponName: '新人优惠券',
      couponType: '满减券',
      faceValue: '10',
      orderAmount: '30',
      discountAmount: '10',
      afterDiscountAmount: '20',
      couponStatus: '1',
      discountTime: '2026-01-01 10:30:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101002',
      couponName: '周末优惠券',
      couponType: '折扣券',
      faceValue: '8',
      orderAmount: '25',
      discountAmount: '5',
      afterDiscountAmount: '20',
      couponStatus: '1',
      discountTime: '2026-01-02 11:45:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101003',
      couponName: '节假日优惠券',
      couponType: '免费券',
      faceValue: '20',
      orderAmount: '20',
      discountAmount: '20',
      afterDiscountAmount: '0',
      couponStatus: '1',
      discountTime: '2026-01-03 13:00:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101004',
      couponName: '新能源车优惠券',
      couponType: '新能源减免',
      faceValue: '15',
      orderAmount: '20',
      discountAmount: '15',
      afterDiscountAmount: '5',
      couponStatus: '1',
      discountTime: '2026-01-04 14:15:00',
      ruleDesc: '自动识别新能源车牌，24 小时内享受一次 2 小时免费优惠，路内 / 路外、不同车场独立计算'
    },
    {
      orderNo: 'ORD20250101005',
      couponName: 'VIP专享优惠券',
      couponType: 'VIP专属',
      faceValue: '20',
      orderAmount: '30',
      discountAmount: '15',
      afterDiscountAmount: '15',
      couponStatus: '1',
      discountTime: '2026-01-05 15:30:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101006',
      couponName: '限时优惠券',
      couponType: '满减券',
      faceValue: '5',
      orderAmount: '15',
      discountAmount: '5',
      afterDiscountAmount: '10',
      couponStatus: '0',
      discountTime: '2026-01-06 16:45:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101007',
      couponName: '会员日优惠券',
      couponType: '折扣券',
      faceValue: '7',
      orderAmount: '25',
      discountAmount: '8',
      afterDiscountAmount: '17',
      couponStatus: '1',
      discountTime: '2026-01-07 18:00:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101008',
      couponName: '推荐优惠券',
      couponType: '满减券',
      faceValue: '15',
      orderAmount: '40',
      discountAmount: '15',
      afterDiscountAmount: '25',
      couponStatus: '2',
      discountTime: '2026-01-08 19:15:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101009',
      couponName: '首单优惠券',
      couponType: '首单立减',
      faceValue: '20',
      orderAmount: '35',
      discountAmount: '20',
      afterDiscountAmount: '15',
      couponStatus: '1',
      discountTime: '2026-01-09 20:30:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101010',
      couponName: '生日优惠券',
      couponType: '生日专享',
      faceValue: '25',
      orderAmount: '45',
      discountAmount: '25',
      afterDiscountAmount: '20',
      couponStatus: '1',
      discountTime: '2026-01-10 21:45:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101011',
      couponName: '季度优惠券',
      couponType: '满减券',
      faceValue: '12',
      orderAmount: '30',
      discountAmount: '12',
      afterDiscountAmount: '18',
      couponStatus: '2',
      discountTime: '2026-01-11 23:00:00',
      ruleDesc: ''
    },
    {
      orderNo: 'ORD20250101012',
      couponName: '年度优惠券',
      couponType: '折扣券',
      faceValue: '6',
      orderAmount: '25',
      discountAmount: '6',
      afterDiscountAmount: '19',
      couponStatus: '1',
      discountTime: '2026-01-12 00:15:00',
      ruleDesc: ''
    }
  ];
};

/** 表格初始数据 - 根据标签类型返回对应数据 */
export const dataList = (tabType) => {
  switch (tabType) {
    case 'chargeRule':
      return chargeRuleData();
    case 'feeCalculation':
      return feeCalculationData();
    case 'discountManagement':
      return discountManagementData();
    default:
      return chargeRuleData();
  }
};

/** 收费规则管理表单配置 */
export function useChargeRuleFormSchema() {
  return [
    {
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'strategyName',
      label: '关联费率策略',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联费率策略',
        options: [
          { label: '标准费率策略', value: '标准费率策略' },
          { label: '夜间优惠策略', value: '夜间优惠策略' },
          { label: '周末优惠策略', value: '周末优惠策略' },
          { label: '节假日免费策略', value: '节假日免费策略' },
          { label: '长时优惠策略', value: '长时优惠策略' },
          { label: '短时优惠策略', value: '短时优惠策略' },
          { label: 'VIP专属策略', value: 'VIP专属策略' },
          { label: '新能源车优惠策略', value: '新能源车优惠策略' },
          { label: '大型车辆专用策略', value: '大型车辆专用策略' },
          { label: '商业区域高费率策略', value: '商业区域高费率策略' },
          { label: '居民区优惠策略', value: '居民区优惠策略' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'freeParkingTime',
      label: '免费停放时长',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入免费停放时长（分钟）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'maxDailyFee',
      label: '单日最高费用',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入单日最高费用（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'applyLotNames',
      label: '适用车场',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用车场',
        multiple: true,
        options: [
          { label: '芗城区XX社区公共停车场', value: '芗城区XX社区公共停车场' },
          { label: '龙文区碧湖公园停车场', value: '龙文区碧湖公园停车场' },
          { label: '龙海区石码镇便民停车场', value: '龙海区石码镇便民停车场' },
          { label: '芗城区江滨路生态停车场', value: '芗城区江滨路生态停车场' },
          { label: '龙文区万达商圈停车场', value: '龙文区万达商圈停车场' },
          { label: '长泰区武安镇公共停车场', value: '长泰区武安镇公共停车场' },
          { label: '漳浦县绥安镇便民停车场', value: '漳浦县绥安镇便民停车场' },
          { label: '芗城区巷口街道停车场', value: '芗城区巷口街道停车场' },
          { label: '龙文区蓝田街道停车场', value: '龙文区蓝田街道停车场' },
          { label: '龙文区步文街道停车场', value: '龙文区步文街道停车场' },
          { label: '芗城区东铺头街道停车场', value: '芗城区东铺头街道停车场' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' }
        ]
      },
      rules: 'required'
    }
  ];
}

/** 费用核算管理表单配置 */
export function useFeeCalculationFormSchema() {
  return [
    {
      fieldName: 'orderNo',
      label: '订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单号'
      },
      rules: 'required'
    },
    {
      fieldName: 'carNumber',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌'
      },
      rules: 'required'
    },
    {
      fieldName: 'entryTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'exitTime',
      label: '离场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择离场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'parkingDuration',
      label: '停车时长',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入停车时长（分钟）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'strategyName',
      label: '费率策略',
      component: 'Select',
      componentProps: {
        placeholder: '请选择费率策略',
        options: [
          { label: '标准费率策略', value: '标准费率策略' },
          { label: '夜间优惠策略', value: '夜间优惠策略' },
          { label: '周末优惠策略', value: '周末优惠策略' },
          { label: '节假日免费策略', value: '节假日免费策略' },
          { label: '长时优惠策略', value: '长时优惠策略' },
          { label: '短时优惠策略', value: '短时优惠策略' },
          { label: 'VIP专属策略', value: 'VIP专属策略' },
          { label: '新能源车优惠策略', value: '新能源车优惠策略' },
          { label: '大型车辆专用策略', value: '大型车辆专用策略' },
          { label: '商业区域高费率策略', value: '商业区域高费率策略' },
          { label: '居民区优惠策略', value: '居民区优惠策略' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'originalAmount',
      label: '原始费用',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入原始费用（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'discountAmount',
      label: '优惠金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入优惠金额（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'payAmount',
      label: '实付金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入实付金额（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'calculateResult',
      label: '核算结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择核算结果',
        options: [
          { label: '正常计费', value: '正常计费' },
          { label: '免费', value: '免费' },
          { label: 'VIP优惠', value: 'VIP优惠' },
          { label: '新能源车优惠', value: '新能源车优惠' },
          { label: '夜间优惠', value: '夜间优惠' },
          { label: '居民区优惠', value: '居民区优惠' }
        ]
      },
      rules: 'required'
    }
  ];
}

/** 优惠抵扣管理表单配置 */
export function useDiscountManagementFormSchema() {
  return [
    {
      fieldName: 'orderNo',
      label: '订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单号'
      },
      rules: 'required'
    },
    {
      fieldName: 'couponName',
      label: '可用优惠券',
      component: 'Select',
      componentProps: {
        placeholder: '请选择可用优惠券',
        options: [
          { label: '新人优惠券', value: '新人优惠券' },
          { label: '周末优惠券', value: '周末优惠券' },
          { label: '节假日优惠券', value: '节假日优惠券' },
          { label: '新能源车优惠券', value: '新能源车优惠券' },
          { label: 'VIP专享优惠券', value: 'VIP专享优惠券' },
          { label: '限时优惠券', value: '限时优惠券' },
          { label: '会员日优惠券', value: '会员日优惠券' },
          { label: '推荐优惠券', value: '推荐优惠券' },
          { label: '首单优惠券', value: '首单优惠券' },
          { label: '生日优惠券', value: '生日优惠券' },
          { label: '季度优惠券', value: '季度优惠券' },
          { label: '年度优惠券', value: '年度优惠券' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'couponType',
      label: '优惠券类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择优惠券类型',
        options: [
          { label: '满减券', value: '满减券' },
          { label: '折扣券', value: '折扣券' },
          { label: '免费券', value: '免费券' },
          { label: '新能源减免', value: '新能源减免' },
          { label: 'VIP专属', value: 'VIP专属' },
          { label: '首单立减', value: '首单立减' },
          { label: '生日专享', value: '生日专享' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'faceValue',
      label: '面值',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入面值（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'orderAmount',
      label: '订单金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入订单金额（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'discountAmount',
      label: '抵扣金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入抵扣金额（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'afterDiscountAmount',
      label: '抵扣后金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入抵扣后金额（元）',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'couponStatus',
      label: '优惠券状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择优惠券状态',
        options: [
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' },
          { label: '已过期', value: '2' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'discountTime',
      label: '抵扣时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择抵扣时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'ruleDesc',
      label: '新能源车辆优惠规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入新能源车辆优惠规则',
        type: 'textarea',
        rows: 3
      }
    }
  ];
}

/** 表单配置 - 根据标签类型返回对应配置 */
export function useFormSchema(tabType) {
  switch (tabType) {
    case 'chargeRule':
      return useChargeRuleFormSchema();
    case 'feeCalculation':
      return useFeeCalculationFormSchema();
    case 'discountManagement':
      return useDiscountManagementFormSchema();
    default:
      return useChargeRuleFormSchema();
  }
}

/** 收费规则管理表格列配置 */
export function useChargeRuleGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'feeTempId',
      title: '规则ID',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'ruleName',
      title: '规则名称',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'strategyName',
      title: '关联费率策略',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'freeParkingTime',
      title: '免费停放时长',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `${cellValue || 0}分钟`
    },
    {
      field: 'maxDailyFee',
      title: '单日最高费用',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'applyLotNames',
      title: '适用车场',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' }
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 100,
      sortable: true
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

/** 费用核算管理表格列配置 */
export function useFeeCalculationGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'orderNo',
      title: '订单号',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'carNumber',
      title: '车牌',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'entryTime',
      title: '入场时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'exitTime',
      title: '离场时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'parkingDuration',
      title: '停车时长',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `${cellValue || 0}分钟`
    },
    {
      field: 'strategyName',
      title: '费率策略',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'originalAmount',
      title: '原始费用',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'discountAmount',
      title: '优惠金额',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'payAmount',
      title: '实付金额',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'calculateResult',
      title: '核算结果',
      minWidth: 120,
      sortable: true
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

/** 优惠抵扣管理表格列配置 */
export function useDiscountManagementGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'orderNo',
      title: '订单号',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'couponName',
      title: '可用优惠券',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'couponType',
      title: '优惠券类型',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'faceValue',
      title: '面值',
      minWidth: 100,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'orderAmount',
      title: '订单金额',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'discountAmount',
      title: '抵扣金额',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'afterDiscountAmount',
      title: '抵扣后金额',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue || 0}`
    },
    {
      field: 'couponStatus',
      title: '优惠券状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' }
    },
    {
      field: 'discountTime',
      title: '抵扣时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'ruleDesc',
      title: '新能源车辆优惠规则',
      minWidth: 200,
      sortable: true
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

/** 表格列配置 - 根据标签类型返回对应配置 */
export function useGridColumns(tabType) {
  switch (tabType) {
    case 'chargeRule':
      return useChargeRuleGridColumns();
    case 'feeCalculation':
      return useFeeCalculationGridColumns();
    case 'discountManagement':
      return useDiscountManagementGridColumns();
    default:
      return useChargeRuleGridColumns();
  }
}

/** 收费规则管理详情字段配置 */
export function useChargeRuleDetailFields() {
  return [
    { label: '规则ID', field: 'feeTempId' },
    { label: '规则名称', field: 'ruleName' },
    { label: '关联费率策略', field: 'strategyName' },
    { label: '免费停放时长', field: 'freeParkingTime', formatter: (value) => `${value}分钟` },
    { label: '单日最高费用', field: 'maxDailyFee', formatter: (value) => `¥${value}` },
    { label: '适用车场', field: 'applyLotNames' },
    { label: '状态', field: 'status', formatter: (value) => value === '1' ? '启用' : '禁用' },
    { label: '创建时间', field: 'createTime' },
    { label: '更新时间', field: 'updateTime' },
    { label: '操作人', field: 'operator' }
  ];
}

/** 费用核算管理详情字段配置 */
export function useFeeCalculationDetailFields() {
  return [
    { label: '订单号', field: 'orderNo' },
    { label: '车牌', field: 'carNumber' },
    { label: '入场时间', field: 'entryTime' },
    { label: '离场时间', field: 'exitTime' },
    { label: '停车时长', field: 'parkingDuration', formatter: (value) => `${value}分钟` },
    { label: '费率策略', field: 'strategyName' },
    { label: '原始费用', field: 'originalAmount', formatter: (value) => `¥${value}` },
    { label: '优惠金额', field: 'discountAmount', formatter: (value) => `¥${value}` },
    { label: '实付金额', field: 'payAmount', formatter: (value) => `¥${value}` },
    { label: '核算结果', field: 'calculateResult' }
  ];
}

/** 优惠抵扣管理详情字段配置 */
export function useDiscountManagementDetailFields() {
  return [
    { label: '订单号', field: 'orderNo' },
    { label: '可用优惠券', field: 'couponName' },
    { label: '优惠券类型', field: 'couponType' },
    { label: '面值', field: 'faceValue', formatter: (value) => `¥${value}` },
    { label: '订单金额', field: 'orderAmount', formatter: (value) => `¥${value}` },
    { label: '抵扣金额', field: 'discountAmount', formatter: (value) => `¥${value}` },
    { label: '抵扣后金额', field: 'afterDiscountAmount', formatter: (value) => `¥${value}` },
    { label: '优惠券状态', field: 'couponStatus', formatter: (value) => {
      switch (value) {
        case '1': return '启用';
        case '0': return '禁用';
        case '2': return '已过期';
        default: return '未知';
      }
    }},
    { label: '抵扣时间', field: 'discountTime' },
    { label: '新能源车辆优惠规则', field: 'ruleDesc' }
  ];
}

/** 详情字段配置 - 根据标签类型返回对应配置 */
export function useDetailFields(tabType) {
  switch (tabType) {
    case 'chargeRule':
      return useChargeRuleDetailFields();
    case 'feeCalculation':
      return useFeeCalculationDetailFields();
    case 'discountManagement':
      return useDiscountManagementDetailFields();
    default:
      return useChargeRuleDetailFields();
  }
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑',
  addText: '新增',
  // 导出Excel相关文本
  excelName: '列表',
  excelAllName: '数据.xlsx',
};

/** 根据标签类型获取统计数据 */
export const getStatsDataByTabType = (tabType = 'chargeRule') => {
  // 获取对应标签类型的数据
  const tabData = dataList(tabType);
  
  switch (tabType) {
    case 'chargeRule': {
      // 收费规则管理统计
      const totalCount = tabData.length;
      const enabledCount = tabData.filter(item => item.status === '1').length;
      
      // 计算适用车场数
      const allLotNames = tabData.map(item => item.applyLotNames).join(',').split(',');
      const uniqueLotNames = [...new Set(allLotNames)].filter(name => name.trim());
      const lotCount = uniqueLotNames.length;
      
      // 统计适用车场类型占比（简化处理，按车场数量分组）
      const lotTypeStats = {};
      tabData.forEach(item => {
        const lotCount = item.applyLotNames.split(',').length;
        const lotType = lotCount === 1 ? '单一车场' : lotCount <= 3 ? '少量车场' : '多个车场';
        lotTypeStats[lotType] = (lotTypeStats[lotType] || 0) + 1;
      });
      
      // 统计状态占比
      const statusStats = {
        启用: enabledCount,
        禁用: totalCount - enabledCount
      };
      
      // 不同规则免费时长对比
      const freeParkingTimes = tabData.map(item => ({
        name: item.ruleName,
        value: parseInt(item.freeParkingTime) || 0
      })).sort((a, b) => b.value - a.value);
      
      return {
        cards: [
          {
            title: '总规则数',
            value: totalCount,
            desc: `共${totalCount}个收费规则`,
            color: '#13ce66',
          },
          {
            title: '启用规则数',
            value: enabledCount,
            desc: `${Math.round((enabledCount / totalCount) * 100)}%的规则已启用`,
            color: '#4ECDC4',
          },
          {
            title: '适用车场数',
            value: lotCount,
            desc: `共${lotCount}个不同的适用车场`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '规则适用车场类型占比',
            type: 'pie',
            data: Object.entries(lotTypeStats).map(([name, value]) => ({
              name,
              value: Math.round((value / totalCount) * 100)
            })),
          },
          {
            title: '状态占比',
            type: 'pie',
            data: Object.entries(statusStats).map(([name, value]) => ({
              name,
              value: Math.round((value / totalCount) * 100)
            })),
          },
          {
            title: '不同规则免费时长对比',
            type: 'bar',
            xAxis: freeParkingTimes.slice(0, 10).map(item => item.name),
            series: freeParkingTimes.slice(0, 10).map(item => item.value),
          },
        ],
      };
    }
    case 'feeCalculation': {
      // 费用核算管理统计
      const totalCount = tabData.length;
      const totalDiscountAmount = tabData.reduce((sum, item) => sum + parseFloat(item.discountAmount) || 0, 0);
      const totalPayAmount = tabData.reduce((sum, item) => sum + parseFloat(item.payAmount) || 0, 0);
      
      // 统计核算结果占比
      const calculateResultStats = {};
      tabData.forEach(item => {
        calculateResultStats[item.calculateResult] = (calculateResultStats[item.calculateResult] || 0) + 1;
      });
      
      // 统计费率策略占比
      const strategyStats = {};
      tabData.forEach(item => {
        strategyStats[item.strategyName] = (strategyStats[item.strategyName] || 0) + 1;
      });
      
      // 不同费率策略核算订单数对比
      const strategyOrderCounts = Object.entries(strategyStats).map(([name, count]) => ({
        name,
        count
      })).sort((a, b) => b.count - a.count);
      
      return {
        cards: [
          {
            title: '核算订单数',
            value: totalCount,
            desc: `共${totalCount}个核算订单`,
            color: '#13ce66',
          },
          {
            title: '总优惠金额',
            value: totalDiscountAmount.toFixed(2),
            desc: `总优惠金额：¥${totalDiscountAmount.toFixed(2)}`,
            color: '#4ECDC4',
          },
          {
            title: '总核算金额',
            value: totalPayAmount.toFixed(2),
            desc: `总核算金额：¥${totalPayAmount.toFixed(2)}`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '核算结果占比',
            type: 'pie',
            data: Object.entries(calculateResultStats).map(([name, value]) => ({
              name,
              value: Math.round((value / totalCount) * 100)
            })),
          },
          {
            title: '费率策略占比',
            type: 'pie',
            data: Object.entries(strategyStats).map(([name, value]) => ({
              name,
              value: Math.round((value / totalCount) * 100)
            })),
          },
          {
            title: '不同费率策略核算订单数对比',
            type: 'bar',
            xAxis: strategyOrderCounts.slice(0, 10).map(item => item.name),
            series: strategyOrderCounts.slice(0, 10).map(item => item.count),
          },
        ],
      };
    }
    case 'discountManagement': {
      // 优惠抵扣管理统计
      const totalCount = tabData.length;
      const totalDiscountAmount = tabData.reduce((sum, item) => sum + parseFloat(item.discountAmount) || 0, 0);
      
      // 统计不同类型优惠券使用数
      const couponTypeStats = {};
      tabData.forEach(item => {
        couponTypeStats[item.couponType] = (couponTypeStats[item.couponType] || 0) + 1;
      });
      
      // 统计优惠券状态占比
      const couponStatusStats = {};
      tabData.forEach(item => {
        const status = item.couponStatus === '1' ? '启用' : item.couponStatus === '0' ? '禁用' : '已过期';
        couponStatusStats[status] = (couponStatusStats[status] || 0) + 1;
      });
      
      // 优惠抵扣金额随时间变化趋势
      const timeDiscounts = tabData.map(item => ({
        time: item.discountTime.substring(0, 10), // 只取日期部分
        amount: parseFloat(item.discountAmount) || 0
      }));
      
      // 按日期分组并求和
      const timeStats = {};
      timeDiscounts.forEach(item => {
        timeStats[item.time] = (timeStats[item.time] || 0) + item.amount;
      });
      
      // 排序
      const sortedTimeStats = Object.entries(timeStats).sort(([a], [b]) => a.localeCompare(b));
      
      return {
        cards: [
          {
            title: '抵扣订单数',
            value: totalCount,
            desc: `共${totalCount}个抵扣订单`,
            color: '#13ce66',
          },
          {
            title: '优惠总金额',
            value: totalDiscountAmount.toFixed(2),
            desc: `总优惠金额：¥${totalDiscountAmount.toFixed(2)}`,
            color: '#4ECDC4',
          },
          {
            title: '不同类型优惠券使用数',
            value: Object.keys(couponTypeStats).length,
            desc: `共${Object.keys(couponTypeStats).length}种不同类型的优惠券`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '优惠券类型占比',
            type: 'pie',
            data: Object.entries(couponTypeStats).map(([name, value]) => ({
              name,
              value: Math.round((value / totalCount) * 100)
            })),
          },
          {
            title: '优惠券状态占比',
            type: 'pie',
            data: Object.entries(couponStatusStats).map(([name, value]) => ({
              name,
              value: Math.round((value / totalCount) * 100)
            })),
          },
          {
            title: '优惠抵扣金额随时间变化趋势',
            type: 'line',
            xAxis: sortedTimeStats.map(([time]) => time),
            series: sortedTimeStats.map(([, amount]) => parseFloat(amount.toFixed(2))),
          },
        ],
      };
    }
    default:
      return {
        cards: [],
        charts: [],
      };
  }
};
