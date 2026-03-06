/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      "merchantName": "漳州碧湖停车管理有限公司",
      "parkName": "龙文区碧湖公园停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "已结算",
      "profitSharingRule": "平台15%，商户85%",
      "totalTransactionAmount": "125800.00元",
      "refundAmount": "3200.50元",
      "platformShare": "18389.93元",
      "merchantShare": "104209.57元",
      "taxAmount": "6520.00元",
      "generateTime": "2026-01-20 11:25:48"
    },
    {
      "merchantName": "漳州万达商业管理有限公司",
      "parkName": "龙文区万达商圈停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "结算中",
      "profitSharingRule": "平台12%，商户88%",
      "totalTransactionAmount": "358900.00元",
      "refundAmount": "8560.80元",
      "platformShare": "42040.70元",
      "merchantShare": "308298.50元",
      "taxAmount": "18920.00元",
      "generateTime": "2026-01-20 11:30:25"
    },
    {
      "merchantName": "漳州江滨停车服务有限公司",
      "parkName": "芗城区江滨路生态停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "已结算",
      "profitSharingRule": "平台10%，商户90%",
      "totalTransactionAmount": "98750.00元",
      "refundAmount": "2150.20元",
      "platformShare": "9660.00元",
      "merchantShare": "86939.80元",
      "taxAmount": "4890.00元",
      "generateTime": "2026-01-20 11:30:40"
    },
    {
      "merchantName": "漳州步文城市运营有限公司",
      "parkName": "龙文区步文街道停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "已结算",
      "profitSharingRule": "平台15%，商户85%",
      "totalTransactionAmount": "78500.00元",
      "refundAmount": "1850.00元",
      "platformShare": "11508.75元",
      "merchantShare": "65141.25元",
      "taxAmount": "3920.00元",
      "generateTime": "2026-01-20 11:31:10"
    },
    {
      "merchantName": "长泰武安停车管理有限公司",
      "parkName": "长泰区武安镇公共停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "结算中",
      "profitSharingRule": "平台18%，商户82%",
      "totalTransactionAmount": "65800.00元",
      "refundAmount": "3200.00元",
      "platformShare": "11268.00元",
      "merchantShare": "51332.00元",
      "taxAmount": "3290.00元",
      "generateTime": "2026-01-20 11:31:35"
    },
    {
      "merchantName": "龙海闽齐社区服务有限公司",
      "parkName": "龙海区闽齐社区停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "待结算",
      "profitSharingRule": "平台20%，商户80%",
      "totalTransactionAmount": "45600.00元",
      "refundAmount": "1580.50元",
      "platformShare": "8803.90元",
      "merchantShare": "35215.60元",
      "taxAmount": "2280.00元",
      "generateTime": "2026-01-20 11:32:00"
    },
    {
      "merchantName": "漳浦绥安停车服务有限公司",
      "parkName": "漳浦县绥安镇停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "已结算",
      "profitSharingRule": "平台15%，商户85%",
      "totalTransactionAmount": "89200.00元",
      "refundAmount": "2890.00元",
      "platformShare": "12946.50元",
      "merchantShare": "73363.50元",
      "taxAmount": "4460.00元",
      "generateTime": "2026-01-20 11:32:25"
    },
    {
      "merchantName": "漳州东铺头物业管理有限公司",
      "parkName": "芗城区东铺头街道停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "结算中",
      "profitSharingRule": "平台12%，商户88%",
      "totalTransactionAmount": "76500.00元",
      "refundAmount": "3250.80元",
      "platformShare": "8790.00元",
      "merchantShare": "64459.20元",
      "taxAmount": "3825.00元",
      "generateTime": "2026-01-20 11:32:50"
    },
    {
      "merchantName": "云霄云陵停车管理有限公司",
      "parkName": "云霄县云陵镇停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "已结算",
      "profitSharingRule": "平台15%，商户85%",
      "totalTransactionAmount": "58900.00元",
      "refundAmount": "1250.00元",
      "platformShare": "8647.50元",
      "merchantShare": "49002.50元",
      "taxAmount": "2945.00元",
      "generateTime": "2026-01-20 11:33:15"
    },
    {
      "merchantName": "平和小溪停车服务有限公司",
      "parkName": "平和县小溪镇停车场",
      "statisticsCycle": "2026-01-01 至 2026-01-20",
      "settlementStatus": "待结算",
      "profitSharingRule": "平台18%，商户82%",
      "totalTransactionAmount": "62800.00元",
      "refundAmount": "2680.00元",
      "platformShare": "10821.60元",
      "merchantShare": "49298.40元",
      "taxAmount": "3140.00元",
      "generateTime": "2026-01-20 11:33:40"
    }
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
/** 停车结算统计数据 - 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'merchantName',
      label: '商户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户名称',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'parkName',
      label: '车场名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车场名称',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'statisticsCycle',
      label: '统计周期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计周期（如：2026-01-01 至 2026-01-31）',
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
          { label: '待结算', value: '待结算' },
          { label: '结算中', value: '结算中' },
          { label: '已结算', value: '已结算' },
          { label: '结算失败', value: '结算失败' },
        ],
        placeholder: '请选择结算状态',
        showSearch: true,
      },
      defaultValue: '待结算',
      fieldName: 'settlementStatus',
      label: '结算状态',
      rules: 'required',
    },
    {
      fieldName: 'profitSharingRule',
      label: '分账规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分账规则（如：平台15%，商户85%）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'totalTransactionAmount',
      label: '总交易额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入总交易额（如：125800.00元）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'refundAmount',
      label: '退款金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入退款金额（如：3200.50元）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'platformShare',
      label: '平台分成',
      component: 'Input',
      componentProps: {
        placeholder: '请输入平台分成（如：18389.93元）',
        disabled: true // 平台分成自动计算，设为禁用
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'merchantShare',
      label: '商户分成',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商户分成（如：104209.57元）',
        disabled: true // 商户分成自动计算，设为禁用
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'taxAmount',
      label: '税费金额',
      component: 'Input',
      componentProps: {
        placeholder: '请输入税费金额（如：6520.00元）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'generateTime',
      label: '生成时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入生成时间（格式：YYYY-MM-DD HH:mm:ss）',
        disabled: true // 生成时间自动记录，设为禁用
      },
      labelWidth: '100',
      rules: 'required',
    },
  ];
}

/** 表格字段 */
/** 停车结算统计数据 - 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'parkName',
      title: '车场名称',
      minWidth: 200,
      sortable: true,
      slots: { default: 'parkName' },
    },
    {
      field: 'statisticsCycle',
      title: '统计周期',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'settlementStatus',
      title: '结算状态',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'profitSharingRule',
      title: '分账规则',
      minWidth: 150,
      sortable: true, 
    },
    {
      field: 'totalTransactionAmount',
      title: '总交易额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'refundAmount',
      title: '退款金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'platformShare',
      title: '平台分成',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'merchantShare',
      title: '商户分成',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'taxAmount',
      title: '税费金额',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'generateTime',
      title: '生成时间',
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

/** 停车结算统计数据 - 文字描述对象 */
export const textObj = {
  editText: '编辑停车结算统计信息',
  addText: '新增停车结算统计信息',
  excelName: '停车结算统计列表',
  excelAllName: '全市停车结算统计数据.xlsx',
  total: '结算统计数量10;涉及车场8;已结算订单5',
};