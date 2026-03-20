/** 表格初始数据 - 小广告乱贴治理周度统计（直接显示中文设施类型） */
export const dataList = () => [
  {
    facilityLocation: '鼓楼区杨桥东路20号路灯杆',
    facilityType: '路灯杆', // 直接使用中文，字段名也改为更语义化的facilityType
    count: 8,
    cleanAreaCode: '35010201',
    cleanDifficultyId: '2',
    cleanerId: '1001',
    orderNo: 'AD-20240623-001',
    warningPhotos: 'https://example.com/photos/ad001.jpg',
  },
  {
    facilityLocation: '鼓楼区杨桥东路45号公交站牌',
    facilityType: '公交站牌', // 直接使用中文
    count: 3,
    cleanAreaCode: '35010201',
    cleanDifficultyId: '1',
    cleanerId: '1002',
    orderNo: 'AD-20240623-015',
    warningPhotos: 'https://example.com/photos/ad002.jpg',
  },
  {
    facilityLocation: '思明区鹭江道18号路灯杆',
    facilityType: '路灯杆',
    count: 12,
    cleanAreaCode: '35020304',
    cleanDifficultyId: '3',
    cleanerId: '2005',
    orderNo: 'AD-20240623-032',
    warningPhotos: 'https://example.com/photos/ad015.jpg',
  },
  {
    facilityLocation: '丰泽区刺桐路110号路灯杆',
    facilityType: '路灯杆',
    count: 20,
    cleanAreaCode: '35050302',
    cleanDifficultyId: '3',
    cleanerId: '3012',
    orderNo: 'AD-20240623-107',
    warningPhotos: 'https://example.com/photos/ad107.jpg',
  },
  {
    facilityLocation: '芗城区胜利路15号路灯杆',
    facilityType: '路灯杆',
    count: 4,
    cleanAreaCode: '35060203',
    cleanDifficultyId: '2',
    cleanerId: '4021',
    orderNo: 'AD-20240621-056',
    warningPhotos: 'https://example.com/photos/ad056.jpg',
  },
  {
    facilityLocation: '芗城区胜利路公交站台',
    facilityType: '公交站牌',
    count: 7,
    cleanAreaCode: '35060203',
    cleanDifficultyId: '2',
    cleanerId: '4022',
    orderNo: 'AD-20240623-089',
    warningPhotos: 'https://example.com/photos/ad089.jpg',
  },
  {
    facilityLocation: '蕉城区闽东中路5号路灯杆',
    facilityType: '路灯杆',
    count: 6,
    cleanAreaCode: '35090205',
    cleanDifficultyId: '2',
    cleanerId: '5033',
    orderNo: 'AD-20240622-063',
    warningPhotos: 'https://example.com/photos/ad063.jpg',
  },
  {
    facilityLocation: '新罗区龙川路33号路灯杆',
    facilityType: '路灯杆',
    count: 11,
    cleanAreaCode: '35080201',
    cleanDifficultyId: '3',
    cleanerId: '6045',
    orderNo: 'AD-20240623-124',
    warningPhotos: 'https://example.com/photos/ad124.jpg',
  },
];

/** 新增/修改的表单/列表的搜索表单 - 小广告乱贴治理周度统计（适配中文类型） */
export function useFormSchema() {
  return [
    {
      fieldName: 'facilityLocation',
      label: '设施位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设施具体位置',
        maxlength: 200,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'facilityType', // 同步改为facilityType
      label: '设施类型',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择设施类型',
        options: [
          { label: '路灯杆', value: '路灯杆' }, // value直接为中文
          { label: '公交站牌', value: '公交站牌' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'count',
      label: '乱贴数量',
      component: 'InputNumber',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入乱贴数量',
        min: 0,
        precision: 0,
        addonAfter: '张',
      },
      rules: 'required',
    },
    {
      fieldName: 'cleanAreaCode',
      label: '保洁责任区',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择保洁责任区',
        options: [
          { label: '鼓楼东街', value: '35010201' },
          { label: '思明鹭江', value: '35020304' },
          { label: '丰泽刺桐', value: '35050302' },
          { label: '芗城胜利', value: '35060203' },
          { label: '蕉城闽东', value: '35090205' },
          { label: '新罗龙川', value: '35080201' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'cleanDifficultyId',
      label: '清理难度等级',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择清理难度等级',
        options: [
          { label: '易', value: '1' },
          { label: '中', value: '2' },
          { label: '难', value: '3' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'cleanerId',
      label: '保洁员',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择保洁员',
        options: [
          { label: '张师傅', value: '1001' },
          { label: '李师傅', value: '1002' },
          { label: '王师傅', value: '2005' },
          { label: '陈师傅', value: '2006' },
          { label: '林师傅', value: '3012' },
          { label: '黄师傅', value: '3013' },
          { label: '周师傅', value: '4021' },
          { label: '吴师傅', value: '4022' },
          { label: '郑师傅', value: '5033' },
          { label: '刘师傅', value: '6045' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'orderNo',
      label: '工单编号',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入工单编号',
        maxlength: 50,
      },
      rules: 'required',
    },
    {
      fieldName: 'warningPhotos',
      label: '预警照片',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入照片URL',
        maxlength: 500,
      },
    },
  ];
}

/** 表格字段 - 小广告乱贴治理周度统计表格列（适配中文类型） */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'facilityLocation',
      title: '设施位置',
      minWidth: 250,
      sortable: true,
      slots: { default: 'facilityLocation' },
    },
    {
      field: 'facilityType', // 同步改为facilityType
      title: '设施类型',
      minWidth: 100,
      sortable: true,
      // 无需slot映射，直接显示中文
    },
    {
      field: 'count',
      title: '乱贴数量(张)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'cleanAreaCode',
      title: '保洁责任区',
      minWidth: 130,
      sortable: true,
      slots: { default: 'cleanAreaCode' },
    },
    {
      field: 'cleanDifficultyId',
      title: '清理难度等级',
      minWidth: 130,
      sortable: true,
      slots: { default: 'cleanDifficultyId' },
    },
    {
      field: 'cleanerId',
      title: '保洁员',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cleanerId' },
    },
    {
      field: 'orderNo',
      title: '工单编号',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'warningPhotos',
      title: '预警照片',
      minWidth: 150,
      sortable: false,
      slots: { default: 'warningPhotos' },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
