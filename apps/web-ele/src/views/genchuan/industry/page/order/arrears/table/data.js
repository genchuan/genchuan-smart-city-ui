/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      "arrearsNumber": "AQ20260120001",
      "userName": "张三",
      "plateNumber": "闽EJ5689",
      "parkName": "龙文区碧湖公园停车场",
      "arrearsAmount": "80.00元",
      "arrearsTime": "2026-01-15 09:15:32",
      "arrearsOrderCount": 3,
      "arrearsStatus": "待追缴",
      "recoveryTimes": 0,
      "lastRecoveryTime": "",
      "region": "龙文区"
    },
    {
      "arrearsNumber": "AQ20260120002",
      "userName": "李四",
      "plateNumber": "闽EK3210",
      "parkName": "龙文区万达商圈停车场",
      "arrearsAmount": "120.00元",
      "arrearsTime": "2026-01-10 06:30:18",
      "arrearsOrderCount": 5,
      "arrearsStatus": "追缴中",
      "recoveryTimes": 2,
      "lastRecoveryTime": "2026-01-18 14:30:25",
      "region": "龙文区"
    },
    {
      "arrearsNumber": "AQ20260120003",
      "userName": "王五",
      "plateNumber": "闽EL8976",
      "parkName": "芗城区江滨路生态停车场",
      "arrearsAmount": "150.00元",
      "arrearsTime": "2026-01-08 22:45:06",
      "arrearsOrderCount": 2,
      "arrearsStatus": "已追缴",
      "recoveryTimes": 3,
      "lastRecoveryTime": "2026-01-19 10:30:40",
      "region": "芗城区"
    },
    {
      "arrearsNumber": "AQ20260120004",
      "userName": "赵六",
      "plateNumber": "闽EM2345",
      "parkName": "龙文区步文街道停车场",
      "arrearsAmount": "50.00元",
      "arrearsTime": "2026-01-12 10:05:20",
      "arrearsOrderCount": 1,
      "arrearsStatus": "待追缴",
      "recoveryTimes": 0,
      "lastRecoveryTime": "",
      "region": "龙文区"
    },
    {
      "arrearsNumber": "AQ20260120005",
      "userName": "孙七",
      "plateNumber": "闽EN7890",
      "parkName": "长泰区武安镇公共停车场",
      "arrearsAmount": "200.00元",
      "arrearsTime": "2026-01-05 18:30:45",
      "arrearsOrderCount": 4,
      "arrearsStatus": "追缴中",
      "recoveryTimes": 1,
      "lastRecoveryTime": "2026-01-15 09:31:35",
      "region": "长泰区"
    },
    {
      "arrearsNumber": "AQ20260120006",
      "userName": "周八",
      "plateNumber": "闽EO1234",
      "parkName": "龙海区闽齐社区停车场",
      "arrearsAmount": "70.00元",
      "arrearsTime": "2026-01-11 08:10:12",
      "arrearsOrderCount": 2,
      "arrearsStatus": "追缴失败",
      "recoveryTimes": 5,
      "lastRecoveryTime": "2026-01-20 08:32:00",
      "region": "龙海区"
    },
    {
      "arrearsNumber": "AQ20260120007",
      "userName": "吴九",
      "plateNumber": "闽EP6789",
      "parkName": "漳浦县绥安镇停车场",
      "arrearsAmount": "90.00元",
      "arrearsTime": "2026-01-09 07:45:30",
      "arrearsOrderCount": 1,
      "arrearsStatus": "待追缴",
      "recoveryTimes": 0,
      "lastRecoveryTime": "",
      "region": "漳浦县"
    },
    {
      "arrearsNumber": "AQ20260120008",
      "userName": "郑十",
      "plateNumber": "闽EQ5432",
      "parkName": "芗城区东铺头街道停车场",
      "arrearsAmount": "180.00元",
      "arrearsTime": "2026-01-07 20:15:00",
      "arrearsOrderCount": 3,
      "arrearsStatus": "追缴中",
      "recoveryTimes": 2,
      "lastRecoveryTime": "2026-01-18 16:32:50",
      "region": "芗城区"
    },
    {
      "arrearsNumber": "AQ20260120009",
      "userName": "钱十一",
      "plateNumber": "闽ER9876",
      "parkName": "云霄县云陵镇停车场",
      "arrearsAmount": "60.00元",
      "arrearsTime": "2026-01-13 09:40:15",
      "arrearsOrderCount": 1,
      "arrearsStatus": "已追缴",
      "recoveryTimes": 1,
      "lastRecoveryTime": "2026-01-19 11:33:15",
      "region": "云霄县"
    },
    {
      "arrearsNumber": "AQ20260120010",
      "userName": "孙十二",
      "plateNumber": "闽ES8765",
      "parkName": "平和县小溪镇停车场",
      "arrearsAmount": "220.00元",
      "arrearsTime": "2026-01-03 23:30:22",
      "arrearsOrderCount": 4,
      "arrearsStatus": "追缴失败",
      "recoveryTimes": 4,
      "lastRecoveryTime": "2026-01-19 18:33:40",
      "region": "平和县"
    }
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
/** 停车欠费追缴数据 - 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'arrearsNumber',
      label: '欠费单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入欠费单号（如：AQ20260120001）',
        disabled: true // 欠费单号自动生成，禁用输入
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
      fieldName: 'parkName',
      label: '所属车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属车场名称',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'arrearsAmount',
      label: '欠费金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入欠费金额（如：80.00元）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'arrearsTime',
      label: '欠费时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入欠费时间（格式：YYYY-MM-DD HH:mm:ss）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'arrearsOrderCount',
      label: '欠费订单数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入欠费订单数（如：3）',
        type: 'number',
        min: 1
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
          { label: '待追缴', value: '待追缴' },
          { label: '追缴中', value: '追缴中' },
          { label: '已追缴', value: '已追缴' },
          { label: '追缴失败', value: '追缴失败' },
        ],
        placeholder: '请选择欠费状态',
        showSearch: true,
      },
      defaultValue: '待追缴',
      fieldName: 'arrearsStatus',
      label: '欠费状态',
      rules: 'required',
    },
    {
      fieldName: 'recoveryTimes',
      label: '追缴次数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入追缴次数（如：2）',
        type: 'number',
        min: 0,
        disabled: true // 追缴次数自动累计，禁用输入
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'lastRecoveryTime',
      label: '最后追缴时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入最后追缴时间（格式：YYYY-MM-DD HH:mm:ss）',
        disabled: true // 最后追缴时间自动记录，禁用输入
      },
      labelWidth: '100',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '龙文区', value: '龙文区' },
          { label: '芗城区', value: '芗城区' },
          { label: '长泰区', value: '长泰区' },
          { label: '龙海区', value: '龙海区' },
          { label: '漳浦县', value: '漳浦县' },
          { label: '云霄县', value: '云霄县' },
          { label: '平和县', value: '平和县' },
        ],
        placeholder: '请选择所属区域',
        showSearch: true,
      },
      fieldName: 'region',
      label: '所属区域',
      rules: 'required',
    },
  ];
}

/** 表格字段 */
/** 停车欠费追缴数据 - 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'arrearsNumber',
      title: '欠费单号',
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
      field: 'parkName',
      title: '所属车场',
      minWidth: 200,
      sortable: true,
      slots: { default: 'parkName' },
    },
    {
      field: 'arrearsAmount',
      title: '欠费金额',
      minWidth: 100,
      sortable: true, 
    },
    {
      field: 'arrearsTime',
      title: '欠费时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'arrearsOrderCount',
      title: '欠费订单数',
      minWidth: 100,
      sortable: true, 
    },
    {
      field: 'arrearsStatus',
      title: '欠费状态',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'recoveryTimes',
      title: '追缴次数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'lastRecoveryTime',
      title: '最后追缴时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'region',
      title: '所属区域',
      minWidth: 100,
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

/** 停车欠费追缴数据 - 文字描述对象 */
export const textObj = {
  editText: '编辑停车欠费追缴信息',
  addText: '新增停车欠费追缴信息',
  excelName: '停车欠费追缴列表',
  excelAllName: '全市停车欠费追缴数据.xlsx',
  total: '欠费订单数量10;涉及区域7;已追缴订单2',
};