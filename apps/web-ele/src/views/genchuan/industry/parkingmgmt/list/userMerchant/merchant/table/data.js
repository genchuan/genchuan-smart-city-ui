import { maskPhone } from '#/utils/dataMask/index.js';

/** 区域数据映射 */
export const regionMap = {
  BJ: '北京市',
  SH: '上海市',
  GZ: '广州市',
  SZ: '深圳市',
  CD: '成都市',
  WH: '武汉市',
  NJ: '南京市',
  HZ: '杭州市',
  CQ: '重庆市',
  TJ: '天津市',
  XA: '西安市',
  KM: '昆明市',
};

/** 商户表静态数据 */
export const merchantList = [
  {
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    merchantCode: 'MC00001',
    contactPerson: '张三',
    contactPhone: '13800138001',
    address: '北京市朝阳区建国路88号',
    businessScope: ['零售贸易'],
    status: '正常',
    settlementRatio: 0.1,
    regionCode: 'BJ',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-02 14:30:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '测试商户1',
  },
  {
    merchantId: 'merchant002',
    merchantName: '李四科技有限公司',
    merchantCode: 'MC00002',
    contactPerson: '李四',
    contactPhone: '13800138002',
    address: '上海市浦东新区张江高科技园区',
    businessScope: ['科技服务'],
    status: '正常',
    settlementRatio: 0.15,
    regionCode: 'SH',
    createTime: '2024-01-02 11:30:00',
    updateTime: '2024-01-03 09:45:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '测试商户2',
  },
  {
    merchantId: 'merchant003',
    merchantName: '王五贸易有限公司',
    merchantCode: 'MC00003',
    contactPerson: '王五',
    contactPhone: '13800138003',
    address: '广州市天河区天河路385号',
    businessScope: ['进出口'],
    status: '禁用',
    settlementRatio: 0.12,
    regionCode: 'GZ',
    createTime: '2024-01-03 14:20:00',
    updateTime: '2024-01-04 10:15:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '测试商户3',
  },
  {
    merchantId: 'merchant004',
    merchantName: '赵六实业有限公司',
    merchantCode: 'MC00004',
    contactPerson: '赵六',
    contactPhone: '13800138004',
    address: '深圳市南山区科技园南区',
    businessScope: ['实业制造'],
    status: '注销',
    settlementRatio: 0.08,
    regionCode: 'SZ',
    createTime: '2024-01-04 09:15:00',
    updateTime: '2024-01-05 15:20:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '测试商户4',
  },
  {
    merchantId: 'merchant005',
    merchantName: '孙七政务服务中心',
    merchantCode: 'MC00005',
    contactPerson: '孙七',
    contactPhone: '13800138005',
    address: '北京市西城区政务服务中心',
    businessScope: ['政务服务'],
    status: '正常',
    settlementRatio: 0,
    regionCode: 'BJ',
    createTime: '2024-01-05 16:45:00',
    updateTime: '2024-01-06 13:10:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '政府机构',
  },
  {
    merchantId: 'merchant006',
    merchantName: '周八零售有限公司',
    merchantCode: 'MC00006',
    contactPerson: '周八',
    contactPhone: '13800138006',
    address: '成都市锦江区春熙路',
    businessScope: ['零售贸易', '餐饮娱乐'],
    status: '正常',
    settlementRatio: 0.09,
    regionCode: 'CD',
    createTime: '2024-01-06 10:30:00',
    updateTime: '2024-01-07 14:50:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '零售连锁',
  },
  {
    merchantId: 'merchant007',
    merchantName: '吴九制造有限公司',
    merchantCode: 'MC00007',
    contactPerson: '吴九',
    contactPhone: '13800138007',
    address: '武汉市洪山区光谷制造园',
    businessScope: ['实业制造'],
    status: '正常',
    settlementRatio: 0.11,
    regionCode: 'WH',
    createTime: '2024-01-07 14:20:00',
    updateTime: '2024-01-08 09:15:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '制造企业',
  },
  {
    merchantId: 'merchant008',
    merchantName: '郑十城市管理局',
    merchantCode: 'MC00008',
    contactPerson: '郑十',
    contactPhone: '13800138008',
    address: '南京市鼓楼区城市管理局',
    businessScope: ['公共管理'],
    status: '正常',
    settlementRatio: 0,
    regionCode: 'NJ',
    createTime: '2024-01-08 09:45:00',
    updateTime: '2024-01-09 15:20:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '政府机构',
  },
  {
    merchantId: 'merchant009',
    merchantName: '冯十一餐饮有限公司',
    merchantCode: 'MC00009',
    contactPerson: '冯十一',
    contactPhone: '13800138009',
    address: '杭州市西湖区餐饮街',
    businessScope: ['餐饮娱乐'],
    status: '正常',
    settlementRatio: 0.13,
    regionCode: 'HZ',
    createTime: '2024-01-09 13:10:00',
    updateTime: '2024-01-10 10:30:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '餐饮连锁',
  },
  {
    merchantId: 'merchant010',
    merchantName: '陈十二物流有限公司',
    merchantCode: 'MC00010',
    contactPerson: '陈十二',
    contactPhone: '13800138010',
    address: '重庆市渝北区物流园',
    businessScope: ['物流运输'],
    status: '正常',
    settlementRatio: 0.07,
    regionCode: 'CQ',
    createTime: '2024-01-10 11:20:00',
    updateTime: '2024-01-11 09:15:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '物流企业',
  },
  {
    merchantId: 'merchant011',
    merchantName: '褚十三交通管理局',
    merchantCode: 'MC00011',
    contactPerson: '褚十三',
    contactPhone: '13800138011',
    address: '天津市河东区交通管理局',
    businessScope: ['公共管理'],
    status: '正常',
    settlementRatio: 0,
    regionCode: 'TJ',
    createTime: '2024-01-11 15:45:00',
    updateTime: '2024-01-12 13:10:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '政府机构',
  },
  {
    merchantId: 'merchant012',
    merchantName: '卫十四教育咨询有限公司',
    merchantCode: 'MC00012',
    contactPerson: '卫十四',
    contactPhone: '13800138012',
    address: '深圳市南山区教育科技园',
    businessScope: ['教育培训'],
    status: '正常',
    settlementRatio: 0.14,
    regionCode: 'SZ',
    createTime: '2024-01-12 10:30:00',
    updateTime: '2024-01-13 14:50:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '教育机构',
  },
  {
    merchantId: 'merchant013',
    merchantName: '蒋十五建筑有限公司',
    merchantCode: 'MC00013',
    contactPerson: '蒋十五',
    contactPhone: '13800138013',
    address: '西安市雁塔区建筑产业园',
    businessScope: ['建筑工程'],
    status: '正常',
    settlementRatio: 0.1,
    regionCode: 'XA',
    createTime: '2024-01-13 14:20:00',
    updateTime: '2024-01-14 09:15:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '建筑企业',
  },
  {
    merchantId: 'merchant014',
    merchantName: '沈十六环境保护局',
    merchantCode: 'MC00014',
    contactPerson: '沈十六',
    contactPhone: '13800138014',
    address: '广州市天河区环保局',
    businessScope: ['公共管理'],
    status: '正常',
    settlementRatio: 0,
    regionCode: 'GZ',
    createTime: '2024-01-14 09:45:00',
    updateTime: '2024-01-15 15:20:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '政府机构',
  },
  {
    merchantId: 'merchant015',
    merchantName: '韩十七医疗科技有限公司',
    merchantCode: 'MC00015',
    contactPerson: '韩十七',
    contactPhone: '13800138015',
    address: '北京市海淀区医疗科技园',
    businessScope: ['医疗健康'],
    status: '正常',
    settlementRatio: 0.16,
    regionCode: 'BJ',
    createTime: '2024-01-15 13:10:00',
    updateTime: '2024-01-16 10:30:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '医疗科技',
  },
  {
    merchantId: 'merchant016',
    merchantName: '杨十八文化传媒有限公司',
    merchantCode: 'MC00016',
    contactPerson: '杨十八',
    contactPhone: '13800138016',
    address: '上海市静安区文化传媒园',
    businessScope: ['文化传媒'],
    status: '正常',
    settlementRatio: 0.12,
    regionCode: 'SH',
    createTime: '2024-01-16 11:20:00',
    updateTime: '2024-01-17 09:15:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '文化传媒',
  },
  {
    merchantId: 'merchant017',
    merchantName: '朱十九市场监督管理局',
    merchantCode: 'MC00017',
    contactPerson: '朱十九',
    contactPhone: '13800138017',
    address: '深圳市市场监督管理局',
    businessScope: ['公共管理'],
    status: '正常',
    settlementRatio: 0,
    regionCode: 'SZ',
    createTime: '2024-01-17 15:45:00',
    updateTime: '2024-01-18 13:10:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '政府机构',
  },
  {
    merchantId: 'merchant018',
    merchantName: '秦二十旅游咨询有限公司',
    merchantCode: 'MC00018',
    contactPerson: '秦二十',
    contactPhone: '13800138018',
    address: '昆明市官渡区旅游产业园',
    businessScope: ['旅游服务'],
    status: '正常',
    settlementRatio: 0.09,
    regionCode: 'KM',
    createTime: '2024-01-18 10:30:00',
    updateTime: '2024-01-19 14:50:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '旅游企业',
  },
  {
    merchantId: 'merchant019',
    merchantName: '尤二十一电子商务有限公司',
    merchantCode: 'MC00019',
    contactPerson: '尤二十一',
    contactPhone: '13800138019',
    address: '杭州市余杭区电商产业园',
    businessScope: ['电子商务'],
    status: '正常',
    settlementRatio: 0.11,
    regionCode: 'HZ',
    createTime: '2024-01-19 14:20:00',
    updateTime: '2024-01-20 09:15:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '电商企业',
  },
  {
    merchantId: 'merchant020',
    merchantName: '许二十二自然资源局',
    merchantCode: 'MC00020',
    contactPerson: '许二十二',
    contactPhone: '13800138020',
    address: '北京市海淀区自然资源局',
    businessScope: ['公共管理'],
    status: '正常',
    settlementRatio: 0,
    regionCode: 'BJ',
    createTime: '2024-01-20 09:45:00',
    updateTime: '2024-01-21 15:20:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '政府机构',
  },
];

/** 商户权限列表数据 */
export const permissionList = [
  {
    id: 'perm001',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    permCode: 'order:view',
    permName: '订单查看',
    effectiveTime: '2024-01-01 00:00:00',
    expireTime: '2025-01-01 00:00:00',
    status: '有效',
    changeBy: 'admin',
    changeTime: '2024-01-01 10:00:00',
    changeReason: '初始分配',
  },
  {
    id: 'perm002',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    permCode: 'order:export',
    permName: '订单导出',
    effectiveTime: '2024-01-01 00:00:00',
    expireTime: '2025-01-01 00:00:00',
    status: '有效',
    changeBy: 'admin',
    changeTime: '2024-01-01 10:00:00',
    changeReason: '初始分配',
  },
  {
    id: 'perm003',
    merchantId: 'merchant002',
    merchantName: '李四科技有限公司',
    permCode: 'charge:adjust',
    permName: '收费调整',
    effectiveTime: '2024-01-02 00:00:00',
    expireTime: '2025-01-02 00:00:00',
    status: '有效',
    changeBy: 'admin',
    changeTime: '2024-01-02 11:30:00',
    changeReason: '初始分配',
  },
  {
    id: 'perm004',
    merchantId: 'merchant003',
    merchantName: '王五贸易有限公司',
    permCode: 'report:view',
    permName: '报表查看',
    effectiveTime: '2024-01-03 00:00:00',
    expireTime: '2024-06-03 00:00:00',
    status: '过期',
    changeBy: 'admin',
    changeTime: '2024-01-03 14:20:00',
    changeReason: '临时权限',
  },
];

/** 结算单列表数据 */
export const settlementList = [
  {
    id: 'settle001',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    settleCycle: '2024-01',
    totalIncome: 10_000,
    deductAmount: 1000,
    actualPay: 9000,
    settleRatio: 0.1,
    settleThreshold: 100,
    payStatus: '已支付',
    payTime: '2024-02-05 14:30:00',
    payVoucher: 'http://example.com/voucher/settle001.pdf',
    createTime: '2024-02-01 00:00:00',
  },
  {
    id: 'settle002',
    merchantId: 'merchant002',
    merchantName: '李四科技有限公司',
    settleCycle: '2024-01',
    totalIncome: 15_000,
    deductAmount: 2250,
    actualPay: 12_750,
    settleRatio: 0.15,
    settleThreshold: 100,
    payStatus: '已支付',
    payTime: '2024-02-05 15:00:00',
    payVoucher: 'http://example.com/voucher/settle002.pdf',
    createTime: '2024-02-01 00:00:00',
  },
  {
    id: 'settle003',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    settleCycle: '2024-02',
    totalIncome: 12_000,
    deductAmount: 1200,
    actualPay: 10_800,
    settleRatio: 0.1,
    settleThreshold: 100,
    payStatus: '待支付',
    payTime: null,
    payVoucher: null,
    createTime: '2024-03-01 00:00:00',
  },
];

/** 权限变更日志数据 */
export const permissionChangeLogs = [
  {
    id: 'log001',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    changeTime: '2024-01-01 10:00:00',
    changeBy: 'admin',
    changeType: '新增',
    permName: '订单查看',
    changeReason: '初始分配',
    beforePerm: '',
    afterPerm: '订单查看',
  },
  {
    id: 'log002',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    changeTime: '2024-01-01 10:00:00',
    changeBy: 'admin',
    changeType: '新增',
    permName: '订单导出',
    changeReason: '初始分配',
    beforePerm: '',
    afterPerm: '订单导出',
  },
  {
    id: 'log003',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    changeTime: '2024-02-15 14:30:00',
    changeBy: 'admin',
    changeType: '修改',
    permName: '订单导出',
    changeReason: '扩展权限',
    beforePerm: '订单导出',
    afterPerm: '订单导出,订单退款',
  },
  {
    id: 'log004',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    changeTime: '2024-03-20 09:15:00',
    changeBy: 'admin',
    changeType: '新增',
    permName: '设备状态查看',
    changeReason: '新增设备管理权限',
    beforePerm: '',
    afterPerm: '设备状态查看',
  },
  {
    id: 'log005',
    merchantId: 'merchant001',
    merchantName: '张三商贸有限公司',
    changeTime: '2024-04-10 16:45:00',
    changeBy: 'admin',
    changeType: '删除',
    permName: '订单退款',
    changeReason: '权限回收',
    beforePerm: '订单退款',
    afterPerm: '',
  },
];

/** 权限查询结果数据 */
export const permissionQueryList = [
  {
    id: 'perm001',
    permCode: 'order:view',
    permName: '订单查看',
    permDesc: '查看名下停车场订单数据',
    effectiveTime: '2024-01-01 00:00:00',
    expireTime: '2025-01-01 00:00:00',
    status: '有效',
  },
  {
    id: 'perm002',
    permCode: 'order:export',
    permName: '订单导出',
    permDesc: '导出订单数据报表',
    effectiveTime: '2024-01-01 00:00:00',
    expireTime: '2025-01-01 00:00:00',
    status: '有效',
  },
  {
    id: 'perm003',
    permCode: 'device:view',
    permName: '设备状态查看',
    permDesc: '查看停车场设备运行状态',
    effectiveTime: '2024-03-20 00:00:00',
    expireTime: '2025-03-20 00:00:00',
    status: '有效',
  },
  {
    id: 'perm004',
    permCode: 'finance:settle',
    permName: '结算管理',
    permDesc: '查看和管理结算数据',
    effectiveTime: '2024-01-01 00:00:00',
    expireTime: '2025-01-01 00:00:00',
    status: '有效',
  },
  {
    id: 'perm005',
    permCode: 'report:view',
    permName: '报表查看',
    permDesc: '查看各类业务报表',
    effectiveTime: '2024-01-01 00:00:00',
    expireTime: '2025-01-01 00:00:00',
    status: '有效',
  },
];

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  // 生成区域选项
  const regionOptions = Object.entries(regionMap).map(([value, label]) => ({
    label,
    value,
  }));

  return [
    {
      fieldName: 'merchantId',
      label: '商户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'merchantCode',
      label: '商户编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'contactPerson',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
      rules: 'required',
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'address',
      label: '商户地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户地址',
      },
      rules: 'required',
    },
    {
      fieldName: 'regionCode',
      label: '所属区域',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属区域',
        options: regionOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'businessScope',
      label: '经营范围',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经营范围',
        type: 'textarea',
        rows: 3,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '禁用', value: '禁用' },
          { label: '注销', value: '注销' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'settlementRatio',
      label: '默认分账比例',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入分账比例',
        min: 0,
        max: 1,
        step: 0.01,
        precision: 2,
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
        rows: 3,
      },
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'merchantId',
      title: '商户ID',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'merchantName' },
    },
    {
      field: 'merchantCode',
      title: '商户编码',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'contactPerson',
      title: '联系人',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'address',
      title: '商户地址',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'regionCode',
      title: '所属区域',
      minWidth: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        return regionMap[cellValue] || '';
      },
    },
    {
      field: 'businessScope',
      title: '经营范围',
      minWidth: 200,
      sortable: true,
      formatter: ({ cellValue }) => {
        return Array.isArray(cellValue) ? cellValue.join('、') : cellValue;
      },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 150,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'settlementRatio',
      title: '分账比例',
      minWidth: 120,
      sortable: true,
      slots: { default: 'settlementRatio' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑商户',
  addText: '新增商户',
  excelName: '商户列表',
  excelAllName: '商户数据.xlsx',
  total: '商户数量20',
};

/** 详情抽屉字段配置 */
export const merchantDetailFields = [
  { key: 'merchantId', label: '商户ID' },
  { key: 'merchantName', label: '商户名称' },
  { key: 'merchantCode', label: '商户编码' },
  { key: 'contactPerson', label: '联系人' },
  {
    key: 'contactPhone',
    label: '联系电话',
    formatter: maskPhone,
  },
  { key: 'address', label: '商户地址' },
  {
    key: 'regionCode',
    label: '所属区域',
    formatter: (value) => regionMap[value] || '',
  },
  {
    key: 'businessScope',
    label: '经营范围',
    formatter: (value) => {
      return Array.isArray(value) ? value.join('、') : value;
    },
  },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: (value) => {
      if (value === '正常') {
        return 'success';
      } else if (value === '停业') {
        return 'warning';
      } else {
        return 'danger';
      }
    },
  },
  {
    key: 'settlementRatio',
    label: '分账比例',
    formatter: (value) => `${(value * 100).toFixed(2)}%`,
  },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'createBy', label: '创建人' },
  { key: 'updateBy', label: '更新人' },
  { key: 'remark', label: '备注' },
];

/** 获取商户统计数据 */
export const getMerchantStatsData = () => {
  // 获取所有商户数据
  const merchantData = merchantList;

  // 计算卡片数据
  const totalCount = merchantData.length;
  const normalCount = merchantData.filter(
    (item) => item.status === '正常',
  ).length;
  const disabledCount = merchantData.filter(
    (item) => item.status === '禁用' || item.status === '注销',
  ).length;

  // 计算商户状态占比数据
  const statusStats = {
    正常: normalCount,
    禁用: merchantData.filter((item) => item.status === '禁用').length,
    注销: merchantData.filter((item) => item.status === '注销').length,
  };

  // 计算经营范围占比数据
  const businessScopeStats = {};
  merchantData.forEach((merchant) => {
    if (Array.isArray(merchant.businessScope)) {
      merchant.businessScope.forEach((scope) => {
        businessScopeStats[scope] = (businessScopeStats[scope] || 0) + 1;
      });
    }
  });

  // 计算不同区域商户分布数据
  const regionStats = {};
  merchantData.forEach((merchant) => {
    const regionName = regionMap[merchant.regionCode] || '未知区域';
    regionStats[regionName] = (regionStats[regionName] || 0) + 1;
  });

  // 转换为echarts所需的数据格式
  const statusChartData = Object.entries(statusStats).map(([name, value]) => ({
    name,
    value,
  }));

  const businessScopeChartData = Object.entries(businessScopeStats).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const regionChartData = {
    xAxis: Object.keys(regionStats),
    series: Object.values(regionStats),
  };

  return {
    cards: [
      {
        title: '总商户数',
        value: totalCount,
        desc: `共${totalCount}家商户`,
        color: '#4A90E2',
      },
      {
        title: '正常商户数',
        value: normalCount,
        desc: `正常运营商户${normalCount}家`,
        color: '#13ce66',
      },
      {
        title: '禁用商户数',
        value: disabledCount,
        desc: `停业/注销商户${disabledCount}家`,
        color: '#FF6B8B',
      },
    ],
    charts: [
      {
        type: 'pie',
        title: '商户状态占比',
        data: statusChartData,
      },
      {
        type: 'pie',
        title: '商户经营范围占比',
        data: businessScopeChartData,
      },
      {
        type: 'bar',
        title: '不同区域商户分布',
        xAxis: regionChartData.xAxis,
        series: regionChartData.series,
      },
    ],
  };
};
