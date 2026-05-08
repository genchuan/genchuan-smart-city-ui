// /** 新增/修改的表单/列表的搜索表单 - 充电桩订单统计分析表单 */
// export function useFormSchema() {
//   return [
//     {
//       fieldName: 'orderCode',
//       label: '订单编号',
//       component: 'Input',
//       componentProps: {
//         placeholder: '请输入订单编号',
//       },
//       labelWidth: '130',
//       rules: 'required',
//     },
//     {
//       fieldName: 'userId',
//       label: '用户ID',
//       component: 'Input',
//       componentProps: {
//         placeholder: '请输入用户ID',
//       },
//       labelWidth: '130',
//       rules: 'required',
//     },
//     {
//       fieldName: 'pileCode',
//       label: '充电桩编号',
//       component: 'Input',
//       componentProps: {
//         placeholder: '请输入充电桩编号',
//       },
//       labelWidth: '130',
//       rules: 'required',
//     },
//     {
//       fieldName: 'chargeTime',
//       label: '充电时长',
//       component: 'InputNumber',
//       labelWidth: '130',
//       componentProps: {
//         placeholder: '请输入充电时长（小时）',
//         min: 0,
//         precision: 1,
//         addonAfter: '小时'
//       },
//       rules: 'required',
//     },
//     {
//       fieldName: 'chargeAmount',
//       label: '充电量',
//       component: 'InputNumber',
//       labelWidth: '130',
//       componentProps: {
//         placeholder: '请输入充电量（度）',
//         min: 0,
//         precision: 1,
//         addonAfter: '度'
//       },
//       rules: 'required',
//     },
//     {
//       fieldName: 'chargeMoney',
//       label: '充电金额',
//       component: 'InputNumber',
//       labelWidth: '130',
//       componentProps: {
//         placeholder: '请输入充电金额（元）',
//         min: 0,
//         precision: 1,
//         addonAfter: '元'
//       },
//       rules: 'required',
//     },
//     {
//       fieldName: 'payStatus',
//       label: '支付状态',
//       component: 'Select',
//       componentProps: {
//         placeholder: '请选择支付状态',
//         options: [
//           { label: '已支付', value: '已支付' },
//           { label: '未支付', value: '未支付' },
//           { label: '支付失败', value: '支付失败' }
//         ]
//       },
//       labelWidth: '130',
//       rules: 'required',
//     },
//     {
//       fieldName: 'orderStatus',
//       label: '订单状态',
//       component: 'Select',
//       componentProps: {
//         placeholder: '请选择订单状态',
//         options: [
//           { label: '已完成', value: '已完成' },
//           { label: '进行中', value: '进行中' },
//           { label: '已取消', value: '已取消' },
//           { label: '异常', value: '异常' }
//         ]
//       },
//       labelWidth: '130',
//       rules: 'required',
//     },
//     {
//       fieldName: 'payType',
//       label: '支付方式',
//       component: 'Select',
//       componentProps: {
//         placeholder: '请选择支付方式',
//         options: [
//           { label: '微信支付', value: '微信支付' },
//           { label: '支付宝', value: '支付宝' },
//           { label: '银联支付', value: '银联支付' },
//           { label: '现金', value: '现金' }
//         ]
//       },
//       labelWidth: '130',
//       rules: 'required',
//     },
//     {
//       fieldName: 'remark',
//       label: '备注',
//       component: 'Input',
//       componentProps: {
//         placeholder: '请输入备注信息',
//         type: 'textarea',
//         rows: 3
//       },
//       labelWidth: '130',
//     },
//     {
//       fieldName: 'stopReason',
//       label: '终止充电原因',
//       component: 'Input',
//       componentProps: {
//         placeholder: '请输入终止充电原因',
//       },
//       labelWidth: '130',
//     },
//     {
//       fieldName: 'createTime',
//       label: '创建时间',
//       component: 'DatePicker',
//       componentProps: {
//         placeholder: '请选择创建时间',
//         showTime: true,
//         format: 'YYYY-MM-DD HH:mm:ss'
//       },
//       labelWidth: '130',
//       rules: 'required',
//     }
//   ];
// }
//
// /** 表格字段 - 充电桩订单统计分析表格列 */
// export function useGridColumns() {
//   return [
//     { type: 'checkbox', width: 40 },
//     {
//       field: 'orderCode',
//       title: '订单编号',
//       minWidth: 150,
//       sortable: true,
//     },
//     {
//       field: 'userId',
//       title: '用户ID',
//       minWidth: 120,
//       sortable: true,
//     },
//     {
//       field: 'pileCode',
//       title: '充电桩编号',
//       minWidth: 150,
//       sortable: true,
//     },
//     {
//       field: 'chargeTime',
//       title: '充电时长(小时)',
//       minWidth: 140,
//       sortable: true,
//     },
//     {
//       field: 'chargeAmount',
//       title: '充电量(度)',
//       minWidth: 120,
//       sortable: true,
//     },
//     {
//       field: 'chargeMoney',
//       title: '充电金额(元)',
//       minWidth: 120,
//       sortable: true,
//     },
//     {
//       field: 'payStatus',
//       title: '支付状态',
//       minWidth: 120,
//       sortable: true,
//     },
//     {
//       field: 'orderStatus',
//       title: '订单状态',
//       minWidth: 120,
//       sortable: true,
//     },
//     {
//       field: 'payType',
//       title: '支付方式',
//       minWidth: 120,
//       sortable: true,
//     },
//     {
//       field: 'remark',
//       title: '备注',
//       minWidth: 200,
//     },
//     {
//       field: 'stopReason',
//       title: '终止充电原因',
//       minWidth: 180,
//     },
//     {
//       field: 'createTime',
//       title: '创建时间',
//       minWidth: 200,
//       sortable: true,
//     },
//     {
//       title: '操作',
//       width: 80,
//       fixed: 'right',
//       slots: { default: 'actions' },
//     },
//   ];
// }
