/** 话术管理表单配置（搜索） */
export function useFormSchema() {
  return [
    { fieldName: 'name', label: '话术名称', component: 'Input', componentProps: { placeholder: '请输入话术名称' }, isSearch: true },
    { fieldName: 'type', label: '话术类型', component: 'Select', componentProps: { placeholder: '请选择', options: [
          { label: '快捷回复', value: '快捷回复' },
          { label: '自动回复', value: '自动回复' },
          { label: '投诉回复', value: '投诉回复' }
        ] }, isSearch: true },
    { fieldName: 'status', label: '状态', component: 'Select', componentProps: { placeholder: '请选择', options: [
          { label: '未生效', value: '未生效' },
          { label: '已生效', value: '已生效' }
        ] }, isSearch: true },
  ];
}

/** 话术管理表格列配置（带钻取交互） */
export function useGridColumns() {
  return [
    { field: 'id', title: '话术ID', minWidth: 100, sortable: true, slots: { default: 'id' } },
    { field: 'name', title: '话术名称', minWidth: 150, sortable: true, slots: { default: 'name' } },
    { field: 'content', title: '话术内容', minWidth: 300 },
    { field: 'type', title: '话术类型', minWidth: 120, sortable: true, slots: { default: 'type' } },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'creator', title: '创建人', minWidth: 120 },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'updater', title: '更新人', minWidth: 120 },
    { field: 'updateTime', title: '更新时间', minWidth: 160, sortable: true },
    { title: '操作', width: 220, fixed: 'right', slots: { default: 'actions' } },
  ];
}
