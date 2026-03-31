import { ref } from 'vue';

/** 整改通知书表单 schema 配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主键ID',
        disabled: true, // 主键ID一般为自增，禁用输入
      },
      labelWidth: '120',
      rules: '',
      isEdit: false,
      isSearch: true
    },
    {
      fieldName: 'noticeCode',
      label: '整改通知书编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入整改通知书唯一编号',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'rectifyReviewId',
      label: '整改复审台账ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入整改复审台账ID',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'issueTime',
      label: '下发时间',
      component: 'DatePicker', // 时间选择器替换Input，更贴合业务
      componentProps: {
        placeholder: '请选择通知书正式下发时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '120',
      rules: '',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'rectifyDeadline',
      label: '整改期限',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择要求完成整改的截止日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      labelWidth: '120',
      rules: 'required',
      isEdit: true
    },
    {
      fieldName: 'receiveStatus',
      label: '送达状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未送达', value: '未送达' },
          { label: '待送达', value: '待送达' },
          { label: '已送达', value: '已送达' },
          { label: '已拒收', value: '已拒收' }
        ],
        placeholder: '请选择送达状态',
        showSearch: true,
      },
      labelWidth: '120',
      rules: 'required',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'receiveTime',
      label: '送达时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择实际送达或拒收时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '120',
      rules: '',
      isEdit: true
    },
    // {
    //   fieldName: 'noticeContent',
    //   label: '通知书内容',
    //   component: 'InputTextArea', // 富文本/大文本用文本域
    //   componentProps: {
    //     placeholder: '请输入通知书原件内容',
    //     rows: 6,
    //     maxLength: 2000,
    //   },
    //   labelWidth: '120',
    //   rules: 'required',
    //   isEdit: true
    // },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        placeholder: '创建时间',
        disabled: true, // 自动生成，禁用输入
      },
      labelWidth: '120',
      rules: '',
      isEdit: false,
      isSearch: true
    }
  ];
}

/** 整改通知书台账表表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'noticeCode',
      title: '整改通知书编号',
      minWidth: 200,
      sortable: true,
      slots: { default: 'noticeCode' },
    },
    {
      field: 'rectifyReviewId',
      title: '整改复审台账ID',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'issueTime',
      title: '下发时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'rectifyDeadline',
      title: '整改期限',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'receiveStatus',
      title: '送达状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'receiveTime',
      title: '送达时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'noticeContent',
      title: '通知书内容',
      minWidth: 200,
      sortable: false,
      ellipsis: true, // 内容过长省略
      slots: { default: 'noticeContent' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}