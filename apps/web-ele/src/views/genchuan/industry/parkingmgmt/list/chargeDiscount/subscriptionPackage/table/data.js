/** 订阅套餐表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      packageId: 'PKG001',
      packageName: '月度基础套餐',
      packageTypeName: '基础套餐',
      originalPrice: '99.00',
      salePrice: '79.00',
      validDays: 30,
      applicableParkingLot: '芗城区XX社区公共停车场',
      bindCarLimit: 2,
      operator: '张三',
      salesCount: 156,
      packageStatusName: '上架',
      createTime: '2025-01-10 09:20:30',
      lastSaleTime: '2025-02-20 14:30:00',
      applicableSpaceType: '小型车',
      extraBenefits: '免费洗车一次',
      configTime: '2025-01-10 10:00:00',
      updater: '张三',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG002',
      packageName: '季度黄金套餐',
      packageTypeName: '黄金套餐',
      originalPrice: '268.00',
      salePrice: '198.00',
      validDays: 90,
      applicableParkingLot: '龙文区碧湖公园停车场',
      bindCarLimit: 3,
      operator: '李四',
      salesCount: 89,
      packageStatusName: '上架',
      createTime: '2025-01-12 14:15:20',
      lastSaleTime: '2025-02-19 16:45:00',
      applicableSpaceType: '小型车,中型车',
      extraBenefits: '免费洗车三次,优先停车位',
      configTime: '2025-01-12 15:00:00',
      updater: '李四',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG003',
      packageName: '年度钻石套餐',
      packageTypeName: '钻石套餐',
      originalPrice: '999.00',
      salePrice: '699.00',
      validDays: 365,
      applicableParkingLot: '龙海区石码镇便民停车场',
      bindCarLimit: 5,
      operator: '王五',
      salesCount: 45,
      packageStatusName: '上架',
      createTime: '2025-01-15 10:05:10',
      lastSaleTime: '2025-02-20 10:20:00',
      applicableSpaceType: '小型车,中型车,大型车',
      extraBenefits: '免费洗车十次,优先停车位,专属充电桩',
      configTime: '2025-01-15 11:00:00',
      updater: '王五',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG004',
      packageName: '周末畅停套餐',
      packageTypeName: '特殊套餐',
      originalPrice: '49.00',
      salePrice: '39.00',
      validDays: 7,
      applicableParkingLot: '龙海区闽齐社区停车场',
      bindCarLimit: 1,
      operator: '赵六',
      salesCount: 234,
      packageStatusName: '上架',
      createTime: '2025-01-18 08:30:45',
      lastSaleTime: '2025-02-20 08:15:00',
      applicableSpaceType: '小型车',
      extraBenefits: '免费洗车一次',
      configTime: '2025-01-18 09:00:00',
      updater: '赵六',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG005',
      packageName: '企业商务套餐',
      packageTypeName: '企业套餐',
      originalPrice: '1999.00',
      salePrice: '1499.00',
      validDays: 365,
      applicableParkingLot: '芗城区江滨路生态停车场',
      bindCarLimit: 20,
      operator: '孙七',
      salesCount: 12,
      packageStatusName: '上架',
      createTime: '2025-01-20 16:40:15',
      lastSaleTime: '2025-02-18 11:30:00',
      applicableSpaceType: '小型车,中型车',
      extraBenefits: '免费洗车二十次,优先停车位,专属充电桩',
      configTime: '2025-01-20 17:00:00',
      updater: '孙七',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG006',
      packageName: '夜间专属套餐',
      packageTypeName: '特殊套餐',
      originalPrice: '69.00',
      salePrice: '49.00',
      validDays: 30,
      applicableParkingLot: '龙文区万达商圈停车场',
      bindCarLimit: 2,
      operator: '周八',
      salesCount: 178,
      packageStatusName: '下架',
      createTime: '2025-01-22 11:10:30',
      lastSaleTime: '2025-02-15 22:00:00',
      applicableSpaceType: '小型车',
      extraBenefits: '免费洗车一次',
      configTime: '2025-01-22 12:00:00',
      updater: '周八',
      benefitStatus: '已失效',
    },
    {
      packageId: 'PKG007',
      packageName: '新手入门套餐',
      packageTypeName: '基础套餐',
      originalPrice: '39.00',
      salePrice: '29.00',
      validDays: 15,
      applicableParkingLot: '长泰区武安镇公共停车场',
      bindCarLimit: 1,
      operator: '吴九',
      salesCount: 345,
      packageStatusName: '上架',
      createTime: '2025-01-25 13:25:40',
      lastSaleTime: '2025-02-20 09:45:00',
      applicableSpaceType: '小型车',
      extraBenefits: '免费洗车一次',
      configTime: '2025-01-25 14:00:00',
      updater: '吴九',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG008',
      packageName: '家庭共享套餐',
      packageTypeName: '黄金套餐',
      originalPrice: '168.00',
      salePrice: '128.00',
      validDays: 90,
      applicableParkingLot: '漳浦县绥安镇便民停车场',
      bindCarLimit: 4,
      operator: '郑十',
      salesCount: 67,
      packageStatusName: '上架',
      createTime: '2025-01-28 09:50:25',
      lastSaleTime: '2025-02-19 15:20:00',
      applicableSpaceType: '小型车,中型车',
      extraBenefits: '免费洗车三次,优先停车位',
      configTime: '2025-01-28 10:30:00',
      updater: '郑十',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG009',
      packageName: '老年优惠套餐',
      packageTypeName: '特殊套餐',
      originalPrice: '59.00',
      salePrice: '39.00',
      validDays: 30,
      applicableParkingLot: '芗城区巷口街道停车场',
      bindCarLimit: 1,
      operator: '张三',
      salesCount: 89,
      packageStatusName: '下架',
      createTime: '2025-02-01 15:15:10',
      lastSaleTime: '2025-02-10 10:30:00',
      applicableSpaceType: '小型车',
      extraBenefits: '免费洗车一次',
      configTime: '2025-02-01 16:00:00',
      updater: '张三',
      benefitStatus: '已失效',
    },
    {
      packageId: 'PKG010',
      packageName: '学生特惠套餐',
      packageTypeName: '基础套餐',
      originalPrice: '49.00',
      salePrice: '29.00',
      validDays: 30,
      applicableParkingLot: '龙文区蓝田街道停车场',
      bindCarLimit: 1,
      operator: '李四',
      salesCount: 234,
      packageStatusName: '上架',
      createTime: '2025-02-05 10:30:50',
      lastSaleTime: '2025-02-20 12:00:00',
      applicableSpaceType: '小型车',
      extraBenefits: '免费洗车一次',
      configTime: '2025-02-05 11:00:00',
      updater: '李四',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG011',
      packageName: '商务差旅套餐',
      packageTypeName: '企业套餐',
      originalPrice: '399.00',
      salePrice: '299.00',
      validDays: 30,
      applicableParkingLot: '龙文区步文街道停车场',
      bindCarLimit: 3,
      operator: '王五',
      salesCount: 56,
      packageStatusName: '上架',
      createTime: '2025-02-08 14:20:15',
      lastSaleTime: '2025-02-20 08:50:00',
      applicableSpaceType: '小型车,中型车',
      extraBenefits: '免费洗车三次,优先停车位',
      configTime: '2025-02-08 15:00:00',
      updater: '王五',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG012',
      packageName: '节假日套餐',
      packageTypeName: '特殊套餐',
      originalPrice: '89.00',
      salePrice: '69.00',
      validDays: 7,
      applicableParkingLot: '芗城区东铺头街道停车场',
      bindCarLimit: 2,
      operator: '赵六',
      salesCount: 123,
      packageStatusName: '上架',
      createTime: '2025-02-10 09:40:30',
      lastSaleTime: '2025-02-19 16:10:00',
      applicableSpaceType: '小型车',
      extraBenefits: '免费洗车一次',
      configTime: '2025-02-10 10:00:00',
      updater: '赵六',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG013',
      packageName: 'VIP尊享套餐',
      packageTypeName: '钻石套餐',
      originalPrice: '2999.00',
      salePrice: '1999.00',
      validDays: 365,
      applicableParkingLot: '全市通用',
      bindCarLimit: 10,
      operator: '孙七',
      salesCount: 8,
      packageStatusName: '上架',
      createTime: '2025-02-12 11:25:00',
      lastSaleTime: '2025-02-20 14:00:00',
      applicableSpaceType: '小型车,中型车,大型车',
      extraBenefits: '免费洗车二十次,优先停车位,专属充电桩,专属客服',
      configTime: '2025-02-12 12:00:00',
      updater: '孙七',
      benefitStatus: '生效中',
    },
    {
      packageId: 'PKG014',
      packageName: '临时体验套餐',
      packageTypeName: '基础套餐',
      originalPrice: '19.00',
      salePrice: '9.00',
      validDays: 3,
      applicableParkingLot: '龙文区万达商圈停车场',
      bindCarLimit: 1,
      operator: '周八',
      salesCount: 567,
      packageStatusName: '下架',
      createTime: '2025-02-15 16:30:45',
      lastSaleTime: '2025-02-18 20:00:00',
      applicableSpaceType: '小型车',
      extraBenefits: '无',
      configTime: '2025-02-15 17:00:00',
      updater: '周八',
      benefitStatus: '已失效',
    },
    {
      packageId: 'PKG015',
      packageName: '团队优惠套餐',
      packageTypeName: '企业套餐',
      originalPrice: '599.00',
      salePrice: '449.00',
      validDays: 90,
      applicableParkingLot: '芗城区江滨路生态停车场',
      bindCarLimit: 8,
      operator: '吴九',
      salesCount: 34,
      packageStatusName: '上架',
      createTime: '2025-02-18 10:15:20',
      lastSaleTime: '2025-02-20 11:30:00',
      applicableSpaceType: '小型车,中型车',
      extraBenefits: '免费洗车五次,优先停车位',
      configTime: '2025-02-18 11:00:00',
      updater: '吴九',
      benefitStatus: '生效中',
    },
  ];
};

/** 洗车卡套餐表格初始数据 - 按指定字段生成 */
export const washCardDataList = () => {
  return [
    {
      packageId: 'WASH001',
      packageName: '基础洗车卡',
      salePrice: '99.00',
      validDays: 30,
      cooperationWashShop: '芗城区洗车王国',
      washCount: 3,
      applicableParkingLot: '芗城区XX社区公共停车场',
      operator: '张三',
      salesCount: 234,
      status: '上架',
      createTime: '2025-01-10 09:20:30',
      lastUseTime: '2025-02-20 14:30:00',
    },
    {
      packageId: 'WASH002',
      packageName: '银卡洗车卡',
      salePrice: '199.00',
      validDays: 60,
      cooperationWashShop: '龙文区洗车之家',
      washCount: 8,
      applicableParkingLot: '龙文区碧湖公园停车场',
      operator: '李四',
      salesCount: 156,
      status: '上架',
      createTime: '2025-01-12 14:15:20',
      lastUseTime: '2025-02-19 16:45:00',
    },
    {
      packageId: 'WASH003',
      packageName: '金卡洗车卡',
      salePrice: '299.00',
      validDays: 90,
      cooperationWashShop: '龙海区洗车专家',
      washCount: 15,
      applicableParkingLot: '龙海区石码镇便民停车场',
      operator: '王五',
      salesCount: 89,
      status: '上架',
      createTime: '2025-01-15 10:05:10',
      lastUseTime: '2025-02-20 10:20:00',
    },
    {
      packageId: 'WASH004',
      packageName: '钻石洗车卡',
      salePrice: '499.00',
      validDays: 180,
      cooperationWashShop: '全市通用洗车网点',
      washCount: 30,
      applicableParkingLot: '全市通用',
      operator: '赵六',
      salesCount: 45,
      status: '上架',
      createTime: '2025-01-18 08:30:45',
      lastUseTime: '2025-02-20 08:15:00',
    },
    {
      packageId: 'WASH005',
      packageName: '商务洗车卡',
      salePrice: '599.00',
      validDays: 365,
      cooperationWashShop: '商务洗车连锁',
      washCount: 50,
      applicableParkingLot: '芗城区江滨路生态停车场',
      operator: '孙七',
      salesCount: 23,
      status: '上架',
      createTime: '2025-01-20 16:40:15',
      lastUseTime: '2025-02-18 11:30:00',
    },
    {
      packageId: 'WASH006',
      packageName: '家庭洗车卡',
      salePrice: '399.00',
      validDays: 120,
      cooperationWashShop: '家庭洗车服务中心',
      washCount: 20,
      applicableParkingLot: '龙文区万达商圈停车场',
      operator: '周八',
      salesCount: 123,
      status: '下架',
      createTime: '2025-01-22 11:10:30',
      lastUseTime: '2025-02-15 22:00:00',
    },
    {
      packageId: 'WASH007',
      packageName: '学生洗车卡',
      salePrice: '69.00',
      validDays: 30,
      cooperationWashShop: '校园洗车点',
      washCount: 2,
      applicableParkingLot: '龙文区蓝田街道停车场',
      operator: '吴九',
      salesCount: 345,
      status: '上架',
      createTime: '2025-01-25 13:25:40',
      lastUseTime: '2025-02-20 09:45:00',
    },
    {
      packageId: 'WASH008',
      packageName: '周末洗车卡',
      salePrice: '129.00',
      validDays: 60,
      cooperationWashShop: '周末洗车特惠点',
      washCount: 6,
      applicableParkingLot: '芗城区东铺头街道停车场',
      operator: '郑十',
      salesCount: 178,
      status: '上架',
      createTime: '2025-01-28 09:50:25',
      lastUseTime: '2025-02-19 15:20:00',
    },
    {
      packageId: 'WASH009',
      packageName: '季度洗车卡',
      salePrice: '269.00',
      validDays: 90,
      cooperationWashShop: '季度洗车服务',
      washCount: 12,
      applicableParkingLot: '长泰区武安镇公共停车场',
      operator: '张三',
      salesCount: 98,
      status: '下架',
      createTime: '2025-02-01 15:15:10',
      lastUseTime: '2025-02-10 10:30:00',
    },
    {
      packageId: 'WASH010',
      packageName: '年度洗车卡',
      salePrice: '899.00',
      validDays: 365,
      cooperationWashShop: '年度洗车连锁',
      washCount: 60,
      applicableParkingLot: '全市通用',
      operator: '李四',
      salesCount: 56,
      status: '上架',
      createTime: '2025-02-05 10:30:50',
      lastUseTime: '2025-02-20 12:00:00',
    },
    {
      packageId: 'WASH011',
      packageName: '豪华洗车卡',
      salePrice: '599.00',
      validDays: 180,
      cooperationWashShop: '豪华洗车会所',
      washCount: 25,
      applicableParkingLot: '龙文区步文街道停车场',
      operator: '王五',
      salesCount: 34,
      status: '上架',
      createTime: '2025-02-08 14:20:15',
      lastUseTime: '2025-02-20 08:50:00',
    },
    {
      packageId: 'WASH012',
      packageName: '经济洗车卡',
      salePrice: '49.00',
      validDays: 15,
      cooperationWashShop: '经济洗车点',
      washCount: 1,
      applicableParkingLot: '漳浦县绥安镇便民停车场',
      operator: '赵六',
      salesCount: 456,
      status: '上架',
      createTime: '2025-02-10 09:40:30',
      lastUseTime: '2025-02-19 16:10:00',
    },
    {
      packageId: 'WASH013',
      packageName: '企业洗车卡',
      salePrice: '1299.00',
      validDays: 365,
      cooperationWashShop: '企业洗车服务',
      washCount: 100,
      applicableParkingLot: '芗城区江滨路生态停车场',
      operator: '孙七',
      salesCount: 12,
      status: '上架',
      createTime: '2025-02-12 11:25:00',
      lastUseTime: '2025-02-20 14:00:00',
    },
    {
      packageId: 'WASH014',
      packageName: 'VIP洗车卡',
      salePrice: '1999.00',
      validDays: 365,
      cooperationWashShop: 'VIP洗车俱乐部',
      washCount: 150,
      applicableParkingLot: '全市通用',
      operator: '周八',
      salesCount: 8,
      status: '上架',
      createTime: '2025-02-15 16:30:45',
      lastUseTime: '2025-02-18 20:00:00',
    },
    {
      packageId: 'WASH015',
      packageName: '体验洗车卡',
      salePrice: '19.00',
      validDays: 7,
      cooperationWashShop: '体验洗车点',
      washCount: 1,
      applicableParkingLot: '龙文区万达商圈停车场',
      operator: '吴九',
      salesCount: 567,
      status: '下架',
      createTime: '2025-02-18 10:15:20',
      lastUseTime: '2025-02-20 11:30:00',
    },
  ];
};

/** 订阅套餐表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'packageId',
      label: '套餐ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'packageName',
      label: '套餐名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'packageTypeName',
      label: '套餐类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择套餐类型',
        options: [
          { label: '基础套餐', value: '基础套餐' },
          { label: '黄金套餐', value: '黄金套餐' },
          { label: '钻石套餐', value: '钻石套餐' },
          { label: '特殊套餐', value: '特殊套餐' },
          { label: '企业套餐', value: '企业套餐' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'originalPrice',
      label: '原价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入原价',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'salePrice',
      label: '售价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售价',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'validDays',
      label: '有效天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入有效天数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'applicableParkingLot',
      label: '适用车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用车场',
      },
      rules: 'required',
    },
    {
      fieldName: 'bindCarLimit',
      label: '可绑定车牌数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入可绑定车牌数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'operator',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人',
      },
      rules: 'required',
    },
    {
      fieldName: 'salesCount',
      label: '销量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入销量',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'packageStatusName',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '上架', value: '上架' },
          { label: '下架', value: '下架' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'lastSaleTime',
      label: '最近销售时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择最近销售时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'applicableSpaceType',
      label: '适用车位类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用车位类型',
      },
      rules: 'required',
    },
    {
      fieldName: 'extraBenefits',
      label: '额外权益',
      component: 'Input',
      componentProps: {
        placeholder: '请输入额外权益',
      },
      rules: 'required',
    },
    {
      fieldName: 'configTime',
      label: '配置时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择配置时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'updater',
      label: '更新人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入更新人',
      },
      rules: 'required',
    },
    {
      fieldName: 'benefitStatus',
      label: '权益生效状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择权益生效状态',
        options: [
          { label: '生效中', value: '生效中' },
          { label: '已失效', value: '已失效' },
        ],
      },
      rules: 'required',
    },
  ];
}

/** 洗车卡套餐表单配置（包含所有指定字段） */
export function useWashCardFormSchema() {
  return [
    {
      fieldName: 'packageId',
      label: '套餐ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'packageName',
      label: '套餐名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'salePrice',
      label: '售价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售价',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'validDays',
      label: '有效天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入有效天数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'cooperationWashShop',
      label: '合作洗车店',
      component: 'Input',
      componentProps: {
        placeholder: '请输入合作洗车店',
      },
      rules: 'required',
    },
    {
      fieldName: 'washCount',
      label: '洗车次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入洗车次数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'applicableParkingLot',
      label: '适用车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用车场',
      },
      rules: 'required',
    },
    {
      fieldName: 'operator',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人',
      },
      rules: 'required',
    },
    {
      fieldName: 'salesCount',
      label: '销量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入销量',
        min: 0,
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
          { label: '上架', value: '上架' },
          { label: '下架', value: '下架' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'lastUseTime',
      label: '最近使用时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择最近使用时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
  ];
}

/** 配置抽屉表单配置（仅包含指定的配置字段） */
export function useConfigFormSchema() {
  return [
    {
      fieldName: 'packageName',
      label: '套餐名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'applicableSpaceType',
      label: '适用车位类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用车位类型',
      },
      rules: 'required',
    },
    {
      fieldName: 'validDays',
      label: '有效天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入有效天数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'salePrice',
      label: '售价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售价',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'applicableParkingLot',
      label: '适用车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用车场',
      },
      rules: 'required',
    },
    {
      fieldName: 'extraBenefits',
      label: '额外权益',
      component: 'Input',
      componentProps: {
        placeholder: '请输入额外权益',
      },
      rules: 'required',
    },
    {
      fieldName: 'packageId',
      label: '套餐ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'packageStatusName',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '上架', value: '上架' },
          { label: '下架', value: '下架' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'configTime',
      label: '配置时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择配置时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'updater',
      label: '更新人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入更新人',
      },
      rules: 'required',
    },
    {
      fieldName: 'benefitStatus',
      label: '权益生效状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择权益生效状态',
        options: [
          { label: '生效中', value: '生效中' },
          { label: '已失效', value: '已失效' },
        ],
      },
      rules: 'required',
    },
  ];
}

/** 洗车卡套餐配置抽屉表单配置（仅包含指定的配置字段） */
export function useWashCardConfigFormSchema() {
  return [
    {
      fieldName: 'packageName',
      label: '套餐名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'validDays',
      label: '有效天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入有效天数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'salePrice',
      label: '售价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入售价',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'cooperationWashShop',
      label: '合作洗车店',
      component: 'Input',
      componentProps: {
        placeholder: '请输入合作洗车店',
      },
      rules: 'required',
    },
    {
      fieldName: 'washCount',
      label: '洗车次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入洗车次数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'applicableParkingLot',
      label: '适用车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用车场',
      },
      rules: 'required',
    },
    {
      fieldName: 'packageId',
      label: '套餐ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入套餐ID',
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
          { label: '上架', value: '上架' },
          { label: '下架', value: '下架' },
        ],
      },
      rules: 'required',
    },
  ];
}

/** 订阅套餐表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'packageId',
      title: '套餐ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'packageId' },
    },
    {
      field: 'packageName',
      title: '套餐名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'packageTypeName',
      title: '套餐类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'packageTypeName' },
    },
    {
      field: 'originalPrice',
      title: '原价',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'salePrice',
      title: '售价',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'validDays',
      title: '有效天数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'applicableParkingLot',
      title: '适用车场',
      minWidth: 180,
      sortable: true,
      slots: { default: 'applicableParkingLot' },
    },
    {
      field: 'bindCarLimit',
      title: '可绑定车牌数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'salesCount',
      title: '销量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'packageStatusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'packageStatusName' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'lastSaleTime',
      title: '最近销售时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'applicableSpaceType',
      title: '适用车位类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'extraBenefits',
      title: '额外权益',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'configTime',
      title: '配置时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'updater',
      title: '更新人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'benefitStatus',
      title: '权益生效状态',
      minWidth: 120,
      sortable: true,
    },
    {
      title: '操作',
      width: 110,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 洗车卡套餐表格列配置 */
export function useWashCardGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'packageId',
      title: '套餐ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'packageId' },
    },
    {
      field: 'packageName',
      title: '套餐名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'salePrice',
      title: '售价',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'validDays',
      title: '有效天数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'cooperationWashShop',
      title: '合作洗车店',
      minWidth: 180,
      sortable: true,
      slots: { default: 'cooperationWashShop' },
    },
    {
      field: 'washCount',
      title: '洗车次数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'applicableParkingLot',
      title: '适用车场',
      minWidth: 180,
      sortable: true,
      slots: { default: 'applicableParkingLot' },
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'salesCount',
      title: '销量',
      minWidth: 100,
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
      field: 'lastUseTime',
      title: '最近使用时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑套餐',
  addText: '新增套餐',
  configText: '配置套餐',
  excelName: '订阅套餐列表',
  excelAllName: '订阅套餐数据.xlsx',
  total: ' 总计: 套餐数量15;总销量:2135;上架套餐12;下架套餐3',
};

/** 洗车卡套餐文本配置 */
export const washCardTextObj = {
  editText: '编辑洗车卡套餐',
  addText: '新增洗车卡套餐',
  configText: '配置洗车卡套餐',
  excelName: '洗车卡套餐列表',
  excelAllName: '洗车卡套餐数据.xlsx',
  total: ' 总计: 洗车卡套餐数量15;总销量:3345;上架套餐12;下架套餐3',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'packageId', label: '套餐ID' },
  { key: 'packageName', label: '套餐名称' },
  { key: 'packageTypeName', label: '套餐类型' },
  { key: 'originalPrice', label: '原价' },
  { key: 'salePrice', label: '售价' },
  { key: 'validDays', label: '有效天数' },
  { key: 'applicableParkingLot', label: '适用车场' },
  { key: 'bindCarLimit', label: '可绑定车牌数' },
  { key: 'operator', label: '操作人' },
  { key: 'salesCount', label: '销量' },
  {
    key: 'packageStatusName',
    label: '状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '上架': {
          return 'success';
        }
        default: {
          return 'danger';
        }
      }
    },
  },
  { key: 'createTime', label: '创建时间' },
  { key: 'lastSaleTime', label: '最近销售时间' },
  { key: 'applicableSpaceType', label: '适用车位类型' },
  { key: 'extraBenefits', label: '额外权益' },
  { key: 'configTime', label: '配置时间' },
  { key: 'updater', label: '更新人' },
  {
    key: 'benefitStatus',
    label: '权益生效状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '生效中': {
          return 'success';
        }
        default: {
          return 'danger';
        }
      }
    },
  },
];

/** 洗车卡套餐详情抽屉字段配置 */
export const washCardDetailFields = [
  { key: 'packageId', label: '套餐ID' },
  { key: 'packageName', label: '套餐名称' },
  { key: 'salePrice', label: '售价' },
  { key: 'validDays', label: '有效天数' },
  { key: 'cooperationWashShop', label: '合作洗车店' },
  { key: 'washCount', label: '洗车次数' },
  { key: 'applicableParkingLot', label: '适用车场' },
  { key: 'operator', label: '操作人' },
  { key: 'salesCount', label: '销量' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: (value) => {
      switch (value) {
        case '上架': {
          return 'success';
        }
        default: {
          return 'danger';
        }
      }
    },
  },
  { key: 'createTime', label: '创建时间' },
  { key: 'lastUseTime', label: '最近使用时间' },
];

/** 洗车卡套餐搜索表单字段配置 */
export function useWashCardQueryFormSchema() {
  return useWashCardFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  });
}

/** 获取订阅套餐统计数据 */
export const getSubscriptionStatsData = (tabName) => {
  if (tabName === '套餐信息管理') {
    const data = dataList();

    // 卡片数据
    const totalCount = data.length;
    const onlineCount = data.filter(item => item.packageStatusName === '上架').length;
    const completeBenefitCount = data.filter(item => item.benefitStatus === '生效中').length;

    // 套餐类型占比数据
    const packageTypeStats = {};
    data.forEach(item => {
      packageTypeStats[item.packageTypeName] = (packageTypeStats[item.packageTypeName] || 0) + 1;
    });
    const packageTypeChartData = Object.entries(packageTypeStats).map(([name, value]) => ({
      name,
      value
    }));

    // 权益类型占比数据
    const benefitTypeStats = {};
    data.forEach(item => {
      benefitTypeStats[item.benefitStatus] = (benefitTypeStats[item.benefitStatus] || 0) + 1;
    });
    const benefitTypeChartData = Object.entries(benefitTypeStats).map(([name, value]) => ({
      name,
      value
    }));

    // 不同套餐销量对比
    const salesData = data.map(item => ({
      name: item.packageName,
      value: item.salesCount
    })).sort((a, b) => b.value - a.value);
    const salesChartXAxis = salesData.map(item => item.name);
    const salesChartSeries = salesData.map(item => item.value);

    return {
      cards: [
        {
          title: '总套餐数',
          value: totalCount,
          color: '#4A90E2'
        },
        {
          title: '上架套餐数',
          value: onlineCount,
          color: '#50E3C2'
        },
        {
          title: '已配置完整权益套餐数',
          value: completeBenefitCount,
          color: '#FF9F40'
        }
      ],
      charts: [
        {
          title: '套餐类型占比',
          type: 'pie',
          data: packageTypeChartData
        },
        {
          title: '权益类型占比',
          type: 'pie',
          data: benefitTypeChartData
        },
        {
          title: '不同套餐销量对比',
          type: 'bar',
          xAxis: salesChartXAxis,
          series: salesChartSeries
        }
      ]
    };
  } else if (tabName === '洗车卡套餐') {
    const data = washCardDataList();

    // 卡片数据
    const totalCount = data.length;
    const onlineCount = data.filter(item => item.status === '上架').length;
    const totalSalesCount = data.reduce((sum, item) => sum + item.salesCount, 0);

    // 合作洗车店占比数据
    const washShopStats = {};
    data.forEach(item => {
      washShopStats[item.cooperationWashShop] = (washShopStats[item.cooperationWashShop] || 0) + 1;
    });
    const washShopChartData = Object.entries(washShopStats).map(([name, value]) => ({
      name,
      value
    }));

    // 套餐状态占比数据
    const statusStats = {};
    data.forEach(item => {
      statusStats[item.status] = (statusStats[item.status] || 0) + 1;
    });
    const statusChartData = Object.entries(statusStats).map(([name, value]) => ({
      name,
      value
    }));

    // 不同洗车卡套餐销量排名
    const salesData = data.map(item => ({
      name: item.packageName,
      value: item.salesCount
    })).sort((a, b) => b.value - a.value);
    const salesChartXAxis = salesData.map(item => item.name);
    const salesChartSeries = salesData.map(item => item.value);

    return {
      cards: [
        {
          title: '洗车卡套餐总数',
          value: totalCount,
          color: '#4A90E2'
        },
        {
          title: '上架数',
          value: onlineCount,
          color: '#50E3C2'
        },
        {
          title: '销量总数',
          value: totalSalesCount,
          color: '#FF9F40'
        }
      ],
      charts: [
        {
          title: '合作洗车店占比',
          type: 'pie',
          data: washShopChartData
        },
        {
          title: '套餐状态占比',
          type: 'pie',
          data: statusChartData
        },
        {
          title: '不同洗车卡套餐销量排名',
          type: 'bar',
          xAxis: salesChartXAxis,
          series: salesChartSeries
        }
      ]
    };
  }

  return {
    cards: [],
    charts: []
  };
};
