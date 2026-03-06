<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import IconButton from '#/components/common/IconButton.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  exchangeManagementDataList,
  exchangeManagementDetailFields,
  exchangeManagementTextObj,
  getChangeTypeTagType,
  getCouponStatusTagType,
  getExchangeStatusTagType,
  getImportStatusTagType,
  getStatusTagType,
  manualPointsImportDataList,
  manualPointsImportDetailFields,
  manualPointsImportTextObj,
  textObj,
  useExchangeManagementFormSchema,
  useExchangeManagementGridColumns,
  useFormSchema,
  useGridColumns,
  useManualPointsImportFormSchema,
  useManualPointsImportGridColumns,
  userPointsDataList,
  userPointsDetailFields,
  userPointsTextObj,
  useUserPointsFormSchema,
  useUserPointsGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  activeTab: {
    type: String,
    default: '积分规则',
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
  switch (props.activeTab) {
    case '用户积分查询': {
      return formData.value?.userId
        ? userPointsTextObj.editText
        : userPointsTextObj.addText;
    }
    case '积分兑换管理': {
      return formData.value?.exchangeRecordId
        ? exchangeManagementTextObj.editText
        : exchangeManagementTextObj.addText;
    }
    case '积分规则': {
      return formData.value?.ruleId ? textObj.editText : textObj.addText;
    }
    default: {
      return formData.value?.importId
        ? manualPointsImportTextObj.editText
        : manualPointsImportTextObj.addText;
    }
  }
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
const [UserPointsDetailDrawer, userPointsDetailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    userPointsDetailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
const [ImportDrawer, importDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    importDrawerApi.close();
  },
  async onConfirm() {
    if (!importFormRef.value) return;

    try {
      await importFormRef.value.validate();
      // 这里可以添加保存逻辑
      // console.log('Import data:', importFormData);
      // 关闭抽屉
      importDrawerApi.close();
      // 刷新表格
      handleRefresh();
      // 显示成功消息
      ElMessage.success('导入成功');
    } catch {
      // console.error('表单验证失败:', error);
      ElMessage.error('请检查必填字段');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 重置表单
      importFormRef.value?.resetFields();
      Object.assign(importFormData, {
        selectUserName: '',
        importPoints: 1,
        importReason: '',
        importType: '单个导入',
        batchImportFile: '',
      });
    }
  },
});

const importFormRef = ref(null);
const importFormData = reactive({
  selectUserName: '',
  importPoints: 1,
  importReason: '',
  importType: '单个导入',
  batchImportFile: '',
});

// 当前用户信息
const currentUserId = ref('');
const currentUserName = ref('');

// 积分变动明细数据
const pointsDetailData = ref([
  {
    recordId: 'REC001',
    changeType: '增加',
    changePoints: 50,
    changeTime: '2025-02-05 10:30:50',
    reason: '首次注册送积分',
    operator: '系统',
  },
  {
    recordId: 'REC002',
    changeType: '增加',
    changePoints: 10,
    changeTime: '2025-02-06 09:45:20',
    reason: '每日登录送积分',
    operator: '系统',
  },
  {
    recordId: 'REC003',
    changeType: '减少',
    changePoints: 20,
    changeTime: '2025-02-06 14:20:15',
    reason: '兑换优惠券',
    operator: '用户',
  },
  {
    recordId: 'REC004',
    changeType: '增加',
    changePoints: 30,
    changeTime: '2025-02-07 11:10:30',
    reason: '首次停车送积分',
    operator: '系统',
  },
  {
    recordId: 'REC005',
    changeType: '增加',
    changePoints: 15,
    changeTime: '2025-02-07 16:40:15',
    reason: '评价停车场送积分',
    operator: '系统',
  },
]);

// 用户选项数据
const userOptions = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '孙七', value: '孙七' },
  { label: '周八', value: '周八' },
  { label: '吴九', value: '吴九' },
  { label: '郑十', value: '郑十' },
  { label: '王十一', value: '王十一' },
  { label: '李十二', value: '李十二' },
];

// 收藏状态映射
const collectedMap = ref(new Map());

const importRules = {
  selectUserName: [
    { required: true, message: '请选择用户', trigger: 'change' },
  ],
  importPoints: [
    { required: true, message: '请输入积分数量', trigger: 'blur' },
  ],
  importReason: [
    { required: true, message: '请输入导入原因', trigger: 'blur' },
  ],
  importType: [
    { required: true, message: '请选择导入方式', trigger: 'change' },
  ],
};

/** 处理文件上传 */
function handleFileChange(file) {
  importFormData.batchImportFile = file.raw;
}
const currentFormSchema = computed(() => {
  switch (props.activeTab) {
    case '用户积分查询': {
      return useUserPointsFormSchema();
    }
    case '积分兑换管理': {
      return useExchangeManagementFormSchema();
    }
    case '积分规则': {
      return useFormSchema();
    }
    default: {
      return useManualPointsImportFormSchema();
    }
  }
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
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    switch (props.activeTab) {
      case '用户积分查询': {
        if (
          formDrawerApi.sharedData.payload.title === userPointsTextObj.addText
        ) {
          dataObj.apilist.push(obj);
        } else {
          dataObj.apilist.forEach((v, i) => {
            if (v.userId === formData.value?.userId) {
              dataObj.apilist[i] = obj;
            }
          });
        }

        break;
      }
      case '积分兑换管理': {
        if (
          formDrawerApi.sharedData.payload.title ===
          exchangeManagementTextObj.addText
        ) {
          dataObj.apilist.push(obj);
        } else {
          dataObj.apilist.forEach((v, i) => {
            if (v.exchangeRecordId === formData.value?.exchangeRecordId) {
              dataObj.apilist[i] = obj;
            }
          });
        }

        break;
      }
      case '积分规则': {
        if (formDrawerApi.sharedData.payload.title === textObj.addText) {
          dataObj.apilist.push(obj);
        } else {
          dataObj.apilist.forEach((v, i) => {
            if (v.ruleId === formData.value?.ruleId) {
              dataObj.apilist[i] = obj;
            }
          });
        }

        break;
      }
      default: {
        if (
          formDrawerApi.sharedData.payload.title ===
          manualPointsImportTextObj.addText
        ) {
          dataObj.apilist.push(obj);
        } else {
          dataObj.apilist.forEach((v, i) => {
            if (v.importId === formData.value?.importId) {
              dataObj.apilist[i] = obj;
            }
          });
        }
      }
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (props.activeTab === '积分规则' && formData.value?.ruleId) {
        await formApi.setValues(formData.value);
      } else if (props.activeTab === '用户积分查询' && formData.value?.userId) {
        await formApi.setValues(formData.value);
      } else if (
        props.activeTab === '积分兑换管理' &&
        formData.value?.exchangeRecordId
      ) {
        await formApi.setValues(formData.value);
      } else if (
        props.activeTab === '人工积分导入' &&
        formData.value?.importId
      ) {
        await formApi.setValues(formData.value);
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
  switch (props.activeTab) {
    case '用户积分查询': {
      exportToExcel(
        dataObj.apilist,
        userPointsTextObj.excelName,
        userPointsTextObj.excelAllName,
      );

      break;
    }
    case '积分兑换管理': {
      exportToExcel(
        dataObj.apilist,
        exchangeManagementTextObj.excelName,
        exchangeManagementTextObj.excelAllName,
      );

      break;
    }
    case '积分规则': {
      exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);

      break;
    }
    default: {
      exportToExcel(
        dataObj.apilist,
        manualPointsImportTextObj.excelName,
        manualPointsImportTextObj.excelAllName,
      );
    }
  }
}

/** 创建角色 */
function handleCreate() {
  switch (props.activeTab) {
    case '用户积分查询': {
      formDrawerApi
        .setData({
          title: userPointsTextObj.addText,
        })
        .open();

      break;
    }
    case '积分兑换管理': {
      formDrawerApi
        .setData({
          title: exchangeManagementTextObj.addText,
        })
        .open();

      break;
    }
    case '积分规则': {
      formDrawerApi
        .setData({
          title: textObj.addText,
        })
        .open();

      break;
    }
    default: {
      formDrawerApi
        .setData({
          title: manualPointsImportTextObj.addText,
        })
        .open();
    }
  }
}

/** 编辑角色 */
function handleEdit(row) {
  switch (props.activeTab) {
    case '用户积分查询': {
      formDrawerApi
        .setData({
          title: userPointsTextObj.editText,
          ...row,
        })
        .open();

      break;
    }
    case '积分兑换管理': {
      formDrawerApi
        .setData({
          title: exchangeManagementTextObj.editText,
          ...row,
        })
        .open();

      break;
    }
    case '积分规则': {
      formDrawerApi
        .setData({
          title: textObj.editText,
          ...row,
        })
        .open();

      break;
    }
    default: {
      formDrawerApi
        .setData({
          title: manualPointsImportTextObj.editText,
          ...row,
        })
        .open();
    }
  }
}
async function handleDelete(row) {
  switch (props.activeTab) {
    case '用户积分查询': {
      const loadingInstance = ElLoading.service({
        text: $t('ui.actionMessage.deleting', [row.userName]),
      });
      try {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => v.userId !== row.userId,
        );
        ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.userName]));
        handleRefresh();
      } finally {
        loadingInstance.close();
      }

      break;
    }
    case '积分兑换管理': {
      const loadingInstance = ElLoading.service({
        text: $t('ui.actionMessage.deleting', [row.exchangeProductName]),
      });
      try {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => v.exchangeRecordId !== row.exchangeRecordId,
        );
        ElMessage.success(
          $t('ui.actionMessage.deleteSuccess', [row.exchangeProductName]),
        );
        handleRefresh();
      } finally {
        loadingInstance.close();
      }

      break;
    }
    case '积分规则': {
      const loadingInstance = ElLoading.service({
        text: $t('ui.actionMessage.deleting', [row.ruleName]),
      });
      try {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => v.ruleId !== row.ruleId,
        );
        ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.ruleName]));
        handleRefresh();
      } finally {
        loadingInstance.close();
      }

      break;
    }
    default: {
      const loadingInstance = ElLoading.service({
        text: $t('ui.actionMessage.deleting', [row.selectUserName]),
      });
      try {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => v.importId !== row.importId,
        );
        ElMessage.success(
          $t('ui.actionMessage.deleteSuccess', [row.selectUserName]),
        );
        handleRefresh();
      } finally {
        loadingInstance.close();
      }
    }
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    switch (props.activeTab) {
      case '用户积分查询': {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => !checkedIds.value.includes(v.userId),
        );

        break;
      }
      case '积分兑换管理': {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => !checkedIds.value.includes(v.exchangeRecordId),
        );

        break;
      }
      case '积分规则': {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => !checkedIds.value.includes(v.ruleId),
        );

        break;
      }
      default: {
        dataObj.apilist = dataObj.apilist.filter(
          (v) => !checkedIds.value.includes(v.importId),
        );
      }
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
  switch (props.activeTab) {
    case '用户积分查询': {
      checkedIds.value = records.map((item) => item.userId);

      break;
    }
    case '积分兑换管理': {
      checkedIds.value = records.map((item) => item.exchangeRecordId);

      break;
    }
    case '积分规则': {
      checkedIds.value = records.map((item) => item.ruleId);

      break;
    }
    default: {
      checkedIds.value = records.map((item) => item.importId);
    }
  }
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  searchParams: {},
});

const activeName = ref('全部');

// 筛选变量
const filterTriggerType = ref(''); // 触发类型筛选
const filterUserName = ref(''); // 用户姓名筛选
const filterChangeType = ref(''); // 变动类型筛选
const filterApplyScope = ref(''); // 适用范围筛选
const filterImportType = ref(''); // 导入方式筛选
const filterImportReason = ref(''); // 导入原因筛选

// 初始化数据
function initData() {
  switch (props.activeTab) {
    case '用户积分查询': {
      dataObj.apilist = userPointsDataList();
      dataObj.total = userPointsDataList().length;

      break;
    }
    case '积分兑换管理': {
      dataObj.apilist = exchangeManagementDataList();
      dataObj.total = exchangeManagementDataList().length;

      break;
    }
    case '积分规则': {
      dataObj.apilist = dataList();
      dataObj.total = dataList().length;

      break;
    }
    default: {
      dataObj.apilist = manualPointsImportDataList();
      dataObj.total = manualPointsImportDataList().length;
    }
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

  // 根据activeName和筛选变量筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    switch (props.activeTab) {
      case '人工积分导入': {
        switch (activeName.value) {
          case '失败': {
            statusMatch = v.importStatus === '失败';
            break;
          }
          case '成功': {
            statusMatch = v.importStatus === '成功';
            break;
          }
          case '部分成功': {
            statusMatch = v.importStatus === '部分成功';
            break;
          }
        }

        break;
      }
      case '用户积分查询': {
        switch (activeName.value) {
          case '减少': {
            statusMatch = v.changeType === '减少';
            break;
          }
          case '增加': {
            statusMatch = v.changeType === '增加';
            break;
          }
        }

        break;
      }
      case '积分兑换管理': {
        switch (activeName.value) {
          case '处理中': {
            statusMatch = v.exchangeStatus === '处理中';
            break;
          }
          case '已取消': {
            statusMatch = v.exchangeStatus === '已取消';
            break;
          }
          case '已完成': {
            statusMatch = v.exchangeStatus === '已完成';
            break;
          }
        }

        break;
      }
      case '积分规则': {
        switch (activeName.value) {
          case '启用': {
            statusMatch = v.enableStatus === '启用';
            break;
          }
          case '禁用': {
            statusMatch = v.enableStatus === '禁用';
            break;
          }
        }

        break;
      }
      // No default
    }

    // 触发类型筛选
    const triggerTypeMatch =
      !filterTriggerType.value || v.triggerType === filterTriggerType.value;

    // 用户姓名筛选
    const userNameMatch =
      !filterUserName.value || v.userName === filterUserName.value;

    // 变动类型筛选
    const changeTypeMatch =
      !filterChangeType.value || v.changeType === filterChangeType.value;

    // 适用范围筛选
    const applyScopeMatch =
      !filterApplyScope.value || v.applyScope === filterApplyScope.value;

    // 导入方式筛选
    const importTypeMatch =
      !filterImportType.value || v.importType === filterImportType.value;

    // 导入原因筛选
    const importReasonMatch =
      !filterImportReason.value || v.importReason === filterImportReason.value;

    // 搜索条件筛选
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        searchMatch =
          typeof value === 'string'
            ? searchMatch && v[key]?.toString().includes(value)
            : searchMatch && v[key] === value;
      }
    });

    return (
      statusMatch &&
      triggerTypeMatch &&
      userNameMatch &&
      changeTypeMatch &&
      applyScopeMatch &&
      importTypeMatch &&
      importReasonMatch &&
      searchMatch
    );
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const queryFormSchema = computed(() => {
  switch (props.activeTab) {
    case '用户积分查询': {
      return useUserPointsFormSchema().map((v) => {
        delete v.rules;
        return {
          ...v,
        };
      });
    }
    case '积分兑换管理': {
      return useExchangeManagementFormSchema().map((v) => {
        delete v.rules;
        return {
          ...v,
        };
      });
    }
    case '积分规则': {
      return useFormSchema().map((v) => {
        delete v.rules;
        return {
          ...v,
        };
      });
    }
    default: {
      return useManualPointsImportFormSchema().map((v) => {
        delete v.rules;
        return {
          ...v,
        };
      });
    }
  }
});

const [QueryForm] = useVbenForm({
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

// 搜索表单查询
function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
  drawerApi.close();
}

const gridColumns = computed(() => {
  switch (props.activeTab) {
    case '用户积分查询': {
      return useUserPointsGridColumns();
    }
    case '积分兑换管理': {
      return useExchangeManagementGridColumns();
    }
    case '积分规则': {
      return useGridColumns();
    }
    default: {
      return useManualPointsImportGridColumns();
    }
  }
});

const gridKeyField = computed(() => {
  switch (props.activeTab) {
    case '用户积分查询': {
      return 'userId';
    }
    case '积分兑换管理': {
      return 'exchangeRecordId';
    }
    case '积分规则': {
      return 'ruleId';
    }
    default: {
      return 'importId';
    }
  }
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

// 监听activeTab变化，更新数据
watch(
  () => props.activeTab,
  () => {
    initData();
    gridApi.query();
  },
  { immediate: true },
);

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

// 监听activeTab变化，更新QueryForm的schema
watch(
  () => props.activeTab,
  () => {
    // 重新创建QueryForm实例
    // 注意：这里需要重新创建，因为useVbenForm是一个组合式函数，不能直接更新schema
    // 但由于我们使用的是响应式的schema，这里应该会自动更新
  },
);

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 根据当前标签页动态生成tabsData
const tabsData = computed(() => {
  switch (props.activeTab) {
    case '用户积分查询': {
      return [{ label: '全部' }, { label: '增加' }, { label: '减少' }];
    }
    case '积分兑换管理': {
      return [
        { label: '全部' },
        { label: '已完成' },
        { label: '处理中' },
        { label: '已取消' },
      ];
    }
    case '积分规则': {
      return [{ label: '全部' }, { label: '启用' }, { label: '禁用' }];
    }
    default: {
      return [
        { label: '全部' },
        { label: '成功' },
        { label: '失败' },
        { label: '部分成功' },
      ];
    }
  }
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (props.activeTab) {
    case '用户积分查询': {
      switch (item.label) {
        case '全部': {
          count = dataObj.apilist.length;
          break;
        }
        case '减少': {
          // 统计changeType为'减少'的数据
          count = dataObj.apilist.filter((v) => v.changeType === '减少').length;
          break;
        }
        case '增加': {
          // 统计changeType为'增加'的数据
          count = dataObj.apilist.filter((v) => v.changeType === '增加').length;
          break;
        }
        // No default
      }

      break;
    }
    case '积分兑换管理': {
      switch (item.label) {
        case '全部': {
          count = dataObj.apilist.length;
          break;
        }
        case '处理中': {
          // 统计exchangeStatus为'处理中'的数据
          count = dataObj.apilist.filter(
            (v) => v.exchangeStatus === '处理中',
          ).length;
          break;
        }
        case '已取消': {
          // 统计exchangeStatus为'已取消'的数据
          count = dataObj.apilist.filter(
            (v) => v.exchangeStatus === '已取消',
          ).length;
          break;
        }
        case '已完成': {
          // 统计exchangeStatus为'已完成'的数据
          count = dataObj.apilist.filter(
            (v) => v.exchangeStatus === '已完成',
          ).length;
          break;
        }
        // No default
      }

      break;
    }
    case '积分规则': {
      switch (item.label) {
        case '全部': {
          count = dataObj.apilist.length;
          break;
        }
        case '启用': {
          // 统计enableStatus为'启用'的数据
          count = dataObj.apilist.filter(
            (v) => v.enableStatus === '启用',
          ).length;
          break;
        }
        case '禁用': {
          // 统计enableStatus为'禁用'的数据
          count = dataObj.apilist.filter(
            (v) => v.enableStatus === '禁用',
          ).length;
          break;
        }
        // No default
      }

      break;
    }
    default: {
      switch (item.label) {
        case '全部': {
          count = dataObj.apilist.length;
          break;
        }
        case '失败': {
          // 统计importStatus为'失败'的数据
          count = dataObj.apilist.filter(
            (v) => v.importStatus === '失败',
          ).length;
          break;
        }
        case '成功': {
          // 统计importStatus为'成功'的数据
          count = dataObj.apilist.filter(
            (v) => v.importStatus === '成功',
          ).length;
          break;
        }
        case '部分成功': {
          // 统计importStatus为'部分成功'的数据
          count = dataObj.apilist.filter(
            (v) => v.importStatus === '部分成功',
          ).length;
          break;
        }
        // No default
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

// 处理触发类型点击
function handleTriggerTypeClick(triggerType) {
  filterTriggerType.value =
    filterTriggerType.value === triggerType ? '' : triggerType;
  gridApi.query();
}

// 取消触发类型筛选
function handleCancelTriggerTypeFilter() {
  filterTriggerType.value = '';
  gridApi.query();
}

// 处理用户姓名点击
function handleUserNameClick(userName) {
  filterUserName.value = filterUserName.value === userName ? '' : userName;
  gridApi.query();
}

// 取消用户姓名筛选
function handleCancelUserNameFilter() {
  filterUserName.value = '';
  gridApi.query();
}

// 处理变动类型点击
function handleChangeTypeClick(changeType) {
  filterChangeType.value =
    filterChangeType.value === changeType ? '' : changeType;
  gridApi.query();
}

// 取消变动类型筛选
function handleCancelChangeTypeFilter() {
  filterChangeType.value = '';
  gridApi.query();
}

// 处理适用范围点击
function handleApplyScopeClick(applyScope) {
  filterApplyScope.value =
    filterApplyScope.value === applyScope ? '' : applyScope;
  gridApi.query();
}

// 取消适用范围筛选
function handleCancelApplyScopeFilter() {
  filterApplyScope.value = '';
  gridApi.query();
}

// 处理导入方式点击
function handleImportTypeClick(importType) {
  filterImportType.value =
    filterImportType.value === importType ? '' : importType;
  gridApi.query();
}

// 取消导入方式筛选
function handleCancelImportTypeFilter() {
  filterImportType.value = '';
  gridApi.query();
}

// 处理导入原因点击
function handleImportReasonClick(importReason) {
  filterImportReason.value =
    filterImportReason.value === importReason ? '' : importReason;
  gridApi.query();
}

// 取消导入原因筛选
function handleCancelImportReasonFilter() {
  filterImportReason.value = '';
  gridApi.query();
}

/** 打开导入抽屉 */
function handleImport() {
  importDrawerApi.open();
}

/** 禁用积分规则 */
function handleDisable(row) {
  ElMessageBox.confirm('确定要禁用该积分规则吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      row.enableStatus = '禁用';
      handleRefresh();
      ElMessage.success('禁用成功');
    })
    .catch(() => {
      // 取消操作
    });
}

/** 下载用户积分记录 */
function handleUserPointsDownload(row) {
  // 模拟下载操作
  console.log('下载用户积分记录:', row);
  ElMessage.success('下载成功');
}

/** 查看用户积分明细 */
function handleUserPointsDetail(row) {
  // 更新当前用户信息
  currentUserId.value = row.userId;
  currentUserName.value = row.userName;
  // 打开明细抽屉
  console.log('查看用户积分明细:', row);
  userPointsDetailDrawerApi.open();
}

/** 积分兑换 */
function handleExchange(row) {
  ElMessageBox.confirm('确定要兑换该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟兑换操作
      console.log('兑换商品:', row);
      ElMessage.success('兑换成功');
    })
    .catch(() => {
      // 取消操作
    });
}

/** 收藏商品 */
function handleCollect(row) {
  // 切换收藏状态
  const isCollected = collectedMap.value.get(row.exchangeRecordId) || false;
  collectedMap.value.set(row.exchangeRecordId, !isCollected);

  // 模拟收藏操作
  console.log('收藏商品:', row);
  ElMessage.success(isCollected ? '取消收藏成功' : '收藏成功');
}

/** 下载失败明细 */
function handleImportDownload(row) {
  // 模拟下载操作
  console.log('下载失败明细:', row);
  ElMessage.success('下载成功');
}

/** 重试导入 */
function handleImportRetry(row) {
  ElMessageBox.confirm('确定要重试导入吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟重试操作
      console.log('重试导入:', row);
      ElMessage.success('重试成功');
    })
    .catch(() => {
      // 取消操作
    });
}
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
        props.activeTab === '积分规则'
          ? `${dataObj.detailObj.ruleName}详情`
          : props.activeTab === '用户积分查询'
            ? `${dataObj.detailObj.userName}详情`
            : props.activeTab === '积分兑换管理'
              ? `${dataObj.detailObj.exchangeProductName}详情`
              : `${dataObj.detailObj.selectUserName}详情`
      "
      :data="dataObj.detailObj"
      :fields="
        props.activeTab === '积分规则'
          ? detailFields
          : props.activeTab === '用户积分查询'
            ? userPointsDetailFields
            : props.activeTab === '积分兑换管理'
              ? exchangeManagementDetailFields
              : manualPointsImportDetailFields
      "
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <ImportDrawer title="人工积分导入">
      <div class="import-drawer-content">
        <el-form
          :model="importFormData"
          :rules="importRules"
          ref="importFormRef"
          label-width="100px"
        >
          <el-form-item label="用户选择" required>
            <el-select
              v-model="importFormData.selectUserName"
              placeholder="请选择用户"
            >
              <el-option
                v-for="option in userOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="积分数量" required>
            <el-input-number
              v-model="importFormData.importPoints"
              placeholder="请输入积分数量"
              :min="1"
            />
          </el-form-item>
          <el-form-item label="导入原因" required>
            <el-input
              v-model="importFormData.importReason"
              placeholder="请输入导入原因"
            />
          </el-form-item>
          <el-form-item label="导入方式" required>
            <el-select
              v-model="importFormData.importType"
              placeholder="请选择导入方式"
            >
              <el-option label="单个导入" value="单个导入" />
              <el-option label="批量导入" value="批量导入" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="批量导入文件"
            v-if="importFormData.importType === '批量导入'"
          >
            <el-upload
              class="upload-demo"
              action="#"
              :on-change="handleFileChange"
              :auto-upload="false"
              :limit="1"
              accept=".xlsx, .xls"
            >
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  请上传Excel文件，单个文件大小不超过5MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </ImportDrawer>
    <!-- 用户积分明细抽屉 -->
    <UserPointsDetailDrawer title="积分变动明细">
      <div class="user-points-detail-drawer-content">
        <el-table :data="pointsDetailData" style="width: 100%">
          <el-table-column prop="recordId" label="记录ID" min-width="120" />
          <el-table-column prop="changeType" label="变动类型" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getChangeTypeTagType(row.changeType)">
                {{ row.changeType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="changePoints"
            label="变动积分"
            min-width="100"
          />
          <el-table-column prop="changeTime" label="变动时间" min-width="180" />
          <el-table-column prop="reason" label="变动原因" min-width="150" />
          <el-table-column prop="operator" label="操作人" min-width="100" />
        </el-table>
      </div>
    </UserPointsDetailDrawer>

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
          <!-- 筛选标签 -->
          <el-tag
            v-if="filterTriggerType"
            type="primary"
            closable
            @close="handleCancelTriggerTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            触发类型：{{ filterTriggerType }}
          </el-tag>
          <el-tag
            v-if="filterUserName"
            type="success"
            closable
            @close="handleCancelUserNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            用户姓名：{{ filterUserName }}
          </el-tag>
          <el-tag
            v-if="filterChangeType"
            type="danger"
            closable
            @close="handleCancelChangeTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            变动类型：{{ filterChangeType }}
          </el-tag>
          <el-tag
            v-if="filterApplyScope"
            type="primary"
            closable
            @close="handleCancelApplyScopeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用范围：{{ filterApplyScope }}
          </el-tag>
          <el-tag
            v-if="filterImportType"
            type="warning"
            closable
            @close="handleCancelImportTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            导入方式：{{ filterImportType }}
          </el-tag>
          <el-tag
            v-if="filterImportReason"
            type="primary"
            closable
            @close="handleCancelImportReasonFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            导入原因：{{ filterImportReason }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导入"
            icon-name="Upload"
            @click="handleImport"
            v-if="props.activeTab === '人工积分导入'"
          />
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
      <template #ruleId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.ruleId }}
        </el-text>
      </template>
      <template #userId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.userId }}
        </el-text>
      </template>
      <template #enableStatus="{ row }">
        <el-tag :type="getStatusTagType(row.enableStatus)">
          {{ row.enableStatus }}
        </el-tag>
      </template>
      <template #changeType="{ row }">
        <el-tag
          :type="getChangeTypeTagType(row.changeType)"
          @click="handleChangeTypeClick(row.changeType)"
          style="cursor: pointer"
        >
          {{ row.changeType }}
        </el-tag>
      </template>
      <template #exchangeStatus="{ row }">
        <el-tag :type="getExchangeStatusTagType(row.exchangeStatus)">
          {{ row.exchangeStatus }}
        </el-tag>
      </template>
      <template #couponStatus="{ row }">
        <el-tag :type="getCouponStatusTagType(row.couponStatus)">
          {{ row.couponStatus }}
        </el-tag>
      </template>
      <template #exchangeRecordId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.exchangeRecordId }}
        </el-text>
      </template>
      <template #importId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.importId }}
        </el-text>
      </template>
      <template #importStatus="{ row }">
        <el-tag :type="getImportStatusTagType(row.importStatus)">
          {{ row.importStatus }}
        </el-tag>
      </template>

      <!-- 触发类型插槽 -->
      <template #triggerType="{ row }">
        <el-text
          @click="handleTriggerTypeClick(row.triggerType)"
          class="common-align"
          type="primary"
        >
          {{ row.triggerType }}
        </el-text>
      </template>

      <!-- 用户姓名插槽 -->
      <template #userName="{ row }">
        <el-text
          @click="handleUserNameClick(row.userName)"
          class="common-align"
          type="primary"
        >
          {{ row.userName }}
        </el-text>
      </template>

      <!-- 适用范围插槽 -->
      <template #applyScope="{ row }">
        <el-text
          @click="handleApplyScopeClick(row.applyScope)"
          class="common-align"
          type="primary"
        >
          {{ row.applyScope }}
        </el-text>
      </template>

      <!-- 导入方式插槽 -->
      <template #importType="{ row }">
        <el-text
          @click="handleImportTypeClick(row.importType)"
          class="common-align"
          type="primary"
        >
          {{ row.importType }}
        </el-text>
      </template>

      <!-- 导入原因插槽 -->
      <template #importReason="{ row }">
        <el-text
          @click="handleImportReasonClick(row.importReason)"
          class="common-align"
          type="primary"
        >
          {{ row.importReason }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 积分规则标签页操作按钮 -->
          <template v-if="props.activeTab === '积分规则'">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="编辑"
              icon-name="Edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="禁用"
              icon-name="Lock"
              @click="handleDisable(row)"
              v-if="row.enableStatus === '启用'"
            />
          </template>

          <!-- 用户积分查询标签页操作按钮 -->
          <template v-else-if="props.activeTab === '用户积分查询'">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="下载"
              icon-name="Download"
              @click="handleUserPointsDownload(row)"
            />
            <IconButton
              content="明细"
              icon-name="Document"
              @click="handleUserPointsDetail(row)"
            />
          </template>

          <!-- 积分兑换管理标签页操作按钮 -->
          <template v-else-if="props.activeTab === '积分兑换管理'">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="兑换"
              icon-name="Switch"
              @click="handleExchange(row)"
            />
            <IconButton
              content="收藏"
              icon-name="Star"
              :color="
                collectedMap.get(row.exchangeRecordId) ? '#F59E0B' : undefined
              "
              @click="handleCollect(row)"
            />
          </template>

          <!-- 人工积分导入标签页操作按钮 -->
          <template v-else-if="props.activeTab === '人工积分导入'">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
            <IconButton
              content="下载"
              icon-name="Download"
              @click="handleImportDownload(row)"
            />
            <IconButton
              content="重试"
              icon-name="Refresh"
              @click="handleImportRetry(row)"
              :disabled="row.importStatus === '成功'"
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
          <span v-if="props.activeTab === '积分规则'">
            本页统计：积分规则数量: {{ dataObj.total }}; 启用:
            {{
              dataObj.apilist.filter((v) => v.enableStatus === '启用').length
            }}; 禁用:
            {{
              dataObj.apilist.filter((v) => v.enableStatus === '禁用').length
            }}
          </span>
          <span v-else-if="props.activeTab === '用户积分查询'">
            本页统计：用户数量: {{ dataObj.total }}; 总积分:
            {{
              dataObj.apilist.reduce((sum, item) => sum + item.totalPoints, 0)
            }}; 可用积分:
            {{
              dataObj.apilist.reduce(
                (sum, item) => sum + item.availablePoints,
                0,
              )
            }}; 已过期积分:
            {{
              dataObj.apilist.reduce((sum, item) => sum + item.expiredPoints, 0)
            }}
          </span>
          <span v-else-if="props.activeTab === '积分兑换管理'">
            本页统计：兑换记录数量: {{ dataObj.total }}; 总积分:
            {{
              dataObj.apilist.reduce(
                (sum, item) => sum + item.requiredPoints,
                0,
              )
            }}; 总库存:
            {{
              dataObj.apilist.reduce(
                (sum, item) => sum + item.remainingStock,
                0,
              )
            }}; 总可用积分:
            {{
              dataObj.apilist.reduce(
                (sum, item) => sum + item.userAvailablePoints,
                0,
              )
            }}
          </span>
          <span v-else>
            本页统计：导入记录: {{ dataObj.total }}; 总积分:
            {{
              dataObj.apilist.reduce((sum, item) => sum + item.importPoints, 0)
            }}; 总成功数:
            {{
              dataObj.apilist.reduce((sum, item) => sum + item.successCount, 0)
            }}; 总失败数:
            {{ dataObj.apilist.reduce((sum, item) => sum + item.failCount, 0) }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>
            全部统计：{{
              props.activeTab === '积分规则'
                ? textObj.total
                : props.activeTab === '用户积分查询'
                  ? userPointsTextObj.total
                  : props.activeTab === '积分兑换管理'
                    ? exchangeManagementTextObj.total
                    : manualPointsImportTextObj.total
            }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
