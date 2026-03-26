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
} from '#/api/genchuan/dataHub/basicData/monitorEvent';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';

import BatchUpdateStatusDialog from '../components/BatchUpdateStatusDialog.vue';
import HandleDialog from '../components/HandleDialog.vue';
import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import RejectDialog from '../components/RejectDialog.vue';
import SubmitAuditDialog from '../components/SubmitAuditDialog.vue';
import ViewRelatedMatterDialog from '../components/ViewRelatedMatterDialog.vue';
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

const emit = defineEmits([
  'clearFilter',
  'refreshTree',
  'update:tableData',
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
const handleDialogRef = ref();
const rejectDialogRef = ref();
const viewRelatedMatterDialogRef = ref();

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
        // 监测事件实例表单提交
        if (submitData.dealTime) {
          const date = new Date(submitData.dealTime);
          if (!isNaN(date.getTime())) {
            submitData.dealTime = date.getTime().toString();
          }
        }

        // 处理所属分类数据
        if (submitData.categoryName) {
          const findNodeWithParent = (nodes, id, parent = null) => {
            for (const node of nodes) {
              if (node.id === id) {
                return { node, parent };
              }
              if (node.children && node.children.length > 0) {
                const found = findNodeWithParent(node.children, id, node);
                if (found) {
                  return found;
                }
              }
            }
            return null;
          };

          const result = findNodeWithParent(
            props.treeData,
            submitData.categoryName,
          );
          if (result) {
            const { node: selectedNode } = result;
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
        if (formValues.dealTime) {
          const date = new Date(formValues.dealTime);
          if (!isNaN(date.getTime())) {
            formValues.dealTime = date
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
            DICT_TYPE.DATA_MATTER_STATUS,
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
        categoryId: props.filterCategoryId,
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
        dataObj.statusCounts.maintenance = 0;
      }
    }
  } catch (error) {
    console.error('初始化状态计数失败:', error);
  }
};

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
    downloadFileFromBlobPart({ fileName: '监测事件实例表.xls', source: data });
  } else {
    const data = await exportCategory();
    downloadFileFromBlobPart({ fileName: '监测事件分类表.xls', source: data });
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

async function handleDelete(row) {
  const deleteName = props.tabType === 'instance' ? row.name : row.categoryName;
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

// 处理提交审核
const handleSubmitAudit = (row) => {
  submitAuditDialogRef.value?.open(row);
};

// 处理处置
const handleHandle = (row) => {
  handleDialogRef.value?.open(row);
};

// 处理驳回
const handleReject = (row) => {
  rejectDialogRef.value?.open(row);
};

// 处理查看关联事项
const handleViewRelatedMatter = (row) => {
  viewRelatedMatterDialogRef.value?.open(row);
};

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
      // 监测事件实例批量删除
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

// 监测事件分类快捷筛选
const filterCategoryCode = ref(''); // 分类代码筛选
const filterParentCategory = ref(''); // 上级分类筛选
const filterRelatedMonitorType = ref(''); // 关联监测部件类型筛选
const filterRelatedMatterType = ref(''); // 关联管理事项类型筛选
const filterEventLevel = ref(''); // 事件等级筛选

// 监测事件实例快捷筛选
const filterUniqueCode = ref(''); // 18位标识码筛选
const filterInstanceCategoryName = ref(''); // 所属分类筛选
const filterMonitorName = ref(''); // 关联监测部件筛选

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
  statusCounts: {
    total: 0,
    enabled: 0,
    disabled: 0,
    maintenance: 0,
  },
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
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
      // 监测事件实例数据
      let statusValue = '';
      if (activeName.value !== '全部') {
        const dictOptions = getDictOptions(
          DICT_TYPE.DATA_MATTER_STATUS,
          'string',
        );
        const found = dictOptions.find((opt) => opt.label === activeName.value);
        statusValue = found ? found.value : '';
      }

      const queryParams = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        status: statusValue,
        uniqueCode: filterUniqueCode.value,
        categoryName: filterInstanceCategoryName.value,
        monitorName: filterMonitorName.value,
        eventLevel: filterEventLevel.value,
        ...dataObj.searchParams,
      };

      if (props.filterCategoryId) {
        queryParams.treeParentId = props.filterCategoryId;
        queryParams.includeSelf = true;
      }

      const response = await getInstancePage(queryParams);
      if (response) {
        if (!skipStatsUpdate.value) {
          dataObj.total = response.total;
        }
        dataObj.list = response.list.map((item) => ({
          ...item,
          id: String(item.id),
          createTime: item.createTime
            ? new Date(item.createTime).toLocaleString('zh-CN')
            : '',
          creator: item.creator || '',
          dealTime: item.dealTime
            ? new Date(item.dealTime).toLocaleString('zh-CN')
            : '',
        }));

        if (!skipStatsUpdate.value) {
          dataObj.statistics.totalCategories = dataObj.total;
        }

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
        relatedMonitorType: filterRelatedMonitorType.value,
        relatedMatterType: filterRelatedMatterType.value,
        eventLevel: filterEventLevel.value,
        ...dataObj.searchParams,
      };

      if (props.filterCategoryId) {
        queryParams.treeParentId = props.filterCategoryId;
        queryParams.includeSelf = true;
      }

      const response = await getCategoryPage(queryParams);
      if (response) {
        if (!skipStatsUpdate.value) {
          dataObj.total = response.total;
        }
        dataObj.list = response.list.map((item) => ({
          ...item,
          id: String(item.id),
          parentId: item.parentId ? String(item.parentId) : null,
          createTime: item.createTime
            ? new Date(item.createTime).toLocaleString('zh-CN')
            : '',
          creator: item.creator || '',
        }));

        if (!skipStatsUpdate.value) {
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
          dataObj.statusCounts.maintenance = 0;
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

// 处理关联监测部件类型点击
const handleRelatedMonitorTypeClick = (relatedMonitorType) => {
  handleQuickFilter(() => {
    filterRelatedMonitorType.value =
      filterRelatedMonitorType.value === relatedMonitorType
        ? ''
        : relatedMonitorType;
    gridApi.query();
  });
};

/** 取消关联监测部件类型筛选 */
const handleCancelRelatedMonitorTypeFilter = () => {
  handleQuickFilter(() => {
    filterRelatedMonitorType.value = '';
    gridApi.query();
  });
};

// 处理关联管理事项类型点击
const handleRelatedMatterTypeClick = (relatedMatterType) => {
  handleQuickFilter(() => {
    filterRelatedMatterType.value =
      filterRelatedMatterType.value === relatedMatterType
        ? ''
        : relatedMatterType;
    gridApi.query();
  });
};

/** 取消关联管理事项类型筛选 */
const handleCancelRelatedMatterTypeFilter = () => {
  handleQuickFilter(() => {
    filterRelatedMatterType.value = '';
    gridApi.query();
  });
};

// 处理事件等级点击
const handleEventLevelClick = (eventLevel) => {
  handleQuickFilter(() => {
    filterEventLevel.value =
      filterEventLevel.value === eventLevel ? '' : eventLevel;
    gridApi.query();
  });
};

/** 取消事件等级筛选 */
const handleCancelEventLevelFilter = () => {
  handleQuickFilter(() => {
    filterEventLevel.value = '';
    gridApi.query();
  });
};

/** 获取事件等级的Tag类型 - 将字典颜色映射到Element Plus支持的颜色类型 */
const getEventLevelTagType = (eventLevel) => {
  const dict = getDictObj(DICT_TYPE.DATA_EVENT_LEVEL, String(eventLevel));
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

// 处理所属分类点击（实例）
const handleInstanceCategoryNameClick = (categoryName) => {
  handleQuickFilter(() => {
    filterInstanceCategoryName.value =
      filterInstanceCategoryName.value === categoryName ? '' : categoryName;
    gridApi.query();
  });
};

/** 取消所属分类筛选（实例） */
const handleCancelInstanceCategoryNameFilter = () => {
  handleQuickFilter(() => {
    filterInstanceCategoryName.value = '';
    gridApi.query();
  });
};

// 处理关联监测部件点击
const handleMonitorNameClick = (monitorName) => {
  handleQuickFilter(() => {
    filterMonitorName.value =
      filterMonitorName.value === monitorName ? '' : monitorName;
    gridApi.query();
  });
};

/** 取消关联监测部件筛选 */
const handleCancelMonitorNameFilter = () => {
  handleQuickFilter(() => {
    filterMonitorName.value = '';
    gridApi.query();
  });
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
  if (props.tabType === 'instance') {
    const dictOptions = getDictOptions(DICT_TYPE.DATA_MATTER_STATUS, 'string');
    const tabs = [{ label: '全部' }];
    dictOptions.forEach((opt) => {
      tabs.push({ label: opt.label, value: opt.value });
    });
    return tabs;
  } else {
    return [{ label: '全部' }, { label: '启用' }, { label: '禁用' }];
  }
});

// 存储全部数据的状态统计 - 用于三级状态显示
const allDataStatusCounts = reactive({
  total: 0,
  statusMap: {},
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (props.tabType === 'instance') {
    count =
      item.label === '全部'
        ? allDataStatusCounts.total
        : allDataStatusCounts.statusMap[item.label] || 0;
  } else {
    count =
      item.label === '全部'
        ? allDataStatusCounts.total
        : allDataStatusCounts.statusMap[item.label] || 0;
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  skipStatsUpdate.value = true;
  emit('statusChange', activeName.value);
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
          ? `${dataObj.detailObj?.name || '监测事件实例'}详情`
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
          <!-- 监测事件分类快捷筛选标签 -->
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
            <!-- 关联监测部件类型筛选标签 -->
            <ElTag
              v-if="filterRelatedMonitorType"
              type="warning"
              closable
              @close="handleCancelRelatedMonitorTypeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              关联监测部件类型：{{ filterRelatedMonitorType }}
            </ElTag>
            <!-- 关联管理事项类型筛选标签 -->
            <ElTag
              v-if="filterRelatedMatterType"
              type="info"
              closable
              @close="handleCancelRelatedMatterTypeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              关联管理事项类型：{{ filterRelatedMatterType }}
            </ElTag>
          </template>
          <!-- 事件等级筛选标签 - 两个标签页共用 -->
          <ElTag
            v-if="filterEventLevel"
            type="danger"
            closable
            @close="handleCancelEventLevelFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            事件等级：{{
              getDictObj(DICT_TYPE.DATA_EVENT_LEVEL, String(filterEventLevel))
                ?.label || filterEventLevel
            }}
          </ElTag>
          <!-- 监测事件实例快捷筛选标签 -->
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
            <!-- 关联监测部件筛选标签 -->
            <ElTag
              v-if="filterMonitorName"
              type="warning"
              closable
              @close="handleCancelMonitorNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              关联监测部件：{{ filterMonitorName }}
            </ElTag>
          </template>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <!-- 仅在监测事件实例标签页显示导入按钮 -->
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
          <!-- 仅在监测事件实例标签页显示批量更新状态按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="批量更新状态"
            icon-name="Refresh"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchUpdateStatus"
          />
          <!-- 仅在监测事件分类标签页显示批量删除按钮 -->
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
          <!-- 仅在监测事件实例标签页显示统计按钮 -->
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
      <!-- 事项名称插槽（监测事件实例） -->
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
      <!-- 关联监测部件类型插槽 -->
      <template #relatedMonitorType="{ row }">
        <el-text
          @click="handleRelatedMonitorTypeClick(row.relatedMonitorType)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.relatedMonitorType }}
        </el-text>
      </template>
      <!-- 关联管理事项类型插槽 -->
      <template #relatedMatterType="{ row }">
        <el-text
          @click="handleRelatedMatterTypeClick(row.relatedMatterType)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.relatedMatterType }}
        </el-text>
      </template>
      <!-- 事件等级插槽 -->
      <template #eventLevel="{ row }">
        <ElTag
          @click="handleEventLevelClick(row.eventLevel)"
          :type="getEventLevelTagType(row.eventLevel)"
          style="cursor: pointer"
        >
          {{
            getDictObj(DICT_TYPE.DATA_EVENT_LEVEL, String(row.eventLevel))
              ?.label || row.eventLevel
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
      <!-- 所属分类插槽（实例） -->
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
      <!-- 关联监测部件插槽 -->
      <template #monitorName="{ row }">
        <el-text
          @click="handleMonitorNameClick(row.monitorName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.monitorName }}
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
          <!-- 监测事件分类标签页显示提交审核按钮 -->
          <IconButton
            v-if="props.tabType !== 'instance' && row.auditStatus === '3'"
            content="提交审核"
            icon-name="Position"
            @click="handleSubmitAudit(row)"
          />
          <!-- 监测事件实例标签页显示处置、驳回、查看关联事项按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="处置"
            icon-name="Setting"
            @click="handleHandle(row)"
          />
          <IconButton
            v-if="props.tabType === 'instance'"
            content="驳回"
            icon-name="Close"
            color="#F56C6C"
            @click="handleReject(row)"
          />
          <IconButton
            v-if="props.tabType === 'instance'"
            content="查看关联事项"
            icon-name="Link"
            @click="handleViewRelatedMatter(row)"
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
            本页统计：监测事件实例数量: {{ dataObj.list.length }}
          </span>
          <span v-else> 本页统计：分类数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span v-if="props.tabType === 'instance'">
            全部统计：监测事件实例数量{{ dataObj.statistics.totalCategories }}
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

    <!-- 处置弹窗 -->
    <HandleDialog ref="handleDialogRef" @success="handleRefresh" />

    <!-- 驳回弹窗 -->
    <RejectDialog ref="rejectDialogRef" @success="handleRefresh" />

    <!-- 查看关联事项弹窗 -->
    <ViewRelatedMatterDialog ref="viewRelatedMatterDialogRef" />
  </div>
</template>
