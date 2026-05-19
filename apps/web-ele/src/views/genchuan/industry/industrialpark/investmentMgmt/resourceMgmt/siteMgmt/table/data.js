import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { getSiteMgmtPage } from '#/api/genchuan/industry/industrialpark/investmentMgmt/resourceMgmt/siteMgmt';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取场地状态标签类型（使用标准字典函数） */
export function getSiteStatusTagType(status) {
  const dict = getDictObj(DICT_TYPE.SITE_MGMT_SITE_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取场地状态字典标签 */
export function getSiteStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.SITE_MGMT_SITE_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 获取场地状态配置 */
export function getSiteStatusConfig(status) {
  const dict = getDictObj(DICT_TYPE.SITE_MGMT_SITE_STATUS, String(status));
  return {
    label: dict ? dict.label : status,
    colorType: dict ? dict.colorType : '',
    tagType: getDictTagTypeFromDict(dict, 'primary'),
  };
}

/** 客户档案数据（模拟） */
export const clientList = [
  { id: 5, name: '张三科技有限公司' },
  { id: 8, name: '百度在线网络技术公司' },
  { id: 12, name: '京东科技信息技术公司' },
];

/** 企业档案数据（模拟） */
export const companyList = [
  { id: 101, name: '华为技术有限公司' },
  { id: 105, name: '阿里巴巴集团' },
  { id: 108, name: '腾讯科技深圳有限公司' },
  { id: 112, name: '字节跳动科技有限公司' },
];

/** 场地管理静态数据 - 用于错误回退和初始加载 */
const staticDataList = [
  {
    id: 1,
    siteCode: 'SITE-20250501-001',
    siteLocation: '园区 A 栋 3 层',
    siteArea: 120,
    rentInfo: '30 元/㎡/月',
    facility: '水电、网络、空调',
    siteStatus: 0,
    orderClient: null,
    orderClientName: null,
    signCompany: null,
    signCompanyName: null,
    handleUser: 'admin',
    handleUserName: '管理员',
    creator: 'admin',
    createTime: 1_746_748_800_000,
    updateTime: 1_746_748_800_000,
    lngLat: '118.675324,24.896541',
    photos:
      '/static/imgs/site-mgmt/photo1.jpg,/static/imgs/site-mgmt/photo2.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan1.png',
  },
  {
    id: 2,
    siteCode: 'SITE-20250501-002',
    siteLocation: '园区 B 栋 2 层',
    siteArea: 150,
    rentInfo: '32 元/㎡/月',
    facility: '水电、网络、空调、电梯',
    siteStatus: 1,
    orderClient: 5,
    orderClientName: '张三科技有限公司',
    signCompany: null,
    signCompanyName: null,
    handleUser: 'admin',
    handleUserName: '管理员',
    creator: 'admin',
    createTime: 1_746_747_180_000,
    updateTime: 1_746_824_400_000,
    lngLat: '118.678923,24.898765',
    photos: '/static/imgs/site-mgmt/photo3.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan2.png',
  },
  {
    id: 3,
    siteCode: 'SITE-20250502-001',
    siteLocation: '园区 C 栋 1 层',
    siteArea: 200,
    rentInfo: '28 元/㎡/月',
    facility: '水电、网络、空调、电梯、停车场',
    siteStatus: 2,
    orderClient: null,
    orderClientName: null,
    signCompany: 101,
    signCompanyName: '华为技术有限公司',
    handleUser: 'zhangsan',
    handleUserName: '张三',
    creator: 'zhangsan',
    createTime: 1_746_662_100_000,
    updateTime: 1_746_912_300_000,
    lngLat: '118.681234,24.901234',
    photos:
      '/static/imgs/site-mgmt/photo4.jpg,/static/imgs/site-mgmt/photo5.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan3.png',
  },
  {
    id: 4,
    siteCode: 'SITE-20250503-001',
    siteLocation: '园区 D 栋 4 层',
    siteArea: 180,
    rentInfo: '35 元/㎡/月',
    facility: '水电、网络',
    siteStatus: 0,
    orderClient: null,
    orderClientName: null,
    signCompany: null,
    signCompanyName: null,
    handleUser: 'lisi',
    handleUserName: '李四',
    creator: 'lisi',
    createTime: '1746662100000',
    updateTime: '1746662100000',
    lngLat: '118.674567,24.894321',
    photos: '/static/imgs/site-mgmt/photo6.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan4.png',
  },
  {
    id: 5,
    siteCode: 'SITE-20250504-001',
    siteLocation: '园区 E 栋 2 层东侧',
    siteArea: 160,
    rentInfo: '30 元/㎡/月，年付优惠 5%',
    facility: '水电、网络、空调、电梯',
    siteStatus: 1,
    orderClient: 8,
    orderClientName: '百度在线网络技术公司',
    signCompany: null,
    signCompanyName: null,
    handleUser: 'wangwu',
    handleUserName: '王五',
    creator: 'wangwu',
    createTime: '1746662100000',
    updateTime: '1746662100000',
    lngLat: '118.679876,24.900123',
    photos:
      '/static/imgs/site-mgmt/photo7.jpg,/static/imgs/site-mgmt/photo8.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan5.png',
  },
  {
    id: 6,
    siteCode: 'SITE-20250505-001',
    siteLocation: '园区 F 栋 1 层',
    siteArea: 250,
    rentInfo: '26 元/㎡/月',
    facility: '水电、网络、空调、电梯、停车场、会议室',
    siteStatus: 2,
    orderClient: null,
    orderClientName: null,
    signCompany: 105,
    signCompanyName: '阿里巴巴集团',
    handleUser: 'zhaoliu',
    handleUserName: '赵六',
    creator: 'zhaoliu',
    createTime: 1_746_662_100_000,
    updateTime: '1746662100000',
    lngLat: '118.682345,24.903456',
    photos: '/static/imgs/site-mgmt/photo9.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan6.png',
  },
  {
    id: 7,
    siteCode: 'SITE-20250506-001',
    siteLocation: '园区 G 栋 3 层西侧',
    siteArea: 140,
    rentInfo: '33 元/㎡/月',
    facility: '水电、网络、空调',
    siteStatus: 0,
    orderClient: null,
    orderClientName: null,
    signCompany: null,
    signCompanyName: null,
    handleUser: 'sunqi',
    handleUserName: '孙七',
    creator: 'sunqi',
    createTime: 1_746_319_200_000,
    updateTime: 1_746_319_200_000,
    lngLat: '118.676123,24.897654',
    photos: '/static/imgs/site-mgmt/photo10.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan7.png',
  },
  {
    id: 8,
    siteCode: 'SITE-20250507-001',
    siteLocation: '园区 H 栋 2 层',
    siteArea: 190,
    rentInfo: '29 元/㎡/月',
    facility: '水电、网络、空调、电梯',
    siteStatus: 2,
    orderClient: null,
    orderClientName: null,
    signCompany: 108,
    signCompanyName: '腾讯科技深圳有限公司',
    handleUser: 'zhouba',
    handleUserName: '周八',
    creator: 'zhouba',
    createTime: 1_746_233_400_000,
    updateTime: 1_746_825_300_000,
    lngLat: '118.683456,24.905678',
    photos:
      '/static/imgs/site-mgmt/photo11.jpg,/static/imgs/site-mgmt/photo12.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan8.png',
  },
  {
    id: 9,
    siteCode: 'SITE-20250508-001',
    siteLocation: '园区 I 栋 1 层',
    siteArea: 220,
    rentInfo: '27 元/㎡/月',
    facility: '水电、网络、空调、电梯、停车场',
    siteStatus: 0,
    orderClient: null,
    orderClientName: null,
    signCompany: null,
    signCompanyName: null,
    handleUser: 'wujiu',
    handleUserName: '吴九',
    creator: 'wujiu',
    createTime: 1_746_147_600_000,
    updateTime: 1_746_147_600_000,
    lngLat: '118.677890,24.899876',
    photos: '/static/imgs/site-mgmt/photo13.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan9.png',
  },
  {
    id: 10,
    siteCode: 'SITE-20250509-001',
    siteLocation: '园区 J 栋 3 层',
    siteArea: 170,
    rentInfo: '31 元/㎡/月',
    facility: '水电、网络、空调',
    siteStatus: 1,
    orderClient: 12,
    orderClientName: '京东科技信息技术公司',
    signCompany: null,
    signCompanyName: null,
    handleUser: 'zhengshi',
    handleUserName: '郑十',
    creator: 'zhengshi',
    createTime: 1_746_061_800_000,
    updateTime: 1_746_841_600_000,
    lngLat: '118.680123,24.902345',
    photos: '/static/imgs/site-mgmt/photo14.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan10.png',
  },
  {
    id: 11,
    siteCode: 'SITE-20250510-001',
    siteLocation: '园区 K 栋 2 层东侧',
    siteArea: 155,
    rentInfo: '34 元/㎡/月',
    facility: '水电、网络、空调、电梯',
    siteStatus: 2,
    orderClient: null,
    orderClientName: null,
    signCompany: 112,
    signCompanyName: '字节跳动科技有限公司',
    handleUser: 'admin',
    handleUserName: '管理员',
    creator: 'admin',
    createTime: 1_745_976_000_000,
    updateTime: 1_746_919_200_000,
    lngLat: '118.684567,24.907890',
    photos:
      '/static/imgs/site-mgmt/photo15.jpg,/static/imgs/site-mgmt/photo16.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan11.png',
  },
  {
    id: 12,
    siteCode: 'SITE-20250511-001',
    siteLocation: '园区 L 栋 1 层',
    siteArea: 210,
    rentInfo: '28 元/㎡/月，年付优惠 8%',
    facility: '水电、网络、空调、电梯、停车场、健身房',
    siteStatus: 0,
    orderClient: null,
    orderClientName: null,
    signCompany: null,
    signCompanyName: null,
    handleUser: 'zhangsan',
    handleUserName: '张三',
    creator: 'zhangsan',
    createTime: 1_745_890_200_000,
    updateTime: 1_745_890_200_000,
    lngLat: '118.675678,24.895432',
    photos: '/static/imgs/site-mgmt/photo17.jpg',
    floorPlan: '/static/imgs/site-mgmt/floorplan12.png',
  },
];

/** 获取场地列表数据 - 兼容原有接口 */
export const dataList = () => {
  return staticDataList.map((item) => ({
    ...item,
    _createTimeFormatted: formatDate(item.createTime),
    _updateTimeFormatted: formatDate(item.updateTime),
    _siteStatusConfig: getSiteStatusConfig(item.siteStatus),
  }));
};

/** 获取场地列表数据（getList别名，保持向后兼容） */
export const getList = dataList;

/** 获取场地列表数据（支持动态加载与静态回退） */
export async function fetchSiteMgmtData(params = {}) {
  try {
    const response = await getSiteMgmtPage({
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 10,
      ...params,
    });

    const data = response?.data || response;

    if (data && data.list) {
      return {
        list: data.list.map((item) => ({
          ...item,
          _createTimeFormatted: formatDate(item.createTime),
          _updateTimeFormatted: formatDate(item.updateTime),
          _siteStatusConfig: getSiteStatusConfig(item.siteStatus),
        })),
        total: data.total || 0,
      };
    }

    console.warn('API 返回数据格式异常，使用静态数据');
    return {
      list: staticDataList.map((item) => ({
        ...item,
        _createTimeFormatted: formatDate(item.createTime),
        _updateTimeFormatted: formatDate(item.updateTime),
        _siteStatusConfig: getSiteStatusConfig(item.siteStatus),
      })),
      total: staticDataList.length,
    };
  } catch (error) {
    console.error('获取场地管理数据失败:', error);
    return {
      list: staticDataList.map((item) => ({
        ...item,
        _createTimeFormatted: formatDate(item.createTime),
        _updateTimeFormatted: formatDate(item.updateTime),
        _siteStatusConfig: getSiteStatusConfig(item.siteStatus),
      })),
      total: staticDataList.length,
    };
  }
}

/** 搜索表单配置（符合接口文档筛选参数） */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'siteCode',
      label: '场地编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场地编号',
      },
    },
    {
      fieldName: 'siteLocation',
      label: '场地位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场地位置',
      },
    },
    {
      fieldName: 'siteArea',
      label: '场地面积(㎡)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入场地面积',
        min: 0,
      },
    },
    {
      fieldName: 'rentInfo',
      label: '租金信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入租金信息',
      },
    },
    {
      fieldName: 'facility',
      label: '配套设施',
      component: 'Input',
      componentProps: {
        placeholder: '请输入配套设施',
      },
    },
    {
      fieldName: 'siteStatus',
      label: '场地状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场地状态',
        options: [
          { label: '空置中', value: 0 },
          { label: '洽谈中', value: 1 },
          { label: '已出租', value: 2 },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'orderClient',
      label: '预约客户',
      component: 'Select',
      componentProps: {
        placeholder: '请选择预约客户',
        options: clientList.map((c) => ({ label: c.name, value: c.id })),
        clearable: true,
      },
    },
    {
      fieldName: 'signCompany',
      label: '签约企业',
      component: 'Select',
      componentProps: {
        placeholder: '请选择签约企业',
        options: companyList.map((c) => ({ label: c.name, value: c.id })),
        clearable: true,
      },
    },
  ];
}

/** 编辑/录入表单配置（符合接口文档请求参数） */
export function useFormSchema() {
  return [
    {
      fieldName: 'siteCode',
      label: '场地编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场地编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'siteLocation',
      label: '场地位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场地位置',
      },
      rules: 'required',
    },
    {
      fieldName: 'siteArea',
      label: '场地面积(㎡)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入场地面积',
        min: 0,
      },
    },
    {
      fieldName: 'rentInfo',
      label: '租金信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入租金信息',
      },
    },
    {
      fieldName: 'facility',
      label: '配套设施',
      component: 'Input',
      componentProps: {
        placeholder: '请输入配套设施',
      },
    },
    {
      fieldName: 'siteStatus',
      label: '场地状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场地状态',
        options: [
          { label: '空置中', value: 0 },
          { label: '洽谈中', value: 1 },
          { label: '已出租', value: 2 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'orderClient',
      label: '预约客户',
      component: 'Select',
      componentProps: {
        placeholder: '请选择预约客户',
        options: clientList.map((c) => ({ label: c.name, value: c.id })),
        clearable: true,
      },
    },
    {
      fieldName: 'signCompany',
      label: '签约企业',
      component: 'Select',
      componentProps: {
        placeholder: '请选择签约企业',
        options: companyList.map((c) => ({ label: c.name, value: c.id })),
        clearable: true,
      },
    },
    {
      fieldName: 'handleUser',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人账号',
      },
    },
    {
      fieldName: 'lngLat',
      label: '经纬度',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经纬度(例：118.675324,24.896541)',
      },
    },
    {
      fieldName: 'photos',
      label: '照片',
      component: 'ImageUpload',
      componentProps: {
        maxNumber: 9,
        multiple: true,
        maxSize: 10,
      },
    },
    {
      fieldName: 'floorPlan',
      label: '平面图',
      component: 'ImageUpload',
      componentProps: {
        maxNumber: 1,
        maxSize: 20,
      },
    },
  ];
}

/** 场地表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'siteCode',
      title: '场地编号',
      minWidth: 180,
      sortable: true,
      slots: { default: 'siteCode' },
    },
    {
      field: 'siteLocation',
      title: '场地位置',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'siteArea',
      title: '场地面积(㎡)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'rentInfo',
      title: '租金信息',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'facility',
      title: '配套设施',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'siteStatus',
      title: '场地状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'siteStatus' },
    },
    {
      field: 'orderClientName',
      title: '预约客户',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'signCompanyName',
      title: '签约企业',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'handleUserName',
      title: '操作人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: '_createTimeFormatted',
      title: '创建时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'photos',
      title: '照片',
      minWidth: 120,
      sortable: false,
      slots: { default: 'photos' },
    },
    {
      field: 'floorPlan',
      title: '平面图',
      minWidth: 120,
      sortable: false,
      slots: { default: 'floorPlan' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '完善场地',
  addText: '录入场地',
  excelName: '场地管理列表',
  excelAllName: '场地管理数据.xlsx',
  total: ' 总计: 场地数量12;空置中:5;洽谈中:3;已出租:4',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'siteCode', label: '场地编号' },
  { key: 'siteLocation', label: '场地位置' },
  { key: 'siteArea', label: '场地面积(㎡)' },
  { key: 'rentInfo', label: '租金信息' },
  { key: 'facility', label: '配套设施' },
  { key: 'siteStatus', label: '场地状态', isDict: true },
  { key: 'orderClientName', label: '预约客户' },
  { key: 'signCompanyName', label: '签约企业' },
  { key: 'handleUserName', label: '操作人' },
  { key: 'creator', label: '创建人' },
  { key: '_createTimeFormatted', label: '创建时间' },
  { key: '_updateTimeFormatted', label: '更新时间' },
];
