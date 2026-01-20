/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      points_id: '550e8400-e29b-41d4-a716-446655441001',
      user_id: '1001',
      total_points: 5000,
      available_points: 4500,
      used_points: 300,
      expired_points: 200,
      last_update_time: '2024-05-10 08:30:15',
      create_time: '2024-05-10 08:30:00',
      remark: '初始积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441002',
      user_id: '1002',
      total_points: 3200,
      available_points: 2800,
      used_points: 250,
      expired_points: 150,
      last_update_time: '2024-05-10 09:15:22',
      create_time: '2024-05-10 09:15:00',
      remark: '日常积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441003',
      user_id: '1003',
      total_points: 7500,
      available_points: 6800,
      used_points: 500,
      expired_points: 200,
      last_update_time: '2024-05-10 10:05:33',
      create_time: '2024-05-10 10:05:00',
      remark: 'VIP用户积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441004',
      user_id: '1004',
      total_points: 2100,
      available_points: 1800,
      used_points: 200,
      expired_points: 100,
      last_update_time: '2024-05-10 11:20:45',
      create_time: '2024-05-10 11:20:00',
      remark: '普通用户积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441005',
      user_id: '1005',
      total_points: 4200,
      available_points: 3800,
      used_points: 300,
      expired_points: 100,
      last_update_time: '2024-05-10 13:45:10',
      create_time: '2024-05-10 13:45:00',
      remark: '活跃用户积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441006',
      user_id: '1006',
      total_points: 5800,
      available_points: 5200,
      used_points: 400,
      expired_points: 200,
      last_update_time: '2024-05-10 15:30:18',
      create_time: '2024-05-10 15:30:00',
      remark: '购物积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441007',
      user_id: '1007',
      total_points: 8900,
      available_points: 8200,
      used_points: 500,
      expired_points: 200,
      last_update_time: '2024-05-10 17:10:55',
      create_time: '2024-05-10 17:10:00',
      remark: '高级会员积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441008',
      user_id: '1008',
      total_points: 3100,
      available_points: 2800,
      used_points: 200,
      expired_points: 100,
      last_update_time: '2024-05-10 18:45:30',
      create_time: '2024-05-10 18:45:00',
      remark: '新用户积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441009',
      user_id: '1009',
      total_points: 6700,
      available_points: 6100,
      used_points: 400,
      expired_points: 200,
      last_update_time: '2024-05-10 20:15:42',
      create_time: '2024-05-10 20:15:00',
      remark: '活动积分',
    },
    {
      points_id: '550e8400-e29b-41d4-a716-446655441010',
      user_id: '1010',
      total_points: 2300,
      available_points: 2000,
      used_points: 200,
      expired_points: 100,
      last_update_time: '2024-05-10 21:30:25',
      create_time: '2024-05-10 21:30:00',
      remark: '注册赠送积分',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'points_id',
      label: '积分记录ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入积分记录ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'user_id',
      label: '用户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'total_points',
      label: '总积分',
      component: 'Input',
      componentProps: {
        placeholder: '请输入总积分',
      },
      rules: 'required',
    },
    {
      fieldName: 'available_points',
      label: '可用积分',
      component: 'Input',
      componentProps: {
        placeholder: '请输入可用积分',
      },
      rules: 'required',
    },
    {
      fieldName: 'used_points',
      label: '已使用积分',
      component: 'Input',
      componentProps: {
        placeholder: '请输入已使用积分',
      },
    },
    {
      fieldName: 'expired_points',
      label: '已过期积分',
      component: 'Input',
      componentProps: {
        placeholder: '请输入已过期积分',
      },
    },
    {
      fieldName: 'last_update_time',
      label: '上次更新时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入上次更新时间',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注信息',
      },
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'user_id',
      title: '用户ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'total_points',
      title: '总积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'available_points',
      title: '可用积分',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'used_points',
      title: '已使用积分',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'expired_points',
      title: '已过期积分',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'last_update_time',
      title: '上次更新时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑积分记录',
  addText: '新增积分记录',
  excelName: '积分记录列表',
  excelAllName: '用户积分数据.xlsx',
  total: '积分记录数量:10',
};
