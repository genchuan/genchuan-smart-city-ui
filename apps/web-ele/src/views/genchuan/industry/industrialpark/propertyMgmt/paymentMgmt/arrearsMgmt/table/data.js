// data.js
// 路径: src/views/genchuan/industry/industrialPark/propertyMgmt/paymentMgmt/arrearsMgmt/table/data.js
export function useFormSchema() {
  return [
    { fieldName: 'arrearsCompany', label: '欠费企业', component: 'Input', componentProps: { placeholder: '请输入欠费企业' }, isSearch: true },
    { fieldName: 'arrearsItem', label: '欠费项目', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '物业费', value: '物业费' }, { label: '水电费', value: '水电费' }, { label: '停车费', value: '停车费' }] }, isSearch: true },
    { fieldName: 'arrearsStatus', label: '欠费状态', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '待补缴', value: '待补缴' }, { label: '已补缴', value: '已补缴' }] }, isSearch: true },
  ];
}

export function useGridColumns({ showEnterpriseDetail, showUserDetail, handleFieldClick }) {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'arrearsCompany', title: '欠费企业', minWidth: 150, sortable: true, slots: { default: 'arrears_company' } },
    { field: 'arrearsItem', title: '欠费项目', minWidth: 100, sortable: true, slots: { default: 'arrears_item' } },
    { field: 'arrearsAmount', title: '欠费金额(元)', minWidth: 120, sortable: true },
    { field: 'arrearsDuration', title: '欠费时长(天)', minWidth: 120, sortable: true, slots: { default: 'arrears_duration' } },
    { field: 'arrearsStatus', title: '欠费状态', minWidth: 100, sortable: true, slots: { default: 'arrears_status' } },
    { field: 'repayTime', title: '补缴时间', minWidth: 160, sortable: true },
    { field: 'repayAmount', title: '补缴金额(元)', minWidth: 120, sortable: true },
    { field: 'handleUser', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'handle_user' } },
    { title: '操作', width: 240, fixed: 'right', slots: { default: 'actions' } },
  ];
}
