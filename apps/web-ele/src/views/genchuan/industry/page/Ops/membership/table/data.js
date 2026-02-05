/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      level_id: '880e8400-e29b-41d4-a716-446655445001',
      level_name: '普通会员',
      level_code: 'LEVEL001',
      growth_value: 0,
      icon: 'minio://levels/basic.png',
      status: '1',
      create_time: '2024-01-01 10:00:00',
      update_time: '2024-05-10 09:30:00',
      remark: '默认会员等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445002',
      level_name: '白银会员',
      level_code: 'LEVEL002',
      growth_value: 1000,
      icon: 'minio://levels/silver.png',
      status: '1',
      create_time: '2024-01-01 10:00:00',
      update_time: '2024-05-10 09:30:00',
      remark: '初级会员等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445003',
      level_name: '黄金会员',
      level_code: 'LEVEL003',
      growth_value: 5000,
      icon: 'minio://levels/gold.png',
      status: '1',
      create_time: '2024-01-01 10:00:00',
      update_time: '2024-05-10 09:30:00',
      remark: '中级会员等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445004',
      level_name: '白金会员',
      level_code: 'LEVEL004',
      growth_value: 15_000,
      icon: 'minio://levels/platinum.png',
      status: '1',
      create_time: '2024-01-01 10:00:00',
      update_time: '2024-05-10 09:30:00',
      remark: '高级会员等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445005',
      level_name: '钻石会员',
      level_code: 'LEVEL005',
      growth_value: 30_000,
      icon: 'minio://levels/diamond.png',
      status: '1',
      create_time: '2024-01-01 10:00:00',
      update_time: '2024-05-10 09:30:00',
      remark: '顶级会员等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445006',
      level_name: '测试会员',
      level_code: 'LEVEL006',
      growth_value: 200,
      icon: 'minio://levels/test.png',
      status: '0',
      create_time: '2024-03-15 14:30:00',
      update_time: '2024-05-09 16:45:00',
      remark: '测试用等级，已禁用',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445007',
      level_name: '合作会员',
      level_code: 'LEVEL007',
      growth_value: 10_000,
      icon: 'minio://levels/partner.png',
      status: '1',
      create_time: '2024-02-01 09:00:00',
      update_time: '2024-05-10 11:20:00',
      remark: '合作伙伴专属等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445008',
      level_name: '企业会员',
      level_code: 'LEVEL008',
      growth_value: 25_000,
      icon: 'minio://levels/enterprise.png',
      status: '1',
      create_time: '2024-03-10 10:30:00',
      update_time: '2024-05-10 14:15:00',
      remark: '企业用户专用等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445009',
      level_name: '试用会员',
      level_code: 'LEVEL009',
      growth_value: 100,
      icon: 'minio://levels/trial.png',
      status: '0',
      create_time: '2024-04-01 16:20:00',
      update_time: '2024-05-08 10:00:00',
      remark: '试用期会员等级',
    },
    {
      level_id: '880e8400-e29b-41d4-a716-446655445010',
      level_name: '黑金会员',
      level_code: 'LEVEL010',
      growth_value: 50_000,
      icon: 'minio://levels/black.png',
      status: '1',
      create_time: '2024-01-15 11:45:00',
      update_time: '2024-05-10 15:30:00',
      remark: '限量尊贵会员等级',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'level_name',
      label: '等级名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入等级名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'level_code',
      label: '等级编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入等级编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'growth_value',
      label: '所需成长值',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入所需成长值',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'icon',
      label: '等级图标',
      component: 'Input',
      componentProps: {
        placeholder: '请输入MinIO图标地址',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注信息',
        type: 'textarea',
        rows: 2,
      },
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'level_name',
      title: '等级名称',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'level_code',
      title: '等级编码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'growth_value',
      title: '所需成长值',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue === '1' ? '启用' : '禁用';
      },
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
      minWidth: 150,
      sortable: true,
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
  editText: '编辑会员等级',
  addText: '新增会员等级',
  excelName: '会员等级列表',
  excelAllName: '会员等级数据.xlsx',
  total: '会员等级数量:10',
};
