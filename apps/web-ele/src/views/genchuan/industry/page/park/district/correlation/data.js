/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      areaName: '芗城核心片区', // 片区名称
      currentRelatedParks: '漳州万达广场停车场、古城历史文化街区停车场、荣昌花园小区停车场、漳州第一医院停车场', // 当前关联车场
      toBeRelatedParks: '漳州印象汇停车场、新华西商业街停车场', // 待关联车场
      currentRelatedRoads: '建元东路、延安南路、丹霞路、胜利西路', // 当前关联道路
      toBeRelatedRoads: '南昌路、新华西路', // 待关联道路
      adjustReason: '片区范围扩展，新增商圈及道路覆盖', // 调整原因
      adjustTime: '2025-02-10', // 调整时间
      operator: '系统管理员', // 操作人
      updatedParkCount: 6, // 更新后关联车场数
      updatedRoadCount: 6, // 更新后关联道路数
    },
    {
      areaName: '龙海动车站片区',
      currentRelatedParks: '漳州动车站停车场',
      toBeRelatedParks: '动车站南广场临时停车场',
      currentRelatedRoads: '站前路、龙海大道',
      toBeRelatedRoads: '通站路',
      adjustReason: '动车站客流增加，新增临时停车场及配套道路',
      adjustTime: '2025-02-12',
      operator: '系统管理员',
      updatedParkCount: 2,
      updatedRoadCount: 3,
    },
    {
      areaName: '龙文碧湖片区',
      currentRelatedParks: '碧湖生态园停车场',
      toBeRelatedParks: '碧湖城市广场停车场',
      currentRelatedRoads: '湖滨路、龙文北路',
      toBeRelatedRoads: '水仙大街',
      adjustReason: '周边商业体开业，新增配套停车场及道路',
      adjustTime: '2025-02-15',
      operator: '系统管理员',
      updatedParkCount: 2,
      updatedRoadCount: 3,
    },
    {
      areaName: '台商投资区角美片区',
      currentRelatedParks: '漳州台商投资区角美万达广场停车场',
      toBeRelatedParks: '角美万益广场停车场',
      currentRelatedRoads: '锦江大道、角江路',
      toBeRelatedRoads: '翁角路',
      adjustReason: '新增商圈覆盖，扩展片区道路范围',
      adjustTime: '2025-02-18',
      operator: '系统管理员',
      updatedParkCount: 2,
      updatedRoadCount: 3,
    },
    {
      areaName: '高新区软件园片区',
      currentRelatedParks: '漳州高新区软件园停车场',
      toBeRelatedParks: '高新区创业园停车场',
      currentRelatedRoads: '圆山大道、高新路',
      toBeRelatedRoads: '大学西路',
      adjustReason: '软件园二期投入使用，新增配套停车场及道路',
      adjustTime: '2025-02-20',
      operator: '系统管理员',
      updatedParkCount: 2,
      updatedRoadCount: 3,
    },
    {
      areaName: '东山县铜陵片区',
      currentRelatedParks: '东山岛风动石景区停车场',
      toBeRelatedParks: '铜陵古镇游客中心停车场',
      currentRelatedRoads: '景区路、铜陵大道',
      toBeRelatedRoads: '苏峰一路',
      adjustReason: '旅游旺季来临，新增游客配套停车场及道路',
      adjustTime: '2025-02-22',
      operator: '系统管理员',
      updatedParkCount: 2,
      updatedRoadCount: 3,
    },
    {
      areaName: '长泰区马洋溪片区',
      currentRelatedParks: '长泰天柱山欢乐大世界停车场',
      toBeRelatedParks: '马洋溪漂流景区停车场',
      currentRelatedRoads: '马洋溪大道、天柱山路',
      toBeRelatedRoads: '十里村道',
      adjustReason: '新增漂流景区覆盖，扩展片区道路范围',
      adjustTime: '2025-02-25',
      operator: '系统管理员',
      updatedParkCount: 2,
      updatedRoadCount: 3,
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
      fieldName: 'currentRelatedParks',
      label: '当前关联车场',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入当前关联车场',
        rows: 3,
      },
      rules: 'required',
    },
    {
      fieldName: 'toBeRelatedParks',
      label: '待关联车场',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入待关联车场',
        rows: 3,
      },
      rules: 'required',
    },
    {
      fieldName: 'currentRelatedRoads',
      label: '当前关联道路',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入当前关联道路',
        rows: 3,
      },
      rules: 'required',
    },
    {
      fieldName: 'toBeRelatedRoads',
      label: '待关联道路',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入待关联道路',
        rows: 3,
      },
      rules: 'required',
    },
    {
      fieldName: 'adjustReason',
      label: '调整原因',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入调整原因',
        rows: 4,
      },
      rules: 'required',
    },
    {
      fieldName: 'adjustTime',
      label: '调整时间',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择调整时间',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
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
    {
      fieldName: 'updatedParkCount',
      label: '更新后关联车场数',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入更新后关联车场数',
        min: 0,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'updatedRoadCount',
      label: '更新后关联道路数',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入更新后关联道路数',
        min: 0,
        precision: 0,
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
      field: 'currentRelatedParks',
      title: '当前关联车场',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'toBeRelatedParks',
      title: '待关联车场',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'currentRelatedRoads',
      title: '当前关联道路',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'toBeRelatedRoads',
      title: '待关联道路',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'adjustReason',
      title: '调整原因',
      minWidth: 250,
      sortable: true,
    },
    {
      field: 'adjustTime',
      title: '调整时间',
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
      field: 'updatedParkCount',
      title: '更新后关联车场数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'updatedRoadCount',
      title: '更新后关联道路数',
      minWidth: 120,
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
  editText: '编辑片区调整信息',
  addText: '新增片区调整信息',
  excelName: '片区调整列表',
  excelAllName: '全市片区调整数据.xlsx',
  total: '片区数量7;待新增关联车场总数:7;待新增关联道路总数:7;更新后总车场数:17;更新后总道路数:25',
};