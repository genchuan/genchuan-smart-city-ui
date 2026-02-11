import {maskPhone} from "#/utils/dataMask/index.js";

/** 积分规则表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      ruleId: 'RULE001', // 规则ID
      ruleName: '首次注册送积分', // 规则名称
      triggerType: '注册', // 触发类型
      pointsValue: 50, // 积分值
      dailyLimit: 1, // 单日上限
      enableStatus: '启用', // 启用状态
      createUserName: '管理员', // 创建人
      createTime: '2025-01-10 09:20:30', // 创建时间
      useCount: 1250, // 使用次数
      lastUseTime: '2025-02-05 10:30:50', // 最近使用时间
    },
    {
      ruleId: 'RULE002',
      ruleName: '每日登录送积分',
      triggerType: '登录',
      pointsValue: 10,
      dailyLimit: 1,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-01-12 14:15:20',
      useCount: 8920,
      lastUseTime: '2025-02-05 09:45:20',
    },
    {
      ruleId: 'RULE003',
      ruleName: '首次停车送积分',
      triggerType: '停车',
      pointsValue: 30,
      dailyLimit: 1,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-01-15 10:05:10',
      useCount: 350,
      lastUseTime: '2025-02-04 16:20:15',
    },
    {
      ruleId: 'RULE004',
      ruleName: '分享好友送积分',
      triggerType: '分享',
      pointsValue: 20,
      dailyLimit: 3,
      enableStatus: '禁用',
      createUserName: '管理员',
      createTime: '2025-01-18 08:30:45',
      useCount: 210,
      lastUseTime: '2025-01-30 14:50:30',
    },
    {
      ruleId: 'RULE005',
      ruleName: '评价停车场送积分',
      triggerType: '评价',
      pointsValue: 15,
      dailyLimit: 5,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-01-20 16:40:15',
      useCount: 1850,
      lastUseTime: '2025-02-05 08:15:45',
    },
    {
      ruleId: 'RULE006',
      ruleName: '参与活动送积分',
      triggerType: '活动',
      pointsValue: 100,
      dailyLimit: 1,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-01-22 11:10:30',
      useCount: 450,
      lastUseTime: '2025-02-03 19:30:20',
    },
    {
      ruleId: 'RULE007',
      ruleName: '邀请好友注册送积分',
      triggerType: '邀请',
      pointsValue: 60,
      dailyLimit: 10,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-01-25 13:25:40',
      useCount: 980,
      lastUseTime: '2025-02-04 11:20:15',
    },
    {
      ruleId: 'RULE008',
      ruleName: '充值送积分',
      triggerType: '充值',
      pointsValue: 1,
      dailyLimit: 1000,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-01-28 09:50:25',
      useCount: 3200,
      lastUseTime: '2025-02-05 10:15:30',
    },
    {
      ruleId: 'RULE009',
      ruleName: '连续登录送积分',
      triggerType: '登录',
      pointsValue: 20,
      dailyLimit: 1,
      enableStatus: '禁用',
      createUserName: '管理员',
      createTime: '2025-02-01 15:15:10',
      useCount: 1200,
      lastUseTime: '2025-01-25 16:45:20',
    },
    {
      ruleId: 'RULE010',
      ruleName: '生日送积分',
      triggerType: '生日',
      pointsValue: 200,
      dailyLimit: 1,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-02-05 10:30:50',
      useCount: 85,
      lastUseTime: '2025-02-04 00:10:15',
    },
    {
      ruleId: 'RULE011',
      ruleName: '节日送积分',
      triggerType: '节日',
      pointsValue: 100,
      dailyLimit: 1,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-02-08 14:20:15',
      useCount: 320,
      lastUseTime: '2025-02-01 12:30:45',
    },
    {
      ruleId: 'RULE012',
      ruleName: '消费送积分',
      triggerType: '消费',
      pointsValue: 1,
      dailyLimit: 500,
      enableStatus: '启用',
      createUserName: '管理员',
      createTime: '2025-02-10 09:40:30',
      useCount: 4500,
      lastUseTime: '2025-02-05 11:20:30',
    },
  ];
};

/** 积分规则表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'ruleId',
      label: '规则ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'triggerType',
      label: '触发类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择触发类型',
        options: [
          { label: '注册', value: '注册' },
          { label: '登录', value: '登录' },
          { label: '停车', value: '停车' },
          { label: '分享', value: '分享' },
          { label: '评价', value: '评价' },
          { label: '活动', value: '活动' },
          { label: '邀请', value: '邀请' },
          { label: '充值', value: '充值' },
          { label: '生日', value: '生日' },
          { label: '节日', value: '节日' },
          { label: '消费', value: '消费' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'pointsValue',
      label: '积分值',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入积分值',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'dailyLimit',
      label: '单日上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入单日上限',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'enableStatus',
      label: '启用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择启用状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'createUserName',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人',
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
      fieldName: 'useCount',
      label: '使用次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入使用次数',
        min: 0,
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

/** 积分规则表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'ruleId',
      title: '规则ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'ruleId' },
    },
    {
      field: 'ruleName',
      title: '规则名称',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'triggerType',
      title: '触发类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'triggerType' },
    },
    {
      field: 'pointsValue',
      title: '积分值',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'dailyLimit',
      title: '单日上限',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'enableStatus',
      title: '启用状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'enableStatus' },
    },
    {
      field: 'createUserName',
      title: '创建人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'useCount',
      title: '使用次数',
      minWidth: 100,
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
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑积分规则',
  addText: '新增积分规则',
  // 导出Excel相关文本
  excelName: '积分规则列表',
  excelAllName: '全市积分规则数据.xlsx',
  // 统计总计文本
  total: '积分规则数量12; 启用规则10; 禁用规则2',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'ruleId', label: '规则ID' },
  { key: 'ruleName', label: '规则名称' },
  { key: 'triggerType', label: '触发类型' },
  { key: 'pointsValue', label: '积分值' },
  { key: 'dailyLimit', label: '单日上限' },
  { key: 'enableStatus', label: '启用状态' },
  { key: 'createUserName', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'useCount', label: '使用次数' },
  { key: 'lastUseTime', label: '最近使用时间' },
];

/** 获取状态标签类型 */
export function getStatusTagType(status) {
  switch (status) {
    case '启用': {
      return 'success';
    }
    case '禁用': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
}

/** 获取变动类型标签类型 */
export function getChangeTypeTagType(changeType) {
  switch (changeType) {
    case '减少': {
      return 'danger';
    }
    case '增加': {
      return 'success';
    }
    default: {
      return 'info';
    }
  }
}

/** 获取兑换状态标签类型 */
export function getExchangeStatusTagType(exchangeStatus) {
  switch (exchangeStatus) {
    case '处理中': {
      return 'warning';
    }
    case '已取消': {
      return 'danger';
    }
    case '已完成': {
      return 'success';
    }
    default: {
      return 'info';
    }
  }
}

/** 获取优惠券状态标签类型 */
export function getCouponStatusTagType(couponStatus) {
  switch (couponStatus) {
    case '已使用': {
      return 'warning';
    }
    case '已失效': {
      return 'danger';
    }
    case '未使用': {
      return 'success';
    }
    case '未生成': {
      return 'info';
    }
    default: {
      return 'info';
    }
  }
}

/** 获取导入状态标签类型 */
export function getImportStatusTagType(importStatus) {
  switch (importStatus) {
    case '失败': {
      return 'danger';
    }
    case '成功': {
      return 'success';
    }
    case '部分成功': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
}

/** 用户积分查询表格初始数据 - 按指定字段生成 */
export const userPointsDataList = () => {
  return [
    {
      userId: 'USER001', // 用户ID
      userName: '张三', // 用户姓名
      phone: '13800138001', // 手机号
      totalPoints: 1250, // 总积分
      availablePoints: 1000, // 可用积分
      expiredPoints: 250, // 已过期积分
      recordId: 'REC001', // 变动记录ID
      changeTime: '2025-02-05 10:30:50', // 变动时间
      changeType: '增加', // 变动类型
      changePoints: 50, // 变动积分
      reason: '首次注册送积分', // 变动原因
    },
    {
      userId: 'USER002',
      userName: '李四',
      phone: '13800138002',
      totalPoints: 890,
      availablePoints: 800,
      expiredPoints: 90,
      recordId: 'REC002',
      changeTime: '2025-02-05 09:45:20',
      changeType: '减少',
      changePoints: 10,
      reason: '兑换优惠券',
    },
    {
      userId: 'USER003',
      userName: '王五',
      phone: '13800138003',
      totalPoints: 350,
      availablePoints: 300,
      expiredPoints: 50,
      recordId: 'REC003',
      changeTime: '2025-02-04 16:20:15',
      changeType: '增加',
      changePoints: 30,
      reason: '首次停车送积分',
    },
    {
      userId: 'USER004',
      userName: '赵六',
      phone: '13800138004',
      totalPoints: 210,
      availablePoints: 210,
      expiredPoints: 0,
      recordId: 'REC004',
      changeTime: '2025-01-30 14:50:30',
      changeType: '增加',
      changePoints: 20,
      reason: '分享好友送积分',
    },
    {
      userId: 'USER005',
      userName: '孙七',
      phone: '13800138005',
      totalPoints: 1850,
      availablePoints: 1700,
      expiredPoints: 150,
      recordId: 'REC005',
      changeTime: '2025-02-05 08:15:45',
      changeType: '减少',
      changePoints: 15,
      reason: '积分过期',
    },
    {
      userId: 'USER006',
      userName: '周八',
      phone: '13800138006',
      totalPoints: 450,
      availablePoints: 450,
      expiredPoints: 0,
      recordId: 'REC006',
      changeTime: '2025-02-03 19:30:20',
      changeType: '增加',
      changePoints: 100,
      reason: '参与活动送积分',
    },
    {
      userId: 'USER007',
      userName: '吴九',
      phone: '13800138007',
      totalPoints: 980,
      availablePoints: 900,
      expiredPoints: 80,
      recordId: 'REC007',
      changeTime: '2025-02-04 11:20:15',
      changeType: '增加',
      changePoints: 60,
      reason: '邀请好友注册送积分',
    },
    {
      userId: 'USER008',
      userName: '郑十',
      phone: '13800138008',
      totalPoints: 3200,
      availablePoints: 3000,
      expiredPoints: 200,
      recordId: 'REC008',
      changeTime: '2025-02-05 10:15:30',
      changeType: '减少',
      changePoints: 50,
      reason: '抵扣停车费',
    },
    {
      userId: 'USER009',
      userName: '王十一',
      phone: '13800138009',
      totalPoints: 1200,
      availablePoints: 1000,
      expiredPoints: 200,
      recordId: 'REC009',
      changeTime: '2025-01-25 16:45:20',
      changeType: '增加',
      changePoints: 20,
      reason: '连续登录送积分',
    },
    {
      userId: 'USER010',
      userName: '李十二',
      phone: '13800138010',
      totalPoints: 200,
      availablePoints: 200,
      expiredPoints: 0,
      recordId: 'REC010',
      changeTime: '2025-02-04 00:10:15',
      changeType: '增加',
      changePoints: 200,
      reason: '生日送积分',
    },
    {
      userId: 'USER011',
      userName: '张十三',
      phone: '13800138011',
      totalPoints: 320,
      availablePoints: 320,
      expiredPoints: 0,
      recordId: 'REC011',
      changeTime: '2025-02-01 12:30:45',
      changeType: '减少',
      changePoints: 30,
      reason: '兑换礼品',
    },
    {
      userId: 'USER012',
      userName: '刘十四',
      phone: '13800138012',
      totalPoints: 4500,
      availablePoints: 4000,
      expiredPoints: 500,
      recordId: 'REC012',
      changeTime: '2025-02-05 11:20:30',
      changeType: '增加',
      changePoints: 50,
      reason: '消费送积分',
    },
  ];
};

/** 积分兑换管理表格初始数据 - 按指定字段生成 */
export const exchangeManagementDataList = () => {
  return [
    {
      exchangeProductName: '5元停车优惠券',
      requiredPoints: 50,
      remainingStock: 95,
      applyScope: '全场通用',
      userAvailablePoints: 1000,
      exchangeRecordId: 'EXCH001',
      exchangeTime: '2025-02-05 10:30:50',
      exchangeStatus: '已完成',
      couponCode: 'COUPON001',
      couponStatus: '未使用',
    },
    {
      exchangeProductName: '10元停车优惠券',
      requiredPoints: 100,
      remainingStock: 88,
      applyScope: '指定车场',
      userAvailablePoints: 800,
      exchangeRecordId: 'EXCH002',
      exchangeTime: '2025-02-05 09:45:20',
      exchangeStatus: '已完成',
      couponCode: 'COUPON002',
      couponStatus: '已使用',
    },
    {
      exchangeProductName: '洗车优惠券',
      requiredPoints: 200,
      remainingStock: 45,
      applyScope: '指定服务',
      userAvailablePoints: 300,
      exchangeRecordId: 'EXCH003',
      exchangeTime: '2025-02-04 16:20:15',
      exchangeStatus: '已完成',
      couponCode: 'COUPON003',
      couponStatus: '未使用',
    },
    {
      exchangeProductName: '15元停车优惠券',
      requiredPoints: 150,
      remainingStock: 67,
      applyScope: '全场通用',
      userAvailablePoints: 210,
      exchangeRecordId: 'EXCH004',
      exchangeTime: '2025-01-30 14:50:30',
      exchangeStatus: '已取消',
      couponCode: 'COUPON004',
      couponStatus: '已失效',
    },
    {
      exchangeProductName: '20元停车优惠券',
      requiredPoints: 200,
      remainingStock: 33,
      applyScope: '指定车场',
      userAvailablePoints: 1700,
      exchangeRecordId: 'EXCH005',
      exchangeTime: '2025-02-05 08:15:45',
      exchangeStatus: '已完成',
      couponCode: 'COUPON005',
      couponStatus: '未使用',
    },
    {
      exchangeProductName: '咖啡券',
      requiredPoints: 180,
      remainingStock: 25,
      applyScope: '指定服务',
      userAvailablePoints: 450,
      exchangeRecordId: 'EXCH006',
      exchangeTime: '2025-02-03 19:30:20',
      exchangeStatus: '处理中',
      couponCode: 'COUPON006',
      couponStatus: '未生成',
    },
    {
      exchangeProductName: '30元停车优惠券',
      requiredPoints: 300,
      remainingStock: 18,
      applyScope: '全场通用',
      userAvailablePoints: 900,
      exchangeRecordId: 'EXCH007',
      exchangeTime: '2025-02-04 11:20:15',
      exchangeStatus: '已完成',
      couponCode: 'COUPON007',
      couponStatus: '已使用',
    },
    {
      exchangeProductName: '电影票优惠券',
      requiredPoints: 250,
      remainingStock: 12,
      applyScope: '指定服务',
      userAvailablePoints: 3000,
      exchangeRecordId: 'EXCH008',
      exchangeTime: '2025-02-05 10:15:30',
      exchangeStatus: '已完成',
      couponCode: 'COUPON008',
      couponStatus: '未使用',
    },
    {
      exchangeProductName: '50元停车优惠券',
      requiredPoints: 500,
      remainingStock: 8,
      applyScope: '全场通用',
      userAvailablePoints: 1000,
      exchangeRecordId: 'EXCH009',
      exchangeTime: '2025-01-25 16:45:20',
      exchangeStatus: '已取消',
      couponCode: 'COUPON009',
      couponStatus: '已失效',
    },
    {
      exchangeProductName: '加油优惠券',
      requiredPoints: 350,
      remainingStock: 15,
      applyScope: '指定服务',
      userAvailablePoints: 200,
      exchangeRecordId: 'EXCH010',
      exchangeTime: '2025-02-04 00:10:15',
      exchangeStatus: '处理中',
      couponCode: 'COUPON010',
      couponStatus: '未生成',
    },
    {
      exchangeProductName: '25元停车优惠券',
      requiredPoints: 250,
      remainingStock: 42,
      applyScope: '指定车场',
      userAvailablePoints: 320,
      exchangeRecordId: 'EXCH011',
      exchangeTime: '2025-02-01 12:30:45',
      exchangeStatus: '已完成',
      couponCode: 'COUPON011',
      couponStatus: '未使用',
    },
    {
      exchangeProductName: '超市购物券',
      requiredPoints: 400,
      remainingStock: 20,
      applyScope: '指定商家',
      userAvailablePoints: 4000,
      exchangeRecordId: 'EXCH012',
      exchangeTime: '2025-02-05 11:20:30',
      exchangeStatus: '已完成',
      couponCode: 'COUPON012',
      couponStatus: '已使用',
    },
  ];
};

/** 人工积分导入表格初始数据 - 按指定字段生成 */
export const manualPointsImportDataList = () => {
  return [
    {
      selectUserName: '张三',
      importPoints: 100,
      importReason: '活动奖励',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT001',
      importTime: '2025-02-05 10:30:50',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '李四',
      importPoints: 50,
      importReason: '注册奖励',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT002',
      importTime: '2025-02-05 09:45:20',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '批量导入',
      importPoints: 20,
      importReason: '节日福利',
      importType: '批量导入',
      batchImportFile: '用户列表.xlsx',
      importId: 'IMPORT003',
      importTime: '2025-02-04 16:20:15',
      importUserName: '管理员',
      successCount: 50,
      failCount: 2,
      importStatus: '部分成功',
    },
    {
      selectUserName: '王五',
      importPoints: 150,
      importReason: '邀请奖励',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT004',
      importTime: '2025-01-30 14:50:30',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '赵六',
      importPoints: 80,
      importReason: '消费奖励',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT005',
      importTime: '2025-02-05 08:15:45',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '批量导入',
      importPoints: 30,
      importReason: '会员福利',
      importType: '批量导入',
      batchImportFile: '会员列表.xlsx',
      importId: 'IMPORT006',
      importTime: '2025-02-03 19:30:20',
      importUserName: '管理员',
      successCount: 0,
      failCount: 20,
      importStatus: '失败',
    },
    {
      selectUserName: '孙七',
      importPoints: 200,
      importReason: '生日福利',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT007',
      importTime: '2025-02-04 11:20:15',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '批量导入',
      importPoints: 10,
      importReason: '每日签到',
      importType: '批量导入',
      batchImportFile: '签到用户.xlsx',
      importId: 'IMPORT008',
      importTime: '2025-02-05 10:15:30',
      importUserName: '管理员',
      successCount: 85,
      failCount: 5,
      importStatus: '部分成功',
    },
    {
      selectUserName: '周八',
      importPoints: 120,
      importReason: '分享奖励',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT009',
      importTime: '2025-01-25 16:45:20',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '吴九',
      importPoints: 90,
      importReason: '评价奖励',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT010',
      importTime: '2025-02-04 00:10:15',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '批量导入',
      importPoints: 25,
      importReason: '新用户福利',
      importType: '批量导入',
      batchImportFile: '新用户列表.xlsx',
      importId: 'IMPORT011',
      importTime: '2025-02-01 12:30:45',
      importUserName: '管理员',
      successCount: 30,
      failCount: 0,
      importStatus: '成功',
    },
    {
      selectUserName: '郑十',
      importPoints: 180,
      importReason: '活动特等奖',
      importType: '单个导入',
      batchImportFile: '',
      importId: 'IMPORT012',
      importTime: '2025-02-05 11:20:30',
      importUserName: '管理员',
      successCount: 1,
      failCount: 0,
      importStatus: '成功',
    },
  ];
};

/** 用户积分查询表单配置（包含所有指定字段） */
export function useUserPointsFormSchema() {
  return [
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'userName',
      label: '用户姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户姓名',
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
      },
      rules: 'required',
    },
    {
      fieldName: 'totalPoints',
      label: '总积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入总积分',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'availablePoints',
      label: '可用积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入可用积分',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'expiredPoints',
      label: '已过期积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入已过期积分',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'recordId',
      label: '变动记录ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入变动记录ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'changeTime',
      label: '变动时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择变动时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'changeType',
      label: '变动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择变动类型',
        options: [
          { label: '增加', value: '增加' },
          { label: '减少', value: '减少' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'changePoints',
      label: '变动积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入变动积分',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'reason',
      label: '变动原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入变动原因',
      },
      rules: 'required',
    },
  ];
}

/** 用户积分查询表格列配置 */
export function useUserPointsGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'userId',
      title: '用户ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'userId' },
    },
    {
      field: 'userName',
      title: '用户姓名',
      minWidth: 100,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'phone',
      title: '手机号',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'totalPoints',
      title: '总积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'availablePoints',
      title: '可用积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'expiredPoints',
      title: '已过期积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'recordId',
      title: '变动记录ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'changeTime',
      title: '变动时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'changeType',
      title: '变动类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'changeType' },
    },
    {
      field: 'changePoints',
      title: '变动积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'reason',
      title: '变动原因',
      minWidth: 150,
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

/** 用户积分查询详情抽屉字段配置 */
export const userPointsDetailFields = [
  { key: 'userId', label: '用户ID' },
  { key: 'userName', label: '用户姓名' },
  { key: 'phone', label: '手机号', formatter: maskPhone },
  { key: 'totalPoints', label: '总积分' },
  { key: 'availablePoints', label: '可用积分' },
  { key: 'expiredPoints', label: '已过期积分' },
  { key: 'recordId', label: '变动记录ID' },
  { key: 'changeTime', label: '变动时间' },
  { key: 'changeType', label: '变动类型' },
  { key: 'changePoints', label: '变动积分' },
  { key: 'reason', label: '变动原因' },
];

export const userPointsTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑用户积分',
  addText: '新增用户积分',
  // 导出Excel相关文本
  excelName: '用户积分列表',
  excelAllName: '全市用户积分数据.xlsx',
  // 统计总计文本
  total: '用户数量12; 总积分14390; 可用积分13880; 已过期积分1810',
};

/** 积分兑换管理表单配置（包含所有指定字段） */
export function useExchangeManagementFormSchema() {
  return [
    {
      fieldName: 'exchangeProductName',
      label: '兑换商品',
      component: 'Input',
      componentProps: {
        placeholder: '请输入兑换商品',
      },
      rules: 'required',
    },
    {
      fieldName: 'requiredPoints',
      label: '所需积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入所需积分',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'remainingStock',
      label: '剩余库存',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入剩余库存',
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
          { label: '全场通用', value: '全场通用' },
          { label: '指定车场', value: '指定车场' },
          { label: '指定服务', value: '指定服务' },
          { label: '指定商家', value: '指定商家' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'userAvailablePoints',
      label: '用户可用积分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入用户可用积分',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'exchangeRecordId',
      label: '兑换记录ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入兑换记录ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'exchangeTime',
      label: '兑换时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择兑换时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'exchangeStatus',
      label: '兑换状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择兑换状态',
        options: [
          { label: '处理中', value: '处理中' },
          { label: '已完成', value: '已完成' },
          { label: '已取消', value: '已取消' },
        ],
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
      fieldName: 'couponStatus',
      label: '优惠券状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择优惠券状态',
        options: [
          { label: '未生成', value: '未生成' },
          { label: '未使用', value: '未使用' },
          { label: '已使用', value: '已使用' },
          { label: '已失效', value: '已失效' },
        ],
      },
      rules: 'required',
    },
  ];
}

/** 积分兑换管理表格列配置 */
export function useExchangeManagementGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'exchangeProductName',
      title: '兑换商品',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'requiredPoints',
      title: '所需积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'remainingStock',
      title: '剩余库存',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'applyScope',
      title: '适用范围',
      minWidth: 120,
      sortable: true,
      slots: { default: 'applyScope' },
    },
    {
      field: 'userAvailablePoints',
      title: '用户可用积分',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'exchangeRecordId',
      title: '兑换记录ID',
      minWidth: 150,
      sortable: true,
      slots: { default: 'exchangeRecordId' },
    },
    {
      field: 'exchangeTime',
      title: '兑换时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'exchangeStatus',
      title: '兑换状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'exchangeStatus' },
    },
    {
      field: 'couponCode',
      title: '优惠券码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'couponStatus',
      title: '优惠券状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'couponStatus' },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 积分兑换管理详情抽屉字段配置 */
export const exchangeManagementDetailFields = [
  { key: 'exchangeProductName', label: '兑换商品' },
  { key: 'requiredPoints', label: '所需积分' },
  { key: 'remainingStock', label: '剩余库存' },
  { key: 'applyScope', label: '适用范围' },
  { key: 'userAvailablePoints', label: '用户可用积分' },
  { key: 'exchangeRecordId', label: '兑换记录ID' },
  { key: 'exchangeTime', label: '兑换时间' },
  { key: 'exchangeStatus', label: '兑换状态' },
  { key: 'couponCode', label: '优惠券码' },
  { key: 'couponStatus', label: '优惠券状态' },
];

export const exchangeManagementTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑积分兑换',
  addText: '新增积分兑换',
  // 导出Excel相关文本
  excelName: '积分兑换列表',
  excelAllName: '全市积分兑换数据.xlsx',
  // 统计总计文本
  total: '兑换记录12; 总积分3030;总库存494; 总可用积分14430',
};

/** 人工积分导入表单配置（包含所有指定字段） */
export function useManualPointsImportFormSchema() {
  return [
    {
      fieldName: 'selectUserName',
      label: '用户选择',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户选择',
      },
      rules: 'required',
    },
    {
      fieldName: 'importPoints',
      label: '积分数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入积分数量',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'importReason',
      label: '导入原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入导入原因',
      },
      rules: 'required',
    },
    {
      fieldName: 'importType',
      label: '导入方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择导入方式',
        options: [
          { label: '单个导入', value: '单个导入' },
          { label: '批量导入', value: '批量导入' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'batchImportFile',
      label: '批量导入文件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入批量导入文件',
      },
    },
    {
      fieldName: 'importId',
      label: '导入ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入导入ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'importTime',
      label: '导入时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择导入时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'importUserName',
      label: '导入人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入导入人',
      },
      rules: 'required',
    },
    {
      fieldName: 'successCount',
      label: '成功数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入成功数量',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'failCount',
      label: '失败数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入失败数量',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'importStatus',
      label: '导入状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择导入状态',
        options: [
          { label: '成功', value: '成功' },
          { label: '失败', value: '失败' },
          { label: '部分成功', value: '部分成功' },
        ],
      },
      rules: 'required',
    },
  ];
}

/** 人工积分导入表格列配置 */
export function useManualPointsImportGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'selectUserName',
      title: '用户选择',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'importPoints',
      title: '积分数量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'importReason',
      title: '导入原因',
      minWidth: 150,
      sortable: true,
      slots: { default: 'importReason' },
    },
    {
      field: 'importType',
      title: '导入方式',
      minWidth: 100,
      sortable: true,
      slots: { default: 'importType' },
    },
    {
      field: 'batchImportFile',
      title: '批量导入文件',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'importId',
      title: '导入ID',
      minWidth: 150,
      sortable: true,
      slots: { default: 'importId' },
    },
    {
      field: 'importTime',
      title: '导入时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'importUserName',
      title: '导入人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'successCount',
      title: '成功数量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'failCount',
      title: '失败数量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'importStatus',
      title: '导入状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'importStatus' },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 人工积分导入详情抽屉字段配置 */
export const manualPointsImportDetailFields = [
  { key: 'selectUserName', label: '用户选择' },
  { key: 'importPoints', label: '积分数量' },
  { key: 'importReason', label: '导入原因' },
  { key: 'importType', label: '导入方式' },
  { key: 'batchImportFile', label: '批量导入文件' },
  { key: 'importId', label: '导入ID' },
  { key: 'importTime', label: '导入时间' },
  { key: 'importUserName', label: '导入人' },
  { key: 'successCount', label: '成功数量' },
  { key: 'failCount', label: '失败数量' },
  { key: 'importStatus', label: '导入状态' },
];

export const manualPointsImportTextObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑人工积分导入',
  addText: '新增人工积分导入',
  // 导出Excel相关文本
  excelName: '人工积分导入列表',
  excelAllName: '全市人工积分导入数据.xlsx',
  // 统计总计文本
  total: '导入记录12; 总积分1175; 总成功数179; 总失败数27',
};

/** 根据标签页获取统计数据 */
export function getStatsDataByTab(tabName) {
  switch (tabName) {
    case '人工积分导入': {
      return getManualPointsImportStatsData();
    }
    case '用户积分查询': {
      return getUserPointsStatsData();
    }
    case '积分兑换管理': {
      return getExchangeManagementStatsData();
    }
    case '积分规则': {
      return getPointsRuleStatsData();
    }
    default: {
      return { cards: [], charts: [] };
    }
  }
}

/** 积分规则统计数据 */
function getPointsRuleStatsData() {
  const data = dataList();

  // 卡片数据
  const totalRules = data.length;
  const enabledRules = data.filter(
    (item) => item.enableStatus === '启用',
  ).length;
  const commonRules = data.filter((item) => item.useCount > 1000).length;

  // 触发类型占比
  const triggerTypeMap = {};
  data.forEach((item) => {
    triggerTypeMap[item.triggerType] =
      (triggerTypeMap[item.triggerType] || 0) + 1;
  });
  const triggerTypeData = Object.entries(triggerTypeMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 启用状态占比
  const enableStatusMap = {};
  data.forEach((item) => {
    enableStatusMap[item.enableStatus] =
      (enableStatusMap[item.enableStatus] || 0) + 1;
  });
  const enableStatusData = Object.entries(enableStatusMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 规则使用次数排名
  const useCountData = data.sort((a, b) => b.useCount - a.useCount).slice(0, 5);
  const ruleUseCountXAxis = useCountData.map((item) => item.ruleName);
  const ruleUseCountSeries = useCountData.map((item) => item.useCount);

  return {
    cards: [
      {
        title: '总规则数',
        value: totalRules,
        color: '#4A90E2',
      },
      {
        title: '启用规则数',
        value: enabledRules,
        color: '#50E3C2',
      },
      {
        title: '常用规则数',
        value: commonRules,
        color: '#FF9F40',
      },
    ],
    charts: [
      {
        title: '触发类型占比',
        type: 'pie',
        data: triggerTypeData,
      },
      {
        title: '启用状态占比',
        type: 'pie',
        data: enableStatusData,
      },
      {
        title: '规则使用次数排名',
        type: 'bar',
        xAxis: ruleUseCountXAxis,
        series: ruleUseCountSeries,
      },
    ],
  };
}

/** 用户积分查询统计数据 */
function getUserPointsStatsData() {
  const data = userPointsDataList();

  // 卡片数据
  const totalUsers = data.length;
  const totalPoints = data.reduce((sum, item) => sum + item.totalPoints, 0);
  const averagePoints = Math.round(totalPoints / totalUsers);

  // 积分变动类型占比
  const changeTypeMap = {};
  data.forEach((item) => {
    changeTypeMap[item.changeType] = (changeTypeMap[item.changeType] || 0) + 1;
  });
  const changeTypeData = Object.entries(changeTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 不同积分占比
  const pointsRangeMap = {
    '0-500': 0,
    '501-1000': 0,
    '1001-2000': 0,
    '2001+': 0,
  };
  data.forEach((item) => {
    if (item.totalPoints <= 500) {
      pointsRangeMap['0-500']++;
    } else if (item.totalPoints <= 1000) {
      pointsRangeMap['501-1000']++;
    } else if (item.totalPoints <= 2000) {
      pointsRangeMap['1001-2000']++;
    } else {
      pointsRangeMap['2001+']++;
    }
  });
  const pointsRangeData = Object.entries(pointsRangeMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 积分变动数时间变化趋势
  const changeTimeData = data
    .sort((a, b) => new Date(a.changeTime) - new Date(b.changeTime))
    .slice(0, 7);
  const changeTimeXAxis = changeTimeData.map((item) =>
    item.changeTime.slice(5, 10),
  );
  const changeTimeSeries = changeTimeData.map((item) => item.changePoints);

  return {
    cards: [
      {
        title: '查询用户总数',
        value: totalUsers,
        color: '#4A90E2',
      },
      {
        title: '总积分总额',
        value: totalPoints,
        color: '#50E3C2',
      },
      {
        title: '平均积分',
        value: averagePoints,
        color: '#FF9F40',
      },
    ],
    charts: [
      {
        title: '积分变动类型占比',
        type: 'pie',
        data: changeTypeData,
      },
      {
        title: '不同积分占比',
        type: 'pie',
        data: pointsRangeData,
      },
      {
        title: '积分变动数时间变化趋势',
        type: 'line',
        xAxis: changeTimeXAxis,
        series: changeTimeSeries,
      },
    ],
  };
}

/** 积分兑换管理统计数据 */
function getExchangeManagementStatsData() {
  const data = exchangeManagementDataList();

  // 卡片数据
  const totalProducts = data.length;
  const hotProducts = data.filter((item) => item.requiredPoints > 150).length;
  const averageAvailablePoints = Math.round(
    data.reduce((sum, item) => sum + item.userAvailablePoints, 0) / data.length,
  );

  // 商品类型占比（这里使用所需积分作为商品类型的划分）
  const productTypeMap = {
    低积分商品: 0,
    中积分商品: 0,
    高积分商品: 0,
  };
  data.forEach((item) => {
    if (item.requiredPoints <= 100) {
      productTypeMap['低积分商品']++;
    } else if (item.requiredPoints <= 250) {
      productTypeMap['中积分商品']++;
    } else {
      productTypeMap['高积分商品']++;
    }
  });
  const productTypeData = Object.entries(productTypeMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 适用范围占比
  const applyScopeMap = {};
  data.forEach((item) => {
    applyScopeMap[item.applyScope] = (applyScopeMap[item.applyScope] || 0) + 1;
  });
  const applyScopeData = Object.entries(applyScopeMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 商品兑换次数排名（这里使用剩余库存的倒数作为兑换次数的近似）
  const exchangeCountData = data
    .sort((a, b) => a.remainingStock - b.remainingStock)
    .slice(0, 5);
  const exchangeCountXAxis = exchangeCountData.map(
    (item) => item.exchangeProductName,
  );
  const exchangeCountSeries = exchangeCountData.map(
    (item) => 100 - item.remainingStock,
  );

  return {
    cards: [
      {
        title: '可兑换商品数',
        value: totalProducts,
        color: '#4A90E2',
      },
      {
        title: '热门商品数',
        value: hotProducts,
        color: '#50E3C2',
      },
      {
        title: '用户平均可用积分',
        value: averageAvailablePoints,
        color: '#FF9F40',
      },
    ],
    charts: [
      {
        title: '商品类型占比',
        type: 'pie',
        data: productTypeData,
      },
      {
        title: '适用范围占比',
        type: 'pie',
        data: applyScopeData,
      },
      {
        title: '商品兑换次数排名',
        type: 'bar',
        xAxis: exchangeCountXAxis,
        series: exchangeCountSeries,
      },
    ],
  };
}

/** 人工积分导入统计数据 */
function getManualPointsImportStatsData() {
  const data = manualPointsImportDataList();

  // 卡片数据
  const totalImports = data.length;
  const successImports = data.filter(
    (item) => item.importStatus === '成功',
  ).length;
  const totalImportPoints = data.reduce(
    (sum, item) => sum + item.importPoints,
    0,
  );

  // 导入方式占比
  const importTypeMap = {};
  data.forEach((item) => {
    importTypeMap[item.importType] = (importTypeMap[item.importType] || 0) + 1;
  });
  const importTypeData = Object.entries(importTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 导入原因占比
  const importReasonMap = {};
  data.forEach((item) => {
    importReasonMap[item.importReason] =
      (importReasonMap[item.importReason] || 0) + 1;
  });
  const importReasonData = Object.entries(importReasonMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 近30天导入积分趋势（这里使用导入时间排序，取最近的5条数据）
  const importTimeData = data
    .sort((a, b) => new Date(b.importTime) - new Date(a.importTime))
    .slice(0, 5);
  const importPointsXAxis = importTimeData.map((item) =>
    item.importTime.slice(5, 10),
  );
  const importPointsSeries = importTimeData.map((item) => item.importPoints);

  return {
    cards: [
      {
        title: '总导入次数',
        value: totalImports,
        color: '#4A90E2',
      },
      {
        title: '成功导入次数',
        value: successImports,
        color: '#50E3C2',
      },
      {
        title: '累计导入积分',
        value: totalImportPoints,
        color: '#FF9F40',
      },
    ],
    charts: [
      {
        title: '导入方式占比',
        type: 'pie',
        data: importTypeData,
      },
      {
        title: '导入原因占比',
        type: 'pie',
        data: importReasonData,
      },
      {
        title: '近30天导入积分趋势',
        type: 'bar',
        xAxis: importPointsXAxis,
        series: importPointsSeries,
      },
    ],
  };
}
