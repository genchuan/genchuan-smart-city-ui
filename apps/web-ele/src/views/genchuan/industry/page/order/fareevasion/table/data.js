/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      "evasionNumber": "EF20260120001",
      "originalOrderNumber": "PK20260120001",
      "plateNumber": "闽EJ5689",
      "parkName": "龙文区碧湖公园停车场",
      "evasionAmount": "80.00元",
      "evasionTime": "2026-01-20 11:15:32",
      "evasionType": "离场未缴费",
      "recognitionMethod": "车牌识别",
      "blacklistStatus": "已加入",
      "recognitionTime": "2026-01-20 11:20:32",
      "processingStatus": "待追缴"
    },
    {
      "evasionNumber": "EF20260120002",
      "originalOrderNumber": "PK20260120002",
      "plateNumber": "闽EK3210",
      "parkName": "龙文区万达商圈停车场",
      "evasionAmount": "120.00元",
      "evasionTime": "2026-01-20 08:30:18",
      "evasionType": "套牌逃费",
      "recognitionMethod": "视频监控识别",
      "blacklistStatus": "已加入",
      "recognitionTime": "2026-01-20 08:40:18",
      "processingStatus": "追缴中"
    },
    {
      "evasionNumber": "EF20260120003",
      "originalOrderNumber": "PK20260120003",
      "plateNumber": "闽EL8976",
      "parkName": "芗城区江滨路生态停车场",
      "evasionAmount": "150.00元",
      "evasionTime": "2026-01-20 10:45:06",
      "evasionType": "超时未缴费",
      "recognitionMethod": "地磁+摄像头识别",
      "blacklistStatus": "待审核",
      "recognitionTime": "2026-01-20 10:50:06",
      "processingStatus": "已追缴"
    },
    {
      "evasionNumber": "EF20260120004",
      "originalOrderNumber": "PK20260120004",
      "plateNumber": "闽EM2345",
      "parkName": "龙文区步文街道停车场",
      "evasionAmount": "50.00元",
      "evasionTime": "2026-01-20 12:05:20",
      "evasionType": "离场未缴费",
      "recognitionMethod": "车牌识别",
      "blacklistStatus": "已加入",
      "recognitionTime": "2026-01-20 12:10:20",
      "processingStatus": "待追缴"
    },
    {
      "evasionNumber": "EF20260120005",
      "originalOrderNumber": "PK20260120005",
      "plateNumber": "闽EN7890",
      "parkName": "长泰区武安镇公共停车场",
      "evasionAmount": "200.00元",
      "evasionTime": "2026-01-20 09:30:45",
      "evasionType": "恶意逃费",
      "recognitionMethod": "人工核实",
      "blacklistStatus": "已加入",
      "recognitionTime": "2026-01-20 09:40:45",
      "processingStatus": "追缴中"
    },
    {
      "evasionNumber": "EF20260120006",
      "originalOrderNumber": "PK20260120006",
      "plateNumber": "闽EO1234",
      "parkName": "龙海区闽齐社区停车场",
      "evasionAmount": "70.00元",
      "evasionTime": "2026-01-20 11:10:12",
      "evasionType": "离场未缴费",
      "recognitionMethod": "车牌识别",
      "blacklistStatus": "待审核",
      "recognitionTime": "2026-01-20 11:15:12",
      "processingStatus": "已追缴"
    },
    {
      "evasionNumber": "EF20260120007",
      "originalOrderNumber": "PK20260120007",
      "plateNumber": "闽EP6789",
      "parkName": "漳浦县绥安镇停车场",
      "evasionAmount": "90.00元",
      "evasionTime": "2026-01-20 09:45:30",
      "evasionType": "超时未缴费",
      "recognitionMethod": "视频监控识别",
      "blacklistStatus": "已加入",
      "recognitionTime": "2026-01-20 09:55:30",
      "processingStatus": "待追缴"
    },
    {
      "evasionNumber": "EF20260120008",
      "originalOrderNumber": "PK20260120008",
      "plateNumber": "闽EQ5432",
      "parkName": "芗城区东铺头街道停车场",
      "evasionAmount": "180.00元",
      "evasionTime": "2026-01-20 12:15:00",
      "evasionType": "套牌逃费",
      "recognitionMethod": "人工核实",
      "blacklistStatus": "已加入",
      "recognitionTime": "2026-01-20 12:25:00",
      "processingStatus": "追缴中"
    },
    {
      "evasionNumber": "EF20260120009",
      "originalOrderNumber": "PK20260120009",
      "plateNumber": "闽ER9876",
      "parkName": "云霄县云陵镇停车场",
      "evasionAmount": "60.00元",
      "evasionTime": "2026-01-20 11:40:15",
      "evasionType": "离场未缴费",
      "recognitionMethod": "车牌识别",
      "blacklistStatus": "待审核",
      "recognitionTime": "2026-01-20 11:45:15",
      "processingStatus": "已追缴"
    },
    {
      "evasionNumber": "EF20260120010",
      "originalOrderNumber": "PK20260120010",
      "plateNumber": "闽ES8765",
      "parkName": "平和县小溪镇停车场",
      "evasionAmount": "220.00元",
      "evasionTime": "2026-01-20 00:30:22",
      "evasionType": "恶意逃费",
      "recognitionMethod": "地磁+摄像头识别",
      "blacklistStatus": "已加入",
      "recognitionTime": "2026-01-20 00:40:22",
      "processingStatus": "追缴失败"
    }
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
/** 停车逃费订单数据 - 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'evasionNumber',
      label: '逃费单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入逃费单号（如：EF20260120001）',
        disabled: true // 逃费单号自动生成，禁用输入
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'originalOrderNumber',
      label: '原订单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入原订单编号（如：PK20260120001）',
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
      fieldName: 'evasionAmount',
      label: '逃费金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入逃费金额（如：80.00元）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'evasionTime',
      label: '逃费时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入逃费时间（格式：YYYY-MM-DD HH:mm:ss）',
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
          { label: '离场未缴费', value: '离场未缴费' },
          { label: '超时未缴费', value: '超时未缴费' },
          { label: '套牌逃费', value: '套牌逃费' },
          { label: '恶意逃费', value: '恶意逃费' },
        ],
        placeholder: '请选择逃费类型',
        showSearch: true,
      },
      defaultValue: '离场未缴费',
      fieldName: 'evasionType',
      label: '逃费类型',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '车牌识别', value: '车牌识别' },
          { label: '视频监控识别', value: '视频监控识别' },
          { label: '地磁+摄像头识别', value: '地磁+摄像头识别' },
          { label: '人工核实', value: '人工核实' },
        ],
        placeholder: '请选择识别方式',
        showSearch: true,
      },
      defaultValue: '车牌识别',
      fieldName: 'recognitionMethod',
      label: '识别方式',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已加入', value: '已加入' },
          { label: '已移除', value: '已移除' },
        ],
        placeholder: '请选择黑名单状态',
        showSearch: true,
      },
      defaultValue: '待审核',
      fieldName: 'blacklistStatus',
      label: '黑名单状态',
      rules: 'required',
    },
    {
      fieldName: 'recognitionTime',
      label: '识别时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入识别时间（格式：YYYY-MM-DD HH:mm:ss）',
        disabled: true // 识别时间自动记录，禁用输入
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
        placeholder: '请选择处理状态',
        showSearch: true,
      },
      defaultValue: '待追缴',
      fieldName: 'processingStatus',
      label: '处理状态',
      rules: 'required',
    },
  ];
}

/** 表格字段 */
/** 停车逃费订单数据 - 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'evasionNumber',
      title: '逃费单号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'originalOrderNumber',
      title: '原订单编号',
      minWidth: 180,
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
      field: 'evasionAmount',
      title: '逃费金额',
      minWidth: 100,
      sortable: true, 
    },
    {
      field: 'evasionTime',
      title: '逃费时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'evasionType',
      title: '逃费类型',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'recognitionMethod',
      title: '识别方式',
      minWidth: 150,
      sortable: true, 
    },
    {
      field: 'blacklistStatus',
      title: '黑名单状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'recognitionTime',
      title: '识别时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'processingStatus',
      title: '处理状态',
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

/** 停车逃费订单数据 - 文字描述对象 */
export const textObj = {
  editText: '编辑停车逃费订单信息',
  addText: '新增停车逃费订单信息',
  excelName: '停车逃费订单列表',
  excelAllName: '全市停车逃费订单数据.xlsx',
  total: '逃费订单数量10;涉及车场8;已追缴订单3',
};