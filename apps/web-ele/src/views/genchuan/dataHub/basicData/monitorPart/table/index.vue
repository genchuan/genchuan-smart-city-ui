<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createCategory,
  createInstance,
  deleteBatchCategory,
  deleteCategory,
  deleteInstance,
  exportCategory,
  exportInstance,
  getCategoryPage,
  getInstancePage,
  updateCategory,
  updateInstance,
} from '#/api/genchuan/dataHub/basicData/monitorPart';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';

import BatchUpdateStatusDialog from '../components/BatchUpdateStatusDialog.vue';
import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import RelatedPartDrawer from '../components/RelatedPartDrawer.vue';
import SubmitAuditDialog from '../components/SubmitAuditDialog.vue';
import SubmitCalibrationDrawer from '../components/SubmitCalibrationDrawer.vue';
import {
  detailFields,
  instanceDetailFields,
  instanceTextObj,
  textObj,
  useFormSchema,
  useGridColumns,
  useInstanceFormSchema,
  useInstanceGridColumns,
  useInstanceSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  filterCategoryId: {
    type: String,
    default: '',
  },
  treeData: {
    type: Array,
    default: () => [],
  },
  tabType: {
    type: String,
    default: 'category', // 'category' 或 'instance'
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits([
  'clearFilter',
  'refreshTree',
  'tableDataUpdate',
  'statusChange',
]);
const getTitle = computed(() => {
  const textObjCurrent =
    props.tabType === 'instance' ? instanceTextObj : textObj;
  return formData.value?.id ? textObjCurrent.editText : textObjCurrent.addText;
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
const detailDrawerRef = ref(null);
const formData = ref();

// 新组件引用
const importExcelDialogRef = ref();
const batchUpdateStatusDialogRef = ref();
const submitAuditDialogRef = ref();
const submitCalibrationDrawerRef = ref();
const relatedPartDrawerRef = ref();

// 使用计算属性创建表单schema，根据tabType返回不同的schema
const formSchema = computed(() => {
  if (props.tabType === 'instance') {
    return useInstanceFormSchema(props.treeData);
  }
  return useFormSchema(props.treeData);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: formSchema.value,
  showDefaultActions: false,
});

// 监听treeData和tabType变化，更新表单schema
watch(
  [() => props.treeData, () => props.tabType],
  ([newTreeData, newTabType]) => {
    if (newTreeData && newTreeData.length > 0) {
      // 根据tabType重新设置表单schema
      const newSchema =
        newTabType === 'instance'
          ? useInstanceFormSchema(newTreeData)
          : useFormSchema(newTreeData);
      formApi.setState({ schema: newSchema });
    }
  },
  { deep: true, immediate: true },
);
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const obj = formApi.form.values;
    try {
      const submitData = { ...obj };

      // 处理核心监测指标字段 - 确保以字符串格式提交
      if (submitData.coreIndicators) {
        if (Array.isArray(submitData.coreIndicators)) {
          submitData.coreIndicators = submitData.coreIndicators.join(',');
        }
        // 确保是字符串类型
        submitData.coreIndicators = String(submitData.coreIndicators);
      }

      // 处理时间字段 - 转换为时间戳格式
      const timeFields = ['installTime', 'nextCalibrateTime'];
      timeFields.forEach((field) => {
        if (submitData[field]) {
          const date = new Date(submitData[field]);
          if (!isNaN(date.getTime())) {
            submitData[field] = date.getTime();
          }
        }
      });

      if (props.tabType === 'instance') {
        // 部件实例表单提交
        // 处理所属分类数据 - 根据categoryName（实际存储的是id）查找对应的节点
        if (submitData.categoryName) {
          // 根据categoryName字段存储的id查找对应的节点
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

          const selectedNode = findNode(
            props.treeData,
            submitData.categoryName,
          );
          if (selectedNode) {
            submitData.categoryId = selectedNode.id;
            submitData.categoryName =
              selectedNode.label || selectedNode.categoryName;
          }
        }

        if (
          formDrawerApi.sharedData.payload.title === instanceTextObj.addText
        ) {
          // 新增部件实例
          await createInstance(submitData);
        } else {
          // 编辑部件实例 - 确保带上id值
          await updateInstance({ ...submitData, id: formData.value.id });
        }
        // 接口调用成功
        ElMessage.success('操作成功');
        handleRefresh();
        formDrawerApi.close();
      } else {
        // 分类表单提交
        // 处理上级分类数据
        if (submitData.parentId) {
          // 根据parentId查找对应的节点名称
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

          const selectedNode = findNode(props.treeData, submitData.parentId);
          if (selectedNode) {
            submitData.parentCategory =
              selectedNode.label || selectedNode.categoryName;
          }
        } else {
          submitData.parentId = null;
          submitData.parentCategory = '无';
        }

        if (formDrawerApi.sharedData.payload.title === textObj.addText) {
          // 新增
          await createCategory(submitData);
        } else {
          // 编辑 - 确保带上id值
          await updateCategory({ ...submitData, id: formData.value.id });
        }

        // 接口调用成功
        ElMessage.success('操作成功');
        handleRefresh();
        // 触发左侧树形结构刷新
        emit('refreshTree');
        formDrawerApi.close();
      }
    } catch (error) {
      ElMessage.error('操作失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        // 处理创建时间格式，确保能正确回显
        const formValues = { ...formData.value };
        // 处理时间字段格式
        const timeFields = ['createTime', 'installTime', 'nextCalibrateTime'];
        timeFields.forEach((field) => {
          if (formValues[field]) {
            const date = new Date(formValues[field]);
            if (!isNaN(date.getTime())) {
              formValues[field] = date
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            }
          }
        });
        // 处理核心监测指标字段 - 将字符串转换为数组以便多选组件回显
        if (
          formValues.coreIndicators &&
          typeof formValues.coreIndicators === 'string'
        ) {
          formValues.coreIndicators = formValues.coreIndicators
            .split(',')
            .filter(Boolean);
        }
        // 确保parentId字段存在，用于回显上级分类
        if (formValues.parentId === undefined || formValues.parentId === null) {
          formValues.parentId = null;
        }
        await formApi.setValues(formValues);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  if (props.tabType === 'instance') {
    // 部件实例导出 - 调用接口
    const data = await exportInstance();
    downloadFileFromBlobPart({ fileName: '监测部件实例表.xls', source: data });
  } else {
    // 分类导出
    const data = await exportCategory();
    downloadFileFromBlobPart({ fileName: '监测部件分类表.xls', source: data });
  }
}

/** 创建 */
function handleCreate() {
  const textObjCurrent =
    props.tabType === 'instance' ? instanceTextObj : textObj;
  formDrawerApi
    .setData({
      title: textObjCurrent.addText,
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  const textObjCurrent =
    props.tabType === 'instance' ? instanceTextObj : textObj;
  formDrawerApi
    .setData({
      title: textObjCurrent.editText,
      ...row,
    })
    .open();
}

/** 导入Excel */
function handleImport() {
  importExcelDialogRef.value?.open();
}

/** 批量更新状态 */
function handleBatchUpdateStatus() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  batchUpdateStatusDialogRef.value?.open(checkedIds.value);
}

/** 提交审核 */
function handleSubmitAudit(row) {
  submitAuditDialogRef.value?.open(row);
}

/** 提交校准记录 */
function handleSubmitCalibration(row) {
  submitCalibrationDrawerRef.value?.open(row);
}

/** 查看关联部件 */
function handleViewRelatedPart(row) {
  relatedPartDrawerRef.value?.open(row);
}

async function handleDelete(row) {
  const deleteName = props.tabType === 'instance' ? row.name : row.name;
  try {
    await confirm(`确定删除 "${deleteName}" 吗？`);
  } catch {
    // 用户取消确认，直接返回
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [deleteName]),
  });
  try {
    if (props.tabType === 'instance') {
      // 部件实例删除 - 调用接口
      const id = Number(row.id);
      await deleteInstance(id);
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [deleteName]));
      handleRefresh();
    } else {
      // 分类删除
      // 将id转换为数字类型
      const id = Number(row.id);
      await deleteCategory(id);
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [deleteName]));
      handleRefresh();
      // 触发左侧树形结构刷新
      emit('refreshTree');
    }
  } catch (error) {
    ElMessage.error('删除失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  try {
    await confirm($t('确定删除这些数据吗？'));
  } catch {
    // 用户取消确认，直接返回
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    if (props.tabType === 'instance') {
      // 部件实例批量删除（前端模拟）
      dataObj.list = dataObj.list.filter(
        (item) => !checkedIds.value.includes(item.id),
      );
      checkedIds.value = [];
      ElMessage.success($t('删除成功'));
      handleRefresh();
    } else {
      // 分类批量删除
      // 将id数组转换为数字类型
      const ids = checkedIds.value.map(Number);
      await deleteBatchCategory(ids);
      checkedIds.value = [];
      ElMessage.success($t('删除成功'));
      handleRefresh();
      // 触发左侧树形结构刷新
      emit('refreshTree');
    }
  } catch (error) {
    ElMessage.error('删除失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 标志位：是否跳过统计更新（用于快捷筛选和状态切换时）
const skipStatsUpdate = ref(false);

// 监测部件分类快捷筛选
const filterCategoryCode = ref(''); // 分类代码筛选
const filterParentCategory = ref(''); // 上级分类筛选
const filterCategoryType = ref(''); // 分类类型筛选

// 监测部件实例快捷筛选
const filterUniqueCode = ref(''); // 18位标识码筛选
const filterInstanceCategoryName = ref(''); // 所属分类筛选
const filterGridName = ref(''); // 所在网格筛选

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  statistics: {
    totalCategories: 0,
    totalInstances: 0,
    auditedCount: 0,
  },
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 监听 filterCategoryId 和 tabType 变化，刷新表格
watch([() => props.filterCategoryId, () => props.tabType], () => {
  handleRefresh();
  // 重新初始化状态计数
  initStatusCounts();
});

// 组件挂载时初始化状态计数
onMounted(() => {
  initStatusCounts();
});

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  // 更新分页参数
  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;

  try {
    if (props.tabType === 'instance') {
      // 监测部件实例数据（API接口）
      // 根据字典标签获取对应的字典值
      let runStatusValue = '';
      if (activeName.value !== '全部') {
        const dictOptions = getDictOptions(DICT_TYPE.DATA_RUN_STATUS, 'string');
        const selectedOption = dictOptions.find(
          (opt) => opt.label === activeName.value,
        );
        runStatusValue = selectedOption ? selectedOption.value : '';
      }

      // 构建查询参数
      const queryParams = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        runStatus: runStatusValue,
        uniqueCode: filterUniqueCode.value,
        categoryName: filterInstanceCategoryName.value,
        gridName: filterGridName.value,
        ...dataObj.searchParams,
      };

      // 添加树形查询参数
      if (props.filterCategoryId) {
        queryParams.treeParentId = props.filterCategoryId;
        queryParams.includeSelf = true;
      }

      const response = await getInstancePage(queryParams);
      if (response) {
        // 根据标志位决定是否更新统计数据（表格下方统计区）
        if (!skipStatsUpdate.value) {
          dataObj.total = response.total;
        }
        // 适配数据格式
        dataObj.list = response.list.map((item) => ({
          ...item,
          id: String(item.id), // 转换为字符串
          createTime: item.createTime
            ? new Date(item.createTime).toLocaleString('zh-CN')
            : '', // 转换时间格式
          installTime: item.installTime
            ? new Date(item.installTime).toLocaleString('zh-CN')
            : '', // 转换安装时间
          nextCalibrateTime: item.nextCalibrateTime
            ? new Date(item.nextCalibrateTime).toLocaleString('zh-CN')
            : '', // 转换下次校准时间
          creator: item.creator || '', // 处理缺失字段
        }));

        // 根据标志位决定是否更新统计数据（表格下方统计区）
        if (!skipStatsUpdate.value) {
          // 计算统计信息 - 使用接口返回的统计数据
          dataObj.statistics.totalCategories = dataObj.total;
          dataObj.statistics.totalInstances = dataObj.list.length;
        }

        // 触发表格数据更新事件，用于统计组件
        if (props.tabType === 'instance') {
          emit('tableDataUpdate', response.list);
        }
      } else {
        ElMessage.error(response.message || '获取数据失败');
      }
    } else {
      // 监测部件分类数据（API接口）
      // 根据字典标签获取对应的字典值
      let statusValue = '';
      if (activeName.value !== '全部') {
        const dictOptions = getDictOptions(
          DICT_TYPE.DATA_ENABLE_STATUS,
          'string',
        );
        const selectedOption = dictOptions.find(
          (opt) => opt.label === activeName.value,
        );
        statusValue = selectedOption ? selectedOption.value : '';
      }

      // 构建查询参数
      const queryParams = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        status: statusValue,
        categoryCode: filterCategoryCode.value,
        parentCategory: filterParentCategory.value,
        categoryType: filterCategoryType.value,
        ...dataObj.searchParams,
      };

      // 添加树形查询参数
      if (props.filterCategoryId) {
        queryParams.treeParentId = props.filterCategoryId;
        queryParams.includeSelf = true;
      }

      const response = await getCategoryPage(queryParams);
      if (response) {
        // 根据标志位决定是否更新统计数据
        if (!skipStatsUpdate.value) {
          dataObj.total = response.total;
        }
        // 适配数据格式
        dataObj.list = response.list.map((item) => ({
          ...item,
          id: String(item.id), // 转换为字符串
          parentId: item.parentId ? String(item.parentId) : null,
          instanceCount: String(item.instanceCount), // 转换为字符串
          createTime: item.createTime
            ? new Date(item.createTime).toLocaleString('zh-CN')
            : '', // 转换时间格式
          creator: item.creator || '', // 处理缺失字段
        }));

        // 根据标志位决定是否更新统计数据
        if (!skipStatsUpdate.value) {
          // 计算统计信息
          dataObj.statistics.totalCategories = dataObj.total;
          dataObj.statistics.totalInstances = dataObj.list.reduce(
            (sum, item) => sum + Number(item.instanceCount || 0),
            0,
          );
        }
      } else {
        ElMessage.error(response.message || '获取数据失败');
      }
    }
  } catch (error) {
    ElMessage.error('获取数据失败');
    console.error(error);
  }

  return dataObj;
};

// 使用计算属性创建搜索表单schema，根据tabType返回不同的schema
const queryFormSchema = computed(() => {
  const schema =
    props.tabType === 'instance'
      ? useInstanceSearchFormSchema(props.treeData)
      : useFormSchema(props.treeData);
  return schema.map((v) => {
    delete v.rules;
    return { ...v };
  });
});

const [QueryForm, queryFormApi] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: queryFormSchema.value,
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 监听treeData和tabType变化，更新搜索表单schema
watch(
  [() => props.treeData, () => props.tabType],
  ([newTreeData, newTabType]) => {
    if (newTreeData && newTreeData.length > 0) {
      // 根据tabType重新设置搜索表单schema
      const newSchema = (
        newTabType === 'instance'
          ? useInstanceSearchFormSchema(newTreeData)
          : useFormSchema(newTreeData)
      ).map((v) => {
        delete v.rules;
        return { ...v };
      });
      queryFormApi.setState({ schema: newSchema });
    }
  },
  { deep: true, immediate: true },
);

// 搜索表单查询
function onSubmit(values) {
  // 处理搜索参数
  const searchParams = { ...values };
  // 如果上级分类为空，确保parentId为null
  if (!searchParams.parentId) {
    searchParams.parentId = null;
  }
  // 处理部件实例搜索时的所属分类参数
  if (props.tabType === 'instance' && searchParams.categoryId) {
    // 将categoryId转换为categoryName进行搜索
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

    const selectedNode = findNode(props.treeData, searchParams.categoryId);
    if (selectedNode) {
      searchParams.categoryName =
        selectedNode.label || selectedNode.categoryName;
    }
    delete searchParams.categoryId;
  }
  dataObj.searchParams = searchParams;
  handleRefresh();
  drawerApi.close();
}

// 根据tabType获取对应的列配置
const getGridColumns = () => {
  return props.tabType === 'instance'
    ? useInstanceGridColumns()
    : useGridColumns();
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// 监听tabType变化，更新表格列
watch(
  () => props.tabType,
  (newTabType) => {
    const newColumns =
      newTabType === 'instance' ? useInstanceGridColumns() : useGridColumns();
    gridApi.setGridOptions({ columns: newColumns });
    // 刷新表格数据
    handleRefresh();
  },
  { immediate: true },
);

const activeName = ref('全部');

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  } else {
    console.error('DetailDrawer组件未初始化');
  }
};

// 处理快捷筛选（不更新统计数据）
const handleQuickFilter = (filterFn) => {
  skipStatsUpdate.value = true;
  filterFn();
  // 使用setTimeout确保在query完成后重置标志
  setTimeout(() => {
    skipStatsUpdate.value = false;
  }, 100);
};

// 获取树形节点label值
const getTreeNodeLabel = (nodeId) => {
  if (!nodeId || !props.treeData || props.treeData.length === 0) {
    return '未知分类';
  }

  // 递归查找节点
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

  const node = findNode(props.treeData, nodeId);
  return node?.label || node?.categoryName || '未知分类';
};

// 存储全部数据的状态统计 - 用于三级状态显示
const allDataStatusCounts = reactive({
  total: 0,
  // 使用对象存储每个状态的数量
  statusMap: {},
});

// tabsData根据tabType显示不同的标签
const tabsData = computed(() => {
  if (props.tabType === 'instance') {
    // 监测部件实例使用 DATA_MANAGEPART_RUNSTATUS 字典
    // 动态获取字典选项作为三级状态标签
    const dictOptions = getDictOptions(DICT_TYPE.DATA_RUN_STATUS, 'string');
    const tabs = [{ label: '全部' }];
    dictOptions.forEach((opt) => {
      tabs.push({ label: opt.label, value: opt.value });
    });
    return tabs;
  } else {
    // 监测部件分类使用 DATA_ENABLE_STATUS 字典
    const dictOptions = getDictOptions(DICT_TYPE.DATA_ENABLE_STATUS, 'string');
    const tabs = [{ label: '全部' }];
    dictOptions.forEach((opt) => {
      tabs.push({ label: opt.label, value: opt.value });
    });
    return tabs;
  }
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (item.label === '全部') {
    count = allDataStatusCounts.total;
  } else {
    // 从全部数据统计中获取该状态的数量
    count = allDataStatusCounts.statusMap[item.label] || 0;
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  // 切换三级状态值时，不更新统计区
  skipStatsUpdate.value = true;
  // 触发状态变化事件
  emit('statusChange', activeName.value);
  gridApi.query();
  // 使用setTimeout确保在query完成后重置标志
  setTimeout(() => {
    skipStatsUpdate.value = false;
  }, 100);
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 初始化状态计数
const initStatusCounts = async () => {
  try {
    if (props.tabType === 'instance') {
      // 监测部件实例状态统计 - 使用 DATA_MANAGEPART_RUNSTATUS 字典
      const response = await getInstancePage({
        pageNo: 1,
        pageSize: 100, // 设置一个较大的值，确保获取所有数据
        runStatus: '',
        treeParentId: props.filterCategoryId,
        includeSelf: props.filterCategoryId ? true : undefined,
        ...dataObj.searchParams,
      });
      if (response && response.list) {
        const allData = response.list;
        // 更新全部数据的状态统计 - 用于三级状态显示
        allDataStatusCounts.total = response.total;
        allDataStatusCounts.statusMap = {};
        // 动态统计每个字典值的数量
        allData.forEach((item) => {
          const dict = getDictObj(
            DICT_TYPE.DATA_RUN_STATUS,
            String(item.runStatus),
          );
          if (dict && dict.label) {
            // 根据字典标签累加数量
            allDataStatusCounts.statusMap[dict.label] =
              (allDataStatusCounts.statusMap[dict.label] || 0) + 1;
          }
        });
      }
    } else {
      // 监测部件分类状态统计 - 使用 DATA_ENABLE_STATUS 字典
      const response = await getCategoryPage({
        pageNo: 1,
        pageSize: 100, // 设置一个较大的值，确保获取所有数据
        status: '',
        treeParentId: props.filterCategoryId,
        includeSelf: props.filterCategoryId ? true : undefined,
        ...dataObj.searchParams,
      });
      if (response && response.list) {
        const allData = response.list;
        // 更新全部数据的状态统计 - 用于三级状态显示
        allDataStatusCounts.total = response.total;
        allDataStatusCounts.statusMap = {};
        // 动态统计每个字典值的数量
        allData.forEach((item) => {
          const dict = getDictObj(
            DICT_TYPE.DATA_ENABLE_STATUS,
            String(item.status),
          );
          if (dict && dict.label) {
            // 根据字典标签累加数量
            allDataStatusCounts.statusMap[dict.label] =
              (allDataStatusCounts.statusMap[dict.label] || 0) + 1;
          }
        });
      }
    }
  } catch (error) {
    console.error('初始化状态计数失败:', error);
  }
};

// 获取状态显示文本
const getStatusText = (status) => {
  // 使用字典获取状态显示文本
  const dictType =
    props.tabType === 'instance'
      ? DICT_TYPE.DATA_RUN_STATUS
      : DICT_TYPE.DATA_ENABLE_STATUS;
  const dict = getDictObj(dictType, String(status));
  return dict ? dict.label : status;
};

// 获取状态标签类型
const getStatusType = (status) => {
  // 使用字典获取状态标签类型
  const dictType =
    props.tabType === 'instance'
      ? DICT_TYPE.DATA_RUN_STATUS
      : DICT_TYPE.DATA_ENABLE_STATUS;
  const dict = getDictObj(dictType, String(status));
  return dict ? dict.colorType : 'info';
};

// 获取审核状态标签类型
const getAuditStatusType = (auditStatus) => {
  // 使用字典获取审核状态标签类型
  const dict = getDictObj(DICT_TYPE.DATA_AUDIT_STATUS, String(auditStatus));
  return dict ? dict.colorType : 'info';
};

// 获取核心监测指标标签列表
const getCoreIndicatorsTags = (value) => {
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
  return indicators.map((indicator) => {
    const dict = getDictObj(DICT_TYPE.DATA_CORE_INDICATORS, String(indicator));
    const rawType = dict ? dict.colorType : 'primary';
    return {
      label: dict ? dict.label : indicator,
      type: colorTypeMap[rawType] || rawType || 'primary',
    };
  });
};

// 处理分类代码点击
const handleCategoryCodeClick = (categoryCode) => {
  handleQuickFilter(() => {
    filterCategoryCode.value =
      filterCategoryCode.value === categoryCode ? '' : categoryCode;
    gridApi.query();
  });
};

/** 取消分类代码筛选 */
const handleCancelCategoryCodeFilter = () => {
  handleQuickFilter(() => {
    filterCategoryCode.value = '';
    gridApi.query();
  });
};

// 处理上级分类点击
const handleParentCategoryClick = (parentCategory) => {
  handleQuickFilter(() => {
    filterParentCategory.value =
      filterParentCategory.value === parentCategory ? '' : parentCategory;
    gridApi.query();
  });
};

/** 取消上级分类筛选 */
const handleCancelParentCategoryFilter = () => {
  handleQuickFilter(() => {
    filterParentCategory.value = '';
    gridApi.query();
  });
};

// 处理分类类型点击
const handleCategoryTypeClick = (categoryType) => {
  handleQuickFilter(() => {
    filterCategoryType.value =
      filterCategoryType.value === categoryType ? '' : categoryType;
    gridApi.query();
  });
};

/** 获取分类类型颜色 - 将字典颜色映射到 Element Plus 支持的类型 */
const getCategoryTypeColor = (categoryType) => {
  const dict = getDictObj(DICT_TYPE.DATA_CATEGORY_TYPE, String(categoryType));
  const colorType = dict?.colorType;
  // 将字典颜色映射到 Element Plus 支持的类型
  switch (colorType) {
    case 'blue': {
      return 'primary';
    }
    case 'gray':
    case 'grey': {
      return 'info';
    }
    case 'green': {
      return 'success';
    }
    case 'orange': {
      return 'warning';
    }
    case 'red': {
      return 'danger';
    }
    default: {
      return colorType || 'primary';
    }
  }
};

/** 取消分类类型筛选 */
const handleCancelCategoryTypeFilter = () => {
  handleQuickFilter(() => {
    filterCategoryType.value = '';
    gridApi.query();
  });
};

// 处理18位标识码点击
const handleUniqueCodeClick = (uniqueCode) => {
  handleQuickFilter(() => {
    filterUniqueCode.value =
      filterUniqueCode.value === uniqueCode ? '' : uniqueCode;
    gridApi.query();
  });
};

/** 取消18位标识码筛选 */
const handleCancelUniqueCodeFilter = () => {
  handleQuickFilter(() => {
    filterUniqueCode.value = '';
    gridApi.query();
  });
};

// 处理所属分类点击
const handleInstanceCategoryNameClick = (categoryName) => {
  handleQuickFilter(() => {
    filterInstanceCategoryName.value =
      filterInstanceCategoryName.value === categoryName ? '' : categoryName;
    gridApi.query();
  });
};

/** 取消所属分类筛选 */
const handleCancelInstanceCategoryNameFilter = () => {
  handleQuickFilter(() => {
    filterInstanceCategoryName.value = '';
    gridApi.query();
  });
};

// 处理所在网格点击
const handleGridNameClick = (gridName) => {
  handleQuickFilter(() => {
    filterGridName.value = filterGridName.value === gridName ? '' : gridName;
    gridApi.query();
  });
};

/** 取消所在网格筛选 */
const handleCancelGridNameFilter = () => {
  handleQuickFilter(() => {
    filterGridName.value = '';
    gridApi.query();
  });
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="
        props.tabType === 'instance'
          ? `${dataObj.detailObj?.name || '监测部件实例'}详情`
          : `${dataObj.detailObj?.name || '监测部件分类'}详情`
      "
      :data="dataObj.detailObj"
      :fields="
        props.tabType === 'instance' ? instanceDetailFields : detailFields
      "
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid :key="props.tabType">
      <!-- 三级状态 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
          <!-- 树形结构筛选标签 -->
          <ElTag
            v-if="props.filterCategoryId"
            type="primary"
            closable
            @close="emit('clearFilter')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            分类：{{ getTreeNodeLabel(props.filterCategoryId) }}
          </ElTag>
          <!-- 监测部件分类快捷筛选标签 -->
          <template v-if="props.tabType !== 'instance'">
            <!-- 分类代码筛选标签 -->
            <ElTag
              v-if="filterCategoryCode"
              type="primary"
              closable
              @close="handleCancelCategoryCodeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              分类代码：{{ filterCategoryCode }}
            </ElTag>
            <!-- 上级分类筛选标签 -->
            <ElTag
              v-if="filterParentCategory"
              type="success"
              closable
              @close="handleCancelParentCategoryFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              上级分类：{{ filterParentCategory }}
            </ElTag>
            <!-- 分类类型筛选标签 -->
            <ElTag
              v-if="filterCategoryType"
              type="warning"
              closable
              @close="handleCancelCategoryTypeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              分类类型：{{
                getDictObj(
                  DICT_TYPE.DATA_CATEGORY_TYPE,
                  String(filterCategoryType),
                )?.label || filterCategoryType
              }}
            </ElTag>
          </template>
          <!-- 监测部件实例快捷筛选标签 -->
          <template v-if="props.tabType === 'instance'">
            <!-- 18位标识码筛选标签 -->
            <ElTag
              v-if="filterUniqueCode"
              type="primary"
              closable
              @close="handleCancelUniqueCodeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              18位标识码：{{ filterUniqueCode }}
            </ElTag>
            <!-- 所属分类筛选标签 -->
            <ElTag
              v-if="filterInstanceCategoryName"
              type="success"
              closable
              @close="handleCancelInstanceCategoryNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              所属分类：{{ filterInstanceCategoryName }}
            </ElTag>
            <!-- 所在网格筛选标签 -->
            <ElTag
              v-if="filterGridName"
              type="warning"
              closable
              @close="handleCancelGridNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              所在网格：{{ filterGridName }}
            </ElTag>
          </template>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <!-- 仅在监测部件实例标签页显示导入按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="导入"
            icon-name="Upload"
            @click="handleImport"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <!-- 仅在监测部件实例标签页显示批量更新状态按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="批量更新状态"
            icon-name="Refresh"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchUpdateStatus"
          />
          <!-- 仅在监测部件分类标签页显示批量删除按钮 -->
          <IconButton
            v-if="props.tabType !== 'instance'"
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <!-- 仅在监测部件实例标签页显示统计切换按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #name="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 核心监测指标插槽 -->
      <template #coreIndicators="{ row }">
        <div class="core-indicators-tags">
          <ElTag
            v-for="(tag, index) in getCoreIndicatorsTags(row.coreIndicators)"
            :key="index"
            :type="tag.type"
            size="small"
            style="margin-right: 4px; margin-bottom: 2px"
          >
            {{ tag.label }}
          </ElTag>
        </div>
      </template>
      <!-- 分类代码插槽 -->
      <template #categoryCode="{ row }">
        <el-text
          @click="handleCategoryCodeClick(row.categoryCode)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.categoryCode }}
        </el-text>
      </template>
      <!-- 上级分类插槽 -->
      <template #parentCategory="{ row }">
        <el-text
          @click="handleParentCategoryClick(row.parentCategory)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.parentCategory }}
        </el-text>
      </template>
      <!-- 分类类型插槽 -->
      <template #categoryType="{ row }">
        <ElTag
          @click="handleCategoryTypeClick(row.categoryType)"
          :type="getCategoryTypeColor(row.categoryType)"
          style="cursor: pointer"
        >
          {{
            getDictObj(DICT_TYPE.DATA_CATEGORY_TYPE, String(row.categoryType))
              ?.label || row.categoryType
          }}
        </ElTag>
      </template>
      <!-- 18位标识码插槽 -->
      <template #uniqueCode="{ row }">
        <el-text
          @click="handleUniqueCodeClick(row.uniqueCode)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.uniqueCode }}
        </el-text>
      </template>
      <!-- 所属分类插槽 -->
      <template #instanceCategoryName="{ row }">
        <el-text
          @click="handleInstanceCategoryNameClick(row.categoryName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.categoryName }}
        </el-text>
      </template>
      <!-- 所在网格插槽 -->
      <template #gridName="{ row }">
        <el-text
          @click="handleGridNameClick(row.gridName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.gridName }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <!-- 监测部件分类：提交审核按钮 - 仅扩展类且未审核的可操作 -->
          <IconButton
            v-if="
              props.tabType !== 'instance' &&
              row.categoryType === '2' &&
              row.auditStatus === '3'
            "
            content="提交审核"
            icon-name="Position"
            @click="handleSubmitAudit(row)"
          />
          <!-- 监测部件实例：提交校准记录按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="提交校准记录"
            icon-name="Pointer"
            @click="handleSubmitCalibration(row)"
          />
          <!-- 监测部件实例：查看关联部件按钮 -->
          <IconButton
            v-if="props.tabType === 'instance' && row.relatedPartName"
            content="查看关联部件"
            icon-name="Link"
            @click="handleViewRelatedPart(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span v-if="props.tabType === 'instance'">
            本页统计：监测部件实例数量: {{ dataObj.list.length }}
          </span>
          <span v-else>
            本页统计：监测部件分类数量: {{ dataObj.list.length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span v-if="props.tabType === 'instance'">
            全部统计：总计: 监测部件实例数量{{ dataObj.total }}
          </span>
          <span v-else> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
    <!-- 导入Excel弹窗 -->
    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />
    <!-- 批量更新状态弹窗 -->
    <BatchUpdateStatusDialog
      ref="batchUpdateStatusDialogRef"
      @success="handleRefresh"
    />
    <!-- 提交审核弹窗 -->
    <SubmitAuditDialog ref="submitAuditDialogRef" @success="handleRefresh" />
    <!-- 提交校准记录抽屉 -->
    <SubmitCalibrationDrawer
      ref="submitCalibrationDrawerRef"
      @success="handleRefresh"
    />
    <!-- 查看关联部件抽屉 -->
    <RelatedPartDrawer ref="relatedPartDrawerRef" />
  </div>
</template>
