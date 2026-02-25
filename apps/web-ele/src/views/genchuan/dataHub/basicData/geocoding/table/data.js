/** 地理编码表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      geoCode: 'GC001',              // 地理编码
      parentGeoCodeId: null,         // 父级地理编码ID
      locationName: '芗城区',            // 地点名称
      areaName: '漳州市',            // 所属区域
      layerTypeName: '区域',            // 图层类型
      beidouGridCode: '1234567890',  // 北斗网格码
      coordinateInfo: '117.6589, 24.5123', // 坐标信息
      adminCode: '350602',           // 行政区划代码
      statusName: '正常',            // 状态
      uniqueCode: '350602001001001', // 15位标识码
      creator: '张三',               // 创建人
      createTime: '2025-01-10 09:20:30', // 创建时间
      updateTime: '2025-01-10 09:20:30', // 更新时间
      checkResultName: '通过'        // 数据质量校验结果
    },
    {
      geoCode: 'GC002',
      parentGeoCodeId: null,
      locationName: '龙文区',
      areaName: '漳州市',
      layerTypeName: '区域',
      beidouGridCode: '0987654321',
      coordinateInfo: '117.7234, 24.4897',
      adminCode: '350603',
      statusName: '正常',
      uniqueCode: '350603002002002',
      creator: '李四',
      createTime: '2025-01-12 14:15:20',
      updateTime: '2025-01-12 14:15:20',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC003',
      parentGeoCodeId: 'GC001',
      locationName: '东铺头街道',
      areaName: '芗城区',
      layerTypeName: '地片',
      beidouGridCode: '1357924680',
      coordinateInfo: '117.6456, 24.5189',
      adminCode: '350602001',
      statusName: '正常',
      uniqueCode: '350602001001003',
      creator: '王五',
      createTime: '2025-01-15 10:05:10',
      updateTime: '2025-01-20 16:30:00',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC004',
      parentGeoCodeId: 'GC001',
      locationName: '巷口街道',
      areaName: '芗城区',
      layerTypeName: '地片',
      beidouGridCode: '2468013579',
      coordinateInfo: '117.6678, 24.5234',
      adminCode: '350602002',
      statusName: '正常',
      uniqueCode: '350602002002004',
      creator: '赵六',
      createTime: '2025-01-18 08:30:45',
      updateTime: '2025-01-18 08:30:45',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC005',
      parentGeoCodeId: 'GC002',
      locationName: '步文街道',
      areaName: '龙文区',
      layerTypeName: '地片',
      beidouGridCode: '9753108642',
      coordinateInfo: '117.7123, 24.4789',
      adminCode: '350603001',
      statusName: '正常',
      uniqueCode: '350603001003005',
      creator: '孙七',
      createTime: '2025-01-20 16:40:15',
      updateTime: '2025-01-20 16:40:15',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC006',
      parentGeoCodeId: 'GC003',
      locationName: '新华北路',
      areaName: '东铺头街道',
      layerTypeName: '街巷',
      beidouGridCode: '8642097531',
      coordinateInfo: '117.6543, 24.5156',
      adminCode: '350602001001',
      statusName: '正常',
      uniqueCode: '350602001001006',
      creator: '周八',
      createTime: '2025-01-22 11:10:30',
      updateTime: '2025-01-22 11:10:30',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC007',
      parentGeoCodeId: 'GC004',
      locationName: '南昌路',
      areaName: '巷口街道',
      layerTypeName: '街巷',
      beidouGridCode: '7531086429',
      coordinateInfo: '117.6650, 24.5180',
      adminCode: '350602002002',
      statusName: '正常',
      uniqueCode: '350602002002007',
      creator: '吴九',
      createTime: '2025-01-25 13:25:40',
      updateTime: '2025-01-28 14:20:00',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC008',
      parentGeoCodeId: 'GC005',
      locationName: '九龙大道',
      areaName: '步文街道',
      layerTypeName: '街巷',
      beidouGridCode: '6429753108',
      coordinateInfo: '117.7234, 24.4897',
      adminCode: '350603001003',
      statusName: '正常',
      uniqueCode: '350603001003008',
      creator: '郑十',
      createTime: '2025-01-28 09:50:25',
      updateTime: '2025-01-28 09:50:25',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC009',
      parentGeoCodeId: 'GC006',
      locationName: '新华北路1号',
      areaName: '新华北路',
      layerTypeName: '门楼牌',
      beidouGridCode: '5310864297',
      coordinateInfo: '117.6589, 24.5123',
      adminCode: '350602001001001',
      statusName: '正常',
      uniqueCode: '350602001001001009',
      creator: '张三',
      createTime: '2025-02-01 15:15:10',
      updateTime: '2025-02-01 15:15:10',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC010',
      parentGeoCodeId: 'GC007',
      locationName: '南昌路88号',
      areaName: '南昌路',
      layerTypeName: '门楼牌',
      beidouGridCode: '4297531086',
      coordinateInfo: '117.6678, 24.5234',
      adminCode: '350602002002002',
      statusName: '正常',
      uniqueCode: '350602002002002010',
      creator: '李四',
      createTime: '2025-02-05 10:30:50',
      updateTime: '2025-02-05 10:30:50',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC011',
      parentGeoCodeId: 'GC008',
      locationName: '九龙大道168号',
      areaName: '九龙大道',
      layerTypeName: '门楼牌',
      beidouGridCode: '3108642975',
      coordinateInfo: '117.7234, 24.4897',
      adminCode: '350603001003003',
      statusName: '正常',
      uniqueCode: '350603001003003011',
      creator: '王五',
      createTime: '2025-02-08 14:20:15',
      updateTime: '2025-02-08 14:20:15',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC012',
      parentGeoCodeId: 'GC009',
      locationName: '漳州市人民政府',
      areaName: '新华北路1号',
      layerTypeName: '兴趣点',
      beidouGridCode: '2975310864',
      coordinateInfo: '117.6589, 24.5123',
      adminCode: '350602',
      statusName: '正常',
      uniqueCode: '350602001001001012',
      creator: '赵六',
      createTime: '2025-02-10 09:40:30',
      updateTime: '2025-02-15 16:00:00',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC013',
      parentGeoCodeId: 'GC010',
      locationName: '漳州市第一中学',
      areaName: '南昌路88号',
      layerTypeName: '兴趣点',
      beidouGridCode: '1086429753',
      coordinateInfo: '117.6678, 24.5234',
      adminCode: '350602',
      statusName: '正常',
      uniqueCode: '350602002002002013',
      creator: '孙七',
      createTime: '2025-02-12 10:20:15',
      updateTime: '2025-02-12 10:20:15',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC014',
      parentGeoCodeId: 'GC011',
      locationName: '漳州万达广场',
      areaName: '九龙大道168号',
      layerTypeName: '兴趣点',
      beidouGridCode: '0864297531',
      coordinateInfo: '117.7234, 24.4897',
      adminCode: '350603',
      statusName: '正常',
      uniqueCode: '350603001003003014',
      creator: '周八',
      createTime: '2025-02-15 14:30:45',
      updateTime: '2025-02-15 14:30:45',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC015',
      parentGeoCodeId: 'GC003',
      locationName: '漳州市人民公园',
      areaName: '东铺头街道',
      layerTypeName: '兴趣点',
      beidouGridCode: '8642975310',
      coordinateInfo: '117.6456, 24.5189',
      adminCode: '350602',
      statusName: '正常',
      uniqueCode: '350602001001004015',
      creator: '吴九',
      createTime: '2025-02-18 09:10:30',
      updateTime: '2025-02-18 09:10:30',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC016',
      parentGeoCodeId: 'GC005',
      locationName: '漳州市博物馆',
      areaName: '步文街道',
      layerTypeName: '兴趣点',
      beidouGridCode: '7531086429',
      coordinateInfo: '117.7345, 24.4812',
      adminCode: '350603',
      statusName: '维护中',
      uniqueCode: '350603001003004016',
      creator: '郑十',
      createTime: '2025-02-20 10:20:15',
      updateTime: '2025-02-25 16:30:00',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC017',
      parentGeoCodeId: 'GC006',
      locationName: '漳州市医院',
      areaName: '新华北路',
      layerTypeName: '兴趣点',
      beidouGridCode: '6429753108',
      coordinateInfo: '117.6543, 24.5156',
      adminCode: '350602',
      statusName: '正常',
      uniqueCode: '350602001001005017',
      creator: '张三',
      createTime: '2025-02-22 11:10:30',
      updateTime: '2025-02-22 11:10:30',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC018',
      parentGeoCodeId: 'GC005',
      locationName: '漳州市体育中心',
      areaName: '步文街道',
      layerTypeName: '兴趣点',
      beidouGridCode: '5310864297',
      coordinateInfo: '117.7123, 24.4789',
      adminCode: '350603',
      statusName: '维护中',
      uniqueCode: '350603001003005018',
      creator: '李四',
      createTime: '2025-02-25 13:25:40',
      updateTime: '2025-02-28 14:20:00',
      checkResultName: '通过'
    },
    {
      geoCode: 'GC019',
      parentGeoCodeId: 'GC001',
      locationName: '漳州市老城区',
      areaName: '芗城区',
      layerTypeName: '区域',
      beidouGridCode: '4297531086',
      coordinateInfo: '117.6400, 24.5200',
      adminCode: '350602',
      statusName: '停用',
      uniqueCode: '350602003003001019',
      creator: '王五',
      createTime: '2025-02-20 09:30:00',
      updateTime: '2025-02-25 15:00:00',
      checkResultName: '未通过'
    },
    {
      geoCode: 'GC020',
      parentGeoCodeId: null,
      locationName: '漳州高新区',
      areaName: '漳州市',
      layerTypeName: '区域',
      beidouGridCode: '3108642975',
      coordinateInfo: '117.6800, 24.4500',
      adminCode: '350604',
      statusName: '建设中',
      uniqueCode: '350604001001001020',
      creator: '赵六',
      createTime: '2025-02-15 10:00:00',
      updateTime: '2025-02-20 16:00:00',
      checkResultName: '通过'
    }
  ];
};

/** 地理编码表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'geoCode',
      label: '地理编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入地理编码',
      },
      rules: 'required'
    },
    {
      fieldName: 'locationName',
      label: '地点名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入地点名称'
      },
      rules: 'required'
    },
    {
      fieldName: 'areaName',
      label: '所属区域',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属区域',
        options: [
          { label: '芗城区', value: '芗城区' },
          { label: '龙文区', value: '龙文区' },
          { label: '龙海区', value: '龙海区' },
          { label: '长泰区', value: '长泰区' },
          { label: '漳浦县', value: '漳浦县' },
          { label: '云霄县', value: '云霄县' },
          { label: '诏安县', value: '诏安县' },
          { label: '东山县', value: '东山县' },
          { label: '南靖县', value: '南靖县' },
          { label: '平和县', value: '平和县' },
          { label: '华安县', value: '华安县' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'layerTypeName',
      label: '图层类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择图层类型',
        options: [
          { label: '区域', value: '区域' },
          { label: '地片', value: '地片' },
          { label: '街巷', value: '街巷' },
          { label: '门楼牌', value: '门楼牌' },
          { label: '兴趣点', value: '兴趣点' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'beidouGridCode',
      label: '北斗网格码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入北斗网格码'
      },
      rules: 'required'
    },
    {
      fieldName: 'coordinateInfo',
      label: '坐标信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入坐标信息（格式：经度,纬度）'
      },
      rules: 'required'
    },
    {
      fieldName: 'adminCode',
      label: '行政区划代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入行政区划代码'
      },
      rules: 'required'
    },
    {
      fieldName: 'statusName',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '维护中', value: '维护中' },
          { label: '停用', value: '停用' },
          { label: '建设中', value: '建设中' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'uniqueCode',
      label: '15位标识码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入15位标识码'
      },
      rules: 'required'
    },
    {
      fieldName: 'creator',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人'
      },
      rules: 'required'
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择更新时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'checkResultName',
      label: '数据质量校验结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择数据质量校验结果',
        options: [
          { label: '通过', value: '通过' },
          { label: '未通过', value: '未通过' }
        ]
      },
      rules: 'required'
    }
  ];
}

/** 地理编码表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'geoCode',
      title: '地理编码',
      minWidth: 100,
      sortable: true,
      slots: { default: 'geoCode' },
    },
    {
      field: 'locationName',
      title: '地点名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'locationName' },
    },
    {
      field: 'areaName',
      title: '所属区域',
      minWidth: 100,
      sortable: true,
      slots: { default: 'areaName' },
    },
    {
      field: 'layerTypeName',
      title: '图层类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'layerTypeName' },
    },
    {
      field: 'beidouGridCode',
      title: '北斗网格码',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'coordinateInfo',
      title: '坐标信息',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'adminCode',
      title: '行政区划代码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' },
    },
    {
      field: 'uniqueCode',
      title: '15位标识码',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'checkResultName',
      title: '数据质量校验结果',
      minWidth: 150,
      sortable: true,
      slots: { default: 'checkResultName' },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑地理编码',
  addText: '新增地理编码',
  // 导出Excel相关文本
  excelName: '地理编码列表',
  excelAllName: '全市地理编码数据.xlsx',
  // 统计总计文本
  total: ' 总计: 地理编码数量20',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'geoCode', label: '地理编码' },
  { key: 'locationName', label: '地点名称' },
  { key: 'areaName', label: '所属区域' },
  { key: 'layerTypeName', label: '图层类型' },
  { key: 'beidouGridCode', label: '北斗网格码' },
  { key: 'coordinateInfo', label: '坐标信息' },
  { key: 'adminCode', label: '行政区划代码' },
  { key: 'statusName', label: '状态' },
  { key: 'uniqueCode', label: '15位标识码' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'checkResultName', label: '数据质量校验结果' }
];

/** 获取地理编码统计数据 */
export const getGeocodingStatsData = () => {
  // 获取所有地理编码数据
  const geocodingData = dataList();

  // 计算卡片数据
  const totalCount = geocodingData.length;
  
  // 计算各图层类型编码数
  const layerTypeStats = {};
  geocodingData.forEach((item) => {
    layerTypeStats[item.layerTypeName] = (layerTypeStats[item.layerTypeName] || 0) + 1;
  });
  const layerTypeCount = Object.keys(layerTypeStats).length;
  
  // 计算正常状态编码数
  const normalCount = geocodingData.filter(
    (item) => item.statusName === '正常'
  ).length;

  // 计算图层类型占比数据
  const layerTypeChartData = Object.entries(layerTypeStats).map(([name, value]) => ({
    name,
    value,
  }));

  // 计算数据质量校验结果占比数据
  const checkResultStats = {};
  geocodingData.forEach((item) => {
    checkResultStats[item.checkResultName] = (checkResultStats[item.checkResultName] || 0) + 1;
  });
  const checkResultChartData = Object.entries(checkResultStats).map(([name, value]) => ({
    name,
    value,
  }));

  // 计算不同区域地理编码数量对比数据
  const areaStats = {};
  geocodingData.forEach((item) => {
    areaStats[item.areaName] = (areaStats[item.areaName] || 0) + 1;
  });
  const areaChartData = {
    xAxis: Object.keys(areaStats),
    series: Object.values(areaStats),
  };

  return {
    cards: [
      {
        title: '总地理编码数',
        value: totalCount,
        desc: `共${totalCount}条地理编码`,
        color: '#4A90E2',
      },
      {
        title: '各图层类型编码数',
        value: layerTypeCount,
        desc: `共${layerTypeCount}种图层类型`,
        color: '#13ce66',
      },
      {
        title: '正常状态编码数',
        value: normalCount,
        desc: `正常状态${normalCount}条`,
        color: '#FF6B8B',
      },
    ],
    charts: [
      {
        type: 'pie',
        title: '图层类型占比',
        data: layerTypeChartData,
      },
      {
        type: 'pie',
        title: '数据质量校验结果占比',
        data: checkResultChartData,
      },
      {
        type: 'bar',
        title: '不同区域地理编码数量对比',
        xAxis: areaChartData.xAxis,
        series: areaChartData.series,
      },
    ],
  };
};

