/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      "rechargeNumber": "CZ20260120001",
      "userName": "张三",
      "plateNumber": "闽EJ5689",
      "rechargePackage": "50元套餐",
      "customAmount": "0.00元",
      "discountAmount": "5.00元",
      "actualPayment": "45.00元",
      "paymentMethod": "微信支付",
      "rechargeStatus": "已到账",
      "arrivalTime": "2026-01-20 09:15:32",
      "walletBalance": "285.00元",
      "rechargeTime": "2026-01-20 09:15:00"
    },
    {
      "rechargeNumber": "CZ20260120002",
      "userName": "李四",
      "plateNumber": "闽EK3210",
      "rechargePackage": "100元套餐",
      "customAmount": "0.00元",
      "discountAmount": "10.00元",
      "actualPayment": "90.00元",
      "paymentMethod": "支付宝",
      "rechargeStatus": "已到账",
      "arrivalTime": "2026-01-20 06:30:18",
      "walletBalance": "590.00元",
      "rechargeTime": "2026-01-20 06:30:00"
    },
    {
      "rechargeNumber": "CZ20260120003",
      "userName": "王五",
      "plateNumber": "闽EL8976",
      "rechargePackage": "自定义金额",
      "customAmount": "200.00元",
      "discountAmount": "15.00元",
      "actualPayment": "185.00元",
      "paymentMethod": "银联支付",
      "rechargeStatus": "已到账",
      "arrivalTime": "2026-01-19 22:45:06",
      "walletBalance": "885.00元",
      "rechargeTime": "2026-01-19 22:44:30"
    },
    {
      "rechargeNumber": "CZ20260120004",
      "userName": "赵六",
      "plateNumber": "闽EM2345",
      "rechargePackage": "200元套餐",
      "customAmount": "0.00元",
      "discountAmount": "20.00元",
      "actualPayment": "180.00元",
      "paymentMethod": "微信支付",
      "rechargeStatus": "已到账",
      "arrivalTime": "2026-01-20 10:05:20",
      "walletBalance": "680.00元",
      "rechargeTime": "2026-01-20 10:05:00"
    },
    {
      "rechargeNumber": "CZ20260120005",
      "userName": "孙七",
      "plateNumber": "闽EN7890",
      "rechargePackage": "自定义金额",
      "customAmount": "500.00元",
      "discountAmount": "40.00元",
      "actualPayment": "460.00元",
      "paymentMethod": "支付宝",
      "rechargeStatus": "处理中",
      "arrivalTime": "",
      "walletBalance": "320.00元",
      "rechargeTime": "2026-01-19 18:30:45"
    },
    {
      "rechargeNumber": "CZ20260120006",
      "userName": "周八",
      "plateNumber": "闽EO1234",
      "rechargePackage": "100元套餐",
      "customAmount": "0.00元",
      "discountAmount": "8.00元",
      "actualPayment": "92.00元",
      "paymentMethod": "微信支付",
      "rechargeStatus": "充值失败",
      "arrivalTime": "",
      "walletBalance": "150.00元",
      "rechargeTime": "2026-01-20 08:10:12"
    },
    {
      "rechargeNumber": "CZ20260120007",
      "userName": "吴九",
      "plateNumber": "闽EP6789",
      "rechargePackage": "50元套餐",
      "customAmount": "0.00元",
      "discountAmount": "5.00元",
      "actualPayment": "45.00元",
      "paymentMethod": "银联支付",
      "rechargeStatus": "已到账",
      "arrivalTime": "2026-01-20 07:45:30",
      "walletBalance": "345.00元",
      "rechargeTime": "2026-01-20 07:45:00"
    },
    {
      "rechargeNumber": "CZ20260120008",
      "userName": "郑十",
      "plateNumber": "闽EQ5432",
      "rechargePackage": "自定义金额",
      "customAmount": "300.00元",
      "discountAmount": "25.00元",
      "actualPayment": "275.00元",
      "paymentMethod": "支付宝",
      "rechargeStatus": "已到账",
      "arrivalTime": "2026-01-19 20:15:00",
      "walletBalance": "975.00元",
      "rechargeTime": "2026-01-19 20:14:20"
    },
    {
      "rechargeNumber": "CZ20260120009",
      "userName": "钱十一",
      "plateNumber": "闽ER9876",
      "rechargePackage": "200元套餐",
      "customAmount": "0.00元",
      "discountAmount": "18.00元",
      "actualPayment": "182.00元",
      "paymentMethod": "微信支付",
      "rechargeStatus": "已到账",
      "arrivalTime": "2026-01-20 09:40:15",
      "walletBalance": "782.00元",
      "rechargeTime": "2026-01-20 09:40:00"
    },
    {
      "rechargeNumber": "CZ20260120010",
      "userName": "孙十二",
      "plateNumber": "闽ES8765",
      "rechargePackage": "自定义金额",
      "customAmount": "1000.00元",
      "discountAmount": "80.00元",
      "actualPayment": "920.00元",
      "paymentMethod": "银联支付",
      "rechargeStatus": "处理中",
      "arrivalTime": "",
      "walletBalance": "560.00元",
      "rechargeTime": "2026-01-19 23:30:22"
    }
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
/** 停车充值管理数据 - 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'rechargeNumber',
      label: '充值单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充值单号（如：CZ20260120001）',
        disabled: true // 充值单号自动生成，禁用输入
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'userName',
      label: '用户姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户姓名',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'plateNumber',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码（如：闽E12345）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '50元套餐', value: '50元套餐' },
          { label: '100元套餐', value: '100元套餐' },
          { label: '200元套餐', value: '200元套餐' },
          { label: '自定义金额', value: '自定义金额' },
        ],
        placeholder: '请选择充值套餐',
        showSearch: true,
      },
      fieldName: 'rechargePackage',
      label: '充值套餐',
      rules: 'required',
    },
    {
      fieldName: 'customAmount',
      label: '自定义金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入自定义金额（如：200.00元）',
        disabled: true // 自定义金额根据套餐选择联动控制，先禁用
      },
      labelWidth: '100',
    },
    {
      fieldName: 'discountAmount',
      label: '优惠金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优惠金额（如：5.00元）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'actualPayment',
      label: '实付金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入实付金额（如：45.00元）',
        disabled: true // 实付金额自动计算，禁用输入
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '微信支付', value: '微信支付' },
          { label: '支付宝', value: '支付宝' },
          { label: '银联支付', value: '银联支付' },
        ],
        placeholder: '请选择支付方式',
        showSearch: true,
      },
      fieldName: 'paymentMethod',
      label: '支付方式',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '处理中', value: '处理中' },
          { label: '已到账', value: '已到账' },
          { label: '充值失败', value: '充值失败' },
        ],
        placeholder: '请选择充值状态',
        showSearch: true,
      },
      fieldName: 'rechargeStatus',
      label: '充值状态',
      rules: 'required',
    },
    {
      fieldName: 'arrivalTime',
      label: '到账时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入到账时间（格式：YYYY-MM-DD HH:mm:ss）',
        disabled: true // 到账时间自动记录，禁用输入
      },
      labelWidth: '100',
    },
    {
      fieldName: 'walletBalance',
      label: '钱包余额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入钱包余额（如：285.00元）',
        disabled: true // 钱包余额自动更新，禁用输入
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'rechargeTime',
      label: '充值时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入充值时间（格式：YYYY-MM-DD HH:mm:ss）',
        disabled: true // 充值时间自动记录，禁用输入
      },
      labelWidth: '100',
      rules: 'required',
    },
  ];
}

/** 表格字段 */
/** 停车充值管理数据 - 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'rechargeNumber',
      title: '充值单号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'userName',
      title: '用户姓名',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'plateNumber',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'rechargePackage',
      title: '充值套餐',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'customAmount',
      title: '自定义金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'discountAmount',
      title: '优惠金额',
      minWidth: 100,
      sortable: true, 
    },
    {
      field: 'actualPayment',
      title: '实付金额',
      minWidth: 100,
      sortable: true, 
    },
    {
      field: 'paymentMethod',
      title: '支付方式',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'rechargeStatus',
      title: '充值状态',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'arrivalTime',
      title: '到账时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'walletBalance',
      title: '钱包余额',
      minWidth: 120,
      sortable: true,
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

/** 停车充值管理数据 - 文字描述对象 */
export const textObj = {
  editText: '编辑停车充值信息',
  addText: '新增停车充值信息',
  excelName: '停车充值列表',
  excelAllName: '全市停车充值数据.xlsx',
  total: '充值订单数量10;支付方式3种;已到账订单7',
};