<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  bindIcon,
  createCategory,
  deleteBatchCategory,
  deleteCategory,
  exportCategory,
  getCategoryPage,
  getInstancePage,
  submitAudit,
  updateCategory,
} from '#/api/genchuan/dataHub/basicData/managePart';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import BatchUpdateStatusDialog from '../components/BatchUpdateStatusDialog.vue';
import BindMonitorDrawer from '../components/BindMonitorDrawer.vue';
import IconBindingDrawer from '../components/IconBindingDrawer.vue';
import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import SubmitAuditDialog from '../components/SubmitAuditDialog.vue';
import ViewEventsDrawer from '../components/ViewEventsDrawer.vue';
import {
  detailFields,
  instanceDetailFields,
  instanceTextObj,
  textObj,
  useFormSchema,
  useGridColumns,
  useInstanceFormSchema,
  useInstanceGridColumns,
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

const emit = defineEmits(['clearFilter', 'refreshTree', 'update:tableData']);
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

// 绑定图示抽屉
const [IconBindingDrawerComp, iconBindingDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  direction: 'rtl',
  size: '50%',
  onCancel() {
    iconBindingDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
const currentCategory = ref({});

// 提交审核弹窗
const submitAuditDialogVisible = ref(false);

// 新组件引用
const importExcelDialogRef = ref();
const batchUpdateStatusDialogRef = ref();
const bindMonitorDrawerRef = ref();
const viewEventsDrawerRef = ref();

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

      if (props.tabType === 'instance') {
        // 部件实例表单提交
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
            submitData.parentCategoryName =
              selectedNode.label || selectedNode.categoryName;
          }
        } else {
          submitData.parentId = null;
          submitData.parentCategoryName = '无';
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
        if (formValues.createTime) {
          // 如果是本地时间字符串，转换为YYYY-MM-DD HH:mm:ss格式
          const date = new Date(formValues.createTime);
          if (!isNaN(date.getTime())) {
            formValues.createTime = date
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ');
          }
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
    // 部件实例导出
    exportToExcel({
      data: dataObj.list,
      columns: useInstanceGridColumns().filter(
        (col) => col.field && col.field !== 'actions',
      ),
      filename: instanceTextObj.excelAllName,
    });
  } else {
    // 分类导出
    const data = await exportCategory();
    downloadFileFromBlobPart({ fileName: '管理部件分类表.xls', source: data });
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

/** 绑定图示 */
function handleBindIcon(row) {
  currentCategory.value = row;
  iconBindingDrawerApi.open();
}

/** 处理绑定图示确认 */
async function handleIconBindConfirm(iconName) {
  try {
    await bindIcon({
      id: Number(currentCategory.value.id),
      iconName,
    });
    ElMessage.success('图示绑定成功');
    iconBindingDrawerApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error('绑定失败');
    console.error(error);
  }
}

/** 提交审核 */
function handleSubmitAudit(row) {
  currentCategory.value = row;
  submitAuditDialogVisible.value = true;
}

/** 处理提交审核确认 */
async function handleSubmitAuditConfirm() {
  try {
    await submitAudit(Number(currentCategory.value.id));
    ElMessage.success('提交审核成功');
    submitAuditDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('提交失败');
    console.error(error);
  }
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

/** 关联监测部件 */
function handleBindMonitor(row) {
  bindMonitorDrawerRef.value?.open(row);
}

/** 查看关联事件 */
function handleViewEvents(row) {
  viewEventsDrawerRef.value?.open(row);
}

async function handleDelete(row) {
  const deleteName =
    props.tabType === 'instance' ? row.partName : row.categoryName;
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
      // 部件实例删除（前端模拟）
      const index = dataObj.list.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        dataObj.list.splice(index, 1);
      }
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
    abnormal: 0,
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
      // 部件实例数据（API接口）
      // 将状态文本转换为对应的数字值 - 与字典值对应：正常=2, 异常=1, 离线=3, 维护中=4
      let runStatusValue = '';
      if (activeName.value !== '全部') {
        switch (activeName.value) {
          case '异常': {
            runStatusValue = '1';
            break;
          }
          case '正常': {
            runStatusValue = '2';
            break;
          }
          case '离线': {
            runStatusValue = '3';
            break;
          }
          case '维护中': {
            runStatusValue = '4';
            break;
          }
          default: {
            runStatusValue = '';
          }
        }
      }

      // 构建查询参数
      const queryParams = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        runStatus: runStatusValue,
        ...dataObj.searchParams,
      };

      // 添加快捷筛选参数
      if (filterUniqueCode.value) {
        queryParams.uniqueCode = filterUniqueCode.value;
      }
      if (filterInstanceCategoryName.value) {
        queryParams.categoryName = filterInstanceCategoryName.value;
      }
      if (filterGridName.value) {
        queryParams.gridName = filterGridName.value;
      }
      if (filterDeptName.value) {
        queryParams.deptName = filterDeptName.value;
      }

      // 添加树形查询参数
      if (props.filterCategoryId) {
        queryParams.treeParentId = props.filterCategoryId;
        queryParams.includeSelf = true;
      }

      const response = await getInstancePage(queryParams);
      if (response) {
        dataObj.total = response.total;
        // 适配数据格式
        dataObj.list = response.list.map((item) => ({
          ...item,
          id: String(item.id), // 转换为字符串
          monitorCount: String(item.monitorCount || 0), // 转换为字符串
          createTime: item.createTime
            ? new Date(item.createTime).toLocaleString('zh-CN')
            : '', // 转换时间格式
          creator: item.creator || '', // 处理缺失字段
        }));

        // 计算统计信息 - 使用接口返回的统计数据
        dataObj.statistics.totalCategories = dataObj.total;
        dataObj.statistics.totalInstances = dataObj.list.reduce(
          (sum, item) => sum + Number(item.monitorCount || 0),
          0,
        );
        // 正常运行统计 - 字典值2表示正常
        dataObj.statistics.auditedCount = dataObj.list.filter(
          (item) => item.runStatus === '2',
        ).length;

        // 更新状态计数（如果接口返回了统计数据）
        if (response.statistics) {
          dataObj.statusCounts.total =
            response.statistics.total || dataObj.total;
          // 正常: 2, 异常: 1, 离线: 3, 维护中: 4
          dataObj.statusCounts.enabled =
            response.statistics.normalCount ||
            dataObj.list.filter((item) => item.runStatus === '2').length;
          dataObj.statusCounts.maintenance =
            response.statistics.faultCount ||
            dataObj.list.filter((item) => item.runStatus === '4').length;
          dataObj.statusCounts.disabled =
            response.statistics.stopCount ||
            dataObj.list.filter((item) => item.runStatus === '3').length;
          dataObj.statusCounts.abnormal = dataObj.list.filter(
            (item) => item.runStatus === '1',
          ).length;
        }
        // 将表格数据传递给父组件用于统计（当前页数据）
        emit('update:tableData', dataObj.list);

        // 获取全部数据用于统计（不带runStatus筛选）
        const allDataQueryParams = {
          pageNo: 1,
          pageSize: 100, // 获取足够多的数据
          ...dataObj.searchParams,
        };

        // 添加快捷筛选参数（保留其他筛选条件）
        if (filterUniqueCode.value) {
          allDataQueryParams.uniqueCode = filterUniqueCode.value;
        }
        if (filterInstanceCategoryName.value) {
          allDataQueryParams.categoryName = filterInstanceCategoryName.value;
        }
        if (filterGridName.value) {
          allDataQueryParams.gridName = filterGridName.value;
        }
        if (filterDeptName.value) {
          allDataQueryParams.deptName = filterDeptName.value;
        }

        // 添加树形查询参数
        if (props.filterCategoryId) {
          allDataQueryParams.treeParentId = props.filterCategoryId;
          allDataQueryParams.includeSelf = true;
        }

        try {
          const allDataResponse = await getInstancePage(allDataQueryParams);
          if (allDataResponse && allDataResponse.list) {
            const allDataList = allDataResponse.list.map((item) => ({
              ...item,
              id: String(item.id),
              monitorCount: String(item.monitorCount || 0),
              createTime: item.createTime
                ? new Date(item.createTime).toLocaleString('zh-CN')
                : '',
              creator: item.creator || '',
            }));
            // 传递全部数据给父组件用于统计
            emit('update:tableData', allDataList);
          }
        } catch (error) {
          console.error('获取全部数据失败:', error);
        }
      } else {
        ElMessage.error(response.message || '获取数据失败');
      }
    } else {
      // 分类数据（原有逻辑）
      // 将状态文本转换为对应的数字值
      let statusValue = '';
      if (activeName.value !== '全部') {
        switch (activeName.value) {
          case '启用': {
            statusValue = '1';
            break;
          }
          case '禁用': {
            statusValue = '0';
            break;
          }
          case '维护中': {
            statusValue = '2';
            break;
          }
          default: {
            statusValue = '';
          }
        }
      }

      // 构建查询参数
      const queryParams = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        status: statusValue,
        categoryCode: filterCategoryCode.value,
        parentCategoryName: filterParentCategoryName.value,
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
        dataObj.total = response.total;
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

        // 计算统计信息
        dataObj.statistics.totalCategories = dataObj.total;
        dataObj.statistics.totalInstances = dataObj.list.reduce(
          (sum, item) => sum + Number(item.instanceCount || 0),
          0,
        );
        dataObj.statistics.auditedCount = dataObj.list.filter(
          (item) => item.auditStatus === '已审核',
        ).length;
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
      ? useInstanceFormSchema(props.treeData)
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
          ? useInstanceFormSchema(newTreeData)
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
const filterCategoryCode = ref(''); // 分类代码筛选
const filterParentCategoryName = ref(''); // 上级分类筛选
const filterCategoryType = ref(''); // 分类类型筛选

// 管理部件实例快捷筛选
const filterUniqueCode = ref(''); // 16位标识码筛选
const filterInstanceCategoryName = ref(''); // 所属分类筛选
const filterGridName = ref(''); // 所在网格筛选
const filterDeptName = ref(''); // 主管部门筛选

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  } else {
    console.error('DetailDrawer组件未初始化');
  }
};

// 处理分类代码点击
const handleCategoryCodeClick = (categoryCode) => {
  filterCategoryCode.value =
    filterCategoryCode.value === categoryCode ? '' : categoryCode;
  gridApi.query();
};

/** 取消分类代码筛选 */
const handleCancelCategoryCodeFilter = () => {
  filterCategoryCode.value = '';
  gridApi.query();
};

// 处理16位标识码点击
const handleUniqueCodeClick = (uniqueCode) => {
  filterUniqueCode.value =
    filterUniqueCode.value === uniqueCode ? '' : uniqueCode;
  gridApi.query();
};

/** 取消16位标识码筛选 */
const handleCancelUniqueCodeFilter = () => {
  filterUniqueCode.value = '';
  gridApi.query();
};

// 处理所属分类点击
const handleCategoryNameClick = (categoryName) => {
  filterInstanceCategoryName.value =
    filterInstanceCategoryName.value === categoryName ? '' : categoryName;
  gridApi.query();
};

/** 取消所属分类筛选 */
const handleCancelCategoryNameFilter = () => {
  filterInstanceCategoryName.value = '';
  gridApi.query();
};

// 处理所在网格点击
const handleGridNameClick = (gridName) => {
  filterGridName.value = filterGridName.value === gridName ? '' : gridName;
  gridApi.query();
};

/** 取消所在网格筛选 */
const handleCancelGridNameFilter = () => {
  filterGridName.value = '';
  gridApi.query();
};

// 处理主管部门点击
const handleDeptNameClick = (deptName) => {
  filterDeptName.value = filterDeptName.value === deptName ? '' : deptName;
  gridApi.query();
};

/** 取消主管部门筛选 */
const handleCancelDeptNameFilter = () => {
  filterDeptName.value = '';
  gridApi.query();
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

// 处理上级分类点击
const handleParentCategoryNameClick = (parentCategoryName) => {
  filterParentCategoryName.value =
    filterParentCategoryName.value === parentCategoryName
      ? ''
      : parentCategoryName;
  gridApi.query();
};

/** 取消上级分类筛选 */
const handleCancelParentCategoryNameFilter = () => {
  filterParentCategoryName.value = '';
  gridApi.query();
};

// 处理分类类型点击
const handleCategoryTypeClick = (categoryType) => {
  filterCategoryType.value =
    filterCategoryType.value === categoryType ? '' : categoryType;
  gridApi.query();
};

/** 取消分类类型筛选 */
const handleCancelCategoryTypeFilter = () => {
  filterCategoryType.value = '';
  gridApi.query();
};

// tabsData根据tabType显示不同的标签
const tabsData = computed(() => {
  if (props.tabType === 'instance') {
    // 与字典值对应：正常=2, 异常=1, 离线=3, 维护中=4
    return [
      { label: '全部' },
      { label: '正常' },
      { label: '异常' },
      { label: '离线' },
      { label: '维护中' },
    ];
  }
  return [
    { label: '全部' },
    { label: '启用' },
    { label: '禁用' },
    { label: '维护中' },
  ];
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (props.tabType === 'instance') {
    // 部件实例标签统计 - 与字典值对应：正常=2, 异常=1, 离线=3, 维护中=4
    switch (item.label) {
      case '全部': {
        count = dataObj.statusCounts.total;
        break;
      }
      case '异常': {
        count = dataObj.statusCounts.abnormal || 0;
        break;
      }
      case '正常': {
        count = dataObj.statusCounts.enabled;
        break;
      }
      case '离线': {
        count = dataObj.statusCounts.disabled;
        break;
      }
      case '维护中': {
        count = dataObj.statusCounts.maintenance;
        break;
      }
    }
  } else {
    // 分类标签统计
    switch (item.label) {
      case '全部': {
        count = dataObj.statusCounts.total;
        break;
      }
      case '启用': {
        count = dataObj.statusCounts.enabled;
        break;
      }
      case '禁用': {
        count = dataObj.statusCounts.disabled;
        break;
      }
      case '维护中': {
        count = dataObj.statusCounts.maintenance;
        break;
      }
    }
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
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
      // 部件实例状态统计 - 与字典值对应：正常=2, 异常=1, 离线=3, 维护中=4
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
        dataObj.statusCounts.total = response.total;
        // 正常: 2, 异常: 1, 离线: 3, 维护中: 4
        dataObj.statusCounts.enabled = allData.filter(
          (item) => item.runStatus === '2',
        ).length;
        dataObj.statusCounts.abnormal = allData.filter(
          (item) => item.runStatus === '1',
        ).length;
        dataObj.statusCounts.disabled = allData.filter(
          (item) => item.runStatus === '3',
        ).length;
        dataObj.statusCounts.maintenance = allData.filter(
          (item) => item.runStatus === '4',
        ).length;
      }
    } else {
      // 分类状态统计
      const response = await getCategoryPage({
        pageNo: 1,
        pageSize: 100, // 设置一个较大的值，确保获取所有数据
        status: '',
        categoryId: props.filterCategoryId,
        ...dataObj.searchParams,
      });
      if (response && response.list) {
        const allData = response.list;
        dataObj.statusCounts.total = response.total;
        dataObj.statusCounts.enabled = allData.filter(
          (item) => item.status === '1',
        ).length;
        dataObj.statusCounts.disabled = allData.filter(
          (item) => item.status === '0',
        ).length;
        dataObj.statusCounts.maintenance = allData.filter(
          (item) => item.status === '2',
        ).length;
      }
    }
  } catch (error) {
    console.error('初始化状态计数失败:', error);
  }
};

// 获取状态显示文本
const getStatusText = (status) => {
  // 分类状态: 0=禁用, 1=启用, 2=维护中
  // 部件实例状态: 1=异常, 2=正常, 3=离线, 4=维护中
  switch (status) {
    case '0': {
      return '禁用';
    }
    case '1': {
      return props.tabType === 'instance' ? '异常' : '启用';
    }
    case '2': {
      return props.tabType === 'instance' ? '正常' : '维护中';
    }
    case '3': {
      return '离线';
    }
    case '4': {
      return '维护中';
    }
    default: {
      return '未知';
    }
  }
};

// 获取状态标签类型
const getStatusType = (status) => {
  // 分类状态: 0=禁用(danger), 1=启用(success), 2=维护中(warning)
  // 部件实例状态: 1=异常(danger), 2=正常(success), 3=离线(info), 4=维护中(warning)
  switch (status) {
    case '0': {
      return 'danger';
    }
    case '1': {
      return props.tabType === 'instance' ? 'danger' : 'success';
    }
    case '2': {
      return props.tabType === 'instance' ? 'success' : 'warning';
    }
    case '3': {
      return 'info';
    }
    case '4': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
};

// 获取审核状态标签类型
const getAuditStatusType = (auditStatus) => {
  switch (auditStatus) {
    case '审核中': {
      return 'primary';
    }
    case '已审核': {
      return 'success';
    }
    case '待审核': {
      return 'warning';
    }
    case '未审核': {
      return 'info';
    }
    default: {
      return 'info';
    }
  }
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
          ? `${dataObj.detailObj?.partName || '部件实例'}详情`
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
            v-if="filterParentCategoryName"
            type="success"
            closable
            @close="handleCancelParentCategoryNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            上级分类：{{ filterParentCategoryName }}
          </ElTag>
          <!-- 分类类型筛选标签 -->
          <ElTag
            v-if="filterCategoryType"
            type="warning"
            closable
            @close="handleCancelCategoryTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            分类类型：{{ filterCategoryType }}
          </ElTag>
          <!-- 16位标识码筛选标签（仅在管理部件实例标签页显示） -->
          <ElTag
            v-if="props.tabType === 'instance' && filterUniqueCode"
            type="primary"
            closable
            @close="handleCancelUniqueCodeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            16位标识码：{{ filterUniqueCode }}
          </ElTag>
          <!-- 所属分类筛选标签（仅在管理部件实例标签页显示） -->
          <ElTag
            v-if="props.tabType === 'instance' && filterInstanceCategoryName"
            type="success"
            closable
            @close="handleCancelCategoryNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属分类：{{ filterInstanceCategoryName }}
          </ElTag>
          <!-- 所在网格筛选标签（仅在管理部件实例标签页显示） -->
          <ElTag
            v-if="props.tabType === 'instance' && filterGridName"
            type="warning"
            closable
            @close="handleCancelGridNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所在网格：{{ filterGridName }}
          </ElTag>
          <!-- 主管部门筛选标签（仅在管理部件实例标签页显示） -->
          <ElTag
            v-if="props.tabType === 'instance' && filterDeptName"
            type="info"
            closable
            @close="handleCancelDeptNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            主管部门：{{ filterDeptName }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <!-- 仅在管理部件实例标签页显示导入按钮 -->
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
          <!-- 仅在管理部件实例标签页显示批量更新状态按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="批量更新状态"
            icon-name="Refresh"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchUpdateStatus"
          />
          <IconButton
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
          <!-- 仅在管理部件实例标签页显示统计按钮 -->
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
      <template #categoryName="{ row }">
        <el-text
          @click="
            props.tabType === 'instance'
              ? handleCategoryNameClick(row.categoryName)
              : handleOpenDetail(row)
          "
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.categoryName }}
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
      <template #parentCategoryName="{ row }">
        <el-text
          @click="handleParentCategoryNameClick(row.parentCategoryName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.parentCategoryName }}
        </el-text>
      </template>
      <!-- 分类类型插槽 -->
      <template #categoryType="{ row }">
        <el-text
          @click="handleCategoryTypeClick(row.categoryType)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.categoryType }}
        </el-text>
      </template>
      <!-- 16位标识码插槽（管理部件实例） -->
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
      <!-- 所在网格插槽（管理部件实例） -->
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
      <!-- 主管部门插槽（管理部件实例） -->
      <template #deptName="{ row }">
        <el-text
          @click="handleDeptNameClick(row.deptName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.deptName }}
        </el-text>
      </template>
      <template #status="{ row }">
        <ElTag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </ElTag>
      </template>
      <!-- 审核状态插槽 -->
      <template #auditStatus="{ row }">
        <ElTag :type="getAuditStatusType(row.auditStatus)">
          {{ row.auditStatus }}
        </ElTag>
      </template>
      <!-- 运行状态插槽（部件实例） -->
      <template #runStatus="{ row }">
        <ElTag :type="getStatusType(row.runStatus)">
          {{ getStatusText(row.runStatus) }}
        </ElTag>
      </template>
      <!-- 部件名称插槽（部件实例） -->
      <template #partName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.partName }}
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
          <IconButton
            v-if="props.tabType !== 'instance'"
            content="绑定图示"
            icon-name="Link"
            @click="handleBindIcon(row)"
          />
          <IconButton
            v-if="props.tabType !== 'instance' && row.auditStatus === '未审核'"
            content="提交审核"
            icon-name="Position"
            @click="handleSubmitAudit(row)"
          />
          <!-- 仅在管理部件实例标签页显示关联监测部件按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="关联监测部件"
            icon-name="Connection"
            @click="handleBindMonitor(row)"
          />
          <!-- 仅在管理部件实例标签页显示查看关联事件按钮 -->
          <IconButton
            v-if="props.tabType === 'instance'"
            content="查看关联事件"
            icon-name="Link"
            @click="handleViewEvents(row)"
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
            本页统计：部件实例数量: {{ dataObj.list.length }}
          </span>
          <span v-else> 本页统计：分类数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span v-if="props.tabType === 'instance'">
            全部统计：部件实例数量{{ dataObj.statistics.totalCategories }};
            关联监测部件数{{ dataObj.statistics.totalInstances }}; 正常{{
              dataObj.statusCounts.enabled || 0
            }}; 异常{{ dataObj.statusCounts.abnormal || 0 }}; 离线{{
              dataObj.statusCounts.disabled || 0
            }}; 维护中{{ dataObj.statusCounts.maintenance || 0 }}
          </span>
          <span v-else>
            全部统计：分类数量{{ dataObj.statistics.totalCategories }};
            关联实例数{{ dataObj.statistics.totalInstances }}; 已审核{{
              dataObj.statistics.auditedCount
            }}
          </span>
        </div>
      </template>
    </Grid>

    <!-- 绑定图示抽屉 -->
    <IconBindingDrawerComp title="绑定图示">
      <IconBindingDrawer
        :category="currentCategory"
        @close="iconBindingDrawerApi.close()"
        @confirm="handleIconBindConfirm"
      />
    </IconBindingDrawerComp>

    <!-- 提交审核弹窗 -->
    <el-dialog
      v-model="submitAuditDialogVisible"
      title="提交审核"
      width="400px"
    >
      <SubmitAuditDialog
        :category="currentCategory"
        @close="submitAuditDialogVisible = false"
        @confirm="handleSubmitAuditConfirm"
      />
    </el-dialog>

    <!-- 导入Excel弹窗 -->
    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />

    <!-- 批量更新状态弹窗 -->
    <BatchUpdateStatusDialog
      ref="batchUpdateStatusDialogRef"
      @success="handleRefresh"
    />

    <!-- 关联监测部件抽屉 -->
    <BindMonitorDrawer ref="bindMonitorDrawerRef" @success="handleRefresh" />

    <!-- 查看关联事件抽屉 -->
    <ViewEventsDrawer ref="viewEventsDrawerRef" />
  </div>
</template>
