<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  resultDataList,
  resultDetailFields,
  resultStatusTagType,
  resultTextObj,
  statusTagType,
  textObj,
  traceDataList,
  traceDetailFields,
  traceStatusTagType,
  traceTextObj,
  useFormSchema,
  useGridColumns,
  useResultFormSchema,
  useResultGridColumns,
  useTraceFormSchema,
  useTraceGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'arrears',
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
const currentTextObj = computed(() => {
  if (props.type === 'trace') {
    return traceTextObj;
  } else if (props.type === 'result') {
    return resultTextObj;
  } else {
    return textObj;
  }
});
const getTitle = computed(() => {
  return formData.value?.id
    ? currentTextObj.value.editText
    : currentTextObj.value.addText;
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
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema:
    props.type === 'trace'
      ? useTraceFormSchema()
      : props.type === 'result'
        ? useResultFormSchema()
        : useFormSchema(),
  showDefaultActions: false,
  watch: {
    'props.type': {
      handler() {
        if (props.type === 'trace') {
          formApi.setSchema(useTraceFormSchema());
        } else if (props.type === 'result') {
          formApi.setSchema(useResultFormSchema());
        } else {
          formApi.setSchema(useFormSchema());
        }
      },
      immediate: true,
    },
  },
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
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
  exportToExcel(
    dataObj.apilist,
    currentTextObj.value.excelName,
    currentTextObj.value.excelAllName,
  );
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const targetField = props.type === 'trace' ? row.arrearsNo : row.arrearsNo;
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [targetField]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [targetField]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
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
  apilist: [],
  list: [],
});

// 初始数据加载
const loadInitialData = () => {
  if (props.type === 'trace') {
    dataObj.apilist = traceDataList();
  } else if (props.type === 'result') {
    dataObj.apilist = resultDataList();
  } else {
    dataObj.apilist = dataList();
  }
  dataObj.total = dataObj.apilist.length;
  dataObj.currentPage = 1;
};

// 根据类型更新数据
const updateDataByType = () => {
  if (props.type === 'trace') {
    dataObj.apilist = traceDataList();
  } else if (props.type === 'result') {
    dataObj.apilist = resultDataList();
  } else {
    dataObj.apilist = dataList();
  }
  dataObj.total = dataObj.apilist.length;
  dataObj.currentPage = 1;
  if (gridApi) {
    gridApi.query();
  }
};

// 初始加载数据
loadInitialData();

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
    if (props.type === 'trace') {
      switch (activeName.value) {
        case '全部': {
          statusMatch = true;
          break;
        }
        case '失败': {
          statusMatch = v.traceResult === '失败';
          break;
        }
        case '已结案': {
          statusMatch = v.traceResult === '已结案';
          break;
        }
        case '待处理': {
          statusMatch = v.traceResult === '待处理';
          break;
        }
        case '成功': {
          statusMatch = v.traceResult === '成功';
          break;
        }
        // No default
      }
    } else if (props.type === 'result') {
      switch (activeName.value) {
        case '全部': {
          statusMatch = true;
          break;
        }
        case '已完成': {
          statusMatch = v.followStatus === '已完成';
          break;
        }
        case '待处理': {
          statusMatch = v.followStatus === '待处理';
          break;
        }
        case '跟踪中': {
          statusMatch = v.followStatus === '跟踪中';
          break;
        }
        // No default
      }
    } else {
      switch (activeName.value) {
        case '全部': {
          statusMatch = true;
          break;
        }
        case '已核销': {
          statusMatch = v.arrearsStatus === '已核销';
          break;
        }
        case '已追缴': {
          statusMatch = v.arrearsStatus === '已追缴';
          break;
        }
        case '未追缴': {
          statusMatch = v.arrearsStatus === '未追缴';
          break;
        }
        case '追缴中': {
          statusMatch = v.arrearsStatus === '追缴中';
          break;
        }
        // No default
      }
    }

    // 车牌号码筛选
    const carNumberMatch =
      !filterCarNumber.value || v.carNumber === filterCarNumber.value;

    // 所属车场筛选
    const lotNameMatch =
      !filterLotName.value || v.lotName === filterLotName.value;

    // 追缴方式筛选
    const traceWayMatch =
      !filterTraceWay.value || v.traceWay === filterTraceWay.value;

    // 处理措施筛选
    const disposalMeasureMatch =
      !filterDisposalMeasure.value ||
      v.disposalMeasure === filterDisposalMeasure.value;

    return (
      statusMatch &&
      carNumberMatch &&
      lotNameMatch &&
      traceWayMatch &&
      disposalMeasureMatch
    );
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

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
  schema: (() => {
    let schema;
    if (props.type === 'trace') {
      schema = useTraceFormSchema();
    } else if (props.type === 'result') {
      schema = useResultFormSchema();
    } else {
      schema = useFormSchema();
    }
    return schema.map((v) => {
      delete v.rules;
      return {
        ...v,
      };
    });
  })(),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  watch: {
    'props.type': {
      handler() {
        let schema;
        if (props.type === 'trace') {
          schema = useTraceFormSchema();
        } else if (props.type === 'result') {
          schema = useResultFormSchema();
        } else {
          schema = useFormSchema();
        }
        QueryForm.setSchema(
          schema.map((v) => {
            delete v.rules;
            return {
              ...v,
            };
          }),
        );
      },
      immediate: true,
    },
  },
});

// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns:
      props.type === 'trace'
        ? useTraceGridColumns()
        : props.type === 'result'
          ? useResultGridColumns()
          : useGridColumns(),
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

// 监听类型变化，更新数据和表格配置
watch(
  () => props.type,
  (newType) => {
    // 更新数据
    updateDataByType();
    // 更新表格列配置
    if (gridApi) {
      let columns;
      if (newType === 'trace') {
        columns = useTraceGridColumns();
      } else if (newType === 'result') {
        columns = useResultGridColumns();
      } else {
        columns = useGridColumns();
      }
      gridApi.setColumns(columns);
      gridApi.query();
    }
  },
  { immediate: false },
);

const activeName = ref('全部');
// 筛选相关的ref变量
const filterCarNumber = ref(''); // 车牌号码筛选
const filterLotName = ref(''); // 所属车场筛选
const filterTraceWay = ref(''); // 追缴方式筛选
const filterDisposalMeasure = ref(''); // 处理措施筛选

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 根据当前标签页类型获取标签数据
const tabsData = computed(() => {
  if (props.type === 'trace') {
    return [
      { label: '全部' },
      { label: '成功' },
      { label: '失败' },
      { label: '待处理' },
      { label: '已结案' },
    ];
  } else if (props.type === 'result') {
    return [
      { label: '全部' },
      { label: '已完成' },
      { label: '跟踪中' },
      { label: '待处理' },
    ];
  } else {
    return [
      { label: '全部' },
      { label: '未追缴' },
      { label: '已追缴' },
      { label: '追缴中' },
      { label: '已核销' },
    ];
  }
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (props.type === 'trace') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '失败': {
        // 统计失败的数据
        count = dataObj.apilist.filter((v) => v.traceResult === '失败').length;
        break;
      }
      case '已结案': {
        // 统计已结案的数据
        count = dataObj.apilist.filter(
          (v) => v.traceResult === '已结案',
        ).length;
        break;
      }
      case '待处理': {
        // 统计待处理的数据
        count = dataObj.apilist.filter(
          (v) => v.traceResult === '待处理',
        ).length;
        break;
      }
      case '成功': {
        // 统计成功的数据
        count = dataObj.apilist.filter((v) => v.traceResult === '成功').length;
        break;
      }
      // No default
    }
  } else if (props.type === 'result') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '已完成': {
        // 统计已完成的数据
        count = dataObj.apilist.filter(
          (v) => v.followStatus === '已完成',
        ).length;
        break;
      }
      case '待处理': {
        // 统计待处理的数据
        count = dataObj.apilist.filter(
          (v) => v.followStatus === '待处理',
        ).length;
        break;
      }
      case '跟踪中': {
        // 统计跟踪中的数据
        count = dataObj.apilist.filter(
          (v) => v.followStatus === '跟踪中',
        ).length;
        break;
      }
      // No default
    }
  } else {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '已核销': {
        // 统计已核销的数据
        count = dataObj.apilist.filter(
          (v) => v.arrearsStatus === '已核销',
        ).length;
        break;
      }
      case '已追缴': {
        // 统计已追缴的数据
        count = dataObj.apilist.filter(
          (v) => v.arrearsStatus === '已追缴',
        ).length;
        break;
      }
      case '未追缴': {
        // 统计未追缴的数据
        count = dataObj.apilist.filter(
          (v) => v.arrearsStatus === '未追缴',
        ).length;
        break;
      }
      case '追缴中': {
        // 统计追缴中的数据
        count = dataObj.apilist.filter(
          (v) => v.arrearsStatus === '追缴中',
        ).length;
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

// 处理车牌号码点击筛选
const handleCarNumberClick = (carNumber) => {
  filterCarNumber.value = filterCarNumber.value === carNumber ? '' : carNumber;
  gridApi.query();
};

// 取消车牌号码筛选
const handleCancelCarNumberFilter = () => {
  filterCarNumber.value = '';
  gridApi.query();
};

// 处理所属车场点击筛选
const handleLotNameClick = (lotName) => {
  filterLotName.value = filterLotName.value === lotName ? '' : lotName;
  gridApi.query();
};

// 取消所属车场筛选
const handleCancelLotNameFilter = () => {
  filterLotName.value = '';
  gridApi.query();
};

// 处理追缴方式点击筛选
const handleTraceWayClick = (traceWay) => {
  filterTraceWay.value = filterTraceWay.value === traceWay ? '' : traceWay;
  gridApi.query();
};

// 取消追缴方式筛选
const handleCancelTraceWayFilter = () => {
  filterTraceWay.value = '';
  gridApi.query();
};

// 处理处理措施点击筛选
const handleDisposalMeasureClick = (disposalMeasure) => {
  filterDisposalMeasure.value =
    filterDisposalMeasure.value === disposalMeasure ? '' : disposalMeasure;
  gridApi.query();
};

// 取消处理措施筛选
const handleCancelDisposalMeasureFilter = () => {
  filterDisposalMeasure.value = '';
  gridApi.query();
};

// 欠费记录管理 - 追缴按钮处理
const [TraceDrawer, traceDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '选择追缴方式',
  onCancel() {
    traceDrawerApi.close();
  },
  onConfirm() {
    const obj = traceFormApi.form.values;
    // 发起追缴逻辑
    ElMessage.success('追缴已发起');
    traceDrawerApi.close();
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      traceFormApi.resetForm();
    }
  },
});

// 追缴方式表单
const [TraceForm, traceFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'traceWay',
      label: '追缴方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择追缴方式',
        options: [
          { label: '电话追缴', value: '电话追缴' },
          { label: '短信追缴', value: '短信追缴' },
          { label: '现场追缴', value: '现场追缴' },
        ],
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const handleTrace = (row) => {
  traceDrawerApi
    .setData({
      title: '选择追缴方式',
      ...row,
    })
    .open();
};

// 欠费记录管理 - 核销按钮处理
const handleWriteOff = (row) => {
  confirm($t('确定要核销这条欠费记录吗？'))
    .then(() => {
      // 更新欠费状态为已核销
      const index = dataObj.apilist.findIndex((v) => v.id === row.id);
      if (index !== -1) {
        dataObj.apilist[index].arrearsStatus = '已核销';
      }
      ElMessage.success('核销成功');
      handleRefresh();
    })
    .catch(() => {
      // 取消核销
    });
};

// 追缴方式管理 - 跟踪按钮处理
const [TraceUpdateDrawer, traceUpdateDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '更新追缴进度',
  onCancel() {
    traceUpdateDrawerApi.close();
  },
  onConfirm() {
    const obj = traceUpdateFormApi.form.values;
    // 更新追缴进度逻辑
    ElMessage.success('追缴进度已更新');
    traceUpdateDrawerApi.close();
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      traceUpdateFormApi.resetForm();
    }
  },
});

// 追缴进度更新表单
const [TraceUpdateForm, traceUpdateFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'traceResult',
      label: '追缴结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择追缴结果',
        options: [
          { label: '成功', value: '成功' },
          { label: '失败', value: '失败' },
          { label: '待处理', value: '待处理' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'traceRemark',
      label: '追缴备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入追缴备注',
        type: 'textarea',
      },
    },
  ],
  showDefaultActions: false,
});

const handleTraceUpdate = (row) => {
  traceUpdateDrawerApi
    .setData({
      title: '更新追缴进度',
      ...row,
    })
    .open();
};

// 追缴方式管理 - 结案按钮处理
const handleCloseCase = (row) => {
  confirm($t('确定要结案吗？'))
    .then(() => {
      // 标记为已结案
      const index = dataObj.apilist.findIndex((v) => v.id === row.id);
      if (index !== -1) {
        dataObj.apilist[index].traceResult = '已结案';
      }
      ElMessage.success('已结案');
      handleRefresh();
    })
    .catch(() => {
      // 取消结案
    });
};

// 追缴结果管理 - 跟踪按钮处理
const [ResultTraceDialog, resultTraceDialogApi] = useVbenDrawer({
  appendToMain: true,
  modal: true,
  title: '填写跟踪备注',
  width: '400px',
  onCancel() {
    resultTraceDialogApi.close();
  },
  onConfirm() {
    const obj = resultTraceFormApi.form.values;
    // 更新跟踪状态逻辑
    ElMessage.success('跟踪备注已提交');
    resultTraceDialogApi.close();
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      resultTraceFormApi.resetForm();
    }
  },
});

// 跟踪备注表单
const [ResultTraceForm, resultTraceFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'traceRemark',
      label: '跟踪备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入跟踪备注（可选）',
        type: 'textarea',
      },
    },
  ],
  showDefaultActions: false,
});

const handleResultTrace = (row) => {
  resultTraceDialogApi
    .setData({
      title: '填写跟踪备注',
      ...row,
    })
    .open();
};

// 追缴结果管理 - 解除按钮处理
const handleRemoveLimit = (row) => {
  confirm($t('确定要解除限制入场措施吗？'))
    .then(() => {
      // 解除限制入场措施
      const index = dataObj.apilist.findIndex((v) => v.id === row.id);
      if (index !== -1) {
        dataObj.apilist[index].limitDuration = '0天';
      }
      ElMessage.success('限制入场措施已解除');
      handleRefresh();
    })
    .catch(() => {
      // 取消解除
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
      :title="`${dataObj.detailObj.arrearsNo}详情`"
      :data="dataObj.detailObj"
      :fields="
        props.type === 'trace'
          ? traceDetailFields
          : props.type === 'result'
            ? resultDetailFields
            : detailFields
      "
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 追缴方式选择抽屉 -->
    <TraceDrawer title="选择追缴方式">
      <TraceForm />
    </TraceDrawer>

    <!-- 追缴进度更新抽屉 -->
    <TraceUpdateDrawer title="更新追缴进度">
      <TraceUpdateForm />
    </TraceUpdateDrawer>

    <!-- 跟踪备注弹窗 -->
    <ResultTraceDialog title="填写跟踪备注">
      <ResultTraceForm />
    </ResultTraceDialog>
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
            v-if="filterCarNumber"
            type="primary"
            closable
            @close="handleCancelCarNumberFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车牌号码：{{ filterCarNumber }}
          </el-tag>
          <el-tag
            v-if="filterLotName"
            type="success"
            closable
            @close="handleCancelLotNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属车场：{{ filterLotName }}
          </el-tag>
          <el-tag
            v-if="filterTraceWay"
            type="warning"
            closable
            @close="handleCancelTraceWayFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            追缴方式：{{ filterTraceWay }}
          </el-tag>
          <el-tag
            v-if="filterDisposalMeasure"
            type="primary"
            closable
            @close="handleCancelDisposalMeasureFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            处理措施：{{ filterDisposalMeasure }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
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
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮（所有标签页都有） -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />

          <!-- 欠费记录管理标签页按钮 -->
          <template v-if="props.type === 'arrears'">
            <IconButton
              content="追缴"
              icon-name="Money"
              @click="handleTrace(row)"
            />
            <IconButton
              content="核销"
              icon-name="DocumentChecked"
              @click="handleWriteOff(row)"
            />
          </template>

          <!-- 追缴方式管理标签页按钮 -->
          <template v-else-if="props.type === 'trace'">
            <IconButton
              content="跟踪"
              icon-name="Operation"
              @click="handleTraceUpdate(row)"
            />
            <IconButton
              content="结案"
              icon-name="CircleCheck"
              @click="handleCloseCase(row)"
            />
          </template>

          <!-- 追缴结果管理标签页按钮 -->
          <template v-else-if="props.type === 'result'">
            <IconButton
              content="跟踪"
              icon-name="Operation"
              @click="handleResultTrace(row)"
            />
            <IconButton
              content="解除"
              icon-name="Remove"
              @click="handleRemoveLimit(row)"
            />
          </template>
        </div>
      </template>
      <template #arrearsStatus="{ row }">
        <el-tag :type="statusTagType[row.arrearsStatus]">
          {{ row.arrearsStatus }}
        </el-tag>
      </template>
      <template #arrearsNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.arrearsNo }}
        </el-text>
      </template>
      <template #traceResult="{ row }">
        <el-tag :type="traceStatusTagType[row.traceResult]">
          {{ row.traceResult }}
        </el-tag>
      </template>
      <template #followStatus="{ row }">
        <el-tag :type="resultStatusTagType[row.followStatus]">
          {{ row.followStatus }}
        </el-tag>
      </template>

      <!-- 车牌号码插槽 -->
      <template #carNumber="{ row }">
        <el-text
          @click="handleCarNumberClick(row.carNumber)"
          class="common-align"
          type="primary"
        >
          {{ row.carNumber }}
        </el-text>
      </template>

      <!-- 所属车场插槽 -->
      <template #lotName="{ row }">
        <el-text
          @click="handleLotNameClick(row.lotName)"
          class="common-align"
          type="primary"
        >
          {{ row.lotName }}
        </el-text>
      </template>

      <!-- 追缴方式插槽 -->
      <template #traceWay="{ row }">
        <el-text
          @click="handleTraceWayClick(row.traceWay)"
          class="common-align"
          type="primary"
        >
          {{ row.traceWay }}
        </el-text>
      </template>

      <!-- 处理措施插槽 -->
      <template #disposalMeasure="{ row }">
        <el-text
          @click="handleDisposalMeasureClick(row.disposalMeasure)"
          class="common-align"
          type="primary"
        >
          {{ row.disposalMeasure }}
        </el-text>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span v-if="props.type === 'trace'">
            本页统计：追缴记录: {{ dataObj.list.length }}; 成功:
            {{ dataObj.list.filter((v) => v.traceResult === '成功').length }};
            失败:
            {{ dataObj.list.filter((v) => v.traceResult === '失败').length }};
            待处理:
            {{ dataObj.list.filter((v) => v.traceResult === '待处理').length }};
            已结案:
            {{ dataObj.list.filter((v) => v.traceResult === '已结案').length }}
          </span>
          <span v-else-if="props.type === 'result'">
            本页统计：追缴结果: {{ dataObj.list.length }}; 已完成:
            {{
              dataObj.list.filter((v) => v.followStatus === '已完成').length
            }}; 跟踪中:
            {{
              dataObj.list.filter((v) => v.followStatus === '跟踪中').length
            }}; 待处理:
            {{ dataObj.list.filter((v) => v.followStatus === '待处理').length }}
          </span>
          <span v-else>
            本页统计：欠费记录: {{ dataObj.list.length }}; 未追缴:
            {{
              dataObj.list.filter((v) => v.arrearsStatus === '未追缴').length
            }}; 已追缴:
            {{
              dataObj.list.filter((v) => v.arrearsStatus === '已追缴').length
            }}; 追缴中:
            {{
              dataObj.list.filter((v) => v.arrearsStatus === '追缴中').length
            }}; 已核销:
            {{
              dataObj.list.filter((v) => v.arrearsStatus === '已核销').length
            }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ currentTextObj.value.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
