import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { getInfoPublishPage } from '#/api/genchuan/industry/industrialpark/investmentMgmt/resourceMgmt/infoPublish';
import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取信息状态标签类型（使用标准字典函数） */
export function getInfoStatusTagType(status) {
  const dict = getDictObj(DICT_TYPE.INFO_PUBLISH_INFO_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取信息状态字典标签 */
export function getInfoStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.INFO_PUBLISH_INFO_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 获取信息类型标签类型 */
export function getInfoTypeTagType(type) {
  const dict = getDictObj(DICT_TYPE.INFO_PUBLISH_INFO_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取信息类型字典标签 */
export function getInfoTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.INFO_PUBLISH_INFO_TYPE, String(type));
  return dict ? dict.label : type;
}

/** 获取信息状态配置 */
export function getInfoStatusConfig(status) {
  const dict = getDictObj(DICT_TYPE.INFO_PUBLISH_INFO_STATUS, String(status));
  return {
    label: dict ? dict.label : status,
    colorType: dict ? dict.colorType : '',
    tagType: getDictTagTypeFromDict(dict, 'primary'),
  };
}

/** 信息发布静态数据 - 用于错误回退和初始加载（使用毫秒级时间戳） */
const staticDataList = [
  {
    id: 1,
    infoTitle: '2025 年园区招商优惠政策',
    infoType: 0,
    publishTime: 1_746_748_800_000,
    consultCount: 23,
    responseRate: 0.95,
    infoStatus: 1,
    policyConfig: '新入驻企业首年租金减免 20%',
    responseUser: 'admin',
    handleUser: 'admin',
    handleUserName: '管理员',
    creator: 'admin',
    createTime: 1_746_748_800_000,
    updateTime: 1_746_824_400_000,
  },
  {
    id: 2,
    infoTitle: 'A 栋新开放场地招商信息',
    infoType: 1,
    publishTime: 1_746_662_100_000,
    consultCount: 15,
    responseRate: 0.87,
    infoStatus: 1,
    policyConfig: 'A 栋新开放场地，面积 100-200㎡可选',
    responseUser: 'zhangsan',
    handleUser: 'zhangsan',
    handleUserName: '张三',
    creator: 'zhangsan',
    createTime: 1_746_662_100_000,
    updateTime: 1_746_825_000_000,
  },
  {
    id: 3,
    infoTitle: '园区企业服务配套介绍',
    infoType: 2,
    publishTime: 1_746_576_000_000,
    consultCount: 8,
    responseRate: 1,
    infoStatus: 2,
    policyConfig: '提供工商注册、财税代理、法律咨询等一站式服务',
    responseUser: 'lisi',
    handleUser: 'lisi',
    handleUserName: '李四',
    creator: 'lisi',
    createTime: 1_746_576_000_000,
    updateTime: 1_746_750_000_000,
  },
  {
    id: 4,
    infoTitle: 'B 栋 2 层精装修场地招商',
    infoType: 1,
    publishTime: null,
    consultCount: 0,
    responseRate: 0,
    infoStatus: 0,
    policyConfig: null,
    responseUser: null,
    handleUser: 'wangwu',
    handleUserName: '王五',
    creator: 'wangwu',
    createTime: 1_746_491_400_000,
    updateTime: 1_746_491_400_000,
  },
  {
    id: 5,
    infoTitle: '高新技术企业入驻扶持政策',
    infoType: 0,
    publishTime: 1_746_405_000_000,
    consultCount: 31,
    responseRate: 0.92,
    infoStatus: 1,
    policyConfig: '高新技术企业可享受税收减免、研发补贴等扶持政策',
    responseUser: 'zhaoliu',
    handleUser: 'zhaoliu',
    handleUserName: '赵六',
    creator: 'zhaoliu',
    createTime: 1_746_405_000_000,
    updateTime: 1_746_826_000_000,
  },
  {
    id: 6,
    infoTitle: 'C 栋 1 层联合办公空间招商',
    infoType: 1,
    publishTime: null,
    consultCount: 0,
    responseRate: 0,
    infoStatus: 0,
    policyConfig: null,
    responseUser: null,
    handleUser: 'sunqi',
    handleUserName: '孙七',
    creator: 'sunqi',
    createTime: 1_746_319_200_000,
    updateTime: 1_746_319_200_000,
  },
  {
    id: 7,
    infoTitle: '园区物流配送服务方案',
    infoType: 2,
    publishTime: 1_746_233_400_000,
    consultCount: 12,
    responseRate: 0.83,
    infoStatus: 1,
    policyConfig: '与顺丰、京东合作，提供优惠物流配送服务',
    responseUser: 'zhouba',
    handleUser: 'zhouba',
    handleUserName: '周八',
    creator: 'zhouba',
    createTime: 1_746_233_400_000,
    updateTime: 1_746_827_000_000,
  },
  {
    id: 8,
    infoTitle: 'D 栋 4 层大面积场地出租',
    infoType: 1,
    publishTime: 1_746_147_600_000,
    consultCount: 19,
    responseRate: 0.89,
    infoStatus: 1,
    policyConfig: '面积 300-500㎡，适合大型企业总部入驻',
    responseUser: 'wujiu',
    handleUser: 'wujiu',
    handleUserName: '吴九',
    creator: 'wujiu',
    createTime: 1_746_147_600_000,
    updateTime: 1_746_828_000_000,
  },
  {
    id: 9,
    infoTitle: '初创企业孵化器招募计划',
    infoType: 0,
    publishTime: null,
    consultCount: 0,
    responseRate: 0,
    infoStatus: 0,
    policyConfig: null,
    responseUser: null,
    handleUser: 'zhengshi',
    handleUserName: '郑十',
    creator: 'zhengshi',
    createTime: 1_746_061_800_000,
    updateTime: 1_746_061_800_000,
  },
  {
    id: 10,
    infoTitle: 'E 栋 2 层东侧灵活办公空间',
    infoType: 1,
    publishTime: 1_745_976_000_000,
    consultCount: 7,
    responseRate: 1,
    infoStatus: 2,
    policyConfig: '支持工位租赁，按月付费',
    responseUser: 'admin',
    handleUser: 'admin',
    handleUserName: '管理员',
    creator: 'admin',
    createTime: 1_745_976_000_000,
    updateTime: 1_746_751_000_000,
  },
  {
    id: 11,
    infoTitle: '园区人才公寓配套说明',
    infoType: 2,
    publishTime: 1_745_890_200_000,
    consultCount: 25,
    responseRate: 0.96,
    infoStatus: 1,
    policyConfig: '为入驻企业提供人才公寓申请通道，享受市场价 8 折优惠',
    responseUser: 'admin',
    handleUser: 'admin',
    handleUserName: '管理员',
    creator: 'admin',
    createTime: 1_745_890_200_000,
    updateTime: 1_746_829_000_000,
  },
  {
    id: 12,
    infoTitle: 'F 栋 1 层展示型场地招商',
    infoType: 1,
    publishTime: null,
    consultCount: 0,
    responseRate: 0,
    infoStatus: 0,
    policyConfig: null,
    responseUser: null,
    handleUser: 'zhangsan',
    handleUserName: '张三',
    creator: 'zhangsan',
    createTime: 1_745_804_400_000,
    updateTime: 1_745_804_400_000,
  },
];

/** 获取信息列表数据 - 兼容原有接口 */
export const dataList = () => {
  return staticDataList.map((item) => ({
    ...item,
    _publishTimeFormatted: formatDate(item.publishTime),
    _createTimeFormatted: formatDate(item.createTime),
    _updateTimeFormatted: formatDate(item.updateTime),
    _infoStatusConfig: getInfoStatusConfig(item.infoStatus),
    _infoTypeConfig:
      item.infoType !== undefined && item.infoType !== null
        ? {
            label: getInfoTypeLabel(item.infoType),
            tagType: getInfoTypeTagType(item.infoType),
          }
        : null,
  }));
};

/** 获取信息列表数据（getList别名，保持向后兼容） */
export const getList = dataList;

/** 获取信息列表数据（支持动态加载与静态回退） */
export async function fetchInfoPublishData(params = {}) {
  try {
    const response = await getInfoPublishPage({
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 10,
      ...params,
    });

    const data = response?.data || response;

    if (data && data.list) {
      return {
        list: data.list.map((item) => ({
          ...item,
          _publishTimeFormatted: formatDate(item.publishTime),
          _createTimeFormatted: formatDate(item.createTime),
          _updateTimeFormatted: formatDate(item.updateTime),
          _infoStatusConfig: getInfoStatusConfig(item.infoStatus),
          _infoTypeConfig:
            item.infoType !== undefined && item.infoType !== null
              ? {
                  label: getInfoTypeLabel(item.infoType),
                  tagType: getInfoTypeTagType(item.infoType),
                }
              : null,
        })),
        total: data.total || 0,
      };
    }

    console.warn('API 返回数据格式异常，使用静态数据');
    return {
      list: dataList(),
      total: staticDataList.length,
    };
  } catch (error) {
    console.error('获取信息发布数据失败:', error);
    return {
      list: dataList(),
      total: staticDataList.length,
    };
  }
}

/** 搜索表单配置（符合接口文档筛选参数） */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'infoTitle',
      label: '信息标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入信息标题',
      },
    },
    {
      fieldName: 'infoType',
      label: '信息类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择信息类型',
        options: [
          { label: '场地', value: 0 },
          { label: '政策', value: 1 },
          { label: '服务', value: 2 },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'publishTime',
      label: '发布时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择发布时间',
        type: 'daterange',
        ...getRangePickerDefaultProps(),
      },
    },
    {
      fieldName: 'infoStatus',
      label: '信息状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择信息状态',
        options: [
          { label: '待发布', value: 0 },
          { label: '已发布', value: 1 },
          { label: '已下架', value: 2 },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'consultCount',
      label: '咨询数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入咨询数',
        min: 0,
      },
    },
    {
      fieldName: 'responseRate',
      label: '响应率',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入响应率(0-1)',
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  ];
}

/** 编辑/录入表单配置（符合接口文档请求参数） */
export function useFormSchema() {
  return [
    {
      fieldName: 'infoTitle',
      label: '信息标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入信息标题',
      },
      rules: 'required',
    },
    {
      fieldName: 'infoType',
      label: '信息类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择信息类型',
        options: [
          { label: '场地', value: 0 },
          { label: '政策', value: 1 },
          { label: '服务', value: 2 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'policyConfig',
      label: '政策配置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入政策配置内容',
        type: 'textarea',
        rows: 3,
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
  ];
}

/** 信息表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'infoTitle',
      title: '信息标题',
      minWidth: 220,
      sortable: true,
      slots: { default: 'infoTitle' },
    },
    {
      field: 'infoType',
      title: '信息类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'infoType' },
    },
    {
      field: '_publishTimeFormatted',
      title: '发布时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'consultCount',
      title: '咨询数',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'responseRate',
      title: '响应率',
      minWidth: 80,
      sortable: true,
      slots: { default: 'responseRate' },
    },
    {
      field: 'infoStatus',
      title: '信息状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'infoStatus' },
    },
    {
      field: 'responseUser',
      title: '响应人',
      minWidth: 100,
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
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑信息',
  addText: '录入信息',
  excelName: '信息发布列表',
  excelAllName: '信息发布数据.xlsx',
  total: ' 总计: 信息数量12;已发布:6;待发布:4;已下架:2',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'infoTitle', label: '信息标题' },
  { key: 'infoType', label: '信息类型', isDict: true },
  { key: '_publishTimeFormatted', label: '发布时间' },
  { key: 'consultCount', label: '咨询数' },
  { key: 'responseRate', label: '响应率' },
  { key: 'infoStatus', label: '信息状态', isDict: true },
  { key: 'policyConfig', label: '政策配置' },
  { key: 'responseUser', label: '响应人' },
  { key: 'handleUserName', label: '操作人' },
  { key: 'creator', label: '创建人' },
  { key: '_createTimeFormatted', label: '创建时间' },
  { key: '_updateTimeFormatted', label: '更新时间' },
];
