// 筛选表单 schema（用于顶部筛选面板）
export function useFormSchema() {
  return [
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级' },
      labelWidth: '100',
    },
    {
      fieldName: 'grade',
      label: '年级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择年级',
        options: [
          { label: '2021级', value: '2021' },
          { label: '2022级', value: '2022' },
          { label: '2023级', value: '2023' },
          { label: '2024级', value: '2024' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'dateRange',
      label: '时间范围',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择时间范围',
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumnsByStatus(status) {
  const columns = [
    { field: 'recordType', title: '记录类型', minWidth: 100, sortable: true, slots: { default: 'recordType' } },
    { field: 'recordTitle', title: '记录标题', minWidth: 300, sortable: true, },
    { field: 'studentName', title: '学生姓名', minWidth: 100, sortable: true, },
    { field: 'className', title: '班级名称', minWidth: 150, sortable: true, },
    { field: 'creator', title: '创建人', minWidth: 100, sortable: true, },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
  ];
  return columns;
}

// 文本常量
export const textObj = {
  excelName: '学工动态记录',
};
