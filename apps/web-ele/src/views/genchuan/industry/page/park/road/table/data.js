export function useFormSchema() {
  return [
    {
      fieldName: 'id', // 对齐表格 field: 'id'（原 berthId 改为 id）
      label: '泊位ID', // 对齐表格标题「泊位ID」
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入泊位ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'berthCode',
      label: '泊位编号',
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入泊位编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'roadName',
      label: '路段名称',
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入路段名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'locationDesc',
      label: '位置描述',
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入详细位置描述',
      },
      rules: 'required',
    },
    {
      fieldName: 'berthType',
      label: '泊位类型',
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请选择泊位类型', 
      },
      rules: 'required',
    },
    {
      fieldName: 'coordinateX', // 对齐表格 field: 'coordinateX'（原 coordX 改为 coordinateX）
      label: '坐标X', // 对齐表格标题「坐标X」
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入经度坐标（例：117.658921）',
      },
      rules: 'required',
    },
    {
      fieldName: 'coordinateY', // 对齐表格 field: 'coordinateY'（原 coordY 改为 coordinateY）
      label: '坐标Y', // 对齐表格标题「坐标Y」
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入纬度坐标（例：24.512345）',
      },
      rules: 'required',
    },
     {
      fieldName: 'currentCar', // 对齐表格 field: 'coordinateY'（原 coordY 改为 coordinateY）
      label: '当前车辆', // 对齐表格标题「坐标Y」
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入当前车辆',
      },
      rules: 'required',
    },
    {
      fieldName: 'berthStatus', // 对齐表格 field: 'berthStatus'（原 enableStatus 改为 berthStatus）
      label: '启用状态', // 对齐表格标题「启用状态」
      component: 'Select',
      labelWidth: '150',
      componentProps: {
        placeholder: '请选择启用状态',
        options: [
          { label: '占用', value: '占用' },
          { label: '空闲', value: '空闲' }, 
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'areaCode', // 对齐表格 field: 'areaCode'（原 divisionCode 改为 areaCode）
      label: '所属行政区划代码', // 对齐表格标题「所属行政区划代码」
      component: 'Select',
      labelWidth: '150',
      componentProps: {
        placeholder: '请选择所属行政区划代码',
        options: [
          { label: '芗城区东铺头街道 350602001', value: '350602001' },
          { label: '芗城区巷口街道 350602002', value: '350602002' },
          { label: '芗城区西桥街道 350602004', value: '350602004' },
          { label: '龙文区碧湖街道 350603002', value: '350603002' },
          { label: '龙文区蓝田街道 350603005', value: '350603005' },
          { label: '龙海区石码街道 350604001', value: '350604001' },
          { label: '龙海区海澄镇 350604002', value: '350604002' },
          { label: '长泰区武安镇 350625001', value: '350625001' },
          { label: '漳浦县绥安镇 350623001', value: '350623001' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'roadsideInfo', // 对齐表格 field: 'roadsideInfo'（原 roadSideManage 改为 roadsideInfo）
      label: '路侧管理信息', // 对齐表格标题「路侧管理信息」
      component: 'Input',
      labelWidth: '150',
      componentProps: {
        placeholder: '请输入路侧管理信息',
      },
      rules: 'required',
    },
  ];
}
/** 泊位表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '泊位ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'berthCode',
      title: '泊位编号',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'roadName',
      title: '路段名称',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'locationDesc',
      title: '位置描述',
      minWidth: 250,
      sortable: true,
    },
    {
      field: 'berthType',
      title: '泊位类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'coordinateX',
      title: '坐标X',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'coordinateY',
      title: '坐标Y',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'currentCar',
      title: '当前车辆',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'berthStatus',
      title: '启用状态',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'areaCode',
      title: '所属行政区划代码',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'roadsideInfo',
      title: '路侧管理信息',
      minWidth: 200,
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

/** 泊位文字描述对象 */
export const textObj = {
  editText: '编辑泊位',
  addText: '新增泊位',
  excelName: '泊位列表',
  excelAllName: '全市泊位数据.xlsx',
  total: ' 总计: 泊位数量215;启用泊位189;维护中泊位6',
};
