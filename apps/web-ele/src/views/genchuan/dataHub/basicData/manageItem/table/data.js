import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

/** 分类表单配置（包含所有指定字段） */
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
            formModel.parentName = '无';
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
            formModel.parentName =
              selectedNode.label || selectedNode.categoryName;
          }
        },
      },
    },
    {
      fieldName: 'deptName',
      label: '主管部门',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主管部门',
      },
      rules: 'required',
    },
    {
      fieldName: 'dealLimit',
      label: '处置时限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入处置时限(小时)',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'workflowCode',
      label: '工作流编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工作流编码',
      },
    },
    {
      fieldName: 'categoryType',
      label: '分类类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择分类类型',
        options: getDictOptions(DICT_TYPE.DATA_CATEGORYTYPE, 'string'),
      },
      rules: 'required',
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
    {
      fieldName: 'relatedMatterCount',
      label: '关联事项数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联事项数',
        min: 0,
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
      rules: 'required',
    },
  ];
}

/** 分类表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'categoryName',
      title: '分类名称',
      minWidth: 150,
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
      field: 'parentName',
      title: '上级分类',
      minWidth: 120,
      sortable: true,
      slots: { default: 'parentName' },
    },
    {
      field: 'deptName',
      title: '主管部门',
      minWidth: 120,
      sortable: true,
      slots: { default: 'deptName' },
    },
    {
      field: 'dealLimit',
      title: '处置时限',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'workflowCode',
      title: '工作流编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'workflowCode' },
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
      field: 'relatedMatterCount',
      title: '关联事项数',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'auditStatus',
      title: '审核状态',
      minWidth: 100,
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

export const textObj = {
  editText: '编辑分类',
  addText: '新增分类',
  excelName: '分类列表',
  excelAllName: '全市分类数据.xlsx',
  total: ' 总计: 分类数量17; 关联事项数2032; 已审核13',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'categoryName', label: '分类名称' },
  { key: 'categoryCode', label: '分类代码' },
  { key: 'parentName', label: '上级分类' },
  { key: 'deptName', label: '主管部门' },
  { key: 'dealLimit', label: '处置时限' },
  { key: 'workflowCode', label: '工作流编码' },
  {
    key: 'categoryType',
    label: '分类类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_CATEGORYTYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_CATEGORYTYPE, String(value));
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
  { key: 'relatedMatterCount', label: '关联事项数' },
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

// ==================== 事项实例相关配置 ====================

/** 事项实例表单配置 */
export function useInstanceFormSchema(treeData = []) {
  return [
    {
      fieldName: 'name',
      label: '事项名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入事项名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'uniqueCode',
      label: '16位标识码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入16位标识码',
        maxlength: 16,
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
            formModel.parentCategoryId = '';
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
            formModel.parentCategoryId = selectedNode.id;
            formModel.categoryName =
              selectedNode.label || selectedNode.categoryName;
          }
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '事发位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入事发位置',
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
      rules: 'required',
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
        options: getDictOptions(DICT_TYPE.DATA_MANAGEITEM_STATUS, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'deptName',
      label: '主管部门',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主管部门',
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
      fieldName: 'partCount',
      label: '关联部件数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联部件数',
        min: 0,
      },
      rules: 'required',
    },
  ];
}

/** 事项实例表格列配置 */
export function useInstanceGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '事项名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'uniqueCode',
      title: '16位标识码',
      minWidth: 160,
      sortable: true,
      slots: { default: 'uniqueCode' },
    },
    {
      field: 'categoryName',
      title: '所属分类',
      minWidth: 120,
      sortable: true,
      slots: { default: 'categoryName' },
    },
    // {
    //   field: 'parentCategoryId',
    //   title: '上级分类ID',
    //   minWidth: 120,
    //   sortable: true,
    // },
    {
      field: 'location',
      title: '事发位置',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'gridName',
      title: '所在网格',
      minWidth: 150,
      sortable: true,
      slots: { default: 'gridName' },
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
        props: { type: DICT_TYPE.DATA_MANAGEITEM_STATUS },
      },
    },
    {
      field: 'deptName',
      title: '主管部门',
      minWidth: 120,
      sortable: true,
      slots: { default: 'deptName' },
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
      field: 'partCount',
      title: '关联部件数',
      minWidth: 120,
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

export const instanceTextObj = {
  editText: '编辑事项实例',
  addText: '新增事项实例',
  excelName: '事项实例列表',
  excelAllName: '全市事项实例数据.xlsx',
  total: ' 总计: 事项实例数量15; 启用12; 禁用2; 维护中1',
};

/** 事项实例详情抽屉字段配置 */
export const instanceDetailFields = [
  { key: 'name', label: '事项名称' },
  { key: 'uniqueCode', label: '16位标识码' },
  { key: 'categoryName', label: '所属分类' },
  { key: 'parentCategoryId', label: '上级分类ID' },
  { key: 'location', label: '事发位置' },
  { key: 'gridName', label: '所在网格' },
  { key: 'description', label: '描述信息' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_MANAGEITEM_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_MANAGEITEM_STATUS, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
  { key: 'deptName', label: '主管部门' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'handler', label: '处置人' },
  { key: 'dealTime', label: '处置时间' },
  { key: 'partCount', label: '关联部件数' },
];

/** 事项实例搜索表单配置（专门用于搜索，所属分类使用id进行搜索） */
export function useInstanceSearchFormSchema(treeData = []) {
  return [
    {
      fieldName: 'name',
      label: '事项名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入事项名称',
      },
    },
    {
      fieldName: 'uniqueCode',
      label: '16位标识码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入16位标识码',
        maxlength: 16,
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
      fieldName: 'location',
      label: '事发位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入事发位置',
      },
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
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: getDictOptions(DICT_TYPE.DATA_MANAGEITEM_STATUS, 'string'),
      },
    },
    {
      fieldName: 'deptName',
      label: '主管部门',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主管部门',
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
      fieldName: 'handler',
      label: '处置人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置人',
      },
    },
  ];
}
