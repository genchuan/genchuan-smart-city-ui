import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { formatDate } from '#/utils/genchuan/formatTime';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 获取规则配置类型标签类型 */
export function getRuleConfigTypeTagType(type) {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 获取规则配置状态标签类型 */
export function getRuleConfigStatusTagType(status) {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'info');
}

/** 获取规则配置场景标签类型 */
export function getRuleConfigSceneTagType(scene) {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_SCENE, String(scene));
  return getDictTagTypeFromDict(dict, 'primary');
}

/** 规则配置静态数据 - 参照接口返回格式 */
export const dataList = () => {
  const rawData = [
    {
      id: 1,
      name: '消费赠分规则',
      type: '0',
      typeName: '获取规则',
      giftRatio: 0.01,
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_743_309_600_000,
      matchCount: 1250,
      effectTime: 1_743_436_800_000,
      description: '充电消费每 1 元赠送 1 积分',
      scene: '0',
      sceneName: '充电',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_237_600_000,
      updateTime: 1_743_478_800_000,
    },
    {
      id: 2,
      name: '签到赠分规则',
      type: '0',
      typeName: '获取规则',
      giftRatio: 0.05,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_743_396_000_000,
      matchCount: 890,
      effectTime: 1_743_523_200_000,
      description: '每日签到赠送 5 积分',
      scene: '2',
      sceneName: '活动',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_324_000_000,
      updateTime: 1_743_565_200_000,
    },
    {
      id: 3,
      name: '积分兑换规则',
      type: '1',
      typeName: '消耗规则',
      giftRatio: 0.1,
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      matchCount: 0,
      effectTime: null,
      description: '每 10 积分可抵扣 1 元',
      scene: '0',
      sceneName: '充电',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_410_400_000,
      updateTime: 1_743_410_400_000,
    },
    {
      id: 4,
      name: '邀请赠分规则',
      type: '2',
      typeName: '赠送规则',
      giftRatio: 0.02,
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_743_482_400_000,
      matchCount: 560,
      effectTime: 1_743_609_600_000,
      description: '邀请好友注册赠送 20 积分',
      scene: '2',
      sceneName: '活动',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_496_800_000,
      updateTime: 1_743_652_800_000,
    },
    {
      id: 5,
      name: '停车赠分规则',
      type: '0',
      typeName: '获取规则',
      giftRatio: 0.005,
      status: '1',
      statusName: '已生效',
      auditorId: 1,
      auditorName: '张三',
      auditTime: 1_743_568_800_000,
      matchCount: 420,
      effectTime: 1_743_696_000_000,
      description: '停车消费每 1 元赠送 0.5 积分',
      scene: '1',
      sceneName: '停车',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_583_200_000,
      updateTime: 1_743_739_200_000,
    },
    {
      id: 6,
      name: '生日赠分规则',
      type: '2',
      typeName: '赠送规则',
      giftRatio: 0.5,
      status: '0',
      statusName: '未生效',
      auditorId: null,
      auditorName: null,
      auditTime: null,
      matchCount: 0,
      effectTime: null,
      description: '生日当天赠送 50 积分',
      scene: '3',
      sceneName: '其他',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_669_600_000,
      updateTime: 1_743_669_600_000,
    },
    {
      id: 7,
      name: '充电满额赠分',
      type: '0',
      typeName: '获取规则',
      giftRatio: 0.015,
      status: '1',
      statusName: '已生效',
      auditorId: 2,
      auditorName: '李四',
      auditTime: 1_743_741_600_000,
      matchCount: 780,
      effectTime: 1_743_868_800_000,
      description: '充电满 100 元额外赠送 15 积分',
      scene: '0',
      sceneName: '充电',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_756_000_000,
      updateTime: 1_743_912_000_000,
    },
    {
      id: 8,
      name: '积分过期规则',
      type: '1',
      typeName: '消耗规则',
      giftRatio: 1,
      status: '1',
      statusName: '已生效',
      auditorId: 3,
      auditorName: '王五',
      auditTime: 1_743_914_400_000,
      matchCount: 320,
      effectTime: 1_744_041_600_000,
      description: '积分有效期 1 年，过期自动清零',
      scene: '3',
      sceneName: '其他',
      creator: 'admin',
      updater: 'admin',
      createTime: 1_743_928_800_000,
      updateTime: 1_744_084_800_000,
    },
  ];

  // 使用formatDate格式化时间戳字段
  return rawData.map((item) => ({
    ...item,
    createTimeStr: formatDate(item.createTime),
    updateTimeStr: formatDate(item.updateTime),
    auditTimeStr: formatDate(item.auditTime),
    effectTimeStr: formatDate(item.effectTime),
  }));
};

/** 规则配置搜索表单配置 - 覆盖所有表格展示字段 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '规则类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择规则类型',
        options: getDictOptions(DICT_TYPE.RULE_CONFIG_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'scene',
      label: '适用场景',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用场景',
        options: getDictOptions(DICT_TYPE.RULE_CONFIG_SCENE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'giftRatio',
      label: '赠送比例',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入赠送比例',
        min: 0,
        precision: 4,
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '规则状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择规则状态',
        options: getDictOptions(DICT_TYPE.RULE_CONFIG_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        type: 'datetimerange',
        valueFormat: 'x',
        clearable: true,
      },
    },
    {
      fieldName: 'auditorId',
      label: '审核人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核人',
        options: [],
        clearable: true,
        filterable: true,
        remote: true,
      },
    },
    {
      fieldName: 'matchCount',
      label: '匹配次数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入匹配次数',
        min: 0,
        clearable: true,
      },
    },
    {
      fieldName: 'effectTime',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生效时间',
        type: 'datetimerange',
        valueFormat: 'x',
        clearable: true,
      },
    },
  ];
}

/** 规则配置表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '规则名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'type',
      title: '规则类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'giftRatio',
      title: '赠送比例',
      minWidth: 120,
      sortable: true,
      slots: { default: 'giftRatio' },
    },
    {
      field: 'status',
      title: '规则状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'scene',
      title: '适用场景',
      minWidth: 120,
      sortable: true,
      slots: { default: 'scene' },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.createTimeStr || '-',
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'auditorName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.auditTimeStr || '-',
    },
    {
      field: 'matchCount',
      title: '匹配次数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'matchCount' },
    },
    {
      field: 'effectTime',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
      formatter: ({ row }) => row.effectTimeStr || '-',
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 规则配置表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '规则类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择规则类型',
        options: [
          { label: '获取规则', value: '0' },
          { label: '消耗规则', value: '1' },
          { label: '赠送规则', value: '2' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'giftRatio',
      label: '赠送比例',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入赠送比例',
        min: 0,
        precision: 4,
      },
      rules: 'required',
    },
    {
      fieldName: 'scene',
      label: '适用场景',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用场景',
        options: [
          { label: '充电', value: '0' },
          { label: '停车', value: '1' },
          { label: '活动', value: '2' },
          { label: '其他', value: '3' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '规则描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则描述',
      },
    },
  ];
}

export const textObj = {
  editText: '编辑规则配置',
  addText: '新增规则配置',
  excelName: '规则配置列表',
  excelAllName: '规则配置数据.xlsx',
  total: ' 总计: 规则配置数量8;已生效:5;未生效:3',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '规则ID' },
  { key: 'name', label: '规则名称' },
  {
    key: 'typeName',
    label: '规则类型',
    type: 'tag',
    tagType: (value) => {
      const typeMap = {
        '获取规则': 'primary',
        '消耗规则': 'warning',
        '赠送规则': 'success',
      };
      return typeMap[value] || 'info';
    },
  },
  { key: 'giftRatio', label: '赠送比例' },
  {
    key: 'statusName',
    label: '规则状态',
    type: 'tag',
    tagType: (value) => {
      const statusMap = {
        '已生效': 'success',
        '未生效': 'info',
      };
      return statusMap[value] || 'info';
    },
  },
  {
    key: 'sceneName',
    label: '适用场景',
    type: 'tag',
    tagType: (value) => {
      const sceneMap = {
        '充电': 'primary',
        '停车': 'warning',
        '活动': 'success',
        '其他': 'info',
      };
      return sceneMap[value] || 'info';
    },
  },
  { key: 'description', label: '规则描述' },
  { key: 'auditorName', label: '审核人' },
  { key: 'auditTimeStr', label: '审核时间' },
  { key: 'matchCount', label: '匹配次数' },
  { key: 'effectTimeStr', label: '生效时间' },
  { key: 'creator', label: '创建者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTimeStr', label: '更新时间' },
];
