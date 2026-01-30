/** 优惠券表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      couponId: 'CP001',
      couponName: '新用户专属优惠券',
      couponCode: 'NEWUSER2024',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '5',
      minConsume: '20',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '全部车场',
      couponSceneName: '停车缴费',
      newUserCouponSwitch: '开启',
      regularCouponRule: '每月1日发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '可叠加',
      couponStatusName: '启用',
      getCount: '100',
      useCount: '85',
      createTime: '2024-01-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '已发放',
      overlapStatus: '可叠加',
    },
    {
      couponId: 'CP002',
      couponName: '周末折扣券',
      couponCode: 'WEEKEND20',
      couponTypeName: '折扣券',
      faceValueOrDiscountRatio: '8.5',
      minConsume: '10',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '指定车场',
      couponSceneName: '停车缴费',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '每周五发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '不可叠加',
      couponStatusName: '启用',
      getCount: '200',
      useCount: '156',
      createTime: '2024-01-02 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '不可叠加',
    },
    {
      couponId: 'CP003',
      couponName: '节日特惠券',
      couponCode: 'HOLIDAY50',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '10',
      minConsume: '50',
      startTime: '2024-02-01 00:00:00',
      endTime: '2024-02-29 23:59:59',
      applyScopeName: '全部车场',
      couponSceneName: '停车缴费',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '节日前3天发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '可叠加',
      couponStatusName: '启用',
      getCount: '150',
      useCount: '120',
      createTime: '2024-01-15 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '可叠加',
    },
    {
      couponId: 'CP004',
      couponName: '长期会员券',
      couponCode: 'MEMBER15',
      couponTypeName: '折扣券',
      faceValueOrDiscountRatio: '8.0',
      minConsume: '5',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '会员专享',
      couponSceneName: '停车缴费',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '每月15日发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '可叠加',
      couponStatusName: '启用',
      getCount: '300',
      useCount: '250',
      createTime: '2024-01-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '可叠加',
    },
    {
      couponId: 'CP005',
      couponName: '夜间停车券',
      couponCode: 'NIGHT10',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '3',
      minConsume: '15',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '全部车场',
      couponSceneName: '夜间停车',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '每日发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '不可叠加',
      couponStatusName: '启用',
      getCount: '500',
      useCount: '420',
      createTime: '2024-01-03 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '不可叠加',
    },
    {
      couponId: 'CP006',
      couponName: '首单立减券',
      couponCode: 'FIRSTORDER8',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '8',
      minConsume: '1',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '新用户',
      couponSceneName: '首次停车',
      newUserCouponSwitch: '开启',
      regularCouponRule: '新用户注册时发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '不可叠加',
      couponStatusName: '启用',
      getCount: '200',
      useCount: '180',
      createTime: '2024-01-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '已发放',
      overlapStatus: '不可叠加',
    },
    {
      couponId: 'CP007',
      couponName: '季度优惠卡',
      couponCode: 'SEASON30',
      couponTypeName: '折扣券',
      faceValueOrDiscountRatio: '7.5',
      minConsume: '0',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-03-31 23:59:59',
      applyScopeName: '全部车场',
      couponSceneName: '长期停车',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '每季度初发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '可叠加',
      couponStatusName: '启用',
      getCount: '100',
      useCount: '90',
      createTime: '2024-01-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '可叠加',
    },
    {
      couponId: 'CP008',
      couponName: '限时秒杀券',
      couponCode: 'FLASH2024',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '15',
      minConsume: '30',
      startTime: '2024-02-14 00:00:00',
      endTime: '2024-02-14 23:59:59',
      applyScopeName: '全部车场',
      couponSceneName: '限时活动',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '活动开始前发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '不可叠加',
      couponStatusName: '启用',
      getCount: '50',
      useCount: '45',
      createTime: '2024-02-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '不可叠加',
    },
    {
      couponId: 'CP009',
      couponName: '推荐好友券',
      couponCode: 'REFER5',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '5',
      minConsume: '10',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '推荐人',
      couponSceneName: '推荐好友',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '推荐成功后发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '可叠加',
      couponStatusName: '启用',
      getCount: '150',
      useCount: '120',
      createTime: '2024-01-05 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '可叠加',
    },
    {
      couponId: 'CP010',
      couponName: '生日专属券',
      couponCode: 'BIRTHDAY20',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '20',
      minConsume: '50',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '会员',
      couponSceneName: '生日当月',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '生日当月1日发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '可叠加',
      couponStatusName: '启用',
      getCount: '80',
      useCount: '75',
      createTime: '2024-01-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '可叠加',
    },
    {
      couponId: 'CP011',
      couponName: '月度福利券',
      couponCode: 'MONTHLY10',
      couponTypeName: '折扣券',
      faceValueOrDiscountRatio: '9.0',
      minConsume: '15',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      applyScopeName: '全部用户',
      couponSceneName: '日常停车',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '每月1日发放',
      couponPackageOnlineConfig: '已上架',
      overlapUseConfig: '不可叠加',
      couponStatusName: '启用',
      getCount: '300',
      useCount: '270',
      createTime: '2024-01-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '不可叠加',
    },
    {
      couponId: 'CP012',
      couponName: '停用测试券',
      couponCode: 'TEST001',
      couponTypeName: '满减券',
      faceValueOrDiscountRatio: '2',
      minConsume: '5',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-01-31 23:59:59',
      applyScopeName: '测试用户',
      couponSceneName: '测试场景',
      newUserCouponSwitch: '关闭',
      regularCouponRule: '手动发放',
      couponPackageOnlineConfig: '未上架',
      overlapUseConfig: '不可叠加',
      couponStatusName: '禁用',
      getCount: '10',
      useCount: '5',
      createTime: '2024-01-01 00:00:00',
      arrearsUseRecord: '无',
      newUserRecord: '未发放',
      overlapStatus: '不可叠加',
    },
  ];
};

/** 优惠券表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'couponId',
      label: '优惠券ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优惠券ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'couponName',
      label: '优惠券名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优惠券名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'couponCode',
      label: '优惠券码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优惠券码',
      },
      rules: 'required',
    },
    {
      fieldName: 'couponTypeName',
      label: '优惠券类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择优惠券类型',
        options: [
          { label: '满减券', value: '满减券' },
          { label: '折扣券', value: '折扣券' },
          { label: '免费券', value: '免费券' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'faceValueOrDiscountRatio',
      label: '面值/折扣比例',
      component: 'Input',
      componentProps: {
        placeholder: '请输入面值或折扣比例',
      },
      rules: 'required',
    },
    {
      fieldName: 'minConsume',
      label: '最低消费金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入最低消费金额',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
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
      fieldName: 'endTime',
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
      fieldName: 'applyScopeName',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: [
          { label: '全部车场', value: '全部车场' },
          { label: '指定车场', value: '指定车场' },
          { label: '新用户', value: '新用户' },
          { label: '会员', value: '会员' },
          { label: '推荐人', value: '推荐人' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'couponSceneName',
      label: '适用场景',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用场景',
        options: [
          { label: '停车缴费', value: '停车缴费' },
          { label: '夜间停车', value: '夜间停车' },
          { label: '首次停车', value: '首次停车' },
          { label: '长期停车', value: '长期停车' },
          { label: '限时活动', value: '限时活动' },
          { label: '推荐好友', value: '推荐好友' },
          { label: '生日当月', value: '生日当月' },
          { label: '日常停车', value: '日常停车' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'newUserCouponSwitch',
      label: '新用户赠券开关',
      component: 'Switch',
      componentProps: {
        activeText: '开启',
        inactiveText: '关闭',
      },
      rules: 'required',
    },
    {
      fieldName: 'regularCouponRule',
      label: '定期赠券规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入定期赠券规则',
      },
    },
    {
      fieldName: 'couponPackageOnlineConfig',
      label: '券包上架配置',
      component: 'Select',
      componentProps: {
        placeholder: '请选择券包上架配置',
        options: [
          { label: '已上架', value: '已上架' },
          { label: '未上架', value: '未上架' },
        ],
      },
    },
    {
      fieldName: 'overlapUseConfig',
      label: '叠加使用配置',
      component: 'Select',
      componentProps: {
        placeholder: '请选择叠加使用配置',
        options: [
          { label: '可叠加', value: '可叠加' },
          { label: '不可叠加', value: '不可叠加' },
        ],
      },
    },
    {
      fieldName: 'couponStatusName',
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
      fieldName: 'getCount',
      label: '领取次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入领取次数',
        min: 0,
      },
    },
    {
      fieldName: 'useCount',
      label: '使用次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入使用次数',
        min: 0,
      },
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
    },
    {
      fieldName: 'arrearsUseRecord',
      label: '历史欠费使用记录',
      component: 'Input',
      componentProps: {
        placeholder: '请输入历史欠费使用记录',
      },
    },
    {
      fieldName: 'newUserRecord',
      label: '新用户赠券记录',
      component: 'Input',
      componentProps: {
        placeholder: '请输入新用户赠券记录',
      },
    },
    {
      fieldName: 'overlapStatus',
      label: '叠加使用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择叠加使用状态',
        options: [
          { label: '可叠加', value: '可叠加' },
          { label: '不可叠加', value: '不可叠加' },
        ],
      },
    },
  ];
}

/** 优惠券表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'couponId',
      title: '优惠券ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'couponId' },
    },
    {
      field: 'couponName',
      title: '优惠券名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'couponCode',
      title: '优惠券码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'couponCode' },
    },
    {
      field: 'couponTypeName',
      title: '优惠券类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'couponTypeName' },
    },
    {
      field: 'faceValueOrDiscountRatio',
      title: '面值/折扣比例',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'minConsume',
      title: '最低消费金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'startTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'endTime',
      title: '失效时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'applyScopeName',
      title: '适用范围',
      minWidth: 100,
      sortable: true,
      slots: { default: 'applyScopeName' },
    },
    {
      field: 'couponSceneName',
      title: '适用场景',
      minWidth: 100,
      sortable: true,
      slots: { default: 'couponSceneName' },
    },
    {
      field: 'newUserCouponSwitch',
      title: '新用户赠券开关',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'regularCouponRule',
      title: '定期赠券规则',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'couponPackageOnlineConfig',
      title: '券包上架配置',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'overlapUseConfig',
      title: '叠加使用配置',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'couponStatusName',
      title: '状态',
      minWidth: 80,
      sortable: true,
      slots: { default: 'couponStatusName' },
    },
    {
      field: 'getCount',
      title: '领取次数',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'useCount',
      title: '使用次数',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'arrearsUseRecord',
      title: '历史欠费使用记录',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'newUserRecord',
      title: '新用户赠券记录',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'overlapStatus',
      title: '叠加使用状态',
      minWidth: 100,
      sortable: true,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑优惠券',
  addText: '新增优惠券',
  excelName: '优惠券列表',
  excelAllName: '优惠券数据.xlsx',
  total: ' 总计: 优惠券数量12; 启用状态10; 禁用状态2',
};

/** 活动配置管理表格初始数据 - 按指定字段生成 */
export const activityDataList = () => {
  return [
    {
      activityId: 'ACT001',
      activityName: '春节停车优惠活动',
      activityTypeName: '节日活动',
      startTime: '2024-02-01 00:00:00',
      endTime: '2024-02-15 23:59:59',
      totalQuota: '1000',
      remainingQuota: '850',
      usedQuota: '150',
      applyScopeName: '全部车场',
      ruleConfig: '春节期间停车享受8折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-01-15 00:00:00'
    },
    {
      activityId: 'ACT002',
      activityName: '会员专享活动',
      activityTypeName: '会员活动',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      totalQuota: '5000',
      remainingQuota: '4500',
      usedQuota: '500',
      applyScopeName: '会员专享',
      ruleConfig: '会员停车享受7折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-01-01 00:00:00'
    },
    {
      activityId: 'ACT003',
      activityName: '周末特惠活动',
      activityTypeName: '周期性活动',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      totalQuota: '2000',
      remainingQuota: '1800',
      usedQuota: '200',
      applyScopeName: '全部车场',
      ruleConfig: '周末停车享受9折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-01-01 00:00:00'
    },
    {
      activityId: 'ACT004',
      activityName: '夜间停车优惠',
      activityTypeName: '时段活动',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      totalQuota: '3000',
      remainingQuota: '2700',
      usedQuota: '300',
      applyScopeName: '全部车场',
      ruleConfig: '22:00-08:00停车享受8折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-01-01 00:00:00'
    },
    {
      activityId: 'ACT005',
      activityName: '新用户注册活动',
      activityTypeName: '拉新活动',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      totalQuota: '10000',
      remainingQuota: '9500',
      usedQuota: '500',
      applyScopeName: '新用户',
      ruleConfig: '新用户注册送5元停车券',
      operator: '管理员',
      status: '启用',
      createTime: '2024-01-01 00:00:00'
    },
    {
      activityId: 'ACT006',
      activityName: '季度促销活动',
      activityTypeName: '促销活动',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-03-31 23:59:59',
      totalQuota: '500',
      remainingQuota: '300',
      usedQuota: '200',
      applyScopeName: '全部车场',
      ruleConfig: '季度停车卡享受6折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-01-01 00:00:00'
    },
    {
      activityId: 'ACT007',
      activityName: '停车场开业活动',
      activityTypeName: '开业活动',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-01-31 23:59:59',
      totalQuota: '200',
      remainingQuota: '0',
      usedQuota: '200',
      applyScopeName: '指定车场',
      ruleConfig: '开业期间免费停车',
      operator: '管理员',
      status: '禁用',
      createTime: '2024-01-01 00:00:00'
    },
    {
      activityId: 'ACT008',
      activityName: '五一劳动节活动',
      activityTypeName: '节日活动',
      startTime: '2024-04-28 00:00:00',
      endTime: '2024-05-05 23:59:59',
      totalQuota: '500',
      remainingQuota: '500',
      usedQuota: '0',
      applyScopeName: '全部车场',
      ruleConfig: '五一期间停车享受7折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-04-01 00:00:00'
    },
    {
      activityId: 'ACT009',
      activityName: '暑期优惠活动',
      activityTypeName: '季节性活动',
      startTime: '2024-07-01 00:00:00',
      endTime: '2024-08-31 23:59:59',
      totalQuota: '1000',
      remainingQuota: '1000',
      usedQuota: '0',
      applyScopeName: '全部车场',
      ruleConfig: '暑期停车享受8折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-06-01 00:00:00'
    },
    {
      activityId: 'ACT010',
      activityName: '会员日活动',
      activityTypeName: '会员活动',
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      totalQuota: '1200',
      remainingQuota: '1000',
      usedQuota: '200',
      applyScopeName: '会员专享',
      ruleConfig: '每月15日会员日停车免费',
      operator: '管理员',
      status: '启用',
      createTime: '2024-01-01 00:00:00'
    },
    {
      activityId: 'ACT011',
      activityName: '秋季促销活动',
      activityTypeName: '促销活动',
      startTime: '2024-09-01 00:00:00',
      endTime: '2024-11-30 23:59:59',
      totalQuota: '800',
      remainingQuota: '800',
      usedQuota: '0',
      applyScopeName: '全部车场',
      ruleConfig: '秋季停车卡享受7折优惠',
      operator: '管理员',
      status: '启用',
      createTime: '2024-08-01 00:00:00'
    }
  ];
};

/** 活动配置管理表单配置（包含所有指定字段） */
export function useActivityFormSchema() {
  return [
    {
      fieldName: 'activityId',
      label: '活动ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动ID',
      },
      rules: 'required'
    },
    {
      fieldName: 'activityName',
      label: '活动名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'activityTypeName',
      label: '活动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择活动类型',
        options: [
          { label: '节日活动', value: '节日活动' },
          { label: '会员活动', value: '会员活动' },
          { label: '周期性活动', value: '周期性活动' },
          { label: '时段活动', value: '时段活动' },
          { label: '拉新活动', value: '拉新活动' },
          { label: '促销活动', value: '促销活动' },
          { label: '开业活动', value: '开业活动' },
          { label: '季节性活动', value: '季节性活动' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'totalQuota',
      label: '总名额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入总名额',
        min: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'remainingQuota',
      label: '剩余名额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入剩余名额',
        min: 0
      }
    },
    {
      fieldName: 'usedQuota',
      label: '已使用名额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入已使用名额',
        min: 0
      }
    },
    {
      fieldName: 'applyScopeName',
      label: '适用范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用范围',
        options: [
          { label: '全部车场', value: '全部车场' },
          { label: '指定车场', value: '指定车场' },
          { label: '会员专享', value: '会员专享' },
          { label: '新用户', value: '新用户' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'ruleConfig',
      label: '活动规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入活动规则',
        type: 'textarea',
        rows: 3
      },
      rules: 'required'
    },
    {
      fieldName: 'operator',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人'
      }
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  ];
}

/** 活动配置管理表格列配置 */
export function useActivityGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'activityId',
      title: '活动ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'activityId' }
    },
    {
      field: 'activityName',
      title: '活动名称',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'activityTypeName',
      title: '活动类型',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'startTime',
      title: '开始时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'endTime',
      title: '结束时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'totalQuota',
      title: '总名额',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'remainingQuota',
      title: '剩余名额',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'usedQuota',
      title: '已使用名额',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'applyScopeName',
      title: '适用范围',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'ruleConfig',
      title: '活动规则',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 80,
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
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

export const activityTextObj = {
  editText: '编辑活动',
  addText: '新增活动',
  excelName: '活动列表',
  excelAllName: '活动数据.xlsx',
  total: ' 总计: 活动数量11; 启用状态10; 禁用状态1',
};

/** 活动详情抽屉字段配置 */
export const activityDetailFields = [
  { key: 'activityId', label: '活动ID' },
  { key: 'activityName', label: '活动名称' },
  { key: 'activityTypeName', label: '活动类型' },
  { key: 'startTime', label: '开始时间' },
  { key: 'endTime', label: '结束时间' },
  { key: 'totalQuota', label: '总名额' },
  { key: 'remainingQuota', label: '剩余名额' },
  { key: 'usedQuota', label: '已使用名额' },
  { key: 'applyScopeName', label: '适用范围' },
  { key: 'ruleConfig', label: '活动规则' },
  { key: 'operator', label: '操作人' },
  { key: 'status', label: '状态' },
  { key: 'createTime', label: '创建时间' }
];

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'couponId', label: '优惠券ID' },
  { key: 'couponName', label: '优惠券名称' },
  { key: 'couponCode', label: '优惠券码' },
  { key: 'couponTypeName', label: '优惠券类型' },
  { key: 'faceValueOrDiscountRatio', label: '面值/折扣比例' },
  { key: 'minConsume', label: '最低消费金额' },
  { key: 'startTime', label: '生效时间' },
  { key: 'endTime', label: '失效时间' },
  { key: 'applyScopeName', label: '适用范围' },
  { key: 'couponSceneName', label: '适用场景' },
  { key: 'newUserCouponSwitch', label: '新用户赠券开关' },
  { key: 'regularCouponRule', label: '定期赠券规则' },
  { key: 'couponPackageOnlineConfig', label: '券包上架配置' },
  { key: 'overlapUseConfig', label: '叠加使用配置' },
  { key: 'couponStatusName', label: '状态' },
  { key: 'getCount', label: '领取次数' },
  { key: 'useCount', label: '使用次数' },
  { key: 'createTime', label: '创建时间' },
  { key: 'arrearsUseRecord', label: '历史欠费使用记录' },
  { key: 'newUserRecord', label: '新用户赠券记录' },
  { key: 'overlapStatus', label: '叠加使用状态' }
];
