/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      share_id: '550e8400-e29b-41d4-a716-446655440000',
      share_no: 'SHARE202310120001',
      space_id: 'SPACE001',
      user_id: 'USER001',
      share_rule:
        '{"weekdays": ["周一","周二","周三","周四","周五"], "time_range": ["09:00-18:00"], "hourly_rate": "5.00", "max_hours": 8, "advance_booking": 24}',
      start_time: '2023-10-01 00:00:00',
      end_time: '2023-12-31 23:59:59',
      status: '1',
      order_count: 15,
      income_amount: '750.00',
      create_time: '2023-09-28 10:30:00',
      update_time: '2023-10-15 16:45:00',
      remark: '工作日共享车位',
    },
    {
      share_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310120002',
      space_id: 'SPACE002',
      user_id: 'USER002',
      share_rule:
        '{"weekdays": ["周一","周二","周三","周四","周五","周六","周日"], "time_range": ["00:00-23:59"], "hourly_rate": "6.00", "max_hours": 12, "advance_booking": 12}',
      start_time: '2023-10-10 00:00:00',
      end_time: '2023-12-10 23:59:59',
      status: '1',
      order_count: 8,
      income_amount: '432.00',
      create_time: '2023-10-05 14:20:00',
      update_time: '2023-10-14 09:15:00',
      remark: '全天候共享',
    },
    {
      share_id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310120003',
      space_id: 'SPACE003',
      user_id: 'USER003',
      share_rule:
        '{"weekdays": ["周六","周日"], "time_range": ["08:00-22:00"], "hourly_rate": "4.50", "max_hours": 10, "advance_booking": 48}',
      start_time: '2023-09-15 00:00:00',
      end_time: '2024-01-15 23:59:59',
      status: '1',
      order_count: 12,
      income_amount: '540.00',
      create_time: '2023-09-10 11:00:00',
      update_time: '2023-10-13 14:30:00',
      remark: '周末共享车位',
    },
    {
      share_id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310130001',
      space_id: 'SPACE004',
      user_id: 'USER004',
      share_rule:
        '{"weekdays": ["周一","周三","周五"], "time_range": ["19:00-07:00"], "hourly_rate": "3.00", "max_hours": 12, "advance_booking": 6}',
      start_time: '2023-10-01 00:00:00',
      end_time: '2023-11-30 23:59:59',
      status: '2',
      order_count: 5,
      income_amount: '180.00',
      create_time: '2023-09-25 16:40:00',
      update_time: '2023-10-12 11:20:00',
      remark: '夜间共享，目前暂停',
    },
    {
      share_id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310130002',
      space_id: 'SPACE005',
      user_id: 'USER005',
      share_rule:
        '{"weekdays": ["周二","周四"], "time_range": ["12:00-20:00"], "hourly_rate": "7.00", "max_hours": 6, "advance_booking": 36}',
      start_time: '2023-10-05 00:00:00',
      end_time: '2023-12-05 23:59:59',
      status: '0',
      order_count: 0,
      income_amount: '0.00',
      create_time: '2023-09-30 09:15:00',
      update_time: '2023-10-10 15:30:00',
      remark: '工作日午间共享，已禁用',
    },
    {
      share_id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310140001',
      space_id: 'SPACE006',
      user_id: 'USER006',
      share_rule:
        '{"weekdays": ["周一","周二","周三","周四","周五"], "time_range": ["07:00-09:00", "17:00-19:00"], "hourly_rate": "8.00", "max_hours": 2, "advance_booking": 2}',
      start_time: '2023-10-01 00:00:00',
      end_time: '2023-12-31 23:59:59',
      status: '1',
      order_count: 20,
      income_amount: '320.00',
      create_time: '2023-09-28 13:45:00',
      update_time: '2023-10-14 18:10:00',
      remark: '高峰时段共享',
    },
    {
      share_id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310140002',
      space_id: 'SPACE007',
      user_id: 'USER007',
      share_rule:
        '{"weekdays": ["周一","周二","周三","周四","周五","周六","周日"], "time_range": ["10:00-16:00"], "hourly_rate": "5.50", "max_hours": 6, "advance_booking": 24}',
      start_time: '2023-09-20 00:00:00',
      end_time: '2023-11-20 23:59:59',
      status: '1',
      order_count: 10,
      income_amount: '330.00',
      create_time: '2023-09-15 10:30:00',
      update_time: '2023-10-13 12:25:00',
      remark: '日间共享',
    },
    {
      share_id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310150001',
      space_id: 'SPACE008',
      user_id: 'USER008',
      share_rule:
        '{"weekdays": ["周五","周六","周日"], "time_range": ["18:00-24:00"], "hourly_rate": "6.50", "max_hours": 6, "advance_booking": 12}',
      start_time: '2023-10-01 00:00:00',
      end_time: '2023-10-31 23:59:59',
      status: '2',
      order_count: 3,
      income_amount: '117.00',
      create_time: '2023-09-28 15:20:00',
      update_time: '2023-10-10 20:15:00',
      remark: '周末晚间共享，暂停中',
    },
    {
      share_id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310150002',
      space_id: 'SPACE009',
      user_id: 'USER009',
      share_rule:
        '{"weekdays": ["周一","周三","周五"], "time_range": ["08:30-17:30"], "hourly_rate": "4.00", "max_hours": 9, "advance_booking": 72}',
      start_time: '2023-10-15 00:00:00',
      end_time: '2023-12-15 23:59:59',
      status: '1',
      order_count: 7,
      income_amount: '252.00',
      create_time: '2023-10-10 11:45:00',
      update_time: '2023-10-16 09:30:00',
      remark: '工作日共享',
    },
    {
      share_id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
      share_no: 'SHARE202310160001',
      space_id: 'SPACE010',
      user_id: 'USER010',
      share_rule:
        '{"weekdays": ["周六","周日"], "time_range": ["07:00-23:00"], "hourly_rate": "5.00", "max_hours": 16, "advance_booking": 24}',
      start_time: '2023-09-01 00:00:00',
      end_time: '2023-11-30 23:59:59',
      status: '0',
      order_count: 6,
      income_amount: '480.00',
      create_time: '2023-08-25 14:10:00',
      update_time: '2023-10-14 16:40:00',
      remark: '周末全天共享，已到期禁用',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'share_id',
      label: '共享ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入共享ID',
      },
    },
    {
      fieldName: 'share_no',
      label: '共享编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入共享编号',
      },
    },
    {
      fieldName: 'space_id',
      label: '车位ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位ID',
      },
    },
    {
      fieldName: 'user_id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      fieldName: 'share_rule',
      label: '共享规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入共享规则(JSON格式)',
        type: 'textarea',
        rows: 4,
      },
    },
    {
      fieldName: 'start_time',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
    },
    {
      fieldName: 'end_time',
      label: '失效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择失效时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
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
          { label: '暂停', value: '2' },
        ],
      },
    },
    {
      fieldName: 'order_count',
      label: '订单数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入订单数量',
        min: 0,
        precision: 0,
      },
    },
    {
      fieldName: 'income_amount',
      label: '收益总额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入收益总额',
        min: 0,
        precision: 2,
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
    //   field: 'share_no',
    //   title: '共享编号',
    //   minWidth: 150,
    //   sortable: true,
    // },
    {
      field: 'space_id',
      title: '车位ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'user_id',
      title: '用户ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'share_rule',
      title: '共享规则',
      minWidth: 200,
      showOverflow: true,
      formatter: ({ cellValue }) => {
        try {
          const rule = JSON.parse(cellValue);
          return `时段: ${rule.time_range.join('、')} | 费率: ¥${rule.hourly_rate}/小时`;
        } catch {
          return cellValue;
        }
      },
    },
    {
      field: 'start_time',
      title: '生效时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'end_time',
      title: '失效时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        const statusMap = {
          0: '禁用',
          1: '启用',
          2: '暂停',
        };
        return statusMap[cellValue] || cellValue;
      },
    },
    {
      field: 'order_count',
      title: '订单数量',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'income_amount',
      title: '收益总额',
      minWidth: 120,
      sortable: true,
      formatter: ({ cellValue }) => `¥${cellValue}`,
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
      minWidth: 180,
      showOverflow: true,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑共享信息',
  addText: '新增共享信息',
  excelName: '共享信息列表',
  excelAllName: '共享信息数据.xlsx',
  total: '共享数量: 10; 总收益: ¥3,401.00; 启用: 5; 禁用: 2; 暂停: 3',
};
