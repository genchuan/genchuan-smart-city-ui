/** 表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '1',
      用户位置: '119.123456,25.987654',
      筛选条件: '剩余泊位>10|收费<10|类型=公共',
      查询半径: '3km',
      车场空车位数据: '45',
      用户推送偏好: '最近车场优先',
      推送频率: '每天一次',
      目标车场ID: 'P001',
      实时路况数据: '畅通',
      车场名称: '芗城区XX社区公共停车场',
      收费标准: '首小时8元，后续每小时4元，封顶32元',
      预计行驶时间: '15分钟',
      车场类型: '公共',
    },
    {
      id: '2',
      用户位置: '118.654321,24.567890',
      筛选条件: '剩余泊位>20|收费<15|类型=公共',
      查询半径: '2km',
      车场空车位数据: '60',
      用户推送偏好: '费用最低',
      推送频率: '实时推送',
      目标车场ID: 'P002',
      实时路况数据: '缓慢',
      车场名称: '龙文区碧湖公园停车场',
      收费标准: '首小时6元，后续每小时3元，封顶28元',
      预计行驶时间: '10分钟',
      车场类型: '公共',
    },
    {
      id: '3',
      用户位置: '118.111222,24.333444',
      筛选条件: '剩余泊位>5|收费<8|类型=公共',
      查询半径: '1.5km',
      车场空车位数据: '30',
      用户推送偏好: '车位充足优先',
      推送频率: '每周一次',
      目标车场ID: 'P003',
      实时路况数据: '拥堵',
      车场名称: '龙海区石码镇便民停车场',
      收费标准: '首小时4元，后续每小时2元，封顶20元',
      预计行驶时间: '20分钟',
      车场类型: '公共',
    },
    {
      id: '4',
      用户位置: '118.222333,24.444555',
      筛选条件: '剩余泊位>15|收费<12|类型=公共',
      查询半径: '2.5km',
      车场空车位数据: '20',
      用户推送偏好: '24小时营业',
      推送频率: '每日一次',
      目标车场ID: 'P004',
      实时路况数据: '畅通',
      车场名称: '龙海区闽齐社区停车场',
      收费标准: '首小时5元，后续每小时2元，封顶24元',
      预计行驶时间: '12分钟',
      车场类型: '公共',
    },
    {
      id: '5',
      用户位置: '119.234567,25.876543',
      筛选条件: '剩余泊位>30|收费<20|类型=公共',
      查询半径: '4km',
      车场空车位数据: '80',
      用户推送偏好: '距离最近',
      推送频率: '实时推送',
      目标车场ID: 'P005',
      实时路况数据: '缓慢',
      车场名称: '芗城区江滨路生态停车场',
      收费标准: '首小时10元，后续每小时5元，封顶40元',
      预计行驶时间: '25分钟',
      车场类型: '公共',
    },
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: '用户位置',
      label: '用户位置（经纬度）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户位置经纬度',
      },
      rules: 'required',
    },
    {
      fieldName: '筛选条件',
      label: '筛选条件（剩余泊位/收费/类型）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入筛选条件',
      },
      rules: 'required',
    },
    {
      fieldName: '查询半径',
      label: '查询半径',
      component: 'Input',
      componentProps: {
        placeholder: '请输入查询半径',
      },
      rules: 'required',
    },
    {
      fieldName: '车场空车位数据',
      label: '车场空车位数据',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车场空车位数据',
      },
      rules: 'required',
    },
    {
      fieldName: '用户推送偏好',
      label: '用户推送偏好',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户推送偏好',
      },
      rules: 'required',
    },
    {
      fieldName: '推送频率',
      label: '推送频率',
      component: 'Input',
      componentProps: {
        placeholder: '请输入推送频率',
      },
      rules: 'required',
    },
    {
      fieldName: '目标车场ID',
      label: '目标车场ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入目标车场ID',
      },
      rules: 'required',
    },
    {
      fieldName: '实时路况数据',
      label: '实时路况数据',
      component: 'Input',
      componentProps: {
        placeholder: '请输入实时路况数据',
      },
      rules: 'required',
    },
    {
      fieldName: '车场名称',
      label: '车场名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车场名称',
      },
      rules: 'required',
    },
    {
      fieldName: '收费标准',
      label: '收费标准',
      component: 'Input',
      componentProps: {
        placeholder: '请输入收费标准',
      },
      rules: 'required',
    },
    {
      fieldName: '预计行驶时间',
      label: '预计行驶时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入预计行驶时间',
      },
      rules: 'required',
    },
    {
      fieldName: '车场类型',
      label: '车场类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车场类型',
      },
      rules: 'required',
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: 'ID',
      minWidth: 80,
      sortable: true,
    },
    {
      field: '车场名称',
      title: '车场名称',
      minWidth: 200,
      sortable: true,
    },
    // {
    //   field: '筛选条件',
    //   title: '筛选条件',
    //   minWidth: 180,
    //   sortable: true,
    // },
    {
      field: '查询半径',
      title: '查询半径',
      minWidth: 100,
      sortable: true,
    },
    {
      field: '车场空车位数据',
      title: '空车位数据',
      minWidth: 120,
      sortable: true,
    },
    {
      field: '用户推送偏好',
      title: '推送偏好',
      minWidth: 150,
      sortable: true,
    },
    {
      field: '推送频率',
      title: '推送频率',
      minWidth: 120,
      sortable: true,
    },
    {
      field: '目标车场ID',
      title: '目标车场ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: '实时路况数据',
      title: '实时路况',
      minWidth: 120,
      sortable: true,
    },

    {
      field: '收费标准',
      title: '收费标准',
      minWidth: 180,
      sortable: true,
    },
    {
      field: '预计行驶时间',
      title: '预计行驶时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: '车场类型',
      title: '车场类型',
      minWidth: 120,
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

/** 文字描述对象 */
export const textObj = {
  editText: '编辑推送配置',
  addText: '新增推送配置',
  excelName: '推送配置列表',
  excelAllName: '推送配置数据.xlsx',
  total: '总计：配置数量5；推送用户数：1200；日均推送次数：300',
};
