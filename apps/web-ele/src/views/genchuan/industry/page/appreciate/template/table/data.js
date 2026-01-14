/** 表格初始数据 */
export const dataList = () => {
  return [
    {
      template_id: '550e8400-e29b-41d4-a716-446655440000',
      template_code: 'SMS001',
      template_name: '用户注册验证码',
      sms_type: '验证短信',
      content: '您的验证码是：{code}，请在5分钟内使用',
      status: '1',
      create_by: 'USER001',
      create_time: '2023-10-12 09:30:00',
      update_time: '2023-10-12 09:30:00',
      remark: '用户注册时发送的验证码短信',
    },
    {
      template_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS002',
      template_name: '会员到期提醒',
      sms_type: '到期提醒',
      content: '尊敬的{name}，您的会员将于{date}到期，请及时续费',
      status: '1',
      create_by: 'USER002',
      create_time: '2023-10-12 10:15:00',
      update_time: '2023-10-12 10:15:00',
      remark: '会员到期前7天提醒',
    },
    {
      template_id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS003',
      template_name: '停车缴费通知',
      sms_type: '缴费通知',
      content: '您于{time}在{place}停车，需缴费{amount}元，请及时支付',
      status: '1',
      create_by: 'USER003',
      create_time: '2023-10-12 11:00:00',
      update_time: '2023-10-12 11:00:00',
      remark: '停车后发送的缴费通知',
    },
    {
      template_id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS004',
      template_name: '优惠活动通知',
      sms_type: '活动通知',
      content: '国庆特惠！{activity}活动正在进行中，详情点击{link}',
      status: '1',
      create_by: 'USER004',
      create_time: '2023-10-12 14:20:00',
      update_time: '2023-10-12 14:20:00',
      remark: '营销活动推广短信',
    },
    {
      template_id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS005',
      template_name: '投诉处理反馈',
      sms_type: '投诉反馈',
      content: '您的投诉（单号：{order_no}）已处理完成，处理结果：{result}',
      status: '0',
      create_by: 'USER005',
      create_time: '2023-10-12 16:45:00',
      update_time: '2023-10-12 16:45:00',
      remark: '投诉处理后的反馈通知',
    },
    {
      template_id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS006',
      template_name: '账户安全提醒',
      sms_type: '验证短信',
      content: '您正在进行敏感操作，验证码：{code}，请勿泄露',
      status: '1',
      create_by: 'USER006',
      create_time: '2023-10-13 08:30:00',
      update_time: '2023-10-13 08:30:00',
      remark: '账户安全相关操作验证',
    },
    {
      template_id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS007',
      template_name: '账单缴费提醒',
      sms_type: '缴费通知',
      content: '您本月账单{amount}元已出账，请于{date}前完成缴费',
      status: '1',
      create_by: 'USER007',
      create_time: '2023-10-13 10:00:00',
      update_time: '2023-10-13 10:00:00',
      remark: '月账单缴费提醒',
    },
    {
      template_id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS008',
      template_name: '新功能上线通知',
      sms_type: '活动通知',
      content: '新功能{feature}已上线，快来体验吧！详情点击{link}',
      status: '0',
      create_by: 'USER008',
      create_time: '2023-10-13 12:30:00',
      update_time: '2023-10-13 12:30:00',
      remark: '产品功能更新通知',
    },
    {
      template_id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS009',
      template_name: '密码重置验证',
      sms_type: '验证短信',
      content: '您正在重置密码，验证码：{code}，有效期10分钟',
      status: '1',
      create_by: 'USER009',
      create_time: '2023-10-13 15:10:00',
      update_time: '2023-10-13 15:10:00',
      remark: '密码重置时的验证短信',
    },
    {
      template_id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
      template_code: 'SMS010',
      template_name: '服务评价邀请',
      sms_type: '投诉反馈',
      content: '感谢您使用我们的服务，请对本次服务进行评价：{link}',
      status: '1',
      create_by: 'USER010',
      create_time: '2023-10-13 17:30:00',
      update_time: '2023-10-13 17:30:00',
      remark: '服务完成后的评价邀请',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    // {
    //   fieldName: 'template_id',
    //   label: '模板ID',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入模板ID',
    //   },
    // },
    {
      fieldName: 'template_code',
      label: '模板编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模板编码',
      },
    },
    {
      fieldName: 'template_name',
      label: '模板名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模板名称',
      },
    },
    {
      fieldName: 'sms_type',
      label: '短信类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择短信类型',
        options: [
          { label: '验证短信', value: '验证短信' },
          { label: '到期提醒', value: '到期提醒' },
          { label: '缴费通知', value: '缴费通知' },
          { label: '活动通知', value: '活动通知' },
          { label: '投诉反馈', value: '投诉反馈' },
        ],
      },
    },
    {
      fieldName: 'content',
      label: '模板内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模板内容（可使用占位符如{code}）',
        type: 'textarea',
        rows: 4,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '禁用', value: '0' },
          { label: '启用', value: '1' },
        ],
      },
    },
    {
      fieldName: 'create_by',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人ID',
      },
    },
    {
      fieldName: 'create_time',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
    },
    {
      fieldName: 'update_time',
      label: '更新时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择更新时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 3,
      },
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    // {
    //   field: 'template_id',
    //   title: '模板ID',
    //   minWidth: 260,
    //   sortable: true,
    // },
    {
      field: 'template_code',
      title: '模板编码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'template_name',
      title: '模板名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'sms_type',
      title: '短信类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'content',
      title: '模板内容',
      minWidth: 250,
      showOverflow: true,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      formatter: ({ cellValue }) => (cellValue === '1' ? '启用' : '禁用'),
    },
    {
      field: 'create_by',
      title: '创建人',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'update_time',
      title: '更新时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
      showOverflow: true,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑短信模板',
  addText: '新增短信模板',
  excelName: '短信模板列表',
  excelAllName: '短信模板数据.xlsx',
  total: '模板数量: 10; 启用模板: 8; 禁用模板: 2',
};
