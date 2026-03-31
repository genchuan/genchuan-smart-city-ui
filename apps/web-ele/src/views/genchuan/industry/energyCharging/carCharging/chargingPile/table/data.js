export function useFormSchema() {
  return [
    { fieldName: 'pileCode', label: '设备编号', component: 'Input', componentProps: { placeholder: '请输入设备编号', maxLength: 32 }, rules: 'required', isSearch: true, isEdit: true },
    { fieldName: 'model', label: '型号', component: 'Input', componentProps: { placeholder: '请输入型号' }, rules: 'required', isSearch: true, isEdit: true },
    { fieldName: 'power', label: '功率(kW)', component: 'InputNumber', componentProps: { placeholder: '请输入功率', min: 0, precision: 2 }, rules: 'required', isSearch: false, isEdit: true },
    { fieldName: 'manufacturer', label: '生产厂家', component: 'Input', componentProps: { placeholder: '请输入生产厂家' }, rules: 'required', isSearch: true, isEdit: true },
    { fieldName: 'stationId', label: '所属场站', component: 'Select', componentProps: { placeholder: '请选择场站', options: [] }, rules: 'required', isSearch: true, isEdit: true },
    { fieldName: 'lotId', label: '绑定车位', component: 'Select', componentProps: { placeholder: '请选择车位', options: [] }, isSearch: false, isEdit: true },
    { fieldName: 'chargeMode', label: '充电模式', component: 'Select', componentProps: { placeholder: '请选择模式', options: [{ label: '交流', value: '交流' }, { label: '直流', value: '直流' }, { label: '交直流混合', value: '交直流混合' }] }, rules: 'required', isSearch: true, isEdit: true },
    { fieldName: 'pileStatus', label: '设备状态', component: 'Select', componentProps: { placeholder: '请选择状态', options: [{ label: '未调试', value: '未调试' }, { label: '已调试', value: '已调试' }, { label: '已启用', value: '已启用' }, { label: '已停用', value: '已停用' }] }, isSearch: true, isEdit: true },
    { fieldName: 'faultFlag', label: '故障标记', component: 'Select', componentProps: { placeholder: '请选择', options: [{ label: '无故障', value: 0 }, { label: '有故障', value: 1 }] }, isSearch: true, isEdit: false },
    { fieldName: 'remark', label: '备注', component: 'Input', componentProps: { placeholder: '请输入备注', type: 'textarea' }, isSearch: false, isEdit: true },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'pileCode', title: '设备编号', minWidth: 150, sortable: true, slots: { default: 'pileCode' } },
    { field: 'model', title: '型号', minWidth: 120, sortable: true, slots: { default: 'model' } },
    { field: 'power', title: '功率(kW)', minWidth: 100, sortable: true },
    { field: 'manufacturer', title: '生产厂家', minWidth: 150, sortable: true, slots: { default: 'manufacturer' } },
    { field: 'stationName', title: '所属场站', minWidth: 150, sortable: true, slots: { default: 'stationName' } },
    { field: 'lotCode', title: '绑定车位', minWidth: 120, slots: { default: 'lotCode' } },
    { field: 'chargeMode', title: '充电模式', minWidth: 100, sortable: true, slots: { default: 'chargeMode' } },
    { field: 'pileStatus', title: '设备状态', minWidth: 100, sortable: true, slots: { default: 'pileStatus' } },
    { field: 'faultFlag', title: '故障标记', minWidth: 80, sortable: true, slots: { default: 'faultFlag' } },
    { field: 'runTime', title: '运行时长(h)', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { title: '操作', width: 160, fixed: 'right', slots: { default: 'actions' } },
  ];
}
