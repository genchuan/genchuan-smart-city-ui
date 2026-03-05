import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

/** 分类表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      id: 'C001',
      parentId: null,
      categoryName: '公共设施',
      categoryCode: 'PUB001',
      parentCategoryName: '无',
      iconName: 'Building',
      categoryType: '系统分类',
      status: '1',
      creator: '张三',
      createTime: '2025-01-10 09:20:30',
      instanceCount: '156',
      auditStatus: '已审核',
    },
    {
      id: 'C002',
      parentId: null,
      categoryName: '商业服务',
      categoryCode: 'COM001',
      parentCategoryName: '无',
      iconName: 'Shop',
      categoryType: '自定义分类',
      status: '1',
      creator: '李四',
      createTime: '2025-01-12 14:15:20',
      instanceCount: '89',
      auditStatus: '已审核',
    },
    {
      id: 'C003',
      parentId: 'C001',
      categoryName: '道路设施',
      categoryCode: 'ROAD001',
      parentCategoryName: '公共设施',
      iconName: 'Van',
      categoryType: '系统分类',
      status: '1',
      creator: '王五',
      createTime: '2025-01-15 10:05:10',
      instanceCount: '234',
      auditStatus: '已审核',
    },
    {
      id: 'C004',
      parentId: 'C001',
      categoryName: '园林绿化',
      categoryCode: 'GREEN001',
      parentCategoryName: '公共设施',
      iconName: 'Sunny',
      categoryType: '系统分类',
      status: '0',
      creator: '赵六',
      createTime: '2025-01-18 08:30:45',
      instanceCount: '67',
      auditStatus: '待审核',
    },
    {
      id: 'C005',
      parentId: 'C002',
      categoryName: '餐饮服务',
      categoryCode: 'FOOD001',
      parentCategoryName: '商业服务',
      iconName: 'Food',
      categoryType: '自定义分类',
      status: '1',
      creator: '孙七',
      createTime: '2025-01-20 16:40:15',
      instanceCount: '178',
      auditStatus: '已审核',
    },
    {
      id: 'C006',
      parentId: 'C002',
      categoryName: '医疗服务',
      categoryCode: 'MED001',
      parentCategoryName: '商业服务',
      iconName: 'FirstAidKit',
      categoryType: '自定义分类',
      status: '2',
      creator: '周八',
      createTime: '2025-01-22 11:10:30',
      instanceCount: '45',
      auditStatus: '审核中',
    },
    {
      id: 'C007',
      parentId: 'C001',
      categoryName: '教育机构',
      categoryCode: 'EDU001',
      parentCategoryName: '公共设施',
      iconName: 'Reading',
      categoryType: '系统分类',
      status: '1',
      creator: '吴九',
      createTime: '2025-01-25 13:25:40',
      instanceCount: '123',
      auditStatus: '已审核',
    },
    {
      id: 'C008',
      parentId: 'C001',
      categoryName: '交通设施',
      categoryCode: 'TRANS001',
      parentCategoryName: '公共设施',
      iconName: 'Guide',
      categoryType: '系统分类',
      status: '1',
      creator: '郑十',
      createTime: '2025-01-28 09:50:25',
      instanceCount: '89',
      auditStatus: '已审核',
    },
    {
      id: 'C009',
      parentId: 'C002',
      categoryName: '购物服务',
      categoryCode: 'SHOP001',
      parentCategoryName: '商业服务',
      iconName: 'Present',
      categoryType: '自定义分类',
      status: '0',
      creator: '张三',
      createTime: '2025-02-01 15:15:10',
      instanceCount: '210',
      auditStatus: '待审核',
    },
    {
      id: 'C010',
      parentId: 'C002',
      categoryName: '休闲娱乐',
      categoryCode: 'ENT001',
      parentCategoryName: '商业服务',
      iconName: 'VideoCamera',
      categoryType: '自定义分类',
      status: '1',
      creator: '李四',
      createTime: '2025-02-05 10:30:50',
      instanceCount: '145',
      auditStatus: '已审核',
    },
    {
      id: 'C011',
      parentId: 'C001',
      categoryName: '环境卫生',
      categoryCode: 'ENV001',
      parentCategoryName: '公共设施',
      iconName: 'Delete',
      categoryType: '系统分类',
      status: '2',
      creator: '王五',
      createTime: '2025-02-08 14:20:15',
      instanceCount: '78',
      auditStatus: '审核中',
    },
    {
      id: 'C012',
      parentId: 'C002',
      categoryName: '金融服务',
      categoryCode: 'FIN001',
      parentCategoryName: '商业服务',
      iconName: 'Money',
      categoryType: '自定义分类',
      status: '1',
      creator: '赵六',
      createTime: '2025-02-10 09:40:30',
      instanceCount: '56',
      auditStatus: '已审核',
    },
    {
      id: 'C013',
      parentId: 'C002',
      categoryName: '住宿服务',
      categoryCode: 'HOTEL001',
      parentCategoryName: '商业服务',
      iconName: 'House',
      categoryType: '自定义分类',
      status: '1',
      creator: '孙七',
      createTime: '2025-02-12 11:55:20',
      instanceCount: '92',
      auditStatus: '已审核',
    },
    {
      id: 'C014',
      parentId: 'C001',
      categoryName: '文化设施',
      categoryCode: 'CULT001',
      parentCategoryName: '公共设施',
      iconName: 'Picture',
      categoryType: '系统分类',
      status: '0',
      creator: '周八',
      createTime: '2025-02-15 16:30:10',
      instanceCount: '34',
      auditStatus: '待审核',
    },
    {
      id: 'C015',
      parentId: 'C001',
      categoryName: '体育设施',
      categoryCode: 'SPORT001',
      parentCategoryName: '公共设施',
      iconName: 'Basketball',
      categoryType: '系统分类',
      status: '1',
      creator: '吴九',
      createTime: '2025-02-18 08:45:35',
      instanceCount: '67',
      auditStatus: '已审核',
    },
    {
      id: 'C016',
      parentId: 'C002',
      categoryName: '旅游服务',
      categoryCode: 'TOUR001',
      parentCategoryName: '商业服务',
      iconName: 'Plane',
      categoryType: '自定义分类',
      status: '1',
      creator: '张三',
      createTime: '2025-02-20 10:00:00',
      instanceCount: '45',
      auditStatus: '未审核',
    },
    {
      id: 'C017',
      parentId: 'C002',
      categoryName: '物流服务',
      categoryCode: 'LOGIS001',
      parentCategoryName: '商业服务',
      iconName: 'Truck',
      categoryType: '自定义分类',
      status: '1',
      creator: '李四',
      createTime: '2025-02-22 14:30:00',
      instanceCount: '28',
      auditStatus: '未审核',
    },
  ];
};

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
          // 根据label搜索节点
          if (!value) return true;
          return (
            data.label && data.label.toLowerCase().includes(value.toLowerCase())
          );
        },
        onChange: (val, formModel) => {
          if (!val) {
            formModel.parentId = null;
            formModel.parentCategoryName = '无';
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
            formModel.parentCategoryName =
              selectedNode.label || selectedNode.categoryName;
          }
        },
      },
    },

    {
      fieldName: 'iconName',
      label: '图示关联',
      component: 'Input',
      componentProps: {
        placeholder: '请输入图示关联',
      },
    },
    {
      fieldName: 'categoryType',
      label: '分类类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择分类类型',
        options: getDictOptions(
          DICT_TYPE.DATA_MANAGEPART_CATEGORYTYPE,
          'string',
        ),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' },
          { label: '维护中', value: '2' },
        ],
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
      rules: 'required',
    },
    {
      fieldName: 'auditStatus',
      label: '审核状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核状态',
        options: [
          { label: '未审核', value: '未审核' },
          { label: '待审核', value: '待审核' },
          { label: '审核中', value: '审核中' },
          { label: '已审核', value: '已审核' },
        ],
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
      slots: { default: 'categoryName' },
    },
    {
      field: 'categoryCode',
      title: '分类代码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'categoryCode' },
    },
    {
      field: 'parentCategoryName',
      title: '上级分类',
      minWidth: 120,
      sortable: true,
      slots: { default: 'parentCategoryName' },
    },
    {
      field: 'iconName',
      title: '图示关联',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'categoryType',
      title: '分类类型',
      minWidth: 120,
      sortable: true,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.DATA_MANAGEPART_CATEGORYTYPE },
      },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
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
      slots: { default: 'auditStatus' },
    },
    {
      title: '操作',
      width: 180,
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
  total: ' 总计: 分类数量17; 关联实例数2032; 已审核13',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'categoryName', label: '分类名称' },
  { key: 'categoryCode', label: '分类代码' },
  { key: 'parentCategoryName', label: '上级分类' },
  { key: 'iconName', label: '图示关联' },
  {
    key: 'categoryType',
    label: '分类类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(
        DICT_TYPE.DATA_MANAGEPART_CATEGORYTYPE,
        String(value),
      );
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(
        DICT_TYPE.DATA_MANAGEPART_CATEGORYTYPE,
        String(value),
      );
      return dict ? dict.colorType : 'primary';
    },
  },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    formatter: (value) => {
      switch (value) {
        case '0': {
          return '禁用';
        }
        case '1': {
          return '启用';
        }
        case '2': {
          return '维护中';
        }
        default: {
          return '未知';
        }
      }
    },
    tagType: (value) => {
      switch (value) {
        case '0': {
          return 'danger';
        }
        case '1': {
          return 'success';
        }
        case '2': {
          return 'warning';
        }
        default: {
          return 'info';
        }
      }
    },
  },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'instanceCount', label: '关联实例数' },
  { key: 'auditStatus', label: '审核状态' },
];

// ==================== 部件实例相关配置 ====================

/** 部件实例表格初始数据 */
export const instanceDataList = () => {
  return [
    {
      id: 'I001',
      partName: '路灯-中山路001',
      uniqueCode: 'LD20250301000001',
      categoryName: '道路设施',
      gridName: '中山路网格A区',
      coordinate: '116.4074,39.9042',
      runStatus: '1',
      deptName: '市政管理局',
      creator: '张三',
      createTime: '2025-01-10 09:20:30',
      monitorCount: '3',
      areaName: '朝阳区',
    },
    {
      id: 'I002',
      partName: '垃圾桶-公园路015',
      uniqueCode: 'LJ20250301000015',
      categoryName: '环境卫生',
      gridName: '公园路网格B区',
      coordinate: '116.4156,39.9123',
      runStatus: '1',
      deptName: '环卫管理处',
      creator: '李四',
      createTime: '2025-01-12 14:15:20',
      monitorCount: '1',
      areaName: '海淀区',
    },
    {
      id: 'I003',
      partName: '公交站牌-长安街008',
      uniqueCode: 'GZ20250301000008',
      categoryName: '交通设施',
      gridName: '长安街网格C区',
      coordinate: '116.3987,39.9089',
      runStatus: '1',
      deptName: '交通运输局',
      creator: '王五',
      createTime: '2025-01-15 10:05:10',
      monitorCount: '2',
      areaName: '东城区',
    },
    {
      id: 'I004',
      partName: '消防栓-建设路032',
      uniqueCode: 'XF20250301000032',
      categoryName: '公共设施',
      gridName: '建设路网格D区',
      coordinate: '116.4234,39.9012',
      runStatus: '2',
      deptName: '消防救援支队',
      creator: '赵六',
      createTime: '2025-01-18 08:30:45',
      monitorCount: '4',
      areaName: '西城区',
    },
    {
      id: 'I005',
      partName: '摄像头-商业街006',
      uniqueCode: 'SX20250301000006',
      categoryName: '商业服务',
      gridName: '商业街网格E区',
      coordinate: '116.3890,39.9156',
      runStatus: '1',
      deptName: '公安局',
      creator: '孙七',
      createTime: '2025-01-20 16:40:15',
      monitorCount: '5',
      areaName: '丰台区',
    },
    {
      id: 'I006',
      partName: '井盖-解放路045',
      uniqueCode: 'JG20250301000045',
      categoryName: '道路设施',
      gridName: '解放路网格F区',
      coordinate: '116.4345,39.8987',
      runStatus: '0',
      deptName: '市政管理局',
      creator: '周八',
      createTime: '2025-01-22 11:10:30',
      monitorCount: '2',
      areaName: '石景山区',
    },
    {
      id: 'I007',
      partName: '广告牌-人民路023',
      uniqueCode: 'GG20250301000023',
      categoryName: '商业服务',
      gridName: '人民路网格G区',
      coordinate: '116.3765,39.9234',
      runStatus: '1',
      deptName: '城市管理局',
      creator: '吴九',
      createTime: '2025-01-25 13:25:40',
      monitorCount: '1',
      areaName: '门头沟区',
    },
    {
      id: 'I008',
      partName: '充电桩-科技路012',
      uniqueCode: 'CD20250301000012',
      categoryName: '交通设施',
      gridName: '科技路网格H区',
      coordinate: '116.4456,39.8876',
      runStatus: '1',
      deptName: '发改委',
      creator: '郑十',
      createTime: '2025-01-28 09:50:25',
      monitorCount: '3',
      areaName: '房山区',
    },
    {
      id: 'I009',
      partName: '公园座椅-绿岛路009',
      uniqueCode: 'ZY20250301000009',
      categoryName: '园林绿化',
      gridName: '绿岛路网格I区',
      coordinate: '116.3567,39.9345',
      runStatus: '1',
      deptName: '园林绿化局',
      creator: '张三',
      createTime: '2025-02-01 15:15:10',
      monitorCount: '0',
      areaName: '通州区',
    },
    {
      id: 'I010',
      partName: '信号灯-和平路067',
      uniqueCode: 'XH20250301000067',
      categoryName: '交通设施',
      gridName: '和平路网格J区',
      coordinate: '116.4678,39.8765',
      runStatus: '1',
      deptName: '交警支队',
      creator: '李四',
      createTime: '2025-02-05 10:30:50',
      monitorCount: '6',
      areaName: '顺义区',
    },
    {
      id: 'I011',
      partName: '公厕-文化路038',
      uniqueCode: 'GC20250301000038',
      categoryName: '环境卫生',
      gridName: '文化路网格K区',
      coordinate: '116.3345,39.9456',
      runStatus: '1',
      deptName: '环卫管理处',
      creator: '王五',
      createTime: '2025-02-08 14:20:15',
      monitorCount: '2',
      areaName: '昌平区',
    },
    {
      id: 'I012',
      partName: '健身器材-体育路055',
      uniqueCode: 'JS20250301000055',
      categoryName: '体育设施',
      gridName: '体育路网格L区',
      coordinate: '116.4890,39.8654',
      runStatus: '1',
      deptName: '体育局',
      creator: '赵六',
      createTime: '2025-02-10 09:40:30',
      monitorCount: '1',
      areaName: '大兴区',
    },
    {
      id: 'I013',
      partName: '图书馆自助机-教育路019',
      uniqueCode: 'TS20250301000019',
      categoryName: '文化设施',
      gridName: '教育路网格M区',
      coordinate: '116.3123,39.9567',
      runStatus: '1',
      deptName: '文化和旅游局',
      creator: '孙七',
      createTime: '2025-02-12 11:55:20',
      monitorCount: '2',
      areaName: '怀柔区',
    },
    {
      id: 'I014',
      partName: '急救箱-健康路041',
      uniqueCode: 'JJ20250301000041',
      categoryName: '医疗服务',
      gridName: '健康路网格N区',
      coordinate: '116.5102,39.8543',
      runStatus: '2',
      deptName: '卫健委',
      creator: '周八',
      createTime: '2025-02-15 16:30:10',
      monitorCount: '3',
      areaName: '平谷区',
    },
    {
      id: 'I015',
      partName: '智能快递柜-社区路077',
      uniqueCode: 'KD20250301000077',
      categoryName: '物流服务',
      gridName: '社区路网格O区',
      coordinate: '116.2901,39.9678',
      runStatus: '1',
      deptName: '邮政管理局',
      creator: '吴九',
      createTime: '2025-02-18 08:45:35',
      monitorCount: '4',
      areaName: '密云区',
    },
  ];
};

/** 部件实例表单配置 */
export function useInstanceFormSchema(treeData = []) {
  return [
    {
      fieldName: 'partName',
      label: '部件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入部件名称',
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
            // 存储id到parentCategoryId，存储label到categoryName
            formModel.parentCategoryId = selectedNode.id;
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
      fieldName: 'monitorCount',
      label: '关联监测部件数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联监测部件数',
        min: 0,
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
  ];
}

/** 部件实例表格列配置 */
export function useInstanceGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'partName',
      title: '部件名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'partName' },
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
      field: 'monitorCount',
      title: '关联监测部件数',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'areaName',
      title: '行政区划归属',
      minWidth: 120,
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
  editText: '编辑部件实例',
  addText: '新增部件实例',
  excelName: '部件实例列表',
  excelAllName: '全市部件实例数据.xlsx',
  total: ' 总计: 部件实例数量15; 正常运行12; 故障维修2; 停用1',
};

/** 部件实例详情抽屉字段配置 */
export const instanceDetailFields = [
  { key: 'partName', label: '部件名称' },
  { key: 'uniqueCode', label: '16位标识码' },
  { key: 'categoryName', label: '所属分类' },
  { key: 'gridName', label: '所在网格' },
  { key: 'coordinate', label: '坐标信息' },
  {
    key: 'runStatus',
    label: '运行状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(
        DICT_TYPE.DATA_MANAGEPART_RUNSTATUS,
        String(value),
      );
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(
        DICT_TYPE.DATA_MANAGEPART_RUNSTATUS,
        String(value),
      );
      return dict ? dict.colorType : 'primary';
    },
  },
  { key: 'deptName', label: '主管部门' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'monitorCount', label: '关联监测部件数' },
  { key: 'areaName', label: '行政区划归属' },
];

/** 获取部件管理统计数据 */
export function getManagePartStatsData() {
  return {
    cards: [
      {
        title: '总部件数',
        value: 1568,
        unit: '个',
        icon: 'Box',
        color: '#4A90E2',
      },
      {
        title: '正常运行部件数',
        value: 1423,
        unit: '个',
        icon: 'CircleCheck',
        color: '#50E3C2',
      },
      {
        title: '关联监测部件数',
        value: 3245,
        unit: '个',
        icon: 'Connection',
        color: '#FF9F40',
      },
    ],
    charts: [
      {
        title: '部件分类占比',
        type: 'pie',
        data: [
          { name: '道路设施', value: 320 },
          { name: '环境卫生', value: 280 },
          { name: '交通设施', value: 240 },
          { name: '公共设施', value: 200 },
          { name: '园林绿化', value: 180 },
          { name: '商业服务', value: 160 },
          { name: '其他', value: 188 },
        ],
      },
      {
        title: '主管部门占比',
        type: 'pie',
        data: [
          { name: '市政管理局', value: 420 },
          { name: '环卫管理处', value: 380 },
          { name: '交通运输局', value: 320 },
          { name: '公安局', value: 280 },
          { name: '消防救援支队', value: 168 },
        ],
      },
      {
        title: '不同网格部件数量对比',
        type: 'bar',
        xAxis: [
          '中山路网格',
          '公园路网格',
          '长安街网格',
          '建设路网格',
          '商业街网格',
          '科技路网格',
          '绿岛路网格',
          '和平路网格',
        ],
        data: [245, 198, 176, 154, 142, 128, 115, 98],
      },
    ],
  };
}

/** 获取地图数据 */
export function getMapData() {
  return [
    {
      id: '1',
      partName: '万达广场停车场',
      uniqueCode: '350602TCC001001',
      coordinate: '118.595000,24.915000',
      runStatus: '1', // 异常
      categoryName: '停车场设施',
      gridName: '丰泽街道网格02',
    },
    {
      id: '2',
      partName: '中山公园西区长椅001',
      uniqueCode: '350602GYCY00201',
      coordinate: '118.587500,24.910300',
      runStatus: '2', // 正常
      categoryName: '公园长椅',
      gridName: '海滨街道网格03',
    },
    {
      id: '3',
      partName: '中山公园东区长椅001',
      uniqueCode: '350602GYCY00101',
      coordinate: '118.588500,24.910500',
      runStatus: '4', // 维护中
      categoryName: '公园长椅',
      gridName: '海滨街道网格03',
    },
    {
      id: '4',
      partName: '中山公园南门垃圾箱',
      uniqueCode: '350602LJX0020002',
      coordinate: '118.588200,24.909800',
      runStatus: '3', // 离线
      categoryName: '垃圾箱',
      gridName: '海滨街道网格03',
    },
    {
      id: '5',
      partName: '中山公园北门垃圾箱',
      uniqueCode: '350602LJX0010001',
      coordinate: '118.588000,24.910000',
      runStatus: '1', // 异常
      categoryName: '垃圾箱',
      gridName: '海滨街道网格03',
    },
    {
      id: '6',
      partName: '万达广场地下停车位A002',
      uniqueCode: '350602TCW002A02',
      coordinate: '118.595100,24.915100',
      runStatus: '2', // 正常
      categoryName: '停车位',
      gridName: '丰泽街道网格02',
    },
    {
      id: '7',
      partName: '万达广场地下停车位A001',
      uniqueCode: '350602TCW001A01',
      coordinate: '118.595000,24.915000',
      runStatus: '1', // 异常
      categoryName: '停车位',
      gridName: '丰泽街道网格02',
    },
    {
      id: '8',
      partName: '胜利西路钟楼路口信号灯',
      uniqueCode: '350602JTXHD001',
      coordinate: '118.586500,24.913200',
      runStatus: '1', // 异常
      categoryName: '交通信号灯',
      gridName: '开元街道网格01',
    },
    {
      id: '9',
      partName: '胜利西路路灯002',
      uniqueCode: '350602LD00200002',
      coordinate: '118.586700,24.907800',
      runStatus: '2', // 正常
      categoryName: '路灯',
      gridName: '开元街道网格01',
    },
    {
      id: '10',
      partName: '胜利西路路灯001',
      uniqueCode: '350602LD00100001',
      coordinate: '118.586500,24.907600',
      runStatus: '1', // 异常
      categoryName: '路灯',
      gridName: '开元街道网格01',
    },
  ];
}

/** 部件实例搜索表单配置（专门用于搜索，所属分类使用id进行搜索） */
export function useInstanceSearchFormSchema(treeData = []) {
  return [
    {
      fieldName: 'partName',
      label: '部件名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入部件名称',
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
      fieldName: 'areaName',
      label: '行政区划归属',
      component: 'Input',
      componentProps: {
        placeholder: '请输入行政区划归属',
      },
    },
  ];
}
