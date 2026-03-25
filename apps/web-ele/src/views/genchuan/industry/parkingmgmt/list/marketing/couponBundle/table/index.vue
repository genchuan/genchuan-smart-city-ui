<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import IconButton from '#/components/common/IconButton.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import OrderDrawer from '../components/OrderDrawer.vue';
import UserDrawer from '../components/UserDrawer.vue';
import {
  dataList,
  detailFields,
  orderDetailList,
  receiveUserList,
  releaseDataList,
  releaseDetailFields,
  releaseTextObj,
  textObj,
  useDataList,
  useDetailFields,
  useFormSchema,
  useGridColumns,
  useReleaseFormSchema,
  useReleaseGridColumns,
  useTextObj,
  useUseFormSchema,
  useUseGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  activeTab: {
    type: String,
    default: '券包管理',
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
const getTitle = computed(() => {
  if (props.activeTab === '定向发放管理') {
    return formData.value?.releaseId
      ? releaseTextObj.editText
      : releaseTextObj.addText;
  } else if (props.activeTab === '使用记录') {
    return formData.value?.useId ? useTextObj.editText : useTextObj.addText;
  }
  return formData.value?.packageId ? textObj.editText : textObj.addText;
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
const currentFormSchema = computed(() => {
  if (props.activeTab === '定向发放管理') {
    return useReleaseFormSchema();
  } else if (props.activeTab === '使用记录') {
    return useUseFormSchema();
  }
  return useFormSchema();
});
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: currentFormSchema.value,
  showDefaultActions: false,
});

// 监听activeTab变化，更新Form的schema
watch(
  () => props.activeTab,
  () => {
    formApi.setSchema(currentFormSchema.value);
    formApi.resetForm();
  },
);
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (props.activeTab === '定向发放管理') {
      if (formDrawerApi.sharedData.payload.title === releaseTextObj.addText) {
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.releaseId === formData.value?.releaseId) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    } else if (props.activeTab === '使用记录') {
      if (formDrawerApi.sharedData.payload.title === useTextObj.addText) {
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.useId === formData.value?.useId) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    } else {
      if (formDrawerApi.sharedData.payload.title === textObj.addText) {
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.packageId === formData.value?.packageId) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (props.activeTab === '定向发放管理') {
        if (formData.value?.releaseId) {
          await formApi.setValues(formData.value);
        } else {
          formApi.resetForm();
        }
      } else if (props.activeTab === '使用记录') {
        if (formData.value?.useId) {
          await formApi.setValues(formData.value);
        } else {
          formApi.resetForm();
        }
      } else {
        if (formData.value?.packageId) {
          await formApi.setValues(formData.value);
        } else {
          formApi.resetForm();
        }
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
  if (props.activeTab === '定向发放管理') {
    exportToExcel(
      dataObj.apilist,
      releaseTextObj.excelName,
      releaseTextObj.excelAllName,
    );
  } else if (props.activeTab === '使用记录') {
    exportToExcel(
      dataObj.apilist,
      useTextObj.excelName,
      useTextObj.excelAllName,
    );
  } else {
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title:
        props.activeTab === '定向发放管理'
          ? releaseTextObj.addText
          : props.activeTab === '使用记录'
            ? useTextObj.addText
            : textObj.addText,
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title:
        props.activeTab === '定向发放管理'
          ? releaseTextObj.editText
          : props.activeTab === '使用记录'
            ? useTextObj.editText
            : textObj.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  if (props.activeTab === '定向发放管理') {
    const loadingInstance = ElLoading.service({
      text: $t('ui.actionMessage.deleting', [row.packageSelection]),
    });
    try {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => v.releaseId !== row.releaseId,
      );
      ElMessage.success(
        $t('ui.actionMessage.deleteSuccess', [row.packageSelection]),
      );
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } else if (props.activeTab === '使用记录') {
    const loadingInstance = ElLoading.service({
      text: $t('ui.actionMessage.deleting', [row.useId]),
    });
    try {
      dataObj.apilist = dataObj.apilist.filter((v) => v.useId !== row.useId);
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.useId]));
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } else {
    const loadingInstance = ElLoading.service({
      text: $t('ui.actionMessage.deleting', [row.packageName]),
    });
    try {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => v.packageId !== row.packageId,
      );
      ElMessage.success(
        $t('ui.actionMessage.deleteSuccess', [row.packageName]),
      );
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    if (props.activeTab === '定向发放管理') {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => !checkedIds.value.includes(v.releaseId),
      );
    } else if (props.activeTab === '使用记录') {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => !checkedIds.value.includes(v.useId),
      );
    } else {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => !checkedIds.value.includes(v.packageId),
      );
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  if (props.activeTab === '定向发放管理') {
    checkedIds.value = records.map((item) => item.releaseId);
  } else if (props.activeTab === '使用记录') {
    checkedIds.value = records.map((item) => item.useId);
  } else {
    checkedIds.value = records.map((item) => item.packageId);
  }
}
const activeName = ref('全部');

// 筛选状态变量
const filterCouponName = ref(''); // 包含优惠券筛选
const filterApplyScope = ref(''); // 适用范围筛选
const filterPackageSelection = ref(''); // 券包选择筛选
const filterTargetedUserTag = ref(''); // 定向用户标签筛选
const filterReleaseWay = ref(''); // 发放方式筛选
const filterPackageName = ref(''); // 券包名称筛选
const filterLotName = ref(''); // 使用车场筛选

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
});

// 延迟初始化的watch函数
let activeTabWatch;

// 初始化数据的函数
function initData() {
  if (props.activeTab === '定向发放管理') {
    dataObj.apilist = releaseDataList();
    dataObj.total = releaseDataList().length;
  } else if (props.activeTab === '使用记录') {
    dataObj.apilist = useDataList();
    dataObj.total = useDataList().length;
  } else {
    dataObj.apilist = dataList();
    dataObj.total = dataList().length;
  }
  dataObj.currentPage = 1;
  dataObj.list = [];
  activeName.value = '全部'; // 重置筛选状态为全部
}

// 初始化时调用一次
initData();
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和筛选条件筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    if (props.activeTab === '定向发放管理') {
      switch (activeName.value) {
        case '全部': {
          statusMatch = true;
          break;
        }
        case '已完成': {
          statusMatch = v.releaseStatus === '已完成';
          break;
        }
        case '已暂停': {
          statusMatch = v.releaseStatus === '已暂停';
          break;
        }
        case '未开始': {
          statusMatch = v.releaseStatus === '未开始';
          break;
        }
        case '进行中': {
          statusMatch = v.releaseStatus === '进行中';
          break;
        }
        // No default
      }
    } else if (props.activeTab === '使用记录') {
      switch (activeName.value) {
        case '全部': {
          statusMatch = true;
          break;
        }
        case '已使用': {
          statusMatch = v.useStatus === '已使用';
          break;
        }
        case '已过期': {
          statusMatch = v.useStatus === '已过期';
          break;
        }
        case '未使用': {
          statusMatch = v.useStatus === '未使用';
          break;
        }
        // No default
      }
    } else {
      switch (activeName.value) {
        case '上架': {
          statusMatch = v.status === '上架';
          break;
        }
        case '下架': {
          statusMatch = v.status === '下架';
          break;
        }
        case '全部': {
          statusMatch = true;
          break;
        }
        // No default
      }
    }

    // 字段筛选
    let fieldMatch = true;
    switch (props.activeTab) {
      case '使用记录': {
        // 使用记录标签页的筛选
        fieldMatch =
          fieldMatch &&
          (!filterPackageName.value ||
            v.packageName.includes(filterPackageName.value));
        fieldMatch =
          fieldMatch &&
          (!filterLotName.value || v.lotName === filterLotName.value);

        break;
      }
      case '券包管理': {
        // 券包管理标签页的筛选
        fieldMatch =
          fieldMatch &&
          (!filterCouponName.value ||
            v.couponName.includes(filterCouponName.value));
        fieldMatch =
          fieldMatch &&
          (!filterApplyScope.value || v.applyScope === filterApplyScope.value);
        fieldMatch =
          fieldMatch &&
          (!filterPackageName.value ||
            v.packageName.includes(filterPackageName.value));

        break;
      }
      case '定向发放管理': {
        // 定向发放管理标签页的筛选
        fieldMatch =
          fieldMatch &&
          (!filterPackageSelection.value ||
            v.packageSelection === filterPackageSelection.value);
        fieldMatch =
          fieldMatch &&
          (!filterTargetedUserTag.value ||
            v.targetedUserTag === filterTargetedUserTag.value);
        fieldMatch =
          fieldMatch &&
          (!filterReleaseWay.value || v.releaseWay === filterReleaseWay.value);

        break;
      }
      // No default
    }

    return statusMatch && fieldMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const queryFormSchema = computed(() => {
  if (props.activeTab === '定向发放管理') {
    return useReleaseFormSchema();
  } else if (props.activeTab === '使用记录') {
    return useUseFormSchema();
  }
  return useFormSchema();
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
  schema: queryFormSchema.value.map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 监听activeTab变化，更新QueryForm的schema
watch(
  () => props.activeTab,
  () => {
    queryFormApi.setSchema(
      queryFormSchema.value.map((v) => {
        delete v.rules;
        return {
          ...v,
        };
      }),
    );
    queryFormApi.resetForm();
  },
);

// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}

const gridColumns = computed(() => {
  if (props.activeTab === '定向发放管理') {
    return useReleaseGridColumns();
  } else if (props.activeTab === '使用记录') {
    return useUseGridColumns();
  }
  return useGridColumns();
});

const gridKeyField = computed(() => {
  if (props.activeTab === '定向发放管理') {
    return 'releaseId';
  } else if (props.activeTab === '使用记录') {
    return 'useId';
  }
  return 'packageId';
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: gridKeyField.value,
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

// 监听activeTab变化，更新Grid的columns和keyField
watch(
  () => props.activeTab,
  () => {
    // 更新表格列配置
    gridApi.setColumns(gridColumns.value);
    // 更新rowConfig的keyField
    gridApi.setConfig({
      rowConfig: {
        keyField: gridKeyField.value,
        isHover: true,
      },
    });
  },
);

// 现在设置监听activeTab变化的watch函数，因为gridApi已经初始化
activeTabWatch = watch(
  () => props.activeTab,
  (newTab) => {
    if (newTab === '定向发放管理') {
      dataObj.apilist = releaseDataList();
      dataObj.total = releaseDataList().length;
    } else if (newTab === '使用记录') {
      dataObj.apilist = useDataList();
      dataObj.total = useDataList().length;
    } else {
      dataObj.apilist = dataList();
      dataObj.total = dataList().length;
    }
    dataObj.currentPage = 1;
    dataObj.list = [];
    activeName.value = '全部'; // 重置筛选状态为全部
    gridApi.query();
  },
);

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 根据activeTab生成不同的标签数据
const tabsData = computed(() => {
  if (props.activeTab === '定向发放管理') {
    return [
      { label: '全部' },
      { label: '未开始' },
      { label: '进行中' },
      { label: '已完成' },
      { label: '已暂停' },
    ];
  } else if (props.activeTab === '使用记录') {
    return [
      { label: '全部' },
      { label: '已使用' },
      { label: '未使用' },
      { label: '已过期' },
    ];
  }
  return [{ label: '全部' }, { label: '上架' }, { label: '下架' }];
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (props.activeTab === '定向发放管理') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '已完成': {
        count = dataObj.apilist.filter(
          (v) => v.releaseStatus === '已完成',
        ).length;
        break;
      }
      case '已暂停': {
        count = dataObj.apilist.filter(
          (v) => v.releaseStatus === '已暂停',
        ).length;
        break;
      }
      case '未开始': {
        count = dataObj.apilist.filter(
          (v) => v.releaseStatus === '未开始',
        ).length;
        break;
      }
      case '进行中': {
        count = dataObj.apilist.filter(
          (v) => v.releaseStatus === '进行中',
        ).length;
        break;
      }
      // No default
    }
  } else if (props.activeTab === '使用记录') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '已使用': {
        count = dataObj.apilist.filter((v) => v.useStatus === '已使用').length;
        break;
      }
      case '已过期': {
        count = dataObj.apilist.filter((v) => v.useStatus === '已过期').length;
        break;
      }
      case '未使用': {
        count = dataObj.apilist.filter((v) => v.useStatus === '未使用').length;
        break;
      }
      // No default
    }
  } else {
    switch (item.label) {
      case '上架': {
        count = dataObj.apilist.filter((v) => v.status === '上架').length;
        break;
      }
      case '下架': {
        count = dataObj.apilist.filter((v) => v.status === '下架').length;
        break;
      }
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      // No default
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

// 处理上下架状态切换
const handleToggleStatus = async (row) => {
  const currentStatus = row.status;
  const newStatus = currentStatus === '上架' ? '下架' : '上架';
  const confirmMessage =
    currentStatus === '上架' ? '确定要下架该券包吗？' : '确定要上架该券包吗？';

  try {
    await ElMessageBox.confirm(confirmMessage, '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElLoading.service({
      text: `正在${newStatus}券包...`,
    });

    // 更新数据中的状态
    dataObj.apilist.forEach((v, i) => {
      if (v.packageId === row.packageId) {
        dataObj.apilist[i].status = newStatus;
      }
    });

    ElMessage.success(`${newStatus}成功`);
    handleRefresh();

    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 暂停发放
const handlePause = async (row) => {
  try {
    await ElMessageBox.confirm('确定要暂停该发放吗？', '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElLoading.service({
      text: '正在暂停发放...',
    });

    // 更新数据中的状态
    dataObj.apilist.forEach((v, i) => {
      if (v.releaseId === row.releaseId) {
        dataObj.apilist[i].releaseStatus = '已暂停';
      }
    });

    ElMessage.success('暂停成功');
    handleRefresh();

    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 查看领取用户
const userList = ref([]);
const userDrawerRef = ref(null);
const userDrawerTitle = ref('');
const handleViewUsers = (row) => {
  userList.value = receiveUserList(row.releaseId);
  userDrawerTitle.value = `查看领取用户 - ${row.packageSelection}`;
  userDrawerRef.value.open();
};

// 查看关联订单
const orderDetail = ref({});
const orderDrawerRef = ref(null);
const orderDrawerTitle = ref('');
const handleViewOrder = (row) => {
  orderDetail.value = orderDetailList(row.useId)[0];
  orderDrawerTitle.value = `查看关联订单 - ${row.useId}`;
  orderDrawerRef.value.open();
};

// 下载使用记录PDF
const handleDownloadPDF = (row) => {
  // 模拟下载功能
  ElMessage.success(`正在下载使用记录 ${row.useId} 的PDF文件`);
};

// 处理包含优惠券点击
const handleCouponNameClick = (couponName) => {
  filterCouponName.value =
    filterCouponName.value === couponName ? '' : couponName;
  gridApi.query();
};

/** 取消包含优惠券筛选（筛选标签关闭按钮） */
const handleCancelCouponNameFilter = () => {
  filterCouponName.value = '';
  gridApi.query();
};

// 处理适用范围点击
const handleApplyScopeClick = (applyScope) => {
  filterApplyScope.value =
    filterApplyScope.value === applyScope ? '' : applyScope;
  gridApi.query();
};

/** 取消适用范围筛选（筛选标签关闭按钮） */
const handleCancelApplyScopeFilter = () => {
  filterApplyScope.value = '';
  gridApi.query();
};

// 处理券包选择点击
const handlePackageSelectionClick = (packageSelection) => {
  filterPackageSelection.value =
    filterPackageSelection.value === packageSelection ? '' : packageSelection;
  gridApi.query();
};

/** 取消券包选择筛选（筛选标签关闭按钮） */
const handleCancelPackageSelectionFilter = () => {
  filterPackageSelection.value = '';
  gridApi.query();
};

// 处理定向用户标签点击
const handleTargetedUserTagClick = (targetedUserTag) => {
  filterTargetedUserTag.value =
    filterTargetedUserTag.value === targetedUserTag ? '' : targetedUserTag;
  gridApi.query();
};

/** 取消定向用户标签筛选（筛选标签关闭按钮） */
const handleCancelTargetedUserTagFilter = () => {
  filterTargetedUserTag.value = '';
  gridApi.query();
};

// 处理发放方式点击
const handleReleaseWayClick = (releaseWay) => {
  filterReleaseWay.value =
    filterReleaseWay.value === releaseWay ? '' : releaseWay;
  gridApi.query();
};

/** 取消发放方式筛选（筛选标签关闭按钮） */
const handleCancelReleaseWayFilter = () => {
  filterReleaseWay.value = '';
  gridApi.query();
};

// 处理券包名称点击
const handlePackageNameClick = (packageName) => {
  filterPackageName.value =
    filterPackageName.value === packageName ? '' : packageName;
  gridApi.query();
};

/** 取消券包名称筛选（筛选标签关闭按钮） */
const handleCancelPackageNameFilter = () => {
  filterPackageName.value = '';
  gridApi.query();
};

// 处理使用车场点击
const handleLotNameClick = (lotName) => {
  filterLotName.value = filterLotName.value === lotName ? '' : lotName;
  gridApi.query();
};

/** 取消使用车场筛选（筛选标签关闭按钮） */
const handleCancelLotNameFilter = () => {
  filterLotName.value = '';
  gridApi.query();
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
        props.activeTab === '定向发放管理'
          ? `${dataObj.detailObj.packageSelection}详情`
          : props.activeTab === '使用记录'
            ? `${dataObj.detailObj.useId}详情`
            : `${dataObj.detailObj.packageName}详情`
      "
      :data="dataObj.detailObj"
      :fields="
        props.activeTab === '定向发放管理'
          ? releaseDetailFields
          : props.activeTab === '使用记录'
            ? useDetailFields
            : detailFields
      "
    />
    <!-- 领取用户抽屉 -->
    <UserDrawer
      ref="userDrawerRef"
      :user-list="userList"
      :title="userDrawerTitle"
      @close="() => {}"
    />
    <!-- 关联订单抽屉 -->
    <OrderDrawer
      ref="orderDrawerRef"
      :order-detail="orderDetail"
      :title="orderDrawerTitle"
      @close="() => {}"
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
          <!-- 券包管理标签页的筛选标签 -->
          <template v-if="props.activeTab === '券包管理'">
            <!-- 包含优惠券筛选标签 -->
            <el-tag
              v-if="filterCouponName"
              type="primary"
              closable
              @close="handleCancelCouponNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              包含优惠券：{{ filterCouponName }}
            </el-tag>
            <!-- 适用范围筛选标签 -->
            <el-tag
              v-if="filterApplyScope"
              type="primary"
              closable
              @close="handleCancelApplyScopeFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              适用范围：{{ filterApplyScope }}
            </el-tag>
            <!-- 券包名称筛选标签 -->
            <el-tag
              v-if="filterPackageName"
              type="primary"
              closable
              @close="handleCancelPackageNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              券包名称：{{ filterPackageName }}
            </el-tag>
          </template>
          <!-- 定向发放管理标签页的筛选标签 -->
          <template v-if="props.activeTab === '定向发放管理'">
            <!-- 券包选择筛选标签 -->
            <el-tag
              v-if="filterPackageSelection"
              type="primary"
              closable
              @close="handleCancelPackageSelectionFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              券包选择：{{ filterPackageSelection }}
            </el-tag>
            <!-- 定向用户标签筛选标签 -->
            <el-tag
              v-if="filterTargetedUserTag"
              type="primary"
              closable
              @close="handleCancelTargetedUserTagFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              定向用户标签：{{ filterTargetedUserTag }}
            </el-tag>
            <!-- 发放方式筛选标签 -->
            <el-tag
              v-if="filterReleaseWay"
              type="primary"
              closable
              @close="handleCancelReleaseWayFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              发放方式：{{ filterReleaseWay }}
            </el-tag>
          </template>
          <!-- 使用记录标签页的筛选标签 -->
          <template v-if="props.activeTab === '使用记录'">
            <!-- 券包名称筛选标签 -->
            <el-tag
              v-if="filterPackageName"
              type="primary"
              closable
              @close="handleCancelPackageNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              券包名称：{{ filterPackageName }}
            </el-tag>
            <!-- 使用车场筛选标签 -->
            <el-tag
              v-if="filterLotName"
              type="primary"
              closable
              @close="handleCancelLotNameFilter"
              style="height: 32px; margin: 4px 0; line-height: 32px"
            >
              使用车场：{{ filterLotName }}
            </el-tag>
          </template>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="Download"
            @click="handleExport"
          />
          <IconButton
            content="批量删除"
            icon-name="Delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="Search"
            @click="handleSerachShow"
          />
          <IconButton
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
      <template #id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{
            props.activeTab === '定向发放管理'
              ? row.releaseId
              : props.activeTab === '使用记录'
                ? row.useId
                : row.packageId
          }}
        </el-text>
      </template>
      <!-- 券包名称插槽 -->
      <template #packageName="{ row }">
        <el-text
          @click="handlePackageNameClick(row.packageName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.packageName }}
        </el-text>
      </template>
      <!-- 包含优惠券插槽 -->
      <template #couponName="{ row }">
        <el-text
          @click="handleCouponNameClick(row.couponName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.couponName }}
        </el-text>
      </template>
      <!-- 适用范围插槽 -->
      <template #applyScope="{ row }">
        <el-text
          @click="handleApplyScopeClick(row.applyScope)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.applyScope }}
        </el-text>
      </template>
      <!-- 券包选择插槽 -->
      <template #packageSelection="{ row }">
        <el-text
          @click="handlePackageSelectionClick(row.packageSelection)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.packageSelection }}
        </el-text>
      </template>
      <!-- 定向用户标签插槽 -->
      <template #targetedUserTag="{ row }">
        <el-text
          @click="handleTargetedUserTagClick(row.targetedUserTag)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.targetedUserTag }}
        </el-text>
      </template>
      <!-- 发放方式插槽 -->
      <template #releaseWay="{ row }">
        <el-text
          @click="handleReleaseWayClick(row.releaseWay)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.releaseWay }}
        </el-text>
      </template>
      <!-- 使用车场插槽 -->
      <template #lotName="{ row }">
        <el-text
          @click="handleLotNameClick(row.lotName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.lotName }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="
            props.activeTab === '定向发放管理'
              ? row.releaseStatus === '已完成'
                ? 'success'
                : row.releaseStatus === '进行中'
                  ? 'warning'
                  : row.releaseStatus === '已暂停'
                    ? 'danger'
                    : 'info'
              : props.activeTab === '使用记录'
                ? row.useStatus === '已使用'
                  ? 'success'
                  : row.useStatus === '未使用'
                    ? 'warning'
                    : 'danger'
                : row.status === '上架'
                  ? 'success'
                  : 'danger'
          "
        >
          {{
            props.activeTab === '定向发放管理'
              ? row.releaseStatus
              : props.activeTab === '使用记录'
                ? row.useStatus
                : row.status
          }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮 - 所有标签页都显示 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />

          <!-- 券包管理标签页的按钮 -->
          <template v-if="props.activeTab === '券包管理'">
            <IconButton
              content="编辑"
              icon-name="Edit"
              @click="handleEdit(row)"
            />
            <!-- 上下架按钮 -->
            <IconButton
              :content="row.status === '上架' ? '下架' : '上架'"
              :icon-name="row.status === '上架' ? 'Bottom' : 'Top'"
              :color="row.status === '上架' ? '#E6A23C' : '#67C23A'"
              @click="handleToggleStatus(row)"
            />
          </template>

          <!-- 定向发放管理标签页的按钮 -->
          <template v-else-if="props.activeTab === '定向发放管理'">
            <!-- 暂停按钮 - 仅进行中状态可点击 -->
            <IconButton
              content="暂停"
              icon-name="VideoPause"
              :disabled="row.releaseStatus !== '进行中'"
              @click="handlePause(row)"
            />
            <!-- 查看按钮 -->
            <IconButton
              content="查看"
              icon-name="Reading"
              @click="handleViewUsers(row)"
            />
          </template>

          <!-- 使用记录查询标签页的按钮 -->
          <template v-else-if="props.activeTab === '使用记录'">
            <!-- 下载按钮 -->
            <IconButton
              content="下载"
              icon-name="Download"
              @click="handleDownloadPDF(row)"
            />
            <!-- 关联订单按钮 -->
            <IconButton
              content="关联订单"
              icon-name="Link"
              @click="handleViewOrder(row)"
            />
          </template>
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
          <span v-if="props.activeTab === '定向发放管理'">
            本页统计：发放记录数量: {{ dataObj.list.length }}; 未开始:
            {{
              dataObj.list.filter((item) => item.releaseStatus === '未开始')
                .length
            }}; 进行中:
            {{
              dataObj.list.filter((item) => item.releaseStatus === '进行中')
                .length
            }}; 已完成:
            {{
              dataObj.list.filter((item) => item.releaseStatus === '已完成')
                .length
            }}; 已暂停:
            {{
              dataObj.list.filter((item) => item.releaseStatus === '已暂停')
                .length
            }}
          </span>
          <span v-else-if="props.activeTab === '使用记录'">
            本页统计：使用记录数量: {{ dataObj.list.length }}; 已使用:
            {{
              dataObj.list.filter((item) => item.useStatus === '已使用').length
            }}; 未使用:
            {{
              dataObj.list.filter((item) => item.useStatus === '未使用').length
            }}; 已过期:
            {{
              dataObj.list.filter((item) => item.useStatus === '已过期').length
            }}
          </span>
          <span v-else>
            本页统计：券包数量: {{ dataObj.list.length }}; 上架:
            {{ dataObj.list.filter((item) => item.status === '上架').length }};
            下架:
            {{ dataObj.list.filter((item) => item.status === '下架').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>{{
            props.activeTab === '定向发放管理'
              ? releaseTextObj.total
              : props.activeTab === '使用记录'
                ? useTextObj.total
                : textObj.total
          }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
