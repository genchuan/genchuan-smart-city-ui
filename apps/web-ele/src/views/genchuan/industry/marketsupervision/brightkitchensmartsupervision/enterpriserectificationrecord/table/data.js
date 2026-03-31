import { ref } from 'vue';

/** 企业整改记录表单 schema 配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业整改记录唯一标识',
        disabled: true, // 自增主键，禁用输入
      },
      labelWidth: '120',
      rules: '',
      isEdit: false,
      isSearch: true
    },
    {
      fieldName: 'parkRectifyNoticeId',
      label: '关联整改通知书ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联的整改通知书ID',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'entId',
      label: '企业ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业ID',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'rectifyStatus',
      label: '整改状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未整改', value: '未整改' },
          { label: '整改中', value: '整改中' },
          { label: '已完成', value: '已完成' },
          { label: '整改不合格', value: '整改不合格' }
        ],
        placeholder: '请选择整改状态',
        showSearch: true,
      },
      labelWidth: '120',
      rules: 'required',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'rectifyDesc',
      label: '整改说明',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '整改完成/未完成/整改不合格时填写说明',
        rows: 4,
        maxLength: 1000,
      },
      labelWidth: '120',
      rules: '', // 非必填，状态对应时填写
      isEdit: true
    },
    {
      fieldName: 'rectifyEvidenceUrl',
      label: '整改佐证证据链接',
      component: 'Input',
      componentProps: {
        placeholder: '请输入整改佐证证据链接（JSON格式/varchar均可）',
        maxLength: 200,
      },
      labelWidth: '120',
      rules: '',
      isEdit: true
    },
    {
      fieldName: 'auditResult',
      label: '整改审核结果',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '合格', value: '合格' },
          { label: '不合格', value: '不合格' },
          { label: '待审核', value: '待审核' }
        ],
        placeholder: '请选择整改审核结果',
        showSearch: true,
      },
      labelWidth: '120',
      rules: '',
      isEdit: true,
      isSearch: true
    },
    {
      fieldName: 'auditUserId',
      label: '整改审核人ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联的审核人ID',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: '',
      isEdit: true
    },
    {
      fieldName: 'auditReason',
      label: '整改审核驳回原因',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '审核不合格时填写驳回原因',
        rows: 3,
        maxLength: 500,
      },
      labelWidth: '120',
      rules: '',
      isEdit: true
    },
    {
      fieldName: 'auditTime',
      label: '整改审核时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择整改审核时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '120',
      rules: '',
      isEdit: true
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'Input',
      componentProps: {
        placeholder: '记录创建时间',
        disabled: true, // 自动生成，禁用输入
      },
      labelWidth: '120',
      rules: '',
      isEdit: false,
      isSearch: true
    }
  ];
}

/** 企业整改记录表表格列配置 */
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
      field: 'rectifyNoticeId',
      title: '关联整改通知书ID',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'entId',
      title: '企业ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'rectifyStatus',
      title: '整改状态',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'rectifyDesc',
      title: '整改说明',
      minWidth: 200,
      sortable: false,
      ellipsis: true,
    },
    {
      field: 'rectifyEvidenceUrl',
      title: '整改佐证证据链接',
      minWidth: 200,
      sortable: false,
      ellipsis: true,
    },
    {
      field: 'auditResult',
      title: '整改审核结果',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditBy',
      title: '整改审核人ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditTime',
      title: '整改审核时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}