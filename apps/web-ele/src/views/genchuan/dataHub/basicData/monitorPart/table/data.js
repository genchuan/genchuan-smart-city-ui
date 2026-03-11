import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

/** 分类表单配置（包含所有指定字段） */
export function useFormSchema(treeData = []) {
  return [
    {
      fieldName: 'name',
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
          // 根据label搜索节点
          if (!value) return true;
          return data.label && data.label.toLowerCase().includes(value.toLowerCase());
        },
        onChange: (val, formModel) => {
          if (!val) {
            formModel.parentId = null;
            formModel.parentCategory = '无';
            return;
          }

          // 递归查找选中的节点
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
            formModel.parentCategory = selectedNode.label || selectedNode.categoryName;
          }
        },
      },
    },
    {
      fieldName: 'coreIndicators',
      label: '核心监测指标',
      component: 'Select',
      componentProps: {
        placeholder: '请选择核心监测指标',
        options: getDictOptions(DICT_TYPE.DATA_CORE_INDICATORS, 'string'),
        multiple: true,
        filterable: true,
        valueFormat: (value) => value.join(','),
        inputFormat: (value) => value ? value.split(',') : [],
      },
      rules: 'required',
    },
    {
      fieldName: 'thresholdRules',
      label: '告警阈值规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入告警阈值规则',
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
      fieldName: 'instanceCount',
      label: '关联实例数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联实例数',
        min: 0,
      },
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
      field: 'name',
      title: '分类名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' },
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
      minWidth: 120,
      sortable: true,
      slots: { default: 'parentCategory' },
    },
    {
      field: 'coreIndicators',
      title: '核心监测指标',
      minWidth: 230,
      sortable: true,
      slots: { default: 'coreIndicators' },
    },
    {
      field: 'thresholdRules',
      title: '告警阈值规则',
      minWidth: 150,
      sortable: true,
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
  editText: '编辑监测部件分类',
  addText: '新增监测部件分类',
  excelName: '监测部件分类列表',
  excelAllName: '全市监测部件分类数据.xlsx',
  total: ' 总计: 分类数量10; 启用: 8; 禁用: 2',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'name', label: '分类名称' },
  { key: 'categoryCode', label: '分类代码' },
  { key: 'parentCategory', label: '上级分类' },
  {
    key: 'coreIndicators',
    label: '核心监测指标',
    type: 'tags',
    formatter: (value) => {
      if (!value) return [];
      const indicators = value.split(',');
      // 颜色类型映射 - 将字典颜色映射到Element Plus支持的颜色类型
      const colorTypeMap = {
        danger: 'danger',
        error: 'danger',
        info: 'info',
        primary: 'primary',
        success: 'success',
        warning: 'warning',
        blue: 'primary',
        green: 'success',
        orange: 'warning',
        cyan: 'info',
        purple: 'primary',
        pink: 'danger',
        red: 'danger',
        yellow: 'warning',
      };
      return indicators.map(indicator => {
        const dict = getDictObj(DICT_TYPE.DATA_CORE_INDICATORS, String(indicator));
        const rawType = dict ? dict.colorType : 'primary';
        return {
          label: dict ? dict.label : indicator,
          type: colorTypeMap[rawType] || rawType || 'primary',
        };
      });
    },
  },
  { key: 'thresholdRules', label: '告警阈值规则' },
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

// ==================== 部件实例相关配置 ====================

/** 部件实例表单配置 */
export function useInstanceFormSchema(treeData = []) {
  return [
    {
      fieldName: 'name',
      label: '部件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入部件名称',
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
          return data.label && data.label.toLowerCase().includes(value.toLowerCase());
        },
        onChange: (val, formModel) => {
          if (!val) {
            formModel.categoryName = '';
            formModel.categoryId = '';
            return;
          }

          // 递归查找选中的节点
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
            formModel.categoryName = selectedNode.label || selectedNode.categoryName;
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
      rules: 'required',
    },
    {
      fieldName: 'coordinate',
      label: '坐标信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入坐标信息，如：116.4074,39.9042',
      },
      rules: 'required',
    },
    {
      fieldName: 'runStatus',
      label: '运行状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择运行状态',
        options: getDictOptions(DICT_TYPE.DATA_MANAGEPART_RUNSTATUS, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'installTime',
      label: '安装时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择安装时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'calibrateCycle',
      label: '校准周期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入校准周期',
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
      fieldName: 'areaName',
      label: '行政区划归属',
      component: 'Input',
      componentProps: {
        placeholder: '请输入行政区划归属',
      },
      rules: 'required',
    },
    {
      fieldName: 'relatedPartName',
      label: '关联管理部件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联管理部件',
      },
    },
    {
      fieldName: 'nextCalibrateTime',
      label: '下次校准时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择下次校准时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 部件实例表格列配置 */
export function useInstanceGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '部件名称',
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
      minWidth: 120,
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
      field: 'coordinate',
      title: '坐标信息',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'runStatus',
      title: '运行状态',
      minWidth: 100,
      sortable: true,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.DATA_MANAGEPART_RUNSTATUS },
      },
    },
    {
      field: 'installTime',
      title: '安装时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'calibrateCycle',
      title: '校准周期',
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
      field: 'areaName',
      title: '行政区划归属',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'relatedPartName',
      title: '关联管理部件',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'nextCalibrateTime',
      title: '下次校准时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const instanceTextObj = {
  editText: '编辑监测部件实例',
  addText: '新增监测部件实例',
  excelName: '监测部件实例列表',
  excelAllName: '全市监测部件实例数据.xlsx',
  total: ' 总计: 监测部件实例数量10; 正常运行8; 异常2',
};

/** 部件实例详情抽屉字段配置 */
export const instanceDetailFields = [
  { key: 'name', label: '部件名称' },
  { key: 'uniqueCode', label: '18位标识码' },
  { key: 'categoryName', label: '所属分类' },
  { key: 'gridName', label: '所在网格' },
  { key: 'coordinate', label: '坐标信息' },
  {
    key: 'runStatus',
    label: '运行状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_MANAGEPART_RUNSTATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.DATA_MANAGEPART_RUNSTATUS, String(value));
      return dict ? dict.colorType : 'primary';
    },
  },
  { key: 'installTime', label: '安装时间' },
  { key: 'calibrateCycle', label: '校准周期' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'areaName', label: '行政区划归属' },
  { key: 'relatedPartName', label: '关联管理部件' },
  { key: 'nextCalibrateTime', label: '下次校准时间' },
];

/** 部件实例搜索表单配置（专门用于搜索，所属分类使用id进行搜索） */
export function useInstanceSearchFormSchema(treeData = []) {
  return [
    {
      fieldName: 'name',
      label: '部件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入部件名称',
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
          return data.label && data.label.toLowerCase().includes(value.toLowerCase());
        },
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
      fieldName: 'coordinate',
      label: '坐标信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入坐标信息，如：116.4074,39.9042',
      },
    },
    {
      fieldName: 'runStatus',
      label: '运行状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择运行状态',
        options: getDictOptions(DICT_TYPE.DATA_MANAGEPART_RUNSTATUS, 'string'),
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
      fieldName: 'relatedPartName',
      label: '关联管理部件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联管理部件',
      },
    },
  ];
}
