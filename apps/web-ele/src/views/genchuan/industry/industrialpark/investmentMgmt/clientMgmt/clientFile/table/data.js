import { getDictObj, getDictOptions } from '@vben/hooks';
import { DICT_TYPE } from '@vben/constants';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';
import { getRangePickerDefaultProps } from '#/utils';

import { getClientFilePage } from '#/api/genchuan/industry/industrialpark/investmentMgmt/clientMgmt/clientFile';

/** 获取需求类型标签类型（使用标准字典函数） */
export function getClientDemandTypeTagType(demandType) {
  const dict = getDictObj(DICT_TYPE.CLIENT_FILE_DEMAND_TYPE, String(demandType));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取需求类型字典标签 */
export function getClientDemandTypeLabel(demandType) {
  const dict = getDictObj(DICT_TYPE.CLIENT_FILE_DEMAND_TYPE, String(demandType));
  return dict ? dict.label : demandType;
}

/** 获取意向程度标签类型 */
export function getClientIntentLevelTagType(intentLevel) {
  const dict = getDictObj(DICT_TYPE.CLIENT_FILE_INTENT_LEVEL, String(intentLevel));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取意向程度字典标签 */
export function getClientIntentLevelLabel(intentLevel) {
  const dict = getDictObj(DICT_TYPE.CLIENT_FILE_INTENT_LEVEL, String(intentLevel));
  return dict ? dict.label : intentLevel;
}

/** 获取客户状态标签类型 */
export function getClientStatusTagType(clientStatus) {
  const dict = getDictObj(DICT_TYPE.CLIENT_FILE_CLIENT_STATUS, String(clientStatus));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取客户状态字典标签 */
export function getClientStatusLabel(clientStatus) {
  const dict = getDictObj(DICT_TYPE.CLIENT_FILE_CLIENT_STATUS, String(clientStatus));
  return dict ? dict.label : clientStatus;
}

/** 获取客户状态完整配置 */
export function getClientStatusConfig(clientStatus) {
  const dict = getDictObj(DICT_TYPE.CLIENT_FILE_CLIENT_STATUS, String(clientStatus));
  return {
    label: dict ? dict.label : clientStatus,
    colorType: dict ? dict.colorType : '',
    tagType: getDictTagTypeFromDict(dict, 'primary'),
  };
}

/** 客户档案静态数据 - 用于错误回退和初始加载（使用毫秒级时间戳） */
const staticDataList = [
  {
    id: 1,
    clientName: '张三',
    clientCompany: 'XX 科技有限公司',
    demandType: 0,
    intentLevel: 0,
    clientStatus: 0,
    intentSiteId: null,
    intentSiteName: null,
    trackRecord: '2025-05-01 首次沟通，意向 A 栋场地',
    transformResult: null,
    handleUser: 'admin',
    creator: 'admin',
    createTime: 1746748800000,
    updateTime: 1746748800000,
  },
  {
    id: 2,
    clientName: '李四',
    clientCompany: 'YY 贸易有限公司',
    demandType: 1,
    intentLevel: 1,
    clientStatus: 1,
    intentSiteId: 2,
    intentSiteName: 'B 栋 2 层',
    trackRecord: '2025-05-02 补充客户企业信息，意向 B 栋场地',
    transformResult: null,
    handleUser: 'zhangsan',
    creator: 'zhangsan',
    createTime: 1746662100000,
    updateTime: 1746825000000,
  },
  {
    id: 3,
    clientName: '王五',
    clientCompany: 'ZZ 制造有限公司',
    demandType: 0,
    intentLevel: 2,
    clientStatus: 0,
    intentSiteId: null,
    intentSiteName: null,
    trackRecord: '2025-05-03 电话跟进，客户表示近期会过来实地考察',
    transformResult: null,
    handleUser: 'lisi',
    creator: 'lisi',
    createTime: 1746576000000,
    updateTime: 1746750000000,
  },
  {
    id: 4,
    clientName: '赵六',
    clientCompany: 'AA 信息科技有限公司',
    demandType: 2,
    intentLevel: 0,
    clientStatus: 2,
    intentSiteId: 5,
    intentSiteName: 'C 栋 2 层',
    trackRecord: '2025-04-15 成功签约 C 栋场地，租期 3 年',
    transformResult: '成功签约 C 栋 2 层场地，租期 3 年',
    handleUser: 'wangwu',
    creator: 'wangwu',
    createTime: 1746405000000,
    updateTime: 1746826000000,
  },
  {
    id: 5,
    clientName: '孙七',
    clientCompany: 'BB 物流有限公司',
    demandType: 0,
    intentLevel: 1,
    clientStatus: 1,
    intentSiteId: 3,
    intentSiteName: 'A 栋 3 层',
    trackRecord: '2025-05-05 线下洽谈，沟通租金及租期细节',
    transformResult: null,
    handleUser: 'zhaoliu',
    creator: 'zhaoliu',
    createTime: 1746319200000,
    updateTime: 1746827000000,
  },
  {
    id: 6,
    clientName: '周八',
    clientCompany: 'CC 教育培训中心',
    demandType: 1,
    intentLevel: 0,
    clientStatus: 0,
    intentSiteId: null,
    intentSiteName: null,
    trackRecord: '2025-05-06 初次接触，了解园区优惠政策',
    transformResult: null,
    handleUser: 'sunqi',
    creator: 'sunqi',
    createTime: 1746233400000,
    updateTime: 1746233400000,
  },
  {
    id: 7,
    clientName: '吴九',
    clientCompany: 'DD 咨询服务有限公司',
    demandType: 2,
    intentLevel: 2,
    clientStatus: 1,
    intentSiteId: 7,
    intentSiteName: 'D 栋 1 层',
    trackRecord: '2025-05-07 深入洽谈服务配套需求',
    transformResult: null,
    handleUser: 'zhouba',
    creator: 'zhouba',
    createTime: 1746147600000,
    updateTime: 1746828000000,
  },
  {
    id: 8,
    clientName: '郑十',
    clientCompany: 'EE 新能源科技有限公司',
    demandType: 0,
    intentLevel: 1,
    clientStatus: 0,
    intentSiteId: null,
    intentSiteName: null,
    trackRecord: '2025-05-08 客户对 D 栋大面积场地感兴趣',
    transformResult: null,
    handleUser: 'wujiu',
    creator: 'wujiu',
    createTime: 1746061800000,
    updateTime: 1746061800000,
  },
  {
    id: 9,
    clientName: '冯十一',
    clientCompany: 'FF 生物科技有限公司',
    demandType: 1,
    intentLevel: 0,
    clientStatus: 2,
    intentSiteId: 8,
    intentSiteName: 'E 栋 2 层',
    trackRecord: '2025-03-20 确认签约意向，完成合同签订',
    transformResult: '客户确认签约，已完成合同签订',
    handleUser: 'zhengshi',
    creator: 'zhengshi',
    createTime: 1745976000000,
    updateTime: 1746751000000,
  },
  {
    id: 10,
    clientName: '陈十二',
    clientCompany: 'GG 文化传媒有限公司',
    demandType: 2,
    intentLevel: 1,
    clientStatus: 0,
    intentSiteId: null,
    intentSiteName: null,
    trackRecord: '2025-05-09 了解联合办公空间方案',
    transformResult: null,
    handleUser: 'admin',
    creator: 'admin',
    createTime: 1745890200000,
    updateTime: 1745890200000,
  },
  {
    id: 11,
    clientName: '褚十三',
    clientCompany: 'HH 金融投资有限公司',
    demandType: 0,
    intentLevel: 2,
    clientStatus: 1,
    intentSiteId: 4,
    intentSiteName: 'E 栋东侧',
    trackRecord: '2025-05-10 洽谈 E 栋东侧灵活办公空间',
    transformResult: null,
    handleUser: 'admin',
    creator: 'admin',
    createTime: 1745804400000,
    updateTime: 1746829000000,
  },
  {
    id: 12,
    clientName: '卫十四',
    clientCompany: 'II 智能家居有限公司',
    demandType: 1,
    intentLevel: 0,
    clientStatus: 0,
    intentSiteId: null,
    intentSiteName: null,
    trackRecord: '2025-05-11 初次咨询人才公寓配套政策',
    transformResult: null,
    handleUser: 'zhangsan',
    creator: 'zhangsan',
    createTime: 1745718000000,
    updateTime: 1745718000000,
  },
];

/** 获取客户档案列表数据 - 兼容原有接口 */
export const dataList = () => {
  return staticDataList.map((item) => ({
    ...item,
    _createTimeFormatted: formatDate(item.createTime),
    _updateTimeFormatted: formatDate(item.updateTime),
    _demandTypeConfig:
      item.demandType !== undefined && item.demandType !== null
        ? {
            label: getClientDemandTypeLabel(item.demandType),
            tagType: getClientDemandTypeTagType(item.demandType),
          }
        : null,
    _intentLevelConfig:
      item.intentLevel !== undefined && item.intentLevel !== null
        ? {
            label: getClientIntentLevelLabel(item.intentLevel),
            tagType: getClientIntentLevelTagType(item.intentLevel),
          }
        : null,
    _clientStatusConfig: getClientStatusConfig(item.clientStatus),
  }));
};

/** 获取客户档案列表数据（getList别名，保持向后兼容） */
export const getList = dataList;

/** 获取客户档案列表数据（支持动态加载与静态回退） */
export async function fetchClientFileData(params = {}) {
  try {
    const response = await getClientFilePage({
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
          _demandTypeConfig:
            item.demandType !== undefined && item.demandType !== null
              ? {
                  label: getClientDemandTypeLabel(item.demandType),
                  tagType: getClientDemandTypeTagType(item.demandType),
                }
              : null,
          _intentLevelConfig:
            item.intentLevel !== undefined && item.intentLevel !== null
              ? {
                  label: getClientIntentLevelLabel(item.intentLevel),
                  tagType: getClientIntentLevelTagType(item.intentLevel),
                }
              : null,
          _clientStatusConfig: getClientStatusConfig(item.clientStatus),
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
    console.error('获取客户档案数据失败:', error);
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
      fieldName: 'clientName',
      label: '客户姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户姓名',
      },
    },
    {
      fieldName: 'clientCompany',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称',
      },
    },
    {
      fieldName: 'demandType',
      label: '需求类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择需求类型',
        options: [
          { label: '场地', value: 0 },
          { label: '政策', value: 1 },
          { label: '服务', value: 2 },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'intentLevel',
      label: '意向程度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择意向程度',
        options: [
          { label: '高', value: 0 },
          { label: '中', value: 1 },
          { label: '低', value: 2 },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'clientStatus',
      label: '客户状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择客户状态',
        options: [
          { label: '潜在客户', value: 0 },
          { label: '意向客户', value: 1 },
          { label: '已签约', value: 2 },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        type: 'daterange',
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

/** 编辑/录入表单配置（符合接口文档请求参数） */
export function useFormSchema() {
  return [
    {
      fieldName: 'clientName',
      label: '客户姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户姓名',
      },
      rules: 'required',
    },
    {
      fieldName: 'clientCompany',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称',
      },
    },
    {
      fieldName: 'demandType',
      label: '需求类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择需求类型',
        options: [
          { label: '场地', value: 0 },
          { label: '政策', value: 1 },
          { label: '服务', value: 2 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'intentLevel',
      label: '意向程度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择意向程度',
        options: [
          { label: '高', value: 0 },
          { label: '中', value: 1 },
          { label: '低', value: 2 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'clientStatus',
      label: '客户状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择客户状态',
        options: [
          { label: '潜在客户', value: 0 },
          { label: '意向客户', value: 1 },
          { label: '已签约', value: 2 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'intentSite',
      label: '意向场地',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入意向场地 ID',
        min: 0,
      },
    },
    {
      fieldName: 'trackRecord',
      label: '跟进记录',
      component: 'Input',
      componentProps: {
        placeholder: '请输入跟进记录',
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

/** 客户档案表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'clientName',
      title: '客户姓名',
      minWidth: 120,
      sortable: true,
      slots: { default: 'clientName' },
    },
    {
      field: 'clientCompany',
      title: '企业名称',
      minWidth: 200,
      sortable: true,
    },
    {
      field: '_demandTypeFormatted',
      title: '需求类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'demandType' },
    },
    {
      field: '_intentLevelFormatted',
      title: '意向程度',
      minWidth: 100,
      sortable: true,
      slots: { default: 'intentLevel' },
    },
    {
      field: '_clientStatusFormatted',
      title: '客户状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'clientStatus' },
    },
    {
      field: 'intentSiteName',
      title: '意向场地',
      minWidth: 120,
      sortable: true,
      slots: { default: 'intentSite' },
    },
    {
      field: 'trackRecord',
      title: '跟进记录',
      minWidth: 250,
      sortable: true,
      slots: { default: 'trackRecord' },
    },
    {
      field: 'transformResult',
      title: '转化结果',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'handleUser',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'handleUser' },
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
  editText: '编辑客户档案',
  addText: '收集客户信息',
  excelName: '客户档案列表',
  excelAllName: '客户档案数据.xlsx',
  total: ' 总计: 客户数量12;潜在客户:6;意向客户:4;已签约:2',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: 'ID' },
  { key: 'clientName', label: '客户姓名' },
  { key: 'clientCompany', label: '企业名称' },
  { key: 'demandType', label: '需求类型', isDict: true },
  { key: 'intentLevel', label: '意向程度', isDict: true },
  { key: 'clientStatus', label: '客户状态', isDict: true },
  { key: 'intentSite', label: '意向场地 ID' },
  { key: 'trackRecord', label: '跟进记录' },
  { key: 'transformResult', label: '转化结果' },
  { key: 'handleUser', label: '操作人' },
  { key: 'creator', label: '创建人' },
  { key: '_createTimeFormatted', label: '创建时间' },
  { key: '_updateTimeFormatted', label: '更新时间' },
];
