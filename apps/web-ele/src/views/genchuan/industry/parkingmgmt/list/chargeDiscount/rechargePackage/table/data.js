import { maskPhone } from '#/utils/genchuan/dataMask/index.js';

/** 充值套餐表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      packageId: 'RCP001',
      packageName: '月度充值套餐A',
      rechargeAmount: '100.00',
      giveAmountOrTime: '赠送10元',
      validDays: 30,
      rechargeTypeName: '满减充值',
      operator: '张三',
      salesCount: 1256,
      packageStatusName: '上架',
      createTime: '2025-01-10 09:20:30',
      lastSaleTime: '2025-02-20 14:30:00',
    },
    {
      packageId: 'RCP002',
      packageName: '季度充值套餐B',
      rechargeAmount: '300.00',
      giveAmountOrTime: '赠送50元',
      validDays: 90,
      rechargeTypeName: '满减充值',
      operator: '李四',
      salesCount: 856,
      packageStatusName: '上架',
      createTime: '2025-01-12 14:15:20',
      lastSaleTime: '2025-02-19 16:45:00',
    },
    {
      packageId: 'RCP003',
      packageName: '年度充值套餐C',
      rechargeAmount: '1000.00',
      giveAmountOrTime: '赠送200元',
      validDays: 365,
      rechargeTypeName: '满减充值',
      operator: '王五',
      salesCount: 345,
      packageStatusName: '上架',
      createTime: '2025-01-15 10:05:10',
      lastSaleTime: '2025-02-20 10:20:00',
    },
    {
      packageId: 'RCP004',
      packageName: '周末特惠充值',
      rechargeAmount: '50.00',
      giveAmountOrTime: '赠送5小时停车时长',
      validDays: 7,
      rechargeTypeName: '时长充值',
      operator: '赵六',
      salesCount: 2345,
      packageStatusName: '上架',
      createTime: '2025-01-18 08:30:45',
      lastSaleTime: '2025-02-20 08:15:00',
    },
    {
      packageId: 'RCP005',
      packageName: '企业大客户充值',
      rechargeAmount: '5000.00',
      giveAmountOrTime: '赠送1000元',
      validDays: 365,
      rechargeTypeName: '企业充值',
      operator: '孙七',
      salesCount: 56,
      packageStatusName: '上架',
      createTime: '2025-01-20 16:40:15',
      lastSaleTime: '2025-02-18 11:30:00',
    },
    {
      packageId: 'RCP006',
      packageName: '夜间充值套餐',
      rechargeAmount: '30.00',
      giveAmountOrTime: '赠送夜间2小时',
      validDays: 30,
      rechargeTypeName: '时长充值',
      operator: '周八',
      salesCount: 1890,
      packageStatusName: '下架',
      createTime: '2025-01-22 11:10:30',
      lastSaleTime: '2025-02-15 22:00:00',
    },
    {
      packageId: 'RCP007',
      packageName: '新手引导充值',
      rechargeAmount: '20.00',
      giveAmountOrTime: '赠送5元',
      validDays: 15,
      rechargeTypeName: '满减充值',
      operator: '吴九',
      salesCount: 3567,
      packageStatusName: '上架',
      createTime: '2025-01-25 13:25:40',
      lastSaleTime: '2025-02-20 09:45:00',
    },
    {
      packageId: 'RCP008',
      packageName: '家庭共享充值',
      rechargeAmount: '200.00',
      giveAmountOrTime: '赠送30元',
      validDays: 90,
      rechargeTypeName: '家庭充值',
      operator: '郑十',
      salesCount: 678,
      packageStatusName: '上架',
      createTime: '2025-01-28 09:50:25',
      lastSaleTime: '2025-02-19 15:20:00',
    },
    {
      packageId: 'RCP009',
      packageName: '老年优惠充值',
      rechargeAmount: '50.00',
      giveAmountOrTime: '赠送10元',
      validDays: 30,
      rechargeTypeName: '优惠充值',
      operator: '张三',
      salesCount: 890,
      packageStatusName: '下架',
      createTime: '2025-02-01 15:15:10',
      lastSaleTime: '2025-02-10 10:30:00',
    },
    {
      packageId: 'RCP010',
      packageName: '学生特惠充值',
      rechargeAmount: '30.00',
      giveAmountOrTime: '赠送5元',
      validDays: 30,
      rechargeTypeName: '优惠充值',
      operator: '李四',
      salesCount: 2345,
      packageStatusName: '上架',
      createTime: '2025-02-05 10:30:50',
      lastSaleTime: '2025-02-20 12:00:00',
    },
    {
      packageId: 'RCP011',
      packageName: '商务差旅充值',
      rechargeAmount: '500.00',
      giveAmountOrTime: '赠送80元',
      validDays: 30,
      rechargeTypeName: '商务充值',
      operator: '王五',
      salesCount: 567,
      packageStatusName: '上架',
      createTime: '2025-02-08 14:20:15',
      lastSaleTime: '2025-02-20 08:50:00',
    },
    {
      packageId: 'RCP012',
      packageName: '节假日充值特惠',
      rechargeAmount: '100.00',
      giveAmountOrTime: '赠送20元',
      validDays: 7,
      rechargeTypeName: '限时充值',
      operator: '赵六',
      salesCount: 1234,
      packageStatusName: '上架',
      createTime: '2025-02-10 09:40:30',
      lastSaleTime: '2025-02-19 16:10:00',
    },
    {
      packageId: 'RCP013',
      packageName: 'VIP尊享充值',
      rechargeAmount: '2000.00',
      giveAmountOrTime: '赠送500元',
      validDays: 365,
      rechargeTypeName: 'VIP充值',
      operator: '孙七',
      salesCount: 89,
      packageStatusName: '上架',
      createTime: '2025-02-12 11:25:00',
      lastSaleTime: '2025-02-20 14:00:00',
    },
    {
      packageId: 'RCP014',
      packageName: '临时体验充值',
      rechargeAmount: '10.00',
      giveAmountOrTime: '赠送1小时',
      validDays: 3,
      rechargeTypeName: '体验充值',
      operator: '周八',
      salesCount: 5678,
      packageStatusName: '下架',
      createTime: '2025-02-15 16:30:45',
      lastSaleTime: '2025-02-18 20:00:00',
    },
    {
      packageId: 'RCP015',
      packageName: '团队优惠充值',
      rechargeAmount: '1000.00',
      giveAmountOrTime: '赠送150元',
      validDays: 90,
      rechargeTypeName: '团队充值',
      operator: '吴九',
      salesCount: 234,
      packageStatusName: '上架',
      createTime: '2025-02-18 10:15:20',
      lastSaleTime: '2025-02-20 11:30:00',
    },
  ];
};

/** 充值套餐表单配置（包含所有指定字段） */
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
      fieldName: 'rechargeAmount',
      label: '充值金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入充值金额',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'giveAmountOrTime',
      label: '赠送金额/时长',
      component: 'Input',
      componentProps: {
        placeholder: '请输入赠送金额或时长',
      },
      rules: 'required',
    },
    {
      fieldName: 'validDays',
      label: '生效天数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入生效天数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'rechargeTypeName',
      label: '套餐类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择套餐类型',
        options: [
          { label: '满减充值', value: '满减充值' },
          { label: '时长充值', value: '时长充值' },
          { label: '企业充值', value: '企业充值' },
          { label: '家庭充值', value: '家庭充值' },
          { label: '优惠充值', value: '优惠充值' },
          { label: '商务充值', value: '商务充值' },
          { label: '限时充值', value: '限时充值' },
          { label: 'VIP充值', value: 'VIP充值' },
          { label: '体验充值', value: '体验充值' },
          { label: '团队充值', value: '团队充值' },
        ],
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
  ];
}

/** 充值套餐表格列配置 */
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
      slots: { default: 'packageName' },
    },
    {
      field: 'rechargeAmount',
      title: '充值金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'giveAmountOrTime',
      title: '赠送金额/时长',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'validDays',
      title: '生效天数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'rechargeTypeName',
      title: '套餐类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'rechargeTypeName' },
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
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑套餐',
  addText: '新增套餐',
  excelName: '充值套餐列表',
  excelAllName: '充值套餐数据.xlsx',
  total: ' 总计: 套餐数量15;总销量:21005;上架套餐12;下架套餐3',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'packageId', label: '套餐ID' },
  { key: 'packageName', label: '套餐名称' },
  { key: 'rechargeAmount', label: '充值金额' },
  { key: 'giveAmountOrTime', label: '赠送金额/时长' },
  { key: 'validDays', label: '生效天数' },
  { key: 'rechargeTypeName', label: '套餐类型' },
  { key: 'operator', label: '操作人' },
  { key: 'salesCount', label: '销量' },
  { key: 'packageStatusName', label: '状态' },
  { key: 'createTime', label: '创建时间' },
  { key: 'lastSaleTime', label: '最近销售时间' },
];

/** 充值套餐销售信息表格初始数据 - 按指定字段生成 */
export const salesDataList = () => {
  return [
    {
      packageName: '月度充值套餐A',
      timeRange: '2025-01-01 至 2025-01-31',
      rechargeStatus: '成功',
      userPhone: '13800138001',
      rechargeNo: 'RC202501010001',
      userName: '张三',
      rechargeAmount: '100.00',
      actualPayAmount: '100.00',
      giveAmountOrTime: '赠送10元',
      payType: '微信支付',
      rechargeTime: '2025-01-01 09:30:00',
    },
    {
      packageName: '季度充值套餐B',
      timeRange: '2025-01-01 至 2025-03-31',
      rechargeStatus: '成功',
      userPhone: '13800138002',
      rechargeNo: 'RC202501010002',
      userName: '李四',
      rechargeAmount: '300.00',
      actualPayAmount: '300.00',
      giveAmountOrTime: '赠送50元',
      payType: '支付宝',
      rechargeTime: '2025-01-01 10:15:00',
    },
    {
      packageName: '年度充值套餐C',
      timeRange: '2025-01-01 至 2025-12-31',
      rechargeStatus: '成功',
      userPhone: '13800138003',
      rechargeNo: 'RC202501010003',
      userName: '王五',
      rechargeAmount: '1000.00',
      actualPayAmount: '1000.00',
      giveAmountOrTime: '赠送200元',
      payType: '微信支付',
      rechargeTime: '2025-01-02 14:20:00',
    },
    {
      packageName: '周末特惠充值',
      timeRange: '2025-01-04 至 2025-01-10',
      rechargeStatus: '成功',
      userPhone: '13800138004',
      rechargeNo: 'RC202501040004',
      userName: '赵六',
      rechargeAmount: '50.00',
      actualPayAmount: '50.00',
      giveAmountOrTime: '赠送5小时停车时长',
      payType: '支付宝',
      rechargeTime: '2025-01-04 16:45:00',
    },
    {
      packageName: '企业大客户充值',
      timeRange: '2025-01-05 至 2025-12-31',
      rechargeStatus: '成功',
      userPhone: '13800138005',
      rechargeNo: 'RC202501050005',
      userName: '孙七',
      rechargeAmount: '5000.00',
      actualPayAmount: '5000.00',
      giveAmountOrTime: '赠送1000元',
      payType: '银行转账',
      rechargeTime: '2025-01-05 11:00:00',
    },
    {
      packageName: '新手引导充值',
      timeRange: '2025-01-06 至 2025-01-20',
      rechargeStatus: '成功',
      userPhone: '13800138006',
      rechargeNo: 'RC202501060006',
      userName: '周八',
      rechargeAmount: '20.00',
      actualPayAmount: '20.00',
      giveAmountOrTime: '赠送5元',
      payType: '微信支付',
      rechargeTime: '2025-01-06 09:15:00',
    },
    {
      packageName: '家庭共享充值',
      timeRange: '2025-01-07 至 2025-04-07',
      rechargeStatus: '成功',
      userPhone: '13800138007',
      rechargeNo: 'RC202501070007',
      userName: '吴九',
      rechargeAmount: '200.00',
      actualPayAmount: '200.00',
      giveAmountOrTime: '赠送30元',
      payType: '支付宝',
      rechargeTime: '2025-01-07 15:30:00',
    },
    {
      packageName: '学生特惠充值',
      timeRange: '2025-01-08 至 2025-02-08',
      rechargeStatus: '成功',
      userPhone: '13800138008',
      rechargeNo: 'RC202501080008',
      userName: '郑十',
      rechargeAmount: '30.00',
      actualPayAmount: '30.00',
      giveAmountOrTime: '赠送5元',
      payType: '微信支付',
      rechargeTime: '2025-01-08 10:45:00',
    },
    {
      packageName: '商务差旅充值',
      timeRange: '2025-01-09 至 2025-02-09',
      rechargeStatus: '失败',
      userPhone: '13800138009',
      rechargeNo: 'RC202501090009',
      userName: '王十一',
      rechargeAmount: '500.00',
      actualPayAmount: '500.00',
      giveAmountOrTime: '赠送80元',
      payType: '企业支付',
      rechargeTime: '2025-01-09 14:20:00',
    },
    {
      packageName: '节假日充值特惠',
      timeRange: '2025-01-10 至 2025-01-16',
      rechargeStatus: '成功',
      userPhone: '13800138010',
      rechargeNo: 'RC202501100010',
      userName: '赵十二',
      rechargeAmount: '100.00',
      actualPayAmount: '100.00',
      giveAmountOrTime: '赠送20元',
      payType: '微信支付',
      rechargeTime: '2025-01-10 11:30:00',
    },
    {
      packageName: 'VIP尊享充值',
      timeRange: '2025-01-11 至 2025-12-31',
      rechargeStatus: '成功',
      userPhone: '13800138011',
      rechargeNo: 'RC202501110011',
      userName: '孙十三',
      rechargeAmount: '2000.00',
      actualPayAmount: '2000.00',
      giveAmountOrTime: '赠送500元',
      payType: '银行转账',
      rechargeTime: '2025-01-11 16:00:00',
    },
    {
      packageName: '团队优惠充值',
      timeRange: '2025-01-12 至 2025-04-12',
      rechargeStatus: '处理中',
      userPhone: '13800138012',
      rechargeNo: 'RC202501120012',
      userName: '周十四',
      rechargeAmount: '1000.00',
      actualPayAmount: '1000.00',
      giveAmountOrTime: '赠送150元',
      payType: '企业支付',
      rechargeTime: '2025-01-12 10:15:00',
    },
  ];
};

/** 充值套餐销售信息表单配置（包含所有指定字段） */
export function useSalesFormSchema() {
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
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'Input',
      componentProps: {
        placeholder: '请输入时间范围',
      },
      rules: 'required',
    },
    {
      fieldName: 'rechargeStatus',
      label: '充值状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择充值状态',
        options: [
          { label: '成功', value: '成功' },
          { label: '失败', value: '失败' },
          { label: '处理中', value: '处理中' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'userPhone',
      label: '用户手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户手机号',
      },
      rules: 'required',
    },
    {
      fieldName: 'rechargeNo',
      label: '充值单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充值单号',
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
      fieldName: 'rechargeAmount',
      label: '充值金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入充值金额',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'actualPayAmount',
      label: '实付金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入实付金额',
        min: 0,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'giveAmountOrTime',
      label: '赠送金额/时长',
      component: 'Input',
      componentProps: {
        placeholder: '请输入赠送金额或时长',
      },
      rules: 'required',
    },
    {
      fieldName: 'payType',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '微信支付', value: '微信支付' },
          { label: '支付宝', value: '支付宝' },
          { label: '银行转账', value: '银行转账' },
          { label: '企业支付', value: '企业支付' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'rechargeTime',
      label: '充值时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择充值时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
  ];
}

/** 充值套餐销售信息表格列配置 */
export function useSalesGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'packageName',
      title: '套餐名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'timeRange',
      title: '时间范围',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'rechargeStatus',
      title: '充值状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'rechargeStatus' },
    },
    {
      field: 'userPhone',
      title: '用户手机号',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return maskPhone(cellValue);
      },
    },
    {
      field: 'rechargeNo',
      title: '充值单号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'rechargeNo' },
    },
    {
      field: 'userName',
      title: '用户姓名',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'rechargeAmount',
      title: '充值金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'actualPayAmount',
      title: '实付金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'giveAmountOrTime',
      title: '赠送金额/时长',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'payType',
      title: '支付方式',
      minWidth: 100,
      sortable: true,
      slots: { default: 'payType' },
    },
    {
      field: 'rechargeTime',
      title: '充值时间',
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

/** 充值套餐销售信息详情抽屉字段配置 */
export const salesDetailFields = [
  { key: 'packageName', label: '套餐名称' },
  { key: 'timeRange', label: '时间范围' },
  { key: 'rechargeStatus', label: '充值状态' },
  { key: 'userPhone', label: '用户手机号', formatter: maskPhone },
  { key: 'rechargeNo', label: '充值单号' },
  { key: 'userName', label: '用户姓名' },
  { key: 'rechargeAmount', label: '充值金额' },
  { key: 'actualPayAmount', label: '实付金额' },
  { key: 'giveAmountOrTime', label: '赠送金额/时长' },
  { key: 'payType', label: '支付方式' },
  { key: 'rechargeTime', label: '充值时间' },
];

/** 充值套餐销售信息文本对象 */
export const salesTextObj = {
  editText: '编辑销售记录',
  addText: '新增销售记录',
  excelName: '充值套餐销售记录列表',
  excelAllName: '充值套餐销售记录数据.xlsx',
  total: ' 总计: 销售记录数量12; 成功12; 失败0; 处理中0',
};

/** 根据标签类型获取对应统计数据 */
export const getStatsDataByTabType = (tabType) => {
  // 获取对应标签类型的实际数据
  const data = tabType === 'sales' ? salesDataList() : dataList();

  // 根据不同标签类型生成统计数据
  switch (tabType) {
    case 'sales': {
      // 充值套餐销售信息统计
      const totalCount = data.length;
      const successCount = data.filter(
        (item) => item.rechargeStatus === '成功',
      ).length;
      const failedCount = data.filter(
        (item) => item.rechargeStatus === '失败',
      ).length;

      // 统计不同支付方式的数量
      const payTypeStats = {};
      data.forEach((item) => {
        payTypeStats[item.payType] = (payTypeStats[item.payType] || 0) + 1;
      });

      // 统计不同充值状态的数量
      const rechargeStatusStats = {
        成功: data.filter((item) => item.rechargeStatus === '成功').length,
        失败: data.filter((item) => item.rechargeStatus === '失败').length,
        处理中: data.filter((item) => item.rechargeStatus === '处理中').length,
        退款: data.filter((item) => item.rechargeStatus === '退款').length,
      };

      // 生成充值金额趋势（近7天）
      const days = [
        '1月20日',
        '1月21日',
        '1月22日',
        '1月23日',
        '1月24日',
        '1月25日',
        '1月26日',
      ];
      const amountTrend = days.map(
        () => Math.floor(Math.random() * 5000) + 1000,
      );

      return {
        cards: [
          {
            title: '总充值笔数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '成功充值笔数',
            value: successCount,
            desc: `成功率${Math.round((successCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '失败充值笔数',
            value: failedCount,
            desc: `失败率${Math.round((failedCount / totalCount) * 100)}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '支付方式占比',
            type: 'pie',
            data: Object.entries(payTypeStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '充值状态占比',
            type: 'pie',
            data: Object.entries(rechargeStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '充值金额趋势',
            type: 'line',
            xAxis: days,
            series: amountTrend,
          },
        ],
      };
    }
    case 'package':
    default: {
      // 充值套餐信息统计
      const totalCount = data.length;
      const onlineCount = data.filter(
        (item) => item.packageStatusName === '上架',
      ).length;
      const offlineCount = data.filter(
        (item) => item.packageStatusName === '下架',
      ).length;

      // 统计不同套餐状态的数量
      const packageStatusStats = {
        上架: data.filter((item) => item.packageStatusName === '上架').length,
        下架: data.filter((item) => item.packageStatusName === '下架').length,
      };

      // 统计不同套餐类型的数量
      const rechargeTypeStats = {};
      data.forEach((item) => {
        rechargeTypeStats[item.rechargeTypeName] =
          (rechargeTypeStats[item.rechargeTypeName] || 0) + 1;
      });

      // 统计套餐销量排名（取前5）
      const salesRank = data
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 5);
      const packageNames = salesRank.map((item) => item.packageName);
      const salesCounts = salesRank.map((item) => item.salesCount);

      return {
        cards: [
          {
            title: '总套餐数',
            value: totalCount,
            desc: `较上月增长${Math.floor(Math.random() * 10) + 5}%`,
            color: '#13ce66',
          },
          {
            title: '上架套餐数',
            value: onlineCount,
            desc: `上架率${Math.round((onlineCount / totalCount) * 100)}%`,
            color: '#4ECDC4',
          },
          {
            title: '下架套餐数',
            value: offlineCount,
            desc: `下架率${Math.round((offlineCount / totalCount) * 100)}%`,
            color: '#FF6B6B',
          },
        ],
        charts: [
          {
            title: '套餐状态占比',
            type: 'pie',
            data: Object.entries(packageStatusStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '套餐类型占比',
            type: 'pie',
            data: Object.entries(rechargeTypeStats)
              .filter(([_, value]) => value > 0)
              .map(([name, value]) => ({
                value: Math.round((value / totalCount) * 100),
                name,
              })),
          },
          {
            title: '套餐销量排名',
            type: 'bar',
            xAxis: packageNames,
            series: salesCounts,
          },
        ],
      };
    }
  }
};
