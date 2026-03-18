<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';

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
} from '#/api/genchuan/dataHub/basicData/sceneCategory';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';

import BatchUpdateStatusDialog from '../components/BatchUpdateStatusDialog.vue';
import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import SubmitAuditDialog from '../components/SubmitAuditDialog.vue';
import ViewRelatedDataDrawer from '../components/ViewRelatedDataDrawer.vue';
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
    default: 'category',
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

const emit = defineEmits(['clearFilter', 'refreshTree', 'update:tableData', 'status-change']);

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

// 组件引用
const importExcelDialogRef = ref();
const batchUpdateStatusDialogRef = ref();
const submitAuditDialogRef = ref();
const viewRelatedDataDrawerRef = ref();

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

      if (props.tabType === 'instance') {
        // 应用场景实例表单提交
        if (submitData.categoryName) {
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

        await (formDrawerApi.sharedData.payload.title ===
        instanceTextObj.addText
          ? createInstance(submitData)
          : updateInstance({ ...submitData, id: formData.value.id }));
        ElMessage.success('操作成功');
        handleRefresh();
        formDrawerApi.close();
      } else {
        // 分类表单提交
        if (submitData.parentId) {
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

        await (formDrawerApi.sharedData.payload.title === textObj.addText
          ? createCategory(submitData)
          : updateCategory({ ...submitData, id: formData.value.id }));

        ElMessage.success('操作成功');
        handleRefresh();
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
        const formValues = { ...formData.value };
        if (formValues.createTime) {
          const date = new Date(formValues.createTime);
          if (!isNaN(date.getTime())) {
            formValues.createTime = date
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ');
          }
        }
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
  if (gridApi && typeof gridApi.query === 'function') {
    gridApi.query();
  }
  initStatusCounts();
}

/** 导出表格 */
async function handleExport() {
  if (props.tabType === 'instance') {
    const data = await exportInstance();
    downloadFileFromBlobPart({ fileName: '应用场景实例表.xls', source: data });
  } else {
    const data = await exportCategory();
    downloadFileFromBlobPart({ fileName: '应用场景分类表.xls', source: data });
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

/** 提交审核 - 仅扩展类未审核分类可操作 */
function handleSubmitAudit(row) {
  // 检查是否为扩展类且未审核
  const categoryType = row.categoryType;
  const auditStatus = row.auditStatus;

  // 获取分类类型的字典标签
  const categoryTypeDict = getDictObj(
    DICT_TYPE.DATA_CATEGORY_TYPE,
    String(categoryType),
  );
  const categoryTypeLabel = categoryTypeDict?.label || categoryType;

  // 获取审核状态的字典标签
  const auditStatusDict = getDictObj(
    DICT_TYPE.DATA_AUDIT_STATUS,
    String(auditStatus),
  );
  const auditStatusLabel = auditStatusDict?.label || auditStatus;

  // 仅扩展类未审核分类可操作
  if (categoryTypeLabel !== '扩展类') {
    ElMessage.warning('仅扩展类分类可提交审核');
    return;
  }

  if (
    auditStatusLabel !== '未审核' &&
    auditStatus !== '3' &&
    auditStatus !== ''
  ) {
    ElMessage.warning('该分类已提交审核或审核已通过');
    return;
  }

  submitAuditDialogRef.value?.open(row);
}

/** 查看关联数据 */
function handleViewRelatedData(row) {
  viewRelatedDataDrawerRef.value?.open(row);
}

async function handleDelete(row) {
  const deleteName =
    props.tabType === 'instance' ? row.sceneName : row.categoryName;
  try {
    await confirm(`确定删除 "${deleteName}" 吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [deleteName]),
  });
  try {
    if (props.tabType === 'instance') {
      const id = Number(row.id);
      await deleteInstance(id);
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [deleteName]));
      handleRefresh();
    } else {
      const id = Number(row.id);
      await deleteCategory(id);
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [deleteName]));
      handleRefresh();
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
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    if (props.tabType === 'instance') {
      // 应用场景实例批量删除
      for (const id of checkedIds.value) {
        await deleteInstance(Number(id));
      }
      checkedIds.value = [];
      ElMessage.success($t('删除成功'));
      handleRefresh();
    } else {
      // 分类批量删除
      const ids = checkedIds.value.map(Number);
      await deleteBatchCategory(ids);
      checkedIds.value = [];
      ElMessage.success($t('删除成功'));
      handleRefresh();
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

// 标志位：是否跳过统计更新
const skipStatsUpdate = ref(false);

// 存储全部数据的状态统计 - 用于三级状态显示
const allDataStatusCounts = reactive({
  total: 0,
  statusMap: {},
});

// 应用场景分类快捷筛选
const filterCategoryCode = ref(''); // 分类代码筛选
const filterParentCategory = ref(''); // 上级分类筛选
const filterApplicableArea = ref(''); // 适用区域筛选
const filterDataType = ref(''); // 关联数据类型筛选
const filterCategoryType = ref(''); // 分类类型筛选

// 应用场景实例快捷筛选
const filterSceneCode = ref(''); // 场景编码筛选
const filterInstanceCategoryName = ref(''); // 关联分类筛选
const filterGridName = ref(''); // 所在网格筛选
const filterManager = ref(''); // 负责人筛选

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
  },
  statusCounts: {
    total: 0,
    enabled: 0,
    disabled: 0,
  },
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 初始化状态计数
const initStatusCounts = async () => {
  try {
    if (props.tabType === 'instance') {
      const response = await getInstancePage({
        pageNo: 1,
        pageSize: 100,
        status: '',
        treeParentId: props.filterCategoryId,
        includeSelf: props.filterCategoryId ? true : undefined,
        ...dataObj.searchParams,
      });
      if (response && response.list) {
        const allData = response.list;
        dataObj.statusCounts.total = response.total;
        allDataStatusCounts.total = response.total;
        allDataStatusCounts.statusMap = {};
        allData.forEach((item) => {
          const dict = getDictObj(
            DICT_TYPE.DATA_ENABLE_STATUS,
            String(item.status),
          );
          if (dict && dict.label) {
            allDataStatusCounts.statusMap[dict.label] =
              (allDataStatusCounts.statusMap[dict.label] || 0) + 1;
          }
        });
      }
    } else {
      const response = await getCategoryPage({
        pageNo: 1,
        pageSize: 100,
        status: '',
        treeParentId: props.filterCategoryId,
        includeSelf: props.filterCategoryId ? true : undefined,
        ...dataObj.searchParams,
      });
      if (response && response.list) {
        const allData = response.list;
        dataObj.statusCounts.total = response.total;
        allDataStatusCounts.total = response.total;
        allDataStatusCounts.statusMap = {};
        allData.forEach((item) => {
          const dict = getDictObj(
            DICT_TYPE.DATA_ENABLE_STATUS,
            String(item.status),
          );
          if (dict && dict.label) {
            allDataStatusCounts.statusMap[dict.label] =
              (allDataStatusCounts.statusMap[dict.label] || 0) + 1;
          }
        });
        dataObj.statusCounts.enabled =
          allDataStatusCounts.statusMap['启用'] || 0;
        dataObj.statusCounts.disabled =
          allDataStatusCounts.statusMap['禁用'] || 0;
      }
    }
  } catch (error) {
    console.error('初始化状态计数失败:', error);
  }
};

// 监听 filterCategoryId 和 tabType 变化，刷新表格
watch([() => props.filterCategoryId, () => props.tabType], () => {
  nextTick(() => {
    handleRefresh();
    initStatusCounts();
  });
});

// 组件挂载时初始化状态计数
onMounted(() => {
  initStatusCounts();
});

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;

  try {
    if (props.tabType === 'instance') {
      // 应用场景实例数据
      let statusValue = '';
      if (activeName.value !== '全部') {
        const dictOptions = getDictOptions(
          DICT_TYPE.DATA_ENABLE_STATUS,
          'string',
        );
        const found = dictOptions.find((opt) => opt.label === activeName.value);
        statusValue = found ? found.value : '';
      }

      const queryParams = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        status: statusValue,
        sceneCode: filterSceneCode.value,
        categoryName: filterInstanceCategoryName.value,
        gridName: filterGridName.value,
        manager: filterManager.value,
        ...dataObj.searchParams,
      };

      if (props.filterCategoryId) {
        queryParams.treeParentId = props.filterCategoryId;
        queryParams.includeSelf = true;
      }

      const response = await getInstancePage(queryParams);
      if (response) {
        dataObj.total = response.total;
        dataObj.list = response.list.map((item) => ({
          ...item,
          id: String(item.id),
          createTime: item.createTime
            ? new Date(item.createTime).toLocaleString('zh-CN')
            : '',
          creator: item.creator || '',
          // 处理启用/停用时间时间戳
          statusTime: item.statusTime
            ? new Date(Number(item.statusTime)).toLocaleString('zh-CN')
            : '',
        }));

        dataObj.statistics.totalInstances = dataObj.total;

        emit('update:tableData', response.list);
      } else {
        ElMessage.error(response.message || '获取数据失败');
      }
    } else {
      // 分类数据
      let statusValue = '';
      if (activeName.value !== '全部') {
        const dictOptions = getDictOptions(
          DICT_TYPE.DATA_ENABLE_STATUS,
          'string',
        );
        const found = dictOptions.find((opt) => opt.label === activeName.value);
        statusValue = found ? found.value : '';
      }

      const queryParams = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        status: statusValue,
        categoryCode: filterCategoryCode.value,
        parentCategory: filterParentCategory.value,
        applicableArea: filterApplicableArea.value,
        dataType: filterDataType.value,
        categoryType: filterCategoryType.value,
        ...dataObj.searchParams,
      };

      if (props.filterCategoryId) {
        queryParams.treeParentId = props.filterCategoryId;
        queryParams.includeSelf = true;
      }

      const response = await getCategoryPage(queryParams);
      if (response) {
        dataObj.total = response.total;
        dataObj.list = response.list.map((item) => ({
          ...item,
          id: String(item.id),
          parentId: item.parentId ? String(item.parentId) : null,
          createTime: item.createTime
            ? new Date(item.createTime).toLocaleString('zh-CN')
            : '',
          creator: item.creator || '',
        }));

        dataObj.statistics.totalCategories = dataObj.total;
        dataObj.statusCounts.total = dataObj.total;
        dataObj.statusCounts.enabled = dataObj.list.filter((item) => {
          const dict = getDictObj(
            DICT_TYPE.DATA_ENABLE_STATUS,
            String(item.status),
          );
          return dict?.label === '启用';
        }).length;
        dataObj.statusCounts.disabled = dataObj.list.filter((item) => {
          const dict = getDictObj(
            DICT_TYPE.DATA_ENABLE_STATUS,
            String(item.status),
          );
          return dict?.label === '禁用';
        }).length;
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
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: queryFormSchema.value,
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
  const searchParams = { ...values };
  if (!searchParams.parentId) {
    searchParams.parentId = null;
  }
  if (props.tabType === 'instance' && searchParams.categoryId) {
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

// 处理快捷筛选（不更新统计数据）
const handleQuickFilter = (filterFn) => {
  skipStatsUpdate.value = true;
  filterFn();
  setTimeout(() => {
    skipStatsUpdate.value = false;
  }, 100);
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

// 处理适用区域点击
const handleApplicableAreaClick = (applicableArea) => {
  handleQuickFilter(() => {
    filterApplicableArea.value =
      filterApplicableArea.value === applicableArea ? '' : applicableArea;
    gridApi.query();
  });
};

/** 取消适用区域筛选 */
const handleCancelApplicableAreaFilter = () => {
  handleQuickFilter(() => {
    filterApplicableArea.value = '';
    gridApi.query();
  });
};

// 处理关联数据类型点击
const handleDataTypeClick = (dataType) => {
  handleQuickFilter(() => {
    filterDataType.value = filterDataType.value === dataType ? '' : dataType;
    gridApi.query();
  });
};

/** 取消关联数据类型筛选 */
const handleCancelDataTypeFilter = () => {
  handleQuickFilter(() => {
    filterDataType.value = '';
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

/** 取消分类类型筛选 */
const handleCancelCategoryTypeFilter = () => {
  handleQuickFilter(() => {
    filterCategoryType.value = '';
    gridApi.query();
  });
};

// 处理场景编码点击
const handleSceneCodeClick = (sceneCode) => {
  handleQuickFilter(() => {
    filterSceneCode.value =
      filterSceneCode.value === sceneCode ? '' : sceneCode;
    gridApi.query();
  });
};

/** 取消场景编码筛选 */
const handleCancelSceneCodeFilter = () => {
  handleQuickFilter(() => {
    filterSceneCode.value = '';
    gridApi.query();
  });
};

// 处理关联分类点击（实例）
const handleInstanceCategoryNameClick = (categoryName) => {
  handleQuickFilter(() => {
    filterInstanceCategoryName.value =
      filterInstanceCategoryName.value === categoryName ? '' : categoryName;
    gridApi.query();
  });
};

/** 取消关联分类筛选（实例） */
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

// 处理负责人点击
const handleManagerClick = (manager) => {
  handleQuickFilter(() => {
    filterManager.value = filterManager.value === manager ? '' : manager;
    gridApi.query();
  });
};

/** 取消负责人筛选 */
const handleCancelManagerFilter = () => {
  handleQuickFilter(() => {
    filterManager.value = '';
    gridApi.query();
  });
};

/** 获取关联数据类型的Tag类型 - 将字典颜色映射到Element Plus支持的颜色类型 */
const getDataTypeTagType = (dataType) => {
  const dict = getDictObj(DICT_TYPE.DATA_TYPE, String(dataType));
  const colorType = dict?.colorType || 'primary';

  // 颜色类型映射 - 将后端的颜色类型映射到Element Plus支持的颜色类型
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

  return colorTypeMap[colorType] || colorType || 'primary';
};

/** 获取分类类型的Tag类型 - 将字典颜色映射到Element Plus支持的颜色类型 */
const getCategoryTypeTagType = (categoryType) => {
  const dict = getDictObj(DICT_TYPE.DATA_CATEGORY_TYPE, String(categoryType));
  const colorType = dict?.colorType || 'primary';

  // 颜色类型映射 - 将后端的颜色类型映射到Element Plus支持的颜色类型
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

  return colorTypeMap[colorType] || colorType || 'primary';
};

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
    nextTick(() => {
      handleRefresh();
    });
  },
  { immediate: true },
);

const activeName = ref('全部');

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

// 获取树形节点label值
const getTreeNodeLabel = (nodeId) => {
  if (!nodeId || !props.treeData || props.treeData.length === 0) {
    return '未知分类';
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

  const node = findNode(props.treeData, nodeId);
  return node?.label || node?.categoryName || '未知分类';
};

// tabsData根据tabType显示不同的标签
const tabsData = computed(() => {
  return [{ label: '全部' }, { label: '启用' }, { label: '禁用' }];
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  count =
    item.label === '全部'
      ? allDataStatusCounts.total
      : allDataStatusCounts.statusMap[item.label] || 0;

  return `${item.label}(${count})`;
};

const handleClick = () => {
  skipStatsUpdate.value = true;
  // 发射status-change事件通知父组件
  emit('status-change');
  gridApi.query();
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
          ? `${dataObj.detailObj?.sceneName || '场景'}详情`
          : `${dataObj.detailObj?.categoryName || '分类'}详情`
      "
      :data="dataObj.detailObj"
      :fields="
        props.tabType === 'instance' ? instanceDetailFields : detailFields
      "
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
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
          <!-- 应用场景分类快捷筛选标签 -->
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
            <!-- 适用区域筛选标签 -->
            <ElTag
              v-if="filterApplicableArea"
              type="warning"
              closable
              @close="handleCancelApplicableAreaFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              适用区域：{{ filterApplicableArea }}
            </ElTag>
            <!-- 关联数据类型筛选标签 -->
            <ElTag
              v-if="filterDataType"
              type="primary"
              closable
              @close="handleCancelDataTypeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              关联数据类型：{{
                getDictObj(DICT_TYPE.DATA_TYPE, String(filterDataType))
                  ?.label || filterDataType
              }}
            </ElTag>
            <!-- 分类类型筛选标签 -->
            <ElTag
              v-if="filterCategoryType"
              type="danger"
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
          <!-- 应用场景实例快捷筛选标签 -->
          <template v-if="props.tabType === 'instance'">
            <!-- 场景编码筛选标签 -->
            <ElTag
              v-if="filterSceneCode"
              type="primary"
              closable
              @close="handleCancelSceneCodeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              场景编码：{{ filterSceneCode }}
            </ElTag>
            <!-- 关联分类筛选标签 -->
            <ElTag
              v-if="filterInstanceCategoryName"
              type="success"
              closable
              @close="handleCancelInstanceCategoryNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              关联分类：{{ filterInstanceCategoryName }}
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
            <!-- 负责人筛选标签 -->
            <ElTag
              v-if="filterManager"
              type="primary"
              closable
              @close="handleCancelManagerFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              负责人：{{ filterManager }}
            </ElTag>
          </template>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <!-- 仅在应用场景实例标签页显示导入按钮 -->
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
          <!-- 仅在应用场景实例标签页显示批量更新状态按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="批量启停用"
            icon-name="Refresh"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchUpdateStatus"
          />
          <!-- 仅在应用场景分类标签页显示批量删除按钮 -->
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
          <!-- 仅在应用场景实例标签页显示统计按钮 -->
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
      <!-- 分类名称插槽 -->
      <template #categoryNameDetail="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.categoryName }}
        </el-text>
      </template>
      <!-- 场景名称插槽 -->
      <template #sceneName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.sceneName }}
        </el-text>
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
      <!-- 适用区域插槽 -->
      <template #applicableArea="{ row }">
        <el-text
          @click="handleApplicableAreaClick(row.applicableArea)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.applicableArea }}
        </el-text>
      </template>
      <!-- 关联数据类型插槽 -->
      <template #dataType="{ row }">
        <ElTag
          @click="handleDataTypeClick(row.dataType)"
          :type="getDataTypeTagType(row.dataType)"
          style="cursor: pointer"
        >
          {{
            getDictObj(DICT_TYPE.DATA_TYPE, String(row.dataType))?.label ||
            row.dataType
          }}
        </ElTag>
      </template>
      <!-- 分类类型插槽 -->
      <template #categoryType="{ row }">
        <ElTag
          @click="handleCategoryTypeClick(row.categoryType)"
          :type="getCategoryTypeTagType(row.categoryType)"
          style="cursor: pointer"
        >
          {{
            getDictObj(DICT_TYPE.DATA_CATEGORY_TYPE, String(row.categoryType))
              ?.label || row.categoryType
          }}
        </ElTag>
      </template>
      <!-- 场景编码插槽 -->
      <template #sceneCode="{ row }">
        <el-text
          @click="handleSceneCodeClick(row.sceneCode)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.sceneCode }}
        </el-text>
      </template>
      <!-- 关联分类插槽（实例） -->
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
      <!-- 负责人插槽 -->
      <template #manager="{ row }">
        <el-text
          @click="handleManagerClick(row.manager)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.manager }}
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
          <!-- 应用场景分类标签页显示提交审核按钮 -->
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
          <!-- 应用场景实例标签页显示查看关联数据按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="查看关联数据"
            icon-name="Link"
            @click="handleViewRelatedData(row)"
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
            本页统计：应用场景实例数量: {{ dataObj.list.length }}
          </span>
          <span v-else> 本页统计：分类数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span v-if="props.tabType === 'instance'">
            全部统计：应用场景实例数量{{ dataObj.statistics.totalInstances }}
          </span>
          <span v-else>
            全部统计：分类数量{{ dataObj.statistics.totalCategories }}; 启用{{
              dataObj.statusCounts.enabled || 0
            }}; 禁用{{ dataObj.statusCounts.disabled || 0 }}
          </span>
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

    <!-- 查看关联数据抽屉 -->
    <ViewRelatedDataDrawer ref="viewRelatedDataDrawerRef" />
  </div>
</template>
