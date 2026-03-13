import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

/** 应用场景分类表单配置 */
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
      fieldName: 'applicableArea',
      label: '适用区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入适用区域',
      },
    },
    {
      fieldName: 'dataType',
      label: '关联数据类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联数据类型',
        options: getDictOptions(DICT_TYPE.DATA_TYPE, 'string'),
      },
    },
    {
      fieldName: 'categoryType',
      label: '分类类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择分类类型',
        options: getDictOptions(DICT_TYPE.DATA_CATEGORY_TYPE, 'string'),
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

/** 应用场景实例表单配置 */
export function useInstanceFormSchema(treeData = []) {
  return [
    {
      fieldName: 'sceneName',
      label: '场景名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场景名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'sceneCode',
      label: '场景编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场景编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'categoryName',
      label: '关联分类',
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择关联分类',
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
      fieldName: 'gridName',
      label: '所在网格',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所在网格',
      },
    },
    {
      fieldName: 'facilities',
      label: '涉及设施',
      component: 'Input',
      componentProps: {
        placeholder: '请输入涉及设施',
      },
    },
    {
      fieldName: 'manager',
      label: '负责人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入负责人',
      },
    },
    {
      fieldName: 'process',
      label: '处置流程',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置流程',
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
      fieldName: 'statusTime',
      label: '启用/停用时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择启用/停用时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
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
      fieldName: 'partCount',
      label: '关联部件数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联部件数',
        min: 0,
      },
    },
    {
      fieldName: 'eventCount',
      label: '关联事件数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联事件数',
        min: 0,
      },
    },
  ];
}

/** 应用场景实例搜索表单配置 */
export function useInstanceSearchFormSchema(treeData = []) {
  return [
    {
      fieldName: 'sceneName',
      label: '场景名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场景名称',
      },
    },
    {
      fieldName: 'sceneCode',
      label: '场景编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场景编码',
      },
    },
    {
      fieldName: 'categoryId',
      label: '关联分类',
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择关联分类',
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
        options: getDictOptions(DICT_TYPE.DATA_ENABLE_STATUS, 'string'),
      },
    },
  ];
}

/** 应用场景分类表格列配置 */
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
      field: 'applicableArea',
      title: '适用区域',
      minWidth: 150,
      sortable: true,
      slots: { default: 'applicableArea' },
    },
    {
      field: 'dataType',
      title: '关联数据类型',
      minWidth: 150,
      sortable: true,
      slots: { default: 'dataType' },
    },
    {
      field: 'categoryType',
      title: '分类类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'categoryType' },
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

/** 应用场景实例表格列配置 */
export function useInstanceGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'sceneName',
      title: '场景名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'sceneName' },
    },
    {
      field: 'sceneCode',
      title: '场景编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'sceneCode' },
    },
    {
      field: 'categoryName',
      title: '关联分类',
      minWidth: 150,
      sortable: true,
      slots: { default: 'instanceCategoryName' },
    },
    {
      field: 'gridName',
      title: '所在网格',
      minWidth: 150,
      sortable: true,
      slots: { default: 'gridName' },
    },
    {
      field: 'facilities',
      title: '涉及设施',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'manager',
      title: '负责人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'manager' },
    },
    {
      field: 'process',
      title: '处置流程',
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
      field: 'partCount',
      title: '关联部件数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'eventCount',
      title: '关联事件数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'statusTime',
      title: '启用/停用时间',
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
  editText: '编辑应用场景分类',
  addText: '新增应用场景分类',
  excelName: '应用场景分类列表',
  excelAllName: '应用场景分类数据.xlsx',
  total: ' 总计: 分类数量0',
};

export const instanceTextObj = {
  editText: '编辑应用场景实例',
  addText: '新增应用场景实例',
  excelName: '应用场景实例列表',
  excelAllName: '应用场景实例数据.xlsx',
  total: ' 总计: 应用场景实例数量0',
};

/** 应用场景分类详情抽屉字段配置 */
export const detailFields = [
  { key: 'categoryName', label: '分类名称' },
  { key: 'categoryCode', label: '分类代码' },
  { key: 'parentCategory', label: '上级分类' },
  { key: 'applicableArea', label: '适用区域' },
  {
    key: 'dataType',
    label: '关联数据类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_TYPE, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
  {
    key: 'categoryType',
    label: '分类类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_CATEGORY_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_CATEGORY_TYPE, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
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

/** 应用场景实例详情抽屉字段配置 */
export const instanceDetailFields = [
  { key: 'sceneName', label: '场景名称' },
  { key: 'sceneCode', label: '场景编码' },
  { key: 'categoryName', label: '关联分类' },
  { key: 'gridName', label: '所在网格' },
  { key: 'facilities', label: '涉及设施' },
  { key: 'manager', label: '负责人' },
  { key: 'process', label: '处置流程' },
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
  { key: 'partCount', label: '关联部件数' },
  { key: 'eventCount', label: '关联事件数' },
  { key: 'statusTime', label: '启用/停用时间' },
];
