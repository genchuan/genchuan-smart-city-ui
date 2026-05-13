import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';
import { ref } from 'vue';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

import { getPointActivitySimpleList } from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity';
import {
  getPointActivityStatusTagType,
  getPointActivityTypeTagType,
} from '../../pointActivity/table/data';

/** 获取奖品类型标签类型 */
export function getPrizeTypeTagType(type) {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取奖品状态标签类型 */
export function getPrizeStatusTagType(status) {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'info');
}

/** 获取奖品类型字典标签 */
export function getPrizeTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(type));
  return dict ? dict.label : type;
}

/** 获取奖品状态字典标签 */
export function getPrizeStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 动态活动选项（从接口获取） */
export let dynamicActivityOptions = ref([]);

/** 获取当前可用的活动选项 */
export function getCurrentActivityOptions() {
  return dynamicActivityOptions.value.length > 0
    ? dynamicActivityOptions.value
    : [];
}

/** 获取活动精简列表 */
export async function fetchActivityOptions() {
  try {
    const res = await getPointActivitySimpleList();
    if (res && Array.isArray(res)) {
      // 将接口返回数据转换为 Select 组件需要的格式
      dynamicActivityOptions.value = res.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
      return dynamicActivityOptions.value;
    }
  } catch (error) {
    console.error('获取活动列表失败:', error);
  }
  return [];
}

/** 奖品管理静态数据 - 参照接口返回格式 */
export const dataList = () => {
  const rawData = [
    {
      id: 1,
      name: '10元充电优惠券',
      type: '0',
      typeName: '优惠券',
      stock: 500,
      status: '1',
      statusName: '启用',
      createTime: 1_743_237_600_000,
      activityId: 1,
      activityName: '每日签到赠分活动',
      sendCount: 1250,
      syncTime: 1_743_478_800_000,
      warnThreshold: 100,
      description: '充电消费满50元可用',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_743_478_800_000,
    },
    {
      id: 2,
      name: '20元充电优惠券',
      type: '0',
      typeName: '优惠券',
      stock: 300,
      status: '1',
      statusName: '启用',
      createTime: 1_743_324_000_000,
      activityId: 1,
      activityName: '每日签到赠分活动',
      sendCount: 890,
      syncTime: 1_743_565_200_000,
      warnThreshold: 50,
      description: '充电消费满100元可用',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_743_565_200_000,
    },
    {
      id: 3,
      name: '50积分奖励',
      type: '1',
      typeName: '积分',
      stock: 1000,
      status: '1',
      statusName: '启用',
      createTime: 1_743_410_400_000,
      activityId: 2,
      activityName: '签到赠分规则',
      sendCount: 2100,
      syncTime: 1_743_652_800_000,
      warnThreshold: 200,
      description: '直接发放50积分到账户',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_743_652_800_000,
    },
    {
      id: 4,
      name: '100元充电卡',
      type: '2',
      typeName: '实物',
      stock: 50,
      status: '0',
      statusName: '禁用',
      createTime: 1_743_496_800_000,
      activityId: null,
      activityName: null,
      sendCount: 0,
      syncTime: null,
      warnThreshold: 10,
      description: '价值100元的充电储值卡',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_743_496_800_000,
    },
    {
      id: 5,
      name: '谢谢参与',
      type: '3',
      typeName: '虚拟',
      stock: 9999,
      status: '1',
      statusName: '启用',
      createTime: 1_743_583_200_000,
      activityId: 3,
      activityName: '积分兑换规则',
      sendCount: 5600,
      syncTime: 1_743_739_200_000,
      warnThreshold: 1000,
      description: '未中奖提示',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_743_739_200_000,
    },
    {
      id: 6,
      name: '5元停车优惠券',
      type: '0',
      typeName: '优惠券',
      stock: 200,
      status: '1',
      statusName: '启用',
      createTime: 1_743_669_600_000,
      activityId: 4,
      activityName: '邀请赠分规则',
      sendCount: 420,
      syncTime: 1_743_912_000_000,
      warnThreshold: 30,
      description: '停车消费满20元可用',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_743_912_000_000,
    },
    {
      id: 7,
      name: '200积分奖励',
      type: '1',
      typeName: '积分',
      stock: 800,
      status: '0',
      statusName: '禁用',
      createTime: 1_743_756_000_000,
      activityId: null,
      activityName: null,
      sendCount: 0,
      syncTime: null,
      warnThreshold: 100,
      description: '直接发放200积分到账户',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_743_756_000_000,
    },
    {
      id: 8,
      name: '精美礼品一份',
      type: '2',
      typeName: '实物',
      stock: 30,
      status: '1',
      statusName: '启用',
      createTime: 1_743_842_400_000,
      activityId: 5,
      activityName: '停车赠分规则',
      sendCount: 180,
      syncTime: 1_744_084_800_000,
      warnThreshold: 5,
      description: '精美小礼品一份，需到店领取',
      creator: 'admin',
      updater: 'admin',
      updateTime: 1_744_084_800_000,
    },
  ];

  // 使用formatDate格式化时间戳字段
  return rawData.map((item) => ({
    ...item,
    createTimeStr: formatDate(item.createTime),
    updateTimeStr: formatDate(item.updateTime),
    syncTimeStr: formatDate(item.syncTime),
  }));
};

/** 奖品管理搜索表单配置 - 根据PrizeMgmtPageReqVO参数配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '奖品名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入奖品名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '奖品类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择奖品类型',
        options: getDictOptions(DICT_TYPE.PRIZE_MGMT_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'activityId',
      label: '关联活动',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联活动',
        options: [],
        clearable: true,
        filterable: true,
      },
    },
    {
      fieldName: 'status',
      label: '奖品状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择奖品状态',
        options: getDictOptions(DICT_TYPE.PRIZE_MGMT_STATUS, 'string'),
        clearable: true,
      },
    },
  ];
}

/** 奖品管理表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '奖品名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'type',
      title: '奖品类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'stock',
      title: '当前库存',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: '奖品状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.createTimeStr || '-',
    },
    {
      field: 'activityName',
      title: '绑定活动',
      minWidth: 180,
      sortable: true,
      slots: { default: 'activityName' },
    },
    {
      field: 'sendCount',
      title: '发放量',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'syncTime',
      title: '同步时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.syncTimeStr || '-',
    },
    {
      field: 'warnThreshold',
      title: '预警阈值',
      minWidth: 120,
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

/** 奖品管理表单配置 */
export function useFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'name',
      label: '奖品名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入奖品名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '奖品类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择奖品类型',
        options: [
          { label: '优惠券', value: '0' },
          { label: '积分', value: '1' },
          { label: '实物', value: '2' },
          { label: '虚拟', value: '3' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'stock',
      label: isEdit ? '当前库存' : '初始库存',
      component: 'InputNumber',
      componentProps: {
        placeholder: isEdit ? '请输入当前库存' : '请输入初始库存',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'warnThreshold',
      label: '预警阈值',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入预警阈值',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '奖品描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入奖品描述',
      },
    },
    {
      fieldName: 'activityId',
      label: '绑定活动',
      component: 'Select',
      componentProps: {
        placeholder: '请选择绑定活动',
        options: [],
        clearable: true,
        filterable: true,
      },
    },
  ];
}

export const textObj = {
  editText: '编辑奖品',
  addText: '新增奖品',
  excelName: '奖品列表',
  excelAllName: '奖品数据.xlsx',
  total: ' 总计: 奖品数量8;启用:6;禁用:2',
};

/** 活动详情字段配置 - 1:1 参照 pointActivity 的 detailFields 配置 */
export const activityDetailFields = [
  // { key: 'id', label: '活动ID' },
  { key: 'name', label: '活动名称' },
  {
    key: 'type',
    label: '活动类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getPointActivityTypeTagType(value),
  },
  { key: 'startTimeStr', label: '开始时间' },
  { key: 'endTimeStr', label: '结束时间' },
  { key: 'rule', label: '积分规则' },
  { key: 'description', label: '活动描述' },
  { key: 'stationNames', label: '适用场站' },
  { key: 'joinCount', label: '参与人数' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTimeStr', label: '审核时间' },
  { key: 'remainPoint', label: '剩余积分额度' },
  {
    key: 'status',
    label: '活动状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getPointActivityStatusTagType(value),
  },
  // { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'name', label: '奖品名称' },
  {
    key: 'type',
    label: '奖品类型',
    type: 'tag',
    formatter: (value) => getPrizeTypeLabel(value),
    tagType: (value) => getPrizeTypeTagType(value),
  },
  { key: 'stock', label: '当前库存' },
  {
    key: 'status',
    label: '奖品状态',
    type: 'tag',
    formatter: (value) => getPrizeStatusLabel(value),
    tagType: (value) => getPrizeStatusTagType(value),
  },
  { key: 'activityName', label: '绑定活动' },
  { key: 'sendCount', label: '发放量' },
  { key: 'warnThreshold', label: '预警阈值' },
  { key: 'description', label: '奖品描述' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'syncTimeStr', label: '同步时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTimeStr', label: '更新时间' },
];
