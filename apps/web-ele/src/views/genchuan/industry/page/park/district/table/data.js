/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      areaName: '芗城核心片区', // 片区名称
      division: '漳州市芗城区', // 所属行政区划
      principal: '陈经理', // 负责人
      phone: '13859688888', // 联系电话
      areaDesc: '芗城区核心商业及居民区，包含多个大型商圈和老旧小区', // 片区描述
      relatedParks: '漳州万达广场停车场、古城历史文化街区停车场、荣昌花园小区停车场、漳州第一医院停车场', // 关联车场
      relatedRoads: '建元东路、延安南路、丹霞路、胜利西路', // 关联道路
      areaCode: 'XC001', // 片区编码
      status: '正常', // 状态
      parkCount: 4, // 关联车场数
      roadCount: 4, // 关联道路数
      createTime: '2025-01-10', // 创建时间
      operator: '系统管理员' // 操作人
    },
    {
      areaName: '龙海动车站片区',
      division: '漳州市龙海区',
      principal: '林主管',
      phone: '13959699999',
      areaDesc: '以漳州动车站为核心的交通枢纽片区',
      relatedParks: '漳州动车站停车场',
      relatedRoads: '站前路、龙海大道',
      areaCode: 'LH001',
      status: '正常',
      parkCount: 1,
      roadCount: 2,
      createTime: '2025-01-12',
      operator: '系统管理员'
    },
    {
      areaName: '龙文碧湖片区',
      division: '漳州市龙文区',
      principal: '黄管理员',
      phone: '13759677777',
      areaDesc: '龙文区碧湖生态园周边休闲及居住区',
      relatedParks: '碧湖生态园停车场',
      relatedRoads: '湖滨路、龙文北路',
      areaCode: 'LW001',
      status: '正常',
      parkCount: 1,
      roadCount: 2,
      createTime: '2025-01-15',
      operator: '系统管理员'
    },
    {
      areaName: '台商投资区角美片区',
      division: '漳州市台商投资区',
      principal: '吴经理',
      phone: '13559655555',
      areaDesc: '角美镇商业及居住区，包含万达广场商圈',
      relatedParks: '漳州台商投资区角美万达广场停车场',
      relatedRoads: '锦江大道、角江路',
      areaCode: 'TS001',
      status: '正常',
      parkCount: 1,
      roadCount: 2,
      createTime: '2025-01-18',
      operator: '系统管理员'
    },
    {
      areaName: '高新区软件园片区',
      division: '漳州市高新区',
      principal: '李主管',
      phone: '13359633333',
      areaDesc: '高新区软件园及周边办公区',
      relatedParks: '漳州高新区软件园停车场',
      relatedRoads: '圆山大道、高新路',
      areaCode: 'GX001',
      status: '正常',
      parkCount: 1,
      roadCount: 2,
      createTime: '2025-01-20',
      operator: '系统管理员'
    },
    {
      areaName: '东山县铜陵片区',
      division: '漳州市东山县',
      principal: '王经理',
      phone: '13259622222',
      areaDesc: '东山县铜陵镇旅游景区片区，包含风动石景区',
      relatedParks: '东山岛风动石景区停车场',
      relatedRoads: '景区路、铜陵大道',
      areaCode: 'DS001',
      status: '正常',
      parkCount: 1,
      roadCount: 2,
      createTime: '2025-01-22',
      operator: '系统管理员'
    },
    {
      areaName: '长泰区马洋溪片区',
      division: '漳州市长泰区',
      principal: '杨负责人',
      phone: '13059600000',
      areaDesc: '长泰区马洋溪生态旅游区，包含天柱山欢乐大世界',
      relatedParks: '长泰天柱山欢乐大世界停车场',
      relatedRoads: '马洋溪大道、天柱山路',
      areaCode: 'CT001',
      status: '正常',
      parkCount: 1,
      roadCount: 2,
      createTime: '2025-01-25',
      operator: '系统管理员'
    }
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'areaName',
      label: '片区名称',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入片区名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'division',
      label: '所属行政区划',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入所属行政区划',
      },
      rules: 'required',
    },
    {
      fieldName: 'principal',
      label: '负责人',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入负责人',
      },
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'areaDesc',
      label: '片区描述',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入片区描述',
      },
    },
    {
      fieldName: 'relatedParks',
      label: '关联车场',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入关联车场',
      },
    },
    {
      fieldName: 'relatedRoads',
      label: '关联道路',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入关联道路',
      },
    },
    {
      fieldName: 'areaCode',
      label: '片区编码',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入片区编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '正常', value: '正常' },
          { label: '维护中', value: '维护中' },
          { label: '停用', value: '停用' },
        ],
        placeholder: '请选择状态',
      },
      rules: 'required',
    },
    {
      fieldName: 'parkCount',
      label: '关联车场数',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入关联车场数',
        min: 0
      },
      rules: 'required',
    },
    {
      fieldName: 'roadCount',
      label: '关联道路数',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入关联道路数',
        min: 0
      },
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD'
      },
      rules: 'required',
    },
    {
      fieldName: 'operator',
      label: '操作人',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入操作人',
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
      field: 'areaName',
      title: '片区名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'areaName' },
    },
    {
      field: 'division',
      title: '所属行政区划',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'principal',
      title: '负责人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'phone',
      title: '联系电话',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'areaDesc',
      title: '片区描述',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'relatedParks',
      title: '关联车场',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'relatedRoads',
      title: '关联道路',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'areaCode',
      title: '片区编码',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'parkCount',
      title: '关联车场数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'roadCount',
      title: '关联道路数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 100,
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

/** 文字描述对象 */
export const textObj = {
  editText: '编辑片区',
  addText: '新增片区',
  excelName: '片区列表',
  excelAllName: '全市片区数据.xlsx',
  total: '片区数量7;关联车场总数:10;关联道路总数:18',
};