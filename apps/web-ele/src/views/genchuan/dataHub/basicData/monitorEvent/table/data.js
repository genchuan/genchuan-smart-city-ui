import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

/** 监测事件分类表单配置 */
export function useFormSchema(treeData = []) {
  return [
    {
      fieldName: 'categoryName',
      label: '分类名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分类名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'categoryCode',
      label: '分类代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分类代码',
      },
      rules: 'required',
    },
    {
      fieldName: 'parentId',
      label: '上级分类',
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择上级分类',
        data: treeData,
        props: {
          value: 'id',
          label: 'label',
          children: 'children',
        },
        filterable: true,
        clearable: true,
        checkStrictly: true,
        filterNodeMethod: (value, data) => {
          if (!value) return true;
          return (
            data.label && data.label.toLowerCase().includes(value.toLowerCase())
          );
        },
        onChange: (val, formModel) => {
          if (!val) {
            formModel.parentId = null;
            formModel.parentCategory = '无';
            return;
          }

          const findNode = (nodes, id) => {
            for (const node of nodes) {
              if (node.id === id) {
                return node;
              }
              if (node.children && node.children.length > 0) {
                const found = findNode(node.children, id);
                if (found) {
                  return found;
                }
              }
            }
            return null;
          };

          const selectedNode = findNode(treeData, val);
          if (selectedNode) {
            formModel.parentCategory =
              selectedNode.label || selectedNode.categoryName;
          }
        },
      },
    },
    {
      fieldName: 'relatedMonitorType',
      label: '关联监测部件类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联监测部件类型',
      },
    },
    {
      fieldName: 'relatedMatterType',
      label: '关联管理事项类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联管理事项类型',
      },
    },
    {
      fieldName: 'eventLevel',
      label: '事件等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择事件等级',
        options: getDictOptions(DICT_TYPE.DATA_EVENT_LEVEL, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'pushRule',
      label: '推送规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入推送规则',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: getDictOptions(DICT_TYPE.DATA_ENABLE_STATUS, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'auditStatus',
      label: '审核状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核状态',
        options: getDictOptions(DICT_TYPE.DATA_AUDIT_STATUS, 'string'),
      },
    },
    {
      fieldName: 'creator',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人',
      },
    },
    {
      fieldName: 'instanceCount',
      label: '关联实例数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联实例数',
        min: 0,
      },
    },
  ];
}

/** 监测事件实例表单配置 */
export function useInstanceFormSchema(treeData = []) {
  return [
    {
      fieldName: 'name',
      label: '事件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入事件名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'uniqueCode',
      label: '18位标识码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入18位标识码',
        maxlength: 18,
      },
      rules: 'required',
    },
    {
      fieldName: 'categoryName',
      label: '所属分类',
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择所属分类',
        data: treeData,
        props: {
          value: 'id',
          label: 'label',
          children: 'children',
        },
        filterable: true,
        clearable: true,
        checkStrictly: true,
        filterNodeMethod: (value, data) => {
          if (!value) return true;
          return (
            data.label && data.label.toLowerCase().includes(value.toLowerCase())
          );
        },
        onChange: (val, formModel) => {
          if (!val) {
            formModel.categoryName = '';
            formModel.categoryId = '';
            return;
          }

          const findNode = (nodes, id) => {
            for (const node of nodes) {
              if (node.id === id) {
                return node;
              }
              if (node.children && node.children.length > 0) {
                const found = findNode(node.children, id);
                if (found) {
                  return found;
                }
              }
            }
            return null;
          };

          const selectedNode = findNode(treeData, val);
          if (selectedNode) {
            formModel.categoryId = selectedNode.id;
            formModel.categoryName =
              selectedNode.label || selectedNode.categoryName;
          }
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'monitorName',
      label: '关联监测部件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联监测部件',
      },
    },
    {
      fieldName: 'coordinate',
      label: '事发坐标',
      component: 'Input',
      componentProps: {
        placeholder: '请输入事发坐标',
      },
    },
    {
      fieldName: 'eventLevel',
      label: '事件等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择事件等级',
        options: getDictOptions(DICT_TYPE.DATA_EVENT_LEVEL, 'string'),
      },
    },
    {
      fieldName: 'description',
      label: '描述信息',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入描述信息',
        rows: 3,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: getDictOptions(DICT_TYPE.DATA_MATTER_STATUS, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'handler',
      label: '处置人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置人',
      },
    },
    {
      fieldName: 'dealTime',
      label: '处置时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择处置时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'areaName',
      label: '行政区划归属',
      component: 'Input',
      componentProps: {
        placeholder: '请输入行政区划归属',
      },
    },
    {
      fieldName: 'matterName',
      label: '关联管理事项',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联管理事项',
      },
    },
    {
      fieldName: 'creator',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人',
      },
    },
  ];
}

/** 监测事件实例搜索表单配置 */
export function useInstanceSearchFormSchema(treeData = []) {
  return [
    {
      fieldName: 'name',
      label: '事件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入事件名称',
      },
    },
    {
      fieldName: 'uniqueCode',
      label: '18位标识码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入18位标识码',
        maxlength: 18,
      },
    },
    {
      fieldName: 'categoryId',
      label: '所属分类',
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择所属分类',
        data: treeData,
        props: {
          value: 'id',
          label: 'label',
          children: 'children',
        },
        filterable: true,
        clearable: true,
        checkStrictly: true,
        filterNodeMethod: (value, data) => {
          if (!value) return true;
          return (
            data.label && data.label.toLowerCase().includes(value.toLowerCase())
          );
        },
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: getDictOptions(DICT_TYPE.DATA_MATTER_STATUS, 'string'),
      },
    },
  ];
}

/** 监测事件分类表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'categoryName',
      title: '分类名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'categoryNameDetail' },
    },
    {
      field: 'categoryCode',
      title: '分类代码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'categoryCode' },
    },
    {
      field: 'parentCategory',
      title: '上级分类',
      minWidth: 150,
      sortable: true,
      slots: { default: 'parentCategory' },
    },
    {
      field: 'relatedMonitorType',
      title: '关联监测部件类型',
      minWidth: 180,
      sortable: true,
      slots: { default: 'relatedMonitorType' },
    },
    {
      field: 'relatedMatterType',
      title: '关联管理事项类型',
      minWidth: 180,
      sortable: true,
      slots: { default: 'relatedMatterType' },
    },
    {
      field: 'eventLevel',
      title: '事件等级',
      minWidth: 100,
      sortable: true,
      slots: { default: 'eventLevel' },
    },
    {
      field: 'pushRule',
      title: '推送规则',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.DATA_ENABLE_STATUS },
      },
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
      field: 'instanceCount',
      title: '关联实例数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditStatus',
      title: '审核状态',
      minWidth: 120,
      sortable: true,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.DATA_AUDIT_STATUS },
      },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 监测事件实例表格列配置 */
export function useInstanceGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '事件名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'uniqueCode',
      title: '18位标识码',
      minWidth: 180,
      sortable: true,
      slots: { default: 'uniqueCode' },
    },
    {
      field: 'categoryName',
      title: '所属分类',
      minWidth: 150,
      sortable: true,
      slots: { default: 'instanceCategoryName' },
    },
    {
      field: 'monitorName',
      title: '关联监测部件',
      minWidth: 150,
      sortable: true,
      slots: { default: 'monitorName' },
    },
    {
      field: 'coordinate',
      title: '事发坐标',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'eventLevel',
      title: '事件等级',
      minWidth: 100,
      sortable: true,
      slots: { default: 'eventLevel' },
    },
    {
      field: 'description',
      title: '描述信息',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.DATA_MATTER_STATUS },
      },
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
      field: 'handler',
      title: '处置人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'dealTime',
      title: '处置时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'areaName',
      title: '行政区划归属',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'matterName',
      title: '关联管理事项',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑监测事件分类',
  addText: '新增监测事件分类',
  excelName: '监测事件分类列表',
  excelAllName: '监测事件分类数据.xlsx',
  total: ' 总计: 分类数量0',
};

export const instanceTextObj = {
  editText: '编辑监测事件实例',
  addText: '新增监测事件实例',
  excelName: '监测事件实例列表',
  excelAllName: '监测事件实例数据.xlsx',
  total: ' 总计: 监测事件实例数量0',
};

/** 监测事件分类详情抽屉字段配置 */
export const detailFields = [
  { key: 'categoryName', label: '分类名称' },
  { key: 'categoryCode', label: '分类代码' },
  { key: 'parentCategory', label: '上级分类' },
  { key: 'relatedMonitorType', label: '关联监测部件类型' },
  { key: 'relatedMatterType', label: '关联管理事项类型' },
  {
    key: 'eventLevel',
    label: '事件等级',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_EVENT_LEVEL, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_EVENT_LEVEL, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
  { key: 'pushRule', label: '推送规则' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_ENABLE_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_ENABLE_STATUS, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'instanceCount', label: '关联实例数' },
  {
    key: 'auditStatus',
    label: '审核状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_AUDIT_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_AUDIT_STATUS, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
];

/** 监测事件实例详情抽屉字段配置 */
export const instanceDetailFields = [
  { key: 'name', label: '事件名称' },
  { key: 'uniqueCode', label: '18位标识码' },
  { key: 'categoryName', label: '所属分类' },
  { key: 'monitorName', label: '关联监测部件' },
  { key: 'coordinate', label: '事发坐标' },
  {
    key: 'eventLevel',
    label: '事件等级',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_EVENT_LEVEL, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_EVENT_LEVEL, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
  { key: 'description', label: '描述信息' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_MATTER_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_MATTER_STATUS, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'handler', label: '处置人' },
  { key: 'dealTime', label: '处置时间' },
  { key: 'areaName', label: '行政区划归属' },
  { key: 'matterName', label: '关联管理事项' },
];
