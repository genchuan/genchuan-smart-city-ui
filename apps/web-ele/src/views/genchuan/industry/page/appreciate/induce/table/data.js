/** 表格初始数据 */
export const dataList = () => {
  return [
    {
      induction_id: '550e8400-e29b-41d4-a716-446655440000',
      induction_name: '商业中心诱导屏',
      region:
        '{"north": 31.236, "south": 31.230, "east": 121.485, "west": 121.475}',
      related_lot_ids: '万达广场停车场',
      push_strategy: '实时推送',
      status: '1',
      create_time: '2023-10-12 09:30:00',
      update_time: '2023-10-12 09:30:00',
      remark: '覆盖商业中心主要路口',
    },
    {
      induction_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '交通枢纽诱导屏',
      region:
        '{"north": 31.245, "south": 31.240, "east": 121.495, "west": 121.485}',
      related_lot_ids: '火车站北广场停车场',
      push_strategy: '定时推送',
      status: '1',
      create_time: '2023-10-12 10:15:00',
      update_time: '2023-10-12 10:15:00',
      remark: '火车站周边停车诱导',
    },
    {
      induction_id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '医院周边诱导屏',
      region:
        '{"north": 31.235, "south": 31.230, "east": 121.480, "west": 121.470}',
      related_lot_ids: '市人民医院停车场',
      push_strategy: '实时推送',
      status: '1',
      create_time: '2023-10-12 11:00:00',
      update_time: '2023-10-12 11:00:00',
      remark: '医院停车场车位引导',
    },
    {
      induction_id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '学校区域诱导屏',
      region:
        '{"north": 31.250, "south": 31.245, "east": 121.500, "west": 121.490}',
      related_lot_ids: '第一中学停车场',
      push_strategy: '按需推送',
      status: '0',
      create_time: '2023-10-12 14:20:00',
      update_time: '2023-10-12 14:20:00',
      remark: '上下学高峰期启用',
    },
    {
      induction_id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '体育场馆诱导屏',
      region:
        '{"north": 31.255, "south": 31.250, "east": 121.505, "west": 121.495}',
      related_lot_ids: '奥林匹克体育中心停车场',
      push_strategy: '定时推送',
      status: '1',
      create_time: '2023-10-12 16:45:00',
      update_time: '2023-10-12 16:45:00',
      remark: '比赛日启用诱导',
    },
    {
      induction_id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '地铁站诱导屏',
      region:
        '{"north": 31.260, "south": 31.255, "east": 121.510, "west": 121.500}',
      related_lot_ids: '人民广场地铁站停车场',
      push_strategy: '实时推送',
      status: '1',
      create_time: '2023-10-13 08:30:00',
      update_time: '2023-10-13 08:30:00',
      remark: '地铁换乘停车场',
    },
    {
      induction_id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '景区诱导屏',
      region:
        '{"north": 31.265, "south": 31.260, "east": 121.515, "west": 121.505}',
      related_lot_ids: '中山陵停车场',
      push_strategy: '定时推送',
      status: '1',
      create_time: '2023-10-13 10:00:00',
      update_time: '2023-10-13 10:00:00',
      remark: '节假日高峰期启用',
    },
    {
      induction_id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '机场诱导屏',
      region:
        '{"north": 31.270, "south": 31.265, "east": 121.520, "west": 121.510}',
      related_lot_ids: '浦东国际机场停车场',
      push_strategy: '实时推送',
      status: '1',
      create_time: '2023-10-13 12:30:00',
      update_time: '2023-10-13 12:30:00',
      remark: '机场停车场车位信息',
    },
    {
      induction_id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '会展中心诱导屏',
      region:
        '{"north": 31.275, "south": 31.270, "east": 121.525, "west": 121.515}',
      related_lot_ids: '国际会展中心停车场',
      push_strategy: '按需推送',
      status: '0',
      create_time: '2023-10-13 15:10:00',
      update_time: '2023-10-13 15:10:00',
      remark: '展会期间启用',
    },
    {
      induction_id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
      induction_name: '住宅区诱导屏',
      region:
        '{"north": 31.280, "south": 31.275, "east": 121.530, "west": 121.520}',
      related_lot_ids: '阳光花园小区停车场',
      push_strategy: '定时推送',
      status: '1',
      create_time: '2023-10-13 17:30:00',
      update_time: '2023-10-13 17:30:00',
      remark: '周边居民停车诱导',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'induction_id',
      label: '诱导屏ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入诱导屏ID',
      },
    },
    {
      fieldName: 'induction_name',
      label: '诱导屏名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入诱导屏名称',
      },
    },
    {
      fieldName: 'region',
      label: '覆盖区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经纬度范围JSON',
        type: 'textarea',
        rows: 4,
      },
    },
    {
      fieldName: 'related_lot_ids',
      label: '关联车场',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联车场名称',
      },
    },
    {
      fieldName: 'push_strategy',
      label: '推送策略',
      component: 'Select',
      componentProps: {
        placeholder: '请选择推送策略',
        options: [
          { label: '实时推送', value: '实时推送' },
          { label: '定时推送', value: '定时推送' },
          { label: '按需推送', value: '按需推送' },
        ],
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
    //   field: 'induction_id',
    //   title: '诱导屏ID',
    //   minWidth: 260,
    //   sortable: true,
    // },
    {
      field: 'induction_name',
      title: '诱导屏名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'region',
      title: '覆盖区域',
      minWidth: 200,
      showOverflow: true,
      formatter: ({ cellValue }) => {
        try {
          const region = JSON.parse(cellValue);
          return `北:${region.north} 南:${region.south} 东:${region.east} 西:${region.west}`;
        } catch {
          return cellValue;
        }
      },
    },
    {
      field: 'related_lot_ids',
      title: '关联车场',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'push_strategy',
      title: '推送策略',
      minWidth: 120,
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
  editText: '编辑诱导屏',
  addText: '新增诱导屏',
  excelName: '诱导屏列表',
  excelAllName: '诱导屏数据.xlsx',
  total: '诱导屏数量: 10; 启用: 8; 禁用: 2',
};
