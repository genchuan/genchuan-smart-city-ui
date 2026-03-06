/** 表格初始数据 - 车辆异常监测数据 */
export const dataList = () => [
  {
    license_plate: '闽A·12345',
    area_name: '鼓楼片区',
    abnormal_type: '偏离规划路线',
    planned_route: '东街口-五一广场-乌山路',
    warning_time: '2024-06-18 09:23:45',
    real_time_location: '杨桥东路与通湖路交叉口',
  },
  {
    license_plate: '闽D·67890',
    area_name: '思明片区',
    abnormal_type: '超时停留',
    planned_route: '轮渡码头-厦大白城-曾厝垵',
    warning_time: '2024-06-18 10:15:22',
    real_time_location: '鹭江道海滨大厦段',
  },
  {
    license_plate: '闽C·24680',
    area_name: '丰泽片区',
    abnormal_type: '超速行驶',
    planned_route: '刺桐北路-湖心街-泉秀街',
    warning_time: '2024-06-18 11:05:33',
    real_time_location: '刺桐路与津淮街交叉口',
  },
  {
    license_plate: '闽E·13579',
    area_name: '芗城片区',
    abnormal_type: '异常停靠',
    planned_route: '胜利西路-延安北路-新华西路',
    warning_time: '2024-06-18 12:30:18',
    real_time_location: '胜利路与钟法路交叉口',
  },
  {
    license_plate: '闽B·97531',
    area_name: '城厢片区',
    abnormal_type: '偏离规划路线',
    planned_route: '荔城南大道-万达广场-荔园路',
    warning_time: '2024-06-18 13:42:56',
    real_time_location: '荔城南大道广化寺段',
  },
  {
    license_plate: '闽J·86420',
    area_name: '蕉城片区',
    abnormal_type: '异常停靠',
    planned_route: '闽东中路-东侨大道-北湖滨路',
    warning_time: '2024-06-18 14:18:37',
    real_time_location: '闽东中路市政府南门',
  },
  {
    license_plate: '闽F·75319',
    area_name: '新罗片区',
    abnormal_type: '超时停留',
    planned_route: '龙川路-中山路-登高西路',
    warning_time: '2024-06-18 15:05:44',
    real_time_location: '龙川路街心花园段',
  },
  {
    license_plate: '闽G·42861',
    area_name: '梅列片区',
    abnormal_type: '超速行驶',
    planned_route: '列东街-东新五路-东新六路',
    warning_time: '2024-06-18 16:22:19',
    real_time_location: '列东街东新四路口',
  },
  {
    license_plate: '闽H·50973',
    area_name: '延平片区',
    abnormal_type: '偏离规划路线',
    planned_route: '八一路-江滨路-中山路',
    warning_time: '2024-06-18 17:38:42',
    real_time_location: '八一路与鼓楼街交叉口',
  },
  {
    license_plate: '闽K·18264',
    area_name: '平潭片区',
    abnormal_type: '异常停靠',
    planned_route: '金井大道-管委会-龙凤头',
    warning_time: '2024-06-18 18:50:13',
    real_time_location: '金井大道天山路口',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 车辆异常监测表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'license_plate',
      label: '车辆牌照',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车辆牌照',
      },
      labelWidth: '100',
      rules: 'required', // 车辆牌照为必填项
    },
    {
      fieldName: 'area_name',
      label: '所属片区',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择所属片区',
        options: [
          { label: '鼓楼片区', value: '鼓楼片区' },
          { label: '思明片区', value: '思明片区' },
          { label: '丰泽片区', value: '丰泽片区' },
          { label: '芗城片区', value: '芗城片区' },
          { label: '城厢片区', value: '城厢片区' },
          { label: '蕉城片区', value: '蕉城片区' },
          { label: '新罗片区', value: '新罗片区' },
          { label: '梅列片区', value: '梅列片区' },
          { label: '延平片区', value: '延平片区' },
          { label: '平潭片区', value: '平潭片区' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'abnormal_type',
      label: '异常类型',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择异常类型',
        options: [
          { label: '偏离规划路线', value: '偏离规划路线' },
          { label: '超时停留', value: '超时停留' },
          { label: '超速行驶', value: '超速行驶' },
          { label: '异常停靠', value: '异常停靠' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'planned_route',
      label: '异常数值/规划路线',
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入规划路线',
        maxlength: 100,
      },
      rules: 'required',
    },
    {
      fieldName: 'warning_time',
      label: '触发时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择触发时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'real_time_location',
      label: '实时位置',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入实时位置',
        maxlength: 200,
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 - 车辆异常监测表格列 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'license_plate',
      title: '车辆牌照',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'area_name',
      title: '所属片区',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'abnormal_type',
      title: '异常类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'planned_route',
      title: '异常数值/规划路线',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'warning_time',
      title: '触发时间',
      minWidth: 170,
      sortable: true,
    },
    {
      field: 'real_time_location',
      title: '实时位置',
      minWidth: 200,
      sortable: false,
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
