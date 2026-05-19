// data.js
// 路径: src/views/genchuan/industry/industrialPark/propertyMgmt/paymentMgmt/billMgmt/table/data.js
export function useFormSchema() {
  return [
    { fieldName: 'billCode', label: '账单编号', component: 'Input', componentProps: { placeholder: '请输入账单编号' }, isSearch: true },
    { fieldName: 'payCompany', label: '缴费企业', component: 'Input', componentProps: { placeholder: '请输入缴费企业' }, isSearch: true },
    { fieldName: 'payItem', label: '缴费项目', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '物业费', value: '物业费' }, { label: '水电费', value: '水电费' }, { label: '停车费', value: '停车费' }] }, isSearch: true },
    { fieldName: 'billStatus', label: '账单状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '待缴费', value: '待缴费' }, { label: '已缴费', value: '已缴费' }, { label: '已欠费', value: '已欠费' }] }, isSearch: true },
    { fieldName: 'payType', label: '支付方式', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '微信', value: '微信' }, { label: '支付宝', value: '支付宝' }, { label: '银行卡', value: '银行卡' }] }, isSearch: true },
    { fieldName: 'invoiceStatus', label: '发票状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '已开具', value: '已开具' }, { label: '未开具', value: '未开具' }] }, isSearch: true },
  ];
}

export function useGridColumns({ getUserName, showBillDetail, showUserDetail, handleFieldClick }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'billCode', title: '账单编号', minWidth: 160, sortable: true, slots: { default: 'bill_code' } },
    { field: 'payCompany', title: '缴费企业', minWidth: 150, sortable: true, slots: { default: 'pay_company' } },
    { field: 'payItem', title: '缴费项目', minWidth: 100, sortable: true, slots: { default: 'pay_item' } },
    { field: 'payAmount', title: '缴费金额(元)', minWidth: 120, sortable: true },
    { field: 'payDeadline', title: '缴费期限', minWidth: 160, sortable: true },
    { field: 'billStatus', title: '账单状态', minWidth: 100, sortable: true, slots: { default: 'bill_status' } },
    { field: 'payType', title: '支付方式', minWidth: 100, sortable: true, slots: { default: 'pay_type' } },
    { field: 'payTime', title: '缴费时间', minWidth: 160, sortable: true },
    { field: 'invoiceStatus', title: '发票状态', minWidth: 100, sortable: true, slots: { default: 'invoice_status' } },
    { field: 'handleUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'handle_user' } },
    { title: '操作', width: 200, fixed: 'right', slots: { default: 'actions' } },
  ];
}
