/** 车库表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      id: 'G001', // 车库ID（使用字段id）
      assetExtendId: 'AE001', // 资产扩展ID（关联 tb_asset_extend）
      parkId: '1', // 所属车场ID（关联原有停车场id）
      garageName: '芗城区XX社区公共停车场-地下一层', // 车库名称
      floorCount: '1', // 楼层数
      totalParkingSpaces: '90', // 总车位数
      accessControlType: '道闸', // 门禁类型
      detailedAddress: '芗城区XX街道XX路88号地下一层', // 详细地址
      longitude: '117.6589', // 经度
      latitude: '24.5123', // 纬度
      enableStatus: '启用', // 启用状态
      creator: '张三', // 创建人
      createTime: '2025-01-10 09:20:30', // 创建时间
    },
    {
      id: 'G002',
      assetExtendId: 'AE002',
      parkId: '2',
      garageName: '龙文区碧湖公园停车场-地面层',
      floorCount: '1',
      totalParkingSpaces: '120',
      accessControlType: '车牌识别',
      detailedAddress: '龙文区碧湖路126号',
      longitude: '117.7056',
      latitude: '24.4987',
      enableStatus: '禁用',
      creator: '李四',
      createTime: '2025-01-12 14:15:20',
    },
    {
      id: 'G003',
      assetExtendId: 'AE003',
      parkId: '3',
      garageName: '龙海区石码镇便民停车场-地面层',
      floorCount: '1',
      totalParkingSpaces: '68',
      accessControlType: '道闸+刷卡',
      detailedAddress: '龙海区石码镇解放北路59号',
      longitude: '117.8901',
      latitude: '24.4562',
      enableStatus: '禁用',
      creator: '王五',
      createTime: '2025-01-15 10:05:10',
    },
    {
      id: 'G004',
      assetExtendId: 'AE004',
      parkId: '4',
      garageName: '龙海区闽齐社区停车场-地面层',
      floorCount: '1',
      totalParkingSpaces: '35',
      accessControlType: '车牌识别',
      detailedAddress: '闽齐社区西门',
      longitude: '117.8765',
      latitude: '24.4438',
      enableStatus: '启用',
      creator: '赵六',
      createTime: '2025-01-18 08:30:45',
    },
    {
      id: 'G005',
      assetExtendId: 'AE005',
      parkId: '5',
      garageName: '芗城区江滨路生态停车场-地面+地下一层',
      floorCount: '2',
      totalParkingSpaces: '150',
      accessControlType: '智能道闸',
      detailedAddress: '芗城区江滨南路189号',
      longitude: '117.6789',
      latitude: '24.5012',
      enableStatus: '启用',
      creator: '孙七',
      createTime: '2025-01-20 16:40:15',
    },
    {
      id: 'G006',
      assetExtendId: 'AE006',
      parkId: '6',
      garageName: '龙文区万达商圈停车场-地下一/二层',
      floorCount: '2',
      totalParkingSpaces: '200',
      accessControlType: '车牌识别+人脸识别',
      detailedAddress: '龙文区建元东路2号万达广场B1-B2层',
      longitude: '117.7234',
      latitude: '24.4897',
      enableStatus: '启用',
      creator: '周八',
      createTime: '2025-01-22 11:10:30',
    },
    {
      id: 'G007',
      assetExtendId: 'AE007',
      parkId: '7',
      garageName: '长泰区武安镇公共停车场-地面层',
      floorCount: '1',
      totalParkingSpaces: '85',
      accessControlType: '道闸',
      detailedAddress: '长泰区武安镇人民西路77号',
      longitude: '117.7890',
      latitude: '24.6123',
      enableStatus: '启用',
      creator: '吴九',
      createTime: '2025-01-25 13:25:40',
    },
    {
      id: 'G008',
      assetExtendId: 'AE008',
      parkId: '8',
      garageName: '漳浦县绥安镇便民停车场-地面层',
      floorCount: '1',
      totalParkingSpaces: '72',
      accessControlType: '刷卡',
      detailedAddress: '漳浦县绥安镇金浦大道101号',
      longitude: '117.4567',
      latitude: '24.1234',
      enableStatus: '禁用',
      creator: '郑十',
      createTime: '2025-01-28 09:50:25',
    },
    {
      id: 'G009',
      assetExtendId: 'AE009',
      parkId: '9',
      garageName: '芗城区巷口街道停车场-地面层',
      floorCount: '1',
      totalParkingSpaces: '45',
      accessControlType: '车牌识别',
      detailedAddress: '芗城区新华东路32号',
      longitude: '117.6890',
      latitude: '24.5234',
      enableStatus: '启用',
      creator: '张三',
      createTime: '2025-02-01 15:15:10',
    },
    {
      id: 'G010',
      assetExtendId: 'AE010',
      parkId: '10',
      garageName: '龙文区蓝田街道停车场-地下一层',
      floorCount: '1',
      totalParkingSpaces: '110',
      accessControlType: '智能道闸',
      detailedAddress: '龙文区蓝田街道梧桥中路58号地下一层',
      longitude: '117.7123',
      latitude: '24.4789',
      enableStatus: '启用',
      creator: '李四',
      createTime: '2025-02-05 10:30:50',
    },
    {
      id: 'G011',
      assetExtendId: 'AE011',
      parkId: '11',
      garageName: '龙文区步文街道停车场-地下一/二层',
      floorCount: '2',
      totalParkingSpaces: '180',
      accessControlType: '车牌识别+道闸',
      detailedAddress: '龙文区步文街道天亭路23号地下车库',
      longitude: '117.7345',
      latitude: '24.4812',
      enableStatus: '启用',
      creator: '王五',
      createTime: '2025-02-08 14:20:15',
    },
    {
      id: 'G012',
      assetExtendId: 'AE012',
      parkId: '12',
      garageName: '芗城区东铺头街道停车场-地面层',
      floorCount: '1',
      totalParkingSpaces: '95',
      accessControlType: '道闸',
      detailedAddress: '芗城区东铺头街道新华西路128号',
      longitude: '117.6456',
      latitude: '24.5189',
      enableStatus: '启用',
      creator: '赵六',
      createTime: '2025-02-10 09:40:30',
    },
  ];
};

/** 车库表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '车库ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车库ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'assetExtendId',
      label: '资产扩展ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入资产扩展ID（关联tb_asset_extend）',
      },
      rules: 'required',
    },
    {
      fieldName: 'parkId',
      label: '所属车场ID',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属车场',
        options: [
          { label: '芗城区XX社区公共停车场', value: '1' },
          { label: '龙文区碧湖公园停车场', value: '2' },
          { label: '龙海区石码镇便民停车场', value: '3' },
          { label: '龙海区闽齐社区停车场', value: '4' },
          { label: '芗城区江滨路生态停车场', value: '5' },
          { label: '龙文区万达商圈停车场', value: '6' },
          { label: '长泰区武安镇公共停车场', value: '7' },
          { label: '漳浦县绥安镇便民停车场', value: '8' },
          { label: '芗城区巷口街道停车场', value: '9' },
          { label: '龙文区蓝田街道停车场', value: '10' },
          { label: '龙文区步文街道停车场', value: '11' },
          { label: '芗城区东铺头街道停车场', value: '12' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'garageName',
      label: '车库名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车库名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'floorCount',
      label: '楼层数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入楼层数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'totalParkingSpaces',
      label: '总车位数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入总车位数',
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'accessControlType',
      label: '门禁类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择门禁类型',
        options: [
          { label: '道闸', value: '道闸' },
          { label: '车牌识别', value: '车牌识别' },
          { label: '道闸+刷卡', value: '道闸+刷卡' },
          { label: '智能道闸', value: '智能道闸' },
          { label: '车牌识别+人脸识别', value: '车牌识别+人脸识别' },
          { label: '刷卡', value: '刷卡' },
          { label: '车牌识别+道闸', value: '车牌识别+道闸' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'detailedAddress',
      label: '详细地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入详细地址',
      },
      rules: 'required',
    },
    {
      fieldName: 'longitude',
      label: '经度',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经度（例：117.6589）',
      },
      rules: 'required',
    },
    {
      fieldName: 'latitude',
      label: '纬度',
      component: 'Input',
      componentProps: {
        placeholder: '请输入纬度（例：24.5123）',
      },
      rules: 'required',
    },
    {
      fieldName: 'enableStatus',
      label: '启用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择启用状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'creator',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人',
      },
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
  ];
}

/** 车库表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '车库ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'assetExtendId',
      title: '资产扩展ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'parkId',
      title: '所属车场ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'garageName',
      title: '车库名称',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'floorCount',
      title: '楼层数',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'totalParkingSpaces',
      title: '总车位数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'accessControlType',
      title: '门禁类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'detailedAddress',
      title: '详细地址',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'longitude',
      title: '经度',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'latitude',
      title: '纬度',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'enableStatus',
      title: '启用状态',
      minWidth: 100,
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
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑车库',
  addText: '新增车库',
  // 导出Excel相关文本
  excelName: '车库列表',
  excelAllName: '全市车库数据.xlsx',
  // 统计总计文本（结合之前生成的车库数据统计）
  total: ' 总计: 车库数量12;车位总数:1245;评价车库车位8',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '车库ID' },
  { key: 'assetExtendId', label: '资产扩展ID' },
  { key: 'parkId', label: '所属车场ID' },
  { key: 'garageName', label: '车库名称' },
  { key: 'floorCount', label: '楼层数' },
  { key: 'totalParkingSpaces', label: '总车位数' },
  { key: 'accessControlType', label: '门禁类型' },
  { key: 'detailedAddress', label: '详细地址' },
  { key: 'longitude', label: '经度' },
  { key: 'latitude', label: '纬度' },
  { key: 'enableStatus', label: '启用状态' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
];
